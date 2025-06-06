import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#003B49] font-sans">
      {/* Top Nav */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-[#072b33] bg-[#003B49]">
        <div className="flex items-center space-x-3">
          <Image src="/logos/logo.png" alt="RewmoAI Logo" width={40} height={40} />
          <span className="font-extrabold text-xl text-[#FF9151]">RewmoAI</span>
        </div>
        <nav className="space-x-5">
          <Link href="/" className="text-[#15C5C1] hover:text-[#FFA36C] font-semibold hover:underline">Home</Link>
          <Link href="/shopping" className="text-[#FF9151] hover:text-[#FFA36C] font-semibold hover:underline">Shopping</Link>
          <Link href="/lean-lab" className="text-[#FF9151] hover:text-[#FFA36C] font-semibold hover:underline">Lean Lab</Link>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center px-2 py-12">
        <h1 className="text-3xl md:text-5xl font-black mb-6 text-[#FF9151] tracking-tight text-center">About RewmoAI</h1>
        <section className="max-w-2xl bg-[#072b33] rounded-2xl shadow-xl border border-[#15C5C1] p-8 mb-10">
          <h2 className="text-2xl font-bold mb-2 text-[#15C5C1]">Our Vision</h2>
          <p className="text-lg text-[#B6E7EB] mb-6">
            <span className="font-bold text-[#FF9151]">To empower everyone—individuals, families, and small businesses—to unlock hidden value in everyday spending and daily routines, making smarter, more sustainable financial choices accessible to all.</span>
          </p>
          <h2 className="text-2xl font-bold mb-2 text-[#15C5C1]">Our Mission</h2>
          <p className="text-lg text-[#B6E7EB] mb-6">
            <span className="font-bold text-[#FF9151]">RewmoAI</span> delivers powerful AI-driven rewards and practical process management tools, helping our members earn more, save more, and do better—one purchase and one workflow at a time.
          </p>
          <h2 className="text-2xl font-bold mb-2 text-[#15C5C1]">Guiding Principles</h2>
          <ul className="space-y-4 mt-4 text-[#B6E7EB]">
            <li>
              <span className="font-bold text-[#FF9151]">1. Simplicity First:</span>
              <span className="ml-2 text-[#F7F6F2]">We deliver clear, direct value. No jargon, no barriers, just meaningful results.</span>
            </li>
            <li>
              <span className="font-bold text-[#FF9151]">2. Empower Through AI:</span>
              <span className="ml-2 text-[#F7F6F2]">Technology should serve you, not the other way around. We use AI to boost your savings, optimize your routines, and reveal new opportunities—always with your best interests in mind.</span>
            </li>
            <li>
              <span className="font-bold text-[#FF9151]">3. Quality & Integrity:</span>
              <span className="ml-2 text-[#F7F6F2]">We follow Lean and TQM principles, striving for continuous improvement in every feature and every member interaction.</span>
            </li>
            <li>
              <span className="font-bold text-[#FF9151]">4. Transparency & Trust:</span>
              <span className="ml-2 text-[#F7F6F2]">We’re open about how rewards work, how data is used, and how we make money. Trust is our most valuable asset.</span>
            </li>
            <li>
              <span className="font-bold text-[#FF9151]">5. Inclusive Impact:</span>
              <span className="ml-2 text-[#F7F6F2]">Everyone deserves tools to get ahead—whether you’re running a business, managing a family, or just starting your financial journey.</span>
            </li>
          </ul>
        </section>

        {/* Brand Promise/Closing */}
        <section className="max-w-xl text-center mb-8">
          <div className="inline-block bg-[#ff915114] rounded-2xl px-8 py-6 shadow">
            <h3 className="text-xl font-bold text-[#15C5C1] mb-2">The RewmoAI Promise</h3>
            <p className="text-[#B6E7EB] text-base">
              More than just rewards—RewmoAI is your partner in a smarter, more empowered financial future.
            </p>
          </div>
        </section>

        {/* Team/Founder CTA */}
        <div className="text-center mt-8">
          <p className="text-[#B6E7EB] mb-2">
            RewmoAI was built for you—by people who believe everyone should have a path to smarter money and better results.
          </p>
          <Link href="/contact" className="text-[#15C5C1] font-semibold underline hover:text-[#FFA36C] text-lg">
            Meet the team &gt;
          </Link>
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
