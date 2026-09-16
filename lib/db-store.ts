import fs from "fs";
import path from "path";
import crypto from "crypto";

export interface StoredUser {
  id: string;
  organizationId: string;
  email: string;
  phone: string | null;
  fullName: string | null;
  passwordHash: string;
  role: string;
  emailVerifiedAt: string | null;
  profileSetupCompleted: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface StoredProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  country: string | null;
  region: string | null;
  city: string | null;
  address: string | null;
  status: string;
  rank: string | null;
  referralCode: string;
  packageType?: string | null;
  teamName?: string | null;
  assignedTrainings?: string[];
  rawPassword?: string | null;
  avatarUrl?: string | null;
  bio?: string | null;
  telegramHandle?: string | null;
  whatsappNumber?: string | null;
  gender?: "MALE" | "FEMALE" | "OTHER" | null;
  titleOrOccupation?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface StoredPackage {
  id: string;
  name: string;
  priceETB: number;
  pv: number;
  badge?: string;
  description: string;
  features: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface StoredPaymentSubmission {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  packageId: string;
  packageName: string;
  amountETB: number;
  paymentMethod: string;
  transactionRef: string;
  receiptScreenshotUrl: string; // base64 or file URL
  status: "PENDING_VERIFICATION" | "APPROVED" | "REJECTED";
  adminNotes?: string;
  verifiedAt?: string;
  verifiedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StoredPaymentMethod {
  id: string;
  name: string;
  accountName: string;
  accountNumber: string;
  type: "BANK" | "MOBILE_MONEY" | "CRYPTO" | "CASH";
  instructions?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface StoredTrainingMaterial {
  id: string;
  name: string;
  type: "PPT" | "PDF" | "AUDIO" | "VIDEO" | "DOC";
  fileUrl: string;
  fileSize: string;
  description?: string;
  uploadedAt: string;
}

export interface StoredTrainer {
  id: string;
  userId?: string;
  name: string;
  email: string;
  phone: string;
  specialization: string;
  bio: string;
  avatarUrl?: string;
  rating: number;
  assignedCoursesCount: number;
  isActive: boolean;
  teamAssigned?: string;
  assignedTrainings?: string[];
  rawPassword?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StoredTrainingCourse {
  id: string;
  title: string;
  level: "BASIC" | "ADVANCED" | "SYSTEM" | "LEADERSHIP";
  category: string;
  description: string;
  durationMinutes: number; // 20 - 30 minutes
  format: "VIDEO" | "AUDIO" | "PPT" | "HYBRID";
  mediaUrl?: string;
  trainerId?: string;
  trainerName?: string;
  trainerPhone?: string;
  materials: StoredTrainingMaterial[];
  quizQuestions: Array<{
    question: string;
    options: string[];
    correctIndex: number;
    explanation?: string;
  }>;
  cohortStartTime?: string;
  isActive: boolean;
  enrolledCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface StoredBlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string; // URL or base64
  author: string;
  authorRole: string;
  category: string;
  tags: string[];
  readTimeMinutes: number;
  isPublished: boolean;
  featured: boolean;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StoredCmsHero {
  badgeText: string;
  announcement: string;
  headline: string;
  subheadline: string;
  primaryCtaText: string;
  primaryCtaLink: string;
  secondaryCtaText: string;
  secondaryCtaLink: string;
  stats: {
    activeMembers: number;
    monthlyVolumeETB: number;
    coursesCompleted: number;
    countriesActive: number;
  };
}

export interface StoredCmsTestimonial {
  id: string;
  name: string;
  role: string;
  story: string;
  initials: string;
  rating: number;
  location?: string;
}

export interface StoredCmsFaq {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
}

export interface StoredSocialLinks {
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  telegram?: string;
  whatsapp?: string;
  twitter?: string;
  youtube?: string;
  tiktok?: string;
}

export interface StoredFooterLink {
  label: string;
  labelAm?: string;
  href: string;
}

export interface StoredCmsFooter {
  brandDescription: string;
  brandDescriptionAmharic?: string;
  contactEmail: string;
  contactPhone: string;
  whatsappNumber?: string;
  telegramChannelOrUser?: string;
  officeAddress: string;
  officeAddressAmharic?: string;
  workingHours?: string;
  workingHoursAmharic?: string;
  socialLinks: StoredSocialLinks;
  platformLinks: StoredFooterLink[];
  companyLinks: StoredFooterLink[];
  copyrightText: string;
  copyrightTextAmharic?: string;
  securityBadgeText?: string;
}

export interface StoredCmsContent {
  hero: StoredCmsHero;
  testimonials: StoredCmsTestimonial[];
  faqs: StoredCmsFaq[];
  footer: StoredCmsFooter;
}

export interface StoredTeam {
  id: string;
  name: string;
  description?: string;
  leaderId?: string;   // userId of the TEAM_LEADER
  leaderName?: string;
  leaderEmail?: string;
  color?: string;      // hex colour for the card
  memberIds: string[]; // userIds
  memberCount: number;
  region?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface StoredDailyMotivation {
  id: string;
  title: string;
  quote: string;
  author: string;
  authorRole: string;
  category: "Leadership" | "Perseverance" | "Vision" | "Teamwork" | "Action" | "Duplication" | "Mindset";
  amharicTranslation?: string;
  mediaUrl?: string;
  targetType: "ALL" | "TEAM" | "RANK" | "SINGLE";
  targetTeam?: string; // e.g. "Alpha Eagles", "Crown Diamonds", "Addis Pioneers", "Trainers Faculty"
  targetRank?: string; // e.g. "Diamond", "Gold", "Silver", "Bronze", "Trainer", "Team Leader"
  targetUserId?: string; // specific member user ID
  targetUserName?: string;
  deliveryChannel: "DASHBOARD" | "SMS_SIMULATED" | "IN_APP_POPUP" | "ALL";
  status: "SENT" | "SCHEDULED" | "DRAFT";
  scheduledFor?: string;
  sentAt?: string;
  sentBy: string;
  likesCount: number;
  recipientsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface StoredSettings {
  id: string;
  organizationName: string;
  systemLanguage: "en" | "am";
  timezone: string;
  currency: "ETB" | "USD";
  dateFormat: "GREGORIAN" | "ETHIOPIAN";
  requireEmailVerification: boolean;
  enableAuditLogging: boolean;
  lockAccountAfterFailedAttempts: boolean;
  maxFailedAttempts: number;
  twoFactorAuth: boolean;
  sessionTimeoutMinutes: number;
  manualPaymentVerification: boolean;
  renewalReminders: boolean;
  expireAccessAutomatically: boolean;
  telebirrAutoVerify: boolean;
  dailyMotivationNotification: boolean;
  newDownlineNotification: boolean;
  trainingCohortAlerts: boolean;
  weeklyExecutiveDigest: boolean;
  updatedAt: string;
}

interface DatabaseSchema {
  users: StoredUser[];
  profiles: StoredProfile[];
  packages: StoredPackage[];
  payments: StoredPaymentSubmission[];
  paymentMethods: StoredPaymentMethod[];
  trainers: StoredTrainer[];
  trainings: StoredTrainingCourse[];
  organizations: Array<{ id: string; name: string; slug: string }>;
  blog: StoredBlogPost[];
  cms: StoredCmsContent;
  motivations: StoredDailyMotivation[];
  teams: StoredTeam[];
  settings?: StoredSettings;
}

const DB_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DB_DIR, "database.json");

const defaultPackages: StoredPackage[] = [
  {
    id: "pkg-diamond",
    name: "Diamond Leader",
    priceETB: 14990,
    pv: 500,
    badge: "Recommended ⭐",
    description: "Maximum compensation tiers, full Academy access, personalized Downline Studio.",
    features: [
      "500 Personal Volume (PV)",
      "Tier-1 Binary & Matching Commissions",
      "Full Academy Certification Access",
      "Priority Upline Placement & Direct Support",
      "Unlimited Downline Contact Collector"
    ],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "pkg-gold",
    name: "Gold Executive",
    priceETB: 8490,
    pv: 250,
    badge: "Popular",
    description: "Multi-level downline tracking, Basic + Advanced training cohorts.",
    features: [
      "250 Personal Volume (PV)",
      "Standard Binary Commissions",
      "Advanced Training Access",
      "Up to 3-Level Downline Tracking"
    ],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "pkg-silver",
    name: "Silver Associate",
    priceETB: 3990,
    pv: 100,
    description: "Standard name list manager, daily activity scheduler, basic certification.",
    features: [
      "100 Personal Volume (PV)",
      "Basic Compensation Tier",
      "Daily Activity & DMO Scheduler",
      "Name List Prospect Organizer"
    ],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "pkg-bronze",
    name: "Bronze Starter",
    priceETB: 1990,
    pv: 50,
    description: "Essential IBO onboarding tools, getting started video library.",
    features: [
      "50 Personal Volume (PV)",
      "Starter Orientation Videos",
      "Standard Member Portal Access"
    ],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const defaultPaymentMethods: StoredPaymentMethod[] = [
  {
    id: "pm-cbe",
    name: "Commercial Bank of Ethiopia (CBE)",
    accountName: "MyUpline Global PLC",
    accountNumber: "1000 2345 6789",
    type: "BANK",
    instructions: "Please enter your registered phone number in the transfer reason/remark.",
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "pm-telebirr",
    name: "Telebirr Merchant",
    accountName: "MyUpline Global (Telebirr)",
    accountNumber: "+251 911 234 567",
    type: "MOBILE_MONEY",
    instructions: "Transfer via Telebirr or scan the merchant QR code and screenshot your SMS confirmation.",
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "pm-awash",
    name: "Awash Bank",
    accountName: "MyUpline Global PLC",
    accountNumber: "0130 4567 8901 00",
    type: "BANK",
    instructions: "Transfer via Awash Mobile Banking or in-branch deposit slip.",
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "pm-boa",
    name: "Bank of Abyssinia",
    accountName: "MyUpline Global PLC",
    accountNumber: "8849 3210 4455",
    type: "BANK",
    instructions: "Transfer through BoA mobile app or cash deposit.",
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const defaultTrainers: StoredTrainer[] = [
  {
    id: "trn-dawit",
    userId: "usr-dawit-01",
    name: "Coach Dawit Mengistu",
    email: "dawit.coach@myupline.org",
    phone: "+251 911 223 344",
    specialization: "Eric Worre Methodology & Duplication Architecture",
    bio: "Crown Diamond Master Trainer with 12+ years experience building international 6-figure downlines.",
    rating: 4.9,
    assignedCoursesCount: 2,
    isActive: true,
    teamAssigned: "Trainers Faculty",
    assignedTrainings: ["trn-course-03", "trn-course-890b006b"],
    rawPassword: "Trainer@2026",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "trn-selamawit",
    userId: "usr-selam-02",
    name: "Selamawit Tadesse",
    email: "selamawit.sales@myupline.org",
    phone: "+251 912 334 455",
    specialization: "8-Step Invitation Script & Objection Elimination",
    bio: "Senior Sales Director specialized in professional invitations and warm market conversion.",
    rating: 4.8,
    assignedCoursesCount: 1,
    isActive: true,
    teamAssigned: "Addis Pioneers Squad",
    assignedTrainings: ["trn-course-02"],
    rawPassword: "Trainer@2026",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "trn-kassahun",
    userId: "usr-kassa-03",
    name: "Kassahun Bekele",
    email: "kassahun.sys@myupline.org",
    phone: "+251 913 445 566",
    specialization: "NBO Orientation & 48-Hour Fast-Track Protocol",
    bio: "Operations director ensuring 100% compliance, synchronization, and cohort equal start time execution.",
    rating: 4.9,
    assignedCoursesCount: 1,
    isActive: true,
    teamAssigned: "Trainers Faculty",
    assignedTrainings: ["trn-course-01"],
    rawPassword: "Trainer@2026",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "trn-bethelhem",
    userId: "usr-bethel-04",
    name: "Dr. Bethelhem Alemu",
    email: "dr.bethelhem@myupline.org",
    phone: "+251 914 556 677",
    specialization: "Rise of Entrepreneur Mindset & Retention",
    bio: "Executive leadership coach focused on transforming employee mindset into scalable entrepreneurial vision.",
    rating: 5.0,
    assignedCoursesCount: 1,
    isActive: true,
    teamAssigned: "Diamond Leadership Council",
    assignedTrainings: ["trn-course-04"],
    rawPassword: "Trainer@2026",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const defaultTrainings: StoredTrainingCourse[] = [
  {
    id: "trn-course-01",
    title: "NBO: New Business Orientation & 48-Hour Launch",
    level: "BASIC",
    category: "Orientation & Launch",
    description: "Crucial orientation for every new IBO: compensation model, PV/GV mechanics, compliance standards, and 48-hour launch blueprint.",
    durationMinutes: 25,
    format: "VIDEO",
    mediaUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    trainerId: "trn-kassahun",
    trainerName: "Kassahun Bekele",
    trainerPhone: "+251 913 445 566",
    materials: [
      {
        id: "mat-01",
        name: "NBO_48Hour_Launch_Blueprint.pdf",
        type: "PDF",
        fileUrl: "/materials/NBO_48Hour_Launch_Blueprint.pdf",
        fileSize: "2.4 MB",
        description: "Official 48-hour action checklist and contact formula.",
        uploadedAt: new Date().toISOString()
      },
      {
        id: "mat-02",
        name: "NBO_Orientation_Master_Slides.pptx",
        type: "PPT",
        fileUrl: "/materials/NBO_Orientation_Master_Slides.pptx",
        fileSize: "6.1 MB",
        description: "High-resolution PowerPoint presentation for team meetings.",
        uploadedAt: new Date().toISOString()
      }
    ],
    quizQuestions: [
      {
        question: "Within how many hours must a new IBO initiate their contact list launch?",
        options: ["Within 1 month", "Within 48 hours", "Whenever they feel like it", "After 90 days"],
        correctIndex: 1,
        explanation: "The first 48 hours are critical for momentum and excitement."
      }
    ],
    cohortStartTime: "Tonight at 8:00 PM (Equal Time)",
    isActive: true,
    enrolledCount: 342,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "trn-course-02",
    title: "Basic Training: 8-Step Invitation Mastery (Eric Worre)",
    level: "BASIC",
    category: "Prospecting & Invitation",
    description: "Master the legendary 8-step invitation methodology: urgency, compliments, invitations, commitment, and schedule confirmation.",
    durationMinutes: 22,
    format: "HYBRID",
    mediaUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    trainerId: "trn-selamawit",
    trainerName: "Selamawit Tadesse",
    trainerPhone: "+251 912 334 455",
    materials: [
      {
        id: "mat-03",
        name: "Eric_Worre_8Step_Scripts_Amharic_English.pdf",
        type: "PDF",
        fileUrl: "/materials/Eric_Worre_8Step_Scripts.pdf",
        fileSize: "1.8 MB",
        description: "Word-for-word invitation scripts in English & Amharic.",
        uploadedAt: new Date().toISOString()
      },
      {
        id: "mat-04",
        name: "Live_Invitation_Call_Audiobook.mp3",
        type: "AUDIO",
        fileUrl: "/materials/Live_Invitation_Call_Audiobook.mp3",
        fileSize: "14.2 MB",
        description: "Audio examples of professional prospecting calls.",
        uploadedAt: new Date().toISOString()
      }
    ],
    quizQuestions: [
      {
        question: "What is Step 1 of the Eric Worre invitation protocol?",
        options: ["Present the product", "Be in a hurry", "Ask for money", "Schedule a meeting"],
        correctIndex: 1,
        explanation: "Being in a hurry creates psychological urgency and respect for your time."
      }
    ],
    cohortStartTime: "Tomorrow at 7:30 PM",
    isActive: true,
    enrolledCount: 512,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "trn-course-03",
    title: "Advanced Training: 3-Way Closing & Upline Leverage",
    level: "ADVANCED",
    category: "Closing & Objection Handling",
    description: "How to effectively edify and introduce your upline leader for high-ticket closures, handle tough objections, and secure immediate enrollment.",
    durationMinutes: 28,
    format: "VIDEO",
    mediaUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    trainerId: "trn-dawit",
    trainerName: "Coach Dawit Mengistu",
    trainerPhone: "+251 911 223 344",
    materials: [
      {
        id: "mat-05",
        name: "3Way_Call_Closing_PowerPoint.pptx",
        type: "PPT",
        fileUrl: "/materials/3Way_Call_Closing_PowerPoint.pptx",
        fileSize: "8.4 MB",
        description: "Slide deck on the psychology of 3-way validation.",
        uploadedAt: new Date().toISOString()
      }
    ],
    quizQuestions: [
      {
        question: "During a 3-way call with your upline, what is your primary job?",
        options: ["Interrupt and correct your upline", "Edify your upline, then stay muted and take notes", "Argue with the prospect", "Leave the call entirely"],
        correctIndex: 1,
        explanation: "Edify your sponsor, stay quiet, and let third-party validation do the work."
      }
    ],
    cohortStartTime: "Friday at 8:00 PM",
    isActive: true,
    enrolledCount: 215,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "trn-course-04",
    title: "Rise of Entrepreneur: Mindset Transformation",
    level: "LEADERSHIP",
    category: "Mindset & Leadership",
    description: "A 20-minute transformational module on breaking free from employee mentalities and building scalable residual wealth systems.",
    durationMinutes: 20,
    format: "VIDEO",
    mediaUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    trainerId: "trn-bethelhem",
    trainerName: "Dr. Bethelhem Alemu",
    trainerPhone: "+251 914 556 677",
    materials: [
      {
        id: "mat-06",
        name: "Entrepreneur_Mindset_Workbook.pdf",
        type: "PDF",
        fileUrl: "/materials/Entrepreneur_Mindset_Workbook.pdf",
        fileSize: "1.2 MB",
        description: "Self-assessment questionnaire and monthly income target worksheet.",
        uploadedAt: new Date().toISOString()
      }
    ],
    quizQuestions: [
      {
        question: "What is the key difference between employee and entrepreneurial income?",
        options: ["Employees get paid for systems, entrepreneurs for hours", "Entrepreneurs build systems that generate residual overrides", "There is no difference", "Employees take higher risks"],
        correctIndex: 1,
        explanation: "Entrepreneurs build scalable assets that yield ongoing leverage."
      }
    ],
    cohortStartTime: "Saturday at 10:00 AM",
    isActive: true,
    enrolledCount: 680,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const defaultBlogPosts: StoredBlogPost[] = [
  {
    id: "blog-001",
    title: "How to Build a 6-Figure Downline in 90 Days Using the Duplication Formula",
    slug: "build-6-figure-downline-duplication-formula",
    excerpt: "Discover the exact replicable system top Diamond leaders use to duplicate results across their entire network — without relying on personal charisma.",
    content: `## The Power of Duplication Over Personality\n\nThe biggest mistake most network marketers make is building a business around their personal charisma. If you're the only one who can close, your business stops when you do.\n\nThe true key to a 6-figure downline is **duplication** — a system so simple that every member of your team can follow it, regardless of their background or experience.\n\n## The 3-Step Duplication Formula\n\n### Step 1: Master the NBO (New Business Orientation)\n\nEvery new IBO must complete the 48-hour launch protocol within their first two days. This means:\n- Writing a contact list of 100+ names\n- Scheduling their first home presentation or Zoom\n- Completing the NBO training module\n\n### Step 2: Use the 4 Basics Daily\n\nCommit to four core daily activities:\n1. **Invite** — 2-5 new contacts per day\n2. **Present** — Hold or attend at least one presentation per week\n3. **Follow-up** — Never let a prospect fall through the cracks\n4. **Promote** — Build excitement for the next cohort event\n\n### Step 3: Edify Your Upline for 3-Way Closes\n\nYou don't need to be the expert. Your upline is your leverage. Edify them, introduce them, and let their credibility close for you.\n\n## Real Results\n\nLeaders who follow this system consistently report:\n- First 30 days: 3-5 personally enrolled IBOs\n- First 60 days: Team of 15-20 active builders\n- First 90 days: Multiple Diamond qualifications in their downline\n\n## Conclusion\n\nThe duplication formula isn't magic — it's a discipline. Apply it daily, teach it to your team, and let the system do the work.`,
    coverImage: "https://images.unsplash.com/photo-1556761175-4b46a572b786?w=1200&q=80",
    author: "Coach Dawit Mengistu",
    authorRole: "Crown Diamond Master Trainer",
    category: "Duplication",
    tags: ["duplication", "leadership", "6-figure", "downline"],
    readTimeMinutes: 8,
    isPublished: true,
    featured: true,
    publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "blog-002",
    title: "The Eric Worre 8-Step Invitation Script: A Complete Breakdown for Ethiopian IBOs",
    slug: "eric-worre-8-step-invitation-script-ethiopia",
    excerpt: "We break down Eric Worre's legendary invitation methodology step-by-step with real Amharic/English examples tailored for the Ethiopian market.",
    content: `## Why the Script Works\n\nEric Worre's 8-step invitation protocol is the most battle-tested prospecting system in network marketing history. It works because it respects the prospect's time and positions you as a busy, successful person worth meeting.\n\n## The 8 Steps\n\n**Step 1: Be in a Hurry**\n\nAlways create the impression you have somewhere to be. This triggers respect.\n\n*Script:* "I only have a minute, but I needed to call you..."\n\n**Step 2: Compliment Them Sincerely**\n\nPeople open up when they feel genuinely appreciated.\n\n*Script:* "You are one of the most driven people I know, and I've always admired that about you."\n\n**Step 3: Make the Invitation**\n\nBe direct. Don't reveal everything over the phone.\n\n*Script:* "I've just partnered with something that I think would be perfect for your ambitions. I can't share all the details right now, but I'd love to show you what I've found."\n\n**Step 4: If I... Would You...?**\n\nThis powerful conditional exchange creates psychological commitment.\n\n*Script:* "If I sent you a short video, would you actually watch it before tomorrow morning?"\n\n**Step 5: Confirmation 1 — Set the Time**\n\n"When exactly will you watch it? Tonight or tomorrow morning?"\n\n**Step 6: Confirmation 2 — Confirm the Appointment**\n\n"So if I call you tomorrow at 9 AM, you'll have watched it by then, right?"\n\n**Step 7: Get Off the Phone**\n\nDon't oversell. End the call immediately.\n\n**Step 8: Report Back**\n\nFollow up exactly as promised. This is where trust is built.\n\n## In Amharic Context\n\nFor Ethiopian prospects, emphasizing community, family benefit, and stability resonates deeply. Tie Step 2 (the compliment) to their role as a provider and leader within their family.\n\n## Final Note\n\nPractice these steps until they feel natural. Record yourself, play it back, and refine.`,
    coverImage: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&q=80",
    author: "Selamawit Tadesse",
    authorRole: "Senior Sales Director",
    category: "Recruitment",
    tags: ["invitation", "eric-worre", "prospecting", "script"],
    readTimeMinutes: 6,
    isPublished: true,
    featured: false,
    publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "blog-003",
    title: "From Employee Mindset to Financial Freedom: The Entrepreneur Transformation",
    slug: "employee-mindset-to-financial-freedom",
    excerpt: "Dr. Bethelhem Alemu shares the psychological breakthroughs that separate top-earning IBOs from those who quit in the first 90 days.",
    content: `## The Core Mindset Shift\n\nMost people who struggle in network marketing aren't failing because of skill — they're failing because of identity. They still see themselves as employees waiting for a paycheck rather than entrepreneurs building a business.\n\n## The 3 Pillars of Entrepreneurial Thinking\n\n### 1. Trade Time for Systems, Not for Money\n\nEmployees are paid for hours. Entrepreneurs build systems that generate income whether they're working or sleeping. Your downline is your system. Train them well and your income becomes residual.\n\n### 2. Embrace Rejection as Data\n\nA "no" from a prospect isn't a personal rejection — it's data. It tells you this person isn't ready today. Every successful Diamond leader has collected thousands of "nos" before hitting their first major rank.\n\n### 3. Your Network is Your Net Worth\n\nRelationships are the currency of network marketing. Invest in people. Follow up. Celebrate their wins. Show genuine interest in their success, and they will duplicate that energy throughout your entire organization.\n\n## The 90-Day Identity Challenge\n\nFor the next 90 days, commit to:\n- Reading 10 pages of personal development daily\n- Completing your Daily 4 Basics every single day\n- Attending every team training and Saturday leadership call\n- Writing 3 gratitude statements each morning\n\n## The Result\n\nAfter 90 days of consistent identity work, most IBOs report:\n- Increased confidence in presentations\n- Faster recovery from rejection\n- Deeper team relationships\n- First rank advancement achievement\n\n## You Are Already a Leader\n\nThe fact that you joined and showed up is proof. Now commit to becoming the leader your team needs you to be.`,
    coverImage: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&q=80",
    author: "Dr. Bethelhem Alemu",
    authorRole: "Executive Leadership Coach",
    category: "Personal Growth",
    tags: ["mindset", "entrepreneur", "personal-development", "leadership"],
    readTimeMinutes: 7,
    isPublished: true,
    featured: false,
    publishedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString()
  }
];

const defaultCms: StoredCmsContent = {
  hero: {
    badgeText: "🚀 Ethiopia's #1 Network Business Platform",
    announcement: "🔥 New Diamond Cohort Starting Tonight at 8:00 PM Equal Time — Register Now!",
    headline: "Build Your Business Empire with MyUpline",
    subheadline: "The all-in-one platform for Ethiopian network business leaders — recruitment, training, team management, and residual income tracking in one powerful system.",
    primaryCtaText: "Start Your Business Journey",
    primaryCtaLink: "/en/auth?mode=register",
    secondaryCtaText: "Explore the Learning Academy",
    secondaryCtaLink: "#learning",
    stats: {
      activeMembers: 12480,
      monthlyVolumeETB: 847000000,
      coursesCompleted: 38200,
      countriesActive: 7
    }
  },
  testimonials: [
    {
      id: "tst-001",
      name: "Alebe Kebede",
      role: "Diamond Team Leader · Addis Ababa",
      story: "MyUpline completely transformed how I manage my team. I went from tracking everything in notebooks to having a full dashboard with live PV, downline depth, and daily activity scores. We doubled our follow-ups in 30 days.",
      initials: "AK",
      rating: 5,
      location: "Addis Ababa"
    },
    {
      id: "tst-002",
      name: "Biniyam Tesfaye",
      role: "Senior Trainer · Hawassa",
      story: "The LMS changed everything for my cohort. Participants can track their own progress, complete quizzes, and earn certificates. Leadership development became something I can measure, not just feel.",
      initials: "BT",
      rating: 5,
      location: "Hawassa"
    },
    {
      id: "tst-003",
      name: "Mulugeta Desta",
      role: "Gold Executive IBO · Bahir Dar",
      story: "I was skeptical at first, but the recruitment pipeline and name list manager made me consistent. I always knew my next step. Hit Gold Executive in my first 60 days.",
      initials: "MD",
      rating: 5,
      location: "Bahir Dar"
    },
    {
      id: "tst-004",
      name: "Hiwot Girma",
      role: "Crown Diamond · Mekelle",
      story: "The recognition certificates and dream board features kept me motivated during difficult months. Now my team of 340 active IBOs all use the platform daily. The system duplicates itself.",
      initials: "HG",
      rating: 5,
      location: "Mekelle"
    }
  ],
  faqs: [
    {
      id: "faq-001",
      question: "What is MyUpline and who is it for?",
      answer: "MyUpline is a comprehensive business management platform designed specifically for Ethiopian network marketing IBOs, team leaders, trainers, and administrators. It provides tools for recruitment pipeline management, LMS-based training, team tracking, manual payment verification, and performance analytics — all in one role-aware system.",
      category: "General",
      order: 1
    },
    {
      id: "faq-002",
      question: "How do I register and choose my membership package?",
      answer: "Registration is simple: visit our sign-up page, fill in your personal details, select your preferred membership package (Bronze, Silver, Gold, or Diamond), then make a manual bank transfer via CBE, Telebirr, or Awash Bank. Upload your payment receipt screenshot directly in the app. Our admin team reviews and approves your account within 24 hours.",
      category: "Registration & Payment",
      order: 2
    },
    {
      id: "faq-003",
      question: "Which payment methods are accepted?",
      answer: "We accept transfers through Commercial Bank of Ethiopia (CBE), Telebirr Merchant, Awash Bank, and Bank of Abyssinia. After making your transfer, you upload a screenshot of the payment confirmation. Our team manually verifies all transactions and notifies you upon approval.",
      category: "Registration & Payment",
      order: 3
    },
    {
      id: "faq-004",
      question: "How do training programs and the Academy work?",
      answer: "The MyUpline Academy offers structured training modules led by certified coaches. Each course includes video lessons, downloadable materials (PDFs, PowerPoints, audio recordings), knowledge quizzes, and completion certificates. Courses are organized by level: Basic, Advanced, System, and Leadership. Cohorts start at scheduled equal times to build team momentum.",
      category: "Training",
      order: 4
    },
    {
      id: "faq-005",
      question: "How does the recruitment and prospect tracking system work?",
      answer: "The Recruitment Pipeline lets you track every prospect from first contact through presentation, follow-up, and enrollment. The Name List Organizer helps you score and stage your warm market. The Daily Activity Tracker holds you accountable to your 4 Core Basics every day. All data is exportable to CSV for team reporting.",
      category: "Recruitment",
      order: 5
    },
    {
      id: "faq-006",
      question: "Is my data secure on the platform?",
      answer: "Yes. All user data is isolated by role via our RBAC system — members can only see their own data, team leaders see their direct teams, and only Super Admins have platform-wide access. Passwords are securely hashed. Payment receipts are stored as encrypted uploads and are only accessible to admins during the verification process.",
      category: "Security",
      order: 6
    }
  ],
  footer: {
    brandDescription: "MyUpline is the leading platform for Ethiopian network marketing IBOs — empowering leaders through technology, training, and community.",
    brandDescriptionAmharic: "ማይአፕላይን ለኢትዮጵያ ኔትወርክ ማርኬቲንግ መሪዎች ቀዳሚው መድረክ ነው — መሪዎችን በቴክኖሎጂ፣ በስልጠና እና በማህበረሰብ ያበቃል።",
    contactEmail: "support@myupline.org",
    contactPhone: "+251 911 223 344",
    whatsappNumber: "+251 911 223 344",
    telegramChannelOrUser: "https://t.me/myuplineofficial",
    officeAddress: "Bole Medhanialem, Edna Mall Commercial Complex, 4th Floor, Addis Ababa, Ethiopia",
    officeAddressAmharic: "ቦሌ መድኃኔዓለም፣ ኤድና ሞል የንግድ ህንፃ፣ 4ኛ ፎቅ፣ አዲስ አበባ፣ ኢትዮጵያ",
    workingHours: "Monday – Saturday: 8:30 AM – 6:30 PM (EAT)",
    workingHoursAmharic: "ከሰኞ – ቅዳሜ፡ ከጠዋቱ 2:30 – ከምሽቱ 12:30 (የኢትዮጵያ ሰዓት)",
    socialLinks: {
      facebook: "https://facebook.com/myupline.ethiopia",
      instagram: "https://instagram.com/myupline.official",
      linkedin: "https://linkedin.com/company/myupline-global",
      telegram: "https://t.me/myuplineofficial",
      whatsapp: "https://wa.me/251911223344",
      twitter: "https://twitter.com/myupline_et",
      youtube: "https://youtube.com/@myuplineofficial",
      tiktok: "https://tiktok.com/@myupline.ethiopia"
    },
    platformLinks: [
      { label: "Dashboard", labelAm: "ዳሽቦርድ", href: "/en/auth" },
      { label: "LMS Academy", labelAm: "የስልጠና አካዳሚ", href: "#learning" },
      { label: "Recruitment Pipeline", labelAm: "የምልመላ ሂደት", href: "/en/auth" },
      { label: "Certificates", labelAm: "የእውቅና ሰርተፊኬቶች", href: "/en/auth" },
      { label: "Reports & Analytics", labelAm: "ሪፖርቶች እና ትንታኔ", href: "/en/auth" },
      { label: "Settings", labelAm: "ቅንብሮች", href: "/en/auth" }
    ],
    companyLinks: [
      { label: "About Us", labelAm: "ስለ እኛ", href: "#about" },
      { label: "Blog & Insights", labelAm: "ብሎግ እና ፅሁፎች", href: "#blog" },
      { label: "Leadership Team", labelAm: "የአመራር ቡድን", href: "#stories" },
      { label: "Contact Us", labelAm: "ያግኙን", href: "/en/contact" },
      { label: "Privacy Policy", labelAm: "የግላዊነት ፖሊሲ", href: "#contact" },
      { label: "Terms & Conditions", labelAm: "ውሎች እና ሁኔታዎች", href: "#contact" }
    ],
    copyrightText: "© 2026 MyUpline Global PLC. All rights reserved. Platform built for Ethiopian IBOs and network leaders.",
    copyrightTextAmharic: "© 2026 ማይአፕላይን ግሎባል ኃ/የተ/የግ/ማህበር። መብቱ በህግ የተጠበቀ ነው። ለኢትዮጵያ የኔትወርክ መሪዎች የተሰራ።",
    securityBadgeText: "RBAC-Secured · Data Encrypted · Ethiopian Business Platform"
  }
};

const defaultMotivations: StoredDailyMotivation[] = [
  {
    id: "mot-001",
    title: "Consistency Breeds Royalty",
    quote: "Leadership is not about being in charge. It is about taking care of those in your charge and guiding them to their highest potential.",
    author: "Simon Sinek",
    authorRole: "Global Leadership Author",
    category: "Leadership",
    amharicTranslation: "መሪነት ሌሎችን በሥልጣን መቆጣጠር ሳይሆን በኃላፊነትህ ሥር ያሉትን መንከባከብና ወደ ከፍተኛ አቅማቸው ማብቃት ነው።",
    targetType: "ALL",
    deliveryChannel: "ALL",
    status: "SENT",
    sentAt: new Date().toISOString(),
    sentBy: "Super Admin",
    likesCount: 342,
    recipientsCount: 12480,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "mot-002",
    title: "Take Massive Action Today",
    quote: "You don't have to be great to start, but you have to start to be great. One conversation today can change your entire network tomorrow.",
    author: "Zig Ziglar",
    authorRole: "Master Sales Strategist",
    category: "Action",
    amharicTranslation: "ለመጀመር ምርጥ መሆን አይጠበቅብህም፤ ነገር ግን ምርጥ ለመሆን መጀመር አለብህ። ዛሬ የምታደርገው አንድ ውይይት የነገውን አውታረ መረብህ ሊለውጥ ይችላል።",
    targetType: "RANK",
    targetRank: "Bronze",
    deliveryChannel: "DASHBOARD",
    status: "SENT",
    sentAt: new Date().toISOString(),
    sentBy: "Super Admin",
    likesCount: 489,
    recipientsCount: 3200,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "mot-003",
    title: "Empire Duplication Protocol",
    quote: "Success in this business isn't about selling a product; it is about empowering people to build their own financial freedom and dignity.",
    author: "Jim Rohn",
    authorRole: "Personal Development Mentor",
    category: "Duplication",
    amharicTranslation: "በዚህ ንግድ ውስጥ ስኬት ምርት መሸጥ ብቻ ሳይሆን ሰዎች የራሳቸውን የፋይናንስ ነፃነት እና ክብር እንዲገነቡ ማብቃት ነው።",
    targetType: "TEAM",
    targetTeam: "Diamond Leadership Council",
    deliveryChannel: "ALL",
    status: "SENT",
    sentAt: new Date().toISOString(),
    sentBy: "Super Admin",
    likesCount: 512,
    recipientsCount: 145,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "mot-004",
    title: "Personal Diamond Pace Boost",
    quote: "Your relentless commitment to the 4-Basics this week is inspiring the entire team. Stay dialed in on your 3-way calls—your rank advancement is already in motion!",
    author: "Super Admin",
    authorRole: "Master Upline Command",
    category: "Perseverance",
    amharicTranslation: "በዚህ ሳምንት ለዕለታዊ 4-መሠረታዊ ተግባራት ያሳየኸው ቁርጠኝነት ቡድኑን በሙሉ እያነቃቃ ነው። በዚሁ ቀጥል፤ ማዕረግህ በቅርብ ነው።",
    targetType: "SINGLE",
    targetUserId: "usr-3cb71f3c",
    targetUserName: "Abebe Bikila",
    deliveryChannel: "IN_APP_POPUP",
    status: "SENT",
    sentAt: new Date().toISOString(),
    sentBy: "Super Admin",
    likesCount: 88,
    recipientsCount: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const defaultTeams: StoredTeam[] = [
  {
    id: "team-diamond-001",
    name: "Diamond Leadership Council",
    description: "Elite crown diamond leaders responsible for national expansion strategy and team duplication oversight.",
    leaderId: "usr-admin-01",
    leaderName: "Super Admin",
    leaderEmail: "super-admin@myupline.demo",
    color: "#7c3aed",
    memberIds: [],
    memberCount: 0,
    region: "National",
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "team-addis-001",
    name: "Addis Pioneers Squad",
    description: "Fast-growing frontline squad based in Addis Ababa, specializing in rapid 48-hour launch protocols.",
    color: "#0ea5e9",
    memberIds: [],
    memberCount: 0,
    region: "Addis Ababa",
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "team-hawassa-001",
    name: "Hawassa Eagle Squad",
    description: "Southern Ethiopia powerhouse team with high conversion rates in recruitment and 3-way close mastery.",
    color: "#10b981",
    memberIds: [],
    memberCount: 0,
    region: "Hawassa",
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "team-bahir-001",
    name: "Bahir Dar Champions",
    description: "Northern growth squad with strong duplication systems and consistent weekly presentations.",
    color: "#f59e0b",
    memberIds: [],
    memberCount: 0,
    region: "Bahir Dar",
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "team-faculty-001",
    name: "Trainers Faculty",
    description: "Official training staff and certified coaches responsible for LMS delivery and cohort management.",
    color: "#ef4444",
    memberIds: [],
    memberCount: 0,
    region: "National",
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "team-mekelle-001",
    name: "Mekelle Alpha Builders",
    description: "Tigray region emerging leaders accelerating towards Diamond qualification.",
    color: "#ec4899",
    memberIds: [],
    memberCount: 0,
    region: "Mekelle",
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const defaultSettings: StoredSettings = {
  id: "settings-global",
  organizationName: "MyUpline Global Network",
  systemLanguage: "en",
  timezone: "Africa/Addis_Ababa (EAT, UTC+3)",
  currency: "ETB",
  dateFormat: "GREGORIAN",
  requireEmailVerification: true,
  enableAuditLogging: true,
  lockAccountAfterFailedAttempts: true,
  maxFailedAttempts: 5,
  twoFactorAuth: false,
  sessionTimeoutMinutes: 60,
  manualPaymentVerification: true,
  renewalReminders: true,
  expireAccessAutomatically: true,
  telebirrAutoVerify: true,
  dailyMotivationNotification: true,
  newDownlineNotification: true,
  trainingCohortAlerts: true,
  weeklyExecutiveDigest: true,
  updatedAt: new Date().toISOString()
};

function ensureDb(): DatabaseSchema {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }

  if (!fs.existsSync(DB_FILE)) {
    const initialData: DatabaseSchema = {
      organizations: [
        { id: "org-default-01", name: "MyUpline Global", slug: "myupline" }
      ],
      users: [
        {
          id: "usr-admin-01",
          organizationId: "org-default-01",
          email: "super-admin@myupline.demo",
          phone: "+251911000000",
          fullName: "Super Admin",
          passwordHash: "demo-hash",
          role: "SUPER_ADMIN",
          emailVerifiedAt: new Date().toISOString(),
          profileSetupCompleted: true,
          lastLoginAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ],
      profiles: [
        {
          id: "prof-admin-01",
          userId: "usr-admin-01",
          firstName: "Super",
          lastName: "Admin",
          phone: "+251911000000",
          country: "Ethiopia",
          region: "Addis Ababa",
          city: "Bole",
          address: "HQ Suite 400",
          status: "ACTIVE",
          rank: "Crown Diamond",
          referralCode: "UPLINE-BOSS",
          packageType: "Diamond",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ],
      packages: defaultPackages,
      paymentMethods: defaultPaymentMethods,
      trainers: defaultTrainers,
      trainings: defaultTrainings,
      blog: defaultBlogPosts,
      cms: defaultCms,
      motivations: defaultMotivations,
      teams: defaultTeams,
      settings: defaultSettings,
      payments: [
        {
          id: "pay-demo-01",
          userId: "usr-3cb71f3c",
          userName: "Abebe Bikila",
          userEmail: "abebe.test@myupline.org",
          userPhone: "+251912345678",
          packageId: "pkg-diamond",
          packageName: "Diamond Leader",
          amountETB: 14990,
          paymentMethod: "Commercial Bank of Ethiopia (CBE)",
          transactionRef: "CBE-TX-88294103",
          receiptScreenshotUrl: "/receipt-sample.png",
          status: "PENDING_VERIFICATION",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), "utf-8");
    return initialData;
  }

  try {
    const raw = fs.readFileSync(DB_FILE, "utf-8");
    const parsed = JSON.parse(raw) as DatabaseSchema;
    let modified = false;
    if (!parsed.packages || parsed.packages.length === 0) {
      parsed.packages = defaultPackages;
      modified = true;
    }
    if (!parsed.payments) {
      parsed.payments = [];
      modified = true;
    }
    if (!parsed.paymentMethods || parsed.paymentMethods.length === 0) {
      parsed.paymentMethods = defaultPaymentMethods;
      modified = true;
    }
    if (!parsed.trainers || parsed.trainers.length === 0) {
      parsed.trainers = defaultTrainers;
      modified = true;
    }
    if (!parsed.trainings || parsed.trainings.length === 0) {
      parsed.trainings = defaultTrainings;
      modified = true;
    }
    if (!parsed.blog) {
      parsed.blog = defaultBlogPosts;
      modified = true;
    }
    if (!parsed.cms) {
      parsed.cms = defaultCms;
      modified = true;
    }
    if (!parsed.motivations || parsed.motivations.length === 0) {
      parsed.motivations = defaultMotivations;
      modified = true;
    }
    if (!parsed.teams) {
      parsed.teams = defaultTeams;
      modified = true;
    }
    if (!parsed.settings) {
      parsed.settings = defaultSettings;
      modified = true;
    }
    if (modified) {
      fs.writeFileSync(DB_FILE, JSON.stringify(parsed, null, 2), "utf-8");
    }
    return parsed;
  } catch {
    return {
      users: [],
      profiles: [],
      packages: defaultPackages,
      payments: [],
      paymentMethods: defaultPaymentMethods,
      trainers: defaultTrainers,
      trainings: defaultTrainings,
      organizations: [],
      blog: defaultBlogPosts,
      cms: defaultCms,
      motivations: defaultMotivations,
      teams: defaultTeams,
      settings: defaultSettings
    };
  }
}

function saveDb(data: DatabaseSchema): void {
  ensureDb();
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
}

export function normalizePhone(raw?: string | null): string | null {
  if (!raw) return null;
  const cleaned = raw.replace(/[^\d+]/g, "").trim();
  return cleaned || null;
}

export const dbStore = {
  getDb(): DatabaseSchema {
    return ensureDb();
  },

  findUserByEmail(email: string): StoredUser | null {
    const db = ensureDb();
    const normalized = email.trim().toLowerCase();
    return db.users.find((u) => u.email.toLowerCase() === normalized) || null;
  },

  findUserByPhone(phone: string): StoredUser | null {
    const db = ensureDb();
    const cleanPhone = normalizePhone(phone);
    if (!cleanPhone) return null;
    return db.users.find((u) => {
      const uPhone = normalizePhone(u.phone);
      return uPhone && uPhone === cleanPhone;
    }) || null;
  },

  findProfileByUserId(userId: string): StoredProfile | null {
    const db = ensureDb();
    return db.profiles.find((p) => p.userId === userId) || null;
  },

  getProfileWithUser(userId: string): { user: StoredUser; profile: StoredProfile } | null {
    const db = ensureDb();
    const user = db.users.find((u) => u.id === userId);
    if (!user) return null;
    let profile = db.profiles.find((p) => p.userId === userId);
    if (!profile) {
      const now = new Date().toISOString();
      const parts = (user.fullName || "Member Leader").trim().split(/\s+/);
      profile = {
        id: "prof-" + crypto.randomUUID().slice(0, 8),
        userId: user.id,
        firstName: parts[0] || "Member",
        lastName: parts.slice(1).join(" ") || "Leader",
        phone: user.phone,
        country: "Ethiopia",
        region: "Addis Ababa",
        city: "Bole",
        address: null,
        status: "ACTIVE",
        rank: "Starter IBO",
        referralCode: "UPLINE-" + user.id.slice(-4).toUpperCase(),
        avatarUrl: null,
        bio: null,
        telegramHandle: null,
        whatsappNumber: null,
        gender: null,
        titleOrOccupation: null,
        createdAt: now,
        updatedAt: now
      };
      db.profiles.push(profile);
      saveDb(db);
    }
    return { user, profile };
  },

  updateProfile(
    userId: string,
    updates: Partial<Omit<StoredProfile, "id" | "userId" | "createdAt">> & {
      fullName?: string;
      email?: string;
      phone?: string;
    }
  ): { user: StoredUser; profile: StoredProfile } | null {
    const db = ensureDb();
    const user = db.users.find((u) => u.id === userId);
    if (!user) return null;
    let profile = db.profiles.find((p) => p.userId === userId);
    const now = new Date().toISOString();

    if (!profile) {
      const parts = (user.fullName || "Member Leader").trim().split(/\s+/);
      profile = {
        id: "prof-" + crypto.randomUUID().slice(0, 8),
        userId: user.id,
        firstName: parts[0] || "Member",
        lastName: parts.slice(1).join(" ") || "Leader",
        phone: user.phone,
        country: "Ethiopia",
        region: "Addis Ababa",
        city: "Bole",
        address: null,
        status: "ACTIVE",
        rank: "Starter IBO",
        referralCode: "UPLINE-" + user.id.slice(-4).toUpperCase(),
        avatarUrl: null,
        bio: null,
        telegramHandle: null,
        whatsappNumber: null,
        gender: null,
        titleOrOccupation: null,
        createdAt: now,
        updatedAt: now
      };
      db.profiles.push(profile);
    }

    if (updates.fullName) {
      user.fullName = updates.fullName.trim();
      const parts = updates.fullName.trim().split(/\s+/);
      profile.firstName = parts[0] || profile.firstName;
      profile.lastName = parts.slice(1).join(" ") || profile.lastName;
    }
    if (updates.email) {
      user.email = updates.email.trim().toLowerCase();
    }
    if (updates.phone) {
      user.phone = normalizePhone(updates.phone) || updates.phone.trim();
      profile.phone = user.phone;
    }

    if (updates.avatarUrl !== undefined) profile.avatarUrl = updates.avatarUrl;
    if (updates.bio !== undefined) profile.bio = updates.bio;
    if (updates.telegramHandle !== undefined) profile.telegramHandle = updates.telegramHandle;
    if (updates.whatsappNumber !== undefined) profile.whatsappNumber = updates.whatsappNumber;
    if (updates.gender !== undefined) profile.gender = updates.gender;
    if (updates.titleOrOccupation !== undefined) profile.titleOrOccupation = updates.titleOrOccupation;
    if (updates.country !== undefined) profile.country = updates.country;
    if (updates.region !== undefined) profile.region = updates.region;
    if (updates.city !== undefined) profile.city = updates.city;
    if (updates.address !== undefined) profile.address = updates.address;
    if (updates.rank !== undefined) profile.rank = updates.rank;
    if (updates.packageType !== undefined) profile.packageType = updates.packageType;
    if (updates.teamName !== undefined) profile.teamName = updates.teamName;
    if (updates.status !== undefined) profile.status = updates.status;

    profile.updatedAt = now;
    user.updatedAt = now;
    saveDb(db);
    return { user, profile };
  },

  createUserWithProfile(params: {
    fullName: string;
    email: string;
    phone: string;
    passwordHash: string;
    role?: string;
    country?: string;
    region?: string;
    city?: string;
    address?: string;
    referralCode?: string;
    packageType?: string;
    status?: string;
  }): { user: StoredUser; profile: StoredProfile } {
    const db = ensureDb();

    const userId = "usr-" + crypto.randomUUID().slice(0, 8);
    const profileId = "prof-" + crypto.randomUUID().slice(0, 8);
    const now = new Date().toISOString();

    const parts = params.fullName.trim().split(/\s+/);
    const firstName = parts[0] || "Member";
    const lastName = parts.slice(1).join(" ") || "IBO";

    const normalizedEmail = params.email.trim().toLowerCase();
    const cleanPhone = normalizePhone(params.phone) || params.phone.trim();

    const newUser: StoredUser = {
      id: userId,
      organizationId: db.organizations[0]?.id || "org-default-01",
      email: normalizedEmail,
      phone: cleanPhone,
      fullName: params.fullName.trim(),
      passwordHash: params.passwordHash,
      role: params.role || "MEMBER",
      emailVerifiedAt: now,
      profileSetupCompleted: true,
      lastLoginAt: now,
      createdAt: now,
      updatedAt: now
    };

    const newProfile: StoredProfile = {
      id: profileId,
      userId: userId,
      firstName,
      lastName,
      phone: cleanPhone,
      country: params.country?.trim() || "Ethiopia",
      region: params.region?.trim() || "Addis Ababa",
      city: params.city?.trim() || "Addis Ababa",
      address: params.address?.trim() || "N/A",
      status: params.status || "PENDING_PAYMENT",
      rank: "Starter IBO",
      referralCode: "UP-" + crypto.randomBytes(3).toString("hex").toUpperCase(),
      packageType: params.packageType || "Diamond",
      createdAt: now,
      updatedAt: now
    };

    db.users.push(newUser);
    db.profiles.push(newProfile);
    saveDb(db);

    return { user: newUser, profile: newProfile };
  },

  // ----------------------------------------------------
  // PACKAGE CRUD
  // ----------------------------------------------------
  getAllPackages(): StoredPackage[] {
    const db = ensureDb();
    return db.packages;
  },

  getPackageById(id: string): StoredPackage | null {
    const db = ensureDb();
    return db.packages.find((p) => p.id === id) || null;
  },

  createPackage(params: {
    name: string;
    priceETB: number;
    pv: number;
    badge?: string;
    description: string;
    features?: string[];
  }): StoredPackage {
    const db = ensureDb();
    const now = new Date().toISOString();
    const newPkg: StoredPackage = {
      id: "pkg-" + crypto.randomUUID().slice(0, 8),
      name: params.name.trim(),
      priceETB: Number(params.priceETB),
      pv: Number(params.pv),
      badge: params.badge?.trim() || undefined,
      description: params.description.trim(),
      features: params.features && params.features.length ? params.features : ["Standard Platform Access"],
      isActive: true,
      createdAt: now,
      updatedAt: now
    };
    db.packages.push(newPkg);
    saveDb(db);
    return newPkg;
  },

  updatePackage(
    id: string,
    updates: Partial<Omit<StoredPackage, "id" | "createdAt">>
  ): StoredPackage | null {
    const db = ensureDb();
    const index = db.packages.findIndex((p) => p.id === id);
    if (index === -1) return null;

    db.packages[index] = {
      ...db.packages[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    saveDb(db);
    return db.packages[index];
  },

  deletePackage(id: string): boolean {
    const db = ensureDb();
    const initialLen = db.packages.length;
    db.packages = db.packages.filter((p) => p.id !== id);
    if (db.packages.length !== initialLen) {
      saveDb(db);
      return true;
    }
    return false;
  },

  // ----------------------------------------------------
  // MANUAL PAYMENT VERIFICATION QUEUE
  // ----------------------------------------------------
  getAllPayments(): StoredPaymentSubmission[] {
    const db = ensureDb();
    return db.payments;
  },

  createPaymentSubmission(params: {
    userId: string;
    userName: string;
    userEmail: string;
    userPhone: string;
    packageId: string;
    packageName: string;
    amountETB: number;
    paymentMethod: string;
    transactionRef: string;
    receiptScreenshotUrl: string;
  }): StoredPaymentSubmission {
    const db = ensureDb();
    const now = new Date().toISOString();
    const newPayment: StoredPaymentSubmission = {
      id: "pay-" + crypto.randomUUID().slice(0, 8),
      userId: params.userId,
      userName: params.userName,
      userEmail: params.userEmail,
      userPhone: params.userPhone,
      packageId: params.packageId,
      packageName: params.packageName,
      amountETB: Number(params.amountETB),
      paymentMethod: params.paymentMethod,
      transactionRef: params.transactionRef.trim(),
      receiptScreenshotUrl: params.receiptScreenshotUrl,
      status: "PENDING_VERIFICATION",
      createdAt: now,
      updatedAt: now
    };
    db.payments.unshift(newPayment);
    saveDb(db);
    return newPayment;
  },

  approvePayment(
    paymentId: string,
    adminNotes?: string,
    verifiedBy = "Super Admin"
  ): StoredPaymentSubmission | null {
    const db = ensureDb();
    const payment = db.payments.find((p) => p.id === paymentId);
    if (!payment) return null;

    const now = new Date().toISOString();
    payment.status = "APPROVED";
    payment.adminNotes = adminNotes;
    payment.verifiedAt = now;
    payment.verifiedBy = verifiedBy;
    payment.updatedAt = now;

    // Also activate the user profile and set their package
    const profile = db.profiles.find((p) => p.userId === payment.userId);
    if (profile) {
      profile.status = "ACTIVE";
      profile.packageType = payment.packageName;
      profile.updatedAt = now;
    }

    saveDb(db);
    return payment;
  },

  rejectPayment(
    paymentId: string,
    reason?: string,
    verifiedBy = "Super Admin"
  ): StoredPaymentSubmission | null {
    const db = ensureDb();
    const payment = db.payments.find((p) => p.id === paymentId);
    if (!payment) return null;

    const now = new Date().toISOString();
    payment.status = "REJECTED";
    payment.adminNotes = reason || "Payment verification failed. Invalid receipt reference.";
    payment.verifiedAt = now;
    payment.verifiedBy = verifiedBy;
    payment.updatedAt = now;

    saveDb(db);
    return payment;
  },

  // ----------------------------------------------------
  // PAYMENT METHODS CRUD
  // ----------------------------------------------------
  getAllPaymentMethods(onlyActive = false): StoredPaymentMethod[] {
    const db = ensureDb();
    if (onlyActive) {
      return db.paymentMethods.filter((pm) => pm.isActive);
    }
    return db.paymentMethods;
  },

  getPaymentMethodById(id: string): StoredPaymentMethod | null {
    const db = ensureDb();
    return db.paymentMethods.find((pm) => pm.id === id) || null;
  },

  createPaymentMethod(params: {
    name: string;
    accountName: string;
    accountNumber: string;
    type?: "BANK" | "MOBILE_MONEY" | "CRYPTO" | "CASH";
    instructions?: string;
  }): StoredPaymentMethod {
    const db = ensureDb();
    const now = new Date().toISOString();
    const newMethod: StoredPaymentMethod = {
      id: "pm-" + crypto.randomUUID().slice(0, 8),
      name: params.name.trim(),
      accountName: params.accountName.trim(),
      accountNumber: params.accountNumber.trim(),
      type: params.type || "BANK",
      instructions: params.instructions?.trim(),
      isActive: true,
      createdAt: now,
      updatedAt: now
    };
    db.paymentMethods.push(newMethod);
    saveDb(db);
    return newMethod;
  },

  updatePaymentMethod(
    id: string,
    updates: Partial<Omit<StoredPaymentMethod, "id" | "createdAt">>
  ): StoredPaymentMethod | null {
    const db = ensureDb();
    const index = db.paymentMethods.findIndex((pm) => pm.id === id);
    if (index === -1) return null;

    db.paymentMethods[index] = {
      ...db.paymentMethods[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    saveDb(db);
    return db.paymentMethods[index];
  },

  deletePaymentMethod(id: string): boolean {
    const db = ensureDb();
    const initialLen = db.paymentMethods.length;
    db.paymentMethods = db.paymentMethods.filter((pm) => pm.id !== id);
    if (db.paymentMethods.length !== initialLen) {
      saveDb(db);
      return true;
    }
    return false;
  },

  // ----------------------------------------------------
  // TRAINERS MANAGEMENT
  // ----------------------------------------------------
  getAllTrainers(onlyActive = false): StoredTrainer[] {
    const db = ensureDb();
    if (onlyActive) return db.trainers.filter((t) => t.isActive);
    return db.trainers;
  },

  getTrainerById(id: string): StoredTrainer | null {
    const db = ensureDb();
    return db.trainers.find((t) => t.id === id) || null;
  },

  createTrainer(params: {
    name: string;
    email: string;
    phone: string;
    specialization: string;
    bio: string;
    teamAssigned?: string;
    assignedTrainings?: string[];
    password?: string;
  }): StoredTrainer {
    const db = ensureDb();
    const now = new Date().toISOString();
    const trainerId = "trn-" + crypto.randomUUID().slice(0, 8);
    const userId = "usr-" + crypto.randomUUID().slice(0, 8);
    const rawPassword = params.password?.trim() || "Trainer@2026";

    // 1. Create Trainer Entity
    const newTrainer: StoredTrainer = {
      id: trainerId,
      userId,
      name: params.name.trim(),
      email: params.email.trim().toLowerCase(),
      phone: params.phone.trim(),
      specialization: params.specialization.trim(),
      bio: params.bio.trim(),
      rating: 5.0,
      assignedCoursesCount: params.assignedTrainings?.length || 0,
      isActive: true,
      teamAssigned: params.teamAssigned?.trim() || "Trainers Faculty",
      assignedTrainings: params.assignedTrainings || [],
      rawPassword,
      createdAt: now,
      updatedAt: now
    };

    // 2. Create User Credentials in db.users so Trainer can log in
    const existingUserIndex = db.users.findIndex((u) => u.email.toLowerCase() === newTrainer.email);
    if (existingUserIndex === -1) {
      db.users.push({
        id: userId,
        organizationId: db.organizations[0]?.id || "org-default-01",
        email: newTrainer.email,
        phone: newTrainer.phone,
        fullName: newTrainer.name,
        passwordHash: rawPassword, // Supports direct verify and demo hash
        role: "TRAINER",
        emailVerifiedAt: now,
        profileSetupCompleted: true,
        lastLoginAt: null,
        createdAt: now,
        updatedAt: now
      });

      db.profiles.push({
        id: "prof-" + crypto.randomUUID().slice(0, 8),
        userId,
        firstName: newTrainer.name.split(" ")[0] || "Trainer",
        lastName: newTrainer.name.split(" ").slice(1).join(" ") || "Faculty",
        phone: newTrainer.phone,
        country: "Ethiopia",
        region: "Addis Ababa",
        city: "Addis Ababa",
        address: "HQ Suite",
        status: "ACTIVE",
        rank: "Master Trainer",
        referralCode: "TRN-" + crypto.randomBytes(3).toString("hex").toUpperCase(),
        packageType: "Diamond Leader",
        teamName: newTrainer.teamAssigned,
        assignedTrainings: newTrainer.assignedTrainings,
        rawPassword,
        createdAt: now,
        updatedAt: now
      });
    }

    // 3. Update course trainer links if assignedTrainings are selected
    if (params.assignedTrainings && params.assignedTrainings.length > 0) {
      db.trainings.forEach((t) => {
        if (params.assignedTrainings?.includes(t.id)) {
          t.trainerId = trainerId;
          t.trainerName = newTrainer.name;
          t.trainerPhone = newTrainer.phone;
          t.updatedAt = now;
        }
      });
    }

    db.trainers.push(newTrainer);
    saveDb(db);
    return newTrainer;
  },

  updateTrainer(
    id: string,
    updates: Partial<Omit<StoredTrainer, "id" | "createdAt">> & {
      password?: string;
    }
  ): StoredTrainer | null {
    const db = ensureDb();
    const index = db.trainers.findIndex((t) => t.id === id);
    if (index === -1) return null;

    const now = new Date().toISOString();
    const trainer = db.trainers[index];
    const newPassword = updates.password?.trim();

    if (newPassword) {
      updates.rawPassword = newPassword;
      // Sync to user account
      const user = db.users.find((u) => u.email.toLowerCase() === trainer.email.toLowerCase());
      if (user) {
        user.passwordHash = newPassword;
        user.updatedAt = now;
      }
    }

    if (updates.email && updates.email !== trainer.email) {
      const user = db.users.find((u) => u.email.toLowerCase() === trainer.email.toLowerCase());
      if (user) {
        user.email = updates.email.toLowerCase();
        user.updatedAt = now;
      }
    }

    if (updates.name && updates.name !== trainer.name) {
      const user = db.users.find((u) => u.email.toLowerCase() === trainer.email.toLowerCase());
      if (user) {
        user.fullName = updates.name;
        user.updatedAt = now;
      }
    }

    // Update assigned trainings
    if (updates.assignedTrainings) {
      updates.assignedCoursesCount = updates.assignedTrainings.length;
      db.trainings.forEach((t) => {
        if (updates.assignedTrainings?.includes(t.id)) {
          t.trainerId = trainer.id;
          t.trainerName = updates.name || trainer.name;
          t.trainerPhone = updates.phone || trainer.phone;
          t.updatedAt = now;
        } else if (t.trainerId === trainer.id) {
          t.trainerId = undefined;
          t.trainerName = undefined;
          t.trainerPhone = undefined;
          t.updatedAt = now;
        }
      });
    }

    db.trainers[index] = {
      ...trainer,
      ...updates,
      updatedAt: now
    };
    saveDb(db);
    return db.trainers[index];
  },

  deleteTrainer(id: string): boolean {
    const db = ensureDb();
    const trainer = db.trainers.find((t) => t.id === id);
    if (!trainer) return false;

    // Remove course links
    db.trainings.forEach((t) => {
      if (t.trainerId === id) {
        t.trainerId = undefined;
        t.trainerName = undefined;
        t.trainerPhone = undefined;
      }
    });

    db.trainers = db.trainers.filter((t) => t.id !== id);
    saveDb(db);
    return true;
  },

  assignTrainerToTeamAndTraining(
    trainerId: string,
    teamName?: string,
    trainingIds?: string[]
  ): StoredTrainer | null {
    const db = ensureDb();
    const trainer = db.trainers.find((t) => t.id === trainerId);
    if (!trainer) return null;

    const now = new Date().toISOString();
    if (teamName) trainer.teamAssigned = teamName;
    if (trainingIds) {
      trainer.assignedTrainings = trainingIds;
      trainer.assignedCoursesCount = trainingIds.length;
      db.trainings.forEach((t) => {
        if (trainingIds.includes(t.id)) {
          t.trainerId = trainer.id;
          t.trainerName = trainer.name;
          t.trainerPhone = trainer.phone;
          t.updatedAt = now;
        }
      });
    }

    trainer.updatedAt = now;
    saveDb(db);
    return trainer;
  },

  // ----------------------------------------------------
  // TEAM MEMBERS CRUD & ASSIGNMENTS & CREDENTIALS
  // ----------------------------------------------------
  getAllMembers(params?: {
    teamName?: string;
    rank?: string;
    status?: string;
    query?: string;
  }): Array<{ user: StoredUser; profile: StoredProfile }> {
    const db = ensureDb();
    let result: Array<{ user: StoredUser; profile: StoredProfile }> = [];

    for (const user of db.users) {
      const profile = db.profiles.find((p) => p.userId === user.id) || {
        id: "prof-" + user.id,
        userId: user.id,
        firstName: user.fullName?.split(" ")[0] || "Member",
        lastName: user.fullName?.split(" ").slice(1).join(" ") || "IBO",
        phone: user.phone,
        country: "Ethiopia",
        region: "Addis Ababa",
        city: "Addis Ababa",
        address: "N/A",
        status: "ACTIVE",
        rank: "Starter IBO",
        referralCode: "UP-" + user.id.slice(0, 4).toUpperCase(),
        packageType: "Bronze Starter",
        teamName: "Addis Pioneers Squad",
        assignedTrainings: ["trn-course-01"],
        rawPassword: "Member@2026",
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      };

      if (params?.teamName && params.teamName !== "ALL") {
        if (profile.teamName?.toLowerCase() !== params.teamName.toLowerCase()) continue;
      }
      if (params?.rank && params.rank !== "ALL") {
        const matchesRank = profile.rank?.toLowerCase().includes(params.rank.toLowerCase()) ||
          profile.packageType?.toLowerCase().includes(params.rank.toLowerCase());
        if (!matchesRank) continue;
      }
      if (params?.status && params.status !== "ALL") {
        if (profile.status !== params.status) continue;
      }
      if (params?.query) {
        const q = params.query.toLowerCase();
        const full = `${user.fullName} ${user.email} ${user.phone} ${profile.teamName}`.toLowerCase();
        if (!full.includes(q)) continue;
      }

      result.push({ user, profile });
    }

    return result;
  },

  getMemberById(userId: string): { user: StoredUser; profile: StoredProfile } | null {
    const db = ensureDb();
    const user = db.users.find((u) => u.id === userId);
    if (!user) return null;
    const profile = db.profiles.find((p) => p.userId === userId) || {
      id: "prof-" + user.id,
      userId: user.id,
      firstName: user.fullName?.split(" ")[0] || "Member",
      lastName: user.fullName?.split(" ").slice(1).join(" ") || "IBO",
      phone: user.phone,
      country: "Ethiopia",
      region: "Addis Ababa",
      city: "Addis Ababa",
      address: "N/A",
      status: "ACTIVE",
      rank: "Starter IBO",
      referralCode: "UP-" + user.id.slice(0, 4).toUpperCase(),
      packageType: "Bronze Starter",
      teamName: "Addis Pioneers Squad",
      assignedTrainings: ["trn-course-01"],
      rawPassword: "Member@2026",
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
    return { user, profile };
  },

  createMember(params: {
    fullName: string;
    email: string;
    phone: string;
    role?: string;
    rank?: string;
    packageType?: string;
    teamName?: string;
    assignedTrainings?: string[];
    password?: string;
    status?: string;
  }): { user: StoredUser; profile: StoredProfile } {
    const db = ensureDb();
    const now = new Date().toISOString();
    const userId = "usr-" + crypto.randomUUID().slice(0, 8);
    const profileId = "prof-" + crypto.randomUUID().slice(0, 8);
    const rawPassword = params.password?.trim() || "Member@2026";

    const parts = params.fullName.trim().split(/\s+/);
    const firstName = parts[0] || "Member";
    const lastName = parts.slice(1).join(" ") || "IBO";

    const newUser: StoredUser = {
      id: userId,
      organizationId: db.organizations[0]?.id || "org-default-01",
      email: params.email.trim().toLowerCase(),
      phone: params.phone.trim(),
      fullName: params.fullName.trim(),
      passwordHash: rawPassword,
      role: params.role || "MEMBER",
      emailVerifiedAt: now,
      profileSetupCompleted: true,
      lastLoginAt: null,
      createdAt: now,
      updatedAt: now
    };

    const newProfile: StoredProfile = {
      id: profileId,
      userId,
      firstName,
      lastName,
      phone: params.phone.trim(),
      country: "Ethiopia",
      region: "Addis Ababa",
      city: "Addis Ababa",
      address: "N/A",
      status: params.status || "ACTIVE",
      rank: params.rank || "Starter IBO",
      referralCode: "UP-" + crypto.randomBytes(3).toString("hex").toUpperCase(),
      packageType: params.packageType || "Silver Associate",
      teamName: params.teamName || "Addis Pioneers Squad",
      assignedTrainings: params.assignedTrainings || ["trn-course-01"],
      rawPassword,
      createdAt: now,
      updatedAt: now
    };

    db.users.push(newUser);
    db.profiles.push(newProfile);
    saveDb(db);

    return { user: newUser, profile: newProfile };
  },

  updateMember(
    userId: string,
    updates: {
      fullName?: string;
      email?: string;
      phone?: string;
      role?: string;
      rank?: string;
      packageType?: string;
      teamName?: string;
      assignedTrainings?: string[];
      password?: string;
      status?: string;
    }
  ): { user: StoredUser; profile: StoredProfile } | null {
    const db = ensureDb();
    const userIndex = db.users.findIndex((u) => u.id === userId);
    if (userIndex === -1) return null;

    const now = new Date().toISOString();
    const user = db.users[userIndex];
    let profile = db.profiles.find((p) => p.userId === userId);

    if (updates.fullName) user.fullName = updates.fullName.trim();
    if (updates.email) user.email = updates.email.trim().toLowerCase();
    if (updates.phone) user.phone = updates.phone.trim();
    if (updates.role) user.role = updates.role;
    if (updates.password) user.passwordHash = updates.password.trim();
    user.updatedAt = now;

    if (profile) {
      if (updates.fullName) {
        const parts = updates.fullName.trim().split(/\s+/);
        profile.firstName = parts[0] || profile.firstName;
        profile.lastName = parts.slice(1).join(" ") || profile.lastName;
      }
      if (updates.phone) profile.phone = updates.phone.trim();
      if (updates.rank) profile.rank = updates.rank;
      if (updates.packageType) profile.packageType = updates.packageType;
      if (updates.teamName) profile.teamName = updates.teamName;
      if (updates.assignedTrainings) profile.assignedTrainings = updates.assignedTrainings;
      if (updates.password) profile.rawPassword = updates.password.trim();
      if (updates.status) profile.status = updates.status;
      profile.updatedAt = now;
    } else {
      profile = {
        id: "prof-" + userId,
        userId,
        firstName: user.fullName?.split(" ")[0] || "Member",
        lastName: user.fullName?.split(" ").slice(1).join(" ") || "IBO",
        phone: user.phone,
        country: "Ethiopia",
        region: "Addis Ababa",
        city: "Addis Ababa",
        address: "N/A",
        status: updates.status || "ACTIVE",
        rank: updates.rank || "Starter IBO",
        referralCode: "UP-" + userId.slice(0, 4).toUpperCase(),
        packageType: updates.packageType || "Silver Associate",
        teamName: updates.teamName || "Addis Pioneers Squad",
        assignedTrainings: updates.assignedTrainings || ["trn-course-01"],
        rawPassword: updates.password || "Member@2026",
        createdAt: now,
        updatedAt: now
      };
      db.profiles.push(profile);
    }

    saveDb(db);
    return { user, profile };
  },

  deleteMember(userId: string): boolean {
    const db = ensureDb();
    const initialUsers = db.users.length;
    db.users = db.users.filter((u) => u.id !== userId);
    db.profiles = db.profiles.filter((p) => p.userId !== userId);
    if (db.users.length !== initialUsers) {
      saveDb(db);
      return true;
    }
    return false;
  },

  assignMemberToTeamAndTraining(
    userId: string,
    teamName?: string,
    trainingIds?: string[]
  ): { user: StoredUser; profile: StoredProfile } | null {
    const db = ensureDb();
    const user = db.users.find((u) => u.id === userId);
    if (!user) return null;

    const profile = db.profiles.find((p) => p.userId === userId);
    if (!profile) return null;

    const now = new Date().toISOString();
    if (teamName) profile.teamName = teamName;
    if (trainingIds) profile.assignedTrainings = trainingIds;
    profile.updatedAt = now;

    saveDb(db);
    return { user, profile };
  },

  // ----------------------------------------------------
  // TRAINING MODULES CRUD & MATERIAL UPLOADS
  // ----------------------------------------------------
  getAllTrainings(filterLevel?: string): StoredTrainingCourse[] {
    const db = ensureDb();
    if (filterLevel && filterLevel !== "ALL") {
      return db.trainings.filter((t) => t.level === filterLevel);
    }
    return db.trainings;
  },

  getTrainingById(id: string): StoredTrainingCourse | null {
    const db = ensureDb();
    return db.trainings.find((t) => t.id === id) || null;
  },

  createTraining(params: {
    title: string;
    level: "BASIC" | "ADVANCED" | "SYSTEM" | "LEADERSHIP";
    category: string;
    description: string;
    durationMinutes: number;
    format: "VIDEO" | "AUDIO" | "PPT" | "HYBRID";
    mediaUrl?: string;
    trainerId?: string;
    cohortStartTime?: string;
  }): StoredTrainingCourse {
    const db = ensureDb();
    const now = new Date().toISOString();

    let trainerName = undefined;
    let trainerPhone = undefined;
    if (params.trainerId) {
      const trainer = db.trainers.find((t) => t.id === params.trainerId);
      if (trainer) {
        trainerName = trainer.name;
        trainerPhone = trainer.phone;
        trainer.assignedCoursesCount = (trainer.assignedCoursesCount || 0) + 1;
      }
    }

    const newCourse: StoredTrainingCourse = {
      id: "trn-course-" + crypto.randomUUID().slice(0, 8),
      title: params.title.trim(),
      level: params.level,
      category: params.category.trim(),
      description: params.description.trim(),
      durationMinutes: Number(params.durationMinutes) || 25,
      format: params.format,
      mediaUrl: params.mediaUrl?.trim() || "https://www.youtube.com/embed/dQw4w9WgXcQ",
      trainerId: params.trainerId,
      trainerName,
      trainerPhone,
      materials: [],
      quizQuestions: [
        {
          question: `What is the key takeaway from ${params.title.trim()}?`,
          options: ["Take immediate action with consistency", "Wait for someone else to build your team", "Ignore the proven upline system", "Give up after the first refusal"],
          correctIndex: 0,
          explanation: "Consistent daily action produces massive residual growth."
        }
      ],
      cohortStartTime: params.cohortStartTime?.trim() || "Scheduled Cohort (Equal Time)",
      isActive: true,
      enrolledCount: 0,
      createdAt: now,
      updatedAt: now
    };

    db.trainings.push(newCourse);
    saveDb(db);
    return newCourse;
  },

  updateTraining(
    id: string,
    updates: Partial<Omit<StoredTrainingCourse, "id" | "createdAt">>
  ): StoredTrainingCourse | null {
    const db = ensureDb();
    const index = db.trainings.findIndex((t) => t.id === id);
    if (index === -1) return null;

    if (updates.trainerId && updates.trainerId !== db.trainings[index].trainerId) {
      const newTrainer = db.trainers.find((t) => t.id === updates.trainerId);
      if (newTrainer) {
        updates.trainerName = newTrainer.name;
        updates.trainerPhone = newTrainer.phone;
      }
    }

    db.trainings[index] = {
      ...db.trainings[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    saveDb(db);
    return db.trainings[index];
  },

  deleteTraining(id: string): boolean {
    const db = ensureDb();
    const initialLen = db.trainings.length;
    db.trainings = db.trainings.filter((t) => t.id !== id);
    if (db.trainings.length !== initialLen) {
      saveDb(db);
      return true;
    }
    return false;
  },

  assignTrainerToTraining(trainingId: string, trainerId: string): StoredTrainingCourse | null {
    const db = ensureDb();
    const training = db.trainings.find((t) => t.id === trainingId);
    const trainer = db.trainers.find((t) => t.id === trainerId);
    if (!training || !trainer) return null;

    training.trainerId = trainer.id;
    training.trainerName = trainer.name;
    training.trainerPhone = trainer.phone;
    training.updatedAt = new Date().toISOString();

    trainer.assignedCoursesCount = (trainer.assignedCoursesCount || 0) + 1;
    saveDb(db);
    return training;
  },

  addMaterialToTraining(
    trainingId: string,
    material: {
      name: string;
      type: "PPT" | "PDF" | "AUDIO" | "VIDEO" | "DOC";
      fileUrl: string;
      fileSize?: string;
      description?: string;
    }
  ): StoredTrainingMaterial | null {
    const db = ensureDb();
    const training = db.trainings.find((t) => t.id === trainingId);
    if (!training) return null;

    const newMaterial: StoredTrainingMaterial = {
      id: "mat-" + crypto.randomUUID().slice(0, 8),
      name: material.name.trim(),
      type: material.type,
      fileUrl: material.fileUrl.trim(),
      fileSize: material.fileSize || "3.5 MB",
      description: material.description?.trim(),
      uploadedAt: new Date().toISOString()
    };

    if (!training.materials) training.materials = [];
    training.materials.push(newMaterial);
    training.updatedAt = new Date().toISOString();

    saveDb(db);
    return newMaterial;
  },

  removeMaterialFromTraining(trainingId: string, materialId: string): boolean {
    const db = ensureDb();
    const training = db.trainings.find((t) => t.id === trainingId);
    if (!training || !training.materials) return false;

    const initialLen = training.materials.length;
    training.materials = training.materials.filter((m) => m.id !== materialId);
    if (training.materials.length !== initialLen) {
      training.updatedAt = new Date().toISOString();
      saveDb(db);
      return true;
    }
    return false;
  },

  // ----------------------------------------------------
  // BLOG CRUD
  // ----------------------------------------------------
  getAllBlogPosts(publishedOnly = false): StoredBlogPost[] {
    const db = ensureDb();
    if (publishedOnly) return db.blog.filter((p) => p.isPublished);
    return db.blog;
  },

  getBlogPostBySlug(slug: string): StoredBlogPost | null {
    const db = ensureDb();
    return db.blog.find((p) => p.slug === slug) || null;
  },

  getBlogPostById(id: string): StoredBlogPost | null {
    const db = ensureDb();
    return db.blog.find((p) => p.id === id) || null;
  },

  createBlogPost(params: {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    coverImage?: string;
    author: string;
    authorRole: string;
    category: string;
    tags?: string[];
    readTimeMinutes?: number;
    isPublished?: boolean;
    featured?: boolean;
  }): StoredBlogPost {
    const db = ensureDb();
    const now = new Date().toISOString();
    const newPost: StoredBlogPost = {
      id: "blog-" + crypto.randomUUID().slice(0, 8),
      title: params.title.trim(),
      slug: params.slug.trim().toLowerCase().replace(/\s+/g, "-"),
      excerpt: params.excerpt.trim(),
      content: params.content.trim(),
      coverImage: params.coverImage?.trim(),
      author: params.author.trim(),
      authorRole: params.authorRole.trim(),
      category: params.category.trim(),
      tags: params.tags || [],
      readTimeMinutes: params.readTimeMinutes || 5,
      isPublished: params.isPublished ?? false,
      featured: params.featured ?? false,
      publishedAt: params.isPublished ? now : undefined,
      createdAt: now,
      updatedAt: now
    };
    db.blog.unshift(newPost);
    saveDb(db);
    return newPost;
  },

  updateBlogPost(
    id: string,
    updates: Partial<Omit<StoredBlogPost, "id" | "createdAt">>
  ): StoredBlogPost | null {
    const db = ensureDb();
    const index = db.blog.findIndex((p) => p.id === id);
    if (index === -1) return null;
    const wasPublished = db.blog[index].isPublished;
    const now = new Date().toISOString();
    db.blog[index] = {
      ...db.blog[index],
      ...updates,
      publishedAt:
        !wasPublished && updates.isPublished ? now : db.blog[index].publishedAt,
      updatedAt: now
    };
    saveDb(db);
    return db.blog[index];
  },

  deleteBlogPost(id: string): boolean {
    const db = ensureDb();
    const initialLen = db.blog.length;
    db.blog = db.blog.filter((p) => p.id !== id);
    if (db.blog.length !== initialLen) {
      saveDb(db);
      return true;
    }
    return false;
  },

  // ----------------------------------------------------
  // CMS CRUD
  // ----------------------------------------------------
  getCmsContent(): StoredCmsContent {
    const db = ensureDb();
    if (!db.cms) db.cms = defaultCms;
    if (!db.cms.footer) {
      db.cms.footer = defaultCms.footer;
      saveDb(db);
    }
    return db.cms;
  },

  updateHero(
    updates: Partial<Omit<StoredCmsHero, "stats">> & {
      stats?: Partial<StoredCmsHero["stats"]>;
    }
  ): StoredCmsHero {
    const db = ensureDb();
    if (!db.cms) db.cms = defaultCms;
    const currentHero = db.cms.hero || defaultCms.hero;
    db.cms.hero = {
      ...currentHero,
      ...updates,
      stats: {
        ...currentHero.stats,
        ...(updates.stats || {})
      }
    };
    saveDb(db);
    return db.cms.hero;
  },

  createTestimonial(params: Omit<StoredCmsTestimonial, "id">): StoredCmsTestimonial {
    const db = ensureDb();
    if (!db.cms) db.cms = defaultCms;
    const newT: StoredCmsTestimonial = {
      id: "tst-" + crypto.randomUUID().slice(0, 8),
      ...params
    };
    db.cms.testimonials.push(newT);
    saveDb(db);
    return newT;
  },

  updateTestimonial(
    id: string,
    updates: Partial<Omit<StoredCmsTestimonial, "id">>
  ): StoredCmsTestimonial | null {
    const db = ensureDb();
    if (!db.cms) db.cms = defaultCms;
    const index = db.cms.testimonials.findIndex((t) => t.id === id);
    if (index === -1) return null;
    db.cms.testimonials[index] = { ...db.cms.testimonials[index], ...updates };
    saveDb(db);
    return db.cms.testimonials[index];
  },

  deleteTestimonial(id: string): boolean {
    const db = ensureDb();
    if (!db.cms) return false;
    const initial = db.cms.testimonials.length;
    db.cms.testimonials = db.cms.testimonials.filter((t) => t.id !== id);
    if (db.cms.testimonials.length !== initial) { saveDb(db); return true; }
    return false;
  },

  createFaq(params: Omit<StoredCmsFaq, "id">): StoredCmsFaq {
    const db = ensureDb();
    if (!db.cms) db.cms = defaultCms;
    const newFaq: StoredCmsFaq = {
      id: "faq-" + crypto.randomUUID().slice(0, 8),
      ...params
    };
    db.cms.faqs.push(newFaq);
    db.cms.faqs.sort((a, b) => a.order - b.order);
    saveDb(db);
    return newFaq;
  },

  updateFaq(
    id: string,
    updates: Partial<Omit<StoredCmsFaq, "id">>
  ): StoredCmsFaq | null {
    const db = ensureDb();
    if (!db.cms) db.cms = defaultCms;
    const index = db.cms.faqs.findIndex((f) => f.id === id);
    if (index === -1) return null;
    db.cms.faqs[index] = { ...db.cms.faqs[index], ...updates };
    saveDb(db);
    return db.cms.faqs[index];
  },

  deleteFaq(id: string): boolean {
    const db = ensureDb();
    if (!db.cms) return false;
    const initial = db.cms.faqs.length;
    db.cms.faqs = db.cms.faqs.filter((f) => f.id !== id);
    if (db.cms.faqs.length !== initial) { saveDb(db); return true; }
    return false;
  },

  updateFooter(updates: Partial<StoredCmsFooter>): StoredCmsFooter {
    const db = ensureDb();
    if (!db.cms) db.cms = defaultCms;
    const currentFooter = db.cms.footer || defaultCms.footer;
    db.cms.footer = {
      ...currentFooter,
      ...updates,
      socialLinks: {
        ...currentFooter.socialLinks,
        ...(updates.socialLinks || {})
      },
      platformLinks: updates.platformLinks || currentFooter.platformLinks,
      companyLinks: updates.companyLinks || currentFooter.companyLinks
    };
    saveDb(db);
    return db.cms.footer;
  },

  // ----------------------------------------------------
  // DAILY MOTIVATION CRUD & TARGETED DISPATCH
  // ----------------------------------------------------
  getAllMotivations(params?: {
    targetType?: string;
    status?: string;
    userId?: string;
    userRank?: string;
    userTeam?: string;
  }): StoredDailyMotivation[] {
    const db = ensureDb();
    let list = db.motivations || defaultMotivations;

    if (params?.status && params.status !== "ALL") {
      list = list.filter((m) => m.status === params.status);
    }
    if (params?.targetType && params.targetType !== "ALL") {
      list = list.filter((m) => m.targetType === params.targetType);
    }

    // Filter for a specific member's feed (shows ALL + their rank + their team + their personal direct messages)
    if (params?.userId) {
      list = list.filter((m) => {
        if (m.targetType === "ALL") return true;
        if (m.targetType === "SINGLE" && m.targetUserId === params.userId) return true;
        if (m.targetType === "RANK" && params.userRank && m.targetRank?.toLowerCase() === params.userRank.toLowerCase()) return true;
        if (m.targetType === "TEAM" && params.userTeam && m.targetTeam?.toLowerCase() === params.userTeam.toLowerCase()) return true;
        return false;
      });
    }

    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  getMotivationById(id: string): StoredDailyMotivation | null {
    const db = ensureDb();
    return (db.motivations || defaultMotivations).find((m) => m.id === id) || null;
  },

  createMotivation(params: {
    title: string;
    quote: string;
    author: string;
    authorRole?: string;
    category?: "Leadership" | "Perseverance" | "Vision" | "Teamwork" | "Action" | "Duplication" | "Mindset";
    amharicTranslation?: string;
    mediaUrl?: string;
    targetType: "ALL" | "TEAM" | "RANK" | "SINGLE";
    targetTeam?: string;
    targetRank?: string;
    targetUserId?: string;
    targetUserName?: string;
    deliveryChannel?: "DASHBOARD" | "SMS_SIMULATED" | "IN_APP_POPUP" | "ALL";
    status?: "SENT" | "SCHEDULED" | "DRAFT";
    scheduledFor?: string;
    sentBy?: string;
  }): StoredDailyMotivation {
    const db = ensureDb();
    if (!db.motivations) db.motivations = defaultMotivations;
    const now = new Date().toISOString();

    // Calculate recipient estimation based on target type
    let recipientsCount = 1;
    if (params.targetType === "ALL") {
      recipientsCount = db.profiles.length > 0 ? db.profiles.length : 12480;
    } else if (params.targetType === "RANK") {
      const matchCount = db.profiles.filter(
        (p) => p.packageType?.toLowerCase() === params.targetRank?.toLowerCase() || p.rank?.toLowerCase() === params.targetRank?.toLowerCase()
      ).length;
      recipientsCount = matchCount > 0 ? matchCount : 450;
    } else if (params.targetType === "TEAM") {
      recipientsCount = 85;
    }

    const isInstantSend = params.status === "SENT" || (!params.status && !params.scheduledFor);

    const newMotivation: StoredDailyMotivation = {
      id: "mot-" + crypto.randomUUID().slice(0, 8),
      title: params.title.trim(),
      quote: params.quote.trim(),
      author: params.author.trim(),
      authorRole: params.authorRole?.trim() || "Leadership Mentor",
      category: params.category || "Leadership",
      amharicTranslation: params.amharicTranslation?.trim(),
      mediaUrl: params.mediaUrl?.trim(),
      targetType: params.targetType,
      targetTeam: params.targetTeam?.trim(),
      targetRank: params.targetRank?.trim(),
      targetUserId: params.targetUserId?.trim(),
      targetUserName: params.targetUserName?.trim(),
      deliveryChannel: params.deliveryChannel || "ALL",
      status: isInstantSend ? "SENT" : (params.status || "SCHEDULED"),
      scheduledFor: params.scheduledFor,
      sentAt: isInstantSend ? now : undefined,
      sentBy: params.sentBy || "Super Admin",
      likesCount: 0,
      recipientsCount,
      createdAt: now,
      updatedAt: now
    };

    db.motivations.unshift(newMotivation);
    saveDb(db);
    return newMotivation;
  },

  updateMotivation(
    id: string,
    updates: Partial<Omit<StoredDailyMotivation, "id" | "createdAt">>
  ): StoredDailyMotivation | null {
    const db = ensureDb();
    if (!db.motivations) db.motivations = defaultMotivations;
    const index = db.motivations.findIndex((m) => m.id === id);
    if (index === -1) return null;

    db.motivations[index] = {
      ...db.motivations[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    saveDb(db);
    return db.motivations[index];
  },

  deleteMotivation(id: string): boolean {
    const db = ensureDb();
    if (!db.motivations) return false;
    const initial = db.motivations.length;
    db.motivations = db.motivations.filter((m) => m.id !== id);
    if (db.motivations.length !== initial) {
      saveDb(db);
      return true;
    }
    return false;
  },

  likeMotivation(id: string): StoredDailyMotivation | null {
    const db = ensureDb();
    if (!db.motivations) db.motivations = defaultMotivations;
    const item = db.motivations.find((m) => m.id === id);
    if (!item) return null;
    item.likesCount = (item.likesCount || 0) + 1;
    item.updatedAt = new Date().toISOString();
    saveDb(db);
    return item;
  },

  sendMotivationNow(id: string): StoredDailyMotivation | null {
    const db = ensureDb();
    if (!db.motivations) db.motivations = defaultMotivations;
    const item = db.motivations.find((m) => m.id === id);
    if (!item) return null;
    item.status = "SENT";
    item.sentAt = new Date().toISOString();
    item.updatedAt = new Date().toISOString();
    saveDb(db);
    return item;
  },

  // ─── Teams CRUD ─────────────────────────────────────────────────────────

  getAllTeams(): StoredTeam[] {
    const db = ensureDb();
    if (!db.teams) db.teams = defaultTeams;
    return db.teams;
  },

  getTeamById(id: string): StoredTeam | null {
    const db = ensureDb();
    if (!db.teams) db.teams = defaultTeams;
    return db.teams.find((t) => t.id === id) || null;
  },

  createTeam(input: {
    name: string;
    description?: string;
    leaderId?: string;
    leaderName?: string;
    leaderEmail?: string;
    color?: string;
    region?: string;
  }): StoredTeam {
    const db = ensureDb();
    if (!db.teams) db.teams = defaultTeams;
    const now = new Date().toISOString();
    const team: StoredTeam = {
      id: `team-${crypto.randomBytes(4).toString("hex")}`,
      name: input.name.trim(),
      description: input.description,
      leaderId: input.leaderId,
      leaderName: input.leaderName,
      leaderEmail: input.leaderEmail,
      color: input.color || "#6366f1",
      memberIds: [],
      memberCount: 0,
      region: input.region,
      isActive: true,
      createdAt: now,
      updatedAt: now
    };
    db.teams.push(team);
    saveDb(db);
    return team;
  },

  updateTeam(
    id: string,
    updates: Partial<Omit<StoredTeam, "id" | "createdAt" | "memberCount">>
  ): StoredTeam | null {
    const db = ensureDb();
    if (!db.teams) db.teams = defaultTeams;
    const idx = db.teams.findIndex((t) => t.id === id);
    if (idx === -1) return null;
    db.teams[idx] = { ...db.teams[idx], ...updates, updatedAt: new Date().toISOString() };
    db.teams[idx].memberCount = db.teams[idx].memberIds?.length || 0;
    saveDb(db);
    return db.teams[idx];
  },

  deleteTeam(id: string): boolean {
    const db = ensureDb();
    if (!db.teams) return false;
    const before = db.teams.length;
    db.teams = db.teams.filter((t) => t.id !== id);
    if (db.teams.length < before) {
      saveDb(db);
      return true;
    }
    return false;
  },

  addMemberToTeam(teamId: string, userId: string): StoredTeam | null {
    const db = ensureDb();
    if (!db.teams) db.teams = defaultTeams;
    const team = db.teams.find((t) => t.id === teamId);
    if (!team) return null;
    if (!team.memberIds.includes(userId)) {
      team.memberIds.push(userId);
      team.memberCount = team.memberIds.length;
      team.updatedAt = new Date().toISOString();
      // Also sync teamName on the profile
      const profile = db.profiles.find((p) => p.userId === userId);
      if (profile) {
        profile.teamName = team.name;
        profile.updatedAt = new Date().toISOString();
      }
      saveDb(db);
    }
    return team;
  },

  removeMemberFromTeam(teamId: string, userId: string): StoredTeam | null {
    const db = ensureDb();
    if (!db.teams) db.teams = defaultTeams;
    const team = db.teams.find((t) => t.id === teamId);
    if (!team) return null;
    team.memberIds = team.memberIds.filter((id) => id !== userId);
    team.memberCount = team.memberIds.length;
    team.updatedAt = new Date().toISOString();
    // Clear teamName from profile if it matches this team
    const profile = db.profiles.find((p) => p.userId === userId);
    if (profile && profile.teamName === team.name) {
      profile.teamName = null;
      profile.updatedAt = new Date().toISOString();
    }
    saveDb(db);
    return team;
  },

  getTeamMembers(teamId: string): Array<{ user: StoredUser; profile: StoredProfile | null }> {
    const db = ensureDb();
    if (!db.teams) db.teams = defaultTeams;
    const team = db.teams.find((t) => t.id === teamId);
    if (!team) return [];
    return team.memberIds.map((uid) => ({
      user: db.users.find((u) => u.id === uid) as StoredUser,
      profile: db.profiles.find((p) => p.userId === uid) || null
    })).filter((item) => !!item.user);
  },

  // ─── Settings CRUD ───────────────────────────────────────────────────────

  getSettings(): StoredSettings {
    const db = ensureDb();
    if (!db.settings) {
      db.settings = defaultSettings;
      saveDb(db);
    }
    return db.settings;
  },

  updateSettings(updates: Partial<Omit<StoredSettings, "id">>): StoredSettings {
    const db = ensureDb();
    if (!db.settings) db.settings = defaultSettings;
    db.settings = {
      ...db.settings,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    saveDb(db);
    return db.settings;
  }
};
