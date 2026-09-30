import { z } from "zod";
import { ok, problem, created, validationProblem } from "@/lib/api-response";
import { dbStore } from "@/lib/db-store";

const createSchema = z.object({
  name: z.string().min(2, "Package name is required"),
  priceETB: z.number().min(0, "Price must be positive"),
  pv: z.number().min(0, "PV must be positive"),
  badge: z.string().optional(),
  description: z.string().min(5, "Description is required"),
  features: z.array(z.string()).optional()
});

const updateSchema = z.object({
  id: z.string().min(1, "Package ID is required"),
  name: z.string().optional(),
  priceETB: z.number().optional(),
  pv: z.number().optional(),
  badge: z.string().optional(),
  description: z.string().optional(),
  features: z.array(z.string()).optional(),
  isActive: z.boolean().optional()
});

export async function GET() {
  const packages = dbStore.getAllPackages();
  return ok({ packages });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = createSchema.safeParse(body);
    if (!parsed.success) return validationProblem(parsed.error);

    const createdPkg = dbStore.createPackage({
      name: parsed.data.name,
      priceETB: parsed.data.priceETB,
      pv: parsed.data.pv,
      badge: parsed.data.badge,
      description: parsed.data.description,
      features: parsed.data.features
    });

    return created({ package: createdPkg });
  } catch {
    return problem(500, "Failed to create package");
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) return validationProblem(parsed.error);

    const { id, ...updates } = parsed.data;
    const updated = dbStore.updatePackage(id, updates);
    if (!updated) return problem(404, "Package not found");

    return ok({ package: updated });
  } catch {
    return problem(500, "Failed to update package");
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return problem(400, "Missing package ID");

    const deleted = dbStore.deletePackage(id);
    if (!deleted) return problem(404, "Package not found");

    return ok({ message: "Package deleted successfully" });
  } catch {
    return problem(500, "Failed to delete package");
  }
}
