// src/pages/leanai/fundamentals.tsx
import { useEffect, useMemo, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "@/lib/firebaseClient";

const ENTITLEMENT_KEY = "leanai.fundamentals";
const FILE_NAME = "R-PM Fundamentals Module 1.pptx";

export default function FundamentalsPage() {
  const router = useRouter();
  const [uid, setUid] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);

  const [checking, setChecking] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  const [startingCheckout, setStartingCheckout] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  // Watch auth
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUid(u?.uid ?? null);
      setEmail(u?.email ?? null);
    });
    return () => unsub();
  }, []);

  // Live subscribe to entitlements for this user
  useEffect(() => {
    if (!uid) {
      setHasAccess(false);
      setChecking(false);
      return;
    }
    const userRef = doc(db, "users", uid);
    const unsub = onSnapshot(
      userRef,
      (snap) => {
        const ents = (snap.exists() && Array.isArray(snap.get("entitlements")))
          ? (snap.get("entitlements") as string[])
          : [];
        setHasAccess(ents.includes(ENTITLEMENT_KEY));
        setChecking(false);
      },
      (err) => {
        console.error("[fundamentals] onSnapshot error:", err);
        setError("Could not read your membership. Please refresh or contact support.");
        setChecking(false);
      }
    );
    return () => unsub();
  }, [uid]);

  // When access is available, get signed URL from our API (bypasses CORS)
  useEffect(() => {
    let cancelled = false;

    async function run() {
      if (!hasAccess || !uid) {
        setDownloadUrl(null);
        return;
      }
      try {
        const token = await auth.currentUser?.getIdToken();
        if (!token) {
          throw new Error("Not authenticated");
        }
        
        const response = await fetch(
          `/api/get-training-url?file=${encodeURIComponent(FILE_NAME)}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        
        if (!response.ok) {
          const data = await response.json().catch(() => ({}));
          throw new Error(data?.error || "Failed to get URL");
        }
        
        const data = await response.json();
        if (!cancelled && data.url) {
          setDownloadUrl(data.url);
        }
      } catch (e: any) {
        console.error("[fundamentals] getDownloadURL failed:", e?.message || e);
        if (!cancelled) {
          setDownloadUrl(null);
          setError("Could not resolve the training file. If this persists, contact support.");
        }
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [hasAccess, uid]);

  // Start Stripe Checkout for this module
  const startCheckout = async () => {
    setError(null);
    if (!uid || !email) {
      setError("Please sign in first.");
      return;
    }
    setStartingCheckout(true);
    try {
      const r = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid, email }),
      });
      if (!r.ok) {
        const j = await r.json().catch(() => ({}));
        setError(j?.error || "Unable to start checkout.");
        setStartingCheckout(false);
        return;
      }
      const j = (await r.json()) as { url?: string };
      if (j?.url) {
        window.location.href = j.url;
      } else {
        setError("Stripe did not return a checkout URL.");
        setStartingCheckout(false);
      }
    } catch (e: any) {
      setError(e?.message || "Network error starting checkout.");
      setStartingCheckout(false);
    }
  };

  const success = useMemo(() => router.query.success === "1", [router.query.success]);

  return (
    <>
      <Head>
        <title>LeanAI Lab — R-PM Fundamentals</title>
        <meta name="description" content="Unlock R-PM Fundamentals Module 1 (LeanAI Lab)." />
      </Head>

      <main className="min-h-[70vh] bg-[#002930] text-white">
        <div className="mx-auto max-w-3xl px-5 py-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#FF9151]">
            R-PM Fundamentals — Module 1
          </h1>
          <p className="mt-2 text-white/80">
            Part of the <span className="text-teal-300 font-semibold">LeanAI Lab</span>. This module is available to
            members with Fundamentals access.
          </p>

          {/* Success banner (from Checkout redirect) */}
          {success && (
            <div className="mt-4 rounded-lg border border-emerald-500/40 bg-emerald-500/10 p-3 text-emerald-200">
              Payment received. Finalizing your access&hellip; this page will update automatically.
            </div>
          )}

          {/* Error banner */}
          {error && (
            <div className="mt-4 rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-red-200">
              {error}
            </div>
          )}

          {/* Not signed in */}
          {!uid && (
            <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-5">
              <p className="text-white/85">Please sign in to continue.</p>
              <div className="mt-3">
                <Link
                  href="/login"
                  className="inline-flex items-center rounded-lg bg-[#FF9151] px-4 py-2 font-bold text-[#062025] hover:bg-[#FFA36C]"
                >
                  Sign in
                </Link>
              </div>
            </div>
          )}

          {/* Signed in, checking entitlements */}
          {uid && checking && (
            <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-5">
              Checking your access&hellip;
            </div>
          )}

          {/* No access yet: upsell + button */}
          {uid && !checking && !hasAccess && (
            <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-5">
              <h2 className="text-xl font-semibold text-teal-300">Unlock Fundamentals</h2>
              <p className="mt-2 text-white/80">
                Subscribe to access R-PM Fundamentals and future advanced modules. Your access updates instantly after
                checkout.
              </p>
              <button
                onClick={startCheckout}
                disabled={startingCheckout}
                className="mt-4 inline-flex items-center rounded-lg bg-[#FF9151] px-5 py-2.5 font-extrabold text-[#062025] hover:bg-[#FFA36C] disabled:opacity-60"
              >
                {startingCheckout ? "Starting checkout…" : "Unlock access"}
              </button>
              <p className="mt-2 text-xs text-white/60">
                You'll be redirected to Stripe. After payment you'll return here automatically.
              </p>
            </div>
          )}

          {/* Access granted: show download/open */}
          {uid && !checking && hasAccess && (
            <div className="mt-8 rounded-xl border border-teal-500/40 bg-teal-500/10 p-5">
              <h2 className="text-xl font-semibold text-teal-300">You have access ✅</h2>
              <p className="mt-2 text-white/85">
                Click below to open <strong>R-PM Fundamentals — Module 1</strong>.
              </p>

              {downloadUrl ? (
                
                  href={downloadUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex items-center rounded-lg bg-white/95 px-5 py-2.5 font-bold text-[#062025] hover:bg-white"
                >
                  Open the PPTX
                </a>
              ) : (
                <p className="mt-4 text-white/75">Preparing your file&hellip;</p>
              )}

              <div className="mt-6">
                <Link href="/lean-lab" className="text-teal-300 underline underline-offset-2 hover:opacity-90">
                  ← Back to LeanAI Lab
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}