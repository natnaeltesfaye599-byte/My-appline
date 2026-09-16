"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Loader2, LockKeyhole } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function ResetPasswordForm({ locale }: { locale: string }) {
  const token = useSearchParams().get("token") ?? "";
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password })
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.error?.message ?? "Unable to reset password");
      setMessage(payload.data.message);
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
        <LockKeyhole className="h-8 w-8 text-brand-blue" />
        <h1 className="mt-4 text-2xl font-black text-brand-navy">Reset password</h1>
        <form className="mt-6 space-y-4" onSubmit={submit}>
          <label className="block">
            <span className="mb-1.5 block text-sm font-bold text-slate-700">New password</span>
            <input
              required
              minLength={8}
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-brand-cyan"
              placeholder="Minimum 8 characters"
            />
          </label>
          {!token ? <p className="rounded-lg bg-red-50 px-3 py-2 text-sm font-bold text-red-700">Missing reset token.</p> : null}
          {error ? <p className="rounded-lg bg-red-50 px-3 py-2 text-sm font-bold text-red-700">{error}</p> : null}
          {message ? <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm font-bold text-emerald-700">{message}</p> : null}
          <Button className="h-11 w-full" disabled={isSubmitting || !token}>
            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Reset password
          </Button>
        </form>
      </Card>
    </main>
  );
}
