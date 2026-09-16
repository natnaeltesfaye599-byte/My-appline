"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Send,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Building,
  Globe
} from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CmsFooterData {
  brandDescription: string;
  brandDescriptionAmharic?: string;
  contactEmail: string;
  contactPhone: string;
  whatsappNumber?: string;
  telegramChannelOrUser?: string;
  officeAddress: string;
  officeAddressAmharic?: string;
  workingHours?: string;
  workingHoursAmharic?: string;
  socialLinks: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    telegram?: string;
    whatsapp?: string;
    twitter?: string;
    youtube?: string;
    tiktok?: string;
  };
}

export default function ContactPage() {
  const params = useParams();
  const locale = (params?.locale === "am" ? "am" : "en") as "en" | "am";
  const isAm = locale === "am";

  const [footerData, setFooterData] = useState<CmsFooterData>({
    brandDescription: "MyUpline is the leading platform for Ethiopian network marketing IBOs.",
    brandDescriptionAmharic: "ማይአፕላይን ለኢትዮጵያ ኔትወርክ ማርኬቲንግ መሪዎች ቀዳሚው መድረክ ነው።",
    contactEmail: "support@myupline.org",
    contactPhone: "+251 911 223 344",
    whatsappNumber: "+251 911 223 344",
    telegramChannelOrUser: "https://t.me/myuplineofficial",
    officeAddress: "Bole Medhanialem, Edna Mall Commercial Complex, 4th Floor, Addis Ababa, Ethiopia",
    officeAddressAmharic: "ቦሌ መድኃኔዓለም፣ ኤድና ሞል የንግድ ህንፃ፣ 4ኛ ፎቅ፣ አዲስ አበባ፣ ኢትዮጵያ",
    workingHours: "Monday – Saturday: 8:30 AM – 6:30 PM (EAT)",
    workingHoursAmharic: "ከሰኞ – ቅዳሜ፡ ከጠዋቱ 2:30 – ከምሽቱ 12:30 (የኢትዮጵያ ሰዓት)",
    socialLinks: {
      facebook: "https://facebook.com/myupline.ethiopia",
      instagram: "https://instagram.com/myupline.official",
      linkedin: "https://linkedin.com/company/myupline-global",
      telegram: "https://t.me/myuplineofficial",
      whatsapp: "https://wa.me/251911223344"
    }
  });

  // Contact Form state
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("General Support");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submittedMessage, setSubmittedMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/cms")
      .then((r) => r.json())
      .then((d) => {
        if (d.data?.cms?.footer) {
          setFooterData(d.data.cms.footer);
        }
      })
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email, phone, subject, message })
      });
      const data = await res.json();
      if (res.ok) {
        setSubmittedMessage(
          isAm
            ? "መልእክትዎ በተሳካ ሁኔታ ደርሶናል! የድጋፍ ቡድናችን በ24 ሰዓታት ውስጥ ምላሽ ይሰጥዎታል።"
            : "Your message has been sent successfully! Our team will respond within 24 hours."
        );
        setFullName("");
        setEmail("");
        setPhone("");
        setMessage("");
      } else {
        setErrorMessage(data.error?.message || "Failed to send message. Please try again.");
      }
    } catch {
      setErrorMessage("Network error occurred. Please contact us directly via Telegram or Phone.");
    } finally {
      setSubmitting(false);
    }
  };

  const currentAddress = isAm && footerData.officeAddressAmharic ? footerData.officeAddressAmharic : footerData.officeAddress;
  const currentHours = isAm && footerData.workingHoursAmharic ? footerData.workingHoursAmharic : footerData.workingHours;

  return (
    <main className="min-h-screen bg-slate-950 text-white selection:bg-cyan-500 selection:text-slate-950">
      {/* Top Navigation */}
      <header className="border-b border-white/10 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <Link href={`/${locale}`} className="flex items-center gap-2">
            <BrandLogo />
          </Link>

          <div className="flex items-center gap-3">
            <div className="flex items-center rounded-xl bg-white/5 p-1 border border-white/10">
              <Link
                href="/en/contact"
                className={cn(
                  "rounded-lg px-2.5 py-1 text-xs font-bold transition",
                  locale === "en" ? "bg-white text-slate-950 font-black" : "text-slate-400 hover:text-white"
                )}
              >
                EN
              </Link>
              <Link
                href="/am/contact"
                className={cn(
                  "rounded-lg px-2.5 py-1 text-xs font-bold transition",
                  locale === "am" ? "bg-white text-slate-950 font-black" : "text-slate-400 hover:text-white"
                )}
              >
                አማርኛ
              </Link>
            </div>

            <Link href={`/${locale}`}>
              <Button variant="ghost" className="border border-white/10 text-xs font-bold hover:bg-white/10 text-slate-300">
                <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
                {isAm ? "ወደ ዋናው ገጽ" : "Back to Home"}
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Header */}
      <section className="relative overflow-hidden px-5 py-16 sm:px-8 sm:py-20 border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(6,182,212,0.15),rgba(255,255,255,0))]" />
        
        <div className="relative mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-cyan-300">
            <Sparkles className="h-3.5 w-3.5" />
            {isAm ? "የቀጥታ ድጋፍ እና ማዕከል" : "Official Support & Headquarters"}
          </div>

          <h1 className="mt-4 text-3xl font-black text-white sm:text-5xl tracking-tight">
            {isAm ? "እንዴት ልንረዳዎ እንችላለን?" : "We are Here to Empower You"}
          </h1>

          <p className="mt-4 text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            {isAm
              ? "የአባልነት ክፍያ፣ የስልጠና አካዳሚ፣ ወይም የአውታረ መረብ እድገት ጥያቄ ካለዎት የድጋፍ ቡድናችንን በቀጥታ ያግኙ።"
              : "Have questions about manual payment verification, LMS training cohorts, or team leadership? Reach our Ethiopian support faculty directly."}
          </p>
        </div>
      </section>

      {/* Contact Cards & Form Section */}
      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-12">
          {/* Left Column: Direct Communication Channels (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <h2 className="text-xl font-black text-white">
              {isAm ? "የቀጥታ ግንኙነት መንገዶች" : "Direct Channels"}
            </h2>
            <p className="text-xs text-slate-400">
              {isAm
                ? "ፈጣን ምላሽ ለማግኘት በቴሌግራም ወይም በስልክ ቁጥራችን ይደውሉ።"
                : "For fastest resolution, chat directly via Telegram or WhatsApp, or visit our Addis Ababa headquarters."}
            </p>

            {/* Telegram Channel Card */}
            {footerData.telegramChannelOrUser && (
              <a
                href={footerData.telegramChannelOrUser}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start gap-4 rounded-2xl border border-sky-500/20 bg-gradient-to-r from-sky-950/40 to-slate-900/60 p-4 transition duration-200 hover:border-sky-400 hover:scale-[1.02]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-500/20 text-sky-400">
                  <Send className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-white">Telegram Community</p>
                    <ExternalLink className="h-3.5 w-3.5 text-sky-400" />
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{footerData.telegramChannelOrUser}</p>
                  <span className="mt-2 inline-block text-[11px] font-bold text-sky-400">
                    {isAm ? "ወደ ቴሌግራም ቻናል ይሂዱ →" : "Join Channel & Chat →"}
                  </span>
                </div>
              </a>
            )}

            {/* WhatsApp Card */}
            {footerData.whatsappNumber && (
              <a
                href={`https://wa.me/${footerData.whatsappNumber.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start gap-4 rounded-2xl border border-emerald-500/20 bg-gradient-to-r from-emerald-950/40 to-slate-900/60 p-4 transition duration-200 hover:border-emerald-400 hover:scale-[1.02]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
                  <MessageCircle className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-white">WhatsApp Customer Care</p>
                    <ExternalLink className="h-3.5 w-3.5 text-emerald-400" />
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{footerData.whatsappNumber}</p>
                  <span className="mt-2 inline-block text-[11px] font-bold text-emerald-400">
                    {isAm ? "በዋትስአፕ ያውሩን →" : "Start WhatsApp Chat →"}
                  </span>
                </div>
              </a>
            )}

            {/* Direct Phone Card */}
            <a
              href={`tel:${footerData.contactPhone}`}
              className="group flex items-start gap-4 rounded-2xl border border-white/10 bg-slate-900/60 p-4 transition duration-200 hover:border-cyan-400 hover:scale-[1.02]"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-300">
                <Phone className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-white">{isAm ? "የስልክ መስመር" : "Phone Hotline"}</p>
                <p className="text-xs text-slate-400 mt-0.5">{footerData.contactPhone}</p>
                <span className="mt-2 inline-block text-[11px] font-bold text-cyan-300">
                  {isAm ? "አሁን ይደውሉ →" : "Call Directly →"}
                </span>
              </div>
            </a>

            {/* Official Email Card */}
            <a
              href={`mailto:${footerData.contactEmail}`}
              className="group flex items-start gap-4 rounded-2xl border border-white/10 bg-slate-900/60 p-4 transition duration-200 hover:border-cyan-400 hover:scale-[1.02]"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/20 text-purple-300">
                <Mail className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-white">{isAm ? "ኦፊሴላዊ ኢሜል" : "Official Support Email"}</p>
                <p className="text-xs text-slate-400 mt-0.5">{footerData.contactEmail}</p>
                <span className="mt-2 inline-block text-[11px] font-bold text-purple-300">
                  {isAm ? "ኢሜል ይላኩ →" : "Send Email Inquiry →"}
                </span>
              </div>
            </a>

            {/* Headquarters Card */}
            <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 space-y-3">
              <div className="flex items-center gap-2 text-amber-400">
                <Building className="h-4 w-4" />
                <h3 className="text-xs font-black uppercase tracking-wider text-white">
                  {isAm ? "ዋናው ቢሮ (አዲስ አበባ)" : "Addis Ababa Headquarters"}
                </h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{currentAddress}</p>
              <div className="flex items-center gap-2 pt-2 text-xs text-slate-400 border-t border-white/10">
                <Clock className="h-3.5 w-3.5 text-cyan-400" />
                <span>{currentHours}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Contact Form (7 cols) */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-white/15 bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 p-6 sm:p-8 shadow-2xl space-y-6">
              <div>
                <h2 className="text-xl font-black text-white">
                  {isAm ? "የመልእክት ሳጥን" : "Send Us a Message"}
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  {isAm
                    ? "እባክዎን ከዚህ በታች ያሉትን መረጃዎች ይሙሉ፤ የቡድን አስተባባሪዎቻችን በአጭር ጊዜ ውስጥ ምላሽ ይሰጣሉ።"
                    : "Fill out the form below and an assigned leader will reach out with assistance."}
                </p>
              </div>

              {submittedMessage && (
                <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs font-bold text-emerald-300 flex items-center gap-3 animate-in fade-in">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400 flex-shrink-0" />
                  <span>{submittedMessage}</span>
                </div>
              )}

              {errorMessage && (
                <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-xs font-bold text-rose-300 flex items-center gap-3 animate-in fade-in">
                  <AlertTriangle className="h-5 w-5 text-rose-400 flex-shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      {isAm ? "ሙሉ ስም *" : "Full Name *"}
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Abebe Kebede"
                      className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      {isAm ? "የኢሜል አድራሻ *" : "Email Address *"}
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="abebe@example.com"
                      className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      {isAm ? "ስልክ ቁጥር" : "Phone Number (Optional)"}
                    </label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+251 9..."
                      className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      {isAm ? "የጉዳዩ ርዕስ" : "Inquiry Category"}
                    </label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-slate-800 p-3 text-xs text-white outline-none focus:border-cyan-400"
                    >
                      <option value="General Support">General Support & Information</option>
                      <option value="Manual Payment Verification">Manual Payment Verification (CBE/Telebirr)</option>
                      <option value="LMS Academy & Certificates">LMS Academy & Course Cohorts</option>
                      <option value="Team Leadership & Squad Assignment">Team Leadership & Squad Assignment</option>
                      <option value="Account & Password Recovery">Account & Password Recovery</option>
                      <option value="Partnership & Sponsorship">Partnership & Commercial Expansion</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    {isAm ? "መልእክትዎ *" : "Message Details *"}
                  </label>
                  <textarea
                    rows={5}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={
                      isAm
                        ? "እባክዎን ጥያቄዎን ወይም አስተያየትዎን እዚህ በዝርዝር ይጻፉ..."
                        : "Describe your inquiry in detail..."
                    }
                    className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-400 resize-none leading-relaxed"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full brand-gradient py-3 text-brand-navy font-black text-xs shadow-lg hover:brightness-105 transition duration-200"
                >
                  {submitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="h-4 w-4 border-2 border-brand-navy border-t-transparent rounded-full animate-spin" />
                      {isAm ? "በመላክ ላይ..." : "Submitting Inquiry..."}
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <Send className="h-4 w-4" />
                      {isAm ? "መልእክት ላክ" : "Send Inquiry"}
                    </span>
                  )}
                </Button>
              </form>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" />
                  Protected by 256-bit SSL encryption
                </span>
                <span>Response time: &lt; 24 hrs</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
