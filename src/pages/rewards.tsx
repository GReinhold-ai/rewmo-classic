import React, { useState } from "react";
import Link from "next/link";
import { ShoppingBag, UserPlus, Home, Bot, Flag, Leaf, Copy } from "lucide-react";
import { useAuth } from "../lib/AuthProvider";
import { useUserRewards } from "../lib/useUserRewards"; // <- This must exist and return { points, loading }

const PEACOCK = "#003B4A";
const CORAL = "#FF7043";

export default function RewardsPage() {
  const { currentUser } = useAuth();
  const { points, loading } = useUserRewards(currentUser?.uid || "");
  const [copied, setCopied] = useState(false);

  // Referral code logic: fallback to uid if referralCode isn't present
  const referralCode =
    (currentUser && (currentUser as any).referralCode) ||
    (currentUser && currentUser.uid) ||
    "";
  const referralUrl = referralCode
    ? `https://rewmo.ai/?ref=${referralCode}`
    : "";

  const handleCopy = () => {
    if (referralUrl) {
      navigator.clipboard.writeText(referralUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <main
      className="min-h-screen flex flex-col items-center pb-10"
      style={{ background: PEACOCK, color: "#fff" }}
    >
      {/* Referral Code Block & Points */}
      <div className="w-full max-w-2xl mt-8 mb-2 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex-1 flex flex-col md:flex-row md:items-center gap-2">
          <span className="font-semibold" style={{ color: CORAL, fontSize: "0.95rem" }}>Your Referral Link:</span>
          <div className="flex items-center bg-white/90 rounded-lg px-2 py-1 text-black">
            <span className="truncate max-w-[160px] md:max-w-xs text-xs font-mono">
              {referralUrl}
            </span>
            <button
              onClick={handleCopy}
              className="ml-2 p-1 hover:bg-orange-100 rounded"
              title="Copy referral link"
            >
              <Copy className="w-4 h-4" style={{ color: CORAL }} />
            </button>
            <span className="ml-2 text-xs text-green-600">{copied && "Copied!"}</span>
          </div>
        </div>
        {/* Points/Balances */}
        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-300">Reward Points:</span>
          {loading ? (
            <span className="font-semibold animate-pulse" style={{ color: CORAL }}>…</span>
          ) : (
            <span className="font-semibold" style={{ color: CORAL }}>{points ?? 0}</span>
          )}
        </div>
      </div>

      {/* Info Block */}
      <div className="w-full max-w-2xl mb-6">
        <div className="rounded-xl shadow p-4 text-center font-semibold text-sm border"
          style={{ background: "#E0F7FA", color: PEACOCK, borderColor: "#B2EBF2" }}>
          Points you earn during testing and referrals are being tracked!
          <br />
          <span className="font-normal">
            All points earned for referrals, testing, and activities are posted to your account per the{" "}
            <Link href="/reward-rules" className="underline" style={{ color: CORAL }}>
              Reward Rules
            </Link>.
            Withdrawals will open after launch, subject to program policies.
          </span>
        </div>
      </div>

      {/* Expanded Narrative */}
      <h1 className="text-3xl md:text-4xl font-extrabold mb-2 text-center" style={{ color: CORAL }}>
        Your Rewards
      </h1>
      <p className="mb-8 text-center max-w-2xl text-lg" style={{ color: "#D1EAF0", fontWeight: 500 }}>
        <span style={{ color: CORAL, fontWeight: "bold" }}>Welcome to the new era of wealth building.</span>
        <br />
        Leading financial experts agree: <span style={{ color: "#FFA270", fontWeight: 600 }}>Passive rewards and consistent savings</span>—not spending—are the foundation of <span style={{ color: "#FFA270", fontWeight: 600 }}>generational wealth</span>.
        <br className="hidden md:block" />
        <br />
        RewmoAI is more than just points—it’s your personal financial guide. Our AI and TQM-driven efficiencies work behind the scenes to optimize every dollar you spend or save, rewarding you for the smartest decisions. As you participate, RewmoAI’s <span style={{ color: "#FFA270" }}>Learning Center</span> and financial coaching will help transform your habits, turning you into a true saver, not just a spender.
        <br className="hidden md:block" />
        <br />
        Let RewmoAI coach, educate, and reward you at every stage. Build wealth automatically—<span style={{ color: "#FFA270", fontWeight: 600 }}>for yourself and for future generations</span>.
      </p>

      {/* Reward Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl px-2">
        {/* Rent & Mortgage Rewards (Coming Soon) */}
        <div className="transition-transform hover:-translate-y-1">
          <div className="bg-white/60 text-gray-500 rounded-xl shadow-lg p-5 flex flex-col gap-2 hover:ring-2"
            style={{ borderColor: "#B2EBF2", cursor: "not-allowed" }}>
            <Home className="w-8 h-8 mb-1" style={{ color: CORAL }} />
            <h2 className="text-lg font-bold flex items-center">
              Rent &amp; Mortgage Rewards
              <span className="ml-2 px-2 py-0.5" style={{
                background: "#FFDAD1", color: CORAL, borderRadius: "0.5rem",
                fontSize: "0.75rem", fontWeight: 600
              }}>
                Coming Soon
              </span>
            </h2>
            <p>
              Soon, you’ll earn extra points just by paying your biggest bills. With AI-driven tracking, every rent or mortgage payment will help you build your net worth passively, without extra effort.
            </p>
          </div>
        </div>
        {/* Referral Rewards */}
        <Link href="/referrals" className="transition-transform hover:-translate-y-1">
          <div className="bg-white rounded-xl shadow-lg p-5 flex flex-col gap-2 hover:ring-2"
            style={{ color: PEACOCK, borderColor: CORAL, cursor: "pointer" }}>
            <UserPlus className="w-8 h-8 mb-1" style={{ color: CORAL }} />
            <h2 className="text-lg font-bold">Referral Rewards</h2>
            <p>
              Unlock bonus points and exclusive perks by inviting friends and colleagues. Each successful referral boosts your own financial journey and expands our community of savers. Hit milestones for even greater rewards—and top referrers earn VIP recognition.
            </p>
          </div>
        </Link>
        {/* AI Smart Boosts */}
        <Link href="/shopping" className="transition-transform hover:-translate-y-1">
          <div className="bg-white/60 text-gray-500 rounded-xl shadow-lg p-5 flex flex-col gap-2 hover:ring-2"
            style={{ borderColor: "#B2EBF2", cursor: "pointer" }}>
            <Bot className="w-8 h-8 mb-1" style={{ color: CORAL }} />
            <h2 className="text-lg font-bold flex items-center">
              AI Smart Boosts
              <span className="ml-2 px-2 py-0.5"
                style={{ background: "#FFDAD1", color: CORAL, borderRadius: "0.5rem", fontSize: "0.75rem", fontWeight: 600 }}>
                Coming Soon
              </span>
            </h2>
            <p>
              RewmoAI’s intelligent algorithms will soon unlock extra rewards for good money habits, savings milestones, and financial wins. You focus on your life—AI will focus on maximizing your rewards.
            </p>
          </div>
        </Link>
        {/* Made in America Rewards (Active) */}
        <Link href="/shopping" className="transition-transform hover:-translate-y-1">
          <div className="bg-white rounded-xl shadow-lg p-5 flex flex-col gap-2 hover:ring-2"
            style={{ color: PEACOCK, borderColor: CORAL, cursor: "pointer" }}>
            <Flag className="w-8 h-8 mb-1" style={{ color: CORAL }} />
            <h2 className="text-lg font-bold">Made in America</h2>
            <p>
              Earn even more by supporting American-made products and local businesses! Look for the badge when you shop and enjoy bonus points—fueling both your personal prosperity and our national economy.
            </p>
          </div>
        </Link>
        {/* Sustainable Shopping (Active) */}
        <Link href="/shopping" className="transition-transform hover:-translate-y-1">
          <div className="bg-white rounded-xl shadow-lg p-5 flex flex-col gap-2 hover:ring-2"
            style={{ color: PEACOCK, borderColor: CORAL, cursor: "pointer" }}>
            <Leaf className="w-8 h-8 mb-1" style={{ color: CORAL }} />
            <h2 className="text-lg font-bold">Sustainable Shopping</h2>
            <p>
              Make a difference with every purchase. RewmoAI rewards you for buying eco-friendly and sustainable products, so you can grow your savings and make an impact at the same time.
            </p>
          </div>
        </Link>
      </div>

      {/* Call to Action */}
      <div className="mt-10">
        <Link href="/shopping">
          <button className="px-8 py-3 text-lg font-bold rounded-2xl shadow-xl"
            style={{ background: CORAL, color: PEACOCK }}>
            Shop Now &amp; Earn More Rewards
          </button>
        </Link>
      </div>
    </main>
  );
}
