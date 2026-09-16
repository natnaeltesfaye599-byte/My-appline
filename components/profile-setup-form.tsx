"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight, Loader2, UserRound } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function ProfileSetupForm({ locale }: { locale: string }) {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const accessToken = window.localStorage.getItem("myupline.accessToken");
      const response = await fetch("/api/auth/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken ?? ""}`
        },
        body: JSON.stringify({ firstName, lastName, phone: phone || undefined })
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.error?.message ?? "Unable to save profile");

      window.localStorage.setItem("myupline.user", JSON.stringify(payload.data.user));
      router.push(`/${locale}/dashboard/member`);
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
      <Card className="mx-auto mt-14 max-w-lg p-7 text-slate-900">
        <UserRound className="h-8 w-8 text-brand-blue" />
        <h1 className="mt-4 text-2xl font-black text-brand-navy">Profile setup</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Complete your member profile so MyUpline can personalize your team, learning, and recruitment workspace.
        </p>
        <form className="mt-6 grid gap-4 sm:grid-cols-2" onSubmit={submit}>
          <label className="block">
            <span className="mb-1.5 block text-sm font-bold text-slate-700">First name</span>
            <input required value={firstName} onChange={(event) => setFirstName(event.target.value)} className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-brand-cyan" />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-bold text-slate-700">Last name</span>
            <input required value={lastName} onChange={(event) => setLastName(event.target.value)} className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-brand-cyan" />
          </label>
          <label className="block sm:col-span-2">
            <span className="mb-1.5 block text-sm font-bold text-slate-700">Phone</span>
            <input value={phone} onChange={(event) => setPhone(event.target.value)} className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-brand-cyan" placeholder="+251..." />
          </label>
          {error ? <p className="rounded-lg bg-red-50 px-3 py-2 text-sm font-bold text-red-700 sm:col-span-2">{error}</p> : null}
          <Button className="h-11 sm:col-span-2" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Finish setup
            {!isSubmitting ? <ArrowRight className="ml-2 h-4 w-4" /> : null}
          </Button>
        </form>
      </Card>
    </main>
  );
}
