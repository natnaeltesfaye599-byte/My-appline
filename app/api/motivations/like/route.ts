import { NextRequest } from "next/server";
import { ok, notFound, validationProblem, serverError } from "@/lib/api-response";
import { dbStore } from "@/lib/db-store";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const id = body.id;
    if (!id) return validationProblem({ message: "Motivation ID is required" });

    const updated = dbStore.likeMotivation(id);
    if (!updated) return notFound("Motivation not found");
    return ok({ motivation: updated, likes: updated.likesCount });
  } catch (err) {
    return serverError("Failed to record like");
  }
}
