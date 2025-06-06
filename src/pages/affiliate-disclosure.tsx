import React from "react";
import Link from "next/link";

export default function AffiliateDisclosurePage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#003B49] font-sans">
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16">
        <h1 className="text-3xl font-black text-[#FF9151] mb-5">Affiliate Disclosure</h1>
        <div className="bg-[#072b33] border border-[#15C5C1] rounded-2xl shadow-xl max-w-2xl p-8 text-[#B6E7EB]">
          <p className="mb-4">
            Some links on RewmoAI may be affiliate links. This means that if you click on the link and make a purchase or take an action, RewmoAI may earn a commission at no additional cost to you.
          </p>
          <p className="mb-4">
            Our recommendations and product selections are made with your best interests in mind. We only promote partners and brands that align with our mission to help you maximize your savings, rewards, and financial well-being.
          </p>
          <p>
            Affiliate partnerships help us keep RewmoAI free and continually improving. Thank you for your support!
          </p>
        </div>
        <Link href="/" className="mt-8 text-[#15C5C1] font-semibold underline hover:text-[#FFA36C]">← Back to Home</Link>
      </main>
    </div>
  );
}
