import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#003B49] font-sans">
      {/* Header/Logo */}
      <header className="flex flex-col items-center justify-center pt-10 pb-4">
        <Image
          src="/logos/logo.png"
          alt="RewmoAI Logo"
          width={160}
          height={160}
          className="rounded-full border-4 border-[#FF9151] shadow-xl mb-4"
          priority
        />
        <span className="font-extrabold text-3xl md:text-4xl tracking-tight text-[#FF9151] mb-2">
          RewmoAI
        </span>
      </header>

      {/* Hero Section */}
      <main className="flex flex-col items-center justify-center flex-grow px-4 py-8 text-center">
        <h1 className="text-3xl md:text-5xl font-black mb-5 tracking-tight">
          <span className="text-[#FF9151]">Earn rewards</span> on every purchase.<br className="hidden md:block" />
          <span className="text-[#15C5C1]">Save more by working smarter.</span>
        </h1>
        <p className="text-lg md:text-2xl text-[#B6E7EB] max-w-2xl mb-8">
          Get instant cash back on what you buy—plus, use our Lean Lab toolkit to reduce waste and maximize your savings at home and in your business.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mb-10">
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

        {/* Section Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mb-10">
          <div className="bg-[#072b33] rounded-2xl p-6 shadow-xl border border-[#15C5C1]">
            <h2 className="text-xl font-bold mb-3 text-[#FF9151]">Personal Shopping Rewards</h2>
            <ul className="text-left text-[#B6E7EB] space-y-2 text-base">
              <li>• Earn cash back for yourself</li>
              <li>• Shop top brands (Amazon, Walmart, Target, more)</li>
              <li>• Track and redeem your rewards</li>
            </ul>
          </div>
          <div className="bg-[#072b33] rounded-2xl p-6 shadow-xl border border-[#15C5C1]">
            <h2 className="text-xl font-bold mb-3 text-[#FF9151]">Business Shopping Rewards</h2>
            <ul className="text-left text-[#B6E7EB] space-y-2 text-base">
              <li>• Rewards on business spending (supplies, SaaS, travel)</li>
              <li>• Works for freelancers, teams & SMBs</li>
              <li>• Simple onboarding—start earning today</li>
            </ul>
          </div>
        </div>

        {/* Lean Lab CTA */}
        <Link href="/lean-lab" className="text-[#15C5C1] font-semibold underline text-lg mb-8 hover:text-[#FFA36C]">
          Learn about Lean Lab →
        </Link>

        {/* Coming Soon */}
        <div className="text-[#F7F6F2] text-base mt-2 italic">
          Coming soon: Waste Tracker, Improvement Sprints, Team Collaboration
        </div>
      </main>

      {/* Footer */}
      <footer className="text-[#F7F6F2] text-xs py-4 text-center border-t border-[#072b33] bg-[#003B49]">
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
