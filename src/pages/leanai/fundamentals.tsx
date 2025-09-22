// src/pages/leanai/fundamentals.tsx
import { useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth, db } from "@/lib/firebaseClient";
import { doc, getDoc } from "firebase/firestore";
import Head from "next/head";

const PRODUCT_ID = process.env.NEXT_PUBLIC_RPM_PRODUCT_ID || "rpm-fundamentals";
// storagePath must match your Firestore course doc. Example from your screenshot:
const STORAGE_PATH = "R-PM Fundamentals Module 1.pptx"; // or "leanai/advanced/R-PM Fundamentals Module 1.pptx"

export default function FundamentalsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [checking, setChecking] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isSuccess = useMemo(() => {
    if (typeof window === "undefined") return false;
    const u = new URL(window.location.href);
    return u.searchParams.get("success") === "1";
  }, []);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  // After returning from Stripe (success=1), poll for entitlement a few times (~20s).
  useEffect(() => {
    let stopped = false;
    if (!user || !isSuccess) return;

    setChecking(true);
    setError(null);

    const tryOnce = async () => {
      try {
        const ref = doc(db, `users/${user.uid}/entitlements/${PRODUCT_ID}`);
        const snap = await getDoc(ref);
        if (stopped) return;

        if (snap.exists() && snap.data()?.active) {
          setHasAccess(true);
        } else {
          throw new Error("Entitlement not yet active");
        }
      } catch (e: any) {
        // keep polling
        throw e;
      }
    };

    let attempts = 0;
    const tick = async () => {
      attempts++;
      try {
        await tryOnce();
        setChecking(false);
      } catch {
        if (attempts >= 10) {
          setChecking(false);
          setError(
            "Still activating your access. Please refresh this page in a few seconds. (If it keeps failing, ensure the webhook is running.)"
          );
          return;
        }
        setTimeout(tick, 2000);
      }
    };

    tick();
    return () => {
      stopped = true;
    };
  }, [user, isSuccess]);

  // When access is granted, fetch signed URL and redirect.
  useEffect(() => {
    const go = async () => {
      if (!hasAccess) return;
      try {
        const q = new URLSearchParams({ path: STORAGE_PATH });
        const r = await fetch(`/api/leanai/signed-url?${q.toString()}`);
        const j = await r.json();
        if (!r.ok) throw new Error(j?.error || "Failed to get signed URL");
        window.location.href = j.url;
      } catch (e: any) {
        setError(e.message || "Failed to redirect to download");
      }
    };
    go();
  }, [hasAccess]);

  // Button handler -> create Checkout session for the subscription
  const onUnlock = async () => {
    if (!user) {
      // your app’s sign-in flow
      window.location.href = "/account?signin=1";
      return;
    }
    try {
      const res = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid: user.uid, email: user.email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to start checkout");
      window.location.href = data.url;
    } catch (e: any) {
      alert(e.message || "Error starting checkout");
    }
  };

  return (
    <>
      <Head>
        <title>R-PM Fundamentals — Module 1</title>
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </Head>

      <main className="min-h-screen px-6 py-10 text-[#E7F8F9] bg-[#08343A]">
        <h1 className="text-3xl md:text-5xl font-black text-[#FF9151]">R-PM Fundamentals — Module 1</h1>

        <div className="mt-6 p-4 rounded-xl border border-teal-700 bg-[#0b4450] max-w-3xl">
          {user ? (
            <div className="text-sm">
              Signed in as <b>{user.email}</b> — <a className="underline" href="/account">Account</a>
            </div>
          ) : (
            <div className="text-sm">Not signed in.</div>
          )}
        </div>

        <section className="mt-6 p-4 rounded-xl border border-teal-700 bg-[#0b4450] max-w-3xl">
          <h2 className="text-xl font-bold mb-2 text-[#15C5C1]">Unlock Access</h2>

          {checking && (
            <div className="mb-3 text-sm bg-[#09414B] inline-block px-3 py-2 rounded-lg">
              Redirecting… we’re activating your access. If this takes more than ~20s, refresh this page.
            </div>
          )}

          {error && <div className="mb-3 text-sm text-[#FFB4A2]">{error}</div>}

          <button
            className="px-6 py-3 rounded-xl bg-[#FF9151] text-[#003B49] font-bold hover:bg-[#FFA36C] disabled:opacity-60"
            disabled={checking || hasAccess}
            onClick={onUnlock}
          >
            {hasAccess ? "Opening download…" : "Unlock Access"}
          </button>

          <p className="text-xs mt-3 opacity-80">
            After checkout completes, you’ll be redirected back here and your access will activate automatically via Stripe
            webhook.
          </p>
        </section>
      </main>
    </>
  );
}
