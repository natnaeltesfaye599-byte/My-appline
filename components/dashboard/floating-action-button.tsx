"use client";

import { useState } from "react";
import {
  Activity,
  ClipboardCheck,
  Plus,
  Sparkles,
  UserPlus,
  X,
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";

interface FabAction {
  id: string;
  label: string;
  icon: typeof Plus;
  color: string;
  textColor: string;
  onClick: () => void;
}

interface FloatingActionButtonProps {
  onNavigate: (view: string) => void;
  onOpenAi: () => void;
}

export function FloatingActionButton({
  onNavigate,
  onOpenAi
}: FloatingActionButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const actions: FabAction[] = [
    {
      id: "ai",
      label: "Ask AI Strategist",
      icon: Sparkles,
      color: "bg-gradient-to-r from-cyan-400 to-blue-500",
      textColor: "text-white",
      onClick: () => {
        onOpenAi();
        setIsOpen(false);
      }
    },
    {
      id: "add-contact",
      label: "Add to Name List",
      icon: UserPlus,
      color: "bg-emerald-500",
      textColor: "text-white",
      onClick: () => {
        onNavigate("name-list");
        setIsOpen(false);
      }
    },
    {
      id: "log-activity",
      label: "Log Daily Activity",
      icon: Activity,
      color: "bg-purple-500",
      textColor: "text-white",
      onClick: () => {
        onNavigate("daily-activity");
        setIsOpen(false);
      }
    },
    {
      id: "booklet",
      label: "Getting Started Form",
      icon: ClipboardCheck,
      color: "bg-amber-500",
      textColor: "text-white",
      onClick: () => {
        onNavigate("after-sales");
        setIsOpen(false);
      }
    }
  ];

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col-reverse items-end gap-3">
      {/* Action Items */}
      {isOpen &&
        actions.map((action, i) => {
          const Icon = action.icon;
          return (
            <div
              key={action.id}
              className="flex items-center gap-2.5"
              style={{
                animationDelay: `${i * 40}ms`,
                animation: "fabItemIn 0.2s ease forwards"
              }}
            >
              <span className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 shadow-lg whitespace-nowrap">
                {action.label}
              </span>
              <button
                onClick={action.onClick}
                className={cn(
                  "flex h-11 w-11 shrink-0 items-center justify-center rounded-full shadow-xl transition-all duration-200 hover:scale-110",
                  action.color,
                  action.textColor
                )}
                title={action.label}
              >
                <Icon className="h-4 w-4" />
              </button>
            </div>
          );
        })}

      {/* Main FAB Button */}
      <button
        id="floating-action-btn"
        onClick={() => setIsOpen((prev) => !prev)}
        className={cn(
          "flex h-14 w-14 items-center justify-center rounded-full shadow-2xl transition-all duration-300",
          isOpen
            ? "bg-slate-800 text-white rotate-45 shadow-slate-800/40"
            : "brand-gradient text-brand-navy hover:scale-110 shadow-cyan-400/30"
        )}
        title={isOpen ? "Close menu" : "Quick Actions"}
        aria-label={isOpen ? "Close quick actions" : "Open quick actions"}
        aria-expanded={isOpen}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Zap className="h-5 w-5" />}
      </button>

      <style jsx>{`
        @keyframes fabItemIn {
          from {
            opacity: 0;
            transform: translateY(12px) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
}
