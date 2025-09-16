import type { NextApiRequest, NextApiResponse } from "next";
import { getAdminDb } from "../_firebaseAdmin";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const db = getAdminDb();
    const { slug = "rpm-module1-foundations", path = "/training/rpm-module1-foundations.pptx" } =
      (req.body || {}) as { slug?: string; path?: string };

    await db.collection("events").add({
      type: "deck_download",
      slug,
      path,
      ua: req.headers["user-agent"] || null,
      ref: req.headers.referer || null,
      ts: new Date(),
    });

    res.status(200).json({ ok: true });
  } catch (e: any) {
    res.status(500).json({ ok: false, error: e?.message || "error" });
  }
}
