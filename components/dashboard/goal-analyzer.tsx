"use client";

import { useState } from "react";
import {
  AlertCircle,
  ArrowUpRight,
  Bot,
  Calendar,
  CheckCircle2,
  ChevronRight,
  FileSpreadsheet,
  Flame,
  Plus,
  Printer,
  Sparkles,
  Target,
  TrendingUp,
  Zap
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { exportToCsv, printSection } from "@/lib/export-utils";

export type GoalItem = {
  id: string;
  title: string;
  category: "Recruitment" | "Sales Volume" | "Team Growth" | "LMS Learning";
  current: number;
  target: number;
  unit: string;
  deadline: string;
  status: "ahead" | "on-track" | "behind";
  dailyRequired: number;
  currentPace: number;
};

const initialGoals: GoalItem[] = [
  {
    id: "g-1",
    title: "Monthly Personal Recruits",
    category: "Recruitment",
    current: 18,
    target: 25,
    unit: "members",
    deadline: "Jun 30, 2026",
    status: "ahead",
    dailyRequired: 0.8,
    currentPace: 1.2
  },
  {
    id: "g-2",
    title: "Group Volume (GV) Target",
    category: "Sales Volume",
    current: 185000,
    target: 250000,
    unit: "ETB",
    deadline: "Jun 30, 2026",
    status: "on-track",
    dailyRequired: 7220,
    currentPace: 7400
  },
  {
    id: "g-3",
    title: "Downline Team Retention",
    category: "Team Growth",
    current: 88,
    target: 95,
    unit: "%",
    deadline: "Jul 15, 2026",
    status: "behind",
    dailyRequired: 0.5,
    currentPace: 0.2
  },
  {
    id: "g-4",
    title: "Leadership LMS Course Completions",
    category: "LMS Learning",
    current: 42,
    target: 50,
    unit: "graduates",
    deadline: "Jun 28, 2026",
    status: "ahead",
    dailyRequired: 1.1,
    currentPace: 1.6
  }
];

export function GoalAnalyzer({ onOpenAi }: { onOpenAi?: (prompt: string) => void }) {
  const [goals, setGoals] = useState<GoalItem[]>(initialGoals);
  const [filter, setFilter] = useState<string>("all");
  const [selectedGoal, setSelectedGoal] = useState<GoalItem>(goals[0]);
  const [isAddingGoal, setIsAddingGoal] = useState(false);

  // New goal form state
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState<GoalItem["category"]>("Recruitment");
  const [newCurrent, setNewCurrent] = useState<number>(0);
  const [newTarget, setNewTarget] = useState<number>(100);
  const [newUnit, setNewUnit] = useState("members");
  const [newDeadline, setNewDeadline] = useState("Jun 30, 2026");

  const filteredGoals = goals.filter(
    (g) => filter === "all" || g.category.toLowerCase().includes(filter.toLowerCase())
  );

  function handleCreateGoal(e: React.FormEvent) {
    e.preventDefault();
    if (!newTitle.trim() || newTarget <= 0) return;

    const goal: GoalItem = {
      id: `g-${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory,
      current: Number(newCurrent) || 0,
      target: Number(newTarget),
      unit: newUnit || "units",
      deadline: newDeadline || "Month End",
      status: Number(newCurrent) >= Number(newTarget) * 0.7 ? "ahead" : "on-track",
      dailyRequired: Math.max(0.1, Number(((newTarget - newCurrent) / 14).toFixed(1))),
      currentPace: Math.max(0.1, Number((newCurrent / 16).toFixed(1)))
    };

    setGoals([goal, ...goals]);
    setSelectedGoal(goal);
    setIsAddingGoal(false);
    setNewTitle("");
    setNewCurrent(0);
  }

  const overallProgress = Math.round(
    goals.reduce((acc, g) => acc + Math.min(100, (g.current / g.target) * 100), 0) / goals.length
  );

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-gradient-to-r from-brand-navy via-brand-deep to-[#0e3b82] p-6 text-white shadow-xl">
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-cyan/30 bg-brand-cyan/10 px-3 py-1 text-xs font-semibold text-brand-cyan">
            <Target className="h-3.5 w-3.5" />
            Strategic Performance Intelligence
          </div>
          <h2 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">
            Data Analyzer Through Goal
          </h2>
          <p className="mt-1.5 text-sm text-white/75">
            Monitor pace velocities, calculate daily required thresholds, and forecast month-end rank achievement.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            onClick={() => onOpenAi?.("Analyze my current goals and predict my month-end performance")}
            className="brand-gradient border-none font-bold text-brand-navy shadow-lg"
          >
            <Sparkles className="mr-2 h-4 w-4" />
            AI Pace Diagnostic
          </Button>

          {/* Export CSV */}
          <Button
            variant="secondary"
            onClick={() => {
              const rows = goals.map((g) => ({
                "Goal Title": g.title,
                "Category": g.category,
                "Current": g.current,
                "Target": g.target,
                "Unit": g.unit,
                "Deadline": g.deadline,
                "Status": g.status,
                "Daily Required": g.dailyRequired,
                "Current Daily Pace": g.currentPace,
                "Completion %": `${Math.round((g.current / g.target) * 100)}%`,
              }));
              exportToCsv(`MyUpline_GoalAnalytics_${new Date().toISOString().slice(0, 10)}`, rows);
            }}
            className="border-white/20 bg-white/10 hover:bg-white/20 text-white"
          >
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            Export CSV
          </Button>

          {/* Print PDF */}
          <Button
            variant="secondary"
            onClick={() => printSection("goal-analyzer-printable", "Goal Analytics & Month-End Pace Forecast")}
            className="border-white/20 bg-white/10 hover:bg-white/20 text-white"
          >
            <Printer className="mr-2 h-4 w-4" />
            Print / PDF
          </Button>

          <Button
            variant="secondary"
            onClick={() => setIsAddingGoal(!isAddingGoal)}
            className="border-white/20 bg-white/10 hover:bg-white/20 text-white"
          >
            <Plus className="mr-2 h-4 w-4" />
            {isAddingGoal ? "Cancel" : "New Target Goal"}
          </Button>
        </div>
      </div>

      {/* Add Goal Modal / Inline Panel */}
      {isAddingGoal && (
        <Card className="border-brand-blue/30 bg-cyan-50/50 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-brand-navy">Set Up New Strategic Target</h3>
            <span className="text-xs text-slate-500">Tracked in real-time pace engine</span>
          </div>
          <form onSubmit={handleCreateGoal} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Goal Name</label>
              <input
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Fast Track Diamond Volume"
                className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-brand-blue"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Category</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as GoalItem["category"])}
                className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-brand-blue"
              >
                <option value="Recruitment">Recruitment</option>
                <option value="Sales Volume">Sales Volume</option>
                <option value="Team Growth">Team Growth</option>
                <option value="LMS Learning">LMS Learning</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Current Progress</label>
              <input
                type="number"
                value={newCurrent}
                onChange={(e) => setNewCurrent(Number(e.target.value))}
                className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-brand-blue"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Target</label>
              <input
                required
                type="number"
                value={newTarget}
                onChange={(e) => setNewTarget(Number(e.target.value))}
                className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-brand-blue"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Unit Label</label>
              <input
                value={newUnit}
                onChange={(e) => setNewUnit(e.target.value)}
                placeholder="members, ETB, %, pts"
                className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-brand-blue"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Target Deadline</label>
              <input
                value={newDeadline}
                onChange={(e) => setNewDeadline(e.target.value)}
                placeholder="e.g. Jun 30, 2026"
                className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-brand-blue"
              />
            </div>
            <div className="sm:col-span-2 flex items-end justify-end gap-2 pt-2">
              <Button type="button" variant="ghost" onClick={() => setIsAddingGoal(false)}>
                Cancel
              </Button>
              <Button type="submit" className="font-bold">
                Activate Goal Tracker
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Aggregate KPI Strip & Goal Cards */}
      <div id="goal-analyzer-printable" className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-5 border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Aggregate Completion</span>
            <span className="rounded-full bg-cyan-100 p-1.5 text-brand-blue">
              <Target className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-brand-navy">{overallProgress}%</span>
            <span className="text-xs font-semibold text-emerald-600">+14% vs last week</span>
          </div>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full brand-gradient transition-all duration-500"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </Card>

        <Card className="p-5 border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Goals Ahead of Pace</span>
            <span className="rounded-full bg-emerald-100 p-1.5 text-emerald-700">
              <Flame className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-brand-navy">
              {goals.filter((g) => g.status === "ahead").length} of {goals.length}
            </span>
            <span className="text-xs font-semibold text-emerald-600">On-track for bonus</span>
          </div>
          <p className="mt-2 text-xs text-slate-500">Fastest: Monthly Personal Recruits</p>
        </Card>

        <Card className="p-5 border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Velocity Run Rate</span>
            <span className="rounded-full bg-sky-100 p-1.5 text-sky-700">
              <Zap className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-brand-navy">1.25x</span>
            <span className="text-xs font-semibold text-emerald-600">Pacing healthy</span>
          </div>
          <p className="mt-2 text-xs text-slate-500">Requires ~3 recruits/week to maintain</p>
        </Card>

        <Card className="p-5 border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Projected Month-End</span>
            <span className="rounded-full bg-amber-100 p-1.5 text-amber-700">
              <TrendingUp className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-brand-navy">Gold Rank</span>
            <span className="text-xs font-semibold text-brand-blue">96% probability</span>
          </div>
          <p className="mt-2 text-xs text-slate-500">Needs +45k ETB in Group Volume</p>
        </Card>
      </div>

      {/* Main Grid: Goal List and Deep Velocity Analyzer */}
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        {/* Left: Goals List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-brand-navy">Active Target Goals</h3>
              <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-600">
                {filteredGoals.length}
              </span>
            </div>
            <div className="flex gap-1 rounded-lg border border-slate-200 bg-white p-1 text-xs font-semibold text-slate-600">
              {["all", "recruitment", "sales", "team"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFilter(tab)}
                  className={cn(
                    "rounded px-2.5 py-1 capitalize transition",
                    filter === tab ? "brand-gradient text-brand-navy font-bold" : "hover:bg-slate-50"
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {filteredGoals.map((goal) => {
              const pct = Math.min(100, Math.round((goal.current / goal.target) * 100));
              const isSelected = selectedGoal.id === goal.id;

              return (
                <div
                  key={goal.id}
                  onClick={() => setSelectedGoal(goal)}
                  className={cn(
                    "cursor-pointer rounded-xl border p-4 transition-all duration-200 hover:shadow-md",
                    isSelected
                      ? "border-brand-blue bg-cyan-50/40 shadow-sm"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-slate-600">
                          {goal.category}
                        </span>
                        <span
                          className={cn(
                            "rounded-full px-2 py-0.5 text-[11px] font-bold",
                            goal.status === "ahead" && "bg-emerald-100 text-emerald-800",
                            goal.status === "on-track" && "bg-sky-100 text-sky-800",
                            goal.status === "behind" && "bg-amber-100 text-amber-800"
                          )}
                        >
                          {goal.status === "ahead" ? "Ahead of Pace" : goal.status === "on-track" ? "On Track" : "Needs Attention"}
                        </span>
                      </div>
                      <h4 className="mt-1.5 font-bold text-brand-navy">{goal.title}</h4>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-black text-brand-navy">
                        {goal.current.toLocaleString()} / {goal.target.toLocaleString()}
                      </span>
                      <span className="ml-1 text-xs text-slate-500">{goal.unit}</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-slate-500 mb-1">
                      <span>{pct}% achieved</span>
                      <span>Target: {goal.deadline}</span>
                    </div>
                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all duration-500",
                          goal.status === "ahead" ? "bg-emerald-500" : goal.status === "on-track" ? "brand-gradient" : "bg-amber-500"
                        )}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Deep Velocity & AI Pace Analyzer */}
        <Card className="p-6 border-slate-200 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Detailed Pace Diagnostics</span>
              <h3 className="text-lg font-black text-brand-navy">{selectedGoal.title}</h3>
            </div>
            <span
              className={cn(
                "rounded-full px-3 py-1 text-xs font-bold",
                selectedGoal.status === "ahead" ? "bg-emerald-100 text-emerald-800" : "bg-sky-100 text-sky-800"
              )}
            >
              Target: {selectedGoal.deadline}
            </span>
          </div>

          {/* Velocity Gauges */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <span className="text-xs text-slate-500 font-medium">Current Pace</span>
              <p className="mt-1 text-2xl font-black text-brand-navy">
                {selectedGoal.currentPace} <span className="text-xs font-normal text-slate-500">/ day</span>
              </p>
              <p className="mt-1 text-xs text-emerald-600 font-semibold">Active run rate</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <span className="text-xs text-slate-500 font-medium">Required Pace</span>
              <p className="mt-1 text-2xl font-black text-brand-navy">
                {selectedGoal.dailyRequired} <span className="text-xs font-normal text-slate-500">/ day</span>
              </p>
              <p className="mt-1 text-xs text-slate-500 font-semibold">To hit deadline</p>
            </div>
          </div>

          {/* Forecast Analysis Box */}
          <div className="rounded-xl border border-brand-cyan/40 bg-gradient-to-br from-cyan-50/60 to-white p-4">
            <div className="flex items-center gap-2 text-sm font-bold text-brand-navy">
              <Sparkles className="h-4 w-4 text-brand-cyan" />
              AI Strategic Forecast
            </div>
            <p className="mt-2 text-xs leading-relaxed text-slate-700">
              {selectedGoal.status === "ahead"
                ? `You are running ${Math.round((selectedGoal.currentPace / selectedGoal.dailyRequired) * 100 - 100)}% faster than required! At this velocity, you will surpass ${selectedGoal.target.toLocaleString()} ${selectedGoal.unit} 4 days ahead of schedule.`
                : selectedGoal.status === "on-track"
                ? `You are right on track. Keep up the daily rhythm of ${selectedGoal.dailyRequired} ${selectedGoal.unit} to lock in achievement by ${selectedGoal.deadline}.`
                : `Pace bottleneck detected: your current pace (${selectedGoal.currentPace}/day) is below the required ${selectedGoal.dailyRequired}/day. Recommended action: activate downline follow-up sequence #3.`}
            </p>
            <div className="mt-3 flex items-center justify-between pt-2 border-t border-cyan-100">
              <span className="text-[11px] font-semibold text-slate-500">Confidence Rating: 94%</span>
              <button
                onClick={() =>
                  onOpenAi?.(
                    `Give me a detailed step-by-step action plan to reach ${selectedGoal.target} ${selectedGoal.unit} for "${selectedGoal.title}".`
                  )
                }
                className="inline-flex items-center text-xs font-bold text-brand-blue hover:underline"
              >
                Ask AI Strategist <ChevronRight className="h-3 w-3 ml-0.5" />
              </button>
            </div>
          </div>

          {/* Action Steps */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
              Recommended Pace Accelerators
            </h4>
            <div className="space-y-2">
              <div className="flex items-start gap-2.5 rounded-lg border border-slate-100 bg-slate-50 p-2.5 text-xs">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
                <span className="text-slate-700">
                  Mobilize top 3 team leaders to run a 48-hour recruitment blitz.
                </span>
              </div>
              <div className="flex items-start gap-2.5 rounded-lg border border-slate-100 bg-slate-50 p-2.5 text-xs">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
                <span className="text-slate-700">
                  Deploy Promotional Flyers to highlight new rank achievers on Telegram & WhatsApp.
                </span>
              </div>
              <div className="flex items-start gap-2.5 rounded-lg border border-slate-100 bg-slate-50 p-2.5 text-xs">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
                <span className="text-slate-700">
                  Review Level-2 downline members with pending KYC or uncontacted leads.
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>
      </div>
    </div>
  );
}
