// src/pages/shopping.tsx
import { useState, useMemo } from "react";
import Head from "next/head";
import Link from "next/link";
import { useAuth } from "@/lib/AuthProvider";
import { 
  retailers, 
  filterRetailers, 
  type RetailerCategory,
  type MembershipTier,
  type Retailer
} from "@/data/retailers";

export default function ShoppingPage() {
  const { currentUser } = useAuth();
  
  // Filter states
  const [activeCategory, setActiveCategory] = useState<RetailerCategory | "all">("all");
  const [showBuyAmerican, setShowBuyAmerican] = useState(false);
  const [showSustainable, setShowSustainable] = useState(false);
  const [activeTab, setActiveTab] = useState<"personal" | "business">("personal");
  const [clickingRetailer, setClickingRetailer] = useState<string | null>(null);
  
  // Get user's tier from Firestore (you'll need to fetch this)
  const userTier = "FREE" as MembershipTier;
  
  // Filter retailers based on selected options
  const filteredRetailers = useMemo(() => {
    let filters: any = {
      tier: userTier,
    };
    
    if (activeCategory !== "all") {
      filters.category = activeCategory;
    }
    
    if (showBuyAmerican) {
      filters.buyAmerican = true;
    }
    
    if (showSustainable) {
      filters.sustainable = true;
    }
    
    let filtered = filterRetailers(filters);
    
    // Filter by tab (personal vs business)
    if (activeTab === "business") {
      filtered = filtered.filter(r => r.isBusinessOnly);
    } else {
      filtered = filtered.filter(r => !r.isBusinessOnly);
    }
    
    return filtered;
  }, [activeCategory, showBuyAmerican, showSustainable, activeTab, userTier]);
  
  // Track affiliate click and get tracked URL
  const handleAffiliateClick = async (retailerId: string, originalUrl: string): Promise<string> => {
    if (!currentUser) {
      // Not logged in, just return original URL
      return originalUrl;
    }

    try {
      const token = await currentUser.getIdToken();
      const response = await fetch("/api/affiliate/log-click", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ retailerId }),
      });

      if (response.ok) {
        const data = await response.json();
        return data.url; // Return the tracked URL with subId
      }
    } catch (error) {
      console.error("Failed to log affiliate click:", error);
    }

    // Fallback to original URL
    return originalUrl;
  };

  // Handle shop button click
  const handleShopClick = async (retailer: Retailer) => {
    setClickingRetailer(retailer.id);
    try {
      const trackedUrl = await handleAffiliateClick(retailer.id, retailer.affiliateLink);
      window.open(trackedUrl, "_blank", "noopener,noreferrer");
    } finally {
      setClickingRetailer(null);
    }
  };

  // Check if user has access to retailer
  const hasAccessToRetailer = (retailer: Retailer): boolean => {
    const tierHierarchy: Record<MembershipTier, number> = {
      FREE: 0,
      PRO: 1,
      BUSINESS: 2,
    };
    return tierHierarchy[userTier] >= tierHierarchy[retailer.requiredTier];
  };
  
  return (
    <div className="min-h-screen bg-[#003B49] text-white">
      <Head>
        <title>Shopping Rewards | RewmoAI</title>
        <meta name="description" content="Earn points when you shop at your favorite stores" />
      </Head>
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-[#FF9151] mb-4">
            Shopping Rewards
          </h1>
          <p className="text-white/90 text-lg">
            Earn points when you shop. {userTier === "FREE" && "Upgrade to Pro to unlock more stores!"}
          </p>
          
          {/* Affiliate Earnings Link */}
          {currentUser && (
            <Link 
              href="/account/earnings"
              className="inline-block mt-4 text-[#15C5C1] hover:text-[#1DE5E0] underline"
            >
              View Your Affiliate Earnings →
            </Link>
          )}
        </div>
        
        {/* Tabs: Personal vs Business */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setActiveTab("personal")}
            className={`px-6 py-3 rounded-lg font-bold transition ${
              activeTab === "personal"
                ? "bg-[#FF9151] text-[#003B49]"
                : "bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            Personal Shopping
          </button>
          <button
            onClick={() => setActiveTab("business")}
            className={`px-6 py-3 rounded-lg font-bold transition ${
              activeTab === "business"
                ? "bg-[#FF9151] text-[#003B49]"
                : "bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            Business Shopping
            {userTier !== "BUSINESS" && (
              <span className="ml-2 text-xs bg-orange-600 px-2 py-1 rounded">
                Upgrade
              </span>
            )}
          </button>
        </div>
        
        {/* Filter Bar */}
        <div className="bg-white/5 rounded-xl p-6 mb-8 border border-white/10">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Category Filter */}
            <div className="flex-1 w-full">
              <label className="block text-sm font-semibold mb-2 text-[#15C5C1]">
                Category
              </label>
              <select
                value={activeCategory}
                onChange={(e) => setActiveCategory(e.target.value as any)}
                className="w-full bg-[#003B49] border border-white/20 rounded-lg px-4 py-2 text-white focus:border-[#FF9151] focus:outline-none"
              >
                <option value="all">All Categories</option>
                <option value="general">General Retail</option>
                <option value="grocery">Grocery</option>
                <option value="electronics">Electronics</option>
                <option value="home">Home & Garden</option>
                <option value="clothing">Clothing</option>
                <option value="travel">Travel</option>
                <option value="office">Office Supplies</option>
                <option value="sustainable">Sustainable</option>
                <option value="handmade">Handmade</option>
              </select>
            </div>
            
            {/* Badge Filters */}
            <div className="flex gap-4 items-end">
              <button
                onClick={() => setShowBuyAmerican(!showBuyAmerican)}
                className={`px-4 py-2 rounded-lg font-semibold border-2 transition flex items-center gap-2 ${
                  showBuyAmerican
                    ? "bg-blue-600 border-blue-600 text-white"
                    : "bg-transparent border-blue-400 text-blue-400 hover:bg-blue-600/20"
                }`}
              >
                <span className="text-xl">🇺🇸</span>
                Buy American
              </button>
              
              <button
                onClick={() => setShowSustainable(!showSustainable)}
                className={`px-4 py-2 rounded-lg font-semibold border-2 transition flex items-center gap-2 ${
                  showSustainable
                    ? "bg-green-600 border-green-600 text-white"
                    : "bg-transparent border-green-400 text-green-400 hover:bg-green-600/20"
                }`}
              >
                <span className="text-xl">🌱</span>
                Sustainable
              </button>
            </div>
          </div>
        </div>
        
        {/* Active Filters Display */}
        {(showBuyAmerican || showSustainable || activeCategory !== "all") && (
          <div className="mb-6 flex flex-wrap gap-2">
            <span className="text-white/60 text-sm">Active filters:</span>
            {activeCategory !== "all" && (
              <span className="bg-[#15C5C1] text-[#003B49] px-3 py-1 rounded-full text-sm font-semibold">
                {activeCategory}
              </span>
            )}
            {showBuyAmerican && (
              <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                🇺🇸 Buy American
              </span>
            )}
            {showSustainable && (
              <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                🌱 Sustainable
              </span>
            )}
            <button
              onClick={() => {
                setActiveCategory("all");
                setShowBuyAmerican(false);
                setShowSustainable(false);
              }}
              className="text-orange-400 hover:text-orange-300 text-sm underline"
            >
              Clear all
            </button>
          </div>
        )}
        
        {/* Pro Upgrade Notice (for Business tab if not Business tier) */}
        {activeTab === "business" && userTier !== "BUSINESS" && (
          <div className="bg-orange-500/10 border border-orange-400/40 rounded-xl p-6 mb-8">
            <h3 className="text-orange-400 font-bold text-xl mb-2">
              🔒 Upgrade to Business
            </h3>
            <p className="text-white/90 mb-4">
              Unlock business shopping rewards, bulk pricing, and expense tracking features.
            </p>
            <Link
              href="/account/upgrade"
              className="inline-block bg-[#FF9151] text-[#003B49] px-6 py-2 rounded-lg font-bold hover:bg-[#FFA36C] transition"
            >
              Upgrade to Business ($20/mo)
            </Link>
          </div>
        )}
        
        {/* Retailer Grid */}
        {filteredRetailers.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-white/60 text-lg">
              No stores match your filters. Try adjusting your selection.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRetailers.map((retailer) => (
              <div
                key={retailer.id}
                className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-[#FF9151] transition group"
              >
                {/* Badges */}
                <div className="flex gap-2 mb-3 flex-wrap">
                  <span className="bg-[#FF9151] text-[#003B49] px-3 py-1 rounded-full text-xs font-bold">
                    {retailer.pointsMultiplier}x points
                  </span>
                  {retailer.isBuyAmerican && (
                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                      🇺🇸 American
                    </span>
                  )}
                  {retailer.isSustainable && (
                    <span className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                      🌱 Sustainable
                    </span>
                  )}
                  {retailer.requiredTier !== "FREE" && (
                    <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                      {retailer.requiredTier}
                    </span>
                  )}
                </div>
                
                {/* Retailer Info */}
                <h3 className="text-2xl font-bold text-[#FF9151] mb-2 group-hover:text-[#FFA36C] transition">
                  {retailer.name}
                </h3>
                <p className="text-white/80 text-sm mb-4">
                  {retailer.description}
                </p>
                
                {/* Certifications */}
                {retailer.certifications && retailer.certifications.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs text-white/50 mb-1">Certifications:</p>
                    <div className="flex flex-wrap gap-1">
                      {retailer.certifications.map((cert) => (
                        <span
                          key={cert}
                          className="text-xs bg-white/10 text-white/70 px-2 py-1 rounded"
                        >
                          {cert}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* CTA Button */}
                {hasAccessToRetailer(retailer) ? (
                  <button
                    onClick={() => handleShopClick(retailer)}
                    disabled={clickingRetailer === retailer.id}
                    className="block w-full text-center bg-[#FF9151] text-[#003B49] px-4 py-3 rounded-lg font-bold hover:bg-[#FFA36C] transition disabled:opacity-50 disabled:cursor-wait"
                  >
                    {clickingRetailer === retailer.id ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Opening...
                      </span>
                    ) : (
                      "Shop & Earn →"
                    )}
                  </button>
                ) : (
                  <Link
                    href="/account/upgrade"
                    className="block w-full text-center bg-gray-600 text-white px-4 py-3 rounded-lg font-bold hover:bg-gray-700 transition"
                  >
                    Upgrade to {retailer.requiredTier}
                  </Link>
                )}
              </div>
            ))}
          </div>
        )}
        
        {/* Info Box */}
        <div className="mt-12 bg-white/5 border border-white/10 rounded-xl p-6">
          <h3 className="text-xl font-bold text-[#15C5C1] mb-3">
            How It Works
          </h3>
          <ol className="space-y-2 text-white/80">
            <li>1. Click "Shop & Earn" on any retailer</li>
            <li>2. Complete your purchase on their website</li>
            <li>3. Earn reward points automatically (tracked within 48 hours)</li>
            <li>4. Redeem points for cash, gift cards, or donations</li>
          </ol>
          
          {/* 50/50 Revenue Share Info */}
          <div className="mt-6 p-4 bg-[#15C5C1]/10 border border-[#15C5C1]/30 rounded-lg">
            <h4 className="font-bold text-[#15C5C1] mb-2">💰 Earn Real Cash!</h4>
            <p className="text-white/80 text-sm">
              When you shop through our links, we earn a small commission from the retailer. 
              <strong className="text-[#FF9151]"> We share 50% of that commission with you!</strong> 
              {" "}Check your earnings in your account dashboard.
            </p>
          </div>
          
          <p className="mt-4 text-sm text-white/60">
            Note: Points are calculated based on your purchase total. Some exclusions may apply.
          </p>
        </div>

        {/* Affiliate Disclosure */}
        <div className="mt-8 text-center">
          <Link 
            href="/affiliate-disclosure" 
            className="text-white/40 hover:text-white/60 text-xs underline"
          >
            Affiliate Disclosure
          </Link>
        </div>
      </main>
    </div>
  );
}