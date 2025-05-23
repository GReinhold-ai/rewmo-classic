// src/pages/insights.tsx

import BottomTabBar from "@/components/BottomTabBar";

export default function InsightsPage() {
  // ...your logic or state (if needed)

  return (
    <>
      <main className="flex flex-col items-center min-h-screen py-12 bg-gray-50">
        <img
          src="/logos/logo.png"
          alt="RewmoAI Logo"
          className="h-10 w-auto mb-4"
          style={{ maxWidth: 110 }}
        />

        <h1 className="text-2xl md:text-3xl font-bold text-orange-600 mb-4">Your Insights</h1>
        <p className="text-gray-600 mb-8 text-center max-w-xl text-base">
          Track your spending trends, rewards, and more—powered by RewmoAI’s AI engine.
        </p>

        {/* Example insight card */}
        <div className="w-full max-w-md bg-white rounded-xl shadow p-6 mb-5 flex flex-col items-center">
          <div className="text-lg font-semibold text-gray-800 mb-2">Spending Trends</div>
          <div className="text-4xl font-bold text-blue-500 mb-1">$1,230</div>
          <div className="text-gray-400 text-xs mb-2">Average per month</div>
          <div className="text-xs text-gray-500">Keep it up! You’ve reduced your spending 10% this month 🎉</div>
        </div>

        <div className="w-full max-w-md bg-white rounded-xl shadow p-4 mt-2 mb-2">
          <div className="font-semibold text-gray-800 mb-1 text-base">
            AI-Powered Insights
          </div>
          <div className="text-xs text-gray-500">
            We’ll show you personalized tips, savings goals, and even suggest ways to maximize your RewmoAI rewards.
          </div>
        </div>
      </main>
      <BottomTabBar />
    </>
  );
}
