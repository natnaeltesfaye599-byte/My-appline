import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { ResetPasswordForm } from "@/components/reset-password-form";
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
    title: locale === "am" ? "አዲስ የይለፍ ቃል ይፍጠሩ — MyUpline" : "Reset Password — MyUpline",
    description:
      locale === "am"
        ? "አዲሱን የይለፍ ቃልዎን ያስገቡ እና መለያዎን ያረጋግጡ።"
        : "Enter your new password to regain access to your MyUpline account.",
    robots: { index: false, follow: false }
  };
}

export default async function ResetPasswordPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <Suspense>
      <ResetPasswordForm locale={locale} />
    </Suspense>
  );
}
