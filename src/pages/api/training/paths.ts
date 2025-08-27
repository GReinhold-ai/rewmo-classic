import type { NextApiRequest, NextApiResponse } from "next";
import { getDb } from "@/lib/firebaseAdmin";
import fs from "fs";
import path from "path";

type PathItem = { id: string; title: string };

function readLocalPaths(): PathItem[] {
  try {
    const dir = path.join(process.cwd(), "public", "training");
    if (!fs.existsSync(dir)) return [];
    return fs
      .readdirSync(dir)
      .filter((f) => f.endsWith(".json"))
      .map((f) => {
        const j = JSON.parse(fs.readFileSync(path.join(dir, f), "utf8"));
        const id = j?.path?.id || path.basename(f, ".json");
        const title = j?.path?.title || id;
        return { id, title };
      })
      .filter((p) => !!p.id);
  } catch {
    return [];
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).end("Method Not Allowed");

  const local = readLocalPaths();

  try {
    const db = getDb();
    const snap = await db.collection("paths").get();
    const fromDb: PathItem[] = snap.docs.map((d) => {
      const data = d.data() || {};
      return { id: d.id, title: data.title || d.id };
    });

    const dict = new Map<string, PathItem>();
    for (const p of local) dict.set(p.id, p);
    for (const p of fromDb) dict.set(p.id, p); // DB wins on title
    const paths = Array.from(dict.values()).sort((a, b) => a.title.localeCompare(b.title));

    return res.json({ paths });
  } catch {
    // no Firestore? just return local
    return res.json({ paths: local.sort((a, b) => a.title.localeCompare(b.title)) });
  }
}
