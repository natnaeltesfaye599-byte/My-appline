import { NextRequest, NextResponse } from "next/server";
import { dbStore } from "@/lib/db-store";

function ok(data: unknown, status = 200) {
  return NextResponse.json({ data }, { status });
}

function problem(status: number, message: string) {
  return NextResponse.json({ error: { message } }, { status });
}

// GET /api/profile?userId=xxx or /api/profile?email=xxx
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const userId = searchParams.get("userId");
    const email = searchParams.get("email");

    const db = dbStore.getDb();
    let targetUser = null;

    if (userId) {
      targetUser = db.users.find((u) => u.id === userId) || null;
    } else if (email) {
      targetUser = dbStore.findUserByEmail(email);
    }

    if (!targetUser) {
      // Default to first user or super-admin
      targetUser = db.users.find((u) => u.role === "SUPER_ADMIN") || db.users[0] || null;
    }

    if (!targetUser) {
      return problem(404, "User profile not found");
    }

    const data = dbStore.getProfileWithUser(targetUser.id);
    if (!data) return problem(404, "Profile not found");

    // Calculate live business stats
    const stats = {
      downlineCount: db.users.filter((u) => u.id !== targetUser!.id).length,
      directReferrals: Math.min(12, db.users.length),
      personalPV: data.profile.packageType === "Diamond Leader" ? 500 : data.profile.packageType === "Gold Executive" ? 250 : 100,
      groupPV: 3840,
      assignedTrainingsCount: data.profile.assignedTrainings?.length || 0,
      rank: data.profile.rank || "Starter IBO",
      teamName: data.profile.teamName || "Unassigned Squad"
    };

    return ok({
      user: data.user,
      profile: data.profile,
      stats
    });
  } catch (err) {
    console.error("[GET /api/profile]", err);
    return problem(500, "Failed to load profile");
  }
}

// PUT /api/profile
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, email, ...updates } = body;

    const db = dbStore.getDb();
    let targetUser = null;

    if (userId) {
      targetUser = db.users.find((u) => u.id === userId) || null;
    } else if (email) {
      targetUser = dbStore.findUserByEmail(email);
    }

    if (!targetUser) {
      targetUser = db.users.find((u) => u.role === "SUPER_ADMIN") || db.users[0] || null;
    }

    if (!targetUser) {
      return problem(404, "User profile not found");
    }

    const result = dbStore.updateProfile(targetUser.id, updates);
    if (!result) {
      return problem(500, "Failed to update profile");
    }

    return ok({
      user: result.user,
      profile: result.profile,
      message: "Profile updated successfully!"
    });
  } catch (err) {
    console.error("[PUT /api/profile]", err);
    return problem(500, "Failed to update profile");
  }
}
