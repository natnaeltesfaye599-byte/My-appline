import { z } from "zod";
import { NextRequest } from "next/server";
import { ok, validationProblem, serverError } from "@/lib/api-response";

const contactMessageSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Please provide a valid email address"),
  phone: z.string().optional(),
  subject: z.string().min(3, "Subject must be at least 3 characters"),
  message: z.string().min(10, "Message must be at least 10 characters")
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = contactMessageSchema.safeParse(body);
    if (!parsed.success) {
      return validationProblem(parsed.error);
    }

    const inquiry = {
      id: "inq-" + crypto.randomUUID().slice(0, 8),
      ...parsed.data,
      receivedAt: new Date().toISOString(),
      status: "NEW"
    };

    // In a production system, an email or Telegram bot alert would be dispatched.
    // Here we log the inquiry and confirm receipt.
    console.log("[CONTACT_INQUIRY_RECEIVED]:", inquiry);

    return ok({
      success: true,
      message: "Thank you for contacting MyUpline. Our leadership support team will respond within 24 hours.",
      inquiryId: inquiry.id
    });
  } catch {
    return serverError("Failed to submit contact message");
  }
}
