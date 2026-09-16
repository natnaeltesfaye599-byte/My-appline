/**
 * Breakthrough Share Company & MyUpline
 * Central Configuration for Getting Started Booklet & Prospect Qualifier Funnel
 * Allows full CRUD by Super Admin with persistence in localStorage and defaults
 */

// ─────────────────────────────────────────────────────────────────────────────
// 1. GETTING STARTED BOOKLET CONFIGURATION TYPES (Breakthrough 6-Page Form)
// ─────────────────────────────────────────────────────────────────────────────

export interface LeaderTestimonyConfig {
  id: string;
  name: string;
  role: string;
  experience: string;
  quote: string;
  avatar: string;
  badgeColor: string;
  dayOne: string;
  now: string;
}

export interface ChecklistItemConfig {
  id: string;
  label: string;
  category?: string;
}

export interface GettingStartedConfig {
  // Page 1: Welcome & Ethos
  companyName: string;
  documentRefPrefix: string;
  welcomeHeadline: string;
  welcomeDescription: string;
  visionTitle: string;
  visionDescription: string;
  duplicationTitle: string;
  duplicationDescription: string;
  leadershipTitle: string;
  leadershipDescription: string;

  // Page 2: 1st Day & Now Photos & Leader Testimonials
  defaultFirstDayPhoto: string;
  defaultNowPhoto: string;
  dayOneMilestones: string[];
  nowMilestones: string[];
  testimonials: LeaderTestimonyConfig[];

  // Page 3: Slide 2 Curriculum
  slide2Title: string;
  slide2Subtitle: string;
  slide2Pillars: {
    title: string;
    headline: string;
    points: string[];
  }[];
  slide2TakeawayQuote: string;

  // Page 4: Slide 3 Curriculum (Volume & Ranks)
  slide3Title: string;
  slide3Subtitle: string;
  pvDefinition: string;
  gvDefinition: string;
  ranks: {
    level: string;
    title: string;
    requirement: string;
    perks: string;
  }[];
  powerOfTwoSteps: {
    label: string;
    value: string;
  }[];

  // Page 5: Checklist & Q&A
  checklistItems: ChecklistItemConfig[];
  questions: {
    q1Prompt: string;
    q2Prompt: string;
    q3Prompt: string;
    q4Prompt: string;
  };

  // Page 6: Goal of MLP & Pledge
  mlpPillars: {
    title: string;
    headline: string;
    description: string;
  }[];
  pledgeDeclaration: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. PROSPECT QUALIFIER FUNNEL CONFIGURATION TYPES (Image 1 & Image 2)
// ─────────────────────────────────────────────────────────────────────────────

export interface ProspectQuestionConfig {
  id: string;
  number: number;
  titleAm: string;
  titleEn: string;
  placeholderAm?: string;
  placeholderEn?: string;
  type: "text" | "textarea" | "yes_no" | "slider_score";
}

export interface ProspectFunnelConfig {
  // Phase 1: 3-Step Screening Slogans (Image 1)
  step1: {
    badgeAm: string;
    badgeEn: string;
    headlineAm: string;
    headlineEn: string;
    subheadlineAm: string;
    subheadlineEn: string;
    buttonAm: string;
    buttonEn: string;
  };
  step2: {
    badgeAm: string;
    badgeEn: string;
    headlineAm: string;
    headlineEn: string;
    subheadlineAm: string;
    subheadlineEn: string;
    buttonAm: string;
    buttonEn: string;
  };
  step3: {
    badgeAm: string;
    badgeEn: string;
    headlineAm: string;
    headlineEn: string;
    highlightAm: string;
    highlightEn: string;
    subheadlineAm: string;
    subheadlineEn: string;
    buttonAm: string;
    buttonEn: string;
  };

  // Phase 2: The 9 Questions & Readiness Settings (Image 2)
  questions: ProspectQuestionConfig[];
  readinessCutoffPercentage: number; // default: 50%
  requireTelegramUsername: boolean;
  requireAddress: boolean;
  successMessageAm: string;
  successMessageEn: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// DEFAULT CONFIGURATIONS (MATCHING USER HANDWRITTEN REQUIREMENTS)
// ─────────────────────────────────────────────────────────────────────────────

export const defaultGettingStartedConfig: GettingStartedConfig = {
  companyName: "Breakthrough Share Company",
  documentRefPrefix: "BSC-GSF",
  welcomeHeadline: "Welcome to Breakthrough Share Company",
  welcomeDescription:
    "You have just stepped into Ethiopia’s premier entrepreneurship and organizational growth platform. At Breakthrough Share Company, our mission is to empower visionaries like you with the tools, mentorship, and system duplication needed to achieve unconditional financial freedom.",
  visionTitle: "Our Vision",
  visionDescription: "Building a nationwide community of self-reliant entrepreneurs generating passive residual wealth.",
  duplicationTitle: "System Duplication",
  duplicationDescription: "A simple, proven 6-step blueprint designed so that every new partner can immediately copy and win.",
  leadershipTitle: "Ethical Leadership",
  leadershipDescription: "Rooted in integrity, collective uplift, continuous education, and active upline sponsorship.",

  defaultFirstDayPhoto:
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
  defaultNowPhoto:
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80",
  dayOneMilestones: [
    "Humble start, zero network marketing experience, big aspirations",
    "Nervous to make 3-way calls with strangers",
    "First 100 contact name list compiled on paper"
  ],
  nowMilestones: [
    "Diamond Director, keynote stage speaker, empowering thousands",
    "Scaled downlines across 4 Ethiopian regional states",
    "Passive monthly residual overrides & company car program recipient"
  ],

  testimonials: [
    {
      id: "test-1",
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
      id: "test-2",
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
      id: "test-3",
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
  ],

  slide2Title: "The First 48-Hour Blueprint & System Duplication Rules",
  slide2Subtitle: "Breakthrough Global Academy Curriculum • Slide 2",
  slide2Pillars: [
    {
      title: "1. The 48-Hour Window",
      headline: "First 48 Hours Dictate 80% of Growth",
      points: [
        "Never delay your launch. Enthusiasm and momentum are highest in hours 1–48.",
        "Compile a written list of at least 100 warm contacts without pre-judging anyone.",
        "Book your first 3-way launch call with your Upline Sponsor within 24 hours."
      ]
    },
    {
      title: "2. The 3 Golden Rules",
      headline: "Laws of Network Marketing Mastery",
      points: [
        "Simplicity Beats Genius: It doesn't matter what works; it only matters what duplicates.",
        "Never Present Alone in Week 1: Always leverage third-party upline authority.",
        "Tools over Talent: Let videos, PPTs, and booklets do the heavy lifting for you."
      ]
    },
    {
      title: "3. Daily DMO Formula",
      headline: "Daily Method of Operation (DMO)",
      points: [
        "5 New Contacts / Day: Connect with 5 warm or qualified prospects daily.",
        "2 Follow-Ups / Day: Follow up within 24–48 hours using Feel-Felt-Found.",
        "30 Min Audio/Book: Continuous personal development is non-negotiable."
      ]
    }
  ],
  slide2TakeawayQuote:
    "Amateurs convince; professionals sort. Use the 3-Way Call to let your upline leader answer objections while you take notes and learn.",

  slide3Title: "Volume Metrics (PV & GV) & Breakthrough Rank Pathways",
  slide3Subtitle: "Compensation Engine & Rank Matrix • Slide 3",
  pvDefinition:
    "Personal Volume (PV): Generated by your direct personal package enrollments and customer product orders. Keeps your account active.",
  gvDefinition:
    "Group Volume (GV): Cumulative volume generated across your entire downline organization depth. Drives rank upgrades and team matching overrides.",
  ranks: [
    { level: "1", title: "Starter / Bronze", requirement: "50 - 100 PV", perks: "Direct bonus eligibility, starter training kit access." },
    { level: "2", title: "Silver Associate", requirement: "5,000 GV Required", perks: "Team overrides, certified presenter badge." },
    { level: "3", title: "Gold Executive", requirement: "25,000 GV Required", perks: "Generational matching, VIP leadership seminars." },
    { level: "4", title: "Diamond Director", requirement: "150,000+ GV Required", perks: "Car bonus pool, international trips, profit sharing." }
  ],
  powerOfTwoSteps: [
    { label: "Month 1", value: "You + 2 = 2" },
    { label: "Month 3", value: "8 Members" },
    { label: "Month 6", value: "64 Members" },
    { label: "Month 12", value: "4,096 Members!" }
  ],

  checklistItems: [
    { id: "item-1", label: "Completed Getting Started Orientation with Upline Sponsor" },
    { id: "item-2", label: "Registered & activated official MyUpline digital command center" },
    { id: "item-3", label: "Downloaded Breakthrough Share Company presentation slides & compensation guide" },
    { id: "item-4", label: "Written down initial 100 Contact Name List Asset in workbook" },
    { id: "item-5", label: "Scheduled first 3 Three-Way Launch Calls with Upline Leader" },
    { id: "item-6", label: "Joined official Breakthrough Share Company Telegram & Announcement Channel" },
    { id: "item-7", label: "Watched 'Rise of Entrepreneur' Foundation Video (20 min)" },
    { id: "item-8", label: "Committed to Daily Method of Operation (DMO) schedule" }
  ],
  questions: {
    q1Prompt: "Question 1: Why did you decide to join Breakthrough Share Company, and what is your #1 emotional reason?",
    q2Prompt: "Question 2: What is your exact 30-day financial and recruitment target? (Income in ETB / New leaders enrolled)",
    q3Prompt: "Question 3: Who is your committed accountability partner and upline sponsor for the first 48 hours?",
    q4Prompt: "Question 4: How many hours per week are you committed to dedicating to your Breakthrough business?"
  },

  mlpPillars: [
    {
      title: "1. Financial Freedom",
      headline: "Eradicating Financial Scarcity",
      description: "Providing motivated individuals an institutionally backed vehicle to earn scalable residual income through ethical direct marketing."
    },
    {
      title: "2. Leadership Mastery",
      headline: "World-Class Human Development",
      description: "Developing public speakers, emotional intelligence, high-integrity sales leadership, and compassionate mentorship."
    },
    {
      title: "3. Generational Legacy",
      headline: "Transferrable Business Asset",
      description: "Building an unstoppable downline organization that yields lasting security and financial independence for your family."
    }
  ],
  pledgeDeclaration:
    "I commit to following the Breakthrough Share Company system, respecting the duplication protocol, honoring my upline and downline partners, and working consistently towards my written goals."
};

export const defaultProspectFunnelConfig: ProspectFunnelConfig = {
  step1: {
    badgeAm: "ደረጃ 1 • መግቢያ",
    badgeEn: "Step 1 • Qualification",
    headlineAm: "ይህ እድል አስተሳሰባቸውን ማሳደግ እና በገንዘብ ማደግ ለሚፈልጉ ሰዎች ብቻ የተዘጋጀ ነው።",
    headlineEn: "THIS is for People who want to Develop Attitude and grow financially.",
    subheadlineAm: "ከእነዚህ ሰዎች መካከል አንዱ ከሆኑ 'ቀጣይ' የሚለውን በመጫን ይቀጥሉ።",
    subheadlineEn: "If you are the one, Click NEXT.",
    buttonAm: "ቀጣይ (NEXT)",
    buttonEn: "NEXT"
  },
  step2: {
    badgeAm: "ደረጃ 2 • የሲስተም አሰራር",
    badgeEn: "Step 2 • The System",
    headlineAm: "ራስዎን በማብቃት እና ጠንካራ ቡድን በመገንባት ገቢ የሚያገኙበት ቀላል (SIMPLE) ሲስተም ነው።",
    headlineEn: "A SIMPLE system where you earn by developing yourself and Building a Strong Team.",
    subheadlineAm: "ዝግጁ ከሆኑ ወደ ቀጣዩ ደረጃ እንለፍ።",
    subheadlineEn: "If you are ready, let's proceed to the Next.",
    buttonAm: "ወደ ቀጣዩ እንለፍ (PROCEED TO NEXT)",
    buttonEn: "Proceed to the Next"
  },
  step3: {
    badgeAm: "ደረጃ 3 • የመጨረሻ ማጣሪያ",
    badgeEn: "Step 3 • Critical Filter",
    headlineAm: "ይህ ፈጣን ገንዘብ (Quick Money) ለሚፈልጉ ሰዎች በፍጹም አይደለም!",
    headlineEn: "THIS is Not for people who want quick money.",
    highlightAm: "እውነተኛ ነፃነትን (Freedom) ለሚፈልጉ ቁርጠኛ እና አላማ ላላቸው (Serious) ሰዎች ብቻ የተዘጋጀ ነው።",
    highlightEn: "It's only for Serious people who want freedom.",
    subheadlineAm: "ዝግጁ ከሆኑ የሚከተለውን ቅፅ በቁርጠኝነት ይሙሉ ↓↓",
    subheadlineEn: "If you are ready, fill this form Seriously ↓↓",
    buttonAm: "ቅፁን በሙሉ (Prospect Fill Page 2)",
    buttonEn: "Fill Prospect Form (Page 2)"
  },

  questions: [
    {
      id: "q-1",
      number: 1,
      titleAm: "1. ለአሁን ሰአት ምን ላይ ነው የምትሰራው?",
      titleEn: "1. What are you currently working on / what is your current job?",
      placeholderAm: "ለምሳሌ፡ የግል ንግድ፣ የመንግስት ሰራተኛ፣ ተማሪ፣ የድርጅት ሰራተኛ...",
      placeholderEn: "e.g. Corporate employee, private business owner, teacher, freelancer...",
      type: "text"
    },
    {
      id: "q-2",
      number: 2,
      titleAm: "2. ምን ማሳካት ትፈልጋለህ/ሽ?",
      titleEn: "2. What do you want to achieve?",
      placeholderAm: "በህይወትዎ፣ በገንዘብዎ ወይም በቤተሰብዎ ውስጥ ማሳካት የሚፈልጉትን ዋና አላማ ይፃፉ...",
      placeholderEn: "Describe the primary milestones, freedom, and goals you want to achieve...",
      type: "textarea"
    },
    {
      id: "q-3",
      number: 3,
      titleAm: "3. ለቤተሰብህ/ሽ የምትፈልገው/ቺው መኖርያ ቤት ምን አይነት ነው?",
      titleEn: "3. What kind of home/living house do you want for your family?",
      placeholderAm: "ለምሳሌ፡ ቪላ ቤት፣ ሰፊ አፓርታማ፣ ቦሌ ወይም ውብ ቦታ ላይ የተሰራ...",
      placeholderEn: "e.g. Spacious modern villa, luxury apartment in Bole, comfortable garden residence...",
      type: "text"
    },
    {
      id: "q-4",
      number: 4,
      titleAm: "4. በዓለም አቀፍ ደረጃ 3 የመንፈሳዊ ቦታዎችና መዝናኛ መጎብኘት የምትፈልጋቸው የት ናቸው?",
      titleEn: "4. At an international level, what are 3 spiritual/pilgrimage and vacation places you want to visit?",
      placeholderAm: "ለምሳሌ፡ 1. እየሩሳሌም/መካ፣ 2. ዱባይ፣ 3. ፓሪስ/ኢስታንቡል...",
      placeholderEn: "e.g. 1. Jerusalem/Mecca, 2. Dubai, 3. Paris/Switzerland...",
      type: "text"
    },
    {
      id: "q-5",
      number: 5,
      titleAm: "5. ከምትሰራው ስራ በጣም የምትጠላው ስራ ምንድን ነው?",
      titleEn: "5. From the work you currently do, what is the thing you hate the most?",
      placeholderAm: "ለምሳሌ፡ አነስተኛ ደሞዝ፣ አለቃ ጫና፣ የጊዜ እጥረት፣ የትራፊክ ሰአት...",
      placeholderEn: "e.g. Low pay, micromanaging boss, lack of free time, commuting, no growth...",
      type: "text"
    },
    {
      id: "q-6",
      number: 6,
      titleAm: "6. እንዲያውም በጣም ጥሩ ስራ ብታገኝ ወርሃዊ ገቢሽ/ህ ስንት ቢሆን ጥሩ ይመስልሃል/ሻል?",
      titleEn: "6. If you were to get a really good opportunity/job, what monthly income in ETB would be good for you?",
      placeholderAm: "ለምሳሌ፡ 50,000 ብር ወይም 100,000+ ብር በወር...",
      placeholderEn: "e.g. ETB 40,000 / month, ETB 100,000+ / month...",
      type: "text"
    },
    {
      id: "q-7",
      number: 7,
      titleAm: "7. ህልምህን/ሽን ለማሳካት በአሁን ሰአት ምን እየሰራህ/ሽ ነው?",
      titleEn: "7. What are you currently doing right now to achieve your dream?",
      placeholderAm: "ህልምዎን እውን ለማድረግ በአሁኑ ሰአት የወሰዱት እርምጃ...",
      placeholderEn: "What steps or investments are you actively taking today?...",
      type: "text"
    },
    {
      id: "q-8",
      number: 8,
      titleAm: "8. አሁን ባለህ/ሽ ነገር ብትቀጥል/ይ ህልምህን/ሽን ማሳካት የምትችል/ዪ ይመስልሃል/ሻል, Yes or No -> Yes በምን ያህል ጊዜ?",
      titleEn: "8. If you continue with what you currently have, do you think you can achieve your dream? (Yes or No)",
      placeholderAm: "ለምሳሌ፡ በ5 አመት፣ በ10 አመት...",
      placeholderEn: "e.g. In 5 years, in 10 years, in 15 years...",
      type: "yes_no"
    },
    {
      id: "q-9",
      number: 9,
      titleAm: "9. ፍላጎትህን/ሽን በእርግጠኝነት የሚያሳካልህ/ሽ እድል ብሰጥህ/ሽ ምን ያህል ዝግጁ ነህ/ሽ ለመቀበል? (0% - 50% - 100%)",
      titleEn: "9. If I give you an opportunity that will definitely fulfill your desire/dream, how ready are you to accept it?",
      type: "slider_score"
    }
  ],

  readinessCutoffPercentage: 50, // Image 2 bottom condition: > 50%
  requireTelegramUsername: true,
  requireAddress: true,
  successMessageAm: "እንኳን ደስ አለዎት! የዝግጁነት ውጤትዎ የተረጋገጠ ሲሆን የእርስዎ የBreakthrough Share Company መሪ በ24 ሰአት ውስጥ በቴሌግራም ወይም በስልክ ያገኝዎታል።",
  successMessageEn: "Congratulations! Your readiness is confirmed and a Breakthrough Share Company leader will contact you within 24 hours on Telegram/Phone."
};

// ─────────────────────────────────────────────────────────────────────────────
// STORAGE HELPERS (CRUD OPERATIONS)
// ─────────────────────────────────────────────────────────────────────────────

const GETTING_STARTED_STORAGE_KEY = "myupline_getting_started_config";
const PROSPECT_FUNNEL_STORAGE_KEY = "myupline_prospect_funnel_config";

export function getGettingStartedConfig(): GettingStartedConfig {
  if (typeof window === "undefined") return defaultGettingStartedConfig;
  try {
    const raw = window.localStorage.getItem(GETTING_STARTED_STORAGE_KEY);
    if (!raw) return defaultGettingStartedConfig;
    return { ...defaultGettingStartedConfig, ...JSON.parse(raw) };
  } catch {
    return defaultGettingStartedConfig;
  }
}

export function saveGettingStartedConfig(config: GettingStartedConfig): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(GETTING_STARTED_STORAGE_KEY, JSON.stringify(config));
}

export function getProspectFunnelConfig(): ProspectFunnelConfig {
  if (typeof window === "undefined") return defaultProspectFunnelConfig;
  try {
    const raw = window.localStorage.getItem(PROSPECT_FUNNEL_STORAGE_KEY);
    if (!raw) return defaultProspectFunnelConfig;
    return { ...defaultProspectFunnelConfig, ...JSON.parse(raw) };
  } catch {
    return defaultProspectFunnelConfig;
  }
}

export function saveProspectFunnelConfig(config: ProspectFunnelConfig): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PROSPECT_FUNNEL_STORAGE_KEY, JSON.stringify(config));
}
