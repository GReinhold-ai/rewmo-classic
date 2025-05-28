import React from "react";
import Image from "next/image";
import Link from "next/link";
import logo from "@/../public/logos/logo.png"; // Adjust as needed
import { ShieldCheck, Trophy, Bot, BarChart, Flag, Layers3, Users, Banknote, Gift, Briefcase } from "lucide-react";

const features = [
  {
    icon: <Trophy className="h-6 w-6 text-orange-500" />,
    title: "Unmatched Rewards",
    desc: "Earn on rent, mortgage, car payments, and shopping. Unlock new financial opportunities, not just points.",
  },
  {
    icon: <ShieldCheck className="h-6 w-6 text-orange-500" />,
    title: "US-Based Security",
    desc: "We use only US-based AI LLMs and partners. Your data never leaves American soil—no foreign vendors, ever.",
  },
  {
    icon: <Bot className="h-6 w-6 text-orange-500" />,
    title: "AI Financial Coaching",
    desc: "Personalized advice powered by OpenAI and live web data. Get actionable recommendations, 24/7.",
  },
  {
    icon: <BarChart className="h-6 w-6 text-orange-500" />,
    title: "Real-Time Insights",
    desc: "Track your progress and opportunities with instant analytics, smart suggestions, and challenges.",
  },
  {
    icon: <Flag className="h-6 w-6 text-orange-500" />,
    title: "American-Made Rewards",
    desc: "Boost your rewards by shopping American-made. Track your streak and support US businesses.",
  },
  {
    icon: <Layers3 className="h-6 w-6 text-orange-500" />,
    title: "Tiered Savings Bonuses",
    desc: "The longer you save, the more you earn—unlock up to 5 years of increasing rewards.",
  },
  {
    icon: <Users className="h-6 w-6 text-orange-500" />,
    title: "Referral & Social Rewards",
    desc: "Earn bonuses for inviting friends, reaching milestones, and growing the RewmoAI community.",
  },
  {
    icon: <Banknote className="h-6 w-6 text-orange-500" />,
    title: "Embedded Banking",
    desc: "Link accounts, pay bills, and manage finances securely within the app—powered by leading US fintech partners.",
  },
  {
    icon: <Gift className="h-6 w-6 text-orange-500" />,
    title: "Personalized Offers",
    desc: "Get matched with the best offers, deals, and promotions—curated for your goals and habits.",
  },
  {
    icon: <Briefcase className="h-6 w-6 text-orange-500" />,
    title: "Business Tools",
    desc: "B2B rewards, custom analytics, and embedded finance tools for small businesses and partners.",
  },
];

export default function FeaturesPage() {
  return (
    <main className="min-h-screen bg-neutral-50 flex flex-col items-center pt-8 pb-16 px-2">
      <div className="flex flex-col items-center mb-6">
        <Image
          src={logo}
          alt="RewmoAI Logo"
          width={70}
          height={70}
          priority
          className="mb-2 rounded-full border border-orange-500 shadow"
        />
        <h1 className="text-3xl md:text-4xl font-extrabold text-orange-600 mb-2 text-center drop-shadow">
          RewMoAI Features
        </h1>
        <p className="mb-4 max-w-xl text-center text-gray-700">
          RewmoAI unlocks new ways to build wealth, save, and get rewarded—backed by American technology and security.
        </p>
      </div>
      {/* Feature Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-5 w-full max-w-4xl mb-8">
        {features.map(({ icon, title, desc }) => (
          <div key={title} className="bg-white rounded-xl shadow p-4 flex flex-col items-start gap-2 border border-orange-50 hover:shadow-md transition">
            <div>{icon}</div>
            <div className="font-bold text-md text-orange-600">{title}</div>
            <div className="text-sm text-gray-700">{desc}</div>
          </div>
        ))}
      </div>
      <Link href="/" passHref legacyBehavior>
        <a className="mt-4 px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold transition text-base">
          Join Rewmo Now
        </a>
      </Link>
    </main>
  );
}
