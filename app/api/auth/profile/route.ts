import { z } from "zod";
import { ok, validationProblem } from "@/lib/api-response";
import { requireAuth, toPublicUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  phone: z.string().min(7).optional(),
  rank: z.string().optional()
});

export async function POST(request: Request) {
  const auth = await requireAuth(request);
  if ("error" in auth) return auth.error;

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return validationProblem(parsed.error);

  const user = await prisma.user.update({
    where: { id: auth.user.id },
    data: {
      fullName: `${parsed.data.firstName} ${parsed.data.lastName}`,
      profileSetupCompleted: true,
      profile: {
        upsert: {
          create: {
            firstName: parsed.data.firstName,
            lastName: parsed.data.lastName,
            phone: parsed.data.phone,
            rank: parsed.data.rank ?? "Starter",
            status: "ACTIVE",
            referralCode: `MU-${auth.user.id.slice(-6).toUpperCase()}`
          },
          update: {
            firstName: parsed.data.firstName,
            lastName: parsed.data.lastName,
            phone: parsed.data.phone,
            rank: parsed.data.rank ?? "Starter"
          }
        }
      }
    }
  });

  return ok({ user: toPublicUser(user) });
}
