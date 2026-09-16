"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Bell,
  Check,
  Copy,
  Heart,
  Quote,
  RefreshCw,
  Send,
  Share2,
  Sparkles,
  Volume2,
  VolumeX,
  Plus,
  Edit3,
  Trash2,
  Users,
  User,
  Shield,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Globe,
  Tag,
  Download,
  Printer,
  Calendar,
  Layers,
  Languages,
  X,
  Repeat
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { exportToCsv, printSection } from "@/lib/export-utils";

export type MotivationCategory =
  | "Leadership"
  | "Perseverance"
  | "Vision"
  | "Teamwork"
  | "Action"
  | "Duplication"
  | "Mindset";

export type MotivationTargetType = "ALL" | "TEAM" | "RANK" | "SINGLE";

export interface MotivationItem {
  id: string;
  title: string;
  quote: string;
  author: string;
  authorRole: string;
  category: MotivationCategory;
  amharicTranslation?: string;
  mediaUrl?: string;
  targetType: MotivationTargetType;
  targetTeam?: string;
  targetRank?: string;
  targetUserId?: string;
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

const PRESET_TEAMS = [
  "Diamond Leadership Council",
  "Addis Pioneers Squad",
  "Hawassa Eagle Squad",
  "Bahir Dar Champions",
  "Trainers Faculty",
  "Fast-Track 48h Launch Cohort"
];

const PRESET_RANKS = [
  "Diamond",
  "Gold",
  "Silver",
  "Bronze",
  "Team Leader",
  "Trainer"
];

const PRESET_MEMBERS = [
  { id: "usr-3cb71f3c", name: "Abebe Bikila", role: "Diamond Leader", email: "abebe.test@myupline.org" },
  { id: "usr-dawit-01", name: "Coach Dawit Mengistu", role: "Crown Diamond Trainer", email: "dawit.coach@myupline.org" },
  { id: "usr-selam-02", name: "Selamawit Tadesse", role: "Senior Sales Director", email: "selamawit.sales@myupline.org" },
  { id: "usr-kassa-03", name: "Kassahun Bekele", role: "Operations Lead", email: "kassahun.sys@myupline.org" },
  { id: "usr-hiwot-04", name: "Hiwot Girma", role: "Crown Diamond", email: "hiwot.diamond@myupline.org" },
  { id: "usr-bini-05", name: "Biniyam Tesfaye", role: "Senior Trainer", email: "biniyam.trainer@myupline.org" }
];

const PRESET_AUTHORS = [
  { author: "Simon Sinek", role: "Global Leadership Author" },
  { author: "Zig Ziglar", role: "Master Sales Strategist" },
  { author: "Jim Rohn", role: "Personal Development Mentor" },
  { author: "Eric Worre", role: "Go Pro Network Authority" },
  { author: "John C. Maxwell", role: "Leadership Authority" },
  { author: "Coach Dawit Mengistu", role: "Crown Diamond Master Trainer" },
  { author: "Super Admin", role: "Master Upline Command" }
];

export function MotivationalQuotesWidget({
  onOpenAi,
  isSuperAdmin = false,
  fullStudio = false
}: {
  onOpenAi?: (prompt: string) => void;
  isSuperAdmin?: boolean;
  fullStudio?: boolean;
}) {
  const [motivations, setMotivations] = useState<MotivationItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [notificationToast, setNotificationToast] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});
  const [showAmharic, setShowAmharic] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState<"ALL" | "BULK" | "TEAM" | "SINGLE" | "SCHEDULED">("ALL");

  // Admin Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MotivationItem | null>(null);

  // Form State
  const [formTitle, setFormTitle] = useState("");
  const [formQuote, setFormQuote] = useState("");
  const [formAuthor, setFormAuthor] = useState("");
  const [formAuthorRole, setFormAuthorRole] = useState("");
  const [formCategory, setFormCategory] = useState<MotivationCategory>("Leadership");
  const [formAmharic, setFormAmharic] = useState("");
  const [formTargetType, setFormTargetType] = useState<MotivationTargetType>("ALL");
  const [formTargetTeam, setFormTargetTeam] = useState(PRESET_TEAMS[0]);
  const [formTargetRank, setFormTargetRank] = useState(PRESET_RANKS[0]);
  const [formTargetUserId, setFormTargetUserId] = useState(PRESET_MEMBERS[0].id);
  const [formDeliveryChannel, setFormDeliveryChannel] = useState<"DASHBOARD" | "SMS_SIMULATED" | "IN_APP_POPUP" | "ALL">("ALL");
  const [formStatus, setFormStatus] = useState<"SENT" | "SCHEDULED" | "DRAFT">("SENT");
  const [formScheduledDate, setFormScheduledDate] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Load motivations from backend
  const fetchMotivations = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/motivations");
      if (res.ok) {
        const json = await res.json();
        if (json.data?.motivations && json.data.motivations.length > 0) {
          setMotivations(json.data.motivations);
        }
      }
    } catch (err) {
      console.error("Failed to load motivations:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMotivations();
  }, [fetchMotivations]);

  const activeQuote = motivations[currentIndex] || {
    id: "default-1",
    title: "Leadership Standard",
    quote: "Leadership is not about being in charge. It is about taking care of those in your charge.",
    author: "Simon Sinek",
    authorRole: "Leadership Author",
    category: "Leadership" as MotivationCategory,
    targetType: "ALL" as MotivationTargetType,
    deliveryChannel: "ALL" as const,
    status: "SENT" as const,
    sentBy: "Super Admin",
    likesCount: 342,
    recipientsCount: 12480,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  // Next quote
  function handleNextQuote() {
    if (motivations.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % motivations.length);
    setShowAmharic(false);
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    }
  }

  // Audio speech
  function handlePlaySpeech() {
    if (!("speechSynthesis" in window)) return;

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    window.speechSynthesis.cancel();
    const textToSpeak = showAmharic && activeQuote.amharicTranslation
      ? activeQuote.amharicTranslation
      : `"${activeQuote.quote}" — by ${activeQuote.author}`;

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    setIsPlayingAudio(true);
    window.speechSynthesis.speak(utterance);
  }

  // Like Quote
  async function handleLike() {
    const qId = activeQuote.id;
    if (likedMap[qId]) return;

    setLikedMap((prev) => ({ ...prev, [qId]: true }));
    setMotivations((prev) =>
      prev.map((item) =>
        item.id === qId ? { ...item, likesCount: (item.likesCount || 0) + 1 } : item
      )
    );

    try {
      await fetch("/api/motivations/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: qId })
      });
    } catch {
      // silent
    }
  }

  // Copy Quote
  function handleCopy() {
    const text = `"${activeQuote.quote}"\n— ${activeQuote.author} (${activeQuote.authorRole || "Upline Mentor"})${
      activeQuote.amharicTranslation ? `\n\n[አማርኛ]: ${activeQuote.amharicTranslation}` : ""
    }\n\nDaily Motivation from MyUpline 🌟`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  // Toggle Notifications
  function handleToggleNotifications() {
    const nextState = !notificationsEnabled;
    setNotificationsEnabled(nextState);
    if (nextState) {
      setNotificationToast("Daily 8:00 AM Motivation alerts scheduled successfully!");
      setTimeout(() => setNotificationToast(null), 4000);
    } else {
      setNotificationToast("Daily motivation notifications paused.");
      setTimeout(() => setNotificationToast(null), 3000);
    }
  }

  // Open Create Modal
  function handleOpenCreate() {
    setEditingItem(null);
    setFormTitle("");
    setFormQuote("");
    setFormAuthor("Super Admin");
    setFormAuthorRole("Master Upline Command");
    setFormCategory("Leadership");
    setFormAmharic("");
    setFormTargetType("ALL");
    setFormTargetTeam(PRESET_TEAMS[0]);
    setFormTargetRank(PRESET_RANKS[0]);
    setFormTargetUserId(PRESET_MEMBERS[0].id);
    setFormDeliveryChannel("ALL");
    setFormStatus("SENT");
    setFormScheduledDate("");
    setIsModalOpen(true);
  }

  // Open Edit Modal
  function handleOpenEdit(item: MotivationItem) {
    setEditingItem(item);
    setFormTitle(item.title);
    setFormQuote(item.quote);
    setFormAuthor(item.author);
    setFormAuthorRole(item.authorRole || "");
    setFormCategory(item.category);
    setFormAmharic(item.amharicTranslation || "");
    setFormTargetType(item.targetType);
    setFormTargetTeam(item.targetTeam || PRESET_TEAMS[0]);
    setFormTargetRank(item.targetRank || PRESET_RANKS[0]);
    setFormTargetUserId(item.targetUserId || PRESET_MEMBERS[0].id);
    setFormDeliveryChannel(item.deliveryChannel);
    setFormStatus(item.status);
    setFormScheduledDate(item.scheduledFor || "");
    setIsModalOpen(true);
  }

  // Save (Create or Update)
  async function handleSaveMotivation() {
    if (!formQuote.trim() || !formAuthor.trim()) {
      alert("Please provide quote content and author name.");
      return;
    }

    setIsSaving(true);

    const targetUser = PRESET_MEMBERS.find((m) => m.id === formTargetUserId);

    const payload = {
      title: formTitle.trim() || `${formCategory} Focus`,
      quote: formQuote.trim(),
      author: formAuthor.trim(),
      authorRole: formAuthorRole.trim() || "Leadership Mentor",
      category: formCategory,
      amharicTranslation: formAmharic.trim() || undefined,
      targetType: formTargetType,
      targetTeam: formTargetType === "TEAM" ? formTargetTeam : undefined,
      targetRank: formTargetType === "RANK" ? formTargetRank : undefined,
      targetUserId: formTargetType === "SINGLE" ? formTargetUserId : undefined,
      targetUserName: formTargetType === "SINGLE" ? targetUser?.name : undefined,
      deliveryChannel: formDeliveryChannel,
      status: formStatus,
      scheduledFor: formStatus === "SCHEDULED" ? formScheduledDate : undefined,
      sentBy: "Super Admin"
    };

    try {
      if (editingItem) {
        // Update
        const res = await fetch("/api/motivations", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingItem.id, ...payload })
        });
        if (res.ok) {
          const json = await res.json();
          setMotivations((prev) =>
            prev.map((m) => (m.id === editingItem.id ? json.data.motivation : m))
          );
          setIsModalOpen(false);
          setNotificationToast("Motivation updated successfully!");
          setTimeout(() => setNotificationToast(null), 3000);
        }
      } else {
        // Create
        const res = await fetch("/api/motivations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          const json = await res.json();
          setMotivations((prev) => [json.data.motivation, ...prev]);
          setIsModalOpen(false);
          const targetMsg =
            formTargetType === "ALL"
              ? "Broadcasted in Bulk to all 12,480+ Network Members!"
              : formTargetType === "TEAM"
              ? `Dispatched to team: ${formTargetTeam}!`
              : formTargetType === "RANK"
              ? `Sent to all ${formTargetRank} rank members!`
              : `Dispatched personal motivation to ${targetUser?.name}!`;

          setNotificationToast(`Success! ${targetMsg}`);
          setTimeout(() => setNotificationToast(null), 4000);
        }
      }
    } catch (err) {
      alert("Failed to save motivation: " + String(err));
    } finally {
      setIsSaving(false);
    }
  }

  // Delete
  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this motivation?")) return;
    try {
      const res = await fetch(`/api/motivations?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setMotivations((prev) => prev.filter((m) => m.id !== id));
        setNotificationToast("Motivation removed.");
        setTimeout(() => setNotificationToast(null), 3000);
      }
    } catch {
      alert("Failed to delete motivation.");
    }
  }

  // Send Now (for scheduled/draft)
  async function handleSendNow(id: string) {
    try {
      const res = await fetch("/api/motivations", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action: "sendNow" })
      });
      if (res.ok) {
        const json = await res.json();
        setMotivations((prev) =>
          prev.map((m) => (m.id === id ? json.data.motivation : m))
        );
        setNotificationToast("Motivation dispatched instantly to recipients!");
        setTimeout(() => setNotificationToast(null), 3500);
      }
    } catch {
      alert("Failed to dispatch motivation.");
    }
  }

  // Duplicate & Resend
  function handleDuplicate(item: MotivationItem) {
    setEditingItem(null);
    setFormTitle(`${item.title} (Re-broadcast)`);
    setFormQuote(item.quote);
    setFormAuthor(item.author);
    setFormAuthorRole(item.authorRole);
    setFormCategory(item.category);
    setFormAmharic(item.amharicTranslation || "");
    setFormTargetType(item.targetType);
    setFormTargetTeam(item.targetTeam || PRESET_TEAMS[0]);
    setFormTargetRank(item.targetRank || PRESET_RANKS[0]);
    setFormTargetUserId(item.targetUserId || PRESET_MEMBERS[0].id);
    setFormDeliveryChannel(item.deliveryChannel);
    setFormStatus("SENT");
    setFormScheduledDate("");
    setIsModalOpen(true);
  }

  // Filtered list for table
  const filteredMotivations = useMemo(() => {
    return motivations.filter((m) => {
      if (activeFilter === "BULK") return m.targetType === "ALL";
      if (activeFilter === "TEAM") return m.targetType === "TEAM" || m.targetType === "RANK";
      if (activeFilter === "SINGLE") return m.targetType === "SINGLE";
      if (activeFilter === "SCHEDULED") return m.status === "SCHEDULED" || m.status === "DRAFT";
      return true;
    });
  }, [motivations, activeFilter]);

  // Cleanup speech
  useEffect(() => {
    return () => {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Compute Target Badge
  function getTargetBadge(item: MotivationItem) {
    if (item.targetType === "ALL") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 border border-blue-200 px-2.5 py-0.5 text-xs font-bold text-blue-700">
          <Globe className="h-3 w-3" />
          In Bulk ({item.recipientsCount ? item.recipientsCount.toLocaleString() : "12,480"} IBOs)
        </span>
      );
    }
    if (item.targetType === "TEAM") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 border border-purple-200 px-2.5 py-0.5 text-xs font-bold text-purple-700">
          <Users className="h-3 w-3" />
          Team: {item.targetTeam || "Exclusive Cohort"}
        </span>
      );
    }
    if (item.targetType === "RANK") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200 px-2.5 py-0.5 text-xs font-bold text-amber-700">
          <Shield className="h-3 w-3" />
          Rank: {item.targetRank}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-xs font-bold text-emerald-700">
        <User className="h-3 w-3" />
        Single: {item.targetUserName || "Direct Member"}
      </span>
    );
  }

  return (
    <div className="space-y-5">
      {/* Toast Alert */}
      {notificationToast && (
        <div className="flex items-center justify-between rounded-xl border border-brand-cyan/40 bg-brand-navy p-3.5 text-xs text-white shadow-lg animate-in fade-in">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-brand-cyan animate-bounce" />
            <span className="font-semibold">{notificationToast}</span>
          </div>
          <button
            onClick={() => setNotificationToast(null)}
            className="text-white/60 hover:text-white text-xs font-bold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* ────────────────────────────────────────────────────────── */}
      {/* 1. TOP LIVE MOTIVATION CARD (Always Shown on Overview & Studio) */}
      {/* ────────────────────────────────────────────────────────── */}
      <Card className="overflow-hidden border-slate-200 shadow-md">
        {/* Header Ribbon */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-slate-50/90 px-5 py-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600">
              <Quote className="h-4 w-4" />
            </span>
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-brand-navy">
                Daily Motivational Broadcast
              </span>
              <span className="ml-2 rounded-full bg-brand-cyan/15 px-2 py-0.5 text-[10px] font-bold text-brand-navy">
                {activeQuote.category}
              </span>
            </div>
            {getTargetBadge(activeQuote)}
          </div>

          <div className="flex items-center gap-2">
            {/* Amharic Toggle */}
            {activeQuote.amharicTranslation && (
              <button
                onClick={() => setShowAmharic(!showAmharic)}
                className={cn(
                  "inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-xs font-bold transition",
                  showAmharic
                    ? "border-amber-400 bg-amber-50 text-amber-800"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                )}
                title="Toggle Amharic translation"
              >
                <Languages className="h-3 w-3" />
                {showAmharic ? "English" : "አማርኛ"}
              </button>
            )}

            {/* Notification Toggle */}
            <button
              onClick={handleToggleNotifications}
              title={notificationsEnabled ? "Notification active" : "Enable notifications"}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-semibold transition",
                notificationsEnabled
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                  : "border-slate-200 bg-white text-slate-500"
              )}
            >
              <Bell className="h-3 w-3" />
              {notificationsEnabled ? "8:00 AM Active" : "Muted"}
            </button>

            {/* Audio Listen */}
            <button
              onClick={handlePlaySpeech}
              title="Listen to motivational quote"
              className={cn(
                "inline-flex h-7 w-7 items-center justify-center rounded-lg border transition",
                isPlayingAudio
                  ? "border-brand-blue bg-cyan-100 text-brand-blue animate-pulse"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
              )}
            >
              {isPlayingAudio ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
            </button>

            {/* Next Quote */}
            <button
              onClick={handleNextQuote}
              title="Next motivation"
              className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
            >
              <RefreshCw className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 bg-gradient-to-br from-white to-slate-50/50">
          <blockquote className="relative">
            <span className="font-serif text-5xl font-black text-slate-200 select-none absolute -top-5 -left-3 pointer-events-none">
              “
            </span>
            <p className="relative z-10 text-base sm:text-lg font-semibold leading-relaxed text-slate-800 italic">
              {showAmharic && activeQuote.amharicTranslation
                ? activeQuote.amharicTranslation
                : activeQuote.quote}
            </p>
          </blockquote>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-4">
            <div>
              <p className="text-sm font-black text-brand-navy">{activeQuote.author}</p>
              <p className="text-xs text-slate-500">{activeQuote.authorRole || "Leadership Mentor"}</p>
              {activeQuote.sentAt && (
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Dispatched: {new Date(activeQuote.sentAt).toLocaleDateString()} by {activeQuote.sentBy}
                </p>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleLike}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition",
                  likedMap[activeQuote.id]
                    ? "border-rose-200 bg-rose-50 text-rose-600 font-bold"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                )}
              >
                <Heart className={cn("h-3.5 w-3.5", likedMap[activeQuote.id] && "fill-rose-500 text-rose-500")} />
                {activeQuote.likesCount + (likedMap[activeQuote.id] ? 1 : 0)}
              </button>

              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? "Copied" : "Copy"}
              </button>

              <button
                onClick={() =>
                  onOpenAi?.(
                    `Give me a powerful 2-minute motivational speech for my downline team based on this quote: "${activeQuote.quote}" by ${activeQuote.author}.`
                  )
                }
                className="inline-flex items-center gap-1.5 rounded-lg brand-gradient px-3 py-1.5 text-xs font-black text-brand-navy shadow-sm transition hover:brightness-105"
              >
                <Sparkles className="h-3.5 w-3.5" />
                AI Team Pep Talk
              </button>

              {isSuperAdmin && (
                <Button
                  variant="ghost"
                  onClick={() => handleOpenEdit(activeQuote)}
                  className="border border-slate-200 bg-white text-xs font-bold"
                >
                  <Edit3 className="mr-1 h-3.5 w-3.5 text-slate-600" />
                  Edit Quote
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* ────────────────────────────────────────────────────────── */}
      {/* 2. SUPER ADMIN MOTIVATION COMMAND STUDIO (CRUD & DISPATCH) */}
      {/* ────────────────────────────────────────────────────────── */}
      {isSuperAdmin && (
        <div className="space-y-5">
          {/* Top Metric Cards */}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="p-4 border-slate-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">Total Motivations</span>
                <Quote className="h-4 w-4 text-brand-blue" />
              </div>
              <p className="mt-2 text-2xl font-black text-brand-navy">{motivations.length}</p>
              <p className="mt-1 text-[11px] text-emerald-600 font-semibold">
                {motivations.filter((m) => m.status === "SENT").length} Dispatched live
              </p>
            </Card>

            <Card className="p-4 border-slate-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">In Bulk Broadcasts</span>
                <Globe className="h-4 w-4 text-cyan-600" />
              </div>
              <p className="mt-2 text-2xl font-black text-brand-navy">
                {motivations.filter((m) => m.targetType === "ALL").length}
              </p>
              <p className="mt-1 text-[11px] text-slate-500">12,480+ network members</p>
            </Card>

            <Card className="p-4 border-slate-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">Team / Rank Targeted</span>
                <Users className="h-4 w-4 text-purple-600" />
              </div>
              <p className="mt-2 text-2xl font-black text-brand-navy">
                {motivations.filter((m) => m.targetType === "TEAM" || m.targetType === "RANK").length}
              </p>
              <p className="mt-1 text-[11px] text-slate-500">Targeted squad cohorts</p>
            </Card>

            <Card className="p-4 border-slate-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">Single Member Direct</span>
                <User className="h-4 w-4 text-emerald-600" />
              </div>
              <p className="mt-2 text-2xl font-black text-brand-navy">
                {motivations.filter((m) => m.targetType === "SINGLE").length}
              </p>
              <p className="mt-1 text-[11px] text-slate-500">One-on-one upline boosts</p>
            </Card>
          </div>

          {/* Action Toolbar & Filters */}
          <Card className="p-5 border-slate-200 shadow-sm" id="motivation-manager-printable">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-black text-brand-navy flex items-center gap-2">
                  <Send className="h-5 w-5 text-brand-blue" />
                  Motivation Dispatch Studio
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Send high-octane inspiration in bulk to the full network, target specific teams, or send direct 1-on-1 member boosts.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Button
                  variant="ghost"
                  onClick={() => printSection("motivation-manager-printable", "Daily Motivation Broadcast Directory")}
                  className="border border-slate-200 bg-white text-xs font-bold"
                >
                  <Printer className="mr-1.5 h-3.5 w-3.5 text-slate-600" />
                  Print Roster
                </Button>

                <Button
                  variant="ghost"
                  onClick={() => {
                    const rows = motivations.map((m) => ({
                      Title: m.title,
                      Quote: m.quote,
                      Author: m.author,
                      Category: m.category,
                      TargetType: m.targetType,
                      TargetDetail: m.targetTeam || m.targetRank || m.targetUserName || "All Members",
                      Status: m.status,
                      Likes: m.likesCount,
                      Date: m.sentAt || m.createdAt
                    }));
                    exportToCsv("Daily_Motivations_Master_Log", rows);
                  }}
                  className="border border-slate-200 bg-white text-xs font-bold"
                >
                  <Download className="mr-1.5 h-3.5 w-3.5 text-slate-600" />
                  Export CSV
                </Button>

                <Button
                  onClick={handleOpenCreate}
                  className="brand-gradient text-brand-navy text-xs font-black shadow-md hover:brightness-105"
                >
                  <Plus className="mr-1.5 h-4 w-4" />
                  Broadcast New Motivation
                </Button>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3 mb-4">
              {[
                { id: "ALL", label: "All Dispatches" },
                { id: "BULK", label: "🌐 In Bulk (All Network)" },
                { id: "TEAM", label: "👥 In Team / Rank" },
                { id: "SINGLE", label: "👤 Single Members" },
                { id: "SCHEDULED", label: "⏰ Scheduled / Drafts" }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveFilter(tab.id as typeof activeFilter)}
                  className={cn(
                    "rounded-lg px-3 py-1.5 text-xs font-bold transition",
                    activeFilter === tab.id
                      ? "brand-gradient text-brand-navy shadow-sm"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Motivations Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-black uppercase tracking-wider text-slate-500">
                    <th className="py-3 px-3">Title & Quote</th>
                    <th className="py-3 px-3">Author</th>
                    <th className="py-3 px-3">Category</th>
                    <th className="py-3 px-3">Target Audience</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3">Likes</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredMotivations.map((m) => (
                    <tr key={m.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3 px-3 max-w-xs">
                        <p className="font-bold text-brand-navy truncate">{m.title}</p>
                        <p className="text-slate-500 line-clamp-1 italic mt-0.5">"{m.quote}"</p>
                        {m.amharicTranslation && (
                          <span className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded mt-1 inline-block">
                            አማርኛ ተካቷል
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <p className="font-semibold text-slate-800">{m.author}</p>
                        <p className="text-[10px] text-slate-400">{m.authorRole || "Mentor"}</p>
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-700">
                          {m.category}
                        </span>
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        {getTargetBadge(m)}
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        {m.status === "SENT" ? (
                          <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold text-[10px]">
                            <CheckCircle2 className="h-3 w-3" /> Dispatched
                          </span>
                        ) : m.status === "SCHEDULED" ? (
                          <span className="inline-flex items-center gap-1 text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full font-bold text-[10px]">
                            <Clock className="h-3 w-3" /> Scheduled
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full font-bold text-[10px]">
                            Draft
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap font-bold text-rose-600">
                        ❤️ {m.likesCount || 0}
                      </td>
                      <td className="py-3 px-3 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {m.status !== "SENT" && (
                            <button
                              onClick={() => handleSendNow(m.id)}
                              title="Dispatch Now"
                              className="rounded bg-emerald-100 p-1 text-emerald-700 hover:bg-emerald-200 transition"
                            >
                              <Send className="h-3.5 w-3.5" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDuplicate(m)}
                            title="Re-broadcast / Duplicate"
                            className="rounded bg-blue-50 p-1 text-blue-600 hover:bg-blue-100 transition"
                          >
                            <Repeat className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleOpenEdit(m)}
                            title="Edit"
                            className="rounded bg-slate-100 p-1 text-slate-700 hover:bg-slate-200 transition"
                          >
                            <Edit3 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(m.id)}
                            title="Delete"
                            className="rounded bg-rose-50 p-1 text-rose-600 hover:bg-rose-100 transition"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {filteredMotivations.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-400">
                        No motivations found in this category. Click <strong>"Broadcast New Motivation"</strong> to create one.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* ────────────────────────────────────────────────────────── */}
      {/* 3. MODAL: BROADCAST / CRUD DAILY MOTIVATION */}
      {/* ────────────────────────────────────────────────────────── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-cyan/20 text-brand-navy">
                  <Send className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-black text-brand-navy">
                    {editingItem ? "Edit Daily Motivation" : "Broadcast Daily Motivation"}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Configure inspiration message and target audience (Bulk, Team, or Single Member)
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="mt-5 space-y-4 text-xs">
              {/* TARGET AUDIENCE SELECTOR (CRITICAL USER REQUIREMENT) */}
              <div className="rounded-xl border border-brand-cyan/30 bg-cyan-50/40 p-4">
                <label className="block font-black text-brand-navy mb-2">
                  🎯 Target Audience Dispatch Mode
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormTargetType("ALL")}
                    className={cn(
                      "flex flex-col items-center gap-1.5 rounded-xl border p-3 text-center transition",
                      formTargetType === "ALL"
                        ? "border-brand-blue bg-white shadow-md text-brand-navy font-black"
                        : "border-slate-200 bg-white/60 text-slate-600 hover:bg-white"
                    )}
                  >
                    <Globe className="h-5 w-5 text-brand-blue" />
                    <span className="text-xs">In Bulk (All Members)</span>
                    <span className="text-[10px] text-slate-400">12,480+ Network</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormTargetType("TEAM")}
                    className={cn(
                      "flex flex-col items-center gap-1.5 rounded-xl border p-3 text-center transition",
                      formTargetType === "TEAM" || formTargetType === "RANK"
                        ? "border-purple-600 bg-white shadow-md text-purple-900 font-black"
                        : "border-slate-200 bg-white/60 text-slate-600 hover:bg-white"
                    )}
                  >
                    <Users className="h-5 w-5 text-purple-600" />
                    <span className="text-xs">In Team / Rank</span>
                    <span className="text-[10px] text-slate-400">Target Squad</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormTargetType("SINGLE")}
                    className={cn(
                      "flex flex-col items-center gap-1.5 rounded-xl border p-3 text-center transition",
                      formTargetType === "SINGLE"
                        ? "border-emerald-600 bg-white shadow-md text-emerald-900 font-black"
                        : "border-slate-200 bg-white/60 text-slate-600 hover:bg-white"
                    )}
                  >
                    <User className="h-5 w-5 text-emerald-600" />
                    <span className="text-xs">Single Member</span>
                    <span className="text-[10px] text-slate-400">Direct Upline Boost</span>
                  </button>
                </div>

                {/* Sub-selectors based on target type */}
                {formTargetType === "TEAM" && (
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Select Specific Team Cohort</label>
                      <select
                        value={formTargetTeam}
                        onChange={(e) => setFormTargetTeam(e.target.value)}
                        className="w-full rounded-lg border border-slate-200 bg-white p-2 text-xs font-semibold text-slate-800"
                      >
                        {PRESET_TEAMS.map((t) => (
                          <option key={t} value={t}>
                            👥 {t}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Or Filter by Package Rank</label>
                      <select
                        value={formTargetRank}
                        onChange={(e) => {
                          setFormTargetRank(e.target.value);
                          setFormTargetType("RANK");
                        }}
                        className="w-full rounded-lg border border-slate-200 bg-white p-2 text-xs font-semibold text-slate-800"
                      >
                        {PRESET_RANKS.map((r) => (
                          <option key={r} value={r}>
                            ⭐ All {r} Rank Members
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                {formTargetType === "SINGLE" && (
                  <div className="mt-3">
                    <label className="block font-bold text-slate-700 mb-1">Select Individual Member Recipient</label>
                    <select
                      value={formTargetUserId}
                      onChange={(e) => setFormTargetUserId(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-white p-2 text-xs font-semibold text-slate-800"
                    >
                      {PRESET_MEMBERS.map((m) => (
                        <option key={m.id} value={m.id}>
                          👤 {m.name} — {m.role} ({m.email})
                        </option>
                      ))}
                    </select>
                    <p className="mt-1 text-[11px] text-slate-500">
                      This inspiration will appear as a personalized priority message on their dashboard.
                    </p>
                  </div>
                )}
              </div>

              {/* Title & Category */}
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Broadcast Title</label>
                  <input
                    type="text"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="e.g. Master Your 4-Basics Today"
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-800 focus:border-brand-cyan outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as MotivationCategory)}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-xs font-semibold text-slate-800"
                  >
                    <option value="Leadership">Leadership</option>
                    <option value="Action">Action & Prospecting</option>
                    <option value="Duplication">Duplication Architecture</option>
                    <option value="Perseverance">Perseverance & Resilience</option>
                    <option value="Vision">Vision & Goals</option>
                    <option value="Teamwork">Teamwork & Culture</option>
                    <option value="Mindset">Mindset Transformation</option>
                  </select>
                </div>
              </div>

              {/* Quote Content */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Motivational Quote / Message Content <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={formQuote}
                  onChange={(e) => setFormQuote(e.target.value)}
                  placeholder="Write an impactful, empowering quote or direct upline charge..."
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-800 focus:border-brand-cyan outline-none resize-none"
                />
              </div>

              {/* Author and Role + Presets */}
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Author Name <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={formAuthor}
                    onChange={(e) => setFormAuthor(e.target.value)}
                    placeholder="e.g. Jim Rohn, Coach Dawit, Super Admin"
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs text-slate-800 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Author Title / Role</label>
                  <input
                    type="text"
                    value={formAuthorRole}
                    onChange={(e) => setFormAuthorRole(e.target.value)}
                    placeholder="e.g. Master Upline Coach"
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs text-slate-800 outline-none"
                  />
                </div>
              </div>

              {/* Author Quick Pick */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] font-bold text-slate-400">Quick Fill:</span>
                {PRESET_AUTHORS.map((p) => (
                  <button
                    key={p.author}
                    type="button"
                    onClick={() => {
                      setFormAuthor(p.author);
                      setFormAuthorRole(p.role);
                    }}
                    className="rounded bg-slate-100 hover:bg-slate-200 px-2 py-0.5 text-[10px] font-semibold text-slate-600 transition"
                  >
                    {p.author}
                  </button>
                ))}
              </div>

              {/* Amharic Translation (Optional) */}
              <div>
                <label className="block font-bold text-slate-700 mb-1 flex items-center justify-between">
                  <span>አማርኛ ትርጉም (Amharic Translation - Optional)</span>
                  <span className="text-[10px] text-slate-400">Bilingual broadcast</span>
                </label>
                <textarea
                  rows={2}
                  value={formAmharic}
                  onChange={(e) => setFormAmharic(e.target.value)}
                  placeholder="የተነሳሽነት ጥቅስ ትርጉም እዚህ ያስገቡ..."
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-800 focus:border-amber-400 outline-none resize-none"
                />
              </div>

              {/* Delivery Channel & Dispatch Status */}
              <div className="grid gap-3 sm:grid-cols-2 rounded-xl border border-slate-200 p-3 bg-slate-50/60">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Delivery Channel</label>
                  <select
                    value={formDeliveryChannel}
                    onChange={(e) => setFormDeliveryChannel(e.target.value as typeof formDeliveryChannel)}
                    className="w-full rounded-lg border border-slate-200 bg-white p-2 text-xs font-semibold text-slate-800"
                  >
                    <option value="ALL">All Channels (Banner + Modal)</option>
                    <option value="DASHBOARD">Dashboard Banner Only</option>
                    <option value="IN_APP_POPUP">Immediate In-App Popup</option>
                    <option value="SMS_SIMULATED">Simulated SMS Alert</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Dispatch Schedule</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as typeof formStatus)}
                    className="w-full rounded-lg border border-slate-200 bg-white p-2 text-xs font-semibold text-slate-800"
                  >
                    <option value="SENT">🚀 Send Now Instantly</option>
                    <option value="SCHEDULED">⏰ Schedule for 8:00 AM</option>
                    <option value="DRAFT">📁 Save as Draft</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="mt-6 flex items-center justify-end gap-2.5 border-t border-slate-200 pt-4">
              <Button
                variant="ghost"
                onClick={() => setIsModalOpen(false)}
                className="text-xs font-bold text-slate-600"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveMotivation}
                disabled={isSaving}
                className="brand-gradient text-brand-navy text-xs font-black shadow-md hover:brightness-105"
              >
                {isSaving ? "Dispatching..." : editingItem ? "Save Changes" : "Confirm & Dispatch"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
