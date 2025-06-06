import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const personalOffers = [
  {
    logo: "/brands/amazon.png",
    title: "Amazon",
    description: "Earn up to 5% back on your everyday shopping.",
    reward: "Up to 5% back",
    url: "https://www.amazon.com/",
  },
  {
    logo: "/brands/walmart.png",
    title: "Walmart",
    description: "Get 3% back on electronics, groceries, and more.",
    reward: "3% back",
    url: "https://www.walmart.com/",
  },
];

const businessOffers = [
  {
    logo: "/brands/office-depot.png",
    title: "Office Depot",
    description: "Earn 5% back on office supplies and equipment.",
    reward: "5% back",
    url: "https://www.officedepot.com/",
  },
  {
    logo: "/brands/quickbooks.png",
    title: "QuickBooks",
    description: "Get $75 cash back on your first subscription.",
    reward: "$75 back",
    url: "https://quickbooks.intuit.com/",
  },
  {
    logo: "/brands/amazon-business.png",
    title: "Amazon Business",
    description: "Up to 4% back on all business purchases.",
    reward: "Up to 4% back",
    url: "https://www.amazon.com/business",
  },
];

const OfferCard = ({ offer }: { offer: typeof personalOffers[0] }) => (
  <a
    href={offer.url}
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center space-x-4 bg-[#072b33] hover:bg-[#003B49] rounded-2xl p-4 mb-4 shadow border border-[#15C5C1] transition"
  >
    <Image src={offer.logo} alt={offer.title} width={48} height={48} className="rounded-xl bg-white p-1" />
    <div className="flex-1">
      <div className="font-bold text-[#FF9151] text-lg">{offer.title}</div>
      <div className="text-[#B6E7EB] text-sm">{offer.description}</div>
    </div>
    <div className="bg-[#FF9151] text-[#003B49] font-bold px-3 py-1 rounded-xl text-base shadow-md">
      {offer.reward}
    </div>
    <span className="ml-3 text-[#15C5C1] font-black text-xl">→</span>
  </a>
);

export default function ShoppingPage() {
  const [tab, setTab] = useState<"personal" | "business">("personal");

  return (
    <div className="flex flex-col min-h-screen bg-[#003B49] font-sans">
      {/* Top Nav */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-[#072b33] bg-[#003B49]">
        <div className="flex items-center space-x-3">
          <Image src="/logos/logo.png" alt="RewmoAI Logo" width={40} height={40} />
          <span className="font-extrabold text-xl text-[#FF9151]">RewmoAI</span>
        </div>
        <nav className="space-x-5">
          <Link href="/" className="text-[#15C5C1] hover:text-[#FFA36C] font-semibold hover:underline">Home</Link>
          <Link href="/lean-lab" className="text-[#FF9151] hover:text-[#FFA36C] font-semibold hover:underline">Lean Lab</Link>
          <Link href="/profile" className="text-[#FF9151] hover:text-[#FFA36C] font-semibold hover:underline">Profile</Link>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center px-2 py-10">
        <h1 className="text-2xl md:text-3xl font-black mb-7 text-[#FF9151] tracking-tight">Shopping Rewards</h1>

        {/* Tabs */}
        <div className="flex space-x-2 mb-8 rounded-xl bg-[#072b33] p-2 border border-[#15C5C1] shadow">
          <button
            className={`px-7 py-2 rounded-xl font-bold text-lg transition-all ${
              tab === "personal"
                ? "bg-[#FF9151] text-[#003B49] shadow"
                : "bg-transparent text-[#FF9151] hover:bg-[#FFA36C] hover:text-[#003B49]"
            }`}
            onClick={() => setTab("personal")}
          >
            Personal
          </button>
          <button
            className={`px-7 py-2 rounded-xl font-bold text-lg transition-all ${
              tab === "business"
                ? "bg-[#FF9151] text-[#003B49] shadow"
                : "bg-transparent text-[#FF9151] hover:bg-[#FFA36C] hover:text-[#003B49]"
            }`}
            onClick={() => setTab("business")}
          >
            Business
          </button>
        </div>

        {/* Offers */}
        <div className="w-full max-w-2xl">
          {tab === "personal" &&
            <>
              <div className="mb-4 text-[#B6E7EB] text-base text-center">Shop for yourself and get instant rewards on popular brands.</div>
              {personalOffers.map((offer, i) => (
                <OfferCard key={i} offer={offer} />
              ))}
            </>
          }
          {tab === "business" &&
            <>
              <div className="mb-4 text-[#B6E7EB] text-base text-center">Earn rewards on business expenses—SaaS, supplies, travel & more.</div>
              {businessOffers.map((offer, i) => (
                <OfferCard key={i} offer={offer} />
              ))}
            </>
          }
        </div>

        {/* How it works */}
        <div className="mt-8 mb-4">
          <Link href="/how-rewards-work" className="text-[#15C5C1] font-semibold underline text-base hover:text-[#FFA36C]">
            How shopping rewards work →
          </Link>
        </div>

        {/* Affiliate Disclosure */}
        <div className="text-[#F7F6F2] text-xs text-center mt-2">
          We may receive compensation when you shop through our affiliate partners. Rewards terms may vary by offer.
        </div>
      </main>

      {/* Footer */}
      <footer className="text-[#F7F6F2] text-xs py-4 text-center border-t border-[#072b33] bg-[#003B49]">
        <span>
          © {new Date().getFullYear()} RewmoAI |{" "}
          <Link href="/affiliate-disclosure" className="underline hover:text-[#FFA36C] text-[#FF9151]">Affiliate Disclosure</Link> |{" "}
          <Link href="/privacy" className="underline hover:text-[#FFA36C] text-[#FF9151]">Privacy</Link> |{" "}
          <Link href="/terms" className="underline hover:text-[#FFA36C] text-[#FF9151]">Terms</Link>
        </span>
      </footer>
    </div>
  );
}
