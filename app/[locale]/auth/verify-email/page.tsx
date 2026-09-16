import { Suspense } from "react";
import { notFound } from "next/navigation";
import { VerifyEmailForm } from "@/components/verify-email-form";
import { isLocale } from "@/lib/i18n";

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "am" }];
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
