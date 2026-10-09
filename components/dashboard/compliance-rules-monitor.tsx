"use client";

import { useState } from "react";
import {
  ShieldCheck,
  Scale,
  AlertTriangle,
  CheckCircle2,
  FileCheck,
  Download,
  Printer,
  Sparkles,
  Info,
  Layers,
  FileText,
  Building,
  Globe,
  Award,
  ArrowRight,
  TrendingUp,
  X
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { exportToCsv, printSection } from "@/lib/export-utils";

interface IncomeDisclosureRow {
  rank: string;
  percentDistributors: number;
  avgAnnualETB: number;
  avgAnnualUSD: number;
  medianAnnualETB: number;
  highETB: number;
  lowETB: number;
  avgMonthsToAchieve: number;
}

const mockIncomeDisclosure: IncomeDisclosureRow[] = [
  {
    rank: "Diamond Director",
    percentDistributors: 0.8,
    avgAnnualETB: 1450000,
    avgAnnualUSD: 25305,
    medianAnnualETB: 1280000,
    highETB: 3200000,
    lowETB: 850000,
    avgMonthsToAchieve: 22
  },
  {
    rank: "Platinum Leader",
    percentDistributors: 2.4,
    avgAnnualETB: 680000,
    avgAnnualUSD: 11867,
    medianAnnualETB: 620000,
    highETB: 1100000,
    lowETB: 420000,
    avgMonthsToAchieve: 14
  },
  {
    rank: "Gold Executive",
    percentDistributors: 6.8,
    avgAnnualETB: 290000,
    avgAnnualUSD: 5061,
    medianAnnualETB: 265000,
    highETB: 480000,
    lowETB: 160000,
    avgMonthsToAchieve: 8
  },
  {
    rank: "Silver Manager",
    percentDistributors: 16.5,
    avgAnnualETB: 115000,
    avgAnnualUSD: 2007,
    medianAnnualETB: 98000,
    highETB: 210000,
    lowETB: 45000,
    avgMonthsToAchieve: 5
  },
  {
    rank: "Bronze Builder",
    percentDistributors: 28.2,
    avgAnnualETB: 42000,
    avgAnnualUSD: 733,
    medianAnnualETB: 36000,
    highETB: 85000,
    lowETB: 12000,
    avgMonthsToAchieve: 3
  },
  {
    rank: "Active IBO",
    percentDistributors: 45.3,
    avgAnnualETB: 14500,
    avgAnnualUSD: 253,
    medianAnnualETB: 9800,
    highETB: 35000,
    lowETB: 1200,
    avgMonthsToAchieve: 1
  }
];

const crossBorderChecklist = [
  {
    region: "Ethiopia (Domestic Hub)",
    authority: "Ministry of Trade & Regional Integration / MOTRI",
    requirements: [
      { name: "Commercial Direct Selling Registration", status: "VERIFIED", notes: "Valid license #MOTRI/DS/2026/894" },
      { name: "Withholding Tax (2%) on Commission Disbursements", status: "VERIFIED", notes: "Automated e-tax filing module enabled" },
      { name: "Ethiopian Food & Drug Authority (EFDA) Certification", status: "VERIFIED", notes: "All health/wellness products certified" }
    ]
  },
  {
    region: "East Africa (Kenya / COMESA)",
    authority: "Direct Selling Association of Kenya (DSAK)",
    requirements: [
      { name: "Anti-Pyramid Statutory Compliance Declaration", status: "VERIFIED", notes: "Retail volume exceeds 70% statutory limit" },
      { name: "Kenya Revenue Authority (KRA) Non-Resident VAT", status: "VERIFIED", notes: "Digital service tax compliance active" }
    ]
  },
  {
    region: "Middle East (UAE / GCC)",
    authority: "Direct Selling Association UAE (DSA-UAE)",
    requirements: [
      { name: "Consumer Protection Code of Ethics Acceptance", status: "VERIFIED", notes: "Annual renewal complete" },
      { name: "Multi-Currency Remittance Protocol", status: "VERIFIED", notes: "SWIFT & TRC-20 settlement rails approved" }
    ]
  },
  {
    region: "International (USA / EU Benchmark)",
    authority: "Direct Selling Association (DSA) / FTC Guidelines",
    requirements: [
      { name: "FTC 70% Retail End-Consumer Volume Rule", status: "VERIFIED", notes: "Platform ratio at 74.8% (Passes requirement)" },
      { name: "Mandatory 30-Day 90% Buyback / Refund Policy", status: "VERIFIED", notes: "Fully integrated into return terms" },
      { name: "Annual Income Disclosure Statement (IDS) Publication", status: "VERIFIED", notes: "Publicly visible on member portals" }
    ]
  }
];

interface ComplianceRulesMonitorProps {
  onOpenAi?: (prompt: string) => void;
}

export function ComplianceRulesMonitor({ onOpenAi }: ComplianceRulesMonitorProps) {
  const [activeTab, setActiveTab] = useState<"rule70" | "buyback" | "ids" | "crossborder">("rule70");

  const retailVolumeETB = 1832600;
  const internalVolumeETB = 617400;
  const totalVolumeETB = retailVolumeETB + internalVolumeETB;
  const retailRatioPercent = Math.round((retailVolumeETB / totalVolumeETB) * 1000) / 10; // 74.8%

  const handleExportIdsCsv = () => {
    const rows = mockIncomeDisclosure.map((row) => ({
      "Distributor Rank": row.rank,
      "% of Total Field": `${row.percentDistributors}%`,
      "Average Annual Earnings (ETB)": row.avgAnnualETB,
      "Average Annual Earnings ($ USD)": row.avgAnnualUSD,
      "Median Annual (ETB)": row.medianAnnualETB,
      "Highest Recorded (ETB)": row.highETB,
      "Lowest Recorded (ETB)": row.lowETB,
      "Avg Months to Achieve": row.avgMonthsToAchieve
    }));
    exportToCsv("MyUpline_Official_Income_Disclosure_Statement", rows);
  };

  return (
    <div id="compliance-rules-printable" className="space-y-6">
      {/* ── Top Header ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 border border-blue-500/20 px-3 py-1 text-xs font-bold text-blue-900">
            <Scale className="h-3.5 w-3.5 text-blue-600" />
            <span>DSA & FTC International Regulatory Audit</span>
          </div>
          <h2 className="mt-1 text-xl font-black text-brand-navy sm:text-2xl">
            Regulatory Compliance & 70% Rule Monitor
          </h2>
          <p className="text-xs text-slate-500 sm:text-sm">
            Auditing legal direct selling standards, retail end-consumer ratios, anti-inventory loading caps, and statutory income disclosures.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {onOpenAi && (
            <Button
              variant="ghost"
              onClick={() =>
                onOpenAi(
                  `Generate an executive legal compliance brief on our MLM platform: Retail ratio is 74.8%, anti-inventory loading caps are verified, and 30-day buyback guarantee is active. Highlight our immunity against pyramid scheme classifications under FTC and DSA rules.`
                )
              }
              className="border border-slate-200 bg-white text-xs font-bold shadow-sm hover:bg-slate-50"
            >
              <Sparkles className="mr-1.5 h-3.5 w-3.5 text-brand-blue" />
              AI Compliance Auditor
            </Button>
          )}

          <Button
            variant="ghost"
            onClick={() => printSection("compliance-rules-printable", "MyUpline Regulatory Compliance Dossier")}
            className="border border-slate-200 bg-white text-xs font-bold shadow-sm hover:bg-slate-50"
          >
            <Printer className="mr-1.5 h-3.5 w-3.5 text-slate-600" />
            Print Legal Filing
          </Button>

          <Button
            onClick={handleExportIdsCsv}
            className="bg-brand-navy text-xs font-bold text-white hover:bg-slate-800"
          >
            <Download className="mr-1.5 h-3.5 w-3.5" />
            Export Disclosure (CSV)
          </Button>
        </div>
      </div>

      {/* ── Key Compliance KPI Status Cards ── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* 70% Rule Score */}
        <Card className="border-l-4 border-l-emerald-500 p-5 shadow-sm bg-gradient-to-br from-emerald-50/40 to-white">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">FTC 70% Retail Ratio</span>
            <span className="rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-black uppercase text-emerald-800">
              PASSED
            </span>
          </div>
          <p className="mt-2 text-2xl font-black text-emerald-700">{retailRatioPercent}%</p>
          <p className="mt-1 text-[11px] text-slate-500">
            Mandatory threshold: 70% • Safety surplus: +4.8%
          </p>
        </Card>

        {/* Anti-Inventory Loading */}
        <Card className="border-l-4 border-l-cyan-500 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Anti-Inventory Loading</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-50 text-cyan-600">
              <ShieldCheck className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-black text-brand-navy">100% Cap Clean</p>
          <p className="mt-1 text-[11px] text-slate-500">
            0 distributors exceeding personal purchase caps
          </p>
        </Card>

        {/* 30-Day Buyback Rule */}
        <Card className="border-l-4 border-l-purple-500 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">30-Day Buyback Fulfill</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-black text-purple-700">48h SLA</p>
          <p className="mt-1 text-[11px] text-slate-500">
            8 returned starter kits refunded @ 90% in Q2
          </p>
        </Card>

        {/* IDS Status */}
        <Card className="border-l-4 border-l-amber-500 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Income Disclosure (IDS)</span>
            <span className="rounded bg-amber-100 px-2 py-0.5 text-[10px] font-black uppercase text-amber-800">
              PUBLISHED
            </span>
          </div>
          <p className="mt-2 text-2xl font-black text-slate-800">2026 Certified</p>
          <p className="mt-1 text-[11px] text-slate-500">
            Fully accessible across all public landing pages
          </p>
        </Card>
      </div>

      {/* ── Navigation Tabs ── */}
      <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200 w-fit">
        <button
          onClick={() => setActiveTab("rule70")}
          className={cn(
            "flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-black transition",
            activeTab === "rule70" ? "bg-white text-brand-navy shadow-sm" : "text-slate-600 hover:text-slate-900"
          )}
        >
          <Scale className="h-3.5 w-3.5 text-emerald-600" />
          70% Retail Rule Audit
        </button>
        <button
          onClick={() => setActiveTab("buyback")}
          className={cn(
            "flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-black transition",
            activeTab === "buyback" ? "bg-white text-brand-navy shadow-sm" : "text-slate-600 hover:text-slate-900"
          )}
        >
          <ShieldCheck className="h-3.5 w-3.5 text-cyan-600" />
          Anti-Inventory & Buyback
        </button>
        <button
          onClick={() => setActiveTab("ids")}
          className={cn(
            "flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-black transition",
            activeTab === "ids" ? "bg-white text-brand-navy shadow-sm" : "text-slate-600 hover:text-slate-900"
          )}
        >
          <FileText className="h-3.5 w-3.5 text-purple-600" />
          Income Disclosure (IDS)
        </button>
        <button
          onClick={() => setActiveTab("crossborder")}
          className={cn(
            "flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-black transition",
            activeTab === "crossborder" ? "bg-white text-brand-navy shadow-sm" : "text-slate-600 hover:text-slate-900"
          )}
        >
          <Globe className="h-3.5 w-3.5 text-blue-600" />
          Cross-Border Jurisdictions
        </button>
      </div>

      {/* ── TAB 1: 70% RETAIL CUSTOMER VOLUME RULE AUDIT ── */}
      {activeTab === "rule70" && (
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="p-6 shadow-sm">
            <h3 className="font-black text-brand-navy">The 70% Retail Volume Rule Real-Time Audit</h3>
            <p className="mt-1 text-xs text-slate-500">
              The international benchmark established by regulatory authorities (FTC Omnitrition/Amway precedent) mandates that genuine network marketing companies must generate at least 70% of total product sales volume from retail end-consumers who are not distributors.
            </p>

            {/* Visual Progress Bar Gauge */}
            <div className="mt-6 rounded-2xl bg-slate-50 p-5 border border-slate-200">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-2">
                <span className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-emerald-500" />
                  Verified Retail Customer Sales: 74.8%
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-cyan-500" />
                  Internal Distributor Use: 25.2%
                </span>
              </div>

              {/* Progress track */}
              <div className="relative h-6 w-full rounded-full bg-slate-200 overflow-hidden flex">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center text-[10px] font-black text-white"
                  style={{ width: "74.8%" }}
                >
                  74.8% Retail (ETB 1.83M)
                </div>
                <div
                  className="h-full bg-cyan-600 flex items-center justify-center text-[10px] font-black text-white"
                  style={{ width: "25.2%" }}
                >
                  25.2%
                </div>

                {/* 70% Marker Line */}
                <div
                  className="absolute top-0 bottom-0 w-1 bg-red-600 z-10"
                  style={{ left: "70%" }}
                  title="Mandatory 70% Regulatory Minimum"
                />
              </div>

              <div className="mt-2 flex justify-between text-[11px] text-slate-500">
                <span>0%</span>
                <span className="font-black text-red-600">▲ 70% Statutory Legal Floor</span>
                <span>100%</span>
              </div>
            </div>

            {/* Volume Breakdown Table */}
            <div className="mt-6 space-y-3 text-xs">
              <div className="flex items-center justify-between rounded-xl bg-emerald-50/60 p-3.5 border border-emerald-200">
                <div>
                  <p className="font-black text-emerald-900">Direct Retail End-Consumer Sales</p>
                  <p className="text-[11px] text-emerald-700">Orders placed by verified retail clients via replicated web portals</p>
                </div>
                <span className="font-black text-base text-emerald-800">ETB {retailVolumeETB.toLocaleString()}</span>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3.5 border border-slate-200">
                <div>
                  <p className="font-black text-slate-800">Distributor Personal Product Use & Samples</p>
                  <p className="text-[11px] text-slate-500">Products consumed directly by active distributors for personal demonstration</p>
                </div>
                <span className="font-black text-base text-slate-700">ETB {internalVolumeETB.toLocaleString()}</span>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-slate-100 p-3.5 border border-slate-300 font-black">
                <span className="text-brand-navy">Total Platform Point Volume (PV Value):</span>
                <span className="text-base text-brand-navy">ETB {totalVolumeETB.toLocaleString()}</span>
              </div>
            </div>
          </Card>

          {/* Legal Compliance Audit Badge Card */}
          <Card className="flex flex-col justify-between border-2 border-emerald-500/40 bg-gradient-to-br from-[#0c2a1a] to-[#081e28] p-6 text-white shadow-xl">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-1 text-[11px] font-bold text-emerald-300">
                <ShieldCheck className="h-4 w-4" />
                Legal Immunity Certificate
              </div>

              <h3 className="mt-4 text-xl font-black">Full DSA / FTC Compliance Verification</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-300">
                Under prevailing multi-jurisdictional law, our network marketing structure cannot be deemed an illegal recruitment pyramid scheme because:
              </p>

              <div className="mt-4 space-y-2.5 text-xs text-emerald-200">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5" />
                  <span>Commissions are generated exclusively from sales of tangible, marketable consumer goods.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5" />
                  <span>No commissions or financial compensation are paid simply for the act of signing up or recruiting a new person without product movement.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5" />
                  <span>Retail sales to outside customers (74.8%) exceed the statutory 70% threshold.</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
              <span>Audited on: Jun 2026</span>
              <span className="font-mono text-emerald-400">Status: PASS (Grade A+)</span>
            </div>
          </Card>
        </div>
      )}

      {/* ── TAB 2: ANTI-INVENTORY LOADING & 30-DAY BUYBACK GUARANTEE ── */}
      {activeTab === "buyback" && (
        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="p-6 shadow-sm">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-black text-brand-navy">Anti-Inventory Loading Safeguards</h3>
                  <p className="text-xs text-slate-500">Protecting distributors from coercive stock accumulation</p>
                </div>
              </div>

              <div className="mt-4 space-y-4 text-xs text-slate-600">
                <div className="rounded-xl bg-slate-50 p-4 border border-slate-200">
                  <p className="font-black text-brand-navy">Monthly Personal Purchase Ceiling</p>
                  <p className="mt-1 leading-relaxed text-slate-500">
                    No distributor can order more than ETB 50,000 worth of inventory in a single 30-day period unless they certify that 70% of previously ordered stock has been sold to retail consumers.
                  </p>
                  <span className="inline-block mt-2 rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                    Automated Checkout Enforced
                  </span>
                </div>

                <div className="rounded-xl bg-slate-50 p-4 border border-slate-200">
                  <p className="font-black text-brand-navy">Anti-Frontloading Verification</p>
                  <p className="mt-1 leading-relaxed text-slate-500">
                    Starter kits are limited to product quantities reasonable for personal trial and immediate demonstration. Large speculative inventory batches are strictly banned.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 shadow-sm">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                  <Award className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-black text-brand-navy">30-Day 90% Buyback Statutory Guarantee</h3>
                  <p className="text-xs text-slate-500">Mandatory consumer & distributor cooling-off protections</p>
                </div>
              </div>

              <div className="mt-4 space-y-4 text-xs text-slate-600">
                <div className="rounded-xl bg-slate-50 p-4 border border-slate-200">
                  <p className="font-black text-brand-navy">12-Month Resignation Repurchase</p>
                  <p className="mt-1 leading-relaxed text-slate-500">
                    Any distributor choosing to terminate their relationship within 12 months may return all unopened, marketable inventory and promotional materials for a 90% net refund.
                  </p>
                  <span className="inline-block mt-2 rounded bg-purple-100 px-2 py-0.5 text-[10px] font-bold text-purple-800">
                    DSA Standard Section 8.3
                  </span>
                </div>

                <div className="rounded-xl bg-slate-50 p-4 border border-slate-200">
                  <p className="font-black text-brand-navy">Turnaround Performance (SLA)</p>
                  <p className="mt-1 leading-relaxed text-slate-500">
                    All return refund applications submitted to finance are audited and disbursed within an average of 48 hours to the original payment channel.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* ── TAB 3: OFFICIAL INCOME DISCLOSURE STATEMENT (IDS) ── */}
      {activeTab === "ids" && (
        <Card className="p-6 shadow-sm">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-black text-brand-navy">Official Field Income Disclosure Statement (IDS)</h3>
              <p className="text-xs text-slate-500">
                Mandatory legal earnings table published annually to provide accurate income expectations and prevent deceptive recruitment representations.
              </p>
            </div>
            <Button
              onClick={handleExportIdsCsv}
              className="bg-brand-navy text-xs font-bold text-white hover:bg-slate-800"
            >
              <Download className="mr-1.5 h-3.5 w-3.5" />
              Download Official IDS (CSV)
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-500">
                  <th className="p-3 font-bold uppercase">Distributor Rank</th>
                  <th className="p-3 font-bold uppercase text-center">% of Field</th>
                  <th className="p-3 font-bold uppercase text-right">Avg Annual (ETB)</th>
                  <th className="p-3 font-bold uppercase text-right">Avg Annual ($ USD)</th>
                  <th className="p-3 font-bold uppercase text-right">Median (ETB)</th>
                  <th className="p-3 font-bold uppercase text-right">High / Low Range</th>
                  <th className="p-3 font-bold uppercase text-center">Avg Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {mockIncomeDisclosure.map((row) => (
                  <tr key={row.rank} className="hover:bg-slate-50 transition">
                    <td className="p-3 font-black text-brand-navy">
                      {row.rank}
                    </td>
                    <td className="p-3 text-center font-semibold text-slate-600">
                      {row.percentDistributors}%
                    </td>
                    <td className="p-3 text-right font-black text-emerald-600">
                      ETB {row.avgAnnualETB.toLocaleString()}
                    </td>
                    <td className="p-3 text-right font-mono text-slate-500">
                      ${row.avgAnnualUSD.toLocaleString()}
                    </td>
                    <td className="p-3 text-right font-bold text-slate-700">
                      ETB {row.medianAnnualETB.toLocaleString()}
                    </td>
                    <td className="p-3 text-right text-[11px] text-slate-500">
                      ETB {row.highETB.toLocaleString()} / {row.lowETB.toLocaleString()}
                    </td>
                    <td className="p-3 text-center text-slate-600 font-semibold">
                      {row.avgMonthsToAchieve} mos
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-4 text-[11px] text-slate-400 italic">
            * Disclaimer: The income figures represented above reflect actual historical earnings of active participants during the 2025-2026 fiscal year. Income is not guaranteed and requires consistent dedication, training mastery, and customer sales volume.
          </p>
        </Card>
      )}

      {/* ── TAB 4: CROSS-BORDER REGULATORY MATRIX ── */}
      {activeTab === "crossborder" && (
        <div className="space-y-4">
          {crossBorderChecklist.map((jurisdiction) => (
            <Card key={jurisdiction.region} className="p-5 shadow-sm">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-3">
                <div>
                  <h4 className="font-black text-base text-brand-navy">{jurisdiction.region}</h4>
                  <p className="text-xs text-slate-500">Regulatory Oversight: {jurisdiction.authority}</p>
                </div>
                <span className="w-fit rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-800">
                  Fully Licensed & Cleared
                </span>
              </div>

              <div className="mt-3 space-y-2">
                {jurisdiction.requirements.map((req) => (
                  <div
                    key={req.name}
                    className="flex flex-col gap-2 rounded-xl bg-slate-50 p-3 text-xs sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span className="font-bold text-slate-800">{req.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] text-slate-500">{req.notes}</span>
                      <span className="rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                        {req.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
