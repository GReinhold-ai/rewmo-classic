import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  const [showPreview, setShowPreview] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [submitted, setSubmitted] = useState(false);

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
  setForm({ ...form, [e.target.name]: e.target.value });
}

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();
  // ...
}

  return (
    <div className="min-h-screen bg-[#003B49] font-sans flex flex-col">
      {/* Navbar */}
      <nav className="w-full flex items-center justify-between px-4 md:px-12 py-2 bg-[#003B49] shadow z-20">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logos/logo.png" alt="Rewmo Logo" width={48} height={48} />
          <span className="text-[#FF9151] font-extrabold text-xl tracking-tight hidden sm:inline">
            RewmoAI
          </span>
        </Link>
      </nav>

      {/* Main Content */}
      <main className="flex-1 w-full flex flex-col items-center px-2">
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
        </div>

        {/* --- Google warning --- */}
        <div className="w-full max-w-md mx-auto mt-4 bg-[#ff915119] border border-[#FF9151] text-[#FF9151] rounded-2xl px-5 py-3 mb-4 text-center font-semibold shadow">
          Having trouble with Google sign-in?  
          <br />
          <span className="text-[#F7F6F2] font-normal">
            Use your email below, or <b>preview the app</b> without signing up.
          </span>
        </div>

        {/* --- Simple Signup --- */}
        {!submitted && (
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-md bg-[#072b33] rounded-2xl border border-[#15C5C1] px-8 py-8 mb-6 shadow-md flex flex-col gap-4"
          >
            <h2 className="text-xl font-bold text-[#15C5C1] mb-2">Sign up for Beta Access</h2>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleInput}
              placeholder="Full Name"
              required
              className="rounded-md px-4 py-2 border border-[#15C5C1] bg-[#003B49] text-white"
            />
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleInput}
              placeholder="Email"
              required
              className="rounded-md px-4 py-2 border border-[#15C5C1] bg-[#003B49] text-white"
            />
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleInput}
              placeholder="Phone (optional)"
              className="rounded-md px-4 py-2 border border-[#15C5C1] bg-[#003B49] text-white"
            />
            <button
              type="submit"
              className="bg-[#FF9151] hover:bg-[#FFA36C] text-[#003B49] text-lg font-bold py-3 px-8 rounded-xl shadow-lg transition"
            >
              Join Now
            </button>
          </form>
        )}
        {submitted && (
          <div className="w-full max-w-md text-center bg-[#072b33] rounded-2xl p-6 border border-[#15C5C1] shadow text-[#15C5C1] font-bold">
            Thank you for joining!  
            <br />You’ll get early access and double rewards as a Founding Member.
          </div>
        )}

        {/* --- Or preview app --- */}
        <div className="w-full max-w-md text-center mt-2 mb-8">
          <button
            className="underline text-[#15C5C1] hover:text-[#FFA36C] font-semibold text-lg"
            onClick={() => setShowPreview(true)}
            disabled={showPreview}
          >
            Peek Preview (No Signup)
          </button>
        </div>

        {/* --- Preview: show read-only feature cards --- */}
        {showPreview && (
          <div className="flex flex-col md:flex-row gap-6 w-full max-w-3xl mb-8 justify-center">
            <div className="bg-white/90 rounded-2xl p-6 flex-1 text-center border border-[#FF9151] shadow-lg">
              <h2 className="text-xl font-bold text-[#FF9151] mb-2">Personal Shopping Rewards</h2>
              <p className="text-[#003B49] text-base mb-2">
                Earn instant cash back & bonus points when you shop your favorite brands.
                Simple, secure, automatic savings—groceries, Amazon, and more!
              </p>
            </div>
            <div className="bg-white/90 rounded-2xl p-6 flex-1 text-center border border-[#15C5C1] shadow-lg">
              <h2 className="text-xl font-bold text-[#15C5C1] mb-2">Business Shopping Rewards</h2>
              <p className="text-[#003B49] text-base mb-2">
                Unlock rewards on business essentials, supplies, bulk orders. Streamline expense tracking, earn more for your business!
              </p>
            </div>
            <div className="bg-[#072b33] rounded-2xl border border-[#15C5C1] p-6 text-center shadow">
              <h3 className="text-xl font-bold text-[#15C5C1] mb-2">Lean Lab – Process Management</h3>
              <p className="text-[#B6E7EB] mb-1">
                NEW: AI-powered process improvement tools for individuals and small businesses. Map your routines, eliminate waste, and unlock continuous improvement.
              </p>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="text-[#F7F6F2] text-xs py-4 text-center border-t border-[#072b33] w-full">
          <span>
            © {new Date().getFullYear()} RewmoAI |{" "}
            <Link href="/affiliate-disclosure" className="underline hover:text-[#FFA36C] text-[#FF9151]">Affiliate Disclosure</Link> |{" "}
            <Link href="/privacy" className="underline hover:text-[#FFA36C] text-[#FF9151]">Privacy</Link> |{" "}
            <Link href="/terms" className="underline hover:text-[#FFA36C] text-[#FF9151]">Terms</Link>
          </span>
        </footer>
      </main>
    </div>
  );
}
