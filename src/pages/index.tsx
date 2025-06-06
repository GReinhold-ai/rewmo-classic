import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#003B49] font-sans flex flex-col items-center">
      <main className="w-full flex flex-col items-center px-4 py-10">
        <Image
          src="/logos/logo.png"
          alt="RewmoAI Logo"
          width={120}
          height={120}
          className="mb-5 mx-auto rounded-2xl border-4 border-[#FF9151] shadow-lg"
        />
        <h1 className="text-4xl md:text-5xl font-black mb-2 text-[#FF9151] text-center">
          Welcome to Rewards Mobile AI
        </h1>
        <p className="text-lg md:text-xl text-[#B6E7EB] mb-3 text-center max-w-2xl">
          The AI-powered hub for rewards, savings, and smarter financial growth—for individuals, families, and businesses.
        </p>
        <p className="text-base font-bold text-[#FF9151] mb-4 text-center">
          Unlock instant rewards every time you shop, manage your spending, or improve your workflow!
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <Link href="/signup">
            <button className="px-7 py-3 bg-[#FF9151] hover:bg-[#FFA36C] text-[#003B49] font-bold rounded-xl shadow transition">
              Get Started Free
            </button>
          </Link>
          <Link href="/shopping">
            <button className="px-7 py-3 bg-[#15C5C1] hover:bg-[#FFA36C] text-[#003B49] font-bold rounded-xl shadow transition">
              Shop Now
            </button>
          </Link>
        </div>

        {/* Beta Info */}
        <div className="mb-8">
          <div className="inline-block px-6 py-4 bg-[#072b33] rounded-2xl border border-[#15C5C1] text-center shadow">
            <p className="text-[#FF9151] font-bold mb-1">🚀 Beta is LIVE!</p>
            <p className="text-[#B6E7EB] text-sm">
              Your rewards and referrals are being tracked.<br />
              Withdrawals open after launch.<br />
              All points follow the <Link href="/reward-rules" className="underline text-[#15C5C1] hover:text-[#FFA36C]">Reward Rules</Link>.
            </p>
          </div>
        </div>

        {/* New Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 w-full max-w-3xl">
          {/* Personal Shopping Rewards */}
          <div className="bg-white/95 rounded-2xl shadow-xl px-7 py-7 text-center border-2 border-[#FF9151] flex flex-col items-center">
            <Image src="/icons/personal-shop.svg" alt="Personal Rewards" width={40} height={40} className="mb-2" />
            <h2 className="font-extrabold text-lg text-[#003B49] mb-1">Personal Shopping Rewards</h2>
            <p className="text-[#003B49]">
              Earn instant cash back & bonus points when you shop your favorite brands.<br />
              Simple, secure, automatic savings—everyday purchases, groceries, Amazon, and more!
            </p>
            <Link href="/shopping" className="mt-3 inline-block text-[#15C5C1] font-semibold hover:underline">
              See eligible stores →
            </Link>
          </div>
          {/* Business Shopping Rewards */}
          <div className="bg-white/95 rounded-2xl shadow-xl px-7 py-7 text-center border-2 border-[#15C5C1] flex flex-col items-center">
            <Image src="/icons/business-shop.svg" alt="Business Rewards" width={40} height={40} className="mb-2" />
            <h2 className="font-extrabold text-lg text-[#003B49] mb-1">Business Shopping Rewards</h2>
            <p className="text-[#003B49]">
              Unlock exclusive rewards on business essentials, supplies, and bulk orders.<br />
              Streamline expense tracking, earn more on every transaction—perfect for startups, teams, and entrepreneurs!
            </p>
            <Link href="/shopping?tab=business" className="mt-3 inline-block text-[#15C5C1] font-semibold hover:underline">
              Shop for your business →
            </Link>
          </div>
          {/* Lean Lab / Process Management */}
          <div className="col-span-1 md:col-span-2 bg-[#072b33] rounded-2xl shadow-xl px-7 py-7 text-center border-2 border-[#15C5C1] flex flex-col items-center mt-2">
            <Image src="/icons/lean-lab.svg" alt="Lean Lab" width={40} height={40} className="mb-2" />
            <h2 className="font-extrabold text-lg text-[#15C5C1] mb-1">Lean Lab – RewmoAI Process Management</h2>
            <p className="text-[#B6E7EB] max-w-xl mx-auto mb-2">
              <span className="font-semibold text-[#FF9151]">NEW:</span> AI-powered process improvement tools for <span className="font-bold text-[#FF9151]">individuals and small businesses</span>.
              Map your routines, eliminate waste, and unlock continuous improvement.<br />
              Get practical, step-by-step guidance and earn rewards for every improvement—at home or at work!
            </p>
            <Link href="/lean-lab" className="mt-2 inline-block text-[#15C5C1] font-semibold hover:underline">
              Learn about Lean Lab →
            </Link>
          </div>
        </div>

        {/* Optional: Announcement/CTA */}
        <div className="text-center mt-6 text-[#B6E7EB]">
          <span className="italic">
            Coming soon: Even more rewards, group challenges, and advanced AI financial tools.
          </span>
        </div>
      </main>
      <footer className="w-full text-[#F7F6F2] text-xs py-4 text-center border-t border-[#072b33] bg-[#003B49]">
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
