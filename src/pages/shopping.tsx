// src/pages/shopping.tsx
// Shopping page with affiliate tracking for all retailers
import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { useAuth } from "@/lib/AuthProvider";
import {
  retailers,
  getActiveRetailers,
  getFeaturedRetailers,
  getAllCategories,
  Retailer,
} from "@/data/retailers";
import {
  generateAmazonHomepageLink,
  generateAmazonSearchLink,
  generateAmazonCategoryLink,
  AMAZON_CATEGORIES,
  AMAZON_TAG,
} from "@/lib/amazonLinks";

// Generate a unique sub-ID for tracking (client-side version)
function generateSubId(memberId: string): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `${memberId.substring(0, 8)}_${timestamp}_${random}`;
}

export default function ShoppingPage() {
  const { currentUser } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [amazonSearch, setAmazonSearch] = useState("");

  const activeRetailers = getActiveRetailers();
  const featuredRetailers = getFeaturedRetailers();
  const categories = getAllCategories();

  // Filter retailers by category and search
  const filteredRetailers = activeRetailers.filter((r) => {
    if (selectedCategory !== "all" && !r.category.includes(selectedCategory)) {
      return false;
    }
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      return (
        r.name.toLowerCase().includes(search) ||
        r.description.toLowerCase().includes(search)
      );
    }
    return true;
  });

  // Log click and redirect
  const handleRetailerClick = async (retailer: Retailer) => {
    if (!currentUser) {
      // If not logged in, just redirect without tracking
      window.open(getRetailerUrl(retailer), "_blank");
      return;
    }

    try {
      // Generate subId for tracking
      const subId = generateSubId(currentUser.uid);

      // Log the click
      await fetch("/api/affiliate/log-click", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          memberId: currentUser.uid,
          retailerId: retailer.id,
          network: retailer.network === "amazon" ? "amazon" : "direct",
          subId,
        }),
      });

      // Get the affiliate URL with tracking
      const url = getRetailerUrlWithTracking(retailer, subId);

      // Open in new tab
      window.open(url, "_blank");
    } catch (error) {
      console.error("Error logging click:", error);
      // Still redirect even if logging fails
      window.open(getRetailerUrl(retailer), "_blank");
    }
  };

  // Get retailer URL without tracking
  const getRetailerUrl = (retailer: Retailer): string => {
    if (retailer.network === "amazon") {
      return generateAmazonHomepageLink();
    }
    return retailer.affiliateUrl || retailer.baseUrl;
  };

  // Get retailer URL with member tracking
  const getRetailerUrlWithTracking = (retailer: Retailer, subId: string): string => {
    if (retailer.network === "amazon") {
      // For Amazon, append subId to the tag
      const memberTag = `${AMAZON_TAG}-${subId.substring(0, 8)}`;
      return `https://www.amazon.com?tag=${memberTag}`;
    }

    // For other retailers, add subId as a query param if possible
    const baseUrl = retailer.affiliateUrl || retailer.baseUrl;
    try {
      const url = new URL(baseUrl);
      url.searchParams.set("subId", subId);
      return url.toString();
    } catch {
      return baseUrl;
    }
  };

  // Handle Amazon search
  const handleAmazonSearch = async () => {
    if (!amazonSearch.trim()) return;

    if (currentUser) {
      try {
        const subId = generateSubId(currentUser.uid);

        await fetch("/api/affiliate/log-click", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            memberId: currentUser.uid,
            retailerId: "amazon-search",
            network: "amazon",
            subId,
          }),
        });

        const memberTag = `${AMAZON_TAG}-${subId.substring(0, 8)}`;
        const url = `https://www.amazon.com/s?k=${encodeURIComponent(amazonSearch)}&tag=${memberTag}`;
        window.open(url, "_blank");
      } catch (error) {
        console.error("Error:", error);
        window.open(generateAmazonSearchLink(amazonSearch), "_blank");
      }
    } else {
      window.open(generateAmazonSearchLink(amazonSearch), "_blank");
    }
  };

  // Handle Amazon category click
  const handleAmazonCategoryClick = async (category: keyof typeof AMAZON_CATEGORIES) => {
    if (currentUser) {
      try {
        const subId = generateSubId(currentUser.uid);

        await fetch("/api/affiliate/log-click", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            memberId: currentUser.uid,
            retailerId: `amazon-${category}`,
            network: "amazon",
            subId,
          }),
        });

        const url = generateAmazonCategoryLink(category, currentUser.uid);
        window.open(url, "_blank");
      } catch (error) {
        console.error("Error:", error);
        window.open(generateAmazonCategoryLink(category), "_blank");
      }
    } else {
      window.open(generateAmazonCategoryLink(category), "_blank");
    }
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      electronics: "📱",
      home: "🏠",
      fashion: "👕",
      beauty: "💄",
      sports: "⚽",
      pets: "🐕",
      groceries: "🛒",
      everything: "🏪",
      shoes: "👟",
      outdoors: "🏕️",
      fitness: "💪",
      furniture: "🛋️",
      tools: "🔧",
    };
    return icons[category] || "📦";
  };

  return (
    <div className="min-h-screen bg-[#003B49] text-white">
      <Head>
        <title>Shopping Rewards | RewmoAI</title>
        <meta
          name="description"
          content="Shop at your favorite stores and earn 50% of affiliate commissions"
        />
      </Head>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-[#FF9151] mb-2">
            Shop & Earn 💰
          </h1>
          <p className="text-white/70 max-w-2xl mx-auto">
            Shop through our links and earn <span className="text-[#15C5C1] font-bold">50%</span> of the affiliate commission! 
            {!currentUser && (
              <span className="block mt-2">
                <Link href="/account" className="text-[#FF9151] underline">
                  Sign in
                </Link>{" "}
                to track your earnings.
              </span>
            )}
          </p>
        </div>

        {/* User Status */}
        {currentUser && (
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">✅</span>
              <div>
                <p className="text-white font-medium">Tracking Active</p>
                <p className="text-white/60 text-sm">
                  Your purchases will be tracked for commission sharing
                </p>
              </div>
            </div>
            <Link
              href="/account/earnings"
              className="px-4 py-2 bg-[#FF9151] text-[#003B49] rounded-lg font-bold hover:bg-[#FFA36C] transition"
            >
              View Earnings →
            </Link>
          </div>
        )}

        {/* Amazon Special Section */}
        <div className="bg-gradient-to-r from-[#FF9900]/20 to-[#FF9900]/5 border border-[#FF9900]/30 rounded-xl p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl">🛒</span>
            <div>
              <h2 className="text-2xl font-bold text-[#FF9900]">Amazon</h2>
              <p className="text-white/70">Search or browse categories</p>
            </div>
          </div>

          {/* Amazon Search */}
          <div className="flex gap-3 mb-6">
            <input
              type="text"
              value={amazonSearch}
              onChange={(e) => setAmazonSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAmazonSearch()}
              placeholder="Search Amazon..."
              className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/40 focus:ring-2 focus:ring-[#FF9900] focus:border-transparent"
            />
            <button
              onClick={handleAmazonSearch}
              className="px-6 py-3 bg-[#FF9900] text-black font-bold rounded-lg hover:bg-[#FFB347] transition"
            >
              Search
            </button>
          </div>

          {/* Amazon Categories */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {(Object.keys(AMAZON_CATEGORIES) as Array<keyof typeof AMAZON_CATEGORIES>).map(
              (category) => (
                <button
                  key={category}
                  onClick={() => handleAmazonCategoryClick(category)}
                  className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition text-center"
                >
                  <span className="text-xl block mb-1">
                    {getCategoryIcon(category)}
                  </span>
                  <span className="text-sm capitalize text-white/80">
                    {category.replace(/([A-Z])/g, " $1").trim()}
                  </span>
                </button>
              )
            )}
          </div>

          {/* Shop Amazon Button */}
          <div className="mt-4 text-center">
            <button
              onClick={() =>
                handleRetailerClick(activeRetailers.find((r) => r.id === "amazon")!)
              }
              className="px-8 py-3 bg-[#FF9900] text-black font-bold rounded-lg hover:bg-[#FFB347] transition"
            >
              Shop Amazon Homepage →
            </button>
          </div>
        </div>

        {/* Featured Retailers */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-[#15C5C1] mb-4">
            ⭐ Featured Retailers
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {featuredRetailers.map((retailer) => (
              <button
                key={retailer.id}
                onClick={() => handleRetailerClick(retailer)}
                className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition text-left group"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-bold text-white group-hover:text-[#FF9151]">
                    {retailer.name}
                  </h3>
                  {retailer.commission && (
                    <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">
                      {retailer.commission}
                    </span>
                  )}
                </div>
                <p className="text-white/60 text-sm mb-3">
                  {retailer.description}
                </p>
                <span className="text-[#15C5C1] text-sm font-medium">
                  Shop Now →
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              selectedCategory === "all"
                ? "bg-[#FF9151] text-[#003B49]"
                : "bg-white/10 text-white/70 hover:bg-white/20"
            }`}
          >
            All Stores
          </button>
          {categories.slice(0, 8).map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                selectedCategory === category
                  ? "bg-[#FF9151] text-[#003B49]"
                  : "bg-white/10 text-white/70 hover:bg-white/20"
              }`}
            >
              {getCategoryIcon(category)} {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search stores..."
            className="w-full md:w-64 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/40 focus:ring-2 focus:ring-[#FF9151]"
          />
        </div>

        {/* All Retailers Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRetailers.map((retailer) => (
            <button
              key={retailer.id}
              onClick={() => handleRetailerClick(retailer)}
              className="bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/10 transition text-left group"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold text-white group-hover:text-[#FF9151]">
                  {retailer.name}
                </h3>
                {retailer.commission && (
                  <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">
                    {retailer.commission}
                  </span>
                )}
              </div>
              <p className="text-white/60 text-sm mb-2">
                {retailer.description}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex gap-1">
                  {retailer.category.slice(0, 2).map((cat) => (
                    <span
                      key={cat}
                      className="text-xs bg-white/10 text-white/50 px-2 py-0.5 rounded"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
                <span className="text-[#15C5C1] text-sm font-medium opacity-0 group-hover:opacity-100 transition">
                  Shop →
                </span>
              </div>
            </button>
          ))}
        </div>

        {filteredRetailers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-white/60">No stores found matching your criteria</p>
          </div>
        )}

        {/* How It Works */}
        <div className="mt-12 bg-white/5 border border-white/10 rounded-xl p-6">
          <h2 className="text-xl font-bold text-[#15C5C1] mb-4">
            How Shopping Rewards Work
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-2">1️⃣</div>
              <h3 className="font-bold text-white mb-1">Click a Store</h3>
              <p className="text-white/60 text-sm">
                Choose any retailer above and click to shop
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">2️⃣</div>
              <h3 className="font-bold text-white mb-1">Shop Normally</h3>
              <p className="text-white/60 text-sm">
                Browse and buy what you need
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">3️⃣</div>
              <h3 className="font-bold text-white mb-1">We Earn Commission</h3>
              <p className="text-white/60 text-sm">
                Retailers pay us a small percentage
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">4️⃣</div>
              <h3 className="font-bold text-white mb-1">You Get 50%!</h3>
              <p className="text-white/60 text-sm">
                We share half of every commission with you
              </p>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-8 bg-white/5 border border-white/10 rounded-xl p-6">
          <h2 className="text-xl font-bold text-[#15C5C1] mb-4">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            <div>
              <p className="font-semibold text-white">
                Do I need to be signed in to earn?
              </p>
              <p className="text-white/60 text-sm">
                Yes! Sign in before clicking store links so we can track your purchases and credit your account.
              </p>
            </div>
            <div>
              <p className="font-semibold text-white">
                How long until I see my commission?
              </p>
              <p className="text-white/60 text-sm">
                Commissions typically appear within 24-72 hours. Amazon may take longer as we import reports manually.
              </p>
            </div>
            <div>
              <p className="font-semibold text-white">
                What's the minimum payout?
              </p>
              <p className="text-white/60 text-sm">
                Payouts are processed for approved commissions over $25.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
