"use client";

import { useState } from "react";
import {
  Activity,
  ArrowUpDown,
  BookOpen,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Download,
  Eye,
  FileSpreadsheet,
  Filter,
  Flame,
  Layers,
  Mail,
  Network,
  Phone,
  Printer,
  Search,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  User,
  Users,
  X
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { exportToCsv, printSection } from "@/lib/export-utils";

export interface DownlineMember {
  // 1. Every Detail
  id: string;
  fullName: string;
  avatar: string;
  phone: string;
  email: string;
  sponsorName: string;
  level: number; // 1, 2, 3...
  joinDate: string;
  kycStatus: "VERIFIED" | "PENDING" | "REJECTED";
  rank: "Diamond" | "Gold" | "Silver" | "Bronze" | "Member";

  // 2. Activity
  lastActive: string;
  loginStreak: number;
  lmsModulesDone: number;
  lmsTotalModules: number;
  activeLeadsCount: number;
  lastOrderDate: string;

  // 3. KPI
  conversionRate: number; // e.g. 38.5%
  monthlyPv: number; // Personal Volume
  monthlyGv: number; // Group Volume
  monthlyRecruits: number;
  retentionRate: number; // e.g. 92%
}

const mockDownline: DownlineMember[] = [
  {
    id: "UPL-101",
    fullName: "Almaz Tadesse",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    phone: "+251 91 123 4567",
    email: "almaz.tadesse@example.com",
    sponsorName: "You (Direct)",
    level: 1,
    joinDate: "Jan 12, 2026",
    kycStatus: "VERIFIED",
    rank: "Diamond",
    lastActive: "14 mins ago",
    loginStreak: 19,
    lmsModulesDone: 10,
    lmsTotalModules: 10,
    activeLeadsCount: 24,
    lastOrderDate: "Yesterday",
    conversionRate: 42.5,
    monthlyPv: 12500,
    monthlyGv: 385000,
    monthlyRecruits: 14,
    retentionRate: 96
  },
  {
    id: "UPL-102",
    fullName: "Biniam Haile",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    phone: "+251 92 876 5432",
    email: "biniam.haile@example.com",
    sponsorName: "You (Direct)",
    level: 1,
    joinDate: "Feb 03, 2026",
    kycStatus: "VERIFIED",
    rank: "Gold",
    lastActive: "2 hrs ago",
    loginStreak: 12,
    lmsModulesDone: 8,
    lmsTotalModules: 10,
    activeLeadsCount: 18,
    lastOrderDate: "3 days ago",
    conversionRate: 36.0,
    monthlyPv: 8400,
    monthlyGv: 210000,
    monthlyRecruits: 9,
    retentionRate: 91
  },
  {
    id: "UPL-201",
    fullName: "Selamawit Bekele",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    phone: "+251 93 456 7890",
    email: "selamawit.bekele@example.com",
    sponsorName: "Almaz Tadesse",
    level: 2,
    joinDate: "Mar 19, 2026",
    kycStatus: "VERIFIED",
    rank: "Silver",
    lastActive: "35 mins ago",
    loginStreak: 8,
    lmsModulesDone: 7,
    lmsTotalModules: 10,
    activeLeadsCount: 15,
    lastOrderDate: "May 29, 2026",
    conversionRate: 29.8,
    monthlyPv: 6200,
    monthlyGv: 95000,
    monthlyRecruits: 6,
    retentionRate: 88
  },
  {
    id: "UPL-202",
    fullName: "Yonas Mekonnen",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    phone: "+251 94 321 0987",
    email: "yonas.mekonnen@example.com",
    sponsorName: "Biniam Haile",
    level: 2,
    joinDate: "Apr 04, 2026",
    kycStatus: "PENDING",
    rank: "Bronze",
    lastActive: "1 day ago",
    loginStreak: 4,
    lmsModulesDone: 5,
    lmsTotalModules: 10,
    activeLeadsCount: 9,
    lastOrderDate: "Jun 01, 2026",
    conversionRate: 21.0,
    monthlyPv: 3800,
    monthlyGv: 48000,
    monthlyRecruits: 4,
    retentionRate: 82
  },
  {
    id: "UPL-301",
    fullName: "Tigist Assefa",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    phone: "+251 95 678 1234",
    email: "tigist.assefa@example.com",
    sponsorName: "Selamawit Bekele",
    level: 3,
    joinDate: "May 10, 2026",
    kycStatus: "VERIFIED",
    rank: "Member",
    lastActive: "4 hrs ago",
    loginStreak: 6,
    lmsModulesDone: 4,
    lmsTotalModules: 10,
    activeLeadsCount: 11,
    lastOrderDate: "Jun 02, 2026",
    conversionRate: 18.5,
    monthlyPv: 2400,
    monthlyGv: 24000,
    monthlyRecruits: 2,
    retentionRate: 85
  },
  {
    id: "UPL-302",
    fullName: "Kassahun Desta",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80",
    phone: "+251 96 789 2345",
    email: "kassahun.desta@example.com",
    sponsorName: "Yonas Mekonnen",
    level: 3,
    joinDate: "May 22, 2026",
    kycStatus: "VERIFIED",
    rank: "Member",
    lastActive: "5 days ago",
    loginStreak: 1,
    lmsModulesDone: 2,
    lmsTotalModules: 10,
    activeLeadsCount: 3,
    lastOrderDate: "May 25, 2026",
    conversionRate: 12.0,
    monthlyPv: 1100,
    monthlyGv: 11000,
    monthlyRecruits: 1,
    retentionRate: 70
  }
];

export function DownlineCollector({
  onOpenAi
}: {
  onOpenAi?: (prompt: string) => void;
}) {
  const [members, setMembers] = useState<DownlineMember[]>(mockDownline);
  const [searchQuery, setSearchQuery] = useState("");
  const [levelFilter, setLevelFilter] = useState<number | "all">("all");
  const [selectedMember, setSelectedMember] = useState<DownlineMember | null>(null);
  const [viewTab, setViewTab] = useState<"all" | "detail" | "activity" | "kpi">("all");

  const filteredMembers = members.filter((m) => {
    const matchesSearch =
      m.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.phone.includes(searchQuery) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = levelFilter === "all" || m.level === levelFilter;
    return matchesSearch && matchesLevel;
  });

  function exportCsv() {
    const rows = filteredMembers.map((m) => ({
      "Downline ID": m.id,
      "Full Name": m.fullName,
      "Phone": m.phone,
      "Email": m.email,
      "Sponsor": m.sponsorName,
      "Depth Level": `L${m.level}`,
      "Rank": m.rank,
      "KYC Status": m.kycStatus,
      "Join Date": m.joinDate,
      "Last Active": m.lastActive,
      "LMS Completed": `${m.lmsModulesDone}/${m.lmsTotalModules}`,
      "Active Leads": m.activeLeadsCount,
      "Monthly PV": m.monthlyPv,
      "Group GV": m.monthlyGv,
      "Conversion Rate": `${m.conversionRate}%`,
      "New Recruits": m.monthlyRecruits,
      "Retention Rate": `${m.retentionRate}%`,
    }));

    exportToCsv(`MyUpline_DownlineNetwork_${new Date().toISOString().slice(0, 10)}`, rows);
  }

  function handlePrintDownline() {
    printSection("downline-table-printable", "Downline Intelligence & Lineage Performance Roster");
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-gradient-to-r from-brand-navy via-brand-deep to-[#0e3b82] p-6 text-white shadow-xl">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-cyan/40 bg-brand-cyan/10 px-3 py-1 text-xs font-semibold text-brand-cyan">
            <Network className="h-3.5 w-3.5" />
            Downline Intelligence Engine
          </div>
          <h2 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">
            Data Collector → Downline
          </h2>
          <p className="mt-1 text-sm text-white/75">
            Full-spectrum downline registry capturing <strong>Every Detail</strong>, <strong>Real-Time Activity</strong>, and <strong>Core KPIs</strong> across all team depths.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            onClick={() =>
              onOpenAi?.(
                "Perform a comprehensive KPI and activity bottleneck analysis on my downline team. Identify which levels need coaching."
              )
            }
            className="brand-gradient font-bold text-brand-navy shadow-lg"
          >
            <Sparkles className="mr-2 h-4 w-4" />
            AI Downline Audit
          </Button>
          <Button
            variant="secondary"
            onClick={exportCsv}
            className="border-white/20 bg-white/10 hover:bg-white/20 text-white"
          >
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            Export Full CSV
          </Button>
          <Button
            variant="secondary"
            onClick={handlePrintDownline}
            className="border-white/20 bg-white/10 hover:bg-white/20 text-white"
          >
            <Printer className="mr-2 h-4 w-4" />
            Print / PDF
          </Button>
        </div>
      </div>

      {/* 3 Core Dimensions Bar (Every Detail, Activity, KPI) */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-100 text-brand-blue font-bold">
              <User className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Dimension 1</p>
              <h3 className="font-black text-brand-navy text-sm">Every Detail</h3>
            </div>
          </div>
          <p className="mt-2 text-xs text-slate-600">
            ID, Full Name, Contact, Sponsor, Lineage Depth (L1–L3+), KYC Verification.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 font-bold">
              <Activity className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Dimension 2</p>
              <h3 className="font-black text-brand-navy text-sm">Activity</h3>
            </div>
          </div>
          <p className="mt-2 text-xs text-slate-600">
            Last seen, Login streak, LMS Academy completion, Active pipeline leads.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-700 font-bold">
              <TrendingUp className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Dimension 3</p>
              <h3 className="font-black text-brand-navy text-sm">KPIs</h3>
            </div>
          </div>
          <p className="mt-2 text-xs text-slate-600">
            Conversion Rate, Personal Volume (PV), Group Volume (GV), Monthly recruits, Retention.
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <Card className="p-4 border-slate-200 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-1 items-center gap-3 min-w-[260px]">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, email, phone, or member ID..."
              className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm outline-none focus:border-brand-blue"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Level Filter */}
          <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50 p-1 text-xs font-semibold text-slate-600">
            <span className="px-2 text-slate-400 font-bold">DEPTH:</span>
            {[
              { id: "all", label: "All" },
              { id: 1, label: "L1 (Direct)" },
              { id: 2, label: "L2" },
              { id: 3, label: "L3" }
            ].map((lvl) => (
              <button
                key={String(lvl.id)}
                onClick={() => setLevelFilter(lvl.id as typeof levelFilter)}
                className={cn(
                  "rounded px-2.5 py-1 transition",
                  levelFilter === lvl.id
                    ? "brand-gradient text-brand-navy font-bold shadow-sm"
                    : "hover:bg-slate-200/60"
                )}
              >
                {lvl.label}
              </button>
            ))}
          </div>

          {/* View Tab Filter */}
          <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50 p-1 text-xs font-semibold text-slate-600">
            {[
              { id: "all", label: "All 3 Dimensions" },
              { id: "detail", label: "Every Detail" },
              { id: "activity", label: "Activity" },
              { id: "kpi", label: "KPIs" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setViewTab(tab.id as typeof viewTab)}
                className={cn(
                  "rounded px-2.5 py-1 transition",
                  viewTab === tab.id
                    ? "bg-brand-navy text-white font-bold"
                    : "hover:bg-slate-200/60"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Downline Table with 3 Distinct Dimension Columns */}
      <Card id="downline-table-printable" className="overflow-hidden border-slate-200 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50/90 text-[11px] font-black uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-3.5">
                  <span className="text-brand-blue">#1</span> Every Detail (Profile & Tier)
                </th>
                {(viewTab === "all" || viewTab === "detail") && (
                  <th className="px-4 py-3.5">Contact & Sponsor</th>
                )}
                {(viewTab === "all" || viewTab === "activity") && (
                  <th className="px-4 py-3.5">
                    <span className="text-emerald-600">#2</span> Activity (LMS & Pipeline)
                  </th>
                )}
                {(viewTab === "all" || viewTab === "kpi") && (
                  <th className="px-4 py-3.5">
                    <span className="text-amber-600">#3</span> Core KPIs (PV, GV, Conversion)
                  </th>
                )}
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMembers.map((member) => (
                <tr
                  key={member.id}
                  className="transition hover:bg-slate-50/80 cursor-pointer"
                  onClick={() => setSelectedMember(member)}
                >
                  {/* #1: Every Detail */}
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={member.avatar}
                        alt={member.fullName}
                        className="h-10 w-10 rounded-full object-cover ring-1 ring-slate-200"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <p className="font-black text-brand-navy text-sm">{member.fullName}</p>
                          <span className="rounded bg-brand-cyan/20 px-1.5 py-0.2 text-[10px] font-bold text-brand-navy">
                            L{member.level}
                          </span>
                        </div>
                        <div className="mt-0.5 flex items-center gap-2 text-xs text-slate-500">
                          <span className="font-mono text-[11px] text-slate-400">{member.id}</span>
                          <span>•</span>
                          <span className="font-bold text-amber-600">{member.rank}</span>
                          <span>•</span>
                          <span
                            className={cn(
                              "text-[10px] font-bold",
                              member.kycStatus === "VERIFIED"
                                ? "text-emerald-600"
                                : "text-amber-600"
                            )}
                          >
                            KYC {member.kycStatus}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Contact & Sponsor */}
                  {(viewTab === "all" || viewTab === "detail") && (
                    <td className="px-4 py-4 text-xs">
                      <p className="font-semibold text-slate-700">{member.phone}</p>
                      <p className="text-slate-400 truncate max-w-[160px]">{member.email}</p>
                      <p className="mt-1 text-[11px] text-slate-500">
                        Sponsor: <span className="font-medium text-brand-navy">{member.sponsorName}</span>
                      </p>
                    </td>
                  )}

                  {/* #2: Activity */}
                  {(viewTab === "all" || viewTab === "activity") && (
                    <td className="px-4 py-4 text-xs">
                      <div className="flex items-center gap-2 text-slate-700">
                        <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span>Active {member.lastActive}</span>
                        <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-600">
                          🔥 {member.loginStreak}d streak
                        </span>
                      </div>
                      <div className="mt-1.5 flex items-center gap-3 text-slate-500">
                        <span>
                          LMS: <strong>{member.lmsModulesDone}/{member.lmsTotalModules}</strong>
                        </span>
                        <span>•</span>
                        <span className="text-brand-blue font-bold">
                          {member.activeLeadsCount} active leads
                        </span>
                      </div>
                    </td>
                  )}

                  {/* #3: Core KPIs */}
                  {(viewTab === "all" || viewTab === "kpi") && (
                    <td className="px-4 py-4 text-xs">
                      <div className="flex items-center gap-3">
                        <div>
                          <p className="text-[10px] uppercase font-bold text-slate-400">PV</p>
                          <p className="font-black text-brand-navy">
                            {member.monthlyPv.toLocaleString()} <span className="text-[10px] font-normal text-slate-400">ETB</span>
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase font-bold text-slate-400">GV</p>
                          <p className="font-black text-brand-navy">
                            {member.monthlyGv.toLocaleString()} <span className="text-[10px] font-normal text-slate-400">ETB</span>
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase font-bold text-slate-400">Conversion</p>
                          <p className="font-black text-emerald-600">{member.conversionRate}%</p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase font-bold text-slate-400">Recruits</p>
                          <p className="font-black text-brand-blue">+{member.monthlyRecruits}</p>
                        </div>
                      </div>
                    </td>
                  )}

                  {/* Action */}
                  <td className="px-4 py-4 text-right">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedMember(member);
                      }}
                      className="h-8 text-xs border border-slate-200"
                    >
                      <Eye className="mr-1 h-3.5 w-3.5" />
                      View Dossier
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Deep-Dive Member Dossier Modal */}
      {selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 bg-brand-navy p-5 text-white">
              <div className="flex items-center gap-3">
                <img
                  src={selectedMember.avatar}
                  alt={selectedMember.fullName}
                  className="h-12 w-12 rounded-full object-cover ring-2 ring-brand-cyan"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-black">{selectedMember.fullName}</h3>
                    <span className="rounded bg-brand-cyan px-2 py-0.5 text-xs font-black text-brand-navy">
                      Level {selectedMember.level}
                    </span>
                  </div>
                  <p className="text-xs text-white/70">
                    ID: {selectedMember.id} • Rank: {selectedMember.rank} • Joined {selectedMember.joinDate}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedMember(null)}
                className="rounded-lg p-1.5 text-white/70 hover:bg-white/10 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Dossier Tabs / 3 Dimensions */}
            <div className="max-h-[75vh] overflow-y-auto p-6 space-y-6">
              {/* Dimension 1: Every Detail */}
              <div>
                <h4 className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-brand-blue mb-3">
                  <User className="h-3.5 w-3.5" /> Dimension 1: Member Profile & Lineage
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4 text-xs">
                  <div>
                    <span className="text-slate-400 font-medium">Direct Sponsor</span>
                    <p className="mt-0.5 font-bold text-slate-800">{selectedMember.sponsorName}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium">Phone Number</span>
                    <p className="mt-0.5 font-bold text-slate-800">{selectedMember.phone}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium">Email Address</span>
                    <p className="mt-0.5 font-bold text-slate-800 truncate">{selectedMember.email}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium">KYC Compliance</span>
                    <p className="mt-0.5 font-bold text-emerald-600">{selectedMember.kycStatus}</p>
                  </div>
                </div>
              </div>

              {/* Dimension 2: Activity Log */}
              <div>
                <h4 className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-emerald-700 mb-3">
                  <Activity className="h-3.5 w-3.5" /> Dimension 2: Field & Learning Activity
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 rounded-xl border border-slate-100 bg-emerald-50/40 p-4 text-xs">
                  <div>
                    <span className="text-slate-500 font-medium">Last Online</span>
                    <p className="mt-0.5 font-bold text-slate-800">{selectedMember.lastActive}</p>
                  </div>
                  <div>
                    <span className="text-slate-500 font-medium">Daily Streak</span>
                    <p className="mt-0.5 font-bold text-slate-800">{selectedMember.loginStreak} days consecutive</p>
                  </div>
                  <div>
                    <span className="text-slate-500 font-medium">LMS Progress</span>
                    <p className="mt-0.5 font-bold text-slate-800">
                      {selectedMember.lmsModulesDone} of {selectedMember.lmsTotalModules} courses (
                      {Math.round((selectedMember.lmsModulesDone / selectedMember.lmsTotalModules) * 100)}%)
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-500 font-medium">Active Leads</span>
                    <p className="mt-0.5 font-bold text-brand-blue">{selectedMember.activeLeadsCount} prospective</p>
                  </div>
                </div>
              </div>

              {/* Dimension 3: Core KPIs */}
              <div>
                <h4 className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-amber-700 mb-3">
                  <TrendingUp className="h-3.5 w-3.5" /> Dimension 3: Core Performance KPIs
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 rounded-xl border border-slate-100 bg-amber-50/40 p-4 text-xs">
                  <div>
                    <span className="text-slate-500 font-medium">Personal Volume (PV)</span>
                    <p className="mt-0.5 text-base font-black text-brand-navy">
                      {selectedMember.monthlyPv.toLocaleString()} <span className="text-xs font-normal">ETB</span>
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-500 font-medium">Group Volume (GV)</span>
                    <p className="mt-0.5 text-base font-black text-brand-navy">
                      {selectedMember.monthlyGv.toLocaleString()} <span className="text-xs font-normal">ETB</span>
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-500 font-medium">Lead Conversion</span>
                    <p className="mt-0.5 text-base font-black text-emerald-700">{selectedMember.conversionRate}%</p>
                  </div>
                  <div>
                    <span className="text-slate-500 font-medium">Team Retention</span>
                    <p className="mt-0.5 text-base font-black text-brand-blue">{selectedMember.retentionRate}%</p>
                  </div>
                </div>
              </div>

              {/* AI Downline Coaching Button */}
              <div className="rounded-xl border border-brand-cyan/40 bg-cyan-50/50 p-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-bold text-brand-navy flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-brand-blue" />
                    AI Coaching & Strategic Intervention
                  </p>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    Generate customized coaching steps for {selectedMember.fullName} to help them level up.
                  </p>
                </div>
                <Button
                  size="sm"
                  onClick={() => {
                    setSelectedMember(null);
                    onOpenAi?.(
                      `Generate a personalized coaching recommendation for downline leader ${selectedMember.fullName} (Level ${selectedMember.level}, Rank ${selectedMember.rank}, PV: ${selectedMember.monthlyPv} ETB, GV: ${selectedMember.monthlyGv} ETB, Conversion: ${selectedMember.conversionRate}%).`
                    );
                  }}
                  className="brand-gradient text-brand-navy font-bold text-xs"
                >
                  Generate Coaching Plan
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
