import React from "react";

type RewardEntry = {
  id: string;
  date: string;
  merchant: string;
  amount: number;
  points: number;
  description?: string;
};

type Props = {
  rewardHistory: RewardEntry[];
};

export default function ShoppingRewardHistory({ rewardHistory }: Props) {
  return (
    <div className="bg-[#072b33] border border-[#15C5C1] rounded-2xl p-6 mb-8 shadow text-center">
      <h2 className="text-xl font-bold text-[#15C5C1] mb-3">Shopping Reward History</h2>
      {rewardHistory.length === 0 && (
        <p className="text-[#B6E7EB] text-sm">No rewards yet.</p>
      )}
      <ul className="space-y-2">
        {rewardHistory.map((reward) => (
          <li key={reward.id} className="flex justify-between text-[#B6E7EB] text-sm">
            <span>
              {reward.merchant} <span className="text-[#FFA36C]">({new Date(reward.date).toLocaleDateString()})</span>
            </span>
            <span>
              +{reward.points} pts <span className="text-[#15C5C1]">${reward.amount.toFixed(2)}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
