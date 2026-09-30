"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  Bell,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  CircleDollarSign,
  CreditCard,
  Download,
  FileBarChart,
  Filter,
  GraduationCap,
  Globe,
  LayoutDashboard,
  LineChart,
  LockKeyhole,
  Menu,
  Network,
  PieChart,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  UserRound,
  UsersRound,
  WalletCards,
  Award,
  Compass,
  Crown,
  Image as ImageIcon,
  Quote,
  Star,
  Target,
  UserCheck,
  LogOut,
  Printer,
  FileSpreadsheet,
  ShieldAlert,
  ClipboardCheck,
  Sliders,
  Share2
} from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { roles, sidebarItems } from "@/lib/demo-data";
import { cn } from "@/lib/utils";
import { exportToCsv, printSection } from "@/lib/export-utils";
import { DreamGoalBoard } from "@/components/dashboard/dream-goal-board";
import { TrainingHub } from "@/components/dashboard/training-hub";
import { NameListOrganizer } from "@/components/dashboard/name-list-organizer";
import { DailyActivityTracker } from "@/components/dashboard/daily-activity-tracker";
import { AfterSalesOnboarding } from "@/components/dashboard/after-sales-onboarding";
import { RecruitmentPipeline } from "@/components/dashboard/recruitment-pipeline";
import { GoalAnalyzer } from "@/components/dashboard/goal-analyzer";
import { PromotionalStudio } from "@/components/dashboard/promotional-studio";
import { MotivationalQuotesWidget } from "@/components/dashboard/motivational-quotes";
import { RecognitionCertificates } from "@/components/dashboard/recognition-certificates";
import { DownlineCollector } from "@/components/dashboard/downline-collector";
import { PackagePaymentManager } from "@/components/dashboard/package-payment-manager";
import { TrainingManagementStudio } from "@/components/dashboard/training-management-studio";
import { CmsBlogStudio } from "@/components/dashboard/cms-blog-studio";
import { TeamFacultyStudio } from "@/components/dashboard/team-faculty-studio";
import { SettingsStudio } from "@/components/dashboard/settings-studio";
import { ProfileManagementModule } from "@/components/dashboard/profile-management-module";
import { OnboardingProspectStudio } from "@/components/dashboard/onboarding-prospect-studio";
import { AiAssistantModal } from "@/components/dashboard/ai-assistant";
import { NotificationBell } from "@/components/dashboard/notification-bell";
import { CommandPalette } from "@/components/dashboard/command-palette";
import { FloatingActionButton } from "@/components/dashboard/floating-action-button";
import { WelcomeBanner } from "@/components/dashboard/welcome-banner";
import { EarningsCalculator } from "@/components/dashboard/earnings-calculator";
import { OnboardingChecklist } from "@/components/dashboard/onboarding-checklist";
import { MobileSidebar } from "@/components/dashboard/mobile-sidebar";
import { MobileBottomNav } from "@/components/dashboard/mobile-bottom-nav";
import { ShareInviteModal } from "@/components/dashboard/share-invite-modal";
import { getDictionary, getNavLabel, getBadgeLabel, Locale } from "@/lib/i18n";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import {
  canRoleAccessWorkspace,
  canRoleAccessView,
  roleToRoleSlugMap,
  SystemRole
} from "@/lib/rbac";

export type DashboardView =
  | "dashboard"
  | "recruitment"
  | "after-sales"
  | "daily-activity"
  | "name-list"
  | "training-hub"
  | "dream-goal-board"
  | "goal-analyzer"
  | "downline"
  | "promo-studio"
  | "certificates"
  | "motivational-quotes"
  | "packages-payments"
  | "training-studio"
  | "reports"
  | "settings"
  | "activity"
  | "cms-studio"
  | "team-faculty"
  | "profile"
  | "onboarding-studio";

const superAdminNavigation: {
  id: DashboardView;
  label: string;
  icon: typeof LayoutDashboard;
  badge?: string;
}[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "recruitment", label: "Recruitment", icon: UserCheck, badge: "Pipeline" },
  { id: "after-sales", label: "Getting Started Form", icon: ClipboardCheck, badge: "Breakthrough" },
  { id: "daily-activity", label: "Daily Activity & KPI", icon: Activity, badge: "DMO" },
  { id: "name-list", label: "Name List Organizer", icon: UsersRound, badge: "Capital-IBO" },
  { id: "training-hub", label: "Training Academy", icon: GraduationCap, badge: "Eric Pro" },
  { id: "dream-goal-board", label: "Dream & Goal Board", icon: Compass, badge: "Vision" },
  { id: "goal-analyzer", label: "Data Analyzer (Goals)", icon: Target, badge: "New" },
  { id: "downline", label: "Downline Collector", icon: Network, badge: "L1-L3" },
  { id: "promo-studio", label: "Promotional Photo", icon: ImageIcon, badge: "Flyers" },
  { id: "packages-payments", label: "Packages & Approvals", icon: CreditCard, badge: "Verify" },
  { id: "training-studio", label: "Training Studio (CRUD)", icon: GraduationCap, badge: "Faculty" },
  { id: "team-faculty", label: "Team & Trainers (CRUD)", icon: UserCheck, badge: "Access" },
  { id: "cms-studio", label: "CMS & Blog Studio", icon: Globe, badge: "Live" },
  { id: "onboarding-studio", label: "Booklet & Funnel Studio (CRUD)", icon: Sliders, badge: "Master CRUD" },
  { id: "certificates", label: "Certificates", icon: Award },
  { id: "motivational-quotes", label: "Daily Motivation", icon: Quote },
  { id: "reports", label: "Reports", icon: FileBarChart },
  { id: "settings", label: "Settings", icon: Settings },
  { id: "profile", label: "Profile & Avatars", icon: UserRound, badge: "ID" },
  { id: "activity", label: "Activity Logs", icon: Activity }
];

const genericNavigation = [
  { id: "dashboard", label: "Overview", icon: LayoutDashboard },
  { id: "recruitment", label: "Recruitment", icon: UserCheck, badge: "Pipeline" },
  { id: "after-sales", label: "Getting Started Form", icon: ClipboardCheck, badge: "Breakthrough" },
  { id: "daily-activity", label: "Daily Activity & KPI", icon: Activity, badge: "DMO" },
  { id: "name-list", label: "Name List Organizer", icon: UsersRound, badge: "Capital-IBO" },
  { id: "training-hub", label: "Training Academy", icon: GraduationCap, badge: "Eric Pro" },
  { id: "dream-goal-board", label: "Dream & Goal Board", icon: Compass, badge: "Vision" },
  { id: "goal-analyzer", label: "Data Analyzer (Goals)", icon: Target, badge: "New" },
  { id: "downline", label: "Downline Collector", icon: Network, badge: "L1-L3" },
  { id: "promo-studio", label: "Promotional Photo", icon: ImageIcon, badge: "Flyers" },
  { id: "certificates", label: "Certificates", icon: Award },
  { id: "motivational-quotes", label: "Daily Motivation", icon: Quote },
  { id: "reports", label: "Team Reports", icon: FileBarChart },
  { id: "onboarding-studio", label: "Booklet & Funnel Studio (CRUD)", icon: Sliders, badge: "Master CRUD" },
  { id: "settings", label: "Settings", icon: Settings },
  { id: "profile", label: "Profile & Avatars", icon: UserRound, badge: "ID" }
];

const superAdminWidgets = [
  { label: "Total Members", value: "12,458", change: "+12.5%", icon: UsersRound, tone: "emerald" },
  { label: "Active Members", value: "8,642", change: "+8.2%", icon: UserRound, tone: "cyan" },
  { label: "Total Teams", value: "1,256", change: "+10.3%", icon: Network, tone: "blue" },
  { label: "Active Courses", value: "128", change: "+18.4%", icon: GraduationCap, tone: "indigo" },
  { label: "Leads", value: "3,256", change: "+11.3%", icon: LineChart, tone: "green" },
  { label: "Revenue", value: "ETB 2.45M", change: "+15.7%", icon: CircleDollarSign, tone: "navy" }
];

const growthAnalytics = [
  { month: "Jan", members: 44, active: 30 },
  { month: "Feb", members: 51, active: 36 },
  { month: "Mar", members: 58, active: 42 },
  { month: "Apr", members: 66, active: 50 },
  { month: "May", members: 78, active: 61 },
  { month: "Jun", members: 92, active: 73 }
];

const recruitmentAnalytics = [
  { stage: "Invited", value: 92 },
  { stage: "Leads", value: 74 },
  { stage: "Follow-up", value: 58 },
  { stage: "Converted", value: 41 }
];

const subscriptionSegments = [
  ["Active", "8,642", "58%", "bg-brand-green"],
  ["Pending", "1,019", "12%", "bg-brand-cyan"],
  ["Expired", "1,524", "20%", "bg-indigo-500"],
  ["Cancelled", "671", "10%", "bg-amber-500"]
];

const reports = [
  ["Membership Report", "Members, status, rank, team assignment", "Ready", "Today"],
  ["Recruitment Report", "Referral links, leads, conversion rates", "Ready", "Today"],
  ["LMS Report", "Courses, lessons, quizzes, completions", "Scheduled", "Weekly"],
  ["Subscription Report", "Revenue, renewals, payment verification", "Ready", "Today"],
  ["Team Performance", "Team growth, active members, leadership rank", "Draft", "Monthly"]
];

const activityLogs = [
  ["New member registered", "Mulgeta Desta joined Vision Leaders", "Authentication", "2 min ago", "success"],
  ["Payment verified", "Admin approved Silver membership renewal", "Subscription", "18 min ago", "success"],
  ["Role changed", "Alebe Kebede promoted to Team Leader", "RBAC", "1 hr ago", "warning"],
  ["Course published", "Leadership Fundamentals is now live", "LMS", "3 hrs ago", "success"],
  ["Failed login attempt", "Unknown login attempt blocked", "Security", "4 hrs ago", "danger"],
  ["Announcement sent", "Monthly growth sprint published", "Communication", "Yesterday", "success"]
];

const settingsGroups = [
  {
    title: "Security",
    copy: "Control authentication, role permissions, and sensitive workflows.",
    options: ["Require email verification", "Enable audit logging", "Lock account after failed attempts"]
  },
  {
    title: "Membership",
    copy: "Configure subscriptions, manual payment reviews, and renewal reminders.",
    options: ["Manual payment verification", "Renewal reminders", "Expire access automatically"]
  },
  {
    title: "Platform",
    copy: "Manage localization, public content, reporting cadence, and notifications.",
    options: ["English and Amharic content", "Weekly executive reports", "System notifications"]
  }
];

function MetricCard({
  label,
  value,
  change,
  icon: Icon,
  tone
}: {
  label: string;
  value: string;
  change: string;
  icon: typeof UsersRound;
  tone: string;
}) {
  const toneClass: Record<string, string> = {
    emerald: "bg-emerald-50 text-emerald-700",
    cyan: "bg-cyan-50 text-cyan-700",
    blue: "bg-sky-50 text-sky-700",
    indigo: "bg-indigo-50 text-indigo-700",
    green: "bg-teal-50 text-teal-700",
    navy: "bg-slate-100 text-brand-navy"
  };

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-500">{label}</p>
          <p className="mt-3 text-2xl font-black text-brand-navy">{value}</p>
        </div>
        <span className={cn("inline-flex h-11 w-11 items-center justify-center rounded-lg", toneClass[tone])}>
          <Icon className="h-5 w-5" />
        </span>
      </div>
      <div className="mt-4 flex items-center gap-2 text-xs font-bold text-emerald-700">
        <TrendingUp className="h-3.5 w-3.5" />
        {change} from last month
      </div>
    </Card>
  );
}

function GrowthChart() {
  return (
    <Card className="p-5 xl:col-span-2">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-black text-brand-navy">Growth Analytics</h2>
          <p className="text-sm text-slate-500">Total members compared with active members</p>
        </div>
        <div className="flex gap-3 text-xs font-bold">
          <span className="flex items-center gap-1.5 text-brand-blue"><span className="h-2.5 w-2.5 rounded-full bg-brand-blue" /> Members</span>
          <span className="flex items-center gap-1.5 text-emerald-700"><span className="h-2.5 w-2.5 rounded-full bg-brand-green" /> Active</span>
        </div>
      </div>
      <div className="grid h-72 grid-cols-6 items-end gap-3 border-b border-l border-slate-200 px-3 pt-4">
        {growthAnalytics.map((item) => (
          <div key={item.month} className="flex h-full flex-col justify-end gap-2">
            <div className="flex flex-1 items-end gap-1.5">
              <div className="w-full rounded-t-md bg-brand-blue" style={{ height: `${item.members}%` }} />
              <div className="w-full rounded-t-md bg-brand-green" style={{ height: `${item.active}%` }} />
            </div>
            <p className="pb-2 text-center text-xs font-bold text-slate-500">{item.month}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}

function RecruitmentChart() {
  return (
    <Card className="p-5">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h2 className="font-black text-brand-navy">Recruitment Analytics</h2>
          <p className="text-sm text-slate-500">Lead pipeline conversion</p>
        </div>
        <Network className="h-5 w-5 text-brand-cyan" />
      </div>
      <div className="space-y-5">
        {recruitmentAnalytics.map((item) => (
          <div key={item.stage}>
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="font-bold text-slate-700">{item.stage}</span>
              <span className="font-black text-brand-navy">{item.value}%</span>
            </div>
            <div className="h-3 rounded-full bg-slate-100">
              <div className="h-3 rounded-full brand-gradient" style={{ width: `${item.value}%` }} />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function SubscriptionChart() {
  return (
    <Card className="p-5">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h2 className="font-black text-brand-navy">Subscription Analytics</h2>
          <p className="text-sm text-slate-500">Membership access status</p>
        </div>
        <PieChart className="h-5 w-5 text-brand-cyan" />
      </div>
      <div className="grid gap-6 sm:grid-cols-[150px_1fr] sm:items-center">
        <div className="mx-auto h-36 w-36 rounded-full p-4 [background:conic-gradient(#10E7B2_0_58%,#16D4FF_58%_70%,#6366f1_70%_90%,#f59e0b_90%_100%)]">
          <div className="flex h-full w-full items-center justify-center rounded-full bg-white text-center">
            <div>
              <p className="text-2xl font-black text-brand-navy">82%</p>
              <p className="text-xs font-bold text-slate-500">healthy</p>
            </div>
          </div>
        </div>
        <div className="space-y-3 text-sm">
          {subscriptionSegments.map(([label, value, percent, color]) => (
            <div key={label} className="flex items-center justify-between gap-3">
              <span className="flex min-w-0 items-center gap-2 font-semibold text-slate-700">
                <span className={cn("h-2.5 w-2.5 shrink-0 rounded-full", color)} />
                {label}
              </span>
              <span className="font-black text-brand-navy">{value} <span className="text-xs text-slate-400">({percent})</span></span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

function SuperAdminDashboard({ onOpenAi }: { onOpenAi?: (prompt: string) => void }) {
  return (
    <div className="space-y-6">
      {/* Daily Motivational Quotes Top Banner */}
      <MotivationalQuotesWidget onOpenAi={onOpenAi} isSuperAdmin={true} />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        {superAdminWidgets.map((widget) => (
          <MetricCard key={widget.label} {...widget} />
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-3">
        <GrowthChart />
        <RecruitmentChart />
      </div>

      <div className="grid gap-5 xl:grid-cols-[0.92fr_1.08fr]">
        <SubscriptionChart />
        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="font-black text-brand-navy">Executive Work Queue</h2>
              <p className="text-sm text-slate-500">Priority operational items for platform oversight</p>
            </div>
            <Sparkles className="h-5 w-5 text-brand-cyan" />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[620px] text-left text-sm">
              <thead className="text-xs uppercase text-slate-500">
                <tr>
                  <th className="py-3">Workflow</th>
                  <th>Owner</th>
                  <th>Status</th>
                  <th>Due</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  ["Manual payment verification", "Finance Admin", "Reviewing", "Today"],
                  ["Leadership cohort publishing", "Trainer", "Ready", "Jun 18"],
                  ["Referral campaign audit", "Admin", "In progress", "Jun 20"],
                  ["RBAC policy review", "Super Admin", "Scheduled", "Jun 24"]
                ].map(([workflow, owner, status, due]) => (
                  <tr key={workflow}>
                    <td className="py-4 font-bold text-slate-800">{workflow}</td>
                    <td className="text-slate-600">{owner}</td>
                    <td><span className="rounded-full bg-cyan-50 px-2 py-1 text-xs font-black text-cyan-700">{status}</span></td>
                    <td className="font-black text-brand-navy">{due}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}

function ReportsView() {
  const [reportType, setReportType] = useState("All");
  const filteredReports = useMemo(
    () => reports.filter(([name]) => reportType === "All" || name.includes(reportType)),
    [reportType]
  );

  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-4">
        {[
          ["Members", "12,458", UsersRound],
          ["Conversions", "1,856", TrendingUp],
          ["Completions", "4,284", BookOpen],
          ["Revenue", "ETB 2.45M", WalletCards]
        ].map(([label, value, Icon]) => (
          <Card key={label as string} className="p-5">
            <Icon className="h-5 w-5 text-brand-blue" />
            <p className="mt-4 text-sm font-semibold text-slate-500">{label as string}</p>
            <p className="mt-2 text-2xl font-black text-brand-navy">{value as string}</p>
          </Card>
        ))}
      </div>

      <Card id="reports-center-printable" className="p-5">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-black text-brand-navy">Reports Center</h2>
            <p className="text-sm text-slate-500">Generate, filter, and export operational reports</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => printSection("reports-center-printable", "MyUpline Global — Operational Reports Center")}
              className="border border-slate-200 text-xs font-bold"
            >
              <Printer className="mr-1.5 h-3.5 w-3.5" />
              Print Catalog
            </Button>
            {["All", "Membership", "Recruitment", "LMS", "Subscription", "Team"].map((item) => (
              <button
                key={item}
                onClick={() => setReportType(item)}
                className={cn(
                  "rounded-lg px-3 py-2 text-xs font-black transition",
                  reportType === item ? "brand-gradient text-brand-navy" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                )}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="text-xs uppercase text-slate-500">
              <tr>
                <th className="py-3">Report</th>
                <th>Description</th>
                <th>Status</th>
                <th>Cadence</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredReports.map(([name, description, status, cadence]) => (
                <tr key={name}>
                  <td className="py-4 font-black text-brand-navy">{name}</td>
                  <td className="text-slate-600">{description}</td>
                  <td><span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-black text-emerald-700">{status}</span></td>
                  <td className="font-semibold text-slate-700">{cadence}</td>
                  <td className="text-right">
                    <button
                      onClick={() => {
                        const rows = [
                          { "Report Name": name, "Description": description, "Status": status, "Cadence": cadence, "Date Generated": new Date().toISOString() },
                          { "Report Metric 1": "Active Volume", "Value": "ETB 2,450,000", "Cadence Period": cadence },
                          { "Report Metric 2": "Validated Records", "Value": "1,856 IBOs", "Cadence Period": cadence },
                          { "Report Metric 3": "Duplication Retention Rate", "Value": "89.4%", "Cadence Period": cadence },
                        ];
                        exportToCsv(`MyUpline_${name.replace(/[^a-zA-Z0-9]/g, "_")}`, rows);
                      }}
                      className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-black text-brand-blue hover:bg-slate-50 transition"
                    >
                      <Download className="h-3.5 w-3.5" />
                      Export CSV
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function SettingsView() {
  const [enabled, setEnabled] = useState<Record<string, boolean>>({
    "Require email verification": true,
    "Enable audit logging": true,
    "Lock account after failed attempts": true,
    "Manual payment verification": true,
    "Renewal reminders": true,
    "Expire access automatically": true,
    "English and Amharic content": true,
    "Weekly executive reports": false,
    "System notifications": true
  });

  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
      <div className="space-y-5">
        {settingsGroups.map((group) => (
          <Card key={group.title} className="p-5">
            <div className="mb-5">
              <h2 className="font-black text-brand-navy">{group.title}</h2>
              <p className="text-sm leading-6 text-slate-500">{group.copy}</p>
            </div>
            <div className="space-y-3">
              {group.options.map((option) => (
                <div key={option} className="flex items-center justify-between gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <div>
                    <p className="text-sm font-black text-slate-800">{option}</p>
                    <p className="text-xs text-slate-500">Applies organization-wide</p>
                  </div>
                  <button
                    onClick={() => setEnabled((current) => ({ ...current, [option]: !current[option] }))}
                    className={cn(
                      "relative h-7 w-12 rounded-full transition",
                      enabled[option] ? "bg-brand-green" : "bg-slate-300"
                    )}
                    aria-pressed={enabled[option]}
                    aria-label={option}
                  >
                    <span
                      className={cn(
                        "absolute top-1 h-5 w-5 rounded-full bg-white shadow transition",
                        enabled[option] ? "left-6" : "left-1"
                      )}
                    />
                  </button>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
      <Card className="h-fit p-5">
        <LockKeyhole className="h-8 w-8 text-brand-blue" />
        <h2 className="mt-4 font-black text-brand-navy">RBAC Summary</h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Super Admin controls platform settings, reports, system security, activity logs, user roles, and organization-level access.
        </p>
        <div className="mt-5 space-y-3">
          {["Super Admin", "Admin", "Team Leader", "Trainer", "Member"].map((role, index) => (
            <div key={role} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm">
              <span className="font-bold text-slate-700">{role}</span>
              <span className="font-black text-brand-navy">{index === 0 ? "Full" : "Scoped"}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function ActivityLogsView() {
  const [query, setQuery] = useState("");
  const filtered = activityLogs.filter((log) =>
    log.join(" ").toLowerCase().includes(query.toLowerCase())
  );

  return (
    <Card className="p-5">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-black text-brand-navy">Activity Logs</h2>
          <p className="text-sm text-slate-500">Security, membership, LMS, and system events</p>
        </div>
        <div className="relative w-full sm:w-80">
          <Filter className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Filter logs..."
            className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm outline-none focus:border-brand-cyan"
          />
        </div>
      </div>
      <div className="space-y-3">
        {filtered.map(([title, description, module, time, status]) => (
          <div key={`${title}-${time}`} className="flex flex-col gap-3 rounded-lg border border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-3">
              <span
                className={cn(
                  "mt-1 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                  status === "success" && "bg-emerald-50 text-emerald-700",
                  status === "warning" && "bg-amber-50 text-amber-700",
                  status === "danger" && "bg-red-50 text-red-700"
                )}
              >
                {status === "danger" ? <AlertTriangle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
              </span>
              <div>
                <p className="font-black text-slate-800">{title}</p>
                <p className="mt-1 text-sm text-slate-500">{description}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-xs font-bold text-slate-500 sm:text-right">
              <span className="rounded-full bg-slate-100 px-2 py-1">{module}</span>
              <span>{time}</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ── Centralized Secure Logout Helper ──
// Prevents back-button access by clearing storage, expiring session cookie, rewriting history, and hard-navigating.
export async function performSecureLogout(locale: string = "en") {
  if (typeof window === "undefined") return;

  try {
    // 1. Invalidate HttpOnly cookie and server session
    await fetch("/api/auth/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    console.error("Logout request failed:", err);
  }

  // 2. Clear all client storage & mark session as closed
  try {
    window.localStorage.removeItem("myupline.accessToken");
    window.localStorage.removeItem("myupline.user");
    window.sessionStorage.clear();
    window.sessionStorage.setItem("myupline_logged_out", "true");
  } catch {}

  // 3. Rewrite current history entry so Back button cannot return here
  const targetUrl = `/${locale}/auth/sign-in`;
  try {
    window.history.replaceState(null, "", targetUrl);
  } catch {}

  // 4. Force hard reload to wipe React state, in-memory caches, and client state
  window.location.replace(targetUrl);
}

function SuperAdminWorkspace({
  locale,
  currentUser,
  userRole = "SUPER_ADMIN"
}: {
  locale: string;
  currentUser?: any;
  userRole?: SystemRole;
}) {
  const router = useRouter();
  const [currentLocale, setCurrentLocale] = useState<Locale>(locale === "am" ? "am" : "en");
  const dict = getDictionary(currentLocale);
  const [view, setView] = useState<DashboardView>("dashboard");
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [isCmdPaletteOpen, setIsCmdPaletteOpen] = useState(false);
  const [isEarningsOpen, setIsEarningsOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  const handleLogout = async () => {
    await performSecureLogout(currentLocale);
  };

  const handleToggleLocale = () => {
    const next: Locale = currentLocale === "en" ? "am" : "en";
    setCurrentLocale(next);
    router.push(`/${next}/dashboard/${roleToRoleSlugMap[userRole] || "super-admin"}`);
  };

  const allowedNavigation = useMemo(() => {
    return superAdminNavigation.filter((item) => canRoleAccessView(userRole, item.id));
  }, [userRole]);

  const handleOpenAi = (prompt?: string) => {
    setAiPrompt(prompt || "");
    setIsAiOpen(true);
  };

  const activeLabel = getNavLabel(currentLocale, view);

  // Global Ctrl+K / Cmd+K Command Palette shortcut
  useEffect(() => {
    function onCtrlK(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsCmdPaletteOpen((prev) => !prev);
      }
    }
    document.addEventListener("keydown", onCtrlK);
    return () => document.removeEventListener("keydown", onCtrlK);
  }, []);

  return (
    <main className="min-h-screen bg-[#f5f8fb] text-slate-900">
      {/* Mobile Slide-in Sidebar */}
      <MobileSidebar
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
        currentLocale={currentLocale}
        view={view}
        onNavigate={(v) => setView(v)}
        navigation={allowedNavigation}
        onLogout={handleLogout}
        isSuperAdmin={true}
        currentUser={currentUser}
        roleLabel={userRole.replace(/_/g, " ")}
      />

      <div className="grid min-h-screen lg:grid-cols-[272px_1fr]">
        {/* Desktop Sidebar */}
        <aside className="hidden bg-brand-navy px-4 py-5 text-white lg:flex lg:flex-col no-print">
          <Link href={`/${currentLocale}`}>
            <BrandLogo className="mb-8" />
          </Link>
          <nav className="flex-1 space-y-1 overflow-y-auto">
            {allowedNavigation.map((item) => (
              <button
                key={item.id}
                onClick={() => setView(item.id)}
                className={cn(
                  "flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm font-semibold transition hover:bg-white/10 hover:text-white",
                  view === item.id ? "brand-gradient text-brand-navy font-black hover:text-brand-navy" : "text-white/72"
                )}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="h-4 w-4" />
                  {getNavLabel(currentLocale, item.id)}
                </div>
                {item.badge && (
                  <span className={cn(
                    "rounded px-1.5 py-0.5 text-[10px] font-bold",
                    view === item.id ? "bg-brand-navy/20 text-brand-navy" : "bg-white/15 text-brand-cyan"
                  )}>
                    {getBadgeLabel(currentLocale, item.badge)}
                  </span>
                )}
              </button>
            ))}
          </nav>
          <div className="mt-8 rounded-lg border border-white/12 bg-white/8 p-4">
            <ShieldCheck className="h-6 w-6 text-brand-green" />
            <p className="mt-3 text-sm font-black">Super Admin Control</p>
            <p className="mt-2 text-xs leading-5 text-white/60">Full platform visibility across members, downlines, flyers, targets, and logs.</p>
          </div>
          <div className="mt-6 border-t border-white/10 pt-4">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-semibold text-rose-300 transition hover:bg-red-500/15 hover:text-rose-200"
            >
              <LogOut className="h-4 w-4 text-rose-400" />
              Log Out
            </button>
          </div>
        </aside>

        <section className="flex min-w-0 flex-col">
          {/* ── Sticky Header ── */}
          <header className="sticky top-0 z-20 flex h-14 items-center gap-2 border-b border-slate-200 bg-white/95 px-3 backdrop-blur sm:h-16 sm:gap-3 sm:px-4 lg:px-7 no-print">
            {/* Mobile hamburger */}
            <button
              id="mobile-menu-btn"
              onClick={() => setIsMobileSidebarOpen(true)}
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white lg:hidden"
              aria-label="Open navigation menu"
            >
              <Menu className="h-4 w-4" />
            </button>

            {/* Search — hidden on smallest screens, shown from sm */}
            <div className="relative hidden flex-1 sm:block">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                aria-label="Search — press Ctrl+K"
                placeholder="Search or Ctrl+K..."
                readOnly
                onClick={() => setIsCmdPaletteOpen(true)}
                className="h-10 w-full cursor-pointer rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-16 text-sm outline-none focus:border-brand-cyan"
              />
              <kbd className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-mono font-bold text-slate-400">
                ⌘K
              </kbd>
            </div>

            {/* Mobile: page title when search hidden */}
            <p className="flex-1 truncate text-sm font-black text-brand-navy sm:hidden">{activeLabel}</p>

            {/* Mobile search icon */}
            <button
              onClick={() => setIsCmdPaletteOpen(true)}
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white sm:hidden"
              aria-label="Search"
            >
              <Search className="h-4 w-4 text-slate-500" />
            </button>

            {/* Language switcher — hidden on very small, shown sm+ */}
            <div className="hidden items-center rounded-xl bg-slate-100 p-1 border border-slate-200 sm:flex">
              <button
                type="button"
                onClick={handleToggleLocale}
                className="flex items-center gap-1 rounded-lg bg-white px-2 py-1 text-xs font-black text-brand-navy shadow-sm transition hover:bg-slate-50"
                title={currentLocale === "en" ? "Switch to አማርኛ" : "Switch to English"}
              >
                <span>{currentLocale === "en" ? "🇬🇧" : "🇪🇹"}</span>
                <span className="hidden md:inline">{currentLocale === "en" ? "EN" : "አማ"}</span>
              </button>
            </div>

            {/* Invite & QR button */}
            <button
              onClick={() => setIsShareOpen(true)}
              className="hidden items-center gap-1.5 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-3 py-1.5 text-xs font-bold text-cyan-800 transition hover:bg-cyan-500/20 sm:inline-flex"
              title="Share Referral & QR Code"
            >
              <Share2 className="h-3.5 w-3.5 text-cyan-600" />
              <span className="hidden lg:inline">Invite & QR</span>
              <span className="lg:hidden">Invite</span>
            </button>

            <ThemeToggle />

            {/* AI button */}
            <button
              onClick={() => handleOpenAi("Provide an executive diagnostic of our network growth, goals, and downline health.")}
              className="hidden items-center gap-1.5 rounded-lg border border-brand-cyan/40 bg-brand-cyan/10 px-3 py-1.5 text-xs font-bold text-brand-navy transition hover:bg-brand-cyan/20 sm:inline-flex"
            >
              <Sparkles className="h-3.5 w-3.5 text-brand-blue" />
              <span className="hidden lg:inline">{dict.header.aiStrategist}</span>
              <span className="lg:hidden">AI</span>
            </button>

            <NotificationBell />

            {/* Avatar — visible from md */}
            <div
              onClick={() => setView("profile")}
              className="hidden items-center gap-2 rounded-lg border border-slate-200 px-2.5 py-1.5 md:flex cursor-pointer hover:bg-slate-50 transition"
              title="Profile"
            >
              <div className="h-7 w-7 rounded-full brand-gradient flex items-center justify-center font-bold text-brand-navy text-xs">
                {currentUser?.name ? currentUser.name.charAt(0) : "SA"}
              </div>
              <div className="hidden lg:block">
                <p className="text-xs font-bold leading-tight">{currentUser?.name || "Super Admin"}</p>
                <p className="text-[10px] text-slate-500">{userRole.replace(/_/g, " ")}</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-red-200 bg-red-50/90 px-2.5 text-xs font-bold text-red-700 transition hover:bg-red-100"
              title="Sign Out"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Log Out</span>
            </button>
          </header>

          <div id="main-view-content" className="printable-content flex-1 overflow-auto px-3 py-4 sm:px-4 sm:py-6 lg:px-7 pb-24 lg:pb-8">
            {/* Print-Only Official Document Header */}
            <div className="print-only mb-6 border-b-2 border-slate-900 pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-black tracking-tight text-slate-900">MYUPLINE GLOBAL</h1>
                  <p className="text-xs font-semibold text-slate-600">Executive Network Management Platform</p>
                </div>
                <div className="text-right text-xs text-slate-600">
                  <p className="font-black text-sm text-slate-900">{activeLabel}</p>
                  <p>Printed: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })} at {new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}</p>
                  <p>Role: {userRole.replace(/_/g, " ")} | Operator: {currentUser?.name || "Super Admin"}</p>
                </div>
              </div>
            </div>

            {/* Page title + actions row */}
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3 no-print">
              <div>
                <p className="text-xs text-slate-500">{dict.header.welcomeSuperAdmin}</p>
                <h1 className="mt-0.5 text-xl font-black text-brand-navy sm:text-2xl">{activeLabel}</h1>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="ghost" onClick={() => handleOpenAi("Give me our 3 highest priority goals for this week.")} className="border border-slate-200 bg-white text-xs font-bold">
                  <Sparkles className="mr-1.5 h-3.5 w-3.5 text-brand-blue" />
                  <span className="hidden xs:inline">AI Priorities</span>
                  <span className="xs:hidden">AI</span>
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    const sectionMap: Record<string, string> = {
                      "reports": "reports-center-printable",
                      "downline": "downline-table-printable",
                      "name-list": "printable-name-list-area",
                      "recruitment": "recruitment-pipeline-table",
                      "certificates": "certificate-print-area",
                      "team-faculty": "trainers-printable-area",
                      "packages-payments": "payments-printable-section",
                      "motivational-quotes": "motivation-manager-printable",
                      "goal-analyzer": "goal-analyzer-printable",
                      "after-sales": "onboarding-upline-dossier",
                      "training-hub": "training-cert-print-card",
                      "dream-goal-board": "dream-vision-board-printable",
                      "promo-studio": "promotional-flyer-print-card",
                    };
                    const targetId = sectionMap[view] || "main-view-content";
                    printSection(targetId, `${activeLabel} — MyUpline Official Report`);
                  }}
                  className="border border-slate-200 bg-white text-xs font-bold"
                >
                  <Printer className="mr-1.5 h-4 w-4 text-slate-600" />
                  Print
                </Button>
                <Button
                  onClick={() => {
                    exportToCsv(`MyUpline_${view}_Report`, [
                      { "Section": activeLabel, "Role": userRole, "Exported Date": new Date().toLocaleString(), "Platform": "MyUpline Global" }
                    ]);
                  }}
                  className="text-xs font-bold"
                >
                  <Download className="mr-1.5 h-4 w-4" />
                  <span className="hidden sm:inline">Export</span>
                </Button>
              </div>
            </div>

            {/* Mobile bottom-tab strip */}
            <div className="mb-4 flex gap-1.5 overflow-x-auto pb-1 scrollbar-none lg:hidden no-print">
              {allowedNavigation.slice(0, 10).map((item) => (
                <button
                  key={item.id}
                  onClick={() => setView(item.id)}
                  className={cn(
                    "shrink-0 rounded-xl px-3 py-2 text-[11px] font-black transition whitespace-nowrap",
                    view === item.id ? "brand-gradient text-brand-navy" : "bg-white text-slate-600 border border-slate-200"
                  )}
                >
                  {item.label}
                </button>
              ))}
              <button
                onClick={() => setIsMobileSidebarOpen(true)}
                className="shrink-0 rounded-xl border border-slate-200 bg-white px-3 py-2 text-[11px] font-black text-slate-500 transition whitespace-nowrap hover:border-slate-300"
              >
                More ›
              </button>
            </div>

            {view === "dashboard" ? (
              <div className="space-y-6">
                <WelcomeBanner
                  userName={currentUser?.name}
                  userRole={userRole}
                  onOpenCalculator={() => setIsEarningsOpen(true)}
                  onOpenAi={handleOpenAi}
                  onOpenShare={() => setIsShareOpen(true)}
                />
                <SuperAdminDashboard onOpenAi={handleOpenAi} />
              </div>
            ) : null}
            {view === "recruitment" ? <RecruitmentPipeline onOpenAi={handleOpenAi} /> : null}
            {view === "after-sales" ? <AfterSalesOnboarding onOpenAi={handleOpenAi} /> : null}
            {view === "daily-activity" ? <DailyActivityTracker onOpenAi={handleOpenAi} /> : null}
            {view === "name-list" ? <NameListOrganizer onOpenAi={handleOpenAi} /> : null}
            {view === "training-hub" ? <TrainingHub onOpenAi={handleOpenAi} /> : null}
            {view === "dream-goal-board" ? <DreamGoalBoard onOpenAi={handleOpenAi} /> : null}
            {view === "goal-analyzer" ? <GoalAnalyzer onOpenAi={handleOpenAi} /> : null}
            {view === "downline" ? <DownlineCollector onOpenAi={handleOpenAi} /> : null}
            {view === "promo-studio" ? <PromotionalStudio onOpenAi={handleOpenAi} /> : null}
            {view === "certificates" ? <RecognitionCertificates onOpenAi={handleOpenAi} /> : null}
            {view === "motivational-quotes" ? <MotivationalQuotesWidget onOpenAi={handleOpenAi} isSuperAdmin={true} fullStudio={true} /> : null}
            {view === "packages-payments" ? <PackagePaymentManager onOpenAi={handleOpenAi} /> : null}
            {view === "training-studio" ? <TrainingManagementStudio onOpenAi={handleOpenAi} /> : null}
            {view === "team-faculty" ? <TeamFacultyStudio onOpenAi={handleOpenAi} /> : null}
            {view === "cms-studio" ? <CmsBlogStudio /> : null}
            {view === "onboarding-studio" ? <OnboardingProspectStudio onOpenAi={handleOpenAi} /> : null}
            {view === "reports" ? <ReportsView /> : null}
            {view === "settings" ? <SettingsStudio locale={currentLocale} currentUser={currentUser} onLanguageChange={(l) => { setCurrentLocale(l); router.push(`/${l}/dashboard/super-admin`); }} /> : null}
            {view === "profile" ? <ProfileManagementModule locale={currentLocale} currentUser={currentUser} userRole={userRole} onOpenAi={handleOpenAi} /> : null}
            {view === "activity" ? <ActivityLogsView /> : null}
          </div>
        </section>
      </div>

      <FloatingActionButton
        onNavigate={(v) => setView(v as DashboardView)}
        onOpenAi={() => handleOpenAi("Provide an executive diagnostic of our network growth, goals, and downline health.")}
        onOpenShare={() => setIsShareOpen(true)}
      />

      <MobileBottomNav
        currentView={view}
        onNavigate={(v) => setView(v)}
        onOpenSidebar={() => setIsMobileSidebarOpen(true)}
        onOpenShare={() => setIsShareOpen(true)}
        isSuperAdmin={true}
      />

      <ShareInviteModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        referralCode={currentUser?.referralCode || "SUPER-ADMIN"}
        userName={currentUser?.name || "Super Admin"}
        userRole={userRole}
        locale={currentLocale}
      />

      <CommandPalette
        isOpen={isCmdPaletteOpen}
        onClose={() => setIsCmdPaletteOpen(false)}
        onNavigate={(v) => { setView(v as DashboardView); setIsCmdPaletteOpen(false); }}
      />

      <EarningsCalculator
        isOpen={isEarningsOpen}
        onClose={() => setIsEarningsOpen(false)}
      />

      <AiAssistantModal
        isOpen={isAiOpen}
        onClose={() => setIsAiOpen(false)}
        initialPrompt={aiPrompt}
      />
    </main>
  );
}

function GenericDashboard({
  locale,
  roleSlug,
  currentUser,
  userRole = "MEMBER"
}: {
  locale: string;
  roleSlug: string;
  currentUser?: any;
  userRole?: SystemRole;
}) {
  const role = roles.find((item) => item.slug === roleSlug) ?? roles[0];
  const router = useRouter();
  const [currentLocale, setCurrentLocale] = useState<Locale>(locale === "am" ? "am" : "en");
  const dict = getDictionary(currentLocale);
  const [view, setView] = useState<DashboardView>("dashboard");
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [isCmdPaletteOpen, setIsCmdPaletteOpen] = useState(false);
  const [isEarningsOpen, setIsEarningsOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  const handleLogout = async () => {
    await performSecureLogout(currentLocale);
  };

  const handleToggleLocale = () => {
    const next: Locale = currentLocale === "en" ? "am" : "en";
    setCurrentLocale(next);
    router.push(`/${next}/dashboard/${roleSlug}`);
  };

  const allowedNavigation = useMemo(() => {
    return genericNavigation.filter((item) => canRoleAccessView(userRole, item.id as DashboardView));
  }, [userRole]);

  const handleOpenAi = (prompt?: string) => {
    setAiPrompt(prompt || "");
    setIsAiOpen(true);
  };

  const activeLabel = getNavLabel(currentLocale, view);

  // Global Ctrl+K / Cmd+K Command Palette shortcut
  useEffect(() => {
    function onCtrlK(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsCmdPaletteOpen((prev) => !prev);
      }
    }
    document.addEventListener("keydown", onCtrlK);
    return () => document.removeEventListener("keydown", onCtrlK);
  }, []);

  return (
    <main className="min-h-screen bg-[#f5f8fb] text-slate-900">
      {/* Mobile Slide-in Sidebar */}
      <MobileSidebar
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
        currentLocale={currentLocale}
        view={view}
        onNavigate={(v) => setView(v as DashboardView)}
        navigation={allowedNavigation as any}
        onLogout={handleLogout}
        isSuperAdmin={false}
        currentUser={currentUser}
        roleLabel={userRole.replace(/_/g, " ")}
      />

      <div className="grid min-h-screen lg:grid-cols-[260px_1fr]">
        {/* Desktop Sidebar */}
        <aside className="hidden bg-brand-navy px-4 py-5 text-white lg:flex lg:flex-col no-print">
          <Link href={`/${currentLocale}`}>
            <BrandLogo className="mb-8" />
          </Link>
          <nav className="flex-1 space-y-1 overflow-y-auto">
            {allowedNavigation.map((item) => (
              <button
                key={item.id}
                onClick={() => setView(item.id as DashboardView)}
                className={cn(
                  "flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition hover:bg-white/10 hover:text-white",
                  view === item.id
                    ? "brand-gradient text-brand-navy font-bold hover:text-brand-navy"
                    : "text-white/72"
                )}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="h-4 w-4" />
                  {getNavLabel(currentLocale, item.id)}
                </div>
                {item.badge && (
                  <span className={cn(
                    "rounded px-1.5 py-0.5 text-[10px] font-bold",
                    view === item.id ? "bg-brand-navy/20 text-brand-navy" : "bg-white/15 text-brand-cyan"
                  )}>
                    {getBadgeLabel(currentLocale, item.badge)}
                  </span>
                )}
              </button>
            ))}
          </nav>
          <div className="mt-8 border-t border-white/10 pt-4">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-semibold text-rose-300 transition hover:bg-red-500/15 hover:text-rose-200"
            >
              <LogOut className="h-4 w-4 text-rose-400" />
              Log Out
            </button>
          </div>
        </aside>

        <section className="flex min-w-0 flex-col">
          {/* ── Sticky Header ── */}
          <header className="sticky top-0 z-20 flex h-14 items-center gap-2 border-b border-slate-200 bg-white/95 px-3 backdrop-blur sm:h-16 sm:gap-3 sm:px-4 lg:px-7 no-print">
            {/* Mobile hamburger */}
            <button
              id="mobile-menu-btn-generic"
              onClick={() => setIsMobileSidebarOpen(true)}
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white lg:hidden"
              aria-label="Open navigation menu"
            >
              <Menu className="h-4 w-4" />
            </button>

            {/* Search — hidden on mobile */}
            <div className="relative hidden flex-1 sm:block">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                aria-label="Search — press Ctrl+K"
                placeholder="Search or Ctrl+K..."
                readOnly
                onClick={() => setIsCmdPaletteOpen(true)}
                className="h-10 w-full cursor-pointer rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-16 text-sm outline-none focus:border-brand-cyan"
              />
              <kbd className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-mono font-bold text-slate-400">
                ⌘K
              </kbd>
            </div>

            {/* Mobile: page title */}
            <p className="flex-1 truncate text-sm font-black text-brand-navy sm:hidden">{activeLabel}</p>

            {/* Mobile search icon */}
            <button
              onClick={() => setIsCmdPaletteOpen(true)}
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white sm:hidden"
              aria-label="Search"
            >
              <Search className="h-4 w-4 text-slate-500" />
            </button>

            {/* Language switcher */}
            <div className="hidden items-center rounded-xl bg-slate-100 p-1 border border-slate-200 sm:flex">
              <button
                type="button"
                onClick={handleToggleLocale}
                className="flex items-center gap-1 rounded-lg bg-white px-2 py-1 text-xs font-black text-brand-navy shadow-sm transition hover:bg-slate-50"
                title={currentLocale === "en" ? "Switch to አማርኛ" : "Switch to English"}
              >
                <span>{currentLocale === "en" ? "🇬🇧" : "🇪🇹"}</span>
                <span className="hidden md:inline">{currentLocale === "en" ? "EN" : "አማ"}</span>
              </button>
            </div>

            {/* Invite & QR button */}
            <button
              onClick={() => setIsShareOpen(true)}
              className="hidden items-center gap-1.5 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-3 py-1.5 text-xs font-bold text-cyan-800 transition hover:bg-cyan-500/20 sm:inline-flex"
              title="Share Referral & QR Code"
            >
              <Share2 className="h-3.5 w-3.5 text-cyan-600" />
              <span className="hidden lg:inline">Invite & QR</span>
              <span className="lg:hidden">Invite</span>
            </button>

            <ThemeToggle />

            <button
              onClick={() => handleOpenAi("Provide an action plan for today.")}
              className="hidden items-center gap-1.5 rounded-lg border border-brand-cyan/40 bg-brand-cyan/10 px-3 py-1.5 text-xs font-bold text-brand-navy transition hover:bg-brand-cyan/20 sm:inline-flex"
            >
              <Sparkles className="h-3.5 w-3.5 text-brand-blue" />
              <span className="hidden lg:inline">{dict.header.aiStrategist}</span>
              <span className="lg:hidden">AI</span>
            </button>

            <NotificationBell />

            <div
              onClick={() => setView("profile")}
              className="hidden items-center gap-2 rounded-lg border border-slate-200 px-2.5 py-1.5 md:flex cursor-pointer hover:bg-slate-50 transition"
              title="Profile"
            >
              <div className="h-7 w-7 rounded-full brand-gradient flex items-center justify-center font-bold text-brand-navy text-xs">
                {currentUser?.name ? currentUser.name.charAt(0) : role.name.charAt(0)}
              </div>
              <div className="hidden lg:block">
                <p className="text-xs font-bold leading-tight">{currentUser?.name || role.name}</p>
                <p className="text-[10px] text-slate-500">{userRole.replace(/_/g, " ")}</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-red-200 bg-red-50/90 px-2.5 text-xs font-bold text-red-700 transition hover:bg-red-100"
              title="Sign Out"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Log Out</span>
            </button>
          </header>

          <div id="main-view-content-generic" className="printable-content flex-1 overflow-auto px-3 py-4 sm:px-4 sm:py-6 lg:px-7 pb-24 lg:pb-8">
            {/* Print-Only Official Document Header */}
            <div className="print-only mb-6 border-b-2 border-slate-900 pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-black tracking-tight text-slate-900">MYUPLINE GLOBAL</h1>
                  <p className="text-xs font-semibold text-slate-600">Network Management Platform</p>
                </div>
                <div className="text-right text-xs text-slate-600">
                  <p className="font-black text-sm text-slate-900">{activeLabel}</p>
                  <p>Printed: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })} at {new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}</p>
                  <p>Role: {userRole.replace(/_/g, " ")} | Member: {currentUser?.name || role.name}</p>
                </div>
              </div>
            </div>

            <div className="mb-5 flex flex-wrap items-center justify-between gap-3 no-print">
              <div>
                <p className="text-xs text-slate-500">{currentLocale === "am" ? "እንኳን ደህና መጡ" : `Welcome back, ${role.name}`}</p>
                <h1 className="mt-0.5 text-xl font-black text-brand-navy sm:text-2xl">{activeLabel}</h1>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="ghost" onClick={() => handleOpenAi(`What goals should ${role.name} prioritize this week?`)} className="border border-slate-200 bg-white text-xs font-bold">
                  <Sparkles className="mr-1.5 h-3.5 w-3.5 text-brand-blue" />
                  <span className="hidden sm:inline">AI Priorities</span>
                  <span className="sm:hidden">AI</span>
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    const sectionMap: Record<string, string> = {
                      "reports": "reports-center-printable",
                      "downline": "downline-table-printable",
                      "name-list": "printable-name-list-area",
                      "recruitment": "recruitment-pipeline-table",
                      "certificates": "certificate-print-area",
                      "team-faculty": "trainers-printable-area",
                      "packages-payments": "payments-printable-section",
                      "motivational-quotes": "motivation-manager-printable",
                      "goal-analyzer": "goal-analyzer-printable",
                      "after-sales": "onboarding-upline-dossier",
                      "training-hub": "training-cert-print-card",
                      "dream-goal-board": "dream-vision-board-printable",
                      "promo-studio": "promotional-flyer-print-card",
                    };
                    const targetId = sectionMap[view] || "main-view-content-generic";
                    printSection(targetId, `${activeLabel} — MyUpline Report`);
                  }}
                  className="border border-slate-200 bg-white text-xs font-bold"
                >
                  <Printer className="mr-1.5 h-4 w-4 text-slate-600" />
                  Print
                </Button>
                <Button
                  onClick={() => {
                    exportToCsv(`MyUpline_${view}_Report`, [
                      { "Section": activeLabel, "Role": role.name, "Exported Date": new Date().toLocaleString(), "Platform": "MyUpline Global" }
                    ]);
                  }}
                  className="text-xs font-bold"
                >
                  <Download className="mr-1.5 h-4 w-4" />
                  <span className="hidden sm:inline">Export</span>
                </Button>
              </div>
            </div>

            {/* Mobile bottom-tab strip */}
            <div className="mb-4 flex gap-1.5 overflow-x-auto pb-1 scrollbar-none lg:hidden no-print">
              {allowedNavigation.slice(0, 8).map((item) => (
                <button
                  key={item.id}
                  onClick={() => setView(item.id as DashboardView)}
                  className={cn(
                    "shrink-0 rounded-xl px-3 py-2 text-[11px] font-black transition whitespace-nowrap",
                    view === item.id ? "brand-gradient text-brand-navy" : "bg-white text-slate-600 border border-slate-200"
                  )}
                >
                  {item.label}
                </button>
              ))}
              <button
                onClick={() => setIsMobileSidebarOpen(true)}
                className="shrink-0 rounded-xl border border-slate-200 bg-white px-3 py-2 text-[11px] font-black text-slate-500 whitespace-nowrap hover:border-slate-300"
              >
                More ›
              </button>
            </div>

            {view === "dashboard" ? (
              <div className="space-y-6">
                {/* Welcome Banner + Live KPI Ticker */}
                <WelcomeBanner
                  userName={currentUser?.name}
                  userRole={userRole}
                  onOpenCalculator={userRole === "MEMBER" || userRole === "TEAM_LEADER" ? () => setIsEarningsOpen(true) : undefined}
                  onOpenAi={handleOpenAi}
                  onOpenShare={() => setIsShareOpen(true)}
                />

                {/* New Member Onboarding Checklist — only for MEMBER role */}
                {userRole === "MEMBER" && (
                  <OnboardingChecklist
                    onNavigate={(v) => setView(v as DashboardView)}
                    userName={currentUser?.name}
                  />
                )}

                {/* Daily Motivational Quote Top Banner */}
                <MotivationalQuotesWidget onOpenAi={handleOpenAi} isSuperAdmin={userRole === "SUPER_ADMIN" || userRole === "ADMIN"} />

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  {role.stats.map(([label, value, change]) => (
                    <Card key={label} className="p-5">
                      <p className="text-sm font-semibold text-slate-500">{label}</p>
                      <div className="mt-3 flex items-end justify-between gap-3">
                        <p className="text-2xl font-black text-brand-navy">{value}</p>
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-700">
                          <TrendingUp className="h-3 w-3" />
                          {change}
                        </span>
                      </div>
                    </Card>
                  ))}
                </div>

                <div className="mt-5 grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
                  <GrowthChart />
                  <SubscriptionChart />
                </div>
              </div>
            ) : null}

            {view === "recruitment" ? <RecruitmentPipeline onOpenAi={handleOpenAi} /> : null}
            {view === "after-sales" ? <AfterSalesOnboarding onOpenAi={handleOpenAi} /> : null}
            {view === "daily-activity" ? <DailyActivityTracker onOpenAi={handleOpenAi} /> : null}
            {view === "name-list" ? <NameListOrganizer onOpenAi={handleOpenAi} /> : null}
            {view === "training-hub" ? <TrainingHub onOpenAi={handleOpenAi} /> : null}
            {view === "dream-goal-board" ? <DreamGoalBoard onOpenAi={handleOpenAi} /> : null}
            {view === "goal-analyzer" ? <GoalAnalyzer onOpenAi={handleOpenAi} /> : null}
            {view === "downline" ? <DownlineCollector onOpenAi={handleOpenAi} /> : null}
            {view === "promo-studio" ? <PromotionalStudio onOpenAi={handleOpenAi} /> : null}
            {view === "certificates" ? <RecognitionCertificates onOpenAi={handleOpenAi} /> : null}
            {view === "motivational-quotes" ? <MotivationalQuotesWidget onOpenAi={handleOpenAi} isSuperAdmin={userRole === "SUPER_ADMIN" || userRole === "ADMIN"} fullStudio={true} /> : null}
            {view === "packages-payments" ? <PackagePaymentManager onOpenAi={handleOpenAi} /> : null}
            {view === "training-studio" ? <TrainingManagementStudio onOpenAi={handleOpenAi} /> : null}
            {view === "team-faculty" ? <TeamFacultyStudio onOpenAi={handleOpenAi} /> : null}
            {view === "cms-studio" ? <CmsBlogStudio /> : null}
            {view === "onboarding-studio" ? <OnboardingProspectStudio onOpenAi={handleOpenAi} /> : null}
            {view === "reports" ? <ReportsView /> : null}
            {view === "settings" ? <SettingsStudio locale={currentLocale} currentUser={currentUser} onLanguageChange={(l) => { setCurrentLocale(l); router.push(`/${l}/dashboard/${roleSlug}`); }} /> : null}
            {view === "profile" ? <ProfileManagementModule locale={currentLocale} currentUser={currentUser} userRole={userRole} onOpenAi={handleOpenAi} /> : null}
          </div>
        </section>
      </div>

      <FloatingActionButton
        onNavigate={(v) => setView(v as DashboardView)}
        onOpenAi={() => handleOpenAi(`Give me strategic growth advice for my role as ${role.name}.`)}
        onOpenShare={() => setIsShareOpen(true)}
      />

      <MobileBottomNav
        currentView={view as DashboardView}
        onNavigate={(v) => setView(v as DashboardView)}
        onOpenSidebar={() => setIsMobileSidebarOpen(true)}
        onOpenShare={() => setIsShareOpen(true)}
        isSuperAdmin={userRole === "SUPER_ADMIN" || userRole === "ADMIN"}
      />

      <ShareInviteModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        referralCode={currentUser?.referralCode || "UPLINE-7749"}
        userName={currentUser?.name || role.name}
        userRole={userRole}
        locale={currentLocale}
      />

      <CommandPalette
        isOpen={isCmdPaletteOpen}
        onClose={() => setIsCmdPaletteOpen(false)}
        onNavigate={(v) => { setView(v as DashboardView); setIsCmdPaletteOpen(false); }}
      />

      <EarningsCalculator
        isOpen={isEarningsOpen}
        onClose={() => setIsEarningsOpen(false)}
      />

      <AiAssistantModal
        isOpen={isAiOpen}
        onClose={() => setIsAiOpen(false)}
        initialPrompt={aiPrompt}
      />
    </main>
  );
}

function RbacAccessDenied({
  userRole,
  targetWorkspace,
  locale,
  onLogout
}: {
  userRole: SystemRole;
  targetWorkspace: string;
  locale: string;
  onLogout: () => void;
}) {
  const router = useRouter();
  const properSlug = roleToRoleSlugMap[userRole] || "member";

  return (
    <main className="min-h-screen bg-[#07132b] flex items-center justify-center p-5 text-white">
      <Card className="w-full max-w-lg border border-red-500/30 bg-[#0c1e3d]/95 p-8 text-center shadow-2xl backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/15 border border-red-500/30 text-rose-400 shadow-lg shadow-red-500/20">
          <ShieldAlert className="h-8 w-8" />
        </div>

        <div className="mt-5 inline-flex items-center gap-1.5 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-rose-300">
          403 Forbidden • Access Denied
        </div>

        <h1 className="mt-3 text-2xl font-black text-white">
          Role-Based Access Control (RBAC)
        </h1>

        <p className="mt-2 text-xs leading-relaxed text-slate-300">
          Your active account role is:{" "}
          <span className="font-black text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-700">
            {userRole.replace(/_/g, " ")}
          </span>
        </p>

        <p className="mt-3 text-xs leading-relaxed text-slate-400">
          The <strong className="text-white uppercase">{targetWorkspace.replace("-", " ")}</strong> workspace is strictly restricted. Under platform RBAC policies, you do not possess authorization to view or manage this workspace.
        </p>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <Button
            onClick={() => router.push(`/${locale}/dashboard/${properSlug}`)}
            className="flex-1 bg-cyan-400 font-black text-brand-navy hover:bg-cyan-300 h-11"
          >
            Go to My Authorized Dashboard
          </Button>

          <Button
            variant="ghost"
            onClick={onLogout}
            className="flex-1 border border-slate-700 bg-slate-800/80 text-rose-300 hover:bg-red-500/15 hover:text-rose-200 h-11"
          >
            <LogOut className="mr-1.5 h-4 w-4" />
            Log Out & Switch
          </Button>
        </div>
      </Card>
    </main>
  );
}

function AuthenticationRequired({ locale }: { locale: string }) {
  const router = useRouter();
  return (
    <main className="min-h-screen bg-[#07132b] flex items-center justify-center p-5 text-white">
      <Card className="w-full max-w-md border border-cyan-500/30 bg-[#0c1e3d]/95 p-8 text-center shadow-2xl backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 shadow-lg">
          <LockKeyhole className="h-8 w-8" />
        </div>
        <h1 className="mt-4 text-2xl font-black text-white">Authentication Required</h1>
        <p className="mt-2 text-xs leading-relaxed text-slate-300">
          Please sign in to access your authorized MyUpline workspace.
        </p>
        <div className="mt-6">
          <Button
            onClick={() => window.location.replace(`/${locale}/auth/sign-in`)}
            className="w-full bg-cyan-400 font-black text-brand-navy hover:bg-cyan-300 h-11"
          >
            Sign In to MyUpline
          </Button>
        </div>
      </Card>
    </main>
  );
}

export function DashboardShell({
  locale,
  roleSlug
}: {
  locale: string;
  roleSlug: string;
}) {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const enforceAuth = () => {
        const stored = window.localStorage.getItem("myupline.user");
        const token = window.localStorage.getItem("myupline.accessToken");
        if (!stored || !token) {
          setCurrentUser(null);
          setIsAuthChecked(true);
          window.location.replace(`/${locale}/auth/sign-in`);
          return;
        }
        try {
          setCurrentUser(JSON.parse(stored));
        } catch {
          setCurrentUser(null);
          window.location.replace(`/${locale}/auth/sign-in`);
          return;
        }
        setIsAuthChecked(true);
      };

      enforceAuth();

      // Listen for Back/Forward cache (BFCache) restorations to prevent back button bypass
      const handlePageShow = (event: PageTransitionEvent) => {
        if (event.persisted) {
          enforceAuth();
        }
      };

      window.addEventListener("pageshow", handlePageShow);
      return () => {
        window.removeEventListener("pageshow", handlePageShow);
      };
    }
  }, [locale]);

  const handleLogout = async () => {
    await performSecureLogout(locale);
  };

  if (!isAuthChecked || !currentUser) {
    return (
      <div className="min-h-screen bg-[#07132b] flex items-center justify-center text-cyan-300 text-sm font-bold">
        Verifying authorization...
      </div>
    );
  }

  // Enforce RBAC Workspace Clearance
  const userRole: SystemRole = (currentUser?.role as SystemRole) || "MEMBER";
  const isAuthorized = canRoleAccessWorkspace(userRole, roleSlug);

  if (!isAuthorized) {
    return (
      <RbacAccessDenied
        userRole={userRole}
        targetWorkspace={roleSlug}
        locale={locale}
        onLogout={handleLogout}
      />
    );
  }

  if (roleSlug === "super-admin") {
    return (
      <SuperAdminWorkspace
        locale={locale}
        currentUser={currentUser}
        userRole={userRole}
      />
    );
  }

  return (
    <GenericDashboard
      locale={locale}
      roleSlug={roleSlug}
      currentUser={currentUser}
      userRole={userRole}
    />
  );
}
