import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found — MyUpline",
  description: "The page you're looking for doesn't exist.",
};

export default function NotFound() {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#07132b] flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center">
          {/* Logo mark */}
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 shadow-lg shadow-blue-900/30">
            <span className="text-3xl font-black text-white">M</span>
          </div>

          {/* 404 */}
          <p className="text-7xl font-black text-white/10 select-none">404</p>
          <h1 className="-mt-6 text-2xl font-black text-white">Page Not Found</h1>
          <p className="mt-2 text-sm text-white/60">
            The page you're looking for doesn't exist or has been moved.
          </p>

          {/* Actions */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/en"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 text-sm font-bold text-white shadow-lg transition hover:opacity-90"
            >
              Go to Home
            </Link>
            <Link
              href="/en/auth/sign-in"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/20"
            >
              Sign In
            </Link>
          </div>

          <p className="mt-8 text-[11px] text-white/30">
            MyUpline Global — Membership Growth Platform
          </p>
        </div>
      </body>
    </html>
  );
}
