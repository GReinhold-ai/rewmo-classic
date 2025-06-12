// src/components/ShoppingRewardHistory.tsx
import React from "react";

export default function ShoppingRewardHistory({ rewardHistory }) {
  return (
    <div className="bg-[#072b33] border border-[#15C5C1] rounded-2xl p-6 mb-8 shadow text-center">
      <h2 className="text-xl font-bold text-[#15C5C1] mb-3">Shopping Reward History</h2>
      <ul className="space-y-3 max-h-48 overflow-y-auto">
        {rewardHistory && rewardHistory.length ? (
          rewardHistory.map((r, i) => (
            <li
              key={i}
              className="flex flex-col md:flex-row md:items-center justify-between bg-[#003B49] px-4 py-3 rounded-xl"
            >
              <span className="font-semibold text-[#FF9151]">{r.store || "Amazon"}</span>
              <span className="text-[#B6E7EB] text-sm">
                {r.description || r.product || "Shopping reward"}
              </span>
              <span className="font-bold text-[#15C5C1]">{r.points || 0} pts</span>
              <span className="ml-2 text-xs text-[#B6E7EB]">
                {new Date(r.timestamp?.seconds ? r.timestamp.seconds * 1000 : r.timestamp).toLocaleDateString()}
              </span>
            </li>
          ))
        ) : (
          <li className="text-[#B6E7EB]">No shopping rewards yet. Shop with RewmoAI and start earning!</li>
        )}
      </ul>
    </div>
  );
}
