"use client";

import Link from "next/link";
import { Home, RefreshCw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#07132b] flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center">
          {/* Logo mark */}
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 shadow-lg shadow-blue-900/30">
            <span className="text-3xl font-black text-white">M</span>
          </div>

          {/* Error text */}
          <h1 className="text-2xl font-black text-white">Something went wrong</h1>
          <p className="mt-2 text-sm text-white/60">
            An unexpected error occurred. Your data is safe.
            {error?.digest && (
              <span className="block mt-1 font-mono text-[10px] text-white/30">
                Error ID: {error.digest}
              </span>
            )}
          </p>

          {/* Actions */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              onClick={reset}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 text-sm font-bold text-white shadow-lg transition hover:opacity-90"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </button>
            <Link
              href="/en"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/20"
            >
              <Home className="h-4 w-4" />
              Back to Home
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
