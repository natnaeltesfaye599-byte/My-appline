import { NextResponse } from "next/server";
import { z } from "zod";
import { ok, problem, created, validationProblem } from "@/lib/api-response";
import { dbStore } from "@/lib/db-store";

const paymentSubmissionSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  userName: z.string().min(1, "User Name is required"),
  userEmail: z.string().email("Valid email is required"),
  userPhone: z.string().min(6, "Phone number is required"),
  packageId: z.string().min(1, "Package ID is required"),
  packageName: z.string().min(1, "Package Name is required"),
  amountETB: z.number().min(0, "Amount must be positive"),
  paymentMethod: z.string().min(1, "Payment method is required"),
  transactionRef: z.string().min(3, "Transaction reference is required"),
  receiptScreenshotUrl: z.string().min(1, "Receipt screenshot is required")
});

const paymentReviewSchema = z.object({
  paymentId: z.string().min(1, "Payment ID is required"),
  action: z.enum(["approve", "reject"]),
  adminNotes: z.string().optional(),
  verifiedBy: z.string().optional()
});

export async function GET() {
  const payments = dbStore.getAllPayments();
  return ok({ payments });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = paymentSubmissionSchema.safeParse(body);
    if (!parsed.success) return validationProblem(parsed.error);

    const submission = dbStore.createPaymentSubmission(parsed.data);
    return created({ payment: submission });
  } catch (error) {
    return problem(500, "Failed to submit manual payment verification");
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const parsed = paymentReviewSchema.safeParse(body);
    if (!parsed.success) return validationProblem(parsed.error);

    const { paymentId, action, adminNotes, verifiedBy } = parsed.data;

    if (action === "approve") {
      const approved = dbStore.approvePayment(paymentId, adminNotes, verifiedBy || "Super Admin");
      if (!approved) return problem(404, "Payment record not found");
      return ok({ payment: approved, message: "Payment approved and user membership activated!" });
    } else {
      const rejected = dbStore.rejectPayment(paymentId, adminNotes, verifiedBy || "Super Admin");
      if (!rejected) return problem(404, "Payment record not found");
      return ok({ payment: rejected, message: "Payment rejected" });
    }
  } catch (error) {
    return problem(500, "Failed to process payment review");
  }
}
