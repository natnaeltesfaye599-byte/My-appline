"use client";

import { useState } from "react";
import {
  ArrowRight,
  Calendar,
  Car,
  CheckCircle2,
  ChevronRight,
  Clock,
  Compass,
  DollarSign,
  Edit3,
  ExternalLink,
  FileSpreadsheet,
  Flame,
  Globe,
  Heart,
  Home,
  Image as ImageIcon,
  Layers,
  Maximize2,
  Milestone,
  Plus,
  Printer,
  Rocket,
  Search,
  Sparkles,
  Star,
  Target,
  Trash2,
  Trophy,
  Upload,
  Zap
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { exportToCsv, printSection } from "@/lib/export-utils";

// Types for Dream Board
export interface DreamItem {
  id: string;
  title: string;
  category: "Home" | "Vehicle" | "Travel" | "Wealth" | "Family & Charity";
  imageUrl: string;
  targetYear: string;
  estimatedCost: string;
  whyItMatters: string;
  status: "dreaming" | "in-action" | "achieved";
  linkedGoalId?: string;
}

// Types for Goal Board
export interface GoalCardItem {
  id: string;
  title: string;
  timeframe: "30-Day" | "90-Day" | "1-Year";
  category: "Recruitment" | "Rank" | "Volume" | "Personal Growth";
  targetMetric: string;
  currentMetric: string;
  percent: number;
  deadline: string;
  status: "todo" | "in-progress" | "achieved";
  linkedDreamTitle?: string;
  dailyHabits: string[];
}

const initialDreams: DreamItem[] = [
  {
    id: "d-1",
    title: "Luxury Hillside Villa in Addis Ababa",
    category: "Home",
    imageUrl: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop&q=80",
    targetYear: "December 2027",
    estimatedCost: "ETB 18,000,000",
    whyItMatters: "To give my family generational security, peaceful living, and space to host our team leaders.",
    status: "in-action",
    linkedGoalId: "g-2"
  },
  {
    id: "d-2",
    title: "Mercedes-Benz AMG G63",
    category: "Vehicle",
    imageUrl: "https://images.unsplash.com/photo-1520050206274-a1ae44613e6d?w=800&auto=format&fit=crop&q=80",
    targetYear: "June 2027",
    estimatedCost: "ETB 9,500,000",
    whyItMatters: "Symbol of leadership excellence and tangible proof to my downline that hard work creates freedom.",
    status: "in-action",
    linkedGoalId: "g-1"
  },
  {
    id: "d-3",
    title: "All-Expense Family Vacation to Maldives",
    category: "Travel",
    imageUrl: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&auto=format&fit=crop&q=80",
    targetYear: "December 2026",
    estimatedCost: "ETB 750,000",
    whyItMatters: "To celebrate our collective milestones and give my parents their first luxury overseas retreat.",
    status: "in-action",
    linkedGoalId: "g-3"
  },
  {
    id: "d-4",
    title: "Sponsor 100 Students with Full Scholarships",
    category: "Family & Charity",
    imageUrl: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&auto=format&fit=crop&q=80",
    targetYear: "March 2028",
    estimatedCost: "ETB 2,000,000",
    whyItMatters: "Lifting our community through education and mentorship is the ultimate purpose of our success.",
    status: "dreaming"
  }
];

const initialGoalCards: GoalCardItem[] = [
  {
    id: "g-1",
    title: "Promote to Diamond Director Rank",
    timeframe: "90-Day",
    category: "Rank",
    targetMetric: "Rank 5",
    currentMetric: "Gold Director (Rank 3)",
    percent: 68,
    deadline: "September 30, 2026",
    status: "in-progress",
    linkedDreamTitle: "Mercedes-Benz AMG G63",
    dailyHabits: ["3 Opportunity presentations/day", "Weekly team duplication webinar", "Review Level 1 & 2 volumes"]
  },
  {
    id: "g-2",
    title: "Hit ETB 1,500,000 Monthly Team Volume",
    timeframe: "1-Year",
    category: "Volume",
    targetMetric: "ETB 1,500,000 GV",
    currentMetric: "ETB 620,000 GV",
    percent: 41,
    deadline: "December 31, 2026",
    status: "in-progress",
    linkedDreamTitle: "Luxury Hillside Villa",
    dailyHabits: ["Track group volume daily", "Coach 5 Team Leaders on recruitment", "Close 2 corporate packages"]
  },
  {
    id: "g-3",
    title: "Recruit 25 High-Caliber Direct Leaders",
    timeframe: "30-Day",
    category: "Recruitment",
    targetMetric: "25 Enrollees",
    currentMetric: "18 Enrollees",
    percent: 72,
    deadline: "June 30, 2026",
    status: "in-progress",
    linkedDreamTitle: "Maldives Family Vacation",
    dailyHabits: ["10 Outreach conversations daily", "Send promotional flyers to prospects", "Immediate same-day follow-up"]
  },
  {
    id: "g-4",
    title: "Complete Advanced Leadership Certification",
    timeframe: "30-Day",
    category: "Personal Growth",
    targetMetric: "10 LMS Modules",
    currentMetric: "10 LMS Modules",
    percent: 100,
    deadline: "June 15, 2026",
    status: "achieved",
    dailyHabits: ["Study 45 mins every morning", "Apply 1 technique with downline daily"]
  }
];

export function DreamGoalBoard({
  onOpenAi
}: {
  onOpenAi?: (prompt: string) => void;
}) {
  const [activeTab, setActiveTab] = useState<"split" | "dream" | "goal">("split");
  const [dreams, setDreams] = useState<DreamItem[]>(initialDreams);
  const [goals, setGoals] = useState<GoalCardItem[]>(initialGoalCards);

  // Modal states
  const [isAddingDream, setIsAddingDream] = useState(false);
  const [isAddingGoal, setIsAddingGoal] = useState(false);

  // New Dream Form
  const [dreamTitle, setDreamTitle] = useState("");
  const [dreamCategory, setDreamCategory] = useState<DreamItem["category"]>("Home");
  const [dreamImg, setDreamImg] = useState("");
  const [dreamCost, setDreamCost] = useState("");
  const [dreamTargetYear, setDreamTargetYear] = useState("2027");
  const [dreamWhy, setDreamWhy] = useState("");

  // New Goal Form
  const [goalTitle, setGoalTitle] = useState("");
  const [goalTimeframe, setGoalTimeframe] = useState<GoalCardItem["timeframe"]>("90-Day");
  const [goalCategory, setGoalCategory] = useState<GoalCardItem["category"]>("Rank");
  const [goalTarget, setGoalTarget] = useState("");
  const [goalCurrent, setGoalCurrent] = useState("");
  const [goalDeadline, setGoalDeadline] = useState("September 30, 2026");
  const [goalHabits, setGoalHabits] = useState("");

  function handleAddDream(e: React.FormEvent) {
    e.preventDefault();
    if (!dreamTitle.trim()) return;

    const newDream: DreamItem = {
      id: `d-${Date.now()}`,
      title: dreamTitle,
      category: dreamCategory,
      imageUrl: dreamImg.trim() || "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop&q=80",
      targetYear: dreamTargetYear,
      estimatedCost: dreamCost || "Priceless",
      whyItMatters: dreamWhy || "Core vision for personal and family freedom.",
      status: "in-action"
    };

    setDreams([newDream, ...dreams]);
    setIsAddingDream(false);
    setDreamTitle("");
    setDreamImg("");
    setDreamCost("");
    setDreamWhy("");
  }

  function handleAddGoal(e: React.FormEvent) {
    e.preventDefault();
    if (!goalTitle.trim()) return;

    const habitList = goalHabits
      ? goalHabits.split(",").map((h) => h.trim()).filter(Boolean)
      : ["Daily outreach", "Team check-in"];

    const newGoal: GoalCardItem = {
      id: `g-${Date.now()}`,
      title: goalTitle,
      timeframe: goalTimeframe,
      category: goalCategory,
      targetMetric: goalTarget || "100%",
      currentMetric: goalCurrent || "0%",
      percent: 15,
      deadline: goalDeadline,
      status: "in-progress",
      dailyHabits: habitList
    };

    setGoals([newGoal, ...goals]);
    setIsAddingGoal(false);
    setGoalTitle("");
    setGoalTarget("");
    setGoalCurrent("");
    setGoalHabits("");
  }

  function handleToggleGoalStatus(goalId: string) {
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id !== goalId) return g;
        const nextStatus = g.status === "achieved" ? "in-progress" : "achieved";
        return {
          ...g,
          status: nextStatus,
          percent: nextStatus === "achieved" ? 100 : g.percent === 100 ? 75 : g.percent
        };
      })
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-gradient-to-r from-brand-navy via-brand-deep to-[#0e3b82] p-6 text-white shadow-xl">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-400/10 px-3 py-1 text-xs font-semibold text-amber-300">
            <Sparkles className="h-3.5 w-3.5" />
            Vision & Execution Alignment System
          </div>
          <h2 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">
            Dream Board & Goal Board
          </h2>
          <p className="mt-1 text-sm text-white/75">
            Turn your biggest life aspirations (<strong>Dream Board</strong>) into structured, actionable business milestones (<strong>Goal Board</strong>).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* AI Strategy Generator */}
          <Button
            onClick={() =>
              onOpenAi?.(
                "I want to align my Dream Board (Dream Home, Luxury Car, Vacation) with my Goal Board. Reverse engineer the exact team size, monthly volume (GV), and daily habits required to achieve them."
              )
            }
            className="brand-gradient font-black text-brand-navy shadow-lg"
          >
            <Sparkles className="mr-2 h-4 w-4" />
            AI Dream Engine
          </Button>

          {/* Export CSV */}
          <Button
            variant="secondary"
            onClick={() => {
              if (activeTab === "dream") {
                const rows = dreams.map((d) => ({
                  "Dream Title": d.title,
                  "Category": d.category,
                  "Target Year": d.targetYear,
                  "Estimated Cost": d.estimatedCost,
                  "Why It Matters": d.whyItMatters,
                  "Status": d.status,
                }));
                exportToCsv(`MyUpline_DreamBoard_${new Date().toISOString().slice(0, 10)}`, rows);
              } else {
                const rows = goals.map((g) => ({
                  "Goal Title": g.title,
                  "Timeframe": g.timeframe,
                  "Category": g.category,
                  "Target Metric": g.targetMetric,
                  "Current Metric": g.currentMetric,
                  "Progress %": `${g.percent}%`,
                  "Deadline": g.deadline,
                  "Status": g.status,
                }));
                exportToCsv(`MyUpline_GoalBoard_${new Date().toISOString().slice(0, 10)}`, rows);
              }
            }}
            className="border-white/20 bg-white/10 hover:bg-white/20 text-white"
          >
            <FileSpreadsheet className="mr-1.5 h-4 w-4" /> Export CSV
          </Button>

          {/* Print Board */}
          <Button
            variant="secondary"
            onClick={() => {
              const targetId = activeTab === "goal" ? "goal-action-board-printable" : "dream-vision-board-printable";
              const title = activeTab === "goal" ? "Milestone Goal Board & Action Blueprint" : "Official Dream Board & Life Vision Canvas";
              printSection(targetId, title);
            }}
            className="border-white/20 bg-white/10 hover:bg-white/20 text-white"
          >
            <Printer className="mr-1.5 h-4 w-4" /> Print / PDF
          </Button>

          {/* New Dream Button */}
          <Button
            variant="secondary"
            onClick={() => setIsAddingDream(true)}
            className="border-white/20 bg-white/10 hover:bg-white/20 text-white"
          >
            <Plus className="mr-1.5 h-4 w-4" /> Add Dream
          </Button>

          {/* New Goal Button */}
          <Button
            variant="secondary"
            onClick={() => setIsAddingGoal(true)}
            className="border-white/20 bg-white/10 hover:bg-white/20 text-white"
          >
            <Plus className="mr-1.5 h-4 w-4" /> Add Goal
          </Button>
        </div>
      </div>

      {/* View Switcher: Split Side-by-Side vs Dedicated Dream / Goal */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div className="flex items-center gap-1 rounded-xl bg-slate-100 p-1">
          <button
            onClick={() => setActiveTab("split")}
            className={cn(
              "flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-black transition",
              activeTab === "split"
                ? "bg-white text-brand-navy shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            )}
          >
            <Compass className="h-3.5 w-3.5 text-brand-blue" />
            Side-by-Side (Dream | Goal)
          </button>
          <button
            onClick={() => setActiveTab("dream")}
            className={cn(
              "flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-black transition",
              activeTab === "dream"
                ? "bg-white text-brand-navy shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            )}
          >
            <Star className="h-3.5 w-3.5 text-amber-500" />
            Dream Board ({dreams.length})
          </button>
          <button
            onClick={() => setActiveTab("goal")}
            className={cn(
              "flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-black transition",
              activeTab === "goal"
                ? "bg-white text-brand-navy shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            )}
          >
            <Target className="h-3.5 w-3.5 text-emerald-600" />
            Goal Board ({goals.length})
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-500">
          <span>Vision fuels execution; execution realizes vision.</span>
        </div>
      </div>

      {/* Content Layout */}
      <div
        className={cn(
          "grid gap-6",
          activeTab === "split" ? "lg:grid-cols-2" : "grid-cols-1"
        )}
      >
        {/* ========================================================= */}
        {/* LEFT / FIRST SECTION: DREAM BOARD                        */}
        {/* ========================================================= */}
        {(activeTab === "split" || activeTab === "dream") && (
          <div id="dream-vision-board-printable" className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-400 to-amber-600 text-brand-navy font-bold shadow-md">
                  <Star className="h-4 w-4 fill-brand-navy" />
                </div>
                <div>
                  <h3 className="font-black text-brand-navy text-lg">Dream Board (Vision)</h3>
                  <p className="text-xs text-slate-500">Your emotional fuel & long-term aspirations</p>
                </div>
              </div>

              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsAddingDream(true)}
                className="h-8 border border-slate-200 text-xs font-bold text-slate-700 bg-white"
              >
                <Plus className="mr-1 h-3.5 w-3.5" /> New Dream
              </Button>
            </div>

            {/* Dream Cards Grid */}
            <div
              className={cn(
                "grid gap-4",
                activeTab === "dream" ? "sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1 sm:grid-cols-2"
              )}
            >
              {dreams.map((dream) => (
                <Card
                  key={dream.id}
                  className="group relative overflow-hidden border-slate-200 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                >
                  {/* Image Aspect Box */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-900">
                    <img
                      src={dream.imageUrl}
                      alt={dream.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    {/* Category Pill */}
                    <span className="absolute left-3 top-3 rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-amber-300 backdrop-blur border border-white/20">
                      {dream.category}
                    </span>

                    {/* Target Date Pill */}
                    <span className="absolute right-3 top-3 rounded-full bg-brand-navy/80 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur border border-white/20">
                      {dream.targetYear}
                    </span>

                    {/* Bottom overlay text */}
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <p className="font-mono text-xs font-bold text-brand-green">
                        {dream.estimatedCost}
                      </p>
                      <h4 className="font-black text-sm sm:text-base leading-snug drop-shadow-md">
                        {dream.title}
                      </h4>
                    </div>
                  </div>

                  {/* Why It Matters Box */}
                  <div className="p-4 space-y-3 bg-white">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Why This Matters:
                      </span>
                      <p className="mt-0.5 text-xs text-slate-600 italic leading-relaxed">
                        "{dream.whyItMatters}"
                      </p>
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
                      <span className="inline-flex items-center gap-1 font-bold text-amber-600">
                        <Flame className="h-3.5 w-3.5 text-amber-500" />
                        In Active Pursuit
                      </span>

                      <button
                        onClick={() =>
                          onOpenAi?.(
                            `Break down the dream "${dream.title}" (Estimated cost: ${dream.estimatedCost}, Target: ${dream.targetYear}) into a 90-day actionable network marketing plan with exact personal and group volume targets.`
                          )
                        }
                        className="inline-flex items-center gap-1 font-bold text-brand-blue hover:underline text-xs"
                      >
                        Plan With AI <ChevronRight className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* RIGHT / SECOND SECTION: GOAL BOARD                        */}
        {/* ========================================================= */}
        {(activeTab === "split" || activeTab === "goal") && (
          <div id="goal-action-board-printable" className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-400 to-teal-600 text-brand-navy font-bold shadow-md">
                  <Target className="h-4 w-4 text-brand-navy" />
                </div>
                <div>
                  <h3 className="font-black text-brand-navy text-lg">Goal Board (Action)</h3>
                  <p className="text-xs text-slate-500">Structured execution milestones & daily habits</p>
                </div>
              </div>

              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsAddingGoal(true)}
                className="h-8 border border-slate-200 text-xs font-bold text-slate-700 bg-white"
              >
                <Plus className="mr-1 h-3.5 w-3.5" /> New Goal
              </Button>
            </div>

            {/* Goal Cards List */}
            <div className="space-y-3.5">
              {goals.map((goal) => {
                const isComplete = goal.status === "achieved";
                return (
                  <Card
                    key={goal.id}
                    className={cn(
                      "p-4 border transition-all duration-200",
                      isComplete
                        ? "border-emerald-200 bg-emerald-50/40"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    )}
                  >
                    {/* Header Row */}
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="rounded bg-brand-navy px-2 py-0.5 text-[10px] font-bold text-brand-cyan uppercase">
                            {goal.timeframe}
                          </span>
                          <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600 uppercase">
                            {goal.category}
                          </span>
                          {goal.linkedDreamTitle && (
                            <span className="text-[11px] font-semibold text-amber-600 flex items-center gap-1">
                              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                              Funds: {goal.linkedDreamTitle}
                            </span>
                          )}
                        </div>
                        <h4 className="mt-1.5 font-bold text-brand-navy text-sm sm:text-base">
                          {goal.title}
                        </h4>
                      </div>

                      <button
                        onClick={() => handleToggleGoalStatus(goal.id)}
                        className={cn(
                          "flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-xs font-bold transition",
                          isComplete
                            ? "bg-emerald-600 text-white"
                            : "border border-slate-200 bg-slate-50 text-slate-600 hover:border-emerald-300 hover:text-emerald-700"
                        )}
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        {isComplete ? "Achieved!" : "Mark Done"}
                      </button>
                    </div>

                    {/* Progress Bar & Metrics */}
                    <div className="mt-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-semibold text-slate-700">
                          {goal.currentMetric} / {goal.targetMetric}
                        </span>
                        <span className="font-bold text-brand-blue">{goal.percent}%</span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                        <div
                          className={cn(
                            "h-full rounded-full transition-all duration-500",
                            isComplete ? "bg-emerald-500" : "brand-gradient"
                          )}
                          style={{ width: `${goal.percent}%` }}
                        />
                      </div>
                    </div>

                    {/* Daily Execution Habits Checklist */}
                    <div className="mt-3.5 border-t border-slate-100 pt-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Daily Execution Habits:
                      </span>
                      <div className="mt-1.5 flex flex-wrap gap-1.5">
                        {goal.dailyHabits.map((habit, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-medium text-slate-700"
                          >
                            <Zap className="h-3 w-3 text-amber-500" />
                            {habit}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Footer Date */}
                    <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500">
                      <span>Target Deadline: {goal.deadline}</span>
                      <button
                        onClick={() =>
                          onOpenAi?.(
                            `How can I accelerate my progress on this goal: "${goal.title}" (Currently ${goal.currentMetric} of ${goal.targetMetric}, Deadline: ${goal.deadline})?`
                          )
                        }
                        className="font-bold text-brand-blue hover:underline flex items-center gap-0.5"
                      >
                        Pace Advice <ChevronRight className="h-3 w-3" />
                      </button>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* MODAL: ADD DREAM                                         */}
      {/* ========================================================= */}
      {isAddingDream && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-in fade-in">
          <Card className="w-full max-w-lg p-6 bg-white shadow-2xl border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-black text-brand-navy">Add to Dream Board</h3>
              <button
                onClick={() => setIsAddingDream(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddDream} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                  Dream Title
                </label>
                <input
                  required
                  value={dreamTitle}
                  onChange={(e) => setDreamTitle(e.target.value)}
                  placeholder="e.g. Dream House, Luxury Car, World Tour"
                  className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-brand-blue"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                    Category
                  </label>
                  <select
                    value={dreamCategory}
                    onChange={(e) => setDreamCategory(e.target.value as DreamItem["category"])}
                    className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-brand-blue"
                  >
                    <option value="Home">Home & Property</option>
                    <option value="Vehicle">Luxury Vehicle</option>
                    <option value="Travel">Travel & Lifestyle</option>
                    <option value="Wealth">Financial Freedom</option>
                    <option value="Family & Charity">Family & Charity</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                    Target Date / Year
                  </label>
                  <input
                    value={dreamTargetYear}
                    onChange={(e) => setDreamTargetYear(e.target.value)}
                    placeholder="e.g. December 2027"
                    className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-brand-blue"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                  Estimated Cost (ETB / USD)
                </label>
                <input
                  value={dreamCost}
                  onChange={(e) => setDreamCost(e.target.value)}
                  placeholder="e.g. ETB 10,000,000"
                  className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-brand-blue"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                  Image URL (Inspiring Visual)
                </label>
                <input
                  value={dreamImg}
                  onChange={(e) => setDreamImg(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-brand-blue"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                  Why It Matters (Emotional Driver)
                </label>
                <textarea
                  rows={2}
                  value={dreamWhy}
                  onChange={(e) => setDreamWhy(e.target.value)}
                  placeholder="Why does this dream matter to you and your family?"
                  className="w-full rounded-lg border border-slate-200 p-2.5 text-sm outline-none focus:border-brand-blue"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <Button type="button" variant="ghost" onClick={() => setIsAddingDream(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="brand-gradient font-bold text-brand-navy">
                  Pin to Dream Board
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: ADD GOAL                                          */}
      {/* ========================================================= */}
      {isAddingGoal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-in fade-in">
          <Card className="w-full max-w-lg p-6 bg-white shadow-2xl border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-black text-brand-navy">Add to Goal Board</h3>
              <button
                onClick={() => setIsAddingGoal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddGoal} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                  Goal Title
                </label>
                <input
                  required
                  value={goalTitle}
                  onChange={(e) => setGoalTitle(e.target.value)}
                  placeholder="e.g. Recruit 30 Direct Leaders"
                  className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-brand-blue"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                    Timeframe
                  </label>
                  <select
                    value={goalTimeframe}
                    onChange={(e) => setGoalTimeframe(e.target.value as GoalCardItem["timeframe"])}
                    className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-brand-blue"
                  >
                    <option value="30-Day">30-Day Sprint</option>
                    <option value="90-Day">90-Day Quarter</option>
                    <option value="1-Year">1-Year Milestone</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                    Category
                  </label>
                  <select
                    value={goalCategory}
                    onChange={(e) => setGoalCategory(e.target.value as GoalCardItem["category"])}
                    className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-brand-blue"
                  >
                    <option value="Recruitment">Recruitment</option>
                    <option value="Rank">Rank Promotion</option>
                    <option value="Volume">Group Volume (GV)</option>
                    <option value="Personal Growth">Personal Growth & LMS</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                    Current Metric
                  </label>
                  <input
                    value={goalCurrent}
                    onChange={(e) => setGoalCurrent(e.target.value)}
                    placeholder="e.g. 5 Enrollees"
                    className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-brand-blue"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                    Target Metric
                  </label>
                  <input
                    value={goalTarget}
                    onChange={(e) => setGoalTarget(e.target.value)}
                    placeholder="e.g. 30 Enrollees"
                    className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-brand-blue"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                  Target Deadline
                </label>
                <input
                  value={goalDeadline}
                  onChange={(e) => setGoalDeadline(e.target.value)}
                  placeholder="e.g. September 30, 2026"
                  className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-brand-blue"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                  Daily Habits (comma separated)
                </label>
                <input
                  value={goalHabits}
                  onChange={(e) => setGoalHabits(e.target.value)}
                  placeholder="e.g. 5 Calls/day, 1 Team presentation, 30 min reading"
                  className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-brand-blue"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <Button type="button" variant="ghost" onClick={() => setIsAddingGoal(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="brand-gradient font-bold text-brand-navy">
                  Activate Goal
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
