import type { NextApiRequest, NextApiResponse } from "next";
import { getDb } from "@/lib/firebaseAdmin";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).end("Method Not Allowed");
  const db = getDb();

  // Option A: /api/training/courses?path=genai-foundations
  if (typeof req.query.path === "string") {
    const pathId = req.query.path;
    const pathDoc = await db.collection("paths").doc(pathId).get();
    if (!pathDoc.exists) return res.status(404).json({ error: "Path not found" });

    const ids: string[] = (pathDoc.data()?.modules || []) as string[];
    if (!ids.length) return res.json({ path: { id: pathDoc.id, ...pathDoc.data() }, courses: [] });

    const snaps = await db.getAll(...ids.map(id => db.collection("courses").doc(id)));
    const courses = snaps.filter(s => s.exists).map(s => ({ id: s.id, ...s.data() }));
    return res.json({ path: { id: pathDoc.id, ...pathDoc.data() }, courses });
  }

  // Option B: /api/training/courses?ids=a,b,c
  if (typeof req.query.ids === "string") {
    const ids = req.query.ids.split(",").map(s => s.trim()).filter(Boolean);
    if (!ids.length) return res.json({ courses: [] });

    const snaps = await db.getAll(...ids.map(id => db.collection("courses").doc(id)));
    const courses = snaps.filter(s => s.exists).map(s => ({ id: s.id, ...s.data() }));
    return res.json({ courses });
  }

  // Option C: list all
  const snap = await db.collection("courses").orderBy("moduleNo").get();
  const courses = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  return res.json({ courses });
}
