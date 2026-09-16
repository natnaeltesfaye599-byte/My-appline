import { NextRequest, NextResponse } from "next/server";
import { dbStore } from "@/lib/db-store";

function ok(data: unknown, status = 200) {
  return NextResponse.json({ data }, { status });
}

function problem(status: number, message: string) {
  return NextResponse.json({ error: { message } }, { status });
}

// GET /api/teams                   → all teams
// GET /api/teams?id=team-xxx       → single team
// GET /api/teams?id=team-xxx&members=true → team + members
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const id = searchParams.get("id");
    const withMembers = searchParams.get("members") === "true";

    if (id) {
      const team = dbStore.getTeamById(id);
      if (!team) return problem(404, "Team not found");
      if (withMembers) {
        const members = dbStore.getTeamMembers(id);
        return ok({ team, members });
      }
      return ok({ team });
    }

    const teams = dbStore.getAllTeams();
    return ok({ teams, total: teams.length });
  } catch (err) {
    console.error("[GET /api/teams]", err);
    return problem(500, "Failed to fetch teams");
  }
}

// POST /api/teams → create team
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, description, leaderId, leaderName, leaderEmail, color, region } = body;

    if (!name?.trim()) return problem(400, "Team name is required");

    const team = dbStore.createTeam({ name, description, leaderId, leaderName, leaderEmail, color, region });
    return ok({ team }, 201);
  } catch (err) {
    console.error("[POST /api/teams]", err);
    return problem(500, "Failed to create team");
  }
}

// PUT /api/teams → update team
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...updates } = body;
    if (!id) return problem(400, "Team id is required");

    const team = dbStore.updateTeam(id, updates);
    if (!team) return problem(404, "Team not found");
    return ok({ team });
  } catch (err) {
    console.error("[PUT /api/teams]", err);
    return problem(500, "Failed to update team");
  }
}

// PATCH /api/teams → add or remove member
// body: { action: "add_member"|"remove_member", teamId, userId }
// body: { action: "set_leader", teamId, leaderId, leaderName, leaderEmail }
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, teamId, userId, leaderId, leaderName, leaderEmail } = body;

    if (!teamId) return problem(400, "teamId is required");

    if (action === "add_member") {
      if (!userId) return problem(400, "userId is required");
      const team = dbStore.addMemberToTeam(teamId, userId);
      if (!team) return problem(404, "Team not found");
      return ok({ team, message: "Member added to team" });
    }

    if (action === "remove_member") {
      if (!userId) return problem(400, "userId is required");
      const team = dbStore.removeMemberFromTeam(teamId, userId);
      if (!team) return problem(404, "Team not found");
      return ok({ team, message: "Member removed from team" });
    }

    if (action === "set_leader") {
      const team = dbStore.updateTeam(teamId, { leaderId, leaderName, leaderEmail });
      if (!team) return problem(404, "Team not found");
      return ok({ team, message: "Team leader updated" });
    }

    return problem(400, `Unknown action: ${action}`);
  } catch (err) {
    console.error("[PATCH /api/teams]", err);
    return problem(500, "Failed to update team");
  }
}

// DELETE /api/teams?id=team-xxx
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const id = searchParams.get("id");
    if (!id) return problem(400, "Team id is required");

    const deleted = dbStore.deleteTeam(id);
    if (!deleted) return problem(404, "Team not found");
    return ok({ message: "Team deleted successfully" });
  } catch (err) {
    console.error("[DELETE /api/teams]", err);
    return problem(500, "Failed to delete team");
  }
}
