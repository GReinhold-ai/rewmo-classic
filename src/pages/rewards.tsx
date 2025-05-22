// src/pages/rewards.tsx

import React from "react";

export default function RewardsPage() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center px-4 py-10">
      {/* Page Title */}
      <h1 className="text-3xl md:text-4xl font-bold mb-2 text-orange-500 text-center">
        Your Rewards
      </h1>
      <p className="mb-8 text-center text-base md:text-lg text-gray-200 max-w-xl">
        Discover new ways to earn more with RewmoAI. Complete actions and watch your points grow.
      </p>

      {/* Rewards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl mb-10">
        {/* Rent & Mortgage Rewards */}
        <div className="bg-gray-100 text-black rounded-xl shadow p-6 flex flex-col justify-between items-center mb-4">
          <h2 className="font-semibold text-lg mb-1 text-center">Rent &amp; Mortgage Rewards</h2>
          <p className="text-sm mb-1 text-center">
            Earn extra points just by paying your biggest bills.
          </p>
        </div>

        {/* AI Smart Boosts */}
        <div className="bg-gray-300 text-black rounded-xl shadow p-6 flex flex-col justify-between items-center mb-4 relative">
          <h2 className="font-semibold text-lg mb-1 text-center">AI Smart Boosts</h2>
          <span className="absolute top-4 right-4 text-xs bg-orange-500 text-white rounded-full px-3 py-1 font-bold">
            Coming Soon
          </span>
          <p className="text-sm mb-1 text-center">
            Smart reward boosts based on your behavior.
          </p>
        </div>

        {/* Made in America */}
        <div className="bg-gray-300 text-black rounded-xl shadow p-6 flex flex-col justify-between items-center mb-4 relative">
          <h2 className="font-semibold text-lg mb-1 text-center">Made in America</h2>
          <span className="absolute top-4 right-4 text-xs bg-orange-500 text-white rounded-full px-3 py-1 font-bold">
            Coming Soon
          </span>
          <p className="text-sm mb-1 text-center">
            Earn more for buying American products.
          </p>
        </div>

        {/* Sustainable Shopping */}
        <div className="bg-gray-300 text-black rounded-xl shadow p-6 flex flex-col justify-between items-center mb-4 relative">
          <h2 className="font-semibold text-lg mb-1 text-center">Sustainable Shopping</h2>
          <span className="absolute top-4 right-4 text-xs bg-orange-500 text-white rounded-full px-3 py-1 font-bold">
            Coming Soon
          </span>
          <p className="text-sm mb-1 text-center">
            Bonus for eco-friendly purchases.
          </p>
        </div>
      </div>

      {/* Subtle Points/Early Access Message at Bottom */}
      <div className="w-full max-w-2xl mt-8 mb-2 text-xs text-orange-300 text-center bg-transparent">
        <span className="font-semibold text-orange-400">Points for testing &amp; referrals are being tracked.</span> 
        &nbsp;When RewmoAI launches, your points will be available per our published rules.
      </div>
    </main>
  );
}
