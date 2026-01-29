// src/pages/api/download/[fileId].ts
import type { NextApiRequest, NextApiResponse } from "next";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { initializeApp, getApps, cert } from "firebase-admin/app";

// Initialize Firebase Admin if not already initialized
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

const db = getFirestore();

// ===========================================
// FILE MAPPING - Maps fileId to Firebase Storage URLs
// ===========================================

const STORAGE_BASE = "https://firebasestorage.googleapis.com/v0/b/rewmoai.firebasestorage.app/o";

const storageUrl = (filename: string) =>
  `${STORAGE_BASE}/${encodeURIComponent(filename)}?alt=media`;

// FREE files - anyone logged in can download
const FREE_FILES: Record<string, string> = {
  "rpm-quiz": storageUrl("ProcessSync_Module1_LiteDeck 15Sept2025.pptx"),
  "rpm-free-1": storageUrl("R-PM Fundamentals Module 1.pptx"),
  "rpm-free-2": storageUrl("R-PM Fundamentals Module 2.pptx"),
  "rpm-free-3": storageUrl("R-PM_Fundamentals_Module_3.pptx"),
  "rpm-free-4": storageUrl("R-PM_Fundamentals_Module_4.pptx"),
  "rpm-free-5": storageUrl("R-PM_Fundamentals_Module_5.pptx"),
};

// PRO files - only PRO or BUSINESS tier can download
const PRO_FILES: Record<string, string> = {
  "rpm-pro-1": storageUrl("R-PM_Fundamentals_Module_1_Expanded.pptx"),
  "rpm-pro-2": storageUrl("R-PM_Fundamentals_Module_2_Expanded.pptx"),
  "rpm-pro-3": storageUrl("R-PM_Fundamentals_Module_3_Expanded.pptx"),
  "rpm-pro-4": storageUrl("R-PM_Fundamentals_Module_4_Expanded.pptx"),
  "rpm-pro-5": storageUrl("R-PM_Fundamentals_Module_5_Expanded.pptx"),
};

// ===========================================
// API HANDLER
// ===========================================

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { fileId } = req.query;

  if (!fileId || typeof fileId !== "string") {
    return res.status(400).json({ error: "Missing fileId" });
  }

  // Check if file exists in our mapping
  const isFreeFile = fileId in FREE_FILES;
  const isProFile = fileId in PRO_FILES;

  if (!isFreeFile && !isProFile) {
    return res.status(404).json({ error: "File not found" });
  }

  // Get the auth token from cookie or Authorization header
  const token =
    req.cookies.token ||
    req.headers.authorization?.replace("Bearer ", "") ||
    null;

  if (!token) {
    return res.status(401).json({ 
      error: "Authentication required",
      redirect: "/account?redirect=" + encodeURIComponent(req.url || "")
    });
  }

  try {
    // Verify the Firebase token
    const decodedToken = await getAuth().verifyIdToken(token);
    const uid = decodedToken.uid;

    // If it's a free file, allow download for any authenticated user
    if (isFreeFile) {
      const fileUrl = FREE_FILES[fileId];
      return res.redirect(302, fileUrl);
    }

    // For PRO files, check user's tier in Firestore
    const userDoc = await db.collection("users").doc(uid).get();
    
    if (!userDoc.exists) {
      return res.status(403).json({ 
        error: "User profile not found",
        redirect: "/account"
      });
    }

    const userData = userDoc.data();
    const userTier = userData?.tier || "FREE";

    // Check if user has PRO or BUSINESS tier
    if (userTier !== "PRO" && userTier !== "BUSINESS") {
      return res.status(403).json({ 
        error: "PRO subscription required",
        redirect: "/account/upgrade?plan=PRO"
      });
    }

    // User is PRO/BUSINESS, allow download
    const fileUrl = PRO_FILES[fileId];
    return res.redirect(302, fileUrl);

  } catch (error) {
    console.error("Download auth error:", error);
    return res.status(401).json({ 
      error: "Invalid or expired token",
      redirect: "/account"
    });
  }
}