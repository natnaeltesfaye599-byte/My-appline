"use client";

import { useState, useEffect } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  BookOpen,
  Camera,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ClipboardCheck,
  Coins,
  Download,
  Edit3,
  ExternalLink,
  Eye,
  FileCheck,
  FileSpreadsheet,
  FileText,
  Flame,
  Globe,
  HelpCircle,
  ImageIcon,
  Layers,
  Lightbulb,
  Lock,
  MessageCircle,
  MessageSquare,
  Network,
  Phone,
  Plus,
  Presentation,
  Printer,
  Quote,
  Radio,
  RotateCcw,
  Save,
  Send,
  Share2,
  ShieldAlert,
  ShieldCheck,
  Sliders,
  Sparkles,
  Star,
  Target,
  Trash2,
  Trophy,
  Upload,
  User,
  UserCheck,
  Users,
  X,
  Zap
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  GettingStartedConfig,
  ProspectFunnelConfig,
  LeaderTestimonyConfig,
  ChecklistItemConfig,
  ProspectQuestionConfig,
  defaultGettingStartedConfig,
  defaultProspectFunnelConfig,
  getGettingStartedConfig,
  saveGettingStartedConfig,
  getProspectFunnelConfig,
  saveProspectFunnelConfig
} from "@/lib/onboarding-prospect-config";
import { ProspectSubmission } from "@/components/prospect-qualifier-funnel";
import { exportToCsv } from "@/lib/export-utils";

export function OnboardingProspectStudio({
  onOpenAi
}: {
  onOpenAi?: (prompt: string) => void;
}) {
  const [activeTab, setActiveTab] = useState<"booklet-crud" | "funnel-crud" | "submissions">("booklet-crud");
  const [bookletPageTab, setBookletPageTab] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);

  // Configurations
  const [bookletConfig, setBookletConfig] = useState<GettingStartedConfig>(defaultGettingStartedConfig);
  const [funnelConfig, setFunnelConfig] = useState<ProspectFunnelConfig>(defaultProspectFunnelConfig);
  const [submissions, setSubmissions] = useState<ProspectSubmission[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<ProspectSubmission | null>(null);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Testimonial Modal (Add/Edit)
  const [editingTestimony, setEditingTestimony] = useState<LeaderTestimonyConfig | null>(null);
  const [isTestimonyModalOpen, setIsTestimonyModalOpen] = useState(false);

  // Checklist Item Modal
  const [newChecklistLabel, setNewChecklistLabel] = useState("");

  useEffect(() => {
    setBookletConfig(getGettingStartedConfig());
    setFunnelConfig(getProspectFunnelConfig());

    const loadSubmissions = () => {
      try {
        const storedSubmissions = JSON.parse(window.localStorage.getItem("myupline_prospect_submissions") || "[]");
        setSubmissions(storedSubmissions);
      } catch {}
    };

    loadSubmissions();
    window.addEventListener("myupline_submission_added", loadSubmissions);
    return () => window.removeEventListener("myupline_submission_added", loadSubmissions);
  }, []);

  function triggerToast(msg: string) {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  }

  function handleSaveBooklet() {
    saveGettingStartedConfig(bookletConfig);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("myupline_booklet_config_updated"));
    }
    triggerToast("Getting Started Booklet configuration saved successfully!");
  }

  function handleSaveFunnel() {
    saveProspectFunnelConfig(funnelConfig);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("myupline_funnel_config_updated"));
    }
    triggerToast("Prospect Qualifier Funnel configuration saved successfully!");
  }

  function handleResetBooklet() {
    if (confirm("Reset Getting Started Booklet to company defaults?")) {
      setBookletConfig(defaultGettingStartedConfig);
      saveGettingStartedConfig(defaultGettingStartedConfig);
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("myupline_booklet_config_updated"));
      }
      triggerToast("Reset booklet to default settings.");
    }
  }

  function handleResetFunnel() {
    if (confirm("Reset Prospect Funnel to company defaults?")) {
      setFunnelConfig(defaultProspectFunnelConfig);
      saveProspectFunnelConfig(defaultProspectFunnelConfig);
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("myupline_funnel_config_updated"));
      }
      triggerToast("Reset funnel to default settings.");
    }
  }

  // ── TESTIMONIAL CRUD ──
  function handleSaveTestimony(e: React.FormEvent) {
    e.preventDefault();
    if (!editingTestimony) return;

    if (!editingTestimony.name.trim() || !editingTestimony.quote.trim()) {
      alert("Please provide both name and testimony quote.");
      return;
    }

    const existingIdx = bookletConfig.testimonials.findIndex((t) => t.id === editingTestimony.id);
    let updated: LeaderTestimonyConfig[];

    if (existingIdx >= 0) {
      updated = [...bookletConfig.testimonials];
      updated[existingIdx] = editingTestimony;
    } else {
      updated = [...bookletConfig.testimonials, editingTestimony];
    }

    const newCfg = { ...bookletConfig, testimonials: updated };
    setBookletConfig(newCfg);
    saveGettingStartedConfig(newCfg);
    setIsTestimonyModalOpen(false);
    setEditingTestimony(null);
    triggerToast("Testimonial updated!");
  }

  function handleDeleteTestimony(id: string) {
    if (confirm("Delete this leader testimony?")) {
      const updated = bookletConfig.testimonials.filter((t) => t.id !== id);
      const newCfg = { ...bookletConfig, testimonials: updated };
      setBookletConfig(newCfg);
      saveGettingStartedConfig(newCfg);
      triggerToast("Testimony deleted.");
    }
  }

  // ── CHECKLIST CRUD ──
  function handleAddChecklistItem(e: React.FormEvent) {
    e.preventDefault();
    if (!newChecklistLabel.trim()) return;

    const newItem: ChecklistItemConfig = {
      id: `item-${Date.now()}`,
      label: newChecklistLabel.trim()
    };

    const newCfg = {
      ...bookletConfig,
      checklistItems: [...bookletConfig.checklistItems, newItem]
    };
    setBookletConfig(newCfg);
    saveGettingStartedConfig(newCfg);
    setNewChecklistLabel("");
    triggerToast("New checklist item added!");
  }

  function handleDeleteChecklistItem(id: string) {
    const updated = bookletConfig.checklistItems.filter((i) => i.id !== id);
    const newCfg = { ...bookletConfig, checklistItems: updated };
    setBookletConfig(newCfg);
    saveGettingStartedConfig(newCfg);
    triggerToast("Checklist item removed.");
  }

  // ── SUBMISSIONS INBOX CRUD ──
  function handleDeleteSubmission(id: string) {
    if (confirm("Delete this prospect application?")) {
      const updated = submissions.filter((s) => s.id !== id);
      setSubmissions(updated);
      try {
        window.localStorage.setItem("myupline_prospect_submissions", JSON.stringify(updated));
      } catch {}
      triggerToast("Submission removed.");
    }
  }

  function handleExportSubmissionsCsv() {
    if (submissions.length === 0) {
      alert("No submissions to export.");
      return;
    }
    const rows = submissions.map((s) => ({
      ID: s.id,
      FullName: s.fullName,
      Phone: s.phone,
      City: s.address,
      Telegram: s.telegramUsername,
      ReadinessScore: `${s.q9_readiness_score}%`,
      CurrentWork: s.q1_current_work,
      AchieveGoal: s.q2_achieve_goal,
      FamilyHome: s.q3_family_home,
      Destinations: s.q4_spiritual_vacation_places,
      HateAboutCurrent: s.q5_hate_about_current_work,
      TargetIncomeETB: s.q6_target_monthly_income,
      CurrentAction: s.q7_current_action_for_dream,
      CanAchieveWithCurrent: s.q8_can_achieve_with_current,
      Timeframe: s.q8_timeframe || "N/A",
      SubmittedAt: s.submittedAt
    }));
    exportToCsv("Qualified_Prospect_Leads", rows);
  }

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-gradient-to-r from-brand-navy via-brand-deep to-[#0d3478] p-6 text-white shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-cyan text-brand-navy shadow-lg shadow-cyan-400/25">
            <Sliders className="h-6 w-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded bg-brand-cyan/20 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-brand-cyan">
                Super Admin Master Control
              </span>
              <span className="text-xs font-bold text-slate-300">Live Customizer & CMS</span>
            </div>
            <h2 className="text-xl font-black text-white sm:text-2xl tracking-tight">
              Onboarding & Prospect Studio (Master CRUD)
            </h2>
            <p className="text-xs text-slate-300">
              Manage the 6-Page Getting Started Booklet and the 3-Step / 9-Question Prospect Qualifier Funnel.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="/am/prospect"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-xs font-bold text-white hover:bg-white/20 transition"
          >
            <ExternalLink className="h-3.5 w-3.5" /> View Live Public Funnel
          </a>
        </div>
      </div>

      {/* Toast Alert */}
      {toastMessage && (
        <div className="rounded-xl border border-emerald-500/40 bg-emerald-50 p-3.5 text-xs font-bold text-emerald-800 shadow-md animate-in fade-in flex items-center justify-between">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            {toastMessage}
          </span>
          <span className="text-[10px] opacity-75">Saved to Store</span>
        </div>
      )}

      {/* ── Main Tab Navigation ── */}
      <div className="flex items-center gap-2 rounded-2xl bg-slate-100 p-1.5 w-fit flex-wrap">
        <button
          type="button"
          onClick={() => setActiveTab("booklet-crud")}
          className={cn(
            "flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-black transition",
            activeTab === "booklet-crud"
              ? "bg-white text-brand-navy shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          )}
        >
          <ClipboardCheck className="h-4 w-4 text-cyan-600" />
          1. Getting Started Booklet (6-Page CRUD)
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("funnel-crud")}
          className={cn(
            "flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-black transition",
            activeTab === "funnel-crud"
              ? "bg-white text-brand-navy shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          )}
        >
          <Sparkles className="h-4 w-4 text-amber-500" />
          2. Prospect Funnel & 9 Questions (CRUD)
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("submissions")}
          className={cn(
            "flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-black transition",
            activeTab === "submissions"
              ? "bg-white text-brand-navy shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          )}
        >
          <Users className="h-4 w-4 text-emerald-600" />
          3. Qualified Submissions Inbox ({submissions.length})
        </button>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 1: GETTING STARTED BOOKLET (6-PAGE CRUD)                         */}
      {/* ========================================================================= */}
      {activeTab === "booklet-crud" && (
        <div className="space-y-6">
          {/* Sub-Tabs for the 6 Pages */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
            <div className="flex flex-wrap items-center gap-1.5">
              {[1, 2, 3, 4, 5, 6].map((pNum) => (
                <button
                  key={pNum}
                  type="button"
                  onClick={() => setBookletPageTab(pNum as typeof bookletPageTab)}
                  className={cn(
                    "rounded-xl px-3.5 py-1.5 text-xs font-black transition",
                    bookletPageTab === pNum
                      ? "bg-brand-navy text-white shadow"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  )}
                >
                  Page {pNum}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <Button onClick={handleResetBooklet} variant="ghost" size="sm" className="text-xs text-slate-500 hover:text-rose-600">
                <RotateCcw className="mr-1 h-3.5 w-3.5" /> Reset Defaults
              </Button>
              <Button onClick={handleSaveBooklet} size="sm" className="brand-gradient font-black text-brand-navy">
                <Save className="mr-1.5 h-4 w-4" /> Save Booklet Changes
              </Button>
            </div>
          </div>

          {/* PAGE 1 CRUD */}
          {bookletPageTab === 1 && (
            <Card className="p-6 border-slate-200 space-y-4">
              <h3 className="text-sm font-black text-brand-navy border-b pb-2">Page 1: Company Welcome & Ethos Settings</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Company Name</label>
                  <input
                    type="text"
                    value={bookletConfig.companyName}
                    onChange={(e) => setBookletConfig({ ...bookletConfig, companyName: e.target.value })}
                    className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Document Reference Prefix</label>
                  <input
                    type="text"
                    value={bookletConfig.documentRefPrefix}
                    onChange={(e) => setBookletConfig({ ...bookletConfig, documentRefPrefix: e.target.value })}
                    className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Welcome Headline</label>
                <input
                  type="text"
                  value={bookletConfig.welcomeHeadline}
                  onChange={(e) => setBookletConfig({ ...bookletConfig, welcomeHeadline: e.target.value })}
                  className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Welcome Description</label>
                <textarea
                  rows={3}
                  value={bookletConfig.welcomeDescription}
                  onChange={(e) => setBookletConfig({ ...bookletConfig, welcomeDescription: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 p-3 text-xs"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-3 pt-2">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Vision Description</label>
                  <textarea
                    rows={2}
                    value={bookletConfig.visionDescription}
                    onChange={(e) => setBookletConfig({ ...bookletConfig, visionDescription: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 p-2.5 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Duplication Description</label>
                  <textarea
                    rows={2}
                    value={bookletConfig.duplicationDescription}
                    onChange={(e) => setBookletConfig({ ...bookletConfig, duplicationDescription: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 p-2.5 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Leadership Description</label>
                  <textarea
                    rows={2}
                    value={bookletConfig.leadershipDescription}
                    onChange={(e) => setBookletConfig({ ...bookletConfig, leadershipDescription: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 p-2.5 text-xs"
                  />
                </div>
              </div>
            </Card>
          )}

          {/* PAGE 2 CRUD: TESTIMONIALS & TRANSFORMATION PHOTOS */}
          {bookletPageTab === 2 && (
            <Card className="p-6 border-slate-200 space-y-6">
              <div className="flex items-center justify-between border-b pb-3">
                <div>
                  <h3 className="text-sm font-black text-brand-navy">Page 2: 1st Day & Now Photo & Leader Testimonials (CRUD)</h3>
                  <p className="text-xs text-slate-500">Configure before/after photos and manage leader success stories.</p>
                </div>
                <Button
                  onClick={() => {
                    setEditingTestimony({
                      id: `test-${Date.now()}`,
                      name: "",
                      role: "Diamond Leader",
                      experience: "2 Years",
                      quote: "",
                      avatar: "💎",
                      badgeColor: "bg-cyan-500/20 text-cyan-700 border-cyan-500/40",
                      dayOne: "",
                      now: ""
                    });
                    setIsTestimonyModalOpen(true);
                  }}
                  size="sm"
                  className="bg-brand-navy font-bold text-white hover:bg-slate-800"
                >
                  <Plus className="mr-1.5 h-4 w-4" /> Add New Leader Testimony
                </Button>
              </div>

              {/* Photo URLs */}
              <div className="grid gap-4 sm:grid-cols-2 bg-slate-50 p-4 rounded-xl">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">1st Day Photo URL</label>
                  <input
                    type="text"
                    value={bookletConfig.defaultFirstDayPhoto}
                    onChange={(e) => setBookletConfig({ ...bookletConfig, defaultFirstDayPhoto: e.target.value })}
                    className="h-10 w-full rounded-lg border border-slate-200 px-3 text-xs bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Now / Today Photo URL</label>
                  <input
                    type="text"
                    value={bookletConfig.defaultNowPhoto}
                    onChange={(e) => setBookletConfig({ ...bookletConfig, defaultNowPhoto: e.target.value })}
                    className="h-10 w-full rounded-lg border border-slate-200 px-3 text-xs bg-white"
                  />
                </div>
              </div>

              {/* Testimonials List */}
              <div className="space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-700">Configured Leader Testimonials ({bookletConfig.testimonials.length})</h4>
                <div className="grid gap-3 sm:grid-cols-3">
                  {bookletConfig.testimonials.map((t) => (
                    <Card key={t.id} className="p-4 border-slate-200 bg-white flex flex-col justify-between shadow-sm">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-2xl">{t.avatar}</span>
                          <span className="text-[10px] font-bold text-slate-500">{t.experience}</span>
                        </div>
                        <h5 className="font-bold text-xs text-brand-navy">{t.name}</h5>
                        <p className="text-[10px] text-cyan-700 font-bold mb-2">{t.role}</p>
                        <p className="text-xs text-slate-600 italic line-clamp-3">"{t.quote}"</p>
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-3 mt-3 border-t">
                        <button
                          onClick={() => {
                            setEditingTestimony(t);
                            setIsTestimonyModalOpen(true);
                          }}
                          className="text-xs font-bold text-cyan-600 hover:underline flex items-center gap-1"
                        >
                          <Edit3 className="h-3.5 w-3.5" /> Edit
                        </button>
                        <button
                          onClick={() => handleDeleteTestimony(t.id)}
                          className="text-xs font-bold text-rose-600 hover:underline flex items-center gap-1"
                        >
                          <Trash2 className="h-3.5 w-3.5" /> Delete
                        </button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </Card>
          )}

          {/* PAGE 3 CRUD: SLIDE 2 CURRICULUM */}
          {bookletPageTab === 3 && (
            <Card className="p-6 border-slate-200 space-y-4">
              <h3 className="text-sm font-black text-brand-navy border-b pb-2">Page 3: PowerPoint Slide 2 Curriculum</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Slide 2 Title</label>
                  <input
                    type="text"
                    value={bookletConfig.slide2Title}
                    onChange={(e) => setBookletConfig({ ...bookletConfig, slide2Title: e.target.value })}
                    className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Slide 2 Subtitle</label>
                  <input
                    type="text"
                    value={bookletConfig.slide2Subtitle}
                    onChange={(e) => setBookletConfig({ ...bookletConfig, slide2Subtitle: e.target.value })}
                    className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Slide 2 Key Takeaway Banner Quote</label>
                <textarea
                  rows={2}
                  value={bookletConfig.slide2TakeawayQuote}
                  onChange={(e) => setBookletConfig({ ...bookletConfig, slide2TakeawayQuote: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 p-2.5 text-xs"
                />
              </div>
            </Card>
          )}

          {/* PAGE 4 CRUD: SLIDE 3 VOLUME & RANKS */}
          {bookletPageTab === 4 && (
            <Card className="p-6 border-slate-200 space-y-4">
              <h3 className="text-sm font-black text-brand-navy border-b pb-2">Page 4: PowerPoint Slide 3 Volume & Rank Pathways</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Personal Volume (PV) Definition</label>
                  <textarea
                    rows={2}
                    value={bookletConfig.pvDefinition}
                    onChange={(e) => setBookletConfig({ ...bookletConfig, pvDefinition: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 p-2.5 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Group Volume (GV) Definition</label>
                  <textarea
                    rows={2}
                    value={bookletConfig.gvDefinition}
                    onChange={(e) => setBookletConfig({ ...bookletConfig, gvDefinition: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 p-2.5 text-xs"
                  />
                </div>
              </div>
            </Card>
          )}

          {/* PAGE 5 CRUD: CHECKLIST & Q&A */}
          {bookletPageTab === 5 && (
            <Card className="p-6 border-slate-200 space-y-6">
              <div className="border-b pb-3">
                <h3 className="text-sm font-black text-brand-navy">Page 5: Getting Started Checklist & Q&A Prompts</h3>
                <p className="text-xs text-slate-500">Manage launch checklist items and the 4 primary commitment questions.</p>
              </div>

              {/* Add checklist item */}
              <form onSubmit={handleAddChecklistItem} className="flex gap-2">
                <input
                  type="text"
                  value={newChecklistLabel}
                  onChange={(e) => setNewChecklistLabel(e.target.value)}
                  placeholder="Enter new launch checklist item..."
                  className="h-10 flex-1 rounded-lg border border-slate-200 px-3 text-xs"
                />
                <Button type="submit" size="sm" className="bg-brand-navy text-white font-bold">
                  <Plus className="mr-1 h-4 w-4" /> Add Item
                </Button>
              </form>

              <div className="space-y-2">
                {bookletConfig.checklistItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-2.5 rounded-lg border bg-slate-50 text-xs">
                    <span>{item.label}</span>
                    <button
                      type="button"
                      onClick={() => handleDeleteChecklistItem(item.id)}
                      className="text-rose-600 hover:text-rose-800 p-1"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Q&A Prompts */}
              <div className="border-t pt-4 space-y-3">
                <h4 className="text-xs font-black uppercase text-slate-700">Question Prompts for Member Input</h4>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500">Question 1 Prompt</label>
                  <input
                    type="text"
                    value={bookletConfig.questions.q1Prompt}
                    onChange={(e) =>
                      setBookletConfig({
                        ...bookletConfig,
                        questions: { ...bookletConfig.questions, q1Prompt: e.target.value }
                      })
                    }
                    className="h-9 w-full rounded-lg border border-slate-200 px-3 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500">Question 2 Prompt</label>
                  <input
                    type="text"
                    value={bookletConfig.questions.q2Prompt}
                    onChange={(e) =>
                      setBookletConfig({
                        ...bookletConfig,
                        questions: { ...bookletConfig.questions, q2Prompt: e.target.value }
                      })
                    }
                    className="h-9 w-full rounded-lg border border-slate-200 px-3 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500">Question 3 Prompt</label>
                  <input
                    type="text"
                    value={bookletConfig.questions.q3Prompt}
                    onChange={(e) =>
                      setBookletConfig({
                        ...bookletConfig,
                        questions: { ...bookletConfig.questions, q3Prompt: e.target.value }
                      })
                    }
                    className="h-9 w-full rounded-lg border border-slate-200 px-3 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500">Question 4 Prompt</label>
                  <input
                    type="text"
                    value={bookletConfig.questions.q4Prompt}
                    onChange={(e) =>
                      setBookletConfig({
                        ...bookletConfig,
                        questions: { ...bookletConfig.questions, q4Prompt: e.target.value }
                      })
                    }
                    className="h-9 w-full rounded-lg border border-slate-200 px-3 text-xs"
                  />
                </div>
              </div>
            </Card>
          )}

          {/* PAGE 6 CRUD: GOAL OF MLP */}
          {bookletPageTab === 6 && (
            <Card className="p-6 border-slate-200 space-y-4">
              <h3 className="text-sm font-black text-brand-navy border-b pb-2">Page 6: Goal of MLP & Pledge Statement</h3>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Leader Pledge & Certification Declaration</label>
                <textarea
                  rows={3}
                  value={bookletConfig.pledgeDeclaration}
                  onChange={(e) => setBookletConfig({ ...bookletConfig, pledgeDeclaration: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 p-2.5 text-xs"
                />
              </div>
            </Card>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 2: PROSPECT QUALIFIER FUNNEL (IMAGE 1 & IMAGE 2 CRUD)             */}
      {/* ========================================================================= */}
      {activeTab === "funnel-crud" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b pb-3">
            <div>
              <h3 className="text-sm font-black text-brand-navy">Prospect Funnel 3-Step Slogans & 9 Questions (CRUD)</h3>
              <p className="text-xs text-slate-500">Customize the Amharic and English wording, cutoff thresholds, and field rules.</p>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={handleResetFunnel} variant="ghost" size="sm" className="text-xs text-slate-500 hover:text-rose-600">
                <RotateCcw className="mr-1 h-3.5 w-3.5" /> Reset Defaults
              </Button>
              <Button onClick={handleSaveFunnel} size="sm" className="brand-gradient font-black text-brand-navy">
                <Save className="mr-1.5 h-4 w-4" /> Save Funnel Changes
              </Button>
            </div>
          </div>

          {/* Image 1: Step 1, 2, 3 Slogans */}
          <div className="grid gap-4 sm:grid-cols-3">
            {/* Step 1 */}
            <Card className="p-4 border-slate-200 space-y-2 bg-slate-50">
              <div className="flex items-center justify-between border-b pb-1">
                <span className="text-xs font-black text-brand-navy">Step 1 (Attitude)</span>
                <span className="text-[10px] bg-cyan-100 text-cyan-800 px-1.5 rounded font-bold">Image 1, #1</span>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500">Amharic Headline</label>
                <textarea
                  rows={2}
                  value={funnelConfig.step1.headlineAm}
                  onChange={(e) =>
                    setFunnelConfig({
                      ...funnelConfig,
                      step1: { ...funnelConfig.step1, headlineAm: e.target.value }
                    })
                  }
                  className="w-full rounded border p-1.5 text-xs bg-white"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500">English Headline</label>
                <textarea
                  rows={2}
                  value={funnelConfig.step1.headlineEn}
                  onChange={(e) =>
                    setFunnelConfig({
                      ...funnelConfig,
                      step1: { ...funnelConfig.step1, headlineEn: e.target.value }
                    })
                  }
                  className="w-full rounded border p-1.5 text-xs bg-white"
                />
              </div>
            </Card>

            {/* Step 2 */}
            <Card className="p-4 border-slate-200 space-y-2 bg-slate-50">
              <div className="flex items-center justify-between border-b pb-1">
                <span className="text-xs font-black text-brand-navy">Step 2 (System)</span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 rounded font-bold">Image 1, #2</span>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500">Amharic Headline</label>
                <textarea
                  rows={2}
                  value={funnelConfig.step2.headlineAm}
                  onChange={(e) =>
                    setFunnelConfig({
                      ...funnelConfig,
                      step2: { ...funnelConfig.step2, headlineAm: e.target.value }
                    })
                  }
                  className="w-full rounded border p-1.5 text-xs bg-white"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500">English Headline</label>
                <textarea
                  rows={2}
                  value={funnelConfig.step2.headlineEn}
                  onChange={(e) =>
                    setFunnelConfig({
                      ...funnelConfig,
                      step2: { ...funnelConfig.step2, headlineEn: e.target.value }
                    })
                  }
                  className="w-full rounded border p-1.5 text-xs bg-white"
                />
              </div>
            </Card>

            {/* Step 3 */}
            <Card className="p-4 border-slate-200 space-y-2 bg-slate-50">
              <div className="flex items-center justify-between border-b pb-1">
                <span className="text-xs font-black text-brand-navy">Step 3 (Serious)</span>
                <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 rounded font-bold">Image 1, #3</span>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500">Amharic Slogan</label>
                <textarea
                  rows={2}
                  value={funnelConfig.step3.headlineAm}
                  onChange={(e) =>
                    setFunnelConfig({
                      ...funnelConfig,
                      step3: { ...funnelConfig.step3, headlineAm: e.target.value }
                    })
                  }
                  className="w-full rounded border p-1.5 text-xs bg-white"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500">English Slogan</label>
                <textarea
                  rows={2}
                  value={funnelConfig.step3.headlineEn}
                  onChange={(e) =>
                    setFunnelConfig({
                      ...funnelConfig,
                      step3: { ...funnelConfig.step3, headlineEn: e.target.value }
                    })
                  }
                  className="w-full rounded border p-1.5 text-xs bg-white"
                />
              </div>
            </Card>
          </div>

          {/* Readiness Cutoff Gate Settings */}
          <Card className="p-5 border-slate-200 bg-amber-50/50 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-black text-brand-navy">Cutoff Gate Threshold (Image 2 Bottom: &gt; 50%)</h4>
                <p className="text-[11px] text-slate-600">
                  Applicants must select a readiness score strictly higher than this percentage to unlock contact fields.
                </p>
              </div>
              <span className="text-base font-black text-brand-navy bg-white px-3 py-1 rounded-lg border">
                {funnelConfig.readinessCutoffPercentage}%
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="90"
              step="5"
              value={funnelConfig.readinessCutoffPercentage}
              onChange={(e) =>
                setFunnelConfig({
                  ...funnelConfig,
                  readinessCutoffPercentage: Number(e.target.value)
                })
              }
              className="w-full accent-brand-navy h-2 bg-slate-200 rounded cursor-pointer"
            />
          </Card>

          {/* Image 2: The 9 Questions Customizer */}
          <Card className="p-6 border-slate-200 space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-700">The 9 Questionnaire Fields (Bilingual CRUD)</h4>
            <div className="space-y-3">
              {funnelConfig.questions.map((q, idx) => (
                <div key={q.id} className="p-3.5 rounded-xl border bg-slate-50 space-y-2">
                  <div className="flex items-center justify-between text-xs font-black text-brand-navy">
                    <span>Question {q.number}</span>
                    <span className="text-[10px] font-mono text-slate-500 uppercase">{q.type}</span>
                  </div>
                  <div className="grid gap-2 sm:grid-cols-2">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500">Amharic Text (አማርኛ)</label>
                      <input
                        type="text"
                        value={q.titleAm}
                        onChange={(e) => {
                          const updated = [...funnelConfig.questions];
                          updated[idx] = { ...q, titleAm: e.target.value };
                          setFunnelConfig({ ...funnelConfig, questions: updated });
                        }}
                        className="h-8 w-full rounded border px-2 text-xs bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500">English Text</label>
                      <input
                        type="text"
                        value={q.titleEn}
                        onChange={(e) => {
                          const updated = [...funnelConfig.questions];
                          updated[idx] = { ...q, titleEn: e.target.value };
                          setFunnelConfig({ ...funnelConfig, questions: updated });
                        }}
                        className="h-8 w-full rounded border px-2 text-xs bg-white"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 3: SUBMISSIONS INBOX (QUALIFIED LEADS MANAGER)                     */}
      {/* ========================================================================= */}
      {activeTab === "submissions" && (
        <Card className="p-6 border-slate-200 space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <div>
              <h3 className="text-sm font-black text-brand-navy">Qualified Prospect Submissions ({submissions.length})</h3>
              <p className="text-xs text-slate-500">Review leads who completed the 3-step filter and answered all 9 questions.</p>
            </div>
            <Button
              onClick={handleExportSubmissionsCsv}
              size="sm"
              variant="ghost"
              className="border border-slate-200 text-xs font-bold"
            >
              <Download className="mr-1.5 h-4 w-4" /> Export All to CSV
            </Button>
          </div>

          {submissions.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs space-y-2">
              <Users className="mx-auto h-8 w-8 text-slate-300" />
              <p>No prospect submissions yet.</p>
              <p className="text-[11px] text-slate-500">Share your public funnel link (/am/prospect) to start receiving qualified leads.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-500 border-b">
                  <tr>
                    <th className="p-3">Candidate Name</th>
                    <th className="p-3">Phone</th>
                    <th className="p-3">Telegram</th>
                    <th className="p-3">City / Address</th>
                    <th className="p-3">Readiness</th>
                    <th className="p-3">Current Work</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {submissions.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50/70 transition">
                      <td className="p-3 font-bold text-brand-navy">{s.fullName}</td>
                      <td className="p-3 font-mono text-cyan-700">{s.phone}</td>
                      <td className="p-3 font-mono text-emerald-700">{s.telegramUsername || "-"}</td>
                      <td className="p-3">{s.address}</td>
                      <td className="p-3">
                        <span className="rounded bg-emerald-100 text-emerald-800 font-black px-2 py-0.5 text-[11px]">
                          {s.q9_readiness_score}%
                        </span>
                      </td>
                      <td className="p-3 text-slate-600 truncate max-w-[150px]">{s.q1_current_work}</td>
                      <td className="p-3 text-right space-x-2">
                        <button
                          onClick={() => setSelectedSubmission(s)}
                          className="text-xs font-bold text-cyan-600 hover:underline inline-flex items-center gap-1"
                        >
                          <Eye className="h-3.5 w-3.5" /> View Answers
                        </button>
                        <button
                          onClick={() => handleDeleteSubmission(s.id)}
                          className="text-xs font-bold text-rose-600 hover:underline inline-flex items-center gap-1"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      )}

      {/* ── TESTIMONIAL MODAL (ADD / EDIT) ── */}
      {isTestimonyModalOpen && editingTestimony && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <Card className="w-full max-w-lg p-6 bg-white shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-black text-brand-navy">
                {editingTestimony.id.includes("test-") ? "Leader Testimony" : "New Leader Testimony"}
              </h3>
              <button onClick={() => setIsTestimonyModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTestimony} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-600">Leader Full Name</label>
                  <input
                    required
                    type="text"
                    value={editingTestimony.name}
                    onChange={(e) => setEditingTestimony({ ...editingTestimony, name: e.target.value })}
                    placeholder="e.g. Dawit Mengistu"
                    className="h-9 w-full rounded border px-2.5 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-600">Role / Rank</label>
                  <input
                    required
                    type="text"
                    value={editingTestimony.role}
                    onChange={(e) => setEditingTestimony({ ...editingTestimony, role: e.target.value })}
                    placeholder="e.g. Crown Diamond Director"
                    className="h-9 w-full rounded border px-2.5 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-600">Years in Breakthrough</label>
                  <input
                    type="text"
                    value={editingTestimony.experience}
                    onChange={(e) => setEditingTestimony({ ...editingTestimony, experience: e.target.value })}
                    placeholder="e.g. 3 Years"
                    className="h-9 w-full rounded border px-2.5 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-600">Avatar Icon / Emoji</label>
                  <input
                    type="text"
                    value={editingTestimony.avatar}
                    onChange={(e) => setEditingTestimony({ ...editingTestimony, avatar: e.target.value })}
                    placeholder="e.g. 👑 or 💎"
                    className="h-9 w-full rounded border px-2.5 text-xs text-center"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-600">Testimonial Quote</label>
                <textarea
                  required
                  rows={3}
                  value={editingTestimony.quote}
                  onChange={(e) => setEditingTestimony({ ...editingTestimony, quote: e.target.value })}
                  placeholder="The leader's inspiring story and journey..."
                  className="w-full rounded border p-2 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-600">Day 1 Description</label>
                  <input
                    type="text"
                    value={editingTestimony.dayOne}
                    onChange={(e) => setEditingTestimony({ ...editingTestimony, dayOne: e.target.value })}
                    placeholder="e.g. Unemployed with big dreams"
                    className="h-9 w-full rounded border px-2.5 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-600">Now Description</label>
                  <input
                    type="text"
                    value={editingTestimony.now}
                    onChange={(e) => setEditingTestimony({ ...editingTestimony, now: e.target.value })}
                    placeholder="e.g. Top earner, car program"
                    className="h-9 w-full rounded border px-2.5 text-xs"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <Button type="button" variant="ghost" size="sm" onClick={() => setIsTestimonyModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="brand-gradient font-bold text-brand-navy">
                  Save Testimony
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* ── SUBMISSION 9-QUESTION DETAILS MODAL ── */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <Card className="w-full max-w-2xl p-6 bg-white shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <span className="rounded bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5">
                  Readiness: {selectedSubmission.q9_readiness_score}% (Qualified)
                </span>
                <h3 className="text-base font-black text-brand-navy mt-1">
                  Candidate Evaluation: {selectedSubmission.fullName}
                </h3>
              </div>
              <button onClick={() => setSelectedSubmission(null)} className="text-slate-400 hover:text-slate-700">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl text-xs">
              <div><strong className="text-slate-500">Phone:</strong> {selectedSubmission.phone}</div>
              <div><strong className="text-slate-500">Telegram:</strong> {selectedSubmission.telegramUsername || "N/A"}</div>
              <div><strong className="text-slate-500">Address / City:</strong> {selectedSubmission.address}</div>
              <div><strong className="text-slate-500">Submitted Date:</strong> {new Date(selectedSubmission.submittedAt).toLocaleString()}</div>
            </div>

            <div className="space-y-3 pt-2 text-xs">
              <h4 className="font-black text-brand-navy text-xs uppercase tracking-wider border-b pb-1">
                Candidate's 9 Assessment Answers (Image 2)
              </h4>

              <div className="p-2.5 rounded-lg border bg-slate-50">
                <strong className="text-slate-700 block mb-1">1. Current Job / Work (ምን ላይ ነው የምትሰራው?):</strong>
                <p className="text-slate-900 font-medium">{selectedSubmission.q1_current_work}</p>
              </div>

              <div className="p-2.5 rounded-lg border bg-slate-50">
                <strong className="text-slate-700 block mb-1">2. Target Goal (ምን ማሳካት ትፈልጋለህ/ሽ?):</strong>
                <p className="text-slate-900 font-medium">{selectedSubmission.q2_achieve_goal}</p>
              </div>

              <div className="p-2.5 rounded-lg border bg-slate-50">
                <strong className="text-slate-700 block mb-1">3. Family Living Home (የምትፈልገው መኖርያ ቤት):</strong>
                <p className="text-slate-900 font-medium">{selectedSubmission.q3_family_home}</p>
              </div>

              <div className="p-2.5 rounded-lg border bg-slate-50">
                <strong className="text-slate-700 block mb-1">4. 3 Spiritual & Vacation Places (መንፈሳዊ ቦታዎችና መዝናኛ):</strong>
                <p className="text-slate-900 font-medium">{selectedSubmission.q4_spiritual_vacation_places}</p>
              </div>

              <div className="p-2.5 rounded-lg border bg-slate-50">
                <strong className="text-slate-700 block mb-1">5. Hate About Current Work (በጣም የምትጠላው ስራ):</strong>
                <p className="text-slate-900 font-medium">{selectedSubmission.q5_hate_about_current_work}</p>
              </div>

              <div className="p-2.5 rounded-lg border bg-slate-50">
                <strong className="text-slate-700 block mb-1">6. Target Monthly Income (ወርሃዊ ገቢ በብር):</strong>
                <p className="text-slate-900 font-medium">{selectedSubmission.q6_target_monthly_income}</p>
              </div>

              <div className="p-2.5 rounded-lg border bg-slate-50">
                <strong className="text-slate-700 block mb-1">7. Current Action for Dream (ምን እየሰራህ ነው?):</strong>
                <p className="text-slate-900 font-medium">{selectedSubmission.q7_current_action_for_dream}</p>
              </div>

              <div className="p-2.5 rounded-lg border bg-slate-50">
                <strong className="text-slate-700 block mb-1">8. Can Achieve with Current Vehicle? (Yes or No):</strong>
                <p className="text-slate-900 font-medium">
                  {selectedSubmission.q8_can_achieve_with_current.toUpperCase()}{" "}
                  {selectedSubmission.q8_timeframe ? `(Timeframe: ${selectedSubmission.q8_timeframe})` : ""}
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t">
              <Button onClick={() => setSelectedSubmission(null)} size="sm" className="bg-brand-navy text-white font-bold">
                Close Inspector
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
