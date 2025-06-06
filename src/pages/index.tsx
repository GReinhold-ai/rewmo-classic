// src/pages/index.tsx

import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#003B49] font-sans">
      {/* Logo and Greeting */}
      <div className="flex flex-col items-center mt-12 mb-8">
        {/* Main logo (adjust path as needed) */}
        <Image
          src="/logos/logo.png" // Or "/rewmo-logo.png" if that's your correct file!
          alt="RewmoAI Logo"
          width={90}
          height={90}
          className="mb-4 rounded-2xl shadow-xl"
        />
        <h1 className="text-3xl md:text-4xl font-black text-[#FF9151] text-center mb-2">
          Welcome to Rewards Mobile AI
        </h1>
        <div className="text-lg md:text-xl text-[#F7F6F2] text-center font-semibold mb-2">
          The AI-powered hub for rewards, savings, and smarter financial growth.
        </div>
        <div className="text-[#FF9151] font-bold text-base md:text-lg text-center mb-4">
          Earn for shopping, referrals, and every dollar you manage smarter.
        </div>
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <Link href="/signup">
            <button className="bg-[#FF9151] text-[#003B49] font-bold px-8 py-3 rounded-xl shadow-xl hover:bg-[#FFA36C] hover:text-[#003B49] transition-all text-lg">
              Get Started Free
            </button>
          </Link>
          <Link href="/shopping">
            <button className="bg-[#15C5C1] text-[#003B49] font-bold px-8 py-3 rounded-xl border border-[#FF9151] hover:bg-[#FFA36C] hover:text-[#003B49] transition-all text-lg">
              Shop Now
            </button>
          </Link>
        </div>
      </div>

      {/* Beta/Info Banner */}
      <div className="flex justify-center mb-6">
        <div className="bg-[#ff915114] border border-[#FF9151] rounded-xl px-6 py-3 max-w-xl text-center">
          <span className="font-semibold text-[#FF9151]">🚀 Beta is LIVE!</span>
          <br />
          <span className="text-[#B6E7EB]">
            Your rewards and referrals are being tracked.<br />
            Withdrawals open after launch.<br />
            All points follow the{" "}
            <Link href="/rules" className="underline text-[#15C5C1]">
              Reward Rules
            </Link>.
          </span>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-7 px-2 max-w-3xl mx-auto mb-10">
        <div className="bg-[#F7F6F2] rounded-2xl shadow-xl border border-[#15C5C1] flex flex-col items-center p-7">
          <span className="text-3xl mb-3">🎁</span>
          <div className="text-lg font-extrabold text-[#003B49] mb-1">Earn as You Spend</div>
          <div className="text-[#003B49] text-base text-center mb-1">
            Shop, pay rent, or refer friends—every action earns you points. Simple, automatic, and instant.
          </div>
        </div>
        <div className="bg-[#F7F6F2] rounded-2xl shadow-xl border border-[#15C5C1] flex flex-col items-center p-7">
          <span className="text-3xl mb-3">🤖</span>
          <div className="text-lg font-extrabold text-[#003B49] mb-1">AI Smart Suggestions</div>
          <div className="text-[#003B49] text-base text-center mb-1">
            RewmoAI finds new ways to maximize your rewards and savings every day.
          </div>
        </div>
        <div className="bg-[#F7F6F2] rounded-2xl shadow-xl border border-[#15C5C1] flex flex-col items-center p-7">
          <span className="text-3xl mb-3">🏆</span>
          <div className="text-lg font-extrabold text-[#003B49] mb-1">Real-Time Tracking</div>
          <div className="text-[#003B49] text-base text-center mb-1">
            See your progress, bonus milestones, and referral growth instantly.
          </div>
        </div>
        <div className="bg-[#F7F6F2] rounded-2xl shadow-xl border border-[#15C5C1] flex flex-col items-center p-7">
          <span className="text-3xl mb-3">💎</span>
          <div className="text-lg font-extrabold text-[#003B49] mb-1">Tiered Benefits</div>
          <div className="text-[#003B49] text-base text-center mb-1">
            Level up your rewards the longer you save or the more friends you invite.
          </div>
        </div>
      </div>

      {/* Learn More / Lean Lab CTA */}
      <div className="flex justify-center mb-8">
        <Link href="/lean-lab" className="text-[#15C5C1] font-semibold underline text-lg hover:text-[#FFA36C]">
          Learn about Lean Lab →
        </Link>
      </div>

      {/* Coming Soon */}
      <div className="text-[#F7F6F2] text-base text-center mb-6 italic">
        Coming soon: Waste Tracker, Improvement Sprints, Team Collaboration
      </div>

      {/* Footer */}
      <footer className="text-[#F7F6F2] text-xs py-4 text-center border-t border-[#072b33] bg-[#003B49] mt-auto">
        <span>
          © {new Date().getFullYear()} RewmoAI |{" "}
          <Link href="/affiliate-disclosure" className="underline hover:text-[#FFA36C] text-[#FF9151]">Affiliate Disclosure</Link> |{" "}
          <Link href="/privacy" className="underline hover:text-[#FFA36C] text-[#FF9151]">Privacy</Link> |{" "}
          <Link href="/terms" className="underline hover:text-[#FFA36C] text-[#FF9151]">Terms</Link>
        </span>
      </footer>
    </div>
  );
}
