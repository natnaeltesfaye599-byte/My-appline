"use client";

import { useEffect } from "react";
import Link from "next/link";
import {
  LogOut,
  ShieldCheck,
  X
} from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { cn } from "@/lib/utils";
import { getNavLabel, getBadgeLabel, Locale } from "@/lib/i18n";
import { DashboardView } from "@/components/dashboard-shell";

interface NavItem {
  id: DashboardView;
  label: string;
  icon: React.ElementType;
  badge?: string;
}

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentLocale: Locale;
  view: DashboardView;
  onNavigate: (view: DashboardView) => void;
  navigation: NavItem[];
  onLogout: () => void;
  isSuperAdmin?: boolean;
  currentUser?: any;
  roleLabel?: string;
}

export function MobileSidebar({
  isOpen,
  onClose,
  currentLocale,
  view,
  onNavigate,
  navigation,
  onLogout,
  isSuperAdmin,
  currentUser,
  roleLabel
}: MobileSidebarProps) {
  // Lock body scroll when sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className={cn(
          "fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden no-print",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      />

      {/* Drawer */}
      <aside
        id="mobile-sidebar"
        aria-label="Navigation sidebar"
        className={cn(
          "fixed left-0 top-0 z-50 flex h-full w-[280px] flex-col bg-brand-navy text-white shadow-2xl transition-transform duration-300 ease-in-out lg:hidden no-print",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-4">
          <Link href={`/${currentLocale}`} onClick={onClose}>
            <BrandLogo />
          </Link>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-white/70 hover:bg-white/20 hover:text-white transition"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* User Info pill */}
        {currentUser && (
          <div className="mx-4 mt-4 flex items-center gap-3 rounded-xl border border-white/10 bg-white/8 px-3 py-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-cyan-400 font-black text-brand-navy text-sm">
              {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : "U"}
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs font-black text-white">{currentUser?.name || "User"}</p>
              <p className="truncate text-[10px] text-white/50">{roleLabel || "Member"}</p>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = view === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  onClose();
                }}
                className={cn(
                  "flex w-full items-center justify-between rounded-xl px-3 py-3 text-left text-sm font-semibold transition",
                  isActive
                    ? "brand-gradient text-brand-navy font-black"
                    : "text-white/75 hover:bg-white/10 hover:text-white"
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="text-xs">{getNavLabel(currentLocale, item.id)}</span>
                </div>
                {item.badge && (
                  <span
                    className={cn(
                      "rounded px-1.5 py-0.5 text-[9px] font-bold shrink-0",
                      isActive
                        ? "bg-brand-navy/20 text-brand-navy"
                        : "bg-white/15 text-cyan-300"
                    )}
                  >
                    {getBadgeLabel(currentLocale, item.badge)}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-white/10 px-3 py-4 space-y-2">
          {isSuperAdmin && (
            <div className="flex items-center gap-2 rounded-xl bg-white/8 px-3 py-2">
              <ShieldCheck className="h-4 w-4 shrink-0 text-brand-green" />
              <p className="text-[10px] font-bold text-white/70">Super Admin — Full Platform Access</p>
            </div>
          )}
          <button
            onClick={onLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-rose-300 hover:bg-red-500/15 hover:text-rose-200 transition"
          >
            <LogOut className="h-4 w-4 text-rose-400" />
            Log Out
          </button>
        </div>
      </aside>
    </>
  );
}
