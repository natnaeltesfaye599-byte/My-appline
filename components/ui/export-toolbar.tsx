"use client";

import { useState } from "react";
import { Download, FileSpreadsheet, FileJson, Printer, Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { exportToCsv, exportToJson, printSection } from "@/lib/export-utils";

interface ExportToolbarProps {
  /** Unique HTML id of the section to print (must wrap printable content with id) */
  printSectionId: string;
  /** Title shown in the print header and modal */
  title: string;
  /** Data rows for CSV export */
  csvRows?: Record<string, unknown>[];
  /** Filename prefix (no extension) */
  filename?: string;
  /** Full data object for JSON export */
  jsonData?: unknown;
  /** Extra CSS classes on the container */
  className?: string;
  /** Compact single-button mode */
  compact?: boolean;
}

export function ExportToolbar({
  printSectionId,
  title,
  csvRows,
  filename,
  jsonData,
  className,
  compact = false
}: ExportToolbarProps) {
  const [open, setOpen] = useState(false);
  const [exported, setExported] = useState<string | null>(null);

  const fname = filename ?? title.replace(/[^a-zA-Z0-9]/g, "_");

  function flash(key: string) {
    setExported(key);
    setTimeout(() => setExported(null), 2000);
  }

  function handleCsv() {
    if (csvRows && csvRows.length > 0) {
      exportToCsv(fname, csvRows);
      flash("csv");
    }
    setOpen(false);
  }

  function handleJson() {
    exportToJson(fname, jsonData ?? csvRows ?? []);
    flash("json");
    setOpen(false);
  }

  function handlePrint() {
    printSection(printSectionId, title);
    flash("print");
    setOpen(false);
  }

  if (compact) {
    return (
      <div className={cn("relative inline-block", className)}>
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 shadow-sm transition hover:border-cyan-400 hover:text-brand-navy"
        >
          <Download className="h-3.5 w-3.5" />
          Export
          <ChevronDown className={cn("h-3 w-3 transition-transform", open && "rotate-180")} />
        </button>

        {open && (
          <>
            <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
            <div className="absolute right-0 top-full z-40 mt-1.5 w-44 rounded-2xl border border-slate-200 bg-white py-1.5 shadow-xl animate-in fade-in">
              {csvRows && (
                <button
                  onClick={handleCsv}
                  className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  {exported === "csv" ? (
                    <Check className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
                  )}
                  {exported === "csv" ? "Downloaded!" : "Export CSV"}
                </button>
              )}
              <button
                onClick={handleJson}
                className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                {exported === "json" ? (
                  <Check className="h-4 w-4 text-emerald-500" />
                ) : (
                  <FileJson className="h-4 w-4 text-amber-600" />
                )}
                {exported === "json" ? "Downloaded!" : "Export JSON"}
              </button>
              <div className="mx-3 my-1 border-t border-slate-100" />
              <button
                onClick={handlePrint}
                className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                {exported === "print" ? (
                  <Check className="h-4 w-4 text-emerald-500" />
                ) : (
                  <Printer className="h-4 w-4 text-brand-blue" />
                )}
                {exported === "print" ? "Printing..." : "Print / PDF"}
              </button>
            </div>
          </>
        )}
      </div>
    );
  }

  // Full-width inline buttons
  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      {csvRows && (
        <button
          onClick={handleCsv}
          className="flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-800 transition hover:bg-emerald-100"
        >
          {exported === "csv" ? (
            <Check className="h-3.5 w-3.5" />
          ) : (
            <FileSpreadsheet className="h-3.5 w-3.5" />
          )}
          {exported === "csv" ? "Downloaded!" : "Export CSV"}
        </button>
      )}

      <button
        onClick={handleJson}
        className="flex items-center gap-1.5 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-bold text-amber-800 transition hover:bg-amber-100"
      >
        {exported === "json" ? (
          <Check className="h-3.5 w-3.5" />
        ) : (
          <FileJson className="h-3.5 w-3.5" />
        )}
        {exported === "json" ? "Downloaded!" : "Export JSON"}
      </button>

      <button
        onClick={handlePrint}
        className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 shadow-sm transition hover:border-cyan-400 hover:text-brand-navy"
      >
        {exported === "print" ? (
          <Check className="h-3.5 w-3.5 text-emerald-500" />
        ) : (
          <Printer className="h-3.5 w-3.5" />
        )}
        {exported === "print" ? "Sent to Printer" : "Print / PDF"}
      </button>
    </div>
  );
}
