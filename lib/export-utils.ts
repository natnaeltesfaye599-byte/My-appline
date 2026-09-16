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
export function printSection(sectionId: string, title: string): void {
  const element = document.getElementById(sectionId);
  if (!element) {
    console.warn(`[MyUpline Export] Print target not found: #${sectionId}`);
    window.print();
    return;
  }

  const printStyles = `
    <style>
      @page { size: A4; margin: 16mm; }
      * { box-sizing: border-box; font-family: 'Segoe UI', Arial, sans-serif !important; }
      body { margin: 0; padding: 0; background: #fff; color: #111; }
      .print-header { display: flex; align-items: center; justify-content: space-between; border-bottom: 3px solid #00d4ff; padding-bottom: 10px; margin-bottom: 18px; }
      .print-logo { font-size: 22px; font-weight: 900; color: #0c1e3d; letter-spacing: -1px; }
      .print-logo span { color: #00d4ff; }
      .print-meta { font-size: 11px; color: #666; text-align: right; }
      .print-title { font-size: 18px; font-weight: 900; color: #0c1e3d; margin-bottom: 14px; }
      table { width: 100%; border-collapse: collapse; font-size: 11px; }
      th { background: #0c1e3d; color: #fff; padding: 7px 10px; text-align: left; font-weight: 700; font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px; }
      td { padding: 6px 10px; border-bottom: 1px solid #e5e7eb; vertical-align: top; }
      tr:nth-child(even) td { background: #f8fafc; }
      .badge { display: inline-block; padding: 2px 7px; border-radius: 99px; font-size: 9px; font-weight: 700; text-transform: uppercase; }
      .badge-green { background: #d1fae5; color: #065f46; }
      .badge-blue { background: #dbeafe; color: #1e3a8a; }
      .badge-amber { background: #fef3c7; color: #92400e; }
      .badge-rose { background: #ffe4e6; color: #9f1239; }
      .badge-cyan { background: #cffafe; color: #164e63; }
      .footer { margin-top: 20px; padding-top: 10px; border-top: 1px solid #e5e7eb; font-size: 9px; color: #999; text-align: center; }
      @media screen { body { display: none; } }
    </style>
  `;

  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const timeStr = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

  const printHeader = `
    <div class="print-header">
      <div class="print-logo">My<span>Upline</span> Global</div>
      <div class="print-meta">
        <div><strong>${title}</strong></div>
        <div>Generated: ${dateStr} at ${timeStr}</div>
        <div>MyUpline Management Platform v1.0</div>
      </div>
    </div>
    <div class="print-title">${title}</div>
  `;

  const printFooter = `
    <div class="footer">
      © ${now.getFullYear()} MyUpline Global. Confidential — For Internal Use Only. | Generated ${dateStr} at ${timeStr}
    </div>
  `;

  const printContent = element.innerHTML;

  const printWindow = window.open("", "_blank", "width=900,height=700");
  if (!printWindow) {
    alert("Pop-up blocked. Please allow pop-ups for this site to enable print.");
    return;
  }

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title} — MyUpline Global</title>
        ${printStyles}
      </head>
      <body>
        ${printHeader}
        ${printContent}
        ${printFooter}
        <script>
          window.onload = function() {
            window.print();
            setTimeout(() => window.close(), 800);
          };
        <\/script>
      </body>
    </html>
  `);
  printWindow.document.close();
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

export function exportDailyActivity(logs: Array<Record<string, unknown>>): void {
  const rows = logs.map((l) => ({
    Date: l.date,
    "Day Label": l.dayLabel,
    "Calling Time Target": (l.callingTime as any)?.target,
    "Calling Time Actual": (l.callingTime as any)?.actual,
    "Presentations Target": (l.presentationTime as any)?.target,
    "Presentations Actual": (l.presentationTime as any)?.actual,
    "Training Time Target": (l.trainingTime as any)?.target,
    "Training Time Actual": (l.trainingTime as any)?.actual,
    "Prospecting Target": (l.prospecting as any)?.target,
    "Prospecting Actual": (l.prospecting as any)?.actual,
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
