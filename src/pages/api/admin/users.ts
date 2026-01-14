// File: src/pages/api/admin/users.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { getAdminDb } from "../_firebaseAdmin"; // server-only helper (firebase-admin)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const db = getAdminDb();
    const snap = await db.collection("users").limit(200).get();

    const users = snap.docs.map(d => {
      const data = d.data() as { email?: string };
      return { id: d.id, email: data.email ?? d.id };
    });

    return res.status(200).json({ users });
  } catch (err: any) {
    console.error("[api/admin/users] error:", err?.message || err);
    return res.status(500).json({ error: "Failed to fetch users" });
  }
}
