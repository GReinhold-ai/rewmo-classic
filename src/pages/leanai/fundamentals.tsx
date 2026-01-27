// src/pages/leanai/fundamentals.tsx
import { useEffect, useMemo, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "@/lib/firebaseClient";

const ENTITLEMENT_KEY = "leanai.fundamentals";

// Module definitions
const MODULES = [
  {
    id: 1,
    title: "Module 1: Quality Approach",
    fileName: "R-PM Fundamentals Module 1.pptx",
    description: "The mindset and core language of R-PM. Learn how workflows connect to the qualities customers value.",
    slides: 27,
    available: true,
  },
  {
    id: 2,
    title: "Module 2: Quality Improvement Teams",
    fileName: "R-PM Fundamentals Module 2.pptx",
    description: "Team structure for continuous improvement. Leadership Council, QMB, PAT, and support roles.",
    slides: 19,
    available: true,
  },
  {
    id: 3,
    title: "Module 3: System of Profound Knowledge",
    fileName: "R-PM Fundamentals Module 3.pptx",
    description: "Dr. Deming's four pillars: Systems, Psychology, Variation, and Knowledge.",
    slides: null,
    available: true,
  },
  {
    id: 4,
    title: "Module 4: The Fourteen Points",
    fileName: "R-PM Fundamentals Module 4.pptx",
    description: "Deming's management principles adapted for small businesses and individuals.",
    slides: null,
    available: true,
  },
  {
    id: 5,
    title: "Module 5: Process Improvement Tools",
    fileName: "R-PM Fundamentals Module 5.pptx",
    description: "Hands-on tools for the Plan-Do-Check-Act (PDCA) cycle.",
    slides: null,
    available: true,
  },
];

export default function FundamentalsPage() {
  const router = useRouter();
  const [uid, setUid] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);

  const [checking, setChecking] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  const [startingCheckout, setStartingCheckout] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Track download URLs for each module
  const [downloadUrls, setDownloadUrls] = useState<Record<number, string | null>>({});
  const [loadingUrls, setLoadingUrls] = useState<Record<number, boolean>>({});

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

  // Function to get download URL for a specific module
  const getModuleUrl = async (moduleId: number, fileName: string) => {
    if (!hasAccess || !uid) return;
    
    setLoadingUrls(prev => ({ ...prev, [moduleId]: true }));
    
    try {
      const token = await auth.currentUser?.getIdToken();
      if (!token) {
        throw new Error("Not authenticated");
      }
      
      const response = await fetch(
        `/api/get-training-url?file=${encodeURIComponent(fileName)}`,
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
      if (data.url) {
        setDownloadUrls(prev => ({ ...prev, [moduleId]: data.url }));
      }
    } catch (e: any) {
      console.error(`[fundamentals] getDownloadURL failed for module ${moduleId}:`, e?.message || e);
      setError("Could not resolve the training file. If this persists, contact support.");
    } finally {
      setLoadingUrls(prev => ({ ...prev, [moduleId]: false }));
    }
  };

  // Load URLs for available modules when access is granted
  useEffect(() => {
    if (!hasAccess || !uid) {
      setDownloadUrls({});
      return;
    }

    // Get URLs for all available modules
    MODULES.filter(m => m.available).forEach(m => {
      getModuleUrl(m.id, m.fileName);
    });
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
        <meta name="description" content="Unlock R-PM Fundamentals course modules (LeanAI Lab)." />
      </Head>

      <main className="min-h-[70vh] bg-[#002930] text-white">
        <div className="mx-auto max-w-4xl px-5 py-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#FF9151]">
            R-PM Fundamentals
          </h1>
          <p className="mt-2 text-white/80">
            Part of the <span className="text-teal-300 font-semibold">LeanAI Lab</span>. 
            Complete course on RewmoAI Process Management for individuals and small businesses.
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
              <h2 className="text-xl font-semibold text-teal-300">Unlock R-PM Fundamentals</h2>
              <p className="mt-2 text-white/80">
                Get access to all available R-PM Fundamentals modules plus future updates. 
                Your access activates instantly after checkout.
              </p>
              <div className="mt-4 text-sm text-white/70">
                <p className="font-semibold text-teal-300 mb-2">Included:</p>
                <ul className="space-y-1">
                  {MODULES.map(m => (
                    <li key={m.id} className="flex items-center gap-2">
                      {m.available ? (
                        <span className="text-emerald-400">✓</span>
                      ) : (
                        <span className="text-white/40">○</span>
                      )}
                      <span className={m.available ? "text-white/90" : "text-white/50"}>
                        {m.title}
                        {!m.available && <span className="text-xs ml-2">(coming soon)</span>}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <button
                onClick={startCheckout}
                disabled={startingCheckout}
                className="mt-6 inline-flex items-center rounded-lg bg-[#FF9151] px-5 py-2.5 font-extrabold text-[#062025] hover:bg-[#FFA36C] disabled:opacity-60"
              >
                {startingCheckout ? "Starting checkout…" : "Unlock Full Course"}
              </button>
              <p className="mt-2 text-xs text-white/60">
                You'll be redirected to Stripe. After payment you'll return here automatically.
              </p>
            </div>
          )}

          {/* Access granted: show all modules */}
          {uid && !checking && hasAccess && (
            <div className="mt-8 space-y-4">
              <div className="rounded-xl border border-teal-500/40 bg-teal-500/10 p-4 mb-6">
                <h2 className="text-xl font-semibold text-teal-300">You have access ✅</h2>
                <p className="mt-1 text-white/85 text-sm">
                  Download your course modules below. New modules will appear here as they're released.
                </p>
              </div>

              {/* Module Cards */}
              <div className="grid gap-4">
                {MODULES.map((module) => (
                  <div
                    key={module.id}
                    className={`rounded-xl border p-5 ${
                      module.available
                        ? "border-teal-500/40 bg-[#072b33]"
                        : "border-white/10 bg-white/5 opacity-60"
                    }`}
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-bold text-[#FF9151]">{module.title}</h3>
                          {module.available && module.id === 2 && (
                            <span className="bg-teal-500 text-[#003B49] text-xs font-bold px-2 py-0.5 rounded-full">
                              NEW
                            </span>
                          )}
                        </div>
                        <p className="text-white/70 text-sm">{module.description}</p>
                        {module.slides && (
                          <p className="text-white/50 text-xs mt-1">{module.slides} slides with discussion notes</p>
                        )}
                      </div>
                      <div className="flex-shrink-0">
                        {module.available ? (
                          downloadUrls[module.id] ? (
                            <a
                              href={downloadUrls[module.id]!}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-2 rounded-lg bg-white/95 px-4 py-2 font-bold text-[#062025] hover:bg-white transition"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                              </svg>
                              Download PPTX
                            </a>
                          ) : loadingUrls[module.id] ? (
                            <span className="text-white/60 text-sm">Preparing...</span>
                          ) : (
                            <button
                              onClick={() => getModuleUrl(module.id, module.fileName)}
                              className="inline-flex items-center gap-2 rounded-lg bg-teal-500/20 border border-teal-500/40 px-4 py-2 font-bold text-teal-300 hover:bg-teal-500/30 transition"
                            >
                              Get Download Link
                            </button>
                          )
                        ) : (
                          <span className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 font-medium text-white/50">
                            Coming Soon
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-white/10">
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