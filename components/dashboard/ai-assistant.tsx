"use client";

import { useState, useEffect } from "react";
import {
  Bot,
  Check,
  Copy,
  Flame,
  MessageSquare,
  Network,
  Send,
  Sparkles,
  Target,
  Trophy,
  UserCheck,
  X,
  Zap
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface AiAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  initialPrompt?: string;
}

interface Message {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
}

const presetPrompts = [
  {
    icon: Target,
    label: "Pace & Goal Diagnostic",
    prompt: "Analyze my team's current velocity and tell me what daily KPIs are required to hit Gold rank by month end."
  },
  {
    icon: Network,
    label: "Audit Downline Bottlenecks",
    prompt: "Scan my downline levels (L1, L2, L3) and identify where recruitment or lead conversion is getting stuck."
  },
  {
    icon: Trophy,
    label: "Promotional Shoutout Copy",
    prompt: "Write a high-converting, exciting congratulations flyer caption for a new Diamond Director on Telegram."
  },
  {
    icon: Flame,
    label: "Team Motivation Pep Talk",
    prompt: "Draft an energetic 2-minute morning voice note script to inspire my downline team to close pending leads."
  }
];

export function AiAssistantModal({ isOpen, onClose, initialPrompt }: AiAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "m-welcome",
      sender: "ai",
      text: "👋 Welcome! I am your **MyUpline AI Executive Strategist**. I can analyze your target goals, audit downline activity & KPIs, craft promotional shoutouts for new ranks, and generate team coaching strategies. How can I help you grow your network today?",
      timestamp: "Just now"
    }
  ]);
  const [inputQuery, setInputQuery] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    if (initialPrompt && isOpen) {
      handleSendQuery(initialPrompt);
    }
  }, [initialPrompt, isOpen]);

  function handleSendQuery(textToSend?: string) {
    const query = textToSend || inputQuery;
    if (!query.trim()) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: "user",
      text: query,
      timestamp: "Just now"
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery("");
    setIsGenerating(true);

    // Simulate AI inference tailored to MyUpline network marketing domain
    setTimeout(() => {
      let aiResponseText = "";
      const lower = query.toLowerCase();

      if (lower.includes("goal") || lower.includes("pace") || lower.includes("gold") || lower.includes("target")) {
        aiResponseText = `### 🎯 Strategic Goal & Pace Analysis\n\nBased on your current run-rate of **1.25x baseline velocity**:\n\n1. **Monthly Personal Recruits**: You currently have **18 of 25 recruits (72%)**. At your current pace of ~1.2/day, you will hit **28 recruits** by month-end (+12% above target).\n2. **Group Volume (GV) Gap**: You are at **185,000 ETB / 250,000 ETB**. You need **65,000 ETB** over the remaining 14 days (~4,642 ETB/day).\n\n**Action Steps To Lock In Gold Rank:**\n- Mobilize your top 2 Level-1 leaders (**Almaz Tadesse** & **Biniam Haile**) for a 48-hour team enrolment drive.\n- Re-engage the 24 active pipeline leads in Level-2.\n- Host an LMS fast-track webinar this Thursday to trigger product package renewals.`;
      } else if (lower.includes("downline") || lower.includes("bottleneck") || lower.includes("audit") || lower.includes("level")) {
        aiResponseText = `### 🔍 Downline Intelligence & Activity Audit\n\nI conducted a multi-tier scan across your team network:\n\n- **Level 1 (Directs)**: Performing at **Elite tier**. Conversion rate is **39.2%** with 23 new recruits. Retention is **93.5%**.\n- **Level 2 (Secondary)**: **⚠️ Opportunity Alert**. Lead conversion dropped to **25.4%**. 2 leaders have pending KYC compliance documents.\n- **Level 3 (Depth)**: Active leads count is healthy (14 leads), but course completion is only at **30%**.\n\n**Recommended Strategic Interventions:**\n1. Send the *Fast-Track Onboarding Checklist* to Level-2 downline members.\n2. Celebrate **Almaz Tadesse** publicly in your team Telegram channel to model top behavior.`;
      } else if (lower.includes("flyer") || lower.includes("congratulat") || lower.includes("shoutout") || lower.includes("diamond")) {
        aiResponseText = `### 🌟 Viral Telegram & WhatsApp Announcement\n\n👑 **MASSIVE CELEBRATION! A NEW DIAMOND HAS RISEN!** 👑\n\nPlease join us in celebrating an incredible leader, mentor, and visionary:\n\n🏆 **ALMAZ TADESSE** 🏆\n*Officially Promoted to Diamond Director!*\n\n✨ **Highlights of Excellence:**\n- 🌟 38 Direct Recruits in 30 Days\n- 💎 350,000+ ETB in Group Volume\n- 🔥 100% Team Retention Rate\n\nYour relentless commitment and dedication to elevating everyone around you is pure inspiration. The sky is not the limit—it's our starting point! 🚀\n\nDrop your congratulations in the comments below! 👇🎉\n#MyUpline #DiamondLeader #NetworkMarketing #LeadershipExcellence #SuccessMindset`;
      } else {
        aiResponseText = `### 💡 AI Strategic Recommendations for MyUpline\n\nHere are 3 high-impact leverage points for your network:\n\n1. **Daily Motivational Momentum**: Share today's quote with your team early (before 9:00 AM) to establish energy for cold outreach.\n2. **Promotional Recognition**: When team members see their photo on an official **New Rank** or **Top Recruiter** flyer, downline motivation increases by an estimated **35%**.\n3. **Daily KPI Tracking**: Monitor both **Personal Volume (PV)** and **Group Volume (GV)** daily to stay ahead of deadline thresholds.`;
      }

      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: aiResponseText,
        timestamp: "Just now"
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsGenerating(false);
    }, 900);
  }

  function copyMessage(text: string, id: string) {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-in fade-in">
      <div className="relative flex h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl border border-slate-200 dark:bg-slate-900 dark:border-slate-800 dark:shadow-black/70">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-brand-navy p-4 text-white dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl brand-gradient text-brand-navy shadow-md">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black">MyUpline AI Executive Strategist</h3>
                <span className="rounded-full bg-emerald-400/20 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
                  ONLINE
                </span>
              </div>
              <p className="text-xs text-white/70">
                Pace analyzer • Downline coach • Flyer copywriter • Performance forecasting
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-white/70 hover:bg-white/10 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="flex items-center gap-2 overflow-x-auto border-b border-slate-100 bg-slate-50/90 px-4 py-2 text-xs dark:border-slate-800 dark:bg-slate-950/80">
          <span className="font-bold text-slate-400 uppercase text-[10px] shrink-0 dark:text-slate-500">Quick AI Modes:</span>
          {presetPrompts.map((chip, idx) => {
            const Icon = chip.icon;
            return (
              <button
                key={idx}
                onClick={() => handleSendQuery(chip.prompt)}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1 font-semibold text-slate-700 transition hover:border-brand-blue hover:bg-cyan-50/50 hover:text-brand-blue dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-cyan-500 dark:hover:bg-cyan-950/40 dark:hover:text-cyan-300"
              >
                <Icon className="h-3 w-3 text-brand-blue dark:text-cyan-400" />
                {chip.label}
              </button>
            );
          })}
        </div>

        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50/30 dark:bg-slate-950/40">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                "flex gap-3",
                msg.sender === "user" ? "justify-end" : "justify-start"
              )}
            >
              {msg.sender === "ai" && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-navy text-brand-cyan shadow-sm dark:bg-slate-800 dark:text-cyan-300">
                  <Bot className="h-4 w-4" />
                </div>
              )}

              <div
                className={cn(
                  "relative max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed shadow-sm",
                  msg.sender === "user"
                    ? "brand-gradient font-semibold text-brand-navy"
                    : "border border-slate-200 bg-white text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                )}
              >
                <div className="whitespace-pre-wrap">{msg.text}</div>

                {msg.sender === "ai" && (
                  <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2 text-[10px] text-slate-400 dark:border-slate-800 dark:text-slate-500">
                    <span>Generated by MyUpline Neural Engine</span>
                    <button
                      onClick={() => copyMessage(msg.text, msg.id)}
                      className="inline-flex items-center gap-1 text-slate-500 hover:text-brand-blue dark:text-slate-400 dark:hover:text-cyan-400"
                    >
                      {copiedId === msg.id ? <Check className="h-3 w-3 text-emerald-600 dark:text-emerald-400" /> : <Copy className="h-3 w-3" />}
                      {copiedId === msg.id ? "Copied!" : "Copy response"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isGenerating && (
            <div className="flex gap-3 items-center text-xs font-semibold text-slate-500 dark:text-slate-400">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-navy text-brand-cyan animate-pulse dark:bg-slate-800 dark:text-cyan-300">
                <Sparkles className="h-4 w-4" />
              </div>
              <div className="flex items-center gap-1 rounded-xl bg-white border border-slate-200 px-3 py-2 shadow-sm dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300">
                <span className="inline-block h-2 w-2 rounded-full bg-brand-cyan animate-ping" />
                <span>MyUpline AI Strategist is computing data...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Footer */}
        <div className="border-t border-slate-100 p-4 bg-white dark:border-slate-800 dark:bg-slate-900">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendQuery();
            }}
            className="flex items-center gap-2"
          >
            <input
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask AI anything about goals, downlines, flyers, or motivation..."
              className="h-11 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-brand-blue focus:bg-white dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:placeholder-slate-500 dark:focus:border-cyan-400 dark:focus:bg-slate-900"
            />
            <Button
              type="submit"
              disabled={isGenerating || !inputQuery.trim()}
              className="h-11 px-5 brand-gradient text-brand-navy font-black shadow-md"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
