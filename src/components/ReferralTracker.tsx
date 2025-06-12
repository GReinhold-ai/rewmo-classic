import React from "react";

type ReferralEntry = {
  id: string;
  referredUser: string;
  date: string;
  bonus?: number;
  points?: number;
};

type Props = {
  referralCount: number;
  milestone: number;
  donChainPoints: number;
  referralHistory: ReferralEntry[];
};

export default function ReferralTracker({
  referralCount,
  milestone,
  donChainPoints,
  referralHistory
}: Props) {
  return (
    <div className="bg-[#072b33] border border-[#15C5C1] rounded-2xl p-6 mb-8 shadow text-center">
      <h2 className="text-xl font-bold text-[#FF9151] mb-2">Referral Progress</h2>
      <div className="mb-4">
        <p className="text-lg text-[#15C5C1] font-bold">
          Referrals: {referralCount} / {milestone}
        </p>
        <p className="text-[#FFA36C]">Don-Chain Points: {donChainPoints}</p>
      </div>
      <div className="bg-[#003B49] rounded-lg p-4 text-left">
        <h3 className="font-semibold text-[#15C5C1] mb-2 text-base">Recent Referral History</h3>
        {referralHistory.length === 0 && (
          <p className="text-[#B6E7EB] text-sm">No referrals yet.</p>
        )}
        <ul className="space-y-2">
          {referralHistory.map((ref, idx) => (
            <li key={ref.id || idx} className="flex justify-between text-[#B6E7EB] text-sm">
              <span>
                {ref.referredUser} <span className="text-[#FFA36C]">({new Date(ref.date).toLocaleDateString()})</span>
              </span>
              {ref.points && <span>+{ref.points} pts</span>}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
