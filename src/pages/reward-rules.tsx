import React from "react";
import Link from "next/link";

export default function RewardRulesPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#003B49] font-sans text-[#F7F6F2]">
      <main className="flex-1 flex flex-col items-center px-4 py-12">
        <h1 className="text-3xl md:text-5xl font-black mb-6 text-[#FF9151] tracking-tight text-center">
          Reward Rules
        </h1>
        <section className="max-w-2xl bg-[#072b33] rounded-2xl shadow-xl border border-[#15C5C1] p-8 mb-10">
          <ul className="space-y-4 mt-4 text-[#B6E7EB]">
            <li>
              <span className="font-bold text-[#FF9151]">1. </span>
              Earn points for every qualified purchase, rent, or referral.
            </li>
            <li>
              <span className="font-bold text-[#FF9151]">2. </span>
              Points are credited instantly on verified transactions.
            </li>
            <li>
              <span className="font-bold text-[#FF9151]">3. </span>
              Referrals are tracked and rewarded when your friend signs up and completes their first purchase.
            </li>
            <li>
              <span className="font-bold text-[#FF9151]">4. </span>
              Bonus campaigns and multipliers may be added at any time—watch for special promos.
            </li>
            <li>
              <span className="font-bold text-[#FF9151]">5. </span>
              Withdrawals are available after official launch, according to program terms.
            </li>
            <li>
              <span className="font-bold text-[#FF9151]">6. </span>
              All activity is subject to our <Link href="/terms" className="underline hover:text-[#FFA36C] text-[#FF9151]">Terms of Service</Link> and verification for fraud prevention.
            </li>
            <li>
              <span className="font-bold text-[#FF9151]">7. </span>
              For support, contact <a href="mailto:support@rewmo.ai" className="underline hover:text-[#FFA36C] text-[#FF9151]">support@rewmo.ai</a>
            </li>
          </ul>
        </section>
        <Link href="/" className="text-[#15C5C1] font-semibold underline text-base hover:text-[#FFA36C]">
          ← Back to Home
        </Link>
      </main>
    </div>
  );
}
