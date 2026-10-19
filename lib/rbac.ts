export type SystemRole =
  | "SUPER_ADMIN"
  | "ADMIN"
  | "TEAM_LEADER"
  | "TRAINER"
  | "MEMBER";

export type DashboardView =
  | "dashboard"
  | "recruitment"
  | "after-sales"
  | "daily-activity"
  | "name-list"
  | "training-hub"
  | "dream-goal-board"
  | "goal-analyzer"
  | "downline"
  | "genealogy-tree"
  | "commission-engine"
  | "compliance-rules"
  | "promo-studio"
  | "certificates"
  | "motivational-quotes"
  | "packages-payments"
  | "training-studio"
  | "reports"
  | "settings"
  | "activity"
  | "cms-studio"
  | "team-faculty"
  | "profile"
  | "onboarding-studio"
  | "mlm-engine"
  | "holding-tank"
  | "rank-advancement";

// Role mapping from URL slug to Role enum
export const roleSlugToRoleMap: Record<string, SystemRole> = {
  "super-admin": "SUPER_ADMIN",
  admin: "ADMIN",
  "team-leader": "TEAM_LEADER",
  trainer: "TRAINER",
  member: "MEMBER"
};

export const roleToRoleSlugMap: Record<SystemRole, string> = {
  SUPER_ADMIN: "super-admin",
  ADMIN: "admin",
  TEAM_LEADER: "team-leader",
  TRAINER: "trainer",
  MEMBER: "member"
};

// Hierarchy levels (higher can access lower, but lower CANNOT access higher)
export const roleHierarchy: Record<SystemRole, number> = {
  SUPER_ADMIN: 5,
  ADMIN: 4,
  TEAM_LEADER: 3,
  TRAINER: 3,
  MEMBER: 1
};

// Which workspaces each role is strictly authorized to open
export const roleAllowedWorkspaces: Record<SystemRole, string[]> = {
  SUPER_ADMIN: ["super-admin", "admin", "team-leader", "trainer", "member"],
  ADMIN: ["admin", "team-leader", "trainer", "member"],
  TEAM_LEADER: ["team-leader", "member"],
  TRAINER: ["trainer", "member"],
  MEMBER: ["member"]
};

// Which views are permitted for each role
export const roleAllowedViews: Record<SystemRole, DashboardView[]> = {
  SUPER_ADMIN: [
    "dashboard",
    "mlm-engine",
    "holding-tank",
    "rank-advancement",
    "recruitment",
    "after-sales",
    "daily-activity",
    "name-list",
    "training-hub",
    "dream-goal-board",
    "goal-analyzer",
    "downline",
    "genealogy-tree",
    "commission-engine",
    "compliance-rules",
    "promo-studio",
    "certificates",
    "motivational-quotes",
    "packages-payments",
    "training-studio",
    "reports",
    "settings",
    "activity",
    "cms-studio",
    "team-faculty",
    "profile",
    "onboarding-studio"
  ],
  ADMIN: [
    "dashboard",
    "mlm-engine",
    "holding-tank",
    "rank-advancement",
    "recruitment",
    "after-sales",
    "daily-activity",
    "name-list",
    "training-hub",
    "genealogy-tree",
    "commission-engine",
    "compliance-rules",
    "certificates",
    "promo-studio",
    "packages-payments",
    "training-studio",
    "reports",
    "settings",
    "cms-studio",
    "team-faculty",
    "profile",
    "onboarding-studio"
  ],
  TEAM_LEADER: [
    "dashboard",
    "mlm-engine",
    "holding-tank",
    "rank-advancement",
    "recruitment",
    "after-sales",
    "daily-activity",
    "name-list",
    "training-hub",
    "dream-goal-board",
    "goal-analyzer",
    "downline",
    "genealogy-tree",
    "commission-engine",
    "compliance-rules",
    "reports",
    "team-faculty",
    "profile"
  ],
  TRAINER: [
    "dashboard",
    "rank-advancement",
    "training-hub",
    "genealogy-tree",
    "compliance-rules",
    "certificates",
    "dream-goal-board",
    "motivational-quotes",
    "reports",
    "profile"
  ],
  MEMBER: [
    "dashboard",
    "rank-advancement",
    "holding-tank",
    "recruitment",
    "after-sales",
    "daily-activity",
    "name-list",
    "training-hub",
    "dream-goal-board",
    "genealogy-tree",
    "commission-engine",
    "compliance-rules",
    "motivational-quotes",
    "profile"
  ]
};

export function canRoleAccessWorkspace(userRole: SystemRole, targetRoleSlug: string): boolean {
  const allowed = roleAllowedWorkspaces[userRole] || [];
  return allowed.includes(targetRoleSlug);
}

export function canRoleAccessView(userRole: SystemRole, view: DashboardView): boolean {
  const allowed = roleAllowedViews[userRole] || [];
  return allowed.includes(view);
}

// ─────────────────────────────────────────────────────────────────────────────
// Notification RBAC
// ─────────────────────────────────────────────────────────────────────────────

export type NotificationType =
  | "payment"
  | "member"
  | "goal"
  | "alert"
  | "announcement"
  | "commission"
  | "training";

export interface RbacNotification {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  time?: string;
  createdAt?: string;
  isRead: boolean;
  targetRoles?: SystemRole[];
  targetUserId?: string | null;
  link?: string;
}

/**
 * Strict RBAC: Determines whether a user is authorized to see a given notification.
 * - If notification is targeted to a specific user (targetUserId), ONLY that exact user can see it.
 * - Members CANNOT see system alerts or payments/receipts of other users.
 * - Members can ONLY see notifications addressed to their personal userId or general announcements for MEMBER.
 * - Staff/Admin roles can only see notifications that include their role in targetRoles.
 */
export function canUserAccessNotification(
  userRole: SystemRole,
  userId?: string | null,
  notification?: {
    type?: string;
    targetRoles?: SystemRole[];
    targetUserId?: string | null;
  } | null
): boolean {
  if (!notification) return false;

  // Rule 1: Specific user targeting
  if (notification.targetUserId) {
    return Boolean(userId && notification.targetUserId === userId);
  }

  // Rule 2: Member strict isolation
  if (userRole === "MEMBER") {
    // If targetRoles exists and does not include MEMBER -> DENY
    if (notification.targetRoles && !notification.targetRoles.includes("MEMBER")) {
      return false;
    }
    // Members NEVER see system security alerts
    if (notification.type === "alert") {
      return false;
    }
    // Members NEVER see payment verification queues for other users
    if (notification.type === "payment") {
      return false;
    }
    // Only allow if targetRoles explicitly includes MEMBER or is a general announcement
    if (notification.targetRoles) {
      return notification.targetRoles.includes("MEMBER");
    }
    return true;
  }

  // Rule 3: Other roles (SUPER_ADMIN, ADMIN, TEAM_LEADER, TRAINER)
  if (notification.targetRoles && notification.targetRoles.length > 0) {
    return notification.targetRoles.includes(userRole);
  }

  return true;
}

