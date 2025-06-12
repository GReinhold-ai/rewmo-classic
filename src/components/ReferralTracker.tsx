// src/components/ReferralTracker.tsx
import React from "react";

export default function ReferralTracker({ referralCount, milestone, donChainPoints, referralHistory }) {
  return (
    <div className="bg-[#072b33] border border-[#15C5C1] rounded-2xl p-6 mb-8 shadow text-center">
      <h2 className="text-xl font-bold text-[#FF9151] mb-2">Referral Progress</h2>
      <div className="text-lg text-[#B6E7EB] mb-2">
        You’ve referred <span className="text-[#15C5C1] font-bold">{referralCount}</span> {referralCount === 1 ? "person" : "people"}
        <br />
        <span className="text-[#FF9151] font-bold">{donChainPoints}</span> Don-Chain Points earned from referrals
      </div>
      <div className="w-full bg-[#003B49] rounded-xl my-4 h-4">
        <div
          className="bg-[#FF9151] h-4 rounded-xl"
          style={{ width: `${Math.min((referralCount / milestone) * 100, 100)}%` }}
        ></div>
      </div>
      <div className="text-xs text-[#B6E7EB] mb-4">
        {referralCount}/{milestone} referrals — Get bonus points at every {milestone} referrals!
      </div>
      <h3 className="text-base text-[#15C5C1] font-bold mb-2">Referral History</h3>
      <ul className="max-h-40 overflow-y-auto space-y-2">
        {referralHistory && referralHistory.length ? (
          referralHistory.map((r, i) => (
            <li key={i} className="bg-[#003B49] rounded px-3 py-2 flex flex-col md:flex-row md:justify-between items-start">
              <span>
                {r.referredEmail || r.referredName || "Invited user"}<span className="ml-2 text-xs text-[#B6E7EB]">{new Date(r.joinedAt?.seconds ? r.joinedAt.seconds * 1000 : r.joinedAt).toLocaleDateString()}</span>
              </span>
              <span className={`ml-2 text-xs font-semibold ${r.bonusAwarded ? "text-[#FF9151]" : "text-[#B6E7EB]"}`}>
                {r.bonusAwarded ? "Bonus Awarded" : "Pending"}
              </span>
            </li>
          ))
        ) : (
          <li className="text-[#B6E7EB]">No referrals yet. Share your link to start earning!</li>
        )}
      </ul>
    </div>
  );
}
