import { NextRequest, NextResponse } from "next/server";
import { dbStore } from "@/lib/db-store";

function ok(data: unknown, status = 200) {
  return NextResponse.json({ data }, { status });
}

function problem(status: number, message: string) {
  return NextResponse.json({ error: { message } }, { status });
}

// POST /api/settings/password
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, email, currentPassword, newPassword } = body;

    if (!newPassword || newPassword.length < 6) {
      return problem(400, "New password must be at least 6 characters long.");
    }

    const db = dbStore.getDb();
    let user = null;
    if (userId) {
      user = db.users.find((u) => u.id === userId) || null;
    } else if (email) {
      user = dbStore.findUserByEmail(email);
    }

    if (!user) {
      // Fallback to first super-admin
      user = db.users.find((u) => u.role === "SUPER_ADMIN") || null;
    }

    if (!user) {
      return problem(404, "User account not found.");
    }

    // If current password provided, verify it (demo allows demo-hash or plain match)
    if (currentPassword) {
      const match =
        user.passwordHash === "demo-hash" ||
        user.passwordHash === currentPassword;
      if (!match) {
        return problem(401, "Current password does not match.");
      }
    }

    // Update password using updateMember
    dbStore.updateMember(user.id, {
      password: newPassword
    });

    return ok({ message: "Password updated successfully! Please use your new password next time you sign in." });
  } catch (err) {
    console.error("[POST /api/settings/password]", err);
    return problem(500, "Failed to update password");
  }
}
