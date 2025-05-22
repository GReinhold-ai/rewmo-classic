// pages/analytics.tsx

import { BarChart3, Activity, Star, ArrowUpCircle } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-start px-4 py-10 bg-[#fafbfc]">
      <div className="w-full max-w-xl mx-auto">
        {/* Headline */}
        <h1 className="flex items-center gap-2 text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          <BarChart3 className="text-orange-500" size={32} />
          Analytics
        </h1>
        <div className="text-gray-600 mb-8 text-lg">
          Visualize your spending and rewards with AI-powered insights.
        </div>

        {/* Analytics Card */}
        <div className="bg-white rounded-xl shadow p-8 flex flex-col items-center mb-6">
          {/* Placeholder Chart */}
          <div className="w-full flex flex-col items-center mb-6">
            <div className="w-40 h-24 bg-gradient-to-tr from-orange-200 via-white to-orange-100 rounded-lg flex items-center justify-center mb-2">
              <Activity className="text-orange-400" size={44} />
            </div>
            <span className="text-gray-400 text-xs">Interactive charts coming soon…</span>
          </div>

          {/* Example KPIs */}
          <div className="flex flex-col md:flex-row gap-6 w-full justify-center">
            <div className="flex flex-col items-center">
              <Star className="text-yellow-500 mb-1" />
              <div className="text-lg font-bold text-gray-700">3,240</div>
              <div className="text-xs text-gray-500">Total Rewards Earned</div>
            </div>
            <div className="flex flex-col items-center">
              <ArrowUpCircle className="text-green-500 mb-1" />
              <div className="text-lg font-bold text-gray-700">$2,870</div>
              <div className="text-xs text-gray-500">Spent Last 30 Days</div>
            </div>
            <div className="flex flex-col items-center">
              <Star className="text-purple-500 mb-1" />
              <div className="text-lg font-bold text-gray-700">Dining</div>
              <div className="text-xs text-gray-500">Top Category</div>
            </div>
          </div>
        </div>

        {/* Callout */}
        <div className="text-center mt-4 text-orange-500 font-medium">
          Connect your account or upload transactions to unlock real-time analytics!
        </div>
      </div>
    </main>
  );
}
