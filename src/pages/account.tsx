// src/pages/account.tsx
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useAuth } from "@/lib/AuthProvider";

type SubStatus =
  | "active"
  | "trialing"
  | "past_due"
  | "canceled"
  | "unpaid"
  | "paused"
  | "unknown"
  | "none";

type PlanTier = "FREE" | "PRO" | "BUSINESS" | "UNKNOWN";

export default function AccountPage() {
  const router = useRouter();
  const { currentUser, signInWithGoogle, logout } = useAuth();

  const [status, setStatus] = useState<SubStatus>("unknown");
  const [planTier, setPlanTier] = useState<PlanTier>("FREE");
  const [periodEnd, setPeriodEnd] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const signedIn = !!currentUser;

  // ✅ Use ID token → /api/status (no ?email=)
  useEffect(() => {
    let ignore = false;

    (async () => {
      if (!currentUser) {
        if (!ignore) {
          setStatus("unknown");
          setPlanTier("FREE");
          setPeriodEnd(null);
        }
        return;
      }

      try {
        const token = await currentUser.getIdToken(/* forceRefresh? */ false);
        const r = await fetch("/api/status", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const j = await r.json();
        if (!ignore) {
          setStatus((j?.subscriptionStatus as SubStatus) ?? "unknown");
          setPlanTier((j?.planTier as PlanTier) ?? "FREE");
          setPeriodEnd(j?.currentPeriodEnd ?? null);
        }
      } catch {
        if (!ignore) {
          setStatus("unknown");
          setPlanTier("FREE");
          setPeriodEnd(null);
        }
      }
    })();

    return () => {
      ignore = true;
    };
  }, [currentUser]);

  function startMembership() {
    router.push("/account/upgrade?plan=PRO");
  }

  async function manageBilling() {
    if (!currentUser?.email) {
      await signInWithGoogle?.();
      return;
    }
    setLoading(true);
    try {
      const origin = typeof window !== "undefined" ? window.location.origin : "";
      let r = await fetch("/api/portal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: currentUser.email, returnUrl: `${origin}/account` }),
      });
      const j = await r.json();
      if (j?.url) window.location.href = j.url;
      else alert(j?.error || "Customer portal not available.");
    } catch (e: any) {
      alert(e?.message || "Network error.");
    } finally {
      setLoading(false);
    }
  }

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
              <span className="text-[#15C5C1] font-semibold">Membership:</span>{" "}
              {planTier === "FREE" && "Free"}
              {planTier === "PRO" && "Pro"}
              {planTier === "BUSINESS" && "Business"}
              {planTier === "UNKNOWN" && "Unknown"}{" "}
              <span className="text-[#9bd1d6]">({status})</span>
            </div>
            {periodEnd && (
              <div className="text-sm text-[#9bd1d6]">
                Renews / ends: {new Date(periodEnd).toLocaleDateString()}
              </div>
            )}
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
                  className="inline-flex items-center rounded-lg bg-[#FF6B00] px-4 py-2 font-bold text-white hover:bg-[#ff7d22]"
                >
                  {status === "active" ? "Update Plan" : "Start Membership"}
                </button>

                <Link
                  href="/account/upgrade?plan=PRO"
                  className="inline-flex items-center rounded-lg bg-[#FF9151] px-4 py-2 font-bold text-[#003B49] hover:bg-[#FFA36C]"
                >
                  Upgrade to Pro
                </Link>
                <Link
                  href="/account/upgrade?plan=BUSINESS"
                  className="inline-flex items-center rounded-lg bg-white/10 px-4 py-2 font-semibold hover:bg-white/20"
                >
                  Upgrade to Business
                </Link>

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

        <div className="mt-6 text-sm text-[#9bd1d6]">
          Need help?{" "}
          <Link href="/contact" className="underline">
            Contact support
          </Link>
          .
        </div>
      </div>
    </div>
  );
}
