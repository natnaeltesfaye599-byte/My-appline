import { MarketingPage } from "@/components/marketing-page";
import { getDictionary, isLocale, type Locale } from "@/lib/i18n";

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "am" }];
}

export default async function LocaleHomePage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const normalized: Locale = isLocale(locale) ? locale : "en";
  const copy = getDictionary(normalized);

  return <MarketingPage locale={normalized} copy={copy} />;
}
