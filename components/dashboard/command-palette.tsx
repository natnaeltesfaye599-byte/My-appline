"use client";

import { useState, useEffect, useRef } from "react";
import {
  Activity,
  Award,
  BookOpen,
  ClipboardCheck,
  Compass,
  CreditCard,
  FileBarChart,
  GraduationCap,
  Globe,
  Hash,
  LayoutDashboard,
  Network,
  Quote,
  Search,
  Settings,
  Sliders,
  Target,
  UserCheck,
  UserRound,
  UsersRound,
  Image as ImageIcon,
  X,
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface CommandItem {
  id: string;
  label: string;
  description?: string;
  icon: typeof Search;
  keywords?: string[];
  action: () => void;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: string) => void;
}

const navItems = [
  { id: "dashboard", label: "Dashboard", description: "Overview & KPIs", icon: LayoutDashboard, keywords: ["home", "overview"] },
  { id: "recruitment", label: "Recruitment Pipeline", description: "Manage leads & prospects", icon: UserCheck, keywords: ["leads", "funnel", "pipeline"] },
  { id: "after-sales", label: "Getting Started Booklet", description: "6-page onboarding form", icon: ClipboardCheck, keywords: ["booklet", "onboarding", "form", "new member"] },
  { id: "daily-activity", label: "Daily Activity & KPI", description: "DMO scheduler & tracker", icon: Activity, keywords: ["dmo", "activity", "tracker", "kpi"] },
  { id: "name-list", label: "Name List Organizer", description: "100 contact prospect list", icon: UsersRound, keywords: ["contacts", "prospects", "names"] },
  { id: "training-hub", label: "Training Academy", description: "Eric Pro & leadership courses", icon: GraduationCap, keywords: ["courses", "learning", "videos"] },
  { id: "dream-goal-board", label: "Dream & Goal Board", description: "Vision board & goals", icon: Compass, keywords: ["dream", "vision", "goals", "board"] },
  { id: "goal-analyzer", label: "Data Analyzer (Goals)", description: "Analytics & goal tracking", icon: Target, keywords: ["analytics", "goals", "data"] },
  { id: "downline", label: "Downline Collector", description: "L1-L3 team network", icon: Network, keywords: ["downline", "team", "network", "levels"] },
  { id: "promo-studio", label: "Promotional Photo", description: "Flyers & promotional content", icon: ImageIcon, keywords: ["flyer", "photo", "promo", "design"] },
  { id: "packages-payments", label: "Packages & Payments", description: "Payment verification", icon: CreditCard, keywords: ["payment", "package", "verify", "approve"] },
  { id: "training-studio", label: "Training Studio (CRUD)", description: "Manage courses & trainers", icon: GraduationCap, keywords: ["courses", "manage", "crud"] },
  { id: "team-faculty", label: "Team & Trainers", description: "Team management", icon: UserCheck, keywords: ["team", "trainer", "faculty"] },
  { id: "cms-studio", label: "CMS & Blog Studio", description: "Manage marketing content", icon: Globe, keywords: ["blog", "cms", "content", "marketing"] },
  { id: "onboarding-studio", label: "Booklet & Funnel Studio", description: "Configure onboarding system", icon: Sliders, keywords: ["config", "settings", "booklet", "funnel"] },
  { id: "certificates", label: "Recognition Certificates", description: "Awards & achievements", icon: Award, keywords: ["award", "certificate", "recognition"] },
  { id: "motivational-quotes", label: "Daily Motivation", description: "Inspirational messages", icon: Quote, keywords: ["motivation", "quotes", "inspiration"] },
  { id: "reports", label: "Reports", description: "Analytics & export", icon: FileBarChart, keywords: ["report", "export", "analytics"] },
  { id: "settings", label: "Settings", description: "Platform configuration", icon: Settings, keywords: ["config", "preferences"] },
  { id: "profile", label: "Profile & Avatars", description: "Manage your profile", icon: UserRound, keywords: ["avatar", "account", "me"] },
  { id: "activity", label: "Activity Logs", description: "Audit trail & events", icon: Activity, keywords: ["logs", "audit", "security"] }
];

function highlight(text: string, query: string) {
  if (!query) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-cyan-200/70 text-cyan-900 rounded px-0.5">{text.slice(idx, idx + query.length)}</mark>
      {text.slice(idx + query.length)}
    </>
  );
}

export function CommandPalette({ isOpen, onClose, onNavigate }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [selectedIdx, setSelectedIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const filtered = query.trim()
    ? navItems.filter(
        (item) =>
          item.label.toLowerCase().includes(query.toLowerCase()) ||
          item.description?.toLowerCase().includes(query.toLowerCase()) ||
          item.keywords?.some((k) => k.toLowerCase().includes(query.toLowerCase()))
      )
    : navItems;

  useEffect(() => {
    setSelectedIdx(0);
  }, [query]);

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [isOpen]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!isOpen) return;
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIdx((i) => Math.min(i + 1, filtered.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIdx((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        const item = filtered[selectedIdx];
        if (item) {
          onNavigate(item.id);
          onClose();
        }
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, filtered, selectedIdx, onNavigate, onClose]);

  // Scroll selected item into view
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const selected = list.children[selectedIdx] as HTMLElement;
    selected?.scrollIntoView({ block: "nearest" });
  }, [selectedIdx]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-start justify-center px-4 pt-[12vh] bg-slate-900/50 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="command-palette-modal"
        role="dialog"
        aria-label="Command palette"
        className="w-full max-w-xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/20 animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Search Input */}
        <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-3.5">
          <Search className="h-4 w-4 shrink-0 text-slate-400" />
          <input
            ref={inputRef}
            id="command-palette-input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for a view, tool, or action..."
            className="flex-1 bg-transparent text-sm font-medium text-slate-800 placeholder:text-slate-400 outline-none"
            aria-autocomplete="list"
          />
          <div className="flex items-center gap-1">
            <kbd className="rounded border border-slate-200 bg-slate-100 px-1.5 py-0.5 text-[10px] font-mono font-bold text-slate-500">
              ESC
            </kbd>
          </div>
        </div>

        {/* Results */}
        <ul
          ref={listRef}
          className="max-h-[380px] overflow-y-auto py-2"
          role="listbox"
        >
          {filtered.length === 0 ? (
            <li className="py-10 text-center text-sm text-slate-400">
              No results for <strong className="text-slate-600">"{query}"</strong>
            </li>
          ) : (
            filtered.map((item, i) => {
              const Icon = item.icon;
              const isSelected = i === selectedIdx;
              return (
                <li
                  key={item.id}
                  role="option"
                  aria-selected={isSelected}
                  onMouseEnter={() => setSelectedIdx(i)}
                  onClick={() => {
                    onNavigate(item.id);
                    onClose();
                  }}
                  className={cn(
                    "mx-2 flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 transition",
                    isSelected
                      ? "bg-brand-navy text-white"
                      : "text-slate-700 hover:bg-slate-50"
                  )}
                >
                  <div
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                      isSelected ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
                    )}
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={cn("text-xs font-bold", isSelected ? "text-white" : "text-slate-800")}>
                      {typeof highlight(item.label, query) === "string" ? item.label : highlight(item.label, query)}
                    </p>
                    {item.description && (
                      <p className={cn("text-[11px]", isSelected ? "text-white/70" : "text-slate-400")}>
                        {item.description}
                      </p>
                    )}
                  </div>
                  <div className={cn("flex shrink-0 items-center gap-1", isSelected ? "opacity-70" : "opacity-0")}>
                    <kbd className={cn("rounded border px-1.5 py-0.5 text-[10px] font-mono", isSelected ? "border-white/30 bg-white/10 text-white" : "border-slate-200 bg-slate-100 text-slate-500")}>
                      ↵
                    </kbd>
                  </div>
                </li>
              );
            })
          )}
        </ul>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-100 px-4 py-2.5">
          <div className="flex items-center gap-3 text-[11px] font-medium text-slate-400">
            <span className="flex items-center gap-1">
              <kbd className="rounded border border-slate-200 bg-slate-100 px-1 py-0.5 font-mono text-[10px]">↑↓</kbd>
              Navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="rounded border border-slate-200 bg-slate-100 px-1 py-0.5 font-mono text-[10px]">↵</kbd>
              Open
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold">
            <Zap className="h-3 w-3 text-brand-cyan" />
            MyUpline Command Palette
          </div>
        </div>
      </div>
    </div>
  );
}
