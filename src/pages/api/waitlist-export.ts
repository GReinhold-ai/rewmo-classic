import type { NextApiRequest, NextApiResponse } from "next";
import { getAdminDb } from "./_firebaseAdmin"; // we created this earlier

// Small CSV escaper
function csvEscape(value: unknown): string {
  if (value === null || value === undefined) return "";
  const s = String(value);
  // Quote if it contains comma, quote, or newline
  if (/[",\n]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Simple admin gate: header OR ?key=... (header is preferred)
    const provided =
      (req.headers["x-admin-key"] as string) ||
      (req.query.key as string) ||
      "";

    if (!process.env.REWMO_ADMIN_KEY || provided !== process.env.REWMO_ADMIN_KEY) {
      return res.status(401).json({ ok: false, error: "Unauthorized" });
    }

    const db = getAdminDb();

    // Optional filters
    const limit = Math.min(Number(req.query.limit || 1000), 5000); // hard cap
    const sinceParam = req.query.since as string | undefined; // ISO date string
    const since = sinceParam ? new Date(sinceParam) : undefined;

    let q = db.collection("waitlist").orderBy("createdAt", "desc");
    if (since && !isNaN(since.getTime())) {
      // Firestore can't do inequality on serverTimestamp directly;
      // we'll filter after fetch to keep it simple.
    }

    // Fetch
    const snap = await q.limit(limit).get();

    type Row = {
      email: string;
      ref?: string | null;
      source?: string | null;
      ua?: string | null;
      createdAt?: any;
      updatedAt?: any;
      id: string; // doc id
    };

    let rows: Row[] = snap.docs.map((d) => {
      const data = d.data() || {};
      return {
        id: d.id,
        email: data.email ?? "",
        ref: data.ref ?? null,
        source: data.source ?? null,
        ua: data.ua ?? null,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      };
    });

    // Optional since filter after fetch (keeps code simple and index-free)
    if (since && !isNaN(since.getTime())) {
      rows = rows.filter((r) => {
        const ts = r.createdAt;
        const date =
          ts && typeof ts.toDate === "function"
            ? ts.toDate()
            : ts instanceof Date
            ? ts
            : null;
        return date ? date >= since : true;
      });
    }

    // Build CSV
    const header = [
      "email",
      "ref",
      "source",
      "ua",
      "createdAt_iso",
      "updatedAt_iso",
      "doc_id",
    ];

    const lines = [header.join(",")];

    for (const r of rows) {
      const created =
        r.createdAt && typeof r.createdAt.toDate === "function"
          ? r.createdAt.toDate().toISOString()
          : r.createdAt instanceof Date
          ? r.createdAt.toISOString()
          : "";

      const updated =
        r.updatedAt && typeof r.updatedAt.toDate === "function"
          ? r.updatedAt.toDate().toISOString()
          : r.updatedAt instanceof Date
          ? r.updatedAt.toISOString()
          : "";

      lines.push(
        [
          csvEscape(r.email),
          csvEscape(r.ref ?? ""),
          csvEscape(r.source ?? ""),
          csvEscape(r.ua ?? ""),
          csvEscape(created),
          csvEscape(updated),
          csvEscape(r.id),
        ].join(",")
      );
    }

    const csv = lines.join("\r\n");

    // Headers for download
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="waitlist-export_${new Date().toISOString().slice(0,19).replace(/[:T]/g,'-')}.csv"`
    );

    res.status(200).send(csv);
  } catch (e: any) {
    console.error("waitlist-export error:", e);
    res.status(500).json({ ok: false, error: "Server error" });
  }
}
