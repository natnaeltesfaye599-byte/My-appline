import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProfileSetupForm } from "@/components/profile-setup-form";
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
    title: locale === "am" ? "የመገለጫ ማዋቀር — MyUpline" : "Profile Setup — MyUpline",
    description:
      locale === "am"
        ? "የመገለጫ ዝርዝሮችዎን፣ ስልክዎን እና የክፍያ መረጃዎን ያዘጋጁ።"
        : "Complete your profile setup to start accessing network tools and training.",
    robots: { index: false, follow: false }
  };
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
