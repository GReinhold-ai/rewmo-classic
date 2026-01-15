// src/pages/api/get-training-url.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { getAdminAuth, getAdminStorage } from "@/lib/firebaseAdmin";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const adminAuth = getAdminAuth();
    await adminAuth.verifyIdToken(token);

    const fileName = req.query.file as string;
    if (!fileName) {
      return res.status(400).json({ error: "File name required" });
    }

    const storage = getAdminStorage();
    const bucket = storage.bucket();
    const file = bucket.file(fileName);

    const [url] = await file.getSignedUrl({
      action: "read",
      expires: Date.now() + 60 * 60 * 1000, // 1 hour
    });

    return res.status(200).json({ url });
  } catch (err: any) {
    console.error("[get-training-url] error:", err?.message || err);
    return res.status(500).json({ error: "Failed to get download URL" });
  }
}