import type { NextApiRequest, NextApiResponse } from "next";
import { getDb } from "@/lib/firebaseAdmin";

/**
 * Reads "x-user-email" from headers (string or string[])
 * Returns null if missing/empty.
 */
function getUserEmail(req: NextApiRequest): string | null {
  const raw = req.headers["x-user-email"];
  const v = Array.isArray(raw) ? raw[0] : raw;
  const email = (v || "").toString().trim().toLowerCase();
  return email || null;
}

/**
 * We store per-user progress at:
 *   userProgress/{email}/courses/{courseId} => { status, percent, updatedAt }
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const db = getDb();
  const email = getUserEmail(req);

  // ── GET: return all progress (or a single course if ?courseId=) ─────────────
  if (req.method === "GET") {
    // If no email header, return empty so the UI can still render
    if (!email) return res.status(200).json({ progress: {}, user: null });

    const courseId = (req.query.courseId as string) || "";

    try {
      const userDoc = db.collection("userProgress").doc(email);
      if (courseId) {
        const snap = await userDoc.collection("courses").doc(courseId).get();
        const data = snap.exists ? snap.data() : null;
        return res.status(200).json({
          progress: data ? { [courseId]: data } : {},
          user: email,
        });
      } else {
        const col = await userDoc.collection("courses").get();
        const out: Record<string, any> = {};
        col.forEach((d) => (out[d.id] = d.data()));
        return res.status(200).json({ progress: out, user: email });
      }
    } catch (e: any) {
      return res.status(500).json({ error: e?.message || "Failed to read progress." });
    }
  }

  // ── POST: upsert progress for a course ──────────────────────────────────────
  if (req.method === "POST") {
    if (!email) {
      // Don’t fail the UI—just report unauthenticated so caller can fallback to localStorage
      return res.status(200).json({ ok: false, reason: "unauthenticated" });
    }

    let body: any = {};
    try {
      body = typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
    } catch {
      return res.status(400).json({ error: "Invalid JSON body." });
    }

    const courseId = (body.courseId || "").toString().trim();
    if (!courseId) return res.status(400).json({ error: "Missing courseId." });

    const status: string | undefined = body.status || undefined; // e.g., "completed" | "in_progress"
    const percent: number | undefined =
      typeof body.percent === "number"
        ? Math.max(0, Math.min(100, body.percent))
        : status === "completed"
        ? 100
        : undefined;

    const payload: Record<string, any> = {
      updatedAt: new Date().toISOString(),
    };
    if (status !== undefined) payload.status = status;
    if (percent !== undefined) payload.percent = percent;

    try {
      await db
        .collection("userProgress")
        .doc(email)
        .collection("courses")
        .doc(courseId)
        .set(payload, { merge: true });

      return res.status(200).json({ ok: true, courseId, ...payload });
    } catch (e: any) {
      return res.status(500).json({ error: e?.message || "Failed to write progress." });
    }
  }

  // Method Not Allowed
  res.setHeader("Allow", "GET, POST");
  return res.status(405).end("Method Not Allowed");
}
