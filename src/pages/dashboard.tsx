// src/pages/dashboard.tsx
import React from "react";
import { useAuth } from "@/lib/AuthProvider";
import ShareReferralCard from "@/components/ShareReferralCard";

export default function DashboardPage() {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#003B49] text-[#FF9151] flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-3">Please sign in to access your dashboard.</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#003B49] font-sans flex flex-col items-center py-10 px-2">
      <div className="w-full max-w-2xl">
        <div className="flex flex-col items-center gap-3 mb-6">
          {/* User avatar (if available) */}
          {currentUser.photoURL && (
            <img
              src={currentUser.photoURL}
              alt="Profile"
              className="w-20 h-20 rounded-full border-4 border-[#15C5C1] shadow-xl mb-2"
            />
          )}
          <h1 className="text-3xl font-extrabold text-[#FF9151] text-center">
            Welcome, {currentUser.displayName || currentUser.email || "Member"}!
          </h1>
          <p className="text-[#B6E7EB] text-lg text-center">
            View your reward points, referral stats, and share your unique invite link to earn bonuses!
          </p>
        </div>

        {/* --- Share Referral Card --- */}
        <ShareReferralCard />

        {/* --- Rewards Summary (placeholder; customize as needed) --- */}
        <div className="bg-[#072b33] rounded-2xl shadow-xl border border-[#15C5C1] p-8 my-4 text-center">
          <h2 className="text-2xl font-bold mb-2 text-[#15C5C1]">Your Rewards</h2>
          <div className="text-[#FF9151] text-4xl font-black mb-2">
            {/* Placeholder for actual rewardPoints */}
            {/* You might want to query rewardPoints from Firestore here */}
            ⭐ 0 Points
          </div>
          <div className="text-[#B6E7EB] text-base mb-1">
            Earn more points by shopping, inviting friends, or using RewmoAI features.
          </div>
        </div>
      </div>
    </div>
  );
}
