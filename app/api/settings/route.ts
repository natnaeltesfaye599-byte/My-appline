import { NextRequest, NextResponse } from "next/server";
import { dbStore } from "@/lib/db-store";

function ok(data: unknown, status = 200) {
  return NextResponse.json({ data }, { status });
}

function problem(status: number, message: string) {
  return NextResponse.json({ error: { message } }, { status });
}

// GET /api/settings
export async function GET() {
  try {
    const settings = dbStore.getSettings();
    const db = dbStore.getDb();
    const stats = {
      totalUsers: db.users?.length || 0,
      totalTeams: db.teams?.length || 0,
      totalTrainers: db.trainers?.length || 0,
      totalCourses: db.trainings?.length || 0,
      totalMotivations: db.motivations?.length || 0,
      totalBlogPosts: db.blog?.length || 0,
      totalPayments: db.payments?.length || 0
    };
    return ok({ settings, stats });
  } catch (err) {
    console.error("[GET /api/settings]", err);
    return problem(500, "Failed to load settings");
  }
}

// PUT /api/settings
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body || typeof body !== "object") {
      return problem(400, "Invalid settings payload");
    }

    const updated = dbStore.updateSettings(body);
    return ok({ settings: updated, message: "Settings updated successfully" });
  } catch (err) {
    console.error("[PUT /api/settings]", err);
    return problem(500, "Failed to update settings");
  }
}
