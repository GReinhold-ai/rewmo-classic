// src/pages/index.tsx

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function LandingPage() {
  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [submitted, setSubmitted] = useState(false);

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Replace with real backend/Firestore logic
    setSubmitted(true);
  }

  return (
    <div className="min-h-screen bg-[#003B49] font-sans flex flex-col">
      {/* Navbar */}
      <nav className="w-full flex items-center justify-between px-4 md:px-12 py-2 bg-[#003B49] shadow z-20 relative">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logos/logo.png" alt="Rewmo Logo" width={40} height={40} />
          <span className="text-[#FF9151] font-extrabold text-xl tracking-tight">RewmoAI</span>
        </Link>
        <div className="flex gap-6">
          <Link href="/features" className="text-[#B6E7EB] hover:text-[#FF9151]">Features</Link>
          <Link href="/shopping" className="text-[#B6E7EB] hover:text-[#FF9151]">Shopping</Link>
          <Link href="/lean-lab" className="text-[#B6E7EB] hover:text-[#FF9151]">Lean Lab</Link>
          <Link href="/rewards" className="text-[#B6E7EB] hover:text-[#FF9151]">Rewards</Link>
        </div>
        <button
          className="bg-[#FF9151] text-[#003B49] px-4 py-2 rounded-lg shadow font-bold hover:bg-[#FFA36C]"
          onClick={() => { setModalOpen(true); setPreviewMode(false); setSubmitted(false); }}
        >
          Join Now
        </button>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 w-full flex flex-col items-center px-2">
        <Image
          src="/logos/logo.png"
          alt="Rewmo Logo"
          width={120}
          height={48}
          className="mt-12 mb-4"
          style={{ borderRadius: 0 }}
        />
        <h1 className="text-3xl md:text-5xl font-black text-[#FF9151] text-center mb-2">
          Get Paid to Shop, Save, and Level Up Your Finances
        </h1>
        <p className="text-lg text-white text-center mb-6 max-w-2xl">
          Instant rewards for shopping, smarter process management, and an AI agent that puts your savings on autopilot.
        </p>
        <div className="flex gap-4 mb-12">
          <button
            className="bg-[#FF9151] text-[#003B49] font-bold py-3 px-8 rounded-xl shadow-lg hover:bg-[#FFA36C] transition"
            onClick={() => { setModalOpen(true); setPreviewMode(false); setSubmitted(false); }}
          >
            Join Beta (Full Access)
          </button>
          <button
            className="border-2 border-[#FF9151] text-[#FF9151] font-bold py-3 px-8 rounded-xl shadow-lg hover:bg-[#FFA36C] hover:text-[#003B49] transition"
            onClick={() => { setModalOpen(true); setPreviewMode(true); setSubmitted(false); }}
          >
            Peek Preview (No Signup)
          </button>
        </div>

        {/* Feature Cards */}
        <div className="flex flex-col md:flex-row gap-6 w-full max-w-4xl justify-center">
          {/* Personal Shopping */}
          <div className="bg-white/90 rounded-2xl p-6 flex-1 min-w-[250px] text-center border border-[#FF9151] shadow-lg">
            <h2 className="text-lg font-bold text-[#FF9151] mb-2">Personal Shopping<br />Rewards</h2>
            <div className="flex items-center gap-2 justify-center mb-2">
              <Image src="/brands/amazon.png" alt="Amazon" width={36} height={36} />
              <span className="bg-[#FF9151] text-[#003B49] rounded px-2 py-1 text-xs font-bold">Active</span>
            </div>
            <p className="text-[#003B49] text-base mb-2">
              Earn instant cash back &amp; bonus points on Amazon shopping.<br />
              <span className="text-[#B6E7EB]">Walmart, Target, Apple <b>Coming Soon</b></span>
            </p>
          </div>
          {/* Business Shopping */}
          <div className="bg-white/90 rounded-2xl p-6 flex-1 min-w-[250px] text-center border border-[#15C5C1] shadow-lg">
            <h2 className="text-lg font-bold text-[#15C5C1] mb-2">Business Shopping<br />Rewards</h2>
            <div className="flex items-center gap-2 justify-center mb-2">
              <Image src="/brands/amazon.png" alt="Amazon" width={36} height={36} />
              <span className="bg-[#FF9151] text-[#003B49] rounded px-2 py-1 text-xs font-bold">Active</span>
            </div>
            <p className="text-[#003B49] text-base mb-2">
              Unlock rewards on business essentials &amp; supplies.<br />
              <span className="text-[#B6E7EB]">Staples, Office Depot <b>Coming Soon</b></span>
            </p>
          </div>
          {/* Lean Lab */}
          <div className="bg-[#072b33] rounded-2xl p-6 flex-1 min-w-[250px] text-center border border-[#15C5C1] shadow-lg">
            <h2 className="text-lg font-bold text-[#15C5C1] mb-2">Lean Lab – Process<br />Management</h2>
            <p className="text-[#B6E7EB] mb-2">
              <span className="text-[#FF9151] font-bold">NEW:</span> AI-powered process improvement tools for individuals, families, and small businesses.
            </p>
            <p className="text-[#B6E7EB] text-base">
              Map daily habits, spot hidden waste, streamline your shopping, and unlock continuous financial improvement—all with an AI coach in your pocket.
            </p>
            <Link href="/lean-lab" className="underline text-[#15C5C1] font-semibold hover:text-[#FFA36C] mt-2 inline-block">
              Explore Lean Lab →
            </Link>
          </div>
        </div>
      </main>

      {/* Modal: Beta Signup / Preview */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-[#003B49] border-2 border-[#15C5C1] rounded-2xl max-w-md w-full p-8 shadow-2xl flex flex-col items-center relative">
            <button
              className="absolute top-4 right-4 text-2xl text-[#FF9151] hover:text-[#FFA36C] font-black"
              onClick={() => setModalOpen(false)}
            >×</button>
            {!submitted ? (
              !previewMode ? (
                <>
                  <h2 className="text-2xl font-bold text-[#FF9151] mb-2 text-center">Join RewmoAI Beta</h2>
                  <p className="text-[#B6E7EB] text-center mb-6">
                    Get full access to rewards and advanced features. <br />
                    No Google/Apple login required—just join with your info.
                  </p>
                  <form className="w-full" onSubmit={handleSubmit}>
                    <input
                      name="name"
                      type="text"
                      required
                      placeholder="Full Name"
                      value={form.name}
                      onChange={handleInput}
                      className="w-full mb-3 p-3 rounded-lg border border-[#15C5C1] bg-[#072b33] text-white"
                    />
                    <input
                      name="email"
                      type="email"
                      required
                      placeholder="Email"
                      value={form.email}
                      onChange={handleInput}
                      className="w-full mb-3 p-3 rounded-lg border border-[#15C5C1] bg-[#072b33] text-white"
                    />
                    <input
                      name="phone"
                      type="tel"
                      placeholder="Phone (optional)"
                      value={form.phone}
                      onChange={handleInput}
                      className="w-full mb-4 p-3 rounded-lg border border-[#15C5C1] bg-[#072b33] text-white"
                    />
                    <button
                      type="submit"
                      className="w-full bg-[#FF9151] hover:bg-[#FFA36C] text-[#003B49] font-bold py-3 rounded-xl shadow-lg mb-2 transition"
                    >
                      Join Now
                    </button>
                  </form>
                  <button
                    className="underline text-[#15C5C1] mt-3 hover:text-[#FFA36C] text-sm"
                    onClick={() => setPreviewMode(true)}
                  >
                    Or Peek Preview Instead
                  </button>
                </>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-[#15C5C1] mb-2 text-center">Peek Preview Mode</h2>
                  <p className="text-[#B6E7EB] text-center mb-6">
                    Explore RewmoAI features and rewards without signing up. <br />
                    <b className="text-[#FF9151]">Note:</b> Some features require an account to earn rewards.
                  </p>
                  <Link
                    href="/dashboard"
                    className="w-full bg-[#FF9151] hover:bg-[#FFA36C] text-[#003B49] font-bold py-3 rounded-xl shadow-lg mb-3 transition text-center block"
                  >
                    Enter Demo Dashboard →
                  </Link>
                  <button
                    className="underline text-[#15C5C1] hover:text-[#FFA36C] text-sm"
                    onClick={() => setPreviewMode(false)}
                  >
                    Back to Signup
                  </button>
                </>
              )
            ) : (
              <>
                <h2 className="text-2xl font-bold text-[#FF9151] mb-3 text-center">Thanks for joining!</h2>
                <p className="text-[#B6E7EB] mb-3 text-center">
                  Check your email for your invite soon.<br />
                  <span className="text-[#15C5C1]">Want to preview the app? </span>
                </p>
                <button
                  className="w-full bg-[#FF9151] hover:bg-[#FFA36C] text-[#003B49] font-bold py-3 rounded-xl shadow-lg transition"
                  onClick={() => setPreviewMode(true)}
                >
                  Or Peek Preview Instead
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="text-[#F7F6F2] text-xs py-4 text-center border-t border-[#072b33] w-full mt-10">
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
