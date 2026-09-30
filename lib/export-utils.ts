/**
 * MyUpline Global — Universal Export & Print Utilities
 * Supports: CSV, JSON, Print-to-PDF, Clipboard
 */

// ─────────────────────────────────────────────
// CSV EXPORT
// ─────────────────────────────────────────────
export function exportToCsv(filename: string, rows: Record<string, unknown>[]): void {
  if (!rows || rows.length === 0) return;

  const headers = Object.keys(rows[0]);
  const escapeCell = (val: unknown): string => {
    if (val === null || val === undefined) return "";
    const str = String(val).replace(/"/g, '""');
    return str.includes(",") || str.includes("\n") || str.includes('"') ? `"${str}"` : str;
  };

  const csvContent =
    headers.map(escapeCell).join(",") +
    "\n" +
    rows.map((row) => headers.map((h) => escapeCell(row[h])).join(",")).join("\n");

  triggerDownload(`${filename}.csv`, csvContent, "text/csv;charset=utf-8;");
}

// ─────────────────────────────────────────────
// JSON EXPORT
// ─────────────────────────────────────────────
export function exportToJson(filename: string, data: unknown): void {
  const jsonContent = JSON.stringify(data, null, 2);
  triggerDownload(`${filename}.json`, jsonContent, "application/json");
}

// ─────────────────────────────────────────────
// TRIGGER BROWSER DOWNLOAD
// ─────────────────────────────────────────────
function triggerDownload(filename: string, content: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ─────────────────────────────────────────────
// PRINT SECTION (Print a named div to PDF)
// ─────────────────────────────────────────────
// ─────────────────────────────────────────────
// PRINT SECTION (Print a named div/element cleanly)
// ─────────────────────────────────────────────
export function printSection(sectionId: string, title?: string): void {
  if (typeof window === "undefined" || typeof document === "undefined") return;

  const element = document.getElementById(sectionId);
  if (!element) {
    console.warn(`[MyUpline Export] Print target not found: #${sectionId}, printing main view`);
    const fallback = document.getElementById("main-view-content") || document.getElementById("main-content");
    if (fallback) {
      triggerDirectPrint(fallback, title || "MyUpline Report");
    } else {
      window.print();
    }
    return;
  }

  triggerDirectPrint(element, title || "MyUpline Report");
}

function triggerDirectPrint(target: HTMLElement, title: string): void {
  const body = document.body;
  const prevTitle = document.title;
  if (title) {
    document.title = `${title} — MyUpline Global`;
  }

  // Inject a clean official print letterhead if not already present
  let printHeader = target.querySelector<HTMLElement>(".myupline-runtime-print-header");
  let createdHeader = false;
  if (!printHeader) {
    printHeader = document.createElement("div");
    printHeader.className = "myupline-runtime-print-header print-only mb-6 border-b-2 border-slate-900 pb-3";
    const now = new Date();
    const dateStr = now.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
    const timeStr = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
    printHeader.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: flex-end; border-bottom: 2px solid #0c1e3d; padding-bottom: 8px; margin-bottom: 16px;">
        <div>
          <div style="font-size: 20px; font-weight: 900; color: #0c1e3d; letter-spacing: -0.5px;">MyUpline Global</div>
          <div style="font-size: 11px; color: #64748b; font-weight: 600;">Executive Network Management Platform</div>
        </div>
        <div style="text-align: right; font-size: 10px; color: #475569;">
          <div style="font-weight: 800; font-size: 13px; color: #0c1e3d;">${title}</div>
          <div>Printed: ${dateStr} at ${timeStr}</div>
          <div>Status: Verified Official Record</div>
        </div>
      </div>
    `;
    target.prepend(printHeader);
    createdHeader = true;
  }

  // Mark body and target with printing classes
  body.classList.add("myupline-printing-active");
  target.classList.add("myupline-print-target");

  const cleanup = () => {
    body.classList.remove("myupline-printing-active");
    target.classList.remove("myupline-print-target");
    if (createdHeader && printHeader && printHeader.parentNode) {
      printHeader.parentNode.removeChild(printHeader);
    }
    document.title = prevTitle;
    window.removeEventListener("afterprint", cleanup);
  };

  window.addEventListener("afterprint", cleanup);

  // Trigger print dialog
  try {
    window.print();
  } catch (err) {
    console.error("[MyUpline Export] Print execution error:", err);
  }

  // Fallback safety cleanup after 2.5s
  setTimeout(cleanup, 2500);
}

// ─────────────────────────────────────────────
// COPY TO CLIPBOARD
// ─────────────────────────────────────────────
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for older browsers
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    const success = document.execCommand("copy");
    document.body.removeChild(textarea);
    return success;
  }
}

// ─────────────────────────────────────────────
// SPECIFIC ENTITY EXPORT HELPERS
// ─────────────────────────────────────────────

export function exportNameList(contacts: Array<Record<string, unknown>>): void {
  const rows = contacts.map((c) => ({
    "Full Name": c.name,
    Phone: c.phone,
    Stage: c.stage,
    "Hot / Warm / Cold": c.temperature,
    Category: c.category,
    "Follow-Up Date": c.nextFollowUp,
    "Last Action": c.lastAction,
    Notes: c.notes
  }));
  exportToCsv(`MyUpline_NameList_${dateSuffix()}`, rows);
}

export function exportDownlineContacts(contacts: Array<Record<string, unknown>>): void {
  const rows = contacts.map((c) => ({
    "Full Name": c.name,
    Phone: c.phone,
    Email: c.email,
    Level: c.level,
    Package: c.package,
    Rank: c.rank,
    Status: c.status,
    "Join Date": c.joinDate,
    "Personal Volume (PV)": c.pv,
    Location: c.location
  }));
  exportToCsv(`MyUpline_Downline_${dateSuffix()}`, rows);
}

type TargetActualMetric = { target?: number | string; actual?: number | string };

export function exportDailyActivity(logs: Array<Record<string, unknown>>): void {
  const rows = logs.map((l) => ({
    Date: l.date,
    "Day Label": l.dayLabel,
    "Calling Time Target": (l.callingTime as TargetActualMetric | undefined)?.target,
    "Calling Time Actual": (l.callingTime as TargetActualMetric | undefined)?.actual,
    "Presentations Target": (l.presentationTime as TargetActualMetric | undefined)?.target,
    "Presentations Actual": (l.presentationTime as TargetActualMetric | undefined)?.actual,
    "Training Time Target": (l.trainingTime as TargetActualMetric | undefined)?.target,
    "Training Time Actual": (l.trainingTime as TargetActualMetric | undefined)?.actual,
    "Prospecting Target": (l.prospecting as TargetActualMetric | undefined)?.target,
    "Prospecting Actual": (l.prospecting as TargetActualMetric | undefined)?.actual,
    Reflection: l.reflection
  }));
  exportToCsv(`MyUpline_DailyKPI_${dateSuffix()}`, rows);
}

export function exportPaymentRecords(payments: Array<Record<string, unknown>>): void {
  const rows = payments.map((p) => ({
    "Payment ID": p.id,
    "User Name": p.userName,
    "User Phone": p.userPhone,
    "User Email": p.userEmail,
    Package: p.packageName,
    "Amount (ETB)": p.amountETB,
    "Payment Method": p.paymentMethod,
    "Transaction Ref": p.transactionRef,
    Status: p.status,
    "Admin Notes": p.adminNotes,
    "Verified By": p.verifiedBy,
    "Verified At": p.verifiedAt,
    "Submitted At": p.createdAt
  }));
  exportToCsv(`MyUpline_PaymentVerification_${dateSuffix()}`, rows);
}

export function exportPackages(packages: Array<Record<string, unknown>>): void {
  const rows = packages.map((p) => ({
    "Package ID": p.id,
    Name: p.name,
    "Price (ETB)": p.priceETB,
    "PV Points": p.pv,
    Badge: p.badge,
    Description: p.description,
    Features: Array.isArray(p.features) ? (p.features as string[]).join(" | ") : "",
    Active: p.isActive ? "Yes" : "No"
  }));
  exportToCsv(`MyUpline_Packages_${dateSuffix()}`, rows);
}

export function exportTrainings(trainings: Array<Record<string, unknown>>): void {
  const rows = trainings.map((t) => ({
    "Course ID": t.id,
    Title: t.title,
    Level: t.level,
    Category: t.category,
    "Duration (min)": t.durationMinutes,
    Format: t.format,
    "Assigned Trainer": t.trainerName,
    "Trainer Phone": t.trainerPhone,
    "Cohort Time": t.cohortStartTime,
    "Enrolled Count": t.enrolledCount,
    "Material Count": Array.isArray(t.materials) ? (t.materials as unknown[]).length : 0,
    Active: t.isActive ? "Yes" : "No"
  }));
  exportToCsv(`MyUpline_TrainingCourses_${dateSuffix()}`, rows);
}

export function exportTrainers(trainers: Array<Record<string, unknown>>): void {
  const rows = trainers.map((t) => ({
    "Trainer ID": t.id,
    Name: t.name,
    Email: t.email,
    Phone: t.phone,
    Specialization: t.specialization,
    Rating: t.rating,
    "Assigned Courses": t.assignedCoursesCount,
    Active: t.isActive ? "Yes" : "No"
  }));
  exportToCsv(`MyUpline_FacultyTrainers_${dateSuffix()}`, rows);
}

export function exportRecruitmentPipeline(prospects: Array<Record<string, unknown>>): void {
  const rows = prospects.map((p) => ({
    Name: p.name,
    Phone: p.phone,
    Stage: p.stage,
    "Presentation Duration (min)": p.presentationDuration,
    "Follow-Up Count": p.followUpCount,
    Notes: p.notes,
    "Added Date": p.addedDate
  }));
  exportToCsv(`MyUpline_RecruitmentPipeline_${dateSuffix()}`, rows);
}

export function exportAfterSalesOnboarding(members: Array<Record<string, unknown>>): void {
  const rows = members.map((m) => ({
    Name: m.name,
    Phone: m.phone,
    Package: m.package,
    "Onboarding Step": m.onboardingStep,
    "NBO Completed": m.nboCompleted ? "Yes" : "No",
    "Basic Training": m.basicTraining ? "Yes" : "No",
    "Advanced Training": m.advancedTraining ? "Yes" : "No",
    Notes: m.notes,
    "Join Date": m.joinDate
  }));
  exportToCsv(`MyUpline_AfterSalesOnboarding_${dateSuffix()}`, rows);
}

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────
function dateSuffix(): string {
  const now = new Date();
  return `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;
}
