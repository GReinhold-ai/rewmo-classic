// src/pages/index.tsx
import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen flex flex-col items-center px-4 py-10 bg-[#07404A] text-white">
      {/* Logo */}
      <Image
        src="/logos/logo.png"
        alt="RewmoAI Logo"
        width={110}
        height={48}
        className="mb-4 mt-2 rounded-full"
        priority
      />

      {/* Headline */}
      <h1 className="text-3xl md:text-4xl font-extrabold mb-2 text-[#FF9151] text-center drop-shadow">
        Welcome to Rewards Mobile AI
      </h1>
      <p className="text-center max-w-xl text-base mb-2 font-medium">
        The AI-powered hub for rewards, savings, and smarter financial growth.
      </p>
      <p className="mb-5 text-center max-w-xl text-lg text-[#FF9151] font-semibold">
        Earn for shopping, referrals, and every dollar you manage smarter.
      </p>

      {/* CTA */}
      <button
        className="px-8 py-3 rounded-2xl bg-[#FF9151] hover:bg-[#FFA36C] transition font-bold text-lg text-white shadow-lg mb-4"
        onClick={() => window.location.href = "/signup"}
      >
        Get Started &amp; Earn Now
      </button>

      {/* Beta is LIVE! Callout */}
      <div className="w-full max-w-md mb-8">
        <div className="border-2 border-dashed border-[#FF9151] rounded-xl px-4 py-3 bg-[#FF915114] text-center text-base shadow-sm font-semibold">
          <span className="inline-flex items-center gap-1">
            <svg width={16} height={16} fill="#15C5C1" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" /></svg>
            <span className="text-[#FF7043] font-bold">Beta is LIVE!</span>
          </span>
          <br />
          Your rewards and referrals are being tracked.<br />
          Withdrawals open after launch.<br />
          <span className="font-normal text-white">
            All points follow the{" "}
            <Link href="/reward-rules" className="underline text-[#15C5C1] hover:text-[#FF9151]">
              Reward Rules
            </Link>.
          </span>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
        {/* Earn as You Spend */}
        <div className="bg-white/90 rounded-xl shadow-lg p-5 flex flex-col gap-2 text-[#07404A]">
          <span className="text-2xl mb-1">
            <svg width={28} height={28} fill="#FF9151" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" /></svg>
          </span>
          <h2 className="text-lg font-bold">Earn as You Spend</h2>
          <p>
            Shop, pay rent, or refer friends—every action earns you points. Simple, automatic, and instant.
          </p>
        </div>
        {/* AI Smart Suggestions */}
        <div className="bg-white/90 rounded-xl shadow-lg p-5 flex flex-col gap-2 text-[#07404A]">
          <span className="text-2xl mb-1">
            <svg width={28} height={28} fill="#15C5C1" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" /></svg>
          </span>
          <h2 className="text-lg font-bold">AI Smart Suggestions</h2>
          <p>
            RewmoAI finds new ways to maximize your rewards and savings every day.
          </p>
        </div>
        {/* Real-Time Tracking */}
        <div className="bg-white/90 rounded-xl shadow-lg p-5 flex flex-col gap-2 text-[#07404A]">
          <span className="text-2xl mb-1">
            <svg width={28} height={28} fill="#FF9151" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" /></svg>
          </span>
          <h2 className="text-lg font-bold">Real-Time Tracking</h2>
          <p>
            See your rewards, referrals, and transactions update instantly—transparency and control at your fingertips.
          </p>
        </div>
        {/* Tiered Benefits */}
        <div className="bg-white/90 rounded-xl shadow-lg p-5 flex flex-col gap-2 text-[#07404A]">
          <span className="text-2xl mb-1">
            <svg width={28} height={28} fill="#15C5C1" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" /></svg>
          </span>
          <h2 className="text-lg font-bold">Tiered Benefits</h2>
          <p>
            Unlock new perks as you save more, refer more, and grow with Rewmo—your path to VIP status.
          </p>
        </div>
      </div>
    </main>
  );
}
