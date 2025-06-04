// src/pages/shopping.tsx

import React from "react";
import Link from "next/link";
import { ShoppingBag, Star, Leaf, Flag, BadgeCheck } from "lucide-react";

export default function ShoppingPage() {
  return (
    <main className="min-h-screen bg-[#003B49] px-4 pb-16 flex flex-col items-center">
      {/* Header */}
      <h1 className="text-3xl md:text-4xl font-extrabold mt-10 mb-2 text-[#FF9151] text-center drop-shadow">
        Shop &amp; Earn with RewmoAI
      </h1>
      <p className="max-w-2xl text-center mb-8 text-[#C2E9FA] text-lg font-medium">
        Discover <span className="text-[#15C5C1] font-bold">curated brands</span> and products that earn you more rewards. 
        Support American-made and sustainable choices while building your wealth—automatically.
      </p>

      {/* Announcement / Demo */}
      <div className="bg-[#ff8c4214] border border-dashed border-[#FF9151] rounded-xl px-6 py-3 mb-8 w-full max-w-xl text-center">
        <span className="text-[#FF9151] font-bold flex items-center justify-center gap-2">
          <ShoppingBag className="w-5 h-5" />
          Shopping Demo LIVE!
        </span>
        <p className="text-[#C2E9FA] text-sm mt-1">
          For the beta, shopping links are for demonstration only. All purchases made via RewmoAI during testing <span className="text-[#15C5C1] font-semibold">earn bonus rewards</span> and special streaks.
        </p>
      </div>

      {/* Shopping Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-7 w-full max-w-3xl">
        {/* Trending */}
        <div className="bg-[#004F5B] rounded-xl shadow-lg p-6 flex flex-col gap-2 border border-[#FF9151]/25">
          <Star className="w-7 h-7 text-[#FF9151]" />
          <h2 className="font-bold text-lg text-[#FF9151]">Trending Offers</h2>
          <ul className="mt-2 text-[#C2E9FA] text-sm space-y-1">
            <li>
              <Link href="https://amazon.com" target="_blank" className="underline hover:text-[#FFA36C]">
                Amazon Best Sellers
              </Link>{" "}
              <span className="text-[#15C5C1] font-semibold">(2x Rewards)</span>
            </li>
            <li>
              <Link href="https://walmart.com" target="_blank" className="underline hover:text-[#FFA36C]">
                Walmart Weekly Deals
              </Link>
            </li>
            <li>
              <Link href="https://bestbuy.com" target="_blank" className="underline hover:text-[#FFA36C]">
                Best Buy Top Tech
              </Link>
            </li>
          </ul>
        </div>
        {/* Made in America */}
        <div className="bg-[#004F5B] rounded-xl shadow-lg p-6 flex flex-col gap-2 border border-[#15C5C1]/25">
          <Flag className="w-7 h-7 text-[#15C5C1]" />
          <h2 className="font-bold text-lg text-[#15C5C1]">Made in America</h2>
          <ul className="mt-2 text-[#C2E9FA] text-sm space-y-1">
            <li>
              <Link href="https://madeinamericastore.com" target="_blank" className="underline hover:text-[#FFA36C]">
                Made in America Store
              </Link>
            </li>
            <li>
              <Link href="https://llbean.com" target="_blank" className="underline hover:text-[#FFA36C]">
                L.L.Bean
              </Link>
            </li>
            <li>
              <Link href="https://newbalance.com" target="_blank" className="underline hover:text-[#FFA36C]">
                New Balance
              </Link>
            </li>
          </ul>
          <p className="text-xs mt-2 text-[#15C5C1] font-semibold">Extra points on every American-made purchase!</p>
        </div>
        {/* Sustainable Shopping */}
        <div className="bg-[#004F5B] rounded-xl shadow-lg p-6 flex flex-col gap-2 border border-[#FF9151]/25">
          <Leaf className="w-7 h-7 text-[#FF9151]" />
          <h2 className="font-bold text-lg text-[#FF9151]">Sustainable Choices</h2>
          <ul className="mt-2 text-[#C2E9FA] text-sm space-y-1">
            <li>
              <Link href="https://patagonia.com" target="_blank" className="underline hover:text-[#FFA36C]">
                Patagonia
              </Link>
            </li>
            <li>
              <Link href="https://allbirds.com" target="_blank" className="underline hover:text-[#FFA36C]">
                Allbirds
              </Link>
            </li>
            <li>
              <Link href="https://grovecollaborative.com" target="_blank" className="underline hover:text-[#FFA36C]">
                Grove Collaborative
              </Link>
            </li>
          </ul>
          <p className="text-xs mt-2 text-[#15C5C1] font-semibold">Choose eco-friendly brands and earn!</p>
        </div>
        {/* VIP & Featured Brands */}
        <div className="bg-[#004F5B] rounded-xl shadow-lg p-6 flex flex-col gap-2 border border-[#15C5C1]/25">
          <BadgeCheck className="w-7 h-7 text-[#15C5C1]" />
          <h2 className="font-bold text-lg text-[#15C5C1]">VIP &amp; Featured Brands</h2>
          <ul className="mt-2 text-[#C2E9FA] text-sm space-y-1">
            <li>
              <Link href="https://apple.com" target="_blank" className="underline hover:text-[#FFA36C]">
                Apple Store
              </Link>
            </li>
            <li>
              <Link href="https://nike.com" target="_blank" className="underline hover:text-[#FFA36C]">
                Nike
              </Link>
            </li>
            <li>
              <Link href="https://costco.com" target="_blank" className="underline hover:text-[#FFA36C]">
                Costco
              </Link>
            </li>
          </ul>
          <p className="text-xs mt-2 text-[#C2E9FA]">Top picks for value, rewards, and service.</p>
        </div>
      </div>

      {/* Call to Action */}
      <div className="mt-12 text-center">
        <Link href="/rewards">
          <button className="px-8 py-3 bg-[#FF9151] hover:bg-[#FFA36C] text-[#003B49] font-bold rounded-2xl shadow-lg text-lg transition">
            See Your Rewards
          </button>
        </Link>
      </div>
    </main>
  );
}
