"use client";

import { useState, useEffect } from "react";
import {
  ArrowRight,
  BadgeCheck,
  Banknote,
  Building2,
  Check,
  CheckCircle2,
  Clock,
  Coins,
  Copy,
  CreditCard,
  Edit,
  Eye,
  FileCheck,
  FileSpreadsheet,
  FileText,
  Filter,
  Landmark,
  Layers,
  Loader2,
  Package,
  Plus,
  Printer,
  RefreshCw,
  Search,
  ShieldAlert,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Tag,
  Trash2,
  User,
  X,
  XCircle,
  ZoomIn
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { StoredPackage, StoredPaymentSubmission, StoredPaymentMethod } from "@/lib/db-store";
import { exportToCsv, printSection } from "@/lib/export-utils";

export function PackagePaymentManager({
  onOpenAi
}: {
  onOpenAi?: (prompt: string) => void;
}) {
  const [activeTab, setActiveTab] = useState<"payments" | "packages" | "methods">("payments");

  // Packages state
  const [packages, setPackages] = useState<StoredPackage[]>([]);
  const [isLoadingPackages, setIsLoadingPackages] = useState(true);

  // Payments state
  const [payments, setPayments] = useState<StoredPaymentSubmission[]>([]);
  const [isLoadingPayments, setIsLoadingPayments] = useState(true);
  const [paymentFilter, setPaymentFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Payment Methods state
  const [paymentMethods, setPaymentMethods] = useState<StoredPaymentMethod[]>([]);
  const [isLoadingMethods, setIsLoadingMethods] = useState(true);

  // Receipt Modal lightbox
  const [viewingReceipt, setViewingReceipt] = useState<StoredPaymentSubmission | null>(null);

  // Package Modal (Create / Edit)
  const [editingPackage, setEditingPackage] = useState<StoredPackage | null>(null);
  const [isAddingPackage, setIsAddingPackage] = useState(false);
  const [pkgName, setPkgName] = useState("");
  const [pkgPrice, setPkgPrice] = useState<number>(5000);
  const [pkgPv, setPkgPv] = useState<number>(150);
  const [pkgBadge, setPkgBadge] = useState("");
  const [pkgDescription, setPkgDescription] = useState("");
  const [pkgFeatures, setPkgFeatures] = useState("");

  // Payment Method Modal (Create / Edit)
  const [editingMethod, setEditingMethod] = useState<StoredPaymentMethod | null>(null);
  const [isAddingMethod, setIsAddingMethod] = useState(false);
  const [pmName, setPmName] = useState("");
  const [pmAccountName, setPmAccountName] = useState("");
  const [pmAccountNumber, setPmAccountNumber] = useState("");
  const [pmType, setPmType] = useState<"BANK" | "MOBILE_MONEY" | "CRYPTO" | "CASH">("BANK");
  const [pmInstructions, setPmInstructions] = useState("");

  // Toast / notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  function showToast(msg: string) {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  }

  function handleCopy(id: string, text: string) {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  // Fetch Packages, Payments, and Payment Methods
  async function loadData() {
    try {
      setIsLoadingPackages(true);
      const pkgRes = await fetch("/api/packages");
      const pkgData = await pkgRes.json();
      if (pkgData?.data?.packages) {
        setPackages(pkgData.data.packages);
      }
    } catch {
      // fallback
    } finally {
      setIsLoadingPackages(false);
    }

    try {
      setIsLoadingPayments(true);
      const payRes = await fetch("/api/payments/manual");
      const payData = await payRes.json();
      if (payData?.data?.payments) {
        setPayments(payData.data.payments);
      }
    } catch {
      // fallback
    } finally {
      setIsLoadingPayments(false);
    }

    try {
      setIsLoadingMethods(true);
      const pmRes = await fetch("/api/payment-methods");
      const pmData = await pmRes.json();
      if (pmData?.data?.paymentMethods) {
        setPaymentMethods(pmData.data.paymentMethods);
      }
    } catch {
      // fallback
    } finally {
      setIsLoadingMethods(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  // ----------------------------------------------------
  // PAYMENT APPROVAL / REJECTION
  // ----------------------------------------------------
  async function handleApprovePayment(paymentId: string) {
    try {
      const res = await fetch("/api/payments/manual", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentId,
          action: "approve",
          adminNotes: "Receipt verified by Super Admin",
          verifiedBy: "Super Admin"
        })
      });
      if (res.ok) {
        showToast("✅ Payment approved! Member account activated.");
        loadData();
        if (viewingReceipt?.id === paymentId) setViewingReceipt(null);
      }
    } catch {
      showToast("❌ Failed to approve payment");
    }
  }

  async function handleRejectPayment(paymentId: string) {
    const reason = prompt("Enter reason for rejection (e.g. Invalid reference number, unreadable receipt):") || "Receipt could not be verified.";
    try {
      const res = await fetch("/api/payments/manual", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentId,
          action: "reject",
          adminNotes: reason,
          verifiedBy: "Super Admin"
        })
      });
      if (res.ok) {
        showToast("⚠️ Payment rejected.");
        loadData();
        if (viewingReceipt?.id === paymentId) setViewingReceipt(null);
      }
    } catch {
      showToast("❌ Failed to reject payment");
    }
  }

  // ----------------------------------------------------
  // PACKAGE CRUD
  // ----------------------------------------------------
  function openAddPackageModal() {
    setEditingPackage(null);
    setPkgName("");
    setPkgPrice(4990);
    setPkgPv(120);
    setPkgBadge("");
    setPkgDescription("");
    setPkgFeatures("Standard Member Access\nDirect Upline Link\nTraining Courses Access");
    setIsAddingPackage(true);
  }

  function openEditPackageModal(pkg: StoredPackage) {
    setEditingPackage(pkg);
    setPkgName(pkg.name);
    setPkgPrice(pkg.priceETB);
    setPkgPv(pkg.pv);
    setPkgBadge(pkg.badge || "");
    setPkgDescription(pkg.description);
    setPkgFeatures(pkg.features ? pkg.features.join("\n") : "");
    setIsAddingPackage(true);
  }

  async function handleSavePackage(e: React.FormEvent) {
    e.preventDefault();
    if (!pkgName.trim()) return;

    const featuresList = pkgFeatures
      .split("\n")
      .map((f) => f.trim())
      .filter(Boolean);

    try {
      if (editingPackage) {
        const res = await fetch("/api/packages", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editingPackage.id,
            name: pkgName.trim(),
            priceETB: Number(pkgPrice),
            pv: Number(pkgPv),
            badge: pkgBadge.trim() || undefined,
            description: pkgDescription.trim(),
            features: featuresList
          })
        });
        if (res.ok) {
          showToast("✅ Package updated successfully!");
          setIsAddingPackage(false);
          loadData();
        }
      } else {
        const res = await fetch("/api/packages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: pkgName.trim(),
            priceETB: Number(pkgPrice),
            pv: Number(pkgPv),
            badge: pkgBadge.trim() || undefined,
            description: pkgDescription.trim(),
            features: featuresList
          })
        });
        if (res.ok) {
          showToast("✅ New package created successfully!");
          setIsAddingPackage(false);
          loadData();
        }
      }
    } catch {
      showToast("❌ Failed to save package.");
    }
  }

  async function handleDeletePackage(id: string, name: string) {
    if (!confirm(`Are you sure you want to delete package: ${name}?`)) return;
    try {
      const res = await fetch(`/api/packages?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        showToast("🗑️ Package removed.");
        loadData();
      }
    } catch {
      showToast("❌ Failed to delete package.");
    }
  }

  // ----------------------------------------------------
  // PAYMENT METHODS CRUD
  // ----------------------------------------------------
  function openAddMethodModal() {
    setEditingMethod(null);
    setPmName("");
    setPmAccountName("MyUpline Global PLC");
    setPmAccountNumber("");
    setPmType("BANK");
    setPmInstructions("Please enter your registered phone number in the transfer description.");
    setIsAddingMethod(true);
  }

  function openEditMethodModal(method: StoredPaymentMethod) {
    setEditingMethod(method);
    setPmName(method.name);
    setPmAccountName(method.accountName);
    setPmAccountNumber(method.accountNumber);
    setPmType(method.type);
    setPmInstructions(method.instructions || "");
    setIsAddingMethod(true);
  }

  async function handleSaveMethod(e: React.FormEvent) {
    e.preventDefault();
    if (!pmName.trim() || !pmAccountNumber.trim()) return;

    try {
      if (editingMethod) {
        const res = await fetch("/api/payment-methods", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editingMethod.id,
            name: pmName.trim(),
            accountName: pmAccountName.trim(),
            accountNumber: pmAccountNumber.trim(),
            type: pmType,
            instructions: pmInstructions.trim()
          })
        });
        if (res.ok) {
          showToast("✅ Payment method account updated successfully!");
          setIsAddingMethod(false);
          loadData();
        }
      } else {
        const res = await fetch("/api/payment-methods", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: pmName.trim(),
            accountName: pmAccountName.trim(),
            accountNumber: pmAccountNumber.trim(),
            type: pmType,
            instructions: pmInstructions.trim()
          })
        });
        if (res.ok) {
          showToast("✅ New payment account configured successfully!");
          setIsAddingMethod(false);
          loadData();
        }
      }
    } catch {
      showToast("❌ Failed to save payment account.");
    }
  }

  async function handleDeleteMethod(id: string, name: string) {
    if (!confirm(`Are you sure you want to delete account: ${name}?`)) return;
    try {
      const res = await fetch(`/api/payment-methods?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        showToast("🗑️ Payment account deleted.");
        loadData();
      }
    } catch {
      showToast("❌ Failed to delete payment account.");
    }
  }

  async function handleToggleMethodStatus(method: StoredPaymentMethod) {
    try {
      const res = await fetch("/api/payment-methods", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: method.id,
          isActive: !method.isActive
        })
      });
      if (res.ok) {
        showToast(`Status updated: ${method.name} is now ${!method.isActive ? "Active" : "Inactive"}`);
        loadData();
      }
    } catch {
      showToast("❌ Failed to toggle status");
    }
  }

  // Filter payments
  const pendingCount = payments.filter((p) => p.status === "PENDING_VERIFICATION").length;
  const filteredPayments = payments.filter((p) => {
    const matchStatus = paymentFilter === "ALL" || p.status === paymentFilter;
    const matchQuery =
      p.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.userPhone.includes(searchQuery) ||
      p.transactionRef.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.packageName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchQuery;
  });

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 rounded-2xl bg-brand-navy border border-cyan-400 p-4 text-sm font-bold text-white shadow-2xl animate-in fade-in">
          {toastMessage}
        </div>
      )}

      {/* HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-gradient-to-r from-brand-navy via-brand-deep to-[#0d3478] p-6 text-white shadow-xl">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/40 bg-cyan-400/10 px-3 py-1 text-xs font-black tracking-wide text-cyan-300 uppercase backdrop-blur">
            <ShieldCheck className="h-3.5 w-3.5" />
            Super Admin Financial Control
          </div>
          <h2 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">
            Packages, Accounts & Approvals
          </h2>
          <p className="mt-1 text-sm text-white/75">
            Full Super Admin CRUD over <strong>Membership Packages</strong>, <strong>Company Payment Accounts</strong> (CBE, Telebirr, Awash), and <strong>Receipt Verification</strong>.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            onClick={() =>
              onOpenAi?.(
                `Analyze our company payment accounts and receipt verification performance. We currently have ${paymentMethods.length} payment channels configured and ${pendingCount} receipts waiting for review. Provide best practices to prevent fraudulent payment slips.`
              )
            }
            className="brand-gradient font-black text-brand-navy shadow-lg"
          >
            <Sparkles className="mr-2 h-4 w-4" />
            AI Financial Strategist
          </Button>

          {/* Export CSV based on active tab */}
          <Button
            onClick={() => {
              if (activeTab === "payments") {
                const rows = payments.map((p) => ({
                  "Payment ID": p.id,
                  "User Name": p.userName,
                  "User Phone": p.userPhone,
                  "Package": p.packageName,
                  "Amount (ETB)": p.amountETB,
                  "Payment Method": p.paymentMethod,
                  "Transaction Ref": p.transactionRef,
                  "Status": p.status,
                  "Admin Notes": p.adminNotes,
                  "Submitted At": p.createdAt,
                }));
                exportToCsv(`MyUpline_PaymentVerification_${new Date().toISOString().slice(0,10)}`, rows);
              } else if (activeTab === "packages") {
                const rows = packages.map((p) => ({
                  "Name": p.name,
                  "Price (ETB)": p.priceETB,
                  "PV Points": p.pv,
                  "Badge": p.badge,
                  "Description": p.description,
                  "Features": Array.isArray(p.features) ? p.features.join(" | ") : "",
                  "Active": p.isActive ? "Yes" : "No",
                }));
                exportToCsv(`MyUpline_Packages_${new Date().toISOString().slice(0,10)}`, rows);
              } else {
                const rows = paymentMethods.map((m) => ({
                  "Name": m.name,
                  "Account Name": m.accountName,
                  "Account Number": m.accountNumber,
                  "Type": m.type,
                  "Instructions": m.instructions,
                  "Active": m.isActive ? "Yes" : "No",
                }));
                exportToCsv(`MyUpline_PaymentMethods_${new Date().toISOString().slice(0,10)}`, rows);
              }
            }}
            variant="ghost"
            className="border border-white/20 text-white hover:bg-white/10"
          >
            <FileSpreadsheet className="h-4 w-4 mr-1.5" /> Export CSV
          </Button>

          {/* Print */}
          <Button
            onClick={() => printSection("payments-printable-section", "Packages & Payment Verification Report")}
            variant="ghost"
            className="border border-white/20 text-white hover:bg-white/10"
          >
            <Printer className="h-4 w-4" />
          </Button>

          <Button
            onClick={loadData}
            variant="ghost"
            className="border border-white/20 text-white hover:bg-white/10"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* NAVIGATION TABS */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab("payments")}
            className={cn(
              "flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-black transition",
              activeTab === "payments"
                ? "brand-gradient text-brand-navy shadow-sm"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            )}
          >
            <CreditCard className="h-4 w-4" />
            Receipt Verification
            {pendingCount > 0 && (
              <span className="rounded-full bg-rose-500 px-2 py-0.5 text-[10px] font-black text-white">
                {pendingCount} Pending
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("methods")}
            className={cn(
              "flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-black transition",
              activeTab === "methods"
                ? "brand-gradient text-brand-navy shadow-sm"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            )}
          >
            <Landmark className="h-4 w-4" />
            Payment Accounts (CRUD)
            <span className="rounded-full bg-cyan-100 text-cyan-900 border border-cyan-300 px-2 py-0.5 text-[10px] font-black">
              {paymentMethods.length} Accounts
            </span>
          </button>

          <button
            onClick={() => setActiveTab("packages")}
            className={cn(
              "flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-black transition",
              activeTab === "packages"
                ? "brand-gradient text-brand-navy shadow-sm"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            )}
          >
            <Package className="h-4 w-4" />
            Packages (CRUD)
            <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-black text-slate-700">
              {packages.length}
            </span>
          </button>
        </div>

        {activeTab === "packages" && (
          <Button
            onClick={openAddPackageModal}
            className="brand-gradient font-black text-brand-navy text-xs"
          >
            <Plus className="mr-1.5 h-4 w-4" /> Create Package
          </Button>
        )}

        {activeTab === "methods" && (
          <Button
            onClick={openAddMethodModal}
            className="brand-gradient font-black text-brand-navy text-xs"
          >
            <Plus className="mr-1.5 h-4 w-4" /> Add Payment Account
          </Button>
        )}
      </div>

      {/* ========================================================== */}
      {/* TAB 1: MANUAL PAYMENT APPROVAL QUEUE                       */}
      {/* ========================================================== */}
      {activeTab === "payments" && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search member, phone, transaction ref, or package..."
                className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-xs outline-none focus:border-cyan-400"
              />
            </div>

            <div className="flex items-center gap-1.5 text-xs font-bold">
              {["ALL", "PENDING_VERIFICATION", "APPROVED", "REJECTED"].map((st) => (
                <button
                  key={st}
                  onClick={() => setPaymentFilter(st)}
                  className={cn(
                    "rounded-lg px-3 py-1.5 transition",
                    paymentFilter === st
                      ? "brand-gradient text-brand-navy font-black shadow-sm"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  )}
                >
                  {st === "ALL" && "All Receipts"}
                  {st === "PENDING_VERIFICATION" && `Pending (${pendingCount})`}
                  {st === "APPROVED" && "Approved"}
                  {st === "REJECTED" && "Rejected"}
                </button>
              ))}
            </div>
          </div>

          <Card id="payments-printable-section" className="overflow-hidden border-slate-200 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-black uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-4 py-3.5">User Details</th>
                    <th className="px-4 py-3.5">Package & Amount</th>
                    <th className="px-4 py-3.5">Payment Method & TX Ref</th>
                    <th className="px-4 py-3.5">Receipt Screenshot</th>
                    <th className="px-4 py-3.5">Status</th>
                    <th className="px-4 py-3.5 text-right">Review Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredPayments.map((pay) => {
                    const isPending = pay.status === "PENDING_VERIFICATION";
                    const isApproved = pay.status === "APPROVED";

                    return (
                      <tr key={pay.id} className="hover:bg-slate-50/80 transition">
                        <td className="px-4 py-4">
                          <p className="font-black text-brand-navy">{pay.userName}</p>
                          <p className="text-[11px] text-slate-500">{pay.userPhone}</p>
                          <p className="text-[10px] text-slate-400">{pay.userEmail}</p>
                        </td>

                        <td className="px-4 py-4">
                          <span className="font-bold text-slate-800">{pay.packageName}</span>
                          <p className="font-black text-emerald-700 text-sm mt-0.5">
                            ETB {pay.amountETB?.toLocaleString()}
                          </p>
                        </td>

                        <td className="px-4 py-4">
                          <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700">
                            {pay.paymentMethod}
                          </span>
                          <p className="font-mono text-slate-700 mt-1 font-semibold">
                            {pay.transactionRef}
                          </p>
                          <p className="text-[10px] text-slate-400">
                            {new Date(pay.createdAt).toLocaleDateString()}
                          </p>
                        </td>

                        <td className="px-4 py-4">
                          <button
                            onClick={() => setViewingReceipt(pay)}
                            className="group relative flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-1.5 hover:border-cyan-400 transition"
                          >
                            <div className="h-10 w-12 rounded-lg bg-slate-200 flex items-center justify-center text-slate-400 overflow-hidden">
                              {pay.receiptScreenshotUrl && pay.receiptScreenshotUrl.startsWith("data:image") ? (
                                <img
                                  src={pay.receiptScreenshotUrl}
                                  alt="Receipt"
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <FileText className="h-5 w-5 text-slate-500" />
                              )}
                            </div>
                            <div className="text-left">
                              <span className="font-bold text-brand-blue flex items-center gap-1 group-hover:underline">
                                <ZoomIn className="h-3 w-3" /> View
                              </span>
                              <span className="text-[10px] text-slate-400 block">Click to enlarge</span>
                            </div>
                          </button>
                        </td>

                        <td className="px-4 py-4">
                          <span
                            className={cn(
                              "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-black uppercase",
                              isPending
                                ? "bg-amber-100 text-amber-800"
                                : isApproved
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-rose-100 text-rose-800"
                            )}
                          >
                            {isPending && <Clock className="h-3 w-3" />}
                            {isApproved && <CheckCircle2 className="h-3 w-3" />}
                            {!isPending && !isApproved && <XCircle className="h-3 w-3" />}
                            {pay.status.replace("_", " ")}
                          </span>
                        </td>

                        <td className="px-4 py-4 text-right">
                          {isPending ? (
                            <div className="flex items-center justify-end gap-1.5">
                              <Button
                                size="sm"
                                onClick={() => handleApprovePayment(pay.id)}
                                className="h-8 bg-emerald-600 text-white font-bold hover:bg-emerald-500 text-xs shadow-sm"
                              >
                                <Check className="mr-1 h-3.5 w-3.5" /> Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleRejectPayment(pay.id)}
                                className="h-8 border border-slate-200 text-rose-600 hover:bg-rose-50 text-xs"
                              >
                                Reject
                              </Button>
                            </div>
                          ) : (
                            <span className="text-[11px] font-medium text-slate-400">
                              Verified by {pay.verifiedBy || "Super Admin"}
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}

                  {filteredPayments.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-400">
                        <Coins className="h-8 w-8 mx-auto mb-2 text-slate-300" />
                        No payments found for this filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* ========================================================== */}
      {/* TAB 2: PAYMENT METHODS & ACCOUNTS (CRUD)                   */}
      {/* ========================================================== */}
      {activeTab === "methods" && (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {paymentMethods.map((method) => {
              const isBank = method.type === "BANK";
              const isMobile = method.type === "MOBILE_MONEY";
              const isCopied = copiedId === method.id;

              return (
                <Card
                  key={method.id}
                  className={cn(
                    "p-5 border relative flex flex-col justify-between transition-all",
                    method.isActive
                      ? "border-slate-200 bg-white shadow-sm"
                      : "border-slate-200 bg-slate-50 opacity-75"
                  )}
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={cn(
                            "flex h-10 w-10 items-center justify-center rounded-xl",
                            isMobile
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-cyan-100 text-cyan-900"
                          )}
                        >
                          {isMobile ? <Smartphone className="h-5 w-5" /> : <Landmark className="h-5 w-5" />}
                        </div>
                        <div>
                          <h4 className="font-black text-sm text-brand-navy leading-tight">
                            {method.name}
                          </h4>
                          <span className="text-[10px] font-bold text-slate-400 uppercase">
                            {method.type.replace("_", " ")}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleToggleMethodStatus(method)}
                        className={cn(
                          "rounded-full px-2 py-0.5 text-[9px] font-black uppercase transition",
                          method.isActive
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-slate-200 text-slate-600"
                        )}
                      >
                        {method.isActive ? "Active" : "Disabled"}
                      </button>
                    </div>

                    {/* Account Details */}
                    <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50/80 p-3 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase text-slate-400">Account Number:</span>
                        <button
                          onClick={() => handleCopy(method.id, method.accountNumber)}
                          className="text-[10px] font-bold text-cyan-600 hover:text-cyan-700 flex items-center gap-1"
                        >
                          {isCopied ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                          {isCopied ? "Copied" : "Copy"}
                        </button>
                      </div>
                      <p className="font-mono text-sm font-black text-brand-navy tracking-wide">
                        {method.accountNumber}
                      </p>
                      <div className="pt-1 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                        <span className="text-slate-500">Beneficiary:</span>
                        <span className="font-bold text-slate-800">{method.accountName}</span>
                      </div>
                    </div>

                    {/* Instructions */}
                    {method.instructions && (
                      <p className="mt-3 text-[11px] text-slate-600 leading-relaxed italic">
                        "{method.instructions}"
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="mt-5 flex items-center justify-end gap-2 border-t border-slate-100 pt-3">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => openEditMethodModal(method)}
                      className="h-8 border border-slate-200 text-xs font-bold"
                    >
                      <Edit className="mr-1 h-3.5 w-3.5" /> Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteMethod(method.id, method.name)}
                      className="h-8 border border-red-200 text-rose-600 hover:bg-red-50 text-xs"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* TAB 3: PACKAGES CRUD                                       */}
      {/* ========================================================== */}
      {activeTab === "packages" && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {packages.map((pkg) => (
            <Card
              key={pkg.id}
              className="relative flex flex-col justify-between p-5 border-slate-200 bg-white shadow-sm hover:shadow-md transition"
            >
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-black text-brand-navy">{pkg.name}</h3>
                  {pkg.badge && (
                    <span className="rounded-full bg-cyan-100 border border-cyan-300 px-2 py-0.5 text-[10px] font-black text-brand-navy">
                      {pkg.badge}
                    </span>
                  )}
                </div>

                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-2xl font-black text-brand-navy">
                    ETB {pkg.priceETB.toLocaleString()}
                  </span>
                  <span className="rounded bg-brand-cyan/20 px-2 py-0.5 text-xs font-black text-brand-navy">
                    {pkg.pv} PV
                  </span>
                </div>

                <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                  {pkg.description}
                </p>

                <div className="mt-4 space-y-1.5 border-t border-slate-100 pt-3">
                  {pkg.features?.map((feat, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-700">
                      <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-5 flex items-center justify-end gap-2 border-t border-slate-100 pt-3">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => openEditPackageModal(pkg)}
                  className="h-8 border border-slate-200 text-xs font-bold"
                >
                  <Edit className="mr-1 h-3.5 w-3.5" /> Edit
                </Button>

                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDeletePackage(pkg.id, pkg.name)}
                  className="h-8 border border-red-200 text-rose-600 hover:bg-red-50 text-xs"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* ========================================================== */}
      {/* MODAL 1: RECEIPT LIGHTBOX MODAL                            */}
      {/* ========================================================== */}
      {viewingReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 p-4 backdrop-blur-md animate-in fade-in">
          <Card className="w-full max-w-xl overflow-hidden border-slate-700 bg-[#0c1e3d] text-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-700 px-5 py-4">
              <div>
                <h3 className="font-black text-lg text-white">Payment Receipt Proof</h3>
                <p className="text-xs text-slate-400">
                  {viewingReceipt.userName} • {viewingReceipt.packageName} (ETB {viewingReceipt.amountETB.toLocaleString()})
                </p>
              </div>
              <button
                onClick={() => setViewingReceipt(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-white/10 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="max-h-[380px] w-full overflow-auto rounded-2xl border border-slate-700 bg-slate-950 flex items-center justify-center p-2">
                {viewingReceipt.receiptScreenshotUrl && viewingReceipt.receiptScreenshotUrl.startsWith("data:image") ? (
                  <img
                    src={viewingReceipt.receiptScreenshotUrl}
                    alt="Receipt Screenshot"
                    className="max-h-[360px] w-auto rounded-xl object-contain"
                  />
                ) : (
                  <div className="p-8 text-center">
                    <FileCheck className="h-12 w-12 mx-auto text-cyan-400 mb-2" />
                    <p className="font-bold text-sm text-slate-200">Official Banking Screenshot</p>
                    <p className="text-xs text-slate-400 mt-1">Transaction Ref: {viewingReceipt.transactionRef}</p>
                    <p className="text-[11px] text-cyan-300 mt-2 font-mono">{viewingReceipt.paymentMethod}</p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs bg-white/5 rounded-xl p-3 border border-white/10">
                <div>
                  <span className="text-slate-400">Transaction Ref:</span>
                  <p className="font-mono font-bold text-cyan-300">{viewingReceipt.transactionRef}</p>
                </div>
                <div>
                  <span className="text-slate-400">Payment Channel:</span>
                  <p className="font-bold text-white">{viewingReceipt.paymentMethod}</p>
                </div>
                <div>
                  <span className="text-slate-400">Registered Phone:</span>
                  <p className="font-bold text-white">{viewingReceipt.userPhone}</p>
                </div>
                <div>
                  <span className="text-slate-400">Submission Date:</span>
                  <p className="font-bold text-white">
                    {new Date(viewingReceipt.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              {viewingReceipt.status === "PENDING_VERIFICATION" && (
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-700">
                  <Button
                    variant="ghost"
                    onClick={() => handleRejectPayment(viewingReceipt.id)}
                    className="border border-red-500/40 text-rose-300 hover:bg-red-500/10"
                  >
                    Reject Receipt
                  </Button>
                  <Button
                    onClick={() => handleApprovePayment(viewingReceipt.id)}
                    className="bg-emerald-500 font-black text-white hover:bg-emerald-400"
                  >
                    <Check className="mr-1.5 h-4 w-4" /> Approve & Activate IBO
                  </Button>
                </div>
              )}
            </div>
          </Card>
        </div>
      )}

      {/* ========================================================== */}
      {/* MODAL 2: ADD / EDIT PAYMENT METHOD MODAL                   */}
      {/* ========================================================== */}
      {isAddingMethod && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 p-4 backdrop-blur-sm animate-in fade-in">
          <Card className="w-full max-w-md bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-black text-brand-navy">
                {editingMethod ? "Edit Payment Account" : "Add New Payment Account"}
              </h3>
              <button
                onClick={() => setIsAddingMethod(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMethod} className="mt-4 space-y-3">
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                  Bank / Channel Name
                </label>
                <input
                  required
                  value={pmName}
                  onChange={(e) => setPmName(e.target.value)}
                  placeholder="e.g. Commercial Bank of Ethiopia (CBE), Telebirr..."
                  className="h-10 w-full rounded-xl border border-slate-200 px-3 text-xs outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                  Beneficiary / Account Name
                </label>
                <input
                  required
                  value={pmAccountName}
                  onChange={(e) => setPmAccountName(e.target.value)}
                  placeholder="e.g. MyUpline Global PLC"
                  className="h-10 w-full rounded-xl border border-slate-200 px-3 text-xs outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                    Account / Phone Number
                  </label>
                  <input
                    required
                    value={pmAccountNumber}
                    onChange={(e) => setPmAccountNumber(e.target.value)}
                    placeholder="e.g. 1000 2345 6789"
                    className="h-10 w-full rounded-xl border border-slate-200 px-3 text-xs font-mono outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                    Channel Type
                  </label>
                  <select
                    value={pmType}
                    onChange={(e) => setPmType(e.target.value as any)}
                    className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs outline-none focus:border-cyan-400"
                  >
                    <option value="BANK">Bank Account</option>
                    <option value="MOBILE_MONEY">Mobile Money</option>
                    <option value="CRYPTO">Crypto (USDT)</option>
                    <option value="CASH">Cash Deposit</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                  Payer Instructions / Remark Guide
                </label>
                <textarea
                  rows={2}
                  value={pmInstructions}
                  onChange={(e) => setPmInstructions(e.target.value)}
                  placeholder="e.g. Please put your registered phone number in the transaction remark."
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs outline-none focus:border-cyan-400"
                />
              </div>

              <div className="flex justify-end gap-2 border-t border-slate-100 pt-3">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsAddingMethod(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="brand-gradient font-bold text-brand-navy">
                  {editingMethod ? "Save Account Changes" : "Create Payment Account"}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* ========================================================== */}
      {/* MODAL 3: ADD / EDIT PACKAGE MODAL                          */}
      {/* ========================================================== */}
      {isAddingPackage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 p-4 backdrop-blur-sm animate-in fade-in">
          <Card className="w-full max-w-md bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-black text-brand-navy">
                {editingPackage ? "Edit Package" : "Create New Package"}
              </h3>
              <button
                onClick={() => setIsAddingPackage(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSavePackage} className="mt-4 space-y-3">
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                  Package Name
                </label>
                <input
                  required
                  value={pkgName}
                  onChange={(e) => setPkgName(e.target.value)}
                  placeholder="e.g. Platinum Executive"
                  className="h-10 w-full rounded-xl border border-slate-200 px-3 text-xs outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                    Price (ETB)
                  </label>
                  <input
                    type="number"
                    required
                    value={pkgPrice}
                    onChange={(e) => setPkgPrice(Number(e.target.value))}
                    className="h-10 w-full rounded-xl border border-slate-200 px-3 text-xs outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                    PV (Points)
                  </label>
                  <input
                    type="number"
                    required
                    value={pkgPv}
                    onChange={(e) => setPkgPv(Number(e.target.value))}
                    className="h-10 w-full rounded-xl border border-slate-200 px-3 text-xs outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                  Badge Tag (Optional)
                </label>
                <input
                  value={pkgBadge}
                  onChange={(e) => setPkgBadge(e.target.value)}
                  placeholder="e.g. Popular ⭐, VIP, Fast-Track"
                  className="h-10 w-full rounded-xl border border-slate-200 px-3 text-xs outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  required
                  value={pkgDescription}
                  onChange={(e) => setPkgDescription(e.target.value)}
                  placeholder="Brief summary of who this package is for..."
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                  Features (One per line)
                </label>
                <textarea
                  rows={3}
                  value={pkgFeatures}
                  onChange={(e) => setPkgFeatures(e.target.value)}
                  placeholder="Unlimited Downline Collector&#10;Full Academy Access&#10;Binary Commissions"
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-mono outline-none focus:border-cyan-400"
                />
              </div>

              <div className="flex justify-end gap-2 border-t border-slate-100 pt-3">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsAddingPackage(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="brand-gradient font-bold text-brand-navy">
                  {editingPackage ? "Update Package" : "Create Package"}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
