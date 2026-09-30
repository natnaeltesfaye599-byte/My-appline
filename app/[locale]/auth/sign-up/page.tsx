import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { AuthForm } from "@/components/auth-form";
import { isLocale } from "@/lib/i18n";

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "am" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === "am" ? "ይመዝገቡ — MyUpline" : "Create Account — MyUpline",
    description:
      locale === "am"
        ? "ወደ MyUpline ይቀላቀሉ — የአባልነት አስተዳደር፣ ስልጠና እና ኔትወርክ ዕድገት ፕላትፎርም።"
        : "Join MyUpline — the all-in-one platform for membership management, network growth, and certified training.",
    robots: { index: true, follow: true },
  };
}

export default async function SignUpPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <Suspense fallback={<div className="min-h-screen bg-[#07132b]" />}>
      <AuthForm locale={locale} mode="sign-up" />
    </Suspense>
  );
}
