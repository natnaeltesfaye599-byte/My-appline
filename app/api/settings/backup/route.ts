import { NextResponse } from "next/server";
import { dbStore } from "@/lib/db-store";

// GET /api/settings/backup -> Returns full JSON database snapshot
export async function GET() {
  try {
    const db = dbStore.getDb();
    const cleanDb = {
      ...db,
      users: db.users.map((u) => ({
        ...u,
        passwordHash: "[PROTECTED]"
      }))
    };

    const filename = `myupline_backup_${new Date().toISOString().replace(/[:.]/g, "-")}.json`;

    return new NextResponse(JSON.stringify(cleanDb, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="${filename}"`
      }
    });
  } catch (err) {
    console.error("[GET /api/settings/backup]", err);
    return NextResponse.json({ error: { message: "Failed to generate database backup" } }, { status: 500 });
  }
}
