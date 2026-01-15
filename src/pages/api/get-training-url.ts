// src/pages/api/get-training-url.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { getApps, initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getStorage } from "firebase-admin/storage";

// Initialize Firebase Admin using base64-encoded service account
if (!getApps().length) {
  const serviceAccountBase64 = process.env.FIREBASE_SERVICE_ACCOUNT;
  
  if (serviceAccountBase64) {
    try {
      const serviceAccount = JSON.parse(
        Buffer.from(serviceAccountBase64, "base64").toString("utf-8")
      );
      
      initializeApp({
        credential: cert(serviceAccount),
        storageBucket: "rewmoai.firebasestorage.app",
      });
    } catch (e) {
      console.error("[get-training-url] Failed to parse service account:", e);
    }
  }
}

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
    const auth = getAuth();
    await auth.verifyIdToken(token);

    const fileName = req.query.file as string;
    if (!fileName) {
      return res.status(400).json({ error: "File name required" });
    }

    const bucket = getStorage().bucket();
    const file = bucket.file(fileName);
    
    const [url] = await file.getSignedUrl({
      action: "read",
      expires: Date.now() + 60 * 60 * 1000,
    });

    return res.status(200).json({ url });
  } catch (err: any) {
    console.error("[get-training-url] error:", err?.message || err);
    return res.status(500).json({ error: "Failed to get download URL" });
  }
}