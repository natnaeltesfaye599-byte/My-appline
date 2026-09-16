import { z } from "zod";
import { ok, problem, validationProblem } from "@/lib/api-response";
import { requireAuth, roles, toPublicUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const updateRoleSchema = z.object({
  userId: z.string().min(1),
  role: z.enum(roles)
});

export async function GET(request: Request) {
  const auth = await requireAuth(request, ["SUPER_ADMIN", "ADMIN"]);
  if ("error" in auth) return auth.error;

  const users = await prisma.user.findMany({
    where: { organizationId: auth.user.organizationId },
    orderBy: { createdAt: "desc" },
    take: 100
  });

  return ok({ users: users.map(toPublicUser) });
}

export async function PATCH(request: Request) {
  const auth = await requireAuth(request, ["SUPER_ADMIN"]);
  if ("error" in auth) return auth.error;

  const parsed = updateRoleSchema.safeParse(await request.json());
  if (!parsed.success) return validationProblem(parsed.error);

  const target = await prisma.user.findFirst({
    where: { id: parsed.data.userId, organizationId: auth.user.organizationId }
  });
  if (!target) return problem(404, "User not found");

  const user = await prisma.user.update({
    where: { id: target.id },
    data: { role: parsed.data.role }
  });

  return ok({ user: toPublicUser(user) });
}
