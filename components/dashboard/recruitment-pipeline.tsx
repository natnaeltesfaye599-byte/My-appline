"use client";

import { useState, useMemo } from "react";
import {
  ArrowRight,
  Bell,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  ExternalLink,
  FileSpreadsheet,
  Filter,
  Flame,
  Link,
  MessageSquare,
  PhoneCall,
  Play,
  Plus,
  Printer,
  Search,
  Send,
  Share2,
  Sparkles,
  Star,
  TrendingUp,
  User,
  UserCheck,
  Users,
  Video,
  X,
  Zap
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { exportToCsv, printSection } from "@/lib/export-utils";

// Recruitment pipeline stages
export type RecruitStage = "prospect" | "invited" | "presentation" | "followup" | "enrolled";

export interface Prospect {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  city: string;
  source: "Name List" | "Social Media" | "Referral" | "Event";
  stage: RecruitStage;
  linkSent: boolean;
  linkSentDate: string;
  invitedDate: string;
  presentationDate: string;
  presentationTimeSpent: number; // minutes
  salesDataShared: boolean; // whether compensation data was shown
  followupCount: number;
  lastFollowup: string;
  notes: string;
  interestScore: number; // 1-10
}

// Hardcoded demo data
const initialProspects: Prospect[] = [
  {
    id: "r-001",
    fullName: "Solomon Hailu",
    phone: "+251 91 234 5678",
    email: "solomon.h@example.com",
    city: "Addis Ababa (Bole)",
    source: "Name List",
    stage: "followup",
    linkSent: true,
    linkSentDate: "Jun 18, 2026",
    invitedDate: "Jun 19, 2026",
    presentationDate: "Jun 21, 2026",
    presentationTimeSpent: 28,
    salesDataShared: true,
    followupCount: 2,
    lastFollowup: "Jun 23, 2026",
    notes: "Very interested in the compensation plan. Wife has questions. Set up 3-way call with upline.",
    interestScore: 9
  },
  {
    id: "r-002",
    fullName: "Tigist Bekele",
    phone: "+251 92 876 5432",
    email: "tigist.b@example.com",
    city: "Hawassa",
    source: "Social Media",
    stage: "presentation",
    linkSent: true,
    linkSentDate: "Jun 20, 2026",
    invitedDate: "Jun 21, 2026",
    presentationDate: "Jun 22, 2026",
    presentationTimeSpent: 25,
    salesDataShared: false,
    followupCount: 0,
    lastFollowup: "-",
    notes: "Watched the 25-min overview. Need to share the compensation breakdown next call.",
    interestScore: 7
  },
  {
    id: "r-003",
    fullName: "Henok Tesfaye",
    phone: "+251 93 111 2233",
    email: "henok.t@example.com",
    city: "Adama",
    source: "Referral",
    stage: "invited",
    linkSent: true,
    linkSentDate: "Jun 22, 2026",
    invitedDate: "Jun 22, 2026",
    presentationDate: "-",
    presentationTimeSpent: 0,
    salesDataShared: false,
    followupCount: 0,
    lastFollowup: "-",
    notes: "Referred by Dawit. Confirmed to watch the presentation video tonight at 7 PM.",
    interestScore: 8
  },
  {
    id: "r-004",
    fullName: "Mekdes Alemu",
    phone: "+251 94 567 8901",
    email: "mekdes.a@example.com",
    city: "Bahir Dar",
    source: "Event",
    stage: "prospect",
    linkSent: false,
    linkSentDate: "-",
    invitedDate: "-",
    presentationDate: "-",
    presentationTimeSpent: 0,
    salesDataShared: false,
    followupCount: 0,
    lastFollowup: "-",
    notes: "Met at the Bahir Dar leadership event. Very entrepreneurial mindset. Send the link today.",
    interestScore: 6
  },
  {
    id: "r-005",
    fullName: "Abel Girma",
    phone: "+251 95 222 3344",
    email: "abel.g@example.com",
    city: "Addis Ababa (CMC)",
    source: "Name List",
    stage: "enrolled",
    linkSent: true,
    linkSentDate: "Jun 14, 2026",
    invitedDate: "Jun 15, 2026",
    presentationDate: "Jun 17, 2026",
    presentationTimeSpent: 30,
    salesDataShared: true,
    followupCount: 3,
    lastFollowup: "Jun 21, 2026",
    notes: "Officially enrolled as Diamond IBO! Proceed to After-Sales onboarding flow.",
    interestScore: 10
  }
];

// Follow-up text marketing templates
const followupTemplates = [
  {
    id: "fu-1",
    title: "Post-Presentation Closing Check-In",
    tag: "Priority ⭐",
    text: (name: string) =>
      `Hi ${name}! Hope you're doing great. Just checking in after the presentation you watched. What did you like most about what you saw? I'd love to hear your thoughts! 🌟`
  },
  {
    id: "fu-2",
    title: "Scale of 1-10 Follow-Up",
    tag: "Clarity Close",
    text: (name: string) =>
      `Hey ${name}, quick question — on a scale of 1 to 10, how serious are you about building an extra income stream right now? Even a 5 or 6 means we should talk! 🚀`
  },
  {
    id: "fu-3",
    title: "Invitation Reminder",
    tag: "Gentle Nudge",
    text: (name: string) =>
      `Hi ${name}! I shared our business overview link earlier and wanted to make sure you had a chance to look at it. It's only 25 minutes and will answer most of your questions. Did you get to watch it? 🎬`
  },
  {
    id: "fu-4",
    title: "Urgency + 3-Way Upline Intro",
    tag: "Fast Action",
    text: (name: string) =>
      `${name}, my top leader and director has exactly 10 minutes free tonight to personally answer your questions about the opportunity. This is rare — can I introduce you two? 🤝`
  },
  {
    id: "fu-5",
    title: "Compensation Data Sharing",
    tag: "Sales Data",
    text: (name: string) =>
      `Hi ${name}! I wanted to share our official income disclosure and compensation breakdown. It shows exactly how our leaders are earning — from ETB 5,000/month all the way to ETB 200,000+. Want me to send it over? 💰`
  }
];

const stageConfig: Record<RecruitStage, { label: string; color: string; pct: number }> = {
  prospect: { label: "Prospect (Link)", color: "bg-slate-400", pct: 10 },
  invited: { label: "Invited", color: "bg-cyan-500", pct: 35 },
  presentation: { label: "Presentation", color: "bg-amber-500", pct: 65 },
  followup: { label: "Follow-up", color: "bg-indigo-500", pct: 82 },
  enrolled: { label: "Enrolled ✓", color: "bg-emerald-500", pct: 100 }
};

export function RecruitmentPipeline({
  onOpenAi
}: {
  onOpenAi?: (prompt: string) => void;
}) {
  const [prospects, setProspects] = useState<Prospect[]>(initialProspects);
  const [stageFilter, setStageFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"pipeline" | "presentation" | "followup">("pipeline");

  // Selected prospect for detail panel
  const [selectedProspect, setSelectedProspect] = useState<Prospect | null>(null);

  // Link send state
  const [copiedLinkId, setCopiedLinkId] = useState<string | null>(null);

  // Follow-up text modal
  const [activeFollowupProspect, setActiveFollowupProspect] = useState<Prospect | null>(null);
  const [copiedTplId, setCopiedTplId] = useState<string | null>(null);

  // Add prospect modal
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("+251 9");
  const [newCity, setNewCity] = useState("Addis Ababa");
  const [newSource, setNewSource] = useState<Prospect["source"]>("Name List");
  const [newNotes, setNewNotes] = useState("");

  // Filtered prospects
  const filtered = useMemo(() => {
    return prospects.filter((p) => {
      const matchQ =
        p.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.phone.includes(searchQuery) ||
        p.city.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStage = stageFilter === "all" || p.stage === stageFilter;
      return matchQ && matchStage;
    });
  }, [prospects, searchQuery, stageFilter]);

  // KPI counts
  const totalProspects = prospects.length;
  const prospectCount = prospects.filter((p) => p.stage === "prospect").length;
  const invitedCount = prospects.filter((p) => p.stage === "invited").length;
  const presentationCount = prospects.filter((p) => p.stage === "presentation").length;
  const followupCount = prospects.filter((p) => p.stage === "followup").length;
  const enrolledCount = prospects.filter((p) => p.stage === "enrolled").length;
  const conversionRate = Math.round((enrolledCount / (totalProspects || 1)) * 100);

  // Presentation metrics
  const presentationProspects = prospects.filter((p) => p.presentationDate !== "-");
  const avgTimeSpent =
    presentationProspects.length > 0
      ? Math.round(
          presentationProspects.reduce((sum, p) => sum + p.presentationTimeSpent, 0) /
            presentationProspects.length
        )
      : 0;
  const salesDataSharedCount = presentationProspects.filter((p) => p.salesDataShared).length;

  function handleStageChange(id: string, newStage: RecruitStage) {
    setProspects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, stage: newStage } : p))
    );
  }

  function handleSendLink(prospect: Prospect) {
    const link = `https://myupline.app/opportunity?ref=${prospect.id}`;
    navigator.clipboard.writeText(link);
    setCopiedLinkId(prospect.id);
    setProspects((prev) =>
      prev.map((p) =>
        p.id === prospect.id
          ? { ...p, linkSent: true, linkSentDate: "Today", stage: p.stage === "prospect" ? "invited" : p.stage }
          : p
      )
    );
    setTimeout(() => setCopiedLinkId(null), 2500);
  }

  function handleAddProspect(e: React.FormEvent) {
    e.preventDefault();
    if (!newName.trim() || !newPhone.trim()) return;
    const p: Prospect = {
      id: `r-${Date.now()}`,
      fullName: newName.trim(),
      phone: newPhone.trim(),
      email: "",
      city: newCity.trim(),
      source: newSource,
      stage: "prospect",
      linkSent: false,
      linkSentDate: "-",
      invitedDate: "-",
      presentationDate: "-",
      presentationTimeSpent: 0,
      salesDataShared: false,
      followupCount: 0,
      lastFollowup: "-",
      notes: newNotes.trim(),
      interestScore: 7
    };
    setProspects([p, ...prospects]);
    setIsAdding(false);
    setNewName("");
    setNewPhone("+251 9");
    setNewNotes("");
  }

  function copyFollowupTemplate(id: string, text: string) {
    navigator.clipboard.writeText(text);
    setCopiedTplId(id);
    setTimeout(() => setCopiedTplId(null), 2500);
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-gradient-to-r from-brand-navy via-brand-deep to-[#0d3478] p-6 text-white shadow-xl">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-cyan/40 bg-brand-cyan/10 px-3 py-1 text-xs font-black tracking-wide text-brand-cyan uppercase backdrop-blur">
            <UserCheck className="h-3.5 w-3.5" />
            Full Recruitment Cycle Manager
          </div>
          <h2 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">Recruitment Pipeline</h2>
          <p className="mt-1 text-sm text-white/75">
            Manage every prospect from <strong>link send</strong> → <strong>invitation</strong> → <strong>presentation</strong> → <strong>follow-up text marketing</strong> → <strong>enrolled IBO</strong>.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            onClick={() =>
              onOpenAi?.(
                `Analyze my recruitment pipeline: ${prospectCount} prospects, ${invitedCount} invited, ${presentationCount} at presentation, ${followupCount} in follow-up, ${enrolledCount} enrolled. Conversion rate: ${conversionRate}%. What strategy should I use this week to convert my follow-up prospects?`
              )
            }
            className="brand-gradient font-black text-brand-navy shadow-lg"
          >
            <Sparkles className="mr-2 h-4 w-4" />
            AI Recruitment Coach
          </Button>

          {/* Export CSV */}
          <Button
            onClick={() => {
              const rows = prospects.map((p) => ({
                "Full Name": p.fullName,
                "Phone": p.phone,
                "Email": p.email,
                "City": p.city,
                "Source": p.source,
                "Stage": p.stage,
                "Link Sent": p.linkSent ? "Yes" : "No",
                "Presentation Time (min)": p.presentationTimeSpent,
                "Follow-up Count": p.followupCount,
                "Interest Score": p.interestScore,
                "Notes": p.notes,
              }));
              exportToCsv(`MyUpline_RecruitmentPipeline_${new Date().toISOString().slice(0,10)}`, rows);
            }}
            variant="secondary"
            className="border-white/20 bg-white/10 hover:bg-white/20 text-white"
          >
            <FileSpreadsheet className="mr-1.5 h-4 w-4" /> Export CSV
          </Button>

          {/* Print */}
          <Button
            onClick={() => printSection("recruitment-pipeline-table", "Recruitment Pipeline Report")}
            variant="secondary"
            className="border-white/20 bg-white/10 hover:bg-white/20 text-white"
          >
            <Printer className="mr-1.5 h-4 w-4" /> Print / PDF
          </Button>

          <Button
            onClick={() => setIsAdding(true)}
            className="bg-brand-cyan font-black text-brand-navy hover:bg-brand-cyan/90"
          >
            <Plus className="mr-1.5 h-4 w-4" /> Add Prospect
          </Button>
        </div>
      </div>

      {/* KPI STRIP */}
      <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
        {[
          { label: "Total Pipeline", value: totalProspects, color: "text-brand-navy", bg: "bg-white" },
          { label: "Prospects", value: prospectCount, color: "text-slate-600", bg: "bg-slate-50" },
          { label: "Invited", value: invitedCount, color: "text-brand-blue", bg: "bg-cyan-50/50" },
          { label: "Presentation ⭐", value: presentationCount, color: "text-amber-700", bg: "bg-amber-50/50" },
          { label: "Follow-up", value: followupCount, color: "text-indigo-700", bg: "bg-indigo-50/50" },
          { label: "Enrolled IBO ✓", value: enrolledCount, color: "text-emerald-700", bg: "bg-emerald-50" }
        ].map((kpi) => (
          <Card key={kpi.label} className={cn("p-4 border-slate-200 shadow-sm", kpi.bg)}>
            <p className="text-[11px] font-bold uppercase text-slate-500">{kpi.label}</p>
            <p className={cn("mt-1 text-2xl font-black", kpi.color)}>{kpi.value}</p>
          </Card>
        ))}
      </div>

      {/* TAB SWITCHER */}
      <div className="flex items-center gap-1 rounded-xl bg-slate-100 p-1 w-fit">
        {[
          { id: "pipeline", label: "Pipeline & Links", icon: Users },
          { id: "presentation", label: "Presentation Data", icon: Video },
          { id: "followup", label: "Follow-up Text Marketing", icon: MessageSquare }
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id as typeof activeTab)}
            className={cn(
              "flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-black transition",
              activeTab === id
                ? "bg-white text-brand-navy shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            )}
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
          </button>
        ))}
      </div>

      {/* ============================== */}
      {/* TAB 1: PIPELINE & SEND LINKS  */}
      {/* ============================== */}
      {activeTab === "pipeline" && (
        <>
          {/* Search & Filter */}
          <Card className="p-4 border-slate-200 flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search prospect name, phone or city..."
                className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm outline-none focus:border-brand-blue"
              />
            </div>
            <div className="flex flex-wrap items-center gap-1.5 text-xs font-semibold">
              {["all", "prospect", "invited", "presentation", "followup", "enrolled"].map((s) => (
                <button
                  key={s}
                  onClick={() => setStageFilter(s)}
                  className={cn(
                    "rounded-lg px-3 py-1.5 transition capitalize",
                    stageFilter === s
                      ? "brand-gradient text-brand-navy font-black shadow-sm"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200/70"
                  )}
                >
                  {s === "all" ? "All" : stageConfig[s as RecruitStage]?.label}
                </button>
              ))}
            </div>
          </Card>

          {/* Prospect Table */}
          <Card id="recruitment-pipeline-table" className="overflow-hidden border-slate-200 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-black uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-4 py-3.5">Prospect & Source</th>
                    <th className="px-4 py-3.5">Direct Call / Text</th>
                    <th className="px-4 py-3.5">Send Link & Fulfill Name List</th>
                    <th className="px-4 py-3.5">Pipeline Stage</th>
                    <th className="px-4 py-3.5">Notes</th>
                    <th className="px-4 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((prospect) => {
                    const stage = stageConfig[prospect.stage];
                    return (
                      <tr key={prospect.id} className="hover:bg-slate-50/80 transition">
                        {/* Prospect info */}
                        <td className="px-4 py-4">
                          <p className="font-black text-brand-navy">{prospect.fullName}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className={cn(
                              "rounded px-1.5 py-0.5 text-[9px] font-bold uppercase",
                              prospect.source === "Name List" ? "bg-amber-100 text-amber-800" :
                              prospect.source === "Referral" ? "bg-purple-100 text-purple-800" :
                              prospect.source === "Event" ? "bg-rose-100 text-rose-800" :
                              "bg-slate-100 text-slate-600"
                            )}>
                              {prospect.source}
                            </span>
                            <span className="text-xs text-slate-500">{prospect.city}</span>
                          </div>
                        </td>

                        {/* Direct call/text */}
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-1.5">
                            <a
                              href={`tel:${prospect.phone.replace(/\s/g, "")}`}
                              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs font-bold text-slate-700 hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-700 transition"
                            >
                              <PhoneCall className="h-3.5 w-3.5 text-emerald-600" /> Call
                            </a>
                            <a
                              href={`sms:${prospect.phone.replace(/\s/g, "")}?body=Hi ${prospect.fullName}!`}
                              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs font-bold text-slate-700 hover:border-brand-blue hover:bg-cyan-50 hover:text-brand-blue transition"
                            >
                              <MessageSquare className="h-3.5 w-3.5 text-brand-blue" /> Text
                            </a>
                          </div>
                        </td>

                        {/* Send Link & fulfill name list */}
                        <td className="px-4 py-4">
                          <div className="space-y-1">
                            <button
                              onClick={() => handleSendLink(prospect)}
                              className={cn(
                                "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-bold transition",
                                prospect.linkSent
                                  ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
                                  : "brand-gradient text-brand-navy shadow-sm"
                              )}
                            >
                              {copiedLinkId === prospect.id ? (
                                <><Check className="h-3.5 w-3.5" /> Link Copied!</>
                              ) : prospect.linkSent ? (
                                <><CheckCircle2 className="h-3.5 w-3.5" /> Link Sent ({prospect.linkSentDate})</>
                              ) : (
                                <><Link className="h-3.5 w-3.5" /> Send Opportunity Link</>
                              )}
                            </button>
                            {prospect.linkSent && (
                              <p className="text-[10px] text-slate-400 pl-0.5">
                                Name List fulfilled ✓
                              </p>
                            )}
                          </div>
                        </td>

                        {/* Stage selector */}
                        <td className="px-4 py-4 min-w-[180px]">
                          <div className="flex items-center justify-between text-[11px] mb-1">
                            <select
                              value={prospect.stage}
                              onChange={(e) => handleStageChange(prospect.id, e.target.value as RecruitStage)}
                              className="rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[11px] font-bold outline-none cursor-pointer"
                            >
                              <option value="prospect">Prospect (10%)</option>
                              <option value="invited">Invited (35%)</option>
                              <option value="presentation">Presentation (65%)</option>
                              <option value="followup">Follow-up (82%)</option>
                              <option value="enrolled">Enrolled IBO (100%)</option>
                            </select>
                            <span className="font-black text-brand-blue ml-2">{stage.pct}%</span>
                          </div>
                          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                            <div
                              className={cn("h-full rounded-full transition-all", stage.color)}
                              style={{ width: `${stage.pct}%` }}
                            />
                          </div>
                        </td>

                        {/* Notes */}
                        <td className="px-4 py-4 max-w-[200px]">
                          <p className="text-xs text-slate-700 line-clamp-2">{prospect.notes}</p>
                          <span className="text-[10px] font-bold text-amber-700">
                            Interest: {prospect.interestScore}/10
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-4 text-right">
                          <Button
                            size="sm"
                            onClick={() => {
                              setActiveFollowupProspect(prospect);
                              setActiveTab("followup");
                            }}
                            className={cn(
                              "h-8 text-xs font-bold",
                              prospect.stage === "presentation" || prospect.stage === "followup"
                                ? "brand-gradient text-brand-navy shadow-sm"
                                : "border border-slate-200 bg-white text-slate-700"
                            )}
                          >
                            <Star className="mr-1 h-3 w-3 fill-amber-400 text-amber-500" />
                            Follow-up Text
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}

      {/* ============================== */}
      {/* TAB 2: PRESENTATION DATA       */}
      {/* ============================== */}
      {activeTab === "presentation" && (
        <div className="space-y-5">
          {/* Presentation KPI Cards */}
          <div className="grid gap-4 sm:grid-cols-3">
            <Card className="p-5 border-slate-200 bg-white">
              <p className="text-[11px] font-bold uppercase text-slate-500">Total Presentations Given</p>
              <p className="mt-1 text-3xl font-black text-brand-navy">{presentationProspects.length}</p>
              <p className="text-xs text-slate-500 mt-1">Prospects who watched the overview</p>
            </Card>
            <Card className="p-5 border-slate-200 bg-amber-50/60">
              <p className="text-[11px] font-bold uppercase text-amber-700">Avg. Time Spent on Presentation</p>
              <p className="mt-1 text-3xl font-black text-amber-800">{avgTimeSpent} min</p>
              <p className="text-xs text-amber-700 mt-1">Target: 25-30 min for full overview</p>
            </Card>
            <Card className="p-5 border-slate-200 bg-emerald-50/60">
              <p className="text-[11px] font-bold uppercase text-emerald-700">Sales Data Shared</p>
              <p className="mt-1 text-3xl font-black text-emerald-800">{salesDataSharedCount} / {presentationProspects.length}</p>
              <p className="text-xs text-emerald-700 mt-1">Compensation plan shown to prospect</p>
            </Card>
          </div>

          {/* Presentation Data Table */}
          <Card className="overflow-hidden border-slate-200 shadow-sm">
            <div className="bg-slate-50 border-b border-slate-200 px-5 py-3">
              <h3 className="font-black text-sm text-brand-navy">Give Presentation — Data for Sales & Time Spent</h3>
              <p className="text-xs text-slate-500 mt-0.5">Track how long each prospect spent on the presentation and whether compensation data was shared.</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-black uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Prospect</th>
                    <th className="px-4 py-3">Presentation Date</th>
                    <th className="px-4 py-3">Time Spent</th>
                    <th className="px-4 py-3">Sales Data for Sales</th>
                    <th className="px-4 py-3">Stage</th>
                    <th className="px-4 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {prospects
                    .filter((p) => p.presentationDate !== "-")
                    .map((p) => {
                      const pct = Math.min(100, Math.round((p.presentationTimeSpent / 30) * 100));
                      return (
                        <tr key={p.id} className="hover:bg-slate-50/80 transition">
                          <td className="px-4 py-3.5">
                            <p className="font-black text-brand-navy text-sm">{p.fullName}</p>
                            <p className="text-xs text-slate-500">{p.city}</p>
                          </td>
                          <td className="px-4 py-3.5 text-xs font-medium text-slate-700">{p.presentationDate}</td>
                          <td className="px-4 py-3.5 min-w-[160px]">
                            <div className="flex items-center justify-between text-xs mb-1">
                              <span className="font-bold text-slate-700">{p.presentationTimeSpent} min</span>
                              <span className={cn(
                                "font-black text-xs",
                                pct >= 85 ? "text-emerald-600" : pct >= 60 ? "text-amber-600" : "text-red-600"
                              )}>{pct}%</span>
                            </div>
                            <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                              <div
                                className={cn(
                                  "h-full rounded-full transition-all",
                                  pct >= 85 ? "bg-emerald-500" : pct >= 60 ? "bg-amber-500" : "bg-red-400"
                                )}
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </td>
                          <td className="px-4 py-3.5">
                            <button
                              onClick={() => setProspects((prev) =>
                                prev.map((x) => x.id === p.id ? { ...x, salesDataShared: !x.salesDataShared } : x)
                              )}
                              className={cn(
                                "rounded-lg px-2.5 py-1 text-xs font-bold transition border",
                                p.salesDataShared
                                  ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                                  : "bg-white text-slate-700 border-slate-200 hover:border-brand-blue"
                              )}
                            >
                              {p.salesDataShared ? "✓ Comp Plan Shared" : "Mark Data Shared"}
                            </button>
                          </td>
                          <td className="px-4 py-3.5">
                            <span className={cn(
                              "rounded px-2 py-0.5 text-[10px] font-bold",
                              stageConfig[p.stage].color.replace("bg-", "bg-").replace("500", "100"),
                              "text-slate-800"
                            )}>
                              {stageConfig[p.stage].label}
                            </span>
                          </td>
                          <td className="px-4 py-3.5 text-right">
                            <Button
                              size="sm"
                              onClick={() => {
                                setActiveFollowupProspect(p);
                                setActiveTab("followup");
                              }}
                              className="h-7 text-xs brand-gradient text-brand-navy font-bold"
                            >
                              Send Follow-up
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* ============================== */}
      {/* TAB 3: FOLLOW-UP TEXT MARKETING */}
      {/* ============================== */}
      {activeTab === "followup" && (
        <div className="space-y-5">
          {/* Prospect Selector */}
          <Card className="p-4 border-slate-200 flex flex-wrap items-center gap-4">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wide shrink-0">
              Send follow-up to:
            </span>
            <div className="flex flex-wrap gap-2">
              {prospects
                .filter((p) => p.stage === "presentation" || p.stage === "followup" || p.stage === "invited")
                .map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setActiveFollowupProspect(p)}
                    className={cn(
                      "rounded-xl border px-3 py-1.5 text-xs font-bold transition",
                      activeFollowupProspect?.id === p.id
                        ? "border-brand-blue bg-cyan-50 text-brand-navy ring-1 ring-brand-blue"
                        : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                    )}
                  >
                    {p.fullName}
                    <span className={cn(
                      "ml-1.5 rounded px-1 py-0.5 text-[9px]",
                      p.stage === "presentation" ? "bg-amber-100 text-amber-800" :
                      p.stage === "followup" ? "bg-indigo-100 text-indigo-800" :
                      "bg-cyan-100 text-cyan-800"
                    )}>
                      {stageConfig[p.stage].label}
                    </span>
                  </button>
                ))}
            </div>
            {activeFollowupProspect && (
              <Button
                size="sm"
                onClick={() =>
                  onOpenAi?.(
                    `Write a personalized high-converting follow-up text message for ${activeFollowupProspect.fullName} who is currently at the '${stageConfig[activeFollowupProspect.stage].label}' stage in our recruitment pipeline. Their interest score is ${activeFollowupProspect.interestScore}/10. Notes: "${activeFollowupProspect.notes}". Make it warm, urgent, and professional.`
                  )
                }
                variant="ghost"
                className="ml-auto border border-slate-200"
              >
                <Sparkles className="mr-1 h-3.5 w-3.5 text-brand-blue" />
                AI Custom Script for {activeFollowupProspect.fullName.split(" ")[0]}
              </Button>
            )}
          </Card>

          {/* If no prospect selected */}
          {!activeFollowupProspect && (
            <Card className="p-10 text-center border-slate-200 bg-slate-50">
              <MessageSquare className="h-8 w-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-400">Select a prospect above to see follow-up text templates</p>
            </Card>
          )}

          {/* Follow-up Templates */}
          {activeFollowupProspect && (
            <>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-black text-brand-navy">
                    Follow-up Text Marketing for: <span className="text-brand-blue">{activeFollowupProspect.fullName}</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {activeFollowupProspect.phone} · {activeFollowupProspect.city} · Stage: {stageConfig[activeFollowupProspect.stage].label}
                  </p>
                </div>
                <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-bold text-slate-600">
                  Follow-up #{activeFollowupProspect.followupCount + 1}
                </span>
              </div>

              <div className="space-y-4">
                {followupTemplates.map((tpl) => {
                  const msg = tpl.text(activeFollowupProspect.fullName.split(" ")[0]);
                  const isCopied = copiedTplId === tpl.id;
                  const phone = activeFollowupProspect.phone.replace(/\s/g, "");

                  return (
                    <Card key={tpl.id} className="p-4 border-slate-200 bg-slate-50">
                      <div className="flex items-center justify-between mb-2.5">
                        <h4 className="font-bold text-xs text-brand-navy">{tpl.title}</h4>
                        <span className="rounded-full bg-brand-cyan/20 border border-brand-cyan/30 px-2 py-0.5 text-[10px] font-black text-brand-navy">
                          {tpl.tag}
                        </span>
                      </div>
                      <p className="rounded-xl bg-white border border-slate-200 p-3.5 text-xs text-slate-700 font-medium leading-relaxed">
                        "{msg}"
                      </p>
                      <div className="mt-3 flex items-center justify-end gap-2">
                        <button
                          onClick={() => copyFollowupTemplate(tpl.id, msg)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 transition"
                        >
                          {isCopied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                          {isCopied ? "Copied!" : "Copy Text"}
                        </button>
                        <a
                          href={`sms:${phone}?body=${encodeURIComponent(msg)}`}
                          className="inline-flex items-center gap-1.5 rounded-lg brand-gradient px-3 py-1.5 text-xs font-black text-brand-navy shadow-sm hover:brightness-105"
                        >
                          <Send className="h-3.5 w-3.5" /> Send SMS Now
                        </a>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}

      {/* ADD PROSPECT MODAL */}
      {isAdding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <Card className="w-full max-w-md p-6 bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-black text-brand-navy">Add Prospect to Pipeline</h3>
              <button onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-slate-700">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleAddProspect} className="mt-4 space-y-3">
              <div>
                <label className="mb-1 block text-xs font-bold uppercase text-slate-600">Full Name</label>
                <input required value={newName} onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Rahel Tadesse"
                  className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-brand-blue" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-bold uppercase text-slate-600">Phone</label>
                  <input required value={newPhone} onChange={(e) => setNewPhone(e.target.value)}
                    className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-brand-blue" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-bold uppercase text-slate-600">City</label>
                  <input value={newCity} onChange={(e) => setNewCity(e.target.value)}
                    className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-brand-blue" />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-bold uppercase text-slate-600">Source</label>
                <select value={newSource} onChange={(e) => setNewSource(e.target.value as Prospect["source"])}
                  className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-brand-blue">
                  <option>Name List</option>
                  <option>Social Media</option>
                  <option>Referral</option>
                  <option>Event</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-bold uppercase text-slate-600">Notes</label>
                <textarea rows={2} value={newNotes} onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="Key background info, common ground, objections..."
                  className="w-full rounded-lg border border-slate-200 p-2.5 text-xs outline-none focus:border-brand-blue" />
              </div>
              <div className="flex justify-end gap-2 border-t border-slate-100 pt-3">
                <Button type="button" variant="ghost" size="sm" onClick={() => setIsAdding(false)}>Cancel</Button>
                <Button type="submit" className="brand-gradient font-bold text-brand-navy" size="sm">
                  Add to Pipeline
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
