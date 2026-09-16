"use client";

import { useState, useMemo } from "react";
import {
  ArrowRight,
  Bell,
  Calendar,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock,
  Copy,
  Edit3,
  ExternalLink,
  FileSpreadsheet,
  FileText,
  Filter,
  Flame,
  MessageSquare,
  Network,
  Phone,
  PhoneCall,
  Plus,
  Printer,
  Search,
  Send,
  Share2,
  Sparkles,
  Star,
  Trash2,
  TrendingUp,
  User,
  UserCheck,
  Users,
  X,
  Zap
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { exportToCsv, printSection } from "@/lib/export-utils";

// Capital-to-IBO Progress Stages
export type ProspectStage =
  | "Capital" // Stage 1: 15%
  | "Invited" // Stage 2: 35%
  | "Presentation" // Stage 3: 60%
  | "FollowUp" // Stage 4: 80%
  | "IBO"; // Stage 5: 100% (Independent Business Owner Enrolled!)

export interface NameListContact {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  city: string;
  capitalType: "Warm Market" | "Cold Market" | "Referral";
  stage: ProspectStage;
  reminderNote: string;
  reminderDate: string;
  lastContacted: string;
  presentationDate?: string;
  interestScore: number; // 1 - 10
}

const initialContacts: NameListContact[] = [
  {
    id: "c-101",
    fullName: "Dawit Mengistu",
    phone: "+251 91 145 6789",
    email: "dawit.m@example.com",
    city: "Addis Ababa (Bole)",
    capitalType: "Warm Market",
    stage: "IBO",
    reminderNote: "Enrolled as Diamond IBO package! Needs NBO onboarding call tomorrow.",
    reminderDate: "Jun 24, 2026",
    lastContacted: "Today",
    presentationDate: "Jun 20, 2026",
    interestScore: 10
  },
  {
    id: "c-102",
    fullName: "Bethlehem Tilahun",
    phone: "+251 92 345 6789",
    email: "bethlehem.t@example.com",
    city: "Hawassa",
    capitalType: "Warm Market",
    stage: "Presentation",
    reminderNote: "Watched 25-minute business overview. Send Post-Presentation Text #1 immediately.",
    reminderDate: "Today 3:00 PM",
    lastContacted: "Yesterday",
    presentationDate: "Yesterday",
    interestScore: 8
  },
  {
    id: "c-103",
    fullName: "Kassahun Abebe",
    phone: "+251 93 987 6543",
    email: "kassahun.a@example.com",
    city: "Adama (Nazret)",
    capitalType: "Referral",
    stage: "FollowUp",
    reminderNote: "Wife wanted to see the compensation ladder. Host 3-way upline zoom tonight.",
    reminderDate: "Tonight 7:30 PM",
    lastContacted: "2 days ago",
    presentationDate: "Jun 21, 2026",
    interestScore: 9
  },
  {
    id: "c-104",
    fullName: "Genet Assefa",
    phone: "+251 94 567 1234",
    email: "genet.assefa@example.com",
    city: "Addis Ababa (CMC)",
    capitalType: "Cold Market",
    stage: "Invited",
    reminderNote: "Agreed to review the presentation link at 6 PM. Follow up tomorrow morning.",
    reminderDate: "Tomorrow 9:00 AM",
    lastContacted: "3 days ago",
    interestScore: 6
  },
  {
    id: "c-105",
    fullName: "Yared Wolde",
    phone: "+251 95 678 9012",
    email: "yared.w@example.com",
    city: "Bahir Dar",
    capitalType: "Warm Market",
    stage: "Capital",
    reminderNote: "Former university colleague. Needs warm re-connection text before inviting.",
    reminderDate: "Friday 4:00 PM",
    lastContacted: "Last week",
    interestScore: 7
  },
  {
    id: "c-106",
    fullName: "Rahel Haile",
    phone: "+251 96 123 7890",
    email: "rahel.h@example.com",
    city: "Addis Ababa (Megenagna)",
    capitalType: "Warm Market",
    stage: "IBO",
    reminderNote: "Officially started! Registered as Team Member IBO.",
    reminderDate: "Jun 26, 2026",
    lastContacted: "Yesterday",
    presentationDate: "Jun 18, 2026",
    interestScore: 10
  }
];

// Post-Presentation Text Marketing Templates ⭐
const postPresentationTemplates = [
  {
    id: "tpl-1",
    title: "Template #1: 'What Did You Like Best?' (Eric Worre)",
    tag: "Most Recommended ⭐",
    text: (name: string) =>
      `Hi ${name}! Great connecting with you. Now that you've seen the presentation, what did you like best about what you saw? 🌟`
  },
  {
    id: "tpl-2",
    title: "Template #2: 'Scale of 1 to 10'",
    tag: "Clarity Closing",
    text: (name: string) =>
      `Hey ${name}, hope you enjoyed the overview! On a scale of 1 to 10—where 1 means zero interest and 10 means you're ready to start right now—where do you see yourself? 🚀`
  },
  {
    id: "tpl-3",
    title: "Template #3: Urgency & Team Placement",
    tag: "Fast Action",
    text: (name: string) =>
      `Hi ${name}! I'm finalizing our team enrollment roster tonight and placing the next new leaders into our organization. Wanted to check in first so you can secure the top spot! Are you ready to get registered? 🔥`
  },
  {
    id: "tpl-4",
    title: "Template #4: 3-Way Upline Introduction",
    tag: "Social Proof",
    text: (name: string) =>
      `Hey ${name}, my top leader and mentor has 5 minutes tonight to welcome new partners and answer any questions. Can I introduce you for a quick 5-minute chat? 🤝`
  }
];

export function NameListOrganizer({
  onOpenAi
}: {
  onOpenAi?: (prompt: string) => void;
}) {
  const [contacts, setContacts] = useState<NameListContact[]>(initialContacts);
  const [searchQuery, setSearchQuery] = useState("");
  const [stageFilter, setStageFilter] = useState<string>("all");
  const [selectedContact, setSelectedContact] = useState<NameListContact | null>(null);

  // Marketing Text Modal
  const [activeMarketingContact, setActiveMarketingContact] = useState<NameListContact | null>(null);
  const [copiedTemplateId, setCopiedTemplateId] = useState<string | null>(null);

  // New Contact Modal
  const [isAddingContact, setIsAddingContact] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("+251 9");
  const [newEmail, setNewEmail] = useState("");
  const [newCity, setNewCity] = useState("Addis Ababa");
  const [newCapitalType, setNewCapitalType] = useState<NameListContact["capitalType"]>("Warm Market");
  const [newReminderNote, setNewReminderNote] = useState("");
  const [newReminderDate, setNewReminderDate] = useState("Tomorrow 2:00 PM");

  // Filtered contacts
  const filteredContacts = useMemo(() => {
    return contacts.filter((c) => {
      const matchQuery =
        c.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.phone.includes(searchQuery) ||
        c.city.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStage = stageFilter === "all" || c.stage === stageFilter;
      return matchQuery && matchStage;
    });
  }, [contacts, searchQuery, stageFilter]);

  // Stage Metrics: Capital up to IBO Level (Total No. of List)
  const totalCount = contacts.length;
  const capitalCount = contacts.filter((c) => c.stage === "Capital").length;
  const invitedCount = contacts.filter((c) => c.stage === "Invited").length;
  const presentationCount = contacts.filter((c) => c.stage === "Presentation").length;
  const followUpCount = contacts.filter((c) => c.stage === "FollowUp").length;
  const iboCount = contacts.filter((c) => c.stage === "IBO").length;
  const iboConversionRate = Math.round((iboCount / (totalCount || 1)) * 100);

  function getStagePercent(stage: ProspectStage) {
    switch (stage) {
      case "Capital":
        return 15;
      case "Invited":
        return 35;
      case "Presentation":
        return 60;
      case "FollowUp":
        return 80;
      case "IBO":
        return 100;
    }
  }

  function handleStageChange(contactId: string, newStage: ProspectStage) {
    setContacts((prev) =>
      prev.map((c) => (c.id === contactId ? { ...c, stage: newStage } : c))
    );
  }

  function handleAddContact(e: React.FormEvent) {
    e.preventDefault();
    if (!newName.trim() || !newPhone.trim()) return;

    const contact: NameListContact = {
      id: `c-${Date.now()}`,
      fullName: newName.trim(),
      phone: newPhone.trim(),
      email: newEmail.trim() || "contact@example.com",
      city: newCity.trim() || "Addis Ababa",
      capitalType: newCapitalType,
      stage: "Capital",
      reminderNote: newReminderNote.trim() || "Added to Name List Social Capital.",
      reminderDate: newReminderDate || "Tomorrow",
      lastContacted: "Just added",
      interestScore: 7
    };

    setContacts([contact, ...contacts]);
    setIsAddingContact(false);
    setNewName("");
    setNewPhone("+251 9");
    setNewEmail("");
    setNewReminderNote("");
  }

  function copyTextTemplate(tplId: string, text: string) {
    navigator.clipboard.writeText(text);
    setCopiedTemplateId(tplId);
    setTimeout(() => setCopiedTemplateId(null), 2500);
  }

  function handlePrintHardCopy() {
    printSection("printable-name-list-area", "Name List Organizer — Social Capital Pipeline");
  }

  function handleExportCsv() {
    const rows = contacts.map((c) => ({
      "Full Name": c.fullName,
      "Phone": c.phone,
      "Email": c.email,
      "City": c.city,
      "Capital Type": c.capitalType,
      "Stage": c.stage,
      "Interest Score": c.interestScore,
      "Reminder Note": c.reminderNote,
      "Reminder Date": c.reminderDate,
      "Last Contacted": c.lastContacted,
    }));
    exportToCsv(`MyUpline_NameList_${new Date().toISOString().slice(0,10)}`, rows);
  }

  return (
    <div className="space-y-6">
      {/* 1. HEADER BANNER */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-gradient-to-r from-brand-navy via-brand-deep to-[#0d3478] p-6 text-white shadow-xl">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-cyan/40 bg-brand-cyan/15 px-3 py-1 text-xs font-black tracking-wide text-brand-cyan uppercase backdrop-blur">
            <Users className="h-3.5 w-3.5" />
            Social Capital & Pipeline Architecture
          </div>
          <h2 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">
            Name List Organizer
          </h2>
          <p className="mt-1 text-sm text-white/75">
            Manage your social capital pipeline from <strong>Capital (0%)</strong> up to <strong>IBO (100%)</strong> with direct call & text, reminder notes, and post-presentation text marketing.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* AI Prospect Coach */}
          <Button
            onClick={() =>
              onOpenAi?.(
                "Analyze my current Name List capital pipeline. Give me a strategy to convert my prospects from 'Presentation' and 'Follow-up' into full registered IBOs this week."
              )
            }
            className="brand-gradient font-black text-brand-navy shadow-lg"
          >
            <Sparkles className="mr-2 h-4 w-4" />
            AI Conversion Strategist
          </Button>

          {/* Export CSV */}
          <Button
            variant="secondary"
            onClick={handleExportCsv}
            className="border-white/20 bg-white/10 hover:bg-white/20"
          >
            <FileSpreadsheet className="mr-1.5 h-4 w-4" />
            Export CSV
          </Button>

          {/* Print Hard Copy */}
          <Button
            variant="secondary"
            onClick={handlePrintHardCopy}
            className="border-white/20 bg-white/10 hover:bg-white/20"
          >
            <Printer className="mr-1.5 h-4 w-4" />
            Print / PDF
          </Button>

          {/* Add to List */}
          <Button
            onClick={() => setIsAddingContact(true)}
            className="bg-brand-cyan text-brand-navy font-black hover:bg-brand-cyan/90"
          >
            <Plus className="mr-1.5 h-4 w-4" />
            Add Prospect
          </Button>
        </div>
      </div>

      {/* 2. TOTAL NO OF LIST OF CAPITAL UP TO IBO LEVEL (KPI Strip) */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
        <Card className="p-4 border-slate-200 bg-white">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase">
            <span>Total Capital</span>
            <Users className="h-4 w-4 text-brand-blue" />
          </div>
          <p className="mt-2 text-2xl font-black text-brand-navy">{totalCount}</p>
          <span className="text-[11px] text-slate-500">Total Name List</span>
        </Card>

        <Card className="p-4 border-slate-200 bg-slate-50">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase">
            <span>Stage 1: Capital</span>
            <span className="rounded bg-slate-200 px-1.5 py-0.2 text-[10px]">15%</span>
          </div>
          <p className="mt-2 text-2xl font-black text-slate-700">{capitalCount}</p>
          <span className="text-[11px] text-slate-500">Uncontacted Asset</span>
        </Card>

        <Card className="p-4 border-slate-200 bg-cyan-50/50">
          <div className="flex items-center justify-between text-xs font-bold text-cyan-800 uppercase">
            <span>Stage 2: Invited</span>
            <span className="rounded bg-cyan-100 px-1.5 py-0.2 text-[10px]">35%</span>
          </div>
          <p className="mt-2 text-2xl font-black text-brand-blue">{invitedCount}</p>
          <span className="text-[11px] text-slate-500">Link Sent / Scheduled</span>
        </Card>

        <Card className="p-4 border-slate-200 bg-amber-50/50">
          <div className="flex items-center justify-between text-xs font-bold text-amber-800 uppercase">
            <span>Stage 3: Present</span>
            <span className="rounded bg-amber-100 px-1.5 py-0.2 text-[10px]">60%</span>
          </div>
          <p className="mt-2 text-2xl font-black text-amber-700">{presentationCount}</p>
          <span className="text-[11px] text-amber-700 font-bold">Needs Text Marketing ⭐</span>
        </Card>

        <Card className="p-4 border-slate-200 bg-indigo-50/50">
          <div className="flex items-center justify-between text-xs font-bold text-indigo-800 uppercase">
            <span>Stage 4: Follow-up</span>
            <span className="rounded bg-indigo-100 px-1.5 py-0.2 text-[10px]">80%</span>
          </div>
          <p className="mt-2 text-2xl font-black text-indigo-700">{followUpCount}</p>
          <span className="text-[11px] text-slate-500">In 3-Way Closing</span>
        </Card>

        <Card className="p-4 border-emerald-300 bg-gradient-to-br from-emerald-50 to-white shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold text-emerald-800 uppercase">
            <span>Stage 5: IBO Level</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-emerald-700">{iboCount}</span>
            <span className="text-xs font-bold text-emerald-600">({iboConversionRate}%)</span>
          </div>
          <span className="text-[11px] font-bold text-emerald-700">100% Fully Enrolled!</span>
        </Card>
      </div>

      {/* 3. FILTER & SEARCH CONTROL BAR */}
      <Card className="p-4 border-slate-200 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-1 items-center gap-3 min-w-[260px]">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by prospect name, phone, or city..."
              className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm outline-none focus:border-brand-blue"
            />
          </div>
        </div>

        {/* Stage Filter Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-semibold text-slate-600">
          <span className="text-slate-400 font-bold uppercase text-[10px] mr-1">Filter Stage:</span>
          {[
            { id: "all", label: "All Contacts" },
            { id: "Capital", label: "Capital (0%)" },
            { id: "Invited", label: "Invited" },
            { id: "Presentation", label: "Watched Presentation ⭐" },
            { id: "FollowUp", label: "Follow-up" },
            { id: "IBO", label: "IBO (100%)" }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setStageFilter(item.id)}
              className={cn(
                "rounded-lg px-2.5 py-1.5 transition",
                stageFilter === item.id
                  ? "brand-gradient text-brand-navy font-black shadow-sm"
                  : "bg-slate-100 hover:bg-slate-200/70 text-slate-700"
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </Card>

      {/* 4. MAIN NAME LIST TABLE & DIRECT ACTIONS */}
      <Card className="overflow-hidden border-slate-200 shadow-sm" id="printable-name-list-area">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50/90 text-[11px] font-black uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-3.5">Prospect & Social Capital</th>
                <th className="px-4 py-3.5">Direct Call & Text</th>
                <th className="px-4 py-3.5">Capital up to IBO (100%)</th>
                <th className="px-4 py-3.5">Reminder Note</th>
                <th className="px-4 py-3.5 text-right">Text Marketing ⭐</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredContacts.map((contact) => {
                const pct = getStagePercent(contact.stage);
                const isIbo = contact.stage === "IBO";

                return (
                  <tr
                    key={contact.id}
                    className="transition hover:bg-slate-50/80"
                  >
                    {/* Prospect & Social Capital */}
                    <td className="px-4 py-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-black text-brand-navy text-sm">{contact.fullName}</p>
                          <span
                            className={cn(
                              "rounded px-1.5 py-0.2 text-[10px] font-bold",
                              contact.capitalType === "Warm Market"
                                ? "bg-amber-100 text-amber-800"
                                : contact.capitalType === "Referral"
                                ? "bg-purple-100 text-purple-800"
                                : "bg-slate-100 text-slate-600"
                            )}
                          >
                            {contact.capitalType}
                          </span>
                        </div>
                        <p className="mt-0.5 text-xs text-slate-500">
                          {contact.city} • Interest: <strong className="text-brand-blue">{contact.interestScore}/10</strong>
                        </p>
                      </div>
                    </td>

                    {/* Direct Call & Text Feature */}
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        {/* Direct Call Button (tel:) */}
                        <a
                          href={`tel:${contact.phone.replace(/\s+/g, "")}`}
                          title={`Direct Phone Call to ${contact.phone}`}
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-bold text-slate-700 shadow-sm transition hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-700"
                        >
                          <PhoneCall className="h-3.5 w-3.5 text-emerald-600" />
                          <span className="hidden sm:inline">Call</span>
                        </a>

                        {/* Direct SMS / Text Button (sms:) */}
                        <a
                          href={`sms:${contact.phone.replace(/\s+/g, "")}?body=Hi ${contact.fullName}, hope you are doing well!`}
                          title={`Direct SMS to ${contact.phone}`}
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-bold text-slate-700 shadow-sm transition hover:border-brand-blue hover:bg-cyan-50 hover:text-brand-blue"
                        >
                          <MessageSquare className="h-3.5 w-3.5 text-brand-blue" />
                          <span className="hidden sm:inline">Text</span>
                        </a>

                        <span className="font-mono text-xs text-slate-600 hidden md:inline ml-1">
                          {contact.phone}
                        </span>
                      </div>
                    </td>

                    {/* Progress from Capital up to IBO (100%) */}
                    <td className="px-4 py-4 min-w-[200px]">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <select
                          value={contact.stage}
                          onChange={(e) => handleStageChange(contact.id, e.target.value as ProspectStage)}
                          className={cn(
                            "rounded font-bold text-[11px] px-1.5 py-0.5 border outline-none cursor-pointer",
                            isIbo
                              ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                              : "bg-white text-slate-700 border-slate-200"
                          )}
                        >
                          <option value="Capital">Stage 1: Capital (15%)</option>
                          <option value="Invited">Stage 2: Invited (35%)</option>
                          <option value="Presentation">Stage 3: Presentation (60%)</option>
                          <option value="FollowUp">Stage 4: Follow-up (80%)</option>
                          <option value="IBO">Stage 5: IBO Complete (100%)</option>
                        </select>
                        <span className="font-black text-brand-blue text-xs">{pct}%</span>
                      </div>

                      {/* Progress Bar */}
                      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                        <div
                          className={cn(
                            "h-full rounded-full transition-all duration-500",
                            isIbo ? "bg-emerald-500" : pct >= 60 ? "bg-amber-500" : "brand-gradient"
                          )}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </td>

                    {/* Reminder "Note" About the Name List */}
                    <td className="px-4 py-4 max-w-[260px]">
                      <div className="flex items-start gap-2">
                        <Bell className="h-3.5 w-3.5 text-amber-500 shrink-0 mt-0.5" />
                        <div className="text-xs">
                          <p className="font-medium text-slate-800 line-clamp-2">
                            {contact.reminderNote}
                          </p>
                          <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded mt-1 inline-block">
                            🔔 {contact.reminderDate}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Text Marketing After Presentation ⭐ */}
                    <td className="px-4 py-4 text-right">
                      <Button
                        size="sm"
                        onClick={() => setActiveMarketingContact(contact)}
                        className={cn(
                          "h-8 text-xs font-bold",
                          contact.stage === "Presentation" || contact.stage === "FollowUp"
                            ? "brand-gradient text-brand-navy shadow-sm"
                            : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                        )}
                      >
                        <Star className="mr-1 h-3.5 w-3.5 text-amber-500 fill-amber-400" />
                        Marketing Text ⭐
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* 5. MODAL: TEXT MARKETING AFTER PRESENTATION ⭐ */}
      {activeMarketingContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 bg-brand-navy p-5 text-white">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl brand-gradient text-brand-navy font-black">
                  <Star className="h-5 w-5 fill-brand-navy" />
                </div>
                <div>
                  <h3 className="text-base font-black">
                    Post-Presentation Text Marketing ⭐
                  </h3>
                  <p className="text-xs text-white/70">
                    Recipient: <strong>{activeMarketingContact.fullName}</strong> ({activeMarketingContact.phone})
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActiveMarketingContact(null)}
                className="rounded-lg p-1.5 text-white/70 hover:bg-white/10 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Templates List */}
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wide text-slate-500">
                  Ready-to-Send Proven Closing Scripts
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() =>
                    onOpenAi?.(
                      `Draft a personalized, high-converting follow-up text for my prospect ${activeMarketingContact.fullName}, who just watched our business presentation overview. Tone: exciting, clear, professional.`
                    )
                  }
                  className="h-7 text-xs font-bold text-brand-blue"
                >
                  <Sparkles className="mr-1 h-3.5 w-3.5" />
                  AI Custom Script
                </Button>
              </div>

              <div className="space-y-3">
                {postPresentationTemplates.map((tpl) => {
                  const messageText = tpl.text(activeMarketingContact.fullName);
                  const isCopied = copiedTemplateId === tpl.id;

                  return (
                    <div
                      key={tpl.id}
                      className="rounded-xl border border-slate-200 bg-slate-50 p-4 transition hover:border-slate-300"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-bold text-xs text-brand-navy">{tpl.title}</h4>
                        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-black text-amber-800">
                          {tpl.tag}
                        </span>
                      </div>

                      <p className="text-xs text-slate-700 bg-white p-3 rounded-lg border border-slate-200 font-medium leading-relaxed">
                        "{messageText}"
                      </p>

                      <div className="mt-3 flex items-center justify-end gap-2">
                        <button
                          onClick={() => copyTextTemplate(tpl.id, messageText)}
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-bold text-slate-700 transition hover:bg-slate-100"
                        >
                          {isCopied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                          {isCopied ? "Copied!" : "Copy Text"}
                        </button>

                        <a
                          href={`sms:${activeMarketingContact.phone.replace(/\s+/g, "")}?body=${encodeURIComponent(messageText)}`}
                          className="inline-flex items-center gap-1 rounded-lg brand-gradient px-3 py-1.5 text-xs font-black text-brand-navy shadow-sm hover:brightness-105"
                        >
                          <Send className="h-3.5 w-3.5" />
                          Send SMS Now
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. MODAL: ADD PROSPECT TO NAME LIST CAPITAL */}
      {isAddingContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-in fade-in">
          <Card className="w-full max-w-lg p-6 bg-white shadow-2xl border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-black text-brand-navy">Add to Name List Capital</h3>
              <button
                onClick={() => setIsAddingContact(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddContact} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                  Full Name
                </label>
                <input
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Solomon Hailu"
                  className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-brand-blue"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                    Phone Number (Direct Call/Text)
                  </label>
                  <input
                    required
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="+251 9..."
                    className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-brand-blue"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                    Location / City
                  </label>
                  <input
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    placeholder="e.g. Addis Ababa"
                    className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-brand-blue"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                    Social Capital Source
                  </label>
                  <select
                    value={newCapitalType}
                    onChange={(e) => setNewCapitalType(e.target.value as NameListContact["capitalType"])}
                    className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-brand-blue"
                  >
                    <option value="Warm Market">Warm Market (Family/Friends)</option>
                    <option value="Cold Market">Cold Market (Social/Online)</option>
                    <option value="Referral">Referral from Downline</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                    Reminder Date & Time
                  </label>
                  <input
                    value={newReminderDate}
                    onChange={(e) => setNewReminderDate(e.target.value)}
                    placeholder="e.g. Tomorrow 3:00 PM"
                    className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-brand-blue"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                  Reminder "Note" About Prospect
                </label>
                <textarea
                  rows={2}
                  value={newReminderNote}
                  onChange={(e) => setNewReminderNote(e.target.value)}
                  placeholder="Key details, background, family goals, or specific objections to prepare for..."
                  className="w-full rounded-lg border border-slate-200 p-2.5 text-sm outline-none focus:border-brand-blue"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <Button type="button" variant="ghost" onClick={() => setIsAddingContact(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="brand-gradient font-bold text-brand-navy">
                  Add to Name List Capital
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
