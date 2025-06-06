// src/pages/dashboard.tsx

import React from "react";
import dynamic from "next/dynamic";
import { useAuth } from "@/lib/AuthProvider";

// Dynamically import the ShareReferralCard (avoids SSR issues with Firebase)
const ShareReferralCard = dynamic(() => import("@/components/ShareReferralCard"), { ssr: false });

export default function DashboardPage() {
  const { currentUser } = useAuth();

  // Require user to sign in
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#003B49] flex flex-col items-center justify-center text-[#FF9151]">
        <h2 className="text-2xl font-bold">Please sign in to view your dashboard.</h2>
      </div>
    );
  }

  // Generate the user's unique referral link
  const referralLink = `https://rewmo.ai/signup?ref=${currentUser.referralCode || currentUser.uid}`;

  return (
    <div className="min-h-screen bg-[#003B49] font-sans flex flex-col items-center">
      <main className="w-full max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-3xl md:text-4xl font-black mb-6 text-[#FF9151] tracking-tight text-center">
          Welcome, {currentUser.displayName || currentUser.email || "Rewmo Member"}
        </h1>

        {/* Rewards summary */}
        <div className="bg-[#072b33] rounded-2xl shadow-xl border border-[#15C5C1] p-8 mb-8 text-center">
          <h2 className="text-2xl font-bold mb-2 text-[#15C5C1]">Your Dashboard</h2>
          <p className="text-lg text-[#B6E7EB]">
            Track your rewards, share your referral link, and start earning more with RewmoAI.
          </p>
        </div>

        {/* --- Share Referral Card --- */}
        <ShareReferralCard referralLink={referralLink} />

        {/* Example: Rewards points (customize if you store rewardPoints on user) */}
        {typeof currentUser.rewardPoints === "number" && (
          <div className="bg-[#072b33] rounded-xl border border-[#15C5C1] text-[#15C5C1] font-semibold p-6 mb-8 text-center">
            Reward Points:{" "}
            <span className="text-[#FF9151] text-xl font-extrabold">
              {currentUser.rewardPoints}
            </span>
          </div>
        )}

        {/* Navigation */}
        <div className="flex flex-wrap gap-4 justify-center">
          <a
            href="/shopping"
            className="px-5 py-3 bg-[#15C5C1] hover:bg-[#FFA36C] text-[#003B49] font-bold rounded-xl shadow transition"
          >
            Go Shopping
          </a>
          <a
            href="/profile"
            className="px-5 py-3 bg-[#FF9151] hover:bg-[#FFA36C] text-[#003B49] font-bold rounded-xl shadow transition"
          >
            View Profile
          </a>
        </div>
      </main>
    </div>
  );
}
