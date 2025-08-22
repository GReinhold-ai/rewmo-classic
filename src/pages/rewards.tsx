import Head from "next/head";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useAuth } from "@/lib/AuthProvider";
import { useUserRewards } from "@/lib/useUserRewards";

export default function RewardsPage() {
  const { currentUser } = useAuth();
  const uid = currentUser?.uid ?? "";
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
    await navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#003B49]">
        <div className="max-w-md mx-auto p-6 rounded-2xl border border-[#15C5C1]/40 bg-[#072b33] text-[#B6E7EB] text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Rewards</h1>
          <p className="mb-4">Please sign in to view your rewards.</p>
          <Link
            href="/signup"
            className="inline-flex items-center rounded-lg bg-[#FF6B00] px-4 py-2 text-sm font-bold text-white hover:bg-[#ff7d22]"
          >
            Sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#003B49] py-10">
      <Head>
        <title>Rewards</title>
      </Head>
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <h1 className="text-3xl font-black text-white mb-6">Rewards</h1>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-[#15C5C1]/40 bg-[#072b33] p-4">
            <div className="text-sm text-[#B6E7EB]">Total points</div>
            <div className="text-3xl font-black text-[#FF9151]">
              {loading ? "—" : totalPoints}
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
        {loading ? (
          <div className="text-[#B6E7EB]">Loading…</div>
        ) : rewards?.length ? (
          <ul className="divide-y divide-white/10 rounded-xl overflow-hidden border border-white/10">
            {rewards.map((r) => (
              <li key={r.id} className="bg-[#072b33] p-4 text-[#B6E7EB]">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-white">{r.type}</div>
                    {r.description ? (
                      <div className="text-xs text-[#9bd1d6]">{r.description}</div>
                    ) : null}
                  </div>
                  <div className="text-[#FF9151] font-bold">
                    +{r.points ?? 0}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-[#B6E7EB]">No rewards yet.</div>
        )}
      </div>
    </div>
  );
}
