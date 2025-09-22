// src/pages/api/download/rpm-module1.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { getAdminApp, getAdminDb } from "@/lib/firebaseAdmin";
import { getAuth } from "firebase-admin/auth";
import { getStorage } from "firebase-admin/storage";

const PRODUCT_ID = process.env.NEXT_PUBLIC_RPM_PRODUCT_ID || "rpm-fundamentals";
// If you prefer to read the path from Firestore courses/rpm-fundamentals, you can,
// but many teams hardcode it or pull from env:
const DEFAULT_STORAGE_PATH = "R-PM Fundamentals Module 1.pptx"; // matches your current root object

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
    if (!token) return res.status(401).json({ error: "Missing auth token" });

    getAdminApp(); // init Admin SDK
    const decoded = await getAuth().verifyIdToken(token);
    const uid = decoded.uid;

    // Check entitlement
    const db = getAdminDb();
    const entSnap = await db.doc(`entitlements/${uid}/products/${PRODUCT_ID}`).get();
    if (!entSnap.exists || !entSnap.data()?.active) {
      return res.status(403).json({ error: "No entitlement" });
    }

    // Build signed URL
    const bucketName =
      process.env.FIREBASE_STORAGE_BUCKET || process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!;
    const filePath = DEFAULT_STORAGE_PATH; // or read from Firestore `courses/rpm-fundamentals.storagePath`
    const bucket = getStorage().bucket(bucketName);
    const [url] = await bucket.file(filePath).getSignedUrl({
      action: "read",
      expires: Date.now() + 1000 * 60 * 5, // 5 min
      version: "v4",
      contentType:
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    });

    return res.status(200).json({ url });
  } catch (e: any) {
    console.error("[download rpm-module1] error:", e?.message || e);
    return res.status(500).json({ error: "Server error" });
  }
}
