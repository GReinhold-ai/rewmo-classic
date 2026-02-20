// src/pages/rewards.tsx
import Head from "next/head";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useAuth } from "@/lib/AuthProvider";
import SignInOverlay from "@/components/SignInOverlay";
import RewardHistory from "@/components/RewardHistory";
import { useUserRewards } from "@/lib/useUserRewards";

export default function RewardsPage() {
  const { currentUser } = useAuth();
  const uid = currentUser?.uid ?? null;

  const { rewards, loading } = useUserRewards(uid);

  const totalPoints = useMemo(
    () => (rewards ?? []).reduce((acc, r) => acc + (r.points ?? 0), 0),
    [rewards]
  );

  const referralCode = useMemo(
    () => (currentUser ? `REF-${currentUser.uid.slice(0, 6)}` : ""),
    [currentUser]
  );

  const referralLink = useMemo(() => {
    if (!currentUser) return "";
    const origin =
      typeof window !== "undefined" ? window.location.origin : "https://rewmo.ai";
    return `${origin}/?ref=${currentUser.uid}`;
  }, [currentUser]);

  const [copied, setCopied] = useState(false);
  async function copy() {
    if (!referralLink) return;
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      // ignore
    }
  }

  return (
    <div className="min-h-screen bg-[#003B49] py-10">
      <Head><title>Rewards | RewmoAI</title></Head>

      {/* Sign-in overlay for guests */}
      {!currentUser && (
        <SignInOverlay 
          title="Sign in to view your rewards"
          description="Track your points, referral bonuses, and shopping cashback."
        />
      )}

      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <h1 className="text-3xl font-black text-white mb-6">Rewards</h1>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-[#15C5C1]/40 bg-[#072b33] p-4">
            <div className="text-sm text-[#B6E7EB]">Total points</div>
            <div className="text-3xl font-black text-[#FF9151]">
              {loading ? "" : totalPoints}
            </div>
          </div>

          <div className="rounded-xl border border-[#15C5C1]/40 bg-[#072b33] p-4 sm:col-span-2">
            <div className="text-sm text-[#B6E7EB] mb-1">Referral</div>
            <div className="text-white text-sm">
              Code: <span className="font-mono">{referralCode}</span>
            </div>
            <div className="mt-2 flex gap-2 items-center">
              <input
                readOnly
                value={referralLink}
                className="flex-1 rounded-md bg-[#003B49] border border-[#15C5C1]/30 px-2 py-1 text-[#B6E7EB]"
              />
              <button
                onClick={copy}
                className="rounded-md bg-[#FF6B00] px-3 py-1 text-white font-semibold hover:bg-[#ff7d22]"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>
        </div>

        <h2 className="text-xl font-bold text-white mt-8 mb-3">History</h2>
        <div className="rounded-xl overflow-hidden border border-white/10">
          <div className="bg-[#072b33] p-4 text-[#B6E7EB]">
            <RewardHistory />
          </div>
        </div>

        <div className="mt-8">
          <Link href="/shopping" className="underline text-[#B6E7EB]">
            Go to Shopping Rewards 
          </Link>
        </div>
      </div>
    </div>
  );
}
