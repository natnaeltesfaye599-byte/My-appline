"use client";

import { useState } from "react";
import {
  ArrowRight,
  Award,
  Bell,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Clock,
  Copy,
  ExternalLink,
  FileSpreadsheet,
  FileText,
  Flame,
  GraduationCap,
  HelpCircle,
  MessageSquare,
  Network,
  Phone,
  PhoneCall,
  Play,
  Presentation,
  Printer,
  Radio,
  Send,
  Share2,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  Trophy,
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

// Training track steps for new IBO onboarding
type TrainingTrack =
  | "getting-started"
  | "nbo"
  | "basic"
  | "system"
  | "4-skills"
  | "entrepreneur-video"
  | "upline-report"
  | "text-marketing";

interface NewMemberForm {
  fullName: string;
  phone: string;
  email: string;
  city: string;
  uplineName: string;
  uplinePhone: string;
  startDate: string;
  packageType: string;
}

// Question for Rise of Entrepreneur Video (20-min)
const entrepreneurQuestions = [
  {
    id: "eq-1",
    question: "Based on the Rise of Entrepreneur video, what is the #1 mindset shift required to transition from employee to entrepreneur?",
    options: [
      "Work more hours than everyone else at your current job",
      "Shift from trading time for money to building scalable systems that generate residual income",
      "Quit your job immediately without any plan",
      "Focus only on products and ignore team building"
    ],
    correctIndex: 1,
    explanation: "The video teaches that entrepreneurs build SYSTEMS that generate income — not just exchange personal time for wages like employees do."
  },
  {
    id: "eq-2",
    question: "According to the Rise of Entrepreneur framework, what is the most powerful asset a network marketer has?",
    options: [
      "A large advertising budget",
      "A corporate office location",
      "A growing, duplicating team of motivated leaders",
      "A university business degree"
    ],
    correctIndex: 2,
    explanation: "Your human network — a motivated, duplicating team — is the most powerful asset because it generates Group Volume and exponential team overrides."
  }
];

// Post-joining text marketing templates
const newJoiningTextTemplates = [
  {
    id: "nj-1",
    title: "Welcome to the Team! (Day 1 Message)",
    tag: "Immediate Welcome ⭐",
    text: (name: string) =>
      `Welcome to the MyUpline Family, ${name}! 🎉 I'm so excited to have you on our team. Your first step is joining our team Telegram group and completing your NBO training today. I'm here every step of the way. Let's build something extraordinary together! 🚀 — Your Upline Sponsor`
  },
  {
    id: "nj-2",
    title: "NBO Training Reminder (Day 1 Evening)",
    tag: "Action Prompt",
    text: (name: string) =>
      `Hi ${name}! 🌟 Quick check-in — have you started your NBO orientation training yet? It's only 25 minutes and will show you exactly how to launch your first week. Your success starts with knowledge! Click here to access: [Training Link] 📚`
  },
  {
    id: "nj-3",
    title: "First 48-Hour Challenge (Day 2)",
    tag: "48-Hour Launch",
    text: (name: string) =>
      `${name}, this is your 48-hour challenge moment! 🔥 The most successful leaders in our organization made their first 10 calls within the first 48 hours. Are you ready to start building your list? I'll personally guide your first 3-way call. Let's go! 💪`
  },
  {
    id: "nj-4",
    title: "System Training Invitation (Week 1)",
    tag: "System Broadcast",
    text: (name: string) =>
      `Hi ${name}! Our synchronized team system training is happening tonight at 8:00 PM. All new IBOs attend their first System Training together at equal time. It's where you'll meet the full leadership team and get your 30-day fast track roadmap. See you there! 🎓`
  }
];

const trainingTrackItems = [
  {
    id: "getting-started",
    step: 1,
    icon: ClipboardList,
    title: "Getting Started Training with Form",
    description: "Register the new IBO with the official onboarding form. Capture all critical details.",
    duration: "10 min",
    color: "emerald"
  },
  {
    id: "nbo",
    step: 2,
    icon: GraduationCap,
    title: "Give NBO Training",
    description: "New Business Orientation — compensation model, compliance, and 48-hour launch protocol.",
    duration: "25 min",
    color: "cyan"
  },
  {
    id: "basic",
    step: 3,
    icon: BookOpen,
    title: "Give Basic Training",
    description: "Professional prospecting, invitation script mastery, and presentation methodology.",
    duration: "22 min",
    color: "blue"
  },
  {
    id: "system",
    step: 4,
    icon: Radio,
    title: "Give System Training",
    description: "Synchronized team meetings, duplication architecture, and upline leverage protocol.",
    duration: "30 min",
    color: "purple"
  },
  {
    id: "4-skills",
    step: 5,
    icon: Zap,
    title: "4 Basic Skill Training",
    description: "Calling • Presentation • Training • Prospecting — the core Daily Method of Operation (DMO).",
    duration: "20 min",
    color: "amber"
  },
  {
    id: "entrepreneur-video",
    step: 6,
    icon: Video,
    title: "Rise of Entrepreneur Video",
    description: "Transformational 20-min mindset video. Includes mandatory assessment question & feedback.",
    duration: "20 min",
    color: "rose"
  },
  {
    id: "upline-report",
    step: 7,
    icon: Network,
    title: "Every Detail Info for Upline",
    description: "Generate a complete new IBO dossier to share with your upline sponsor for proper placement.",
    duration: "5 min",
    color: "indigo"
  },
  {
    id: "text-marketing",
    step: 8,
    icon: MessageSquare,
    title: "Send Text for New Joining",
    description: "Professional welcome & activation text marketing sequence for all new IBOs.",
    duration: "Ongoing",
    color: "teal"
  }
];

const colorMap: Record<string, string> = {
  emerald: "bg-emerald-100 text-emerald-700",
  cyan: "bg-cyan-100 text-brand-blue",
  blue: "bg-sky-100 text-sky-700",
  purple: "bg-purple-100 text-purple-700",
  amber: "bg-amber-100 text-amber-700",
  rose: "bg-rose-100 text-rose-700",
  indigo: "bg-indigo-100 text-indigo-700",
  teal: "bg-teal-100 text-teal-700"
};

export function AfterSalesOnboarding({
  onOpenAi
}: {
  onOpenAi?: (prompt: string) => void;
}) {
  const [activeTrack, setActiveTrack] = useState<TrainingTrack>("getting-started");
  const [completedSteps, setCompletedSteps] = useState<Set<TrainingTrack>>(new Set());

  // Getting started form state
  const [form, setForm] = useState<NewMemberForm>({
    fullName: "",
    phone: "+251 9",
    email: "",
    city: "Addis Ababa",
    uplineName: "",
    uplinePhone: "",
    startDate: new Date().toISOString().split("T")[0],
    packageType: "Diamond"
  });
  const [formSaved, setFormSaved] = useState(false);
  const [savedMember, setSavedMember] = useState<NewMemberForm | null>(null);

  // Entrepreneur video state
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [videoElapsed, setVideoElapsed] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [activeQuestion, setActiveQuestion] = useState(0);

  // Text marketing state
  const [activeNewMemberName, setActiveNewMemberName] = useState("");
  const [copiedTplId, setCopiedTplId] = useState<string | null>(null);

  // Upline copy
  const [uplineCopied, setUplineCopied] = useState(false);

  function markStepComplete(step: TrainingTrack) {
    setCompletedSteps((prev) => new Set([...prev, step]));
  }

  function handleSaveForm(e: React.FormEvent) {
    e.preventDefault();
    if (!form.fullName || !form.phone) return;
    setSavedMember({ ...form });
    setFormSaved(true);
    setActiveNewMemberName(form.fullName.split(" ")[0]);
    markStepComplete("getting-started");
  }

  function handleSubmitQuiz() {
    if (selectedAnswer === null) return;
    setQuizSubmitted(true);
    const correct = selectedAnswer === entrepreneurQuestions[activeQuestion].correctIndex;
    setIsCorrect(correct);
    if (correct) markStepComplete("entrepreneur-video");
  }

  function handleSubmitFeedback(e: React.FormEvent) {
    e.preventDefault();
    if (!feedbackText.trim()) return;
    setFeedbackSubmitted(true);
  }

  function copyTemplate(id: string, text: string) {
    navigator.clipboard.writeText(text);
    setCopiedTplId(id);
    setTimeout(() => setCopiedTplId(null), 2500);
  }

  function handleCopyUplineReport() {
    if (!savedMember) return;
    const report = `🆕 NEW IBO ONBOARDING REPORT (MyUpline)\n\nFull Name: ${savedMember.fullName}\nPhone: ${savedMember.phone}\nEmail: ${savedMember.email}\nCity: ${savedMember.city}\nPackage: ${savedMember.packageType}\nStart Date: ${savedMember.startDate}\n\nDirect Upline: ${savedMember.uplineName} (${savedMember.uplinePhone})\n\n✅ Onboarding Steps Completed: ${completedSteps.size} of 8\n\nReady for NBO orientation call! 🚀`;
    navigator.clipboard.writeText(report);
    setUplineCopied(true);
    setTimeout(() => setUplineCopied(false), 3000);
  }

  const progressPercent = Math.round((completedSteps.size / 8) * 100);

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-gradient-to-r from-brand-navy via-brand-deep to-[#0d3478] p-6 text-white shadow-xl">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-400/10 px-3 py-1 text-xs font-black tracking-wide text-emerald-300 uppercase backdrop-blur">
            <UserCheck className="h-3.5 w-3.5" />
            New IBO Activation Pipeline
          </div>
          <h2 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">
            After Sales Onboarding
          </h2>
          <p className="mt-1 text-sm text-white/75">
            Complete 8-step new member activation: Getting Started Form → NBO → Basic → System Training → Rise of Entrepreneur Video → Upline Report → Text Marketing
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            onClick={() =>
              onOpenAi?.(
                `I just registered a new IBO. Guide me through the best 48-hour activation sequence to ensure they get properly onboarded, trained, and excited before they go cold.`
              )
            }
            className="brand-gradient font-black text-brand-navy shadow-lg"
          >
            <Sparkles className="mr-2 h-4 w-4" />
            AI Onboarding Coach
          </Button>

          {/* Export CSV / Print */}
          {savedMember && (
            <>
              <Button
                variant="secondary"
                onClick={() => {
                  const rows = [
                    {
                      "Full Name": savedMember.fullName,
                      "Phone": savedMember.phone,
                      "Email": savedMember.email,
                      "City": savedMember.city,
                      "Package": savedMember.packageType,
                      "Start Date": savedMember.startDate,
                      "Upline Sponsor": savedMember.uplineName,
                      "Upline Phone": savedMember.uplinePhone,
                      "Steps Completed": `${completedSteps.size} of 8`,
                    }
                  ];
                  exportToCsv(`MyUpline_Onboarding_${savedMember.fullName.replace(/\s+/g, "_")}`, rows);
                }}
                className="border-white/20 bg-white/10 hover:bg-white/20 text-white"
              >
                <FileSpreadsheet className="mr-1.5 h-4 w-4" />
                Export CSV
              </Button>
              <Button
                variant="secondary"
                onClick={() => printSection("onboarding-upline-dossier", `New IBO Onboarding Dossier — ${savedMember.fullName}`)}
                className="border-white/20 bg-white/10 hover:bg-white/20 text-white"
              >
                <Printer className="mr-1.5 h-4 w-4" />
                Print / PDF
              </Button>
            </>
          )}

          {/* Overall Progress */}
          <div className="rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-center backdrop-blur">
            <div className="text-xl font-black text-brand-cyan">{progressPercent}%</div>
            <div className="text-[10px] font-bold text-white/70">{completedSteps.size}/8 Steps Done</div>
          </div>
        </div>
      </div>

      {/* MAIN LAYOUT: Left Progress Track + Right Active Content */}
      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        {/* LEFT: Onboarding Step Track */}
        <div className="space-y-2">
          <div className="mb-3">
            <div className="flex justify-between text-xs mb-1">
              <span className="font-bold text-slate-600 uppercase tracking-wide text-[10px]">Onboarding Progress</span>
              <span className="font-black text-brand-navy">{progressPercent}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full brand-gradient transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {trainingTrackItems.map((item) => {
            const isActive = activeTrack === item.id;
            const isDone = completedSteps.has(item.id as TrainingTrack);
            const IconComp = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTrack(item.id as TrainingTrack)}
                className={cn(
                  "w-full rounded-xl border p-3 text-left transition-all duration-200",
                  isActive
                    ? "border-brand-blue bg-cyan-50/60 shadow-sm ring-1 ring-brand-blue"
                    : "border-slate-200 bg-white hover:border-slate-300"
                )}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={cn(
                      "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-black",
                      isDone
                        ? "bg-emerald-500 text-white"
                        : isActive
                        ? "brand-gradient text-brand-navy"
                        : colorMap[item.color] ?? "bg-slate-100 text-slate-500"
                    )}
                  >
                    {isDone ? <Check className="h-3.5 w-3.5" /> : item.step}
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs font-bold text-brand-navy leading-snug truncate">
                      {item.title}
                    </p>
                    <span className="text-[10px] font-semibold text-slate-400">{item.duration}</span>
                  </div>

                  {isDone && (
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 ml-auto" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* RIGHT: Active Step Content Panel */}
        <div>
          {/* STEP 1: GETTING STARTED TRAINING WITH FORM */}
          {activeTrack === "getting-started" && (
            <Card className="p-6 border-slate-200 space-y-5">
              <div className="border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                    <ClipboardList className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Step 1</span>
                    <h3 className="text-lg font-black text-brand-navy">Getting Started Training with Form</h3>
                  </div>
                </div>
                <p className="mt-2 text-xs text-slate-600">
                  Register the new IBO by filling in all required fields. This form generates the Upline Report and activates text marketing templates.
                </p>
              </div>

              {formSaved && savedMember ? (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                    <h4 className="font-black text-emerald-800">New IBO Registered Successfully!</h4>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-700">
                    <div><span className="font-bold text-slate-500">Full Name:</span> {savedMember.fullName}</div>
                    <div><span className="font-bold text-slate-500">Phone:</span> {savedMember.phone}</div>
                    <div><span className="font-bold text-slate-500">City:</span> {savedMember.city}</div>
                    <div><span className="font-bold text-slate-500">Package:</span> {savedMember.packageType}</div>
                    <div><span className="font-bold text-slate-500">Upline:</span> {savedMember.uplineName}</div>
                    <div><span className="font-bold text-slate-500">Start Date:</span> {savedMember.startDate}</div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button
                      onClick={() => {
                        setFormSaved(false);
                        setSavedMember(null);
                      }}
                      variant="ghost"
                      size="sm"
                      className="border border-slate-200"
                    >
                      Edit Form
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => setActiveTrack("nbo")}
                      className="brand-gradient font-bold text-brand-navy"
                    >
                      Proceed to NBO Training <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSaveForm} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-xs font-bold uppercase text-slate-600">New IBO Full Name</label>
                      <input
                        required
                        value={form.fullName}
                        onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                        placeholder="e.g. Solomon Hailu Tadesse"
                        className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-brand-blue"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-bold uppercase text-slate-600">Phone Number</label>
                      <input
                        required
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        placeholder="+251 9..."
                        className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-brand-blue"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-bold uppercase text-slate-600">Email Address</label>
                      <input
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="email@example.com"
                        type="email"
                        className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-brand-blue"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-bold uppercase text-slate-600">City / Location</label>
                      <input
                        value={form.city}
                        onChange={(e) => setForm({ ...form, city: e.target.value })}
                        placeholder="e.g. Addis Ababa"
                        className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-brand-blue"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-bold uppercase text-slate-600">Direct Upline Sponsor Name</label>
                      <input
                        required
                        value={form.uplineName}
                        onChange={(e) => setForm({ ...form, uplineName: e.target.value })}
                        placeholder="e.g. Dawit Mengistu"
                        className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-brand-blue"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-bold uppercase text-slate-600">Upline Sponsor Phone</label>
                      <input
                        value={form.uplinePhone}
                        onChange={(e) => setForm({ ...form, uplinePhone: e.target.value })}
                        placeholder="+251 9..."
                        className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-brand-blue"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-bold uppercase text-slate-600">Registration Start Date</label>
                      <input
                        type="date"
                        value={form.startDate}
                        onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                        className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-brand-blue"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-bold uppercase text-slate-600">Enrollment Package</label>
                      <select
                        value={form.packageType}
                        onChange={(e) => setForm({ ...form, packageType: e.target.value })}
                        className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-brand-blue"
                      >
                        <option>Diamond</option>
                        <option>Gold</option>
                        <option>Silver</option>
                        <option>Bronze Starter</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-end pt-2 border-t border-slate-100">
                    <Button type="submit" className="brand-gradient font-bold text-brand-navy">
                      Register New IBO & Start Onboarding
                    </Button>
                  </div>
                </form>
              )}
            </Card>
          )}

          {/* STEPS 2-5: NBO, BASIC, SYSTEM, 4-SKILLS TRAINING */}
          {(activeTrack === "nbo" || activeTrack === "basic" || activeTrack === "system" || activeTrack === "4-skills") && (() => {
            const stepMap = {
              "nbo": {
                step: 2, color: "cyan", icon: GraduationCap,
                title: "Give NBO Training",
                description: "New Business Orientation: compensation model, PV/GV mechanics, 48-hour launch blueprint, and compliance standards.",
                duration: "25 mins",
                modules: [
                  "New Business Orientation (NBO) video",
                  "Compensation plan & PV/GV mechanics",
                  "48-Hour launch protocol & contact list",
                  "System compliance & ethical standards"
                ]
              },
              "basic": {
                step: 3, color: "blue", icon: BookOpen,
                title: "Give Basic Training",
                description: "Professional prospecting, 8-step invitation script, 1-on-1 & group presentation mastery.",
                duration: "22 mins",
                modules: [
                  "Professional prospecting mindset",
                  "8-step invitation script (Eric Worre method)",
                  "3rd party tools — video, events, webinars",
                  "Post-presentation follow-up protocol"
                ]
              },
              "system": {
                step: 4, color: "purple", icon: Radio,
                title: "Give System Training",
                description: "How to leverage the MyUpline team system: synchronized broadcasts, 3-way calls, and recognition events.",
                duration: "30 mins",
                modules: [
                  "Synchronized system broadcasts (Equal Start Time)",
                  "3-way upline leverage calls",
                  "Weekly recognition & accountability meetings",
                  "Duplication culture & culture standards"
                ]
              },
              "4-skills": {
                step: 5, color: "amber", icon: Zap,
                title: "4 Basic Skill Training",
                description: "Master the 4 core DMO skills: Calling Time, Presentations, Training Time, Prospecting/Name List.",
                duration: "20 mins",
                modules: [
                  "Skill 1: Calling Time & Invitations (Daily 10 calls)",
                  "Skill 2: Presentation Time (Daily 2 presentations)",
                  "Skill 3: Training Time (20-30 min continuous)",
                  "Skill 4: Prospecting & Name List growth (5 names/day)"
                ]
              }
            };

            const s = stepMap[activeTrack as keyof typeof stepMap];
            const IconComp = s.icon;
            const isDone = completedSteps.has(activeTrack);

            return (
              <Card className="p-6 border-slate-200 space-y-5">
                <div className="border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className={cn("flex h-9 w-9 items-center justify-center rounded-xl", colorMap[s.color])}>
                      <IconComp className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Step {s.step}</span>
                      <h3 className="text-lg font-black text-brand-navy">{s.title}</h3>
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-slate-600">{s.description}</p>
                </div>

                {/* Training Modules List */}
                <div className="space-y-2.5">
                  {s.modules.map((mod, i) => (
                    <div key={i} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3.5">
                      <div className={cn("flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-black", colorMap[s.color])}>
                        {i + 1}
                      </div>
                      <p className="text-xs font-medium text-slate-800">{mod}</p>
                    </div>
                  ))}
                </div>

                {/* Play Training Video Card */}
                <div className="rounded-xl border border-brand-cyan/30 bg-gradient-to-br from-brand-navy to-brand-deep p-5 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-black text-sm">{s.title} — Live Video Session</h4>
                      <p className="text-xs text-white/70 mt-0.5">{s.duration} continuous training module</p>
                    </div>
                    <button
                      onClick={() => onOpenAi?.(`Give me a comprehensive summary of the ${s.title} training content that I should teach to my newly registered IBO today.`)}
                      className="rounded-lg brand-gradient px-3 py-1.5 text-xs font-black text-brand-navy"
                    >
                      <Sparkles className="h-3.5 w-3.5 inline mr-1" />
                      AI Summary
                    </button>
                  </div>

                  <button
                    className="mt-4 flex w-full items-center justify-center gap-3 rounded-xl bg-white/10 border border-white/20 py-5 transition hover:bg-white/20"
                    onClick={() => {
                      markStepComplete(activeTrack);
                    }}
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-full brand-gradient text-brand-navy shadow-xl">
                      {isDone ? <Check className="h-6 w-6" /> : <Play className="h-6 w-6 fill-brand-navy ml-1" />}
                    </div>
                    <span className="font-black text-white text-sm">
                      {isDone ? "Training Completed ✓" : `Start ${s.title}`}
                    </span>
                  </button>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="border border-slate-200"
                    onClick={() => markStepComplete(activeTrack)}
                  >
                    {isDone ? "✓ Marked Complete" : "Mark as Complete"}
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => {
                      markStepComplete(activeTrack);
                      const next: Record<string, TrainingTrack> = {
                        nbo: "basic", basic: "system", system: "4-skills", "4-skills": "entrepreneur-video"
                      };
                      setActiveTrack(next[activeTrack] ?? activeTrack);
                    }}
                    className="brand-gradient font-bold text-brand-navy"
                  >
                    Complete & Next Step <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                  </Button>
                </div>
              </Card>
            );
          })()}

          {/* STEP 6: RISE OF ENTREPRENEUR VIDEO — 20-MIN + QUESTION + FEEDBACK */}
          {activeTrack === "entrepreneur-video" && (
            <Card className="p-6 border-slate-200 space-y-5">
              <div className="border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-100 text-rose-700">
                    <Video className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Step 6</span>
                    <h3 className="text-lg font-black text-brand-navy">Rise of Entrepreneur Video (20 Min)</h3>
                  </div>
                </div>
                <p className="mt-2 text-xs text-slate-600">
                  A transformational mindset shift video. New IBO watches for 20 minutes, then answers a mandatory question and provides feedback.
                </p>
              </div>

              {/* Video Player */}
              <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-gradient-to-b from-brand-navy to-slate-900 flex flex-col items-center justify-center text-white shadow-lg">
                <div className="absolute top-4 left-4 rounded-lg bg-rose-500/20 border border-rose-400/30 px-2.5 py-1 text-xs font-bold text-rose-200">
                  🎬 Rise of Entrepreneur — Mindset Series
                </div>
                <div className="absolute top-4 right-4 flex items-center gap-1.5 text-xs font-mono text-white/70">
                  <Clock className="h-3.5 w-3.5 text-brand-cyan" /> 20:00 min
                </div>

                <button
                  onClick={() => setIsVideoPlaying(!isVideoPlaying)}
                  className="flex h-16 w-16 items-center justify-center rounded-full brand-gradient text-brand-navy shadow-2xl transition hover:scale-105"
                >
                  {isVideoPlaying ? <Check className="h-8 w-8" /> : <Play className="h-8 w-8 fill-brand-navy ml-1" />}
                </button>
                <p className="mt-3 text-sm font-bold text-white/90">
                  {isVideoPlaying ? "Playing Rise of Entrepreneur..." : "Click to Watch the 20-Minute Training Video"}
                </p>

                <div className="absolute bottom-4 left-4 right-4">
                  <div className="h-1.5 w-full rounded-full bg-white/20 overflow-hidden">
                    <div className="h-full brand-gradient w-[65%]" />
                  </div>
                  <div className="flex justify-between text-[10px] text-white/50 mt-1">
                    <span>13:00 elapsed</span>
                    <span>20:00 total</span>
                  </div>
                </div>
              </div>

              {/* Mandatory Question with 20-min */}
              <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-5 space-y-4">
                <div className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-amber-600" />
                  <h4 className="font-black text-sm text-brand-navy">Ask Question — 20 Min Assessment</h4>
                  <span className="ml-auto rounded-full bg-amber-200 px-2.5 py-0.5 text-[10px] font-black text-amber-900">
                    Mandatory to Pass
                  </span>
                </div>

                <p className="text-xs font-bold text-slate-800">
                  Q{activeQuestion + 1}: {entrepreneurQuestions[activeQuestion].question}
                </p>

                <div className="space-y-2">
                  {entrepreneurQuestions[activeQuestion].options.map((opt, i) => (
                    <div
                      key={i}
                      onClick={() => { setSelectedAnswer(i); setQuizSubmitted(false); setIsCorrect(false); }}
                      className={cn(
                        "cursor-pointer rounded-xl border p-3 text-xs font-medium transition",
                        selectedAnswer === i
                          ? "border-brand-blue bg-cyan-50 ring-1 ring-brand-blue font-bold text-brand-navy"
                          : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                      )}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className={cn(
                          "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px]",
                          selectedAnswer === i ? "border-brand-blue bg-brand-blue text-white font-bold" : "border-slate-300"
                        )}>
                          {String.fromCharCode(65 + i)}
                        </span>
                        {opt}
                      </div>
                    </div>
                  ))}
                </div>

                {quizSubmitted && (
                  <div className={cn(
                    "rounded-xl p-3 text-xs font-medium border",
                    isCorrect ? "bg-emerald-100 text-emerald-800 border-emerald-200" : "bg-red-100 text-red-800 border-red-200"
                  )}>
                    <p className="font-bold">{isCorrect ? "✅ Correct! Great understanding!" : "❌ Incorrect — review the video content."}</p>
                    <p className="mt-1 leading-relaxed">{entrepreneurQuestions[activeQuestion].explanation}</p>
                  </div>
                )}

                <div className="flex justify-end gap-2">
                  {activeQuestion < entrepreneurQuestions.length - 1 && quizSubmitted && isCorrect && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="border border-slate-200"
                      onClick={() => {
                        setActiveQuestion((p) => p + 1);
                        setSelectedAnswer(null);
                        setQuizSubmitted(false);
                      }}
                    >
                      Next Question <ChevronRight className="ml-1 h-3.5 w-3.5" />
                    </Button>
                  )}
                  <Button
                    size="sm"
                    disabled={selectedAnswer === null}
                    onClick={handleSubmitQuiz}
                    className="brand-gradient text-brand-navy font-bold"
                  >
                    Submit Answer
                  </Button>
                </div>
              </div>

              {/* Have a Feedback (got target) */}
              <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-amber-500 fill-amber-400" />
                  <h4 className="font-black text-sm text-brand-navy">
                    Have a Feedback — Got Target (Achievement Reflection)
                  </h4>
                </div>

                {feedbackSubmitted ? (
                  <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-xs text-emerald-800 font-medium">
                    <CheckCircle2 className="h-4 w-4 inline mr-1.5 text-emerald-600" />
                    Feedback recorded! Your sponsor will review your entrepreneur breakthrough reflection.
                  </div>
                ) : (
                  <form onSubmit={handleSubmitFeedback} className="space-y-3">
                    <p className="text-xs text-slate-600">
                      After watching the Rise of Entrepreneur video, share your biggest breakthrough insight and your primary income target.
                    </p>
                    <textarea
                      rows={3}
                      required
                      value={feedbackText}
                      onChange={(e) => setFeedbackText(e.target.value)}
                      placeholder="e.g. My biggest insight was that building a team creates residual income vs just working for a salary. My target for Month 1 is ETB 12,000 in commissions..."
                      className="w-full rounded-lg border border-slate-200 p-3 text-xs outline-none focus:border-brand-blue"
                    />
                    <div className="flex justify-end">
                      <Button type="submit" size="sm" className="brand-gradient font-bold text-brand-navy">
                        Submit Feedback & Target
                      </Button>
                    </div>
                  </form>
                )}
              </div>
            </Card>
          )}

          {/* STEP 7: EVERY DETAIL INFO FOR UPLINE */}
          {activeTrack === "upline-report" && (
            <Card className="p-6 border-slate-200 space-y-5">
              <div className="border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700">
                    <Network className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Step 7</span>
                    <h3 className="text-lg font-black text-brand-navy">Every Detail Information for Upline</h3>
                  </div>
                </div>
                <p className="mt-2 text-xs text-slate-600">
                  Generate a complete new IBO dossier to share with your upline sponsor. Includes all contact, placement, package, and training completion details.
                </p>
              </div>

              {savedMember ? (
                <>
                  <div id="onboarding-upline-dossier" className="rounded-2xl border-2 border-indigo-200 bg-gradient-to-b from-indigo-50 to-white p-5">
                    <div className="flex items-center justify-between border-b border-indigo-100 pb-3 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="h-11 w-11 rounded-full bg-indigo-500 flex items-center justify-center font-black text-white text-base shadow">
                          {savedMember.fullName.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-black text-brand-navy">{savedMember.fullName}</h4>
                          <p className="text-xs text-slate-500">{savedMember.phone} · {savedMember.city}</p>
                        </div>
                      </div>
                      <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-800">
                        New IBO ✓
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      {[
                        { label: "Package", value: savedMember.packageType },
                        { label: "Start Date", value: savedMember.startDate },
                        { label: "Email", value: savedMember.email || "Not provided" },
                        { label: "Upline Sponsor", value: savedMember.uplineName },
                        { label: "Upline Phone", value: savedMember.uplinePhone || "Not provided" },
                        { label: "Training Progress", value: `${completedSteps.size} / 8 steps done` }
                      ].map((item) => (
                        <div key={item.label} className="rounded-lg bg-slate-50 border border-slate-100 p-2.5">
                          <p className="text-[10px] font-bold uppercase text-slate-400">{item.label}</p>
                          <p className="font-bold text-brand-navy mt-0.5">{item.value}</p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 flex flex-wrap justify-end gap-2">
                      <Button
                        variant="secondary"
                        onClick={() => printSection("onboarding-upline-dossier", `New IBO Onboarding Dossier — ${savedMember.fullName}`)}
                        className="border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-bold"
                      >
                        <Printer className="mr-1.5 h-3.5 w-3.5" />
                        Print Dossier
                      </Button>
                      <Button
                        onClick={handleCopyUplineReport}
                        className="brand-gradient font-bold text-brand-navy text-xs"
                      >
                        <Share2 className="mr-1.5 h-3.5 w-3.5" />
                        {uplineCopied ? "Copied to Clipboard!" : "Copy Full Report for Upline"}
                      </Button>
                    </div>
                  </div>

                  <Button
                    onClick={() => {
                      markStepComplete("upline-report");
                      setActiveTrack("text-marketing");
                    }}
                    className="w-full brand-gradient font-bold text-brand-navy"
                  >
                    Proceed to Text Marketing <ArrowRight className="ml-1.5 h-4 w-4" />
                  </Button>
                </>
              ) : (
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 text-center text-xs text-amber-800">
                  <AlertTriangle className="h-5 w-5 mx-auto mb-2 text-amber-500" />
                  <p className="font-bold">Please complete Step 1 (Getting Started Form) first.</p>
                  <Button
                    size="sm"
                    onClick={() => setActiveTrack("getting-started")}
                    className="mt-3 brand-gradient text-brand-navy font-bold"
                  >
                    Go to Registration Form
                  </Button>
                </div>
              )}
            </Card>
          )}

          {/* STEP 8: SEND TEXT FOR NEW JOINING (TEXT MARKETING) */}
          {activeTrack === "text-marketing" && (
            <Card className="p-6 border-slate-200 space-y-5">
              <div className="border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-100 text-teal-700">
                    <MessageSquare className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Step 8</span>
                    <h3 className="text-lg font-black text-brand-navy">Send Text for New Joining — Text Marketing</h3>
                  </div>
                </div>
                <p className="mt-2 text-xs text-slate-600">
                  Professional activation text sequence. Send welcome, training nudge, 48-hour challenge, and system training invitation messages to your newly registered IBO.
                </p>
              </div>

              {/* Recipient Name Input */}
              <div className="flex items-center gap-3">
                <label className="text-xs font-bold text-slate-600 shrink-0">New IBO First Name:</label>
                <input
                  value={activeNewMemberName}
                  onChange={(e) => setActiveNewMemberName(e.target.value)}
                  placeholder={savedMember ? savedMember.fullName.split(" ")[0] : "Solomon"}
                  className="h-9 flex-1 rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-brand-blue"
                />
                <Button
                  size="sm"
                  onClick={() =>
                    onOpenAi?.(
                      `Write a personalized, high-energy welcome message for a new IBO named ${activeNewMemberName || "my new member"} who just joined our MyUpline team. Include excitement, next steps, and a clear call to action to start NBO training today.`
                    )
                  }
                  variant="ghost"
                  className="border border-slate-200 shrink-0"
                >
                  <Sparkles className="mr-1 h-3.5 w-3.5 text-brand-blue" />
                  AI Custom
                </Button>
              </div>

              {/* Template Cards */}
              <div className="space-y-4">
                {newJoiningTextTemplates.map((tpl) => {
                  const name = activeNewMemberName || savedMember?.fullName.split(" ")[0] || "New Member";
                  const msg = tpl.text(name);
                  const isCopied = copiedTplId === tpl.id;
                  const phone = savedMember?.phone?.replace(/\s/g, "") ?? "";

                  return (
                    <div key={tpl.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                      <div className="flex items-center justify-between mb-2.5">
                        <h4 className="font-bold text-xs text-brand-navy">{tpl.title}</h4>
                        <span className="rounded-full bg-teal-100 px-2 py-0.5 text-[10px] font-black text-teal-800">
                          {tpl.tag}
                        </span>
                      </div>

                      <p className="rounded-lg bg-white border border-slate-200 p-3 text-xs text-slate-700 font-medium leading-relaxed">
                        "{msg}"
                      </p>

                      <div className="mt-3 flex items-center justify-end gap-2">
                        <button
                          onClick={() => copyTemplate(tpl.id, msg)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-bold text-slate-700 transition hover:bg-slate-100"
                        >
                          {isCopied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                          {isCopied ? "Copied!" : "Copy"}
                        </button>

                        {phone && (
                          <a
                            href={`sms:${phone}?body=${encodeURIComponent(msg)}`}
                            className="inline-flex items-center gap-1.5 rounded-lg brand-gradient px-3 py-1.5 text-xs font-black text-brand-navy shadow-sm"
                          >
                            <Send className="h-3.5 w-3.5" />
                            Send SMS
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <Button
                onClick={() => markStepComplete("text-marketing")}
                className="w-full brand-gradient font-black text-brand-navy text-sm"
              >
                <Trophy className="mr-2 h-4 w-4" />
                Complete After-Sales Onboarding — All 8 Steps Done! 🎉
              </Button>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

// Missing import fix
function AlertTriangle({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
    </svg>
  );
}
