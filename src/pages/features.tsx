// pages/features.tsx

import Link from "next/link";
import Image from "next/image";
import {
  ShoppingCart,
  Home,
  Users,
  Sparkles,
  Gift,
  BadgeCheck,
  Clock,
} from "lucide-react";

function ComingSoonBadge() {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 ml-2 rounded-full text-xs font-bold bg-orange-200 text-orange-700 uppercase tracking-wide align-middle">
      <Clock size={14} className="inline" />
      Coming Soon
    </span>
  );
}

export default function FeaturesPage() {
  return (
    <main className="min-h-screen bg-white flex flex-col items-center px-4 py-10">
      <h1 className="text-4xl font-bold text-center mb-10 flex items-center gap-3 text-black">
        <Sparkles className="text-orange-500" size={32} />
        RewMo Features
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">

        {/* Shop & Earn - Clickable */}
        <Link href="/shopping"
          className="bg-gray-50 rounded-xl shadow p-8 flex flex-col items-center cursor-pointer hover:ring-2 hover:ring-orange-400 transition"
        >
          <div className="mb-4 flex gap-2">
            <Image src="/amazon.png" alt="Amazon" width={38} height={38} className="rounded" />
            <Image src="/target.png" alt="Target" width={38} height={38} className="rounded" />
            <Image src="/walmart.png" alt="Walmart" width={38} height={38} className="rounded" />
          </div>
          <h2 className="font-bold text-lg text-black mb-1">Shop & Earn</h2>
          <p className="text-center text-gray-700 mb-2">
            Earn real rewards every time you shop at Amazon, Target, Walmart, and more.
          </p>
        </Link>

        {/* Rent & Mortgage Rewards - Clickable */}
        <Link href="/shopping"
          className="bg-gray-50 rounded-xl shadow p-8 flex flex-col items-center cursor-pointer hover:ring-2 hover:ring-orange-400 transition"
        >
          <Home className="mb-4 text-orange-400" size={36} />
          <h2 className="font-bold text-lg text-black mb-1">Rent & Mortgage Rewards</h2>
          <p className="text-center text-gray-700 mb-2">
            Coming Soon — Get rewarded for your biggest monthly expenses like rent or mortgage payments.
          </p>
          <ComingSoonBadge />
        </Link>

        {/* Smart AI Insights - Clickable */}
        <Link href="/shopping"
          className="bg-gray-50 rounded-xl shadow p-8 flex flex-col items-center cursor-pointer hover:ring-2 hover:ring-orange-400 transition"
        >
          <Sparkles className="mb-4 text-orange-400" size={36} />
          <h2 className="font-bold text-lg text-black mb-1">Smart AI Insights</h2>
          <p className="text-center text-gray-700 mb-2">
            Personalized financial recommendations powered by advanced AI.
          </p>
        </Link>

        {/* Referral Rewards - Clickable */}
        <Link href="/shopping"
          className="bg-gray-50 rounded-xl shadow p-8 flex flex-col items-center cursor-pointer hover:ring-2 hover:ring-orange-400 transition"
        >
          <Users className="mb-4 text-purple-600" size={36} />
          <h2 className="font-bold text-lg text-black mb-1">Referral Rewards</h2>
          <p className="text-center text-gray-700 mb-2">
            Invite friends, get rewarded. The more you share, the more you earn!
          </p>
        </Link>

        {/* Shopping Marketplace - Clickable */}
        <Link href="/shopping"
          className="bg-gray-50 rounded-xl shadow p-8 flex flex-col items-center cursor-pointer hover:ring-2 hover:ring-blue-400 transition"
        >
          <ShoppingCart className="mb-4 text-blue-600" size={36} />
          <h2 className="font-bold text-lg text-black mb-1">Shopping Marketplace</h2>
          <p className="text-center text-gray-700 mb-2">
            Access exclusive offers and browse deals from top retailers in one app.
          </p>
        </Link>

        {/* Bonus & Limited-Time Offers - Clickable */}
        <Link href="/shopping"
          className="bg-gray-50 rounded-xl shadow p-8 flex flex-col items-center cursor-pointer hover:ring-2 hover:ring-green-400 transition"
        >
          <Gift className="mb-4 text-green-600" size={36} />
          <h2 className="font-bold text-lg text-black mb-1">Bonus & Limited-Time Offers</h2>
          <p className="text-center text-gray-700 mb-2">
            Unlock extra rewards, streak bonuses, and limited-time deals as you use RewMo.
          </p>
        </Link>

        {/* Made in America - Clickable */}
        <Link
          href={{ pathname: "/shopping", query: { filter: "american" } }}
          className="bg-gray-50 rounded-xl shadow p-8 flex flex-col items-center cursor-pointer hover:ring-2 hover:ring-blue-400 transition"
        >
          <BadgeCheck className="mb-4 text-blue-700" size={36} />
          <h2 className="font-bold text-lg text-black mb-1 flex items-center">
            Made in America <ComingSoonBadge />
          </h2>
          <p className="text-center text-gray-700 mb-2">
            Filter and earn extra rewards when you shop <span className="font-semibold text-blue-700">American-made</span> products and brands.
            Support local businesses and keep your dollars in the USA!
          </p>
        </Link>

        {/* Sustainable Shopping - Clickable */}
        <Link
          href={{ pathname: "/shopping", query: { filter: "sustainable" } }}
          className="bg-gray-50 rounded-xl shadow p-8 flex flex-col items-center cursor-pointer hover:ring-2 hover:ring-green-500 transition"
        >
          <Sparkles className="mb-4 text-green-600" size={36} />
          <h2 className="font-bold text-lg text-black mb-1 flex items-center">
            Sustainable Shopping <ComingSoonBadge />
          </h2>
          <p className="text-center text-gray-700 mb-2">
            Find and prioritize <span className="font-semibold text-green-700">sustainable</span>, eco-friendly, and clean energy products in the marketplace.
            Earn bonus rewards for making greener choices!
          </p>
        </Link>
      </div>
    </main>
  );
}
