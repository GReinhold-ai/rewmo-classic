// src/pages/api/training/courses.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { getDb } from "@/lib/firebaseAdmin";
import fs from "fs";
import path from "path";

function readLocal(pathId: string) {
  try {
    const p = path.join(process.cwd(), "public", "training", `${pathId}.json`);
    if (!fs.existsSync(p)) return null;
    const j = JSON.parse(fs.readFileSync(p, "utf8"));
    return {
      path: j.path ?? { id: pathId, title: (j.title as string) ?? pathId },
      courses: j.courses ?? j.lessons ?? [],
    };
  } catch {
    return null;
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).end("Method Not Allowed");
  const pathId = String(req.query.path || "");
  const forceLocal = String(req.query.source || "") === "local";

  if (!pathId) return res.status(400).json({ path: null, courses: [] });

  // Prefer local if requested
  if (forceLocal) {
    const local = readLocal(pathId);
    return local ? res.json(local) : res.status(404).json({ path: null, courses: [] });
  }

  // Try Firestore
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
      const courses = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      return res.json({ path: { id: pathId, ...pathData }, courses });
    }
  } catch {
    // ignore and fall back
  }

  // Fallback local
  const local = readLocal(pathId);
  return local ? res.json(local) : res.status(404).json({ path: null, courses: [] });
}
