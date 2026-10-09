"use client";

import { useState } from "react";
import {
  Award,
  Crown,
  Sparkles,
  TrendingUp,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Zap,
  Target,
  ArrowRight,
  Download,
  Printer,
  ChevronRight,
  Gift,
  Car,
  Plane,
  Coins,
  Layers,
  Percent,
  Check,
  AlertCircle
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { exportToCsv, printSection } from "@/lib/export-utils";

export interface RankMilestone {
  rankId: string;
  name: string;
  level: number;
  badge: string;
  personalPvRequired: number;
  groupVolumePvRequired: number;
  activeLegsRequired: number;
  maxPerLegPercent: number; // e.g. 60% rule
  weeklyCycleCapETB: number;
  matchingBonusTiers: string;
  perks: string[];
}

const rankMilestones: RankMilestone[] = [
  {
    rankId: "active-ibo",
    name: "Active IBO",
    level: 1,
    badge: "Starter",
    personalPvRequired: 50,
    groupVolumePvRequired: 0,
    activeLegsRequired: 0,
    maxPerLegPercent: 100,
    weeklyCycleCapETB: 12000,
    matchingBonusTiers: "None",
    perks: ["Wholesale Retail Margin (25%)", "15% Direct Fast-Start Referral Bonus", "Standard Portal Access"]
  },
  {
    rankId: "bronze-builder",
    name: "Bronze Builder",
    level: 2,
    badge: "Builder",
    personalPvRequired: 100,
    groupVolumePvRequired: 1500,
    activeLegsRequired: 2,
    maxPerLegPercent: 60,
    weeklyCycleCapETB: 36000,
    matchingBonusTiers: "Generation 1 (20%)",
    perks: ["Gen-1 20% Check Match", "Binary Cycle Pay enabled", "Bronze Certificate Recognition"]
  },
  {
    rankId: "silver-manager",
    name: "Silver Manager",
    level: 3,
    badge: "Leadership",
    personalPvRequired: 100,
    groupVolumePvRequired: 5000,
    activeLegsRequired: 3,
    maxPerLegPercent: 60,
    weeklyCycleCapETB: 72000,
    matchingBonusTiers: "Gen 1 (20%), Gen 2 (15%)",
    perks: ["Gen-2 15% Check Match", "Regional Leadership Faculty Invitation", "Silver Lapel Pin"]
  },
  {
    rankId: "gold-executive",
    name: "Gold Executive",
    level: 4,
    badge: "Executive",
    personalPvRequired: 150,
    groupVolumePvRequired: 15000,
    activeLegsRequired: 4,
    maxPerLegPercent: 50,
    weeklyCycleCapETB: 150000,
    matchingBonusTiers: "Gen 1 (20%), Gen 2 (15%), Gen 3 (10%)",
    perks: ["Gen-3 10% Check Match", "VIP Convention Seating", "Quarterly Leadership Bonus Share"]
  },
  {
    rankId: "platinum-leader",
    name: "Platinum Leader",
    level: 5,
    badge: "Prestige",
    personalPvRequired: 200,
    groupVolumePvRequired: 40000,
    activeLegsRequired: 5,
    maxPerLegPercent: 50,
    weeklyCycleCapETB: 300000,
    matchingBonusTiers: "Gen 1-4 (20%, 15%, 10%, 5%)",
    perks: ["Monthly Car Allowance (ETB 25,000/mo)", "Gen-4 5% Check Match", "Annual Luxury Retreat"]
  },
  {
    rankId: "diamond-director",
    name: "Diamond Director",
    level: 6,
    badge: "Elite Council",
    personalPvRequired: 200,
    groupVolumePvRequired: 100000,
    activeLegsRequired: 6,
    maxPerLegPercent: 40,
    weeklyCycleCapETB: 600000,
    matchingBonusTiers: "Gen 1-5 (20%, 15%, 10%, 5%, 5%)",
    perks: ["Global 2% Diamond Revenue Pool", "Mercedes/BMW Executive Car Fund", "First Class Travel Passes"]
  },
  {
    rankId: "crown-diamond",
    name: "Crown Diamond Ambassador",
    level: 7,
    badge: "Pinnacle Honor",
    personalPvRequired: 250,
    groupVolumePvRequired: 250000,
    activeLegsRequired: 8,
    maxPerLegPercent: 40,
    weeklyCycleCapETB: 1200000,
    matchingBonusTiers: "Gen 1-7 Full Unilevel Match",
    perks: ["Global 1% Founders Royalty Pool", "Luxury Villa Housing Allowance", "Lifetime Global Board Seat"]
  }
];

export function RankAdvancementTracker({ onOpenAi }: { onOpenAi?: (prompt: string) => void }) {
  // Current user's live rank stats
  const [currentUserRank, setCurrentUserRank] = useState<number>(6); // Level 6: Diamond Director
  const [personalPv, setPersonalPv] = useState<number>(200);
  const [groupVolumePv, setGroupVolumePv] = useState<number>(78500);
  const [activeFrontlineLegs, setActiveFrontlineLegs] = useState<number>(6);
  const [monthlyCycleDaysLeft, setMonthlyCycleDaysLeft] = useState<number>(22);
  const [autoshipActive, setAutoshipActive] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<"PROGRESS" | "LADDER" | "COMPRESSION">("PROGRESS");

  const currentMilestone = rankMilestones.find((r) => r.level === currentUserRank) || rankMilestones[5];
  const nextMilestone = rankMilestones.find((r) => r.level === currentUserRank + 1) || rankMilestones[6];

  // Calculate percentages towards next rank
  const pvProgress = Math.min(100, Math.round((personalPv / nextMilestone.personalPvRequired) * 100));
  const gvProgress = Math.min(100, Math.round((groupVolumePv / nextMilestone.groupVolumePvRequired) * 100));
  const legsProgress = Math.min(100, Math.round((activeFrontlineLegs / nextMilestone.activeLegsRequired) * 100));
  const overallNextProgress = Math.round((pvProgress + gvProgress + legsProgress) / 3);

  const handleExportRanks = () => {
    exportToCsv("MyUpline_Rank_Advancement_Specs", rankMilestones as any);
  };

  return (
    <div id="rank-advancement-printable" className="space-y-6">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-cyan-500/30 bg-gradient-to-br from-[#071739] via-[#0b2447] to-[#040e21] p-6 text-white shadow-2xl backdrop-blur-xl sm:p-8">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/40 bg-cyan-500/15 px-3 py-1 text-xs font-black text-cyan-300">
              <Crown className="h-3.5 w-3.5" /> 7-Tier Executive Career Ladder & Rank Qualification
            </div>
            <h1 className="mt-3 text-2xl font-black tracking-tight sm:text-3xl text-white">
              Rank Advancement & Career Ladder Matrix
            </h1>
            <p className="mt-1.5 max-w-2xl text-xs sm:text-sm text-slate-300">
              Track real-time monthly qualifications, 60/40 leg balance volume rules, leadership check-match levels, and luxury lifestyle rewards.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              onClick={() => onOpenAi?.(`Analyze my gap between ${currentMilestone.name} and ${nextMilestone.name} and provide a 30-day action blueprint.`)}
              variant="ghost"
              className="border border-cyan-500/30 bg-cyan-500/10 text-xs font-bold text-cyan-300 hover:bg-cyan-500/20"
            >
              <Sparkles className="mr-1.5 h-3.5 w-3.5" /> AI Strategy
            </Button>
            <Button onClick={handleExportRanks} className="border border-slate-700 bg-slate-800/80 text-xs font-bold text-white hover:bg-slate-800">
              <Download className="mr-1.5 h-3.5 w-3.5" /> Export Ladder
            </Button>
            <Button onClick={() => printSection("rank-advancement-printable", "Rank Advancement")} className="border border-slate-700 bg-slate-800/80 text-xs font-bold text-white hover:bg-slate-800">
              <Printer className="mr-1.5 h-3.5 w-3.5" /> Print
            </Button>
          </div>
        </div>

        {/* Tab Strip */}
        <div className="mt-6 flex flex-wrap gap-2 border-t border-slate-800/80 pt-4">
          {[
            { id: "PROGRESS", label: "My Live Qualification", icon: Target },
            { id: "LADDER", label: "7-Tier Rank Ladder Specs", icon: Award },
            { id: "COMPRESSION", label: "Dynamic Compression Engine", icon: Layers }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition",
                  isActive
                    ? "bg-cyan-400 text-brand-navy shadow-lg shadow-cyan-400/25"
                    : "border border-slate-700/80 bg-slate-800/40 text-slate-300 hover:border-cyan-500/40 hover:bg-slate-800"
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* TAB 1: LIVE USER QUALIFICATION GAUGES                          */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeTab === "PROGRESS" && (
        <div className="space-y-6">
          {/* Current Rank vs Next Milestone Banner */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border border-cyan-500/30 bg-[#091b3a]/90 p-6 shadow-xl relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Current Recognized Rank</span>
                <span className="rounded-full bg-cyan-400/20 px-2.5 py-0.5 text-xs font-black text-cyan-300 border border-cyan-400/30">
                  Level {currentMilestone.level}
                </span>
              </div>
              <h2 className="mt-3 text-2xl font-black text-white flex items-center gap-2">
                <Crown className="h-6 w-6 text-amber-400" /> {currentMilestone.name}
              </h2>
              <p className="mt-1 text-xs text-slate-300">
                Weekly cycle payout cap: <strong>ETB {currentMilestone.weeklyCycleCapETB.toLocaleString()}</strong> (~$10,500/week)
              </p>

              <div className="mt-4 border-t border-slate-800/80 pt-3">
                <p className="text-[11px] font-black uppercase text-slate-400">Unlocked Leadership Perks</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {currentMilestone.perks.map((p, idx) => (
                    <span key={idx} className="rounded-lg bg-cyan-500/10 border border-cyan-500/20 px-2 py-1 text-[11px] font-semibold text-cyan-200">
                      ✓ {p}
                    </span>
                  ))}
                </div>
              </div>
            </Card>

            <Card className="border border-emerald-500/30 bg-[#091b3a]/90 p-6 shadow-xl relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Next Target Milestone</span>
                <span className="rounded-full bg-emerald-400/20 px-2.5 py-0.5 text-xs font-black text-emerald-300 border border-emerald-400/30">
                  Level {nextMilestone.level} ({overallNextProgress}% Ready)
                </span>
              </div>
              <h2 className="mt-3 text-2xl font-black text-white flex items-center gap-2">
                <Award className="h-6 w-6 text-emerald-400" /> {nextMilestone.name}
              </h2>
              <p className="mt-1 text-xs text-slate-300">
                Weekly cycle payout cap raises to: <strong>ETB {nextMilestone.weeklyCycleCapETB.toLocaleString()}</strong>
              </p>

              <div className="mt-4 border-t border-slate-800/80 pt-3">
                <p className="text-[11px] font-black uppercase text-slate-400">Next Tier Breakthrough Perks</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {nextMilestone.perks.map((p, idx) => (
                    <span key={idx} className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 text-[11px] font-semibold text-emerald-200">
                      ⭐ {p}
                    </span>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* Detailed Metric Progress Bars towards Next Rank */}
          <Card className="border border-slate-800 bg-[#091b3a]/90 p-6 shadow-xl">
            <h3 className="text-lg font-black text-white border-b border-slate-800 pb-3">
              Qualification Criteria Progress for {nextMilestone.name}
            </h3>

            <div className="mt-5 space-y-6">
              {/* Metric 1: Personal PV */}
              <div>
                <div className="flex justify-between text-xs font-bold mb-1.5">
                  <span className="text-slate-300">1. Personal Volume (Monthly Autoship PV)</span>
                  <span className={cn(personalPv >= nextMilestone.personalPvRequired ? "text-emerald-400" : "text-amber-400")}>
                    {personalPv} / {nextMilestone.personalPvRequired} PV ({pvProgress}%) {personalPv >= nextMilestone.personalPvRequired && "✓ Qualified"}
                  </span>
                </div>
                <div className="h-3 w-full rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${pvProgress}%` }} />
                </div>
              </div>

              {/* Metric 2: Group Volume (GV) */}
              <div>
                <div className="flex justify-between text-xs font-bold mb-1.5">
                  <span className="text-slate-300">2. Organization Group Volume (GV)</span>
                  <span className="text-cyan-300">
                    {groupVolumePv.toLocaleString()} / {nextMilestone.groupVolumePvRequired.toLocaleString()} PV ({gvProgress}%)
                  </span>
                </div>
                <div className="h-3 w-full rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-cyan-400 rounded-full" style={{ width: `${gvProgress}%` }} />
                </div>
                <p className="mt-1 text-[11px] text-slate-400">
                  {nextMilestone.groupVolumePvRequired - groupVolumePv > 0 ? (
                    <>Need <strong>{(nextMilestone.groupVolumePvRequired - groupVolumePv).toLocaleString()} PV</strong> more before month-end cutoff.</>
                  ) : "Target Reached!"}
                </p>
              </div>

              {/* Metric 3: Active Personally Sponsored Lines */}
              <div>
                <div className="flex justify-between text-xs font-bold mb-1.5">
                  <span className="text-slate-300">3. Personally Sponsored Active Frontline Lines</span>
                  <span className={cn(activeFrontlineLegs >= nextMilestone.activeLegsRequired ? "text-emerald-400" : "text-amber-400")}>
                    {activeFrontlineLegs} / {nextMilestone.activeLegsRequired} Active Frontlines ({legsProgress}%)
                  </span>
                </div>
                <div className="h-3 w-full rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-purple-400 rounded-full" style={{ width: `${legsProgress}%` }} />
                </div>
              </div>

              {/* Metric 4: 60/40 Leg Balance Rule */}
              <div className="rounded-2xl border border-slate-800 bg-[#051124]/90 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-emerald-400" />
                    <span className="text-xs font-bold text-white">60/40 Maximum Strong Leg Rule</span>
                  </div>
                  <span className="rounded-md bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-black text-emerald-300">
                    COMPLIANT ✓
                  </span>
                </div>
                <p className="mt-1.5 text-xs text-slate-300 leading-relaxed">
                  No single sponsor leg may contribute more than {nextMilestone.maxPerLegPercent}% towards your rank volume requirement. Your strongest leg currently accounts for <strong>38.4%</strong>, satisfying all anti-stacking criteria.
                </p>
              </div>
            </div>
          </Card>

          {/* Autoship Active Grace Period Status */}
          <Card className="border border-emerald-500/20 bg-[#091b3a]/90 p-5 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-black text-white text-sm">Monthly Active Status: QUALIFIED (Autoship Active)</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {monthlyCycleDaysLeft} days remaining in current monthly qualification period. All carryover volume is fully protected.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  onClick={() => setMonthlyCycleDaysLeft(30)}
                  className="h-10 bg-emerald-400 text-brand-navy font-black hover:bg-emerald-300 text-xs shadow-md shadow-emerald-400/20"
                >
                  Renew Active Autoship <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* TAB 2: FULL 7-TIER RANK LADDER SPECIFICATION TABLE            */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeTab === "LADDER" && (
        <Card className="border border-cyan-500/20 bg-[#091b3a]/90 p-6 shadow-xl">
          <div className="border-b border-slate-800 pb-4">
            <h3 className="text-xl font-black text-white">Official 7-Tier Career Compensation Ladder</h3>
            <p className="text-xs text-slate-300 mt-1">
              Complete career ladder requirements from Active IBO to Crown Diamond Ambassador.
            </p>
          </div>

          <div className="mt-5 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-[11px] font-black uppercase tracking-wider text-slate-400">
                  <th className="py-3 px-3">Rank Level</th>
                  <th className="py-3 px-3">Monthly PV</th>
                  <th className="py-3 px-3">Group Volume (GV)</th>
                  <th className="py-3 px-3">Active Legs</th>
                  <th className="py-3 px-3">Max/Leg Rule</th>
                  <th className="py-3 px-3">Weekly Cycle Cap</th>
                  <th className="py-3 px-3">Check-Match Tiers</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {rankMilestones.map((r) => {
                  const isCurrent = r.level === currentUserRank;
                  return (
                    <tr key={r.rankId} className={cn("transition", isCurrent ? "bg-cyan-500/10 font-bold" : "hover:bg-slate-800/30")}>
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-2">
                          <span className={cn(
                            "flex h-6 w-6 items-center justify-center rounded-lg text-xs font-black",
                            isCurrent ? "bg-cyan-400 text-brand-navy" : "bg-slate-800 text-slate-300"
                          )}>
                            {r.level}
                          </span>
                          <div>
                            <p className="text-white font-bold">{r.name}</p>
                            {isCurrent && <span className="text-[10px] text-cyan-400 font-extrabold uppercase">● You Are Here</span>}
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-3 font-semibold text-slate-200">{r.personalPvRequired} PV</td>
                      <td className="py-3.5 px-3 font-bold text-cyan-300">{r.groupVolumePvRequired > 0 ? `${r.groupVolumePvRequired.toLocaleString()} PV` : "—"}</td>
                      <td className="py-3.5 px-3 font-semibold text-slate-200">{r.activeLegsRequired > 0 ? `${r.activeLegsRequired} Lines` : "—"}</td>
                      <td className="py-3.5 px-3 font-semibold text-slate-300">{r.maxPerLegPercent}%</td>
                      <td className="py-3.5 px-3 font-black text-emerald-400">ETB {r.weeklyCycleCapETB.toLocaleString()}</td>
                      <td className="py-3.5 px-3 font-medium text-slate-300">{r.matchingBonusTiers}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* TAB 3: DYNAMIC COMPRESSION ENGINE SIMULATOR                   */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeTab === "COMPRESSION" && (
        <Card className="border border-cyan-500/20 bg-[#091b3a]/90 p-6 shadow-xl">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Algorithmic Volume Protection</span>
            <h3 className="text-xl font-black text-white">Dynamic Compression Engine Simulation</h3>
            <p className="mt-1 text-xs text-slate-300 max-w-2xl">
              In standard plans, inactive intermediate distributors break generation check matches. In MyUpline&apos;s Hybrid plan, non-qualified members are dynamically compressed out, rolling commissions to the first qualified leader.
            </p>
          </div>

          <div className="mt-6 space-y-4">
            <div className="rounded-2xl border border-slate-800 bg-[#051124]/90 p-5">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-4">
                Lineage Roll-Up Demonstration
              </h4>

              <div className="space-y-3">
                <div className="flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 text-white font-bold text-xs">
                    G1
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-white">Dawit Team Leader (Bronze Builder)</p>
                    <p className="text-[11px] text-emerald-300">Active PV: 120 PV • Status: Qualified for 20% Match</p>
                  </div>
                  <span className="font-black text-emerald-400">Match Paid ✓</span>
                </div>

                <div className="flex items-center gap-3 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs opacity-75">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-rose-500 text-white font-bold text-xs">
                    —
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-slate-300">Inactive Distributor X (0 PV this month)</p>
                    <p className="text-[11px] text-rose-300">Status: Non-Qualified • Compressed Out</p>
                  </div>
                  <span className="font-black text-rose-400">Bypassed (0% Loss) ↷</span>
                </div>

                <div className="flex items-center gap-3 rounded-xl border border-cyan-500/30 bg-cyan-500/10 p-3 text-xs">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-cyan-400 text-brand-navy font-bold text-xs">
                    G2
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-white">Coach Ephrem Alemu (Master Trainer)</p>
                    <p className="text-[11px] text-cyan-300">Active PV: 200 PV • Automatically Compressed to your Gen-2 position</p>
                  </div>
                  <span className="font-black text-cyan-300">Compressed Upward ✓</span>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/10 p-4 text-xs text-cyan-300 flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 shrink-0 text-cyan-400" />
              <span>Result: Zero breakage for leaders. 100% of generational bonus pool reaches producing network builders.</span>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
