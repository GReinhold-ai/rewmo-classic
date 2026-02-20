// src/pages/shopping.tsx
// Shopping page with affiliate tracking for all retailers
// FIXED: Opens links immediately to work on DuckDuckGo and other privacy browsers
// UPDATED: Removed proprietary commission language
// UPDATED: Shows status badges (Active, Pending, Coming Soon)
// UPDATED: Added sign-in overlay for guests
import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useAuth } from "@/lib/AuthProvider";
import SignInOverlay from "@/components/SignInOverlay";
import {
  getActiveRetailers,
  getFeaturedRetailers,
  getAllCategories,
  getApprovedRetailers,
  getStatusSummary,
  Retailer,
  AffiliateStatus,
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

// Log click in background (non-blocking)
function logClickInBackground(data: {
  memberId: string;
  retailerId: string;
  network: string;
  subId: string;
}) {
  // Use sendBeacon for reliable background logging, fallback to fetch
  const payload = JSON.stringify(data);
  
  if (navigator.sendBeacon) {
    navigator.sendBeacon("/api/affiliate/log-click", payload);
  } else {
    fetch("/api/affiliate/log-click", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
      keepalive: true, // Allows request to outlive the page
    }).catch(() => {}); // Ignore errors - don't block user
  }
}

export default function ShoppingPage() {
  const { currentUser } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [amazonSearch, setAmazonSearch] = useState("");
  const [showStatusFilter, setShowStatusFilter] = useState<"all" | "active" | "pending">("all");

  const activeRetailers = getActiveRetailers();
  const featuredRetailers = getFeaturedRetailers();
  const approvedRetailers = getApprovedRetailers();
  const categories = getAllCategories();
  const statusSummary = getStatusSummary();

  // Get status badge styling and text
  const getStatusBadge = (status: AffiliateStatus) => {
    switch (status) {
      case "active":
        return {
          text: "✓ Active",
          className: "bg-green-500/20 text-green-400 border-green-500/30",
        };
      case "pending":
        return {
          text: "⏳ Pending",
          className: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
        };
      case "declined":
        return {
          text: "🔄 Reapplying",
          className: "bg-orange-500/20 text-orange-400 border-orange-500/30",
        };
      case "not_applied":
        return {
          text: "🔜 Coming Soon",
          className: "bg-blue-500/20 text-blue-400 border-blue-500/30",
        };
      default:
        return {
          text: "–",
          className: "bg-gray-500/20 text-gray-400 border-gray-500/30",
        };
    }
  };

  // Check if retailer is ready for shopping (has active affiliate)
  const isRetailerReady = (retailer: Retailer): boolean => {
    return retailer.status === "active";
  };

  // Filter retailers by category, search, and status
  const filteredRetailers = activeRetailers.filter((r) => {
    // Status filter
    if (showStatusFilter === "active" && r.status !== "active") {
      return false;
    }
    if (showStatusFilter === "pending" && r.status === "active") {
      return false;
    }
    
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

  // Get retailer URL with optional tracking
  const getRetailerUrl = (retailer: Retailer, subId?: string): string => {
    if (retailer.network === "amazon") {
      if (subId) {
        const memberTag = `${AMAZON_TAG}-${subId.substring(0, 8)}`;
        return `https://www.amazon.com?tag=${memberTag}`;
      }
      return generateAmazonHomepageLink();
    }
    
    // For other retailers
    const baseUrl = retailer.affiliateUrl || retailer.baseUrl;
    if (subId && baseUrl) {
      try {
        const url = new URL(baseUrl);
        url.searchParams.set("subId", subId);
        return url.toString();
      } catch {
        return baseUrl;
      }
    }
    return baseUrl;
  };

  // Handle retailer click - FIXED: Opens immediately, logs in background
  const handleRetailerClick = (retailer: Retailer) => {
    // If retailer isn't ready, show message instead of navigating
    if (!isRetailerReady(retailer)) {
      alert(`${retailer.name} is coming soon! We're working on getting this partnership set up. Try one of our active stores like Amazon, Expedia, or Orbitz.`);
      return;
    }

    let url: string;
    
    if (currentUser) {
      // Generate tracking ID and URL
      const subId = generateSubId(currentUser.uid);
      url = getRetailerUrl(retailer, subId);
      
      // Log click in background (non-blocking)
      logClickInBackground({
        memberId: currentUser.uid,
        retailerId: retailer.id,
        network: retailer.network === "amazon" ? "amazon" : "direct",
        subId,
      });
    } else {
      // Not logged in - no tracking
      url = getRetailerUrl(retailer);
    }

    // Open immediately - works on all browsers including DuckDuckGo
    window.location.href = url;
  };

  // Handle Amazon search - FIXED: Opens immediately
  const handleAmazonSearch = () => {
    if (!amazonSearch.trim()) return;

    let url: string;

    if (currentUser) {
      const subId = generateSubId(currentUser.uid);
      const memberTag = `${AMAZON_TAG}-${subId.substring(0, 8)}`;
      url = `https://www.amazon.com/s?k=${encodeURIComponent(amazonSearch)}&tag=${memberTag}`;

      // Log in background
      logClickInBackground({
        memberId: currentUser.uid,
        retailerId: "amazon-search",
        network: "amazon",
        subId,
      });
    } else {
      url = generateAmazonSearchLink(amazonSearch);
    }

    window.location.href = url;
  };

  // Handle Amazon category click - FIXED: Opens immediately
  const handleAmazonCategoryClick = (category: keyof typeof AMAZON_CATEGORIES) => {
    let url: string;

    if (currentUser) {
      const subId = generateSubId(currentUser.uid);
      url = generateAmazonCategoryLink(category, currentUser.uid);

      // Log in background
      logClickInBackground({
        memberId: currentUser.uid,
        retailerId: `amazon-${category}`,
        network: "amazon",
        subId,
      });
    } else {
      url = generateAmazonCategoryLink(category);
    }

    window.location.href = url;
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
          content="Shop at your favorite stores and earn cashback rewards"
        />
      </Head>

      {/* Sign-in overlay for guests */}
      {!currentUser && (
        <SignInOverlay 
          title="Sign in to start earning"
          description="Shop through our links and earn cashback rewards on every purchase."
        />
      )}

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-[#FF9151] mb-2">
            Shop & Earn 💰
          </h1>
          <p className="text-white/70 max-w-2xl mx-auto">
            Shop through our links and earn <span className="text-[#15C5C1] font-bold">cashback rewards</span> on your purchases!
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

        {/* Status Summary */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6">
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
            <button
              onClick={() => setShowStatusFilter("all")}
              className={`px-4 py-2 rounded-lg transition ${
                showStatusFilter === "all"
                  ? "bg-[#FF9151] text-[#003B49] font-bold"
                  : "bg-white/10 text-white/70 hover:bg-white/20"
              }`}
            >
              All Stores ({activeRetailers.length})
            </button>
            <button
              onClick={() => setShowStatusFilter("active")}
              className={`px-4 py-2 rounded-lg transition flex items-center gap-2 ${
                showStatusFilter === "active"
                  ? "bg-green-500 text-white font-bold"
                  : "bg-green-500/20 text-green-400 hover:bg-green-500/30"
              }`}
            >
              <span>✓</span> Active ({statusSummary.active})
            </button>
            <button
              onClick={() => setShowStatusFilter("pending")}
              className={`px-4 py-2 rounded-lg transition flex items-center gap-2 ${
                showStatusFilter === "pending"
                  ? "bg-yellow-500 text-black font-bold"
                  : "bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30"
              }`}
            >
              <span>⏳</span> Coming Soon ({statusSummary.pending + statusSummary.declined + statusSummary.notApplied})
            </button>
          </div>
        </div>

        {/* User Status */}
        {currentUser && (
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">✅</span>
              <div>
                <p className="text-white font-medium">Tracking Active</p>
                <p className="text-white/60 text-sm">
                  Your purchases will be tracked for rewards
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
            {featuredRetailers.map((retailer) => {
              const badge = getStatusBadge(retailer.status);
              const ready = isRetailerReady(retailer);
              
              return (
                <button
                  key={retailer.id}
                  onClick={() => handleRetailerClick(retailer)}
                  className={`bg-white/5 border rounded-xl p-6 transition text-left group ${
                    ready 
                      ? "border-white/10 hover:bg-white/10 cursor-pointer" 
                      : "border-white/5 opacity-75 cursor-not-allowed"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className={`text-lg font-bold ${ready ? "text-white group-hover:text-[#FF9151]" : "text-white/70"}`}>
                      {retailer.name}
                    </h3>
                    <span className={`text-xs px-2 py-1 rounded border ${badge.className}`}>
                      {badge.text}
                    </span>
                  </div>
                  <p className="text-white/60 text-sm mb-3">
                    {retailer.description}
                  </p>
                  <div className="flex items-center justify-between">
                    {retailer.commission && (
                      <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">
                        Up to {retailer.commission}
                      </span>
                    )}
                    <span className={`text-sm font-medium ${ready ? "text-[#15C5C1]" : "text-white/40"}`}>
                      {ready ? "Shop Now →" : "Coming Soon"}
                    </span>
                  </div>
                </button>
              );
            })}
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
          {filteredRetailers.map((retailer) => {
            const badge = getStatusBadge(retailer.status);
            const ready = isRetailerReady(retailer);
            
            return (
              <button
                key={retailer.id}
                onClick={() => handleRetailerClick(retailer)}
                className={`bg-white/5 border rounded-xl p-5 transition text-left group ${
                  ready 
                    ? "border-white/10 hover:bg-white/10 cursor-pointer" 
                    : "border-white/5 opacity-70 cursor-not-allowed"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className={`text-lg font-bold ${ready ? "text-white group-hover:text-[#FF9151]" : "text-white/60"}`}>
                    {retailer.name}
                  </h3>
                  <span className={`text-xs px-2 py-1 rounded border ${badge.className}`}>
                    {badge.text}
                  </span>
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
                  <div className="flex items-center gap-2">
                    {retailer.commission && ready && (
                      <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded">
                        {retailer.commission}
                      </span>
                    )}
                    <span className={`text-sm font-medium transition ${
                      ready 
                        ? "text-[#15C5C1] opacity-0 group-hover:opacity-100" 
                        : "text-white/30"
                    }`}>
                      {ready ? "Shop →" : "Soon"}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
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
              <h3 className="font-bold text-white mb-1">Earn Rewards</h3>
              <p className="text-white/60 text-sm">
                We track your purchase automatically
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">4️⃣</div>
              <h3 className="font-bold text-white mb-1">Get Cashback!</h3>
              <p className="text-white/60 text-sm">
                Rewards are credited to your account
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
                How long until I see my rewards?
              </p>
              <p className="text-white/60 text-sm">
                Rewards typically appear within 24-72 hours after your purchase is confirmed.
              </p>
            </div>
            <div>
              <p className="font-semibold text-white">
                What's the minimum payout?
              </p>
              <p className="text-white/60 text-sm">
                Payouts are processed for approved rewards over $25.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}