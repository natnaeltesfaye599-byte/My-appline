import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  title: {
    default: "MyUpline | Membership Growth Platform",
    template: "%s | MyUpline"
  },
  description:
    "MyUpline is a membership management, recruitment, LMS, subscription, and organizational growth platform for modern teams.",
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
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
