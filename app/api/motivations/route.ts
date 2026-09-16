import { z } from "zod";
import { NextRequest } from "next/server";
import { ok, created, notFound, validationProblem, serverError } from "@/lib/api-response";
import { dbStore } from "@/lib/db-store";

const motivationSchema = z.object({
  title: z.string().min(3, "Title is required"),
  quote: z.string().min(10, "Quote must be at least 10 characters"),
  author: z.string().min(2, "Author name is required"),
  authorRole: z.string().optional(),
  category: z.enum([
    "Leadership",
    "Perseverance",
    "Vision",
    "Teamwork",
    "Action",
    "Duplication",
    "Mindset"
  ]).optional().default("Leadership"),
  amharicTranslation: z.string().optional(),
  mediaUrl: z.string().optional(),
  targetType: z.enum(["ALL", "TEAM", "RANK", "SINGLE"]).default("ALL"),
  targetTeam: z.string().optional(),
  targetRank: z.string().optional(),
  targetUserId: z.string().optional(),
  targetUserName: z.string().optional(),
  deliveryChannel: z.enum(["DASHBOARD", "SMS_SIMULATED", "IN_APP_POPUP", "ALL"]).optional().default("ALL"),
  status: z.enum(["SENT", "SCHEDULED", "DRAFT"]).optional().default("SENT"),
  scheduledFor: z.string().optional(),
  sentBy: z.string().optional().default("Super Admin")
});

const updateMotivationSchema = motivationSchema.partial().extend({
  id: z.string().min(1, "Motivation ID is required for updates")
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const targetType = searchParams.get("targetType") || undefined;
    const status = searchParams.get("status") || undefined;
    const userId = searchParams.get("userId") || undefined;
    const userRank = searchParams.get("userRank") || undefined;
    const userTeam = searchParams.get("userTeam") || undefined;

    const motivations = dbStore.getAllMotivations({
      targetType,
      status,
      userId,
      userRank,
      userTeam
    });

    return ok({
      motivations,
      total: motivations.length,
      sentCount: motivations.filter((m) => m.status === "SENT").length,
      scheduledCount: motivations.filter((m) => m.status === "SCHEDULED").length,
      draftCount: motivations.filter((m) => m.status === "DRAFT").length
    });
  } catch (err) {
    return serverError("Failed to fetch motivations");
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = motivationSchema.safeParse(body);
    if (!parsed.success) return validationProblem(parsed.error);

    const motivation = dbStore.createMotivation(parsed.data);
    return created({ motivation });
  } catch (err) {
    return serverError("Failed to create motivation");
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    // Check if it's an instant "sendNow" action
    if (body.action === "sendNow" && body.id) {
      const sent = dbStore.sendMotivationNow(body.id);
      if (!sent) return notFound("Motivation not found");
      return ok({ motivation: sent, message: "Motivation dispatched immediately" });
    }

    const parsed = updateMotivationSchema.safeParse(body);
    if (!parsed.success) return validationProblem(parsed.error);

    const { id, ...updates } = parsed.data;
    const motivation = dbStore.updateMotivation(id, updates);
    if (!motivation) return notFound("Motivation not found");
    return ok({ motivation });
  } catch (err) {
    return serverError("Failed to update motivation");
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return validationProblem({ message: "Motivation ID is required" });

    const deleted = dbStore.deleteMotivation(id);
    if (!deleted) return notFound("Motivation not found");
    return ok({ message: "Daily motivation removed successfully" });
  } catch (err) {
    return serverError("Failed to delete motivation");
  }
}
