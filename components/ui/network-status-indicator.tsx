"use client";

import { useState, useEffect } from "react";
import { Wifi, WifiOff } from "lucide-react";
import { cn } from "@/lib/utils";

export function NetworkStatusIndicator() {
  const [isOnline, setIsOnline] = useState(true);
  const [showReconnected, setShowReconnected] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    setIsOnline(navigator.onLine);

    function handleOnline() {
      setIsOnline(true);
      setShowReconnected(true);
      const timer = setTimeout(() => setShowReconnected(false), 3500);
      return () => clearTimeout(timer);
    }

    function handleOffline() {
      setIsOnline(false);
      setShowReconnected(false);
    }

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (isOnline && !showReconnected) return null;

  return (
    <aside
      aria-live="polite"
      className="fixed bottom-16 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-3 duration-300 no-print pointer-events-none"
    >
      <div
        className={cn(
          "flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold shadow-2xl border backdrop-blur-md",
          !isOnline
            ? "bg-rose-950/90 text-rose-200 border-rose-500/40 shadow-rose-900/30"
            : "bg-emerald-950/90 text-emerald-200 border-emerald-500/40 shadow-emerald-900/30"
        )}
      >
        {!isOnline ? (
          <>
            <WifiOff className="h-4 w-4 text-rose-400 animate-pulse" />
            <span>Offline — Checking mobile network...</span>
          </>
        ) : (
          <>
            <Wifi className="h-4 w-4 text-emerald-400" />
            <span>Back Online — System Synchronized</span>
          </>
        )}
      </div>
    </aside>
  );
}
