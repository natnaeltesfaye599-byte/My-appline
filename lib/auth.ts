import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { problem } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";

export const roles = [
  "SUPER_ADMIN",
  "ADMIN",
  "TRAINER",
  "TEAM_LEADER",
  "MEMBER"
] as const;

export type Role = (typeof roles)[number];

export type AuthTokenPayload = {
  sub: string;
  email: string;
  role: Role;
  organizationId: string;
};

const jwtSecret = process.env.JWT_SECRET ?? "development-only-secret";

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export function signAccessToken(payload: AuthTokenPayload) {
  return jwt.sign(payload, jwtSecret, { expiresIn: "1h" });
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, jwtSecret) as AuthTokenPayload;
}

export function hasRole(userRole: Role, allowed: Role[]) {
  return allowed.includes(userRole);
}

export function generateRawToken() {
  return crypto.randomBytes(32).toString("base64url");
}

export function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export function getBearerToken(request: Request) {
  const header = request.headers.get("authorization");
  if (!header?.startsWith("Bearer ")) return null;
  return header.slice("Bearer ".length);
}

export async function requireAuth(request: Request, allowedRoles?: Role[]) {
  const token = getBearerToken(request);
  if (!token) {
    return { error: problem(401, "Missing bearer token") };
  }

  try {
    const payload = verifyAccessToken(token);
    if (allowedRoles && !hasRole(payload.role, allowedRoles)) {
      return { error: problem(403, "You do not have permission to perform this action") };
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        email: true,
        role: true,
        organizationId: true,
        emailVerifiedAt: true,
        profileSetupCompleted: true
      }
    });

    if (!user) {
      return { error: problem(401, "User session is no longer valid") };
    }

    return { user };
  } catch {
    return { error: problem(401, "Invalid or expired token") };
  }
}

export function toPublicUser(user: {
  id: string;
  email: string;
  fullName?: string | null;
  role: Role;
  organizationId: string;
  emailVerifiedAt?: Date | null;
  profileSetupCompleted?: boolean;
}) {
  return {
    id: user.id,
    email: user.email,
    name: user.fullName,
    role: user.role,
    organizationId: user.organizationId,
    emailVerified: Boolean(user.emailVerifiedAt),
    profileSetupCompleted: Boolean(user.profileSetupCompleted)
  };
}

export async function getDefaultOrganization() {
  return prisma.organization.upsert({
    where: { slug: "myupline" },
    update: {},
    create: {
      name: "MyUpline",
      slug: "myupline"
    }
  });
}
