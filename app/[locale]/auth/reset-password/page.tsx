import { Suspense } from "react";
import { notFound } from "next/navigation";
import { ResetPasswordForm } from "@/components/reset-password-form";
import { isLocale } from "@/lib/i18n";

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "am" }];
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
