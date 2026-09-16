"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileEdit,
  Plus,
  Trash2,
  Edit3,
  Eye,
  Star,
  Globe,
  BookOpen,
  MessageSquare,
  HelpCircle,
  Save,
  X,
  Upload,
  CheckCircle,
  Clock,
  Tag,
  User,
  BarChart3,
  Megaphone,
  Image as ImageIcon,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  ToggleLeft,
  ToggleRight,
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  ExternalLink,
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
  Twitter,
  Send,
  Share2,
  RotateCcw,
  PlusCircle,
  Sparkles,
  Layers,
  ShieldCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { StoredCmsFooter, StoredSocialLinks, StoredFooterLink } from "@/lib/db-store";

/* ─────────────────────────── TYPES ─────────────────────────── */
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
  createdAt: string;
  updatedAt: string;
}

interface CmsHero {
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
}

interface Testimonial {
  id: string;
  name: string;
  role: string;
  story: string;
  initials: string;
  rating: number;
  location?: string;
}

interface Faq {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
}

interface CmsData {
  hero: CmsHero;
  testimonials: Testimonial[];
  faqs: Faq[];
  footer?: StoredCmsFooter;
}

/* ─────────────────────────── CONSTANTS ─────────────────────────── */
const BLOG_CATEGORIES = [
  "Duplication",
  "Recruitment",
  "Personal Growth",
  "Leadership",
  "Financial Freedom",
  "Training",
  "Announcements"
];

const FAQ_CATEGORIES = [
  "General",
  "Registration & Payment",
  "Training",
  "Recruitment",
  "Security",
  "Technical"
];

const TABS = [
  { id: "blog", label: "Blog Articles", icon: BookOpen },
  { id: "hero", label: "Hero & Announcement", icon: Megaphone },
  { id: "testimonials", label: "Testimonials", icon: MessageSquare },
  { id: "faqs", label: "FAQs", icon: HelpCircle },
  { id: "footer", label: "Footer & Social Media", icon: Globe }
] as const;

type TabId = (typeof TABS)[number]["id"];

/* ─────────────────────────── HELPERS ─────────────────────────── */
function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function formatDate(iso?: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-ET", {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}

/* ─────────────────────────── MAIN COMPONENT ─────────────────────────── */
export function CmsBlogStudio() {
  const [activeTab, setActiveTab] = useState<TabId>("blog");
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [cmsData, setCmsData] = useState<CmsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  // Blog modal state
  const [blogModal, setBlogModal] = useState<"create" | "edit" | "preview" | null>(null);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);

  // Testimonial modal state
  const [tstModal, setTstModal] = useState<"create" | "edit" | null>(null);
  const [editingTst, setEditingTst] = useState<Testimonial | null>(null);

  // FAQ modal state
  const [faqModal, setFaqModal] = useState<"create" | "edit" | null>(null);
  const [editingFaq, setEditingFaq] = useState<Faq | null>(null);

  // Hero save state
  const [heroSaving, setHeroSaving] = useState(false);
  const [heroForm, setHeroForm] = useState<CmsHero | null>(null);

  // Footer save state
  const [footerSaving, setFooterSaving] = useState(false);
  const [footerForm, setFooterForm] = useState<StoredCmsFooter | null>(null);

  const showToast = useCallback((msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  }, []);

  /* ─── Fetch ─── */
  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [blogRes, cmsRes] = await Promise.all([
        fetch("/api/blog"),
        fetch("/api/cms")
      ]);
      const blogJson = await blogRes.json();
      const cmsJson = await cmsRes.json();
      setPosts(blogJson.data?.posts || []);
      const cms = cmsJson.data?.cms;
      setCmsData(cms || null);
      setHeroForm(cms?.hero || null);
      if (cms?.footer) {
        setFooterForm(cms.footer);
      }
      setFetched(true);
    } catch {
      showToast("Failed to load CMS data", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  const saveFooter = async () => {
    if (!footerForm) return;
    setFooterSaving(true);
    try {
      const res = await fetch("/api/cms", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: "footer", footer: footerForm })
      });
      if (!res.ok) throw new Error();
      const json = await res.json();
      const saved = json.data?.footer;
      if (saved) {
        setFooterForm(saved);
        setCmsData((prev) => (prev ? { ...prev, footer: saved } : null));
      }
      showToast("Footer, social media & contact info saved successfully!");
    } catch {
      showToast("Failed to update footer content", "error");
    } finally {
      setFooterSaving(false);
    }
  };

  const resetFooterDefaults = async () => {
    if (!confirm("Reset public footer and contact details to factory defaults?")) return;
    setFooterSaving(true);
    try {
      const defaultData: Partial<StoredCmsFooter> = {
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
        }
      };
      const res = await fetch("/api/cms", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: "footer", footer: defaultData })
      });
      if (!res.ok) throw new Error();
      const json = await res.json();
      if (json.data?.footer) {
        setFooterForm(json.data.footer);
        setCmsData((prev) => (prev ? { ...prev, footer: json.data.footer } : null));
      }
      showToast("Reset to factory defaults successfully!");
    } catch {
      showToast("Failed to reset defaults", "error");
    } finally {
      setFooterSaving(false);
    }
  };

  if (!fetched && !loading) fetchAll();

  /* ─── Blog CRUD ─── */
  const saveBlogPost = async (form: Partial<BlogPost>) => {
    setLoading(true);
    try {
      const isEdit = !!form.id;
      const res = await fetch("/api/blog", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      if (!res.ok) throw new Error();
      const json = await res.json();
      const saved = json.data?.post;
      if (isEdit) {
        setPosts((prev) => prev.map((p) => (p.id === saved.id ? saved : p)));
      } else {
        setPosts((prev) => [saved, ...prev]);
      }
      setBlogModal(null);
      setEditingPost(null);
      showToast(isEdit ? "Article updated successfully" : "Article published successfully");
    } catch {
      showToast("Failed to save article", "error");
    } finally {
      setLoading(false);
    }
  };

  const deleteBlogPost = async (id: string) => {
    if (!confirm("Delete this blog article permanently?")) return;
    try {
      const res = await fetch(`/api/blog?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setPosts((prev) => prev.filter((p) => p.id !== id));
      showToast("Article deleted");
    } catch {
      showToast("Failed to delete article", "error");
    }
  };

  const togglePublished = async (post: BlogPost) => {
    try {
      const res = await fetch("/api/blog", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: post.id, isPublished: !post.isPublished })
      });
      if (!res.ok) throw new Error();
      const json = await res.json();
      const saved = json.data?.post;
      setPosts((prev) => prev.map((p) => (p.id === saved.id ? saved : p)));
      showToast(saved.isPublished ? "Article published" : "Moved to draft");
    } catch {
      showToast("Failed to update status", "error");
    }
  };

  /* ─── Hero Save ─── */
  const saveHero = async () => {
    if (!heroForm) return;
    setHeroSaving(true);
    try {
      const res = await fetch("/api/cms", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: "hero", hero: heroForm })
      });
      if (!res.ok) throw new Error();
      showToast("Hero & Announcement updated live!");
    } catch {
      showToast("Failed to save hero content", "error");
    } finally {
      setHeroSaving(false);
    }
  };

  /* ─── Testimonial CRUD ─── */
  const saveTestimonial = async (form: Partial<Testimonial>) => {
    setLoading(true);
    try {
      const isEdit = !!form.id;
      const res = await fetch("/api/cms", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: "testimonial",
          action: isEdit ? "update" : "create",
          testimonial: form
        })
      });
      if (!res.ok) throw new Error();
      const json = await res.json();
      const saved = json.data?.testimonial;
      setCmsData((prev) =>
        prev
          ? {
              ...prev,
              testimonials: isEdit
                ? prev.testimonials.map((t) => (t.id === saved.id ? saved : t))
                : [...prev.testimonials, saved]
            }
          : prev
      );
      setTstModal(null);
      setEditingTst(null);
      showToast("Testimonial saved");
    } catch {
      showToast("Failed to save testimonial", "error");
    } finally {
      setLoading(false);
    }
  };

  const deleteTestimonial = async (id: string) => {
    if (!confirm("Remove this testimonial?")) return;
    try {
      const res = await fetch("/api/cms", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: "testimonial", action: "delete", deleteId: id })
      });
      if (!res.ok) throw new Error();
      setCmsData((prev) =>
        prev ? { ...prev, testimonials: prev.testimonials.filter((t) => t.id !== id) } : prev
      );
      showToast("Testimonial removed");
    } catch {
      showToast("Failed to remove", "error");
    }
  };

  /* ─── FAQ CRUD ─── */
  const saveFaq = async (form: Partial<Faq>) => {
    setLoading(true);
    try {
      const isEdit = !!form.id;
      const res = await fetch("/api/cms", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: "faq",
          action: isEdit ? "update" : "create",
          faq: form
        })
      });
      if (!res.ok) throw new Error();
      const json = await res.json();
      const saved = json.data?.faq;
      setCmsData((prev) =>
        prev
          ? {
              ...prev,
              faqs: isEdit
                ? prev.faqs.map((f) => (f.id === saved.id ? saved : f))
                : [...prev.faqs, saved].sort((a, b) => a.order - b.order)
            }
          : prev
      );
      setFaqModal(null);
      setEditingFaq(null);
      showToast("FAQ saved");
    } catch {
      showToast("Failed to save FAQ", "error");
    } finally {
      setLoading(false);
    }
  };

  const deleteFaq = async (id: string) => {
    if (!confirm("Delete this FAQ?")) return;
    try {
      const res = await fetch("/api/cms", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: "faq", action: "delete", deleteId: id })
      });
      if (!res.ok) throw new Error();
      setCmsData((prev) =>
        prev ? { ...prev, faqs: prev.faqs.filter((f) => f.id !== id) } : prev
      );
      showToast("FAQ deleted");
    } catch {
      showToast("Failed to delete FAQ", "error");
    }
  };

  /* ─────────────────── RENDER ─────────────────── */
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={cn(
              "fixed top-4 right-4 z-[200] flex items-center gap-2 px-4 py-3 rounded-xl shadow-xl text-sm font-medium border",
              toast.type === "success"
                ? "bg-emerald-900/90 border-emerald-500/30 text-emerald-100"
                : "bg-red-900/90 border-red-500/30 text-red-100"
            )}
          >
            {toast.type === "success" ? (
              <CheckCircle className="w-4 h-4 text-emerald-400" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-red-400" />
            )}
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="px-6 pt-6 pb-0">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
            <Globe className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">CMS & Blog Studio</h1>
            <p className="text-slate-400 text-xs">
              Manage your public website content, blog articles, and landing page
            </p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <div className="px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-full text-emerald-300 text-xs font-medium">
              🟢 Live Changes Active
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mt-4 border-b border-white/10">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-t-lg transition-all",
                  activeTab === tab.id
                    ? "bg-white/10 text-white border-b-2 border-violet-400"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                )}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {loading && !fetched ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-2 border-violet-400 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {activeTab === "blog" && (
              <BlogTab
                posts={posts}
                onAdd={() => { setEditingPost(null); setBlogModal("create"); }}
                onEdit={(p) => { setEditingPost(p); setBlogModal("edit"); }}
                onPreview={(p) => { setEditingPost(p); setBlogModal("preview"); }}
                onDelete={deleteBlogPost}
                onTogglePublished={togglePublished}
              />
            )}
            {activeTab === "hero" && heroForm && (
              <HeroTab
                form={heroForm}
                onChange={setHeroForm}
                onSave={saveHero}
                saving={heroSaving}
              />
            )}
            {activeTab === "testimonials" && cmsData && (
              <TestimonialsTab
                testimonials={cmsData.testimonials}
                onAdd={() => { setEditingTst(null); setTstModal("create"); }}
                onEdit={(t) => { setEditingTst(t); setTstModal("edit"); }}
                onDelete={deleteTestimonial}
              />
            )}
            {activeTab === "faqs" && cmsData && (
              <FaqsTab
                faqs={cmsData.faqs}
                onAdd={() => { setEditingFaq(null); setFaqModal("create"); }}
                onEdit={(f) => { setEditingFaq(f); setFaqModal("edit"); }}
                onDelete={deleteFaq}
              />
            )}
            {activeTab === "footer" && footerForm && (
              <FooterTab
                form={footerForm}
                onChange={setFooterForm}
                onSave={saveFooter}
                onResetDefaults={resetFooterDefaults}
                saving={footerSaving}
              />
            )}
          </>
        )}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {(blogModal === "create" || blogModal === "edit") && (
          <BlogFormModal
            post={editingPost}
            onSave={saveBlogPost}
            onClose={() => { setBlogModal(null); setEditingPost(null); }}
          />
        )}
        {blogModal === "preview" && editingPost && (
          <BlogPreviewModal
            post={editingPost}
            onClose={() => { setBlogModal(null); setEditingPost(null); }}
          />
        )}
        {(tstModal === "create" || tstModal === "edit") && (
          <TestimonialFormModal
            testimonial={editingTst}
            onSave={saveTestimonial}
            onClose={() => { setTstModal(null); setEditingTst(null); }}
          />
        )}
        {(faqModal === "create" || faqModal === "edit") && (
          <FaqFormModal
            faq={editingFaq}
            onSave={saveFaq}
            onClose={() => { setFaqModal(null); setEditingFaq(null); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   BLOG TAB
═══════════════════════════════════════════════════════════════ */
function BlogTab({
  posts,
  onAdd,
  onEdit,
  onPreview,
  onDelete,
  onTogglePublished
}: {
  posts: BlogPost[];
  onAdd: () => void;
  onEdit: (p: BlogPost) => void;
  onPreview: (p: BlogPost) => void;
  onDelete: (id: string) => void;
  onTogglePublished: (p: BlogPost) => void;
}) {
  const published = posts.filter((p) => p.isPublished).length;
  const drafts = posts.filter((p) => !p.isPublished).length;
  const featured = posts.filter((p) => p.featured).length;

  return (
    <div className="space-y-4">
      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {[
          { label: "Total Articles", value: posts.length, color: "from-violet-500 to-indigo-600" },
          { label: "Published", value: published, color: "from-emerald-500 to-teal-600" },
          { label: "Drafts", value: drafts, color: "from-amber-500 to-orange-600" }
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center gap-3"
          >
            <div className={cn("w-8 h-8 rounded-lg bg-gradient-to-br flex items-center justify-center text-white font-bold text-sm", stat.color)}>
              {stat.value}
            </div>
            <span className="text-slate-300 text-sm">{stat.label}</span>
          </div>
        ))}
      </div>

      {/* Table header */}
      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h2 className="font-semibold text-white flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-violet-400" />
            All Articles
          </h2>
          <Button variant="primary" onClick={onAdd}>
            <Plus className="w-4 h-4 mr-1" /> New Article
          </Button>
        </div>

        {posts.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p>No articles yet. Create your first blog post!</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {posts.map((post) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-4 p-4 hover:bg-white/5 transition-colors"
              >
                {/* Thumbnail */}
                <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-white/10">
                  {post.coverImage ? (
                    <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="w-5 h-5 text-slate-500" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/20">
                      {post.category}
                    </span>
                    {post.featured && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/20 flex items-center gap-1">
                        <Star className="w-3 h-3" /> Featured
                      </span>
                    )}
                    {post.isPublished ? (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/20">
                        Published
                      </span>
                    ) : (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-slate-500/20 text-slate-400 border border-slate-500/20">
                        Draft
                      </span>
                    )}
                  </div>
                  <p className="text-white text-sm font-medium truncate">{post.title}</p>
                  <div className="flex items-center gap-3 mt-0.5 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" /> {post.author}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {post.readTimeMinutes} min read
                    </span>
                    <span>{formatDate(post.publishedAt || post.createdAt)}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => onTogglePublished(post)}
                    className={cn(
                      "flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition-all",
                      post.isPublished
                        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400"
                        : "bg-slate-500/10 border-slate-500/30 text-slate-400 hover:bg-emerald-500/10 hover:border-emerald-500/30 hover:text-emerald-400"
                    )}
                    title={post.isPublished ? "Move to Draft" : "Publish Now"}
                  >
                    {post.isPublished ? <ToggleRight className="w-3 h-3" /> : <ToggleLeft className="w-3 h-3" />}
                    {post.isPublished ? "Live" : "Draft"}
                  </button>
                  <button
                    onClick={() => onPreview(post)}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                    title="Preview"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onEdit(post)}
                    className="p-1.5 rounded-lg bg-violet-500/10 hover:bg-violet-500/20 text-violet-400 hover:text-violet-300 transition-colors"
                    title="Edit"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(post.id)}
                    className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   HERO TAB
═══════════════════════════════════════════════════════════════ */
function HeroTab({
  form,
  onChange,
  onSave,
  saving
}: {
  form: CmsHero;
  onChange: (f: CmsHero) => void;
  onSave: () => void;
  saving: boolean;
}) {
  const field = (label: string, key: keyof CmsHero, placeholder?: string) => (
    <div>
      <label className="block text-xs font-medium text-slate-400 mb-1.5">{label}</label>
      <input
        value={typeof form[key] === "object" ? "" : String(form[key] ?? "")}
        onChange={(e) => onChange({ ...form, [key]: e.target.value })}
        placeholder={placeholder}
        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder-slate-500 focus:border-violet-500 focus:outline-none"
      />
    </div>
  );

  return (
    <div className="space-y-4 max-w-2xl">
      <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
        <h2 className="font-semibold text-white flex items-center gap-2 mb-1">
          <Megaphone className="w-4 h-4 text-amber-400" /> Hero & Announcement Settings
        </h2>

        <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl">
          <label className="block text-xs font-medium text-amber-300 mb-1.5">
            🔥 Live Announcement Bar (top of landing page)
          </label>
          <input
            value={form.announcement}
            onChange={(e) => onChange({ ...form, announcement: e.target.value })}
            placeholder="e.g. 🔥 New Diamond Cohort Starting Tonight at 8:00 PM Equal Time!"
            className="w-full px-3 py-2 bg-black/20 border border-amber-500/20 rounded-lg text-white text-sm placeholder-slate-500 focus:border-amber-400 focus:outline-none"
          />
        </div>

        {field("Hero Badge Text", "badgeText", "e.g. 🚀 Ethiopia's #1 Network Business Platform")}
        
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5">Main Headline</label>
          <textarea
            value={form.headline}
            onChange={(e) => onChange({ ...form, headline: e.target.value })}
            rows={2}
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder-slate-500 focus:border-violet-500 focus:outline-none resize-none"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5">Subheadline / Description</label>
          <textarea
            value={form.subheadline}
            onChange={(e) => onChange({ ...form, subheadline: e.target.value })}
            rows={3}
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder-slate-500 focus:border-violet-500 focus:outline-none resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          {field("Primary CTA Text", "primaryCtaText")}
          {field("Primary CTA Link", "primaryCtaLink")}
          {field("Secondary CTA Text", "secondaryCtaText")}
          {field("Secondary CTA Link", "secondaryCtaLink")}
        </div>

        <div className="pt-2 border-t border-white/10">
          <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-cyan-400" /> Live Statistics (shown as animated counters)
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Active IBO Members", key: "activeMembers" },
              { label: "Monthly Volume (ETB)", key: "monthlyVolumeETB" },
              { label: "Courses Completed", key: "coursesCompleted" },
              { label: "Countries Active", key: "countriesActive" }
            ].map(({ label, key }) => (
              <div key={key}>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">{label}</label>
                <input
                  type="number"
                  value={form.stats[key as keyof typeof form.stats]}
                  onChange={(e) =>
                    onChange({
                      ...form,
                      stats: { ...form.stats, [key]: parseInt(e.target.value) || 0 }
                    })
                  }
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-violet-500 focus:outline-none"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="pt-3">
          <Button variant="primary" onClick={onSave} disabled={saving}>
            {saving ? (
              <span className="flex items-center gap-2">
                <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
                Saving...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Save className="w-4 h-4" /> Save & Apply Live
              </span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   TESTIMONIALS TAB
═══════════════════════════════════════════════════════════════ */
function TestimonialsTab({
  testimonials,
  onAdd,
  onEdit,
  onDelete
}: {
  testimonials: Testimonial[];
  onAdd: () => void;
  onEdit: (t: Testimonial) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h2 className="font-semibold text-white flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-cyan-400" />
            Success Stories & Testimonials
          </h2>
          <Button variant="primary" onClick={onAdd}>
            <Plus className="w-4 h-4 mr-1" /> Add Testimonial
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-0 divide-y divide-white/5">
          {testimonials.map((t) => (
            <div key={t.id} className="flex items-start gap-4 p-4 hover:bg-white/5 transition-colors">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                {t.initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-white text-sm font-medium">{t.name}</span>
                  <div className="flex">
                    {Array.from({ length: t.rating }, (_, i) => (
                      <Star key={i} className="w-3 h-3 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                </div>
                <p className="text-slate-400 text-xs mb-1">{t.role}</p>
                <p className="text-slate-300 text-sm line-clamp-2">{t.story}</p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={() => onEdit(t)}
                  className="p-1.5 rounded-lg bg-violet-500/10 hover:bg-violet-500/20 text-violet-400 transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(t.id)}
                  className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   FAQS TAB
═══════════════════════════════════════════════════════════════ */
function FaqsTab({
  faqs,
  onAdd,
  onEdit,
  onDelete
}: {
  faqs: Faq[];
  onAdd: () => void;
  onEdit: (f: Faq) => void;
  onDelete: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h2 className="font-semibold text-white flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-green-400" />
            Frequently Asked Questions
          </h2>
          <Button variant="primary" onClick={onAdd}>
            <Plus className="w-4 h-4 mr-1" /> Add FAQ
          </Button>
        </div>
        <div className="divide-y divide-white/5">
          {faqs.map((faq) => (
            <div key={faq.id} className="p-4 hover:bg-white/5 transition-colors">
              <div className="flex items-start gap-3">
                <button
                  onClick={() => setExpanded(expanded === faq.id ? null : faq.id)}
                  className="flex-1 flex items-center justify-between text-left min-w-0"
                >
                  <span className="text-white text-sm font-medium pr-3">{faq.question}</span>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-slate-400">
                      {faq.category}
                    </span>
                    {expanded === faq.id ? (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                </button>
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => onEdit(faq)}
                    className="p-1.5 rounded-lg bg-violet-500/10 hover:bg-violet-500/20 text-violet-400 transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDelete(faq.id)}
                    className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              {expanded === faq.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-2 pl-0 text-slate-300 text-sm leading-relaxed"
                >
                  {faq.answer}
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   BLOG FORM MODAL
═══════════════════════════════════════════════════════════════ */
function BlogFormModal({
  post,
  onSave,
  onClose
}: {
  post: BlogPost | null;
  onSave: (form: Partial<BlogPost>) => void;
  onClose: () => void;
}) {
  const isEdit = !!post;
  const [form, setForm] = useState<Partial<BlogPost>>({
    title: post?.title || "",
    slug: post?.slug || "",
    excerpt: post?.excerpt || "",
    content: post?.content || "",
    coverImage: post?.coverImage || "",
    author: post?.author || "",
    authorRole: post?.authorRole || "",
    category: post?.category || BLOG_CATEGORIES[0],
    tags: post?.tags || [],
    readTimeMinutes: post?.readTimeMinutes || 5,
    isPublished: post?.isPublished || false,
    featured: post?.featured || false,
    id: post?.id
  });
  const [tagInput, setTagInput] = useState("");
  const coverFileRef = useRef<HTMLInputElement>(null);

  const handleTitleChange = (title: string) => {
    setForm((f) => ({ ...f, title, slug: isEdit ? f.slug : slugify(title) }));
  };

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !form.tags?.includes(tag)) {
      setForm((f) => ({ ...f, tags: [...(f.tags || []), tag] }));
    }
    setTagInput("");
  };

  const handleCoverFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setForm((f) => ({ ...f, coverImage: reader.result as string }));
    reader.readAsDataURL(file);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-2xl"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <h2 className="font-bold text-white text-lg flex items-center gap-2">
            <FileEdit className="w-5 h-5 text-violet-400" />
            {isEdit ? "Edit Article" : "New Blog Article"}
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto p-5 space-y-4" style={{ maxHeight: "calc(90vh - 140px)" }}>
          {/* Title */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Article Title *</label>
            <input
              value={form.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Write a compelling article title..."
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder-slate-500 focus:border-violet-500 focus:outline-none"
            />
          </div>

          {/* Slug */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">URL Slug</label>
            <input
              value={form.slug}
              onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white/70 text-sm font-mono focus:border-violet-500 focus:outline-none"
            />
          </div>

          {/* Cover Image */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Cover Image</label>
            <div className="flex gap-2">
              <input
                value={form.coverImage?.startsWith("data:") ? "" : (form.coverImage || "")}
                onChange={(e) => setForm((f) => ({ ...f, coverImage: e.target.value }))}
                placeholder="https://images.unsplash.com/..."
                className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder-slate-500 focus:border-violet-500 focus:outline-none"
              />
              <button
                onClick={() => coverFileRef.current?.click()}
                className="px-3 py-2 bg-white/10 hover:bg-white/15 border border-white/10 rounded-lg text-slate-300 text-sm flex items-center gap-1.5 transition-colors"
              >
                <Upload className="w-4 h-4" /> Upload
              </button>
              <input ref={coverFileRef} type="file" accept="image/*" className="hidden" onChange={handleCoverFile} />
            </div>
            {form.coverImage && (
              <div className="mt-2 h-32 rounded-lg overflow-hidden">
                <img src={form.coverImage} alt="Cover preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          {/* Author & Category row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Author Name *</label>
              <input
                value={form.author}
                onChange={(e) => setForm((f) => ({ ...f, author: e.target.value }))}
                placeholder="Coach Dawit Mengistu"
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder-slate-500 focus:border-violet-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Author Role / Title *</label>
              <input
                value={form.authorRole}
                onChange={(e) => setForm((f) => ({ ...f, authorRole: e.target.value }))}
                placeholder="Crown Diamond Master Trainer"
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder-slate-500 focus:border-violet-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Category *</label>
              <select
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                className="w-full px-3 py-2 bg-slate-800 border border-white/10 rounded-lg text-white text-sm focus:border-violet-500 focus:outline-none"
              >
                {BLOG_CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Read Time (minutes)</label>
              <input
                type="number"
                min={1}
                max={60}
                value={form.readTimeMinutes}
                onChange={(e) => setForm((f) => ({ ...f, readTimeMinutes: parseInt(e.target.value) || 5 }))}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-violet-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Excerpt / Summary *</label>
            <textarea
              value={form.excerpt}
              onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
              rows={2}
              placeholder="Write a compelling 1-2 sentence summary..."
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder-slate-500 focus:border-violet-500 focus:outline-none resize-none"
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">
              Full Article Content * <span className="text-slate-500">(Markdown supported: ## Headings, **bold**, - lists)</span>
            </label>
            <textarea
              value={form.content}
              onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
              rows={12}
              placeholder="## Introduction&#10;&#10;Write your full article content here...&#10;&#10;## Key Points&#10;&#10;- Point one&#10;- Point two"
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder-slate-500 focus:border-violet-500 focus:outline-none resize-y font-mono"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Tags</label>
            <div className="flex gap-2 mb-2">
              <input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                placeholder="Type a tag and press Enter or Add"
                className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder-slate-500 focus:border-violet-500 focus:outline-none"
              />
              <button onClick={addTag} className="px-3 py-2 bg-white/10 hover:bg-white/15 border border-white/10 rounded-lg text-slate-300 text-sm transition-colors">
                <Tag className="w-4 h-4" />
              </button>
            </div>
            {(form.tags?.length || 0) > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {form.tags?.map((tag) => (
                  <span key={tag} className="flex items-center gap-1 px-2.5 py-1 bg-violet-500/20 border border-violet-500/20 text-violet-300 text-xs rounded-full">
                    {tag}
                    <button onClick={() => setForm((f) => ({ ...f, tags: f.tags?.filter((t) => t !== tag) }))}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Toggles */}
          <div className="flex gap-4 pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <div
                onClick={() => setForm((f) => ({ ...f, isPublished: !f.isPublished }))}
                className={cn(
                  "w-10 h-5 rounded-full transition-colors relative flex items-center",
                  form.isPublished ? "bg-emerald-500" : "bg-white/20"
                )}
              >
                <div className={cn(
                  "w-4 h-4 bg-white rounded-full absolute transition-all shadow",
                  form.isPublished ? "left-5" : "left-0.5"
                )} />
              </div>
              <span className="text-sm text-slate-300">Publish immediately</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <div
                onClick={() => setForm((f) => ({ ...f, featured: !f.featured }))}
                className={cn(
                  "w-10 h-5 rounded-full transition-colors relative flex items-center",
                  form.featured ? "bg-amber-500" : "bg-white/20"
                )}
              >
                <div className={cn(
                  "w-4 h-4 bg-white rounded-full absolute transition-all shadow",
                  form.featured ? "left-5" : "left-0.5"
                )} />
              </div>
              <span className="text-sm text-slate-300 flex items-center gap-1"><Star className="w-3 h-3 text-amber-400" /> Feature this article</span>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-5 border-t border-white/10">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={() => onSave(form)}>
            <Save className="w-4 h-4 mr-1" />
            {isEdit ? "Save Changes" : "Create Article"}
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   BLOG PREVIEW MODAL
═══════════════════════════════════════════════════════════════ */
function BlogPreviewModal({ post, onClose }: { post: BlogPost; onClose: () => void }) {
  const renderContent = (content: string) => {
    const lines = content.split("\n");
    return lines.map((line, i) => {
      if (line.startsWith("## ")) return <h2 key={i} className="text-xl font-bold text-white mt-6 mb-3">{line.slice(3)}</h2>;
      if (line.startsWith("### ")) return <h3 key={i} className="text-lg font-semibold text-white mt-4 mb-2">{line.slice(4)}</h3>;
      if (line.startsWith("**") && line.endsWith("**")) return <p key={i} className="font-bold text-white mb-2">{line.slice(2, -2)}</p>;
      if (line.startsWith("- ")) return <li key={i} className="text-slate-300 ml-4 list-disc mb-1">{line.slice(2)}</li>;
      if (line.startsWith("*Script:*")) return <p key={i} className="text-emerald-300 italic mb-2">{line.replace("*Script:*", "")}</p>;
      if (line.trim() === "") return <br key={i} />;
      return <p key={i} className="text-slate-300 mb-2 leading-relaxed">{line}</p>;
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-2xl"
      >
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <h2 className="font-bold text-white flex items-center gap-2">
            <Eye className="w-5 h-5 text-cyan-400" /> Article Preview
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="overflow-y-auto" style={{ maxHeight: "calc(90vh - 80px)" }}>
          {post.coverImage && (
            <div className="h-48 overflow-hidden">
              <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
            </div>
          )}
          <div className="p-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/20">
                {post.category}
              </span>
              {post.featured && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/20">
                  ⭐ Featured
                </span>
              )}
              <span className="text-xs text-slate-400">{post.readTimeMinutes} min read</span>
            </div>
            <h1 className="text-2xl font-bold text-white mb-3">{post.title}</h1>
            <p className="text-slate-400 text-sm mb-4 italic">{post.excerpt}</p>
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-white/10">
              <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                {post.author.charAt(0)}
              </div>
              <div>
                <p className="text-white text-xs font-medium">{post.author}</p>
                <p className="text-slate-400 text-xs">{post.authorRole}</p>
              </div>
            </div>
            <div className="prose prose-invert max-w-none">{renderContent(post.content)}</div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   TESTIMONIAL FORM MODAL
═══════════════════════════════════════════════════════════════ */
function TestimonialFormModal({
  testimonial,
  onSave,
  onClose
}: {
  testimonial: Testimonial | null;
  onSave: (form: Partial<Testimonial>) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState<Partial<Testimonial>>({
    name: testimonial?.name || "",
    role: testimonial?.role || "",
    story: testimonial?.story || "",
    initials: testimonial?.initials || "",
    rating: testimonial?.rating || 5,
    location: testimonial?.location || "",
    id: testimonial?.id
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl"
      >
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <h2 className="font-bold text-white">{testimonial ? "Edit" : "Add"} Testimonial</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Full Name *</label>
              <input
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-violet-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Initials *</label>
              <input
                value={form.initials}
                onChange={(e) => setForm((f) => ({ ...f, initials: e.target.value.slice(0, 3).toUpperCase() }))}
                maxLength={3}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm font-mono focus:border-violet-500 focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Role & Location (e.g. Diamond Team Leader · Addis Ababa)</label>
            <input
              value={form.role}
              onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-violet-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Their Story / Quote *</label>
            <textarea
              value={form.story}
              onChange={(e) => setForm((f) => ({ ...f, story: e.target.value }))}
              rows={4}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder-slate-500 focus:border-violet-500 focus:outline-none resize-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Star Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((n) => (
                <button key={n} onClick={() => setForm((f) => ({ ...f, rating: n }))}>
                  <Star className={cn("w-6 h-6 transition-colors", n <= (form.rating || 0) ? "text-amber-400 fill-amber-400" : "text-slate-600")} />
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-3 p-5 border-t border-white/10">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={() => onSave(form)}>
            <Save className="w-4 h-4 mr-1" /> Save Testimonial
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   FAQ FORM MODAL
═══════════════════════════════════════════════════════════════ */
function FaqFormModal({
  faq,
  onSave,
  onClose
}: {
  faq: Faq | null;
  onSave: (form: Partial<Faq>) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState<Partial<Faq>>({
    question: faq?.question || "",
    answer: faq?.answer || "",
    category: faq?.category || FAQ_CATEGORIES[0],
    order: faq?.order || 99,
    id: faq?.id
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl"
      >
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <h2 className="font-bold text-white">{faq ? "Edit" : "Add"} FAQ</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Question *</label>
            <input
              value={form.question}
              onChange={(e) => setForm((f) => ({ ...f, question: e.target.value }))}
              placeholder="What is the most common question you receive?"
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder-slate-500 focus:border-violet-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Answer *</label>
            <textarea
              value={form.answer}
              onChange={(e) => setForm((f) => ({ ...f, answer: e.target.value }))}
              rows={5}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder-slate-500 focus:border-violet-500 focus:outline-none resize-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                className="w-full px-3 py-2 bg-slate-800 border border-white/10 rounded-lg text-white text-sm focus:border-violet-500 focus:outline-none"
              >
                {FAQ_CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Display Order</label>
              <input
                type="number"
                min={1}
                value={form.order}
                onChange={(e) => setForm((f) => ({ ...f, order: parseInt(e.target.value) || 99 }))}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-violet-500 focus:outline-none"
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-3 p-5 border-t border-white/10">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={() => onSave(form)}>
            <Save className="w-4 h-4 mr-1" /> Save FAQ
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   FOOTER & SOCIAL MEDIA STUDIO TAB
═══════════════════════════════════════════════════════════════ */
function FooterTab({
  form,
  onChange,
  onSave,
  onResetDefaults,
  saving
}: {
  form: StoredCmsFooter;
  onChange: React.Dispatch<React.SetStateAction<StoredCmsFooter | null>>;
  onSave: () => void;
  onResetDefaults: () => void;
  saving: boolean;
}) {
  const [activeSubTab, setActiveSubTab] = useState<"social" | "contact" | "brand" | "links" | "preview">("social");
  const [previewLocale, setPreviewLocale] = useState<"en" | "am">("en");

  // Helper to update social link
  const updateSocial = (network: keyof StoredSocialLinks, val: string) => {
    onChange((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        socialLinks: {
          ...prev.socialLinks,
          [network]: val
        }
      };
    });
  };

  // Helper to update platform link
  const updatePlatformLink = (index: number, field: "label" | "labelAm" | "href", val: string) => {
    onChange((prev) => {
      if (!prev) return prev;
      const updated = [...prev.platformLinks];
      updated[index] = { ...updated[index], [field]: val };
      return { ...prev, platformLinks: updated };
    });
  };

  const addPlatformLink = () => {
    onChange((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        platformLinks: [...prev.platformLinks, { label: "New Page", labelAm: "አዲስ ገጽ", href: "/en/auth" }]
      };
    });
  };

  const removePlatformLink = (index: number) => {
    onChange((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        platformLinks: prev.platformLinks.filter((_, i) => i !== index)
      };
    });
  };

  // Helper to update company link
  const updateCompanyLink = (index: number, field: "label" | "labelAm" | "href", val: string) => {
    onChange((prev) => {
      if (!prev) return prev;
      const updated = [...prev.companyLinks];
      updated[index] = { ...updated[index], [field]: val };
      return { ...prev, companyLinks: updated };
    });
  };

  const addCompanyLink = () => {
    onChange((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        companyLinks: [...prev.companyLinks, { label: "Contact Us", labelAm: "ያግኙን", href: "/en/contact" }]
      };
    });
  };

  const removeCompanyLink = (index: number) => {
    onChange((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        companyLinks: prev.companyLinks.filter((_, i) => i !== index)
      };
    });
  };

  const socialConfig = [
    { key: "facebook" as const, label: "Facebook", placeholder: "https://facebook.com/myupline.ethiopia", icon: Facebook, color: "text-blue-500", bg: "bg-blue-500/10" },
    { key: "telegram" as const, label: "Telegram Channel / Group", placeholder: "https://t.me/myuplineofficial", icon: Send, color: "text-sky-400", bg: "bg-sky-500/10" },
    { key: "whatsapp" as const, label: "WhatsApp Direct Chat", placeholder: "https://wa.me/251911223344", icon: MessageCircle, color: "text-emerald-400", bg: "bg-emerald-500/10" },
    { key: "instagram" as const, label: "Instagram", placeholder: "https://instagram.com/myupline.official", icon: Instagram, color: "text-pink-400", bg: "bg-pink-500/10" },
    { key: "youtube" as const, label: "YouTube Channel", placeholder: "https://youtube.com/@myuplineofficial", icon: Youtube, color: "text-red-500", bg: "bg-red-500/10" },
    { key: "linkedin" as const, label: "LinkedIn Company", placeholder: "https://linkedin.com/company/myupline-global", icon: Linkedin, color: "text-sky-600", bg: "bg-sky-600/10" },
    { key: "tiktok" as const, label: "TikTok Profile", placeholder: "https://tiktok.com/@myupline.ethiopia", icon: Share2, color: "text-cyan-400", bg: "bg-cyan-500/10" },
    { key: "twitter" as const, label: "X (Twitter)", placeholder: "https://twitter.com/myupline_et", icon: Twitter, color: "text-slate-200", bg: "bg-slate-700/30" }
  ];

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-violet-950/70 via-slate-900 to-slate-950 border border-violet-500/20 rounded-2xl p-5 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wider uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              <Globe className="w-3 h-3" /> Live CMS Controlled
            </span>
            <span className="text-xs text-slate-400">Public Landing & Contact Pages</span>
          </div>
          <h2 className="text-xl font-black text-white mt-1">Footer, Social Media & Contact Management</h2>
          <p className="text-xs text-slate-400 max-w-xl">
            Edit the footer brand statement, direct hotlines, Addis Ababa headquarters, social media URLs, and navigation links. Updates are instantly pushed to the public site.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            onClick={onResetDefaults}
            disabled={saving}
            className="border border-white/10 text-slate-300 hover:text-white text-xs"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
            Reset Defaults
          </Button>

          <Button
            variant="primary"
            onClick={onSave}
            disabled={saving}
            className="brand-gradient text-brand-navy font-black text-xs shadow-lg shadow-cyan-500/20"
          >
            {saving ? (
              <span className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-brand-navy border-t-transparent rounded-full animate-spin" />
                Saving...
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <Save className="w-4 h-4" />
                Save Footer Changes
              </span>
            )}
          </Button>
        </div>
      </div>

      {/* Sub-Tabs Nav */}
      <div className="flex flex-wrap gap-2 border-b border-white/10 pb-3">
        {[
          { id: "social" as const, label: "Social Media Channels", icon: Share2 },
          { id: "contact" as const, label: "Contact Info & Headquarters", icon: Phone },
          { id: "brand" as const, label: "Brand Statements", icon: Sparkles },
          { id: "links" as const, label: "Navigation Links", icon: Layers },
          { id: "preview" as const, label: "Live Interactive Preview", icon: Eye }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition",
                isActive
                  ? "bg-violet-600 text-white shadow-md shadow-violet-600/30"
                  : "bg-white/5 text-slate-400 hover:text-white hover:bg-white/10"
              )}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 1. SOCIAL MEDIA CHANNELS                                      */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeSubTab === "social" && (
        <div className="space-y-4">
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <h3 className="text-sm font-bold text-white mb-1">Official Social Media Links</h3>
            <p className="text-xs text-slate-400">
              Configure URLs for your social accounts. When users click these icons in the public footer, they open directly in a new tab.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {socialConfig.map((item) => {
              const Icon = item.icon;
              const val = form.socialLinks?.[item.key] || "";
              return (
                <div
                  key={item.key}
                  className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 space-y-2.5 transition hover:border-violet-500/40"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg", item.bg, item.color)}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <span className="text-xs font-black text-white">{item.label}</span>
                    </div>
                    {val && (
                      <button
                        type="button"
                        onClick={() => window.open(val, "_blank")}
                        className="inline-flex items-center gap-1 text-[10px] font-bold text-cyan-400 hover:text-cyan-300"
                      >
                        <ExternalLink className="h-3 w-3" /> Test Link
                      </button>
                    )}
                  </div>

                  <input
                    type="url"
                    value={val}
                    onChange={(e) => updateSocial(item.key, e.target.value)}
                    placeholder={item.placeholder}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-400 transition"
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 2. CONTACT INFO & HEADQUARTERS                                */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeSubTab === "contact" && (
        <div className="grid gap-6 md:grid-cols-2">
          {/* Direct Hotlines Card */}
          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 space-y-4">
            <div className="flex items-center gap-2 border-b border-white/10 pb-3">
              <Phone className="h-4 w-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white">Direct Communication Hotlines</h3>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Official Support Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
                <input
                  type="email"
                  value={form.contactEmail}
                  onChange={(e) => onChange((prev) => prev ? { ...prev, contactEmail: e.target.value } : prev)}
                  placeholder="support@myupline.org"
                  className="w-full rounded-xl border border-white/10 bg-white/5 pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Direct Phone Hotline (Ethiopia)</label>
              <div className="relative">
                <Phone className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
                <input
                  type="text"
                  value={form.contactPhone}
                  onChange={(e) => onChange((prev) => prev ? { ...prev, contactPhone: e.target.value } : prev)}
                  placeholder="+251 911 223 344"
                  className="w-full rounded-xl border border-white/10 bg-white/5 pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">WhatsApp Customer Care Number</label>
              <div className="relative">
                <MessageCircle className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
                <input
                  type="text"
                  value={form.whatsappNumber || ""}
                  onChange={(e) => onChange((prev) => prev ? { ...prev, whatsappNumber: e.target.value } : prev)}
                  placeholder="+251 911 223 344"
                  className="w-full rounded-xl border border-white/10 bg-white/5 pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Telegram Official Channel / Bot</label>
              <div className="relative">
                <Send className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
                <input
                  type="text"
                  value={form.telegramChannelOrUser || ""}
                  onChange={(e) => onChange((prev) => prev ? { ...prev, telegramChannelOrUser: e.target.value } : prev)}
                  placeholder="https://t.me/myuplineofficial"
                  className="w-full rounded-xl border border-white/10 bg-white/5 pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-400"
                />
              </div>
            </div>
          </div>

          {/* Physical Headquarters & Hours Card */}
          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 space-y-4">
            <div className="flex items-center gap-2 border-b border-white/10 pb-3">
              <MapPin className="h-4 w-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">Headquarters & Office Hours</h3>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Headquarters Address (English)</label>
              <textarea
                rows={2}
                value={form.officeAddress}
                onChange={(e) => onChange((prev) => prev ? { ...prev, officeAddress: e.target.value } : prev)}
                placeholder="Bole Medhanialem, Edna Mall Complex, 4th Floor, Addis Ababa, Ethiopia"
                className="w-full rounded-xl border border-white/10 bg-white/5 p-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-400 resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Headquarters Address (Amharic - አማርኛ)</label>
              <textarea
                rows={2}
                value={form.officeAddressAmharic || ""}
                onChange={(e) => onChange((prev) => prev ? { ...prev, officeAddressAmharic: e.target.value } : prev)}
                placeholder="ቦሌ መድኃኔዓለም፣ ኤድና ሞል የንግድ ህንፃ፣ 4ኛ ፎቅ፣ አዲስ አበባ፣ ኢትዮጵያ"
                className="w-full rounded-xl border border-white/10 bg-white/5 p-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-400 resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Working Hours (English)</label>
              <input
                type="text"
                value={form.workingHours || ""}
                onChange={(e) => onChange((prev) => prev ? { ...prev, workingHours: e.target.value } : prev)}
                placeholder="Monday – Saturday: 8:30 AM – 6:30 PM (EAT)"
                className="w-full rounded-xl border border-white/10 bg-white/5 p-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Working Hours (Amharic - አማርኛ)</label>
              <input
                type="text"
                value={form.workingHoursAmharic || ""}
                onChange={(e) => onChange((prev) => prev ? { ...prev, workingHoursAmharic: e.target.value } : prev)}
                placeholder="ከሰኞ – ቅዳሜ፡ ከጠዋቱ 2:30 – ከምሽቱ 12:30 (የኢትዮጵያ ሰዓት)"
                className="w-full rounded-xl border border-white/10 bg-white/5 p-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-400"
              />
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 3. BRAND & STATEMENTS                                         */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeSubTab === "brand" && (
        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 space-y-5">
          <div>
            <h3 className="text-sm font-bold text-white mb-1">Brand Mission Statements</h3>
            <p className="text-xs text-slate-400">
              The short paragraph displayed directly below the logo in the public footer. Provide both English and Amharic versions.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">English Brand Description</label>
              <textarea
                rows={4}
                value={form.brandDescription}
                onChange={(e) => onChange((prev) => prev ? { ...prev, brandDescription: e.target.value } : prev)}
                className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-400 resize-none leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">Amharic Brand Description (የአማርኛ ማብራሪያ)</label>
              <textarea
                rows={4}
                value={form.brandDescriptionAmharic || ""}
                onChange={(e) => onChange((prev) => prev ? { ...prev, brandDescriptionAmharic: e.target.value } : prev)}
                className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-400 resize-none leading-relaxed"
              />
            </div>
          </div>

          <div className="border-t border-white/10 pt-5 space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">Copyright & Trust Badges</h4>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Copyright Notice (English)</label>
                <input
                  type="text"
                  value={form.copyrightText}
                  onChange={(e) => onChange((prev) => prev ? { ...prev, copyrightText: e.target.value } : prev)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 p-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Copyright Notice (Amharic)</label>
                <input
                  type="text"
                  value={form.copyrightTextAmharic || ""}
                  onChange={(e) => onChange((prev) => prev ? { ...prev, copyrightTextAmharic: e.target.value } : prev)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 p-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-400"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-300 mb-1">Security & Encryption Badge Label</label>
                <input
                  type="text"
                  value={form.securityBadgeText || ""}
                  onChange={(e) => onChange((prev) => prev ? { ...prev, securityBadgeText: e.target.value } : prev)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 p-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-400"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 4. NAVIGATION LINKS MANAGER                                   */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeSubTab === "links" && (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Column 1: Platform Links */}
          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white">Platform Column Links</h3>
                <p className="text-[11px] text-slate-400">Links displayed under the "Platform" footer column</p>
              </div>
              <button
                type="button"
                onClick={addPlatformLink}
                className="inline-flex items-center gap-1 rounded-lg bg-cyan-500/20 px-2.5 py-1 text-xs font-bold text-cyan-300 hover:bg-cyan-500/30"
              >
                <Plus className="h-3 w-3" /> Add Link
              </button>
            </div>

            <div className="space-y-2.5 max-h-[400px] overflow-y-auto pr-1">
              {form.platformLinks.map((link, idx) => (
                <div key={idx} className="rounded-xl border border-white/10 bg-white/5 p-2.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-slate-400">Link #{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => removePlatformLink(idx)}
                      className="text-red-400 hover:text-red-300 p-1"
                      title="Delete link"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={link.label}
                      onChange={(e) => updatePlatformLink(idx, "label", e.target.value)}
                      placeholder="Label (EN)"
                      className="rounded-lg border border-white/10 bg-black/40 px-2.5 py-1 text-xs text-white placeholder-slate-500"
                    />
                    <input
                      type="text"
                      value={link.labelAm || ""}
                      onChange={(e) => updatePlatformLink(idx, "labelAm", e.target.value)}
                      placeholder="Label (AM)"
                      className="rounded-lg border border-white/10 bg-black/40 px-2.5 py-1 text-xs text-white placeholder-slate-500"
                    />
                  </div>
                  <input
                    type="text"
                    value={link.href}
                    onChange={(e) => updatePlatformLink(idx, "href", e.target.value)}
                    placeholder="URL (e.g. /en/auth or #learning)"
                    className="w-full rounded-lg border border-white/10 bg-black/40 px-2.5 py-1 text-xs text-cyan-300 placeholder-slate-500 font-mono"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Column 2: Company Links */}
          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white">Company Column Links</h3>
                <p className="text-[11px] text-slate-400">Links displayed under the "Company" footer column</p>
              </div>
              <button
                type="button"
                onClick={addCompanyLink}
                className="inline-flex items-center gap-1 rounded-lg bg-cyan-500/20 px-2.5 py-1 text-xs font-bold text-cyan-300 hover:bg-cyan-500/30"
              >
                <Plus className="h-3 w-3" /> Add Link
              </button>
            </div>

            <div className="space-y-2.5 max-h-[400px] overflow-y-auto pr-1">
              {form.companyLinks.map((link, idx) => (
                <div key={idx} className="rounded-xl border border-white/10 bg-white/5 p-2.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-slate-400">Link #{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeCompanyLink(idx)}
                      className="text-red-400 hover:text-red-300 p-1"
                      title="Delete link"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={link.label}
                      onChange={(e) => updateCompanyLink(idx, "label", e.target.value)}
                      placeholder="Label (EN)"
                      className="rounded-lg border border-white/10 bg-black/40 px-2.5 py-1 text-xs text-white placeholder-slate-500"
                    />
                    <input
                      type="text"
                      value={link.labelAm || ""}
                      onChange={(e) => updateCompanyLink(idx, "labelAm", e.target.value)}
                      placeholder="Label (AM)"
                      className="rounded-lg border border-white/10 bg-black/40 px-2.5 py-1 text-xs text-white placeholder-slate-500"
                    />
                  </div>
                  <input
                    type="text"
                    value={link.href}
                    onChange={(e) => updateCompanyLink(idx, "href", e.target.value)}
                    placeholder="URL (e.g. /en/contact or #about)"
                    className="w-full rounded-lg border border-white/10 bg-black/40 px-2.5 py-1 text-xs text-cyan-300 placeholder-slate-500 font-mono"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 5. LIVE INTERACTIVE FOOTER PREVIEW                            */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeSubTab === "preview" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4">
            <div>
              <h3 className="text-sm font-bold text-white">Live Simulated Footer Preview</h3>
              <p className="text-xs text-slate-400">
                This shows exactly how the footer appears to visitors on the live platform.
              </p>
            </div>
            <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/10">
              <button
                type="button"
                onClick={() => setPreviewLocale("en")}
                className={cn("px-3 py-1 rounded-lg text-xs font-bold transition", previewLocale === "en" ? "bg-white text-brand-navy" : "text-slate-400")}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setPreviewLocale("am")}
                className={cn("px-3 py-1 rounded-lg text-xs font-bold transition", previewLocale === "am" ? "bg-white text-brand-navy" : "text-slate-400")}
              >
                አማርኛ
              </button>
            </div>
          </div>

          {/* Rendered Preview Box */}
          <div className="rounded-3xl border border-white/15 bg-slate-950 p-8 shadow-2xl space-y-8">
            <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr_1fr_1.2fr]">
              {/* Brand Col */}
              <div>
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg brand-gradient flex items-center justify-center font-black text-brand-navy text-sm">
                    MU
                  </div>
                  <span className="font-black text-lg text-white tracking-wide">MyUpline Global</span>
                </div>
                <p className="mt-3 text-xs leading-6 text-white/60">
                  {previewLocale === "am" && form.brandDescriptionAmharic ? form.brandDescriptionAmharic : form.brandDescription}
                </p>

                {/* Social icons */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {socialConfig.map((s) => {
                    const Icon = s.icon;
                    const url = form.socialLinks?.[s.key];
                    if (!url) return null;
                    return (
                      <span
                        key={s.key}
                        title={`${s.label}: ${url}`}
                        className={cn("inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 cursor-pointer hover:border-cyan-400 transition", s.bg, s.color)}
                      >
                        <Icon className="h-3.5 w-3.5" />
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Platform Col */}
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-white mb-3">
                  {previewLocale === "am" ? "የስርዓቱ ገጾች" : "Platform"}
                </h4>
                <ul className="space-y-2 text-xs text-white/60">
                  {form.platformLinks.map((link, i) => (
                    <li key={i} className="hover:text-white transition cursor-pointer">
                      {previewLocale === "am" && link.labelAm ? link.labelAm : link.label}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Company Col */}
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-white mb-3">
                  {previewLocale === "am" ? "ኩባንያ & ድጋፍ" : "Company"}
                </h4>
                <ul className="space-y-2 text-xs text-white/60">
                  {form.companyLinks.map((link, i) => (
                    <li key={i} className="hover:text-white transition cursor-pointer">
                      {previewLocale === "am" && link.labelAm ? link.labelAm : link.label}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contact Info Col */}
              <div className="space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-white mb-1">
                  {previewLocale === "am" ? "ቀጥታ አድራሻ" : "Direct Contact"}
                </h4>
                <div className="space-y-2 text-xs text-white/75">
                  <div className="flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5 text-cyan-400 flex-shrink-0" />
                    <span>{form.contactEmail}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0" />
                    <span>{form.contactPhone}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="h-3.5 w-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                    <span className="text-[11px] leading-relaxed">
                      {previewLocale === "am" && form.officeAddressAmharic ? form.officeAddressAmharic : form.officeAddress}
                    </span>
                  </div>
                </div>

                <a
                  href="/en/contact"
                  target="_blank"
                  className="mt-2 inline-flex items-center gap-1 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-bold text-cyan-300 hover:bg-white/20 transition"
                >
                  <ExternalLink className="h-3 w-3" /> Visit Public Contact Page
                </a>
              </div>
            </div>

            {/* Bottom copyright line */}
            <div className="border-t border-white/10 pt-5 flex flex-wrap items-center justify-between gap-3 text-xs text-white/40">
              <p>{previewLocale === "am" && form.copyrightTextAmharic ? form.copyrightTextAmharic : form.copyrightText}</p>
              <div className="flex items-center gap-1 text-emerald-400">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>{form.securityBadgeText || "RBAC-Secured · Data Encrypted"}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

