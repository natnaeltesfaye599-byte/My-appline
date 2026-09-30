import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { DashboardShell } from "@/components/dashboard-shell";
import { roles } from "@/lib/demo-data";
import { isLocale } from "@/lib/i18n";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? "development-only-secret"
);

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string; role: string }>;
}): Promise<Metadata> {
  const { locale, role } = await params;
  const roleItem = roles.find((r) => r.slug === role);
  const roleName = roleItem ? roleItem.name : "Executive";
  return {
    title:
      locale === "am"
        ? `${roleName} ዳሽቦርድ — MyUpline`
        : `${roleName} Dashboard — MyUpline`,
    description: `Executive management portal for ${roleName} on MyUpline Global platform.`,
    robots: { index: false, follow: false }
  };
}

export default async function RoleDashboardPage({
  params
}: {
  params: Promise<{ locale: string; role: string }>;
}) {
  const { locale, role } = await params;

  if (!isLocale(locale) || !roles.some((item) => item.slug === role)) {
    notFound();
  }

  // Server-side authentication verification — blocks Back button from showing cached or stale dashboard
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("myupline_session")?.value;
  if (!sessionCookie) {
    redirect(`/${locale}/auth/sign-in`);
  }

  try {
    await jwtVerify(sessionCookie, JWT_SECRET);
  } catch {
    redirect(`/${locale}/auth/sign-in`);
  }

  return <DashboardShell locale={locale} roleSlug={role} />;
}
