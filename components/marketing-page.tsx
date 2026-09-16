"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import {
  ArrowRight,
  Award,
  BarChart3,
  BookOpen,
  Check,
  ChevronDown,
  Clock,
  Facebook,
  GraduationCap,
  Instagram,
  Linkedin,
  Mail,
  MessageCircle,
  Network,
  Sparkles,
  Star,
  Target,
  Trophy,
  UsersRound,
  WalletCards,
  ShieldCheck,
  Zap,
  Globe,
  TrendingUp,
  Play,
  ArrowUpRight,
  Tag,
  User,
  X,
  Phone,
  MapPin,
  Send,
  Youtube,
  Twitter,
  ExternalLink,
  Shield
} from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Dictionary, Locale } from "@/lib/i18n";

type MarketingPageProps = {
  locale: Locale;
  copy: Dictionary;
};

/* ─── NAV ITEMS ─── */
const navItems = [
  ["Home", "#home"],
  ["About", "#about"],
  ["Academy", "#learning"],
  ["Plans", "#plans"],
  ["Blog", "#blog"],
  ["Stories", "#stories"],
  ["Contact", "#contact"]
] as const;

/* ─── ANIMATED COUNTER ─── */
function AnimatedCounter({ value, suffix = "", prefix = "" }: { value: number; suffix?: string; prefix?: string }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref as React.RefObject<Element>, { once: true, margin: "-80px" });

  useEffect(() => {
    if (!isInView) return;
    let frame = 0;
    const frames = 50;
    const tick = () => {
      frame += 1;
      const progress = 1 - Math.pow(1 - frame / frames, 3);
      setDisplay(Math.round(value * progress));
      if (frame < frames) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [isInView, value]);

  return (
    <span ref={ref}>
      {prefix}{display.toLocaleString()}{suffix}
    </span>
  );
}

/* ─── LIVE BLOG POST TYPES ─── */
interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  author: string;
  authorRole: string;
  category: string;
  tags: string[];
  readTimeMinutes: number;
  isPublished: boolean;
  featured: boolean;
  publishedAt?: string;
}

interface CmsData {
  hero: {
    badgeText: string;
    announcement: string;
    headline: string;
    subheadline: string;
    primaryCtaText: string;
    primaryCtaLink: string;
    secondaryCtaText: string;
    secondaryCtaLink: string;
    stats: {
      activeMembers: number;
      monthlyVolumeETB: number;
      coursesCompleted: number;
      countriesActive: number;
    };
  };
  testimonials: {
    id: string;
    name: string;
    role: string;
    story: string;
    initials: string;
    rating: number;
    location?: string;
  }[];
  faqs: {
    id: string;
    question: string;
    answer: string;
    category: string;
    order: number;
  }[];
  footer?: {
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
    platformLinks: Array<{ label: string; labelAm?: string; href: string }>;
    companyLinks: Array<{ label: string; labelAm?: string; href: string }>;
    copyrightText: string;
    copyrightTextAmharic?: string;
    securityBadgeText?: string;
  };
}

interface Package {
  id: string;
  name: string;
  priceETB: number;
  pv: number;
  badge?: string;
  description: string;
  features: string[];
  isActive: boolean;
}

/* ─── BLOG ARTICLE MODAL ─── */
function BlogArticleModal({ post, onClose }: { post: BlogPost; onClose: () => void }) {
  const renderContent = (content: string) => {
    return content.split("\n").map((line, i) => {
      if (line.startsWith("## ")) return <h2 key={i} className="text-2xl font-black text-white mt-8 mb-4">{line.slice(3)}</h2>;
      if (line.startsWith("### ")) return <h3 key={i} className="text-xl font-bold text-white/90 mt-5 mb-3">{line.slice(4)}</h3>;
      if (line.startsWith("**") && line.endsWith("**")) return <p key={i} className="font-bold text-white mb-2">{line.slice(2, -2)}</p>;
      if (line.startsWith("*Script:*")) return <p key={i} className="text-emerald-300 italic border-l-2 border-emerald-500 pl-4 mb-3">{line.replace("*Script:*", "Script:")}</p>;
      if (line.startsWith("- ")) return <li key={i} className="text-white/80 ml-5 list-disc mb-1.5 leading-relaxed">{line.slice(2)}</li>;
      if (/^\d+\./.test(line)) return <li key={i} className="text-white/80 ml-5 list-decimal mb-1.5 leading-relaxed">{line.replace(/^\d+\.\s/, "")}</li>;
      if (line.trim() === "") return <div key={i} className="h-3" />;
      return <p key={i} className="text-white/75 mb-3 leading-relaxed">{line}</p>;
    });
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-start justify-center bg-black/85 backdrop-blur-sm p-4 pt-8 overflow-y-auto"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="bg-gradient-to-b from-slate-900 to-slate-950 border border-white/10 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl mb-8"
      >
        {/* Cover */}
        {post.coverImage && (
          <div className="relative h-56 overflow-hidden">
            <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        <div className="p-6 sm:p-8">
          {!post.coverImage && (
            <div className="flex justify-end mb-4">
              <button onClick={onClose} className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="text-xs px-3 py-1 rounded-full bg-violet-500/20 border border-violet-500/30 text-violet-300 font-medium">
              {post.category}
            </span>
            {post.featured && (
              <span className="text-xs px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 font-medium flex items-center gap-1">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> Featured
              </span>
            )}
            <span className="text-xs text-white/40 flex items-center gap-1">
              <Clock className="w-3 h-3" /> {post.readTimeMinutes} min read
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight mb-4">{post.title}</h1>

          {/* Author */}
          <div className="flex items-center gap-3 mb-6 pb-5 border-b border-white/10">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {post.author.charAt(0)}
            </div>
            <div>
              <p className="text-white text-sm font-semibold">{post.author}</p>
              <p className="text-white/50 text-xs">{post.authorRole}</p>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-1">{renderContent(post.content)}</div>

          {/* Tags */}
          {post.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-8 pt-5 border-t border-white/10">
              {post.tags.map((tag) => (
                <span key={tag} className="text-xs px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-white/50 flex items-center gap-1">
                  <Tag className="w-3 h-3" /> {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN MARKETING PAGE
═══════════════════════════════════════════════════════════════ */
export function MarketingPage({ locale }: MarketingPageProps) {
  const [cms, setCms] = useState<CmsData | null>(null);
  const [packages, setPackages] = useState<Package[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);
  const [policyModal, setPolicyModal] = useState<"about" | "privacy" | "terms" | null>(null);

  useEffect(() => {
    // Fetch CMS content
    fetch("/api/cms").then((r) => r.json()).then((d) => setCms(d.data?.cms || null)).catch(() => {});
    // Fetch packages
    fetch("/api/packages").then((r) => r.json()).then((d) => setPackages(d.data?.packages || [])).catch(() => {});
    // Fetch published blog posts
    fetch("/api/blog?published=true").then((r) => r.json()).then((d) => setBlogPosts(d.data?.posts || [])).catch(() => {});

    // Scroll listener for nav
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const featuredPost = blogPosts.find((p) => p.featured) || blogPosts[0];
  const otherPosts = blogPosts.filter((p) => p.id !== featuredPost?.id).slice(0, 3);

  const hero = cms?.hero;
  const testimonials = cms?.testimonials || [];
  const faqs = cms?.faqs?.sort((a, b) => a.order - b.order) || [];

  /* ─────────── HERO STATS ─────────── */
  const stats = hero?.stats
    ? [
        { label: "Active IBOs", value: hero.stats.activeMembers, suffix: "+", color: "from-cyan-400 to-blue-500" },
        { label: "Monthly Volume", value: Math.round(hero.stats.monthlyVolumeETB / 1_000_000), suffix: "M ETB", color: "from-emerald-400 to-green-500" },
        { label: "Courses Completed", value: hero.stats.coursesCompleted, suffix: "+", color: "from-violet-400 to-purple-500" },
        { label: "Countries", value: hero.stats.countriesActive, suffix: "", color: "from-amber-400 to-orange-500" }
      ]
    : [
        { label: "Active IBOs", value: 12480, suffix: "+", color: "from-cyan-400 to-blue-500" },
        { label: "Monthly Volume", value: 847, suffix: "M ETB", color: "from-emerald-400 to-green-500" },
        { label: "Courses Completed", value: 38200, suffix: "+", color: "from-violet-400 to-purple-500" },
        { label: "Countries", value: 7, suffix: "", color: "from-amber-400 to-orange-500" }
      ];

  return (
    <main id="home" className="min-h-screen bg-slate-950 text-white antialiased">

      {/* ──────────── ANNOUNCEMENT TICKER ──────────── */}
      {hero?.announcement && (
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-black py-2 text-center text-xs sm:text-sm font-bold px-4">
          <motion.span
            animate={{ opacity: [1, 0.7, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-flex items-center gap-2"
          >
            <Zap className="w-3.5 h-3.5 text-black" />
            {hero.announcement}
            <Zap className="w-3.5 h-3.5 text-black" />
          </motion.span>
        </div>
      )}

      {/* ──────────── STICKY NAV ──────────── */}
      <nav
        className={cn(
          "sticky top-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-slate-950/95 backdrop-blur-xl border-b border-white/10 shadow-xl shadow-black/30"
            : "bg-transparent"
        )}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <Link href={`/${locale}`} aria-label="MyUpline home">
            <BrandLogo />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden items-center gap-6 text-sm font-semibold text-white/70 xl:flex">
            {navItems.map(([label, href]) => (
              <a key={label} href={href} className="hover:text-white transition-colors duration-200 hover:text-cyan-300">
                {label}
              </a>
            ))}
          </div>

          <div className="hidden items-center gap-2 md:flex">
            {/* Language Switcher */}
            <Link
              href={locale === "en" ? "/am" : "/en"}
              className="flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-xs font-black text-white hover:bg-white/20 transition-all mr-1"
              title={locale === "en" ? "ቀይር ወደ አማርኛ" : "Switch to English"}
            >
              <span>{locale === "en" ? "🇪🇹 አማርኛ" : "🇬🇧 English"}</span>
            </Link>

            <Link
              href={`/${locale}/auth/sign-in`}
              className="rounded-lg px-4 py-2 text-sm font-bold text-white/80 hover:bg-white/10 transition-colors"
            >
              {locale === "am" ? "ግባ" : "Sign In"}
            </Link>
            <Link
              href={`/${locale}/auth/sign-up`}
              className="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2.5 text-sm font-black text-white shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-105 transition-all duration-200"
            >
              {locale === "am" ? "አሁኑኑ ተቀላቀል" : (hero?.primaryCtaText || "Join MyUpline")}
            </Link>
          </div>

          {/* Mobile */}
          <button
            onClick={() => setMobileMenuOpen((v) => !v)}
            className="rounded-lg bg-white/10 p-2 md:hidden text-white"
          >
            <div className="w-5 h-0.5 bg-white mb-1 transition-all" />
            <div className="w-5 h-0.5 bg-white mb-1" />
            <div className="w-5 h-0.5 bg-white" />
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-white/10 bg-slate-950/98 px-5 pb-4 md:hidden"
            >
              {navItems.map(([label, href]) => (
                <a
                  key={label}
                  href={href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2.5 text-sm font-semibold text-white/70 hover:text-white"
                >
                  {label}
                </a>
              ))}
              <div className="mt-3 space-y-2">
                <Link
                  href={locale === "en" ? "/am" : "/en"}
                  className="block text-center py-2 border border-white/20 bg-white/10 rounded-lg text-xs font-black text-white hover:bg-white/20"
                >
                  {locale === "en" ? "🇪🇹 ቀይር ወደ አማርኛ (Amharic)" : "🇬🇧 Switch to English"}
                </Link>
                <div className="flex gap-2">
                  <Link href={`/${locale}/auth/sign-in`} className="flex-1 text-center py-2.5 border border-white/20 rounded-lg text-sm font-bold text-white/80">
                    {locale === "am" ? "ግባ" : "Sign In"}
                  </Link>
                  <Link href={`/${locale}/auth/sign-up`} className="flex-1 text-center py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg text-sm font-black text-white">
                    {locale === "am" ? "አሁኑኑ ተቀላቀል" : "Join Now"}
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ──────────── HERO SECTION ──────────── */}
      <section className="relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-indigo-950/60 to-slate-950" />
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-violet-500/10 rounded-full blur-3xl" />
          <div className="absolute top-1/3 right-0 w-[400px] h-[400px] bg-blue-600/8 rounded-full blur-3xl" />
          {/* Grid lines */}
          <div className="absolute inset-0 opacity-[0.03]"
            style={{ backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)", backgroundSize: "60px 60px" }} />
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          {Array.from({ length: 18 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-cyan-400/20"
              style={{
                width: `${4 + (i % 4) * 3}px`,
                height: `${4 + (i % 4) * 3}px`,
                left: `${(i * 41) % 95}%`,
                top: `${(i * 29) % 90}%`
              }}
              animate={{ y: [0, -20, 0], opacity: [0.2, 0.8, 0.2] }}
              transition={{ duration: 4 + (i % 3), repeat: Infinity, delay: i * 0.3 }}
            />
          ))}
        </div>

        <div className="relative mx-auto max-w-7xl px-5 pb-24 pt-16 sm:px-8 lg:pb-32 lg:pt-20">
          <div className="grid gap-16 lg:grid-cols-[1fr_1fr] lg:items-center">
            {/* Left */}
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-sm font-bold text-cyan-300 backdrop-blur"
              >
                <Sparkles className="h-4 w-4 text-cyan-400" />
                {hero?.badgeText || "🚀 Ethiopia's #1 Network Business Platform"}
              </motion.div>

              {/* Headline */}
              <h1 className="text-5xl font-black leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl">
                <span className="text-white">{(hero?.headline || "Build Your Business Empire").split(" ").slice(0, 4).join(" ")}</span>
                <span className="block mt-1 bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400 bg-clip-text text-transparent">
                  {(hero?.headline || "with MyUpline").split(" ").slice(4).join(" ") || "with MyUpline"}
                </span>
              </h1>

              {/* Subheadline */}
              <p className="mt-6 max-w-xl text-lg leading-8 text-white/65">
                {hero?.subheadline || "The all-in-one platform for Ethiopian network business leaders — recruitment, training, team management, and residual income tracking in one powerful system."}
              </p>

              {/* CTAs */}
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href={`/${locale}/auth/sign-up`}>
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.98 }}
                    className="group inline-flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-7 py-3.5 text-base font-black text-white shadow-xl shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-shadow"
                  >
                    {hero?.primaryCtaText || "Start Your Business Journey"}
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                </Link>
                <a href="#learning">
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.98 }}
                    className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-7 py-3.5 text-base font-bold text-white/90 hover:bg-white/10 transition-colors backdrop-blur"
                  >
                    <Play className="h-4 w-4 text-cyan-400" />
                    {hero?.secondaryCtaText || "Explore Learning Academy"}
                  </motion.button>
                </a>
              </div>

              {/* Trust badges */}
              <div className="mt-8 flex flex-wrap items-center gap-4 text-xs text-white/40">
                {[
                  { icon: ShieldCheck, text: "RBAC-Secured Platform" },
                  { icon: Globe, text: "7 Countries Active" },
                  { icon: Award, text: "Crown Diamond Certified" }
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-1.5">
                    <Icon className="h-3.5 w-3.5 text-cyan-500" />
                    <span>{text}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right: Live Dashboard Mockup */}
            <motion.div
              initial={{ opacity: 0, x: 40, rotateY: -8 }}
              animate={{ opacity: 1, x: 0, rotateY: 0 }}
              transition={{ duration: 0.9, delay: 0.15 }}
              className="relative"
            >
              {/* Main Card */}
              <div className="relative rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xs font-bold text-cyan-400">MyUpline Command Center</p>
                    <h3 className="text-lg font-black text-white mt-0.5">Network Performance</h3>
                  </div>
                  <div className="flex items-center gap-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/30 px-3 py-1.5 text-xs font-black text-emerald-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    LIVE
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {[
                    { label: "Team IBOs", value: "10.8K", change: "+12%" },
                    { label: "Active Teams", value: "542", change: "+8%" },
                    { label: "Training Rate", value: "86%", change: "+5%" },
                    { label: "Live Leads", value: "2.4K", change: "+11%" }
                  ].map(({ label, value, change }) => (
                    <div key={label} className="rounded-xl border border-white/8 bg-black/20 p-3">
                      <p className="text-xs text-white/40">{label}</p>
                      <p className="text-xl font-black text-white mt-1">{value}</p>
                      <p className="text-xs font-bold text-emerald-400 mt-0.5">{change}</p>
                    </div>
                  ))}
                </div>

                {/* Mini Chart */}
                <div className="rounded-xl border border-white/8 bg-black/20 p-4">
                  <p className="text-xs text-white/40 mb-3">Weekly Recruitment Progress</p>
                  <div className="flex items-end gap-1.5 h-20">
                    {[35, 48, 42, 65, 72, 85, 94].map((h, i) => (
                      <motion.div
                        key={i}
                        initial={{ height: 0 }}
                        animate={{ height: `${h}%` }}
                        transition={{ duration: 0.7, delay: i * 0.06 }}
                        className="flex-1 rounded-t-md bg-gradient-to-t from-cyan-600 to-cyan-400"
                        style={{ opacity: 0.6 + i * 0.06 }}
                      />
                    ))}
                  </div>
                  <div className="flex justify-between mt-2">
                    {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
                      <span key={`${d}-${i}`} className="text-xs text-white/25 flex-1 text-center">{d}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Floating badge: Achievement */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-4 -left-8 rounded-xl border border-white/10 bg-slate-900/95 p-4 shadow-2xl backdrop-blur-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                    <Trophy className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-white">Diamond Qualified!</p>
                    <p className="text-xs text-white/50">Hiwot G. · Mekelle</p>
                  </div>
                </div>
              </motion.div>

              {/* Floating badge: Invitation */}
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute -top-4 -right-4 rounded-xl border border-white/10 bg-slate-900/95 p-3 shadow-2xl backdrop-blur-xl"
              >
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-xs font-black">
                    +3
                  </div>
                  <div>
                    <p className="text-xs font-black text-white">New Enrollments</p>
                    <p className="text-xs text-emerald-400">Tonight's cohort</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* LIVE STATS ROW */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-20 grid grid-cols-2 gap-4 sm:grid-cols-4"
          >
            {stats.map(({ label, value, suffix, color }) => (
              <div
                key={label}
                className="group rounded-2xl border border-white/8 bg-white/3 p-5 text-center hover:bg-white/6 hover:border-white/15 transition-all duration-300 backdrop-blur"
              >
                <p className={cn("text-3xl font-black bg-gradient-to-r bg-clip-text text-transparent", color)}>
                  <AnimatedCounter value={value} suffix={suffix} />
                </p>
                <p className="mt-1.5 text-sm font-semibold text-white/50">{label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ──────────── ABOUT / FEATURES ──────────── */}
      <section id="about" className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 to-indigo-950/20 -z-10" />
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="text-center mb-14">
            <p className="text-xs font-black uppercase tracking-widest text-cyan-400 mb-3">Why MyUpline</p>
            <h2 className="text-4xl font-black text-white sm:text-5xl">
              Everything You Need to
              <span className="block bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">Build a 6-Figure Business</span>
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-white/55 text-lg leading-relaxed">
              A complete operating system for Ethiopian IBOs — recruitment pipeline, LMS training, team downline management, and analytics — all RBAC-secured.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {[
              {
                icon: UsersRound,
                title: "Membership & Onboarding",
                desc: "Full IBO lifecycle — registration, package selection, manual payment verification, and onboarding checklist.",
                badge: "Core",
                gradient: "from-cyan-500/20 to-blue-500/5"
              },
              {
                icon: GraduationCap,
                title: "Leadership Academy (LMS)",
                desc: "Structured Eric Worre courses, video lessons, quizzes, materials upload, and digital certificates.",
                badge: "Training",
                gradient: "from-violet-500/20 to-indigo-500/5"
              },
              {
                icon: Network,
                title: "Recruitment Pipeline",
                desc: "Track prospects through invite, present, follow-up, and close stages. Export to CSV anytime.",
                badge: "Sales",
                gradient: "from-emerald-500/20 to-teal-500/5"
              },
              {
                icon: BarChart3,
                title: "Daily 4-Basics Tracker",
                desc: "Accountability system for daily DMO activity — invite, present, follow-up, promote — with KPI scores.",
                badge: "DMO",
                gradient: "from-amber-500/20 to-orange-500/5"
              },
              {
                icon: WalletCards,
                title: "Packages & Payments",
                desc: "Admin-managed CBE, Telebirr, and Awash payment verification with receipt screenshot review.",
                badge: "Finance",
                gradient: "from-rose-500/20 to-pink-500/5"
              },
              {
                icon: Award,
                title: "Recognition & Certificates",
                desc: "Beautiful digital certificates for rank achievements. Print-to-PDF with personalized ornate framing.",
                badge: "Awards",
                gradient: "from-sky-500/20 to-cyan-500/5"
              }
            ].map(({ icon: Icon, title, desc, badge, gradient }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ delay: i * 0.06 }}
                className={cn(
                  "group relative rounded-2xl border border-white/8 bg-gradient-to-br p-6 hover:border-white/15 transition-all duration-300 cursor-default",
                  gradient
                )}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/30 to-blue-600/30 border border-cyan-500/20 flex items-center justify-center">
                    <Icon className="h-6 w-6 text-cyan-300" />
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-white/8 border border-white/10 text-white/50 font-semibold">
                    {badge}
                  </span>
                </div>
                <h3 className="text-lg font-black text-white mb-2">{title}</h3>
                <p className="text-sm text-white/55 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────── ACADEMY / LEARNING ──────────── */}
      <section id="learning" className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-950/30 via-slate-950 to-slate-950 -z-10" />
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="text-center mb-14">
            <p className="text-xs font-black uppercase tracking-widest text-violet-400 mb-3">Learning Academy</p>
            <h2 className="text-4xl font-black text-white sm:text-5xl">
              Master Every Skill.
              <span className="block bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">Earn Your Certificate.</span>
            </h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-10">
            {[
              { icon: BookOpen, label: "Structured Courses", val: "20+ Modules" },
              { icon: Play, label: "Video Lessons", val: "HD Quality" },
              { icon: Target, label: "Quiz Assessments", val: "Per Module" },
              { icon: Award, label: "Digital Certificates", val: "Printable" }
            ].map(({ icon: Icon, label, val }) => (
              <div key={label} className="rounded-2xl border border-white/8 bg-white/3 p-5 text-center hover:bg-white/6 transition-colors">
                <div className="w-12 h-12 mx-auto rounded-xl bg-violet-500/20 border border-violet-500/20 flex items-center justify-center mb-3">
                  <Icon className="w-6 h-6 text-violet-300" />
                </div>
                <p className="text-white font-black text-lg">{val}</p>
                <p className="text-white/50 text-sm mt-1">{label}</p>
              </div>
            ))}
          </div>

          {/* Course Cards */}
          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                level: "BASIC",
                title: "NBO: New Business Orientation & 48-Hour Launch",
                trainer: "Kassahun Bekele",
                duration: "25 min",
                enrolled: "342 IBOs",
                color: "from-emerald-500/20 to-teal-500/5"
              },
              {
                level: "BASIC",
                title: "8-Step Invitation Mastery (Eric Worre)",
                trainer: "Selamawit Tadesse",
                duration: "22 min",
                enrolled: "512 IBOs",
                color: "from-blue-500/20 to-indigo-500/5"
              },
              {
                level: "LEADERSHIP",
                title: "Rise of Entrepreneur: Mindset Transformation",
                trainer: "Dr. Bethelhem Alemu",
                duration: "20 min",
                enrolled: "680 IBOs",
                color: "from-violet-500/20 to-purple-500/5"
              }
            ].map(({ level, title, trainer, duration, enrolled, color }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className={cn("rounded-2xl border border-white/8 bg-gradient-to-br p-5 hover:border-white/15 transition-all", color)}
              >
                <span className="text-xs font-black px-2.5 py-1 rounded-full bg-white/10 text-white/60">{level}</span>
                <h3 className="text-base font-black text-white mt-3 mb-2 leading-snug">{title}</h3>
                <div className="flex items-center gap-3 text-xs text-white/40 mb-4">
                  <span className="flex items-center gap-1"><User className="w-3 h-3" />{trainer}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{duration}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-emerald-400 font-semibold">{enrolled} enrolled</span>
                  <Link href={`/${locale}/auth/sign-up`}>
                    <span className="text-xs font-bold text-violet-300 hover:text-violet-200 flex items-center gap-1 cursor-pointer">
                      Enroll <ArrowUpRight className="w-3 h-3" />
                    </span>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────── LIVE PACKAGES ──────────── */}
      <section id="plans" className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900/50 to-slate-950 -z-10" />
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="text-center mb-14">
            <p className="text-xs font-black uppercase tracking-widest text-emerald-400 mb-3">Membership Plans</p>
            <h2 className="text-4xl font-black text-white sm:text-5xl">
              Choose Your
              <span className="block bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Investment Level</span>
            </h2>
            <p className="mt-4 text-white/50 max-w-xl mx-auto">
              All packages are verified manually through CBE, Telebirr, or Awash Bank. Select your plan and submit your payment receipt.
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-4">
            {(packages.length > 0 ? packages : [
              { id: "1", name: "Bronze Starter", priceETB: 1990, pv: 50, description: "Essential IBO onboarding tools", features: ["50 PV", "Starter Videos", "Member Portal"], isActive: true },
              { id: "2", name: "Silver Associate", priceETB: 3990, pv: 100, description: "Standard DMO tools & tracker", features: ["100 PV", "Daily Activity Tracker", "Name List Organizer"], isActive: true },
              { id: "3", name: "Gold Executive", priceETB: 8490, pv: 250, badge: "Popular", description: "Multi-level downline tracking & advanced training", features: ["250 PV", "Advanced LMS", "3-Level Downline", "Standard Commissions"], isActive: true },
              { id: "4", name: "Diamond Leader", priceETB: 14990, pv: 500, badge: "Recommended ⭐", description: "Maximum compensation tiers & full Academy", features: ["500 PV", "Tier-1 Commissions", "Full Academy Access", "Priority Placement", "Unlimited Downline"], isActive: true }
            ]).filter((p) => p.isActive).map((pkg, i) => {
              const isDiamond = pkg.name.toLowerCase().includes("diamond") || pkg.badge?.includes("⭐");
              return (
                <motion.div
                  key={pkg.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className={cn(
                    "relative rounded-2xl border p-6 flex flex-col",
                    isDiamond
                      ? "border-cyan-500/50 bg-gradient-to-b from-cyan-500/15 to-blue-600/10 shadow-2xl shadow-cyan-500/10"
                      : "border-white/10 bg-white/3 hover:bg-white/5"
                  )}
                >
                  {pkg.badge && (
                    <div className={cn(
                      "absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-black",
                      isDiamond ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30" : "bg-white/10 text-white/60 border border-white/15"
                    )}>
                      {pkg.badge}
                    </div>
                  )}

                  <h3 className="text-xl font-black text-white mb-1">{pkg.name}</h3>
                  <p className="text-white/45 text-sm mb-4">{pkg.description}</p>

                  <div className="mb-5">
                    <span className="text-3xl font-black text-white">ETB {pkg.priceETB.toLocaleString()}</span>
                    <span className="text-white/40 text-sm ml-1">/ join</span>
                    <div className="mt-1 text-xs font-bold text-cyan-400">{pkg.pv} Personal Volume (PV)</div>
                  </div>

                  <ul className="space-y-2.5 mb-6 flex-1">
                    {pkg.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-sm text-white/65">
                        <Check className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <Link href={`/${locale}/auth/sign-up?package=${pkg.id}`}>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className={cn(
                        "w-full rounded-xl py-3 text-sm font-black transition-all",
                        isDiamond
                          ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40"
                          : "border border-white/15 bg-white/5 text-white hover:bg-white/10"
                      )}
                    >
                      Choose {pkg.name.split(" ")[0]}
                    </motion.button>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* Payment Trust Badges */}
          <div className="mt-12 rounded-2xl border border-white/8 bg-white/3 p-6">
            <p className="text-center text-sm font-bold text-white/40 mb-5">Accepted Payment Methods</p>
            <div className="flex flex-wrap justify-center gap-4">
              {[
                { name: "Commercial Bank of Ethiopia (CBE)", abbr: "CBE", color: "from-blue-600 to-blue-800" },
                { name: "Telebirr Merchant", abbr: "TB", color: "from-green-600 to-emerald-700" },
                { name: "Awash Bank", abbr: "AB", color: "from-orange-600 to-amber-700" },
                { name: "Bank of Abyssinia", abbr: "BoA", color: "from-red-700 to-red-900" }
              ].map(({ name, abbr, color }) => (
                <div key={name} className="flex items-center gap-3 rounded-xl border border-white/8 bg-white/5 px-4 py-3">
                  <div className={cn("w-9 h-9 rounded-lg bg-gradient-to-br flex items-center justify-center text-white text-xs font-black", color)}>
                    {abbr}
                  </div>
                  <span className="text-white/60 text-sm font-medium">{name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ──────────── BLOG SECTION ──────────── */}
      {blogPosts.length > 0 && (
        <section id="blog" className="py-24 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/30 to-slate-950 -z-10" />
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="text-center mb-14">
              <p className="text-xs font-black uppercase tracking-widest text-indigo-400 mb-3">Knowledge Center</p>
              <h2 className="text-4xl font-black text-white sm:text-5xl">
                Learn from
                <span className="block bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">Our Expert Leaders</span>
              </h2>
            </div>

            {/* Featured Post */}
            {featuredPost && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-8"
              >
                <button
                  onClick={() => setSelectedPost(featuredPost)}
                  className="group w-full rounded-2xl border border-white/10 overflow-hidden hover:border-white/20 transition-all duration-300 text-left"
                >
                  <div className="grid lg:grid-cols-[1.3fr_1fr]">
                    {/* Cover */}
                    <div className="relative h-64 lg:h-80 overflow-hidden">
                      {featuredPost.coverImage ? (
                        <img
                          src={featuredPost.coverImage}
                          alt={featuredPost.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-indigo-800 to-violet-900 flex items-center justify-center">
                          <BookOpen className="w-20 h-20 text-white/20" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-slate-900/50 lg:block hidden" />
                      <div className="absolute top-4 left-4 flex gap-2">
                        <span className="px-3 py-1 rounded-full bg-amber-500/90 text-black text-xs font-black">⭐ Featured</span>
                        <span className="px-3 py-1 rounded-full bg-black/50 backdrop-blur text-white text-xs font-semibold">{featuredPost.category}</span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-7 flex flex-col justify-center bg-white/3">
                      <div className="flex items-center gap-3 mb-4 text-xs text-white/40">
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{featuredPost.readTimeMinutes} min read</span>
                        <span>·</span>
                        <span>{featuredPost.author}</span>
                      </div>
                      <h3 className="text-2xl font-black text-white mb-3 leading-snug group-hover:text-cyan-300 transition-colors">
                        {featuredPost.title}
                      </h3>
                      <p className="text-white/55 text-sm leading-relaxed mb-5">{featuredPost.excerpt}</p>
                      <div className="inline-flex items-center gap-2 text-sm font-bold text-cyan-400 group-hover:text-cyan-300">
                        Read Full Article <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </button>
              </motion.div>
            )}

            {/* Other Posts Grid */}
            {otherPosts.length > 0 && (
              <div className="grid gap-5 md:grid-cols-3">
                {otherPosts.map((post, i) => (
                  <motion.button
                    key={post.id}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    onClick={() => setSelectedPost(post)}
                    className="group rounded-2xl border border-white/8 overflow-hidden hover:border-white/15 transition-all duration-300 text-left"
                  >
                    {/* Cover */}
                    <div className="relative h-44 overflow-hidden">
                      {post.coverImage ? (
                        <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                          <BookOpen className="w-12 h-12 text-white/20" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                      <div className="absolute top-3 left-3">
                        <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur text-white text-xs font-semibold">{post.category}</span>
                      </div>
                    </div>

                    <div className="p-5 bg-white/3">
                      <div className="flex items-center gap-2 text-xs text-white/35 mb-3">
                        <Clock className="w-3 h-3" /> {post.readTimeMinutes} min
                        <span>·</span>
                        <span>{post.author.split(" ")[0]}</span>
                      </div>
                      <h3 className="text-base font-black text-white leading-snug mb-2 group-hover:text-cyan-300 transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-white/45 text-sm line-clamp-2 leading-relaxed">{post.excerpt}</p>
                      <div className="mt-4 flex items-center gap-1 text-xs font-bold text-violet-400 group-hover:text-violet-300">
                        Read Article <ArrowUpRight className="w-3 h-3" />
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ──────────── SUCCESS STORIES ──────────── */}
      {testimonials.length > 0 && (
        <section id="stories" className="py-24 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950 to-emerald-950/15 -z-10" />
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="text-center mb-14">
              <p className="text-xs font-black uppercase tracking-widest text-emerald-400 mb-3">Success Stories</p>
              <h2 className="text-4xl font-black text-white sm:text-5xl">
                Real Leaders.
                <span className="block bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Real Results.</span>
              </h2>
            </div>

            <motion.div
              className="flex w-max gap-5"
              animate={{ x: ["0%", "-50%"] }}
              transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
            >
              {[...testimonials, ...testimonials].map((t, i) => (
                <div
                  key={`${t.id}-${i}`}
                  className="w-80 sm:w-96 rounded-2xl border border-white/8 bg-white/3 p-6 flex-shrink-0"
                >
                  {/* Stars */}
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: t.rating }, (_, j) => (
                      <Star key={j} className="w-4 h-4 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-white/70 text-sm leading-relaxed mb-5 italic">"{t.story}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-black text-sm flex-shrink-0">
                      {t.initials}
                    </div>
                    <div>
                      <p className="text-white font-black text-sm">{t.name}</p>
                      <p className="text-white/40 text-xs">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* ──────────── FAQ ──────────── */}
      {faqs.length > 0 && (
        <section className="py-24 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950 to-slate-900/50 -z-10" />
          <div className="mx-auto max-w-4xl px-5 sm:px-8">
            <div className="text-center mb-14">
              <p className="text-xs font-black uppercase tracking-widest text-white/40 mb-3">FAQ</p>
              <h2 className="text-4xl font-black text-white sm:text-5xl">Questions IBOs Ask</h2>
            </div>
            <div className="space-y-3">
              {faqs.map((faq) => (
                <div key={faq.id} className="rounded-2xl border border-white/8 bg-white/3 overflow-hidden">
                  <button
                    className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
                    onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}
                  >
                    <span className="text-base font-black text-white pr-4">{faq.question}</span>
                    <ChevronDown
                      className={cn("h-5 w-5 text-white/30 flex-shrink-0 transition-transform duration-300", openFaq === faq.id && "rotate-180 text-cyan-400")}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {openFaq === faq.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <p className="px-6 pb-5 text-sm leading-7 text-white/55 border-t border-white/8 pt-3">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ──────────── CTA BANNER ──────────── */}
      <section className="py-20 px-5 sm:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/20 via-blue-700/15 to-violet-700/20 -z-10" />
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-cyan-500/10 rounded-full blur-3xl" />
        </div>
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-xs font-black uppercase tracking-widest text-cyan-400 mb-4">Start Now</p>
            <h2 className="text-4xl font-black text-white sm:text-5xl lg:text-6xl leading-tight">
              Start Your Diamond Journey
              <span className="block text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400 bg-clip-text">Tonight</span>
            </h2>
            <p className="mt-5 text-white/55 text-lg max-w-2xl mx-auto leading-relaxed">
              Join thousands of Ethiopian IBOs building residual income through proven duplication systems, world-class LMS training, and a community that lifts each other up.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link href={`/${locale}/auth/sign-up`}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-4 text-base font-black text-white shadow-2xl shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-shadow"
                >
                  <Sparkles className="w-5 h-5" />
                  {hero?.primaryCtaText || "Join MyUpline Now"}
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>
              <a href="#contact">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/5 px-8 py-4 text-base font-bold text-white/90 hover:bg-white/10 transition-colors backdrop-blur"
                >
                  <MessageCircle className="w-5 h-5 text-cyan-400" />
                  Talk to Our Team
                </motion.button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ──────────── FOOTER (LIVE CMS CONTROLLED) ──────────── */}
      {(() => {
        const footer = cms?.footer || {
          brandDescription: "MyUpline is the leading platform for Ethiopian network marketing IBOs — empowering leaders through technology, training, and community.",
          brandDescriptionAmharic: "ማይአፕላይን ለኢትዮጵያ ኔትወርክ ማርኬቲንግ መሪዎች ቀዳሚው መድረክ ነው — መሪዎችን በቴክኖሎጂ፣ በስልጠና እና በማህበረሰብ ያበቃል።",
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
            whatsapp: "https://wa.me/251911223344",
            twitter: "https://twitter.com/myupline_et",
            youtube: "https://youtube.com/@myuplineofficial",
            tiktok: "https://tiktok.com/@myupline.ethiopia"
          },
          platformLinks: [
            { label: "Dashboard", labelAm: "ዳሽቦርድ", href: "/en/auth" },
            { label: "LMS Academy", labelAm: "የስልጠና አካዳሚ", href: "#learning" },
            { label: "Recruitment Pipeline", labelAm: "የምልመላ ሂደት", href: "/en/auth" },
            { label: "Certificates", labelAm: "የእውቅና ሰርተፊኬቶች", href: "/en/auth" },
            { label: "Reports & Analytics", labelAm: "ሪፖርቶች እና ትንታኔ", href: "/en/auth" },
            { label: "Settings", labelAm: "ቅንብሮች", href: "/en/auth" }
          ],
          companyLinks: [
            { label: "About Us", labelAm: "ስለ እኛ", href: "#about" },
            { label: "Blog & Insights", labelAm: "ብሎግ እና ፅሁፎች", href: "#blog" },
            { label: "Leadership Team", labelAm: "የአመራር ቡድን", href: "#stories" },
            { label: "Contact Us", labelAm: "ያግኙን", href: `/${locale}/contact` },
            { label: "Privacy Policy", labelAm: "የግላዊነት ፖሊሲ", href: "#privacy" },
            { label: "Terms & Conditions", labelAm: "ውሎች እና ሁኔታዎች", href: "#terms" }
          ],
          copyrightText: "© 2026 MyUpline Global PLC. All rights reserved. Platform built for Ethiopian IBOs and network leaders.",
          copyrightTextAmharic: "© 2026 ማይአፕላይን ግሎባል ኃ/የተ/የግ/ማህበር። መብቱ በህግ የተጠበቀ ነው። ለኢትዮጵያ የኔትወርክ መሪዎች የተሰራ።",
          securityBadgeText: "RBAC-Secured · Data Encrypted · Ethiopian Business Platform"
        };

        const isAm = locale === "am";
        const brandDesc = isAm && footer.brandDescriptionAmharic ? footer.brandDescriptionAmharic : footer.brandDescription;
        const address = isAm && footer.officeAddressAmharic ? footer.officeAddressAmharic : footer.officeAddress;
        const copyright = isAm && footer.copyrightTextAmharic ? footer.copyrightTextAmharic : footer.copyrightText;

        const socialList = [
          { key: "telegram", label: "Telegram", icon: Send, url: footer.socialLinks?.telegram, bg: "hover:text-sky-400 hover:border-sky-400/50" },
          { key: "whatsapp", label: "WhatsApp", icon: MessageCircle, url: footer.socialLinks?.whatsapp, bg: "hover:text-emerald-400 hover:border-emerald-400/50" },
          { key: "facebook", label: "Facebook", icon: Facebook, url: footer.socialLinks?.facebook, bg: "hover:text-blue-500 hover:border-blue-500/50" },
          { key: "instagram", label: "Instagram", icon: Instagram, url: footer.socialLinks?.instagram, bg: "hover:text-pink-400 hover:border-pink-400/50" },
          { key: "youtube", label: "YouTube", icon: Youtube, url: footer.socialLinks?.youtube, bg: "hover:text-red-500 hover:border-red-500/50" },
          { key: "linkedin", label: "LinkedIn", icon: Linkedin, url: footer.socialLinks?.linkedin, bg: "hover:text-blue-400 hover:border-blue-400/50" },
          { key: "twitter", label: "X (Twitter)", icon: Twitter, url: footer.socialLinks?.twitter, bg: "hover:text-slate-200 hover:border-slate-400/50" }
        ].filter((s) => Boolean(s.url));

        const handleNewsletterSubmit = (e: React.FormEvent) => {
          e.preventDefault();
          if (!newsletterEmail.trim()) return;
          setNewsletterSubscribed(true);
          setTimeout(() => setNewsletterSubscribed(false), 5000);
        };

        const handleCompanyLinkClick = (link: { label: string; href: string }) => {
          if (link.href === "#privacy" || link.label.toLowerCase().includes("privacy")) {
            setPolicyModal("privacy");
          } else if (link.href === "#terms" || link.label.toLowerCase().includes("terms")) {
            setPolicyModal("terms");
          } else if (link.href === "#about" || link.label.toLowerCase().includes("about")) {
            setPolicyModal("about");
          }
        };

        return (
          <footer id="contact" className="border-t border-white/8 bg-slate-950 px-5 py-14 sm:px-8">
            <div className="mx-auto max-w-7xl grid gap-10 lg:grid-cols-[1.5fr_1fr_1fr_1.3fr]">
              {/* Column 1: Brand & Socials */}
              <div>
                <BrandLogo />
                <p className="mt-4 max-w-xs text-sm leading-7 text-white/40">
                  {brandDesc}
                </p>

                {/* Social Channels Hub */}
                <div className="mt-5 flex flex-wrap gap-2.5">
                  {socialList.map((item) => {
                    const Icon = item.icon;
                    return (
                      <a
                        key={item.key}
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(
                          "inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-white/50 transition-all duration-200 hover:bg-white/10 hover:scale-110",
                          item.bg
                        )}
                        aria-label={item.label}
                        title={item.label}
                      >
                        <Icon className="h-4 w-4" />
                      </a>
                    );
                  })}
                </div>
              </div>

              {/* Column 2: Platform Links */}
              <div>
                <h4 className="text-sm font-black text-white mb-4">
                  {isAm ? "የስርዓቱ ገጾች" : "Platform"}
                </h4>
                <div className="space-y-2.5">
                  {footer.platformLinks.map((item, idx) => {
                    const label = isAm && item.labelAm ? item.labelAm : item.label;
                    return (
                      <a
                        key={`${item.label}-${idx}`}
                        href={item.href}
                        className="block text-sm text-white/40 hover:text-cyan-300 transition-colors"
                      >
                        {label}
                      </a>
                    );
                  })}
                </div>
              </div>

              {/* Column 3: Company & Legal */}
              <div>
                <h4 className="text-sm font-black text-white mb-4">
                  {isAm ? "ኩባንያ & ህጋዊ" : "Company"}
                </h4>
                <div className="space-y-2.5">
                  {footer.companyLinks.map((item, idx) => {
                    const label = isAm && item.labelAm ? item.labelAm : item.label;
                    if (item.href.startsWith("/") && !item.href.startsWith("#")) {
                      return (
                        <Link
                          key={`${item.label}-${idx}`}
                          href={item.href}
                          className="block text-sm text-white/40 hover:text-cyan-300 transition-colors"
                        >
                          {label}
                        </Link>
                      );
                    }
                    return (
                      <a
                        key={`${item.label}-${idx}`}
                        href={item.href}
                        onClick={(e) => {
                          if (item.href.startsWith("#privacy") || item.href.startsWith("#terms") || item.href.startsWith("#about")) {
                            e.preventDefault();
                            handleCompanyLinkClick(item);
                          }
                        }}
                        className="block text-sm text-white/40 hover:text-cyan-300 transition-colors cursor-pointer"
                      >
                        {label}
                      </a>
                    );
                  })}
                </div>
              </div>

              {/* Column 4: Direct Contact & Newsletter */}
              <div>
                <h4 className="text-sm font-black text-white mb-3">
                  {isAm ? "ቀጥታ አድራሻ እና ግንኙነት" : "Contact & Support"}
                </h4>
                
                {/* Contact Hotlines */}
                <div className="space-y-2 text-xs text-white/60 mb-5">
                  <a
                    href={`mailto:${footer.contactEmail}`}
                    className="flex items-center gap-2 hover:text-white transition-colors"
                  >
                    <Mail className="h-3.5 w-3.5 text-cyan-400 flex-shrink-0" />
                    <span>{footer.contactEmail}</span>
                  </a>
                  <a
                    href={`tel:${footer.contactPhone}`}
                    className="flex items-center gap-2 hover:text-white transition-colors"
                  >
                    <Phone className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0" />
                    <span>{footer.contactPhone}</span>
                  </a>
                  <div className="flex items-start gap-2 pt-0.5">
                    <MapPin className="h-3.5 w-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                    <span className="text-[11px] leading-relaxed text-white/50">{address}</span>
                  </div>
                </div>

                <p className="text-xs text-white/40 mb-2">
                  {isAm ? "የስልጠና ማስታወቂያዎችን በኢሜልዎ ያግኙ" : "Get cohort launch updates in your inbox."}
                </p>

                {newsletterSubscribed ? (
                  <div className="rounded-lg bg-emerald-500/20 border border-emerald-500/30 p-2.5 text-center text-xs font-bold text-emerald-300 animate-in fade-in">
                    ✓ {isAm ? "እናመሰግናለን! በተሳካ ሁኔታ ተመዝግበዋል።" : "Subscribed! Welcome to the cohort."}
                  </div>
                ) : (
                  <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                    <label className="sr-only" htmlFor="newsletter-email">Email</label>
                    <input
                      id="newsletter-email"
                      type="email"
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="h-10 min-w-0 flex-1 rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-cyan-500 transition-colors"
                      required
                    />
                    <button
                      type="submit"
                      className="h-10 w-10 flex-shrink-0 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-md hover:brightness-110 transition"
                      aria-label="Subscribe"
                    >
                      <Mail className="h-4 w-4" />
                    </button>
                  </form>
                )}

                <div className="mt-4 pt-3 border-t border-white/8 flex items-center justify-between">
                  <Link
                    href={`/${locale}/contact`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-cyan-400 hover:text-white transition"
                  >
                    <ExternalLink className="h-3 w-3" />
                    {isAm ? "ሙሉ የድጋፍ ገጽ" : "Dedicated Support Page"}
                  </Link>

                  <div className="flex items-center gap-2">
                    <Link href="/en" className={cn("text-xs font-bold transition", locale === "en" ? "text-cyan-400 font-black" : "text-white/40 hover:text-white")}>
                      EN
                    </Link>
                    <span className="text-white/20">·</span>
                    <Link href="/am" className={cn("text-xs font-bold transition", locale === "am" ? "text-cyan-400 font-black" : "text-white/40 hover:text-white")}>
                      አማርኛ
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="mx-auto max-w-7xl mt-12 pt-6 border-t border-white/8 flex flex-wrap items-center justify-between gap-4">
              <p className="text-xs text-white/25">
                {copyright}
              </p>
              <div className="flex items-center gap-2 text-xs text-white/25">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                {footer.securityBadgeText || "RBAC-Secured · Data Encrypted · Ethiopian Business Platform"}
              </div>
            </div>
          </footer>
        );
      })()}

      {/* ──────────── BLOG ARTICLE MODAL ──────────── */}
      <AnimatePresence>
        {selectedPost && (
          <BlogArticleModal post={selectedPost} onClose={() => setSelectedPost(null)} />
        )}
      </AnimatePresence>

      {/* ──────────── LEGAL / ABOUT MODAL ──────────── */}
      <AnimatePresence>
        {policyModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-in fade-in">
            <div className="relative max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-white/15 bg-slate-900 p-6 sm:p-8 text-white shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-300">
                    <Shield className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white">
                      {policyModal === "privacy"
                        ? "Privacy Policy"
                        : policyModal === "terms"
                        ? "Terms & Conditions"
                        : "About MyUpline Global"}
                    </h3>
                    <p className="text-xs text-slate-400">Official Platform Documentation · Updated 2026</p>
                  </div>
                </div>
                <button
                  onClick={() => setPolicyModal(null)}
                  className="rounded-xl p-2 hover:bg-white/10 text-slate-400 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-5 space-y-4 text-xs text-slate-300 leading-relaxed">
                {policyModal === "privacy" && (
                  <>
                    <p>
                      MyUpline Global PLC respects the privacy of all registered members, distributors, and visitors. All personal information, downline tracking records, and identity documents are encrypted in transit and at rest.
                    </p>
                    <p className="font-bold text-white">1. Information We Collect</p>
                    <p>
                      We collect necessary identification data (Full Name, Phone Number, Email, and Region) solely to administer your MLM distribution lineage, process membership package verifications, and disburse recognized achievement credentials.
                    </p>
                    <p className="font-bold text-white">2. Role-Based Data Isolation</p>
                    <p>
                      Through strict Role-Based Access Control (RBAC), team leaders and trainers only access prospects and cohort members who have explicitly opted into their direct genealogy. Super Admins enforce compliance with Ethiopian electronic commerce laws.
                    </p>
                    <p className="font-bold text-white">3. Contact Inquiries</p>
                    <p>
                      For privacy inquiries or account closure requests, contact our Data Protection Officer at support@myupline.org.
                    </p>
                  </>
                )}

                {policyModal === "terms" && (
                  <>
                    <p>
                      By registering an account with MyUpline Global, you agree to abide by our Code of Ethics, Duplication Guidelines, and membership terms.
                    </p>
                    <p className="font-bold text-white">1. Independent Business Ownership</p>
                    <p>
                      All members participate as Independent Business Owners (IBOs). Participation in leadership cohorts and use of the LMS Academy does not constitute an employer-employee relationship.
                    </p>
                    <p className="font-bold text-white">2. Manual Payment Verification Protocol</p>
                    <p>
                      Membership packages require manual bank transfer submission (via CBE, Telebirr, or Awash Bank). Submissions are audited by authorized finance admins before tier activation.
                    </p>
                    <p className="font-bold text-white">3. Ethical Conduct</p>
                    <p>
                      Cross-sponsoring, aggressive unapproved claims, and unauthorized poaching between squads is strictly forbidden and grounds for immediate suspension.
                    </p>
                  </>
                )}

                {policyModal === "about" && (
                  <>
                    <p>
                      MyUpline Global is Ethiopia's premier enterprise network marketing enablement ecosystem. Founded to provide Ethiopian entrepreneurs with world-class digital tools, we bridge traditional warm-market duplication with modern digital technology.
                    </p>
                    <p className="font-bold text-white">Our Mission</p>
                    <p>
                      To elevate the dignity and earning power of over 100,000 Ethiopian network marketing leaders by 2030 through systematic education, structured prospect pipelines, and unshakeable community support.
                    </p>
                    <p className="font-bold text-white">Headquarters</p>
                    <p>
                      Operating from our flagship leadership faculty in Addis Ababa, Ethiopia, supporting teams across Oromia, Amhara, Tigray, Sidama, and international diaspora hubs.
                    </p>
                  </>
                )}
              </div>

              <div className="mt-6 flex justify-end border-t border-white/10 pt-4">
                <Button
                  variant="primary"
                  onClick={() => setPolicyModal(null)}
                  className="brand-gradient text-brand-navy font-bold text-xs"
                >
                  Close Document
                </Button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
