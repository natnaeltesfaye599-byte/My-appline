import { isLocale, type Locale } from "@/lib/i18n";
import { ProspectQualifierFunnel } from "@/components/prospect-qualifier-funnel";
import type { Metadata } from "next";

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
    title:
      locale === "am"
        ? "የዕጩዎች ብቃት መመዘኛ ፈንል | Breakthrough Share Company"
        : "Prospect Qualification Assessment | Breakthrough Share Company",
    description:
      locale === "am"
        ? "ለከፍተኛ ኔትወርክ መሪዎች የተዘጋጀ ባለ 3-ደረጃ እና 9-ጥያቄዎች የብቃት መመዘኛ ፈንል።"
        : "Official 3-Step Screening & 9-Question Assessment Funnel for serious prospective leaders ready to build a system and grow financially with Breakthrough Share Company.",
    robots: { index: true, follow: true }
  };
}

export default async function ProspectFunnelPage({
  params,
  searchParams
}: {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<{ ref?: string }>;
}) {
  const { locale } = await params;
  const sParams = searchParams ? await searchParams : {};
  const normalized: Locale = isLocale(locale) ? locale : "am";
  const sponsorRef = sParams?.ref || "BREAKTHROUGH-DIRECT";

  return (
    <main className="min-h-screen bg-[#07132b] px-4 py-8 text-white sm:px-6 flex flex-col justify-between">
      <div className="mx-auto w-full max-w-4xl my-auto">
        <ProspectQualifierFunnel
          initialLang={normalized === "am" ? "am" : "en"}
          sponsorRef={sponsorRef}
          sponsorName="Breakthrough Share Company Leadership"
        />
      </div>

      <footer className="mt-8 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} Breakthrough Share Company & MyUpline Global. All rights reserved.
      </footer>
    </main>
  );
}
