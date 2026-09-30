import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ForgotPasswordForm } from "@/components/forgot-password-form";
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
    title: locale === "am" ? "የይለፍ ቃል መልሶ ማግኛ — MyUpline" : "Forgot Password — MyUpline",
    description:
      locale === "am"
        ? "የይለፍ ቃልዎን ረስተዋል? ኢሜልዎን በማስገባት የመልሶ ማግኛ ሊንክ ያግኙ።"
        : "Reset your MyUpline account password securely.",
    robots: { index: false, follow: false }
  };
}

export default async function ForgotPasswordPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return <ForgotPasswordForm locale={locale} />;
}
