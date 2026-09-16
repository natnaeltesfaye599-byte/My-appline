"use client";

import { useState } from "react";
import {
  Calculator,
  CircleDollarSign,
  TrendingUp,
  Users,
  X,
  Zap,
  ChevronDown,
  Award
} from "lucide-react";
import { cn } from "@/lib/utils";

interface EarningsCalculatorProps {
  isOpen: boolean;
  onClose: () => void;
}

const packages = [
  { name: "Diamond Leader", pv: 500, priceETB: 14990, tier: 1 },
  { name: "Gold Executive", pv: 250, priceETB: 8490, tier: 2 },
  { name: "Silver Associate", pv: 100, priceETB: 3990, tier: 3 },
  { name: "Bronze Starter", pv: 50, priceETB: 1990, tier: 4 }
];

const ranks = [
  { name: "Bronze Starter", minGV: 0, binaryRate: 0.05, matchingRate: 0 },
  { name: "Silver Associate", minGV: 2000, binaryRate: 0.07, matchingRate: 0.05 },
  { name: "Gold Executive", minGV: 10000, binaryRate: 0.09, matchingRate: 0.07 },
  { name: "Diamond Director", minGV: 50000, binaryRate: 0.12, matchingRate: 0.1 },
  { name: "Crown Diamond", minGV: 150000, binaryRate: 0.15, matchingRate: 0.15 }
];

function formatETB(n: number) {
  return `ETB ${n.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

export function EarningsCalculator({ isOpen, onClose }: EarningsCalculatorProps) {
  const [selectedPkg, setSelectedPkg] = useState(packages[0]);
  const [teamSize, setTeamSize] = useState(10);
  const [activeRate, setActiveRate] = useState(70); // % of team active
  const [avgPkgIndex, setAvgPkgIndex] = useState(2); // avg downline package

  if (!isOpen) return null;

  const activeMembers = Math.round((teamSize * activeRate) / 100);
  const downlinePkg = packages[avgPkgIndex];
  const groupVolume = activeMembers * downlinePkg.pv + selectedPkg.pv;

  // Find applicable rank
  const applicableRank =
    [...ranks].reverse().find((r) => groupVolume >= r.minGV) ?? ranks[0];

  const binaryCommission = groupVolume * applicableRank.binaryRate;
  const matchingCommission = binaryCommission * applicableRank.matchingRate;
  const leadershipBonus = applicableRank.minGV > 0 ? groupVolume * 0.01 : 0;
  const totalMonthly = binaryCommission + matchingCommission + leadershipBonus;

  const nextRank = ranks.find((r) => r.minGV > groupVolume);
  const pvToNextRank = nextRank ? nextRank.minGV - groupVolume : 0;
  const membersToNextRank = nextRank
    ? Math.max(0, Math.ceil(pvToNextRank / downlinePkg.pv))
    : 0;

  return (
    <div
      className="fixed inset-0 z-[55] flex items-end justify-center sm:items-center sm:px-4 bg-slate-900/50 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        id="earnings-calculator-modal"
        className="w-full max-w-2xl overflow-hidden rounded-t-2xl sm:rounded-2xl border border-slate-200 bg-white shadow-2xl animate-in fade-in slide-in-from-bottom-4 sm:zoom-in-95 duration-200 max-h-[92vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-gradient-to-r from-brand-navy to-[#0e2a5e] px-6 py-4 text-white">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-400/20 text-cyan-300">
              <Calculator className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-black">Commission & Earnings Calculator</h2>
              <p className="text-[11px] text-white/60">Simulate your monthly income potential</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/50 hover:text-white transition">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid overflow-y-auto md:grid-cols-[1fr_280px]">
          {/* Left: Controls */}
          <div className="space-y-5 border-r border-slate-100 p-6">
            {/* Your Package */}
            <div>
              <label className="mb-2 block text-[10px] font-black uppercase tracking-wider text-slate-500">
                Your Package
              </label>
              <div className="grid grid-cols-2 gap-2">
                {packages.map((pkg) => (
                  <button
                    key={pkg.name}
                    onClick={() => setSelectedPkg(pkg)}
                    className={cn(
                      "rounded-xl border p-3 text-left transition",
                      selectedPkg.name === pkg.name
                        ? "border-brand-navy bg-brand-navy/5 ring-1 ring-brand-navy"
                        : "border-slate-200 hover:border-slate-300"
                    )}
                  >
                    <p className={cn("text-xs font-black", selectedPkg.name === pkg.name ? "text-brand-navy" : "text-slate-700")}>{pkg.name}</p>
                    <p className="text-[10px] text-slate-400">{pkg.pv} PV · {formatETB(pkg.priceETB)}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Team Size */}
            <div>
              <label className="mb-2 block text-[10px] font-black uppercase tracking-wider text-slate-500">
                Total Team Size — <span className="text-brand-navy">{teamSize} members</span>
              </label>
              <input
                type="range"
                min={1}
                max={500}
                value={teamSize}
                onChange={(e) => setTeamSize(Number(e.target.value))}
                className="w-full accent-cyan-500"
              />
              <div className="mt-1 flex justify-between text-[10px] text-slate-400 font-bold">
                <span>1</span><span>250</span><span>500</span>
              </div>
            </div>

            {/* Active Rate */}
            <div>
              <label className="mb-2 block text-[10px] font-black uppercase tracking-wider text-slate-500">
                Active Rate — <span className="text-brand-navy">{activeRate}% ({activeMembers} active)</span>
              </label>
              <input
                type="range"
                min={10}
                max={100}
                step={5}
                value={activeRate}
                onChange={(e) => setActiveRate(Number(e.target.value))}
                className="w-full accent-emerald-500"
              />
              <div className="mt-1 flex justify-between text-[10px] text-slate-400 font-bold">
                <span>10%</span><span>55%</span><span>100%</span>
              </div>
            </div>

            {/* Avg Downline Package */}
            <div>
              <label className="mb-2 block text-[10px] font-black uppercase tracking-wider text-slate-500">
                Avg. Downline Package
              </label>
              <div className="flex gap-2">
                {packages.map((pkg, i) => (
                  <button
                    key={pkg.name}
                    onClick={() => setAvgPkgIndex(i)}
                    className={cn(
                      "flex-1 rounded-lg border py-1.5 text-[10px] font-black transition",
                      avgPkgIndex === i
                        ? "border-cyan-400 bg-cyan-50 text-cyan-700"
                        : "border-slate-200 text-slate-500 hover:border-slate-300"
                    )}
                  >
                    {pkg.pv}PV
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Results */}
          <div className="flex flex-col bg-slate-50 p-6">
            {/* GV Summary */}
            <div className="mb-4 rounded-xl border border-slate-200 bg-white p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-cyan-500" />
                <span className="text-[10px] font-black uppercase text-slate-500">Group Volume</span>
              </div>
              <p className="text-2xl font-black text-brand-navy">
                {groupVolume.toLocaleString()} GV
              </p>
              <div className="mt-1.5 flex items-center gap-1.5">
                <Award className="h-3 w-3 text-amber-500" />
                <span className="text-[11px] font-bold text-amber-600">{applicableRank.name}</span>
              </div>
            </div>

            {/* Breakdown */}
            <div className="space-y-2.5 flex-1">
              {[
                { label: "Binary Commission", value: binaryCommission, color: "text-cyan-600", rate: `${(applicableRank.binaryRate * 100).toFixed(0)}%` },
                { label: "Matching Bonus", value: matchingCommission, color: "text-purple-600", rate: `${(applicableRank.matchingRate * 100).toFixed(0)}%` },
                { label: "Leadership Bonus", value: leadershipBonus, color: "text-emerald-600", rate: "1%" }
              ].map(({ label, value, color, rate }) => (
                <div key={label} className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2">
                  <div>
                    <p className="text-[11px] font-bold text-slate-700">{label}</p>
                    <p className="text-[10px] text-slate-400">Rate: {rate}</p>
                  </div>
                  <span className={cn("text-sm font-black", color)}>{formatETB(value)}</span>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="mt-4 rounded-xl bg-brand-navy p-4 text-white">
              <div className="flex items-center gap-2 mb-1">
                <CircleDollarSign className="h-4 w-4 text-cyan-300" />
                <span className="text-[10px] font-black uppercase text-cyan-300">Est. Monthly Earnings</span>
              </div>
              <p className="text-2xl font-black">{formatETB(totalMonthly)}</p>
              <p className="text-[10px] text-white/50 mt-1">
                Annual projection: {formatETB(totalMonthly * 12)}
              </p>
            </div>

            {/* Next Rank */}
            {nextRank && (
              <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
                <p className="text-[10px] font-black text-amber-700">
                  🎯 +{membersToNextRank} active members to reach{" "}
                  <strong>{nextRank.name}</strong>
                </p>
              </div>
            )}

            <p className="mt-3 text-[9px] text-slate-400 text-center leading-relaxed">
              * Estimates based on BSC compensation model. Actual results vary.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
