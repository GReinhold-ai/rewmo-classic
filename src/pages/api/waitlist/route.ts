import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/serverAdmin";
import { FieldValue } from "firebase-admin/firestore";

const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

function getClientIp(req: Request) {
  const xf = req.headers.get("x-forwarded-for");
  if (xf) return xf.split(",")[0].trim();
  return "";
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    route: "waitlist",
    hint: "POST { email, source? } to join the waitlist",
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const email = String(body?.email || "").trim();
    const source = body?.source ? String(body.source) : null;

    if (!email || !isEmail(email)) {
      return NextResponse.json({ error: "Please enter a valid email." }, { status: 400 });
    }

    const db = getAdminDb();
    const id = email.toLowerCase();
    const ref = db.collection("waitlist").doc(id);

    await ref.set(
      {
        email: id,
        source,
        userAgent: req.headers.get("user-agent") || null,
        referer: req.headers.get("referer") || null,
        ip: getClientIp(req) || null,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("[waitlist] error:", err?.message || err);
    return NextResponse.json({ error: "Server error. Please try again." }, { status: 500 });
  }
}
