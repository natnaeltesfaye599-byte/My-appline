"use client";

import { useState, useRef } from "react";
import {
  Award,
  Check,
  Copy,
  Crown,
  Download,
  Flame,
  Image as ImageIcon,
  Share2,
  Sparkles,
  Star,
  Trophy,
  Upload,
  UserCheck,
  Send,
  Zap
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { printSection } from "@/lib/export-utils";

export type PromoType = "new-rank" | "top-recruiter" | "performance";

interface PromoTemplateConfig {
  id: PromoType;
  title: string;
  badge: string;
  defaultHeadline: string;
  defaultSubheadline: string;
  icon: typeof Trophy;
  accentGradient: string;
}

const templates: PromoTemplateConfig[] = [
  {
    id: "new-rank",
    title: "NEW Rank Promotion",
    badge: "RANK ADVANCEMENT",
    defaultHeadline: "CONGRATULATIONS!",
    defaultSubheadline: "OFFICIALLY PROMOTED TO DIAMOND LEADER",
    icon: Crown,
    accentGradient: "from-amber-400 via-yellow-300 to-amber-500"
  },
  {
    id: "top-recruiter",
    title: "TOP Recruiter of Month",
    badge: "MONTHLY RECRUITER CHAMPION",
    defaultHeadline: "TOP RECRUITER OF THE MONTH",
    defaultSubheadline: "38 NEW MEMBERS RECRUITED IN JUNE 2026",
    icon: Trophy,
    accentGradient: "from-cyan-400 via-teal-300 to-emerald-400"
  },
  {
    id: "performance",
    title: "Performance Milestone",
    badge: "EXCELLENCE IN EXECUTION",
    defaultHeadline: "OUTSTANDING PERFORMANCE",
    defaultSubheadline: "OVER ETB 350,000 IN GROUP VOLUME GENERATED",
    icon: Star,
    accentGradient: "from-fuchsia-400 via-purple-300 to-indigo-400"
  }
];

const sampleAvatars = [
  { id: "1", name: "Almaz Tadesse", url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80" },
  { id: "2", name: "Biniam Haile", url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80" },
  { id: "3", name: "Selamawit Bekele", url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80" },
  { id: "4", name: "Yonas Mekonnen", url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80" }
];

export function PromotionalStudio({ onOpenAi }: { onOpenAi?: (prompt: string) => void }) {
  const [selectedType, setSelectedType] = useState<PromoType>("new-rank");
  const [memberName, setMemberName] = useState("Almaz Tadesse");
  const [rankOrAward, setRankOrAward] = useState("Diamond Director");
  const [achievementStat, setAchievementStat] = useState("38 Recruits • ETB 350k GV");
  const [teamName, setTeamName] = useState("Vision Leaders Network");
  const [dateStr, setDateStr] = useState("June 2026");
  const [photoUrl, setPhotoUrl] = useState(sampleAvatars[0].url);
  const [themeStyle, setThemeStyle] = useState<"midnight" | "royal" | "emerald" | "crimson">("midnight");
  const [copied, setCopied] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeTemplate = templates.find((t) => t.id === selectedType) ?? templates[0];

  function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPhotoUrl(url);
    }
  }

  function handleCopyShareText() {
    const text = `🎉 CELEBRATING EXCELLENCE AT MYUPLINE! 🎉\n\nBig Congratulations to ${memberName} for achieving ${rankOrAward} (${achievementStat})!\nTeam: ${teamName}\nDate: ${dateStr}\n\nKeep inspiring the network! 🚀 #MyUpline #Success #Leadership`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  function handleShareTelegram() {
    const text = `🎉 CELEBRATING EXCELLENCE AT MYUPLINE! 🎉\n\nBig Congratulations to ${memberName} for achieving ${rankOrAward} (${achievementStat})!\nTeam: ${teamName}\nDate: ${dateStr}\n\nKeep inspiring the network! 🚀 #MyUpline #Success #Leadership`;
    const url = `https://t.me/share/url?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  }

  function handleDownloadFlyer() {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
    printSection("promotional-flyer-print-card", `${memberName || "Member"} Recognition Flyer`);
  }

  const themeClasses = {
    midnight: "from-[#050c1f] via-[#091738] to-[#020714] text-white border-amber-500/30",
    royal: "from-[#03153f] via-[#0b2866] to-[#01091d] text-white border-cyan-400/30",
    emerald: "from-[#042019] via-[#063b2f] to-[#02140f] text-white border-emerald-400/30",
    crimson: "from-[#29040e] via-[#4d091b] to-[#170208] text-white border-rose-400/30"
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-gradient-to-r from-brand-navy via-brand-deep to-[#1a3668] p-6 text-white shadow-xl no-print">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-400/10 px-3 py-1 text-xs font-semibold text-amber-300">
            <Sparkles className="h-3.5 w-3.5" />
            Social Recognition Studio
          </div>
          <h2 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">
            Promotional Photo Studio
          </h2>
          <p className="mt-1 text-sm text-white/75">
            Instantly generate stunning recognition flyers for New Ranks, Top Recruiters, and Star Performers to share on social media and Telegram.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            onClick={() =>
              onOpenAi?.(
                `Write a high-energy, exciting recognition announcement for ${memberName}, celebrating their ${rankOrAward} achievement on team ${teamName}. Include emojis and hashtags for Telegram.`
              )
            }
            className="brand-gradient font-bold text-brand-navy shadow-lg"
          >
            <Sparkles className="mr-2 h-4 w-4" />
            AI Write Shoutout
          </Button>
        </div>
      </div>

      {/* Template Selector Tabs */}
      <div className="grid gap-3 sm:grid-cols-3 no-print">
        {templates.map((tpl) => {
          const Icon = tpl.icon;
          const isSelected = selectedType === tpl.id;
          return (
            <button
              key={tpl.id}
              onClick={() => {
                setSelectedType(tpl.id);
                if (tpl.id === "new-rank") {
                  setRankOrAward("Diamond Director");
                  setAchievementStat("Rank Advancement Achieved");
                } else if (tpl.id === "top-recruiter") {
                  setRankOrAward("Top Recruiter Champion");
                  setAchievementStat("38 Recruits This Month");
                } else {
                  setRankOrAward("Peak Performance Star");
                  setAchievementStat("ETB 350k Volume • 100% Retention");
                }
              }}
              className={cn(
                "flex items-center gap-3.5 rounded-xl border p-4 text-left transition-all duration-200",
                isSelected
                  ? "border-brand-blue bg-cyan-50/50 shadow-md ring-2 ring-brand-blue/20"
                  : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
              )}
            >
              <div
                className={cn(
                  "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl font-bold shadow",
                  isSelected ? "bg-brand-navy text-brand-cyan" : "bg-slate-100 text-slate-700"
                )}
              >
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  {tpl.badge}
                </p>
                <p className="font-black text-brand-navy text-sm sm:text-base">{tpl.title}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Studio Workspace: Controls (Left) & Live Flyer Preview (Right) */}
      <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
        {/* Editor Controls */}
        <Card className="p-6 border-slate-200 space-y-5 no-print">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-brand-navy">Flyer Customization Details</h3>
            <p className="text-xs text-slate-500">Edit member photo, rank title, and stats to preview in real-time</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">
                Member Full Name
              </label>
              <input
                value={memberName}
                onChange={(e) => setMemberName(e.target.value)}
                placeholder="e.g. Almaz Tadesse"
                className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-brand-blue"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">
                Rank or Award Title
              </label>
              <input
                value={rankOrAward}
                onChange={(e) => setRankOrAward(e.target.value)}
                placeholder="e.g. Diamond Leader / Recruiter of the Month"
                className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-brand-blue"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">
                Key Achievement Stat
              </label>
              <input
                value={achievementStat}
                onChange={(e) => setAchievementStat(e.target.value)}
                placeholder="e.g. 38 Recruits • ETB 350k Volume"
                className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-brand-blue"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">Team Name</label>
                <input
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-brand-blue"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">Date / Month</label>
                <input
                  value={dateStr}
                  onChange={(e) => setDateStr(e.target.value)}
                  className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-brand-blue"
                />
              </div>
            </div>

            {/* Member Photo Selection */}
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-2">
                Member Photo
              </label>
              <div className="flex items-center gap-3">
                <div className="flex gap-2">
                  {sampleAvatars.map((av) => (
                    <img
                      key={av.id}
                      src={av.url}
                      alt={av.name}
                      onClick={() => {
                        setPhotoUrl(av.url);
                        setMemberName(av.name);
                      }}
                      className={cn(
                        "h-11 w-11 cursor-pointer rounded-full object-cover ring-2 transition hover:scale-105",
                        photoUrl === av.url ? "ring-brand-blue scale-105" : "ring-transparent opacity-75 hover:opacity-100"
                      )}
                    />
                  ))}
                </div>

                <div className="h-8 w-[1px] bg-slate-200 mx-1" />

                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => fileInputRef.current?.click()}
                  className="h-10 text-xs border border-slate-200 bg-white"
                >
                  <Upload className="mr-1.5 h-3.5 w-3.5" />
                  Upload Photo
                </Button>
              </div>
            </div>

            {/* Theme Gradient Chooser */}
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-2">
                Color Aesthetic
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: "midnight", label: "Midnight Gold", color: "bg-slate-900 border-amber-400" },
                  { id: "royal", label: "Royal Blue", color: "bg-blue-900 border-cyan-400" },
                  { id: "emerald", label: "Cyber Emerald", color: "bg-teal-950 border-emerald-400" },
                  { id: "crimson", label: "Ruby Crimson", color: "bg-rose-950 border-rose-400" }
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setThemeStyle(t.id as typeof themeStyle)}
                    className={cn(
                      "flex flex-col items-center gap-1 rounded-lg border p-2 text-xs font-semibold transition",
                      themeStyle === t.id
                        ? "border-brand-blue bg-cyan-50/50 text-brand-navy font-bold ring-1 ring-brand-blue"
                        : "border-slate-200 hover:bg-slate-50 text-slate-600"
                    )}
                  >
                    <span className={cn("h-4 w-4 rounded-full border shadow-sm", t.color)} />
                    <span className="text-[10px] truncate max-w-full">{t.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-3 border-t border-slate-100">
            <Button onClick={handleCopyShareText} variant="secondary" className="border-slate-200 text-slate-800">
              {copied ? <Check className="mr-2 h-4 w-4 text-emerald-600" /> : <Copy className="mr-2 h-4 w-4" />}
              {copied ? "Caption Copied!" : "Copy Telegram Caption"}
            </Button>
            <Button onClick={handleShareTelegram} className="bg-[#229ED9] hover:bg-[#1b8ec4] text-white font-bold shadow-sm">
              <Send className="mr-2 h-4 w-4" />
              Send to Telegram
            </Button>
            <Button onClick={handleDownloadFlyer} className="brand-gradient text-brand-navy font-bold">
              <Download className="mr-2 h-4 w-4" />
              {downloadSuccess ? "Preparing Print/Download..." : "Export Flyer Graphic"}
            </Button>
          </div>
        </Card>

        {/* Live High-Res Flyer Preview */}
        <div className="flex flex-col items-center">
          <div id="promotional-flyer-print-card" className="w-full max-w-[460px] overflow-hidden rounded-3xl border-4 shadow-2xl transition-all duration-300 relative bg-gradient-to-b p-7 text-center select-none aspect-[4/5] flex flex-col justify-between"
            style={{
              backgroundImage:
                themeStyle === "midnight"
                  ? "radial-gradient(circle at 50% 25%, #182a52 0%, #060c1d 85%)"
                  : themeStyle === "royal"
                  ? "radial-gradient(circle at 50% 25%, #123d8c 0%, #03153f 85%)"
                  : themeStyle === "emerald"
                  ? "radial-gradient(circle at 50% 25%, #0a4f3e 0%, #021a14 85%)"
                  : "radial-gradient(circle at 50% 25%, #590f23 0%, #1c0309 85%)"
            }}
          >
            {/* Border Accents */}
            <div className="absolute inset-2.5 rounded-[22px] border border-white/15 pointer-events-none" />
            <div className="absolute inset-3.5 rounded-[18px] border border-amber-300/20 pointer-events-none" />

            {/* Top Brand & Badge */}
            <div className="relative z-10 pt-2">
              <div className="flex items-center justify-between px-2">
                <span className="text-[11px] font-black tracking-widest text-amber-300 uppercase">MYUPLINE</span>
                <span className="text-[10px] font-semibold text-white/60 uppercase tracking-widest">{dateStr}</span>
              </div>

              <div className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-amber-300/40 bg-amber-400/10 px-4 py-1 text-xs font-black tracking-wider text-amber-300 uppercase shadow-inner">
                {selectedType === "new-rank" && <Crown className="h-3.5 w-3.5 text-amber-300" />}
                {selectedType === "top-recruiter" && <Trophy className="h-3.5 w-3.5 text-cyan-300" />}
                {selectedType === "performance" && <Star className="h-3.5 w-3.5 text-yellow-300" />}
                {activeTemplate.badge}
              </div>

              <h2 className="mt-2.5 text-2xl sm:text-3xl font-black uppercase tracking-tight text-white drop-shadow-md">
                {activeTemplate.defaultHeadline}
              </h2>
            </div>

            {/* Center: Photo Circle with Luxury Metallic Glow Ring */}
            <div className="relative z-10 my-auto flex flex-col items-center">
              <div className="relative">
                {/* Glow ring */}
                <div className="absolute -inset-2.5 rounded-full brand-gradient opacity-80 blur-md" />
                <div className="relative h-36 w-36 sm:h-44 sm:w-44 overflow-hidden rounded-full border-4 border-amber-300 shadow-2xl bg-slate-800">
                  <img
                    src={photoUrl}
                    alt={memberName}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-2 -right-1 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 p-2 shadow-lg border-2 border-white">
                  {selectedType === "new-rank" && <Crown className="h-4 w-4 text-brand-navy" />}
                  {selectedType === "top-recruiter" && <Flame className="h-4 w-4 text-brand-navy" />}
                  {selectedType === "performance" && <Zap className="h-4 w-4 text-brand-navy" />}
                </div>
              </div>

              {/* Name & Rank */}
              <h3 className="mt-4 text-xl sm:text-2xl font-black tracking-tight text-white drop-shadow">
                {memberName}
              </h3>
              <div className="mt-1 rounded-md bg-white/10 px-3 py-1 backdrop-blur border border-white/10">
                <p className="text-xs sm:text-sm font-bold text-amber-300 uppercase tracking-wide">
                  {rankOrAward}
                </p>
              </div>
            </div>

            {/* Bottom: Stat & Team Footer */}
            <div className="relative z-10 pb-2">
              <div className="rounded-xl border border-white/15 bg-white/5 p-2.5 backdrop-blur">
                <p className="text-xs font-black uppercase tracking-wider text-cyan-300">
                  {achievementStat}
                </p>
                <p className="mt-0.5 text-[11px] text-white/70">
                  {teamName}
                </p>
              </div>

              <div className="mt-3 flex items-center justify-between px-3 text-[10px] text-white/50">
                <span>Verified Achievement</span>
                <span>myupline.com</span>
              </div>
            </div>
          </div>

          <p className="mt-3 text-xs text-slate-500 text-center">
            Ready to share. Works natively with Telegram channel & WhatsApp story exports.
          </p>
        </div>
      </div>
    </div>
  );
}
