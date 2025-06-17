import React from "react";
import Link from "next/link";

export default function PreviewPage() {
  return (
    <div className="min-h-screen bg-[#003B49] flex flex-col items-center justify-center px-4 py-12 font-sans">
      <div className="max-w-xl w-full bg-[#072b33] border border-[#15C5C1] rounded-2xl p-8 shadow-lg text-center">
        <h1 className="text-2xl font-bold text-[#FF9151] mb-2">Peek Preview: RewmoAI Demo</h1>
        <p className="text-[#B6E7EB] mb-6">
          Explore how you can earn rewards for shopping, referrals, and process improvements—no sign-in needed!<br />
          <span className="text-[#15C5C1] font-semibold">Live rewards, referral, and Lean Lab tools previewed below.</span>
        </p>
        <div className="rounded-lg bg-[#003B49] p-6 border border-[#15C5C1] mb-4">
          <h2 className="text-lg font-bold text-[#FF9151] mb-1">Dashboard Sample</h2>
          <ul className="text-[#B6E7EB] mb-2 text-left ml-2">
            <li>• Shopping Rewards: <b className="text-[#15C5C1]">+150 pts (Amazon)</b></li>
            <li>• Referrals: <b className="text-[#15C5C1]">3 joined</b></li>
            <li>• Process Saved: <b className="text-[#15C5C1]">+$120/mo</b></li>
          </ul>
        </div>
        <p className="text-[#B6E7EB] mt-3">
          <Link href="/signup" className="text-[#FF9151] font-bold underline">
            Like it? Get full access & real rewards →
          </Link>
        </p>
      </div>
    </div>
  );
}
