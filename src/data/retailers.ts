// src/data/retailers.ts
// Retailer data for affiliate shopping page
// Updated: Added status field (active/pending/declined), Expedia, Orbitz

export type AffiliateStatus = "active" | "pending" | "declined" | "not_applied";

export interface Retailer {
  id: string;
  name: string;
  logo?: string;
  description: string;
  category: string[];
  network: "amazon" | "rakuten" | "cj" | "shareasale" | "impact" | "direct" | "none";
  baseUrl: string;
  affiliateUrl?: string; // URL with affiliate tracking - add when approved
  affiliateTag?: string;
  commission?: string; // e.g., "1-10%"
  cookieDays?: number;
  featured?: boolean;
  active: boolean;
  status: AffiliateStatus; // Track approval status
}

export const retailers: Retailer[] = [
  // ===== ACTIVE - APPROVED AFFILIATES =====
  
  {
    id: "amazon",
    name: "Amazon",
    logo: "/images/retailers/amazon.png",
    description: "Everything store - electronics, home, fashion, and more",
    category: ["everything", "electronics", "home", "fashion"],
    network: "amazon",
    baseUrl: "https://www.amazon.com",
    affiliateTag: "rewmoai-20",
    commission: "1-10%",
    cookieDays: 1,
    featured: true,
    active: true,
    status: "active", // ✅ Amazon Associates ACTIVE
  },

  {
    id: "expedia",
    name: "Expedia",
    logo: "/images/retailers/expedia.png",
    description: "Book flights, hotels, car rentals & vacation packages",
    category: ["travel", "hotels", "flights", "vacation"],
    network: "cj",
    baseUrl: "https://www.expedia.com",
    affiliateUrl: "", // TODO: Get link from CJ dashboard
    commission: "2-6%",
    cookieDays: 7,
    featured: true,
    active: true,
    status: "active", // ✅ CJ Affiliate ACTIVE
  },

  {
    id: "orbitz",
    name: "Orbitz",
    logo: "/images/retailers/orbitz.png",
    description: "Discount travel - flights, hotels & vacation deals",
    category: ["travel", "hotels", "flights", "vacation"],
    network: "cj",
    baseUrl: "https://www.orbitz.com",
    affiliateUrl: "", // TODO: Get link from CJ dashboard
    commission: "2-6%",
    cookieDays: 7,
    featured: true,
    active: true,
    status: "active", // ✅ CJ Affiliate ACTIVE
  },

  // ===== PENDING APPROVAL =====

  {
    id: "walmart",
    name: "Walmart",
    logo: "/images/retailers/walmart.png",
    description: "Low prices on groceries, electronics, home goods & more",
    category: ["everything", "groceries", "electronics", "home"],
    network: "impact",
    baseUrl: "https://www.walmart.com",
    affiliateUrl: "",
    commission: "1-4%",
    cookieDays: 3,
    featured: true,
    active: true,
    status: "pending", // ⏳ Walmart Impact - PENDING REVIEW
  },

  {
    id: "target",
    name: "Target",
    logo: "/images/retailers/target.png",
    description: "Expect more, pay less - style, home, electronics",
    category: ["everything", "home", "fashion", "electronics"],
    network: "impact",
    baseUrl: "https://www.target.com",
    affiliateUrl: "",
    commission: "1-8%",
    cookieDays: 7,
    featured: true,
    active: true,
    status: "not_applied", // 📝 Need to apply
  },

  // ===== FASHION - VARIOUS STATUS =====

  {
    id: "landsend",
    name: "Lands' End",
    logo: "/images/retailers/landsend.png",
    description: "Quality clothing, outerwear & home products since 1963",
    category: ["fashion", "clothing", "outerwear", "home"],
    network: "cj",
    baseUrl: "https://www.landsend.com",
    affiliateUrl: "",
    commission: "2%",
    cookieDays: 14,
    featured: false,
    active: true,
    status: "declined", // ❌ CJ - Declined (can reapply)
  },

  {
    id: "talbots",
    name: "Talbots",
    logo: "/images/retailers/talbots.png",
    description: "Classic women's clothing, shoes & accessories",
    category: ["fashion", "clothing", "women", "accessories"],
    network: "cj",
    baseUrl: "https://www.talbots.com",
    affiliateUrl: "",
    commission: "5-8%",
    cookieDays: 14,
    featured: false,
    active: true,
    status: "not_applied", // 📝 Need to apply on CJ
  },

  {
    id: "nordstrom",
    name: "Nordstrom",
    logo: "/images/retailers/nordstrom.png",
    description: "Designer fashion, shoes, beauty & accessories",
    category: ["fashion", "luxury", "shoes", "beauty", "designer"],
    network: "rakuten",
    baseUrl: "https://www.nordstrom.com",
    affiliateUrl: "",
    commission: "2-11%",
    cookieDays: 14,
    featured: true,
    active: true,
    status: "pending", // ⏳ Rakuten - PENDING
  },

  {
    id: "macys",
    name: "Macy's",
    logo: "/images/retailers/macys.png",
    description: "Department store - fashion, beauty, home & more",
    category: ["fashion", "beauty", "home", "department"],
    network: "cj",
    baseUrl: "https://www.macys.com",
    affiliateUrl: "",
    commission: "3%",
    cookieDays: 1,
    featured: false,
    active: true,
    status: "declined", // ❌ CJ - Declined (can reapply)
  },

  {
    id: "jcpenney",
    name: "JCPenney",
    logo: "/images/retailers/jcpenney.png",
    description: "Department store - clothing, home, jewelry & more",
    category: ["fashion", "home", "jewelry", "department"],
    network: "cj",
    baseUrl: "https://www.jcpenney.com",
    affiliateUrl: "",
    commission: "3%",
    cookieDays: 7,
    featured: false,
    active: true,
    status: "declined", // ❌ CJ - Declined (can reapply)
  },

  {
    id: "michaelkors",
    name: "Michael Kors",
    logo: "/images/retailers/michaelkors.png",
    description: "Designer handbags, watches, shoes & accessories",
    category: ["fashion", "luxury", "handbags", "accessories"],
    network: "cj",
    baseUrl: "https://www.michaelkors.com",
    affiliateUrl: "",
    commission: "2%",
    cookieDays: 14,
    featured: false,
    active: true,
    status: "declined", // ❌ CJ - Declined (can reapply)
  },

  {
    id: "jcrew",
    name: "J.Crew",
    logo: "/images/retailers/jcrew.png",
    description: "Classic American style - clothing & accessories",
    category: ["fashion", "clothing", "accessories"],
    network: "rakuten",
    baseUrl: "https://www.jcrew.com",
    affiliateUrl: "",
    commission: "4-7%",
    cookieDays: 14,
    featured: false,
    active: true,
    status: "pending", // ⏳ Rakuten - PENDING
  },

  {
    id: "annaylor",
    name: "Ann Taylor",
    logo: "/images/retailers/annaylor.png",
    description: "Women's professional & stylish clothing",
    category: ["fashion", "clothing", "women", "professional"],
    network: "rakuten",
    baseUrl: "https://www.anntaylor.com",
    affiliateUrl: "",
    commission: "5-8%",
    cookieDays: 14,
    featured: false,
    active: true,
    status: "pending", // ⏳ Rakuten - PENDING
  },

  {
    id: "chicos",
    name: "Chico's",
    logo: "/images/retailers/chicos.png",
    description: "Women's clothing, jewelry & accessories",
    category: ["fashion", "clothing", "women", "jewelry"],
    network: "cj",
    baseUrl: "https://www.chicos.com",
    affiliateUrl: "",
    commission: "5-8%",
    cookieDays: 7,
    featured: false,
    active: true,
    status: "not_applied", // 📝 Need to apply on CJ
  },

  {
    id: "whitehouseblackmarket",
    name: "White House Black Market",
    logo: "/images/retailers/whbm.png",
    description: "Sophisticated women's fashion & accessories",
    category: ["fashion", "clothing", "women", "accessories"],
    network: "cj",
    baseUrl: "https://www.whitehouseblackmarket.com",
    affiliateUrl: "",
    commission: "5-8%",
    cookieDays: 7,
    featured: false,
    active: true,
    status: "not_applied", // 📝 Need to apply on CJ
  },

  // ===== BEAUTY - HIGH REPEAT PURCHASES =====

  {
    id: "sephora",
    name: "Sephora",
    logo: "/images/retailers/sephora.png",
    description: "Premium beauty, makeup, skincare & fragrance",
    category: ["beauty", "skincare", "makeup", "fragrance"],
    network: "rakuten",
    baseUrl: "https://www.sephora.com",
    affiliateUrl: "",
    commission: "5-10%",
    cookieDays: 1,
    featured: true,
    active: true,
    status: "pending", // ⏳ Rakuten - PENDING
  },

  {
    id: "ulta",
    name: "Ulta Beauty",
    logo: "/images/retailers/ulta.png",
    description: "Beauty products, makeup, skincare, hair & fragrance",
    category: ["beauty", "skincare", "makeup", "hair"],
    network: "rakuten",
    baseUrl: "https://www.ulta.com",
    affiliateUrl: "",
    commission: "2-5%",
    cookieDays: 30,
    featured: false,
    active: true,
    status: "pending", // ⏳ Rakuten - PENDING
  },

  {
    id: "loccitane",
    name: "L'Occitane",
    logo: "/images/retailers/loccitane.png",
    description: "Natural beauty, skincare & bath products from Provence",
    category: ["beauty", "skincare", "bath", "natural"],
    network: "cj",
    baseUrl: "https://www.loccitane.com",
    affiliateUrl: "",
    commission: "2.5%",
    cookieDays: 30,
    featured: false,
    active: true,
    status: "declined", // ❌ CJ - Declined (can reapply)
  },

  {
    id: "bluemercury",
    name: "Bluemercury",
    logo: "/images/retailers/bluemercury.png",
    description: "Luxury beauty, skincare & spa products",
    category: ["beauty", "skincare", "luxury", "spa"],
    network: "rakuten",
    baseUrl: "https://www.bluemercury.com",
    affiliateUrl: "",
    commission: "4-8%",
    cookieDays: 14,
    featured: false,
    active: true,
    status: "pending", // ⏳ Rakuten - PENDING
  },

  // ===== HOME & FURNITURE - BIG TICKET =====

  {
    id: "wayfair",
    name: "Wayfair",
    logo: "/images/retailers/wayfair.png",
    description: "Furniture, home decor, bedding & more",
    category: ["home", "furniture", "decor", "bedding"],
    network: "cj",
    baseUrl: "https://www.wayfair.com",
    affiliateUrl: "",
    commission: "5-7%",
    cookieDays: 7,
    featured: true,
    active: true,
    status: "not_applied", // 📝 Need to apply on CJ
  },

  {
    id: "potterybarn",
    name: "Pottery Barn",
    logo: "/images/retailers/potterybarn.png",
    description: "Quality home furniture, decor & accessories",
    category: ["home", "furniture", "decor"],
    network: "rakuten",
    baseUrl: "https://www.potterybarn.com",
    affiliateUrl: "",
    commission: "4-6%",
    cookieDays: 14,
    featured: false,
    active: true,
    status: "pending", // ⏳ Rakuten - PENDING
  },

  {
    id: "williams-sonoma",
    name: "Williams Sonoma",
    logo: "/images/retailers/williams-sonoma.png",
    description: "Premium cookware, kitchen appliances & gourmet food",
    category: ["home", "kitchen", "cookware", "gourmet"],
    network: "rakuten",
    baseUrl: "https://www.williams-sonoma.com",
    affiliateUrl: "",
    commission: "4-6%",
    cookieDays: 14,
    featured: false,
    active: true,
    status: "pending", // ⏳ Rakuten - PENDING
  },

  {
    id: "crateandbarrel",
    name: "Crate & Barrel",
    logo: "/images/retailers/crateandbarrel.png",
    description: "Modern furniture, home decor & kitchenware",
    category: ["home", "furniture", "decor", "kitchen"],
    network: "rakuten",
    baseUrl: "https://www.crateandbarrel.com",
    affiliateUrl: "",
    commission: "3-5%",
    cookieDays: 14,
    featured: false,
    active: true,
    status: "pending", // ⏳ Rakuten - PENDING
  },

  // ===== ELECTRONICS & TECH =====

  {
    id: "hp",
    name: "HP",
    logo: "/images/retailers/hp.png",
    description: "Computers, laptops, printers & tech accessories",
    category: ["electronics", "computers", "tech"],
    network: "cj",
    baseUrl: "https://www.hp.com",
    affiliateUrl: "",
    commission: "1%",
    cookieDays: 30,
    featured: false,
    active: true,
    status: "declined", // ❌ CJ - Declined (can reapply)
  },

  // ===== OUTDOOR & SPORTING - HIGH VALUE =====

  {
    id: "rei",
    name: "REI",
    logo: "/images/retailers/rei.png",
    description: "Outdoor gear, clothing & camping equipment",
    category: ["outdoors", "sports", "camping", "clothing"],
    network: "direct",
    baseUrl: "https://www.rei.com",
    affiliateUrl: "",
    commission: "5%",
    cookieDays: 15,
    featured: false,
    active: true,
    status: "not_applied", // 📝 Need to apply direct
  },

  {
    id: "llbean",
    name: "L.L.Bean",
    logo: "/images/retailers/llbean.png",
    description: "Quality outdoor clothing & gear since 1912",
    category: ["outdoors", "clothing", "gear"],
    network: "cj",
    baseUrl: "https://www.llbean.com",
    affiliateUrl: "",
    commission: "5-7%",
    cookieDays: 7,
    featured: false,
    active: true,
    status: "not_applied", // 📝 Need to apply on CJ
  },

  {
    id: "backcountry",
    name: "Backcountry",
    logo: "/images/retailers/backcountry.png",
    description: "Premium outdoor gear & apparel for adventurers",
    category: ["outdoors", "gear", "clothing", "adventure"],
    network: "rakuten",
    baseUrl: "https://www.backcountry.com",
    affiliateUrl: "",
    commission: "5-7%",
    cookieDays: 14,
    featured: false,
    active: true,
    status: "pending", // ⏳ Rakuten - PENDING
  },

  {
    id: "duluth",
    name: "Duluth Trading Co.",
    logo: "/images/retailers/duluth.png",
    description: "Rugged workwear, outdoor clothing & gear",
    category: ["outdoors", "clothing", "workwear"],
    network: "cj",
    baseUrl: "https://www.duluthtrading.com",
    affiliateUrl: "",
    commission: "1%",
    cookieDays: 30,
    featured: false,
    active: true,
    status: "declined", // ❌ CJ - Declined (can reapply)
  },

  // ===== PETS - RECURRING REVENUE =====

  {
    id: "chewy",
    name: "Chewy",
    logo: "/images/retailers/chewy.png",
    description: "Pet food, treats, supplies & medications",
    category: ["pets", "food", "supplies"],
    network: "cj",
    baseUrl: "https://www.chewy.com",
    affiliateUrl: "",
    commission: "4-8%",
    cookieDays: 15,
    featured: false,
    active: true,
    status: "not_applied", // 📝 Need to apply on CJ
  },

  {
    id: "petco",
    name: "Petco",
    logo: "/images/retailers/petco.png",
    description: "Pet supplies, food, health & grooming",
    category: ["pets", "food", "supplies", "grooming"],
    network: "cj",
    baseUrl: "https://www.petco.com",
    affiliateUrl: "",
    commission: "4-6%",
    cookieDays: 7,
    featured: false,
    active: true,
    status: "not_applied", // 📝 Need to apply on CJ
  },

  // ===== JEWELRY & ACCESSORIES - HIGH VALUE =====

  {
    id: "bluenile",
    name: "Blue Nile",
    logo: "/images/retailers/bluenile.png",
    description: "Diamonds, engagement rings & fine jewelry",
    category: ["jewelry", "diamonds", "engagement", "luxury"],
    network: "cj",
    baseUrl: "https://www.bluenile.com",
    affiliateUrl: "",
    commission: "5-7%",
    cookieDays: 30,
    featured: false,
    active: true,
    status: "not_applied", // 📝 Need to apply on CJ
  },

  {
    id: "jared",
    name: "Jared",
    logo: "/images/retailers/jared.png",
    description: "Fine jewelry, diamonds & watches",
    category: ["jewelry", "diamonds", "watches"],
    network: "cj",
    baseUrl: "https://www.jared.com",
    affiliateUrl: "",
    commission: "3-5%",
    cookieDays: 14,
    featured: false,
    active: true,
    status: "not_applied", // 📝 Need to apply on CJ
  },

  {
    id: "kay",
    name: "Kay Jewelers",
    logo: "/images/retailers/kay.png",
    description: "Engagement rings, jewelry & watches",
    category: ["jewelry", "engagement", "watches"],
    network: "cj",
    baseUrl: "https://www.kay.com",
    affiliateUrl: "",
    commission: "3-5%",
    cookieDays: 14,
    featured: false,
    active: true,
    status: "not_applied", // 📝 Need to apply on CJ
  },

  // ===== SHOES - HIGH VALUE =====

  {
    id: "zappos",
    name: "Zappos",
    logo: "/images/retailers/zappos.png",
    description: "Shoes, clothing & accessories with free shipping",
    category: ["shoes", "fashion", "accessories"],
    network: "cj",
    baseUrl: "https://www.zappos.com",
    affiliateUrl: "",
    commission: "7%",
    cookieDays: 14,
    featured: false,
    active: true,
    status: "not_applied", // 📝 Need to apply on CJ
  },

  {
    id: "dsw",
    name: "DSW",
    logo: "/images/retailers/dsw.png",
    description: "Designer shoe warehouse - shoes & accessories",
    category: ["shoes", "accessories"],
    network: "rakuten",
    baseUrl: "https://www.dsw.com",
    affiliateUrl: "",
    commission: "4-7%",
    cookieDays: 14,
    featured: false,
    active: true,
    status: "pending", // ⏳ Rakuten - PENDING
  },

  // ===== ART & CRAFT =====

  {
    id: "blick",
    name: "Blick Art Materials",
    logo: "/images/retailers/blick.png",
    description: "Art supplies, craft materials & creative tools",
    category: ["art", "craft", "supplies"],
    network: "cj",
    baseUrl: "https://www.dickblick.com",
    affiliateUrl: "",
    commission: "3%",
    cookieDays: 30,
    featured: false,
    active: true,
    status: "declined", // ❌ CJ - Declined (can reapply)
  },
];

// Get all active retailers
export function getActiveRetailers(): Retailer[] {
  return retailers.filter((r) => r.active);
}

// Get featured retailers
export function getFeaturedRetailers(): Retailer[] {
  return retailers.filter((r) => r.active && r.featured);
}

// Get retailers by category
export function getRetailersByCategory(category: string): Retailer[] {
  return retailers.filter(
    (r) => r.active && r.category.includes(category.toLowerCase())
  );
}

// Get retailer by ID
export function getRetailerById(id: string): Retailer | undefined {
  return retailers.find((r) => r.id === id);
}

// Get all categories
export function getAllCategories(): string[] {
  const categories = new Set<string>();
  retailers.forEach((r) => {
    r.category.forEach((c) => categories.add(c));
  });
  return Array.from(categories).sort();
}

// Get retailers by network (for tracking which programs to apply for)
export function getRetailersByNetwork(network: string): Retailer[] {
  return retailers.filter((r) => r.active && r.network === network);
}

// Get retailers by approval status
export function getRetailersByStatus(status: AffiliateStatus): Retailer[] {
  return retailers.filter((r) => r.active && r.status === status);
}

// Get retailers that are approved and have affiliate links ready
export function getApprovedRetailers(): Retailer[] {
  return retailers.filter((r) => r.active && r.status === "active");
}

// Get retailers pending approval
export function getPendingRetailers(): Retailer[] {
  return retailers.filter((r) => r.active && r.status === "pending");
}

// Get declined retailers (for reapplication tracking)
export function getDeclinedRetailers(): Retailer[] {
  return retailers.filter((r) => r.active && r.status === "declined");
}

// Get status summary for admin dashboard
export function getStatusSummary(): { active: number; pending: number; declined: number; notApplied: number } {
  const activeRetailers = retailers.filter(r => r.active);
  return {
    active: activeRetailers.filter(r => r.status === "active").length,
    pending: activeRetailers.filter(r => r.status === "pending").length,
    declined: activeRetailers.filter(r => r.status === "declined").length,
    notApplied: activeRetailers.filter(r => r.status === "not_applied").length,
  };
}

// Affiliate program application links
export const AFFILIATE_PROGRAMS = {
  // Direct Applications
  amazon: "https://affiliate-program.amazon.com/",
  walmart: "https://affiliates.walmart.com/",
  target: "https://partners.target.com/",
  rei: "https://www.rei.com/affiliate-program",
  
  // Affiliate Networks (apply once, access many brands)
  rakuten: "https://rakutenadvertising.com/",  // Lands' End, Nordstrom, Macy's, Sephora, J.Crew, etc.
  cj: "https://www.cj.com/",                    // Talbots, Wayfair, Chewy, Blue Nile, Zappos, etc.
  shareasale: "https://www.shareasale.com/",    // Smaller brands
  impact: "https://impact.com/",                // Walmart, Target, others
};

// Helper to get which network to apply for
export function getNetworkApplicationUrl(network: string): string | undefined {
  return AFFILIATE_PROGRAMS[network as keyof typeof AFFILIATE_PROGRAMS];
}