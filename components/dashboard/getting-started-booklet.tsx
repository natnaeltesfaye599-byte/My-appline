"use client";

import { useState, useEffect } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  BookOpen,
  Calendar,
  Camera,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  Clock,
  Coins,
  Download,
  FileCheck,
  FileSpreadsheet,
  FileText,
  Flame,
  Globe,
  GraduationCap,
  HelpCircle,
  ImageIcon,
  Layers,
  Lightbulb,
  MapPin,
  MessageSquare,
  Network,
  Phone,
  Play,
  Presentation,
  Printer,
  Quote,
  Radio,
  Send,
  Share2,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  Trophy,
  Upload,
  User,
  UserCheck,
  Users,
  Zap
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { printSection, exportToCsv, exportToJson } from "@/lib/export-utils";
import {
  getGettingStartedConfig,
  GettingStartedConfig,
  defaultGettingStartedConfig
} from "@/lib/onboarding-prospect-config";

export interface GettingStartedData {
  // Page 1: Welcome & Profile
  fullName: string;
  phone: string;
  email: string;
  city: string;
  uplineName: string;
  uplinePhone: string;
  startDate: string;
  packageType: string;

  // Page 2: 1st Day & Now Photo
  firstDayPhotoUrl?: string;
  nowPhotoUrl?: string;

  // Page 5: Checklist & Q&A
  checklist: Record<string, boolean>;
  answers: {
    q1_why: string;
    q2_income_goal: string;
    q3_accountability_partner: string;
    q4_weekly_hours: string;
  };

  // Page 6: Goal of MLP
  goals: {
    goal30Days: string;
    goal90Days: string;
    goal1Year: string;
    pledgeAgreed: boolean;
    digitalSignature: string;
    pledgeDate: string;
  };
}

interface GettingStartedBookletProps {
  initialData?: Partial<GettingStartedData>;
  onSave?: (data: GettingStartedData) => void;
  onProceedToNbo?: () => void;
}

const defaultChecklistItems = [
  { id: "item-1", label: "Completed Getting Started Orientation with Upline Sponsor" },
  { id: "item-2", label: "Registered & activated official MyUpline digital command center" },
  { id: "item-3", label: "Downloaded Breakthrough Share Company presentation slides & compensation guide" },
  { id: "item-4", label: "Written down initial 100 Contact Name List Asset in workbook" },
  { id: "item-5", label: "Scheduled first 3 Three-Way Launch Calls with Upline Leader" },
  { id: "item-6", label: "Joined official Breakthrough Share Company Telegram & Announcement Channel" },
  { id: "item-7", label: "Watched 'Rise of Entrepreneur' Foundation Video (20 min)" },
  { id: "item-8", label: "Committed to Daily Method of Operation (DMO) schedule" }
];

const leaderTestimonials = [
  {
    name: "Dawit Mengistu",
    role: "Crown Diamond Executive",
    experience: "4 Years in Breakthrough Share Company",
    quote:
      "On my first day at Breakthrough Share Company, I had zero sales background and was terrified of public speaking. By sticking to the 6-page Getting Started blueprint and working 3-way calls with my upline, I built an organization of 3,500+ active leaders. System duplication is real.",
    avatar: "👑",
    badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/40",
    dayOne: "Unemployed graduate with big dreams and zero network",
    now: "Financial freedom, Top Earner & Mentor to thousands across East Africa"
  },
  {
    name: "Selamawit Tadesse",
    role: "Senior Sales Director",
    experience: "3 Years in Breakthrough Share Company",
    quote:
      "I joined Breakthrough while juggling a demanding 9-to-5 job. The Getting Started Form gave me my exact DMO: 5 contacts and 2 follow-ups a day. Within 8 months, my residual income surpassed my corporate salary.",
    avatar: "💎",
    badgeColor: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40",
    dayOne: "Stressed corporate employee looking for additional income stream",
    now: "Full-time entrepreneur, Car Program recipient, leading national women's chapter"
  },
  {
    name: "Dr. Kassahun Bekele",
    role: "Diamond Director & Faculty Lead",
    experience: "3.5 Years in Breakthrough Share Company",
    quote:
      "As an academic, I evaluated the mathematical model of Multi-Level Platforms. Breakthrough Share Company offers the most equitable, transparent duplication architecture in Africa. Master Page 3 and Page 4 of this booklet, and your success is guaranteed.",
    avatar: "🎓",
    badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
    dayOne: "Academic researcher seeking financial sovereignty and scalable systems",
    now: "Diamond Director, international conference speaker & master trainer"
  }
];

export function GettingStartedBooklet({
  initialData,
  onSave,
  onProceedToNbo
}: GettingStartedBookletProps) {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [saveToast, setSaveToast] = useState(false);

  // Dynamic Booklet Config (Managed by Super Admin CRUD Studio)
  const [bookletConfig, setBookletConfig] = useState<GettingStartedConfig>(defaultGettingStartedConfig);

  useEffect(() => {
    setBookletConfig(getGettingStartedConfig());
    const handleUpdate = () => setBookletConfig(getGettingStartedConfig());
    window.addEventListener("storage", handleUpdate);
    window.addEventListener("myupline_booklet_config_updated", handleUpdate);
    return () => {
      window.removeEventListener("storage", handleUpdate);
      window.removeEventListener("myupline_booklet_config_updated", handleUpdate);
    };
  }, []);

  // Core Form State
  const [formData, setFormData] = useState<GettingStartedData>({
    fullName: initialData?.fullName || "Solomon Hailu Tadesse",
    phone: initialData?.phone || "+251 912 345 678",
    email: initialData?.email || "solomon.leader@myupline.org",
    city: initialData?.city || "Addis Ababa, Bole Sub-City",
    uplineName: initialData?.uplineName || "Coach Dawit Mengistu",
    uplinePhone: initialData?.uplinePhone || "+251 911 223 344",
    startDate: initialData?.startDate || new Date().toISOString().split("T")[0],
    packageType: initialData?.packageType || "Diamond Leader (500 PV)",
    firstDayPhotoUrl: initialData?.firstDayPhotoUrl || "",
    nowPhotoUrl: initialData?.nowPhotoUrl || "",
    checklist: initialData?.checklist || {
      "item-1": true,
      "item-2": true,
      "item-3": true
    },
    answers: {
      q1_why:
        initialData?.answers?.q1_why ||
        "To achieve total financial independence, provide quality education for my family, and build an asset that generates generational residual income.",
      q2_income_goal:
        initialData?.answers?.q2_income_goal ||
        "Earn ETB 45,000 monthly residual income within my first 90 days and recruit 8 frontline committed leaders.",
      q3_accountability_partner:
        initialData?.answers?.q3_accountability_partner ||
        "Coach Dawit Mengistu (Direct Upline Sponsor). Daily sync at 8:30 PM.",
      q4_weekly_hours:
        initialData?.answers?.q4_weekly_hours ||
        "15 Hours/week dedicated to DMO prospecting, 3-way calls, and system trainings."
    },
    goals: {
      goal30Days:
        initialData?.goals?.goal30Days ||
        "Reach Silver Associate Rank (5,000 GV) with 10 personally sponsored and duplicated members.",
      goal90Days:
        initialData?.goals?.goal90Days ||
        "Advance to Gold Executive (25,000 GV), lead 2 synchronized weekly meetings, qualify for regional seminar.",
      goal1Year:
        initialData?.goals?.goal1Year ||
        "Achieve Diamond Director (150,000 GV), qualify for Company Car Program, create 5 Gold Executives in downline.",
      pledgeAgreed: initialData?.goals?.pledgeAgreed ?? true,
      digitalSignature: initialData?.goals?.digitalSignature || "Solomon Hailu Tadesse",
      pledgeDate: initialData?.goals?.pledgeDate || new Date().toISOString().split("T")[0]
    }
  });

  const totalPages = 6;

  const activeTestimonials =
    bookletConfig.testimonials && bookletConfig.testimonials.length > 0
      ? bookletConfig.testimonials
      : leaderTestimonials;

  const activeChecklistItems =
    bookletConfig.checklistItems && bookletConfig.checklistItems.length > 0
      ? bookletConfig.checklistItems
      : defaultChecklistItems;

  const pagesInfo = [
    { num: 1, title: `Welcome to ${bookletConfig.companyName || "Breakthrough"}`, subtitle: `${bookletConfig.companyName || "Breakthrough Share Company"} Ethos` },
    { num: 2, title: "1st Day & Now Photo & Testimonies", subtitle: "Transformation & Proof" },
    { num: 3, title: "Core Principles (PPT Slide 2)", subtitle: "System Duplication Rules" },
    { num: 4, title: "Compensation & Volume (PPT Slide 3)", subtitle: "PV, GV & Rank Ladder" },
    { num: 5, title: "Checklist & Q/A", subtitle: "Action Plan & Commitments" },
    { num: 6, title: "Goal of MLP", subtitle: "Vision & Personal Pledge" }
  ];

  const completedChecklistCount = Object.values(formData.checklist).filter(Boolean).length;
  const checklistPercentage =
    activeChecklistItems.length > 0
      ? Math.round((completedChecklistCount / activeChecklistItems.length) * 100)
      : 0;

  function handleChecklistToggle(id: string) {
    setFormData((prev) => ({
      ...prev,
      checklist: {
        ...prev.checklist,
        [id]: !prev.checklist[id]
      }
    }));
  }

  function handleSaveAll() {
    if (onSave) {
      onSave(formData);
    }
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
  }

  function handlePrintBooklet() {
    printSection(
      "getting-started-printable-booklet",
      `Breakthrough_Share_Company_Getting_Started_Form_${formData.fullName.replace(/\s+/g, "_")}`
    );
  }

  function handleExportCsv() {
    const exportRows = [
      {
        Section: "Member Profile",
        Item: "Full Name",
        Value: formData.fullName
      },
      {
        Section: "Member Profile",
        Item: "Phone Number",
        Value: formData.phone
      },
      {
        Section: "Member Profile",
        Item: "Upline Sponsor",
        Value: formData.uplineName
      },
      {
        Section: "Member Profile",
        Item: "Package Enrolled",
        Value: formData.packageType
      },
      {
        Section: "Q&A Section",
        Item: "Why Joined Breakthrough",
        Value: formData.answers.q1_why
      },
      {
        Section: "Q&A Section",
        Item: "Income & Recruitment Goal",
        Value: formData.answers.q2_income_goal
      },
      {
        Section: "Q&A Section",
        Item: "Accountability Partner",
        Value: formData.answers.q3_accountability_partner
      },
      {
        Section: "Q&A Section",
        Item: "Committed Weekly Hours",
        Value: formData.answers.q4_weekly_hours
      },
      {
        Section: "Goal of MLP",
        Item: "30-Day Target",
        Value: formData.goals.goal30Days
      },
      {
        Section: "Goal of MLP",
        Item: "90-Day Target",
        Value: formData.goals.goal90Days
      },
      {
        Section: "Goal of MLP",
        Item: "1-Year Target",
        Value: formData.goals.goal1Year
      },
      {
        Section: "Goal of MLP",
        Item: "Digital Signature",
        Value: formData.goals.digitalSignature
      }
    ];
    exportToCsv("Breakthrough_Getting_Started_Form", exportRows);
  }

  return (
    <div className="space-y-6">
      {/* ── Top Header Toolbar ── */}
      <div className="flex flex-col gap-4 rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-[#0b1b38] via-[#0e2347] to-[#07132b] p-5 shadow-xl sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3.5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-cyan-400 text-brand-navy shadow-lg shadow-cyan-400/25">
            <ClipboardCheck className="h-6 w-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded bg-cyan-400/10 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-cyan-300">
                Official Onboarding Document
              </span>
              <span className="text-xs font-bold text-slate-400">Breakthrough Share Company</span>
            </div>
            <h2 className="text-xl font-black text-white tracking-tight sm:text-2xl">
              Getting Started / MyUpline Started Form
            </h2>
            <p className="text-xs text-slate-300">
              Complete 6-Page official foundation protocol for new IBO members.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            onClick={handlePrintBooklet}
            variant="ghost"
            size="sm"
            className="border border-cyan-500/40 bg-cyan-950/40 text-cyan-300 hover:bg-cyan-900/60 hover:text-white"
          >
            <Printer className="mr-1.5 h-4 w-4" /> Print Booklet (PDF)
          </Button>
          <Button
            onClick={handleExportCsv}
            variant="ghost"
            size="sm"
            className="border border-slate-700 bg-slate-800/60 text-slate-300 hover:bg-slate-700 hover:text-white"
          >
            <Download className="mr-1.5 h-4 w-4" /> Export CSV
          </Button>
          <Button
            onClick={handleSaveAll}
            size="sm"
            className="bg-emerald-500 font-bold text-white hover:bg-emerald-400 shadow-md shadow-emerald-500/25"
          >
            <Check className="mr-1.5 h-4 w-4" /> Save Form
          </Button>
        </div>
      </div>

      {saveToast && (
        <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/15 p-3 text-xs font-bold text-emerald-300 animate-in fade-in flex items-center justify-between">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            Getting Started Form saved successfully! Your upline sponsor can now verify your progress.
          </span>
          <span className="text-[10px] opacity-75">Saved to Local & Upline Storage</span>
        </div>
      )}

      {/* ── 6-Page Navigation Stepper / Tabs ── */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
        {pagesInfo.map((p) => {
          const isActive = currentPage === p.num;
          const isDone = currentPage > p.num;

          return (
            <button
              key={p.num}
              type="button"
              onClick={() => setCurrentPage(p.num)}
              className={cn(
                "group relative flex flex-col rounded-xl border p-3 text-left transition-all duration-200",
                isActive
                  ? "border-cyan-400 bg-cyan-950/60 ring-2 ring-cyan-400/30 shadow-lg shadow-cyan-500/10"
                  : isDone
                  ? "border-emerald-500/40 bg-[#0c1f3d]/80 hover:border-emerald-400"
                  : "border-slate-800 bg-[#08152b]/80 hover:border-slate-700"
              )}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span
                  className={cn(
                    "flex h-6 w-6 items-center justify-center rounded-full text-xs font-black",
                    isActive
                      ? "bg-cyan-400 text-brand-navy"
                      : isDone
                      ? "bg-emerald-500 text-white"
                      : "bg-slate-800 text-slate-400"
                  )}
                >
                  {isDone ? <Check className="h-3.5 w-3.5 stroke-[3]" /> : p.num}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Page {p.num}
                </span>
              </div>
              <h4
                className={cn(
                  "text-xs font-bold leading-tight line-clamp-1",
                  isActive ? "text-cyan-300" : isDone ? "text-emerald-300" : "text-white"
                )}
              >
                {p.title}
              </h4>
              <p className="text-[10px] text-slate-400 truncate mt-0.5">{p.subtitle}</p>
            </button>
          );
        })}
      </div>

      {/* ── Active Page Content Card ── */}
      <div className="relative rounded-3xl border border-slate-800 bg-[#0a1832] p-6 text-white shadow-2xl backdrop-blur-xl sm:p-8">
        {/* ========================================================================= */}
        {/* PAGE 1: WELCOME TO BREAKTHROUGH SHARE COMPANY                            */}
        {/* ========================================================================= */}
        {currentPage === 1 && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-cyan-950/60 via-[#0a2347] to-[#06142a] p-6 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-400 text-brand-navy shadow-xl shadow-cyan-400/30 mb-3">
                <Sparkles className="h-8 w-8" />
              </div>
              <span className="rounded-full bg-cyan-400/20 px-3 py-1 text-xs font-extrabold uppercase tracking-widest text-cyan-300">
                Official Member Welcome
              </span>
              <h1 className="mt-3 text-2xl font-black text-white sm:text-3xl">
                Welcome to Breakthrough Share Company
              </h1>
              <p className="mx-auto mt-2 max-w-2xl text-xs sm:text-sm text-slate-300 leading-relaxed">
                You have just stepped into Ethiopia’s premier entrepreneurship and organizational growth platform.
                At <strong>Breakthrough Share Company</strong>, our mission is to empower visionaries like you with
                the tools, mentorship, and system duplication needed to achieve unconditional financial freedom.
              </p>
            </div>

            {/* Core Ethos Grid */}
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-800 bg-[#08162d] p-4 text-center">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 mb-2">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h4 className="text-sm font-black text-white">Our Vision</h4>
                <p className="mt-1 text-xs text-slate-400">
                  Building a nationwide community of self-reliant entrepreneurs generating passive residual wealth.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-[#08162d] p-4 text-center">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400 mb-2">
                  <Trophy className="h-5 w-5" />
                </div>
                <h4 className="text-sm font-black text-white">System Duplication</h4>
                <p className="mt-1 text-xs text-slate-400">
                  A simple, proven 6-step blueprint designed so that every new partner can immediately copy and win.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-[#08162d] p-4 text-center">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/20 text-purple-400 mb-2">
                  <Users className="h-5 w-5" />
                </div>
                <h4 className="text-sm font-black text-white">Ethical Leadership</h4>
                <p className="mt-1 text-xs text-slate-400">
                  Rooted in integrity, collective uplift, continuous education, and active upline sponsorship.
                </p>
              </div>
            </div>

            {/* Member Profile Verification */}
            <div className="rounded-2xl border border-cyan-500/20 bg-[#06142a]/90 p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <UserCheck className="h-5 w-5 text-cyan-400" />
                  <h3 className="text-sm font-black text-white">New IBO Member Details (Page 1)</h3>
                </div>
                <span className="text-[11px] font-bold text-slate-400">Verify and update if necessary</span>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="h-10 w-full rounded-xl border border-slate-700 bg-[#08162d] px-3 text-xs text-white outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="h-10 w-full rounded-xl border border-slate-700 bg-[#08162d] px-3 text-xs text-white outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="h-10 w-full rounded-xl border border-slate-700 bg-[#08162d] px-3 text-xs text-white outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    City / Branch
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="h-10 w-full rounded-xl border border-slate-700 bg-[#08162d] px-3 text-xs text-white outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Direct Upline Sponsor
                  </label>
                  <input
                    type="text"
                    value={formData.uplineName}
                    onChange={(e) => setFormData({ ...formData, uplineName: e.target.value })}
                    className="h-10 w-full rounded-xl border border-slate-700 bg-[#08162d] px-3 text-xs text-white outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Upline Sponsor Phone
                  </label>
                  <input
                    type="text"
                    value={formData.uplinePhone}
                    onChange={(e) => setFormData({ ...formData, uplinePhone: e.target.value })}
                    className="h-10 w-full rounded-xl border border-slate-700 bg-[#08162d] px-3 text-xs text-white outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Package Enrolled
                  </label>
                  <input
                    type="text"
                    value={formData.packageType}
                    onChange={(e) => setFormData({ ...formData, packageType: e.target.value })}
                    className="h-10 w-full rounded-xl border border-slate-700 bg-[#08162d] px-3 text-xs text-white outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Start / Orientation Date
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="h-10 w-full rounded-xl border border-slate-700 bg-[#08162d] px-3 text-xs text-white outline-none focus:border-cyan-400"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* PAGE 2: PHOTO OF 1ST DAY & NOW & TESTIMONY OF SOME LEADERS               */}
        {/* ========================================================================= */}
        {currentPage === 2 && (
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                Page 2 of 6 • Transformation & Proof
              </span>
              <h2 className="text-xl font-black text-white sm:text-2xl">
                Photo of 1st Day & Now • Testimony of Some Leaders
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Every giant leader started with a humble 1st day. Compare the journey and draw strength from real testimonials.
              </p>
            </div>

            {/* Photo of 1st Day & Now Comparison */}
            <div className="rounded-2xl border border-slate-800 bg-[#07152b] p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Camera className="h-5 w-5 text-cyan-400" />
                  <h3 className="text-sm font-black text-white">1st Day vs Now: The Transformation Journey</h3>
                </div>
                <span className="text-[10px] rounded bg-cyan-400/10 px-2 py-0.5 font-bold text-cyan-300">
                  Visual Blueprint
                </span>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {/* 1st Day Photo Card */}
                <div className="rounded-2xl border border-amber-500/30 bg-amber-950/10 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-amber-500/20 px-2.5 py-0.5 text-[10px] font-black uppercase text-amber-300">
                      Day 1: Where We All Begin
                    </span>
                    <Clock className="h-4 w-4 text-amber-400" />
                  </div>
                  <div className="relative h-48 w-full overflow-hidden rounded-xl border border-amber-500/20 bg-slate-900 group">
                    {formData.firstDayPhotoUrl ? (
                      <img
                        src={formData.firstDayPhotoUrl}
                        alt="1st Day Photo"
                        className="h-full w-full object-cover grayscale contrast-125"
                      />
                    ) : (
                      <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-slate-600">
                        <Camera className="h-10 w-10" />
                        <span className="text-xs font-semibold">No photo uploaded</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col items-end justify-between p-3">
                      <label
                        htmlFor="upload-day1-photo"
                        className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-amber-500/80 px-2.5 py-1.5 text-[10px] font-bold text-white shadow-lg backdrop-blur-sm hover:bg-amber-400 transition-colors"
                        title="Upload 1st Day Photo"
                      >
                        <Upload className="h-3 w-3" /> Upload Photo
                      </label>
                      <input
                        id="upload-day1-photo"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setFormData((prev) => ({
                              ...prev,
                              firstDayPhotoUrl: reader.result as string
                            }));
                          };
                          reader.readAsDataURL(file);
                        }}
                      />
                      {formData.firstDayPhotoUrl && (
                        <p className="text-xs font-semibold text-amber-200">
                          Humble start, zero network marketing experience, big aspirations.
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-xs text-slate-400 space-y-1">
                    <p className="flex items-center gap-1 text-slate-300 font-semibold">
                      <Check className="h-3.5 w-3.5 text-amber-400" /> Nervous to make 3-way calls
                    </p>
                    <p className="flex items-center gap-1 text-slate-300 font-semibold">
                      <Check className="h-3.5 w-3.5 text-amber-400" /> First 100 contact name list on paper
                    </p>
                  </div>
                </div>

                {/* Now Photo Card */}
                <div className="rounded-2xl border border-cyan-500/30 bg-cyan-950/10 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-cyan-500/20 px-2.5 py-0.5 text-[10px] font-black uppercase text-cyan-300">
                      Now / Today: The Result of Duplication
                    </span>
                    <Trophy className="h-4 w-4 text-cyan-400" />
                  </div>
                  <div className="relative h-48 w-full overflow-hidden rounded-xl border border-cyan-500/30 bg-slate-900 group">
                    {formData.nowPhotoUrl ? (
                      <img
                        src={formData.nowPhotoUrl}
                        alt="Now Photo"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-slate-600">
                        <Camera className="h-10 w-10" />
                        <span className="text-xs font-semibold">No photo uploaded</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent flex flex-col items-end justify-between p-3">
                      <label
                        htmlFor="upload-now-photo"
                        className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-cyan-500/80 px-2.5 py-1.5 text-[10px] font-bold text-white shadow-lg backdrop-blur-sm hover:bg-cyan-400 transition-colors"
                        title="Upload Now Photo"
                      >
                        <Upload className="h-3 w-3" /> Upload Photo
                      </label>
                      <input
                        id="upload-now-photo"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setFormData((prev) => ({
                              ...prev,
                              nowPhotoUrl: reader.result as string
                            }));
                          };
                          reader.readAsDataURL(file);
                        }}
                      />
                      {formData.nowPhotoUrl && (
                        <p className="text-xs font-semibold text-cyan-200">
                          Diamond rank, keynote stage speaker, empowering thousands of families.
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-xs text-slate-400 space-y-1">
                    <p className="flex items-center gap-1 text-emerald-300 font-semibold">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Scaled downline across 4 regions
                    </p>
                    <p className="flex items-center gap-1 text-emerald-300 font-semibold">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Passive monthly residual commissions
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Testimony of Some Leaders */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Quote className="h-5 w-5 text-cyan-400" />
                <h3 className="text-sm font-black text-white">Testimony of Some Leaders</h3>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                {activeTestimonials.map((leader, i) => (
                  <div
                    key={i}
                    className="flex flex-col justify-between rounded-2xl border border-slate-800 bg-[#06142a] p-5 shadow-lg transition hover:border-cyan-500/30"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2.5">
                          <span className="text-2xl">{leader.avatar}</span>
                          <div>
                            <h4 className="text-xs font-black text-white">{leader.name}</h4>
                            <span
                              className={cn(
                                "inline-block rounded border px-1.5 py-0.2 text-[9px] font-extrabold",
                                leader.badgeColor
                              )}
                            >
                              {leader.role}
                            </span>
                          </div>
                        </div>
                      </div>

                      <p className="text-xs italic text-slate-300 leading-relaxed">
                        &ldquo;{leader.quote}&rdquo;
                      </p>
                    </div>

                    <div className="mt-4 border-t border-slate-800/80 pt-3 text-[11px] text-slate-400 space-y-1">
                      <div>
                        <span className="font-bold text-amber-300">Day 1:</span> {leader.dayOne}
                      </div>
                      <div>
                        <span className="font-bold text-cyan-300">Now:</span> {leader.now}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* PAGE 3: COPY FROM POWER POINT PAGE 2                                     */}
        {/* ========================================================================= */}
        {currentPage === 3 && (
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                    Page 3 of 6 • Copy from Power Point Page 2
                  </span>
                  <h2 className="text-xl font-black text-white sm:text-2xl">
                    The First 48-Hour Blueprint & System Duplication Rules
                  </h2>
                </div>
                <div className="flex items-center gap-1.5 rounded-lg border border-cyan-500/30 bg-cyan-950/40 px-3 py-1.5 text-xs font-bold text-cyan-300">
                  <Presentation className="h-4 w-4" /> PPT Slide 2
                </div>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Official presentation curriculum taught at Breakthrough Share Company NBO & System orientations.
              </p>
            </div>

            {/* Slide 2 Content Presentation Box */}
            <div className="rounded-2xl border-2 border-cyan-500/40 bg-gradient-to-b from-[#091e3e] to-[#06142a] p-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-cyan-500/20 pb-4 mb-5">
                <div>
                  <span className="rounded bg-cyan-400 text-brand-navy px-2 py-0.5 text-[10px] font-black uppercase">
                    SLIDE 2 CURRICULUM
                  </span>
                  <h3 className="text-lg font-black text-white mt-1">
                    System Duplication Architecture & The 48-Hour Protocol
                  </h3>
                </div>
                <span className="text-xs font-bold text-cyan-300">Breakthrough Global Academy</span>
              </div>

              <div className="grid gap-5 md:grid-cols-3">
                {/* Pillar 1 */}
                <div className="rounded-xl border border-slate-700/80 bg-[#051124]/90 p-4 space-y-3">
                  <div className="flex items-center gap-2 text-cyan-300 font-bold text-xs uppercase">
                    <Clock className="h-4 w-4 text-cyan-400" />
                    <span>1. The 48-Hour Window</span>
                  </div>
                  <h4 className="text-sm font-black text-white">First 48 Hours Dictate 80% of Growth</h4>
                  <ul className="text-xs text-slate-300 space-y-2">
                    <li className="flex items-start gap-1.5">
                      <span className="text-cyan-400 font-black">•</span>
                      <span>Never delay your launch. Enthusiasm and momentum are highest in hours 1–48.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-cyan-400 font-black">•</span>
                      <span>Compile a written list of at least 100 warm contacts without pre-judging anyone.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-cyan-400 font-black">•</span>
                      <span>Book your first 3-way launch call with your Upline Sponsor within 24 hours.</span>
                    </li>
                  </ul>
                </div>

                {/* Pillar 2 */}
                <div className="rounded-xl border border-slate-700/80 bg-[#051124]/90 p-4 space-y-3">
                  <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs uppercase">
                    <Network className="h-4 w-4 text-emerald-400" />
                    <span>2. The 3 Golden Rules</span>
                  </div>
                  <h4 className="text-sm font-black text-white">Laws of Network Marketing Mastery</h4>
                  <ul className="text-xs text-slate-300 space-y-2">
                    <li className="flex items-start gap-1.5">
                      <span className="text-emerald-400 font-black">•</span>
                      <span><strong>Simplicity Beats Genius:</strong> It doesn&apos;t matter what works; it only matters what duplicates.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-emerald-400 font-black">•</span>
                      <span><strong>Never Present Alone in Week 1:</strong> Always leverage third-party upline authority.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-emerald-400 font-black">•</span>
                      <span><strong>Tools over Talent:</strong> Let videos, PPTs, and booklets do the heavy lifting for you.</span>
                    </li>
                  </ul>
                </div>

                {/* Pillar 3 */}
                <div className="rounded-xl border border-slate-700/80 bg-[#051124]/90 p-4 space-y-3">
                  <div className="flex items-center gap-2 text-purple-300 font-bold text-xs uppercase">
                    <Flame className="h-4 w-4 text-purple-400" />
                    <span>3. Daily DMO Formula</span>
                  </div>
                  <h4 className="text-sm font-black text-white">Daily Method of Operation (DMO)</h4>
                  <ul className="text-xs text-slate-300 space-y-2">
                    <li className="flex items-start gap-1.5">
                      <span className="text-purple-400 font-black">•</span>
                      <span><strong>5 New Contacts / Day:</strong> Connect with 5 warm or qualified prospects daily.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-purple-400 font-black">•</span>
                      <span><strong>2 Follow-Ups / Day:</strong> Follow up within 24–48 hours using Feel-Felt-Found.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-purple-400 font-black">•</span>
                      <span><strong>30 Min Audio/Book:</strong> Continuous personal development is non-negotiable.</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Upline Golden Rule Banner */}
              <div className="mt-5 flex items-center gap-3 rounded-xl border border-cyan-400/30 bg-cyan-950/40 p-3.5 text-xs text-cyan-200">
                <Lightbulb className="h-5 w-5 shrink-0 text-cyan-400" />
                <span>
                  <strong>PPT Slide 2 Takeaway:</strong> &ldquo;Amateurs convince; professionals sort.
                  Use the 3-Way Call to let your upline leader answer objections while you take notes and learn.&rdquo;
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* PAGE 4: COPY FROM POWER POINT PAGE 3                                     */}
        {/* ========================================================================= */}
        {currentPage === 4 && (
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                    Page 4 of 6 • Copy from Power Point Page 3
                  </span>
                  <h2 className="text-xl font-black text-white sm:text-2xl">
                    Volume Metrics (PV & GV) & Breakthrough Rank Pathways
                  </h2>
                </div>
                <div className="flex items-center gap-1.5 rounded-lg border border-purple-500/30 bg-purple-950/40 px-3 py-1.5 text-xs font-bold text-purple-300">
                  <Presentation className="h-4 w-4" /> PPT Slide 3
                </div>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                The mathematics of geometric progression, compensation qualification, and rank advancements.
              </p>
            </div>

            {/* Slide 3 Content Presentation Box */}
            <div className="rounded-2xl border-2 border-purple-500/40 bg-gradient-to-b from-[#110d29] to-[#07132b] p-6 shadow-2xl space-y-6">
              <div className="flex items-center justify-between border-b border-purple-500/20 pb-4">
                <div>
                  <span className="rounded bg-purple-400 text-brand-navy px-2 py-0.5 text-[10px] font-black uppercase">
                    SLIDE 3 CURRICULUM
                  </span>
                  <h3 className="text-lg font-black text-white mt-1">
                    Understanding Volume Cycles: PV vs GV & Rank Matrix
                  </h3>
                </div>
                <span className="text-xs font-bold text-purple-300">Compensation Engine</span>
              </div>

              {/* PV vs GV Explanation */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-cyan-500/30 bg-cyan-950/20 p-4">
                  <div className="flex items-center gap-2 text-cyan-400 font-black text-sm mb-1.5">
                    <Coins className="h-4 w-4" /> Personal Volume (PV)
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Volume earned from your personal package enrollment and personal retail customer purchases.
                    Required to keep your account active and qualify for direct referral bonuses (e.g. 50 PV Bronze up to 500 PV Diamond).
                  </p>
                </div>

                <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-4">
                  <div className="flex items-center gap-2 text-emerald-400 font-black text-sm mb-1.5">
                    <Layers className="h-4 w-4" /> Group Volume (GV)
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    The cumulative volume of your entire downline team across all lineage depths.
                    GV drives weekly matching overrides, leadership pools, and rank advancements.
                  </p>
                </div>
              </div>

              {/* Rank Advancement Ladder */}
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-300 mb-3">
                  Breakthrough Share Company Rank Ladder
                </h4>
                <div className="grid gap-2.5 sm:grid-cols-4">
                  <div className="rounded-xl border border-slate-800 bg-[#06142a] p-3.5">
                    <div className="text-xs font-black text-amber-400">1. Starter / Bronze</div>
                    <div className="text-[11px] font-mono text-slate-400 mt-1">50 - 100 PV</div>
                    <p className="text-[11px] text-slate-300 mt-1">Direct bonus eligibility, starter training kit access.</p>
                  </div>

                  <div className="rounded-xl border border-slate-700 bg-[#071933] p-3.5">
                    <div className="text-xs font-black text-slate-200">2. Silver Associate</div>
                    <div className="text-[11px] font-mono text-cyan-300 mt-1">5,000 GV Required</div>
                    <p className="text-[11px] text-slate-300 mt-1">Team overrides, certified presenter badge.</p>
                  </div>

                  <div className="rounded-xl border border-yellow-500/30 bg-yellow-950/20 p-3.5">
                    <div className="text-xs font-black text-yellow-400">3. Gold Executive</div>
                    <div className="text-[11px] font-mono text-yellow-300 mt-1">25,000 GV Required</div>
                    <p className="text-[11px] text-slate-300 mt-1">Generational matching, VIP leadership seminars.</p>
                  </div>

                  <div className="rounded-xl border border-cyan-400/40 bg-cyan-950/30 p-3.5 ring-1 ring-cyan-400/30">
                    <div className="text-xs font-black text-cyan-300 flex items-center gap-1">
                      <Trophy className="h-3.5 w-3.5" /> 4. Diamond Director
                    </div>
                    <div className="text-[11px] font-mono text-emerald-300 mt-1">150,000+ GV Required</div>
                    <p className="text-[11px] text-slate-300 mt-1">Car bonus pool, international trips, profit sharing.</p>
                  </div>
                </div>
              </div>

              {/* The Power of 2 Duplication Model */}
              <div className="rounded-xl border border-slate-800 bg-[#051124] p-4 space-y-2">
                <h4 className="text-xs font-black uppercase text-cyan-300">The Power of 2 Duplication Matrix</h4>
                <div className="grid grid-cols-4 gap-2 text-center text-xs">
                  <div className="rounded bg-white/5 p-2">
                    <span className="text-slate-400 block text-[10px]">Month 1</span>
                    <strong className="text-white">You + 2 = 2</strong>
                  </div>
                  <div className="rounded bg-white/5 p-2">
                    <span className="text-slate-400 block text-[10px]">Month 3</span>
                    <strong className="text-white">8 Members</strong>
                  </div>
                  <div className="rounded bg-white/5 p-2">
                    <span className="text-slate-400 block text-[10px]">Month 6</span>
                    <strong className="text-white">64 Members</strong>
                  </div>
                  <div className="rounded bg-cyan-500/20 border border-cyan-500/30 p-2">
                    <span className="text-cyan-300 block text-[10px]">Month 12</span>
                    <strong className="text-cyan-300 font-black">4,096 Members!</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* PAGE 5: CHECK LIST & QUESTION AND ANSWER                                  */}
        {/* ========================================================================= */}
        {currentPage === 5 && (
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                Page 5 of 6 • Action Checklist & Personal Commitments
              </span>
              <h2 className="text-xl font-black text-white sm:text-2xl">
                Checklist & Question and Answer
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Tick off your launch requirements and document your answers for your upline sponsor review.
              </p>
            </div>

            {/* Check List Section */}
            <div className="rounded-2xl border border-slate-800 bg-[#06142a] p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <ClipboardCheck className="h-5 w-5 text-emerald-400" />
                  <h3 className="text-sm font-black text-white">Getting Started Action Checklist</h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-400">
                    {completedChecklistCount} of {activeChecklistItems.length} Completed
                  </span>
                  <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-xs font-black text-emerald-300">
                    {checklistPercentage}%
                  </span>
                </div>
              </div>

              <div className="grid gap-2 sm:grid-cols-2">
                {activeChecklistItems.map((item) => {
                  const checked = Boolean(formData.checklist[item.id]);

                  return (
                    <div
                      key={item.id}
                      onClick={() => handleChecklistToggle(item.id)}
                      className={cn(
                        "flex items-start gap-3 rounded-xl border p-3 cursor-pointer transition select-none",
                        checked
                          ? "border-emerald-500/40 bg-emerald-950/20 text-white"
                          : "border-slate-800 bg-[#08152b] text-slate-400 hover:border-slate-700"
                      )}
                    >
                      <div
                        className={cn(
                          "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border",
                          checked
                            ? "border-emerald-400 bg-emerald-500 text-white"
                            : "border-slate-600 bg-slate-800"
                        )}
                      >
                        {checked && <Check className="h-3 w-3 stroke-[3]" />}
                      </div>
                      <span className={cn("text-xs font-medium leading-tight", checked && "text-slate-100 font-semibold")}>
                        {item.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Question and Answer Form (Question / Ans: ________) */}
            <div className="rounded-2xl border border-cyan-500/20 bg-[#06142a] p-5 space-y-5">
              <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-cyan-400" />
                  <h3 className="text-sm font-black text-white">Question and Answer (Q&A)</h3>
                </div>
                <span className="text-[10px] text-slate-400 font-bold uppercase">Required for Sponsor Verification</span>
              </div>

              {/* Q1 */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-cyan-300">
                  {bookletConfig.questions?.q1Prompt || "Question 1: Why did you decide to join Breakthrough Share Company, and what is your #1 emotional reason?"}
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-xs font-bold text-slate-500">Ans:</span>
                  <textarea
                    rows={2}
                    value={formData.answers.q1_why}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        answers: { ...formData.answers, q1_why: e.target.value }
                      })
                    }
                    placeholder="Write your emotional 'Why' here..."
                    className="w-full rounded-xl border border-slate-700 bg-[#08162d] pl-12 pr-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              {/* Q2 */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-cyan-300">
                  {bookletConfig.questions?.q2Prompt || "Question 2: What is your exact 30-day financial and recruitment target? (Income in ETB / New leaders enrolled)"}
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-xs font-bold text-slate-500">Ans:</span>
                  <textarea
                    rows={2}
                    value={formData.answers.q2_income_goal}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        answers: { ...formData.answers, q2_income_goal: e.target.value }
                      })
                    }
                    placeholder="e.g. Earn ETB 30,000 and enroll 5 active associates..."
                    className="w-full rounded-xl border border-slate-700 bg-[#08162d] pl-12 pr-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              {/* Q3 */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-cyan-300">
                  {bookletConfig.questions?.q3Prompt || "Question 3: Who is your committed accountability partner and upline sponsor for the first 48 hours?"}
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-xs font-bold text-slate-500">Ans:</span>
                  <input
                    type="text"
                    value={formData.answers.q3_accountability_partner}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        answers: { ...formData.answers, q3_accountability_partner: e.target.value }
                      })
                    }
                    placeholder="Name and daily call time..."
                    className="h-10 w-full rounded-xl border border-slate-700 bg-[#08162d] pl-12 pr-3 text-xs text-white outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              {/* Q4 */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-cyan-300">
                  {bookletConfig.questions?.q4Prompt || "Question 4: How many hours per week are you committed to dedicating to your Breakthrough business?"}
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-xs font-bold text-slate-500">Ans:</span>
                  <input
                    type="text"
                    value={formData.answers.q4_weekly_hours}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        answers: { ...formData.answers, q4_weekly_hours: e.target.value }
                      })
                    }
                    placeholder="e.g. 15 hours / week"
                    className="h-10 w-full rounded-xl border border-slate-700 bg-[#08162d] pl-12 pr-3 text-xs text-white outline-none focus:border-cyan-400"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* PAGE 6: GOAL OF MLP                                                      */}
        {/* ========================================================================= */}
        {currentPage === 6 && (
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                Page 6 of 6 • The Ultimate Vision & Commitment
              </span>
              <h2 className="text-xl font-black text-white sm:text-2xl">
                Goal of MLP (Multi-Level Platform / Breakthrough Share Company)
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                The institutional mission of our Multi-Level Platform and your personal leadership pledge.
              </p>
            </div>

            {/* Vision of MLP Pillars */}
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/15 p-4 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase">
                  <Trophy className="h-4 w-4" /> 1. Financial Freedom
                </div>
                <h4 className="text-sm font-black text-white">Eradicating Financial Scarcity</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  To provide every motivated individual, regardless of starting capital, a high-leverage vehicle
                  to earn uncapped residual income through genuine products and team performance.
                </p>
              </div>

              <div className="rounded-2xl border border-cyan-500/30 bg-cyan-950/15 p-4 space-y-2">
                <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase">
                  <GraduationCap className="h-4 w-4" /> 2. Leadership Mastery
                </div>
                <h4 className="text-sm font-black text-white">World-Class Human Development</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Transforming shy beginners into confident public speakers, high-integrity sales professionals,
                  and compassionate mentors through our weekly Academy curriculum.
                </p>
              </div>

              <div className="rounded-2xl border border-purple-500/30 bg-purple-950/15 p-4 space-y-2">
                <div className="flex items-center gap-2 text-purple-400 font-bold text-xs uppercase">
                  <Globe className="h-4 w-4" /> 3. Generational Legacy
                </div>
                <h4 className="text-sm font-black text-white">Transferrable Business Asset</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Building a recurring organization that outlives temporary market cycles, providing
                  lasting security and dignity for your children and future generations.
                </p>
              </div>
            </div>

            {/* My Personal 3-Stage Goal Matrix */}
            <div className="rounded-2xl border border-slate-800 bg-[#06142a] p-5 space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                <Target className="h-5 w-5 text-cyan-400" />
                <h3 className="text-sm font-black text-white">My Personal MLP Growth Contract</h3>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="mb-1 block text-xs font-bold text-amber-300">
                    30-Day Milestone Target:
                  </label>
                  <textarea
                    rows={3}
                    value={formData.goals.goal30Days}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        goals: { ...formData.goals, goal30Days: e.target.value }
                      })
                    }
                    className="w-full rounded-xl border border-slate-700 bg-[#08162d] p-2.5 text-xs text-white outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold text-cyan-300">
                    90-Day Expansion Target:
                  </label>
                  <textarea
                    rows={3}
                    value={formData.goals.goal90Days}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        goals: { ...formData.goals, goal90Days: e.target.value }
                      })
                    }
                    className="w-full rounded-xl border border-slate-700 bg-[#08162d] p-2.5 text-xs text-white outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold text-emerald-300">
                    1-Year Legacy Target:
                  </label>
                  <textarea
                    rows={3}
                    value={formData.goals.goal1Year}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        goals: { ...formData.goals, goal1Year: e.target.value }
                      })
                    }
                    className="w-full rounded-xl border border-slate-700 bg-[#08162d] p-2.5 text-xs text-white outline-none focus:border-cyan-400"
                  />
                </div>
              </div>
            </div>

            {/* Digital Signature & Pledge */}
            <div className="rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-cyan-950/30 to-[#06142a] p-5 space-y-4">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="pledge-agree"
                  checked={formData.goals.pledgeAgreed}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      goals: { ...formData.goals, pledgeAgreed: e.target.checked }
                    })
                  }
                  className="mt-1 h-4 w-4 rounded border-slate-700 bg-[#08162d] text-cyan-400 focus:ring-0"
                />
                <label htmlFor="pledge-agree" className="text-xs text-slate-300 leading-relaxed cursor-pointer">
                  <strong>Official Leader Pledge:</strong> I commit to following the Breakthrough Share Company system,
                  respecting the duplication protocol, honoring my upline and downline partners, and working consistently
                  towards my written goals.
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 pt-2 border-t border-slate-800">
                <div>
                  <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Digital Signature (Full Legal Name)
                  </label>
                  <input
                    type="text"
                    value={formData.goals.digitalSignature}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        goals: { ...formData.goals, digitalSignature: e.target.value }
                      })
                    }
                    className="h-10 w-full rounded-xl border border-cyan-500/40 bg-[#08162d] px-3 font-mono text-xs text-cyan-300 outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Pledge Date
                  </label>
                  <input
                    type="date"
                    value={formData.goals.pledgeDate}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        goals: { ...formData.goals, pledgeDate: e.target.value }
                      })
                    }
                    className="h-10 w-full rounded-xl border border-slate-700 bg-[#08162d] px-3 text-xs text-white outline-none focus:border-cyan-400"
                  />
                </div>
              </div>
            </div>

            {/* Booklet Completion CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3">
              <Button
                onClick={handlePrintBooklet}
                className="w-full sm:w-auto bg-cyan-400 font-black text-brand-navy hover:bg-cyan-300 shadow-lg shadow-cyan-400/25"
              >
                <Printer className="mr-2 h-4 w-4" /> Print Certified Booklet (All 6 Pages)
              </Button>

              {onProceedToNbo && (
                <Button
                  onClick={onProceedToNbo}
                  className="w-full sm:w-auto bg-emerald-500 font-bold text-white hover:bg-emerald-400 shadow-lg shadow-emerald-500/25"
                >
                  Proceed to NBO Training Track <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        )}

        {/* ── Bottom Page-to-Page Navigation Bar ── */}
        <div className="mt-8 flex items-center justify-between border-t border-slate-800/80 pt-4">
          <Button
            type="button"
            variant="ghost"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="text-xs font-bold text-slate-400 hover:text-white disabled:opacity-40"
          >
            <ChevronLeft className="mr-1 h-4 w-4" /> Previous Page
          </Button>

          <div className="text-center text-xs font-bold text-slate-400">
            Page <span className="text-cyan-400">{currentPage}</span> of {totalPages}
          </div>

          <Button
            type="button"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className="bg-cyan-400 text-xs font-bold text-brand-navy hover:bg-cyan-300 disabled:opacity-40"
          >
            Next Page <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* HIDDEN PRINT-ONLY CONTAINER (Prints all 6 pages as an official booklet)    */}
      {/* ========================================================================= */}
      <div
        id="getting-started-printable-booklet"
        className="hidden print:block p-8 bg-white text-black font-sans leading-relaxed"
      >
        {/* Cover / Page 1 */}
        <div className="min-h-screen border-b-2 border-black pb-12 mb-12">
          <div className="text-center border-b pb-6">
            <h1 className="text-3xl font-extrabold uppercase tracking-wide">Breakthrough Share Company</h1>
            <h2 className="text-xl font-bold text-slate-700 mt-1">
              Getting Started / MyUpline Started Form (Official Orientation Booklet)
            </h2>
            <p className="text-sm text-slate-600 mt-1">Document Ref: BSC-GSF-{formData.startDate.replace(/-/g, "")}</p>
          </div>

          <div className="mt-8 space-y-4">
            <h3 className="text-lg font-bold border-b pb-1">Page 1: Member Registration & Welcome</h3>
            <p className="text-sm">
              Welcome to <strong>Breakthrough Share Company</strong>. This form serves as your official orientation
              and commitment document.
            </p>
            <table className="w-full border text-sm mt-4">
              <tbody>
                <tr className="border-b">
                  <td className="p-2 font-bold bg-slate-100 w-1/3">New IBO Member:</td>
                  <td className="p-2">{formData.fullName}</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2 font-bold bg-slate-100">Phone Number:</td>
                  <td className="p-2">{formData.phone}</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2 font-bold bg-slate-100">Email Address:</td>
                  <td className="p-2">{formData.email}</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2 font-bold bg-slate-100">City / Sub-City:</td>
                  <td className="p-2">{formData.city}</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2 font-bold bg-slate-100">Direct Upline Sponsor:</td>
                  <td className="p-2">{formData.uplineName} ({formData.uplinePhone})</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2 font-bold bg-slate-100">Package Enrolled:</td>
                  <td className="p-2">{formData.packageType}</td>
                </tr>
                <tr>
                  <td className="p-2 font-bold bg-slate-100">Launch Date:</td>
                  <td className="p-2">{formData.startDate}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Page 2 */}
        <div className="min-h-screen border-b-2 border-black pb-12 mb-12">
          <h3 className="text-lg font-bold border-b pb-2 mb-4">
            Page 2: 1st Day & Now Photo & Testimony of Some Leaders
          </h3>
          <div className="space-y-4 text-sm">
            <div className="border p-4 bg-slate-50">
              <h4 className="font-bold">1st Day vs Today Blueprint:</h4>
              <p>1st Day: Zero experience, learning 3-way calls, compiling 100 name list.</p>
              <p>Today: Certified presenter, Diamond rank, leading regional duplication cohorts.</p>
            </div>
            <h4 className="font-bold mt-4">Leader Testimonies:</h4>
            {leaderTestimonials.map((t, idx) => (
              <div key={idx} className="border-l-4 border-slate-700 pl-3 py-1 my-2">
                <strong>{t.name} ({t.role}):</strong> &ldquo;{t.quote}&rdquo;
              </div>
            ))}
          </div>
        </div>

        {/* Page 3 */}
        <div className="min-h-screen border-b-2 border-black pb-12 mb-12">
          <h3 className="text-lg font-bold border-b pb-2 mb-4">
            Page 3: Copy from Power Point Page 2 (System Duplication Rules)
          </h3>
          <div className="space-y-3 text-sm">
            <p><strong>1. The 48-Hour Protocol:</strong> Momentum is highest immediately after joining. Complete your 100-name list within 48 hours.</p>
            <p><strong>2. 3 Golden Rules:</strong> Simplicity beats genius. Never present alone in week 1. Tools over talent.</p>
            <p><strong>3. Daily DMO:</strong> 5 new contacts/day, 2 follow-ups/day, 30 min daily mindset study.</p>
          </div>
        </div>

        {/* Page 4 */}
        <div className="min-h-screen border-b-2 border-black pb-12 mb-12">
          <h3 className="text-lg font-bold border-b pb-2 mb-4">
            Page 4: Copy from Power Point Page 3 (PV vs GV & Rank Ladder)
          </h3>
          <div className="space-y-3 text-sm">
            <p><strong>PV (Personal Volume):</strong> Direct personal orders and package purchases.</p>
            <p><strong>GV (Group Volume):</strong> Total volume of your entire downline team organization.</p>
            <p><strong>Rank Pathways:</strong> Bronze (50 PV) → Silver (5,000 GV) → Gold (25,000 GV) → Diamond (150,000+ GV).</p>
            <p><strong>Power of 2 Duplication:</strong> Month 1 (2 members) → Month 6 (64 members) → Month 12 (4,096 members).</p>
          </div>
        </div>

        {/* Page 5 */}
        <div className="min-h-screen border-b-2 border-black pb-12 mb-12">
          <h3 className="text-lg font-bold border-b pb-2 mb-4">
            Page 5: Check list & Question and Answer Form
          </h3>
          <div className="space-y-4 text-sm">
            <h4 className="font-bold">Checklist Verification ({checklistPercentage}% Complete):</h4>
            <ul className="list-disc pl-5 space-y-1">
              {defaultChecklistItems.map((item) => (
                <li key={item.id} className={formData.checklist[item.id] ? "font-bold text-black" : "text-slate-500"}>
                  [{formData.checklist[item.id] ? "X" : " "}] {item.label}
                </li>
              ))}
            </ul>

            <h4 className="font-bold pt-4 border-t">Question and Answer:</h4>
            <div className="space-y-3">
              <div>
                <strong>Q1: Why did you decide to join Breakthrough Share Company?</strong>
                <p className="border p-2 bg-slate-50 mt-1">Ans: {formData.answers.q1_why}</p>
              </div>
              <div>
                <strong>Q2: What is your exact 30-day target (Income in ETB / New leaders)?</strong>
                <p className="border p-2 bg-slate-50 mt-1">Ans: {formData.answers.q2_income_goal}</p>
              </div>
              <div>
                <strong>Q3: Who is your committed accountability partner?</strong>
                <p className="border p-2 bg-slate-50 mt-1">Ans: {formData.answers.q3_accountability_partner}</p>
              </div>
              <div>
                <strong>Q4: How many hours per week do you dedicate?</strong>
                <p className="border p-2 bg-slate-50 mt-1">Ans: {formData.answers.q4_weekly_hours}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Page 6 */}
        <div className="min-h-screen">
          <h3 className="text-lg font-bold border-b pb-2 mb-4">
            Page 6: Goal of MLP (Multi-Level Platform / Breakthrough Share Company)
          </h3>
          <div className="space-y-4 text-sm">
            <p>
              <strong>The Goal of MLP:</strong> Financial freedom, leadership mastery, systemic asset creation,
              and generational economic empowerment for Ethiopian families.
            </p>

            <div className="border p-3 space-y-2 bg-slate-50">
              <p><strong>30-Day Goal:</strong> {formData.goals.goal30Days}</p>
              <p><strong>90-Day Goal:</strong> {formData.goals.goal90Days}</p>
              <p><strong>1-Year Goal:</strong> {formData.goals.goal1Year}</p>
            </div>

            <div className="mt-8 border-t-2 pt-4">
              <p className="font-bold">Leader Pledge & Certification:</p>
              <p className="text-xs italic mt-1">
                &ldquo;I commit to following the Breakthrough Share Company system, respecting the duplication protocol,
                and executing my daily method of operation.&rdquo;
              </p>
              <div className="flex justify-between items-center mt-6 pt-4 border-t border-dashed">
                <div>
                  <span className="text-xs text-slate-500 block">Member Signature:</span>
                  <span className="font-mono font-bold text-base">{formData.goals.digitalSignature}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 block">Date of Certification:</span>
                  <span className="font-mono font-bold text-base">{formData.goals.pledgeDate}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
