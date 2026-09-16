import { NextResponse } from "next/server";
import { z } from "zod";
import { ok, problem, created, validationProblem } from "@/lib/api-response";
import { dbStore } from "@/lib/db-store";

const createPaymentMethodSchema = z.object({
  name: z.string().min(2, "Method or Bank name is required"),
  accountName: z.string().min(2, "Account or Beneficiary name is required"),
  accountNumber: z.string().min(3, "Account number is required"),
  type: z.enum(["BANK", "MOBILE_MONEY", "CRYPTO", "CASH"]).optional(),
  instructions: z.string().optional()
});

const updatePaymentMethodSchema = z.object({
  id: z.string().min(1, "Payment method ID is required"),
  name: z.string().optional(),
  accountName: z.string().optional(),
  accountNumber: z.string().optional(),
  type: z.enum(["BANK", "MOBILE_MONEY", "CRYPTO", "CASH"]).optional(),
  instructions: z.string().optional(),
  isActive: z.boolean().optional()
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const onlyActive = searchParams.get("active") === "true";
  const methods = dbStore.getAllPaymentMethods(onlyActive);
  return ok({ paymentMethods: methods });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = createPaymentMethodSchema.safeParse(body);
    if (!parsed.success) return validationProblem(parsed.error);

    const createdMethod = dbStore.createPaymentMethod(parsed.data);
    return created({ paymentMethod: createdMethod });
  } catch (error) {
    return problem(500, "Failed to create payment method account");
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const parsed = updatePaymentMethodSchema.safeParse(body);
    if (!parsed.success) return validationProblem(parsed.error);

    const { id, ...updates } = parsed.data;
    const updated = dbStore.updatePaymentMethod(id, updates);
    if (!updated) return problem(404, "Payment method account not found");

    return ok({ paymentMethod: updated });
  } catch (error) {
    return problem(500, "Failed to update payment method account");
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return problem(400, "Missing payment method ID");

    const deleted = dbStore.deletePaymentMethod(id);
    if (!deleted) return problem(404, "Payment method account not found");

    return ok({ message: "Payment method account deleted successfully" });
  } catch (error) {
    return problem(500, "Failed to delete payment method account");
  }
}
