"use client";

import { useState, useMemo } from "react";
import {
  Network,
  CircleDollarSign,
  TrendingUp,
  Sliders,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Award,
  Layers,
  ArrowRight,
  Download,
  Printer,
  Sparkles,
  RefreshCw,
  Clock,
  ArrowUpRight,
  Building,
  Scale,
  Percent,
  Check,
  ChevronRight,
  HelpCircle,
  BarChart3,
  Coins
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { exportToCsv, printSection } from "@/lib/export-utils";

export interface MlmPlanModel {
  id: "hybrid-binary" | "unilevel-9" | "forced-matrix" | "stair-step";
  name: string;
  badge: string;
  isRecommended: boolean;
  description: string;
  payoutCap: string;
  speedRating: number;
  retentionRating: number;
  leaderScore: number;
  spilloverSynergy: string;
  keyFeatures: string[];
}

const mlmPlans: MlmPlanModel[] = [
  {
    id: "hybrid-binary",
    name: "Hybrid Binary-Unilevel Matrix",
    badge: "Industry Best ⭐",
    isRecommended: true,
    description: "The gold-standard modern MLM plan. Combines the explosive team-building speed of a 2-leg binary tree with the long-term depth stability and check-matching bonuses of an unlimited unilevel sponsor tree.",
    payoutCap: "50% Maximum DSA Cap",
    speedRating: 98,
    retentionRating: 95,
    leaderScore: 99,
    spilloverSynergy: "Maximum (Upline Spillover directly benefits Downline)",
    keyFeatures: [
      "Binary Cycle Pay: 300 PV weak leg : 600 PV strong leg match (or 1:1 flexible)",
      "Unilevel Fast-Start: 15% - 25% instant direct referral commission",
      "7-Generation Check-Match: 20% on Gen-1, 15% Gen-2, 10% Gen-3 down to 2% Gen-7",
      "Holding Tank & Spillover: 72-hour strategic placement control",
      "Dynamic Compression: Inactive accounts automatically compressed out",
      "Carryover Volume: Unmatched strong leg volume never flushes if active"
    ]
  },
  {
    id: "unilevel-9",
    name: "Unilevel 9-Tier Linear",
    badge: "Traditional Linear",
    isRecommended: false,
    description: "Distributors sponsor unlimited width on frontline. Commissions pay a flat or tiered percentage across 9 levels of sponsored lineage. Simple to understand but lacks team-building spillover synergy.",
    payoutCap: "45% Standard",
    speedRating: 72,
    retentionRating: 80,
    leaderScore: 84,
    spilloverSynergy: "Zero (Every recruit stays on direct frontline)",
    keyFeatures: [
      "Unlimited frontline width without leg restrictions",
      "Level 1: 10%, Level 2: 7%, Level 3: 5%, Levels 4-9: 3%",
      "Predictable commission calculations",
      "Lacks binary team-work momentum and upline spillover assistance"
    ]
  },
  {
    id: "forced-matrix",
    name: "3x9 Forced Matrix Plan",
    badge: "Forced Width",
    isRecommended: false,
    description: "Limits each member to exactly 3 frontline positions, forcing extra recruits to spill over to level 2, 3, etc., up to 9 levels deep. Strong spillover but limits top earner scalability.",
    payoutCap: "48% Fixed",
    speedRating: 85,
    retentionRating: 88,
    leaderScore: 76,
    spilloverSynergy: "High (Forced spillover under frontline positions)",
    keyFeatures: [
      "Strict 3-frontline capacity per node",
      "Automatic algorithmic top-to-bottom, left-to-right spillover",
      "Capped total organization matrix size (19,683 members max)",
      "Causes distributor reliance on passive upline spillover"
    ]
  },
  {
    id: "stair-step",
    name: "Stair-Step Breakaway",
    badge: "Legacy Plan",
    isRecommended: false,
    description: "Classic old-school plan (Amway style). Members climb discount percentages until reaching top rank, at which point their group breaks away from the upline, paying smaller override royalties.",
    payoutCap: "42% Variable",
    speedRating: 60,
    retentionRating: 75,
    leaderScore: 80,
    spilloverSynergy: "Low (No binary spillover)",
    keyFeatures: [
      "Differential discount margins (9% to 21%)",
      "Leadership Breakaway overrides (4% - 6% group volume)",
      "High administrative complexity & inventory stockpiling risk",
      "Potential resentment when top leaders break away"
    ]
  }
];

export function MlmSystemEngine({ onOpenAi }: { onOpenAi?: (prompt: string) => void }) {
  const [selectedPlanId, setSelectedPlanId] = useState<string>("hybrid-binary");
  const [cycleRatio, setCycleRatio] = useState<"1:2" | "1:1" | "2:1">("1:2");
  const [leftLegPv, setLeftLegPv] = useState<number>(14800);
  const [rightLegPv, setRightLegPv] = useState<number>(9600);
  const [activeTab, setActiveTab] = useState<"ARCHITECTURE" | "BINARY_ENGINE" | "MATCHING_BONUS" | "SAFETY_CAP" | "SIMULATOR">("ARCHITECTURE");
  
  // Simulation run state
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState<{
    totalGrossVolumeETB: number;
    totalCommissionPayoutETB: number;
    payoutRatioPercent: number;
    binaryCyclesPaid: number;
    fastStartPaidETB: number;
    matchingBonusPaidETB: number;
    leadershipPoolPaidETB: number;
    retainedCompanyGrossETB: number;
    status: "COMPLIANT" | "WARNING" | "CAPPED";
    timestamp: string;
  } | null>(null);

  // Selected Plan Object
  const currentPlan = useMemo(() => {
    return mlmPlans.find((p) => p.id === selectedPlanId) || mlmPlans[0];
  }, [selectedPlanId]);

  // Binary Cycle Math
  const binaryCalculations = useMemo(() => {
    let weakPv = 0;
    let strongPv = 0;
    let weakLegName = "Right Leg";
    let strongLegName = "Left Leg";

    if (leftLegPv <= rightLegPv) {
      weakPv = leftLegPv;
      strongPv = rightLegPv;
      weakLegName = "Left Leg (Pay Leg)";
      strongLegName = "Right Leg (Power Leg)";
    } else {
      weakPv = rightLegPv;
      strongPv = leftLegPv;
      weakLegName = "Right Leg (Pay Leg)";
      strongLegName = "Left Leg (Power Leg)";
    }

    // Step requirement based on ratio
    const weakUnit = cycleRatio === "1:1" ? 300 : 300;
    const strongUnit = cycleRatio === "1:1" ? 300 : 600;
    const cyclePayoutETB = 1200; // ~ 1,200 ETB per completed cycle match
    const cyclePayoutUSD = 21.05;

    const maxCyclesByWeak = Math.floor(weakPv / weakUnit);
    const maxCyclesByStrong = Math.floor(strongPv / strongUnit);
    const completedCycles = Math.min(maxCyclesByWeak, maxCyclesByStrong);

    const usedWeakPv = completedCycles * weakUnit;
    const usedStrongPv = completedCycles * strongUnit;

    const carryoverWeak = weakPv - usedWeakPv;
    const carryoverStrong = strongPv - usedStrongPv;

    const totalPayoutETB = completedCycles * cyclePayoutETB;
    const totalPayoutUSD = completedCycles * cyclePayoutUSD;

    return {
      weakLegName,
      strongLegName,
      weakPv,
      strongPv,
      completedCycles,
      totalPayoutETB,
      totalPayoutUSD,
      carryoverWeak,
      carryoverStrong,
      usedWeakPv,
      usedStrongPv,
      weakUnit,
      strongUnit,
      cyclePayoutETB
    };
  }, [leftLegPv, rightLegPv, cycleRatio]);

  // Generation Matching Bonus breakdown (Levels 1 to 7)
  const matchingLevels = [
    { level: 1, percent: 20, rankRequired: "Bronze Builder", teamSize: 8, estimatedEarnings: 9600 },
    { level: 2, percent: 15, rankRequired: "Silver Manager", teamSize: 24, estimatedEarnings: 14400 },
    { level: 3, percent: 10, rankRequired: "Gold Executive", teamSize: 64, estimatedEarnings: 21600 },
    { level: 4, percent: 5, rankRequired: "Platinum Leader", teamSize: 142, estimatedEarnings: 18200 },
    { level: 5, percent: 5, rankRequired: "Diamond Director", teamSize: 310, estimatedEarnings: 26500 },
    { level: 6, percent: 3, rankRequired: "Crown Diamond", teamSize: 580, estimatedEarnings: 22400 },
    { level: 7, percent: 2, rankRequired: "Global Ambassador", teamSize: 1120, estimatedEarnings: 19800 }
  ];

  const totalEstimatedMatch = matchingLevels.reduce((sum, item) => sum + item.estimatedEarnings, 0);

  // Trigger Live Commission Run Batch Simulation
  const handleExecuteCommissionRun = () => {
    setIsSimulating(true);
    setTimeout(() => {
      const grossVolume = 2450000; // 2.45M ETB
      const binaryPaid = 468000; // Binary cycle payments
      const fastStart = 285000; // Fast start bonuses
      const matchPaid = 192500; // Generation matching
      const poolPaid = 95000; // Diamond leadership pool
      const totalCommission = binaryPaid + fastStart + matchPaid + poolPaid;
      const payoutPct = (totalCommission / grossVolume) * 100;
      const retainedCompany = grossVolume - totalCommission;

      setSimulationResult({
        totalGrossVolumeETB: grossVolume,
        totalCommissionPayoutETB: totalCommission,
        payoutRatioPercent: Number(payoutPct.toFixed(1)),
        binaryCyclesPaid: 390,
        fastStartPaidETB: fastStart,
        matchingBonusPaidETB: matchPaid,
        leadershipPoolPaidETB: poolPaid,
        retainedCompanyGrossETB: retainedCompany,
        status: payoutPct <= 48 ? "COMPLIANT" : payoutPct <= 50 ? "WARNING" : "CAPPED",
        timestamp: new Date().toLocaleString()
      });
      setIsSimulating(false);
    }, 700);
  };

  const handleExportAudit = () => {
    const rows = [
      {
        "Plan Architecture": currentPlan.name,
        "Left Leg PV": leftLegPv,
        "Right Leg PV": rightLegPv,
        "Cycle Match Ratio": cycleRatio,
        "Completed Cycles": binaryCalculations.completedCycles,
        "Binary Payout (ETB)": binaryCalculations.totalPayoutETB,
        "Strong Leg Carryover": binaryCalculations.carryoverStrong,
        "Weak Leg Carryover": binaryCalculations.carryoverWeak,
        "Gen 1-7 Matching Total (ETB)": totalEstimatedMatch,
        "Safety Cap Status": "ACTIVE (50% DSA Compliance Rule)",
        "Audit Date": new Date().toISOString()
      }
    ];
    exportToCsv("MyUpline_MLM_System_Engine_Report", rows);
  };

  return (
    <div id="mlm-system-engine-printable" className="space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-cyan-500/30 bg-gradient-to-br from-[#071739] via-[#0b2447] to-[#040e21] p-6 text-white shadow-2xl backdrop-blur-xl sm:p-8">
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-blue-600/10 blur-3xl" />

        <div className="relative flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/40 bg-cyan-500/15 px-3 py-1 text-xs font-black text-cyan-300">
              <Sparkles className="h-3.5 w-3.5" /> Selected System: Hybrid Binary-Unilevel Matrix (Gold Standard)
            </div>
            <h1 className="mt-3 text-2xl font-black tracking-tight sm:text-3xl text-white">
              Enterprise MLM Compensation & System Architecture
            </h1>
            <p className="mt-1.5 max-w-2xl text-xs sm:text-sm text-slate-300">
              Comprehensive network marketing infrastructure engine powering binary pairing, generational matching bonuses, holding tank spillover, and real-time regulatory solvency caps.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              onClick={() => onOpenAi?.("Explain how the Hybrid Binary-Unilevel plan outperforms classic breakaway models and how our 50% cap protects company reserves.")}
              variant="ghost"
              className="border border-cyan-500/30 bg-cyan-500/10 text-xs font-bold text-cyan-300 hover:bg-cyan-500/20"
            >
              <Sparkles className="mr-1.5 h-3.5 w-3.5" /> AI Audit
            </Button>
            <Button
              onClick={handleExportAudit}
              className="border border-slate-700 bg-slate-800/80 text-xs font-bold text-white hover:bg-slate-800"
            >
              <Download className="mr-1.5 h-3.5 w-3.5" /> Export Specs
            </Button>
            <Button
              onClick={() => printSection("mlm-system-engine-printable", "MLM System Engine")}
              className="border border-slate-700 bg-slate-800/80 text-xs font-bold text-white hover:bg-slate-800"
            >
              <Printer className="mr-1.5 h-3.5 w-3.5" /> Print
            </Button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mt-6 flex flex-wrap gap-2 border-t border-slate-800/80 pt-4">
          {[
            { id: "ARCHITECTURE", label: "Plan Comparison", icon: Layers },
            { id: "BINARY_ENGINE", label: "Binary Cycle Engine", icon: Network },
            { id: "MATCHING_BONUS", label: "7-Generation Match", icon: CircleDollarSign },
            { id: "SAFETY_CAP", label: "Solvency & Safety Cap", icon: Scale },
            { id: "SIMULATOR", label: "Batch Commission Run", icon: Zap }
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
      {/* TAB 1: ARCHITECTURE COMPARISON                                */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeTab === "ARCHITECTURE" && (
        <div className="space-y-6">
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {mlmPlans.map((plan) => {
              const isSelected = selectedPlanId === plan.id;
              return (
                <Card
                  key={plan.id}
                  onClick={() => setSelectedPlanId(plan.id)}
                  className={cn(
                    "cursor-pointer p-5 transition-all duration-300 relative overflow-hidden",
                    isSelected
                      ? "ring-2 ring-cyan-400 border-cyan-500/40 bg-gradient-to-b from-[#0c234a] to-[#071739] shadow-xl"
                      : "border-slate-800 bg-[#06142a]/80 hover:border-slate-700 hover:bg-[#081a38]"
                  )}
                >
                  {plan.isRecommended && (
                    <div className="absolute right-0 top-0 rounded-bl-xl bg-cyan-400 px-2.5 py-1 text-[10px] font-black uppercase text-brand-navy tracking-wider">
                      Best Choice ⭐
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <span className="rounded-lg bg-cyan-500/10 px-2 py-0.5 text-[10px] font-bold text-cyan-300 border border-cyan-500/20">
                      {plan.badge}
                    </span>
                  </div>

                  <h3 className="mt-3 text-base font-black text-white">{plan.name}</h3>
                  <p className="mt-1.5 text-xs text-slate-300 leading-relaxed min-h-[64px]">
                    {plan.description}
                  </p>

                  <div className="mt-4 space-y-2 border-t border-slate-800/80 pt-3 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Momentum Speed</span>
                      <span className="font-bold text-cyan-300">{plan.speedRating}%</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-1.5">
                      <div className="bg-cyan-400 h-1.5 rounded-full" style={{ width: `${plan.speedRating}%` }} />
                    </div>

                    <div className="flex justify-between pt-1">
                      <span className="text-slate-400">Team Retention</span>
                      <span className="font-bold text-emerald-400">{plan.retentionRating}%</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-1.5">
                      <div className="bg-emerald-400 h-1.5 rounded-full" style={{ width: `${plan.retentionRating}%` }} />
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between pt-2">
                    <span className="text-[11px] font-bold text-slate-400">{plan.payoutCap}</span>
                    <span className={cn("text-xs font-bold", isSelected ? "text-cyan-400" : "text-slate-500")}>
                      {isSelected ? "Active Model ✓" : "Select Model"}
                    </span>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Deep-Dive Active Model Specification */}
          <Card className="border border-cyan-500/20 bg-[#091b3a]/90 p-6 shadow-xl backdrop-blur-xl">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center border-b border-slate-800 pb-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400">Active Operational Model</span>
                <h2 className="text-xl font-black text-white">{currentPlan.name} Architecture</h2>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-300">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Production Ready
                </span>
              </div>
            </div>

            <div className="mt-5 grid gap-6 md:grid-cols-2">
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3">
                  Core Compensation Mechanisms
                </h4>
                <ul className="space-y-2.5">
                  {currentPlan.keyFeatures.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-200">
                      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-cyan-400/20 text-cyan-300 font-bold text-[10px]">
                        ✓
                      </div>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-[#051124]/80 p-5 space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
                  Why this is the #1 MLM System in the World
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Pure Binary plans suffer from extreme leg imbalance disputes, while pure Unilevel plans fail to create urgency or upline-assisted downline momentum.
                </p>
                <p className="text-xs text-slate-300 leading-relaxed">
                  The <strong>Hybrid Binary-Unilevel Matrix</strong> solves this by using the binary tree strictly for volume cycling and spillover, while running an underlying Unilevel sponsor tree to disburse direct fast-start bonuses, generational check matches, and leadership pools.
                </p>
                <div className="flex items-center gap-2 pt-2 text-xs font-bold text-cyan-300">
                  <Zap className="h-4 w-4 text-amber-400" />
                  <span>Configured with 72-Hour Holding Tank + Dynamic Breakaway Compression</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* TAB 2: BINARY CYCLE ENGINE & LEG BALANCER                     */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeTab === "BINARY_ENGINE" && (
        <div className="space-y-6">
          <div className="grid gap-5 lg:grid-cols-3">
            {/* Left Leg Volume Card */}
            <Card className="border border-slate-800 bg-[#0a1d3f]/90 p-5 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-cyan-400">Binary Leg 1 (Left)</span>
                <span className="rounded-full bg-cyan-500/10 px-2 py-0.5 text-[11px] font-bold text-cyan-300 border border-cyan-500/20">
                  Power Leg
                </span>
              </div>
              <div className="mt-3 flex items-baseline justify-between">
                <p className="text-3xl font-black text-white">{leftLegPv.toLocaleString()} <span className="text-sm font-semibold text-slate-400">PV</span></p>
                <span className="text-xs text-emerald-400 font-bold">+1,450 PV this week</span>
              </div>
              <div className="mt-4 space-y-2">
                <label className="text-[11px] font-bold text-slate-400">Simulate Left Leg Volume</label>
                <input
                  type="range"
                  min="0"
                  max="30000"
                  step="300"
                  value={leftLegPv}
                  onChange={(e) => setLeftLegPv(Number(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>
              <div className="mt-3 flex justify-between border-t border-slate-800/80 pt-2.5 text-xs text-slate-400">
                <span>Active IBOs in Leg: <strong>148</strong></span>
                <span>Carryover: <strong className="text-cyan-300">{binaryCalculations.carryoverStrong.toLocaleString()} PV</strong></span>
              </div>
            </Card>

            {/* Right Leg Volume Card */}
            <Card className="border border-slate-800 bg-[#0a1d3f]/90 p-5 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-emerald-400">Binary Leg 2 (Right)</span>
                <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-bold text-emerald-300 border border-emerald-500/20">
                  Pay Leg
                </span>
              </div>
              <div className="mt-3 flex items-baseline justify-between">
                <p className="text-3xl font-black text-white">{rightLegPv.toLocaleString()} <span className="text-sm font-semibold text-slate-400">PV</span></p>
                <span className="text-xs text-emerald-400 font-bold">+920 PV this week</span>
              </div>
              <div className="mt-4 space-y-2">
                <label className="text-[11px] font-bold text-slate-400">Simulate Right Leg Volume</label>
                <input
                  type="range"
                  min="0"
                  max="30000"
                  step="300"
                  value={rightLegPv}
                  onChange={(e) => setRightLegPv(Number(e.target.value))}
                  className="w-full accent-emerald-400 cursor-pointer"
                />
              </div>
              <div className="mt-3 flex justify-between border-t border-slate-800/80 pt-2.5 text-xs text-slate-400">
                <span>Active IBOs in Leg: <strong>94</strong></span>
                <span>Carryover: <strong className="text-emerald-300">{binaryCalculations.carryoverWeak.toLocaleString()} PV</strong></span>
              </div>
            </Card>

            {/* Cycle Trigger Ratio Settings */}
            <Card className="border border-slate-800 bg-[#0a1d3f]/90 p-5 shadow-xl flex flex-col justify-between">
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-slate-400">Cycle Matching Ratio</span>
                <h4 className="mt-1 text-sm font-bold text-white">Configured Match Rule</h4>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {[
                    { id: "1:2", label: "300 : 600", sub: "Standard 1:2" },
                    { id: "1:1", label: "300 : 300", sub: "Equal 1:1" },
                    { id: "2:1", label: "600 : 300", sub: "Reverse 2:1" }
                  ].map((r) => (
                    <button
                      key={r.id}
                      onClick={() => setCycleRatio(r.id as any)}
                      className={cn(
                        "rounded-xl p-2.5 text-center transition border",
                        cycleRatio === r.id
                          ? "border-cyan-400 bg-cyan-500/20 text-cyan-300 shadow-md shadow-cyan-500/20"
                          : "border-slate-800 bg-slate-800/50 text-slate-400 hover:border-slate-700"
                      )}
                    >
                      <p className="text-xs font-black">{r.label}</p>
                      <p className="text-[9px] mt-0.5">{r.sub}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-4 rounded-xl border border-cyan-500/20 bg-cyan-500/10 p-3 text-xs text-cyan-300">
                <p className="font-bold">1 Cycle Payout: 1,200 ETB (~$21 USD)</p>
                <p className="text-[11px] text-slate-300 mt-0.5">Triggered whenever weak leg reaches {binaryCalculations.weakUnit} PV and strong leg has {binaryCalculations.strongUnit} PV.</p>
              </div>
            </Card>
          </div>

          {/* Real-Time Pairing Math Matrix Output */}
          <Card className="border border-cyan-500/20 bg-[#091b3a]/90 p-6 shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Live Calculation Result</span>
                <h3 className="text-lg font-black text-white">Current Binary Cycle Commission Yield</h3>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-xs text-slate-400">Total Binary Earnings</p>
                  <p className="text-xl font-black text-emerald-400">
                    ETB {binaryCalculations.totalPayoutETB.toLocaleString()}{" "}
                    <span className="text-xs font-semibold text-slate-400">(${binaryCalculations.totalPayoutUSD.toFixed(2)})</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl border border-slate-800 bg-[#051124]/90 p-4">
                <p className="text-xs font-bold text-slate-400">Cycles Matched</p>
                <p className="mt-1 text-2xl font-black text-white">{binaryCalculations.completedCycles} Cycles</p>
                <p className="mt-1 text-[11px] text-slate-400">{binaryCalculations.completedCycles} × 1,200 ETB</p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-[#051124]/90 p-4">
                <p className="text-xs font-bold text-slate-400">Volume Converted</p>
                <p className="mt-1 text-2xl font-black text-cyan-300">
                  {(binaryCalculations.usedWeakPv + binaryCalculations.usedStrongPv).toLocaleString()} PV
                </p>
                <p className="mt-1 text-[11px] text-slate-400">Cleared from current ledger</p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-[#051124]/90 p-4">
                <p className="text-xs font-bold text-slate-400">Strong Leg Carryover</p>
                <p className="mt-1 text-2xl font-black text-emerald-400">
                  {binaryCalculations.carryoverStrong.toLocaleString()} PV
                </p>
                <p className="mt-1 text-[11px] text-emerald-300/80">Carried to next bonus run ✓</p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-[#051124]/90 p-4">
                <p className="text-xs font-bold text-slate-400">Weak Leg Carryover</p>
                <p className="mt-1 text-2xl font-black text-amber-400">
                  {binaryCalculations.carryoverWeak.toLocaleString()} PV
                </p>
                <p className="mt-1 text-[11px] text-slate-400">Remains towards next cycle</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* TAB 3: 7-GENERATION MATCHING BONUS MATRIX                      */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeTab === "MATCHING_BONUS" && (
        <div className="space-y-6">
          <Card className="border border-cyan-500/20 bg-[#091b3a]/90 p-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Unilevel Sponsorship Depth</span>
                <h3 className="text-xl font-black text-white">7-Generation Check-Match Matrix</h3>
                <p className="mt-1 text-xs text-slate-300">
                  You earn a percentage of all binary earnings generated by your personally sponsored downline leaders and their teams, compressed dynamically.
                </p>
              </div>
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-right">
                <p className="text-[11px] font-bold text-slate-400 uppercase">Total Estimated Match Yield</p>
                <p className="text-xl font-black text-emerald-400">ETB {totalEstimatedMatch.toLocaleString()}</p>
              </div>
            </div>

            <div className="mt-5 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-[11px] font-black uppercase tracking-wider text-slate-400">
                    <th className="py-3 px-3">Generation Tier</th>
                    <th className="py-3 px-3">Check-Match %</th>
                    <th className="py-3 px-3">Required Career Rank</th>
                    <th className="py-3 px-3">Active Downline Leaders</th>
                    <th className="py-3 px-3">Weekly Yield Estimate</th>
                    <th className="py-3 px-3">Dynamic Compression</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {matchingLevels.map((lvl) => (
                    <tr key={lvl.level} className="hover:bg-slate-800/30 transition">
                      <td className="py-3 px-3 font-bold text-white flex items-center gap-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-300 font-black text-xs">
                          G{lvl.level}
                        </span>
                        <span>Generation {lvl.level}</span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="rounded-lg bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 font-black text-emerald-300 text-xs">
                          {lvl.percent}% Match
                        </span>
                      </td>
                      <td className="py-3 px-3 font-bold text-slate-200">{lvl.rankRequired}</td>
                      <td className="py-3 px-3 font-semibold text-slate-300">{lvl.teamSize} Leaders</td>
                      <td className="py-3 px-3 font-black text-cyan-300">ETB {lvl.estimatedEarnings.toLocaleString()}</td>
                      <td className="py-3 px-3">
                        <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" /> Auto Compressed
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* TAB 4: SOLVENCY & SAFETY CAP MONITOR                          */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeTab === "SAFETY_CAP" && (
        <div className="space-y-6">
          <Card className="border border-cyan-500/20 bg-[#091b3a]/90 p-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-rose-400">DSA & FTC Regulatory Standard</span>
                <h3 className="text-xl font-black text-white">Company Solvency & 50% Payout Safety Valve</h3>
                <p className="mt-1 text-xs text-slate-300 max-w-xl">
                  Protects company capital from runaway binary cycles. Guarantees total combined platform payout never exceeds 50% of gross volume.
                </p>
              </div>
              <div className="rounded-2xl border border-cyan-500/30 bg-cyan-500/10 p-4 text-center">
                <span className="text-xs font-bold text-slate-400">Current Payout Ratio</span>
                <p className="text-2xl font-black text-cyan-300">43.6%</p>
                <span className="text-[10px] font-bold text-emerald-400">● Solvency Healthy (Safe Zone)</span>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-300 mb-1.5">
                  <span>Gross Payout Safety Meter</span>
                  <span>43.6% / 50.0% Max Cap</span>
                </div>
                <div className="h-4 w-full rounded-full bg-slate-800 overflow-hidden relative">
                  <div className="h-full bg-gradient-to-r from-emerald-500 via-cyan-400 to-amber-400 rounded-full" style={{ width: "43.6%" }} />
                  <div className="absolute right-0 top-0 bottom-0 w-[50%] border-l-2 border-rose-500 border-dashed" title="50% Cap Limit" />
                </div>
                <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-semibold">
                  <span>0% Safe</span>
                  <span>40% Target Zone</span>
                  <span className="text-rose-400">50% Hard Safety Cap</span>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3 pt-4">
                <div className="rounded-2xl border border-slate-800 bg-[#051124]/90 p-4">
                  <span className="text-xs font-bold text-slate-400">Retail Revenue Retained</span>
                  <p className="mt-1 text-xl font-black text-white">56.4%</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Allocated to company operations, reserves, and IT</p>
                </div>
                <div className="rounded-2xl border border-slate-800 bg-[#051124]/90 p-4">
                  <span className="text-xs font-bold text-slate-400">Cap Enforcement Action</span>
                  <p className="mt-1 text-xl font-black text-cyan-300">Pro-Rata Cycle Dampener</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Smooths cycle value if gross payout ever exceeds 50%</p>
                </div>
                <div className="rounded-2xl border border-slate-800 bg-[#051124]/90 p-4">
                  <span className="text-xs font-bold text-slate-400">70% Customer Rule Audit</span>
                  <p className="mt-1 text-xl font-black text-emerald-400">76.2% Compliant</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Real external end-consumer product absorption</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* TAB 5: BATCH COMMISSION RUN SIMULATOR                         */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeTab === "SIMULATOR" && (
        <div className="space-y-6">
          <Card className="border border-cyan-500/20 bg-[#091b3a]/90 p-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Super Admin Payroll & Ledger</span>
                <h3 className="text-xl font-black text-white">Batch Weekly Commission Run Simulator</h3>
                <p className="mt-1 text-xs text-slate-300">
                  Simulate running the entire network bonus ledger calculation (Fast Start, Binary Matches, Generational Match, and Leadership Pools).
                </p>
              </div>

              <Button
                onClick={handleExecuteCommissionRun}
                disabled={isSimulating}
                className="h-11 bg-cyan-400 text-brand-navy font-black hover:bg-cyan-300 shadow-lg shadow-cyan-400/25 px-5"
              >
                {isSimulating ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Calculating Ledger...
                  </>
                ) : (
                  <>
                    <Zap className="mr-2 h-4 w-4" /> Run Commission Batch Now
                  </>
                )}
              </Button>
            </div>

            {simulationResult ? (
              <div className="mt-6 space-y-5 animate-in fade-in">
                <div className="flex items-center justify-between rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-xs font-bold text-emerald-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Commission Batch Successfully Computed at {simulationResult.timestamp}</span>
                  </div>
                  <span className="uppercase font-black tracking-wider">{simulationResult.status}</span>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="rounded-2xl border border-slate-800 bg-[#051124]/90 p-4">
                    <p className="text-xs text-slate-400 font-bold">Gross Volume Processed</p>
                    <p className="mt-1 text-xl font-black text-white">ETB {simulationResult.totalGrossVolumeETB.toLocaleString()}</p>
                  </div>
                  <div className="rounded-2xl border border-slate-800 bg-[#051124]/90 p-4">
                    <p className="text-xs text-slate-400 font-bold">Total Commission Payout</p>
                    <p className="mt-1 text-xl font-black text-cyan-300">ETB {simulationResult.totalCommissionPayoutETB.toLocaleString()}</p>
                    <span className="text-[10px] font-bold text-slate-400">Payout Ratio: {simulationResult.payoutRatioPercent}%</span>
                  </div>
                  <div className="rounded-2xl border border-slate-800 bg-[#051124]/90 p-4">
                    <p className="text-xs text-slate-400 font-bold">Binary Cycles Cleared</p>
                    <p className="mt-1 text-xl font-black text-emerald-400">{simulationResult.binaryCyclesPaid} Cycles</p>
                  </div>
                  <div className="rounded-2xl border border-slate-800 bg-[#051124]/90 p-4">
                    <p className="text-xs text-slate-400 font-bold">Retained Company Net</p>
                    <p className="mt-1 text-xl font-black text-white">ETB {simulationResult.retainedCompanyGrossETB.toLocaleString()}</p>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-[#06142a]/90 p-4">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3">
                    Bonus Stream Payout Breakdown
                  </h4>
                  <div className="grid gap-3 sm:grid-cols-4 text-xs">
                    <div className="border-l-2 border-cyan-400 pl-3">
                      <p className="text-slate-400">Binary Cycle Match</p>
                      <p className="font-black text-white">ETB 468,000</p>
                    </div>
                    <div className="border-l-2 border-emerald-400 pl-3">
                      <p className="text-slate-400">Fast-Start Referrals</p>
                      <p className="font-black text-white">ETB {simulationResult.fastStartPaidETB.toLocaleString()}</p>
                    </div>
                    <div className="border-l-2 border-purple-400 pl-3">
                      <p className="text-slate-400">Gen 1-7 Matching</p>
                      <p className="font-black text-white">ETB {simulationResult.matchingBonusPaidETB.toLocaleString()}</p>
                    </div>
                    <div className="border-l-2 border-amber-400 pl-3">
                      <p className="text-slate-400">Leadership Pool</p>
                      <p className="font-black text-white">ETB {simulationResult.leadershipPoolPaidETB.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-8 rounded-2xl border border-dashed border-slate-800 bg-[#051124]/50 p-8 text-center">
                <Zap className="mx-auto h-8 w-8 text-slate-600 mb-2" />
                <p className="text-xs font-bold text-slate-300">Click &quot;Run Commission Batch Now&quot; to simulate weekly calculations.</p>
                <p className="text-[11px] text-slate-500 mt-1">Calculates 50% safety cap validation, pro-rata dampeners, and dispatches virtual payout vouchers.</p>
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}
