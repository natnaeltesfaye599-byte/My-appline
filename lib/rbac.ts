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
  | "onboarding-studio";

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
    "recruitment",
    "after-sales",
    "daily-activity",
    "name-list",
    "training-hub",
    "dream-goal-board",
    "goal-analyzer",
    "downline",
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
    "recruitment",
    "after-sales",
    "daily-activity",
    "name-list",
    "training-hub",
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
    "recruitment",
    "after-sales",
    "daily-activity",
    "name-list",
    "training-hub",
    "dream-goal-board",
    "goal-analyzer",
    "downline",
    "reports",
    "team-faculty",
    "profile"
  ],
  TRAINER: [
    "dashboard",
    "training-hub",
    "certificates",
    "dream-goal-board",
    "motivational-quotes",
    "reports",
    "profile"
  ],
  MEMBER: [
    "dashboard",
    "recruitment",
    "after-sales",
    "daily-activity",
    "name-list",
    "training-hub",
    "dream-goal-board",
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
