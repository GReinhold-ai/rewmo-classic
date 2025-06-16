// src/pages/index.tsx
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const NAV_LINKS = [
  { label: "Features", href: "/features" },
  { label: "Shopping", href: "/shopping" },
  { label: "Lean Lab", href: "/lean-lab" },
  { label: "Rewards", href: "/rewards" },
];

export default function HomePage() {
  const [navOpen, setNavOpen] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [submitted, setSubmitted] = useState(false);

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // TODO: Integrate with backend (or Firestore)
    setSubmitted(true);
  }

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
        <div className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className="text-base font-semibold text-[#B6E7EB] hover:text-[#FF9151]"
            >
              {label}
            </Link>
          ))}
          <button
            className="bg-[#FF9151] text-[#003B49] px-4 py-2 rounded-lg shadow font-bold hover:bg-[#FFA36C] transition"
            onClick={() => setShowSignup(true)}
          >
            Join Now
          </button>
        </div>
        {/* Hamburger */}
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
            {NAV_LINKS.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className="w-full px-6 py-3 text-lg font-semibold border-b border-[#072b33] text-[#B6E7EB] hover:text-[#FF9151]"
                onClick={() => setNavOpen(false)}
              >
                {label}
              </Link>
            ))}
            <button
              className="w-full px-6 py-3 text-lg font-bold bg-[#FF9151] text-[#003B49] rounded-lg my-1 mx-2"
              onClick={() => {
                setShowSignup(true);
                setNavOpen(false);
              }}
            >
              Join Now
            </button>
          </div>
        )}
      </nav>

      {/* Hero Section */}
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
            Get Paid to Shop, Save, and Level Up Your Finances
          </h1>
          <p className="text-lg md:text-xl text-white text-center max-w-2xl mb-2">
            Instant rewards for shopping, smarter process management, and an AI agent that puts your savings on autopilot.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-3 mb-4">
            <button
              className="bg-[#FF9151] hover:bg-[#FFA36C] text-[#003B49] text-lg font-bold py-3 px-8 rounded-xl shadow-lg transition"
              onClick={() => setShowSignup(true)}
            >
              Join Now
            </button>
            <button
              className="bg-transparent border-2 border-[#FF9151] text-[#FF9151] hover:bg-[#FF9151] hover:text-[#003B49] text-lg font-bold py-3 px-8 rounded-xl shadow-lg transition"
              onClick={() => setShowPreview(true)}
            >
              Peek Preview
            </button>
          </div>
          <div className="w-full max-w-md mx-auto border-2 border-dashed border-[#FF9151] bg-[#072b33] rounded-2xl p-4 mb-2 text-center">
            <p className="text-[#FF9151] font-bold text-lg mb-1">
              &#9888; Trouble signing in with Google from social media or mobile? <br />
              <span className="text-white">Try our Email signup, or just use the Peek Preview!</span>
            </p>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="flex flex-col md:flex-row gap-6 w-full max-w-4xl mb-10 mt-6 justify-center items-start">
          {/* Personal Shopping */}
          <div className="bg-white/90 rounded-2xl p-6 flex-1 text-center border border-[#FF9151] shadow-lg min-w-[260px]">
            <h2 className="text-xl font-bold text-[#FF9151] mb-2">Personal Shopping Rewards</h2>
            <div className="flex items-center justify-center gap-3 mb-1">
              <Image src="/brands/amazon.png" alt="Amazon" width={36} height={36} />
              <span className="text-[#003B49] font-semibold">Amazon</span>
              <span className="bg-[#FF9151] text-[#003B49] font-bold px-3 py-1 rounded-xl text-sm">Active</span>
            </div>
            <p className="text-[#003B49] text-base mb-3">
              Earn instant cash back & bonus points on Amazon shopping.<br />
              <span className="text-[#15C5C1]">Walmart, Target, Apple</span> <span className="text-gray-400">Coming Soon</span>
            </p>
          </div>
          {/* Business Shopping */}
          <div className="bg-white/90 rounded-2xl p-6 flex-1 text-center border border-[#15C5C1] shadow-lg min-w-[260px]">
            <h2 className="text-xl font-bold text-[#15C5C1] mb-2">Business Shopping Rewards</h2>
            <div className="flex items-center justify-center gap-3 mb-1">
              <Image src="/brands/amazon.png" alt="Amazon" width={36} height={36} />
              <span className="text-[#003B49] font-semibold">Amazon</span>
              <span className="bg-[#FF9151] text-[#003B49] font-bold px-3 py-1 rounded-xl text-sm">Active</span>
            </div>
            <p className="text-[#003B49] text-base mb-3">
              Unlock rewards on business essentials & supplies.<br />
              <span className="text-[#15C5C1]">Staples, Office Depot</span> <span className="text-gray-400">Coming Soon</span>
            </p>
          </div>
          {/* Lean Lab */}
          <div className="bg-[#072b33] border border-[#15C5C1] rounded-2xl p-6 flex-1 text-center shadow-lg min-w-[280px]">
            <h2 className="text-xl font-bold text-[#15C5C1] mb-2">Lean Lab – Process Management</h2>
            <p className="text-[#B6E7EB] text-base mb-4">
              <span className="text-[#FF9151] font-bold">NEW:</span> Map routines, eliminate waste, and unlock continuous improvement—powered by AI.<br />
              <span className="text-white">For individuals, families, and small businesses. See how your daily habits, business tasks, and shopping can be streamlined for better rewards and less stress.</span>
            </p>
            <Link href="/lean-lab" className="underline text-[#15C5C1] font-semibold hover:text-[#FFA36C]">
              Explore Lean Lab →
            </Link>
          </div>
        </div>
      </main>

      {/* --- Signup Modal --- */}
      {showSignup && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-[#003B49] rounded-2xl p-8 w-full max-w-md shadow-xl border-2 border-[#15C5C1]">
            <button className="absolute top-2 right-3 text-white text-2xl font-bold" onClick={() => setShowSignup(false)}>&times;</button>
            <h2 className="text-2xl font-bold text-[#FF9151] mb-2 text-center">Join RewmoAI Beta</h2>
            <p className="text-[#B6E7EB] text-center mb-4">Get full access to rewards and advanced features.</p>
            {!submitted ? (
              <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleInput}
                  placeholder="Full Name"
                  className="p-3 rounded-lg border border-[#FF9151] bg-white/90 focus:outline-none focus:ring-2 focus:ring-[#FF9151] font-semibold"
                  required
                />
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleInput}
                  placeholder="Email"
                  className="p-3 rounded-lg border border-[#FF9151] bg-white/90 focus:outline-none focus:ring-2 focus:ring-[#FF9151] font-semibold"
                  required
                />
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleInput}
                  placeholder="Phone (optional)"
                  className="p-3 rounded-lg border border-[#FF9151] bg-white/90 focus:outline-none focus:ring-2 focus:ring-[#FF9151] font-semibold"
                />
                {/* You can add Google/Apple sign-in here */}
                <button type="submit" className="bg-[#FF9151] text-[#003B49] font-bold p-3 rounded-xl mt-2 hover:bg-[#FFA36C]">
                  Join Now
                </button>
                <div className="text-xs text-center mt-2 text-[#B6E7EB]">We’ll never spam you or share your info.</div>
              </form>
            ) : (
              <div className="text-center text-[#15C5C1] text-lg py-4">
                Thanks for joining!<br />Check your email for your invite soon.
              </div>
            )}
            <button
              className="underline text-[#15C5C1] text-sm mt-3 mx-auto block"
              onClick={() => { setShowSignup(false); setShowPreview(true); }}
            >
              Or Peek Preview Instead
            </button>
          </div>
        </div>
      )}

      {/* --- Preview Modal --- */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
          <div className="bg-[#003B49] rounded-2xl p-6 w-full max-w-2xl shadow-xl border-2 border-[#FF9151] relative">
            <button className="absolute top-2 right-3 text-white text-2xl font-bold" onClick={() => setShowPreview(false)}>&times;</button>
            <h2 className="text-2xl font-bold text-[#15C5C1] mb-2 text-center">RewmoAI Preview</h2>
            <div className="flex flex-col md:flex-row gap-4 justify-center items-start mt-4">
              {/* Demo Rewards */}
              <div className="bg-white rounded-xl p-4 flex-1 shadow border border-[#15C5C1]">
                <h3 className="text-[#FF9151] font-bold text-lg mb-2">Your Demo Rewards</h3>
                <ul className="text-[#003B49] text-base font-medium mb-1 list-disc list-inside">
                  <li>Amazon Purchase: +500 pts ($5.00)</li>
                  <li>Referral Bonus: +250 pts ($2.50)</li>
                  <li>Tiered Savings: +75 pts</li>
                </ul>
                <div className="text-xs text-[#15C5C1] mt-2">View the full dashboard after signup.</div>
              </div>
              {/* Demo Lean Lab */}
              <div className="bg-[#072b33] rounded-xl p-4 flex-1 shadow border border-[#15C5C1]">
                <h3 className="text-[#15C5C1] font-bold text-lg mb-2">Lean Lab Sneak Peek</h3>
                <ul className="text-white text-base mb-2 list-disc list-inside">
                  <li>Weekly savings process planner</li>
                  <li>Family meal plan + shopping list</li>
                  <li>Business expense workflow map</li>
                </ul>
                <div className="text-xs text-[#B6E7EB] mt-2">More tools unlock after joining.</div>
              </div>
            </div>
            <div className="text-center mt-6">
              <button
                className="bg-[#FF9151] text-[#003B49] font-bold px-6 py-2 rounded-xl shadow hover:bg-[#FFA36C]"
                onClick={() => { setShowPreview(false); setShowSignup(true); }}
              >
                Get Full Access — Join Now
              </button>
            </div>
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
    </div>
  );
}
