"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Loader2, Mail } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function ForgotPasswordForm({ locale }: { locale: string }) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [resetUrl, setResetUrl] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");
    setResetUrl("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.error?.message ?? "Unable to request reset");
      setMessage(payload.data.message);
      setResetUrl(payload.data.resetUrl ?? "");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen hero-gradient px-5 py-6 text-white sm:px-8">
      <div className="mx-auto max-w-7xl">
        <Link href={`/${locale}`}>
          <BrandLogo />
        </Link>
      </div>
      <Card className="mx-auto mt-20 max-w-md p-7 text-slate-900">
        <Mail className="h-8 w-8 text-brand-blue" />
        <h1 className="mt-4 text-2xl font-black text-brand-navy">Forgot password</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Enter your email and MyUpline will issue a password reset link.
        </p>
        <form className="mt-6 space-y-4" onSubmit={submit}>
          <label className="block">
            <span className="mb-1.5 block text-sm font-bold text-slate-700">Email</span>
            <input
              required
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-brand-cyan"
              placeholder="you@example.com"
            />
          </label>
          {error ? <p className="rounded-lg bg-red-50 px-3 py-2 text-sm font-bold text-red-700">{error}</p> : null}
          {message ? <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm font-bold text-emerald-700">{message}</p> : null}
          {resetUrl ? (
            <Link href={resetUrl} className="block rounded-lg bg-cyan-50 px-3 py-2 text-sm font-bold text-brand-blue">
              Open development reset link
            </Link>
          ) : null}
          <Button className="h-11 w-full" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Send reset link
            {!isSubmitting ? <ArrowRight className="ml-2 h-4 w-4" /> : null}
          </Button>
        </form>
      </Card>
    </main>
  );
}
