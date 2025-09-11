// src/pages/api/training/courses.ts
import type { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import { promises as fs } from "fs";

type Resp = { path: string; courses: any[] };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Resp>
) {
  // path can be string | string[] | undefined
  const rawParam = Array.isArray(req.query.path)
    ? req.query.path[0]
    : req.query.path;

  const raw = (rawParam ?? "").toString().toLowerCase();

  // synonyms/aliases → canonical slug
  const alias: Record<string, string> = {
    tqm: "rpm",
    "r-pm": "rpm",
    lean: "rpm",
    genai: "genai",
    finance: "finance",
  };

  // FIX: parenthesize to avoid mixing ?? and ||
  const slug = (alias[raw] ?? raw) || "rpm";

  try {
    const file = path.join(process.cwd(), "public", "training", `${slug}.json`);
    const json = await fs.readFile(file, "utf8");
    const data = JSON.parse(json);

    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate");
    return res.status(200).json({
      path: slug,
      courses: Array.isArray(data?.courses) ? data.courses : data ?? [],
    });
  } catch {
    // If file is missing, return empty list (keeps UI responsive)
    return res.status(200).json({ path: slug, courses: [] });
  }
}
