import { z } from "zod";
import { ok, problem, validationProblem } from "@/lib/api-response";
import { hashToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  token: z.string().min(20)
});

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return validationProblem(parsed.error);

  const token = await prisma.authToken.findUnique({
    where: { tokenHash: hashToken(parsed.data.token) }
  });

  if (
    !token ||
    token.type !== "EMAIL_VERIFICATION" ||
    token.consumedAt ||
    token.expiresAt < new Date()
  ) {
    return problem(400, "Verification link is invalid or expired");
  }

  await prisma.$transaction([
    prisma.user.update({
      where: { id: token.userId },
      data: { emailVerifiedAt: new Date() }
    }),
    prisma.authToken.update({
      where: { id: token.id },
      data: { consumedAt: new Date() }
    })
  ]);

  return ok({ message: "Email verified successfully" });
}
