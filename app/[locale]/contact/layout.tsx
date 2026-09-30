import type { Metadata } from "next";
import type { ReactNode } from "react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title:
      locale === "am"
        ? "ያግኙን — MyUpline ድጋፍና ዋና ቢሮ"
        : "Contact Us — MyUpline Support & Headquarters",
    description:
      locale === "am"
        ? "የአባልነት ክፍያ፣ የስልጠና አካዳሚ፣ ወይም የአውታረ መረብ እድገት ጥያቄ ካለዎት የድጋፍ ቡድናችንን በቀጥታ ያግኙ።"
        : "Reach out to MyUpline Ethiopian headquarters for manual payment verification, LMS training cohorts, or squad leadership assistance.",
    robots: { index: true, follow: true }
  };
}

export default function ContactLayout({ children }: { children: ReactNode }) {
  return children;
}
