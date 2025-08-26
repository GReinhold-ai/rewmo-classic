// File: src/pages/api/training/courses.ts
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

/**
 * Final fallback: if TQM has no Firestore or local JSON, expose your PDF.
 * Add more tiles here if you want multiple sections (page anchors).
 */
function pdfFallback(pathId: string) {
  if (pathId !== "tqm") return null;

  const pdfPath = path.join(process.cwd(), "public", "rewmoai-module-1.pdf");
  if (!fs.existsSync(pdfPath)) return null;

  return {
    path: { id: "tqm", title: "TQM Training" },
    courses: [
      {
        id: "tqm-module-1",
        title: "RewmoAI Process Management — Module 1 (PDF)",
        summary: "Course overview & objectives.",
        href: "/rewmoai-module-1.pdf#page=1",
      },
      // You can add more tiles if desired, e.g. jump to later pages:
      // { id: "tqm-module-1-2", title: "Mission & Objectives", href: "/rewmoai-module-1.pdf#page=2" },
    ],
  };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).end("Method Not Allowed");
  const pathId = String(req.query.path || "").trim();

  // 1) Firestore (preferred)
  try {
    const db = getDb();
    const docSnap = await db.collection("paths").doc(pathId).get();
    if (docSnap.exists) {
      const pathData = docSnap.data() || {};
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
    // fall through to local/static
  }

  // 2) Local JSON (public/training/<pathId>.json)
  const local = readLocal(pathId);
  if (local) return res.json(local);

  // 3) PDF fallback for TQM
  const pdf = pdfFallback(pathId);
  if (pdf) return res.json(pdf);

  // 4) Nothing found
  return res.status(404).json({ path: null, courses: [] });
}
