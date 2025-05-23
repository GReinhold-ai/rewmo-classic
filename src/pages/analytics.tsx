// src/pages/analytics.tsx

import BottomTabBar from "@/components/BottomTabBar"; // adjust path if needed

export default function AnalyticsPage() {
  return (
    <>
      <main className="min-h-screen flex flex-col items-center justify-start px-4 py-10 bg-[#fafbfc] font-sans">
        {/* Logo (optional) */}
        <img
          src="/logos/logo.png"
          alt="RewmoAI Logo"
          className="h-10 w-auto mb-4"
          style={{ maxWidth: 110 }}
        />

        {/* Headline */}
        <h1 className="flex items-center gap-2 text-xl md:text-3xl font-semibold text-gray-900 mb-1 text-center">
          Analytics & Insights
        </h1>
        <p className="mb-6 text-gray-500 text-center max-w-md text-sm md:text-base">
          Get a real-time view of your rewards, spending, and savings. We’ll keep you updated with smart insights as you grow!
        </p>

        {/* Example Analytics Card */}
        <div className="w-full max-w-md bg-white rounded-xl shadow p-6 mb-5 flex flex-col items-center">
          <div className="text-4xl font-bold text-orange-500 mb-2">3,250</div>
          <div className="text-gray-800 font-medium text-sm">Total Points Earned</div>
          <div className="text-xs text-gray-400 mt-1">Across all rewards</div>
        </div>

        {/* Placeholder for more analytics (charts, etc.) */}
        <div className="w-full max-w-md bg-white rounded-xl shadow p-4 mt-2 mb-2">
          <div className="font-semibold text-gray-800 mb-1 text-base">
            More analytics coming soon!
          </div>
          <div className="text-xs text-gray-500">
            Track your monthly progress, top categories, and smart AI recommendations.
          </div>
        </div>
      </main>
      <BottomTabBar />
    </>
  );
}
