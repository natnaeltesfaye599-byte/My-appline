"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import {
  Bell,
  BellRing,
  Check,
  CheckCircle2,
  CreditCard,
  UserPlus,
  Star,
  AlertTriangle,
  Megaphone,
  X,
  Inbox,
  GraduationCap,
  WalletCards,
  ShieldCheck
} from "lucide-react";
import { cn } from "@/lib/utils";
import { canUserAccessNotification, SystemRole } from "@/lib/rbac";

export interface AppNotification {
  id: string;
  type: "payment" | "member" | "goal" | "alert" | "announcement" | "commission" | "training";
  title: string;
  description: string;
  time: string;
  isRead: boolean;
  targetRoles?: SystemRole[];
  targetUserId?: string | null;
  link?: string;
}

// Fallback role-segmented notifications when offline
const defaultRoleNotifications: AppNotification[] = [
  // Admin-only Notifications
  {
    id: "notif-adm-01",
    type: "payment",
    title: "Payment Pending Verification",
    description: "Mulgeta Desta submitted a Diamond package payment receipt — awaiting approval.",
    time: "2 min ago",
    isRead: false,
    targetRoles: ["SUPER_ADMIN", "ADMIN"]
  },
  {
    id: "notif-adm-02",
    type: "alert",
    title: "Failed Login Attempt Blocked",
    description: "An unauthorized login attempt was detected and blocked from IP 41.66.x.x.",
    time: "4 hrs ago",
    isRead: true,
    targetRoles: ["SUPER_ADMIN", "ADMIN"]
  },
  {
    id: "notif-lead-01",
    type: "member",
    title: "New Member Registered",
    description: "Tigist Bekele joined the Vision Leaders team under Bronze Starter package.",
    time: "18 min ago",
    isRead: false,
    targetRoles: ["SUPER_ADMIN", "ADMIN", "TEAM_LEADER"]
  },
  {
    id: "notif-lead-02",
    type: "goal",
    title: "Team Milestone Reached 🎉",
    description: "Solomon Hailu hit 25,000 GV — eligible for Gold Executive promotion this week!",
    time: "1 hr ago",
    isRead: false,
    targetRoles: ["SUPER_ADMIN", "ADMIN", "TEAM_LEADER"]
  },
  {
    id: "notif-trn-01",
    type: "training",
    title: "Course Enrolment Spike",
    description: "Over 40 new members enrolled in Leadership Fundamentals Level 1.",
    time: "2 hrs ago",
    isRead: false,
    targetRoles: ["SUPER_ADMIN", "ADMIN", "TRAINER"]
  },
  // Member-only Notifications
  {
    id: "notif-mem-01",
    type: "announcement",
    title: "Welcome to MyUpline Network",
    description: "Your personalized member dashboard is ready. Set up your Dream Goal Board to kickstart your journey.",
    time: "Just now",
    isRead: false,
    targetRoles: ["MEMBER"]
  },
  {
    id: "notif-mem-02",
    type: "training",
    title: "New Training Assigned",
    description: "Coach Dawit published 'Getting Started Fast: 48-Hour Blueprint' — access it in your Training Hub.",
    time: "1 hr ago",
    isRead: false,
    targetRoles: ["MEMBER"]
  },
  {
    id: "notif-mem-03",
    type: "goal",
    title: "Daily Activity Reminder",
    description: "Keep your streak going! Track your 3 prospecting contacts and follow-ups in the Daily Tracker.",
    time: "3 hrs ago",
    isRead: false,
    targetRoles: ["MEMBER"]
  },
  {
    id: "notif-mem-04",
    type: "commission",
    title: "Direct Bonus Potential",
    description: "Share your referral link with 2 prospect partners to unlock direct sponsor compensation.",
    time: "5 hrs ago",
    isRead: false,
    targetRoles: ["MEMBER"]
  },
  {
    id: "notif-mem-05",
    type: "announcement",
    title: "Daily Motivation",
    description: "Consistency is what transforms average into excellence. Check your inspirational quote today.",
    time: "Yesterday",
    isRead: true,
    targetRoles: ["MEMBER"]
  }
];

const typeConfig: Record<
  AppNotification["type"],
  { icon: typeof Bell; bg: string; text: string }
> = {
  payment: { icon: CreditCard, bg: "bg-amber-50 dark:bg-amber-950/60", text: "text-amber-600 dark:text-amber-400" },
  member: { icon: UserPlus, bg: "bg-emerald-50 dark:bg-emerald-950/60", text: "text-emerald-600 dark:text-emerald-400" },
  goal: { icon: Star, bg: "bg-purple-50 dark:bg-purple-950/60", text: "text-purple-600 dark:text-purple-400" },
  alert: { icon: AlertTriangle, bg: "bg-red-50 dark:bg-red-950/60", text: "text-red-600 dark:text-red-400" },
  announcement: { icon: Megaphone, bg: "bg-cyan-50 dark:bg-cyan-950/60", text: "text-cyan-600 dark:text-cyan-400" },
  commission: { icon: WalletCards, bg: "bg-emerald-50 dark:bg-emerald-950/60", text: "text-emerald-600 dark:text-emerald-400" },
  training: { icon: GraduationCap, bg: "bg-blue-50 dark:bg-blue-950/60", text: "text-blue-600 dark:text-blue-400" }
};

interface NotificationBellProps {
  currentUser?: {
    id?: string;
    email?: string;
    name?: string;
    role?: SystemRole | string;
  } | null;
  userRole?: SystemRole | string;
}

export function NotificationBell({ currentUser, userRole }: NotificationBellProps) {
  const [activeUser, setActiveUser] = useState<any>(currentUser || null);
  const [activeRole, setActiveRole] = useState<SystemRole>(
    ((userRole || currentUser?.role) as SystemRole) || "MEMBER"
  );
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Sync user and role from props or localStorage
  useEffect(() => {
    if (currentUser) {
      setActiveUser(currentUser);
      if (currentUser.role) {
        setActiveRole(currentUser.role as SystemRole);
      }
    } else if (typeof window !== "undefined") {
      try {
        const stored = window.localStorage.getItem("myupline.user");
        if (stored) {
          const parsed = JSON.parse(stored);
          setActiveUser(parsed);
          if (parsed.role) {
            setActiveRole(parsed.role as SystemRole);
          }
        }
      } catch {}
    }
  }, [currentUser, userRole]);

  // Load notifications from API with RBAC query parameters
  const storageKey = `myupline.notifications.${activeUser?.id || activeRole}`;

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    // 1. First check localStorage for immediate render
    if (typeof window !== "undefined") {
      try {
        const stored = window.localStorage.getItem(storageKey);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setNotifications(parsed);
          }
        }
      } catch {}
    }

    // 2. Fetch fresh role-based notifications from server API
    const token = typeof window !== "undefined" ? window.localStorage.getItem("myupline.accessToken") : null;
    const url = `/api/notifications?role=${encodeURIComponent(activeRole)}${
      activeUser?.id ? `&userId=${encodeURIComponent(activeUser.id)}` : ""
    }`;

    fetch(url, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((payload) => {
        if (!isMounted) return;
        if (payload?.data?.notifications && Array.isArray(payload.data.notifications)) {
          setNotifications(payload.data.notifications);
          if (typeof window !== "undefined") {
            try {
              window.localStorage.setItem(storageKey, JSON.stringify(payload.data.notifications));
            } catch {}
          }
        } else {
          // Fallback to role-filtered defaults
          setNotifications(defaultRoleNotifications);
        }
      })
      .catch(() => {
        if (!isMounted) return;
        setNotifications((prev) => (prev.length > 0 ? prev : defaultRoleNotifications));
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [activeRole, activeUser?.id, storageKey]);

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // STRICT RBAC FILTERING:
  // Members CANNOT see anything except notifications addressed to their userId or general member announcements
  const accessibleNotifications = useMemo(() => {
    return notifications.filter((notification) =>
      canUserAccessNotification(activeRole, activeUser?.id, notification)
    );
  }, [notifications, activeRole, activeUser?.id]);

  const unreadCount = accessibleNotifications.filter((n) => !n.isRead).length;

  const saveUpdated = (updated: AppNotification[]) => {
    setNotifications(updated);
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem(storageKey, JSON.stringify(updated));
      } catch {}
    }
  };

  const markAllRead = async () => {
    const updated = notifications.map((n) =>
      canUserAccessNotification(activeRole, activeUser?.id, n) ? { ...n, isRead: true } : n
    );
    saveUpdated(updated);

    try {
      const token = typeof window !== "undefined" ? window.localStorage.getItem("myupline.accessToken") : null;
      await fetch(`/api/notifications?role=${encodeURIComponent(activeRole)}${activeUser?.id ? `&userId=${encodeURIComponent(activeUser.id)}` : ""}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ markAllRead: true })
      });
    } catch {}
  };

  const markOneRead = async (id: string) => {
    const updated = notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n));
    saveUpdated(updated);

    try {
      const token = typeof window !== "undefined" ? window.localStorage.getItem("myupline.accessToken") : null;
      await fetch(`/api/notifications?role=${encodeURIComponent(activeRole)}${activeUser?.id ? `&userId=${encodeURIComponent(activeUser.id)}` : ""}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ id })
      });
    } catch {}
  };

  const dismissOne = async (id: string) => {
    const updated = notifications.filter((n) => n.id !== id);
    saveUpdated(updated);

    try {
      const token = typeof window !== "undefined" ? window.localStorage.getItem("myupline.accessToken") : null;
      await fetch(`/api/notifications?role=${encodeURIComponent(activeRole)}${activeUser?.id ? `&userId=${encodeURIComponent(activeUser.id)}` : ""}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ id })
      });
    } catch {}
  };

  return (
    <div ref={ref} className="relative no-print">
      {/* Bell Button */}
      <button
        id="notification-bell-btn"
        onClick={() => setIsOpen((prev) => !prev)}
        className={cn(
          "relative inline-flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-lg border transition",
          isOpen
            ? "border-cyan-300 bg-cyan-50 text-cyan-700 dark:border-cyan-500/50 dark:bg-cyan-950/50 dark:text-cyan-300"
            : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white"
        )}
        title={activeRole === "MEMBER" ? "Your Member Notifications" : `${activeRole.replace(/_/g, " ")} Notifications`}
        aria-label={`Notifications — ${unreadCount} unread`}
      >
        {unreadCount > 0 ? (
          <BellRing className="h-4 w-4 animate-[wiggle_1s_ease-in-out_infinite]" />
        ) : (
          <Bell className="h-4 w-4" />
        )}
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-black text-white shadow">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Popover */}
      {isOpen && (
        <div className="absolute right-0 top-12 z-50 w-[calc(100vw-24px)] max-w-[370px] max-h-[500px] overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-200/80 ring-1 ring-black/5 animate-in fade-in slide-in-from-top-2 duration-150 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/60">
          {/* Header */}
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-brand-navy dark:text-cyan-400" />
              <div>
                <span className="text-sm font-black text-brand-navy dark:text-white block leading-tight">
                  {activeRole === "MEMBER" ? "My Notifications" : "Notifications"}
                </span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 flex items-center gap-1 font-semibold">
                  <ShieldCheck className="h-3 w-3 text-cyan-500" />
                  {activeRole === "MEMBER" ? "Strict Member RBAC" : `${activeRole.replace(/_/g, " ")} View`}
                </span>
              </div>
              {unreadCount > 0 && (
                <span className="ml-1 rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-black text-rose-600 dark:bg-rose-950/60 dark:text-rose-400">
                  {unreadCount} new
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-bold text-cyan-600 hover:bg-cyan-50 transition dark:text-cyan-400 dark:hover:bg-cyan-950/50"
              >
                <CheckCircle2 className="h-3 w-3" />
                Mark all read
              </button>
            )}
          </div>

          {/* Notification List */}
          {accessibleNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 py-12 px-4 text-center text-slate-400 dark:text-slate-500">
              <Inbox className="h-8 w-8 text-slate-300 dark:text-slate-600" />
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                {activeRole === "MEMBER" ? "No notifications for your account" : "All caught up!"}
              </p>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 max-w-[240px]">
                {activeRole === "MEMBER"
                  ? "You will see personal alerts here when your payment is verified or new rewards arrive."
                  : "You're up to date on all platform alerts."}
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-slate-50 dark:divide-slate-800/60">
              {accessibleNotifications.map((notification) => {
                const cfg = typeConfig[notification.type] || typeConfig.announcement;
                const Icon = cfg.icon;
                const isPersonal = Boolean(notification.targetUserId && notification.targetUserId === activeUser?.id);

                return (
                  <li
                    key={notification.id}
                    className={cn(
                      "group flex gap-3 px-4 py-3.5 transition hover:bg-slate-50 dark:hover:bg-slate-800/60",
                      !notification.isRead && "bg-cyan-50/40 dark:bg-cyan-950/20"
                    )}
                  >
                    <div
                      className={cn(
                        "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                        cfg.bg,
                        cfg.text
                      )}
                    >
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <p
                            className={cn(
                              "text-xs leading-snug",
                              notification.isRead
                                ? "font-medium text-slate-700 dark:text-slate-300"
                                : "font-black text-slate-900 dark:text-white"
                            )}
                          >
                            {notification.title}
                          </p>
                          {isPersonal && (
                            <span className="rounded-md bg-cyan-100/80 dark:bg-cyan-950/80 px-1.5 py-0.2 text-[9px] font-black text-cyan-700 dark:text-cyan-300">
                              Personal
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => dismissOne(notification.id)}
                          className="mt-0.5 shrink-0 text-slate-300 opacity-0 transition hover:text-slate-500 dark:text-slate-600 dark:hover:text-slate-300 group-hover:opacity-100"
                          title="Dismiss"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                      <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                        {notification.description}
                      </p>
                      <div className="mt-1.5 flex items-center justify-between gap-2">
                        <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500">
                          {notification.time}
                        </span>
                        {!notification.isRead && (
                          <button
                            onClick={() => markOneRead(notification.id)}
                            className="flex items-center gap-1 text-[10px] font-bold text-cyan-600 hover:underline dark:text-cyan-400"
                          >
                            <Check className="h-3 w-3" />
                            Mark read
                          </button>
                        )}
                      </div>
                    </div>
                    {!notification.isRead && (
                      <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-cyan-500 shadow-sm" />
                    )}
                  </li>
                );
              })}
            </ul>
          )}

          {/* Footer */}
          <div className="sticky bottom-0 border-t border-slate-100 bg-white px-4 py-2 text-center dark:border-slate-800 dark:bg-slate-900">
            <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500">
              {activeRole === "MEMBER"
                ? `Showing ${accessibleNotifications.length} personal member notification${accessibleNotifications.length === 1 ? "" : "s"}`
                : `Showing ${accessibleNotifications.length} notifications • RBAC filtered`}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
