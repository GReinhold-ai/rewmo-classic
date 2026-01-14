// src/data/retailers.ts
// Comprehensive retailer database with affiliate links and metadata

export type RetailerCategory = 
  | "general"
  | "grocery"
  | "electronics"
  | "home"
  | "clothing"
  | "travel"
  | "office"
  | "sustainable"
  | "handmade";

export type MembershipTier = "FREE" | "PRO" | "BUSINESS";

export interface Retailer {
  id: string;
  name: string;
  description: string;
  logo: string; // Path to logo image
  affiliateLink: string; // Your affiliate link
  category: RetailerCategory[];
  pointsMultiplier: number; // 1x, 2x, 3x, etc.
  requiredTier: MembershipTier;
  
  // Badges and filters
  isBuyAmerican: boolean;
  isSustainable: boolean;
  isHandmade?: boolean;
  
  // Additional metadata
  countryOfOrigin?: string;
  sustainabilityRating?: number; // 1-5 scale
  certifications?: string[]; // e.g., "B Corp", "Fair Trade", "Made in USA"
  
  // Business-specific
  isBusinessOnly?: boolean;
  hasBulkPricing?: boolean;
}

// ============================================
// RETAILER DATABASE
// ============================================

export const retailers: Retailer[] = [
  // ========== GENERAL RETAIL ==========
  {
    id: "amazon",
    name: "Amazon",
    description: "Everything you need, delivered fast. Earn points on millions of products.",
    logo: "/logos/amazon.png",
    affiliateLink: "https://www.amazon.com/?tag=rewmoai-20",
    category: ["general"],
    pointsMultiplier: 1,
    requiredTier: "FREE",
    isBuyAmerican: false,
    isSustainable: false,
    countryOfOrigin: "USA (Marketplace)",
  },
  
  {
    id: "walmart",
    name: "Walmart",
    description: "Save money. Live better. Unlock with Pro to earn rewards.",
    logo: "/logos/walmart.png",
    affiliateLink: "https://www.walmart.com/?affil=YOUR_AFFILIATE_ID",
    category: ["general", "grocery"],
    pointsMultiplier: 2,
    requiredTier: "PRO",
    isBuyAmerican: true,
    isSustainable: false,
    countryOfOrigin: "USA",
    certifications: ["Made in USA HQ"],
  },
  
  {
    id: "target",
    name: "Target",
    description: "Expect More. Pay Less. Earn rewards on everyday essentials.",
    logo: "/logos/target.png",
    affiliateLink: "https://www.target.com/?affil=YOUR_AFFILIATE_ID",
    category: ["general", "home"],
    pointsMultiplier: 2,
    requiredTier: "PRO",
    isBuyAmerican: true,
    isSustainable: false,
    countryOfOrigin: "USA",
    certifications: ["Made in USA HQ"],
  },
  
  // ========== ELECTRONICS ==========
  {
    id: "bestbuy",
    name: "Best Buy",
    description: "Tech made easy. Earn points on electronics, appliances, and more.",
    logo: "/logos/bestbuy.png",
    affiliateLink: "https://www.bestbuy.com/?affil=YOUR_AFFILIATE_ID",
    category: ["electronics"],
    pointsMultiplier: 2,
    requiredTier: "PRO",
    isBuyAmerican: true,
    isSustainable: false,
    countryOfOrigin: "USA",
    certifications: ["Made in USA HQ"],
  },
  
  // ========== HOME & GARDEN ==========
  {
    id: "homedepot",
    name: "Home Depot",
    description: "How doers get more done. Earn points on home improvement supplies.",
    logo: "/logos/homedepot.png",
    affiliateLink: "https://www.homedepot.com/?affil=YOUR_AFFILIATE_ID",
    category: ["home"],
    pointsMultiplier: 2,
    requiredTier: "PRO",
    isBuyAmerican: true,
    isSustainable: false,
    countryOfOrigin: "USA",
    certifications: ["Made in USA HQ"],
  },
  
  {
    id: "lowes",
    name: "Lowe's",
    description: "Never stop improving. Earn rewards on home improvement projects.",
    logo: "/logos/lowes.png",
    affiliateLink: "https://www.lowes.com/?affil=YOUR_AFFILIATE_ID",
    category: ["home"],
    pointsMultiplier: 2,
    requiredTier: "PRO",
    isBuyAmerican: true,
    isSustainable: false,
    countryOfOrigin: "USA",
    certifications: ["Made in USA HQ"],
  },
  
  // ========== SUSTAINABLE & ECO-FRIENDLY ==========
  {
    id: "patagonia",
    name: "Patagonia",
    description: "We're in business to save our home planet. Sustainable outdoor gear.",
    logo: "/logos/patagonia.png",
    affiliateLink: "https://www.patagonia.com/?affil=YOUR_AFFILIATE_ID",
    category: ["clothing", "sustainable"],
    pointsMultiplier: 3,
    requiredTier: "PRO",
    isBuyAmerican: true,
    isSustainable: true,
    countryOfOrigin: "USA",
    sustainabilityRating: 5,
    certifications: ["B Corp", "Fair Trade", "1% for the Planet"],
  },
  
  {
    id: "wholefoods",
    name: "Whole Foods Market",
    description: "America's healthiest grocery store. Organic and sustainable products.",
    logo: "/logos/wholefoods.png",
    affiliateLink: "https://www.wholefoodsmarket.com/?affil=YOUR_AFFILIATE_ID",
    category: ["grocery", "sustainable"],
    pointsMultiplier: 2,
    requiredTier: "PRO",
    isBuyAmerican: true,
    isSustainable: true,
    countryOfOrigin: "USA",
    sustainabilityRating: 4,
    certifications: ["Organic Certified", "Sustainable Seafood"],
  },
  
  {
    id: "etsy",
    name: "Etsy",
    description: "Keep commerce human. Handmade, vintage, and unique goods.",
    logo: "/logos/etsy.png",
    affiliateLink: "https://www.etsy.com/?affil=YOUR_AFFILIATE_ID",
    category: ["handmade", "sustainable"],
    pointsMultiplier: 2,
    requiredTier: "FREE",
    isBuyAmerican: true, // Many sellers are US-based
    isSustainable: true,
    isHandmade: true,
    countryOfOrigin: "USA (Marketplace)",
    sustainabilityRating: 4,
    certifications: ["Supports Independent Artisans"],
  },
  
  {
    id: "rei",
    name: "REI Co-op",
    description: "Outdoor gear and clothing. Committed to sustainability and conservation.",
    logo: "/logos/rei.png",
    affiliateLink: "https://www.rei.com/?affil=YOUR_AFFILIATE_ID",
    category: ["clothing", "sustainable"],
    pointsMultiplier: 3,
    requiredTier: "PRO",
    isBuyAmerican: true,
    isSustainable: true,
    countryOfOrigin: "USA",
    sustainabilityRating: 5,
    certifications: ["B Corp", "Climate Neutral Certified"],
  },
  
  // ========== TRAVEL ==========
  {
    id: "delta",
    name: "Delta Airlines",
    description: "Flight rewards for Pro members. Earn points on business and leisure travel.",
    logo: "/logos/delta.png",
    affiliateLink: "https://www.delta.com/?affil=YOUR_AFFILIATE_ID",
    category: ["travel"],
    pointsMultiplier: 3,
    requiredTier: "PRO",
    isBuyAmerican: true,
    isSustainable: false,
    countryOfOrigin: "USA",
    certifications: ["Made in USA HQ"],
  },
  
  {
    id: "southwest",
    name: "Southwest Airlines",
    description: "Low fares. Nothing to hide. Earn rewards on domestic flights.",
    logo: "/logos/southwest.png",
    affiliateLink: "https://www.southwest.com/?affil=YOUR_AFFILIATE_ID",
    category: ["travel"],
    pointsMultiplier: 3,
    requiredTier: "PRO",
    isBuyAmerican: true,
    isSustainable: false,
    countryOfOrigin: "USA",
    certifications: ["Made in USA HQ"],
  },
  
  // ========== BUSINESS & OFFICE ==========
  {
    id: "staples",
    name: "Staples",
    description: "That was easy. Business office supplies with bulk pricing.",
    logo: "/logos/staples.png",
    affiliateLink: "https://www.staples.com/?affil=YOUR_AFFILIATE_ID",
    category: ["office"],
    pointsMultiplier: 4,
    requiredTier: "BUSINESS",
    isBuyAmerican: true,
    isSustainable: false,
    isBusinessOnly: true,
    hasBulkPricing: true,
    countryOfOrigin: "USA",
  },
  
  {
    id: "officedepot",
    name: "Office Depot",
    description: "Taking care of business. Bulk orders and expense tracking for businesses.",
    logo: "/logos/officedepot.png",
    affiliateLink: "https://www.officedepot.com/?affil=YOUR_AFFILIATE_ID",
    category: ["office"],
    pointsMultiplier: 4,
    requiredTier: "BUSINESS",
    isBuyAmerican: true,
    isSustainable: false,
    isBusinessOnly: true,
    hasBulkPricing: true,
    countryOfOrigin: "USA",
  },
  
  // ========== SUSTAINABLE ADDITIONS ==========
  {
    id: "grove",
    name: "Grove Collaborative",
    description: "Natural home and personal care products. Plastic-free shipping.",
    logo: "/logos/grove.png",
    affiliateLink: "https://www.grove.co/?affil=YOUR_AFFILIATE_ID",
    category: ["home", "sustainable"],
    pointsMultiplier: 3,
    requiredTier: "PRO",
    isBuyAmerican: true,
    isSustainable: true,
    countryOfOrigin: "USA",
    sustainabilityRating: 5,
    certifications: ["B Corp", "Plastic Neutral", "Carbon Neutral"],
  },
  
  {
    id: "thredUp",
    name: "thredUP",
    description: "Shop secondhand first. Online consignment and thrift store.",
    logo: "/logos/thredup.png",
    affiliateLink: "https://www.thredup.com/?affil=YOUR_AFFILIATE_ID",
    category: ["clothing", "sustainable"],
    pointsMultiplier: 2,
    requiredTier: "FREE",
    isBuyAmerican: true,
    isSustainable: true,
    countryOfOrigin: "USA",
    sustainabilityRating: 5,
    certifications: ["Circular Fashion", "Reduces Textile Waste"],
  },
];

// ============================================
// HELPER FUNCTIONS
// ============================================

export function getRetailerById(id: string): Retailer | undefined {
  return retailers.find(r => r.id === id);
}

export function getRetailersByCategory(category: RetailerCategory): Retailer[] {
  return retailers.filter(r => r.category.includes(category));
}

export function getRetailersByTier(tier: MembershipTier): Retailer[] {
  const tierHierarchy: Record<MembershipTier, number> = {
    FREE: 0,
    PRO: 1,
    BUSINESS: 2,
  };
  
  return retailers.filter(r => tierHierarchy[r.requiredTier] <= tierHierarchy[tier]);
}

export function getBuyAmericanRetailers(): Retailer[] {
  return retailers.filter(r => r.isBuyAmerican);
}

export function getSustainableRetailers(): Retailer[] {
  return retailers.filter(r => r.isSustainable);
}

export function filterRetailers(filters: {
  category?: RetailerCategory;
  tier?: MembershipTier;
  buyAmerican?: boolean;
  sustainable?: boolean;
}): Retailer[] {
  let filtered = [...retailers];
  
  if (filters.category) {
    filtered = filtered.filter(r => r.category.includes(filters.category!));
  }
  
  if (filters.tier) {
    filtered = getRetailersByTier(filters.tier).filter(r => 
      filtered.includes(r)
    );
  }
  
  if (filters.buyAmerican) {
    filtered = filtered.filter(r => r.isBuyAmerican);
  }
  
  if (filters.sustainable) {
    filtered = filtered.filter(r => r.isSustainable);
  }
  
  return filtered;
}
