"use client";

import { useState, useEffect } from "react";
import { AlertTriangle, X } from "lucide-react";

const DISMISSED_KEY = "myupline.demo_banner_dismissed";

export function DemoModeBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const dismissed = window.localStorage.getItem(DISMISSED_KEY);
    if (dismissed !== "true") setVisible(true);
  }, []);

  function dismiss() {
    setVisible(false);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(DISMISSED_KEY, "true");
    }
  }

  if (!visible) return null;

  return (
    <div
      className="no-print relative z-50 flex items-center justify-between gap-3 bg-amber-500 px-4 py-2 text-amber-950"
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-center gap-2 text-xs font-bold">
        <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
        <span>
          <strong>Demo Mode</strong> — All data is simulated and is not saved
          to a real database. This is a live preview environment.
        </span>
      </div>
      <button
        onClick={dismiss}
        className="shrink-0 rounded p-0.5 opacity-70 hover:opacity-100 transition"
        aria-label="Dismiss demo mode notice"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
