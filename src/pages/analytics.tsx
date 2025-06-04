// src/pages/analytics.tsx
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const rewardsData = [
  { month: "Jan", rewards: 200 },
  { month: "Feb", rewards: 380 },
  { month: "Mar", rewards: 540 },
  { month: "Apr", rewards: 1200 },
  { month: "May", rewards: 2300 },
];
const referralData = [
  { day: "Mon", count: 1 },
  { day: "Tue", count: 2 },
  { day: "Wed", count: 2 },
  { day: "Thu", count: 4 },
  { day: "Fri", count: 6 },
];
const sourceData = [
  { name: "Shopping", value: 1800 },
  { name: "Referrals", value: 1200 },
  { name: "Bonus", value: 500 },
];

const COLORS = ["#ff9800", "#ffa726", "#ffd54f"];

export default function AnalyticsPage() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center py-8 px-2">
      <h1 className="text-3xl font-bold mb-2 text-orange-400">Analytics & Insights (Preview)</h1>
      <p className="mb-6 text-orange-100 text-center max-w-xl">
        Get a preview of your financial journey—see how your rewards, referrals, and savings add up.
        <br />
        <span className="text-orange-300 font-semibold">
          Future versions will include real-time AI-powered financial coaching.
        </span>
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        {/* Total Rewards */}
        <Card>
          <CardContent className="flex flex-col items-center py-6">
            <span className="text-lg text-gray-400">Total Rewards Earned</span>
            <span className="text-4xl font-extrabold text-orange-500 mb-2">$3,500</span>
            <ResponsiveContainer width="100%" height={120}>
              <BarChart data={rewardsData}>
                <XAxis dataKey="month" hide />
                <YAxis hide />
                <Bar dataKey="rewards" fill="#ff9800" radius={[6, 6, 0, 0]} />
                <Tooltip />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        {/* Referral Growth */}
        <Card>
          <CardContent className="flex flex-col items-center py-6">
            <span className="text-lg text-gray-400">Referral Growth This Week</span>
            <ResponsiveContainer width="100%" height={120}>
              <BarChart data={referralData}>
                <XAxis dataKey="day" />
                <YAxis hide />
                <Bar dataKey="count" fill="#ffa726" radius={[6, 6, 0, 0]} />
                <Tooltip />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        {/* Points by Source */}
        <Card>
          <CardContent className="flex flex-col items-center py-6">
            <span className="text-lg text-gray-400">Points by Source</span>
            <ResponsiveContainer width="100%" height={140}>
              <PieChart>
                <Pie data={sourceData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={50} label>
                  {sourceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        {/* AI Insights */}
        <Card>
          <CardContent className="flex flex-col items-center py-6 text-center">
            <span className="text-lg text-gray-400 mb-2">Smart AI Insights (Coming Soon)</span>
            <ul className="text-orange-300 list-disc list-inside space-y-2">
              <li>
                <b>Projected Savings:</b> <span className="font-bold text-orange-100">$5,600</span> by end of year if you stay on track!
              </li>
              <li>
                <b>Referral Accelerator:</b> Invite 3 more friends for a bonus!
              </li>
              <li>
                <b>Top Earning Category:</b> Shopping rewards—connect more stores to maximize points.
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
