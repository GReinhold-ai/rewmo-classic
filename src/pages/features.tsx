// src/pages/features.tsx

import React from "react";
import Link from "next/link";

export default function FeaturesPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#003B49] font-sans">
      {/* Nav */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-[#072b33] bg-[#003B49]">
        <div className="flex items-center space-x-3">
          <img
            src="/rewmo-logo.png"
            alt="RewmoAI Logo"
            className="h-10 w-auto"
          />
          <span className="text-[#FF9151] font-black text-2xl tracking-tight">
            RewmoAI
          </span>
        </div>
        <nav className="space-x-6">
          <Link href="/" className="text-[#15C5C1] font-semibold hover:underline">
            Home
          </Link>
          <Link href="/features" className="text-[#FFA36C] font-bold underline">
            Features
          </Link>
          <Link href="/lean-lab" className="text-[#15C5C1] font-semibold hover:underline">
            LeanAI Lab
          </Link>
          <Link href="/about" className="text-[#15C5C1] font-semibold hover:underline">
            About
          </Link>
        </nav>
      </header>

      {/* Main */}
      <main className="flex flex-col flex-1 items-center px-4 pt-8 pb-16">
        <h1 className="text-4xl font-extrabold text-[#FF9151] mb-8 text-center">
          Features
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
          {/* Feature: Affiliate Shopping Rewards */}
          <div className="bg-[#072b33] rounded-2xl shadow-md border border-[#15C5C1] p-6">
            <h2 className="text-2xl font-bold text-[#FFA36C] mb-2">Affiliate Shopping Rewards</h2>
            <p className="text-[#B6E7EB] mb-4">
              Earn rewards for your personal and business shopping, both online and in-store. Get exclusive offers and maximize your savings with RewmoAI partner merchants.
            </p>
            <Link
              href="/shopping"
              className="inline-block bg-[#FF9151] text-[#003B49] px-5 py-2 rounded-xl font-bold hover:bg-[#FFA36C] transition"
            >
              Shop & Earn
            </Link>
          </div>

          {/* Feature: LeanAI Lab */}
          <div className="bg-[#072b33] rounded-2xl shadow-md border border-[#15C5C1] p-6">
            <h2 className="text-2xl font-bold text-[#FFA36C] mb-2">LeanAI Lab</h2>
            <p className="text-[#B6E7EB] mb-4">
              Your interactive toolkit for learning process management and quality improvement. Discover how to reduce waste, boost efficiency, and build great financial habits—powered by Total Quality Management.
            </p>
            <Link
              href="/lean-lab"
              className="inline-block bg-[#15C5C1] text-[#003B49] px-5 py-2 rounded-xl font-bold hover:bg-[#FFA36C] transition"
            >
              Try LeanAI Lab
            </Link>
          </div>

          {/* Feature: Business Rewards */}
          <div className="bg-[#072b33] rounded-2xl shadow-md border border-[#15C5C1] p-6">
            <h2 className="text-2xl font-bold text-[#FFA36C] mb-2">Business Shopping Rewards</h2>
            <p className="text-[#B6E7EB] mb-4">
              Small businesses can now earn rewards on qualifying purchases and services. Boost your bottom line with cashback, bonuses, and tailored offers for your company.
            </p>
            <Link
              href="/shopping?tab=business"
              className="inline-block bg-[#FF9151] text-[#003B49] px-5 py-2 rounded-xl font-bold hover:bg-[#FFA36C] transition"
            >
              Business Rewards
            </Link>
          </div>

          {/* Feature: More Coming Soon */}
          <div className="bg-[#072b33] rounded-2xl shadow-md border border-[#15C5C1] p-6">
            <h2 className="text-2xl font-bold text-[#FFA36C] mb-2">And More Coming Soon…</h2>
            <p className="text-[#B6E7EB] mb-4">
              We’re just getting started! Watch for new features like reward history, gamified goals, deeper AI automation, and financial education modules.
            </p>
            <span className="inline-block bg-[#FFA36C] text-[#003B49] px-5 py-2 rounded-xl font-bold cursor-default opacity-80">
              Stay Tuned
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}
