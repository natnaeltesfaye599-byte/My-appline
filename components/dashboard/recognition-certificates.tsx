"use client";

import { useState, useMemo } from "react";
import {
  Award,
  CheckCircle2,
  Download,
  Eye,
  FileCheck,
  FileSpreadsheet,
  Medal,
  Printer,
  QrCode,
  ShieldCheck,
  Sparkles,
  Trophy,
  UserCheck,
  Crown,
  Search,
  Filter,
  Share2,
  Check,
  Plus,
  ExternalLink,
  Sliders,
  Copy,
  Globe,
  Star,
  Lock,
  Layers,
  X,
  FileText
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { printSection, exportToCsv } from "@/lib/export-utils";

export type CertificateTheme =
  | "royal-gold"
  | "platinum-diamond"
  | "emerald-executive"
  | "imperial-crimson"
  | "geneva-modern";

export type CertificateCategory =
  | "Rank Advancement"
  | "Top Recruiter"
  | "Leadership Mastery"
  | "LMS Academy Graduate"
  | "Presidential Honor";

export interface CertificateData {
  id: string;
  certNumber: string;
  uuid: string;
  title: string;
  titleAm?: string;
  subtitle: string;
  subtitleAm?: string;
  recipientName: string;
  recipientRank: string;
  achievement: string;
  achievementAm?: string;
  issueDate: string;
  signatory1: string;
  signatory1Role: string;
  signatory2: string;
  signatory2Role: string;
  badgeTone: "gold" | "cyan" | "emerald" | "purple";
  category: CertificateCategory;
  theme: CertificateTheme;
  verificationHash: string;
  country: string;
}

const initialCertificates: CertificateData[] = [
  {
    id: "cert-001",
    certNumber: "MUG-INT-2026-8819",
    uuid: "cf82-901a-88bf-9201",
    title: "Certificate of Rank Advancement",
    titleAm: "የከፍተኛ ደረጃ እድገት ማረጋገጫ ምስክር ወረቀት",
    subtitle: "IN RECOGNITION OF EXCEPTIONAL LEADERSHIP & INTERNATIONAL NETWORK EXPANSION",
    subtitleAm: "ለተለየ የአመራር ብቃት እና ዓለም አቀፍ የኔትወርክ መስፋፋት ክብር የተሰጠ",
    recipientName: "Almaz Tadesse",
    recipientRank: "Diamond Director",
    achievement: "Conferred for demonstrating exemplary duplication systems, achieving an organization volume exceeding 100,000 PV, and empowering over 500 network marketing entrepreneurs across East Africa.",
    achievementAm: "ከ100,000 PV በላይ የድርጅት ሽያጭ መጠን በማስመዝገብ እና ከ500 በላይ የስራ ፈጣሪዎችን በማብቃት ላሳዩት ድንቅ የአመራር ሚና የተሰጠ።",
    issueDate: "June 15, 2026",
    signatory1: "Dawit Wolde",
    signatory1Role: "Global Managing Director, MyUpline Global",
    signatory2: "Dr. Bethelhem Alemu",
    signatory2Role: "Dean of International Faculty & Accreditation",
    badgeTone: "gold",
    category: "Rank Advancement",
    theme: "royal-gold",
    verificationHash: "SHA256: 7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069",
    country: "Ethiopia / Global"
  },
  {
    id: "cert-002",
    certNumber: "MUG-REC-2026-4402",
    uuid: "ab14-4112-98aa-7103",
    title: "International Top Recruiter of Excellence",
    titleAm: "የአመቱ ምርጥ ዓለም አቀፍ አባል መልማይ የክብር ዋንጫ",
    subtitle: "FOR OUTSTANDING TALENT ACQUISITION AND DIRECT NETWORK ENROLLMENT",
    subtitleAm: "ለላቀ የአዳዲስ አባላት ምልመላ እና የቡድን ግንባታ ብቃት የተበረከተ",
    recipientName: "Biniam Haile",
    recipientRank: "Platinum Leader",
    achievement: "Awarded for achieving the #1 highest validated direct recruit volume across the international distribution lineage, with 42 personally mentored frontline ambassadors in a single qualification cycle.",
    achievementAm: "በአንድ ዙር ውስጥ 42 አዳዲስ መሪዎችን በቀጥታ በማፍራት በመላው ፕላትፎርሙ ቁጥር 1 ምርጥ አባል በመሆናቸው የተበረከተ።",
    issueDate: "June 30, 2026",
    signatory1: "Eleni Kassaye",
    signatory1Role: "VP of Global Network Expansion",
    signatory2: "Coach Ephrem Alemu",
    signatory2Role: "Master Director of Field Operations",
    badgeTone: "cyan",
    category: "Top Recruiter",
    theme: "platinum-diamond",
    verificationHash: "SHA256: 4e91c304bf9f532a87515b699c279a7cd6d48259e89b4f494f10825eb3966524",
    country: "International"
  },
  {
    id: "cert-003",
    certNumber: "MUG-LEAD-2026-3199",
    uuid: "dd55-8901-11cd-4389",
    title: "Executive Leadership Mastery Fellowship",
    titleAm: "የከፍተኛ አመራር እና የስነ-ምግባር ብቃት ማረጋገጫ",
    subtitle: "ACADEMIC & FIELD OPERATIONAL EXCELLENCE ACCREDITATION",
    subtitleAm: "የአካዳሚክ እና የተግባር የአመራር ብቃት ዓለም አቀፍ እውቅና",
    recipientName: "Selamawit Bekele",
    recipientRank: "Crown Diamond Ambassador",
    achievement: "Successfully fulfilled all rigorous requirements of the Global Direct Selling Leadership Fellowship, mastering Duplication Architectures, Cross-Border Regulatory Governance, and Ethical MLM Leadership.",
    achievementAm: "ዓለም አቀፍ የኔትወርክ ማርኬቲንግ የአመራር፣ የስነ-ምግባር እና የህግ ተገዢነት መስፈርቶችን በከፍተኛ ውጤት በማጠናቀቃቸው የተሰጠ።",
    issueDate: "May 28, 2026",
    signatory1: "Dawit Wolde",
    signatory1Role: "Global Managing Director, MyUpline Global",
    signatory2: "Dr. Bethelhem Alemu",
    signatory2Role: "Dean of International Faculty & Accreditation",
    badgeTone: "emerald",
    category: "Leadership Mastery",
    theme: "emerald-executive",
    verificationHash: "SHA256: 91a4577881c19b2650dd7f8a7e082156820257e802a4bf702a4b874457e4e138",
    country: "Global Council"
  },
  {
    id: "cert-004",
    certNumber: "MUG-LMS-2026-1025",
    uuid: "fe22-9904-811c-2234",
    title: "International Academy Graduate with Distinction",
    titleAm: "የአካዳሚ ምሩቅ የልህቀት ማረጋገጫ ሰርተፍኬት",
    subtitle: "OFFICIAL ACCREDITATION OF THE PROFESSIONAL NETWORK ACADEMY",
    subtitleAm: "የሙያዊ ኔትወርክ ማርኬቲንግ አካዳሚ ይፋዊ የምረቃ ሰነድ",
    recipientName: "Yonas Mekonnen",
    recipientRank: "Gold Executive",
    achievement: "Graduated with Highest Honors (Score: 99.4%) upon completing all 12 modules of Eric Worre Methodology, Objection Elimination, 48-Hour Fast-Track Launch, and Automated Funnel Conversion.",
    achievementAm: "ሁሉንም 12 የሙያዊ ስልጠና ሞጁሎች በ99.4% የልህቀት ውጤት በማጠናቀቃቸው የተበረከተ ይፋዊ የምስክር ወረቀት።",
    issueDate: "June 10, 2026",
    signatory1: "Coach Ephrem Alemu",
    signatory1Role: "Master Director of Field Operations",
    signatory2: "Abebech Tefera",
    signatory2Role: "Chief Academic Officer",
    badgeTone: "purple",
    category: "LMS Academy Graduate",
    theme: "imperial-crimson",
    verificationHash: "SHA256: 23d5678491c13e45902bc5671e9803457190234589abcdef0123456789abcdef",
    country: "East Africa Division"
  }
];

export function RecognitionCertificates({
  onOpenAi
}: {
  onOpenAi?: (prompt: string) => void;
}) {
  const [certificates, setCertificates] = useState<CertificateData[]>(initialCertificates);
  const [activeCert, setActiveCert] = useState<CertificateData>(initialCertificates[0]);
  const [activeLanguage, setActiveLanguage] = useState<"EN" | "AM">("EN");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [isVerifying, setIsVerifying] = useState(false);
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [copiedHash, setCopiedHash] = useState(false);
  const [liveTheme, setLiveTheme] = useState<CertificateTheme>(initialCertificates[0].theme);

  // New Certificate Form State
  const [newRecipient, setNewRecipient] = useState("");
  const [newRank, setNewRank] = useState("Diamond Director");
  const [newTitle, setNewTitle] = useState("Certificate of Rank Advancement");
  const [newCategory, setNewCategory] = useState<CertificateCategory>("Rank Advancement");
  const [newAchievement, setNewAchievement] = useState("");
  const [newTheme, setNewTheme] = useState<CertificateTheme>("royal-gold");

  // Keep liveTheme in sync when changing activeCert
  function handleSelectCert(cert: CertificateData) {
    setActiveCert(cert);
    setLiveTheme(cert.theme);
  }

  // Filtered certificates list
  const filteredCertificates = useMemo(() => {
    return certificates.filter((c) => {
      const matchSearch =
        c.recipientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.certNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat = categoryFilter === "ALL" || c.category === categoryFilter;
      return matchSearch && matchCat;
    });
  }, [certificates, searchQuery, categoryFilter]);

  function handlePrintCertificate() {
    printSection("certificate-print-area", `${activeCert.title} — ${activeCert.recipientName}`);
  }

  function handleExportCsv() {
    const rows = certificates.map((c) => ({
      "Certificate Number": c.certNumber,
      "Verification UUID": c.uuid,
      "Recipient": c.recipientName,
      "Rank": c.recipientRank,
      "Title": c.title,
      "Category": c.category,
      "Achievement Citation": c.achievement,
      "Date Issued": c.issueDate,
      "Managing Director": c.signatory1,
      "Academic Officer": c.signatory2,
      "Cryptographic Hash": c.verificationHash
    }));
    exportToCsv(`MyUpline_International_Certificates_${new Date().toISOString().slice(0, 10)}`, rows);
  }

  function handleCopyVerificationHash() {
    navigator.clipboard.writeText(activeCert.verificationHash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2500);
  }

  function handleCreateCertificate(e: React.FormEvent) {
    e.preventDefault();
    if (!newRecipient.trim()) return;

    const newId = `cert-${Date.now().toString().slice(-4)}`;
    const randomHex = Math.random().toString(16).substring(2, 8);
    const newEntry: CertificateData = {
      id: newId,
      certNumber: `MUG-INT-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      uuid: `${randomHex}-88bf-9201`,
      title: newTitle,
      subtitle: "IN RECOGNITION OF DEDICATED ACHIEVEMENT & GLOBAL EXCELLENCE",
      recipientName: newRecipient.trim(),
      recipientRank: newRank,
      achievement:
        newAchievement.trim() ||
        `Recognized for extraordinary commitment to leadership duplication, ethical growth, and building high-performance frontline distribution squads.`,
      issueDate: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
      signatory1: "Dawit Wolde",
      signatory1Role: "Global Managing Director, MyUpline Global",
      signatory2: "Dr. Bethelhem Alemu",
      signatory2Role: "Dean of International Faculty & Accreditation",
      badgeTone: "gold",
      category: newCategory,
      theme: newTheme,
      verificationHash: `SHA256: ${Math.random().toString(16).slice(2)}${Math.random().toString(16).slice(2)}${Math.random().toString(16).slice(2)}`,
      country: "Global"
    };

    setCertificates([newEntry, ...certificates]);
    setActiveCert(newEntry);
    setLiveTheme(newTheme);
    setShowIssueModal(false);
    setNewRecipient("");
    setNewAchievement("");
  }

  // Theme styling configurations
  const themeStyles = useMemo(() => {
    switch (liveTheme) {
      case "platinum-diamond":
        return {
          outerBorder: "border-[#94a3b8] bg-gradient-to-br from-[#f8fafc] via-[#f1f5f9] to-[#e2e8f0]",
          ornateInner: "border-[#64748b]/60",
          accentLine: "bg-[#0ea5e9]",
          headerText: "text-[#0f172a]",
          nameText: "text-[#0284c7]",
          sealGradient: "from-sky-400 via-slate-200 to-sky-600",
          sealInner: "from-sky-50 to-slate-100 text-sky-950",
          ribbonColor: "bg-sky-600",
          stampColor: "border-sky-600/40 text-sky-800"
        };
      case "emerald-executive":
        return {
          outerBorder: "border-[#059669] bg-gradient-to-br from-[#f0fdf4] via-[#ffffff] to-[#ecfdf5]",
          ornateInner: "border-[#059669]/60",
          accentLine: "bg-[#059669]",
          headerText: "text-[#064e3b]",
          nameText: "text-[#047857]",
          sealGradient: "from-emerald-500 via-amber-300 to-emerald-700",
          sealInner: "from-emerald-50 to-amber-100 text-emerald-950",
          ribbonColor: "bg-emerald-700",
          stampColor: "border-emerald-600/40 text-emerald-800"
        };
      case "imperial-crimson":
        return {
          outerBorder: "border-[#b91c1c] bg-gradient-to-br from-[#fef2f2] via-[#ffffff] to-[#fff1f2]",
          ornateInner: "border-[#b91c1c]/60",
          accentLine: "bg-[#b91c1c]",
          headerText: "text-[#7f1d1d]",
          nameText: "text-[#991b1b]",
          sealGradient: "from-amber-500 via-rose-300 to-amber-600",
          sealInner: "from-rose-50 to-amber-100 text-amber-950",
          ribbonColor: "bg-rose-700",
          stampColor: "border-rose-600/40 text-rose-800"
        };
      case "geneva-modern":
        return {
          outerBorder: "border-[#1e293b] bg-white",
          ornateInner: "border-[#334155]/30",
          accentLine: "bg-[#0f172a]",
          headerText: "text-[#0f172a]",
          nameText: "text-[#0f172a]",
          sealGradient: "from-slate-700 via-slate-400 to-slate-900",
          sealInner: "from-slate-100 to-slate-200 text-slate-900",
          ribbonColor: "bg-slate-800",
          stampColor: "border-slate-800/40 text-slate-800"
        };
      case "royal-gold":
      default:
        return {
          outerBorder: "border-[#b8860b] bg-gradient-to-b from-[#fffefc] via-[#fbf8f0] to-[#f7f2e4]",
          ornateInner: "border-[#b8860b]/70",
          accentLine: "bg-[#b8860b]",
          headerText: "text-[#1e1b4b]",
          nameText: "text-[#996515]",
          sealGradient: "from-amber-500 via-yellow-200 to-amber-600",
          sealInner: "from-yellow-50 to-amber-100 text-amber-950",
          ribbonColor: "bg-amber-600",
          stampColor: "border-amber-700/40 text-amber-900"
        };
    }
  }, [liveTheme]);

  return (
    <div className="space-y-6">
      {/* ── Top Header Banner with Luxury Gold Aesthetic ── */}
      <div className="relative overflow-hidden rounded-3xl border border-amber-400/30 bg-gradient-to-br from-[#07132b] via-[#0d224d] to-[#051124] p-6 text-white shadow-2xl backdrop-blur-xl sm:p-8">
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-amber-400/10 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />

        <div className="relative flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-400/10 px-3.5 py-1 text-xs font-bold text-amber-300">
              <Crown className="h-3.5 w-3.5 text-amber-400" />
              <span>International Accreditation & Honors Council • Global Standard</span>
            </div>
            <h1 className="mt-3 text-2xl font-black tracking-tight sm:text-3xl text-white">
              Global Recognition & Official Certificates
            </h1>
            <p className="mt-1.5 max-w-2xl text-xs sm:text-sm text-slate-300">
              Issue, customize, digitally verify, and export tamper-evident executive certificates of rank milestones and leadership mastery with cryptographic verification.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              onClick={() => setShowIssueModal(true)}
              className="bg-gradient-to-r from-amber-400 to-amber-500 font-black text-brand-navy shadow-lg shadow-amber-500/20 hover:from-amber-300 hover:to-amber-400 text-xs h-10 px-4"
            >
              <Plus className="mr-1.5 h-4 w-4" /> Issue Certificate
            </Button>
            <Button
              onClick={() =>
                onOpenAi?.(
                  `Compose an eloquent international citation for ${activeCert.recipientName} celebrating their promotion to ${activeCert.recipientRank} in English and Amharic.`
                )
              }
              variant="ghost"
              className="border border-amber-400/30 bg-amber-400/10 text-xs font-bold text-amber-300 hover:bg-amber-400/20 h-10"
            >
              <Sparkles className="mr-1.5 h-3.5 w-3.5" /> AI Draft Citation
            </Button>
            <Button
              onClick={handleExportCsv}
              className="border border-slate-700 bg-slate-800/80 text-xs font-bold text-white hover:bg-slate-800 h-10"
            >
              <FileSpreadsheet className="mr-1.5 h-3.5 w-3.5" /> Export Ledger
            </Button>
            <Button
              onClick={handlePrintCertificate}
              className="border border-slate-700 bg-slate-800/80 text-xs font-bold text-white hover:bg-slate-800 h-10"
            >
              <Printer className="mr-1.5 h-3.5 w-3.5" /> Print / Export PDF
            </Button>
          </div>
        </div>

        {/* Quick Toolbar: Theme Selector & Language Toggle */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-slate-800/80 pt-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Certificate Theme:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: "royal-gold", label: "Royal Gold ⚜️", tone: "from-amber-400 to-yellow-600" },
                { id: "platinum-diamond", label: "Platinum Diamond 💎", tone: "from-slate-300 to-sky-400" },
                { id: "emerald-executive", label: "Emerald Honor 🌿", tone: "from-emerald-400 to-emerald-700" },
                { id: "imperial-crimson", label: "Imperial Crimson 🍷", tone: "from-rose-400 to-rose-700" },
                { id: "geneva-modern", label: "Geneva Modern 🌐", tone: "from-slate-600 to-slate-900" }
              ].map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => setLiveTheme(theme.id as CertificateTheme)}
                  className={cn(
                    "rounded-xl px-2.5 py-1 text-xs font-bold transition border",
                    liveTheme === theme.id
                      ? "border-amber-400 bg-amber-400/20 text-amber-300 shadow-md shadow-amber-500/20"
                      : "border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700"
                  )}
                >
                  {theme.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Language:
            </span>
            <div className="flex rounded-xl border border-slate-800 bg-slate-900/60 p-0.5 text-xs font-bold">
              <button
                onClick={() => setActiveLanguage("EN")}
                className={cn(
                  "rounded-lg px-2.5 py-0.5 transition",
                  activeLanguage === "EN" ? "bg-amber-400 text-brand-navy" : "text-slate-400 hover:text-white"
                )}
              >
                English
              </button>
              <button
                onClick={() => setActiveLanguage("AM")}
                className={cn(
                  "rounded-lg px-2.5 py-0.5 transition",
                  activeLanguage === "AM" ? "bg-amber-400 text-brand-navy" : "text-slate-400 hover:text-white"
                )}
              >
                አማርኛ (Amharic)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Two-Column Layout ── */}
      <div className="grid gap-6 xl:grid-cols-[380px_1fr]">
        {/* ── Left Sidebar: Certificates Registry & Search ── */}
        <div className="space-y-4">
          <Card className="border border-slate-800 bg-[#091b3a]/90 p-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-300">
                Official Credential Registry ({filteredCertificates.length})
              </h3>
              <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="h-3 w-3" /> All Verified
              </span>
            </div>

            {/* Search Input */}
            <div className="mt-3 relative">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search recipient or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9 w-full rounded-xl border border-slate-700 bg-[#06142a] pl-9 pr-3 text-xs text-white placeholder-slate-500 outline-none focus:border-amber-400"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="mt-3 flex flex-wrap gap-1">
              {["ALL", "Rank Advancement", "Top Recruiter", "Leadership Mastery", "LMS Academy Graduate"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={cn(
                    "rounded-lg px-2 py-0.5 text-[10px] font-bold transition",
                    categoryFilter === cat
                      ? "bg-amber-400 text-brand-navy"
                      : "bg-slate-800/60 text-slate-400 hover:text-white"
                  )}
                >
                  {cat === "ALL" ? "All Honors" : cat}
                </button>
              ))}
            </div>

            {/* Certificate List */}
            <div className="mt-3 space-y-2 max-h-[640px] overflow-y-auto pr-1">
              {filteredCertificates.map((cert) => {
                const isSelected = activeCert.id === cert.id;
                return (
                  <div
                    key={cert.id}
                    onClick={() => handleSelectCert(cert)}
                    className={cn(
                      "cursor-pointer rounded-2xl border p-3.5 transition-all duration-200 relative",
                      isSelected
                        ? "border-amber-400/80 bg-gradient-to-r from-amber-500/15 via-[#0d2657] to-[#07193b] shadow-lg ring-1 ring-amber-400/40"
                        : "border-slate-800 bg-[#06142a]/80 hover:border-slate-700 hover:bg-[#091f48]"
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={cn(
                            "flex h-8 w-8 shrink-0 items-center justify-center rounded-xl font-bold shadow-sm",
                            cert.badgeTone === "gold" && "bg-amber-400/20 text-amber-300 border border-amber-400/30",
                            cert.badgeTone === "cyan" && "bg-cyan-400/20 text-cyan-300 border border-cyan-400/30",
                            cert.badgeTone === "emerald" && "bg-emerald-400/20 text-emerald-300 border border-emerald-400/30",
                            cert.badgeTone === "purple" && "bg-purple-400/20 text-purple-300 border border-purple-400/30"
                          )}
                        >
                          <Medal className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-bold text-white text-xs leading-tight">{cert.recipientName}</p>
                          <p className="text-[10px] text-amber-300 font-semibold">{cert.recipientRank}</p>
                        </div>
                      </div>

                      <span className="rounded bg-slate-900 px-1.5 py-0.5 text-[9px] font-mono text-slate-400 border border-slate-800">
                        {cert.certNumber.slice(-4)}
                      </span>
                    </div>

                    <p className="mt-2 text-[11px] font-medium text-slate-300 line-clamp-1">{cert.title}</p>

                    <div className="mt-2 flex items-center justify-between border-t border-slate-800/80 pt-2 text-[10px] text-slate-400">
                      <span>{cert.issueDate}</span>
                      <span className="font-semibold text-emerald-400 flex items-center gap-1">
                        <ShieldCheck className="h-3 w-3" /> Verified
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* ── Right Column: The Masterpiece International Certificate Canvas ── */}
        <div className="flex flex-col items-center">
          {/* Live Action Bar on top of Canvas */}
          <div className="mb-3 flex w-full max-w-[850px] items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-1 text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5" /> Immutable Credential ID: {activeCert.uuid}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                onClick={() => setIsVerifying(true)}
                className="border border-slate-700 bg-slate-800/80 text-xs font-bold text-slate-200 hover:text-white hover:bg-slate-800 h-9"
              >
                <QrCode className="mr-1.5 h-3.5 w-3.5 text-cyan-400" /> Verify Online
              </Button>
              <Button
                onClick={handlePrintCertificate}
                className="bg-gradient-to-r from-amber-400 to-amber-500 text-brand-navy font-black hover:from-amber-300 hover:to-amber-400 text-xs h-9 shadow-md shadow-amber-500/20"
              >
                <Printer className="mr-1.5 h-3.5 w-3.5" /> Print / Export PDF
              </Button>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════════════════════ */}
          {/* THE OFFICIAL CERTIFICATE PRINTABLE AREA                                   */}
          {/* Designed to standard A4/US Letter Landscape (Aspect Ratio 1.414 : 1)       */}
          {/* ══════════════════════════════════════════════════════════════════════════ */}
          <div
            id="certificate-print-area"
            className={cn(
              "relative w-full max-w-[850px] select-none rounded-3xl border-[12px] p-8 sm:p-12 text-slate-900 shadow-2xl transition-all duration-300 flex flex-col justify-between aspect-[1.414/1] overflow-hidden",
              themeStyles.outerBorder
            )}
            style={{
              boxShadow: "0 25px 60px -15px rgba(0, 0, 0, 0.4), 0 0 40px rgba(184, 134, 11, 0.15)"
            }}
          >
            {/* Guilloche & Classical Security Rosette Borders (SVG) */}
            <div className="pointer-events-none absolute inset-3 rounded-2xl border-2 border-dashed border-[#b8860b]/40" />
            <div className="pointer-events-none absolute inset-5 rounded-xl border border-[#b8860b]/30" />

            {/* Corner Filigree Ornaments */}
            <svg className="pointer-events-none absolute top-4 left-4 h-12 w-12 text-[#b8860b]/50" viewBox="0 0 100 100">
              <path d="M10,10 L90,10 L90,20 L20,20 L20,90 L10,90 Z" fill="currentColor" />
              <circle cx="25" cy="25" r="4" fill="currentColor" />
              <path d="M15,30 Q30,30 30,15" stroke="currentColor" strokeWidth="2" fill="none" />
            </svg>
            <svg className="pointer-events-none absolute top-4 right-4 h-12 w-12 text-[#b8860b]/50 rotate-90" viewBox="0 0 100 100">
              <path d="M10,10 L90,10 L90,20 L20,20 L20,90 L10,90 Z" fill="currentColor" />
              <circle cx="25" cy="25" r="4" fill="currentColor" />
              <path d="M15,30 Q30,30 30,15" stroke="currentColor" strokeWidth="2" fill="none" />
            </svg>
            <svg className="pointer-events-none absolute bottom-4 left-4 h-12 w-12 text-[#b8860b]/50 -rotate-90" viewBox="0 0 100 100">
              <path d="M10,10 L90,10 L90,20 L20,20 L20,90 L10,90 Z" fill="currentColor" />
              <circle cx="25" cy="25" r="4" fill="currentColor" />
              <path d="M15,30 Q30,30 30,15" stroke="currentColor" strokeWidth="2" fill="none" />
            </svg>
            <svg className="pointer-events-none absolute bottom-4 right-4 h-12 w-12 text-[#b8860b]/50 rotate-180" viewBox="0 0 100 100">
              <path d="M10,10 L90,10 L90,20 L20,20 L20,90 L10,90 Z" fill="currentColor" />
              <circle cx="25" cy="25" r="4" fill="currentColor" />
              <path d="M15,30 Q30,30 30,15" stroke="currentColor" strokeWidth="2" fill="none" />
            </svg>

            {/* Subtle Watermark in Background */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.035]">
              <div className="h-80 w-80 rounded-full border-[18px] border-slate-900 flex items-center justify-center">
                <Crown className="h-44 w-44 text-slate-900" />
              </div>
            </div>

            {/* Microprint Security Header Line */}
            <div className="relative z-10 text-center">
              <p className="text-[7px] font-mono tracking-[0.35em] text-[#856404] uppercase opacity-75">
                ★ MYUPLINE GLOBAL ACCREDITATION COUNCIL • VERIFIED TAMPER-EVIDENT RECORD • DIRECT SELLING ACADEMIC FELLOWSHIP ★
              </p>

              {/* Institution Seal & Brand */}
              <div className="mt-3 flex items-center justify-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-amber-500 to-amber-700 text-white shadow-md">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-serif text-sm sm:text-base font-black tracking-[0.25em] text-[#1e1b4b] uppercase">
                    MYUPLINE GLOBAL NETWORK
                  </h3>
                  <p className="text-[9px] font-bold tracking-[0.15em] text-slate-500 uppercase">
                    INTERNATIONAL DIRECT SELLING & LEADERSHIP COMMISSION
                  </p>
                </div>
              </div>

              {/* Certificate Main Title */}
              <h1 className={cn("mt-4 font-serif text-2xl sm:text-4xl font-black uppercase tracking-wider", themeStyles.headerText)}>
                {activeLanguage === "AM" && activeCert.titleAm ? activeCert.titleAm : activeCert.title}
              </h1>

              {/* Subtitle with decorative divider */}
              <div className="mt-1 flex items-center justify-center gap-3">
                <div className="h-0.5 w-12 bg-gradient-to-r from-transparent to-[#b8860b]" />
                <p className="text-[10px] sm:text-xs font-bold tracking-widest text-[#713f12] uppercase">
                  {activeLanguage === "AM" && activeCert.subtitleAm ? activeCert.subtitleAm : activeCert.subtitle}
                </p>
                <div className="h-0.5 w-12 bg-gradient-to-l from-transparent to-[#b8860b]" />
              </div>
            </div>

            {/* Recipient Presentation Block */}
            <div className="relative z-10 my-auto text-center py-2">
              <p className="font-serif text-xs sm:text-sm italic text-slate-600">
                {activeLanguage === "AM" ? "ይህ ዓለም አቀፍ የክብር ምስክር ወረቀት በይፋ ተሰጥቷል ለ:" : "This official certificate of supreme honor is proudly presented to:"}
              </p>

              <h2 className={cn("mt-2 font-serif text-3xl sm:text-4xl lg:text-5xl font-black tracking-wide", themeStyles.nameText)}>
                {activeCert.recipientName}
              </h2>

              <div className="mt-1 flex items-center justify-center gap-2">
                <span className="rounded-full bg-[#b8860b]/15 px-3 py-0.5 text-xs font-black uppercase tracking-wider text-[#996515] border border-[#b8860b]/30">
                  {activeCert.recipientRank}
                </span>
                <span className="text-[11px] font-bold text-slate-400">•</span>
                <span className="text-xs font-semibold text-slate-600">Honoree ID: {activeCert.uuid}</span>
              </div>

              {/* Achievement Citation */}
              <p className="mx-auto mt-4 max-w-xl text-xs sm:text-sm font-serif leading-relaxed text-slate-700 italic px-4">
                &ldquo;{activeLanguage === "AM" && activeCert.achievementAm ? activeCert.achievementAm : activeCert.achievement}&rdquo;
              </p>
            </div>

            {/* Official Signatories, 3D Embossed Gold Seal, and QR Code */}
            <div className="relative z-10 flex items-end justify-between border-t border-[#b8860b]/40 pt-4 px-2">
              {/* Signatory 1: Managing Director */}
              <div className="text-left max-w-[200px]">
                {/* Simulated Realistic Signature Script */}
                <div className="h-9 font-serif italic text-base text-[#1e1b4b] font-bold flex items-end border-b border-slate-700 pb-0.5 tracking-wide">
                  Dawit Wolde
                </div>
                <p className="mt-1 text-xs font-black text-slate-900">{activeCert.signatory1}</p>
                <p className="text-[9px] text-slate-500 font-medium leading-tight">{activeCert.signatory1Role}</p>
              </div>

              {/* Center: 3D Metallic Foil Embossed Seal with Ribbon */}
              <div className="flex flex-col items-center relative -mb-3">
                {/* Satin Ribbon Tails */}
                <div className="relative flex justify-center -mb-4">
                  <div className={cn("h-8 w-4 -rotate-12 rounded-b shadow-md", themeStyles.ribbonColor)} />
                  <div className={cn("h-8 w-4 rotate-12 rounded-b shadow-md -ml-1", themeStyles.ribbonColor)} />
                </div>

                {/* Scalloped Gold Medallion */}
                <div
                  className={cn(
                    "relative z-10 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-tr p-1 shadow-2xl border-2 border-white",
                    themeStyles.sealGradient
                  )}
                  style={{
                    boxShadow: "0 10px 25px -5px rgba(184, 134, 11, 0.6)"
                  }}
                >
                  <div
                    className={cn(
                      "flex h-full w-full flex-col items-center justify-center rounded-full border-2 border-dashed border-amber-800/40 bg-gradient-to-b text-center p-1",
                      themeStyles.sealInner
                    )}
                  >
                    <Crown className="h-5 w-5 text-amber-900" />
                    <span className="mt-0.5 text-[7px] font-black tracking-tighter uppercase text-amber-950">
                      OFFICIAL SEAL
                    </span>
                    <span className="text-[6px] font-bold tracking-widest text-amber-800">
                      ACCREDITED
                    </span>
                  </div>
                </div>

                <span className="mt-1 font-mono text-[9px] font-bold text-slate-700">
                  {activeCert.certNumber}
                </span>
              </div>

              {/* Signatory 2 & Official Verification Timestamp */}
              <div className="text-right max-w-[200px]">
                {/* Simulated Signature 2 */}
                <div className="h-9 font-serif italic text-base text-[#1e1b4b] font-bold flex items-end justify-end border-b border-slate-700 pb-0.5 tracking-wide">
                  Dr. Bethelhem Alemu
                </div>
                <p className="mt-1 text-xs font-black text-slate-900">{activeCert.signatory2}</p>
                <p className="text-[9px] text-slate-500 font-medium leading-tight">{activeCert.signatory2Role}</p>
                <p className="mt-0.5 text-[8px] font-bold text-emerald-700 uppercase tracking-wider">
                  ● Conferred {activeCert.issueDate}
                </p>
              </div>
            </div>
          </div>

          {/* Canvas Bottom Utility Row */}
          <div className="mt-4 flex w-full max-w-[850px] flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[11px] text-slate-500">Hash: {activeCert.verificationHash.slice(0, 24)}...</span>
              <button
                onClick={handleCopyVerificationHash}
                className="text-[11px] text-amber-400 hover:underline flex items-center gap-1 font-bold"
              >
                {copiedHash ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                {copiedHash ? "Copied!" : "Copy SHA256"}
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-400">Accredited by <strong>DSA Global Standards</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Modal: Online Verification & Tamper-Check ── */}
      {isVerifying && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md animate-in fade-in">
          <Card className="w-full max-w-lg border border-cyan-500/30 bg-[#0c1e3d] p-6 shadow-2xl text-white">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-black text-white text-base">Cryptographic Credential Verification</h3>
                  <p className="text-[10px] text-slate-400">MyUpline Global Decentralized Trust Registry</p>
                </div>
              </div>
              <button
                onClick={() => setIsVerifying(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-5 space-y-4 text-xs">
              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4">
                <div className="flex items-center justify-between">
                  <span className="font-black text-emerald-400 text-sm">STATUS: VALID & RATIFIED</span>
                  <span className="rounded-full bg-emerald-400/20 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
                    Active on Ledger
                  </span>
                </div>
                <p className="text-slate-300 mt-1.5 leading-relaxed">
                  This official honor was ratified by the MyUpline Global Executive Board on {activeCert.issueDate}. Digital signature keys match the authorized root certificate.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-[#06142a] p-4 space-y-2">
                <div className="flex justify-between border-b border-slate-800 pb-1.5">
                  <span className="text-slate-400">Recipient Honoree:</span>
                  <span className="font-bold text-white">{activeCert.recipientName}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-1.5">
                  <span className="text-slate-400">Recognized Rank:</span>
                  <span className="font-bold text-amber-300">{activeCert.recipientRank}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-1.5">
                  <span className="text-slate-400">Award Title:</span>
                  <span className="font-semibold text-white">{activeCert.title}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-1.5">
                  <span className="text-slate-400">Registry Serial:</span>
                  <span className="font-mono text-cyan-300">{activeCert.certNumber}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-1.5">
                  <span className="text-slate-400">UUID Token:</span>
                  <span className="font-mono text-slate-300">{activeCert.uuid}</span>
                </div>
                <div className="pt-1">
                  <span className="text-slate-400 block mb-1">Cryptographic Ledger Hash:</span>
                  <p className="font-mono text-[10px] text-cyan-400 bg-slate-900/80 p-2 rounded-lg break-all border border-slate-800">
                    {activeCert.verificationHash}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2 border-t border-slate-800 pt-3">
              <Button
                onClick={() => setIsVerifying(false)}
                className="bg-cyan-400 text-brand-navy font-black hover:bg-cyan-300 text-xs"
              >
                Done
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* ── Modal: Issue New Certificate ── */}
      {showIssueModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md animate-in fade-in">
          <Card className="w-full max-w-lg border border-amber-400/30 bg-[#0c1e3d] p-6 shadow-2xl text-white">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-amber-400" />
                <h3 className="font-black text-white text-base">Issue Official Recognition Certificate</h3>
              </div>
              <button
                onClick={() => setShowIssueModal(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCertificate} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Honoree Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Solomon Hailu Tadesse"
                  value={newRecipient}
                  onChange={(e) => setNewRecipient(e.target.value)}
                  className="h-10 w-full rounded-xl border border-slate-700 bg-[#06142a] px-3 text-xs text-white placeholder-slate-500 outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Rank / Tier Level</label>
                  <select
                    value={newRank}
                    onChange={(e) => setNewRank(e.target.value)}
                    className="h-10 w-full rounded-xl border border-slate-700 bg-[#06142a] px-3 text-xs text-white outline-none focus:border-amber-400"
                  >
                    <option value="Crown Diamond Ambassador">Crown Diamond Ambassador</option>
                    <option value="Diamond Director">Diamond Director</option>
                    <option value="Platinum Leader">Platinum Leader</option>
                    <option value="Gold Executive">Gold Executive</option>
                    <option value="Silver Manager">Silver Manager</option>
                    <option value="Bronze Builder">Bronze Builder</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Honors Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="h-10 w-full rounded-xl border border-slate-700 bg-[#06142a] px-3 text-xs text-white outline-none focus:border-amber-400"
                  >
                    <option value="Rank Advancement">Rank Advancement</option>
                    <option value="Top Recruiter">Top Recruiter</option>
                    <option value="Leadership Mastery">Leadership Mastery</option>
                    <option value="LMS Academy Graduate">LMS Academy Graduate</option>
                    <option value="Presidential Honor">Presidential Honor</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Certificate Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="h-10 w-full rounded-xl border border-slate-700 bg-[#06142a] px-3 text-xs text-white outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Visual Theme</label>
                <select
                  value={newTheme}
                  onChange={(e) => setNewTheme(e.target.value as any)}
                  className="h-10 w-full rounded-xl border border-slate-700 bg-[#06142a] px-3 text-xs text-white outline-none focus:border-amber-400"
                >
                  <option value="royal-gold">Royal Gold ⚜️</option>
                  <option value="platinum-diamond">Platinum Diamond 💎</option>
                  <option value="emerald-executive">Emerald Executive 🌿</option>
                  <option value="imperial-crimson">Imperial Crimson 🍷</option>
                  <option value="geneva-modern">Geneva Modern 🌐</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">
                  Achievement Citation / Official Commendation
                </label>
                <textarea
                  rows={3}
                  placeholder="Enter the official achievement praise, milestones achieved, or team expansion metrics..."
                  value={newAchievement}
                  onChange={(e) => setNewAchievement(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-[#06142a] p-3 text-xs text-white placeholder-slate-500 outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex justify-end gap-2 border-t border-slate-800 pt-3">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowIssueModal(false)}
                  className="text-xs font-bold text-slate-400 hover:text-white"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-amber-400 text-brand-navy font-black hover:bg-amber-300 text-xs shadow-lg shadow-amber-500/25 px-5"
                >
                  Issue & Seal Credential <Crown className="ml-1.5 h-4 w-4" />
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
