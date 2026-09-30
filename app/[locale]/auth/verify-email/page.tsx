import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { VerifyEmailForm } from "@/components/verify-email-form";
import { isLocale } from "@/lib/i18n";

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "am" }];
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === "am" ? "ኢሜልዎን ያረጋግጡ — MyUpline" : "Verify Email — MyUpline",
    description:
      locale === "am"
        ? "የኢሜል ማረጋገጫ ኮድዎን በማስገባት ምዝገባዎን ያጠናቅቁ።"
        : "Verify your email address to activate your MyUpline membership.",
    robots: { index: false, follow: false }
  };
}

export default async function VerifyEmailPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <Suspense>
      <VerifyEmailForm locale={locale} />
    </Suspense>
  );
}
