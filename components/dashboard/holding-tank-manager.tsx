"use client";

import { useState } from "react";
import {
  Network,
  Users,
  Search,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowRight,
  SlidersHorizontal,
  ChevronRight,
  Download,
  Printer,
  Sparkles,
  UserCheck,
  Building,
  Check,
  X,
  ShieldCheck,
  HelpCircle,
  TrendingUp,
  Layers,
  ArrowRightLeft
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { exportToCsv, printSection } from "@/lib/export-utils";

export interface HoldingTankMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  packageType: string;
  pv: number;
  enrolledAt: string;
  hoursRemaining: number;
  sponsorName: string;
  sponsorId: string;
  city: string;
}

export interface PlacedRecord {
  id: string;
  memberName: string;
  placedUnderName: string;
  leg: "LEFT" | "RIGHT";
  placedAt: string;
  method: "MANUAL" | "AUTO_EXPIRY";
  pv: number;
}

const initialHoldingTank: HoldingTankMember[] = [
  {
    id: "HT-101",
    name: "Marta Girma",
    email: "marta.girma@gmail.com",
    phone: "+251 911 889 900",
    packageType: "Diamond Leader",
    pv: 500,
    enrolledAt: "2026-10-09 09:30",
    hoursRemaining: 58,
    sponsorName: "Super Admin",
    sponsorId: "usr-admin-01",
    city: "Addis Ababa"
  },
  {
    id: "HT-102",
    name: "Yared Wolde",
    email: "yared.w@yahoo.com",
    phone: "+251 922 445 566",
    packageType: "Gold Executive",
    pv: 250,
    enrolledAt: "2026-10-09 11:15",
    hoursRemaining: 62,
    sponsorName: "Super Admin",
    sponsorId: "usr-admin-01",
    city: "Hawassa"
  },
  {
    id: "HT-103",
    name: "Bethlehem Tadesse",
    email: "betty.tadesse@gmail.com",
    phone: "+251 933 112 233",
    packageType: "Silver Associate",
    pv: 100,
    enrolledAt: "2026-10-08 14:00",
    hoursRemaining: 18,
    sponsorName: "Super Admin",
    sponsorId: "usr-admin-01",
    city: "Bahir Dar"
  },
  {
    id: "HT-104",
    name: "Samuel Kebede",
    email: "samuel.k@gmail.com",
    phone: "+251 944 556 677",
    packageType: "Diamond Leader",
    pv: 500,
    enrolledAt: "2026-10-08 16:45",
    hoursRemaining: 21,
    sponsorName: "Super Admin",
    sponsorId: "usr-admin-01",
    city: "Adama"
  }
];

const initialPlacementHistory: PlacedRecord[] = [
  {
    id: "PL-501",
    memberName: "Alemayehu Teshome",
    placedUnderName: "Coach Ephrem Alemu",
    leg: "LEFT",
    placedAt: "2026-10-07 16:30",
    method: "MANUAL",
    pv: 500
  },
  {
    id: "PL-502",
    memberName: "Rahel Bekele",
    placedUnderName: "Tewodros Kassaye",
    leg: "RIGHT",
    placedAt: "2026-10-06 11:20",
    method: "MANUAL",
    pv: 250
  },
  {
    id: "PL-503",
    memberName: "Natnael Desta",
    placedUnderName: "Dawit Mengistu",
    leg: "RIGHT",
    placedAt: "2026-10-05 09:10",
    method: "AUTO_EXPIRY",
    pv: 100
  }
];

export function HoldingTankManager({ onOpenAi }: { onOpenAi?: (prompt: string) => void }) {
  const [holdingTank, setHoldingTank] = useState<HoldingTankMember[]>(initialHoldingTank);
  const [history, setHistory] = useState<PlacedRecord[]>(initialPlacementHistory);
  const [searchQuery, setSearchQuery] = useState("");
  const [defaultRule, setDefaultRule] = useState<"WEAK_LEG" | "EXTREME_LEFT" | "EXTREME_RIGHT" | "ALTERNATE">("WEAK_LEG");

  // Placement Modal State
  const [selectedMember, setSelectedMember] = useState<HoldingTankMember | null>(null);
  const [targetParent, setTargetParent] = useState("usr-admin-01 (Super Admin - Root)");
  const [targetLeg, setTargetLeg] = useState<"LEFT" | "RIGHT">("RIGHT");
  const [successToast, setSuccessToast] = useState("");

  const filteredMembers = holdingTank.filter(
    (m) =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.packageType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenPlacementModal = (member: HoldingTankMember) => {
    setSelectedMember(member);
    // Suggest leg based on current default rule
    if (defaultRule === "EXTREME_LEFT") setTargetLeg("LEFT");
    else if (defaultRule === "EXTREME_RIGHT") setTargetLeg("RIGHT");
    else setTargetLeg("RIGHT"); // Weak leg default
  };

  const handleConfirmPlacement = () => {
    if (!selectedMember) return;

    // Create placement record
    const newRecord: PlacedRecord = {
      id: `PL-${Date.now().toString().slice(-4)}`,
      memberName: selectedMember.name,
      placedUnderName: targetParent.split("(")[1]?.replace(")", "") || targetParent,
      leg: targetLeg,
      placedAt: new Date().toLocaleString(),
      method: "MANUAL",
      pv: selectedMember.pv
    };

    setHistory([newRecord, ...history]);
    setHoldingTank(holdingTank.filter((m) => m.id !== selectedMember.id));
    setSuccessToast(`Successfully placed ${selectedMember.name} onto ${targetLeg} Leg of ${newRecord.placedUnderName}!`);
    setSelectedMember(null);

    setTimeout(() => {
      setSuccessToast("");
    }, 4000);
  };

  const handleExportTank = () => {
    exportToCsv("MyUpline_Holding_Tank_Roster", holdingTank as any);
  };

  return (
    <div id="holding-tank-printable" className="space-y-6">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-cyan-500/30 bg-gradient-to-br from-[#071739] via-[#0b2447] to-[#040e21] p-6 text-white shadow-2xl backdrop-blur-xl sm:p-8">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/40 bg-cyan-500/15 px-3 py-1 text-xs font-black text-cyan-300">
              <Clock className="h-3.5 w-3.5" /> 72-Hour Strategic Placement Grace Period
            </div>
            <h1 className="mt-3 text-2xl font-black tracking-tight sm:text-3xl text-white">
              Holding Tank & Spillover Placement Manager
            </h1>
            <p className="mt-1.5 max-w-2xl text-xs sm:text-sm text-slate-300">
              Direct sponsors have 72 hours to strategically position new enrollments into the Left or Right binary leg before auto-placement rules execute.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              onClick={() => onOpenAi?.("Explain how strategic holding tank placement balances binary weak legs to maximize weekly cycle commissions.")}
              variant="ghost"
              className="border border-cyan-500/30 bg-cyan-500/10 text-xs font-bold text-cyan-300 hover:bg-cyan-500/20"
            >
              <Sparkles className="mr-1.5 h-3.5 w-3.5" /> AI Strategy
            </Button>
            <Button onClick={handleExportTank} className="border border-slate-700 bg-slate-800/80 text-xs font-bold text-white hover:bg-slate-800">
              <Download className="mr-1.5 h-3.5 w-3.5" /> Export Tank
            </Button>
            <Button onClick={() => printSection("holding-tank-printable", "Holding Tank")} className="border border-slate-700 bg-slate-800/80 text-xs font-bold text-white hover:bg-slate-800">
              <Printer className="mr-1.5 h-3.5 w-3.5" /> Print
            </Button>
          </div>
        </div>

        {/* Global Strategy Selector */}
        <div className="mt-6 rounded-2xl border border-slate-800/80 bg-[#051124]/90 p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-cyan-400">Default Auto-Placement Rule</span>
              <p className="text-xs text-slate-300">Executed automatically if recruit is not manually positioned within 72 hours.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                { id: "WEAK_LEG", label: "Auto-Balance (Weak Leg)", sub: "Recommended" },
                { id: "EXTREME_LEFT", label: "Extreme Left (Power)", sub: "Spillover" },
                { id: "EXTREME_RIGHT", label: "Extreme Right", sub: "Inner Leg" },
                { id: "ALTERNATE", label: "50/50 Alternate", sub: "Even Split" }
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setDefaultRule(opt.id as any)}
                  className={cn(
                    "rounded-xl px-3 py-1.5 text-xs font-bold transition border text-left",
                    defaultRule === opt.id
                      ? "border-cyan-400 bg-cyan-500/20 text-cyan-300 shadow-md shadow-cyan-500/20"
                      : "border-slate-800 bg-slate-800/40 text-slate-400 hover:border-slate-700"
                  )}
                >
                  <span>{opt.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Success Notification */}
      {successToast && (
        <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/15 p-4 text-xs font-bold text-emerald-300 shadow-lg animate-in fade-in flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Main Grid: Holding Tank Queue & Placement History */}
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        {/* Left: Holding Tank Queue */}
        <Card className="border border-cyan-500/20 bg-[#091b3a]/90 p-6 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-white">Pending Placement Queue</h3>
                <span className="rounded-full bg-cyan-400 px-2 py-0.5 text-xs font-black text-brand-navy">
                  {holdingTank.length} Awaiting
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">Click &quot;Assign Placement&quot; to permanently position into binary lineage.</p>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search recruit..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9 w-48 rounded-xl border border-slate-700 bg-[#06142a] pl-9 pr-3 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div className="mt-4 space-y-3">
            {filteredMembers.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500">
                No recruits currently in the holding tank. All members are positioned in the tree.
              </div>
            ) : (
              filteredMembers.map((member) => (
                <div
                  key={member.id}
                  className="rounded-2xl border border-slate-800 bg-[#051124]/90 p-4 transition hover:border-cyan-500/40 hover:bg-[#071833]"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-white text-sm">{member.name}</h4>
                        <span className="rounded-md bg-cyan-500/10 px-2 py-0.5 text-[10px] font-bold text-cyan-300 border border-cyan-500/20">
                          {member.packageType}
                        </span>
                        <span className="font-bold text-xs text-emerald-400">+{member.pv} PV</span>
                      </div>
                      <p className="mt-1 text-xs text-slate-400">
                        {member.email} • {member.phone} • {member.city}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className={cn(
                          "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-black uppercase",
                          member.hoursRemaining <= 24
                            ? "bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-pulse"
                            : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                        )}>
                          <Clock className="h-3 w-3" /> {member.hoursRemaining}h Left
                        </span>
                        <p className="text-[10px] text-slate-500 mt-0.5">Enrolled {member.enrolledAt.split(" ")[0]}</p>
                      </div>

                      <Button
                        onClick={() => handleOpenPlacementModal(member)}
                        className="h-9 bg-cyan-400 text-brand-navy font-black hover:bg-cyan-300 text-xs shadow-md shadow-cyan-400/20"
                      >
                        Assign Placement <ChevronRight className="ml-1 h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Right: Placement History & Spillover Audit */}
        <Card className="border border-slate-800 bg-[#091b3a]/90 p-6 shadow-xl">
          <div className="border-b border-slate-800 pb-4">
            <h3 className="text-lg font-black text-white">Recent Placements Log</h3>
            <p className="text-xs text-slate-400 mt-0.5">Audit log of positioned recruits and leg volume contributions.</p>
          </div>

          <div className="mt-4 space-y-3">
            {history.map((rec) => (
              <div key={rec.id} className="rounded-xl border border-slate-800/80 bg-[#051124]/70 p-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">{rec.memberName}</span>
                  <span className={cn(
                    "rounded-md px-1.5 py-0.5 text-[10px] font-black uppercase",
                    rec.leg === "LEFT" ? "bg-cyan-500/20 text-cyan-300" : "bg-emerald-500/20 text-emerald-300"
                  )}>
                    {rec.leg} Leg
                  </span>
                </div>
                <div className="mt-1 flex items-center justify-between text-slate-400 text-[11px]">
                  <span>Under: <strong className="text-slate-300">{rec.placedUnderName}</strong></span>
                  <span className="text-emerald-400 font-bold">+{rec.pv} PV</span>
                </div>
                <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-500 border-t border-slate-800/60 pt-1">
                  <span>{rec.placedAt}</span>
                  <span>Method: {rec.method}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Interactive Placement Modal */}
      {selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-in fade-in">
          <Card className="w-full max-w-lg border border-cyan-500/30 bg-[#0c1e3d] p-6 shadow-2xl text-white">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase text-cyan-400 tracking-wider">Placement Node Configuration</span>
                <h3 className="text-lg font-black text-white">Position {selectedMember.name}</h3>
              </div>
              <button
                onClick={() => setSelectedMember(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <div className="rounded-xl border border-slate-800 bg-[#06142a] p-3 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Package Level:</span>
                  <span className="font-bold text-white">{selectedMember.packageType}</span>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-slate-400">Personal Volume:</span>
                  <span className="font-black text-cyan-300">+{selectedMember.pv} PV</span>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-slate-400">Sponsor:</span>
                  <span className="font-semibold text-slate-300">{selectedMember.sponsorName}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Place Under Target Parent Node
                </label>
                <select
                  value={targetParent}
                  onChange={(e) => setTargetParent(e.target.value)}
                  className="w-full h-11 rounded-xl border border-slate-700 bg-[#06142a] px-3 text-xs text-white outline-none focus:border-cyan-400"
                >
                  <option value="usr-admin-01 (Super Admin - Root)">usr-admin-01 (Super Admin - Tree Root)</option>
                  <option value="usr-41d1661b (Coach Ephrem Alemu)">usr-41d1661b (Coach Ephrem Alemu - Diamond Leader)</option>
                  <option value="usr-907d6962 (Tewodros Kassaye)">usr-907d6962 (Tewodros Kassaye - Gold Executive)</option>
                  <option value="usr-dawit-01 (Dawit Mengistu)">usr-dawit-01 (Dawit Mengistu - Faculty Squad)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Target Leg Position
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setTargetLeg("LEFT")}
                    className={cn(
                      "rounded-xl p-3 border text-left transition",
                      targetLeg === "LEFT"
                        ? "border-cyan-400 bg-cyan-500/20 text-cyan-300 ring-2 ring-cyan-400/30"
                        : "border-slate-800 bg-slate-800/40 text-slate-400 hover:border-slate-700"
                    )}
                  >
                    <p className="font-black text-sm">Left Leg (Power)</p>
                    <p className="text-[10px] mt-0.5 text-slate-400">Builds team volume bank</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTargetLeg("RIGHT")}
                    className={cn(
                      "rounded-xl p-3 border text-left transition",
                      targetLeg === "RIGHT"
                        ? "border-emerald-400 bg-emerald-500/20 text-emerald-300 ring-2 ring-emerald-400/30"
                        : "border-slate-800 bg-slate-800/40 text-slate-400 hover:border-slate-700"
                    )}
                  >
                    <p className="font-black text-sm">Right Leg (Pay)</p>
                    <p className="text-[10px] mt-0.5 text-slate-400">Triggers binary cycle payouts</p>
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3 border-t border-slate-800 pt-4">
              <Button
                variant="ghost"
                onClick={() => setSelectedMember(null)}
                className="text-xs font-bold text-slate-400 hover:text-white"
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmPlacement}
                className="h-10 bg-cyan-400 text-brand-navy font-black hover:bg-cyan-300 text-xs shadow-lg shadow-cyan-400/25 px-5"
              >
                Confirm Placement <Check className="ml-1.5 h-4 w-4" />
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
