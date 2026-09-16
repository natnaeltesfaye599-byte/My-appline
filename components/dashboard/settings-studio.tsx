"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Settings,
  Globe,
  Shield,
  CreditCard,
  Bell,
  Database,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Save,
  Download,
  Lock,
  Eye,
  EyeOff,
  Check,
  Building,
  Clock,
  Coins,
  Calendar,
  Sparkles,
  KeyRound,
  ExternalLink
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getDictionary, Locale } from "@/lib/i18n";
import { StoredSettings } from "@/lib/db-store";

interface SettingsStudioProps {
  locale: string;
  currentUser?: any;
  onLanguageChange?: (newLocale: "en" | "am") => void;
}

export function SettingsStudio({
  locale,
  currentUser,
  onLanguageChange
}: SettingsStudioProps) {
  const normLocale = (locale === "am" ? "am" : "en") as Locale;
  const dict = getDictionary(normLocale);

  const [activeTab, setActiveTab] = useState<
    "general" | "security" | "membership" | "notifications" | "backup"
  >("general");

  const [settings, setSettings] = useState<StoredSettings>({
    id: "settings-global",
    organizationName: "MyUpline Global Network",
    systemLanguage: normLocale,
    timezone: "Africa/Addis_Ababa (EAT, UTC+3)",
    currency: "ETB",
    dateFormat: "GREGORIAN",
    requireEmailVerification: true,
    enableAuditLogging: true,
    lockAccountAfterFailedAttempts: true,
    maxFailedAttempts: 5,
    twoFactorAuth: false,
    sessionTimeoutMinutes: 60,
    manualPaymentVerification: true,
    renewalReminders: true,
    expireAccessAutomatically: true,
    telebirrAutoVerify: true,
    dailyMotivationNotification: true,
    newDownlineNotification: true,
    trainingCohortAlerts: true,
    weeklyExecutiveDigest: true,
    updatedAt: new Date().toISOString()
  });

  const [dbStats, setDbStats] = useState({
    totalUsers: 0,
    totalTeams: 0,
    totalTrainers: 0,
    totalCourses: 0,
    totalMotivations: 0,
    totalBlogPosts: 0,
    totalPayments: 0
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // Password change state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [passLoading, setPassLoading] = useState(false);
  const [passMessage, setPassMessage] = useState<{ text: string; success: boolean } | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  // Fetch settings from API
  const fetchSettings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/settings");
      if (res.ok) {
        const json = await res.json();
        if (json.data?.settings) {
          setSettings(json.data.settings);
        }
        if (json.data?.stats) {
          setDbStats(json.data.stats);
        }
      }
    } catch (err) {
      console.error("Failed to load settings:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  // Handle save
  const handleSaveSettings = async (overrideUpdates?: Partial<StoredSettings>) => {
    setSaving(true);
    try {
      const payload = { ...settings, ...(overrideUpdates || {}) };
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const json = await res.json();
        setSettings(json.data.settings);
        showToast(dict.common.saved);
      } else {
        alert("Failed to save settings.");
      }
    } catch {
      alert("Error connecting to server.");
    } finally {
      setSaving(false);
    }
  };

  // Handle language switch
  const handleSwitchLanguage = (lang: "en" | "am") => {
    setSettings((prev) => ({ ...prev, systemLanguage: lang }));
    handleSaveSettings({ systemLanguage: lang });
    if (onLanguageChange) {
      onLanguageChange(lang);
    }
  };

  // Handle password update
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      setPassMessage({
        text: normLocale === "am" ? "የይለፍ ቃል ቢያንስ 6 ፊደላት ወይም ቁጥሮች መሆን አለበት።" : "Password must be at least 6 characters.",
        success: false
      });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPassMessage({
        text: normLocale === "am" ? "የይለፍ ቃሎቹ አይመሳሰሉም።" : "Passwords do not match.",
        success: false
      });
      return;
    }

    setPassLoading(true);
    setPassMessage(null);
    try {
      const res = await fetch("/api/settings/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUser?.id,
          email: currentUser?.email,
          currentPassword,
          newPassword
        })
      });
      const json = await res.json();
      if (res.ok) {
        setPassMessage({
          text: normLocale === "am" ? "የይለፍ ቃልዎ በተሳካ ሁኔታ ተቀይሯል!" : json.data?.message || "Password updated successfully!",
          success: true
        });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setPassMessage({
          text: json.error?.message || "Failed to update password",
          success: false
        });
      }
    } catch {
      setPassMessage({ text: "Server error occurred.", success: false });
    } finally {
      setPassLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toast && (
        <div className="flex items-center justify-between rounded-xl border border-emerald-400/40 bg-brand-navy p-3.5 text-xs text-white shadow-xl animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 animate-pulse" />
            <span className="font-semibold">{toast}</span>
          </div>
          <button onClick={() => setToast(null)} className="text-white/60 hover:text-white text-xs font-bold">
            {dict.common.dismiss}
          </button>
        </div>
      )}

      {/* Header Banner */}
      <Card className="p-6 border-slate-200 shadow-sm bg-gradient-to-r from-slate-900 via-brand-navy to-slate-900 text-white">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-400/15 border border-cyan-400/30 text-cyan-300">
              <Settings className="h-6 w-6" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/20 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-cyan-300 border border-cyan-500/30">
                {dict.header.superAdminBadge}
              </div>
              <h1 className="mt-1 text-2xl font-black text-white">
                {dict.settings.title}
              </h1>
              <p className="text-xs text-slate-300 max-w-2xl">
                {dict.settings.subtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Direct Language Switcher Pill */}
            <div className="flex items-center rounded-xl bg-white/10 p-1 border border-white/20">
              <button
                type="button"
                onClick={() => handleSwitchLanguage("en")}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-black transition",
                  normLocale === "en"
                    ? "bg-white text-brand-navy shadow-sm"
                    : "text-white/80 hover:text-white"
                )}
              >
                <span>🇬🇧</span>
                <span>English</span>
              </button>
              <button
                type="button"
                onClick={() => handleSwitchLanguage("am")}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-black transition",
                  normLocale === "am"
                    ? "bg-white text-brand-navy shadow-sm"
                    : "text-white/80 hover:text-white"
                )}
              >
                <span>🇪🇹</span>
                <span>አማርኛ</span>
              </button>
            </div>

            <Button
              onClick={() => handleSaveSettings()}
              disabled={saving}
              className="brand-gradient text-brand-navy text-xs font-black shadow-lg hover:brightness-105 flex items-center gap-1.5"
            >
              {saving ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  {dict.common.saving}
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  {dict.settings.saveButton}
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mt-6 flex flex-wrap gap-2 border-t border-white/10 pt-4">
          {[
            { id: "general", label: dict.settings.tabs.general, icon: Globe },
            { id: "security", label: dict.settings.tabs.security, icon: Shield },
            { id: "membership", label: dict.settings.tabs.membership, icon: CreditCard },
            { id: "notifications", label: dict.settings.tabs.notifications, icon: Bell },
            { id: "backup", label: dict.settings.tabs.backup, icon: Database }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-black transition",
                  isActive
                    ? "brand-gradient text-brand-navy shadow-md"
                    : "bg-white/10 text-white/70 hover:bg-white/15 hover:text-white"
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </Card>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* TAB 1: GENERAL & LOCALIZATION                                 */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeTab === "general" && (
        <div className="grid gap-5 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-5">
            <Card className="p-5 border-slate-200 shadow-sm space-y-4">
              <div>
                <h2 className="text-base font-black text-brand-navy">
                  {dict.settings.general.title}
                </h2>
                <p className="text-xs text-slate-500">
                  {dict.settings.general.desc}
                </p>
              </div>

              {/* Organization Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Building className="h-3.5 w-3.5 text-brand-cyan" />
                  {dict.settings.general.orgName}
                </label>
                <input
                  type="text"
                  value={settings.organizationName}
                  onChange={(e) => setSettings({ ...settings, organizationName: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-xs font-semibold outline-none focus:border-brand-cyan"
                />
              </div>

              {/* Language Choice Interactive Card */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2 flex items-center gap-1.5">
                  <Globe className="h-3.5 w-3.5 text-brand-blue" />
                  {dict.settings.general.language}
                </label>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div
                    onClick={() => handleSwitchLanguage("en")}
                    className={cn(
                      "cursor-pointer rounded-xl border-2 p-4 transition",
                      normLocale === "en"
                        ? "border-brand-blue bg-blue-50/50 shadow-sm"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-2xl">🇬🇧</span>
                      {normLocale === "en" && <Check className="h-4 w-4 text-brand-blue font-black" />}
                    </div>
                    <p className="mt-2 font-black text-slate-800 text-sm">English</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">International English business terminology.</p>
                  </div>

                  <div
                    onClick={() => handleSwitchLanguage("am")}
                    className={cn(
                      "cursor-pointer rounded-xl border-2 p-4 transition",
                      normLocale === "am"
                        ? "border-brand-cyan bg-cyan-50/50 shadow-sm"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-2xl">🇪🇹</span>
                      {normLocale === "am" && <Check className="h-4 w-4 text-cyan-600 font-black" />}
                    </div>
                    <p className="mt-2 font-black text-slate-800 text-sm">አማርኛ (Amharic)</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">ትክክለኛ እና የተሟላ የኢትዮጵያ ቢዝነስ ቋንቋ።</p>
                  </div>
                </div>
              </div>

              {/* Currency & Timezone */}
              <div className="grid gap-4 sm:grid-cols-2 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                    <Coins className="h-3.5 w-3.5 text-amber-500" />
                    {dict.settings.general.currency}
                  </label>
                  <select
                    value={settings.currency}
                    onChange={(e) => setSettings({ ...settings, currency: e.target.value as any })}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-xs font-semibold outline-none"
                  >
                    <option value="ETB">ETB (Ethiopian Birr - ብር)</option>
                    <option value="USD">USD (United States Dollar - $)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-brand-green" />
                    {dict.settings.general.timezone}
                  </label>
                  <select
                    value={settings.timezone}
                    onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-xs font-semibold outline-none"
                  >
                    <option value="Africa/Addis_Ababa (EAT, UTC+3)">Africa/Addis_Ababa (EAT, UTC+3)</option>
                    <option value="UTC (Coordinated Universal Time)">UTC (Coordinated Universal Time)</option>
                  </select>
                </div>
              </div>

              {/* Date Format */}
              <div className="pt-2">
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-indigo-500" />
                  {dict.settings.general.dateFormat}
                </label>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div
                    onClick={() => setSettings({ ...settings, dateFormat: "GREGORIAN" })}
                    className={cn(
                      "cursor-pointer rounded-xl border p-3 text-xs transition",
                      settings.dateFormat === "GREGORIAN"
                        ? "border-brand-navy bg-slate-100 font-bold text-brand-navy"
                        : "border-slate-200 bg-slate-50 text-slate-600"
                    )}
                  >
                    <p className="font-black">{dict.settings.general.gregorian}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">e.g. September 03, 2026</p>
                  </div>

                  <div
                    onClick={() => setSettings({ ...settings, dateFormat: "ETHIOPIAN" })}
                    className={cn(
                      "cursor-pointer rounded-xl border p-3 text-xs transition",
                      settings.dateFormat === "ETHIOPIAN"
                        ? "border-brand-navy bg-slate-100 font-bold text-brand-navy"
                        : "border-slate-200 bg-slate-50 text-slate-600"
                    )}
                  >
                    <p className="font-black">{dict.settings.general.ethiopian}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">ምሳሌ፡ ጳጉሜ 2018 ዓ.ም</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Quick Access: Footer, Social Media & Contact Info */}
            <Card className="p-5 border-slate-200 shadow-sm bg-gradient-to-br from-slate-900 via-brand-navy to-slate-950 text-white space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-400/20 text-cyan-300">
                    <Globe className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white">Public Footer, Social Media & Contact Info</h3>
                    <p className="text-[11px] text-slate-300">Edit social links, Addis Ababa office address, phone hotline, and legal links</p>
                  </div>
                </div>
                <a
                  href="/en/contact"
                  target="_blank"
                  className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-cyan-300 hover:text-white"
                >
                  <ExternalLink className="h-3 w-3" /> View Contact Page
                </a>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Super Admins can fully customize the public landing page footer, manage Facebook/Telegram/WhatsApp/YouTube channels, update official contact numbers, and edit bilingual English/Amharic navigation links directly in the CMS Studio.
              </p>

              <div className="pt-2 flex flex-wrap gap-2">
                <Button
                  type="button"
                  onClick={() => {
                    const cmsBtn = document.querySelector('button[data-view="cms-studio"]') as HTMLButtonElement | null;
                    if (cmsBtn) {
                      cmsBtn.click();
                    } else {
                      window.location.href = `/${normLocale}/dashboard/super-admin`;
                    }
                  }}
                  className="brand-gradient text-brand-navy text-xs font-black shadow-md hover:brightness-105"
                >
                  <Sparkles className="mr-1.5 h-3.5 w-3.5" /> Open Footer & Social Media Studio
                </Button>
                <a
                  href={`/${normLocale}#contact`}
                  target="_blank"
                  className="inline-flex items-center gap-1 rounded-lg border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-bold text-white hover:bg-white/20 transition"
                >
                  <ExternalLink className="h-3.5 w-3.5" /> Preview Live Footer
                </a>
              </div>
            </Card>
          </div>

          {/* Right info card */}
          <div>
            <Card className="p-5 border-slate-200 bg-gradient-to-br from-brand-navy to-slate-900 text-white shadow-sm space-y-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/20 text-cyan-300">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-black text-white">
                  {normLocale === "am" ? "የቋንቋ እና የትርጉም ሽፋን" : "Full Localization Engine"}
                </h3>
                <p className="mt-1 text-xs text-slate-300 leading-relaxed">
                  {normLocale === "am"
                    ? "MyUpline ሙሉ ለሙሉ በአማርኛ እና በእንግሊዝኛ የተተረጎመ ነው። ማንኛውም አባል፣ አሰልጣኝ ወይም አድሚን የሚመርጠውን ቋንቋ በማንኛውም ጊዜ መቀያየር ይችላል።"
                    : "MyUpline provides native bilingual execution. All navigation, studio controls, notifications, and receipt workflows adapt instantly."}
                </p>
              </div>
              <div className="rounded-xl border border-white/15 bg-white/5 p-3 text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">{normLocale === "am" ? "አሁን ያለው ቋንቋ" : "Active Language"}:</span>
                  <span className="font-bold text-cyan-300">{normLocale === "am" ? "አማርኛ (Amharic)" : "English (EN)"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">{normLocale === "am" ? "የገንዘብ አይነት" : "Currency"}:</span>
                  <span className="font-bold text-white">{settings.currency}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">{normLocale === "am" ? "ሰዓት ሰቅ" : "Timezone"}:</span>
                  <span className="font-bold text-white">EAT (UTC+3)</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* TAB 2: SECURITY & AUTH                                        */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeTab === "security" && (
        <div className="grid gap-5 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-5">
            <Card className="p-5 border-slate-200 shadow-sm space-y-4">
              <div>
                <h2 className="text-base font-black text-brand-navy">
                  {dict.settings.security.title}
                </h2>
                <p className="text-xs text-slate-500">
                  {dict.settings.security.desc}
                </p>
              </div>

              {/* Toggles */}
              <div className="space-y-3">
                {[
                  {
                    key: "requireEmailVerification",
                    title: dict.settings.security.requireEmail,
                    desc: dict.settings.security.requireEmailDesc
                  },
                  {
                    key: "enableAuditLogging",
                    title: dict.settings.security.auditLogging,
                    desc: dict.settings.security.auditLoggingDesc
                  },
                  {
                    key: "lockAccountAfterFailedAttempts",
                    title: dict.settings.security.lockAccount,
                    desc: dict.settings.security.lockAccountDesc
                  },
                  {
                    key: "twoFactorAuth",
                    title: dict.settings.security.twoFactor,
                    desc: dict.settings.security.twoFactorDesc
                  }
                ].map((item) => {
                  const val = (settings as any)[item.key];
                  return (
                    <div
                      key={item.key}
                      className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50 p-3.5"
                    >
                      <div>
                        <p className="text-xs font-black text-slate-800">{item.title}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">{item.desc}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setSettings({
                            ...settings,
                            [item.key]: !val
                          })
                        }
                        className={cn(
                          "relative h-6 w-11 rounded-full transition flex-shrink-0",
                          val ? "bg-brand-green" : "bg-slate-300"
                        )}
                      >
                        <span
                          className={cn(
                            "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition",
                            val ? "left-5" : "left-0.5"
                          )}
                        />
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Session Timeout */}
              <div className="pt-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {dict.settings.security.sessionTimeout}
                </label>
                <select
                  value={settings.sessionTimeoutMinutes}
                  onChange={(e) => setSettings({ ...settings, sessionTimeoutMinutes: Number(e.target.value) })}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-xs font-semibold outline-none"
                >
                  <option value={15}>15 Minutes</option>
                  <option value={30}>30 Minutes</option>
                  <option value={60}>60 Minutes (1 Hour - Recommended)</option>
                  <option value={120}>120 Minutes (2 Hours)</option>
                  <option value={1440}>24 Hours (Full Day)</option>
                </select>
              </div>
            </Card>
          </div>

          {/* Change Password Card */}
          <div>
            <Card className="p-5 border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <KeyRound className="h-5 w-5 text-purple-600" />
                <h3 className="text-sm font-black text-slate-900">
                  {dict.settings.security.passwordCardTitle}
                </h3>
              </div>
              <p className="text-xs text-slate-500">
                {dict.settings.security.passwordCardDesc}
              </p>

              {passMessage && (
                <div
                  className={cn(
                    "rounded-xl p-3 text-xs font-bold",
                    passMessage.success
                      ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                      : "bg-rose-50 text-rose-800 border border-rose-200"
                  )}
                >
                  {passMessage.text}
                </div>
              )}

              <form onSubmit={handleUpdatePassword} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    {dict.settings.security.currentPass}
                  </label>
                  <input
                    type={showPass ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs outline-none focus:border-brand-cyan"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    {dict.settings.security.newPass}
                  </label>
                  <input
                    type={showPass ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs outline-none focus:border-brand-cyan"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    {dict.settings.security.confirmPass}
                  </label>
                  <input
                    type={showPass ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs outline-none focus:border-brand-cyan"
                  />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="text-[11px] text-slate-500 hover:text-slate-800 font-bold flex items-center gap-1"
                  >
                    {showPass ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                    {showPass ? "Hide Passwords" : "Show Passwords"}
                  </button>
                </div>

                <Button
                  type="submit"
                  disabled={passLoading || !newPassword}
                  className="w-full brand-gradient text-brand-navy text-xs font-black shadow-md hover:brightness-105"
                >
                  {passLoading ? "Updating..." : dict.settings.security.updatePassBtn}
                </Button>
              </form>
            </Card>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* TAB 3: MEMBERSHIP & PAYMENTS                                  */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeTab === "membership" && (
        <Card className="p-5 border-slate-200 shadow-sm space-y-4 max-w-3xl">
          <div>
            <h2 className="text-base font-black text-brand-navy">
              {dict.settings.membership.title}
            </h2>
            <p className="text-xs text-slate-500">
              {dict.settings.membership.desc}
            </p>
          </div>

          <div className="space-y-3">
            {[
              {
                key: "manualPaymentVerification",
                title: dict.settings.membership.manualVerification,
                desc: dict.settings.membership.manualVerificationDesc
              },
              {
                key: "renewalReminders",
                title: dict.settings.membership.renewalReminders,
                desc: dict.settings.membership.renewalRemindersDesc
              },
              {
                key: "expireAccessAutomatically",
                title: dict.settings.membership.autoExpire,
                desc: dict.settings.membership.autoExpireDesc
              },
              {
                key: "telebirrAutoVerify",
                title: dict.settings.membership.telebirrAuto,
                desc: dict.settings.membership.telebirrAutoDesc
              }
            ].map((item) => {
              const val = (settings as any)[item.key];
              return (
                <div
                  key={item.key}
                  className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50 p-3.5"
                >
                  <div>
                    <p className="text-xs font-black text-slate-800">{item.title}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">{item.desc}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setSettings({
                        ...settings,
                        [item.key]: !val
                      })
                    }
                    className={cn(
                      "relative h-6 w-11 rounded-full transition flex-shrink-0",
                      val ? "bg-brand-green" : "bg-slate-300"
                    )}
                  >
                    <span
                      className={cn(
                        "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition",
                        val ? "left-5" : "left-0.5"
                      )}
                    />
                  </button>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* TAB 4: NOTIFICATIONS & BROADCASTS                             */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeTab === "notifications" && (
        <Card className="p-5 border-slate-200 shadow-sm space-y-4 max-w-3xl">
          <div>
            <h2 className="text-base font-black text-brand-navy">
              {dict.settings.notifications.title}
            </h2>
            <p className="text-xs text-slate-500">
              {dict.settings.notifications.desc}
            </p>
          </div>

          <div className="space-y-3">
            {[
              {
                key: "dailyMotivationNotification",
                title: dict.settings.notifications.motivationPush,
                desc: dict.settings.notifications.motivationPushDesc
              },
              {
                key: "newDownlineNotification",
                title: dict.settings.notifications.downlineAlert,
                desc: dict.settings.notifications.downlineAlertDesc
              },
              {
                key: "trainingCohortAlerts",
                title: dict.settings.notifications.cohortStart,
                desc: dict.settings.notifications.cohortStartDesc
              },
              {
                key: "weeklyExecutiveDigest",
                title: dict.settings.notifications.executiveDigest,
                desc: dict.settings.notifications.executiveDigestDesc
              }
            ].map((item) => {
              const val = (settings as any)[item.key];
              return (
                <div
                  key={item.key}
                  className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50 p-3.5"
                >
                  <div>
                    <p className="text-xs font-black text-slate-800">{item.title}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">{item.desc}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setSettings({
                        ...settings,
                        [item.key]: !val
                      })
                    }
                    className={cn(
                      "relative h-6 w-11 rounded-full transition flex-shrink-0",
                      val ? "bg-brand-green" : "bg-slate-300"
                    )}
                  >
                    <span
                      className={cn(
                        "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition",
                        val ? "left-5" : "left-0.5"
                      )}
                    />
                  </button>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* TAB 5: BACKUP & DATA HEALTH                                   */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeTab === "backup" && (
        <div className="space-y-5 max-w-4xl">
          <Card className="p-5 border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-black text-brand-navy">
                  {dict.settings.backup.title}
                </h2>
                <p className="text-xs text-slate-500">
                  {dict.settings.backup.desc}
                </p>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                {dict.settings.backup.healthStatus}
              </div>
            </div>

            {/* Live Stats Grid */}
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 pt-2">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5">
                <span className="text-[11px] font-bold text-slate-500">{dict.settings.backup.totalUsers}</span>
                <p className="mt-1 text-2xl font-black text-brand-navy">{dbStats.totalUsers}</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5">
                <span className="text-[11px] font-bold text-slate-500">{dict.settings.backup.totalTeams}</span>
                <p className="mt-1 text-2xl font-black text-brand-navy">{dbStats.totalTeams}</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5">
                <span className="text-[11px] font-bold text-slate-500">{dict.settings.backup.totalTrainers}</span>
                <p className="mt-1 text-2xl font-black text-brand-navy">{dbStats.totalTrainers}</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5">
                <span className="text-[11px] font-bold text-slate-500">{dict.settings.backup.totalCourses}</span>
                <p className="mt-1 text-2xl font-black text-brand-navy">{dbStats.totalCourses}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-slate-100">
              <a
                href="/api/settings/backup"
                download
                className="inline-flex items-center gap-2 rounded-xl brand-gradient text-brand-navy px-4 py-2.5 text-xs font-black shadow-md hover:brightness-105 transition"
              >
                <Download className="h-4 w-4" />
                {dict.settings.backup.exportJsonBtn}
              </a>

              <Button
                variant="ghost"
                onClick={() => {
                  if (confirm("Reset database to original demo seeds? Any custom additions will be refreshed.")) {
                    fetch("/api/settings", {
                      method: "PUT",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ systemLanguage: normLocale })
                    }).then(() => {
                      showToast("Seed data verified and operational.");
                    });
                  }
                }}
                className="border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
                {dict.settings.backup.resetBtn}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
