import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n";
import { NetworkStatusIndicator } from "@/components/ui/network-status-indicator";
import { DemoModeBanner } from "@/components/ui/demo-mode-banner";
import { SwRegistration } from "@/components/ui/sw-registration";

interface LocaleLayoutProps {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (locale === "am") {
    return {
      title: {
        default: "MyUpline | የአባልነት ዕድገት ፕላትፎርም",
        template: "%s | MyUpline",
      },
      description:
        "MyUpline — የአባልነት አስተዳደር፣ ምልምላ፣ ስልጠና እና ድርጅታዊ ዕድገት ፕላትፎርም።",
    };
  }
  return {
    title: {
      default: "MyUpline | Membership Growth Platform",
      template: "%s | MyUpline",
    },
    description:
      "MyUpline is a membership management, recruitment, LMS, subscription, and organizational growth platform for modern teams.",
  };
}

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "am" }];
}

const isDemoMode = process.env.DEMO_MODE_ENABLED === "true";

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <html lang={locale as Locale} suppressHydrationWarning>
      <body suppressHydrationWarning>
        {isDemoMode && <DemoModeBanner />}
        {children}
        <NetworkStatusIndicator />
        <SwRegistration />
      </body>
    </html>
  );
}

