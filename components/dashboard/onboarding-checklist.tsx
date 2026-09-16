"use client";

import { useState, useEffect } from "react";
import {
  BookOpen,
  Check,
  CheckCircle2,
  ClipboardCheck,
  GraduationCap,
  Star,
  Target,
  Trophy,
  UserRound,
  X,
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "myupline.onboarding_checklist";
const DISMISSED_KEY = "myupline.onboarding_dismissed";

interface ChecklistStep {
  id: string;
  icon: typeof Check;
  label: string;
  description: string;
  action: string;
  view: string;
}

const steps: ChecklistStep[] = [
  {
    id: "profile",
    icon: UserRound,
    label: "Complete Your Profile",
    description: "Add your photo, bio, phone, and city to unlock your digital IBO ID.",
    action: "Go to Profile",
    view: "profile"
  },
  {
    id: "booklet",
    icon: ClipboardCheck,
    label: "Fill the Getting Started Booklet",
    description: "Complete all 6 pages of your official onboarding form with your upline sponsor.",
    action: "Open Booklet",
    view: "after-sales"
  },
  {
    id: "contacts",
    icon: BookOpen,
    label: "Add Your First 5 Contacts",
    description: "Write down 5 people you know who could benefit from Breakthrough Share Company.",
    action: "Open Name List",
    view: "name-list"
  },
  {
    id: "training",
    icon: GraduationCap,
    label: "Watch Your First Training Video",
    description: "Complete the Foundation Orientation course in the Training Academy.",
    action: "Go to Academy",
    view: "training-hub"
  },
  {
    id: "goal",
    icon: Target,
    label: "Set Your 30-Day Goal",
    description: "Define your first milestone target on your Dream & Goal Board.",
    action: "Set My Goal",
    view: "dream-goal-board"
  }
];

interface OnboardingChecklistProps {
  onNavigate: (view: string) => void;
  userName?: string;
}

export function OnboardingChecklist({ onNavigate, userName }: OnboardingChecklistProps) {
  const [completed, setCompleted] = useState<Record<string, boolean>>({});
  const [isDismissed, setIsDismissed] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try { setCompleted(JSON.parse(saved)); } catch {}
    }
    const dismissed = window.localStorage.getItem(DISMISSED_KEY);
    if (dismissed === "true") setIsDismissed(true);
  }, []);

  function toggleStep(id: string) {
    setCompleted((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }

  function dismiss() {
    setIsDismissed(true);
    window.localStorage.setItem(DISMISSED_KEY, "true");
  }

  const completedCount = Object.values(completed).filter(Boolean).length;
  const total = steps.length;
  const percentage = Math.round((completedCount / total) * 100);
  const isAllDone = completedCount === total;

  if (isDismissed) return null;

  return (
    <div
      id="onboarding-checklist"
      className={cn(
        "rounded-2xl border bg-white shadow-sm overflow-hidden transition-all duration-300",
        isAllDone ? "border-emerald-300" : "border-slate-200"
      )}
    >
      {/* Header */}
      <div
        className={cn(
          "flex cursor-pointer items-center justify-between px-5 py-4",
          isAllDone
            ? "bg-gradient-to-r from-emerald-50 to-teal-50"
            : "bg-gradient-to-r from-cyan-50 to-blue-50"
        )}
        onClick={() => setIsCollapsed((c) => !c)}
      >
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl shadow-sm",
              isAllDone ? "bg-emerald-500 text-white" : "bg-brand-navy text-white"
            )}
          >
            {isAllDone ? <Trophy className="h-5 w-5" /> : <Zap className="h-5 w-5" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-black text-slate-900">
                {isAllDone
                  ? "🎉 Onboarding Complete!"
                  : `Welcome${userName ? `, ${userName.split(" ")[0]}` : ""}! Get Started`}
              </h3>
              {!isAllDone && (
                <span className="rounded-full bg-brand-navy px-2 py-0.5 text-[10px] font-black text-white">
                  {completedCount}/{total}
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {isAllDone
                ? "You've completed all onboarding steps. You're officially ready to grow!"
                : "Complete these steps to activate your full IBO journey."}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Progress Ring */}
          <div className="relative h-10 w-10">
            <svg viewBox="0 0 36 36" className="-rotate-90 h-10 w-10">
              <circle
                cx="18" cy="18" r="15.9"
                fill="none"
                stroke="#e2e8f0"
                strokeWidth="3"
              />
              <circle
                cx="18" cy="18" r="15.9"
                fill="none"
                stroke={isAllDone ? "#10b981" : "#16D4FF"}
                strokeWidth="3"
                strokeDasharray={`${percentage} ${100 - percentage}`}
                strokeDashoffset="0"
                strokeLinecap="round"
                className="transition-all duration-700"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-slate-700">
              {percentage}%
            </span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              dismiss();
            }}
            className="ml-1 text-slate-400 hover:text-slate-600 transition"
            title="Dismiss checklist"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Progress bar */}
      {!isCollapsed && (
        <div className="h-1.5 bg-slate-100">
          <div
            className={cn(
              "h-1.5 transition-all duration-700",
              isAllDone ? "bg-emerald-500" : "bg-gradient-to-r from-cyan-400 to-blue-500"
            )}
            style={{ width: `${percentage}%` }}
          />
        </div>
      )}

      {/* Steps */}
      {!isCollapsed && (
        <ul className="divide-y divide-slate-50 px-0">
          {steps.map((step, i) => {
            const Icon = step.icon;
            const isDone = !!completed[step.id];
            return (
              <li
                key={step.id}
                className={cn(
                  "flex items-center gap-4 px-5 py-3.5 transition hover:bg-slate-50/80",
                  isDone && "opacity-75"
                )}
              >
                {/* Number / Check */}
                <button
                  onClick={() => toggleStep(step.id)}
                  className={cn(
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 text-xs font-black transition",
                    isDone
                      ? "border-emerald-400 bg-emerald-400 text-white"
                      : "border-slate-300 text-slate-400 hover:border-cyan-400 hover:text-cyan-600"
                  )}
                  title={isDone ? "Mark as incomplete" : "Mark as complete"}
                >
                  {isDone ? <Check className="h-3.5 w-3.5 stroke-[3]" /> : <span>{i + 1}</span>}
                </button>

                {/* Icon */}
                <div
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                    isDone ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-600"
                  )}
                >
                  <Icon className="h-4 w-4" />
                </div>

                {/* Text */}
                <div className="min-w-0 flex-1">
                  <p
                    className={cn(
                      "text-xs font-bold",
                      isDone ? "text-slate-400 line-through" : "text-slate-800"
                    )}
                  >
                    {step.label}
                  </p>
                  {!isDone && (
                    <p className="text-[11px] text-slate-400 leading-snug mt-0.5">
                      {step.description}
                    </p>
                  )}
                </div>

                {/* CTA */}
                {!isDone && (
                  <button
                    onClick={() => onNavigate(step.view)}
                    className="shrink-0 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[10px] font-black text-brand-navy shadow-sm hover:border-cyan-400 hover:bg-cyan-50 hover:text-cyan-700 transition whitespace-nowrap"
                  >
                    {step.action}
                  </button>
                )}
                {isDone && (
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />
                )}
              </li>
            );
          })}
        </ul>
      )}

      {isAllDone && !isCollapsed && (
        <div className="flex items-center gap-3 bg-emerald-50 px-5 py-3 border-t border-emerald-100">
          <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
          <p className="text-xs font-bold text-emerald-700">
            Congratulations! You have completed all onboarding steps. Your IBO journey has officially begun!
          </p>
        </div>
      )}
    </div>
  );
}
