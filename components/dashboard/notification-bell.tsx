"use client";

import { useState, useEffect, useRef } from "react";
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
  Inbox
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface AppNotification {
  id: string;
  type: "payment" | "member" | "goal" | "alert" | "announcement";
  title: string;
  description: string;
  time: string;
  isRead: boolean;
}

const STORAGE_KEY = "myupline.notifications";

const defaultNotifications: AppNotification[] = [
  {
    id: "n-1",
    type: "payment",
    title: "Payment Pending Verification",
    description: "Mulgeta Desta submitted a Diamond package payment receipt — awaiting approval.",
    time: "2 min ago",
    isRead: false
  },
  {
    id: "n-2",
    type: "member",
    title: "New Member Registered",
    description: "Tigist Bekele joined the Vision Leaders team under Bronze Starter package.",
    time: "18 min ago",
    isRead: false
  },
  {
    id: "n-3",
    type: "goal",
    title: "Goal Milestone Reached 🎉",
    description: "Solomon Hailu hit 25,000 GV — eligible for Gold Executive promotion this week!",
    time: "1 hr ago",
    isRead: false
  },
  {
    id: "n-4",
    type: "announcement",
    title: "Training Published",
    description: "Coach Dawit published 'Leadership Fundamentals Level 2' — now live in the Academy.",
    time: "3 hrs ago",
    isRead: true
  },
  {
    id: "n-5",
    type: "alert",
    title: "Failed Login Attempt Blocked",
    description: "An unauthorized login attempt was detected and blocked from IP 41.66.x.x.",
    time: "Yesterday",
    isRead: true
  },
  {
    id: "n-6",
    type: "member",
    title: "Rank Promotion",
    description: "Alebe Kebede was promoted to Team Leader rank by Admin.",
    time: "Yesterday",
    isRead: true
  }
];

function loadNotifications(): AppNotification[] {
  if (typeof window === "undefined") return defaultNotifications;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return defaultNotifications;
}

function saveNotifications(notifications: AppNotification[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
  } catch {}
}

const typeConfig: Record<
  AppNotification["type"],
  { icon: typeof Bell; bg: string; text: string }
> = {
  payment: { icon: CreditCard, bg: "bg-amber-50 dark:bg-amber-950/60", text: "text-amber-600 dark:text-amber-400" },
  member: { icon: UserPlus, bg: "bg-emerald-50 dark:bg-emerald-950/60", text: "text-emerald-600 dark:text-emerald-400" },
  goal: { icon: Star, bg: "bg-purple-50 dark:bg-purple-950/60", text: "text-purple-600 dark:text-purple-400" },
  alert: { icon: AlertTriangle, bg: "bg-red-50 dark:bg-red-950/60", text: "text-red-600 dark:text-red-400" },
  announcement: { icon: Megaphone, bg: "bg-cyan-50 dark:bg-cyan-950/60", text: "text-cyan-600 dark:text-cyan-400" }
};

export function NotificationBell() {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setNotifications(loadNotifications());
  }, []);

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

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  function markAllRead() {
    const updated = notifications.map((n) => ({ ...n, isRead: true }));
    setNotifications(updated);
    saveNotifications(updated);
  }

  function markOneRead(id: string) {
    const updated = notifications.map((n) =>
      n.id === id ? { ...n, isRead: true } : n
    );
    setNotifications(updated);
    saveNotifications(updated);
  }

  function dismissOne(id: string) {
    const updated = notifications.filter((n) => n.id !== id);
    setNotifications(updated);
    saveNotifications(updated);
  }

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
        title="Notifications"
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
        <div className="absolute right-0 top-12 z-50 w-[calc(100vw-24px)] max-w-[360px] max-h-[480px] overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-200/80 ring-1 ring-black/5 animate-in fade-in slide-in-from-top-2 duration-150 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/60">
          {/* Header */}
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-brand-navy dark:text-cyan-400" />
              <span className="text-sm font-black text-brand-navy dark:text-white">Notifications</span>
              {unreadCount > 0 && (
                <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-black text-rose-600 dark:bg-rose-950/60 dark:text-rose-400">
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
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 py-12 text-slate-400 dark:text-slate-500">
              <Inbox className="h-8 w-8" />
              <p className="text-xs font-semibold">All caught up!</p>
            </div>
          ) : (
            <ul className="divide-y divide-slate-50 dark:divide-slate-800/60">
              {notifications.map((notification) => {
                const cfg = typeConfig[notification.type];
                const Icon = cfg.icon;
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
          <div className="sticky bottom-0 border-t border-slate-100 bg-white px-4 py-2.5 text-center dark:border-slate-800 dark:bg-slate-900">
            <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500">
              Showing last {notifications.length} notifications • MyUpline Platform
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
