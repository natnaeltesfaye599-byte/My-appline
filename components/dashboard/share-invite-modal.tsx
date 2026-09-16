"use client";

import { useState, useEffect } from "react";
import {
  Check,
  Copy,
  Download,
  ExternalLink,
  QrCode,
  Send,
  Share2,
  Sparkles,
  UserCheck,
  Users,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ShareInviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  referralCode?: string;
  userName?: string;
  userRole?: string;
  locale?: string;
}

export function ShareInviteModal({
  isOpen,
  onClose,
  referralCode = "UPLINE-7749",
  userName = "Leader",
  userRole = "MEMBER",
  locale = "en"
}: ShareInviteModalProps) {
  const [activeTab, setActiveTab] = useState<"funnel" | "signup">("funnel");
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }
  }, []);

  if (!isOpen) return null;

  const baseUrl = origin || "https://myupline.global";
  const funnelUrl = `${baseUrl}/${locale}/prospect?ref=${referralCode}`;
  const signupUrl = `${baseUrl}/${locale}/auth/sign-up?ref=${referralCode}`;
  const currentUrl = activeTab === "funnel" ? funnelUrl : signupUrl;

  const telegramShareText =
    locale === "am"
      ? `🚀 የማይአፕላይን (MyUpline) እና የብሬክስሩ ሼር ካምፓኒ የዕድገት ሲስተም ይቀላቀሉ! የ9-ጥያቄዎች የብቃት መመዘኛ ቅጽ በመሙላት ጉዞዎን ይጀምሩ፦`
      : `🚀 Join MyUpline Global! Explore our proven network duplication system, certified training, and financial growth. Take the 2-minute qualification check here:`;

  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(telegramShareText)}`;

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(currentUrl)}&margin=10&color=0c1e3d`;

  function copyToClipboard(text: string, isCode = false) {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      if (isCode) {
        setCopiedCode(true);
        setTimeout(() => setCopiedCode(false), 2200);
      } else {
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2200);
      }
    }
  }

  function handleShareNative() {
    if (typeof navigator !== "undefined" && navigator.share) {
      navigator.share({
        title: "Join MyUpline Global",
        text: telegramShareText,
        url: currentUrl
      }).catch(() => {});
    } else {
      window.open(telegramUrl, "_blank");
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-3 sm:p-4 backdrop-blur-sm animate-in fade-in no-print"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 bg-brand-navy p-4 text-white">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl brand-gradient text-brand-navy font-bold shadow">
              <Share2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-black leading-tight">Share & Invite Prospects</h3>
              <p className="text-[11px] text-white/70">
                Sponsor: <span className="font-semibold text-cyan-300">{userName}</span> ({referralCode})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-white/70 hover:bg-white/10 hover:text-white transition"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="max-h-[80vh] overflow-y-auto p-5 space-y-5">
          {/* Quick Referral Code Box */}
          <div className="flex items-center justify-between gap-3 rounded-xl border border-cyan-200 bg-cyan-50/70 p-3.5">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-cyan-800">Your Sponsor Referral Code</p>
              <p className="text-lg font-black tracking-wider text-brand-navy font-mono">{referralCode}</p>
            </div>
            <Button
              size="sm"
              onClick={() => copyToClipboard(referralCode, true)}
              className="brand-gradient text-brand-navy text-xs font-bold shadow-sm"
            >
              {copiedCode ? (
                <>
                  <Check className="mr-1.5 h-3.5 w-3.5 text-emerald-700" /> Copied!
                </>
              ) : (
                <>
                  <Copy className="mr-1.5 h-3.5 w-3.5" /> Copy Code
                </>
              )}
            </Button>
          </div>

          {/* Link Type Tabs */}
          <div>
            <div className="grid grid-cols-2 gap-2 rounded-xl bg-slate-100 p-1">
              <button
                type="button"
                onClick={() => setActiveTab("funnel")}
                className={cn(
                  "flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-bold transition",
                  activeTab === "funnel"
                    ? "bg-white text-brand-navy shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                )}
              >
                <Sparkles className="h-3.5 w-3.5 text-brand-blue" />
                Prospect Funnel
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("signup")}
                className={cn(
                  "flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-bold transition",
                  activeTab === "signup"
                    ? "bg-white text-brand-navy shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                )}
              >
                <UserCheck className="h-3.5 w-3.5 text-emerald-600" />
                Direct Sign-Up
              </button>
            </div>

            <p className="mt-2 text-[11px] text-slate-500 text-center">
              {activeTab === "funnel"
                ? "🎯 Prospects complete the 9-question qualification form; verified leads drop into your Recruitment Inbox."
                : "⚡ Direct membership registration link with your sponsor code automatically applied."}
            </p>
          </div>

          {/* QR Code & Link Card */}
          <div className="flex flex-col items-center rounded-2xl border border-slate-200 bg-slate-50/50 p-4">
            {/* Live QR Code Preview */}
            <div className="relative rounded-2xl bg-white p-3 shadow-md border border-slate-200">
              <img
                src={qrCodeUrl}
                alt="MyUpline Referral QR Code"
                className="h-44 w-44 object-contain rounded-lg"
              />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 hover:opacity-100 transition bg-white/80 rounded-2xl font-bold text-xs text-brand-navy">
                Scan to Open
              </div>
            </div>
            <p className="mt-2 text-[11px] font-semibold text-slate-500">
              Scan with camera for instant in-person enrollment
            </p>

            {/* URL Input with Copy Button */}
            <div className="mt-4 flex w-full items-center gap-2">
              <input
                readOnly
                value={currentUrl}
                className="h-10 flex-1 rounded-lg border border-slate-200 bg-white px-3 text-xs font-mono text-slate-700 outline-none select-all"
              />
              <Button
                size="sm"
                onClick={() => copyToClipboard(currentUrl)}
                className="h-10 px-3.5 text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white shrink-0"
              >
                {copiedLink ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* Direct Share Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {/* Telegram 1-Click Share */}
            <a
              href={telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl bg-[#229ED9] hover:bg-[#1c8ec4] px-4 py-2.5 text-xs font-bold text-white shadow-md transition hover:scale-[1.02]"
            >
              <Send className="h-4 w-4" />
              Share to Telegram
            </a>

            {/* Native Mobile Share / Open Preview */}
            <button
              onClick={handleShareNative}
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-4 py-2.5 text-xs font-bold text-slate-700 shadow-sm transition"
            >
              <ExternalLink className="h-4 w-4 text-brand-blue" />
              Share / Open Link
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-5 py-3 text-[11px] text-slate-500">
          <span>MyUpline Global Duplication System</span>
          <button
            onClick={onClose}
            className="font-bold text-slate-700 hover:text-brand-navy"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
