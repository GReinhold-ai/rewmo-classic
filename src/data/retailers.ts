// src/data/retailers.ts
// Retailer data for affiliate shopping page

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
}

export const retailers: Retailer[] = [
  // ===== FEATURED - HIGH VOLUME =====
  
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
  },

  {
    id: "walmart",
    name: "Walmart",
    logo: "/images/retailers/walmart.png",
    description: "Low prices on groceries, electronics, home goods & more",
    category: ["everything", "groceries", "electronics", "home"],
    network: "impact",
    baseUrl: "https://www.walmart.com",
    affiliateUrl: "", // Add your Walmart affiliate link when approved
    commission: "1-4%",
    cookieDays: 3,
    featured: true,
    active: true,
  },

  {
    id: "target",
    name: "Target",
    logo: "/images/retailers/target.png",
    description: "Expect more, pay less - style, home, electronics",
    category: ["everything", "home", "fashion", "electronics"],
    network: "impact",
    baseUrl: "https://www.target.com",
    affiliateUrl: "", // Add your Target affiliate link when approved
    commission: "1-8%",
    cookieDays: 7,
    featured: true,
    active: true,
  },

  // ===== FASHION - HIGH COMMISSION =====

  {
    id: "landsend",
    name: "Lands' End",
    logo: "/images/retailers/landsend.png",
    description: "Quality clothing, outerwear & home products since 1963",
    category: ["fashion", "clothing", "outerwear", "home"],
    network: "rakuten",
    baseUrl: "https://www.landsend.com",
    affiliateUrl: "", // Add via Rakuten when approved
    commission: "5-7%",
    cookieDays: 14,
    featured: true,
    active: true,
  },

  {
    id: "talbots",
    name: "Talbots",
    logo: "/images/retailers/talbots.png",
    description: "Classic women's clothing, shoes & accessories",
    category: ["fashion", "clothing", "women", "accessories"],
    network: "cj",
    baseUrl: "https://www.talbots.com",
    affiliateUrl: "", // Add via CJ Affiliate when approved
    commission: "5-8%",
    cookieDays: 14,
    featured: true,
    active: true,
  },

  {
    id: "nordstrom",
    name: "Nordstrom",
    logo: "/images/retailers/nordstrom.png",
    description: "Designer fashion, shoes, beauty & accessories",
    category: ["fashion", "luxury", "shoes", "beauty", "designer"],
    network: "rakuten",
    baseUrl: "https://www.nordstrom.com",
    affiliateUrl: "", // Add via Rakuten when approved
    commission: "2-11%",
    cookieDays: 14,
    featured: true,
    active: true,
  },

  {
    id: "macys",
    name: "Macy's",
    logo: "/images/retailers/macys.png",
    description: "Department store - fashion, beauty, home & more",
    category: ["fashion", "beauty", "home", "department"],
    network: "rakuten",
    baseUrl: "https://www.macys.com",
    affiliateUrl: "", // Add via Rakuten when approved
    commission: "2-10%",
    cookieDays: 1,
    featured: false,
    active: true,
  },

  {
    id: "jcrew",
    name: "J.Crew",
    logo: "/images/retailers/jcrew.png",
    description: "Classic American style - clothing & accessories",
    category: ["fashion", "clothing", "accessories"],
    network: "rakuten",
    baseUrl: "https://www.jcrew.com",
    affiliateUrl: "", // Add via Rakuten when approved
    commission: "4-7%",
    cookieDays: 14,
    featured: false,
    active: true,
  },

  {
    id: "annaylor",
    name: "Ann Taylor",
    logo: "/images/retailers/annaylor.png",
    description: "Women's professional & stylish clothing",
    category: ["fashion", "clothing", "women", "professional"],
    network: "rakuten",
    baseUrl: "https://www.anntaylor.com",
    affiliateUrl: "", // Add via Rakuten when approved
    commission: "5-8%",
    cookieDays: 14,
    featured: false,
    active: true,
  },

  {
    id: "chicos",
    name: "Chico's",
    logo: "/images/retailers/chicos.png",
    description: "Women's clothing, jewelry & accessories",
    category: ["fashion", "clothing", "women", "jewelry"],
    network: "cj",
    baseUrl: "https://www.chicos.com",
    affiliateUrl: "", // Add via CJ when approved
    commission: "5-8%",
    cookieDays: 7,
    featured: false,
    active: true,
  },

  {
    id: "whitehouseblackmarket",
    name: "White House Black Market",
    logo: "/images/retailers/whbm.png",
    description: "Sophisticated women's fashion & accessories",
    category: ["fashion", "clothing", "women", "accessories"],
    network: "cj",
    baseUrl: "https://www.whitehouseblackmarket.com",
    affiliateUrl: "", // Add via CJ when approved
    commission: "5-8%",
    cookieDays: 7,
    featured: false,
    active: true,
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
    affiliateUrl: "", // Add via Rakuten when approved
    commission: "5-10%",
    cookieDays: 1,
    featured: true,
    active: true,
  },

  {
    id: "ulta",
    name: "Ulta Beauty",
    logo: "/images/retailers/ulta.png",
    description: "Beauty products, makeup, skincare, hair & fragrance",
    category: ["beauty", "skincare", "makeup", "hair"],
    network: "rakuten",
    baseUrl: "https://www.ulta.com",
    affiliateUrl: "", // Add via Rakuten when approved
    commission: "2-5%",
    cookieDays: 30,
    featured: false,
    active: true,
  },

  {
    id: "bluemercury",
    name: "Bluemercury",
    logo: "/images/retailers/bluemercury.png",
    description: "Luxury beauty, skincare & spa products",
    category: ["beauty", "skincare", "luxury", "spa"],
    network: "rakuten",
    baseUrl: "https://www.bluemercury.com",
    affiliateUrl: "", // Add via Rakuten when approved
    commission: "4-8%",
    cookieDays: 14,
    featured: false,
    active: true,
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
    affiliateUrl: "", // Add via CJ when approved
    commission: "5-7%",
    cookieDays: 7,
    featured: true,
    active: true,
  },

  {
    id: "potterybarn",
    name: "Pottery Barn",
    logo: "/images/retailers/potterybarn.png",
    description: "Quality home furniture, decor & accessories",
    category: ["home", "furniture", "decor"],
    network: "rakuten",
    baseUrl: "https://www.potterybarn.com",
    affiliateUrl: "", // Add via Rakuten when approved
    commission: "4-6%",
    cookieDays: 14,
    featured: false,
    active: true,
  },

  {
    id: "williams-sonoma",
    name: "Williams Sonoma",
    logo: "/images/retailers/williams-sonoma.png",
    description: "Premium cookware, kitchen appliances & gourmet food",
    category: ["home", "kitchen", "cookware", "gourmet"],
    network: "rakuten",
    baseUrl: "https://www.williams-sonoma.com",
    affiliateUrl: "", // Add via Rakuten when approved
    commission: "4-6%",
    cookieDays: 14,
    featured: false,
    active: true,
  },

  {
    id: "crateandbarrel",
    name: "Crate & Barrel",
    logo: "/images/retailers/crateandbarrel.png",
    description: "Modern furniture, home decor & kitchenware",
    category: ["home", "furniture", "decor", "kitchen"],
    network: "rakuten",
    baseUrl: "https://www.crateandbarrel.com",
    affiliateUrl: "", // Add via Rakuten when approved
    commission: "3-5%",
    cookieDays: 14,
    featured: false,
    active: true,
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
    affiliateUrl: "", // Apply direct at REI
    commission: "5%",
    cookieDays: 15,
    featured: false,
    active: true,
  },

  {
    id: "llbean",
    name: "L.L.Bean",
    logo: "/images/retailers/llbean.png",
    description: "Quality outdoor clothing & gear since 1912",
    category: ["outdoors", "clothing", "gear"],
    network: "cj",
    baseUrl: "https://www.llbean.com",
    affiliateUrl: "", // Add via CJ when approved
    commission: "5-7%",
    cookieDays: 7,
    featured: false,
    active: true,
  },

  {
    id: "backcountry",
    name: "Backcountry",
    logo: "/images/retailers/backcountry.png",
    description: "Premium outdoor gear & apparel for adventurers",
    category: ["outdoors", "gear", "clothing", "adventure"],
    network: "rakuten",
    baseUrl: "https://www.backcountry.com",
    affiliateUrl: "", // Add via Rakuten when approved
    commission: "5-7%",
    cookieDays: 14,
    featured: false,
    active: true,
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
    affiliateUrl: "", // Add via CJ when approved
    commission: "4-8%",
    cookieDays: 15,
    featured: false,
    active: true,
  },

  {
    id: "petco",
    name: "Petco",
    logo: "/images/retailers/petco.png",
    description: "Pet supplies, food, health & grooming",
    category: ["pets", "food", "supplies", "grooming"],
    network: "cj",
    baseUrl: "https://www.petco.com",
    affiliateUrl: "", // Add via CJ when approved
    commission: "4-6%",
    cookieDays: 7,
    featured: false,
    active: true,
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
    affiliateUrl: "", // Add via CJ when approved
    commission: "5-7%",
    cookieDays: 30,
    featured: false,
    active: true,
  },

  {
    id: "jared",
    name: "Jared",
    logo: "/images/retailers/jared.png",
    description: "Fine jewelry, diamonds & watches",
    category: ["jewelry", "diamonds", "watches"],
    network: "cj",
    baseUrl: "https://www.jared.com",
    affiliateUrl: "", // Add via CJ when approved
    commission: "3-5%",
    cookieDays: 14,
    featured: false,
    active: true,
  },

  {
    id: "kay",
    name: "Kay Jewelers",
    logo: "/images/retailers/kay.png",
    description: "Engagement rings, jewelry & watches",
    category: ["jewelry", "engagement", "watches"],
    network: "cj",
    baseUrl: "https://www.kay.com",
    affiliateUrl: "", // Add via CJ when approved
    commission: "3-5%",
    cookieDays: 14,
    featured: false,
    active: true,
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
    affiliateUrl: "", // Add via CJ when approved
    commission: "7%",
    cookieDays: 14,
    featured: false,
    active: true,
  },

  {
    id: "dsw",
    name: "DSW",
    logo: "/images/retailers/dsw.png",
    description: "Designer shoe warehouse - shoes & accessories",
    category: ["shoes", "accessories"],
    network: "rakuten",
    baseUrl: "https://www.dsw.com",
    affiliateUrl: "", // Add via Rakuten when approved
    commission: "4-7%",
    cookieDays: 14,
    featured: false,
    active: true,
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