"use client";

import { useState, useMemo } from "react";
import {
  Network,
  Users,
  Search,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  UserCheck,
  ChevronRight,
  ShieldCheck,
  Crown,
  Award,
  Sparkles,
  ArrowRightLeft,
  ChevronDown,
  Layers,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  TrendingUp,
  Download,
  Printer,
  X,
  ExternalLink,
  SlidersHorizontal,
  Compass,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { exportToCsv, printSection } from "@/lib/export-utils";

export type RankType = "Diamond Director" | "Platinum Leader" | "Gold Executive" | "Silver Manager" | "Bronze Builder" | "Active IBO";

export interface TreeNode {
  id: string;
  name: string;
  avatar: string;
  rank: RankType;
  level: number;
  legPosition: "root" | "left" | "right";
  active: boolean;
  personalPv: number;
  leftLegPv: number;
  rightLegPv: number;
  teamCount: number;
  sponsorName: string;
  joinDate: string;
  phone: string;
  email: string;
  leftChild?: TreeNode | null;
  rightChild?: TreeNode | null;
  unilevelChildren?: TreeNode[];
}

const mockGenealogyRoot: TreeNode = {
  id: "MYU-001",
  name: "Natnael Tesfaye (You)",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  rank: "Diamond Director",
  level: 0,
  legPosition: "root",
  active: true,
  personalPv: 350,
  leftLegPv: 48600,
  rightLegPv: 36400,
  teamCount: 142,
  sponsorName: "System Master",
  joinDate: "Jan 10, 2025",
  phone: "+251 91 122 3344",
  email: "natnael.leader@myupline.org",
  leftChild: {
    id: "MYU-102",
    name: "Almaz Tadesse",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    rank: "Platinum Leader",
    level: 1,
    legPosition: "left",
    active: true,
    personalPv: 280,
    leftLegPv: 26400,
    rightLegPv: 22200,
    teamCount: 78,
    sponsorName: "Natnael Tesfaye",
    joinDate: "Feb 14, 2025",
    phone: "+251 91 234 5678",
    email: "almaz.tadesse@myupline.org",
    leftChild: {
      id: "MYU-205",
      name: "Dawit Bekele",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      rank: "Gold Executive",
      level: 2,
      legPosition: "left",
      active: true,
      personalPv: 200,
      leftLegPv: 14200,
      rightLegPv: 12200,
      teamCount: 41,
      sponsorName: "Almaz Tadesse",
      joinDate: "Apr 02, 2025",
      phone: "+251 92 345 6789",
      email: "dawit.bekele@myupline.org",
      leftChild: {
        id: "MYU-401",
        name: "Eden Girma",
        avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
        rank: "Silver Manager",
        level: 3,
        legPosition: "left",
        active: true,
        personalPv: 150,
        leftLegPv: 7400,
        rightLegPv: 6800,
        teamCount: 18,
        sponsorName: "Dawit Bekele",
        joinDate: "Jul 11, 2025",
        phone: "+251 94 456 7890",
        email: "eden.girma@myupline.org"
      },
      rightChild: {
        id: "MYU-402",
        name: "Yared Wolde",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
        rank: "Bronze Builder",
        level: 3,
        legPosition: "right",
        active: true,
        personalPv: 100,
        leftLegPv: 3200,
        rightLegPv: 2800,
        teamCount: 9,
        sponsorName: "Dawit Bekele",
        joinDate: "Aug 20, 2025",
        phone: "+251 95 567 8901",
        email: "yared.wolde@myupline.org"
      }
    },
    rightChild: {
      id: "MYU-206",
      name: "Bethlehem Assefa",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
      rank: "Silver Manager",
      level: 2,
      legPosition: "right",
      active: true,
      personalPv: 190,
      leftLegPv: 11200,
      rightLegPv: 11000,
      teamCount: 33,
      sponsorName: "Almaz Tadesse",
      joinDate: "May 19, 2025",
      phone: "+251 93 456 7890",
      email: "bethlehem.assefa@myupline.org",
      leftChild: {
        id: "MYU-403",
        name: "Samuel Kebede",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
        rank: "Active IBO",
        level: 3,
        legPosition: "left",
        active: false,
        personalPv: 50,
        leftLegPv: 1200,
        rightLegPv: 800,
        teamCount: 4,
        sponsorName: "Bethlehem Assefa",
        joinDate: "Oct 05, 2025",
        phone: "+251 96 678 9012",
        email: "samuel.kebede@myupline.org"
      },
      rightChild: null // Open enrollment spot
    }
  },
  rightChild: {
    id: "MYU-103",
    name: "Biniam Haile",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
    rank: "Platinum Leader",
    level: 1,
    legPosition: "right",
    active: true,
    personalPv: 310,
    leftLegPv: 19800,
    rightLegPv: 16600,
    teamCount: 64,
    sponsorName: "Natnael Tesfaye",
    joinDate: "Feb 22, 2025",
    phone: "+251 92 111 2233",
    email: "biniam.haile@myupline.org",
    leftChild: {
      id: "MYU-207",
      name: "Selamawit Desta",
      avatar: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&auto=format&fit=crop&q=80",
      rank: "Gold Executive",
      level: 2,
      legPosition: "left",
      active: true,
      personalPv: 220,
      leftLegPv: 10400,
      rightLegPv: 9400,
      teamCount: 35,
      sponsorName: "Biniam Haile",
      joinDate: "Jun 04, 2025",
      phone: "+251 93 222 3344",
      email: "selamawit.desta@myupline.org",
      leftChild: {
        id: "MYU-405",
        name: "Abel Teshome",
        avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80",
        rank: "Bronze Builder",
        level: 3,
        legPosition: "left",
        active: true,
        personalPv: 110,
        leftLegPv: 4200,
        rightLegPv: 3600,
        teamCount: 12,
        sponsorName: "Selamawit Desta",
        joinDate: "Sep 15, 2025",
        phone: "+251 97 789 0123",
        email: "abel.teshome@myupline.org"
      },
      rightChild: null // Open slot
    },
    rightChild: {
      id: "MYU-208",
      name: "Kassahun Mengistu",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80",
      rank: "Silver Manager",
      level: 2,
      legPosition: "right",
      active: true,
      personalPv: 175,
      leftLegPv: 8400,
      rightLegPv: 8200,
      teamCount: 27,
      sponsorName: "Biniam Haile",
      joinDate: "Jun 28, 2025",
      phone: "+251 94 333 4455",
      email: "kassahun.mengistu@myupline.org",
      leftChild: null, // Open slot
      rightChild: {
        id: "MYU-406",
        name: "Hanna Solomon",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        rank: "Active IBO",
        level: 3,
        legPosition: "right",
        active: true,
        personalPv: 80,
        leftLegPv: 1600,
        rightLegPv: 1200,
        teamCount: 5,
        sponsorName: "Kassahun Mengistu",
        joinDate: "Nov 02, 2025",
        phone: "+251 98 890 1234",
        email: "hanna.solomon@myupline.org"
      }
    }
  }
};

const rankBadgeConfig: Record<RankType, { color: string; bg: string; icon: typeof Crown }> = {
  "Diamond Director": { color: "text-cyan-400", bg: "bg-cyan-950/80 border-cyan-500/40", icon: Crown },
  "Platinum Leader": { color: "text-purple-400", bg: "bg-purple-950/80 border-purple-500/40", icon: Award },
  "Gold Executive": { color: "text-amber-400", bg: "bg-amber-950/80 border-amber-500/40", icon: Sparkles },
  "Silver Manager": { color: "text-slate-300", bg: "bg-slate-800/80 border-slate-600/40", icon: ShieldCheck },
  "Bronze Builder": { color: "text-orange-400", bg: "bg-orange-950/80 border-orange-500/40", icon: UserCheck },
  "Active IBO": { color: "text-emerald-400", bg: "bg-emerald-950/80 border-emerald-500/40", icon: Users }
};

interface GenealogyTreeVisualizerProps {
  onOpenAi?: (prompt: string) => void;
}

export function GenealogyTreeVisualizer({ onOpenAi }: GenealogyTreeVisualizerProps) {
  const [viewMode, setViewMode] = useState<"binary" | "unilevel">("binary");
  const [zoomLevel, setZoomLevel] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNode, setSelectedNode] = useState<TreeNode | null>(null);
  const [currentRoot, setCurrentRoot] = useState<TreeNode>(mockGenealogyRoot);
  const [pathBreadcrumbs, setPathBreadcrumbs] = useState<TreeNode[]>([mockGenealogyRoot]);
  const [placementPreference, setPlacementPreference] = useState<"auto" | "left" | "right">("auto");
  const [openEnrollModal, setOpenEnrollModal] = useState<{ parentId: string; parentName: string; leg: "left" | "right" } | null>(null);

  // Flatten tree for fast searching & CSV export
  const allTreeMembers = useMemo(() => {
    const list: TreeNode[] = [];
    function traverse(node: TreeNode | null | undefined) {
      if (!node) return;
      list.push(node);
      if (node.leftChild) traverse(node.leftChild);
      if (node.rightChild) traverse(node.rightChild);
    }
    traverse(mockGenealogyRoot);
    return list;
  }, []);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return allTreeMembers.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.id.toLowerCase().includes(q) ||
        m.rank.toLowerCase().includes(q)
    );
  }, [allTreeMembers, searchQuery]);

  // Power leg vs Pay leg calculations
  const leftPv = currentRoot.leftLegPv;
  const rightPv = currentRoot.rightLegPv;
  const totalBinaryPv = leftPv + rightPv;
  const powerLeg = leftPv >= rightPv ? "Left Leg" : "Right Leg";
  const payLeg = leftPv < rightPv ? "Left Leg" : "Right Leg";
  const carryoverPv = Math.abs(leftPv - rightPv);
  const matchedCycles = Math.floor(Math.min(leftPv, rightPv) / 100);
  const estimatedCyclePayoutETB = matchedCycles * 800; // 800 ETB per 100PV cycle match

  const handleDrilldown = (node: TreeNode) => {
    setCurrentRoot(node);
    setPathBreadcrumbs((prev) => [...prev, node]);
    setSelectedNode(null);
  };

  const handleResetRoot = () => {
    setCurrentRoot(mockGenealogyRoot);
    setPathBreadcrumbs([mockGenealogyRoot]);
    setSelectedNode(null);
  };

  const handleBreadcrumbClick = (index: number) => {
    const newBreadcrumbs = pathBreadcrumbs.slice(0, index + 1);
    setPathBreadcrumbs(newBreadcrumbs);
    setCurrentRoot(newBreadcrumbs[newBreadcrumbs.length - 1]);
    setSelectedNode(null);
  };

  const handleExportMatrixCsv = () => {
    const rows = allTreeMembers.map((m) => ({
      "Distributor ID": m.id,
      "Full Name": m.name,
      "Rank": m.rank,
      "Hierarchy Level": m.level,
      "Leg Position": m.legPosition.toUpperCase(),
      "Active Status": m.active ? "ACTIVE" : "INACTIVE",
      "Personal PV": m.personalPv,
      "Left Leg PV": m.leftLegPv,
      "Right Leg PV": m.rightLegPv,
      "Total Team Size": m.teamCount,
      "Direct Sponsor": m.sponsorName,
      "Enrollment Date": m.joinDate,
      "Phone": m.phone,
      "Email": m.email
    }));
    exportToCsv("MyUpline_Genealogy_Binary_Matrix", rows);
  };

  return (
    <div id="genealogy-tree-printable" className="space-y-6">
      {/* ── Top Bar / Header ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 text-xs font-bold text-brand-navy">
            <Network className="h-3.5 w-3.5 text-cyan-600" />
            <span>International MLM Matrix Architecture</span>
          </div>
          <h2 className="mt-1 text-xl font-black text-brand-navy sm:text-2xl">
            Genealogy Tree Visualizer & Matrix
          </h2>
          <p className="text-xs text-slate-500 sm:text-sm">
            Interactive real-time Binary power-leg tracking, spillover allocation, and Unilevel downline hierarchy.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {onOpenAi && (
            <Button
              variant="ghost"
              onClick={() =>
                onOpenAi(
                  `Analyze our current binary matrix legs: Left Leg PV ${leftPv.toLocaleString()}, Right Leg PV ${rightPv.toLocaleString()}, Carryover PV ${carryoverPv.toLocaleString()}. Recommend spillover placement strategy to balance cycle payouts.`
                )
              }
              className="border border-slate-200 bg-white text-xs font-bold shadow-sm hover:bg-slate-50"
            >
              <Sparkles className="mr-1.5 h-3.5 w-3.5 text-brand-blue" />
              AI Matrix Strategist
            </Button>
          )}

          <Button
            variant="ghost"
            onClick={() => printSection("genealogy-tree-printable", "MyUpline Official Genealogy Tree")}
            className="border border-slate-200 bg-white text-xs font-bold shadow-sm hover:bg-slate-50"
          >
            <Printer className="mr-1.5 h-3.5 w-3.5 text-slate-600" />
            Print Tree
          </Button>

          <Button
            onClick={handleExportMatrixCsv}
            className="bg-brand-navy text-xs font-bold text-white hover:bg-slate-800"
          >
            <Download className="mr-1.5 h-3.5 w-3.5" />
            Export Matrix CSV
          </Button>
        </div>
      </div>

      {/* ── Binary Leg Balance KPI Bar ── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-cyan-500 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Left Leg Volume</span>
            <span className={cn(
              "rounded px-2 py-0.5 text-[10px] font-black uppercase",
              powerLeg === "Left Leg" ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-700"
            )}>
              {powerLeg === "Left Leg" ? "⚡ Power Leg" : "Pay Leg"}
            </span>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-black text-brand-navy">{leftPv.toLocaleString()} PV</span>
            <span className="text-xs font-semibold text-slate-500">
              {Math.round((leftPv / (totalBinaryPv || 1)) * 100)}% of total
            </span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500">Direct branches: 78 active distributors</p>
        </Card>

        <Card className="border-l-4 border-l-purple-500 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Right Leg Volume</span>
            <span className={cn(
              "rounded px-2 py-0.5 text-[10px] font-black uppercase",
              powerLeg === "Right Leg" ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-700"
            )}>
              {powerLeg === "Right Leg" ? "⚡ Power Leg" : "Pay Leg"}
            </span>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-black text-brand-navy">{rightPv.toLocaleString()} PV</span>
            <span className="text-xs font-semibold text-slate-500">
              {Math.round((rightPv / (totalBinaryPv || 1)) * 100)}% of total
            </span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500">Direct branches: 64 active distributors</p>
        </Card>

        <Card className="border-l-4 border-l-amber-500 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Unmatched Carryover</span>
            <span className="rounded bg-amber-100 px-2 py-0.5 text-[10px] font-black uppercase text-amber-800">
              Preserved
            </span>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-black text-amber-700">{carryoverPv.toLocaleString()} PV</span>
            <span className="text-xs font-bold text-amber-600">No Flush</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500">Carried to next weekly settlement cycle</p>
        </Card>

        <Card className="border-l-4 border-l-emerald-500 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Ready Cycle Matches</span>
            <span className="rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-black uppercase text-emerald-800">
              Payout Ready
            </span>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-black text-emerald-700">{matchedCycles} Cycles</span>
            <span className="text-xs font-black text-brand-navy">ETB {estimatedCyclePayoutETB.toLocaleString()}</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500">Rule: 100 Left PV + 100 Right PV = 1 Cycle</p>
        </Card>
      </div>

      {/* ── Controls, Mode Switcher, Placement Rules, & Search Bar ── */}
      <Card className="p-4 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* View Modes */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200">
              <button
                type="button"
                onClick={() => setViewMode("binary")}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-black transition",
                  viewMode === "binary"
                    ? "bg-white text-brand-navy shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                )}
              >
                <ArrowRightLeft className="h-3.5 w-3.5 text-cyan-600" />
                Binary Matrix (L/R)
              </button>
              <button
                type="button"
                onClick={() => setViewMode("unilevel")}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-black transition",
                  viewMode === "unilevel"
                    ? "bg-white text-brand-navy shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                )}
              >
                <Layers className="h-3.5 w-3.5 text-purple-600" />
                Unilevel Generation Tree
              </button>
            </div>

            {/* Spillover Auto-Placement Preference */}
            <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-1.5 border border-slate-200 text-xs">
              <SlidersHorizontal className="h-3.5 w-3.5 text-slate-500" />
              <span className="font-bold text-slate-600">Auto-Placement:</span>
              <select
                aria-label="Spillover auto-placement rule"
                value={placementPreference}
                onChange={(e) => setPlacementPreference(e.target.value as any)}
                className="bg-transparent font-black text-brand-navy outline-none cursor-pointer"
              >
                <option value="auto">Auto-Balance (Pay Leg)</option>
                <option value="left">Extreme Left Leg</option>
                <option value="right">Extreme Right Leg</option>
              </select>
            </div>
          </div>

          {/* Search & Zoom Canvas Controls */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Search Input */}
            <div className="relative min-w-[220px]">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Find node by name or ID..."
                className="w-full rounded-lg border border-slate-200 bg-white py-1.5 pl-9 pr-8 text-xs font-medium text-slate-800 placeholder-slate-400 focus:border-cyan-500 focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center rounded-lg border border-slate-200 bg-white p-1">
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.min(1.3, z + 0.1))}
                className="rounded p-1 text-slate-600 hover:bg-slate-100"
                title="Zoom In"
              >
                <ZoomIn className="h-3.5 w-3.5" />
              </button>
              <span className="px-2 text-[10px] font-bold text-slate-500">
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.max(0.7, z - 0.1))}
                className="rounded p-1 text-slate-600 hover:bg-slate-100"
                title="Zoom Out"
              >
                <ZoomOut className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setZoomLevel(1)}
                className="rounded p-1 text-slate-600 hover:bg-slate-100 border-l border-slate-100 ml-1 pl-1.5"
                title="Reset Zoom"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Live Search Instant Results Dropdown */}
        {searchResults.length > 0 && searchQuery && (
          <div className="mt-3 rounded-lg border border-cyan-200 bg-cyan-50/50 p-3">
            <p className="text-xs font-bold text-cyan-900 mb-2">
              Found {searchResults.length} matching distributor(s):
            </p>
            <div className="flex flex-wrap gap-2">
              {searchResults.slice(0, 5).map((node) => (
                <button
                  key={node.id}
                  onClick={() => setSelectedNode(node)}
                  className="flex items-center gap-2 rounded-lg bg-white px-2.5 py-1.5 text-xs font-bold text-slate-800 shadow-sm border border-slate-200 hover:border-cyan-400 hover:bg-cyan-50 transition"
                >
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span>{node.name}</span>
                  <span className="text-[10px] font-mono text-slate-400">{node.id}</span>
                  <span className="rounded bg-slate-100 px-1 text-[9px] text-slate-600">{node.rank}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* ── Breadcrumb Navigation ── */}
      <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs">
        <div className="flex flex-wrap items-center gap-1.5 font-bold text-slate-600">
          <span className="text-slate-400">Viewing Subtree:</span>
          {pathBreadcrumbs.map((crumb, idx) => (
            <div key={crumb.id} className="flex items-center gap-1.5">
              <button
                onClick={() => handleBreadcrumbClick(idx)}
                className={cn(
                  "hover:underline",
                  idx === pathBreadcrumbs.length - 1 ? "font-black text-brand-navy" : "text-cyan-700"
                )}
              >
                {crumb.name}
              </button>
              {idx < pathBreadcrumbs.length - 1 && (
                <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
              )}
            </div>
          ))}
        </div>

        {currentRoot.id !== mockGenealogyRoot.id && (
          <button
            onClick={handleResetRoot}
            className="flex items-center gap-1 font-bold text-xs text-rose-600 hover:text-rose-700 hover:underline"
          >
            <RotateCcw className="h-3 w-3" />
            Reset to Top Master Root
          </button>
        )}
      </div>

      {/* ── Tree Canvas Container ── */}
      {viewMode === "binary" ? (
        <div className="relative overflow-x-auto rounded-2xl border border-slate-200 bg-gradient-to-b from-slate-900 via-[#0a192f] to-[#0d1f3d] p-6 text-white shadow-inner">
          {/* Watermark / Canvas Legend */}
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3 text-xs text-slate-400">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-500/50" />
                <span>Active IBO (Qualified)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-slate-500" />
                <span>Grace / Inactive</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded border border-dashed border-cyan-400 bg-cyan-500/20" />
                <span>Open Spillover Placement</span>
              </div>
            </div>
            <div className="text-[11px] font-mono text-cyan-300">
              Binary Depth: Level {currentRoot.level} to {currentRoot.level + 3}
            </div>
          </div>

          {/* Interactive Zoomable Tree Canvas */}
          <div
            className="flex min-w-[760px] flex-col items-center justify-center transition-transform duration-200"
            style={{ transform: `scale(${zoomLevel})`, transformOrigin: "top center" }}
          >
            {/* LEVEL 0: ROOT NODE */}
            <div className="flex flex-col items-center">
              <NodeCard
                node={currentRoot}
                onSelect={() => setSelectedNode(currentRoot)}
                onDrilldown={() => handleDrilldown(currentRoot)}
                isRoot={true}
              />
            </div>

            {/* SVG Connector from Root to Level 1 */}
            <div className="relative h-12 w-full max-w-[560px]">
              <svg className="h-full w-full stroke-cyan-500/60" strokeWidth="2" fill="none">
                {/* Vertical line from root */}
                <line x1="50%" y1="0" x2="50%" y2="24" />
                {/* Horizontal branch line */}
                <line x1="25%" y1="24" x2="75%" y2="24" />
                {/* Vertical drop to Left Child */}
                <line x1="25%" y1="24" x2="25%" y2="48" />
                {/* Vertical drop to Right Child */}
                <line x1="75%" y1="24" x2="75%" y2="48" />
              </svg>
            </div>

            {/* LEVEL 1: LEFT & RIGHT CHILDREN */}
            <div className="grid w-full max-w-[700px] grid-cols-2 gap-8">
              {/* Left Sub-Branch */}
              <div className="flex flex-col items-center">
                {currentRoot.leftChild ? (
                  <>
                    <NodeCard
                      node={currentRoot.leftChild}
                      onSelect={() => setSelectedNode(currentRoot.leftChild!)}
                      onDrilldown={() => handleDrilldown(currentRoot.leftChild!)}
                    />
                    {/* SVG Connector to Level 2 Left Subtree */}
                    <div className="relative h-10 w-full max-w-[280px]">
                      <svg className="h-full w-full stroke-cyan-500/50" strokeWidth="2" fill="none">
                        <line x1="50%" y1="0" x2="50%" y2="20" />
                        <line x1="25%" y1="20" x2="75%" y2="20" />
                        <line x1="25%" y1="20" x2="25%" y2="40" />
                        <line x1="75%" y1="20" x2="75%" y2="40" />
                      </svg>
                    </div>

                    {/* Level 2 Sub-nodes */}
                    <div className="grid w-full max-w-[340px] grid-cols-2 gap-3">
                      {currentRoot.leftChild.leftChild ? (
                        <NodeCard
                          node={currentRoot.leftChild.leftChild}
                          onSelect={() => setSelectedNode(currentRoot.leftChild!.leftChild!)}
                          onDrilldown={() => handleDrilldown(currentRoot.leftChild!.leftChild!)}
                          compact={true}
                        />
                      ) : (
                        <OpenSlotCard
                          parentName={currentRoot.leftChild.name}
                          parentId={currentRoot.leftChild.id}
                          leg="left"
                          onOpenEnroll={(data) => setOpenEnrollModal(data)}
                        />
                      )}

                      {currentRoot.leftChild.rightChild ? (
                        <NodeCard
                          node={currentRoot.leftChild.rightChild}
                          onSelect={() => setSelectedNode(currentRoot.leftChild!.rightChild!)}
                          onDrilldown={() => handleDrilldown(currentRoot.leftChild!.rightChild!)}
                          compact={true}
                        />
                      ) : (
                        <OpenSlotCard
                          parentName={currentRoot.leftChild.name}
                          parentId={currentRoot.leftChild.id}
                          leg="right"
                          onOpenEnroll={(data) => setOpenEnrollModal(data)}
                        />
                      )}
                    </div>
                  </>
                ) : (
                  <OpenSlotCard
                    parentName={currentRoot.name}
                    parentId={currentRoot.id}
                    leg="left"
                    onOpenEnroll={(data) => setOpenEnrollModal(data)}
                  />
                )}
              </div>

              {/* Right Sub-Branch */}
              <div className="flex flex-col items-center">
                {currentRoot.rightChild ? (
                  <>
                    <NodeCard
                      node={currentRoot.rightChild}
                      onSelect={() => setSelectedNode(currentRoot.rightChild!)}
                      onDrilldown={() => handleDrilldown(currentRoot.rightChild!)}
                    />
                    {/* SVG Connector to Level 2 Right Subtree */}
                    <div className="relative h-10 w-full max-w-[280px]">
                      <svg className="h-full w-full stroke-purple-500/50" strokeWidth="2" fill="none">
                        <line x1="50%" y1="0" x2="50%" y2="20" />
                        <line x1="25%" y1="20" x2="75%" y2="20" />
                        <line x1="25%" y1="20" x2="25%" y2="40" />
                        <line x1="75%" y1="20" x2="75%" y2="40" />
                      </svg>
                    </div>

                    {/* Level 2 Sub-nodes */}
                    <div className="grid w-full max-w-[340px] grid-cols-2 gap-3">
                      {currentRoot.rightChild.leftChild ? (
                        <NodeCard
                          node={currentRoot.rightChild.leftChild}
                          onSelect={() => setSelectedNode(currentRoot.rightChild!.leftChild!)}
                          onDrilldown={() => handleDrilldown(currentRoot.rightChild!.leftChild!)}
                          compact={true}
                        />
                      ) : (
                        <OpenSlotCard
                          parentName={currentRoot.rightChild.name}
                          parentId={currentRoot.rightChild.id}
                          leg="left"
                          onOpenEnroll={(data) => setOpenEnrollModal(data)}
                        />
                      )}

                      {currentRoot.rightChild.rightChild ? (
                        <NodeCard
                          node={currentRoot.rightChild.rightChild}
                          onSelect={() => setSelectedNode(currentRoot.rightChild!.rightChild!)}
                          onDrilldown={() => handleDrilldown(currentRoot.rightChild!.rightChild!)}
                          compact={true}
                        />
                      ) : (
                        <OpenSlotCard
                          parentName={currentRoot.rightChild.name}
                          parentId={currentRoot.rightChild.id}
                          leg="right"
                          onOpenEnroll={(data) => setOpenEnrollModal(data)}
                        />
                      )}
                    </div>
                  </>
                ) : (
                  <OpenSlotCard
                    parentName={currentRoot.name}
                    parentId={currentRoot.id}
                    leg="right"
                    onOpenEnroll={(data) => setOpenEnrollModal(data)}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ── UNILEVEL GENERATION HIERARCHY VIEW ── */
        <Card className="p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <h3 className="font-black text-brand-navy">Unilevel Generation Hierarchy</h3>
              <p className="text-xs text-slate-500">
                Direct sponsorship lines showing personal recruits across Level 1, Level 2, and Level 3 generations.
              </p>
            </div>
            <span className="rounded bg-purple-50 px-2.5 py-1 text-xs font-bold text-purple-700">
              5-Tier Matching Qualified
            </span>
          </div>

          <div className="space-y-3">
            {allTreeMembers.map((member) => (
              <div
                key={member.id}
                className={cn(
                  "flex flex-col gap-3 rounded-xl border p-3.5 transition sm:flex-row sm:items-center sm:justify-between",
                  member.level === 0 ? "border-cyan-300 bg-cyan-50/50" : "border-slate-200 bg-white hover:bg-slate-50"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="h-10 w-10 rounded-full object-cover border border-slate-200"
                    />
                    <span
                      className={cn(
                        "absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white",
                        member.active ? "bg-emerald-500" : "bg-slate-400"
                      )}
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-black text-sm text-brand-navy">{member.name}</p>
                      <span className="font-mono text-[10px] text-slate-400">{member.id}</span>
                      <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-700">
                        Gen {member.level}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      Sponsor: <span className="font-semibold text-slate-700">{member.sponsorName}</span> • Joined {member.joinDate}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 sm:gap-6">
                  <div className="text-left sm:text-right">
                    <p className="text-[10px] uppercase font-bold text-slate-400">Personal PV</p>
                    <p className="font-black text-sm text-brand-navy">{member.personalPv} PV</p>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="text-[10px] uppercase font-bold text-slate-400">Team Size</p>
                    <p className="font-black text-sm text-cyan-700">{member.teamCount} members</p>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="text-[10px] uppercase font-bold text-slate-400">Rank</p>
                    <span className="inline-block rounded px-2 py-0.5 text-xs font-bold bg-slate-100 text-slate-800">
                      {member.rank}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedNode(member)}
                    className="border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100"
                  >
                    View Dossier
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* ── Node Detail Dossier Modal ── */}
      {selectedNode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <Card className="w-full max-w-lg border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <img
                  src={selectedNode.avatar}
                  alt={selectedNode.name}
                  className="h-14 w-14 rounded-full border-2 border-cyan-400 object-cover shadow-sm"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-black text-brand-navy">{selectedNode.name}</h3>
                    <span className="font-mono text-xs text-slate-400">{selectedNode.id}</span>
                  </div>
                  <p className="text-xs font-bold text-cyan-700">{selectedNode.rank}</p>
                  <p className="text-[11px] text-slate-500">
                    Sponsor: <span className="font-semibold text-slate-700">{selectedNode.sponsorName}</span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedNode(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Metrics Grid */}
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
              <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
                <p className="text-[10px] font-bold uppercase text-slate-400">Personal PV</p>
                <p className="mt-1 text-lg font-black text-brand-navy">{selectedNode.personalPv} PV</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
                <p className="text-[10px] font-bold uppercase text-slate-400">Left Leg PV</p>
                <p className="mt-1 text-lg font-black text-cyan-600">{selectedNode.leftLegPv.toLocaleString()} PV</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
                <p className="text-[10px] font-bold uppercase text-slate-400">Right Leg PV</p>
                <p className="mt-1 text-lg font-black text-purple-600">{selectedNode.rightLegPv.toLocaleString()} PV</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
                <p className="text-[10px] font-bold uppercase text-slate-400">Team Size</p>
                <p className="mt-1 text-lg font-black text-brand-navy">{selectedNode.teamCount} distributors</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
                <p className="text-[10px] font-bold uppercase text-slate-400">Leg Side</p>
                <p className="mt-1 text-lg font-black uppercase text-amber-600">{selectedNode.legPosition}</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
                <p className="text-[10px] font-bold uppercase text-slate-400">Status</p>
                <p className={cn("mt-1 text-lg font-black", selectedNode.active ? "text-emerald-600" : "text-slate-400")}>
                  {selectedNode.active ? "Active" : "Inactive"}
                </p>
              </div>
            </div>

            {/* Contact Details */}
            <div className="mt-4 space-y-2 rounded-xl bg-slate-50 p-3 border border-slate-100 text-xs">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-500">
                  <Phone className="h-3.5 w-3.5" /> Phone:
                </span>
                <span className="font-bold text-slate-800">{selectedNode.phone}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-500">
                  <Mail className="h-3.5 w-3.5" /> Email:
                </span>
                <span className="font-bold text-slate-800">{selectedNode.email}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-500">
                  <Calendar className="h-3.5 w-3.5" /> Joined Date:
                </span>
                <span className="font-bold text-slate-800">{selectedNode.joinDate}</span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="mt-6 flex flex-col gap-2 sm:flex-row">
              <Button
                onClick={() => handleDrilldown(selectedNode)}
                className="flex-1 bg-cyan-600 text-xs font-black text-white hover:bg-cyan-700"
              >
                <Network className="mr-1.5 h-4 w-4" />
                Make Node Root (Drill Down)
              </Button>
              <Button
                variant="ghost"
                onClick={() => setSelectedNode(null)}
                className="border border-slate-200 text-xs font-bold"
              >
                Close
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* ── Open Slot Enrollment Spillover Placement Modal ── */}
      {openEnrollModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <Card className="w-full max-w-md border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-50 text-cyan-600">
                  <Network className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-black text-brand-navy">Place Spillover Enrollment</h3>
                  <p className="text-[11px] text-slate-500">Assign new distributor directly into this binary node slot</p>
                </div>
              </div>
              <button
                onClick={() => setOpenEnrollModal(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div className="rounded-lg bg-slate-50 p-3 border border-slate-100">
                <p className="text-slate-500">Parent Upline Node:</p>
                <p className="font-black text-sm text-brand-navy">{openEnrollModal.parentName} ({openEnrollModal.parentId})</p>
                <p className="mt-1 text-slate-500">Binary Placement Position:</p>
                <span className="inline-block mt-0.5 rounded bg-cyan-100 px-2 py-0.5 font-black text-cyan-800 uppercase">
                  {openEnrollModal.leg} Leg Slot
                </span>
              </div>

              <div>
                <label className="font-bold text-slate-700">Prospect / New Member ID or Phone</label>
                <input
                  type="text"
                  placeholder="e.g. UPL-992 or +251 91 234 5678"
                  className="mt-1 w-full rounded-lg border border-slate-200 p-2.5 text-xs font-semibold focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700">Initial Enrollment Package</label>
                <select className="mt-1 w-full rounded-lg border border-slate-200 p-2.5 text-xs font-semibold focus:border-cyan-500 focus:outline-none bg-white">
                  <option>Diamond Executive Kit (300 PV) - ETB 45,000</option>
                  <option>Gold Leadership Kit (200 PV) - ETB 30,000</option>
                  <option>Silver Builder Kit (100 PV) - ETB 15,000</option>
                  <option>Starter IBO Kit (50 PV) - ETB 7,500</option>
                </select>
              </div>
            </div>

            <div className="mt-6 flex gap-2">
              <Button
                onClick={() => {
                  alert(`Spillover placement registered successfully under ${openEnrollModal.parentName} (${openEnrollModal.leg.toUpperCase()} leg)!`);
                  setOpenEnrollModal(null);
                }}
                className="flex-1 bg-brand-navy text-xs font-black text-white hover:bg-slate-800"
              >
                Confirm Spillover Placement
              </Button>
              <Button
                variant="ghost"
                onClick={() => setOpenEnrollModal(null)}
                className="border border-slate-200 text-xs font-bold"
              >
                Cancel
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Subcomponents: NodeCard & OpenSlotCard
// ─────────────────────────────────────────────────────────────

interface NodeCardProps {
  node: TreeNode;
  onSelect: () => void;
  onDrilldown: () => void;
  isRoot?: boolean;
  compact?: boolean;
}

function NodeCard({ node, onSelect, onDrilldown, isRoot = false, compact = false }: NodeCardProps) {
  const badge = rankBadgeConfig[node.rank] || rankBadgeConfig["Active IBO"];
  const BadgeIcon = badge.icon;

  if (compact) {
    return (
      <div
        onClick={onSelect}
        className={cn(
          "group relative flex cursor-pointer flex-col items-center rounded-xl border p-2.5 text-center transition hover:scale-105 shadow-md",
          node.active
            ? "border-cyan-500/30 bg-[#0d2242]/90 hover:border-cyan-400"
            : "border-slate-700 bg-slate-900/80 opacity-80"
        )}
      >
        <div className="relative">
          <img
            src={node.avatar}
            alt={node.name}
            className="h-10 w-10 rounded-full border-2 border-cyan-400 object-cover"
          />
          <span
            className={cn(
              "absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border border-slate-900",
              node.active ? "bg-emerald-400 animate-pulse" : "bg-slate-500"
            )}
          />
        </div>
        <p className="mt-1 max-w-[110px] truncate text-xs font-black text-white">{node.name}</p>
        <p className="text-[10px] font-mono text-cyan-300">{node.id}</p>
        <span className={cn("mt-1 rounded px-1.5 py-0.2 text-[9px] font-bold border", badge.bg, badge.color)}>
          {node.rank.replace(" Director", "").replace(" Executive", "")}
        </span>
        <div className="mt-1 flex items-center justify-between gap-1 w-full text-[9px] text-slate-300">
          <span>L: {node.leftLegPv}</span>
          <span>R: {node.rightLegPv}</span>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={onSelect}
      className={cn(
        "group relative flex w-64 cursor-pointer flex-col rounded-2xl border p-4 text-left transition hover:scale-105 shadow-xl",
        isRoot
          ? "border-cyan-400 bg-gradient-to-br from-[#0c2856] to-[#07193b] shadow-cyan-500/20"
          : "border-slate-700 bg-[#0c1f3d]/95 hover:border-cyan-400"
      )}
    >
      {/* Top Header: Avatar + Active Pill + Leg */}
      <div className="flex items-center justify-between">
        <div className="relative">
          <img
            src={node.avatar}
            alt={node.name}
            className="h-12 w-12 rounded-full border-2 border-cyan-400 object-cover shadow-md"
          />
          <span
            className={cn(
              "absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[#0c1f3d]",
              node.active ? "bg-emerald-400" : "bg-slate-500"
            )}
          />
        </div>

        <div className="text-right">
          <span className={cn("inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-black border", badge.bg, badge.color)}>
            <BadgeIcon className="h-3 w-3" />
            {node.rank}
          </span>
          <p className="mt-0.5 text-[10px] font-mono text-slate-400">
            {node.legPosition === "root" ? "ROOT LEADER" : `${node.legPosition.toUpperCase()} LEG`}
          </p>
        </div>
      </div>

      {/* Name and ID */}
      <div className="mt-3">
        <h4 className="truncate text-sm font-black text-white group-hover:text-cyan-300 transition">
          {node.name}
        </h4>
        <p className="text-[11px] font-mono text-slate-400">{node.id}</p>
      </div>

      {/* Metrics Row: PPV, Left PV, Right PV */}
      <div className="mt-3 grid grid-cols-3 gap-1.5 rounded-xl bg-black/30 p-2 text-center text-[10px]">
        <div>
          <p className="font-bold text-slate-400">PPV</p>
          <p className="font-black text-cyan-300">{node.personalPv}</p>
        </div>
        <div>
          <p className="font-bold text-slate-400">Left PV</p>
          <p className="font-black text-emerald-400">{node.leftLegPv.toLocaleString()}</p>
        </div>
        <div>
          <p className="font-bold text-slate-400">Right PV</p>
          <p className="font-black text-purple-400">{node.rightLegPv.toLocaleString()}</p>
        </div>
      </div>

      {/* Footer Drilldown Prompt */}
      <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-2 text-[10px] text-slate-400">
        <span>Team: {node.teamCount} IBOs</span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDrilldown();
          }}
          className="font-bold text-cyan-400 hover:text-cyan-300 hover:underline flex items-center gap-0.5"
        >
          Drill Down <ChevronRight className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}

interface OpenSlotCardProps {
  parentName: string;
  parentId: string;
  leg: "left" | "right";
  onOpenEnroll: (data: { parentId: string; parentName: string; leg: "left" | "right" }) => void;
}

function OpenSlotCard({ parentName, parentId, leg, onOpenEnroll }: OpenSlotCardProps) {
  return (
    <div
      onClick={() => onOpenEnroll({ parentId, parentName, leg })}
      className="flex w-36 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-cyan-500/40 bg-cyan-950/20 p-3 text-center transition hover:border-cyan-400 hover:bg-cyan-950/40"
    >
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-300">
        <Users className="h-4 w-4" />
      </div>
      <p className="mt-1.5 text-xs font-bold text-cyan-300">+ Open Slot</p>
      <p className="text-[10px] uppercase text-slate-400">{leg} Leg</p>
      <span className="mt-1 rounded bg-cyan-500/20 px-1.5 py-0.5 text-[9px] font-bold text-cyan-300">
        Enroll Here
      </span>
    </div>
  );
}
