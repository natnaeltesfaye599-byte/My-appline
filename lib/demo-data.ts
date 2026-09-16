import {
  Activity,
  BarChart3,
  BookOpen,
  CalendarDays,
  GraduationCap,
  LayoutDashboard,
  Megaphone,
  MessageSquare,
  Network,
  ShieldCheck,
  Trophy,
  UserRound,
  UsersRound,
  WalletCards
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type ProductModule = {
  icon: LucideIcon;
  title: string;
  copy: string;
};

export type DashboardRole = {
  slug: string;
  name: string;
  icon: LucideIcon;
  stats: [string, string, string][];
};

export const modules: ProductModule[] = [
  {
    icon: UsersRound,
    title: "Members",
    copy: "Profiles, lifecycle stages, teams, activity history, notes, and searchable segmentation."
  },
  {
    icon: Network,
    title: "Recruitment",
    copy: "Referral links, codes, lead pipelines, conversion analytics, and team leader attribution."
  },
  {
    icon: GraduationCap,
    title: "LMS",
    copy: "Courses, lessons, video and PDF resources, quizzes, progress, and certificates."
  },
  {
    icon: WalletCards,
    title: "Subscriptions",
    copy: "Membership plans, renewals, manual payment verification, expiry alerts, and revenue reports."
  },
  {
    icon: MessageSquare,
    title: "Communication",
    copy: "Announcements, notifications, member messaging, and targeted engagement workflows."
  },
  {
    icon: BarChart3,
    title: "Reporting",
    copy: "Membership, recruitment, LMS, and subscription reports for every permission level."
  }
];

export const roles: DashboardRole[] = [
  {
    slug: "super-admin",
    name: "Super Admin",
    icon: ShieldCheck,
    stats: [
      ["Total Members", "12,458", "+12.5%"],
      ["Active Subscriptions", "8,642", "+8.2%"],
      ["Total Teams", "1,256", "+10.3%"],
      ["Revenue", "ETB 2.45M", "+15.7%"]
    ]
  },
  {
    slug: "admin",
    name: "Administrator",
    icon: LayoutDashboard,
    stats: [
      ["Pending Verifications", "47", "-6 today"],
      ["Open Tickets", "18", "+3 today"],
      ["Announcements", "12", "+2 drafts"],
      ["CMS Pages", "34", "healthy"]
    ]
  },
  {
    slug: "team-leader",
    name: "Team Leader",
    icon: Trophy,
    stats: [
      ["Team Members", "128", "+10.2%"],
      ["New Members", "24", "+7 this month"],
      ["Team Leads", "5", "+1 this month"],
      ["Team Rank", "#3", "top 10"]
    ]
  },
  {
    slug: "trainer",
    name: "Trainer",
    icon: BookOpen,
    stats: [
      ["Courses", "12", "+2 this month"],
      ["Students", "356", "+12%"],
      ["Completed", "128", "+18%"],
      ["Certificates", "98", "+12%"]
    ]
  },
  {
    slug: "member",
    name: "Member",
    icon: UserRound,
    stats: [
      ["Progress", "75%", "+9%"],
      ["Courses", "3", "in progress"],
      ["Rank", "Silver", "next: Gold"],
      ["Subscription", "Active", "Jun 30, 2026"]
    ]
  }
];

export const sidebarItems: [LucideIcon, string][] = [
  [LayoutDashboard, "Dashboard"],
  [UserRound, "My Profile"],
  [UsersRound, "Team Management"],
  [Network, "Recruitment & Leads"],
  [BookOpen, "Learning Management"],
  [Megaphone, "Communication"],
  [CalendarDays, "Tasks & Activities"],
  [BarChart3, "Reports & Analytics"],
  [Activity, "System Settings"]
];

export const apiModules = [
  "auth",
  "members",
  "teams",
  "referrals",
  "courses",
  "subscriptions",
  "communications",
  "reports",
  "cms"
];
