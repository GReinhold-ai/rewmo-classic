// src/pages/api/get-training-url.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { getApps, initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getStorage } from "firebase-admin/storage";

const { FB_ADMIN_PROJECT_ID, FB_ADMIN_CLIENT_EMAIL, FB_ADMIN_PRIVATE_KEY } = process.env;

// Initialize Firebase Admin
if (!getApps().length && FB_ADMIN_PROJECT_ID && FB_ADMIN_CLIENT_EMAIL && FB_ADMIN_PRIVATE_KEY) {
  initializeApp({
    credential: cert({
      projectId: FB_ADMIN_PROJECT_ID,
      clientEmail: FB_ADMIN_CLIENT_EMAIL,
      privateKey: FB_ADMIN_PRIVATE_KEY.replace(/\\n/g, "\n"),
    }),
    storageBucket: "rewmoai.firebasestorage.app",
  });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Verify auth token
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
  
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const auth = getAuth();
    await auth.verifyIdToken(token);

    const fileName = req.query.file as string;
    if (!fileName) {
      return res.status(400).json({ error: "File name required" });
    }

    const bucket = getStorage().bucket();
    const file = bucket.file(fileName);
    
    // Generate a signed URL valid for 1 hour
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