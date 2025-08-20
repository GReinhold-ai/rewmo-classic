import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/AuthProvider";

type SubStatus =
  | "active"
  | "trialing"
  | "past_due"
  | "canceled"
  | "unpaid"
  | "paused"
  | "unknown";

export default function AccountPage() {
  const { currentUser, signInWithGoogle, logout } = useAuth();
  const [status, setStatus] = useState<SubStatus>("unknown");
  const [loading, setLoading] = useState(false);

  // Try to read subscription status (optional helper API if you add it)
  useEffect(() => {
    let ignore = false;
    (async () => {
      if (!currentUser?.email) {
        setStatus("unknown");
        return;
      }
      try {
        const r = await fetch(
          `/api/subscription-status?email=${encodeURIComponent(
            currentUser.email
          )}`
        );
        if (!r.ok) {
          setStatus("unknown");
          return;
        }
        const j = await r.json();
        if (!ignore)
          setStatus(
            (j?.subscriptionStatus as SubStatus) ?? "unknown"
          );
      } catch {
        if (!ignore) setStatus("unknown");
      }
    })();
    return () => {
      ignore = true;
    };
  }, [currentUser?.email]);

  async function startMembership() {
    if (!currentUser?.email) return signInWithGoogle();
    setLoading(true);
    try {
      const r = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Requested-With": "fetch" },
        body: JSON.stringify({
          email: currentUser.email,
          product: "RewmoAI + EnterpriseAI",
          source: "account",
          utm_source: "app",
          utm_medium: "account",
          utm_campaign: "bundle10",
        }),
      });
      const j = await r.json();
      if (j?.url) window.location.href = j.url;
      else alert(j?.error || "Could not start checkout.");
    } catch (e: any) {
      alert(e?.message || "Network error.");
    } finally {
      setLoading(false);
    }
  }

  async function manageBilling() {
    if (!currentUser?.email) return signInWithGoogle();
    setLoading(true);
    try {
      // If you add a portal route, this will work; otherwise it fails gracefully.
      let r = await fetch("/api/customer-portal", { method: "POST" });
      if (r.status === 404) r = await fetch("/api/portal", { method: "POST" });
      const j = await r.json();
      if (j?.url) window.location.href = j.url;
      else alert(j?.error || "Customer portal not available.");
    } catch (e: any) {
      alert(e?.message || "Network error.");
    } finally {
      setLoading(false);
    }
  }

  const signedIn = !!currentUser;

  return (
    <div className="min-h-screen bg-[#003B49] text-white">
      <div className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-3xl md:text-4xl font-black text-[#FF9151]">Account</h1>
        <p className="mt-2 text-[#B6E7EB]">Manage your membership and billing.</p>

        <div className="mt-6 rounded-2xl border border-[#15C5C1]/40 bg-[#072b33] p-6">
          <div className="flex flex-col gap-2">
            <div>
              <span className="text-[#15C5C1] font-semibold">Signed in as:</span>{" "}
              {signedIn ? currentUser?.email || "(no email)" : "Not signed in"}
            </div>
            <div>
              <span className="text-[#15C5C1] font-semibold">Membership status:</span>{" "}
              {status}
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            {!signedIn && (
              <button
                onClick={signInWithGoogle}
                className="inline-flex items-center rounded-lg bg-white/10 px-4 py-2 font-semibold hover:bg-white/20"
              >
                Sign in with Google
              </button>
            )}

            {signedIn && (
              <>
                <button
                  onClick={startMembership}
                  disabled={loading}
                  className="inline-flex items-center rounded-lg bg-[#FF6B00] px-4 py-2 font-bold text-white hover:bg-[#ff7d22] disabled:opacity-50"
                >
                  {status === "active" ? "Update Plan" : "Start Membership"}
                </button>

                <button
                  onClick={manageBilling}
                  disabled={loading}
                  className="inline-flex items-center rounded-lg border border-white/20 px-4 py-2 font-semibold hover:bg-white/10 disabled:opacity-50"
                >
                  Manage Billing
                </button>

                <button
                  onClick={logout}
                  disabled={loading}
                  className="inline-flex items-center rounded-lg px-4 py-2 font-semibold text-[#B6E7EB] hover:bg-white/5 disabled:opacity-50"
                >
                  Sign out
                </button>
              </>
            )}

            <Link
              href="/"
              className="inline-flex items-center rounded-lg px-4 py-2 font-semibold text-[#15C5C1] hover:text-white"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
