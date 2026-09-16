import { z } from "zod";
import { created, ok, validationProblem } from "@/lib/api-response";

const referralSchema = z.object({
  memberId: z.string(),
  leadName: z.string().min(2),
  leadEmail: z.string().email(),
  source: z.enum(["LINK", "CODE", "MANUAL"]).default("MANUAL")
});

export async function GET() {
  return ok({
    referrals: [
      {
        id: "ref_001",
        code: "MU-ALM-2048",
        leadName: "Hana Bekele",
        status: "CONVERTED",
        conversionRate: 57.1
      }
    ],
    analytics: { leads: 3256, conversions: 1856, conversionRate: 56.9 }
  });
}

export async function POST(request: Request) {
  const parsed = referralSchema.safeParse(await request.json());
  if (!parsed.success) return validationProblem(parsed.error);

  return created({
    id: crypto.randomUUID(),
    referralCode: `MU-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
    status: "NEW",
    ...parsed.data
  });
}
