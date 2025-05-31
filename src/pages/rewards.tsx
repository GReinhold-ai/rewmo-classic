import React, { useState } from "react";
import Link from "next/link";
import { ShoppingBag, UserPlus, Home, Bot, Flag, Leaf, Copy as CopyIcon } from "lucide-react";
import { useAuth } from "@/lib/AuthProvider"; // Adjust import path if needed

// Optional: Replace this with your actual balance-fetching hook if different
import { useUserRewards } from "@/lib/useUserRewards"; // Create/use this if needed

export default function RewardsPage() {
  const { currentUser } = useAuth();
  // Assume userId is currentUser?.uid
  const { points, loading } = useUserRewards(currentUser?.uid); // Custom hook to fetch balance

  // Referral code logic (if you have a referralCode on user, else fallback to uid)
  const referralCode = currentUser?.referralCode || currentUser?.uid || "";
  const referralUrl = referralCode ? `https://rewmo.ai/?ref=${referralCode}` : "";

  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(referralUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center pb-10">
      {/* Top Section: Referral Code and Rewards Balance */}
      {currentUser && (
        <div className="w-full max-w-2xl mt-10 mb-5 flex flex-col items-center gap-4">
          {/* Referral Link */}
          <div className="flex flex-col items-center w-full">
            <div className="font-bold text-lg mb-1 text-orange-300">Your Referral Link</div>
            <div className="flex w-full items-center gap-2">
              <input
                type="text"
                value={referralUrl}
                readOnly
                className="w-full bg-gray-900 text-gray-100 rounded px-2 py-1 border border-gray-800 font-mono text-sm"
                onFocus={e => e.target.select()}
              />
              <button
                className={`px-3 py-1 rounded font-bold text-sm transition ${
                  copied ? "bg-green-500 text-white" : "bg-orange-500 text-white hover:bg-orange-600"
                }`}
                onClick={handleCopy}
              >
                {copied ? "Copied!" : <span className="flex items-center gap-1"><CopyIcon size={16}/> Copy</span>}
              </button>
            </div>
            <div className="text-xs text-orange-400 mt-1">
              Invite friends—earn bonus points for every signup!
            </div>
          </div>
          {/* Points/Balance */}
          <div className="flex items-center gap-2 text-lg font-semibold text-white bg-orange-500 rounded-lg px-4 py-2 shadow mt-2">
            <span>Your Rewards Balance:</span>
            <span className="font-mono text-orange-100">
              {loading ? "Loading..." : (typeof points === "number" ? points : "0")}
            </span>
            <span className="text-xs text-orange-100 font-normal ml-1">pts</span>
          </div>
        </div>
      )}

      {/* Banner/Info Block */}
      <div className="w-full max-w-2xl mb-6">
        <div className="bg-orange-100 text-orange-900 rounded-xl shadow p-4 text-center font-semibold text-sm border border-orange-200">
          Points you earn during testing and referrals are being tracked!
          <br />
          <span className="font-normal">
            All points earned for referrals, testing, and activities are posted to your account per the{" "}
            <Link href="/reward-rules" className="underline text-orange-700 hover:text-orange-500">
              Reward Rules
            </Link>.
            Withdrawals will open after launch, subject to program policies.
          </span>
        </div>
      </div>

      {/* Expanded Narrative */}
      <h1 className="text-3xl md:text-4xl font-extrabold mb-2 text-orange-500 text-center">
        Your Rewards
      </h1>
      <p className="mb-8 text-center max-w-2xl text-lg text-gray-200 font-medium">
        <span className="text-orange-400 font-bold">Welcome to the new era of wealth building.</span>  
        <br />
        Leading financial experts agree: <span className="text-orange-300 font-semibold">Passive rewards and consistent savings</span>—not spending—are the foundation of <span className="text-orange-300 font-semibold">generational wealth</span>.
        <br className="hidden md:block" />
        <br />
        RewmoAI is more than just points—it’s your personal financial guide. Our AI and TQM-driven efficiencies work behind the scenes to optimize every dollar you spend or save, rewarding you for the smartest decisions. As you participate, RewmoAI’s <span className="text-orange-300">Learning Center</span> and financial coaching will help transform your habits, turning you into a true saver, not just a spender. 
        <br className="hidden md:block" />
        <br />
        Let RewmoAI coach, educate, and reward you at every stage. Build wealth automatically—<span className="text-orange-300 font-semibold">for yourself and for future generations</span>.
      </p>

      {/* Reward Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl px-2">
        {/* Rent & Mortgage Rewards (Coming Soon) */}
        <div className="transition-transform hover:-translate-y-1">
          <div className="bg-white/60 text-gray-500 rounded-xl shadow-lg p-5 flex flex-col gap-2 hover:ring-2 hover:ring-orange-200 h-full cursor-not-allowed">
            <Home className="w-8 h-8 text-orange-400 mb-1" />
            <h2 className="text-lg font-bold flex items-center">
              Rent &amp; Mortgage Rewards
              <span className="ml-2 px-2 py-0.5 bg-orange-200 text-orange-700 rounded text-xs font-semibold">Coming Soon</span>
            </h2>
            <p>
              Soon, you’ll earn extra points just by paying your biggest bills. With AI-driven tracking, every rent or mortgage payment will help you build your net worth passively, without extra effort.
            </p>
          </div>
        </div>
        {/* Referral Rewards */}
        <Link href="/referrals" className="transition-transform hover:-translate-y-1">
          <div className="bg-white/95 text-black rounded-xl shadow-lg p-5 flex flex-col gap-2 hover:ring-2 hover:ring-orange-400 cursor-pointer h-full">
            <UserPlus className="w-8 h-8 text-orange-500 mb-1" />
            <h2 className="text-lg font-bold">Referral Rewards</h2>
            <p>
              Unlock bonus points and exclusive perks by inviting friends and colleagues. Each successful referral boosts your own financial journey and expands our community of savers. Hit milestones for even greater rewards—and top referrers earn VIP recognition.
            </p>
          </div>
        </Link>
        {/* AI Smart Boosts */}
        <Link href="/shopping" className="transition-transform hover:-translate-y-1">
          <div className="bg-white/60 text-gray-500 rounded-xl shadow-lg p-5 flex flex-col gap-2 hover:ring-2 hover:ring-orange-200 cursor-pointer h-full">
            <Bot className="w-8 h-8 text-orange-400 mb-1" />
            <h2 className="text-lg font-bold flex items-center">
              AI Smart Boosts
              <span className="ml-2 px-2 py-0.5 bg-orange-200 text-orange-700 rounded text-xs font-semibold">Coming Soon</span>
            </h2>
            <p>
              RewmoAI’s intelligent algorithms will soon unlock extra rewards for good money habits, savings milestones, and financial wins. You focus on your life—AI will focus on maximizing your rewards.
            </p>
          </div>
        </Link>
        {/* Made in America Rewards (Active) */}
        <Link href="/shopping" className="transition-transform hover:-translate-y-1">
          <div className="bg-white/95 text-black rounded-xl shadow-lg p-5 flex flex-col gap-2 hover:ring-2 hover:ring-orange-400 cursor-pointer h-full">
            <Flag className="w-8 h-8 text-orange-500 mb-1" />
            <h2 className="text-lg font-bold">Made in America</h2>
            <p>
              Earn even more by supporting American-made products and local businesses! Look for the badge when you shop and enjoy bonus points—fueling both your personal prosperity and our national economy.
            </p>
          </div>
        </Link>
        {/* Sustainable Shopping (Active) */}
        <Link href="/shopping" className="transition-transform hover:-translate-y-1">
          <div className="bg-white/95 text-black rounded-xl shadow-lg p-5 flex flex-col gap-2 hover:ring-2 hover:ring-orange-400 cursor-pointer h-full">
            <Leaf className="w-8 h-8 text-orange-500 mb-1" />
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
          <button className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white text-lg font-bold rounded-2xl shadow-xl">
            Shop Now &amp; Earn More Rewards
          </button>
        </Link>
      </div>
    </main>
  );
}
