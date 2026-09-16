"use client";

import {
  LayoutDashboard,
  Users2,
  Target,
  QrCode,
  Menu,
  BookOpen
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DashboardView } from "@/components/dashboard-shell";

interface MobileBottomNavProps {
  currentView: DashboardView;
  onNavigate: (view: DashboardView) => void;
  onOpenSidebar: () => void;
  onOpenShare: () => void;
  isSuperAdmin?: boolean;
}

export function MobileBottomNav({
  currentView,
  onNavigate,
  onOpenSidebar,
  onOpenShare,
  isSuperAdmin = false
}: MobileBottomNavProps) {
  const navItems = [
    {
      id: "dashboard" as DashboardView,
      label: "Home",
      icon: LayoutDashboard,
      isActive: currentView === "dashboard"
    },
    {
      id: "downline" as DashboardView,
      label: "Downline",
      icon: Users2,
      isActive: currentView === "downline"
    },
    {
      id: (isSuperAdmin ? "onboarding-studio" : "recruitment") as DashboardView,
      label: "Prospects",
      icon: Target,
      isActive: currentView === "recruitment" || currentView === "onboarding-studio"
    },
    {
      id: "training-hub" as DashboardView,
      label: "Training",
      icon: BookOpen,
      isActive: currentView === "training-hub"
    }
  ];

  return (
    <div
      id="mobile-bottom-nav"
      className="fixed bottom-0 left-0 right-0 z-30 flex items-center justify-around border-t border-slate-200 bg-white/95 px-2 py-1.5 backdrop-blur-md shadow-lg shadow-slate-900/10 lg:hidden no-print"
      style={{ paddingBottom: "max(6px, env(safe-area-inset-bottom))" }}
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <button
            key={item.label}
            type="button"
            onClick={() => onNavigate(item.id)}
            className={cn(
              "flex flex-1 flex-col items-center justify-center gap-0.5 rounded-xl py-1 text-[10px] font-bold transition active:scale-95",
              item.isActive
                ? "text-brand-navy"
                : "text-slate-400 hover:text-slate-600"
            )}
          >
            <div
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-lg transition",
                item.isActive ? "brand-gradient text-brand-navy shadow-sm" : "bg-transparent"
              )}
            >
              <Icon className="h-4 w-4" />
            </div>
            <span className={cn("truncate max-w-[56px]", item.isActive && "font-black")}>
              {item.label}
            </span>
          </button>
        );
      })}

      {/* Quick Invite & QR Button */}
      <button
        type="button"
        onClick={onOpenShare}
        className="flex flex-1 flex-col items-center justify-center gap-0.5 rounded-xl py-1 text-[10px] font-bold text-cyan-600 hover:text-cyan-700 transition active:scale-95"
      >
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-50 border border-cyan-200 text-brand-blue shadow-sm">
          <QrCode className="h-4 w-4" />
        </div>
        <span className="truncate max-w-[56px] font-black">Invite</span>
      </button>

      {/* Full Menu / Drawer Trigger */}
      <button
        type="button"
        onClick={onOpenSidebar}
        className="flex flex-1 flex-col items-center justify-center gap-0.5 rounded-xl py-1 text-[10px] font-bold text-slate-400 hover:text-slate-700 transition active:scale-95"
        aria-label="Open Full Menu"
      >
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
          <Menu className="h-4 w-4" />
        </div>
        <span className="truncate max-w-[56px]">Menu</span>
      </button>
    </div>
  );
}
