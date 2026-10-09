"use client";

import { useState, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import { Wifi, WifiOff, RotateCw, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface NetworkStatusIndicatorProps {
  className?: string;
  forceLocale?: "en" | "am";
}

export function NetworkStatusIndicator({
  className,
  forceLocale
}: NetworkStatusIndicatorProps = {}) {
  const pathname = usePathname();
  const isAmharic = forceLocale === "am" || (forceLocale !== "en" && pathname?.startsWith("/am"));

  const [mounted, setMounted] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [showReconnected, setShowReconnected] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [recheckFeedback, setRecheckFeedback] = useState<string | null>(null);

  // Active ping function to test real internet connectivity
  const checkRealConnectivity = useCallback(async () => {
    setIsChecking(true);
    setRecheckFeedback(null);
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);
      const res = await fetch(`/manifest.json?_t=${Date.now()}`, {
        method: "HEAD",
        cache: "no-store",
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        setIsOnline(true);
        setShowReconnected(true);
        setIsDismissed(false);
        setRecheckFeedback(null);
        setTimeout(() => setShowReconnected(false), 3500);
      } else {
        setIsOnline(false);
        setRecheckFeedback(isAmharic ? "አሁንም ከመስመር ውጭ ነው" : "Still offline");
        setTimeout(() => setRecheckFeedback(null), 3000);
      }
    } catch {
      setIsOnline(false);
      setRecheckFeedback(isAmharic ? "አሁንም ከመስመር ውጭ ነው" : "Still offline");
      setTimeout(() => setRecheckFeedback(null), 3000);
    } finally {
      setIsChecking(false);
    }
  }, [isAmharic]);

  useEffect(() => {
    setMounted(true);
    if (typeof window === "undefined") return;

    setIsOnline(navigator.onLine);
    let timer: ReturnType<typeof setTimeout> | null = null;

    function handleOnline() {
      setIsOnline(true);
      setShowReconnected(true);
      setIsDismissed(false);
      setRecheckFeedback(null);
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => setShowReconnected(false), 3500);
    }

    function handleOffline() {
      setIsOnline(false);
      setShowReconnected(false);
      setIsDismissed(false);
      if (timer) clearTimeout(timer);
    }

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      if (timer) clearTimeout(timer);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Prevent hydration mismatch
  if (!mounted) return null;

  // Nothing to display when safely online and no reconnection notice
  if (isOnline && !showReconnected) return null;

  // Minimized state when user dismisses the offline banner
  if (!isOnline && isDismissed) {
    return (
      <aside
        aria-live="polite"
        className="fixed bottom-20 sm:bottom-6 right-4 z-50 animate-in fade-in zoom-in-95 duration-200 no-print pointer-events-auto"
      >
        <button
          type="button"
          onClick={() => setIsDismissed(false)}
          className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold shadow-xl border backdrop-blur-md bg-rose-950/95 text-rose-200 border-rose-500/40 hover:bg-rose-900 transition active:scale-95"
          title={isAmharic ? "የኔትወርክ ሁኔታን አሳይ" : "Expand network status"}
        >
          <WifiOff className="h-3.5 w-3.5 text-rose-400 animate-pulse" />
          <span>{isAmharic ? "ከመስመር ውጭ" : "Offline"}</span>
        </button>
      </aside>
    );
  }

  return (
    <aside
      aria-live="polite"
      className={cn(
        "fixed bottom-20 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-3 duration-300 no-print pointer-events-none max-w-[94vw] sm:max-w-md w-max",
        className
      )}
    >
      <div
        className={cn(
          "pointer-events-auto flex items-center justify-between gap-3 rounded-full px-4 py-2 text-xs font-bold shadow-2xl border backdrop-blur-md transition-all",
          !isOnline
            ? "bg-rose-950/95 text-rose-200 border-rose-500/40 shadow-rose-900/30"
            : "bg-emerald-950/95 text-emerald-200 border-emerald-500/40 shadow-emerald-900/30"
        )}
      >
        {!isOnline ? (
          <>
            <div className="flex items-center gap-2.5">
              <WifiOff className="h-4 w-4 text-rose-400 shrink-0 animate-pulse" />
              <div className="flex flex-col text-left">
                <span className="leading-tight">
                  {recheckFeedback
                    ? recheckFeedback
                    : isAmharic
                    ? "ከመስመር ውጭ — የሞባይል ኔትወርክ ተቋርጧል"
                    : "Offline — Mobile network disconnected"}
                </span>
                <span className="text-[10px] font-normal text-rose-300/80 hidden sm:inline leading-tight">
                  {isAmharic
                    ? "ከመስመር ውጭ ሁነታ ነቅቷል (የተቀመጡ መረጃዎች ይሰራሉ)"
                    : "Offline mode active (cached booklet & data available)"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0 ml-2">
              <button
                type="button"
                onClick={checkRealConnectivity}
                disabled={isChecking}
                className="flex items-center gap-1 rounded-full bg-rose-900/70 hover:bg-rose-800 px-2.5 py-1 text-[11px] font-bold text-rose-100 border border-rose-400/40 transition active:scale-95 disabled:opacity-50"
                title={isAmharic ? "ግንኙነትን ድጋሚ ፈትሽ" : "Re-check connection"}
              >
                <RotateCw
                  className={cn("h-3 w-3 text-rose-200", isChecking && "animate-spin")}
                />
                <span>
                  {isChecking
                    ? isAmharic
                      ? "በማጣራት ላይ..."
                      : "Checking..."
                    : isAmharic
                    ? "ድጋሚ ፈትሽ"
                    : "Retry"}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setIsDismissed(true)}
                className="rounded-full p-1 text-rose-300 hover:text-white hover:bg-rose-900/50 transition active:scale-95"
                title={isAmharic ? "ዝጋ" : "Dismiss"}
                aria-label={isAmharic ? "ዝጋ" : "Dismiss"}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-2">
            <Wifi className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>
              {isAmharic
                ? "እንደገና ተገናኝቷል — ሲስተሙ ተመሳስሏል"
                : "Back Online — System Synchronized"}
            </span>
          </div>
        )}
      </div>
    </aside>
  );
}
