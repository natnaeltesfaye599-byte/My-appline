import { notFound } from "next/navigation";
import { ProfileSetupForm } from "@/components/profile-setup-form";
import { isLocale } from "@/lib/i18n";

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "am" }];
}

export default async function ProfileSetupPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return <ProfileSetupForm locale={locale} />;
}
