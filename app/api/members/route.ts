import { NextRequest } from "next/server";
import { z } from "zod";
import { ok, problem, created, validationProblem, notFound } from "@/lib/api-response";
import { dbStore } from "@/lib/db-store";

const createMemberSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(6, "Phone number is required"),
  role: z.enum(["MEMBER", "TEAM_LEADER", "TRAINER", "ADMIN"]).optional().default("MEMBER"),
  rank: z.string().optional().default("Starter IBO"),
  packageType: z.string().optional().default("Bronze Starter"),
  teamName: z.string().optional().default("Addis Pioneers Squad"),
  assignedTrainings: z.array(z.string()).optional().default(["trn-course-01"]),
  password: z.string().min(6, "Password must be at least 6 characters").optional().default("Member@2026"),
  status: z.enum(["ACTIVE", "PENDING_PAYMENT", "SUSPENDED"]).optional().default("ACTIVE")
});

const updateMemberSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  fullName: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  role: z.string().optional(),
  rank: z.string().optional(),
  packageType: z.string().optional(),
  teamName: z.string().optional(),
  assignedTrainings: z.array(z.string()).optional(),
  password: z.string().min(6).optional(),
  status: z.string().optional()
});

const assignMemberSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  teamName: z.string().optional(),
  trainingIds: z.array(z.string()).optional()
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const teamName = searchParams.get("team") || undefined;
    const rank = searchParams.get("rank") || undefined;
    const status = searchParams.get("status") || undefined;
    const query = searchParams.get("q") || undefined;
    const userId = searchParams.get("id");

    if (userId) {
      const member = dbStore.getMemberById(userId);
      if (!member) return notFound("Team member not found");
      return ok({ member });
    }

    const members = dbStore.getAllMembers({ teamName, rank, status, query });

    return ok({
      members,
      total: members.length,
      activeCount: members.filter((m) => m.profile.status === "ACTIVE").length,
      pendingCount: members.filter((m) => m.profile.status === "PENDING_PAYMENT").length
    });
  } catch (error) {
    return problem(500, "Failed to fetch team members");
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = createMemberSchema.safeParse(body);
    if (!parsed.success) return validationProblem(parsed.error);

    const result = dbStore.createMember(parsed.data);

    return created({
      member: result,
      credentials: {
        email: result.user.email,
        password: result.profile.rawPassword,
        role: result.user.role,
        fullName: result.user.fullName
      },
      message: "Team member created and credentials generated successfully"
    });
  } catch (error) {
    return problem(500, "Failed to create team member");
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = updateMemberSchema.safeParse(body);
    if (!parsed.success) return validationProblem(parsed.error);

    const { userId, ...updates } = parsed.data;
    const updated = dbStore.updateMember(userId, updates);
    if (!updated) return notFound("Team member not found");

    return ok({
      member: updated,
      credentials: {
        email: updated.user.email,
        password: updated.profile.rawPassword,
        role: updated.user.role
      },
      message: "Team member profile and credentials updated successfully"
    });
  } catch (error) {
    return problem(500, "Failed to update team member");
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = assignMemberSchema.safeParse(body);
    if (!parsed.success) return validationProblem(parsed.error);

    const { userId, teamName, trainingIds } = parsed.data;
    const assigned = dbStore.assignMemberToTeamAndTraining(userId, teamName, trainingIds);
    if (!assigned) return notFound("Team member not found");

    return ok({
      member: assigned,
      message: "Team member assigned to team and training courses successfully"
    });
  } catch (error) {
    return problem(500, "Failed to assign member to team/training");
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return problem(400, "User ID is required");

    const deleted = dbStore.deleteMember(id);
    if (!deleted) return notFound("Team member not found");

    return ok({ message: "Team member and credentials removed successfully" });
  } catch (error) {
    return problem(500, "Failed to delete team member");
  }
}
