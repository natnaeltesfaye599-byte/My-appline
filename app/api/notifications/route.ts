import { NextResponse } from "next/server";
import { dbStore } from "@/lib/db-store";
import { verifyAccessToken } from "@/lib/auth";
import { SystemRole } from "@/lib/rbac";

function resolveUser(request: Request): { userId?: string; role: SystemRole } {
  // 1. Try bearer token
  const authHeader = request.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    try {
      const token = authHeader.slice("Bearer ".length).trim();
      const payload = verifyAccessToken(token);
      if (payload) {
        return { userId: payload.sub, role: (payload.role as SystemRole) || "MEMBER" };
      }
    } catch {}
  }

  // 2. Try cookie
  const cookieHeader = request.headers.get("cookie") || "";
  const match = cookieHeader.match(/myupline_session=([^;]+)/);
  if (match) {
    try {
      const token = decodeURIComponent(match[1]);
      const payload = verifyAccessToken(token);
      if (payload) {
        return { userId: payload.sub, role: (payload.role as SystemRole) || "MEMBER" };
      }
    } catch {}
  }

  // 3. Fallback to URL query params
  const { searchParams } = new URL(request.url);
  const roleParam = (searchParams.get("role") || "").toUpperCase() as SystemRole;
  const userIdParam = searchParams.get("userId") || undefined;
  const validRoles: SystemRole[] = ["SUPER_ADMIN", "ADMIN", "TEAM_LEADER", "TRAINER", "MEMBER"];

  return {
    userId: userIdParam,
    role: validRoles.includes(roleParam) ? roleParam : "MEMBER"
  };
}

export async function GET(request: Request) {
  try {
    const { userId, role } = resolveUser(request);
    const notifications = dbStore.getNotificationsForUser(role, userId);

    return NextResponse.json({
      data: {
        role,
        userId: userId || null,
        notifications,
        unreadCount: notifications.filter((n) => !n.isRead).length
      }
    });
  } catch (error: any) {
    console.error("[Notifications API Error]:", error);
    return NextResponse.json(
      { error: { message: "Failed to fetch notifications" } },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const { userId, role } = resolveUser(request);
    let body: any = {};
    try {
      body = await request.json();
    } catch {}

    const { id, markAllRead } = body;

    if (markAllRead) {
      dbStore.markAllNotificationsRead(role, userId);
      return NextResponse.json({ data: { success: true } });
    }

    if (id) {
      const success = dbStore.markNotificationRead(id, userId);
      return NextResponse.json({ data: { success } });
    }

    return NextResponse.json(
      { error: { message: "Specify id or markAllRead: true" } },
      { status: 400 }
    );
  } catch (error: any) {
    console.error("[Notifications API PATCH Error]:", error);
    return NextResponse.json(
      { error: { message: "Failed to update notification" } },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { userId } = resolveUser(request);
    let body: any = {};
    try {
      body = await request.json();
    } catch {}

    const { id } = body;
    if (!id) {
      return NextResponse.json(
        { error: { message: "Notification ID required" } },
        { status: 400 }
      );
    }

    const success = dbStore.dismissNotification(id, userId);
    return NextResponse.json({ data: { success } });
  } catch (error: any) {
    console.error("[Notifications API DELETE Error]:", error);
    return NextResponse.json(
      { error: { message: "Failed to delete notification" } },
      { status: 500 }
    );
  }
}
