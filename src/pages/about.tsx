// src/pages/about.tsx

import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function AboutPage() {
  return (
    <main className="min-h-screen flex flex-col items-center px-4 py-10 bg-[#003B49]">
      {/* Logo/Header */}
      <Image
        src="/logos/logo.png"
        alt="RewmoAI Logo"
        width={110}
        height={48}
        className="mb-4 mt-2 rounded-full"
        priority
      />

      {/* Main Heading */}
      <h1 className="text-3xl md:text-4xl font-extrabold mb-4 text-[#FF9151] text-center drop-shadow">
        About RewmoAI
      </h1>
      <p className="max-w-2xl text-center mb-4 text-[#C2E9FA] text-lg font-medium">
        The next evolution in rewards, savings, and AI-powered financial coaching—<span className="text-[#15C5C1] font-bold">built for your financial journey</span>.
      </p>

      {/* Mission Statement */}
      <div className="max-w-2xl mb-6 p-5 rounded-2xl bg-[#004F5B] bg-opacity-80 shadow-lg border border-[#15C5C1]/20">
        <h2 className="text-xl font-bold text-[#FF9151] mb-2">Our Mission</h2>
        <p className="text-[#C2E9FA] font-medium">
          RewmoAI was founded to <span className="text-[#15C5C1] font-semibold">empower everyday Americans</span> to unlock new financial opportunities and generational wealth through <span className="text-[#FF9151] font-semibold">automated rewards, smarter saving, and AI-driven insights</span>.
          <br />
          <br />
          We believe financial guidance should be accessible, automated, and rewarding at every step—whether you’re shopping, paying rent, or planning your next milestone.
        </p>
      </div>

      {/* Key Features / Philosophy */}
      <div className="max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-6 w-full mb-10">
        {/* Secure & American-Built */}
        <div className="bg-[#004F5B] rounded-xl shadow-lg p-5 flex flex-col gap-2 border border-[#FF9151]/30">
          <span className="text-2xl mb-1 font-bold text-[#15C5C1]">🇺🇸</span>
          <h3 className="text-lg font-bold text-[#FF9151]">American-Made & Secure</h3>
          <p className="text-[#C2E9FA] font-medium">
            Your data and dollars are protected—RewmoAI is built on U.S.-based AI and secure cloud infrastructure. No offshore data sharing, ever.
          </p>
        </div>
        {/* Financial Coach */}
        <div className="bg-[#004F5B] rounded-xl shadow-lg p-5 flex flex-col gap-2 border border-[#15C5C1]/20">
          <span className="text-2xl mb-1 font-bold text-[#15C5C1]">🤖</span>
          <h3 className="text-lg font-bold text-[#FF9151]">Personal AI Coach</h3>
          <p className="text-[#C2E9FA] font-medium">
            Our generative AI delivers personalized suggestions and milestones to help you maximize savings, boost your credit, and earn more rewards—automatically.
          </p>
        </div>
        {/* Transparent & Rewarding */}
        <div className="bg-[#004F5B] rounded-xl shadow-lg p-5 flex flex-col gap-2 border border-[#FF9151]/30">
          <span className="text-2xl mb-1 font-bold text-[#15C5C1]">🎯</span>
          <h3 className="text-lg font-bold text-[#FF9151]">Transparent. Rewarding. Fun.</h3>
          <p className="text-[#C2E9FA] font-medium">
            Track your points and referrals in real time. Hit milestones for extra bonuses. Enjoy saving as much as spending!
          </p>
        </div>
        {/* Built for All */}
        <div className="bg-[#004F5B] rounded-xl shadow-lg p-5 flex flex-col gap-2 border border-[#15C5C1]/20">
          <span className="text-2xl mb-1 font-bold text-[#15C5C1]">🌱</span>
          <h3 className="text-lg font-bold text-[#FF9151]">Built for Every Stage</h3>
          <p className="text-[#C2E9FA] font-medium">
            Whether you’re a student, renter, new parent, or seasoned saver, RewmoAI adapts to your goals—making wealth-building possible for everyone.
          </p>
        </div>
      </div>

      {/* Call to Action */}
      <div className="mt-4 mb-2 text-center">
        <Link href="/signup">
          <button className="px-8 py-3 bg-[#FF9151] hover:bg-[#FFA36C] text-[#003B49] font-bold rounded-2xl shadow-lg text-lg transition">
            Get Started for Free
          </button>
        </Link>
      </div>

      {/* Footer */}
      <div className="mt-8 text-[#15C5C1] text-sm opacity-70 text-center">
        Questions? See our{" "}
        <Link href="/faq" className="underline hover:text-[#FF9151]">
          FAQ
        </Link>{" "}
        or email{" "}
        <a
          href="mailto:support@rewmo.ai"
          className="underline hover:text-[#FF9151]"
        >
          support@rewmo.ai
        </a>
        .
      </div>
    </main>
  );
}
