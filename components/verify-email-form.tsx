"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function VerifyEmailForm({ locale }: { locale: string }) {
  const token = useSearchParams().get("token") ?? "";
  const [status, setStatus] = useState("Verifying your email...");
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    async function verify() {
      if (!token) {
        setStatus("Missing verification token.");
        setFailed(true);
        return;
      }

      const response = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token })
      });
      const payload = await response.json();
      setStatus(response.ok ? payload.data.message : payload?.error?.message ?? "Verification failed");
      setFailed(!response.ok);
    }

    void verify();
  }, [token]);

  return (
    <main className="min-h-screen hero-gradient px-5 py-6 text-white sm:px-8">
      <div className="mx-auto max-w-7xl">
        <Link href={`/${locale}`}>
          <BrandLogo />
        </Link>
      </div>
      <Card className="mx-auto mt-20 max-w-md p-7 text-center text-slate-900">
        {status === "Verifying your email..." ? (
          <Loader2 className="mx-auto h-9 w-9 animate-spin text-brand-blue" />
        ) : (
          <CheckCircle2 className="mx-auto h-9 w-9 text-brand-green" />
        )}
        <h1 className="mt-4 text-2xl font-black text-brand-navy">Email Verification</h1>
        <p className={failed ? "mt-3 text-sm font-bold text-red-700" : "mt-3 text-sm font-bold text-emerald-700"}>{status}</p>
        <Link href={`/${locale}/auth/sign-in`}>
          <Button className="mt-6">Continue to sign in</Button>
        </Link>
      </Card>
    </main>
  );
}
