"use client";

import { useState } from "react";
import {
  Activity,
  AlertCircle,
  ArrowRight,
  ArrowUpRight,
  BarChart2,
  Bell,
  Calendar,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock,
  Copy,
  ExternalLink,
  FileSpreadsheet,
  Flame,
  LineChart,
  MessageSquare,
  Network,
  Phone,
  PhoneCall,
  Plus,
  Printer,
  Radio,
  Send,
  Share2,
  ShieldCheck,
  Sliders,
  Sparkles,
  Star,
  Target,
  Trophy,
  User,
  Users,
  Video,
  X,
  Zap
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { exportDailyActivity, printSection } from "@/lib/export-utils";

// 4 Basic Action Types
export type BasicActionType =
  | "callingTime" // Calling Time & Invitations
  | "presentationTime" // Presentation Time
  | "trainingTime" // Training Time
  | "prospecting"; // Adding to Name List / Prospecting

export interface DayActivityLog {
  date: string;
  dayLabel: string;
  callingTime: { target: number; actual: number; unit: string };
  presentationTime: { target: number; actual: number; unit: string };
  trainingTime: { target: number; actual: number; unit: string };
  prospecting: { target: number; actual: number; unit: string };
  reflection: string;
  isLogged: boolean;
}

const last7DaysLogs: DayActivityLog[] = [
  {
    date: "2026-06-18",
    dayLabel: "Thu",
    callingTime: { target: 10, actual: 12, unit: "calls" },
    presentationTime: { target: 2, actual: 2, unit: "presentations" },
    trainingTime: { target: 30, actual: 30, unit: "mins" },
    prospecting: { target: 5, actual: 6, unit: "names" },
    reflection: "Great momentum with Hawassa prospects.",
    isLogged: true
  },
  {
    date: "2026-06-19",
    dayLabel: "Fri",
    callingTime: { target: 10, actual: 8, unit: "calls" },
    presentationTime: { target: 2, actual: 1, unit: "presentations" },
    trainingTime: { target: 30, actual: 25, unit: "mins" },
    prospecting: { target: 5, actual: 4, unit: "names" },
    reflection: "Busy afternoon, finished 1 video training.",
    isLogged: true
  },
  {
    date: "2026-06-20",
    dayLabel: "Sat",
    callingTime: { target: 10, actual: 15, unit: "calls" },
    presentationTime: { target: 2, actual: 3, unit: "presentations" },
    trainingTime: { target: 30, actual: 40, unit: "mins" },
    prospecting: { target: 5, actual: 8, unit: "names" },
    reflection: "Super Saturday seminar! Closed 2 new IBOs.",
    isLogged: true
  },
  {
    date: "2026-06-21",
    dayLabel: "Sun",
    callingTime: { target: 10, actual: 10, unit: "calls" },
    presentationTime: { target: 2, actual: 2, unit: "presentations" },
    trainingTime: { target: 30, actual: 30, unit: "mins" },
    prospecting: { target: 5, actual: 5, unit: "names" },
    reflection: "Team weekly sync with Upline Dawit.",
    isLogged: true
  },
  {
    date: "2026-06-22",
    dayLabel: "Mon",
    callingTime: { target: 10, actual: 11, unit: "calls" },
    presentationTime: { target: 2, actual: 2, unit: "presentations" },
    trainingTime: { target: 30, actual: 30, unit: "mins" },
    prospecting: { target: 5, actual: 7, unit: "names" },
    reflection: "Heavy prospecting morning, filled the pipeline.",
    isLogged: true
  },
  {
    date: "2026-06-23",
    dayLabel: "Tue",
    callingTime: { target: 10, actual: 14, unit: "calls" },
    presentationTime: { target: 2, actual: 3, unit: "presentations" },
    trainingTime: { target: 30, actual: 35, unit: "mins" },
    prospecting: { target: 5, actual: 6, unit: "names" },
    reflection: "Eric Worre invitation script converted well.",
    isLogged: true
  },
  {
    date: "2026-06-24",
    dayLabel: "Today",
    callingTime: { target: 10, actual: 9, unit: "calls" },
    presentationTime: { target: 2, actual: 2, unit: "presentations" },
    trainingTime: { target: 30, actual: 25, unit: "mins" },
    prospecting: { target: 5, actual: 4, unit: "names" },
    reflection: "1 more call to finish today's target!",
    isLogged: true
  }
];

export function DailyActivityTracker({
  onOpenAi
}: {
  onOpenAi?: (prompt: string) => void;
}) {
  const [logs, setLogs] = useState<DayActivityLog[]>(last7DaysLogs);
  const [activeTab, setActiveTab] = useState<"tracker" | "graph" | "upline-report">("tracker");

  // Today's Form Log State
  const [todayCalls, setTodayCalls] = useState(9);
  const [todayPres, setTodayPres] = useState(2);
  const [todayTraining, setTodayTraining] = useState(25);
  const [todayProspecting, setTodayProspecting] = useState(4);
  const [todayReflection, setTodayReflection] = useState("Solid morning prospecting. Follow-up calls pending.");
  const [saveToast, setSaveToast] = useState(false);

  // Targets Config
  const targetCalls = 10;
  const targetPres = 2;
  const targetTraining = 30;
  const targetProspecting = 5;

  // Notification Scheduling States (calling time, presentation time, training time)
  const [notifyCallingTime, setNotifyCallingTime] = useState("10:00");
  const [notifyPresentationTime, setNotifyPresentationTime] = useState("18:00");
  const [notifyTrainingTime, setNotifyTrainingTime] = useState("20:00");
  const [fillReminderTime, setFillReminderTime] = useState("21:00");
  const [fillReminderActive, setFillReminderActive] = useState(true);
  const [notificationToast, setNotificationToast] = useState<string | null>(null);

  // Upline Share State
  const [uplineCopied, setUplineCopied] = useState(false);

  // Compute Today's Overall Score %
  const callScore = Math.min(100, Math.round((todayCalls / targetCalls) * 100));
  const presScore = Math.min(100, Math.round((todayPres / targetPres) * 100));
  const trainScore = Math.min(100, Math.round((todayTraining / targetTraining) * 100));
  const prospScore = Math.min(100, Math.round((todayProspecting / targetProspecting) * 100));
  const totalScore = Math.round((callScore + presScore + trainScore + prospScore) / 4);

  function handleSaveTodayLog(e: React.FormEvent) {
    e.preventDefault();
    setLogs((prev) => {
      const updated = [...prev];
      updated[updated.length - 1] = {
        ...updated[updated.length - 1],
        callingTime: { target: targetCalls, actual: todayCalls, unit: "calls" },
        presentationTime: { target: targetPres, actual: todayPres, unit: "presentations" },
        trainingTime: { target: targetTraining, actual: todayTraining, unit: "mins" },
        prospecting: { target: targetProspecting, actual: todayProspecting, unit: "names" },
        reflection: todayReflection,
        isLogged: true
      };
      return updated;
    });
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
  }

  function handleTriggerScheduleAlert(type: "calling" | "pres" | "training" | "fill") {
    if (type === "calling") {
      setNotificationToast(`📞 Calling Power Hour Alert: Time to execute your ${targetCalls} daily prospecting calls! (Scheduled for ${notifyCallingTime})`);
    } else if (type === "pres") {
      setNotificationToast(`🖥️ Presentation Broadcast Alert: Live opportunity presentation starts at ${notifyPresentationTime}! Confirm your prospects are on!`);
    } else if (type === "training") {
      setNotificationToast(`🎓 Daily Training Alert: Continuous 20-30 min Eric Worre session scheduled for ${notifyTrainingTime}!`);
    } else {
      setNotificationToast(`⭐ Evening Activity Check-in: Don't forget to fill your Daily Activity Log before midnight to maintain your streak!`);
    }
    setTimeout(() => setNotificationToast(null), 4500);
  }

  function handleShareUplineScorecard() {
    const text = `📊 DAILY ACTIVITY & KPI SCORECARD (MyUpline)\n\nLeader: Valued Member\nDate: June 24, 2026\nDaily Target Adherence: ${totalScore}%\n\n✅ 4 BASIC ACTIONS LOGGED:\n1. 📞 Calling Time: ${todayCalls}/${targetCalls} calls (${callScore}%)\n2. 🖥️ Presentations: ${todayPres}/${targetPres} shared (${presScore}%)\n3. 🎓 Training Time: ${todayTraining}/${targetTraining} mins (${trainScore}%)\n4. 👥 Name List Added: ${todayProspecting}/${targetProspecting} names (${prospScore}%)\n\n📝 Reflection: "${todayReflection}"\n\nConsistency Streak: 🔥 7 Days Consecutive\nCommitted to growth! 🚀 #MyUpline`;
    navigator.clipboard.writeText(text);
    setUplineCopied(true);
    setTimeout(() => setUplineCopied(false), 3000);
  }

  return (
    <div className="space-y-6">
      {/* 1. HEADER BANNER */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-gradient-to-r from-brand-navy via-brand-deep to-[#0d3478] p-6 text-white shadow-xl">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-400/10 px-3 py-1 text-xs font-black tracking-wide text-amber-300 uppercase backdrop-blur">
            <Zap className="h-3.5 w-3.5" />
            Core Daily Method of Operation (DMO)
          </div>
          <h2 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">
            Daily Activity Tracker & "KPI"
          </h2>
          <p className="mt-1 text-sm text-white/75">
            Track the <strong>4 Basic Actions</strong>, visualize target graphs, automate activity notifications, and export official daily reports for your upline sponsor.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            onClick={() =>
              onOpenAi?.(
                `Analyze my 7-day Daily Activity Tracker: Calling (${todayCalls}/${targetCalls}), Presentations (${todayPres}/${targetPres}), Training (${todayTraining}/${targetTraining} mins), Prospecting (${todayProspecting}/${targetProspecting}). Overall: ${totalScore}%. Give me coaching advice to break through.`
              )
            }
            className="brand-gradient font-black text-brand-navy shadow-lg"
          >
            <Sparkles className="mr-2 h-4 w-4" />
            AI DMO Coach
          </Button>

          {/* Export CSV */}
          <Button
            variant="secondary"
            onClick={() => exportDailyActivity(logs as any)}
            className="border-white/20 bg-white/10 hover:bg-white/20 text-white"
          >
            <FileSpreadsheet className="mr-1.5 h-4 w-4" />
            Export CSV
          </Button>

          {/* Print Dossier */}
          <Button
            variant="secondary"
            onClick={() => {
              const targetId = activeTab === "upline-report" ? "daily-upline-dossier" : "daily-tracker-summary";
              printSection(targetId, "Daily Activity Tracker & KPI Official Scorecard");
            }}
            className="border-white/20 bg-white/10 hover:bg-white/20 text-white"
          >
            <Printer className="mr-1.5 h-4 w-4" />
            Print / PDF
          </Button>

          <Button
            variant="secondary"
            onClick={handleShareUplineScorecard}
            className="border-white/20 bg-white/10 hover:bg-white/20"
          >
            <Share2 className="mr-1.5 h-4 w-4" />
            {uplineCopied ? "Copied Scorecard!" : "Share Result with Upline"}
          </Button>
        </div>
      </div>

      {/* NOTIFICATION BANNER / TOAST */}
      {notificationToast && (
        <div className="flex items-center justify-between rounded-xl border border-brand-cyan/40 bg-brand-navy p-3.5 text-xs text-white shadow-xl animate-in fade-in">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-brand-cyan animate-bounce" />
            <span className="font-semibold">{notificationToast}</span>
          </div>
          <button onClick={() => setNotificationToast(null)} className="text-white/60 hover:text-white text-xs font-bold">
            Dismiss
          </button>
        </div>
      )}

      {/* 2. TODAY'S DMO COMPLETION STRIP */}
      <Card id="daily-tracker-summary" className="p-4 border-slate-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-100 text-brand-blue">
              <Clock className="h-4 w-4" />
            </span>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Automated Activity Alarms
              </span>
              <h4 className="font-black text-sm text-brand-navy">
                Notify Activity: Calling • Presentation • Training
              </h4>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleTriggerScheduleAlert("fill")}
              className="inline-flex items-center gap-1.5 rounded-lg border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-bold text-amber-800 transition hover:bg-amber-100"
            >
              <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
              Test Fill Activity Reminder ⭐
            </button>
          </div>
        </div>

        {/* 3 Scheduled Alarms Grid */}
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {/* 1. Calling Time */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                  <PhoneCall className="h-3.5 w-3.5 text-emerald-600" /> Calling Time
                </span>
                <button
                  onClick={() => handleTriggerScheduleAlert("calling")}
                  className="text-[10px] text-brand-blue font-bold hover:underline"
                >
                  Trigger Alarm
                </button>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Dedicated phone outreach window</p>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <input
                type="time"
                value={notifyCallingTime}
                onChange={(e) => setNotifyCallingTime(e.target.value)}
                className="h-8 rounded-lg border border-slate-200 bg-white px-2 text-xs font-bold text-brand-navy outline-none"
              />
              <span className="text-[11px] font-semibold text-emerald-600">Daily Power Hour</span>
            </div>
          </div>

          {/* 2. Presentation Time */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                  <Video className="h-3.5 w-3.5 text-brand-blue" /> Presentation Time
                </span>
                <button
                  onClick={() => handleTriggerScheduleAlert("pres")}
                  className="text-[10px] text-brand-blue font-bold hover:underline"
                >
                  Trigger Alarm
                </button>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Live business presentation broadcast</p>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <input
                type="time"
                value={notifyPresentationTime}
                onChange={(e) => setNotifyPresentationTime(e.target.value)}
                className="h-8 rounded-lg border border-slate-200 bg-white px-2 text-xs font-bold text-brand-navy outline-none"
              />
              <span className="text-[11px] font-semibold text-brand-blue">Webinar Slot</span>
            </div>
          </div>

          {/* 3. Training Time */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                  <Clock className="h-3.5 w-3.5 text-amber-600" /> Training Time
                </span>
                <button
                  onClick={() => handleTriggerScheduleAlert("training")}
                  className="text-[10px] text-brand-blue font-bold hover:underline"
                >
                  Trigger Alarm
                </button>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Continuous 20-30m personal growth</p>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <input
                type="time"
                value={notifyTrainingTime}
                onChange={(e) => setNotifyTrainingTime(e.target.value)}
                className="h-8 rounded-lg border border-slate-200 bg-white px-2 text-xs font-bold text-brand-navy outline-none"
              />
              <span className="text-[11px] font-semibold text-amber-600">Daily Study</span>
            </div>
          </div>
        </div>
      </Card>

      {/* 3. VIEW TABS: Tracker Entry | As Per Target Graph | Show Result for Upline */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div className="flex items-center gap-1 rounded-xl bg-slate-100 p-1">
          <button
            onClick={() => setActiveTab("tracker")}
            className={cn(
              "flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-black transition",
              activeTab === "tracker"
                ? "bg-white text-brand-navy shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            )}
          >
            <Activity className="h-3.5 w-3.5 text-brand-blue" />
            4 Basic Actions Log
          </button>
          <button
            onClick={() => setActiveTab("graph")}
            className={cn(
              "flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-black transition",
              activeTab === "graph"
                ? "bg-white text-brand-navy shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            )}
          >
            <BarChart2 className="h-3.5 w-3.5 text-emerald-600" />
            As Per Target Graph
          </button>
          <button
            onClick={() => setActiveTab("upline-report")}
            className={cn(
              "flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-black transition",
              activeTab === "upline-report"
                ? "bg-white text-brand-navy shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            )}
          >
            <Users className="h-3.5 w-3.5 text-amber-500" />
            Show Result for Upline
          </button>
        </div>

        {/* Overall Score Badge */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500 hidden sm:inline">
            Today's Adherence:
          </span>
          <span
            className={cn(
              "rounded-lg px-2.5 py-1 text-xs font-black",
              totalScore >= 80
                ? "bg-emerald-100 text-emerald-800"
                : totalScore >= 60
                ? "bg-amber-100 text-amber-800"
                : "bg-red-100 text-red-800"
            )}
          >
            {totalScore}% Target Attainment
          </span>
        </div>
      </div>

      {/* ========================================================= */}
      {/* VIEW 1: 4 BASIC ACTION TARGET AND DAILY ACTION ENTRY     */}
      {/* ========================================================= */}
      {activeTab === "tracker" && (
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          {/* Today's 4 Basic Actions Form */}
          <Card className="p-6 border-slate-200 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Daily Method of Operation (DMO)
                </span>
                <h3 className="text-lg font-black text-brand-navy">
                  4 Basic Action Target and Daily Action
                </h3>
              </div>
              <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-bold text-brand-blue border border-cyan-200">
                🔥 7-Day Consistency Streak
              </span>
            </div>

            <form onSubmit={handleSaveTodayLog} className="space-y-5">
              {/* 1. Calling Time & Invitations */}
              <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                      <PhoneCall className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-brand-navy">1. Calling Time & Invitations</h4>
                      <p className="text-xs text-slate-500">Target: {targetCalls} calls/day</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setTodayCalls((p) => Math.max(0, p - 1))}
                      className="h-8 w-8 rounded-lg border border-slate-300 bg-white font-bold text-slate-700 hover:bg-slate-100"
                    >
                      -
                    </button>
                    <span className="font-mono text-base font-black w-8 text-center text-brand-navy">
                      {todayCalls}
                    </span>
                    <button
                      type="button"
                      onClick={() => setTodayCalls((p) => p + 1)}
                      className="h-8 w-8 rounded-lg border border-slate-300 bg-white font-bold text-slate-700 hover:bg-slate-100"
                    >
                      +
                    </button>
                    <span className="text-xs font-semibold text-slate-500 ml-1">calls</span>
                  </div>
                </div>

                <div className="mt-3">
                  <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                    <span>Progress vs Target</span>
                    <span className="font-bold text-emerald-700">{callScore}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
                    <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${callScore}%` }} />
                  </div>
                </div>
              </div>

              {/* 2. Presentation Time */}
              <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-100 text-brand-blue">
                      <Video className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-brand-navy">2. Presentation Time</h4>
                      <p className="text-xs text-slate-500">Target: {targetPres} business presentations</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setTodayPres((p) => Math.max(0, p - 1))}
                      className="h-8 w-8 rounded-lg border border-slate-300 bg-white font-bold text-slate-700 hover:bg-slate-100"
                    >
                      -
                    </button>
                    <span className="font-mono text-base font-black w-8 text-center text-brand-navy">
                      {todayPres}
                    </span>
                    <button
                      type="button"
                      onClick={() => setTodayPres((p) => p + 1)}
                      className="h-8 w-8 rounded-lg border border-slate-300 bg-white font-bold text-slate-700 hover:bg-slate-100"
                    >
                      +
                    </button>
                    <span className="text-xs font-semibold text-slate-500 ml-1">presentations</span>
                  </div>
                </div>

                <div className="mt-3">
                  <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                    <span>Progress vs Target</span>
                    <span className="font-bold text-brand-blue">{presScore}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
                    <div className="h-full bg-brand-blue rounded-full transition-all" style={{ width: `${presScore}%` }} />
                  </div>
                </div>
              </div>

              {/* 3. Training Time */}
              <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
                      <Clock className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-brand-navy">3. Training Time</h4>
                      <p className="text-xs text-slate-500">Target: {targetTraining} mins continuous</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setTodayTraining((p) => Math.max(0, p - 5))}
                      className="h-8 w-8 rounded-lg border border-slate-300 bg-white font-bold text-slate-700 hover:bg-slate-100"
                    >
                      -5
                    </button>
                    <span className="font-mono text-base font-black w-10 text-center text-brand-navy">
                      {todayTraining}
                    </span>
                    <button
                      type="button"
                      onClick={() => setTodayTraining((p) => p + 5)}
                      className="h-8 w-8 rounded-lg border border-slate-300 bg-white font-bold text-slate-700 hover:bg-slate-100"
                    >
                      +5
                    </button>
                    <span className="text-xs font-semibold text-slate-500 ml-1">mins</span>
                  </div>
                </div>

                <div className="mt-3">
                  <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                    <span>Progress vs Target</span>
                    <span className="font-bold text-amber-700">{trainScore}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
                    <div className="h-full bg-amber-500 rounded-full transition-all" style={{ width: `${trainScore}%` }} />
                  </div>
                </div>
              </div>

              {/* 4. Prospecting / Social Capital Added */}
              <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100 text-purple-700">
                      <Users className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-brand-navy">4. Prospecting (Name List Added)</h4>
                      <p className="text-xs text-slate-500">Target: {targetProspecting} new prospects</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setTodayProspecting((p) => Math.max(0, p - 1))}
                      className="h-8 w-8 rounded-lg border border-slate-300 bg-white font-bold text-slate-700 hover:bg-slate-100"
                    >
                      -
                    </button>
                    <span className="font-mono text-base font-black w-8 text-center text-brand-navy">
                      {todayProspecting}
                    </span>
                    <button
                      type="button"
                      onClick={() => setTodayProspecting((p) => p + 1)}
                      className="h-8 w-8 rounded-lg border border-slate-300 bg-white font-bold text-slate-700 hover:bg-slate-100"
                    >
                      +
                    </button>
                    <span className="text-xs font-semibold text-slate-500 ml-1">prospects</span>
                  </div>
                </div>

                <div className="mt-3">
                  <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                    <span>Progress vs Target</span>
                    <span className="font-bold text-purple-700">{prospScore}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
                    <div className="h-full bg-purple-500 rounded-full transition-all" style={{ width: `${prospScore}%` }} />
                  </div>
                </div>
              </div>

              {/* Daily Reflection Notes */}
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                  Daily Breakthrough Note / Reflection
                </label>
                <textarea
                  rows={2}
                  value={todayReflection}
                  onChange={(e) => setTodayReflection(e.target.value)}
                  placeholder="Key win, lesson learned, or candidate breakthrough today..."
                  className="w-full rounded-lg border border-slate-200 p-2.5 text-xs outline-none focus:border-brand-blue"
                />
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                {saveToast ? (
                  <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="h-4 w-4" /> Activity Log Saved Successfully!
                  </span>
                ) : (
                  <span className="text-xs text-slate-400">Recorded for Upline audit & analytics</span>
                )}

                <Button type="submit" className="brand-gradient font-bold text-brand-navy text-xs">
                  Save Today's Activity Log
                </Button>
              </div>
            </form>
          </Card>

          {/* Quick DMO Summary & Habits Card */}
          <div className="space-y-4">
            <Card className="p-5 border-slate-200 bg-white">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-black text-brand-navy uppercase tracking-wider">
                  Target Daily Activity KPI Scorecard
                </h4>
                <Trophy className="h-4 w-4 text-amber-500" />
              </div>

              <div className="rounded-xl border border-brand-cyan/40 bg-gradient-to-br from-cyan-50 to-white p-4 text-center">
                <span className="text-3xl font-black text-brand-navy">{totalScore}%</span>
                <p className="text-xs font-bold text-brand-blue mt-0.5">Execution Efficiency</p>
                <div className="mt-3 flex justify-center gap-1.5 text-[10px] font-bold">
                  <span className="rounded bg-emerald-100 text-emerald-800 px-2 py-0.5">
                    Calling: {todayCalls}/{targetCalls}
                  </span>
                  <span className="rounded bg-sky-100 text-sky-800 px-2 py-0.5">
                    Pres: {todayPres}/{targetPres}
                  </span>
                  <span className="rounded bg-amber-100 text-amber-800 px-2 py-0.5">
                    Training: {todayTraining}m
                  </span>
                </div>
              </div>

              <div className="mt-4 space-y-2 text-xs">
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-slate-600 font-medium">Weekly Consistency</span>
                  <span className="font-bold text-emerald-600">6 of 7 Days Met Target</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-slate-600 font-medium">Projected Monthly Recruits</span>
                  <span className="font-bold text-brand-navy">+18 New Downline IBOs</span>
                </div>
              </div>
            </Card>

            {/* Notification to Fill the Activity ⭐ */}
            <Card className="p-5 border-amber-300 bg-gradient-to-br from-amber-50/60 to-white">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-amber-600 fill-amber-400" />
                <h4 className="text-xs font-black text-brand-navy uppercase tracking-wider">
                  Notification to Fill Activity ⭐
                </h4>
              </div>
              <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                Automated evening prompt ensures downlines never forget to submit their daily numbers before bed.
              </p>
              <div className="mt-3 flex items-center justify-between border-t border-amber-200/60 pt-3">
                <span className="text-[11px] font-bold text-amber-800">Alert at: 21:00 (9:00 PM)</span>
                <button
                  onClick={() => handleTriggerScheduleAlert("fill")}
                  className="rounded-lg brand-gradient px-3 py-1.5 text-xs font-black text-brand-navy shadow-sm"
                >
                  Send Fill Reminder Now
                </button>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* VIEW 2: AS PER TARGET GIVE THEM GRAPH                    */}
      {/* ========================================================= */}
      {activeTab === "graph" && (
        <Card className="p-6 border-slate-200 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Visual Trend Analytics
              </span>
              <h3 className="text-lg font-black text-brand-navy">
                As Per Target Performance Graph (Last 7 Days)
              </h3>
            </div>
            <div className="flex items-center gap-3 text-xs font-bold">
              <span className="flex items-center gap-1.5 text-emerald-700">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Actual Calling vs Target
              </span>
              <span className="flex items-center gap-1.5 text-brand-blue">
                <span className="h-2.5 w-2.5 rounded-full bg-brand-blue" /> Actual Presentations vs Target
              </span>
            </div>
          </div>

          {/* Bar / Column Chart Visualizing Target vs Actual */}
          <div className="space-y-6">
            {/* 1. Calling Activity vs Target (10 calls baseline) */}
            <div>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-bold text-slate-700">1. Calling Time / Calls Made (Target: 10 calls/day)</span>
                <span className="font-semibold text-slate-500">Dashed line = Target (10)</span>
              </div>

              <div className="grid grid-cols-7 gap-2 items-end h-40 bg-slate-50 rounded-xl p-4 border border-slate-200 relative">
                {/* Horizontal Target Line at 10 */}
                <div className="absolute left-0 right-0 top-[35%] border-b border-dashed border-emerald-500/70 z-10 pointer-events-none">
                  <span className="absolute right-2 -top-4 text-[10px] font-bold text-emerald-700 bg-white px-1.5 py-0.2 rounded border border-emerald-200 shadow-sm">
                    Target: 10
                  </span>
                </div>

                {logs.map((log, i) => {
                  const calls = log.callingTime.actual;
                  const heightPct = Math.min(100, Math.round((calls / 16) * 100));
                  const isMet = calls >= targetCalls;

                  return (
                    <div key={i} className="flex flex-col items-center justify-end h-full relative z-0">
                      <span className="text-[10px] font-black text-brand-navy mb-1">{calls}</span>
                      <div
                        className={cn(
                          "w-full max-w-[36px] rounded-t-lg transition-all duration-500",
                          isMet ? "bg-emerald-500" : "bg-amber-400"
                        )}
                        style={{ height: `${heightPct}%` }}
                      />
                      <span className="text-[10px] font-bold text-slate-500 mt-2">{log.dayLabel}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 2. Presentations Completed vs Target (2 presentations baseline) */}
            <div>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-bold text-slate-700">2. Presentations Given vs Target (Target: 2/day)</span>
                <span className="font-semibold text-slate-500">Dashed line = Target (2)</span>
              </div>

              <div className="grid grid-cols-7 gap-2 items-end h-36 bg-slate-50 rounded-xl p-4 border border-slate-200 relative">
                {/* Horizontal Target Line at 2 */}
                <div className="absolute left-0 right-0 top-[33%] border-b border-dashed border-brand-blue/70 z-10 pointer-events-none">
                  <span className="absolute right-2 -top-4 text-[10px] font-bold text-brand-blue bg-white px-1.5 py-0.2 rounded border border-cyan-200 shadow-sm">
                    Target: 2
                  </span>
                </div>

                {logs.map((log, i) => {
                  const pres = log.presentationTime.actual;
                  const heightPct = Math.min(100, Math.round((pres / 3) * 100));
                  const isMet = pres >= targetPres;

                  return (
                    <div key={i} className="flex flex-col items-center justify-end h-full relative z-0">
                      <span className="text-[10px] font-black text-brand-navy mb-1">{pres}</span>
                      <div
                        className={cn(
                          "w-full max-w-[36px] rounded-t-lg transition-all duration-500",
                          isMet ? "brand-gradient" : "bg-slate-300"
                        )}
                        style={{ height: `${heightPct}%` }}
                      />
                      <span className="text-[10px] font-bold text-slate-500 mt-2">{log.dayLabel}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* ========================================================= */}
      {/* VIEW 3: SHOW THE RESULT FOR UPLINE                       */}
      {/* ========================================================= */}
      {activeTab === "upline-report" && (
        <Card className="p-6 border-slate-200 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Leadership Accountability Roster
              </span>
              <h3 className="text-lg font-black text-brand-navy">
                Show the Result for Upline Sponsor
              </h3>
            </div>

            <Button onClick={handleShareUplineScorecard} className="brand-gradient font-bold text-brand-navy text-xs">
              <Share2 className="mr-1.5 h-3.5 w-3.5" />
              {uplineCopied ? "Telegram Scorecard Copied!" : "Copy Report to Telegram / WhatsApp"}
            </Button>
          </div>

          {/* Formal Leadership Dossier Box */}
          <div id="daily-upline-dossier" className="rounded-2xl border-2 border-brand-cyan/30 bg-gradient-to-b from-slate-50 via-white to-slate-50 p-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full brand-gradient flex items-center justify-center font-bold text-brand-navy text-lg shadow">
                  MU
                </div>
                <div>
                  <h4 className="font-black text-base text-brand-navy">Valued Downline Member</h4>
                  <p className="text-xs text-slate-500">
                    Direct Sponsor: <strong>Dawit Wolde (Managing Director)</strong> • Tier: Level 1
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-800">
                  Daily Score: {totalScore}%
                </span>
                <p className="text-[10px] text-slate-400 mt-1">Verified June 24, 2026</p>
              </div>
            </div>

            {/* 4 Basic Action Results Table */}
            <div className="mt-5 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-200 bg-slate-100/70 uppercase text-[10px] font-black text-slate-500">
                  <tr>
                    <th className="py-2.5 px-3">Basic Action KPI</th>
                    <th className="py-2.5 px-3">Target</th>
                    <th className="py-2.5 px-3">Actual Executed</th>
                    <th className="py-2.5 px-3">Adherence %</th>
                    <th className="py-2.5 px-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="py-3 px-3 font-bold text-slate-800">1. Calling Time & Invitations</td>
                    <td className="py-3 px-3">{targetCalls} calls</td>
                    <td className="py-3 px-3 font-bold text-brand-navy">{todayCalls} calls</td>
                    <td className="py-3 px-3 font-bold text-emerald-600">{callScore}%</td>
                    <td className="py-3 px-3 text-right">
                      <span className="rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                        {callScore >= 100 ? "Goal Met" : "In Progress"}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-bold text-slate-800">2. Presentation Time</td>
                    <td className="py-3 px-3">{targetPres} overviews</td>
                    <td className="py-3 px-3 font-bold text-brand-navy">{todayPres} overviews</td>
                    <td className="py-3 px-3 font-bold text-emerald-600">{presScore}%</td>
                    <td className="py-3 px-3 text-right">
                      <span className="rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                        Goal Met
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-bold text-slate-800">3. Training Time (Continuous)</td>
                    <td className="py-3 px-3">{targetTraining} mins</td>
                    <td className="py-3 px-3 font-bold text-brand-navy">{todayTraining} mins</td>
                    <td className="py-3 px-3 font-bold text-amber-600">{trainScore}%</td>
                    <td className="py-3 px-3 text-right">
                      <span className="rounded bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700">
                        Near Target
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-bold text-slate-800">4. Prospecting (Social Capital)</td>
                    <td className="py-3 px-3">{targetProspecting} names</td>
                    <td className="py-3 px-3 font-bold text-brand-navy">{todayProspecting} names</td>
                    <td className="py-3 px-3 font-bold text-purple-600">{prospScore}%</td>
                    <td className="py-3 px-3 text-right">
                      <span className="rounded bg-purple-50 px-2 py-0.5 text-[10px] font-bold text-purple-700">
                        Active
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Reflection Quote */}
            <div className="mt-4 rounded-xl bg-slate-50 p-3.5 border border-slate-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Daily Breakthrough Note for Sponsor:
              </span>
              <p className="mt-1 text-xs text-slate-700 italic">"{todayReflection}"</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
