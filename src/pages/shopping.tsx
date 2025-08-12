// src/pages/shopping.tsx

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const PERSONAL_BRANDS = [
  {
    name: "Amazon",
    description: "Earn up to 5% back on your everyday shopping.",
    logo: "/logos/amazon.png",
    active: true,
    reward: "Up to 5% back",
    url: "https://www.amazon.com/?tag=YOUR_AMAZON_AFFILIATE_ID", // <- insert your affiliate code
  },
  {
    name: "Walmart",
    description: "Get 3% back on electronics, groceries, and more.",
    logo: "/logos/walmart.png",
    active: false,
    reward: "3% back",
  },
  {
    name: "Target",
    description: "Shop & earn instant cash back in-store and online.",
    logo: "/logos/target.png",
    active: false,
    reward: "2% back",
  },
  {
    name: "Apple",
    description: "Earn up to 4% back on Apple Store purchases.",
    logo: "/logos/apple.png", // Make sure this image exists or remove the object
    active: false,
    reward: "Up to 4% back",
  },
];

const BUSINESS_BRANDS = [
  {
    name: "Amazon Business",
    description: "Earn up to 5% back on office and business supplies.",
    logo: "/logos/amazon.png",
    active: true,
    reward: "Up to 5% back",
    url: "https://www.amazon.com/?tag=YOUR_AMAZON_AFFILIATE_ID",
  },
  {
    name: "Staples",
    description: "Get exclusive business supply deals (Coming Soon).",
    logo: "/logos/staples.png", // Add this image or remove the brand
    active: false,
    reward: "Coming Soon",
  },
  {
    name: "Office Depot",
    description: "Earn cash back on business essentials (Coming Soon).",
    logo: "/logos/officedepot.png", // Add this image or remove the brand
    active: false,
    reward: "Coming Soon",
  },
  {
    name: "Best Buy Business",
    description: "Get rewards for electronics and more (Coming Soon).",
    logo: "/logos/bestbuy.png", // Add this image or remove the brand
    active: false,
    reward: "Coming Soon",
  },
];

export default function ShoppingRewardsPage() {
  const [tab, setTab] = useState<"personal" | "business">("personal");

  const brands = tab === "personal" ? PERSONAL_BRANDS : BUSINESS_BRANDS;

  return (
    <div className="min-h-screen bg-[#003B49] font-sans flex flex-col items-center px-2">
      <main className="w-full flex flex-col items-center py-8">
        <h1 className="text-3xl md:text-4xl font-black text-[#FF9151] mb-3 text-center tracking-tight">
          Shopping Rewards
        </h1>

        {/* Tab Switcher */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setTab("personal")}
            className={`px-6 py-2 rounded-xl font-bold text-lg border ${
              tab === "personal"
                ? "bg-[#FF9151] text-[#003B49] border-[#FF9151]"
                : "bg-[#072b33] text-[#15C5C1] border-[#15C5C1] hover:bg-[#02404d]"
            } transition`}
          >
            Personal
          </button>
          <button
            onClick={() => setTab("business")}
            className={`px-6 py-2 rounded-xl font-bold text-lg border ${
              tab === "business"
                ? "bg-[#FF9151] text-[#003B49] border-[#FF9151]"
                : "bg-[#072b33] text-[#15C5C1] border-[#15C5C1] hover:bg-[#02404d]"
            } transition`}
          >
            Business
          </button>
        </div>

        <p className="text-[#B6E7EB] text-center mb-8 max-w-xl">
          Shop for yourself or your business and get instant rewards on popular brands.
          <br />
          <span className="text-[#FFA36C] font-semibold">Amazon is live. Other brands are coming soon!</span>
        </p>

        {/* Brand List */}
        <div className="flex flex-col gap-5 w-full max-w-2xl mb-8">
          {brands.map((b) => (
            <div
              key={b.name}
              className={`flex items-center justify-between bg-[#072b33] rounded-2xl border ${
                b.active ? "border-[#15C5C1]" : "border-[#B6E7EB] opacity-60"
              } px-6 py-5 shadow`}
            >
              <div className="flex items-center gap-3">
                <Image
                  src={b.logo}
                  alt={b.name}
                  width={46}
                  height={46}
                  className={b.active ? "" : "opacity-60"}
                />
                <div>
                  <span
                    className={`font-bold text-lg ${
                      b.active ? "text-[#FF9151]" : "text-[#B6E7EB]"
                    }`}
                  >
                    {b.name}
                  </span>
                  <p className="text-[#B6E7EB] text-sm mt-1">{b.description}</p>
                </div>
              </div>
              {b.active ? (
                <a
                  href={b.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#FF9151] hover:bg-[#FFA36C] text-[#003B49] font-bold px-5 py-2 rounded-lg shadow transition"
                >
                  {b.reward} →
                </a>
              ) : (
                <span className="bg-gray-400 text-white font-bold px-5 py-2 rounded-lg cursor-not-allowed">
                  Coming Soon
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Info/How Rewards Work */}
        <div className="mb-4 text-center w-full">
          <Link
            href="/how-rewards-work"
            className="text-[#15C5C1] font-semibold underline hover:text-[#FFA36C]"
          >
            How shopping rewards work →
          </Link>
        </div>
        <div className="text-xs text-[#B6E7EB] text-center max-w-2xl mb-2">
          We may receive compensation when you shop through our affiliate partners. Rewards terms may vary by offer.
        </div>
      </main>
    </div>
  );
}
