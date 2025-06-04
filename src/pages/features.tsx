// src/pages/features.tsx

import React from "react";
import Link from "next/link";
import { Gift, Home, UserPlus, Bot, BadgeCheck, BarChart3, Flag, Leaf, DollarSign } from "lucide-react";

export default function FeaturesPage() {
  return (
    <main className="min-h-screen bg-[#003B49] px-4 pb-14 flex flex-col items-center">
      {/* Header */}
      <h1 className="text-3xl md:text-4xl font-extrabold mt-10 mb-2 text-[#FF9151] text-center drop-shadow">
        Explore RewmoAI Features
      </h1>
      <p className="max-w-2xl text-center mb-8 text-[#C2E9FA] text-lg font-medium">
        Unlock a smarter way to save, earn, and build wealth—with AI working <span className="text-[#15C5C1] font-bold">for you</span>.
      </p>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-7 w-full max-w-3xl">
        {/* Shopping Rewards */}
        <div className="bg-[#004F5B] rounded-xl shadow-lg p-6 flex flex-col gap-2 border border-[#FF9151]/25">
          <Gift className="w-7 h-7 text-[#FF9151] mb-1" />
          <h2 className="font-bold text-lg text-[#FF9151]">Shopping Rewards</h2>
          <p className="text-[#C2E9FA]">
            Earn points on every eligible purchase, both online and in-store. Redeem for travel, dining, gift cards, and more.
          </p>
        </div>
        {/* Rent & Mortgage */}
        <div className="bg-[#004F5B] rounded-xl shadow-lg p-6 flex flex-col gap-2 border border-[#15C5C1]/25">
          <Home className="w-7 h-7 text-[#15C5C1] mb-1" />
          <h2 className="font-bold text-lg text-[#15C5C1]">Rent &amp; Mortgage Rewards</h2>
          <p className="text-[#C2E9FA]">
            Soon, get rewarded for paying rent or your mortgage on time—turning your biggest bills into passive wealth.
          </p>
        </div>
        {/* Referral System */}
        <div className="bg-[#004F5B] rounded-xl shadow-lg p-6 flex flex-col gap-2 border border-[#FF9151]/25">
          <UserPlus className="w-7 h-7 text-[#FF9151] mb-1" />
          <h2 className="font-bold text-lg text-[#FF9151]">Referral System</h2>
          <p className="text-[#C2E9FA]">
            Share your link to invite friends, family, and coworkers. Earn bonus points and unlock special status with every successful referral.
          </p>
        </div>
        {/* AI Smart Suggestions */}
        <div className="bg-[#004F5B] rounded-xl shadow-lg p-6 flex flex-col gap-2 border border-[#15C5C1]/25">
          <Bot className="w-7 h-7 text-[#15C5C1] mb-1" />
          <h2 className="font-bold text-lg text-[#15C5C1]">AI Smart Suggestions</h2>
          <p className="text-[#C2E9FA]">
            RewmoAI analyzes your habits and spending to suggest new ways to maximize points, grow savings, and build credit—automatically.
          </p>
        </div>
        {/* Tiered Membership */}
        <div className="bg-[#004F5B] rounded-xl shadow-lg p-6 flex flex-col gap-2 border border-[#FF9151]/25">
          <BadgeCheck className="w-7 h-7 text-[#FF9151] mb-1" />
          <h2 className="font-bold text-lg text-[#FF9151]">Tiered Membership & Bonuses</h2>
          <p className="text-[#C2E9FA]">
            Progress through membership tiers as you save and refer. Higher tiers unlock increased rewards, exclusive perks, and VIP events.
          </p>
        </div>
        {/* Analytics Dashboard */}
        <div className="bg-[#004F5B] rounded-xl shadow-lg p-6 flex flex-col gap-2 border border-[#15C5C1]/25">
          <BarChart3 className="w-7 h-7 text-[#15C5C1] mb-1" />
          <h2 className="font-bold text-lg text-[#15C5C1]">Analytics & Insights</h2>
          <p className="text-[#C2E9FA]">
            Visualize your rewards growth, referral impact, and financial milestones in real time. Coming soon: Personalized financial goals!
          </p>
        </div>
        {/* Made in America */}
        <div className="bg-[#004F5B] rounded-xl shadow-lg p-6 flex flex-col gap-2 border border-[#FF9151]/25">
          <Flag className="w-7 h-7 text-[#FF9151] mb-1" />
          <h2 className="font-bold text-lg text-[#FF9151]">Made in America</h2>
          <p className="text-[#C2E9FA]">
            Earn extra points by supporting American-made products and local businesses—look for the badge!
          </p>
        </div>
        {/* Sustainable Shopping */}
        <div className="bg-[#004F5B] rounded-xl shadow-lg p-6 flex flex-col gap-2 border border-[#15C5C1]/25">
          <Leaf className="w-7 h-7 text-[#15C5C1] mb-1" />
          <h2 className="font-bold text-lg text-[#15C5C1]">Sustainable Shopping</h2>
          <p className="text-[#C2E9FA]">
            Choose eco-friendly brands and be rewarded. Make an impact and grow your savings with every sustainable purchase.
          </p>
        </div>
        {/* Withdrawals & Redemption */}
        <div className="bg-[#004F5B] rounded-xl shadow-lg p-6 flex flex-col gap-2 border border-[#FF9151]/25">
          <DollarSign className="w-7 h-7 text-[#FF9151] mb-1" />
          <h2 className="font-bold text-lg text-[#FF9151]">Withdrawals & Redemptions</h2>
          <p className="text-[#C2E9FA]">
            Redeem points for cash, gift cards, or pay your bills directly. Flexible rewards, designed for your financial goals.
          </p>
        </div>
      </div>

      {/* Call to Action */}
      <div className="mt-10 text-center">
        <Link href="/signup">
          <button className="px-8 py-3 bg-[#FF9151] hover:bg-[#FFA36C] text-[#003B49] font-bold rounded-2xl shadow-lg text-lg transition">
            Join RewmoAI &amp; Start Earning
          </button>
        </Link>
      </div>
    </main>
  );
}
