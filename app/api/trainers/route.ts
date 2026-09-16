import { NextResponse } from "next/server";
import { z } from "zod";
import { ok, problem, created, validationProblem } from "@/lib/api-response";
import { dbStore } from "@/lib/db-store";

const createTrainerSchema = z.object({
  name: z.string().min(2, "Trainer name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(6, "Phone number is required"),
  specialization: z.string().min(3, "Specialization is required"),
  bio: z.string().min(5, "Bio is required"),
  teamAssigned: z.string().optional(),
  assignedTrainings: z.array(z.string()).optional(),
  password: z.string().min(6, "Password must be at least 6 characters").optional()
});

const updateTrainerSchema = z.object({
  id: z.string().min(1, "Trainer ID is required"),
  name: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  specialization: z.string().optional(),
  bio: z.string().optional(),
  isActive: z.boolean().optional(),
  teamAssigned: z.string().optional(),
  assignedTrainings: z.array(z.string()).optional(),
  password: z.string().min(6).optional()
});

const assignTrainerSchema = z.object({
  trainerId: z.string().min(1, "Trainer ID is required"),
  teamName: z.string().optional(),
  trainingIds: z.array(z.string()).optional(),
  trainingId: z.string().optional() // backwards compatibility
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const onlyActive = searchParams.get("active") === "true";
  const trainers = dbStore.getAllTrainers(onlyActive);
  return ok({ trainers });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = createTrainerSchema.safeParse(body);
    if (!parsed.success) return validationProblem(parsed.error);

    const createdTrainer = dbStore.createTrainer(parsed.data);
    return created({
      trainer: createdTrainer,
      credentials: {
        email: createdTrainer.email,
        password: createdTrainer.rawPassword,
        role: "TRAINER"
      }
    });
  } catch (error) {
    return problem(500, "Failed to create trainer profile");
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const parsed = updateTrainerSchema.safeParse(body);
    if (!parsed.success) return validationProblem(parsed.error);

    const { id, ...updates } = parsed.data;
    const updated = dbStore.updateTrainer(id, updates);
    if (!updated) return problem(404, "Trainer profile not found");

    return ok({
      trainer: updated,
      credentials: {
        email: updated.email,
        password: updated.rawPassword,
        role: "TRAINER"
      }
    });
  } catch (error) {
    return problem(500, "Failed to update trainer profile");
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const parsed = assignTrainerSchema.safeParse(body);
    if (!parsed.success) return validationProblem(parsed.error);

    const { trainerId, teamName, trainingIds, trainingId } = parsed.data;
    const finalTrainingIds = trainingIds || (trainingId ? [trainingId] : undefined);

    const assigned = dbStore.assignTrainerToTeamAndTraining(trainerId, teamName, finalTrainingIds);
    if (!assigned) return problem(404, "Trainer not found");

    return ok({
      trainer: assigned,
      message: "Trainer assigned to team and training courses successfully"
    });
  } catch (error) {
    return problem(500, "Failed to assign trainer");
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return problem(400, "Missing trainer ID");

    const deleted = dbStore.deleteTrainer(id);
    if (!deleted) return problem(404, "Trainer profile not found");

    return ok({ message: "Trainer removed successfully" });
  } catch (error) {
    return problem(500, "Failed to delete trainer");
  }
}
