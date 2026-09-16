import { NextResponse } from "next/server";
import { z } from "zod";
import { ok, problem, created, validationProblem } from "@/lib/api-response";
import { dbStore } from "@/lib/db-store";

const createTrainingSchema = z.object({
  title: z.string().min(3, "Training title is required"),
  level: z.enum(["BASIC", "ADVANCED", "SYSTEM", "LEADERSHIP"]),
  category: z.string().min(2, "Category is required"),
  description: z.string().min(5, "Description is required"),
  durationMinutes: z.number().min(1, "Duration must be positive"),
  format: z.enum(["VIDEO", "AUDIO", "PPT", "HYBRID"]),
  mediaUrl: z.string().optional(),
  trainerId: z.string().optional(),
  cohortStartTime: z.string().optional()
});

const updateTrainingSchema = z.object({
  id: z.string().min(1, "Training ID is required"),
  title: z.string().optional(),
  level: z.enum(["BASIC", "ADVANCED", "SYSTEM", "LEADERSHIP"]).optional(),
  category: z.string().optional(),
  description: z.string().optional(),
  durationMinutes: z.number().optional(),
  format: z.enum(["VIDEO", "AUDIO", "PPT", "HYBRID"]).optional(),
  mediaUrl: z.string().optional(),
  trainerId: z.string().optional(),
  cohortStartTime: z.string().optional(),
  isActive: z.boolean().optional()
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const level = searchParams.get("level") || undefined;
  const trainings = dbStore.getAllTrainings(level);
  return ok({ trainings });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = createTrainingSchema.safeParse(body);
    if (!parsed.success) return validationProblem(parsed.error);

    const createdCourse = dbStore.createTraining(parsed.data);
    return created({ training: createdCourse });
  } catch (error) {
    return problem(500, "Failed to create training course");
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const parsed = updateTrainingSchema.safeParse(body);
    if (!parsed.success) return validationProblem(parsed.error);

    const { id, ...updates } = parsed.data;
    const updated = dbStore.updateTraining(id, updates);
    if (!updated) return problem(404, "Training course not found");

    return ok({ training: updated });
  } catch (error) {
    return problem(500, "Failed to update training course");
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return problem(400, "Missing training course ID");

    const deleted = dbStore.deleteTraining(id);
    if (!deleted) return problem(404, "Training course not found");

    return ok({ message: "Training course deleted successfully" });
  } catch (error) {
    return problem(500, "Failed to delete training course");
  }
}
