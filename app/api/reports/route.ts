import { ok } from "@/lib/api-response";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") ?? "membership";

  return ok({
    type,
    generatedAt: new Date().toISOString(),
    metrics: {
      members: 12458,
      referrals: 3256,
      courseCompletions: 128,
      activeSubscriptions: 8642
    },
    trend: [38, 45, 52, 62, 70, 76, 88, 96]
  });
}
