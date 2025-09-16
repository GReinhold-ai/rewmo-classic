import type { NextApiRequest, NextApiResponse } from "next";
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { getMembershipSnapshot } from "@/lib/server/membership";

const {
  UNICORN_ORIGIN = "",
  FB_ADMIN_PROJECT_ID,
  FB_ADMIN_CLIENT_EMAIL,
  FB_ADMIN_PRIVATE_KEY,
} = process.env;

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: FB_ADMIN_PROJECT_ID,
      clientEmail: FB_ADMIN_CLIENT_EMAIL,
      privateKey: (FB_ADMIN_PRIVATE_KEY || "").replace(/\\n/g, "\n"),
    }),
  });
}
const adminAuth = getAuth();
const db = getFirestore();

/* ---- CORS helpers ---- */
function normalizeOrigin(s: string) {
  return s.trim().replace(/\/+$/, "");
}
const ALLOWED = new Set(
  UNICORN_ORIGIN.split(",").map(s => s.trim()).filter(Boolean).map(normalizeOrigin)
);
// Allow shorthand localhost entries by adding http/https variants
for (const o of Array.from(ALLOWED)) {
  if (!/^http/.test(o)) {
    ALLOWED.add(`http://${o}`);
    ALLOWED.add(`https://${o}`);
  }
}
function isAllowedOrigin(origin?: string | null) {
  return !!origin && ALLOWED.has(normalizeOrigin(origin));
}
function setCors(res: NextApiResponse, origin?: string | null) {
  if (origin && isAllowedOrigin(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
  }
  res.setHeader("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type");
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const origin = req.headers.origin as string | undefined;
  setCors(res, origin);
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");

  if (req.method === "OPTIONS") {
    if (!isAllowedOrigin(origin)) return res.status(400).end();
    return res.status(204).end();
  }
  if (req.method === "HEAD") {
    if (!isAllowedOrigin(origin)) return res.status(403).end();
    return res.status(200).end();
  }
  if (req.method !== "GET") return res.status(405).json({ error: "Method Not Allowed" });
  if (!isAllowedOrigin(origin)) return res.status(403).json({ error: "Origin not allowed" });

  try {
    const authz = req.headers.authorization || "";
    const token = authz.startsWith("Bearer ") ? authz.slice(7) : null;
    if (!token) {
      res.setHeader('WWW-Authenticate', 'Bearer realm="status", error="invalid_token"');
      return res.status(401).json({ error: "Sign-in required" });
    }

    const decoded = await adminAuth.verifyIdToken(token);
    const email = decoded.email;
    if (!email) return res.status(400).json({ error: "No email on token" });

    const snap = await getMembershipSnapshot(db, email);
    return res.status(200).json(snap);
  } catch (err: any) {
    console.error("[status] error:", err?.message || err);
    return res.status(500).json({ error: "Server error" });
  }
}
