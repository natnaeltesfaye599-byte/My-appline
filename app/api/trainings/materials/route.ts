import { NextResponse } from "next/server";
import { z } from "zod";
import { ok, problem, created, validationProblem } from "@/lib/api-response";
import { dbStore } from "@/lib/db-store";

const addMaterialSchema = z.object({
  trainingId: z.string().min(1, "Training course ID is required"),
  name: z.string().min(2, "Material name is required"),
  type: z.enum(["PPT", "PDF", "AUDIO", "VIDEO", "DOC"]),
  fileUrl: z.string().min(1, "File URL or content is required"),
  fileSize: z.string().optional(),
  description: z.string().optional()
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = addMaterialSchema.safeParse(body);
    if (!parsed.success) return validationProblem(parsed.error);

    const { trainingId, ...materialData } = parsed.data;
    const addedMaterial = dbStore.addMaterialToTraining(trainingId, materialData);
    if (!addedMaterial) return problem(404, "Training course not found");

    return created({ material: addedMaterial });
  } catch (error) {
    return problem(500, "Failed to upload/attach training material");
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const trainingId = searchParams.get("trainingId");
    const materialId = searchParams.get("materialId");

    if (!trainingId || !materialId) {
      return problem(400, "Both trainingId and materialId are required");
    }

    const removed = dbStore.removeMaterialFromTraining(trainingId, materialId);
    if (!removed) return problem(404, "Training material not found");

    return ok({ message: "Training material removed successfully" });
  } catch (error) {
    return problem(500, "Failed to delete training material");
  }
}
