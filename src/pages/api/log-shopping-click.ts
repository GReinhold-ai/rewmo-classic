// src/pages/api/log-shopping-click.ts
import type { NextApiRequest, NextApiResponse } from "next";

type Body = {
  url?: string;
  source?: string;
  sku?: string;
  userId?: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "Method Not Allowed" });
  }

  try {
    const body = (typeof req.body === "string" ? JSON.parse(req.body) : req.body) as Body;

    // TODO: write to your DB/analytics here if needed.
    // e.g. await db.collection("shoppingClicks").add({ ...body, ts: Date.now() });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("log-shopping-click error:", err);
    return res.status(400).json({ ok: false, error: "Invalid payload" });
  }
}
