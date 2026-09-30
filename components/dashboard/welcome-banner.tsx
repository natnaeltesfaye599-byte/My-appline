"use client";

import { useState, useEffect } from "react";
import {
  Activity,
  Calculator,
  CircleDollarSign,
  Flame,
  GraduationCap,
  Network,
  Share2,
  Sparkles,
  TrendingUp,
  Users,
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";

interface WelcomeBannerProps {
  userName?: string;
  userRole?: string;
  onOpenCalculator?: () => void;
  onOpenAi?: (prompt?: string) => void;
  onOpenShare?: () => void;
}

const adminKpiItems = [
  { icon: Users, label: "Total Members", value: "12,458", change: "+12.5%", color: "text-cyan-300" },
  { icon: TrendingUp, label: "Active Members", value: "8,642", change: "+8.2%", color: "text-emerald-300" },
  { icon: CircleDollarSign, label: "Monthly Revenue", value: "ETB 2.45M", change: "+15.7%", color: "text-amber-300" },
  { icon: GraduationCap, label: "Active Courses", value: "128", change: "+18.4%", color: "text-purple-300" },
  { icon: Network, label: "Active Teams", value: "1,256", change: "+10.3%", color: "text-blue-300" },
  { icon: Activity, label: "DMO Completions Today", value: "347", change: "+22%", color: "text-rose-300" },
  { icon: Flame, label: "New Registrations", value: "89", change: "+5.6%", color: "text-orange-300" },
  { icon: Zap, label: "Pending Payments", value: "23", change: "Needs review", color: "text-yellow-300" }
];

const teamLeaderKpiItems = [
  { icon: Users, label: "My Team Members", value: "47", change: "+3 this week", color: "text-cyan-300" },
  { icon: Activity, label: "Team DMO Today", value: "82%", change: "+14%", color: "text-emerald-300" },
  { icon: CircleDollarSign, label: "Team GV This Month", value: "ETB 84K", change: "+9.3%", color: "text-amber-300" },
  { icon: GraduationCap, label: "Trainings Completed", value: "31", change: "+5", color: "text-purple-300" },
  { icon: Network, label: "Active Downlines", value: "18", change: "+2", color: "text-blue-300" },
  { icon: Flame, label: "New Recruits", value: "4", change: "This month", color: "text-orange-300" },
  { icon: TrendingUp, label: "Team Conversion Rate", value: "68%", change: "+6%", color: "text-rose-300" },
  { icon: Zap, label: "Pending Follow-Ups", value: "7", change: "In pipeline", color: "text-yellow-300" }
];

const memberKpiItems = [
  { icon: Activity, label: "My DMO Score Today", value: "5/7", change: "Keep going!", color: "text-cyan-300" },
  { icon: Users, label: "My Downline", value: "8", change: "+1 this week", color: "text-emerald-300" },
  { icon: CircleDollarSign, label: "Personal GV", value: "ETB 12,450", change: "+8.2%", color: "text-amber-300" },
  { icon: GraduationCap, label: "Courses Completed", value: "4/12", change: "+1 this month", color: "text-purple-300" },
  { icon: Network, label: "Active Contacts", value: "23", change: "In name list", color: "text-blue-300" },
  { icon: Flame, label: "Prospect Invites", value: "3", change: "This week", color: "text-orange-300" },
  { icon: TrendingUp, label: "Goal Progress", value: "62%", change: "30-day goal", color: "text-rose-300" },
  { icon: Zap, label: "Streak", value: "9 days", change: "Keep it up!", color: "text-yellow-300" }
];

function getKpiItems(role?: string) {
  const r = role?.toUpperCase() ?? "";
  if (r === "SUPER_ADMIN" || r === "ADMIN") return adminKpiItems;
  if (r === "TEAM_LEADER") return teamLeaderKpiItems;
  return memberKpiItems;
}


function getGreeting(hour: number): string {
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function getEthiopianDate(): string {
  // Simple Gregorian date display with Ethiopian context
  const now = new Date();
  return now.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric"
  });
}

export function WelcomeBanner({
  userName,
  userRole,
  onOpenCalculator,
  onOpenAi,
  onOpenShare
}: WelcomeBannerProps) {
  const kpiItems = getKpiItems(userRole);
  const [tickerIdx, setTickerIdx] = useState(0);
  const [hour, setHour] = useState(new Date().getHours());
  const [dateStr, setDateStr] = useState(getEthiopianDate());

  useEffect(() => {
    const interval = setInterval(() => {
      setTickerIdx((i) => (i + 1) % kpiItems.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [kpiItems.length]);

  useEffect(() => {
    const tick = setInterval(() => {
      setHour(new Date().getHours());
      setDateStr(getEthiopianDate());
    }, 60000);
    return () => clearInterval(tick);
  }, []);

  const greeting = getGreeting(hour);
  const displayName = userName ? userName.split(" ")[0] : "Leader";
  const currentKpi = kpiItems[tickerIdx % kpiItems.length];
  const KpiIcon = currentKpi.icon;

  return (
    <div
      id="welcome-banner"
      className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-brand-navy via-[#0e2a5e] to-[#0a1e47] text-white shadow-lg"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-cyan-500/10" />
        <div className="absolute -bottom-8 left-1/3 h-32 w-32 rounded-full bg-purple-500/10" />
        <div className="absolute right-1/4 top-1/2 h-24 w-24 -translate-y-1/2 rounded-full bg-blue-500/5" />
      </div>

      <div className="relative flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
        {/* Left: Greeting */}
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-cyan-400/20 ring-1 ring-cyan-400/30">
            <span className="text-2xl">
              {hour < 12 ? "🌅" : hour < 17 ? "☀️" : "🌙"}
            </span>
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-white/50">
              {dateStr}
            </p>
            <h2 className="text-lg font-black leading-tight text-white sm:text-xl">
              {greeting},{" "}
              <span className="text-cyan-300">{displayName}</span>!
            </h2>
            {userRole && (
              <p className="text-[11px] text-white/60 font-semibold mt-0.5">
                {userRole.replace(/_/g, " ")} •{" "}
                <span className="text-cyan-400 font-bold">MyUpline Platform</span>
              </p>
            )}
          </div>
        </div>

        {/* Middle: KPI Live Ticker */}
        <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 sm:min-w-[220px]">
          <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10", currentKpi.color)}>
            <KpiIcon className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-white/40">
              {currentKpi.label}
            </p>
            <p className="text-sm font-black text-white leading-tight">
              {currentKpi.value}
            </p>
            <p className={cn("text-[10px] font-bold", currentKpi.color)}>
              {currentKpi.change}
            </p>
          </div>
          {/* Dots */}
          <div className="flex flex-col gap-1">
            {kpiItems.map((_, i) => (
              <span
                key={i}
                className={cn(
                  "block h-1 rounded-full transition-all duration-300",
                  i === tickerIdx ? "w-4 bg-cyan-400" : "w-1.5 bg-white/20"
                )}
              />
            ))}
          </div>
        </div>

        {/* Right: Quick Action Buttons */}
        <div className="flex flex-wrap gap-2 sm:flex-col sm:items-end">
          {onOpenShare && (
            <button
              onClick={onOpenShare}
              className="flex items-center gap-1.5 rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-3 py-2 text-[11px] font-black text-emerald-300 transition hover:bg-emerald-400/20"
            >
              <Share2 className="h-3.5 w-3.5" />
              Invite & QR
            </button>
          )}
          <button
            onClick={() => onOpenAi?.("Give me our top 3 strategic priorities for today based on current team performance.")}
            className="flex items-center gap-1.5 rounded-xl border border-cyan-400/30 bg-cyan-400/10 px-3 py-2 text-[11px] font-black text-cyan-300 transition hover:bg-cyan-400/20"
          >
            <Sparkles className="h-3.5 w-3.5" />
            AI Daily Brief
          </button>
          {onOpenCalculator && (
            <button
              onClick={onOpenCalculator}
              className="flex items-center gap-1.5 rounded-xl border border-amber-400/30 bg-amber-400/10 px-3 py-2 text-[11px] font-black text-amber-300 transition hover:bg-amber-400/20"
            >
              <Calculator className="h-3.5 w-3.5" />
              Earnings Calculator
            </button>
          )}
        </div>
      </div>

      {/* Bottom KPI scrolling strip */}
      <div className="relative border-t border-white/10 bg-white/5 px-6 py-2 overflow-hidden">
        <div className="flex gap-6 overflow-x-auto scrollbar-none">
          {kpiItems.map((kpi, i) => {
            const Icon = kpi.icon;
            return (
              <div
                key={i}
                className={cn(
                  "flex shrink-0 items-center gap-2 text-[10px] transition",
                  i === tickerIdx ? "opacity-100" : "opacity-40"
                )}
              >
                <Icon className={cn("h-3 w-3", kpi.color)} />
                <span className="font-bold text-white whitespace-nowrap">{kpi.label}:</span>
                <span className={cn("font-black", kpi.color)}>{kpi.value}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
