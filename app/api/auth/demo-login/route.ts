import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { signAccessToken } from "@/lib/auth";
import { dbStore } from "@/lib/db-store";

const schema = z.object({
  roleSlug: z.enum(["super-admin", "admin", "team-leader", "trainer", "member"])
});

const roleMap: Record<string, string> = {
  "super-admin": "SUPER_ADMIN",
  admin: "ADMIN",
  "team-leader": "TEAM_LEADER",
  trainer: "TRAINER",
  member: "MEMBER"
};

// Only enabled outside production to prevent abuse
export async function POST(request: NextRequest) {
  if (process.env.NODE_ENV === "production" && !process.env.DEMO_MODE_ENABLED) {
    return NextResponse.json({ error: { message: "Demo mode not available" } }, { status: 403 });
  }

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: { message: "Invalid role" } }, { status: 400 });
  }

  const { roleSlug } = parsed.data;
  const role = roleMap[roleSlug] ?? "MEMBER";

  // Try to find the demo user from dbStore, fall back to synthetic user
  const email = `${roleSlug}@myupline.demo`;
  const dbUser = dbStore.findUserByEmail(email) || dbStore.findUserByEmail(email.replace("-", ""));

  const userId = dbUser?.id ?? `usr-demo-${roleSlug}`;
  const orgId = dbUser?.organizationId ?? "org-default-01";

  const accessToken = signAccessToken({
    sub: userId,
    email,
    role: role as any,
    organizationId: orgId
  });

  const user = {
    id: userId,
    email,
    name: `Demo ${roleSlug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}`,
    phone: "+251 911 000 000",
    role,
    organizationId: orgId,
    emailVerified: true,
    profileSetupCompleted: true
  };

  const response = NextResponse.json({ data: { user, accessToken } });

  // Set proper HttpOnly session cookie so middleware can validate
  response.cookies.set("myupline_session", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 // 1 hour
  });

  return response;
}
