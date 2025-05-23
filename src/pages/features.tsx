// src/pages/features.tsx

import { Sparkles, Star, ShieldCheck, Bot, BarChart } from "lucide-react";
import BottomTabBar from "@/components/BottomTabBar";

const features = [
  {
    icon: <Star className="text-orange-500" size={28} />,
    title: "Unmatched Rewards",
    description: "Earn on rent, mortgage, car payments, and everyday shopping. Unlock new financial opportunities, not just points."
  },
  {
    icon: <ShieldCheck className="text-orange-500" size={28} />,
    title: "US-Based Security",
    description: "We use only US-based AI LLMs and partners. Your data never leaves American soil—no foreign vendors, ever."
  },
  {
    icon: <Bot className="text-orange-500" size={28} />,
    title: "AI Financial Coaching",
    description: "Personalized financial education and advice powered by OpenAI and direct browser access to the best financial knowledge."
  },
  {
    icon: <BarChart className="text-orange-500" size={28} />,
    title: "Real-Time Insights",
    description: "See your progress and opportunities with instant analytics, smart suggestions, and custom challenges."
  }
  // Add more features as needed
];

export default function FeaturesPage() {
  return (
    <>
      <main className="min-h-screen bg-white flex flex-col items-center px-2 py-6 font-sans">
        {/* Logo */}
        <img
          src="/logos/logo.png"
          alt="RewmoAI Logo"
          className="h-10 w-auto mt-4 mb-2"
          style={{ maxWidth: 100 }}
        />

        {/* Page Header */}
        <h1 className="text-2xl md:text-3xl font-bold text-center mb-3 flex items-center gap-2 text-black tracking-tight">
          <Sparkles className="text-orange-500" size={30} />
          RewMoAI Features
        </h1>
        <p className="text-sm text-gray-700 mb-5 max-w-xl text-center font-light">
          RewmoAI unlocks new ways to build wealth, save, and get rewarded—backed by American technology and security.
        </p>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full max-w-2xl mb-7">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="flex items-start gap-4 p-4 bg-gray-50 border border-orange-100 rounded-xl shadow-sm hover:shadow-md transition text-gray-800"
            >
              <div>{feature.icon}</div>
              <div>
                <h3 className="font-semibold text-base mb-1">{feature.title}</h3>
                <p className="text-xs md:text-sm text-gray-600 leading-snug">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <a
          href="/"
          className="mt-4 mb-8 px-6 py-2 rounded-full bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold shadow transition"
        >
          Join Rewmo Now
        </a>
      </main>
      <BottomTabBar />
    </>
  );
}
