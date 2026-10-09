"use client";

import { useState, useMemo } from "react";
import {
  WalletCards,
  CircleDollarSign,
  TrendingUp,
  ArrowDownLeft,
  ArrowUpRight,
  Sparkles,
  Download,
  Printer,
  CreditCard,
  Building,
  Smartphone,
  Coins,
  History,
  Sliders,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Layers,
  Award,
  Zap,
  Calendar,
  DollarSign,
  FileText,
  X
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { exportToCsv, printSection } from "@/lib/export-utils";

export interface TransactionRecord {
  id: string;
  date: string;
  stream: "Retail Margin" | "Fast-Start Bonus" | "Binary Cycle" | "Generation Matching" | "Leadership Pool" | "Car Fund" | "Withdrawal";
  description: string;
  amountETB: number;
  amountUSD: number;
  type: "CREDIT" | "DEBIT";
  status: "SETTLED" | "PROCESSING" | "SCHEDULED";
  referenceId: string;
}

const mockTransactions: TransactionRecord[] = [
  {
    id: "TX-901",
    date: "Jun 08, 2026",
    stream: "Binary Cycle",
    description: "Cycle Match Payout (6 cycles @ 800 ETB)",
    amountETB: 4800,
    amountUSD: 83.77,
    type: "CREDIT",
    status: "SETTLED",
    referenceId: "CYC-2026-W23"
  },
  {
    id: "TX-902",
    date: "Jun 06, 2026",
    stream: "Fast-Start Bonus",
    description: "Diamond Kit enrollment under Dawit Bekele",
    amountETB: 4500,
    amountUSD: 78.53,
    type: "CREDIT",
    status: "SETTLED",
    referenceId: "FSB-MYU-401"
  },
  {
    id: "TX-903",
    date: "Jun 04, 2026",
    stream: "Generation Matching",
    description: "10% check match on Gen 1 (Almaz Tadesse)",
    amountETB: 2850,
    amountUSD: 49.74,
    type: "CREDIT",
    status: "SETTLED",
    referenceId: "GEN-MATCH-L1"
  },
  {
    id: "TX-904",
    date: "Jun 01, 2026",
    stream: "Withdrawal",
    description: "Cashout to Telebirr (+251 91 122 3344)",
    amountETB: 25000,
    amountUSD: 436.3,
    type: "DEBIT",
    status: "SETTLED",
    referenceId: "WDL-TB-8841"
  },
  {
    id: "TX-905",
    date: "May 28, 2026",
    stream: "Leadership Pool",
    description: "Diamond Global Revenue Dividend (May 2026)",
    amountETB: 18200,
    amountUSD: 317.62,
    type: "CREDIT",
    status: "SETTLED",
    referenceId: "POOL-MAY-26"
  },
  {
    id: "TX-906",
    date: "May 25, 2026",
    stream: "Car Fund",
    description: "Monthly Executive Luxury Vehicle Stipend",
    amountETB: 12000,
    amountUSD: 209.42,
    type: "CREDIT",
    status: "SETTLED",
    referenceId: "LIFESTYLE-05"
  },
  {
    id: "TX-907",
    date: "Today",
    stream: "Binary Cycle",
    description: "Cycle Match Pending Settlement (4 cycles)",
    amountETB: 3200,
    amountUSD: 55.85,
    type: "CREDIT",
    status: "PROCESSING",
    referenceId: "CYC-2026-W24"
  }
];

const bonusStreamSummaries = [
  {
    id: "retail",
    name: "Direct Retail Profit (20-30%)",
    earnedETB: 36400,
    earnedUSD: 635.25,
    sharePercent: 8,
    color: "from-emerald-500 to-teal-600",
    description: "Immediate profit earned from retail purchases by non-distributor clients."
  },
  {
    id: "fast_start",
    name: "Fast-Start Sponsor Bonus",
    earnedETB: 84500,
    earnedUSD: 1474.7,
    sharePercent: 18,
    color: "from-blue-500 to-cyan-600",
    description: "Paid instantly upon enrolling new distributors with qualified starter product packs."
  },
  {
    id: "binary_cycle",
    name: "Binary Cycle / Pairing Bonus",
    earnedETB: 182400,
    earnedUSD: 3183.25,
    sharePercent: 38,
    color: "from-purple-500 to-indigo-600",
    description: "800 ETB payout triggered per 100 Left PV + 100 Right PV matching cycle."
  },
  {
    id: "generation_matching",
    name: "5-Tier Generation Matching",
    earnedETB: 98200,
    earnedUSD: 1713.79,
    sharePercent: 20,
    color: "from-amber-500 to-orange-600",
    description: "10% matching on Gen 1 earnings, 5% on Gen 2, 3% on Gen 3 downlines."
  },
  {
    id: "leadership_pool",
    name: "Global Leadership Pool (3%)",
    earnedETB: 53000,
    earnedUSD: 924.96,
    sharePercent: 11,
    color: "from-rose-500 to-pink-600",
    description: "Exclusive quarterly share of total company global revenue for Diamond+ directors."
  },
  {
    id: "lifestyle_fund",
    name: "Executive Lifestyle & Car Fund",
    earnedETB: 28000,
    earnedUSD: 488.65,
    sharePercent: 5,
    color: "from-cyan-500 to-blue-700",
    description: "Monthly stipend to maintain executive vehicle and international travel privileges."
  }
];

interface CommissionCompensationEngineProps {
  onOpenAi?: (prompt: string) => void;
}

export function CommissionCompensationEngine({ onOpenAi }: CommissionCompensationEngineProps) {
  const [currency, setCurrency] = useState<"ETB" | "USD">("ETB");
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "simulator" | "ledger">("overview");

  // Simulator Interactive States
  const [simPersonalPv, setSimPersonalPv] = useState(250);
  const [simNewRecruits, setSimNewRecruits] = useState(4);
  const [simLeftLegPv, setSimLeftLegPv] = useState(15000);
  const [simRightLegPv, setSimRightLegPv] = useState(12000);
  const [simGen1Earnings, setSimGen1Earnings] = useState(30000);

  // Withdrawal form states
  const [withdrawAmount, setWithdrawAmount] = useState(15000);
  const [withdrawMethod, setWithdrawMethod] = useState<"telebirr" | "cbe" | "awash" | "wire" | "usdt">("telebirr");
  const [accountNumber, setAccountNumber] = useState("+251 91 122 3344");

  // Format currency helper
  const formatMoney = (etb: number, usd: number) => {
    if (currency === "ETB") {
      return `ETB ${etb.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
    }
    return `$${usd.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Simulator calculations
  const simCalculations = useMemo(() => {
    // 1. Retail margin: approx 30% of Personal PV in ETB
    const retailProfitETB = simPersonalPv * 45;
    // 2. Fast-Start: 1,500 ETB per recruit average
    const fastStartETB = simNewRecruits * 1500;
    // 3. Binary cycles: min(left, right) / 100 * 800 ETB
    const cycles = Math.floor(Math.min(simLeftLegPv, simRightLegPv) / 100);
    const binaryBonusETB = cycles * 800;
    // 4. Generation matching: 10% of Gen 1
    const genMatchETB = simGen1Earnings * 0.1;
    // Total
    const totalETB = retailProfitETB + fastStartETB + binaryBonusETB + genMatchETB;
    const totalUSD = totalETB / 57.3;

    return {
      retailProfitETB,
      fastStartETB,
      cycles,
      binaryBonusETB,
      genMatchETB,
      totalETB,
      totalUSD
    };
  }, [simPersonalPv, simNewRecruits, simLeftLegPv, simRightLegPv, simGen1Earnings]);

  const handleExportLedgerCsv = () => {
    const rows = mockTransactions.map((tx) => ({
      "Transaction ID": tx.id,
      "Date": tx.date,
      "Bonus Stream": tx.stream,
      "Description": tx.description,
      "Type": tx.type,
      "Amount (ETB)": tx.amountETB,
      "Amount (USD)": tx.amountUSD,
      "Settlement Status": tx.status,
      "Reference / Batch": tx.referenceId
    }));
    exportToCsv("MyUpline_Commission_Ledger", rows);
  };

  const processingFeeETB = Math.round(withdrawAmount * 0.02);
  const netWithdrawETB = withdrawAmount - processingFeeETB;

  return (
    <div id="commission-engine-printable" className="space-y-6">
      {/* ── Top Header ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-800">
            <WalletCards className="h-3.5 w-3.5 text-emerald-600" />
            <span>International Multi-Tier Compensation Engine</span>
          </div>
          <h2 className="mt-1 text-xl font-black text-brand-navy sm:text-2xl">
            Commissions & Payout Wallet Studio
          </h2>
          <p className="text-xs text-slate-500 sm:text-sm">
            Real-time tracking of all 6 international bonus streams, binary cycles, e-wallet settlements, and payout disbursement.
          </p>
        </div>

        {/* Currency Switcher & Global Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Currency Toggle */}
          <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200">
            <button
              onClick={() => setCurrency("ETB")}
              className={cn(
                "rounded-lg px-2.5 py-1 text-xs font-black transition",
                currency === "ETB" ? "bg-white text-brand-navy shadow-sm" : "text-slate-600 hover:text-slate-900"
              )}
            >
              ETB (ብር)
            </button>
            <button
              onClick={() => setCurrency("USD")}
              className={cn(
                "rounded-lg px-2.5 py-1 text-xs font-black transition",
                currency === "USD" ? "bg-white text-brand-navy shadow-sm" : "text-slate-600 hover:text-slate-900"
              )}
            >
              $ USD
            </button>
          </div>

          {onOpenAi && (
            <Button
              variant="ghost"
              onClick={() =>
                onOpenAi(
                  `Analyze my current MLM compensation plan breakdown: Total earned ETB 482,500, Available balance ETB 68,400, Binary cycle share 38%. How can I optimize my team volume to qualify for the next leadership pool rank?`
                )
              }
              className="border border-slate-200 bg-white text-xs font-bold shadow-sm hover:bg-slate-50"
            >
              <Sparkles className="mr-1.5 h-3.5 w-3.5 text-brand-blue" />
              AI Compensation Advisor
            </Button>
          )}

          <Button
            variant="ghost"
            onClick={() => printSection("commission-engine-printable", "MyUpline Official Earnings Statement")}
            className="border border-slate-200 bg-white text-xs font-bold shadow-sm hover:bg-slate-50"
          >
            <Printer className="mr-1.5 h-3.5 w-3.5 text-slate-600" />
            Print Paystub
          </Button>

          <Button
            onClick={() => setIsWithdrawOpen(true)}
            className="bg-emerald-600 text-xs font-black text-white hover:bg-emerald-700 shadow-sm"
          >
            <ArrowUpRight className="mr-1.5 h-3.5 w-3.5" />
            Request Payout
          </Button>
        </div>
      </div>

      {/* ── E-Wallet Balances Card Row ── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Earned */}
        <Card className="border-l-4 border-l-brand-navy p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Lifetime Earnings</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-brand-navy">
              <CircleDollarSign className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-black text-brand-navy">
            {formatMoney(482500, 8420.59)}
          </p>
          <div className="mt-1 flex items-center gap-1 text-[11px] font-bold text-emerald-600">
            <TrendingUp className="h-3 w-3" />
            +18.4% growth this month
          </div>
        </Card>

        {/* Available Balance */}
        <Card className="border-l-4 border-l-emerald-500 p-5 shadow-sm bg-gradient-to-br from-emerald-50/50 to-white">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">Available to Withdraw</span>
            <span className="rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-black uppercase text-emerald-800">
              Instant
            </span>
          </div>
          <p className="mt-2 text-2xl font-black text-emerald-700">
            {formatMoney(68400, 1193.71)}
          </p>
          <p className="mt-1 text-[11px] text-slate-500">
            Zero lockup • Direct mobile/bank transfer
          </p>
        </Card>

        {/* Pending Escrow */}
        <Card className="border-l-4 border-l-amber-500 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Cycle Settlement Escrow</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-black text-amber-700">
            {formatMoney(14200, 247.81)}
          </p>
          <p className="mt-1 text-[11px] text-slate-500">
            Clears on Friday weekly batch close (3 days)
          </p>
        </Card>

        {/* Total Paid Out */}
        <Card className="border-l-4 border-l-cyan-500 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Disbursed</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-50 text-cyan-600">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-black text-slate-800">
            {formatMoney(400000, 6980.8)}
          </p>
          <p className="mt-1 text-[11px] text-slate-500">
            Disbursed across 24 successful cashouts
          </p>
        </Card>
      </div>

      {/* ── Navigation Tabs ── */}
      <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200 w-fit">
        <button
          onClick={() => setActiveTab("overview")}
          className={cn(
            "flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-black transition",
            activeTab === "overview" ? "bg-white text-brand-navy shadow-sm" : "text-slate-600 hover:text-slate-900"
          )}
        >
          <Layers className="h-3.5 w-3.5 text-cyan-600" />
          6 Bonus Streams
        </button>
        <button
          onClick={() => setActiveTab("simulator")}
          className={cn(
            "flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-black transition",
            activeTab === "simulator" ? "bg-white text-brand-navy shadow-sm" : "text-slate-600 hover:text-slate-900"
          )}
        >
          <Sliders className="h-3.5 w-3.5 text-purple-600" />
          Compensation Simulator
        </button>
        <button
          onClick={() => setActiveTab("ledger")}
          className={cn(
            "flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-black transition",
            activeTab === "ledger" ? "bg-white text-brand-navy shadow-sm" : "text-slate-600 hover:text-slate-900"
          )}
        >
          <History className="h-3.5 w-3.5 text-emerald-600" />
          Commission Ledger
        </button>
      </div>

      {/* ── TAB 1: 6 INTERNATIONAL BONUS STREAMS OVERVIEW ── */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {bonusStreamSummaries.map((stream) => (
              <Card key={stream.id} className="p-5 shadow-sm hover:shadow-md transition">
                <div className="flex items-start justify-between">
                  <span className="text-xs font-black text-brand-navy">{stream.name}</span>
                  <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700">
                    {stream.sharePercent}% of total
                  </span>
                </div>
                <p className="mt-3 text-2xl font-black text-brand-navy">
                  {formatMoney(stream.earnedETB, stream.earnedUSD)}
                </p>
                <div className="mt-3 h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className={cn("h-full rounded-full bg-gradient-to-r", stream.color)}
                    style={{ width: `${stream.sharePercent * 2.5}%` }}
                  />
                </div>
                <p className="mt-3 text-xs leading-relaxed text-slate-500">
                  {stream.description}
                </p>
              </Card>
            ))}
          </div>

          {/* Qualification Rules & PV Carryover Policy Banner */}
          <Card className="border border-slate-200 bg-slate-50 p-5">
            <h4 className="font-black text-sm text-brand-navy flex items-center gap-2">
              <Award className="h-4 w-4 text-amber-500" />
              International Commission Payout Rules & Volume Flush Protection
            </h4>
            <div className="mt-3 grid gap-4 sm:grid-cols-3 text-xs text-slate-600">
              <div className="rounded-lg bg-white p-3 border border-slate-200">
                <p className="font-bold text-brand-navy">1. Active Status Requirement</p>
                <p className="mt-1 leading-relaxed text-slate-500">
                  Maintain 100 Personal PV every 30 days to stay qualified for all binary and generation matching overrides.
                </p>
              </div>
              <div className="rounded-lg bg-white p-3 border border-slate-200">
                <p className="font-bold text-brand-navy">2. Power-Leg Carryover (No Flush)</p>
                <p className="mt-1 leading-relaxed text-slate-500">
                  Unmatched binary volume is preserved indefinitely on your strong leg as long as you maintain your monthly active PPV.
                </p>
              </div>
              <div className="rounded-lg bg-white p-3 border border-slate-200">
                <p className="font-bold text-brand-navy">3. Weekly Payout Cadence</p>
                <p className="mt-1 leading-relaxed text-slate-500">
                  Binary cycles calculate weekly on Friday 23:59 GMT. Payouts disburse directly to Telebirr and bank rails by Monday noon.
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* ── TAB 2: INTERACTIVE COMPENSATION PLAN SIMULATOR ── */}
      {activeTab === "simulator" && (
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-black text-brand-navy">Compensation Projection Simulator</h3>
                <p className="text-xs text-slate-500">
                  Adjust your personal volume and team leg metrics to calculate your projected monthly commission earnings.
                </p>
              </div>
              <Sliders className="h-5 w-5 text-purple-600" />
            </div>

            <div className="space-y-5">
              {/* Slider 1: Personal PV */}
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span>Personal PV (Direct Retail Sales)</span>
                  <span className="font-black text-brand-navy">{simPersonalPv} PV</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="1000"
                  step="50"
                  value={simPersonalPv}
                  onChange={(e) => setSimPersonalPv(Number(e.target.value))}
                  className="mt-2 w-full accent-cyan-600"
                />
              </div>

              {/* Slider 2: New Recruits */}
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span>New Recruits Enrolled This Month</span>
                  <span className="font-black text-brand-navy">{simNewRecruits} recruits</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="20"
                  step="1"
                  value={simNewRecruits}
                  onChange={(e) => setSimNewRecruits(Number(e.target.value))}
                  className="mt-2 w-full accent-blue-600"
                />
              </div>

              {/* Slider 3: Left Leg PV */}
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span>Left Leg Team Volume</span>
                  <span className="font-black text-emerald-600">{simLeftLegPv.toLocaleString()} PV</span>
                </div>
                <input
                  type="range"
                  min="1000"
                  max="50000"
                  step="1000"
                  value={simLeftLegPv}
                  onChange={(e) => setSimLeftLegPv(Number(e.target.value))}
                  className="mt-2 w-full accent-emerald-600"
                />
              </div>

              {/* Slider 4: Right Leg PV */}
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span>Right Leg Team Volume</span>
                  <span className="font-black text-purple-600">{simRightLegPv.toLocaleString()} PV</span>
                </div>
                <input
                  type="range"
                  min="1000"
                  max="50000"
                  step="1000"
                  value={simRightLegPv}
                  onChange={(e) => setSimRightLegPv(Number(e.target.value))}
                  className="mt-2 w-full accent-purple-600"
                />
              </div>

              {/* Slider 5: Gen 1 Downline Earnings */}
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span>Gen 1 Downlines Aggregate Check</span>
                  <span className="font-black text-amber-600">ETB {simGen1Earnings.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="5000"
                  max="150000"
                  step="5000"
                  value={simGen1Earnings}
                  onChange={(e) => setSimGen1Earnings(Number(e.target.value))}
                  className="mt-2 w-full accent-amber-600"
                />
              </div>
            </div>
          </Card>

          {/* Projected Payout Card */}
          <Card className="flex flex-col justify-between border-2 border-cyan-500/30 bg-gradient-to-br from-slate-900 to-[#07193b] p-6 text-white shadow-xl">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/20 px-3 py-1 text-[11px] font-bold text-cyan-300">
                <Sparkles className="h-3 w-3" />
                Live Compensation Projections
              </div>

              <h3 className="mt-3 text-lg font-black">Estimated Monthly Earnings</h3>
              <p className="mt-1 text-3xl font-black text-cyan-400">
                {formatMoney(simCalculations.totalETB, simCalculations.totalUSD)}
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Calculated across 4 active bonus streams
              </p>

              {/* Breakdown list */}
              <div className="mt-6 space-y-3 rounded-xl bg-white/5 p-4 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Direct Retail Profit:</span>
                  <span className="font-bold text-emerald-400">
                    {formatMoney(simCalculations.retailProfitETB, simCalculations.retailProfitETB / 57.3)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Fast-Start Sponsor Bonuses:</span>
                  <span className="font-bold text-blue-400">
                    {formatMoney(simCalculations.fastStartETB, simCalculations.fastStartETB / 57.3)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">
                    Binary Cycles ({simCalculations.cycles} matches @ 800 ETB):
                  </span>
                  <span className="font-bold text-purple-400">
                    {formatMoney(simCalculations.binaryBonusETB, simCalculations.binaryBonusETB / 57.3)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">10% Generation 1 Check Match:</span>
                  <span className="font-bold text-amber-400">
                    {formatMoney(simCalculations.genMatchETB, simCalculations.genMatchETB / 57.3)}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 flex gap-2">
              <Button
                onClick={() => {
                  alert("Projected compensation plan saved to your vision targets!");
                }}
                className="flex-1 bg-cyan-400 text-xs font-black text-brand-navy hover:bg-cyan-300"
              >
                Set as Monthly Target
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* ── TAB 3: COMMISSION LEDGER & TRANSACTION HISTORY ── */}
      {activeTab === "ledger" && (
        <Card className="p-5 shadow-sm">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-black text-brand-navy">Official Commission Statement Ledger</h3>
              <p className="text-xs text-slate-500">
                Detailed ledger of all credit bonuses, weekly cycle settlements, and withdrawal debits.
              </p>
            </div>
            <Button
              onClick={handleExportLedgerCsv}
              className="bg-brand-navy text-xs font-bold text-white hover:bg-slate-800"
            >
              <Download className="mr-1.5 h-3.5 w-3.5" />
              Export Statement (CSV)
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-500">
                  <th className="p-3 font-bold uppercase">Date & Ref</th>
                  <th className="p-3 font-bold uppercase">Bonus Stream</th>
                  <th className="p-3 font-bold uppercase">Description</th>
                  <th className="p-3 font-bold uppercase">Status</th>
                  <th className="p-3 font-bold uppercase text-right">Amount (ETB)</th>
                  <th className="p-3 font-bold uppercase text-right">Amount ($ USD)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {mockTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/80 transition">
                    <td className="p-3">
                      <p className="font-bold text-brand-navy">{tx.date}</p>
                      <p className="font-mono text-[10px] text-slate-400">{tx.referenceId}</p>
                    </td>
                    <td className="p-3">
                      <span className="font-bold text-slate-700">{tx.stream}</span>
                    </td>
                    <td className="p-3 text-slate-600">
                      {tx.description}
                    </td>
                    <td className="p-3">
                      <span
                        className={cn(
                          "rounded px-2 py-0.5 text-[10px] font-black uppercase",
                          tx.status === "SETTLED"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-800"
                        )}
                      >
                        {tx.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <span
                        className={cn(
                          "font-black text-sm",
                          tx.type === "CREDIT" ? "text-emerald-600" : "text-rose-600"
                        )}
                      >
                        {tx.type === "CREDIT" ? "+" : "-"} ETB {tx.amountETB.toLocaleString()}
                      </span>
                    </td>
                    <td className="p-3 text-right font-mono text-slate-500">
                      {tx.type === "CREDIT" ? "+" : "-"} ${tx.amountUSD.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* ── Request Payout / Withdrawal Modal ── */}
      {isWithdrawOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <Card className="w-full max-w-lg border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                  <ArrowUpRight className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-black text-brand-navy">Request Commission Withdrawal</h3>
                  <p className="text-[11px] text-slate-500">
                    Available balance: <strong className="text-emerald-700">ETB 68,400 ($1,193 USD)</strong>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsWithdrawOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs">
              {/* Payout Rail Selection */}
              <div>
                <label className="font-bold text-slate-700">Select Payout Method</label>
                <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {[
                    { id: "telebirr", label: "Telebirr (Instant)", icon: Smartphone },
                    { id: "cbe", label: "CBE Birr / Bank", icon: Building },
                    { id: "awash", label: "Awash Bank", icon: Building },
                    { id: "wire", label: "SWIFT Wire", icon: CreditCard },
                    { id: "usdt", label: "Crypto USDT", icon: Coins }
                  ].map((m) => {
                    const Icon = m.icon;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setWithdrawMethod(m.id as any)}
                        className={cn(
                          "flex items-center gap-2 rounded-xl border p-2.5 text-left text-xs font-bold transition",
                          withdrawMethod === m.id
                            ? "border-emerald-500 bg-emerald-50/60 text-emerald-900 shadow-sm"
                            : "border-slate-200 hover:bg-slate-50 text-slate-700"
                        )}
                      >
                        <Icon className="h-4 w-4 shrink-0 text-emerald-600" />
                        <span className="truncate">{m.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Amount Input */}
              <div>
                <label className="font-bold text-slate-700">Withdrawal Amount (ETB)</label>
                <input
                  type="number"
                  min="500"
                  max="68400"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                  className="mt-1 w-full rounded-lg border border-slate-200 p-2.5 text-sm font-black text-brand-navy focus:border-emerald-500 focus:outline-none"
                />
                <div className="mt-1 flex justify-between text-[11px] text-slate-500">
                  <span>Min: ETB 500</span>
                  <span>Max: ETB 68,400</span>
                </div>
              </div>

              {/* Account / Phone */}
              <div>
                <label className="font-bold text-slate-700">
                  {withdrawMethod === "telebirr" ? "Telebirr Mobile Phone" : withdrawMethod === "usdt" ? "USDT (TRC-20) Wallet Address" : "Bank Account Number & Full Name"}
                </label>
                <input
                  type="text"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  placeholder="Enter details..."
                  className="mt-1 w-full rounded-lg border border-slate-200 p-2.5 text-xs font-semibold focus:border-emerald-500 focus:outline-none"
                />
              </div>

              {/* Calculation Summary */}
              <div className="rounded-xl bg-slate-50 p-3 border border-slate-100 space-y-1.5 text-[11px]">
                <div className="flex justify-between text-slate-600">
                  <span>Gross Withdrawal:</span>
                  <span className="font-bold">ETB {withdrawAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Processing Fee (2%):</span>
                  <span>- ETB {processingFeeETB.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-1 font-black text-brand-navy text-xs">
                  <span>Net Disbursed:</span>
                  <span className="text-emerald-700">ETB {netWithdrawETB.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-2">
              <Button
                onClick={() => {
                  alert(`Withdrawal request of ETB ${withdrawAmount.toLocaleString()} submitted via ${withdrawMethod.toUpperCase()}! Processing in batch.`);
                  setIsWithdrawOpen(false);
                }}
                className="flex-1 bg-emerald-600 text-xs font-black text-white hover:bg-emerald-700"
              >
                Submit Withdrawal Request
              </Button>
              <Button
                variant="ghost"
                onClick={() => setIsWithdrawOpen(false)}
                className="border border-slate-200 text-xs font-bold"
              >
                Cancel
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
