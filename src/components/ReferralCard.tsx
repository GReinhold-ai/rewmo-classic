// src/components/ReferralCard.tsx

import React from "react";

export default function ReferralCard() {
  const referralLink = "https://rewmo.ai/?ref=YOURCODE";
  return (
    <div className="max-w-md mx-auto mt-10 p-6 rounded-2xl shadow-lg bg-[#003B4A] text-white flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-2 text-[#FF7043]">Invite Friends, Earn Rewards</h2>
      <p className="mb-4 text-lg opacity-80">
        Share your link and earn bonus points for every friend who joins!
      </p>
      <input
        value={referralLink}
        readOnly
        className="w-full mb-4 p-2 rounded bg-[#002b34] text-white font-mono text-center"
      />
      <button
        className="
          px-6 py-3 rounded-xl
          bg-[#FF7043] text-[#003B4A] font-bold text-lg
          hover:bg-[#e66135] transition
          shadow-md
        "
        onClick={() => {
          navigator.clipboard.writeText(referralLink);
          alert("Referral link copied!");
        }}
      >
        Copy Link
      </button>
      <div className="mt-6 text-sm opacity-70">
        Next reward at 5 referrals!
      </div>
    </div>
  );
}
