// src/components/ReferralTracker.tsx

import React from "react";

// Define the props type
type ReferralTrackerProps = {
  referralCount: number;
  milestone?: number;
  donChainPoints?: number;
  referralHistory: Array<{
    id: string;
    date: string;
    referredEmail?: string;
    bonus?: number;
    points?: number;
  }>;
};

export default function ReferralTracker({
  referralCount,
  milestone,
  donChainPoints,
  referralHistory
}: ReferralTrackerProps) {
  return (
    <div className="bg-[#072b33] border border-[#15C5C1] rounded-2xl p-6 mb-8 shadow text-center">
      <h2 className="text-xl font-bold text-[#FF9151] mb-2">Referral Progress</h2>
      <p className="text-[#15C5C1] text-lg font-semibold mb-2">
        Referrals: {referralCount}
        {milestone && (
          <span className="ml-2 text-[#FF9151]">(Next bonus at {milestone})</span>
        )}
      </p>
      {typeof donChainPoints === "number" && (
        <p className="text-[#B6E7EB] mb-4">Don-chain points: {donChainPoints}</p>
      )}
      <div className="text-left max-h-56 overflow-auto bg-[#003B49] rounded p-3 mt-3">
        <h3 className="text-[#FF9151] font-bold mb-2 text-sm">Referral History</h3>
        {referralHistory && referralHistory.length > 0 ? (
          <ul className="space-y-2">
            {referralHistory.map((ref) => (
              <li key={ref.id} className="border-b border-[#15C5C122] pb-1 text-[#B6E7EB] text-sm">
                <div>
                  <span className="font-semibold">{ref.referredEmail || "Referral"}</span>
                  {ref.bonus && (
                    <span className="ml-2 text-[#15C5C1] font-bold">+{ref.bonus} Bonus</span>
                  )}
                  {ref.points && (
                    <span className="ml-2 text-[#FF9151] font-bold">+{ref.points} pts</span>
                  )}
                </div>
                <span className="text-xs text-[#F7F6F2]">{ref.date}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-[#B6E7EB]">No referrals yet.</p>
        )}
      </div>
    </div>
  );
}
