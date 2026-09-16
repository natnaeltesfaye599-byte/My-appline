export interface PreMadeAvatar {
  id: string;
  name: string;
  gender: "MALE" | "FEMALE";
  title: string;
  badge: string;
  avatarUrl: string; // SVG data URI or crisp vector url
  accentColor: string;
}

export const PRE_MADE_AVATARS: PreMadeAvatar[] = [
  // ─── MALE AVATARS (12 Curated Presets) ───────────────────────────────────
  {
    id: "male-dawit",
    name: "Coach Dawit",
    gender: "MALE",
    title: "Crown Diamond Executive",
    badge: "Crown Diamond",
    accentColor: "#7c3aed",
    avatarUrl:
      "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='50' fill='%231e1b4b'/><circle cx='50' cy='38' r='20' fill='%23d4a373'/><path d='M30 32 Q50 16 70 32 Q65 14 50 14 Q35 14 30 32 Z' fill='%231f2937'/><path d='M44 48 Q50 54 56 48' stroke='%23374151' stroke-width='2' fill='none'/><circle cx='43' cy='36' r='2.5' fill='%231f2937'/><circle cx='57' cy='36' r='2.5' fill='%231f2937'/><path d='M18 90 Q50 64 82 90 Z' fill='%234338ca'/><polygon points='50,68 45,86 55,86' fill='%23e0e7ff'/><polygon points='48,74 52,74 51,84 49,84' fill='%23f59e0b'/></svg>"
  },
  {
    id: "male-abebe",
    name: "Abebe Bikila",
    gender: "MALE",
    title: "Master Team Builder",
    badge: "Diamond",
    accentColor: "#0ea5e9",
    avatarUrl:
      "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='50' fill='%230f172a'/><circle cx='50' cy='38' r='20' fill='%23c68642'/><path d='M32 28 Q50 18 68 28 Q60 16 50 16 Q40 16 32 28 Z' fill='%23111827'/><circle cx='43' cy='37' r='2.5' fill='%23111827'/><circle cx='57' cy='37' r='2.5' fill='%23111827'/><path d='M44 46 Q50 50 56 46' stroke='%23111827' stroke-width='2' fill='none'/><path d='M16 92 Q50 66 84 92 Z' fill='%230369a1'/><polygon points='50,70 46,88 54,88' fill='%23f8fafc'/><polygon points='48,76 52,76 50,86' fill='%230284c7'/></svg>"
  },
  {
    id: "male-kassahun",
    name: "Kassahun Bekele",
    gender: "MALE",
    title: "Operations & NBO Lead",
    badge: "Master Faculty",
    accentColor: "#10b981",
    avatarUrl:
      "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='50' fill='%23064e3b'/><circle cx='50' cy='38' r='20' fill='%23e0ac69'/><path d='M31 30 Q50 18 69 30 Q62 15 50 15 Q38 15 31 30 Z' fill='%23262626'/><circle cx='43' cy='37' r='2.5' fill='%23262626'/><circle cx='57' cy='37' r='2.5' fill='%23262626'/><rect x='38' y='33' width='10' height='8' rx='2' fill='none' stroke='%2310b981' stroke-width='1.5'/><rect x='52' y='33' width='10' height='8' rx='2' fill='none' stroke='%2310b981' stroke-width='1.5'/><line x1='48' y1='37' x2='52' y2='37' stroke='%2310b981' stroke-width='1.5'/><path d='M45 47 Q50 52 55 47' stroke='%23262626' stroke-width='2' fill='none'/><path d='M16 92 Q50 65 84 92 Z' fill='%23047857'/><polygon points='50,68 45,86 55,86' fill='%23ecfdf5'/></svg>"
  },
  {
    id: "male-ephrem",
    name: "Ephrem Alemu",
    gender: "MALE",
    title: "Objection & Closing Coach",
    badge: "Gold Leader",
    accentColor: "#f59e0b",
    avatarUrl:
      "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='50' fill='%23451a03'/><circle cx='50' cy='38' r='20' fill='%23d4a373'/><path d='M30 30 Q50 16 70 30 Q64 12 50 12 Q36 12 30 30 Z' fill='%2318181b'/><path d='M40 50 Q50 56 60 50' stroke='%2327272a' stroke-width='2.5' fill='none'/><circle cx='43' cy='36' r='2.5' fill='%2318181b'/><circle cx='57' cy='36' r='2.5' fill='%2318181b'/><path d='M16 92 Q50 66 84 92 Z' fill='%23b45309'/><polygon points='50,70 46,88 54,88' fill='%23fef3c7'/></svg>"
  },
  {
    id: "male-tewodros",
    name: "Tewodros Kassaye",
    gender: "MALE",
    title: "Frontline Rising Star",
    badge: "Gold Executive",
    accentColor: "#6366f1",
    avatarUrl:
      "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='50' fill='%231e1b4b'/><circle cx='50' cy='38' r='20' fill='%238d5524'/><path d='M32 26 Q50 14 68 26 Q60 14 50 14 Q40 14 32 26 Z' fill='%2309090b'/><circle cx='43' cy='37' r='2.5' fill='%2309090b'/><circle cx='57' cy='37' r='2.5' fill='%2309090b'/><path d='M44 47 Q50 51 56 47' stroke='%2309090b' stroke-width='2' fill='none'/><path d='M16 92 Q50 66 84 92 Z' fill='%234f46e5'/><polygon points='50,70 46,88 54,88' fill='%23e0e7ff'/></svg>"
  },
  {
    id: "male-biniyam",
    name: "Biniyam Tesfaye",
    gender: "MALE",
    title: "Regional Director - Hawassa",
    badge: "Senior Mentor",
    accentColor: "#14b8a6",
    avatarUrl:
      "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='50' fill='%23134e4a'/><circle cx='50' cy='38' r='20' fill='%23c68642'/><path d='M32 30 Q50 18 68 30 Q62 16 50 16 Q38 16 32 30 Z' fill='%2327272a'/><path d='M42 46 Q50 52 58 46 Q55 54 50 54 Q45 54 42 46 Z' fill='%2327272a'/><circle cx='43' cy='36' r='2.5' fill='%2327272a'/><circle cx='57' cy='36' r='2.5' fill='%2327272a'/><path d='M16 92 Q50 66 84 92 Z' fill='%230f766e'/><polygon points='50,70 46,88 54,88' fill='%23ccfbf1'/></svg>"
  },
  {
    id: "male-yonas",
    name: "Yonas Mengesha",
    gender: "MALE",
    title: "Duplication Specialist",
    badge: "Silver Associate",
    accentColor: "#ec4899",
    avatarUrl:
      "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='50' fill='%23831843'/><circle cx='50' cy='38' r='20' fill='%23e0ac69'/><path d='M32 26 Q50 14 68 26 Q60 14 50 14 Q40 14 32 26 Z' fill='%2318181b'/><circle cx='43' cy='37' r='2.5' fill='%2318181b'/><circle cx='57' cy='37' r='2.5' fill='%2318181b'/><path d='M44 47 Q50 52 56 47' stroke='%2318181b' stroke-width='2' fill='none'/><path d='M16 92 Q50 66 84 92 Z' fill='%23be185d'/><polygon points='50,70 46,88 54,88' fill='%23fce7f3'/></svg>"
  },
  {
    id: "male-henok",
    name: "Henok Girma",
    gender: "MALE",
    title: "Fast-Track Coordinator",
    badge: "Squad Captain",
    accentColor: "#3b82f6",
    avatarUrl:
      "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='50' fill='%231e3a8a'/><circle cx='50' cy='38' r='20' fill='%23d4a373'/><path d='M30 28 Q50 16 70 28 Q64 14 50 14 Q36 14 30 28 Z' fill='%23172554'/><circle cx='43' cy='37' r='2.5' fill='%23172554'/><circle cx='57' cy='37' r='2.5' fill='%23172554'/><path d='M44 47 Q50 52 56 47' stroke='%23172554' stroke-width='2' fill='none'/><path d='M16 92 Q50 66 84 92 Z' fill='%232563eb'/><polygon points='50,70 46,88 54,88' fill='%23dbeafe'/></svg>"
  },
  {
    id: "male-samuel",
    name: "Samuel Worku",
    gender: "MALE",
    title: "Strategic Closer",
    badge: "Senior Associate",
    accentColor: "#8b5cf6",
    avatarUrl:
      "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='50' fill='%232e1065'/><circle cx='50' cy='38' r='20' fill='%238d5524'/><path d='M32 26 Q50 16 68 26 Q60 16 50 16 Q40 16 32 26 Z' fill='%230f172a'/><circle cx='43' cy='37' r='2.5' fill='%230f172a'/><circle cx='57' cy='37' r='2.5' fill='%230f172a'/><path d='M44 47 Q50 52 56 47' stroke='%230f172a' stroke-width='2' fill='none'/><path d='M16 92 Q50 66 84 92 Z' fill='%237c3aed'/><polygon points='50,70 46,88 54,88' fill='%23ede9fe'/></svg>"
  },
  {
    id: "male-mikiyas",
    name: "Mikiyas Fikre",
    gender: "MALE",
    title: "Digital & Social Prospecting",
    badge: "Innovator",
    accentColor: "#06b6d4",
    avatarUrl:
      "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='50' fill='%23164e63'/><circle cx='50' cy='38' r='20' fill='%23c68642'/><path d='M30 28 Q50 16 70 28 Q64 14 50 14 Q36 14 30 28 Z' fill='%231f2937'/><circle cx='43' cy='37' r='2.5' fill='%231f2937'/><circle cx='57' cy='37' r='2.5' fill='%231f2937'/><path d='M44 47 Q50 52 56 47' stroke='%231f2937' stroke-width='2' fill='none'/><path d='M16 92 Q50 66 84 92 Z' fill='%230891b2'/><polygon points='50,70 46,88 54,88' fill='%23cffafe'/></svg>"
  },
  {
    id: "male-tamirat",
    name: "Tamirat Negash",
    gender: "MALE",
    title: "International Expansion Leader",
    badge: "Global Builder",
    accentColor: "#ea580c",
    avatarUrl:
      "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='50' fill='%237c2d12'/><circle cx='50' cy='38' r='20' fill='%23e0ac69'/><path d='M32 26 Q50 14 68 26 Q60 14 50 14 Q40 14 32 26 Z' fill='%2318181b'/><circle cx='43' cy='37' r='2.5' fill='%2318181b'/><circle cx='57' cy='37' r='2.5' fill='%2318181b'/><path d='M44 47 Q50 52 56 47' stroke='%2318181b' stroke-width='2' fill='none'/><path d='M16 92 Q50 66 84 92 Z' fill='%23c2410c'/><polygon points='50,70 46,88 54,88' fill='%23ffedd5'/></svg>"
  },
  {
    id: "male-solomon",
    name: "Solomon Haile",
    gender: "MALE",
    title: "Heritage Master Builder",
    badge: "Cultural Leader",
    accentColor: "#d97706",
    avatarUrl:
      "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='50' fill='%23451a03'/><circle cx='50' cy='38' r='20' fill='%238d5524'/><path d='M30 28 Q50 14 70 28 Q64 12 50 12 Q36 12 30 28 Z' fill='%23171717'/><circle cx='43' cy='37' r='2.5' fill='%23171717'/><circle cx='57' cy='37' r='2.5' fill='%23171717'/><path d='M44 48 Q50 53 56 48' stroke='%23171717' stroke-width='2' fill='none'/><path d='M16 92 Q50 66 84 92 Z' fill='%23fef3c7'/><path d='M25 78 L75 78' stroke='%23dc2626' stroke-width='2'/><path d='M25 82 L75 82' stroke='%2316a34a' stroke-width='2'/><path d='M25 86 L75 86' stroke='%23ca8a04' stroke-width='2'/></svg>"
  },

  // ─── FEMALE AVATARS (12 Curated Presets) ─────────────────────────────────
  {
    id: "female-selamawit",
    name: "Selamawit Tadesse",
    gender: "FEMALE",
    title: "Senior Sales Director & Master Inviter",
    badge: "Crown Diamond",
    accentColor: "#db2777",
    avatarUrl:
      "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='50' fill='%23831843'/><circle cx='50' cy='38' r='19' fill='%23d4a373'/><path d='M24 38 Q22 65 32 68 Q40 50 32 30 Q50 14 68 30 Q60 50 68 68 Q78 65 76 38 Q74 14 50 14 Q26 14 24 38 Z' fill='%23171717'/><circle cx='44' cy='37' r='2.5' fill='%23171717'/><circle cx='56' cy='37' r='2.5' fill='%23171717'/><path d='M44 46 Q50 51 56 46' stroke='%23be185d' stroke-width='2.5' fill='none'/><circle cx='30' cy='43' r='2.5' fill='%23facc15'/><circle cx='70' cy='43' r='2.5' fill='%23facc15'/><path d='M18 92 Q50 66 82 92 Z' fill='%239d174d'/><polygon points='50,70 46,86 54,86' fill='%23fce7f3'/></svg>"
  },
  {
    id: "female-bethelhem",
    name: "Dr. Bethelhem Alemu",
    gender: "FEMALE",
    title: "Executive Leadership Coach",
    badge: "Master Faculty",
    accentColor: "#9333ea",
    avatarUrl:
      "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='50' fill='%233b0764'/><circle cx='50' cy='38' r='19' fill='%23c68642'/><path d='M25 36 Q22 62 33 65 Q40 48 32 28 Q50 14 68 28 Q60 48 67 65 Q78 62 75 36 Q73 14 50 14 Q27 14 25 36 Z' fill='%2318181b'/><rect x='39' y='33' width='9' height='8' rx='2' fill='none' stroke='%239333ea' stroke-width='1.5'/><rect x='52' y='33' width='9' height='8' rx='2' fill='none' stroke='%239333ea' stroke-width='1.5'/><line x1='48' y1='37' x2='52' y2='37' stroke='%239333ea' stroke-width='1.5'/><circle cx='43.5' cy='37' r='2' fill='%2318181b'/><circle cx='56.5' cy='37' r='2' fill='%2318181b'/><path d='M45 47 Q50 51 55 47' stroke='%239333ea' stroke-width='2' fill='none'/><path d='M18 92 Q50 66 82 92 Z' fill='%236b21a8'/><polygon points='50,70 46,86 54,86' fill='%23f3e8ff'/></svg>"
  },
  {
    id: "female-hiwot",
    name: "Hiwot Girma",
    gender: "FEMALE",
    title: "Top Conversion Closer",
    badge: "Crown Diamond",
    accentColor: "#0284c7",
    avatarUrl:
      "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='50' fill='%23082f49'/><circle cx='50' cy='38' r='19' fill='%23e0ac69'/><path d='M26 38 Q23 60 32 64 Q38 48 32 30 Q50 15 68 30 Q62 48 68 64 Q77 60 74 38 Q72 15 50 15 Q28 15 26 38 Z' fill='%231f2937'/><circle cx='44' cy='37' r='2.5' fill='%231f2937'/><circle cx='56' cy='37' r='2.5' fill='%231f2937'/><path d='M44 47 Q50 52 56 47' stroke='%230284c7' stroke-width='2.5' fill='none'/><circle cx='30' cy='43' r='2.5' fill='%2338bdf8'/><circle cx='70' cy='43' r='2.5' fill='%2338bdf8'/><path d='M18 92 Q50 66 82 92 Z' fill='%230369a1'/><polygon points='50,70 46,86 54,86' fill='%23e0f2fe'/></svg>"
  },
  {
    id: "female-hanna",
    name: "Hanna Kebede",
    gender: "FEMALE",
    title: "Master Recruiter",
    badge: "Diamond Leader",
    accentColor: "#059669",
    avatarUrl:
      "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='50' fill='%23064e3b'/><circle cx='50' cy='38' r='19' fill='%238d5524'/><path d='M25 36 Q22 62 32 66 Q40 48 32 28 Q50 14 68 28 Q60 48 68 66 Q78 62 75 36 Q73 14 50 14 Q27 14 25 36 Z' fill='%23171717'/><circle cx='44' cy='37' r='2.5' fill='%23171717'/><circle cx='56' cy='37' r='2.5' fill='%23171717'/><path d='M44 47 Q50 52 56 47' stroke='%23059669' stroke-width='2.5' fill='none'/><path d='M18 92 Q50 66 82 92 Z' fill='%23047857'/><polygon points='50,70 46,86 54,86' fill='%23d1fae5'/></svg>"
  },
  {
    id: "female-tigist",
    name: "Tigist Assefa",
    gender: "FEMALE",
    title: "Heritage Diamond Founder",
    badge: "Cultural Diamond",
    accentColor: "#d97706",
    avatarUrl:
      "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='50' fill='%23451a03'/><circle cx='50' cy='38' r='19' fill='%23d4a373'/><path d='M24 38 Q22 62 32 66 Q40 48 32 28 Q50 14 68 28 Q60 48 68 66 Q78 62 76 38 Q74 14 50 14 Q26 14 24 38 Z' fill='%2318181b'/><circle cx='44' cy='37' r='2.5' fill='%2318181b'/><circle cx='56' cy='37' r='2.5' fill='%2318181b'/><path d='M44 47 Q50 52 56 47' stroke='%23d97706' stroke-width='2.5' fill='none'/><circle cx='30' cy='43' r='2.5' fill='%23fbbf24'/><circle cx='70' cy='43' r='2.5' fill='%23fbbf24'/><path d='M18 92 Q50 66 82 92 Z' fill='%23fef3c7'/><path d='M25 78 L75 78' stroke='%23dc2626' stroke-width='2'/><path d='M25 82 L75 82' stroke='%2316a34a' stroke-width='2'/><path d='M25 86 L75 86' stroke='%23ca8a04' stroke-width='2'/></svg>"
  },
  {
    id: "female-rahel",
    name: "Rahel Belay",
    gender: "FEMALE",
    title: "Fast-Track Launch Coordinator",
    badge: "Gold Executive",
    accentColor: "#ec4899",
    avatarUrl:
      "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='50' fill='%23831843'/><circle cx='50' cy='38' r='19' fill='%23c68642'/><path d='M26 36 Q22 62 32 65 Q40 48 32 28 Q50 14 68 28 Q60 48 68 65 Q78 62 74 36 Q72 14 50 14 Q28 14 26 36 Z' fill='%2327272a'/><circle cx='44' cy='37' r='2.5' fill='%2327272a'/><circle cx='56' cy='37' r='2.5' fill='%2327272a'/><path d='M44 47 Q50 52 56 47' stroke='%23ec4899' stroke-width='2.5' fill='none'/><path d='M18 92 Q50 66 82 92 Z' fill='%23be185d'/><polygon points='50,70 46,86 54,86' fill='%23fce7f3'/></svg>"
  },
  {
    id: "female-meron",
    name: "Meron Hailu",
    gender: "FEMALE",
    title: "Academy Faculty Instructor",
    badge: "Faculty Coach",
    accentColor: "#6366f1",
    avatarUrl:
      "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='50' fill='%231e1b4b'/><circle cx='50' cy='38' r='19' fill='%23e0ac69'/><path d='M26 36 Q22 62 32 65 Q40 48 32 28 Q50 14 68 28 Q60 48 68 65 Q78 62 74 36 Q72 14 50 14 Q28 14 26 36 Z' fill='%2309090b'/><circle cx='44' cy='37' r='2.5' fill='%2309090b'/><circle cx='56' cy='37' r='2.5' fill='%2309090b'/><path d='M44 47 Q50 52 56 47' stroke='%236366f1' stroke-width='2.5' fill='none'/><path d='M18 92 Q50 66 82 92 Z' fill='%234338ca'/><polygon points='50,70 46,86 54,86' fill='%23e0e7ff'/></svg>"
  },
  {
    id: "female-lidya",
    name: "Lidya Berhanu",
    gender: "FEMALE",
    title: "Rising Star Executive",
    badge: "Gold Builder",
    accentColor: "#14b8a6",
    avatarUrl:
      "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='50' fill='%23134e4a'/><circle cx='50' cy='38' r='19' fill='%23d4a373'/><path d='M26 36 Q22 62 32 65 Q40 48 32 28 Q50 14 68 28 Q60 48 68 65 Q78 62 74 36 Q72 14 50 14 Q28 14 26 36 Z' fill='%231e293b'/><circle cx='44' cy='37' r='2.5' fill='%231e293b'/><circle cx='56' cy='37' r='2.5' fill='%231e293b'/><path d='M44 47 Q50 52 56 47' stroke='%2314b8a6' stroke-width='2.5' fill='none'/><path d='M18 92 Q50 66 82 92 Z' fill='%230f766e'/><polygon points='50,70 46,86 54,86' fill='%23ccfbf1'/></svg>"
  },
  {
    id: "female-eden",
    name: "Eden Teshome",
    gender: "FEMALE",
    title: "Network Expansion Director",
    badge: "Expansion Lead",
    accentColor: "#3b82f6",
    avatarUrl:
      "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='50' fill='%23172554'/><circle cx='50' cy='38' r='19' fill='%238d5524'/><path d='M26 36 Q22 62 32 65 Q40 48 32 28 Q50 14 68 28 Q60 48 68 65 Q78 62 74 36 Q72 14 50 14 Q28 14 26 36 Z' fill='%230f172a'/><circle cx='44' cy='37' r='2.5' fill='%230f172a'/><circle cx='56' cy='37' r='2.5' fill='%230f172a'/><path d='M44 47 Q50 52 56 47' stroke='%233b82f6' stroke-width='2.5' fill='none'/><path d='M18 92 Q50 66 82 92 Z' fill='%231d4ed8'/><polygon points='50,70 46,86 54,86' fill='%23dbeafe'/></svg>"
  },
  {
    id: "female-tsion",
    name: "Tsion Daniel",
    gender: "FEMALE",
    title: "3-Way Closing Specialist",
    badge: "Senior Closer",
    accentColor: "#a855f7",
    avatarUrl:
      "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='50' fill='%233b0764'/><circle cx='50' cy='38' r='19' fill='%23c68642'/><path d='M26 36 Q22 62 32 65 Q40 48 32 28 Q50 14 68 28 Q60 48 68 65 Q78 62 74 36 Q72 14 50 14 Q28 14 26 36 Z' fill='%231e1b4b'/><circle cx='44' cy='37' r='2.5' fill='%231e1b4b'/><circle cx='56' cy='37' r='2.5' fill='%231e1b4b'/><path d='M44 47 Q50 52 56 47' stroke='%23a855f7' stroke-width='2.5' fill='none'/><path d='M18 92 Q50 66 82 92 Z' fill='%237e22ce'/><polygon points='50,70 46,86 54,86' fill='%23f3e8ff'/></svg>"
  },
  {
    id: "female-frehiwot",
    name: "Frehiwot Mamo",
    gender: "FEMALE",
    title: "Culture & Retention Lead",
    badge: "Director",
    accentColor: "#f43f5e",
    avatarUrl:
      "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='50' fill='%23881337'/><circle cx='50' cy='38' r='19' fill='%23e0ac69'/><path d='M26 36 Q22 62 32 65 Q40 48 32 28 Q50 14 68 28 Q60 48 68 65 Q78 62 74 36 Q72 14 50 14 Q28 14 26 36 Z' fill='%2318181b'/><circle cx='44' cy='37' r='2.5' fill='%2318181b'/><circle cx='56' cy='37' r='2.5' fill='%2318181b'/><path d='M44 47 Q50 52 56 47' stroke='%23f43f5e' stroke-width='2.5' fill='none'/><path d='M18 92 Q50 66 82 92 Z' fill='%23be123c'/><polygon points='50,70 46,86 54,86' fill='%23ffe4e6'/></svg>"
  },
  {
    id: "female-makeda",
    name: "Makeda Wolde",
    gender: "FEMALE",
    title: "Empress Diamond Pioneer",
    badge: "Royal Leader",
    accentColor: "#eab308",
    avatarUrl:
      "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='50' fill='%23451a03'/><circle cx='50' cy='38' r='19' fill='%238d5524'/><path d='M24 38 Q22 62 32 66 Q40 48 32 28 Q50 14 68 28 Q60 48 68 66 Q78 62 76 38 Q74 14 50 14 Q26 14 24 38 Z' fill='%230f172a'/><polygon points='50,14 43,24 57,24' fill='%23fbbf24'/><circle cx='44' cy='37' r='2.5' fill='%230f172a'/><circle cx='56' cy='37' r='2.5' fill='%230f172a'/><path d='M44 47 Q50 52 56 47' stroke='%23eab308' stroke-width='2.5' fill='none'/><circle cx='30' cy='43' r='2.5' fill='%23fde047'/><circle cx='70' cy='43' r='2.5' fill='%23fde047'/><path d='M18 92 Q50 66 82 92 Z' fill='%23ca8a04'/><polygon points='50,70 46,86 54,86' fill='%23fef9c3'/></svg>"
  }
];

export function getPreMadeAvatars(gender?: "MALE" | "FEMALE" | "ALL"): PreMadeAvatar[] {
  if (!gender || gender === "ALL") return PRE_MADE_AVATARS;
  return PRE_MADE_AVATARS.filter((a) => a.gender === gender);
}

export function getAvatarById(id: string): PreMadeAvatar | undefined {
  return PRE_MADE_AVATARS.find((a) => a.id === id);
}
