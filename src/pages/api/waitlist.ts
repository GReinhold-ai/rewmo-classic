import type { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";
import * as admin from "firebase-admin";            // ← add this
import { getAdminDb } from "./_firebaseAdmin";
import { sendEmail } from "@/lib/email";

const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    const db = getAdminDb();

    // normalize email hard (strip stray quotes/spaces)
    const email = String(req.body.email || "")
      .trim()
      .replace(/^["']+|["']+$/g, "")               // ← remove accidental quotes
      .toLowerCase();

    const ref = String(req.body.ref || "").trim() || null;
    const honey = String(req.body.company || "");   // honeypot

    if (honey) return res.status(200).json({ ok: true });
    if (!isEmail(email)) return res.status(400).json({ ok: false, error: "Invalid email" });

    // simple IP rate limit (1/min)
    const ip = (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim()
      || req.socket.remoteAddress
      || "unknown";
    const ipHash = crypto.createHash("sha256").update(ip).digest("hex");
    const rlRef = db.collection("waitlist_ip").doc(ipHash);
    const rlSnap = await rlRef.get();
    const now = Date.now();

    if (rlSnap.exists) {
      const last = rlSnap.get("last") as number;
      if (last && now - last < 60_000) {
        return res.status(429).json({ ok: false, error: "Too many requests. Please wait a minute and try again." });
      }
    }
    await rlRef.set({ last: now }, { merge: true });

    // upsert by email (idempotent) with server timestamps
    const id = crypto.createHash("sha1").update(email).digest("hex");
    const ts = admin.firestore.FieldValue.serverTimestamp();
    const refDoc = db.collection("waitlist").doc(id);
    await refDoc.set(
      {
        email,
        ref: ref || null,
        createdAt: ts,
        updatedAt: ts,
        source: req.body.source || "home_cta",
        ua: req.headers["user-agent"] || null,
      },
      { merge: true }
    );

    // fire-and-forget transactional welcome email
    try {
      await sendEmail({
        to: email,
        subject: "Welcome to RewmoAI — you're on the list",
        html: `
          <p>Hi!</p>
          <p>Thanks for joining the RewmoAI free tier waitlist. We'll keep you posted.</p>
          ${ref ? `<p>Referrer code: <b>${ref}</b></p>` : ""}
          <p>— RewmoAI</p>
        `.trim(),
      });
    } catch {}

    return res.status(200).json({ ok: true });
  } catch (e: any) {
    console.error("waitlist error:", e);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
}
