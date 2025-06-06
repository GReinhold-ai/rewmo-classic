import React from "react";
import Link from "next/link";
import Image from "next/image";

const features = [
  {
    title: "Affiliate Shopping Rewards",
    status: "Live",
    color: "#FF9151",
    description:
      "Earn instant rewards every time you shop, whether it's for yourself or your business. Get cash back on everything from groceries to office supplies, software, and more.",
    icon: "/icons/shopping-cart.svg",
    cta: "/shopping",
    ctaLabel: "Shop & Earn",
  },
  {
    title: "Business Rewards",
    status: "Live",
    color: "#15C5C1",
    description:
      "Small businesses and entrepreneurs: earn rewards on business purchases, SaaS subscriptions, supplies, and travel. Make every business dollar work harder.",
    icon: "/icons/business.svg",
    cta: "/shopping?tab=business",
    ctaLabel: "See Business Offers",
  },
  {
    title: "Lean Lab: Process Visualization",
    status: "Live",
    color: "#FFA36C",
    description:
      "Map out your daily routines and business processes visually. Instantly spot waste, improve quality, and save more with our guided flowchart tool.",
    icon: "/icons/lean-lab.svg",
    cta: "/lean-lab",
    ctaLabel: "Try Lean Lab",
  },
  {
    title: "Waste Tracker",
    status: "Coming Soon",
    color: "#FF9151",
    description:
      "Track recurring expenses, spot hidden waste, and get practical tips to save money at home and in your business.",
    icon: "/icons/waste.svg",
    cta: "",
    ctaLabel: "",
  },
  {
    title: "Improvement Sprints",
    status: "Coming Soon",
    color: "#15C5C1",
    description:
      "Set micro-goals and run quick savings challenges. Compete, learn, and watch your progress stack up.",
    icon: "/icons/sprint.svg",
    cta: "",
    ctaLabel: "",
  },
  {
    title: "AI-Powered Insights",
    status: "Coming Soon",
    color: "#FFA36C",
    description:
      "Let RewmoAI analyze your spending and routines to suggest smarter moves, personalized just for you.",
    icon: "/icons/ai.svg",
    cta: "",
    ctaLabel: "",
  },
];

export default function FeaturesPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#003B49] font-sans">
      {/* Nav */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-[#072b33] bg-[#003B49]">
        <div className="flex items-center space-x-3">
          <Image src="/logos/logo.png" alt="RewmoAI Logo" width={40} height={40} />
          <span className="font-extrabold text-xl text-[#FF9151]">RewmoAI</span>
        </div>
        <nav className="space-x-5">
          <Link href="/" className="text-[#15C5C1] hover:text-[#FFA36C] font-semibold hover:underline">Home</Link>
          <Link href="/shopping" className="text-[#FF9151] hover:text-[#FFA36C] font-semibold hover:underline">Shopping</Link>
          <Link href="/lean-lab" className="text-[#FF9151] hover:text-[#FFA36C] font-semibold hover:underline">Lean Lab</Link>
        </nav>
      </header>

      <main className="flex-1 flex flex-col items-center px-4 py-12">
        <h1 className="text-3xl md:text-5xl font-black mb-8 text-[#FF9151] tracking-tight text-center">
          Features
        </h1>
        <p className="max-w-2xl text-[#B6E7EB] text-lg mb-12 text-center">
          Everything you need to earn more, save more, and work smarter—right from your phone.  
          <span className="block text-[#15C5C1] text-base mt-2">
            Live now, or launching soon.
          </span>
        </p>
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
          {features.map((f, i) => (
            <div
              key={i}
              className="flex flex-col bg-[#072b33] rounded-2xl shadow-xl border border-[#15C5C1] p-6 relative overflow-hidden"
            >
              {/* Status badge */}
              <div
                className={`absolute right-6 top-6 text-xs px-3 py-1 rounded-full font-bold shadow ${
                  f.status === "Live"
                    ? "bg-[#FF9151] text-[#003B49]"
                    : "bg-[#15C5C1] text-[#003B49] opacity-80"
                }`}
                style={f.status === "Coming Soon" ? { border: '1.5px solid #FFA36C' } : {}}
              >
