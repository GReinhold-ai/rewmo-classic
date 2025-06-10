import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/lib/AuthProvider";

function Navbar() {
  const { currentUser, logout } = useAuth();

  return (
    <nav className="w-full bg-[#003B49] border-b border-[#072b33] px-4 py-3 flex items-center justify-between">
      {/* Logo + Brand */}
      <div className="flex items-center gap-2">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logos/logo.png" alt="Rewmo Logo" width={50} height={50} style={{ borderRadius: 0 }} />
          <span className="text-[#FF9151] text-xl font-black ml-1">RewmoAI</span>
        </Link>
      </div>
      {/* Nav Links */}
      <div className="flex gap-5 items-center">
        <Link href="/dashboard" className="text-white hover:text-[#15C5C1] font-semibold">Dashboard</Link>
        <Link href="/features" className="text-white hover:text-[#15C5C1] font-semibold">Features</Link>
        <Link href="/shopping" className="text-white hover:text-[#15C5C1] font-semibold">Shopping</Link>
        <Link href="/rewards" className="text-white hover:text-[#15C5C1] font-semibold">Rewards</Link>
        <Link href="/lean-lab" className="text-white hover:text-[#15C5C1] font-semibold">Lean Lab</Link>
        {currentUser ? (
          <>
            <Link href="/profile" className="text-white hover:text-[#FF9151] font-semibold">Profile</Link>
            <button
              onClick={logout}
              className="ml-2 bg-[#FF9151] hover:bg-[#FFA36C] text-[#003B49] font-bold px-4 py-1 rounded transition"
            >
              Sign Out
            </button>
          </>
        ) : (
          <Link
            href="/signin"
            className="ml-2 bg-[#FF9151] hover:bg-[#FFA36C] text-[#003B49] font-bold px-4 py-1 rounded transition"
          >
            Sign In
          </Link>
        )}
      </div>
    </nav>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#003B49] flex flex-col items-center font-sans px-2">
      <Navbar />
      {/* --- Centered Logo --- */}
      <div className="flex justify-center mt-8">
        <Image
          src="/logos/logo.png"
          alt="Rewmo Logo"
          width={160}
          height={72}
          className="mb-3"
          priority
          style={{ borderRadius: 0 }}
        />
      </div>

      {/* --- Welcome Headline & Tagline --- */}
      <h1 className="text-4xl md:text-5xl font-black text-[#FF9151] text-center mt-2 mb-2">
        Welcome to Rewards Mobile AI
      </h1>
      <p className="text-lg md:text-xl text-white text-center max-w-2xl mb-2">
        The AI-powered hub for rewards, savings, and smarter financial growth.
      </p>
      <p className="text-lg text-orange-300 text-center font-semibold mb-4">
        Earn for shopping, referrals, and every dollar you manage smarter.
      </p>

      {/* --- Call-to-Action Button --- */}
      <button
        className="bg-[#FF9151] hover:bg-[#FFA36C] text-[#003B49] text-lg font-bold py-3 px-8 rounded-xl shadow-lg mb-5 transition"
        onClick={() => window.location.href = "/signup"}
      >
        Get Started & Earn Now
      </button>

      {/* --- Beta Live Alert Box --- */}
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

      {/* --- Features: Personal, Business, Lean Lab --- */}
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

      {/* --- Lean Lab --- */}
      <div className="w-full max-w-2xl bg-[#072b33] rounded-2xl border border-[#15C5C1] p-6 mb-10 text-center shadow">
        <h3 className="text-xl font-bold text-[#15C5C1] mb-2">Lean Lab – RewmoAI Process Management</h3>
        <p className="text-[#B6E7EB] mb-1">
          <span className="font-bold text-[#FF9151]">NEW:</span> AI-powered process improvement tools for individuals <b>and</b> small businesses. Map your routines, eliminate waste, and unlock continuous improvement.
        </p>
        <Link href="/lean-lab" className="underline text-[#15C5C1] font-semibold hover:text-[#FFA36C]">
          Learn about Lean Lab →
        </Link>
      </div>

      {/* --- Footer --- */}
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
