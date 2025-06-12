// src/pages/index.tsx

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const NAV_LINKS = [
  { label: "Features", href: "/features" },
  { label: "Shopping", href: "/shopping" },
  { label: "Lean Lab", href: "/lean-lab" },
  { label: "Rewards", href: "/rewards" },
  { label: "Sign In", href: "/signin", highlight: true },
];

export default function HomePage() {
  const [navOpen, setNavOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#003B49] font-sans flex flex-col">
      {/* Navbar */}
      <nav className="w-full flex items-center justify-between px-4 md:px-12 py-2 bg-[#003B49] shadow z-20 relative">
        <div className="flex items-center">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logos/logo.png"
              alt="Rewmo Logo"
              width={48}
              height={48}
              className="rounded-none"
              priority
            />
            <span className="text-[#FF9151] font-extrabold text-xl tracking-tight hidden sm:inline">
              RewmoAI
            </span>
          </Link>
        </div>
        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map(({ label, href, highlight }) => (
            <Link
              key={href}
              href={href}
              className={`text-base font-semibold ${
                highlight
                  ? "bg-[#FF9151] text-[#003B49] px-4 py-2 rounded-lg shadow hover:bg-[#FFA36C]"
                  : "text-[#B6E7EB] hover:text-[#FF9151]"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>
        {/* Hamburger for mobile */}
        <button
          className="md:hidden flex items-center p-2"
          aria-label="Toggle navigation"
          onClick={() => setNavOpen((v) => !v)}
        >
          <svg width={32} height={32} fill="none">
            <rect y={7} width={28} height={3} rx={1.5} fill="#FF9151" />
            <rect y={14} width={28} height={3} rx={1.5} fill="#FF9151" />
            <rect y={21} width={28} height={3} rx={1.5} fill="#FF9151" />
          </svg>
        </button>
        {/* Mobile Menu */}
        {navOpen && (
          <div className="absolute top-full left-0 w-full bg-[#003B49] border-t border-[#15C5C1] flex flex-col items-start md:hidden z-50">
            {NAV_LINKS.map(({ label, href, highlight }) => (
              <Link
                key={href}
                href={href}
                className={`w-full px-6 py-3 text-lg font-semibold border-b border-[#072b33] ${
                  highlight
                    ? "bg-[#FF9151] text-[#003B49] rounded-lg my-1 mx-2"
                    : "text-[#B6E7EB] hover:text-[#FF9151]"
                }`}
                onClick={() => setNavOpen(false)}
              >
                {label}
              </Link>
            ))}
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-1 w-full flex flex-col items-center px-2">
        {/* Logo & Headline */}
        <div className="flex flex-col items-center mt-10">
          <Image
            src="/logos/logo.png"
            alt="Rewmo Logo"
            width={160}
            height={72}
            className="mb-3"
            priority
            style={{ borderRadius: 0 }}
          />
          <h1 className="text-3xl md:text-5xl font-black text-[#FF9151] text-center mb-2">
            Welcome to Rewards Mobile AI
          </h1>
          <p className="text-lg md:text-xl text-white text-center max-w-2xl mb-2">
            The AI-powered hub for rewards, savings, and smarter financial growth.
          </p>
          <p className="text-lg text-orange-300 text-center font-semibold mb-4">
            Earn for shopping, referrals, and every dollar you manage smarter.
          </p>
          <Link href="/signup">
            <button className="bg-[#FF9151] hover:bg-[#FFA36C] text-[#003B49] text-lg font-bold py-3 px-8 rounded-xl shadow-lg mb-5 transition">
              Get Started & Earn Now
            </button>
          </Link>
        </div>

        {/* Beta Alert */}
        <div className="w-full max-w-md mx-auto border-2 border-dashed border-[#FF9151] bg-[#072b33] rounded-2xl p-4 mb-6 text-center">
          <p className="text-[#FF9151] font-bold text-lg mb-1">
            &#128308; Beta is LIVE!
          </p>
          <p className="text-white font-semibold mb-0">
            Your rewards and referrals are being tracked.<br />
            Withdrawals open after launch.<br />
            All points follow the{" "}
            <Link href="/reward-rules" className="underline text-[#15C5C1] hover:text-[#FFA36C]">Reward Rules</Link>.
          </p>
        </div>

        {/* Features Section */}
        <div className="flex flex-col md:flex-row gap-6 w-full max-w-3xl mb-8 justify-center">
          {/* Personal Shopping Rewards */}
          <div className="bg-white/90 rounded-2xl p-6 flex-1 text-center border border-[#FF9151] shadow-lg">
            <h2 className="text-xl font-bold text-[#FF9151] mb-2">Personal Shopping Rewards</h2>
            <p className="text-[#003B49] text-base mb-2">
              Earn instant cash back & bonus points when you shop your favorite brands.<br />
              Simple, secure, automatic savings—groceries, Amazon, and more!
            </p>
            <Link href="/shopping?type=personal" className="underline text-[#15C5C1] font-semibold hover:text-[#FFA36C]">
              See eligible stores →
            </Link>
          </div>
          {/* Business Shopping Rewards */}
          <div className="bg-white/90 rounded-2xl p-6 flex-1 text-center border border-[#15C5C1] shadow-lg">
            <h2 className="text-xl font-bold text-[#15C5C1] mb-2">Business Shopping Rewards</h2>
            <p className="text-[#003B49] text-base mb-2">
              Unlock rewards on business essentials, supplies, bulk orders.<br />
              Streamline expense tracking, earn more for your business!
            </p>
            <Link href="/shopping?type=business" className="underline text-[#FF9151] font-semibold hover:text-[#15C5C1]">
              Shop for your business →
            </Link>
          </div>
        </div>

        {/* Lean Lab Feature */}
        <div className="w-full max-w-2xl bg-[#072b33] rounded-2xl border border-[#15C5C1] p-6 mb-10 text-center shadow">
          <h3 className="text-xl font-bold text-[#15C5C1] mb-2">Lean Lab – RewmoAI Process Management</h3>
          <p className="text-[#B6E7EB] mb-1">
            <span className="font-bold text-[#FF9151]">NEW:</span> AI-powered process improvement tools for individuals <b>and</b> small businesses. Map your routines, eliminate waste, and unlock continuous improvement.
          </p>
          <Link href="/lean-lab" className="underline text-[#15C5C1] font-semibold hover:text-[#FFA36C]">
            Learn about Lean Lab →
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-[#F7F6F2] text-xs py-4 text-center border-t border-[#072b33] w-full">
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
