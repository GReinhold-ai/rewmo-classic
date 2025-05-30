import React from "react";
import Link from "next/link";
import { ShoppingBag, UserPlus, Home, Robot, Flag, Leaf } from "lucide-react";

export default function RewardsPage() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center pb-10">
      {/* Banner/Info Block */}
      <div className="w-full max-w-2xl mt-8 mb-6">
        <div className="bg-orange-100 text-orange-900 rounded-xl shadow p-4 text-center font-semibold text-sm border border-orange-200">
          Points you earn during testing and referrals are being tracked!
          <br />
          <span className="font-normal">
            All points earned for referrals, testing, and activities are posted to your account per the{" "}
            <Link href="/reward-rules" className="underline text-orange-700 hover:text-orange-500">
              Reward Rules
            </Link>.
            Withdrawals will open after launch, subject to program policies.
          </span>
        </div>
      </div>

      {/* Title */}
      <h1 className="text-3xl md:text-4xl font-extrabold mb-2 text-orange-500 text-center">
        Your Rewards
      </h1>
      <p className="mb-8 text-center max-w-lg text-lg text-gray-200">
        Discover new ways to earn more with Rewards Mobile AI.<br />
        Complete actions and watch your points grow, then redeem them for cash, shopping, and exclusive perks!
      </p>

      {/* Reward Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl px-2">
        {/* Rent & Mortgage Rewards */}
        <Link href="/shopping" className="transition-transform hover:-translate-y-1">
          <div className="bg-white/95 text-black rounded-xl shadow-lg p-5 flex flex-col gap-2 hover:ring-2 hover:ring-orange-400 cursor-pointer h-full">
            <Home className="w-8 h-8 text-orange-500 mb-1" />
            <h2 className="text-lg font-bold">Rent &amp; Mortgage Rewards</h2>
            <p>
              Earn extra points just by paying your biggest bills. Link your rent, mortgage, or recurring payments and start unlocking rewards—turning your payments into financial progress every month!
            </p>
          </div>
        </Link>
        {/* Referral Rewards */}
        <Link href="/shopping" className="transition-transform hover:-translate-y-1">
          <div className="bg-white/95 text-black rounded-xl shadow-lg p-5 flex flex-col gap-2 hover:ring-2 hover:ring-orange-400 cursor-pointer h-full">
            <UserPlus className="w-8 h-8 text-orange-500 mb-1" />
            <h2 className="text-lg font-bold">Referral Rewards</h2>
            <p>
              Invite friends and colleagues to join—earn big bonuses for every new member you bring in, plus milestone rewards as your network grows. Top referrers get exclusive perks and leaderboard status!
            </p>
          </div>
        </Link>
        {/* AI Smart Boosts */}
        <Link href="/shopping" className="transition-transform hover:-translate-y-1">
          <div className="bg-white/60 text-gray-500 rounded-xl shadow-lg p-5 flex flex-col gap-2 hover:ring-2 hover:ring-orange-200 cursor-pointer h-full">
            <Robot className="w-8 h-8 text-orange-400 mb-1" />
            <h2 className="text-lg font-bold flex items-center">
              AI Smart Boosts
              <span className="ml-2 px-2 py-0.5 bg-orange-200 text-orange-700 rounded text-xs font-semibold">Coming Soon</span>
            </h2>
            <p>
              Smart reward boosts based on your spending, saving, and shopping behaviors. Watch for automatic AI-powered offers that maximize your point earnings—tailored just for you.
            </p>
          </div>
        </Link>
        {/* Made in America Rewards */}
        <Link href="/shopping" className="transition-transform hover:-translate-y-1">
          <div className="bg-white/60 text-gray-500 rounded-xl shadow-lg p-5 flex flex-col gap-2 hover:ring-2 hover:ring-orange-200 cursor-pointer h-full">
            <Flag className="w-8 h-8 text-orange-400 mb-1" />
            <h2 className="text-lg font-bold flex items-center">
              Made in America
              <span className="ml-2 px-2 py-0.5 bg-orange-200 text-orange-700 rounded text-xs font-semibold">Coming Soon</span>
            </h2>
            <p>
              Earn extra rewards for supporting American-made products and local businesses—look for the badge and stack up bonuses as you shop.
            </p>
          </div>
        </Link>
        {/* Sustainable Shopping */}
        <Link href="/shopping" className="transition-transform hover:-translate-y-1">
          <div className="bg-white/60 text-gray-500 rounded-xl shadow-lg p-5 flex flex-col gap-2 hover:ring-2 hover:ring-orange-200 cursor-pointer h-full">
            <Leaf className="w-8 h-8 text-orange-400 mb-1" />
            <h2 className="text-lg font-bold flex items-center">
              Sustainable Shopping
              <span className="ml-2 px-2 py-0.5 bg-orange-200 text-orange-700 rounded text-xs font-semibold">Coming Soon</span>
            </h2>
            <p>
              Bonus rewards for eco-friendly and sustainable purchases—get recognized for helping the planet with every transaction.
            </p>
          </div>
        </Link>
      </div>

      {/* Call to Action */}
      <div className="mt-10">
        <Link href="/shopping">
          <button className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white text-lg font-bold rounded-2xl shadow-xl">
            Shop Now &amp; Earn More Rewards
          </button>
        </Link>
      </div>
    </main>
  );
}
