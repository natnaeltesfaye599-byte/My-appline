import { z } from "zod";
import { ok, problem, validationProblem } from "@/lib/api-response";
import { hashPassword, hashToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  token: z.string().min(20),
  password: z.string().min(8)
});

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return validationProblem(parsed.error);

  const tokenHash = hashToken(parsed.data.token);
  const token = await prisma.authToken.findUnique({
    where: { tokenHash },
    include: { user: true }
  });

  if (
    !token ||
    token.type !== "PASSWORD_RESET" ||
    token.consumedAt ||
    token.expiresAt < new Date()
  ) {
    return problem(400, "Reset link is invalid or expired");
  }

  await prisma.$transaction([
    prisma.user.update({
      where: { id: token.userId },
      data: { passwordHash: await hashPassword(parsed.data.password) }
    }),
    prisma.authToken.update({
      where: { id: token.id },
      data: { consumedAt: new Date() }
    })
  ]);

  return ok({ message: "Password reset successful" });
}
