"use client";

import { useState } from "react";
import {
  Award,
  CheckCircle2,
  Download,
  Eye,
  FileCheck,
  FileSpreadsheet,
  Medal,
  Printer,
  QrCode,
  ShieldCheck,
  Sparkles,
  Trophy,
  UserCheck
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { printSection, exportToCsv } from "@/lib/export-utils";

export type CertificateData = {
  id: string;
  certNumber: string;
  title: string;
  subtitle: string;
  recipientName: string;
  achievement: string;
  issueDate: string;
  signatory: string;
  signatoryRole: string;
  badgeTone: "gold" | "cyan" | "emerald" | "purple";
  category: "Rank Advancement" | "Recruitment" | "Leadership" | "LMS Certification";
};

const sampleCertificates: CertificateData[] = [
  {
    id: "c-1",
    certNumber: "MU-RANK-2026-8819",
    title: "Certificate of Rank Advancement",
    subtitle: "IN RECOGNITION OF EXCEPTIONAL LEADERSHIP & ORGANIZATIONAL EXPANSION",
    recipientName: "Almaz Tadesse",
    achievement: "Successfully promoted to Diamond Director through proven organizational growth and team mentorship.",
    issueDate: "June 15, 2026",
    signatory: "Dawit Wolde",
    signatoryRole: "Managing Director, MyUpline Global",
    badgeTone: "gold",
    category: "Rank Advancement"
  },
  {
    id: "c-2",
    certNumber: "MU-RECRUIT-2026-4402",
    title: "Top Recruiter of Excellence",
    subtitle: "FOR OUTSTANDING TALENT ACQUISITION AND DIRECT NETWORK ENROLLMENT",
    recipientName: "Biniam Haile",
    achievement: "Achieved the #1 highest direct recruit volume for the month of June 2026 with 38 validated enrolments.",
    issueDate: "June 30, 2026",
    signatory: "Eleni Kassaye",
    signatoryRole: "VP of Network Growth",
    badgeTone: "cyan",
    category: "Recruitment"
  },
  {
    id: "c-3",
    certNumber: "MU-LEAD-2026-3199",
    title: "Certificate of Leadership Mastery",
    subtitle: "ACADEMIC & FIELD OPERATIONAL EXCELLENCE ACCREDITATION",
    recipientName: "Selamawit Bekele",
    achievement: "Completed 10 advanced modules in Team Governance, Duplication Systems, and Ethical Direct Selling.",
    issueDate: "May 28, 2026",
    signatory: "Dawit Wolde",
    signatoryRole: "Managing Director, MyUpline Global",
    badgeTone: "emerald",
    category: "Leadership"
  },
  {
    id: "c-4",
    certNumber: "MU-LMS-2026-1025",
    title: "LMS Academy Graduate",
    subtitle: "OFFICIAL COMPLETION OF PROFESSIONAL RECRUITMENT & RETENTION ACADEMY",
    recipientName: "Yonas Mekonnen",
    achievement: "Passed all 8 practical assessments with Distinction (Score: 98%) on the MyUpline Learning Management System.",
    issueDate: "June 10, 2026",
    signatory: "Abebech Tefera",
    signatoryRole: "Chief Training Officer",
    badgeTone: "purple",
    category: "LMS Certification"
  }
];

export function RecognitionCertificates({
  onOpenAi
}: {
  onOpenAi?: (prompt: string) => void;
}) {
  const [certificates, setCertificates] = useState<CertificateData[]>(sampleCertificates);
  const [activeCert, setActiveCert] = useState<CertificateData>(sampleCertificates[0]);
  const [recipientFilter, setRecipientFilter] = useState("");
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  function handlePrintCertificate() {
    printSection("certificate-print-area", `${activeCert.title} — ${activeCert.recipientName}`);
  }

  function handleExportCertificatesCsv() {
    const rows = certificates.map((c) => ({
      "Certificate Number": c.certNumber,
      "Title": c.title,
      "Recipient": c.recipientName,
      "Category": c.category,
      "Achievement Citation": c.achievement,
      "Date Issued": c.issueDate,
      "Signatory": `${c.signatory} (${c.signatoryRole})`,
    }));
    exportToCsv(`MyUpline_Certificates_${new Date().toISOString().slice(0, 10)}`, rows);
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-gradient-to-r from-brand-navy via-brand-deep to-[#0d2b63] p-6 text-white shadow-xl">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-400/10 px-3 py-1 text-xs font-semibold text-amber-300">
            <Award className="h-3.5 w-3.5" />
            Accreditation & Honors
          </div>
          <h2 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">
            Recognition & Certificates
          </h2>
          <p className="mt-1 text-sm text-white/75">
            Issue, view, verify, and print official tamper-evident digital certificates of achievement and rank milestones.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            onClick={() =>
              onOpenAi?.(
                `Write an inspirational certificate citation and official praise note for ${activeCert.recipientName}, celebrating their ${activeCert.title}.`
              )
            }
            className="brand-gradient font-bold text-brand-navy shadow-lg"
          >
            <Sparkles className="mr-2 h-4 w-4" />
            AI Draft Citation
          </Button>
          <Button
            variant="secondary"
            onClick={handleExportCertificatesCsv}
            className="border-white/20 bg-white/10 hover:bg-white/20 text-white"
          >
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <Button
            variant="secondary"
            onClick={handlePrintCertificate}
            className="border-white/20 bg-white/10 hover:bg-white/20 text-white"
          >
            <Printer className="mr-2 h-4 w-4" />
            Print / PDF Certificate
          </Button>
        </div>
      </div>

      {/* Grid: Certificate Selector & Live Certificate Frame */}
      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        {/* Certificate List */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
            Issued Recognition Certificates ({certificates.length})
          </h3>
          <div className="space-y-2.5">
            {certificates.map((cert) => {
              const isSelected = activeCert.id === cert.id;
              return (
                <div
                  key={cert.id}
                  onClick={() => setActiveCert(cert)}
                  className={cn(
                    "cursor-pointer rounded-xl border p-4 transition-all duration-200",
                    isSelected
                      ? "border-brand-blue bg-cyan-50/50 shadow-md ring-1 ring-brand-blue"
                      : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={cn(
                          "flex h-9 w-9 items-center justify-center rounded-lg font-bold shadow-sm",
                          cert.badgeTone === "gold" && "bg-amber-100 text-amber-800",
                          cert.badgeTone === "cyan" && "bg-cyan-100 text-brand-blue",
                          cert.badgeTone === "emerald" && "bg-emerald-100 text-emerald-800",
                          cert.badgeTone === "purple" && "bg-purple-100 text-purple-800"
                        )}
                      >
                        <Medal className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-bold text-brand-navy text-sm">{cert.title}</p>
                        <p className="text-xs text-slate-500">{cert.recipientName}</p>
                      </div>
                    </div>
                    <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-mono text-slate-600">
                      {cert.certNumber}
                    </span>
                  </div>

                  <div className="mt-2.5 flex items-center justify-between border-t border-slate-100 pt-2 text-[11px] text-slate-500">
                    <span>Issued: {cert.issueDate}</span>
                    <span className="font-semibold text-emerald-600 flex items-center gap-1">
                      <ShieldCheck className="h-3 w-3" /> Verified
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Formal Printable Certificate Canvas */}
        <div className="flex flex-col items-center">
          <div
            id="certificate-print-area"
            className="w-full max-w-[620px] rounded-2xl border-8 border-[#d4af37] bg-gradient-to-b from-[#fdfcf9] via-white to-[#fbf9f4] p-8 text-slate-900 shadow-2xl relative select-none flex flex-col justify-between aspect-[1.414/1]"
          >
            {/* Ornate Inner Double Border */}
            <div className="absolute inset-2 rounded-xl border-2 border-[#d4af37]/60 pointer-events-none" />
            <div className="absolute inset-3.5 rounded-lg border border-[#d4af37]/30 pointer-events-none" />

            {/* Top Brand & Seal */}
            <div className="text-center relative z-10">
              <div className="flex items-center justify-center gap-2">
                <div className="h-6 w-6 rounded-full bg-brand-navy flex items-center justify-center">
                  <ShieldCheck className="h-3.5 w-3.5 text-brand-cyan" />
                </div>
                <span className="text-xs font-black tracking-[0.25em] text-brand-navy uppercase">
                  MYUPLINE GLOBAL ACCREDITATION
                </span>
              </div>

              <h1 className="mt-4 font-serif text-2xl sm:text-3xl font-bold tracking-wide text-brand-navy uppercase">
                {activeCert.title}
              </h1>
              <p className="mt-1 text-[10px] sm:text-xs font-semibold tracking-wider text-slate-500 uppercase">
                {activeCert.subtitle}
              </p>
            </div>

            {/* Middle Recipient & Citation */}
            <div className="my-auto text-center relative z-10 py-3">
              <p className="text-xs italic text-slate-600">This official certificate is proudly presented to:</p>
              <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-extrabold text-[#996515] tracking-wide underline decoration-[#d4af37]/50 underline-offset-8">
                {activeCert.recipientName}
              </h2>
              <p className="mx-auto mt-4 max-w-md text-xs sm:text-sm leading-relaxed text-slate-700">
                {activeCert.achievement}
              </p>
            </div>

            {/* Bottom Official Signatures & Gold Seal */}
            <div className="relative z-10 flex items-end justify-between border-t border-[#d4af37]/30 pt-4 px-2">
              {/* Left: Signatory */}
              <div className="text-left">
                <div className="h-7 w-32 border-b border-slate-700 font-serif italic text-slate-800 text-sm flex items-end">
                  {activeCert.signatory}
                </div>
                <p className="mt-1 text-[11px] font-bold text-slate-800">{activeCert.signatory}</p>
                <p className="text-[9px] text-slate-500">{activeCert.signatoryRole}</p>
              </div>

              {/* Center: Gold Foil Hologram Seal */}
              <div className="flex flex-col items-center">
                <div className="h-14 w-14 rounded-full bg-gradient-to-tr from-amber-500 via-yellow-300 to-amber-600 p-0.5 shadow-lg flex items-center justify-center border-2 border-white">
                  <div className="h-full w-full rounded-full border border-amber-700/40 flex flex-col items-center justify-center text-center p-1 bg-gradient-to-b from-yellow-100 to-amber-200">
                    <Trophy className="h-4 w-4 text-amber-800" />
                    <span className="text-[7px] font-black text-amber-900 tracking-tighter uppercase">OFFICIAL SEAL</span>
                  </div>
                </div>
                <span className="mt-1 font-mono text-[8px] text-slate-400">{activeCert.certNumber}</span>
              </div>

              {/* Right: Date & Verification */}
              <div className="text-right">
                <div className="h-7 border-b border-slate-700 flex items-end justify-end">
                  <span className="text-xs font-semibold text-slate-800">{activeCert.issueDate}</span>
                </div>
                <p className="mt-1 text-[11px] font-bold text-slate-800">Date of Award</p>
                <p className="text-[9px] text-emerald-600 font-semibold">Digitally Signed & Validated</p>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="mt-4 flex flex-wrap gap-2">
            <Button onClick={handlePrintCertificate} className="brand-gradient text-brand-navy font-bold">
              <Printer className="mr-2 h-4 w-4" />
              Print / Export Official Certificate
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
