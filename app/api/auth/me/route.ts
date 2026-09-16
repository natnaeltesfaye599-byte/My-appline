import { ok } from "@/lib/api-response";
import { requireAuth, toPublicUser } from "@/lib/auth";

export async function GET(request: Request) {
  const auth = await requireAuth(request);
  if ("error" in auth) return auth.error;

  return ok({ user: toPublicUser(auth.user) });
}
