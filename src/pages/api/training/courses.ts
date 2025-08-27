import type { NextApiRequest, NextApiResponse } from "next";
import { getDb } from "@/lib/firebaseAdmin";
import fs from "fs";
import path from "path";

/** Read local JSON and normalize to the shape the UI expects */
function readLocal(pathId: string) {
  try {
    const p = path.join(process.cwd(), "public", "training", `${pathId}.json`);
    if (!fs.existsSync(p)) return null;
    const raw = JSON.parse(fs.readFileSync(p, "utf8"));

    const pathMeta = raw.path ?? { id: pathId, title: raw.title ?? pathId };

    const courses = (raw.courses ?? raw.lessons ?? [])
      .map((c: any) => ({
        ...c,
        // normalize so UI can read either property
        summary: c.summary ?? c.description ?? "",
      }))
      .sort((a: any, b: any) => (a.order ?? 9999) - (b.order ?? 9999));

    return { path: pathMeta, courses };
  } catch {
    return null;
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).end("Method Not Allowed");

  const pathId = String(req.query.path || req.query.id || "");
  if (!pathId) return res.status(400).json({ path: null, courses: [] });

  // Try Firestore first
  try {
    const db = getDb();
    const doc = await db.collection("paths").doc(pathId).get();
    if (doc.exists) {
      const pathData = doc.data() || {};
      const snap = await db
        .collection("paths")
        .doc(pathId)
        .collection("courses")
        .orderBy("order", "asc")
        .get();

      const courses = snap.docs.map((d) => {
        const data = d.data() as any;
        return {
          id: d.id,
          ...data,
          summary: data.summary ?? data.description ?? "",
        };
      });

      return res.json({ path: { id: pathId, ...pathData }, courses });
    }
  } catch {
    // swallow and try local
  }

  // Fallback: local JSON
  const local = readLocal(pathId);
  if (local) return res.json(local);

  return res.status(404).json({ path: null, courses: [] });
}
