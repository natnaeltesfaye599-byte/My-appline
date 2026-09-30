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
    title: locale === "am" ? "ወደ MyUpline ይግቡ" : "Sign In — MyUpline",
    description:
      locale === "am"
        ? "ወደ MyUpline ፕላትፎርም ለመግባት ኢሜልዎን እና ፓስዎርድዎን ያስገቡ።"
        : "Sign in to your MyUpline account to access your dashboard, team, and training.",
    robots: { index: false, follow: false },
  };
}

export default async function SignInPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <Suspense fallback={<div className="min-h-screen bg-[#07132b]" />}>
      <AuthForm locale={locale} mode="sign-in" />
    </Suspense>
  );
}
