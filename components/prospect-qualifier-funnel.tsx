"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  Building2,
  Calendar,
  Check,
  CheckCircle2,
  ChevronRight,
  Compass,
  DollarSign,
  Eye,
  Flame,
  Globe,
  HeartHandshake,
  HelpCircle,
  Home,
  Layers,
  Lightbulb,
  Lock,
  Mail,
  MapPin,
  MessageCircle,
  MessageSquare,
  Network,
  Phone,
  Plane,
  Radio,
  Send,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  Trophy,
  User,
  Users,
  X,
  Zap
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/brand-logo";
import { cn } from "@/lib/utils";
import {
  getProspectFunnelConfig,
  ProspectFunnelConfig,
  defaultProspectFunnelConfig
} from "@/lib/onboarding-prospect-config";

export interface ProspectSubmission {
  id: string;
  sponsorRef?: string;
  submittedAt: string;
  language: "am" | "en";
  // The 9 Questions from Image 2
  q1_current_work: string;
  q2_achieve_goal: string;
  q3_family_home: string;
  q4_spiritual_vacation_places: string;
  q5_hate_about_current_work: string;
  q6_target_monthly_income: string;
  q7_current_action_for_dream: string;
  q8_can_achieve_with_current: "yes" | "no";
  q8_timeframe?: string;
  q9_readiness_score: number; // 0 to 100
  // Contact details (unlocked when > 50%)
  fullName: string;
  phone: string;
  address: string;
  telegramUsername: string;
}

interface ProspectQualifierFunnelProps {
  initialLang?: "am" | "en";
  sponsorRef?: string;
  sponsorName?: string;
  onSuccessSubmit?: (data: ProspectSubmission) => void;
  isDashboardPreview?: boolean;
}

export function ProspectQualifierFunnel({
  initialLang = "am",
  sponsorRef = "BREAKTHROUGH-TOP",
  sponsorName = "Breakthrough Share Company Leadership",
  onSuccessSubmit,
  isDashboardPreview = false
}: ProspectQualifierFunnelProps) {
  const [lang, setLang] = useState<"am" | "en">(initialLang);

  // Dynamic Funnel Config (Editable via Super Admin CRUD Studio)
  const [funnelConfig, setFunnelConfig] = useState<ProspectFunnelConfig>(defaultProspectFunnelConfig);

  useEffect(() => {
    setFunnelConfig(getProspectFunnelConfig());
    const handleUpdate = () => setFunnelConfig(getProspectFunnelConfig());
    window.addEventListener("storage", handleUpdate);
    window.addEventListener("myupline_funnel_config_updated", handleUpdate);
    return () => {
      window.removeEventListener("storage", handleUpdate);
      window.removeEventListener("myupline_funnel_config_updated", handleUpdate);
    };
  }, []);

  // Funnel Phase: 1 (Step 1), 2 (Step 2), 3 (Step 3), 4 (Page 2 Questionnaire), 5 (Submitted Success)
  const [funnelStep, setFunnelStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Questionnaire State (Page 2)
  const [q1, setQ1] = useState("");
  const [q2, setQ2] = useState("");
  const [q3, setQ3] = useState("");
  const [q4, setQ4] = useState("");
  const [q5, setQ5] = useState("");
  const [q6, setQ6] = useState("");
  const [q7, setQ7] = useState("");
  const [q8, setQ8] = useState<"yes" | "no">("no");
  const [q8Timeframe, setQ8Timeframe] = useState("");
  const [q9Score, setQ9Score] = useState<number>(80); // Default readiness > 50%

  // Contact Info (Condition: >= cutoff, default 50%)
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("+251 9");
  const [address, setAddress] = useState("");
  const [telegramUsername, setTelegramUsername] = useState("@");

  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedLead, setSubmittedLead] = useState<ProspectSubmission | null>(null);

  const cutoff = funnelConfig.readinessCutoffPercentage ?? 50;
  const isQualified = q9Score >= cutoff;

  const getQ = (num: number) => funnelConfig.questions?.find((q) => q.number === num);

  function handleSubmitProspect(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");

    if (!isQualified) {
      setFormError(
        lang === "am"
          ? `ይቅርታ፡ የዝግጁነት ደረጃዎ ከ${cutoff}% በላይ መሆን አለበት። እባክዎ ጥያቄ 9ን ያረጋግጡ።`
          : `Your readiness score must be at least ${cutoff}% to qualify for senior mentorship.`
      );
      return;
    }

    if (!fullName.trim() || fullName.trim().length < 3) {
      setFormError(
        lang === "am"
          ? "እባክዎ ትክክለኛ ሙሉ ስምዎን ያስገቡ።"
          : "Please provide your full legal name."
      );
      return;
    }

    if (!phone.trim() || phone.replace(/[^\d]/g, "").length < 9) {
      setFormError(
        lang === "am"
          ? "እባክዎ ትክክለኛ ስልክ ቁጥር ያስገቡ።"
          : "Please provide a valid phone number."
      );
      return;
    }

    setIsSubmitting(true);

    const submission: ProspectSubmission = {
      id: `lead-${Date.now()}`,
      sponsorRef,
      submittedAt: new Date().toISOString(),
      language: lang,
      q1_current_work: q1,
      q2_achieve_goal: q2,
      q3_family_home: q3,
      q4_spiritual_vacation_places: q4,
      q5_hate_about_current_work: q5,
      q6_target_monthly_income: q6,
      q7_current_action_for_dream: q7,
      q8_can_achieve_with_current: q8,
      q8_timeframe: q8 === "yes" ? q8Timeframe : undefined,
      q9_readiness_score: q9Score,
      fullName: fullName.trim(),
      phone: phone.trim(),
      address: address.trim(),
      telegramUsername: telegramUsername.trim()
    };

    // Save to localStorage so leaders, studio inbox, and pipeline can display it immediately
    try {
      const existing = JSON.parse(window.localStorage.getItem("myupline_prospect_submissions") || "[]");
      existing.unshift(submission);
      window.localStorage.setItem("myupline_prospect_submissions", JSON.stringify(existing));
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("myupline_submission_added"));
      }
    } catch {}

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmittedLead(submission);
      setFunnelStep(5);
      if (onSuccessSubmit) {
        onSuccessSubmit(submission);
      }
    }, 600);
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* ── Top Bar with Language Toggle ── */}
      <div className="flex items-center justify-between mb-4 px-2">
        <div className="flex items-center gap-2">
          {!isDashboardPreview && <BrandLogo />}
          <span className="rounded-full border border-cyan-500/30 bg-cyan-950/40 px-2.5 py-0.5 text-[10px] font-black uppercase text-cyan-300">
            {lang === "am" ? "የእጩ አጋሮች መመዘኛ" : "Prospect Qualifier"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setLang(lang === "am" ? "en" : "am")}
            className="flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/10 px-3 py-1 text-xs font-black text-white hover:bg-white/20 transition-all shadow"
          >
            <Globe className="h-3.5 w-3.5 text-cyan-300" />
            <span>{lang === "am" ? "🇬🇧 English" : "🇪🇹 አማርኛ"}</span>
          </button>
        </div>
      </div>

      {/* ── Progress Indicators (Steps 1, 2, 3 -> Page 2 Questionnaire) ── */}
      <div className="mb-6 flex items-center justify-between px-3">
        {[
          { num: 1, label: lang === "am" ? "ደረጃ 1: አስተሳሰብ" : "Step 1: Attitude" },
          { num: 2, label: lang === "am" ? "ደረጃ 2: ሲስተም" : "Step 2: System" },
          { num: 3, label: lang === "am" ? "ደረጃ 3: ቁርጠኝነት" : "Step 3: Seriousness" },
          { num: 4, label: lang === "am" ? "ገፅ 2: መመዘኛ ቅፅ" : "Page 2: 9 Questions" }
        ].map((s, idx) => {
          const isPassed = funnelStep > s.num;
          const isCurrent = funnelStep === s.num;

          return (
            <div key={s.num} className="flex items-center flex-1 last:flex-none">
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    "flex h-7 w-7 items-center justify-center rounded-full text-xs font-black transition-all duration-300",
                    isPassed
                      ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/30"
                      : isCurrent
                      ? "bg-cyan-400 text-brand-navy ring-4 ring-cyan-400/20 shadow-md shadow-cyan-400/30 font-extrabold"
                      : "border border-slate-700 bg-slate-800 text-slate-500"
                  )}
                >
                  {isPassed ? <Check className="h-3.5 w-3.5 stroke-[3]" /> : s.num}
                </div>
                <span
                  className={cn(
                    "hidden sm:inline text-xs font-bold",
                    isCurrent ? "text-cyan-300" : isPassed ? "text-emerald-300" : "text-slate-500"
                  )}
                >
                  {s.label}
                </span>
              </div>

              {idx < 3 && (
                <div
                  className={cn(
                    "h-0.5 flex-1 mx-2 transition-colors duration-300",
                    funnelStep > idx + 1 ? "bg-cyan-400" : "bg-slate-800"
                  )}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* ── Main Container Card ── */}
      <div className="rounded-3xl border border-cyan-500/30 bg-[#0c1f3d]/95 p-6 shadow-2xl backdrop-blur-xl sm:p-10 text-white">
        {/* ========================================================================= */}
        {/* STEP 1 (IMAGE 1, ITEM 1): ATTITUDE & FINANCIAL GROWTH                    */}
        {/* ========================================================================= */}
        {funnelStep === 1 && (
          <div className="space-y-6 text-center animate-in fade-in duration-300">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-cyan-400/15 border border-cyan-400/30 text-cyan-300 shadow-xl shadow-cyan-400/20">
              <Sparkles className="h-10 w-10 text-cyan-300" />
            </div>

            <div className="space-y-3">
              <span className="rounded-full bg-cyan-400/20 px-3 py-1 text-xs font-black uppercase tracking-widest text-cyan-300">
                {lang === "am" ? "ደረጃ 1 • መግቢያ" : "Step 1 • Qualification"}
              </span>

              {/* Exact wording from Image 1, item 1 (Dynamically editable via Super Admin CRUD) */}
              <h1 className="text-2xl font-black text-white sm:text-3xl leading-snug">
                {lang === "am"
                  ? funnelConfig.step1?.headlineAm || "ይህ እድል አስተሳሰባቸውን ማሳደግ እና በገንዘብ ማደግ ለሚፈልጉ ሰዎች ብቻ የተዘጋጀ ነው።"
                  : funnelConfig.step1?.headlineEn || "THIS is for People who want to Develop Attitude and grow financially."}
              </h1>

              <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
                {lang === "am"
                  ? "ከእነዚህ ሰዎች መካከል አንዱ ከሆኑ 'ቀጣይ' የሚለውን በመጫን ይቀጥሉ።"
                  : "If you are the one, Click NEXT."}
              </p>
            </div>

            <div className="pt-4 max-w-md mx-auto">
              <Button
                type="button"
                onClick={() => setFunnelStep(2)}
                className="h-14 w-full rounded-2xl bg-cyan-400 text-base font-black text-brand-navy shadow-xl shadow-cyan-400/30 hover:bg-cyan-300 transition-all transform hover:scale-[1.02]"
              >
                {lang === "am" ? "ቀጣይ (NEXT)" : "NEXT"} <ArrowRight className="ml-2 h-5 w-5 stroke-[2.5]" />
              </Button>
            </div>

            <p className="text-xs text-slate-500">Breakthrough Share Company • Leadership Intake</p>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 2 (IMAGE 1, ITEM 2): SIMPLE SYSTEM & BUILDING A STRONG TEAM         */}
        {/* ========================================================================= */}
        {funnelStep === 2 && (
          <div className="space-y-6 text-center animate-in fade-in duration-300">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 shadow-xl shadow-emerald-400/20">
              <Network className="h-10 w-10 text-emerald-300" />
            </div>

            <div className="space-y-3">
              <span className="rounded-full bg-emerald-400/20 px-3 py-1 text-xs font-black uppercase tracking-widest text-emerald-300">
                {lang === "am" ? "ደረጃ 2 • የሲስተም አሰራር" : "Step 2 • The System"}
              </span>

              {/* Exact wording from Image 1, item 2 (Dynamically editable via Super Admin CRUD) */}
              <h1 className="text-2xl font-black text-white sm:text-3xl leading-snug">
                {lang === "am"
                  ? funnelConfig.step2?.headlineAm || "ራስዎን በማብቃት እና ጠንካራ ቡድን በመገንባት ገቢ የሚያገኙበት ቀላል (SIMPLE) ሲስተም ነው።"
                  : funnelConfig.step2?.headlineEn || "A SIMPLE system where you earn by developing yourself and Building a Strong Team."}
              </h1>

              <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
                {lang === "am"
                  ? "ዝግጁ ከሆኑ ወደ ቀጣዩ ደረጃ እንለፍ።"
                  : "If you are ready, let's proceed to the Next."}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 max-w-md mx-auto">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setFunnelStep(1)}
                className="h-12 w-full sm:w-auto text-xs font-bold text-slate-400 hover:text-white"
              >
                <ArrowLeft className="mr-1 h-4 w-4" /> {lang === "am" ? "ተመለስ" : "Back"}
              </Button>

              <Button
                type="button"
                onClick={() => setFunnelStep(3)}
                className="h-14 flex-1 w-full rounded-2xl bg-emerald-400 text-base font-black text-brand-navy shadow-xl shadow-emerald-400/30 hover:bg-emerald-300 transition-all transform hover:scale-[1.02]"
              >
                {lang === "am" ? "ወደ ቀጣዩ እንለፍ (PROCEED TO NEXT)" : "Proceed to the Next"}{" "}
                <ArrowRight className="ml-2 h-5 w-5 stroke-[2.5]" />
              </Button>
            </div>

            <p className="text-xs text-slate-500">Mentorship & Group Volume Architecture</p>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 3 (IMAGE 1, ITEM 3): NOT QUICK MONEY • SERIOUS PEOPLE FOR FREEDOM    */}
        {/* ========================================================================= */}
        {funnelStep === 3 && (
          <div className="space-y-6 text-center animate-in fade-in duration-300">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-amber-500/15 border border-amber-400/30 text-amber-300 shadow-xl shadow-amber-400/20">
              <ShieldAlert className="h-10 w-10 text-amber-300" />
            </div>

            <div className="space-y-3">
              <span className="rounded-full bg-amber-400/20 px-3 py-1 text-xs font-black uppercase tracking-widest text-amber-300">
                {lang === "am" ? "ደረጃ 3 • የመጨረሻ ማጣሪያ" : "Step 3 • Critical Filter"}
              </span>

              {/* Exact wording from Image 1, item 3 (Dynamically editable via Super Admin CRUD) */}
              <h1 className="text-2xl font-black text-white sm:text-3xl leading-snug">
                {lang === "am"
                  ? funnelConfig.step3?.headlineAm || "ይህ ፈጣን ገንዘብ (Quick Money) ለሚፈልጉ ሰዎች በፍጹም አይደለም!"
                  : funnelConfig.step3?.headlineEn || "THIS is Not for people who want quick money."}
              </h1>

              <div className="rounded-2xl border border-amber-500/30 bg-amber-950/20 p-4 max-w-xl mx-auto">
                <p className="text-base sm:text-lg font-black text-amber-200">
                  {lang === "am"
                    ? funnelConfig.step3?.highlightAm || "እውነተኛ ነፃነትን (Freedom) ለሚፈልጉ ቁርጠኛ እና አላማ ላላቸው (Serious) ሰዎች ብቻ የተዘጋጀ ነው።"
                    : funnelConfig.step3?.highlightEn || "It's only for Serious people who want freedom."}
                </p>
              </div>

              <p className="text-sm font-bold text-slate-300">
                {lang === "am"
                  ? "ዝግጁ ከሆኑ የሚከተለውን ቅፅ በቁርጠኝነት ይሙሉ ↓↓"
                  : "If you are ready, fill this form Seriously ↓↓"}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 max-w-md mx-auto">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setFunnelStep(2)}
                className="h-12 w-full sm:w-auto text-xs font-bold text-slate-400 hover:text-white"
              >
                <ArrowLeft className="mr-1 h-4 w-4" /> {lang === "am" ? "ተመለስ" : "Back"}
              </Button>

              <Button
                type="button"
                onClick={() => setFunnelStep(4)}
                className="h-14 flex-1 w-full rounded-2xl bg-cyan-400 text-base font-black text-brand-navy shadow-xl shadow-cyan-400/30 hover:bg-cyan-300 transition-all transform hover:scale-[1.02]"
              >
                {lang === "am" ? "ቅፁን በሙሉ (Prospect Fill Page 2)" : "Fill Prospect Form (Page 2)"}{" "}
                <ArrowRight className="ml-2 h-5 w-5 stroke-[2.5]" />
              </Button>
            </div>

            <p className="text-xs text-slate-500">Breakthrough Share Company Confidential Intake</p>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 4: PAGE 2 (IMAGE 2) — THE 9 IN-DEPTH QUALIFYING QUESTIONS           */}
        {/* ========================================================================= */}
        {funnelStep === 4 && (
          <form onSubmit={handleSubmitProspect} className="space-y-6 animate-in fade-in duration-300">
            <div className="border-b border-slate-800 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                    {lang === "am" ? "ገፅ 2 • የእጩ አጋሮች መመዘኛ ቅፅ" : "Page 2 • Prospect Evaluation Form"}
                  </span>
                  <h2 className="text-xl font-black text-white sm:text-2xl mt-0.5">
                    {lang === "am" ? "የ9 ጥያቄዎች ግምገማ እና መመዘኛ" : "9-Question In-Depth Prospect Assessment"}
                  </h2>
                </div>
                <div className="rounded-xl border border-cyan-500/30 bg-cyan-950/40 px-3 py-1 text-xs font-bold text-cyan-300">
                  {sponsorName}
                </div>
              </div>
              <p className="text-xs text-slate-400 mt-1.5">
                {lang === "am"
                  ? "እባክዎ እያንዳንዱን ጥያቄ በጥሞና እና በግልፅ ይመልሱ። ከ50% በላይ ዝግጁ ከሆኑ የመገኛ አድራሻዎ ይከፈታል።"
                  : "Please answer each question honestly. Selecting a readiness score > 50% on Question 9 will unlock your contact details submission."}
              </p>
            </div>

            {formError && (
              <div className="rounded-xl border border-rose-500/40 bg-rose-500/15 p-3 text-xs font-bold text-rose-300 animate-in fade-in">
                {formError}
              </div>
            )}

            {/* ── QUESTION 1 ── */}
            <div className="rounded-2xl border border-slate-800 bg-[#08152b] p-4 space-y-2">
              <label className="block text-xs font-black text-cyan-300 leading-snug">
                {lang === "am"
                  ? getQ(1)?.titleAm || "1. ለአሁን ሰአት ምን ላይ ነው የምትሰራው?"
                  : getQ(1)?.titleEn || "1. What are you currently working on / what is your current job?"}
              </label>
              <input
                type="text"
                required
                value={q1}
                onChange={(e) => setQ1(e.target.value)}
                placeholder={
                  lang === "am"
                    ? getQ(1)?.placeholderAm || "ለምሳሌ፡ የግል ንግድ፣ የመንግስት ሰራተኛ፣ ተማሪ፣ የድርጅት ሰራተኛ..."
                    : getQ(1)?.placeholderEn || "e.g. Corporate employee, private business owner, teacher, freelancer..."
                }
                className="h-11 w-full rounded-xl border border-slate-700 bg-[#06142a] px-3.5 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-400"
              />
            </div>

            {/* ── QUESTION 2 ── */}
            <div className="rounded-2xl border border-slate-800 bg-[#08152b] p-4 space-y-2">
              <label className="block text-xs font-black text-cyan-300 leading-snug">
                {lang === "am"
                  ? getQ(2)?.titleAm || "2. ምን ማሳካት ትፈልጋለህ/ሽ?"
                  : getQ(2)?.titleEn || "2. What do you want to achieve?"}
              </label>
              <textarea
                rows={2}
                required
                value={q2}
                onChange={(e) => setQ2(e.target.value)}
                placeholder={
                  lang === "am"
                    ? getQ(2)?.placeholderAm || "በህይወትዎ፣ በገንዘብዎ ወይም በቤተሰብዎ ውስጥ ማሳካት የሚፈልጉትን ዋና አላማ ይፃፉ..."
                    : getQ(2)?.placeholderEn || "Describe the primary milestones, freedom, and goals you want to achieve..."
                }
                className="w-full rounded-xl border border-slate-700 bg-[#06142a] p-3 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-400"
              />
            </div>

            {/* ── QUESTION 3 ── */}
            <div className="rounded-2xl border border-slate-800 bg-[#08152b] p-4 space-y-2">
              <label className="block text-xs font-black text-cyan-300 leading-snug">
                {lang === "am"
                  ? getQ(3)?.titleAm || "3. ለቤተሰብህ/ሽ የምትፈልገው/ቺው መኖርያ ቤት ምን አይነት ነው?"
                  : getQ(3)?.titleEn || "3. What kind of home/living house do you want for your family?"}
              </label>
              <input
                type="text"
                required
                value={q3}
                onChange={(e) => setQ3(e.target.value)}
                placeholder={
                  lang === "am"
                    ? getQ(3)?.placeholderAm || "ለምሳሌ፡ ቪላ ቤት፣ ሰፊ አፓርታማ፣ ቦሌ ወይም ውብ ቦታ ላይ የተሰራ..."
                    : getQ(3)?.placeholderEn || "e.g. Spacious modern villa, luxury apartment in Bole, comfortable garden residence..."
                }
                className="h-11 w-full rounded-xl border border-slate-700 bg-[#06142a] px-3.5 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-400"
              />
            </div>

            {/* ── QUESTION 4 ── */}
            <div className="rounded-2xl border border-slate-800 bg-[#08152b] p-4 space-y-2">
              <label className="block text-xs font-black text-cyan-300 leading-snug">
                {lang === "am"
                  ? getQ(4)?.titleAm || "4. በዓለም አቀፍ ደረጃ 3 የመንፈሳዊ ቦታዎችና መዝናኛ መጎብኘት የምትፈልጋቸው የት ናቸው?"
                  : getQ(4)?.titleEn || "4. At an international level, what are 3 spiritual/pilgrimage and vacation places you want to visit?"}
              </label>
              <input
                type="text"
                required
                value={q4}
                onChange={(e) => setQ4(e.target.value)}
                placeholder={
                  lang === "am"
                    ? getQ(4)?.placeholderAm || "ለምሳሌ፡ 1. እየሩሳሌም/መካ፣ 2. ዱባይ፣ 3. ፓሪስ/ኢስታንቡል..."
                    : getQ(4)?.placeholderEn || "e.g. 1. Jerusalem/Mecca, 2. Dubai, 3. Paris/Switzerland..."
                }
                className="h-11 w-full rounded-xl border border-slate-700 bg-[#06142a] px-3.5 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-400"
              />
            </div>

            {/* ── QUESTION 5 ── */}
            <div className="rounded-2xl border border-slate-800 bg-[#08152b] p-4 space-y-2">
              <label className="block text-xs font-black text-cyan-300 leading-snug">
                {lang === "am"
                  ? getQ(5)?.titleAm || "5. ከምትሰራው ስራ በጣም የምትጠላው ስራ ምንድን ነው?"
                  : getQ(5)?.titleEn || "5. From the work you currently do, what is the thing you hate the most?"}
              </label>
              <input
                type="text"
                required
                value={q5}
                onChange={(e) => setQ5(e.target.value)}
                placeholder={
                  lang === "am"
                    ? getQ(5)?.placeholderAm || "ለምሳሌ፡ አነስተኛ ደሞዝ፣ አለቃ ጫና፣ የጊዜ እጥረት፣ የትራፊክ ሰአት..."
                    : getQ(5)?.placeholderEn || "e.g. Low pay, micromanaging boss, lack of free time, commuting, no growth..."
                }
                className="h-11 w-full rounded-xl border border-slate-700 bg-[#06142a] px-3.5 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-400"
              />
            </div>

            {/* ── QUESTION 6 ── */}
            <div className="rounded-2xl border border-slate-800 bg-[#08152b] p-4 space-y-2">
              <label className="block text-xs font-black text-cyan-300 leading-snug">
                {lang === "am"
                  ? getQ(6)?.titleAm || "6. እንዲያውም በጣም ጥሩ ስራ ብታገኝ ወርሃዊ ገቢሽ/ህ ስንት ቢሆን ጥሩ ይመስልሃል/ሻል?"
                  : getQ(6)?.titleEn || "6. If you were to get a really good opportunity/job, what monthly income in ETB would be good for you?"}
              </label>
              <input
                type="text"
                required
                value={q6}
                onChange={(e) => setQ6(e.target.value)}
                placeholder={
                  lang === "am"
                    ? getQ(6)?.placeholderAm || "ለምሳሌ፡ 50,000 ብር ወይም 100,000+ ብር በወር..."
                    : getQ(6)?.placeholderEn || "e.g. ETB 40,000 / month, ETB 100,000+ / month..."
                }
                className="h-11 w-full rounded-xl border border-slate-700 bg-[#06142a] px-3.5 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-400"
              />
            </div>

            {/* ── QUESTION 7 ── */}
            <div className="rounded-2xl border border-slate-800 bg-[#08152b] p-4 space-y-2">
              <label className="block text-xs font-black text-cyan-300 leading-snug">
                {lang === "am"
                  ? getQ(7)?.titleAm || "7. ህልምህን/ሽን ለማሳካት በአሁን ሰአት ምን እየሰራህ/ሽ ነው?"
                  : getQ(7)?.titleEn || "7. What are you currently doing right now to achieve your dream?"}
              </label>
              <input
                type="text"
                required
                value={q7}
                onChange={(e) => setQ7(e.target.value)}
                placeholder={
                  lang === "am"
                    ? getQ(7)?.placeholderAm || "ህልምዎን እውን ለማድረግ በአሁኑ ሰአት የወሰዱት እርምጃ..."
                    : getQ(7)?.placeholderEn || "What steps or investments are you actively taking today?..."
                }
                className="h-11 w-full rounded-xl border border-slate-700 bg-[#06142a] px-3.5 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-400"
              />
            </div>

            {/* ── QUESTION 8 ── */}
            <div className="rounded-2xl border border-slate-800 bg-[#08152b] p-4 space-y-3">
              <label className="block text-xs font-black text-cyan-300 leading-snug">
                {lang === "am"
                  ? getQ(8)?.titleAm || "8. አሁን ባለህ/ሽ ነገር ብትቀጥል/ይ ህልምህን/ሽን ማሳካት የምትችል/ዪ ይመስልሃል/ሻል? (Yes or No)"
                  : getQ(8)?.titleEn || "8. If you continue with what you currently have, do you think you can achieve your dream? (Yes or No)"}
              </label>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setQ8("yes")}
                  className={cn(
                    "flex-1 h-11 rounded-xl font-black text-xs transition border flex items-center justify-center gap-2",
                    q8 === "yes"
                      ? "border-emerald-400 bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                      : "border-slate-700 bg-[#06142a] text-slate-400 hover:text-white"
                  )}
                >
                  <Check className="h-4 w-4" /> {lang === "am" ? "አዎ (YES)" : "YES"}
                </button>

                <button
                  type="button"
                  onClick={() => setQ8("no")}
                  className={cn(
                    "flex-1 h-11 rounded-xl font-black text-xs transition border flex items-center justify-center gap-2",
                    q8 === "no"
                      ? "border-rose-400 bg-rose-500 text-white shadow-lg shadow-rose-500/20"
                      : "border-slate-700 bg-[#06142a] text-slate-400 hover:text-white"
                  )}
                >
                  <X className="h-4 w-4" /> {lang === "am" ? "አይደለም (NO)" : "NO"}
                </button>
              </div>

              {q8 === "yes" && (
                <div className="pt-2 animate-in fade-in">
                  <label className="block text-[11px] font-bold text-emerald-300 mb-1">
                    {lang === "am" ? "-> Yes በምን ያህል ጊዜ ውስጥ?" : "-> If Yes, in how much time?"}
                  </label>
                  <input
                    type="text"
                    required
                    value={q8Timeframe}
                    onChange={(e) => setQ8Timeframe(e.target.value)}
                    placeholder={
                      lang === "am"
                        ? "ለምሳሌ፡ በ5 አመት፣ በ10 አመት..."
                        : "e.g. In 5 years, in 10 years, in 15 years..."
                    }
                    className="h-10 w-full rounded-xl border border-emerald-500/40 bg-[#06142a] px-3 text-xs text-white outline-none focus:border-emerald-400"
                  />
                </div>
              )}

              {q8 === "no" && (
                <p className="text-[11px] text-amber-300 italic pt-1">
                  {lang === "am"
                    ? "★ አሁን ባለው መንገድ ህልምዎን ማሳካት ካልቻሉ አዲስ የተረጋገጠ የስራ ተሽከርካሪ (Vehicle) መቀየር የግድ ይላል።"
                    : "★ If your current vehicle cannot achieve your dreams, transitioning to a proven duplication system is urgent."}
                </p>
              )}
            </div>

            {/* ── QUESTION 9 (READINESS SCALE 0% - 50% - 100%) ── */}
            <div className="rounded-2xl border-2 border-cyan-500/50 bg-gradient-to-b from-[#092147] to-[#06142a] p-5 space-y-4 shadow-xl">
              <div>
                <span className="rounded bg-cyan-400 text-brand-navy px-2 py-0.5 text-[10px] font-black uppercase">
                  {lang === "am" ? "ጥያቄ 9 • የዝግጁነት መለኪያ" : "Question 9 • Readiness Gauge"}
                </span>
                <label className="block text-sm font-black text-white mt-1.5 leading-snug">
                  {lang === "am"
                    ? getQ(9)?.titleAm || "9. ፍላጎትህን/ሽን በእርግጠኝነት የሚያሳካልህ/ሽ እድል ብሰጥህ/ሽ ምን ያህል ዝግጁ ነህ/ሽ ለመቀበል?"
                    : getQ(9)?.titleEn || "9. If I give you an opportunity that will definitely fulfill your desire/dream, how ready are you to accept it?"}
                </label>
              </div>

              {/* Slider & Value Display */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                  <span>0%</span>
                  <span className="text-amber-300">50% (መመዘኛ / Cutoff)</span>
                  <span className="text-emerald-300">100% (ሙሉ ቁርጠኛ)</span>
                </div>

                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={q9Score}
                  onChange={(e) => setQ9Score(Number(e.target.value))}
                  className="w-full accent-cyan-400 h-2 bg-slate-800 rounded-lg cursor-pointer"
                />

                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs text-slate-300">
                    {lang === "am" ? "የእርስዎ የዝግጁነት መጠን፦" : "Your current readiness:"}
                  </span>
                  <span
                    className={cn(
                      "text-xl font-black px-3 py-0.5 rounded-xl border",
                      isQualified
                        ? "border-emerald-400 bg-emerald-500/20 text-emerald-300"
                        : "border-amber-400 bg-amber-500/20 text-amber-300"
                    )}
                  >
                    {q9Score}%
                  </span>
                </div>
              </div>

              {/* Qualification Status Notice */}
              {isQualified ? (
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-300 bg-emerald-950/40 border border-emerald-500/30 p-2.5 rounded-xl">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                  <span>
                    {lang === "am"
                      ? "እንኳን ደስ አለዎት! ዝግጁነትዎ ከ50% በላይ በመሆኑ ከታች ያለውን የመገኛ ቅፅ እንዲሞሉ ተፈቅዶልዎታል።"
                      : "Congratulations! Your score is > 50%. The contact intake form below is unlocked."}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-xs font-bold text-amber-300 bg-amber-950/40 border border-amber-500/30 p-2.5 rounded-xl">
                  <ShieldAlert className="h-4 w-4 shrink-0 text-amber-400" />
                  <span>
                    {lang === "am"
                      ? "የመገኛ አድራሻ ለመሙላት የዝግጁነትዎ መጠን ከ50% በላይ መሆን አለበት።"
                      : "Readiness must be greater than 50% to unlock application submission."}
                  </span>
                </div>
              )}
            </div>

            {/* ========================================================================= */}
            {/* UNLOCKED CONTACT FIELDS (IMAGE 2 BOTTOM: > 50%)                           */}
            {/* ========================================================================= */}
            {isQualified ? (
              <div className="rounded-2xl border-2 border-emerald-500/40 bg-[#071833] p-5 space-y-4 animate-in slide-in-from-top-4 duration-300 shadow-xl">
                <div className="border-b border-emerald-500/20 pb-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User className="h-5 w-5 text-emerald-400" />
                    <h3 className="text-sm font-black text-white">
                      {lang === "am" ? "የእጩ አጋር መረጃ (> 50% የተፈቀደ)" : "Qualified Candidate Intake (> 50%)"}
                    </h3>
                  </div>
                  <span className="text-[10px] uppercase font-bold text-emerald-300">
                    {lang === "am" ? "ግላዊ እና የተጠበቀ" : "Confidential"}
                  </span>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  {/* ሙሉ ስም */}
                  <div>
                    <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-slate-300">
                      {lang === "am" ? "ሙሉ ስም (Full Name) *" : "Full Name *"}
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder={lang === "am" ? "ለምሳሌ፡ ዳዊት ሃይሉ ተሰማ" : "e.g. Dawit Hailu Tessema"}
                      className="h-11 w-full rounded-xl border border-slate-700 bg-[#06142a] px-3 text-xs text-white outline-none focus:border-emerald-400"
                    />
                  </div>

                  {/* ስልክ ቁጥር */}
                  <div>
                    <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-slate-300">
                      {lang === "am" ? "ስልክ ቁጥር (Phone Number) *" : "Phone Number *"}
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+251 911 ..."
                      className="h-11 w-full rounded-xl border border-slate-700 bg-[#06142a] px-3 text-xs text-white outline-none focus:border-emerald-400"
                    />
                  </div>

                  {/* አድራሻ */}
                  <div>
                    <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-slate-300">
                      {lang === "am" ? "አድራሻ (City / Address) *" : "City / Address *"}
                    </label>
                    <input
                      type="text"
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder={lang === "am" ? "ለምሳሌ፡ አዲስ አበባ፣ ቦሌ" : "e.g. Addis Ababa, Bole"}
                      className="h-11 w-full rounded-xl border border-slate-700 bg-[#06142a] px-3 text-xs text-white outline-none focus:border-emerald-400"
                    />
                  </div>

                  {/* Telegram username */}
                  <div>
                    <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-slate-300">
                      {lang === "am" ? "Telegram Username (የቴሌግራም መለያ)" : "Telegram Username"}
                    </label>
                    <input
                      type="text"
                      value={telegramUsername}
                      onChange={(e) => setTelegramUsername(e.target.value)}
                      placeholder="@yourusername"
                      className="h-11 w-full rounded-xl border border-slate-700 bg-[#06142a] px-3 text-xs text-white outline-none focus:border-emerald-400 font-mono"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="h-13 w-full rounded-2xl bg-emerald-400 text-base font-black text-brand-navy shadow-xl shadow-emerald-400/30 hover:bg-emerald-300 transition-all"
                  >
                    {isSubmitting ? (
                      <Sparkles className="h-5 w-5 animate-spin" />
                    ) : (
                      <>
                        {lang === "am" ? "ማመልከቻውን ላክ (Submit Qualified Application)" : "Submit Qualified Application"}{" "}
                        <Send className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 text-center text-slate-400 text-xs">
                <Lock className="mx-auto h-6 w-6 text-slate-600 mb-1" />
                <p>
                  {lang === "am"
                    ? "የመገኛ አድራሻዎን ለማስገባት ጥያቄ 9 ላይ ያለውን የዝግጁነት መጠን ከ50% በላይ ያድርጉ።"
                    : "Move Question 9 readiness score above 50% to unlock contact details submission."}
                </p>
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setFunnelStep(3)}
                className="text-xs font-bold text-slate-400 hover:text-white"
              >
                <ArrowLeft className="mr-1 h-4 w-4" /> {lang === "am" ? "ወደ ደረጃ 3 ተመለስ" : "Back to Step 3"}
              </Button>
            </div>
          </form>
        )}

        {/* ========================================================================= */}
        {/* STEP 5: SUBMITTED SUCCESS SCREEN                                         */}
        {/* ========================================================================= */}
        {funnelStep === 5 && submittedLead && (
          <div className="space-y-6 text-center animate-in zoom-in-95 duration-300 py-4">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-500/20 border border-emerald-400 text-emerald-300 shadow-2xl shadow-emerald-500/30">
              <CheckCircle2 className="h-10 w-10" />
            </div>

            <div className="space-y-2">
              <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-black uppercase tracking-widest text-emerald-300">
                {lang === "am" ? "ማመልከቻዎ በተሳካ ሁኔታ ደርሷል!" : "Application Successfully Received!"}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                {lang === "am"
                  ? `እንኳን ደስ አለዎት፣ ${submittedLead.fullName.split(" ")[0]}!`
                  : `Congratulations, ${submittedLead.fullName.split(" ")[0]}!`}
              </h2>
              <p className="text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
                {lang === "am"
                  ? funnelConfig.successMessageAm || `የዝግጁነት ውጤትዎ ${submittedLead.q9_readiness_score}% ነው። የእርስዎ የBreakthrough Share Company መሪ በ24 ሰአት ውስጥ በቴሌግራም ወይም በስልክ ያገኝዎታል።`
                  : funnelConfig.successMessageEn || `Your readiness score is ${submittedLead.q9_readiness_score}%. A Breakthrough Share Company senior leader will contact you within 24 hours on Telegram/Phone for your private orientation.`}
              </p>
            </div>

            {/* Submission Summary Card */}
            <div className="rounded-2xl border border-slate-800 bg-[#07162d] p-4 text-left max-w-lg mx-auto text-xs space-y-2">
              <div className="flex justify-between border-b border-slate-800 pb-1.5">
                <span className="text-slate-400">{lang === "am" ? "ሙሉ ስም" : "Full Name"}</span>
                <span className="font-bold text-white">{submittedLead.fullName}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-1.5">
                <span className="text-slate-400">{lang === "am" ? "ስልክ ቁጥር" : "Phone"}</span>
                <span className="font-mono text-cyan-300 font-bold">{submittedLead.phone}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-1.5">
                <span className="text-slate-400">{lang === "am" ? "የቴሌግራም መለያ" : "Telegram"}</span>
                <span className="font-mono text-emerald-300 font-bold">{submittedLead.telegramUsername || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">{lang === "am" ? "የዝግጁነት መጠን" : "Readiness Score"}</span>
                <span className="font-black text-emerald-400">{submittedLead.q9_readiness_score}% (Qualified)</span>
              </div>
            </div>

            <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button
                type="button"
                onClick={() => {
                  setFunnelStep(1);
                  setSubmittedLead(null);
                }}
                className="w-full sm:w-auto bg-cyan-400 text-brand-navy font-bold hover:bg-cyan-300"
              >
                {lang === "am" ? "አዲስ ቅፅ ሙላ" : "Submit Another Assessment"}
              </Button>

              <Link
                href="/en/auth/sign-in"
                className="inline-flex items-center justify-center h-10 px-4 rounded-xl border border-slate-700 bg-slate-800/60 text-xs font-bold text-slate-300 hover:text-white"
              >
                {lang === "am" ? "ወደ MyUpline መግቢያ" : "Go to MyUpline Portal"}
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
