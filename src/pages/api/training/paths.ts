import type { NextApiRequest, NextApiResponse } from "next";
import { getDb } from "@/lib/firebaseAdmin";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).end("Method Not Allowed");
  const db = getDb();

  const snap = await db.collection("paths").get();
  const paths = snap.docs.map(d => ({ id: d.id, ...d.data() }));

  return res.json({ paths });
}
