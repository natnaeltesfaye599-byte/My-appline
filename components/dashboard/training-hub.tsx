"use client";

import { useState, useEffect } from "react";
import {
  AlertCircle,
  ArrowRight,
  Award,
  Bell,
  BookOpen,
  Calendar,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  Download,
  FileCheck,
  FileText,
  Flame,
  Headphones,
  HelpCircle,
  Image as ImageIcon,
  Layers,
  Lock,
  Medal,
  Play,
  Presentation,
  Printer,
  Radio,
  RefreshCw,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Trophy,
  Unlock,
  Users,
  Video,
  Volume2,
  X
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Media Type for each training
export type MediaType = "video" | "audio" | "ppt";

export interface QuestionCheckpoint {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface TrainingLesson {
  id: string;
  title: string;
  durationMinutes: number; // 20 - 30 minutes
  moduleType: "NBO" | "Basic" | "Advanced";
  description: string;
  videoUrl: string;
  audioDuration: string;
  pptSlidesCount: number;
  pptSlides: { title: string; bullets: string[] }[];
  question: QuestionCheckpoint;
  isUnlocked: boolean;
  isCompleted: boolean;
}

const ericQuotes = [
  {
    id: "eq-1",
    quote: "You must accept a temporary loss of social esteem from ignorant people. The key to freedom is becoming a true professional.",
    author: "Eric Worre",
    title: "Author of Go Pro & Global Network Marketing Legend",
    bgPhoto: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1400&auto=format&fit=crop&q=80"
  },
  {
    id: "eq-2",
    quote: "Don't wish it were easier, wish you were better. Don't wish for fewer problems, wish for more skills. Network marketing rewards mastery.",
    author: "Eric Worre",
    title: "Network Marketing Pro Mentor",
    bgPhoto: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1400&auto=format&fit=crop&q=80"
  },
  {
    id: "eq-3",
    quote: "In this business, your income will rarely exceed your personal development. Every 20-30 minute training expands your future team.",
    author: "Eric Worre",
    title: "Master Trainer & Speaker",
    bgPhoto: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1400&auto=format&fit=crop&q=80"
  }
];

const initialBasicLessons: TrainingLesson[] = [
  {
    id: "nbo-1",
    title: "NBO 101: New Business Orientation & First 48 Hours",
    durationMinutes: 25,
    moduleType: "NBO",
    description: "Your official orientation to the MyUpline compensation model, compliance standards, and immediate 48-hour launch list.",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    audioDuration: "25:00",
    pptSlidesCount: 16,
    pptSlides: [
      { title: "NBO Launch: Mission & Ethos", bullets: ["Why MyUpline is different", "Core product ecosystem", "Ethical direct marketing"] },
      { title: "The First 48-Hour Blueprint", bullets: ["Compile your initial 100 contact asset", "Warm market vs cold market", "Setting launch goals"] },
      { title: "System Duplication Rules", bullets: ["Never present alone in week 1", "Leverage 3-way calls", "Use certified promotional flyers"] }
    ],
    question: {
      id: "q-nbo-1",
      question: "According to NBO standards, what is the primary objective of a new member during their first 48 hours?",
      options: [
        "Create an e-commerce website and run paid advertising alone",
        "Compile an initial 100-contact asset and execute 3-way launch calls with their Upline sponsor",
        "Wait 30 days before speaking with anyone about the business",
        "Change the compensation plan structure"
      ],
      correctIndex: 1,
      explanation: "NBO teaches system duplication: leveraging your upline sponsor for 3-way calls and working your initial 100 contacts within the first 48 hours."
    },
    isUnlocked: true,
    isCompleted: false
  },
  {
    id: "nbo-2",
    title: "NBO 102: System Compensation, Ranks & PV/GV Rules",
    durationMinutes: 28,
    moduleType: "NBO",
    description: "Deep dive into Personal Volume (PV), Group Volume (GV), rank advancements, and how weekly payout cycles operate.",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    audioDuration: "28:15",
    pptSlidesCount: 18,
    pptSlides: [
      { title: "Understanding PV vs GV", bullets: ["Personal Volume: direct purchases/sales", "Group Volume: entire organization depth", "Qualification cutoff cycles"] },
      { title: "Rank Ladder: Member to Diamond", bullets: ["Silver: 5,000 GV requirement", "Gold: 25,000 GV requirement", "Diamond Director: 150,000+ GV"] },
      { title: "Maximizing Referral Commissions", bullets: ["Direct enrollment bonuses", "Matching team overrides", "Car & Villa lifestyle pools"] }
    ],
    question: {
      id: "q-nbo-2",
      question: "What is the difference between Personal Volume (PV) and Group Volume (GV)?",
      options: [
        "PV and GV are completely identical terms",
        "PV is generated by your direct orders/sales; GV represents the cumulative volume of your entire downline team",
        "GV only counts if all members are located in the same city",
        "PV is only tracked once per year"
      ],
      correctIndex: 1,
      explanation: "PV measures your personal activity, while GV measures total organizational throughput across all team lineage levels."
    },
    isUnlocked: false,
    isCompleted: false
  },
  {
    id: "basic-1",
    title: "Basic 201: Professional Prospecting & The Invitation",
    durationMinutes: 22,
    moduleType: "Basic",
    description: "Master the 8-step professional invitation formula from Eric Worre: urgency, value, clearing the schedule, and confirmation.",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    audioDuration: "22:40",
    pptSlidesCount: 14,
    pptSlides: [
      { title: "The Mindset of an Inviter", bullets: ["You are an educator, not a hunter", "Detach your emotion from the outcome", "Urgency creates respect"] },
      { title: "The 8-Step Invitation Script", bullets: ["Step 1: Be in a hurry", "Step 2: Sincere compliment", "Step 3: Make the invitation ('If I... Would you?')", "Step 4: Get a time commitment"] }
    ],
    question: {
      id: "q-basic-1",
      question: "In professional invitation methodology, why is 'If I... Would You?' considered the most powerful psychological phrase?",
      options: [
        "It forces the prospect into an immediate binding legal contract",
        "It is reciprocal: you offer value in exchange for their commitment without being pushy",
        "It confuses the prospect into saying yes",
        "It guarantees 100% sales conversion on every call"
      ],
      correctIndex: 1,
      explanation: "'If I, would you' creates reciprocity. You offer to share a presentation tool only if they commit to taking the time to review it."
    },
    isUnlocked: false,
    isCompleted: false
  }
];

const initialAdvancedLessons: TrainingLesson[] = [
  {
    id: "adv-1",
    title: "Advanced 301: Mastering Objections & Closing Psychology",
    durationMinutes: 26,
    moduleType: "Advanced",
    description: "How to resolve 'I don't have time', 'I don't have money', and 'Is this a pyramid?' with empathy, posture, and the Feel-Felt-Found framework.",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    audioDuration: "26:30",
    pptSlidesCount: 20,
    pptSlides: [
      { title: "Posture vs Pressure", bullets: ["Never argue with a prospect", "Questions are the answers", "Validating concerns authentically"] },
      { title: "Handling the 'Money' Objection", bullets: ["'That is exactly why you need to do this'", "Resourcefulness over resources", "Micro-launch funding"] }
    ],
    question: {
      id: "q-adv-1",
      question: "When a prospect raises an objection, what is the best first response?",
      options: [
        "Immediately debate them with aggressive facts",
        "Acknowledge and validate their concern with empathy (e.g. 'I understand exactly how you feel')",
        "Hang up the phone immediately",
        "Lower your product price by 90%"
      ],
      correctIndex: 1,
      explanation: "Validation defuses tension and creates psychological safety before guiding the prospect with discovery questions."
    },
    isUnlocked: true,
    isCompleted: false
  },
  {
    id: "adv-2",
    title: "Advanced 302: Duplication Architecture & Team Governance",
    durationMinutes: 30,
    moduleType: "Advanced",
    description: "Building autonomous team leaders, running synchronized system meetings, and structuring 30-day fast-track duplication waves.",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    audioDuration: "30:00",
    pptSlidesCount: 22,
    pptSlides: [
      { title: "The Law of Duplication", bullets: ["It doesn't matter what works; it only matters what duplicates", "Simple systems beat genius personalities", "Culture of peer recognition"] },
      { title: "Leadership Retention", bullets: ["Weekly operational audits", "Promoting from within the team", "Continuous recognition certificates"] }
    ],
    question: {
      id: "q-adv-2",
      question: "What is the golden rule of duplication in network marketing?",
      options: [
        "Only do things that require 10 years of professional sales experience",
        "It doesn't matter what works for a genius; it only matters what duplicates simply across 1,000 people",
        "Never train your downline members",
        "Change company presentation slides every 3 days"
      ],
      correctIndex: 1,
      explanation: "Duplication requires simplicity. If an average person cannot copy your exact system, it will not scale into thousands of members."
    },
    isUnlocked: false,
    isCompleted: false
  }
];

export function TrainingHub({
  onOpenAi
}: {
  onOpenAi?: (prompt: string) => void;
}) {
  const [levelTab, setLevelTab] = useState<"Basic" | "Advanced">("Basic");
  const [basicLessons, setBasicLessons] = useState<TrainingLesson[]>(initialBasicLessons);
  const [advancedLessons, setAdvancedLessons] = useState<TrainingLesson[]>(initialAdvancedLessons);

  const currentList = levelTab === "Basic" ? basicLessons : advancedLessons;
  const [activeLessonId, setActiveLessonId] = useState<string>(currentList[0].id);

  // Active Lesson Media Mode (Video / Audio / PPT)
  const [activeMediaType, setActiveMediaType] = useState<MediaType>("video");

  // Continuous Progress Timer (e.g. 20 - 30 minutes)
  const [elapsedSeconds, setElapsedSeconds] = useState(140);
  const [isPlayingMedia, setIsPlayingMedia] = useState(false);

  // PPT Slide index
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  // Quiz / Question State
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [isQuizCorrect, setIsQuizCorrect] = useState(false);
  const [showQuestionModal, setShowQuestionModal] = useState(false);

  // Synchronized System Training Countdown
  const [cohortSecondsLeft, setCohortSecondsLeft] = useState(2520); // 42 mins

  // Certificates Modal
  const [earnedCertificateType, setEarnedCertificateType] = useState<"NBO" | "Basic" | null>(null);
  const [showCertModal, setShowCertModal] = useState(false);

  // Notification Reminder State
  const [reminderTime, setReminderTime] = useState("20:00");
  const [reminderActive, setReminderActive] = useState(true);
  const [reminderAlert, setReminderAlert] = useState<string | null>(null);

  // Eric Worre Quote Index
  const [quoteIndex, setQuoteIndex] = useState(0);
  const activeEricQuote = ericQuotes[quoteIndex];

  // Selected Active Lesson
  const activeLesson =
    currentList.find((l) => l.id === activeLessonId) ?? currentList[0];

  // Cohort live timer countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setCohortSecondsLeft((prev) => (prev > 0 ? prev - 1 : 3600));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Format seconds to mm:ss
  function formatTime(sec: number) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  }

  function handleSelectLesson(lesson: TrainingLesson) {
    if (!lesson.isUnlocked) return;
    setActiveLessonId(lesson.id);
    setElapsedSeconds(0);
    setActiveSlideIndex(0);
    setSelectedOption(null);
    setQuizSubmitted(false);
    setIsQuizCorrect(false);
  }

  function handleAnswerQuestion() {
    if (selectedOption === null) return;
    setQuizSubmitted(true);
    const isCorrect = selectedOption === activeLesson.question.correctIndex;
    setIsQuizCorrect(isCorrect);

    if (isCorrect) {
      // Mark current lesson completed
      const updateList = (prev: TrainingLesson[]) => {
        const index = prev.findIndex((l) => l.id === activeLesson.id);
        if (index === -1) return prev;

        const updated = [...prev];
        updated[index] = { ...updated[index], isCompleted: true };

        // Unlock next continuous training lesson
        if (index + 1 < updated.length) {
          updated[index + 1] = { ...updated[index + 1], isUnlocked: true };
        }
        return updated;
      };

      if (levelTab === "Basic") {
        setBasicLessons(updateList);
        // Check if NBO or Basic is fully completed to issue Recognized Certificate
        if (activeLesson.moduleType === "NBO" && activeLesson.id === "nbo-2") {
          setEarnedCertificateType("NBO");
          setShowCertModal(true);
        } else if (activeLesson.id === "basic-1") {
          setEarnedCertificateType("Basic");
          setShowCertModal(true);
        }
      } else {
        setAdvancedLessons(updateList);
      }
    }
  }

  function handleTriggerReminderAlert() {
    setReminderAlert(`🔔 Daily Training Reminder: Continuous learning session ready! (Scheduled for ${reminderTime})`);
    setTimeout(() => setReminderAlert(null), 4500);
  }

  const completedCount = currentList.filter((l) => l.isCompleted).length;
  const progressPercent = Math.round((completedCount / currentList.length) * 100);

  return (
    <div className="space-y-6">
      {/* 1. HERO BANNER: BACKGROUND PHOTO WITH ERIC WORRE QUOTE */}
      <div
        className="relative overflow-hidden rounded-3xl border border-white/20 p-7 sm:p-9 text-white shadow-2xl transition-all duration-500 bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(3, 21, 63, 0.90) 0%, rgba(4, 29, 99, 0.85) 60%, rgba(22, 212, 255, 0.45) 100%), url(${activeEricQuote.bgPhoto})`
        }}
      >
        <div className="relative z-10 flex flex-col justify-between min-h-[190px]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-cyan/40 bg-brand-cyan/20 px-3.5 py-1 text-xs font-black tracking-wide text-brand-cyan uppercase backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" />
              Eric Worre Training Academy
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setQuoteIndex((prev) => (prev + 1) % ericQuotes.length)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-bold text-white backdrop-blur transition hover:bg-white/20"
              >
                <RefreshCw className="h-3 w-3" />
                Next Eric Quote
              </button>

              <Button
                size="sm"
                onClick={() =>
                  onOpenAi?.(
                    `Analyze Eric Worre's training principle: "${activeEricQuote.quote}" and give me 3 practical application exercises to use in my downline training this week.`
                  )
                }
                className="brand-gradient border-none font-bold text-brand-navy shadow-md text-xs"
              >
                <Sparkles className="mr-1 h-3.5 w-3.5" />
                AI Coach Insight
              </Button>
            </div>
          </div>

          {/* Eric Worre Quote Content */}
          <div className="my-auto py-3 max-w-3xl">
            <blockquote className="font-serif text-lg sm:text-2xl font-bold italic leading-relaxed text-white drop-shadow-md">
              "{activeEricQuote.quote}"
            </blockquote>
            <p className="mt-2 text-xs sm:text-sm font-bold text-brand-cyan">
              — {activeEricQuote.author} <span className="text-white/60 font-normal">({activeEricQuote.title})</span>
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-white/80 border-t border-white/15 pt-3">
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-brand-cyan" /> 20 - 30 Min Continuous Sessions
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <HelpCircle className="h-3.5 w-3.5 text-brand-green" /> Mandatory Question Gate
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Medal className="h-3.5 w-3.5 text-amber-300" /> Recognized NBO & Basic Certificates
            </span>
          </div>
        </div>
      </div>

      {/* NOTIFICATION REMINDER TOAST */}
      {reminderAlert && (
        <div className="flex items-center justify-between rounded-xl border border-brand-cyan/40 bg-brand-navy p-3.5 text-xs text-white shadow-xl animate-in fade-in">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-brand-cyan animate-bounce" />
            <span className="font-semibold">{reminderAlert}</span>
          </div>
          <button onClick={() => setReminderAlert(null)} className="text-white/60 hover:text-white text-xs font-bold">
            Dismiss
          </button>
        </div>
      )}

      {/* 2. SYNCHRONIZED SYSTEM TRAINING BANNER (Starts Equal Time) & REMINDER SCHEDULER */}
      <div className="grid gap-4 sm:grid-cols-2">
        {/* System Training: Equal Start Time */}
        <Card className="p-4 border-brand-cyan/40 bg-gradient-to-br from-brand-navy to-[#05235e] text-white shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-cyan/20 text-brand-cyan">
                <Radio className="h-4 w-4 animate-pulse" />
              </span>
              <div>
                <span className="text-[10px] font-black tracking-widest text-brand-cyan uppercase">
                  SYNCHRONIZED SYSTEM TRAINING
                </span>
                <h4 className="font-black text-sm text-white">Daily Global Cohort Training</h4>
              </div>
            </div>
            <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-brand-green border border-emerald-500/30">
              Starts Equal Time
            </span>
          </div>

          <div className="mt-3 flex items-center justify-between rounded-xl bg-white/10 p-3 backdrop-blur border border-white/10">
            <div>
              <p className="text-[10px] text-white/60 uppercase font-bold">Next Synchronized Broadcast</p>
              <p className="text-base font-black text-amber-300 font-mono">
                {formatTime(cohortSecondsLeft)} <span className="text-xs font-normal text-white/70">remaining</span>
              </p>
            </div>
            <Button
              size="sm"
              onClick={() => {
                setReminderAlert("🎯 You have reserved your seat for the next synchronized system broadcast!");
                setTimeout(() => setReminderAlert(null), 4000);
              }}
              className="brand-gradient text-brand-navy font-bold text-xs h-8"
            >
              Join System Broadcast
            </Button>
          </div>
          <p className="mt-2 text-[11px] text-white/60">
            All downline members start simultaneously at equal times for maximum unified leadership momentum.
          </p>
        </Card>

        {/* Training Reminder (Notification) Setup */}
        <Card className="p-4 border-slate-200 bg-white shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600">
                  <Bell className="h-4 w-4" />
                </span>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
                    Smart Study Reminder
                  </span>
                  <h4 className="font-black text-sm text-brand-navy">Training Notification Alerts</h4>
                </div>
              </div>
              <span
                className={cn(
                  "rounded px-2 py-0.5 text-[10px] font-bold",
                  reminderActive ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-600"
                )}
              >
                {reminderActive ? "Active Alerts" : "Muted"}
              </span>
            </div>

            <div className="mt-3 flex items-center gap-3">
              <label className="text-xs font-bold text-slate-600">Daily Reminder Time:</label>
              <input
                type="time"
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
                className="h-8 rounded-lg border border-slate-200 px-2 text-xs font-bold text-brand-navy outline-none focus:border-brand-blue"
              />
              <button
                onClick={() => setReminderActive(!reminderActive)}
                className="text-xs font-bold text-brand-blue hover:underline"
              >
                {reminderActive ? "Turn Off" : "Enable"}
              </button>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2 text-xs">
            <span className="text-slate-500">Continuous 20-30 min habit</span>
            <button
              onClick={handleTriggerReminderAlert}
              className="inline-flex items-center gap-1 font-bold text-brand-blue hover:underline"
            >
              Test Notification Alert <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        </Card>
      </div>

      {/* 3. LEVEL SWITCHER: BASIC vs ADVANCED */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-1 rounded-xl bg-slate-100 p-1">
          <button
            onClick={() => {
              setLevelTab("Basic");
              setActiveLessonId(basicLessons[0].id);
              setSelectedOption(null);
              setQuizSubmitted(false);
            }}
            className={cn(
              "flex items-center gap-2 rounded-lg px-5 py-2 text-xs font-black transition",
              levelTab === "Basic"
                ? "brand-gradient text-brand-navy shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            )}
          >
            <BookOpen className="h-4 w-4" />
            Basic Training (NBO + Fundamentals)
          </button>
          <button
            onClick={() => {
              setLevelTab("Advanced");
              setActiveLessonId(advancedLessons[0].id);
              setSelectedOption(null);
              setQuizSubmitted(false);
            }}
            className={cn(
              "flex items-center gap-2 rounded-lg px-5 py-2 text-xs font-black transition",
              levelTab === "Advanced"
                ? "brand-gradient text-brand-navy shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            )}
          >
            <Trophy className="h-4 w-4" />
            Advanced Training (Objections & Leadership)
          </button>
        </div>

        {/* Certificate shortcut badge */}
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              setEarnedCertificateType(levelTab === "Basic" ? "NBO" : "Basic");
              setShowCertModal(true);
            }}
            className="h-8 border border-amber-300 bg-amber-50 text-xs font-bold text-amber-800 hover:bg-amber-100"
          >
            <Medal className="mr-1.5 h-3.5 w-3.5 text-amber-600" />
            View {levelTab === "Basic" ? "NBO" : "Basic"} Recognized Certificate
          </Button>
        </div>
      </div>

      {/* 4. MAIN WORKSPACE: LESSON PLAYER (Left) & CONTINUOUS LESSON LIST (Right) */}
      <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
        {/* LEFT COLUMN: ACTIVE LESSON PLAYER & MEDIA TABS */}
        <div className="space-y-4">
          <Card className="overflow-hidden border-slate-200 shadow-md">
            {/* Media Format Selector: Video / Audio / PPT */}
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-2.5">
              <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white p-0.5">
                <button
                  onClick={() => setActiveMediaType("video")}
                  className={cn(
                    "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-bold transition",
                    activeMediaType === "video"
                      ? "bg-brand-navy text-brand-cyan"
                      : "text-slate-600 hover:text-slate-900"
                  )}
                >
                  <Video className="h-3.5 w-3.5" /> Video Lesson
                </button>
                <button
                  onClick={() => setActiveMediaType("audio")}
                  className={cn(
                    "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-bold transition",
                    activeMediaType === "audio"
                      ? "bg-brand-navy text-brand-cyan"
                      : "text-slate-600 hover:text-slate-900"
                  )}
                >
                  <Headphones className="h-3.5 w-3.5" /> Audio Stream
                </button>
                <button
                  onClick={() => setActiveMediaType("ppt")}
                  className={cn(
                    "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-bold transition",
                    activeMediaType === "ppt"
                      ? "bg-brand-navy text-brand-cyan"
                      : "text-slate-600 hover:text-slate-900"
                  )}
                >
                  <Presentation className="h-3.5 w-3.5" /> PPT Slides
                </button>
              </div>

              {/* Continuous 20-30 min indicator */}
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                <Clock className="h-3.5 w-3.5 text-brand-blue" />
                <span>{activeLesson.durationMinutes} Min Continuous</span>
              </div>
            </div>

            {/* Media Player Screen */}
            <div className="relative aspect-video w-full bg-slate-950 flex flex-col justify-center items-center text-white">
              {/* VIDEO MODE */}
              {activeMediaType === "video" && (
                <div className="relative w-full h-full flex flex-col justify-between p-4 bg-gradient-to-t from-black/80 via-transparent to-black/40">
                  <div className="flex items-center justify-between">
                    <span className="rounded bg-brand-cyan/20 px-2 py-0.5 text-xs font-bold text-brand-cyan border border-brand-cyan/30">
                      {activeLesson.moduleType} Training
                    </span>
                    <span className="text-xs font-mono text-white/80">
                      {formatTime(elapsedSeconds)} / {activeLesson.durationMinutes}:00
                    </span>
                  </div>

                  <div className="flex flex-col items-center justify-center my-auto">
                    <button
                      onClick={() => setIsPlayingMedia(!isPlayingMedia)}
                      className="flex h-16 w-16 items-center justify-center rounded-full brand-gradient text-brand-navy shadow-2xl transition hover:scale-110"
                    >
                      {isPlayingMedia ? <Check className="h-8 w-8" /> : <Play className="h-8 w-8 fill-brand-navy ml-1" />}
                    </button>
                    <p className="mt-3 text-sm font-bold text-white drop-shadow">
                      {isPlayingMedia ? "Playing Continuous 20-30m Session" : "Click to Play Video Lesson"}
                    </p>
                  </div>

                  {/* Scrub Bar */}
                  <div className="space-y-1">
                    <div className="h-1.5 w-full rounded-full bg-white/20 overflow-hidden">
                      <div
                        className="h-full brand-gradient transition-all"
                        style={{ width: `${Math.min(100, (elapsedSeconds / (activeLesson.durationMinutes * 60)) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* AUDIO MODE */}
              {activeMediaType === "audio" && (
                <div className="w-full h-full p-8 flex flex-col justify-center items-center text-center bg-gradient-to-br from-brand-navy to-slate-900">
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-cyan-500/10 text-brand-cyan border border-cyan-500/30 mb-4 shadow-lg">
                    <Headphones className="h-10 w-10 animate-pulse" />
                  </div>
                  <h4 className="text-lg font-black text-white">{activeLesson.title}</h4>
                  <p className="text-xs text-white/60 mt-1">
                    Audio Lecture • {activeLesson.audioDuration} mins • Perfect for commute & exercise
                  </p>
                  <div className="mt-5 flex items-center gap-3">
                    <button
                      onClick={() => setIsPlayingMedia(!isPlayingMedia)}
                      className="flex h-12 w-12 items-center justify-center rounded-full brand-gradient text-brand-navy font-bold shadow-lg"
                    >
                      {isPlayingMedia ? <Check className="h-6 w-6" /> : <Play className="h-6 w-6 fill-brand-navy ml-0.5" />}
                    </button>
                  </div>
                </div>
              )}

              {/* PPT SLIDES MODE */}
              {activeMediaType === "ppt" && (
                <div className="w-full h-full p-6 flex flex-col justify-between bg-slate-900 text-left">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <span className="text-xs font-bold text-amber-300">
                      Slide {activeSlideIndex + 1} of {activeLesson.pptSlides.length}
                    </span>
                    <button
                      onClick={() => alert("PPT Deck downloaded for offline presentation.")}
                      className="inline-flex items-center gap-1 text-[11px] text-brand-cyan font-bold hover:underline"
                    >
                      <Download className="h-3 w-3" /> Download .PPTX
                    </button>
                  </div>

                  <div className="my-auto py-3">
                    <h3 className="text-xl font-black text-white">
                      {activeLesson.pptSlides[activeSlideIndex]?.title ?? "Module Slide"}
                    </h3>
                    <ul className="mt-3 space-y-2 text-sm text-white/80 list-disc list-inside">
                      {activeLesson.pptSlides[activeSlideIndex]?.bullets.map((b, i) => (
                        <li key={i}>{b}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center justify-between border-t border-white/10 pt-2 text-xs">
                    <button
                      disabled={activeSlideIndex === 0}
                      onClick={() => setActiveSlideIndex((prev) => Math.max(0, prev - 1))}
                      className="rounded bg-white/10 px-3 py-1 font-bold disabled:opacity-30"
                    >
                      Previous Slide
                    </button>
                    <button
                      disabled={activeSlideIndex === activeLesson.pptSlides.length - 1}
                      onClick={() => setActiveSlideIndex((prev) => Math.min(activeLesson.pptSlides.length - 1, prev + 1))}
                      className="rounded brand-gradient px-3 py-1 font-black text-brand-navy disabled:opacity-30"
                    >
                      Next Slide
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Lesson Info Footer */}
            <div className="p-5 bg-white">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-brand-cyan/20 px-2 py-0.5 text-[10px] font-bold text-brand-navy">
                      {activeLesson.moduleType}
                    </span>
                    <h3 className="text-lg font-black text-brand-navy">{activeLesson.title}</h3>
                  </div>
                  <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                    {activeLesson.description}
                  </p>
                </div>

                <Button
                  onClick={() => setShowQuestionModal(true)}
                  className="brand-gradient font-bold text-brand-navy shrink-0 text-xs shadow-md"
                >
                  <HelpCircle className="mr-1.5 h-3.5 w-3.5" />
                  Answer Question To Unlock Next
                </Button>
              </div>
            </div>
          </Card>

          {/* 5. MANDATORY QUESTION CHECKPOINT SECTION (Must answer to unlock next training) */}
          <Card className="p-5 border-amber-300 bg-amber-50/40">
            <div className="flex items-center justify-between border-b border-amber-200/60 pb-3">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500 text-white font-bold">
                  <HelpCircle className="h-4 w-4" />
                </span>
                <div>
                  <span className="text-[10px] font-black tracking-widest text-amber-800 uppercase">
                    MANDATORY ASSESSMENT CHECKPOINT
                  </span>
                  <h4 className="font-bold text-sm text-brand-navy">
                    Answer Question to Unlock Next Continuous Training
                  </h4>
                </div>
              </div>

              {activeLesson.isCompleted && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Passed & Next Lesson Unlocked
                </span>
              )}
            </div>

            {/* Question Box */}
            <div className="mt-4 space-y-3">
              <p className="font-bold text-sm text-brand-navy">
                {activeLesson.question.question}
              </p>

              <div className="space-y-2">
                {activeLesson.question.options.map((opt, idx) => {
                  const isSelected = selectedOption === idx;
                  return (
                    <div
                      key={idx}
                      onClick={() => {
                        setSelectedOption(idx);
                        setQuizSubmitted(false);
                      }}
                      className={cn(
                        "cursor-pointer rounded-xl border p-3 text-xs font-medium transition",
                        isSelected
                          ? "border-brand-blue bg-cyan-50/80 font-bold text-brand-navy ring-1 ring-brand-blue"
                          : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                      )}
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className={cn(
                            "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px]",
                            isSelected ? "border-brand-blue bg-brand-blue text-white font-bold" : "border-slate-300"
                          )}
                        >
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span>{opt}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Feedback Alert */}
              {quizSubmitted && (
                <div
                  className={cn(
                    "rounded-xl p-3 text-xs font-medium",
                    isQuizCorrect ? "bg-emerald-100 text-emerald-800 border border-emerald-200" : "bg-red-100 text-red-800 border border-red-200"
                  )}
                >
                  <p className="font-bold">
                    {isQuizCorrect ? "✅ Correct! Next Continuous Training is now UNLOCKED." : "❌ Incorrect. Please review the material and try again."}
                  </p>
                  <p className="mt-1 text-[11px] leading-relaxed">{activeLesson.question.explanation}</p>
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] text-slate-500">
                  Continuous progression requires 100% quiz accuracy.
                </span>
                <Button
                  onClick={handleAnswerQuestion}
                  disabled={selectedOption === null}
                  className="brand-gradient text-brand-navy font-bold text-xs"
                >
                  Validate & Unlock Next Training
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* RIGHT COLUMN: CONTINUOUS TRAINING PROGRESSION LIST */}
        <div className="space-y-4">
          {/* Progress Card */}
          <Card className="p-4 border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {levelTab} Training Completion
              </span>
              <span className="text-xs font-black text-brand-navy">{progressPercent}%</span>
            </div>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-100">
              <div className="h-full brand-gradient transition-all duration-500" style={{ width: `${progressPercent}%` }} />
            </div>
            <p className="mt-2 text-[11px] text-slate-500">
              {completedCount} of {currentList.length} continuous modules completed
            </p>
          </Card>

          {/* List of Lessons */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Continuous Curriculum Modules
            </h4>

            {currentList.map((lesson, idx) => {
              const isActive = lesson.id === activeLesson.id;
              return (
                <div
                  key={lesson.id}
                  onClick={() => handleSelectLesson(lesson)}
                  className={cn(
                    "rounded-xl border p-3.5 transition-all duration-200",
                    isActive
                      ? "border-brand-blue bg-cyan-50/40 shadow-sm ring-1 ring-brand-blue"
                      : lesson.isUnlocked
                      ? "border-slate-200 bg-white hover:border-slate-300 cursor-pointer"
                      : "border-slate-200 bg-slate-50 opacity-60 cursor-not-allowed"
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      <div
                        className={cn(
                          "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                          lesson.isCompleted
                            ? "bg-emerald-500 text-white"
                            : lesson.isUnlocked
                            ? "bg-brand-navy text-brand-cyan"
                            : "bg-slate-300 text-slate-600"
                        )}
                      >
                        {lesson.isCompleted ? (
                          <Check className="h-3.5 w-3.5" />
                        ) : lesson.isUnlocked ? (
                          idx + 1
                        ) : (
                          <Lock className="h-3 w-3" />
                        )}
                      </div>

                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="rounded bg-slate-100 px-1.5 py-0.2 text-[9px] font-bold uppercase text-slate-600">
                            {lesson.moduleType}
                          </span>
                          <span className="text-xs font-bold text-slate-500">
                            {lesson.durationMinutes} min
                          </span>
                        </div>
                        <h5 className="mt-0.5 font-bold text-brand-navy text-xs leading-snug">
                          {lesson.title}
                        </h5>
                      </div>
                    </div>

                    <div className="shrink-0 text-right">
                      {lesson.isCompleted ? (
                        <span className="text-[10px] font-bold text-emerald-600">Completed</span>
                      ) : lesson.isUnlocked ? (
                        <span className="text-[10px] font-bold text-brand-blue">Active</span>
                      ) : (
                        <span className="text-[10px] font-semibold text-slate-400">Locked</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Recognized Certificate Issuance Card */}
          <Card className="p-4 border-amber-300 bg-gradient-to-br from-amber-50 to-white shadow-sm">
            <div className="flex items-center gap-2">
              <Medal className="h-5 w-5 text-amber-600" />
              <h4 className="text-xs font-black text-brand-navy uppercase tracking-wider">
                Recognized Certificates
              </h4>
            </div>
            <p className="mt-1 text-[11px] text-slate-600 leading-relaxed">
              Complete all questions in <strong>NBO</strong> and <strong>Basic Training</strong> to earn your verified official credentials.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button
                size="sm"
                onClick={() => {
                  setEarnedCertificateType("NBO");
                  setShowCertModal(true);
                }}
                className="h-8 text-xs brand-gradient text-brand-navy font-bold"
              >
                NBO Recognized Certificate
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setEarnedCertificateType("Basic");
                  setShowCertModal(true);
                }}
                className="h-8 text-xs border border-slate-200 bg-white"
              >
                Basic Training Certificate
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* 6. MODAL: RECOGNIZED CERTIFICATE (NBO & BASIC) */}
      {showCertModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 bg-brand-navy p-4 text-white">
              <div className="flex items-center gap-2">
                <Medal className="h-5 w-5 text-amber-300" />
                <h3 className="text-base font-black">
                  Official Recognized Certificate of Completion
                </h3>
              </div>
              <button
                onClick={() => setShowCertModal(false)}
                className="rounded p-1 text-white/70 hover:bg-white/10 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Certificate Body */}
            <div className="p-6">
              <div className="rounded-xl border-4 border-[#d4af37] bg-gradient-to-b from-[#fdfcf9] via-white to-[#fbf9f4] p-6 text-center text-slate-900 shadow-lg relative">
                <div className="flex items-center justify-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-brand-blue" />
                  <span className="text-[10px] font-black tracking-widest text-brand-navy uppercase">
                    MYUPLINE ACCREDITED TRAINING SYSTEM
                  </span>
                </div>

                <h2 className="mt-3 font-serif text-2xl font-black text-brand-navy uppercase">
                  {earnedCertificateType === "NBO"
                    ? "Certificate of NBO Completion"
                    : "Certificate of Basic Training Mastery"}
                </h2>
                <p className="text-xs text-slate-500 uppercase tracking-wider">
                  Verified Official Direct Sales Accreditation
                </p>

                <p className="mt-4 text-xs italic text-slate-600">This certifies that</p>
                <h3 className="mt-1 font-serif text-2xl font-bold text-[#996515] underline decoration-[#d4af37]/50 underline-offset-4">
                  Valued MyUpline Leader
                </h3>

                <p className="mt-2 text-xs text-slate-700 max-w-md mx-auto">
                  Has successfully passed all continuous 20–30 minute modules and mandatory assessment checkpoints in accordance with Eric Worre professional standards.
                </p>

                <div className="mt-5 flex items-center justify-between border-t border-[#d4af37]/30 pt-3 text-[10px] text-slate-600 px-4">
                  <div className="text-left">
                    <p className="font-bold text-slate-800">Eric Worre Standards</p>
                    <p>Curriculum Verifier</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-amber-400 to-amber-600 flex items-center justify-center text-white shadow font-bold text-xs">
                      SEAL
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-800">June 2026</p>
                    <p className="text-emerald-600 font-bold">Authenticated</p>
                  </div>
                </div>
              </div>

              <div className="mt-5 flex justify-end gap-2">
                <Button
                  variant="ghost"
                  onClick={() => setShowCertModal(false)}
                  className="border border-slate-200 text-xs font-bold"
                >
                  Close
                </Button>
                <Button
                  onClick={() => window.print()}
                  className="brand-gradient text-brand-navy font-bold text-xs"
                >
                  <Printer className="mr-1.5 h-3.5 w-3.5" /> Print / Save Certificate
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
