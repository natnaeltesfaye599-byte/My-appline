import { z } from "zod";
import { created, ok, validationProblem } from "@/lib/api-response";

const verificationSchema = z.object({
  memberId: z.string(),
  planId: z.string(),
  amount: z.number().positive(),
  transactionReference: z.string().min(4)
});

export async function GET() {
  return ok({
    subscriptions: [
      {
        id: "sub_001",
        member: "Mulgeta Desta",
        plan: "Silver",
        status: "ACTIVE",
        expiresAt: "2026-06-30"
      }
    ],
    summary: { active: 8642, pending: 1019, expired: 1524 }
  });
}

export async function POST(request: Request) {
  const parsed = verificationSchema.safeParse(await request.json());
  if (!parsed.success) return validationProblem(parsed.error);

  return created({
    id: crypto.randomUUID(),
    status: "PENDING_VERIFICATION",
    ...parsed.data
  });
}
