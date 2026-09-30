import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#0c1e3d"
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  title: {
    default: "MyUpline | Membership Growth Platform",
    template: "%s | MyUpline"
  },
  description:
    "MyUpline is a membership management, recruitment, LMS, subscription, and organizational growth platform for modern teams.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "MyUpline"
  },
  keywords: [
    "membership management",
    "recruitment platform",
    "learning management system",
    "team leadership",
    "MyUpline"
  ],
  openGraph: {
    title: "MyUpline",
    description:
      "Manage members, referrals, learning, subscriptions, communication, and analytics in one enterprise-grade platform.",
    images: ["/myupline-logo.jpg"]
  }
};

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  // Note: <html> and <body> are rendered by app/[locale]/layout.tsx
  // so that lang attribute is locale-aware (en vs am).
  // This root layout only provides metadata and global CSS.
  return children;
}

