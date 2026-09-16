import { z } from "zod";
import { ok, validationProblem } from "@/lib/api-response";
import { generateRawToken, hashToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  email: z.string().email()
});

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return validationProblem(parsed.error);

  const user = await prisma.user.findUnique({
    where: { email: parsed.data.email.toLowerCase() }
  });
  let resetUrl: string | undefined;

  if (user) {
    const rawToken = generateRawToken();
    resetUrl = `/en/auth/reset-password?token=${rawToken}`;
    await prisma.authToken.create({
      data: {
        userId: user.id,
        type: "PASSWORD_RESET",
        tokenHash: hashToken(rawToken),
        expiresAt: new Date(Date.now() + 1000 * 60 * 30)
      }
    });
  }

  return ok({
    message: "If an account exists, a password reset link will be sent.",
    resetUrl: process.env.NODE_ENV === "production" ? undefined : resetUrl
  });
}
