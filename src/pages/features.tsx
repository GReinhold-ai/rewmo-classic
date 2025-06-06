import React from "react";
import Link from "next/link";

export default function FeaturesPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#003B49] font-sans">
      <main className="flex-1 flex flex-col items-center px-4 py-14">
        <h1 className="text-3xl md:text-5xl font-black mb-12 text-[#FF9151] tracking-tight text-center">
          Features
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl w-full">
          {/* Shopping Rewards */}
          <div className="bg-[#072b33] rounded-2xl p-6 shadow-xl border border-[#15C5C1]">
            <h2 className="text-xl font-bold mb-3 text-[#FF9151]">Affiliate Shopping Rewards</h2>
            <p className="text-[#B6E7EB] mb-4">
              Earn rewards for your personal and business shopping, both online and in-store. Get exclusive offers and maximize your savings with RewmoAI partner merchants.
            </p>
            <Link href="/shopping">
              <button className="bg-[#FF9151] text-[#003B49] font-bold px-6 py-2 rounded-xl shadow hover:bg-[#FFA36C] transition-all">
                Shop & Earn
              </button>
            </Link>
          </div>
          {/* Lean Lab */}
          <div className="bg-[#072b33] rounded-2xl p-6 shadow-xl border border-[#15C5C1]">
            <h2 className="text-xl font-bold mb-3 text-[#FF9151]">LeanAI Lab</h2>
            <p className="text-[#B6E7EB] mb-4">
              Your interactive toolkit for learning process management and quality improvement. Discover how to reduce waste, boost efficiency, and build great financial habits—powered by Total Quality Management.
            </p>
            <Link href="/lean-lab">
              <button className="bg-[#15C5C1] text-[#003B49] font-bold px-6 py-2 rounded-xl border border-[#FF9151] hover:bg-[#FFA36C] hover:text-[#003B49] transition-all">
                Try LeanAI Lab
              </button>
            </Link>
          </div>
          {/* Business Shopping Rewards */}
          <div className="bg-[#072b33] rounded-2xl p-6 shadow-xl border border-[#15C5C1]">
            <h2 className="text-xl font-bold mb-3 text-[#FF9151]">Business Shopping Rewards</h2>
            <p className="text-[#B6E7EB] mb-4">
              Small businesses can now earn rewards on qualifying purchases and services. Boost your bottom line with cashback, bonuses, and tailored offers for your company.
            </p>
            <Link href="/shopping?business=true">
              <button className="bg-[#FF9151] text-[#003B49] font-bold px-6 py-2 rounded-xl shadow hover:bg-[#FFA36C] transition-all">
                Business Rewards
              </button>
            </Link>
          </div>
          {/* Coming Soon */}
          <div className="bg-[#072b33] rounded-2xl p-6 shadow-xl border border-[#15C5C1]">
            <h2 className="text-xl font-bold mb-3 text-[#FF9151]">And More Coming Soon…</h2>
            <p className="text-[#B6E7EB] mb-4">
              We’re just getting started! Watch for new features like reward history, gamified goals, deeper AI automation, and financial education modules.
            </p>
            <button className="bg-[#FFA36C] text-[#003B49] font-bold px-6 py-2 rounded-xl shadow cursor-not-allowed opacity-80">
              Stay Tuned
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
