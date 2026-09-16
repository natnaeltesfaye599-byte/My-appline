"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Camera,
  Check,
  CheckCircle2,
  Clock,
  Coins,
  Copy,
  CreditCard,
  Eye,
  EyeOff,
  FileCheck,
  FileText,
  Globe,
  ImageIcon,
  Loader2,
  Lock,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Sparkles,
  Ticket,
  Upload,
  User,
  X,
  Zap
} from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { roles } from "@/lib/demo-data";
import { cn } from "@/lib/utils";

export type AuthFormProps = {
  locale: string;
  mode: "sign-in" | "sign-up";
};

type SignUpStep = 1 | 2 | 3 | 4 | 5;

interface PackageItem {
  id: string;
  name: string;
  pv: number;
  priceETB: number;
  badge?: string;
  description: string;
}

const defaultPackageList: PackageItem[] = [
  {
    id: "pkg-diamond",
    name: "Diamond Leader",
    pv: 500,
    priceETB: 14990,
    badge: "Recommended ⭐",
    description: "Maximum compensation tiers, full Academy access, personalized Downline Studio."
  },
  {
    id: "pkg-gold",
    name: "Gold Executive",
    pv: 250,
    priceETB: 8490,
    badge: "Popular",
    description: "Multi-level downline tracking, Basic + Advanced training cohorts."
  },
  {
    id: "pkg-silver",
    name: "Silver Associate",
    pv: 100,
    priceETB: 3990,
    description: "Standard name list manager, daily activity scheduler, basic certification."
  },
  {
    id: "pkg-bronze",
    name: "Bronze Starter",
    pv: 50,
    priceETB: 1990,
    description: "Essential IBO onboarding tools, getting started video library."
  }
];

export function AuthForm({ locale, mode }: AuthFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const refParam = searchParams.get("ref") ?? "";
  const nextParam = searchParams.get("next") ?? "";

  const isSignIn = mode === "sign-in";

  const [loggedOutNotice, setLoggedOutNotice] = useState(false);

  // ── Client-side session guard & back-button trap ──
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check if the user just logged out
    if (window.sessionStorage.getItem("myupline_logged_out") === "true") {
      setLoggedOutNotice(true);
      window.sessionStorage.removeItem("myupline_logged_out");
    }

    const token = window.localStorage.getItem("myupline.accessToken");
    const userStr = window.localStorage.getItem("myupline.user");
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        const roleSlug = (user?.role ?? "MEMBER").toLowerCase().replace(/_/g, "-");
        // Use replace so auth page is dropped from history
        router.replace(`/${locale}/dashboard/${roleSlug}`);
        return;
      } catch {
        // Corrupted storage — clear it
        window.localStorage.removeItem("myupline.accessToken");
        window.localStorage.removeItem("myupline.user");
      }
    }

    // ── Security Trap: Prevent Back button from navigating back into dashboard ──
    try {
      window.history.pushState(null, "", window.location.href);
      const handlePopState = () => {
        window.history.pushState(null, "", window.location.href);
      };

      window.addEventListener("popstate", handlePopState);
      return () => {
        window.removeEventListener("popstate", handlePopState);
      };
    } catch {}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale]);

  // Step state for Sign-Up
  const [step, setStep] = useState<SignUpStep>(1);

  // Step 1: Credentials
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [referralCode, setReferralCode] = useState(refParam);
  const [showPassword, setShowPassword] = useState(false);

  // Step 2: Contact & Location (matching user screenshot)
  const [phone, setPhone] = useState("+251 912 345 678");
  const [country, setCountry] = useState("Ethiopia");
  const [region, setRegion] = useState("Addis Ababa");
  const [city, setCity] = useState("Bole, Addis Ababa");
  const [address, setAddress] = useState("House No. 123, Woreda 03");

  // Step 3: Package (loaded dynamically from Super Admin CRUD packages)
  const [availablePackages, setAvailablePackages] = useState<PackageItem[]>(defaultPackageList);
  const [selectedPackage, setSelectedPackage] = useState<PackageItem>(defaultPackageList[0]);

  // Step 4: Manual Payment & Receipt Screenshot
  const [configuredMethods, setConfiguredMethods] = useState<any[]>([]);
  const [paymentMethod, setPaymentMethod] = useState("Commercial Bank of Ethiopia (CBE)");
  const [transactionRef, setTransactionRef] = useState("");
  const [receiptScreenshotUrl, setReceiptScreenshotUrl] = useState<string>("");
  const [receiptFileName, setReceiptFileName] = useState<string>("");
  const [copiedAccId, setCopiedAccId] = useState<string | null>(null);

  // Feedback & submission
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch dynamic packages and active payment methods from Super Admin CRUD store
  useEffect(() => {
    fetch("/api/packages")
      .then((res) => res.json())
      .then((data) => {
        if (data?.data?.packages && data.data.packages.length > 0) {
          setAvailablePackages(data.data.packages);
          setSelectedPackage(data.data.packages[0]);
        }
      })
      .catch(() => {});

    fetch("/api/payment-methods?active=true")
      .then((res) => res.json())
      .then((data) => {
        if (data?.data?.paymentMethods && data.data.paymentMethods.length > 0) {
          setConfiguredMethods(data.data.paymentMethods);
          setPaymentMethod(data.data.paymentMethods[0].name);
        }
      })
      .catch(() => {});
  }, []);

  function handleCopyAcc(id: string, text: string) {
    navigator.clipboard.writeText(text);
    setCopiedAccId(id);
    setTimeout(() => setCopiedAccId(null), 2000);
  }

  // Handle Receipt Screenshot file upload
  function handleReceiptUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file (PNG, JPG, or WEBP receipt).");
      return;
    }

    setReceiptFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setReceiptScreenshotUrl(result);
      setError("");
    };
    reader.readAsDataURL(file);
  }

  // Step Validations
  function validateStep1(): boolean {
    setError("");
    if (!name.trim() || name.trim().length < 2) {
      setError("Please enter your full name (minimum 2 characters).");
      return false;
    }
    if (!email.trim() || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return false;
    }
    if (!password || password.length < 8) {
      setError("Password must be at least 8 characters.");
      return false;
    }
    return true;
  }

  function validateStep2(): boolean {
    setError("");
    if (!phone.trim() || phone.replace(/[^\d]/g, "").length < 7) {
      setError("Please enter a valid phone number.");
      return false;
    }
    if (!city.trim()) {
      setError("Please provide your city.");
      return false;
    }
    return true;
  }

  function validateStep4(): boolean {
    setError("");
    if (!transactionRef.trim() || transactionRef.trim().length < 4) {
      setError("Please provide your bank or mobile transaction reference number.");
      return false;
    }
    if (!receiptScreenshotUrl) {
      setError("Please submit/upload a screenshot of your payment receipt for Super Admin verification.");
      return false;
    }
    return true;
  }

  async function handleFinalSubmit(e?: React.FormEvent) {
    if (e) e.preventDefault();
    setError("");
    setSuccess("");
    setIsSubmitting(true);

    try {
      if (isSignIn) {
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email.trim(), password })
        });
        const payload = await response.json();

        if (!response.ok) {
          throw new Error(payload?.error?.message ?? "Invalid email or password. Please try again.");
        }

        if (payload?.data?.accessToken) {
          window.localStorage.setItem("myupline.accessToken", payload.data.accessToken);
        }
        if (payload?.data?.user) {
          window.localStorage.setItem("myupline.user", JSON.stringify(payload.data.user));
          const role = (payload.data.user.role || "MEMBER").toLowerCase().replace(/_/g, "-");
          // Use replace() so the auth page is removed from history — back button won't re-show login
          const destination = nextParam || `/${locale}/dashboard/${role}`;
          router.replace(destination);
        } else {
          router.replace(`/${locale}/dashboard/member`);
        }
      } else {
        // Multi-step Registration with Manual Payment Receipt
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim(),
            password,
            phone: phone.trim(),
            country: country.trim(),
            region: region.trim(),
            city: city.trim(),
            address: address.trim(),
            packageType: selectedPackage.name,
            referralCode: referralCode.trim() || undefined,
            paymentMethod,
            transactionRef: transactionRef.trim(),
            receiptScreenshotUrl
          })
        });
        const payload = await response.json();

        if (!response.ok) {
          throw new Error(payload?.error?.message ?? "Registration failed. Please verify your details.");
        }

        if (payload?.data?.accessToken) {
          window.localStorage.setItem("myupline.accessToken", payload.data.accessToken);
        }
        if (payload?.data?.user) {
          window.localStorage.setItem("myupline.user", JSON.stringify(payload.data.user));
        }

        setSuccess("Registration & Payment Receipt Submitted! Super Admin will review and approve your receipt.");
        setTimeout(() => {
          router.push(`/${locale}/dashboard/member`);
        }, 1800);
      }
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDemoLogin(roleSlug: string) {
    try {
      const response = await fetch("/api/auth/demo-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roleSlug })
      });
      const payload = await response.json();

      if (!response.ok) {
        setError("Demo login unavailable. Please use the regular sign-in form.");
        return;
      }

      if (payload?.data?.accessToken) {
        window.localStorage.setItem("myupline.accessToken", payload.data.accessToken);
      }
      if (payload?.data?.user) {
        window.localStorage.setItem("myupline.user", JSON.stringify(payload.data.user));
      }
      // Use replace so demo login also removes auth page from history
      router.replace(`/${locale}/dashboard/${roleSlug}`);
    } catch {
      setError("Demo login failed. Please try again.");
    }
  }


  return (
    <main className="min-h-screen bg-[#07132b] px-4 py-8 text-white sm:px-6 flex flex-col justify-between">
      {/* Top Brand Bar */}
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between">
        <Link href={`/${locale}`}>
          <BrandLogo />
        </Link>
        <div className="flex items-center gap-3">
          <Link
            href={locale === "en" ? `/am/auth/${mode}` : `/en/auth/${mode}`}
            className="flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/10 px-2.5 py-1 text-xs font-black text-white hover:bg-white/20 transition-all"
            title={locale === "en" ? "ቀይር ወደ አማርኛ" : "Switch to English"}
          >
            <span>{locale === "en" ? "🇪🇹 አማርኛ" : "🇬🇧 English"}</span>
          </Link>
          <div className="text-xs text-slate-400">
            {isSignIn ? (
              <span>
                {locale === "am" ? "አካውንት የለዎትም? " : "Don't have an account? "}
                <Link href={`/${locale}/auth/sign-up`} className="font-bold text-cyan-300 hover:underline">
                  {locale === "am" ? "ተመዝገብ" : "Sign Up"}
                </Link>
              </span>
            ) : (
              <span>
                {locale === "am" ? "አካውንት አለዎት? " : "Already have an account? "}
                <Link href={`/${locale}/auth/sign-in`} className="font-bold text-cyan-300 hover:underline">
                  {locale === "am" ? "ግባ" : "Sign In"}
                </Link>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Card Container */}
      <div className="mx-auto my-auto w-full max-w-[500px]">
        <div className="rounded-3xl border border-cyan-500/20 bg-[#0c1e3d]/90 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
          {/* Header Title */}
          <div className="text-center">
            <h1 className="text-2xl font-black tracking-tight sm:text-3xl text-white">
              {isSignIn ? "Sign In to MyUpline" : "Create Your Account"}
            </h1>
            <p className="mt-1.5 text-xs text-slate-400">
              {isSignIn && "Access your network marketing command center"}
              {!isSignIn && step === 1 && "Enter your personal & account credentials"}
              {!isSignIn && step === 2 && "Provide your contact & location details"}
              {!isSignIn && step === 3 && "Select your enrollment package level"}
              {!isSignIn && step === 4 && "Submit manual payment & receipt screenshot"}
              {!isSignIn && step === 5 && "Review your information & finalize"}
            </p>
          </div>

          {/* Stepper (Only on Sign Up) */}
          {!isSignIn && (
            <div className="my-6 flex items-center justify-center gap-1.5">
              {[1, 2, 3, 4, 5].map((s, idx) => {
                const isPassed = step > s;
                const isCurrent = step === s;

                return (
                  <div key={s} className="flex items-center">
                    <div
                      className={cn(
                        "flex h-7 w-7 items-center justify-center rounded-full text-xs font-black transition-all duration-300",
                        isPassed
                          ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/30"
                          : isCurrent
                          ? "bg-cyan-400 text-brand-navy ring-4 ring-cyan-400/20 shadow-md shadow-cyan-400/30 font-extrabold"
                          : "border border-slate-700 bg-slate-800/80 text-slate-500"
                      )}
                    >
                      {isPassed ? <Check className="h-3.5 w-3.5 stroke-[3]" /> : s}
                    </div>

                    {idx < 4 && (
                      <div
                        className={cn(
                          "h-0.5 w-6 transition-colors duration-300 mx-1",
                          step > idx + 1 ? "bg-cyan-400" : "bg-slate-700"
                        )}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Secure Logout Notification Banner */}
          {loggedOutNotice && (
            <div className="mb-4 flex items-center gap-2 rounded-xl border border-cyan-500/30 bg-cyan-500/10 p-3 text-xs font-semibold text-cyan-300 animate-in fade-in">
              <ShieldCheck className="h-4 w-4 shrink-0 text-cyan-400" />
              <span>You have been securely signed out. Protected workspace access is closed.</span>
            </div>
          )}

          {/* Error / Alert Display */}
          {error && (
            <div className="mb-4 rounded-xl border border-rose-500/30 bg-rose-500/15 p-3 text-xs font-semibold text-rose-300 animate-in fade-in">
              {error}
            </div>
          )}

          {/* Success Banner */}
          {success && (
            <div className="mb-4 rounded-xl border border-emerald-500/30 bg-emerald-500/15 p-3 text-xs font-semibold text-emerald-300 animate-in fade-in">
              {success}
            </div>
          )}

          {/* ========================================= */}
          {/* SIGN IN VIEW                              */}
          {/* ========================================= */}
          {isSignIn && (
            <form onSubmit={handleFinalSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="leader@myupline.com"
                    className="h-11 w-full rounded-xl border border-slate-700/80 bg-[#06142a]/80 pl-10 pr-3 text-sm text-white placeholder-slate-500 outline-none transition focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Password
                  </label>
                  <Link
                    href={`/${locale}/auth/forgot-password`}
                    className="text-xs text-cyan-300 hover:underline font-semibold"
                  >
                    Forgot?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="h-11 w-full rounded-xl border border-slate-700/80 bg-[#06142a]/80 pl-10 pr-10 text-sm text-white placeholder-slate-500 outline-none transition focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="mt-2 h-11 w-full rounded-xl bg-cyan-400 font-black text-brand-navy shadow-lg shadow-cyan-400/25 transition hover:bg-cyan-300"
              >
                {isSubmitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <>
                    Sign In <ArrowRight className="ml-1.5 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          )}

          {/* ========================================= */}
          {/* SIGN UP STEP 1: CREDENTIALS               */}
          {/* ========================================= */}
          {!isSignIn && step === 1 && (
            <div className="space-y-3.5">
              <div>
                <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Full Name
                </label>
                <div className="relative">
                  <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Solomon Hailu Tadesse"
                    className="h-10 w-full rounded-xl border border-slate-700/80 bg-[#06142a]/80 pl-10 pr-3 text-xs text-white placeholder-slate-500 outline-none transition focus:border-cyan-400"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="leader@example.com"
                    className="h-10 w-full rounded-xl border border-slate-700/80 bg-[#06142a]/80 pl-10 pr-3 text-xs text-white placeholder-slate-500 outline-none transition focus:border-cyan-400"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Password (min. 8 characters)
                </label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="h-10 w-full rounded-xl border border-slate-700/80 bg-[#06142a]/80 pl-10 pr-10 text-xs text-white placeholder-slate-500 outline-none transition focus:border-cyan-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Sponsor Referral Code (Optional)
                </label>
                <div className="relative">
                  <Ticket className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={referralCode}
                    onChange={(e) => setReferralCode(e.target.value)}
                    placeholder="UP-XXXXXX"
                    className="h-10 w-full rounded-xl border border-slate-700/80 bg-[#06142a]/80 pl-10 pr-3 text-xs text-white placeholder-slate-500 outline-none transition focus:border-cyan-400"
                  />
                </div>
              </div>

              <Button
                type="button"
                onClick={() => {
                  if (validateStep1()) setStep(2);
                }}
                className="mt-2 h-11 w-full rounded-xl bg-cyan-400 font-black text-brand-navy shadow-lg shadow-cyan-400/25 transition hover:bg-cyan-300"
              >
                Continue to Location <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
            </div>
          )}

          {/* ================================================= */}
          {/* SIGN UP STEP 2: PHONE & LOCATION (MATCHING IMAGE) */}
          {/* ================================================= */}
          {!isSignIn && step === 2 && (
            <div className="space-y-3.5">
              <div>
                <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-slate-300">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+251 912 345 678"
                    className="h-10 w-full rounded-xl border border-slate-700/80 bg-[#06142a]/90 pl-10 pr-3 text-xs font-medium text-white placeholder-slate-500 outline-none transition focus:border-cyan-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-slate-300">
                    Country
                  </label>
                  <div className="relative">
                    <Globe className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      placeholder="Ethiopia"
                      className="h-10 w-full rounded-xl border border-slate-700/80 bg-[#06142a]/90 pl-8 pr-2 text-xs font-medium text-white placeholder-slate-500 outline-none transition focus:border-cyan-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-slate-300">
                    Region / State
                  </label>
                  <div className="relative">
                    <MapPin className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={region}
                      onChange={(e) => setRegion(e.target.value)}
                      placeholder="Addis Ababa"
                      className="h-10 w-full rounded-xl border border-cyan-500/60 bg-[#06142a]/90 pl-8 pr-2 text-xs font-medium text-white placeholder-slate-500 outline-none transition focus:border-cyan-400"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-slate-300">
                  City
                </label>
                <div className="relative">
                  <MapPin className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Bole, Addis Ababa"
                    className="h-10 w-full rounded-xl border border-slate-700/80 bg-[#06142a]/90 pl-10 pr-3 text-xs font-medium text-white placeholder-slate-500 outline-none transition focus:border-cyan-400"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-slate-300">
                  Street / House Address
                </label>
                <div className="relative">
                  <MapPin className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="House No. 123, Woreda 03"
                    className="h-10 w-full rounded-xl border border-slate-700/80 bg-[#06142a]/90 pl-10 pr-3 text-xs font-medium text-white placeholder-slate-500 outline-none transition focus:border-cyan-400"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800/60 text-xs font-bold text-slate-300 transition hover:bg-slate-800 hover:text-white"
                >
                  <ArrowLeft className="h-3.5 w-3.5" /> Back
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (validateStep2()) setStep(3);
                  }}
                  className="flex h-11 flex-[1.4] items-center justify-center gap-2 rounded-xl bg-cyan-400 text-xs font-black text-brand-navy shadow-lg shadow-cyan-400/25 transition hover:bg-cyan-300"
                >
                  Continue to Packages <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* ========================================= */}
          {/* SIGN UP STEP 3: CHOOSE PACKAGE            */}
          {/* ========================================= */}
          {!isSignIn && step === 3 && (
            <div className="space-y-3">
              {availablePackages.map((pkg) => {
                const isSelected = selectedPackage.id === pkg.id || selectedPackage.name === pkg.name;
                return (
                  <div
                    key={pkg.id}
                    onClick={() => setSelectedPackage(pkg)}
                    className={cn(
                      "cursor-pointer rounded-2xl border p-3.5 transition-all",
                      isSelected
                        ? "border-cyan-400 bg-cyan-950/40 ring-1 ring-cyan-400 shadow-md"
                        : "border-slate-800 bg-[#06142a]/70 hover:border-slate-700"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className={cn(
                            "flex h-4 w-4 items-center justify-center rounded-full border",
                            isSelected ? "border-cyan-400 bg-cyan-400 text-brand-navy" : "border-slate-600"
                          )}
                        >
                          {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                        </div>
                        <h4 className="text-xs font-black text-white">{pkg.name}</h4>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-black text-cyan-300">
                          ETB {pkg.priceETB.toLocaleString()}
                        </span>
                        <span className="ml-1.5 rounded bg-cyan-400/10 px-1.5 py-0.5 text-[9px] font-bold text-cyan-400">
                          {pkg.pv} PV
                        </span>
                      </div>
                    </div>
                    <p className="mt-1 pl-6 text-[11px] text-slate-400 leading-snug">{pkg.description}</p>
                  </div>
                );
              })}

              <div className="flex items-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800/60 text-xs font-bold text-slate-300 transition hover:bg-slate-800 hover:text-white"
                >
                  <ArrowLeft className="h-3.5 w-3.5" /> Back
                </button>

                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="flex h-11 flex-[1.4] items-center justify-center gap-2 rounded-xl bg-cyan-400 text-xs font-black text-brand-navy shadow-lg shadow-cyan-400/25 transition hover:bg-cyan-300"
                >
                  Manual Payment <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* ========================================================== */}
          {/* SIGN UP STEP 4: MANUAL PAYMENT & SUBMIT RECEIPT SCREENSHOT */}
          {/* ========================================================== */}
          {!isSignIn && step === 4 && (
            <div className="space-y-3.5">
              {/* Configured Company Bank & Mobile Accounts */}
              <div className="rounded-2xl border border-cyan-500/30 bg-cyan-950/30 p-3.5 text-xs text-slate-300 space-y-2">
                <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2">
                  <span className="font-bold text-cyan-300 flex items-center gap-1.5">
                    <Coins className="h-4 w-4" /> Transfer Amount:
                  </span>
                  <span className="font-black text-white text-sm">
                    ETB {selectedPackage.priceETB.toLocaleString()}
                  </span>
                </div>

                <p className="text-[10px] uppercase font-bold text-slate-400">
                  Select a company payment account to transfer:
                </p>

                <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1">
                  {configuredMethods.map((m) => {
                    const isSelected = paymentMethod === m.name;
                    const isCopied = copiedAccId === m.id;

                    return (
                      <div
                        key={m.id}
                        onClick={() => setPaymentMethod(m.name)}
                        className={cn(
                          "cursor-pointer rounded-xl border p-2 text-xs transition",
                          isSelected
                            ? "border-cyan-400 bg-cyan-950/60 ring-1 ring-cyan-400"
                            : "border-slate-800 bg-[#06142a]/80 hover:border-slate-700"
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-black text-white">{m.name}</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopyAcc(m.id, m.accountNumber);
                            }}
                            className="text-[10px] font-bold text-cyan-300 hover:underline flex items-center gap-1"
                          >
                            {isCopied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                            {isCopied ? "Copied" : "Copy"}
                          </button>
                        </div>
                        <p className="font-mono text-cyan-200 font-bold mt-0.5">{m.accountNumber}</p>
                        <p className="text-[10px] text-slate-400">Beneficiary: {m.accountName}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Payment Method Select */}
              <div>
                <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-slate-300">
                  Payment Method
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="h-10 w-full rounded-xl border border-slate-700 bg-[#06142a] px-3 text-xs text-white outline-none focus:border-cyan-400"
                >
                  {configuredMethods.length > 0 ? (
                    configuredMethods.map((m) => (
                      <option key={m.id} value={m.name}>
                        {m.name} ({m.accountNumber})
                      </option>
                    ))
                  ) : (
                    <>
                      <option>Commercial Bank of Ethiopia (CBE)</option>
                      <option>Telebirr</option>
                      <option>Awash Bank</option>
                      <option>Bank of Abyssinia</option>
                    </>
                  )}
                </select>
              </div>

              {/* Transaction Reference Number */}
              <div>
                <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-slate-300">
                  Transaction Reference Number / TX ID
                </label>
                <input
                  type="text"
                  required
                  value={transactionRef}
                  onChange={(e) => setTransactionRef(e.target.value)}
                  placeholder="e.g. CBE-TX-98217349 or Telebirr TX"
                  className="h-10 w-full rounded-xl border border-slate-700/80 bg-[#06142a]/90 px-3 text-xs font-mono text-white placeholder-slate-500 outline-none transition focus:border-cyan-400"
                />
              </div>

              {/* Submit Screenshot of the Receipt */}
              <div>
                <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-slate-300">
                  Submit Screenshot of the Receipt *
                </label>

                <label className="relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-cyan-500/40 bg-[#06142a]/80 p-4 text-center cursor-pointer hover:border-cyan-400 hover:bg-cyan-950/20 transition">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleReceiptUpload}
                    className="sr-only"
                  />

                  {receiptScreenshotUrl ? (
                    <div className="flex items-center gap-3 w-full">
                      <div className="h-14 w-14 rounded-xl border border-cyan-400/60 overflow-hidden bg-slate-900 shrink-0">
                        <img
                          src={receiptScreenshotUrl}
                          alt="Receipt Preview"
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="text-left flex-1 min-w-0">
                        <p className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="h-3.5 w-3.5" /> Screenshot Attached
                        </p>
                        <p className="text-[10px] text-slate-400 truncate mt-0.5">
                          {receiptFileName || "receipt_screenshot.png"}
                        </p>
                        <span className="text-[10px] text-cyan-300 hover:underline">
                          Click to change screenshot
                        </span>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300 mb-2">
                        <Upload className="h-5 w-5" />
                      </div>
                      <p className="text-xs font-bold text-slate-200">
                        Upload Receipt Screenshot
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        PNG, JPG, or screenshot from banking app
                      </p>
                    </>
                  )}
                </label>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800/60 text-xs font-bold text-slate-300 transition hover:bg-slate-800 hover:text-white"
                >
                  <ArrowLeft className="h-3.5 w-3.5" /> Back
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (validateStep4()) setStep(5);
                  }}
                  className="flex h-11 flex-[1.4] items-center justify-center gap-2 rounded-xl bg-cyan-400 text-xs font-black text-brand-navy shadow-lg shadow-cyan-400/25 transition hover:bg-cyan-300"
                >
                  Review Details <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* ========================================= */}
          {/* SIGN UP STEP 5: REVIEW & FINALIZE         */}
          {/* ========================================= */}
          {!isSignIn && step === 5 && (
            <div className="space-y-4">
              <div className="rounded-2xl border border-slate-800 bg-[#06142a]/90 p-4 text-xs space-y-2">
                <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
                  <span className="text-slate-400">Full Name</span>
                  <span className="font-bold text-white">{name}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
                  <span className="text-slate-400">Phone & Location</span>
                  <span className="font-bold text-white">{phone} • {city}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
                  <span className="text-slate-400">Chosen Package</span>
                  <span className="font-black text-cyan-300">
                    {selectedPackage.name} (ETB {selectedPackage.priceETB.toLocaleString()})
                  </span>
                </div>
                <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
                  <span className="text-slate-400">Payment Channel</span>
                  <span className="font-bold text-white">{paymentMethod}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
                  <span className="text-slate-400">Transaction Reference</span>
                  <span className="font-mono font-bold text-emerald-400">{transactionRef}</span>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-slate-400">Receipt Proof</span>
                  <span className="font-bold text-emerald-400 flex items-center gap-1">
                    <FileCheck className="h-3.5 w-3.5" /> Attached for Super Admin Verification
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800/60 text-xs font-bold text-slate-300 transition hover:bg-slate-800 hover:text-white"
                >
                  <ArrowLeft className="h-3.5 w-3.5" /> Back
                </button>

                <Button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => handleFinalSubmit()}
                  className="flex h-11 flex-[1.6] items-center justify-center gap-2 rounded-xl bg-cyan-400 text-xs font-black text-brand-navy shadow-lg shadow-cyan-400/25 transition hover:bg-cyan-300"
                >
                  {isSubmitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      Submit & Register <CheckCircle2 className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Quick Demo Access Pills */}
          <div className="mt-6 border-t border-slate-800/80 pt-4">
            <p className="text-center text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Instant 1-Click Demo Access
            </p>
            <div className="mt-2 flex flex-wrap justify-center gap-1.5">
              {roles.map((r) => (
                <button
                  key={r.slug}
                  onClick={() => handleDemoLogin(r.slug)}
                  className="rounded-lg border border-slate-800 bg-slate-800/40 px-2 py-1 text-[11px] font-semibold text-slate-300 transition hover:border-cyan-400/40 hover:bg-cyan-950/40 hover:text-cyan-300"
                >
                  {r.name}
                </button>
              ))}
            </div>
          </div>

          {/* Bottom Prompt */}
          <div className="mt-4 text-center text-xs text-slate-400">
            {isSignIn ? (
              <span>
                Don&apos;t have an account?{" "}
                <Link href={`/${locale}/auth/sign-up`} className="font-bold text-cyan-300 hover:underline">
                  Sign Up
                </Link>
              </span>
            ) : (
              <span>
                Already have an account?{" "}
                <Link href={`/${locale}/auth/sign-in`} className="font-bold text-cyan-300 hover:underline">
                  Sign In
                </Link>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Footer copyright */}
      <div className="mx-auto mt-6 text-center text-[11px] text-slate-400">
        © {new Date().getFullYear()} MyUpline Global. All rights reserved.
      </div>
    </main>
  );
}
