export const locales = ["en", "am"] as const;
export type Locale = (typeof locales)[number];

export const dictionary = {
  en: {
    common: {
      save: "Save Changes",
      saving: "Saving...",
      saved: "Settings saved successfully!",
      cancel: "Cancel",
      delete: "Delete",
      edit: "Edit",
      create: "Create New",
      search: "Search...",
      filter: "Filter",
      export: "Export Roster",
      print: "Print View",
      copy: "Copy",
      copied: "Copied to clipboard!",
      close: "Close",
      dismiss: "Dismiss",
      view: "View",
      actions: "Actions",
      status: "Status",
      active: "Active",
      inactive: "Inactive",
      all: "All",
      signIn: "Sign In",
      signUp: "Join Now",
      logOut: "Log Out",
      language: "Language",
      english: "English",
      amharic: "አማርኛ",
      backToHome: "Back to Home",
      loading: "Loading..."
    },
    nav: {
      dashboard: "Dashboard",
      recruitment: "Recruitment Pipeline",
      afterSales: "After-Sales & Onboarding",
      dailyActivity: "Daily Activity & KPI",
      nameList: "Name List Organizer",
      trainingHub: "Training Academy",
      dreamGoalBoard: "Dream & Goal Board",
      goalAnalyzer: "Data Analyzer (Goals)",
      downline: "Downline Collector",
      promoStudio: "Promotional Photo",
      packagesPayments: "Packages & Approvals",
      trainingStudio: "Training Studio (CRUD)",
      teamFaculty: "Team & Trainers (CRUD)",
      cmsStudio: "CMS & Blog Studio",
      certificates: "Certificates",
      motivationalQuotes: "Daily Motivation",
      reports: "Reports & Analytics",
      settings: "Platform Settings",
      activity: "Activity Logs",
      profile: "Profile & Avatars",
      onboardingStudio: "Booklet & Funnel Studio (CRUD)"
    },
    badges: {
      Pipeline: "Pipeline",
      Onboard: "Onboard",
      DMO: "DMO",
      "Capital-IBO": "Capital-IBO",
      "Eric Pro": "Eric Pro",
      Vision: "Vision",
      New: "New",
      "L1-L3": "L1-L3",
      Flyers: "Flyers",
      Verify: "Verify",
      Faculty: "Faculty",
      Access: "Access",
      Live: "Live"
    },
    header: {
      searchPlaceholder: "Search members, downlines, trainings, reports...",
      aiStrategist: "AI Strategist",
      welcomeSuperAdmin: "Welcome back, Super Admin",
      welcomeMember: "Welcome back to your business portal",
      superAdminBadge: "Super Admin Control",
      superAdminDesc: "Full platform visibility across members, downlines, flyers, targets, and logs.",
      notifications: "Notifications",
      workspaceSwitch: "Switch Workspace",
      aiPriorities: "AI Priorities",
      dateLabel: "Jun 2026"
    },
    roles: {
      SUPER_ADMIN: "Super Admin",
      ADMIN: "Admin",
      TEAM_LEADER: "Team Leader",
      TRAINER: "Faculty Trainer",
      MEMBER: "Active Member"
    },
    settings: {
      title: "System & Organization Settings",
      subtitle: "Configure localization, authentication security, financial approvals, notifications, and platform backups.",
      saveButton: "Save All Settings",
      tabs: {
        general: "General & Language",
        security: "Security & Auth",
        membership: "Membership & Payments",
        notifications: "Notifications",
        backup: "Backup & Data Health"
      },
      general: {
        title: "Platform Preferences & Localization",
        desc: "Set default operating language, timezone, currency, and organization name.",
        orgName: "Organization / Company Name",
        language: "System Interface Language",
        languageDesc: "Choose English or Amharic for menus, labels, and forms.",
        currency: "Operating Currency",
        timezone: "System Timezone",
        dateFormat: "Date & Calendar System",
        gregorian: "Gregorian (Western)",
        ethiopian: "Ethiopian Calendar (ዘመን አቆጣጠር)"
      },
      security: {
        title: "Authentication & Security Rules",
        desc: "Configure role enforcement, failed attempt locks, and credential security.",
        requireEmail: "Require Email Verification",
        requireEmailDesc: "New members must verify their email before accessing training modules.",
        auditLogging: "Enable Comprehensive Audit Logging",
        auditLoggingDesc: "Record all administrative actions, logins, and financial approvals.",
        lockAccount: "Lock Account After Failed Logins",
        lockAccountDesc: "Temporarily freeze account after consecutive bad password attempts.",
        maxAttempts: "Maximum Failed Attempts",
        twoFactor: "Two-Factor Authentication (2FA)",
        twoFactorDesc: "Require SMS or authenticator code for administrative roles.",
        sessionTimeout: "Session Inactivity Timeout (Minutes)",
        passwordCardTitle: "Update Your Password",
        passwordCardDesc: "Change your account login password with immediate sync.",
        currentPass: "Current Password",
        newPass: "New Password",
        confirmPass: "Confirm New Password",
        updatePassBtn: "Update Password"
      },
      membership: {
        title: "Membership & Financial Verification",
        desc: "Manage manual payment receipt approvals and automated renewal rules.",
        manualVerification: "Require Manual Receipt Verification",
        manualVerificationDesc: "All bank transfer and Telebirr receipts require admin sign-off.",
        renewalReminders: "Automated Renewal Reminders",
        renewalRemindersDesc: "Send automated SMS and portal prompts 5 days before subscription expiry.",
        autoExpire: "Automatically Expire Overdue Accounts",
        autoExpireDesc: "Restrict LMS and pipeline tools when subscription lapses.",
        telebirrAuto: "Telebirr SMS Transaction Reference Matching",
        telebirrAutoDesc: "Cross-check Telebirr transaction codes with payment submissions."
      },
      notifications: {
        title: "System Broadcasts & Alerts",
        desc: "Control push notifications, motivational broadcasts, and cohort alerts.",
        motivationPush: "Daily Motivation Broadcasts",
        motivationPushDesc: "Push daily quotes and mindset boosts to all member dashboards.",
        downlineAlert: "New Downline Registration Alerts",
        downlineAlertDesc: "Notify upline leaders instantly when a new prospect enrolls.",
        cohortStart: "Equal-Time Training Cohort Alerts",
        cohortStartDesc: "Remind members 15 minutes before scheduled live training cohorts start.",
        executiveDigest: "Weekly Executive Digest",
        executiveDigestDesc: "Send weekly growth metrics summary to Admins and Team Leaders."
      },
      backup: {
        title: "Platform Backup & Database Maintenance",
        desc: "Export snapshots of your network data or inspect live system health.",
        healthStatus: "Database Health Status: Operational",
        totalUsers: "Registered Users",
        totalTeams: "Active Teams & Squads",
        totalTrainers: "Faculty Trainers",
        totalCourses: "Training Courses",
        totalMotivations: "Daily Motivations",
        totalBlogPosts: "Published Articles",
        exportJsonBtn: "Download Full Database Backup (JSON)",
        resetBtn: "Reset Seed Data to Defaults"
      }
    }
  },
  am: {
    common: {
      save: "ለውጦችን አስቀምጥ",
      saving: "በማስቀመጥ ላይ...",
      saved: "ቅንብሮችዎ በተሳካ ሁኔታ ተቀምጠዋል!",
      cancel: "ሰርዝ",
      delete: "አስወግድ",
      edit: "አርትዕ",
      create: "አዲስ ፍጠር",
      search: "ፈልግ...",
      filter: "አጣራ",
      export: "ዝርዝር ወደ CSV ላክ",
      print: "አትም (Print)",
      copy: "ቅዳ",
      copied: "ወደ ቅንጥብ ሰሌዳ ተቀድቷል!",
      close: "ዝጋ",
      dismiss: "አጥፋ",
      view: "ተመልከት",
      actions: "ተግባራት",
      status: "ሁኔታ",
      active: "ንቁ",
      inactive: "ቦዛዛ",
      all: "ሁሉም",
      signIn: "ግባ",
      signUp: "አሁኑኑ ተቀላቀል",
      logOut: "ውጣ",
      language: "ቋንቋ",
      english: "English",
      amharic: "አማርኛ",
      backToHome: "ወደ መነሻ ገጽ ተመለስ",
      loading: "በመጫን ላይ..."
    },
    nav: {
      dashboard: "ዋና ዳሽቦርድ",
      recruitment: "የምልመላ መረብ (Pipeline)",
      afterSales: "የደንበኞች አቀባበል (After-Sales)",
      dailyActivity: "ዕለታዊ ተግባራት እና KPI",
      nameList: "የስም ዝርዝር አደራጅ (Capital-IBO)",
      trainingHub: "የስልጠና አካዳሚ (Eric Pro)",
      dreamGoalBoard: "የህልም እና ግቦች ሰሌዳ",
      goalAnalyzer: "የውሂብ እና ግቦች ትንተና",
      downline: "የዳውንላይን መረብ ሰብሳቢ",
      promoStudio: "የማስተዋወቂያ ፖስተር ስቱዲዮ",
      packagesPayments: "ፓኬጆች እና ክፍያ ማረጋገጫ",
      trainingStudio: "የስልጠና ስቱዲዮ (CRUD)",
      teamFaculty: "የቡድን እና አሰልጣኞች ስቱዲዮ",
      cmsStudio: "የይዘት እና ብሎግ ስቱዲዮ",
      certificates: "የዕውቅና ሰርተፊኬቶች",
      motivationalQuotes: "ዕለታዊ ማበረታቻ",
      reports: "ሪፖርቶች እና ትንታኔ",
      settings: "የስርዓቱ ቅንብሮች",
      activity: "የስርዓት ክንውኖች ማስታወሻ",
      profile: "የግል መገለጫ እና አቫታር",
      onboardingStudio: "የአቀባበል እና ፈነል ስቱዲዮ (CRUD)"
    },
    badges: {
      Pipeline: "የምልመላ ቧንቧ",
      Onboard: "አቀባበል",
      DMO: "ዕለታዊ",
      "Capital-IBO": "ዋና-ካፒታል",
      "Eric Pro": "ኤሪክ ፕሮ",
      Vision: "ራዕይ",
      New: "አዲስ",
      "L1-L3": "ደረጃ 1-3",
      Flyers: "ፖስተሮች",
      Verify: "አረጋግጥ",
      Faculty: "አሰልጣኞች",
      Access: "ፍቃድ",
      Live: "ቀጥታ"
    },
    header: {
      searchPlaceholder: "አባላትን፣ ዳውንላይኖችን፣ ስልጠናዎችን፣ ሪፖርቶችን ፈልግ...",
      aiStrategist: "AI አማካሪ",
      welcomeSuperAdmin: "እንኳን ደህና መጡ፣ ሱፐር አድሚን",
      welcomeMember: "እንኳን ወደ ቢዝነስ ፖርታልዎ በደህና መጡ",
      superAdminBadge: "የሱፐር አድሚን ሙሉ ቁጥጥር",
      superAdminDesc: "በአባላት፣ በዳውንላይን፣ በፖስተሮች፣ በስልጠና እና በክንውኖች ላይ የተሟላ ቁጥጥር።",
      notifications: "ማሳወቂያዎች",
      workspaceSwitch: "የስራ ቦታ ቀይር",
      aiPriorities: "የ AI ቅድሚያዎች",
      dateLabel: "ሰኔ 2018 ዓ.ም"
    },
    roles: {
      SUPER_ADMIN: "ሱፐር አድሚን",
      ADMIN: "አድሚን",
      TEAM_LEADER: "የቡድን መሪ",
      TRAINER: "ዋና አሰልጣኝ",
      MEMBER: "ንቁ አባል"
    },
    settings: {
      title: "የስርዓቱ እና የድርጅቱ ቅንብሮች",
      subtitle: "ቋንቋን፣ የደህንነት ማረጋገጫን፣ የክፍያ ቁጥጥርን፣ ማሳወቂያዎችን እና የመረጃ ምትኬን እዚህ ያቀናብሩ።",
      saveButton: "ሁሉንም ቅንብሮች አስቀምጥ",
      tabs: {
        general: "አጠቃላይ እና ቋንቋ",
        security: "ደህንነት እና መግቢያ",
        membership: "አባልነት እና ክፍያዎች",
        notifications: "ማሳወቂያዎች",
        backup: "ምትኬ እና የመረጃ ቋት"
      },
      general: {
        title: "የመድረኩ ምርጫዎች እና የቋንቋ ማስተካከያ",
        desc: "ዋናውን የመስሪያ ቋንቋ፣ የሰዓት አቆጣጠር፣ ገንዘብ እና የድርጅቱን ስም ያስተካክሉ።",
        orgName: "የድርጅቱ / ኩባንያው ስም",
        language: "የስርዓቱ መገናኛ ቋንቋ",
        languageDesc: "ለዝርዝር ማውጫዎች፣ መለያዎች እና ቅጾች እንግሊዝኛ ወይም አማርኛ ይምረጡ።",
        currency: "የስራ ገንዘብ አይነት",
        timezone: "የሰዓት ሰቅ (Timezone)",
        dateFormat: "የቀን እና የቀን መቁጠሪያ ስርዓት",
        gregorian: "የፈረንጆች አቆጣጠር (Gregorian)",
        ethiopian: "የኢትዮጵያ ዘመን አቆጣጠር (የቀን መቁጠሪያ)"
      },
      security: {
        title: "የደህንነት እና የመግቢያ ደንቦች",
        desc: "የሚና ፍቃዶችን፣ ያልተሳኩ የይለፍ ቃል ሙከራዎችን እና የደህንነት ህጎችን ይቆጣጠሩ።",
        requireEmail: "የኢሜይል ማረጋገጫ ግዴታ ይሁን",
        requireEmailDesc: "አዳዲስ አባላት የስልጠና ሞጁሎችን ከማግኘታቸው በፊት ኢሜይላቸውን ማረጋገጥ አለባቸው።",
        auditLogging: "የተሟላ የክንውኖች ምዝገባ (Audit Logging) ይብራ",
        auditLoggingDesc: "ሁሉንም የአስተዳዳሪ እርምጃዎች፣ መግቢያዎች እና የክፍያ ማረጋገጫዎችን መዝግቦ ያስቀምጣል።",
        lockAccount: "ከተደጋጋሚ የተሳሳተ ሙከራ በኋላ አካውንት ይታገድ",
        lockAccountDesc: "የተሳሳተ የይለፍ ቃል በተደጋጋሚ ሲገባ አካውንቱ በጊዜያዊነት እንዳይሰራ ያደርጋል።",
        maxAttempts: "ከፍተኛው የተሳሳተ ሙከራ ብዛት",
        twoFactor: "ባለ ሁለት ደረጃ ማረጋገጫ (2FA)",
        twoFactorDesc: "ለአስተዳዳሪ ሚናዎች የ SMS ወይም የአረጋጋጭ ኮድ ግዴታ ያደርጋል።",
        sessionTimeout: "የስራ ማቆም የእረፍት ጊዜ ገደብ (በደቂቃዎች)",
        passwordCardTitle: "የይለፍ ቃልዎን ይቀይሩ",
        passwordCardDesc: "የመግቢያ ይለፍ ቃልዎን ወዲያውኑ በአዲስ ይቀይሩ።",
        currentPass: "የአሁኑ የይለፍ ቃል",
        newPass: "አዲሱ የይለፍ ቃል",
        confirmPass: "አዲሱን የይለፍ ቃል በድጋሚ ያረጋግጡ",
        updatePassBtn: "የይለፍ ቃል ቀይር"
      },
      membership: {
        title: "አባልነት እና የክፍያ ማረጋገጫ ቁጥጥር",
        desc: "የባንክ እና የቴሌብር ደረሰኝ ማረጋገጫዎችን እንዲሁም የተጠቃሚ እድሳት ደንቦችን ያቀናብሩ።",
        manualVerification: "የደረሰኝ በእጅ ማረጋገጫ ግዴታ ይሁን",
        manualVerificationDesc: "ሁሉም የባንክ እና የቴሌብር ዝውውር ደረሰኞች በአድሚን መጽደቅ አለባቸው።",
        renewalReminders: "አውቶማቲክ የእድሳት ማሳሰቢያዎች",
        renewalRemindersDesc: "የአባልነት ጊዜው ከማለቁ 5 ቀናት በፊት በ SMS እና በፖርታሉ ማሳሰቢያ ይላካል።",
        autoExpire: "ጊዜያቸው ያለፈባቸውን አካውንቶች በራስ-ሰር አግድ",
        autoExpireDesc: "የአባልነት ጊዜ ሲያበቃ የ LMS እና የምልመላ መሳሪያዎችን እንዳይጠቀሙ ይገድባል።",
        telebirrAuto: "የቴሌብር SMS የግብይት ኮድ ማመሳከሪያ",
        telebirrAutoDesc: "የተላከውን የቴሌብር የግብይት ኮድ ከክፍያ ማስረጃ ጋር በራስ-ሰር ያመሳክራል።"
      },
      notifications: {
        title: "የስርዓት መልዕክቶች እና ማሳወቂያዎች",
        desc: "ዕለታዊ ማበረታቻዎችን፣ የዳውንላይን ምዝገባዎችን እና የስልጠና ማንቂያዎችን ይቆጣጠሩ።",
        motivationPush: "ዕለታዊ የማበረታቻ መልዕክቶች ይላኩ",
        motivationPushDesc: "የዕለቱን ጥቅሶች እና የሞራል ማበረታቻዎችን ለሁሉም አባላት ዳሽቦርድ ይልካል።",
        downlineAlert: "አዲስ አባል ሲመዘገብ ፈጣን ማሳወቂያ",
        downlineAlertDesc: "አዲስ ተስፈኛ ሲመዘገብ ለቀጥታ ስፖንሰሩ እና ለቡድን መሪው ወዲያውኑ ያሳውቃል።",
        cohortStart: "የቀጥታ ስልጠና ጅምር ማንቂያ (Cohort Alert)",
        cohortStartDesc: "የቀጥታ ስልጠና ከመጀመሩ 15 ደቂቃዎች በፊት ለአባላት የማንቂያ መልዕክት ይልካል።",
        executiveDigest: "ሳምንታዊ የአመራር አፈጻጸም ማጠቃለያ",
        executiveDigestDesc: "ሳምንታዊ የዕድገት እና የአፈጻጸም ሪፖርት ለአድሚኖች እና የቡድን መሪዎች ይልካል።"
      },
      backup: {
        title: "ምትኬ እና የመረጃ ቋት ጥገና",
        desc: "የመረጃ ቋቱን ሙሉ ቅጂ ያውርዱ ወይም የስርዓቱን ጤናማነት ይፈትሹ።",
        healthStatus: "የመረጃ ቋት ሁኔታ፡ 100% ጤናማ እና ንቁ",
        totalUsers: "የተመዘገቡ ተጠቃሚዎች",
        totalTeams: "ንቁ ቡድኖች እና ክፍሎች",
        totalTrainers: "የአካዳሚ አሰልጣኞች",
        totalCourses: "የስልጠና ኮርሶች",
        totalMotivations: "ዕለታዊ ማበረታቻዎች",
        totalBlogPosts: "የታተሙ የብሎግ ጽሁፎች",
        exportJsonBtn: "ሙሉ የመረጃ ቋት ቅጂ (JSON) አውርድ",
        resetBtn: "የመጀመሪያ ናሙና መረጃዎችን መልስ (Reset)"
      }
    }
  }
} as const;

export type Dictionary = typeof dictionary.en;

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function getDictionary(locale: string): Dictionary {
  const norm = isLocale(locale) ? locale : "en";
  return dictionary[norm] as unknown as Dictionary;
}

export function getNavLabel(locale: string, navId: string): string {
  const dict = getDictionary(locale);
  const map: Record<string, string> = {
    dashboard: dict.nav.dashboard,
    recruitment: dict.nav.recruitment,
    "after-sales": dict.nav.afterSales,
    "daily-activity": dict.nav.dailyActivity,
    "name-list": dict.nav.nameList,
    "training-hub": dict.nav.trainingHub,
    "dream-goal-board": dict.nav.dreamGoalBoard,
    "goal-analyzer": dict.nav.goalAnalyzer,
    downline: dict.nav.downline,
    "promo-studio": dict.nav.promoStudio,
    "packages-payments": dict.nav.packagesPayments,
    "training-studio": dict.nav.trainingStudio,
    "team-faculty": dict.nav.teamFaculty,
    "cms-studio": dict.nav.cmsStudio,
    certificates: dict.nav.certificates,
    "motivational-quotes": dict.nav.motivationalQuotes,
    reports: dict.nav.reports,
    settings: dict.nav.settings,
    activity: dict.nav.activity,
    profile: (dict.nav as any).profile || "Profile & Avatars",
    "onboarding-studio": (dict.nav as any).onboardingStudio || "Booklet & Funnel Studio (CRUD)"
  };
  return map[navId] || navId;
}

export function getBadgeLabel(locale: string, badge?: string): string | undefined {
  if (!badge) return undefined;
  const dict = getDictionary(locale);
  const bMap: Record<string, string> = dict.badges as unknown as Record<string, string>;
  return bMap[badge] || badge;
}
