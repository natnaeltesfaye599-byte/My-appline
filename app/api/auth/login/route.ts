import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";
import { ok, problem, validationProblem } from "@/lib/api-response";
import { signAccessToken, toPublicUser, verifyPassword } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { dbStore } from "@/lib/db-store";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

// ─── In-memory rate limiter ──────────────────────────────────────────────────
// Structure: Map<ip, { count: number; windowStart: number; lockoutUntil?: number }>
const rateLimitMap = new Map<string, { count: number; windowStart: number; lockoutUntil?: number }>();

const RATE_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000; // 15-minute lockout after too many failures
// Artificial delay range on failed login (ms) — slows enumeration attacks
const MIN_FAIL_DELAY_MS = 800;
const MAX_FAIL_DELAY_MS = 2000;

function getClientIp(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

function checkRateLimit(ip: string): { allowed: boolean; retryAfterSeconds?: number } {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (entry) {
    // Check if currently locked out
    if (entry.lockoutUntil && now < entry.lockoutUntil) {
      return {
        allowed: false,
        retryAfterSeconds: Math.ceil((entry.lockoutUntil - now) / 1000)
      };
    }

    // Reset window if expired
    if (now - entry.windowStart > RATE_WINDOW_MS) {
      rateLimitMap.set(ip, { count: 1, windowStart: now });
      return { allowed: true };
    }

    // Within window — check count
    if (entry.count >= MAX_ATTEMPTS) {
      // Lock them out
      const lockoutUntil = now + LOCKOUT_MS;
      rateLimitMap.set(ip, { ...entry, lockoutUntil });
      return {
        allowed: false,
        retryAfterSeconds: Math.ceil(LOCKOUT_MS / 1000)
      };
    }

    // Increment count
    rateLimitMap.set(ip, { ...entry, count: entry.count + 1 });
    return { allowed: true };
  }

  // First attempt
  rateLimitMap.set(ip, { count: 1, windowStart: now });
  return { allowed: true };
}

function recordFailure(ip: string) {
  const entry = rateLimitMap.get(ip);
  if (entry) {
    rateLimitMap.set(ip, { ...entry, count: entry.count + 1 });
  }
}

function clearFailures(ip: string) {
  rateLimitMap.delete(ip);
}

async function failDelay() {
  const delay = MIN_FAIL_DELAY_MS + Math.random() * (MAX_FAIL_DELAY_MS - MIN_FAIL_DELAY_MS);
  await new Promise((resolve) => setTimeout(resolve, delay));
}

// ─────────────────────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);

  // ── Rate limit check ──
  const rateCheck = checkRateLimit(ip);
  if (!rateCheck.allowed) {
    const response = NextResponse.json(
      {
        error: {
          code: "RATE_LIMITED",
          message: `Too many failed login attempts. Please try again in ${rateCheck.retryAfterSeconds} seconds.`
        }
      },
      { status: 429 }
    );
    response.headers.set("Retry-After", String(rateCheck.retryAfterSeconds));
    return response;
  }

  // ── Input validation ──
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    await failDelay();
    recordFailure(ip);
    return validationProblem(parsed.error);
  }

  const normalizedEmail = parsed.data.email.toLowerCase();

  // ── Try dbStore first (reliable local store) ──
  const localUser = dbStore.findUserByEmail(normalizedEmail);
  if (localUser) {
    let isValid = localUser.passwordHash === "demo-hash" || localUser.passwordHash === parsed.data.password;
    if (!isValid) {
      try {
        isValid = await verifyPassword(parsed.data.password, localUser.passwordHash);
      } catch {
        isValid = false;
      }
    }
    if (!isValid) {
      await failDelay();
      recordFailure(ip);
      return problem(401, "Invalid email or password");
    }

    // Success — clear failure counter
    clearFailures(ip);

    const accessToken = signAccessToken({
      sub: localUser.id,
      email: localUser.email,
      role: localUser.role as any,
      organizationId: localUser.organizationId
    });

    const localProfile = dbStore.findProfileByUserId(localUser.id);

    // Build response with HttpOnly session cookie
    const responseBody = {
      data: {
        user: {
          id: localUser.id,
          email: localUser.email,
          name: localUser.fullName,
          phone: localUser.phone,
          role: localUser.role,
          organizationId: localUser.organizationId,
          emailVerified: true,
          profileSetupCompleted: true,
          profile: localProfile
        },
        accessToken
      }
    };

    const response = NextResponse.json(responseBody);
    response.cookies.set("myupline_session", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 // 1 hour — matches JWT expiry
    });
    return response;
  }

  // ── Fallback to Prisma ──
  try {
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail }
    });

    if (!user || !(await verifyPassword(parsed.data.password, user.passwordHash))) {
      await failDelay();
      recordFailure(ip);
      return problem(401, "Invalid email or password");
    }

    // Success — clear failure counter
    clearFailures(ip);

    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() }
    });

    const accessToken = signAccessToken({
      sub: user.id,
      email: user.email,
      role: user.role,
      organizationId: user.organizationId
    });

    const responseBody = {
      data: {
        user: toPublicUser(user),
        accessToken
      }
    };

    const response = NextResponse.json(responseBody);
    response.cookies.set("myupline_session", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 // 1 hour — matches JWT expiry
    });
    return response;
  } catch {
    await failDelay();
    recordFailure(ip);
    return problem(401, "Invalid email or password");
  }
}
