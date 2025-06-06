import React from "react";
import Link from "next/link";

export default function HowRewardsWork() {
  return (
    <div className="flex flex-col min-h-screen bg-[#003B49] font-sans items-center">
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16 text-center">
        <h1 className="text-3xl md:text-4xl font-black mb-4 text-[#FF9151]">How Shopping Rewards Work</h1>
        <div className="bg-[#072b33] border border-[#15C5C1] rounded-2xl shadow-xl p-8 max-w-lg mb-4">
          <ul className="list-disc text-left text-[#B6E7EB] mb-4 space-y-2">
            <li>Shop through RewmoAI’s links to partner stores.</li>
            <li>Make a qualifying purchase (personal or business).</li>
            <li>Earn instant cashback or reward points—credited to your account automatically.</li>
            <li>Track, redeem, or boost your rewards anytime.</li>
          </ul>
          <div className="text-[#FFA36C] text-base mb-1">It’s that simple! Terms may apply for each partner and offer.</div>
        </div>
        <Link href="/shopping" className="text-[#15C5C1] font-semibold underline text-base hover:text-[#FFA36C]">
          ← Back to Shopping
        </Link>
      </main>
    </div>
  );
}
