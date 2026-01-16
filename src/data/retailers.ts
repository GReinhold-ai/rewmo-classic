// src/data/retailers.ts
// Retailer data for affiliate shopping page

export interface Retailer {
  id: string;
  name: string;
  logo?: string;
  description: string;
  category: string[];
  network: "amazon" | "direct" | "rakuten" | "cj" | "shareasale" | "none";
  baseUrl: string;
  affiliateUrl?: string; // URL with affiliate tracking
  affiliateTag?: string;
  commission?: string; // e.g., "1-10%"
  cookieDays?: number;
  featured?: boolean;
  active: boolean;
}

export const retailers: Retailer[] = [
  // ===== AMAZON =====
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
    cookieDays: 1, // 24-hour cookie
    featured: true,
    active: true,
  },

  // ===== WALMART =====
  // Walmart has their own affiliate program - apply at: https://affiliates.walmart.com/
  {
    id: "walmart",
    name: "Walmart",
    logo: "/images/retailers/walmart.png",
    description: "Low prices on groceries, electronics, home goods & more",
    category: ["everything", "groceries", "electronics", "home"],
    network: "direct", // Walmart Affiliates
    baseUrl: "https://www.walmart.com",
    // Replace with your Walmart affiliate link when approved
    affiliateUrl: "https://www.walmart.com", 
    commission: "1-4%",
    cookieDays: 3,
    featured: true,
    active: true,
  },

  // ===== TARGET =====
  // Target affiliate program via Impact Radius - apply at: https://partners.target.com/
  {
    id: "target",
    name: "Target",
    logo: "/images/retailers/target.png",
    description: "Expect more, pay less - style, home, electronics",
    category: ["everything", "home", "fashion", "electronics"],
    network: "direct", // Target Partners (Impact)
    baseUrl: "https://www.target.com",
    // Replace with your Target affiliate link when approved
    affiliateUrl: "https://www.target.com",
    commission: "1-8%",
    cookieDays: 7,
    featured: true,
    active: true,
  },

  // ===== BEST BUY =====
  // Best Buy affiliate program - apply at their affiliate page
  {
    id: "bestbuy",
    name: "Best Buy",
    logo: "/images/retailers/bestbuy.png",
    description: "Electronics, computers, appliances, and tech",
    category: ["electronics", "computers", "appliances"],
    network: "direct",
    baseUrl: "https://www.bestbuy.com",
    affiliateUrl: "https://www.bestbuy.com",
    commission: "0.5-1%",
    cookieDays: 1,
    featured: true,
    active: true,
  },

  // ===== HOME DEPOT =====
  {
    id: "homedepot",
    name: "Home Depot",
    logo: "/images/retailers/homedepot.png",
    description: "Home improvement, tools, appliances, and building materials",
    category: ["home", "tools", "appliances", "garden"],
    network: "direct",
    baseUrl: "https://www.homedepot.com",
    affiliateUrl: "https://www.homedepot.com",
    commission: "2-8%",
    cookieDays: 1,
    featured: false,
    active: true,
  },

  // ===== LOWES =====
  {
    id: "lowes",
    name: "Lowe's",
    logo: "/images/retailers/lowes.png",
    description: "Home improvement and appliances",
    category: ["home", "tools", "appliances", "garden"],
    network: "direct",
    baseUrl: "https://www.lowes.com",
    affiliateUrl: "https://www.lowes.com",
    commission: "2-4%",
    cookieDays: 1,
    featured: false,
    active: true,
  },

  // ===== CHEWY =====
  {
    id: "chewy",
    name: "Chewy",
    logo: "/images/retailers/chewy.png",
    description: "Pet food, treats, and supplies",
    category: ["pets"],
    network: "direct",
    baseUrl: "https://www.chewy.com",
    affiliateUrl: "https://www.chewy.com",
    commission: "4-8%",
    cookieDays: 15,
    featured: false,
    active: true,
  },

  // ===== PETCO =====
  {
    id: "petco",
    name: "Petco",
    logo: "/images/retailers/petco.png",
    description: "Pet supplies, food, and services",
    category: ["pets"],
    network: "direct",
    baseUrl: "https://www.petco.com",
    affiliateUrl: "https://www.petco.com",
    commission: "4-6%",
    cookieDays: 7,
    featured: false,
    active: true,
  },

  // ===== NIKE =====
  {
    id: "nike",
    name: "Nike",
    logo: "/images/retailers/nike.png",
    description: "Athletic shoes, apparel, and gear",
    category: ["fashion", "sports", "shoes"],
    network: "direct",
    baseUrl: "https://www.nike.com",
    affiliateUrl: "https://www.nike.com",
    commission: "5-11%",
    cookieDays: 7,
    featured: false,
    active: true,
  },

  // ===== ADIDAS =====
  {
    id: "adidas",
    name: "Adidas",
    logo: "/images/retailers/adidas.png",
    description: "Athletic footwear and sportswear",
    category: ["fashion", "sports", "shoes"],
    network: "direct",
    baseUrl: "https://www.adidas.com",
    affiliateUrl: "https://www.adidas.com",
    commission: "5-7%",
    cookieDays: 30,
    featured: false,
    active: true,
  },

  // ===== SEPHORA =====
  {
    id: "sephora",
    name: "Sephora",
    logo: "/images/retailers/sephora.png",
    description: "Beauty, makeup, skincare, and fragrance",
    category: ["beauty", "skincare"],
    network: "direct",
    baseUrl: "https://www.sephora.com",
    affiliateUrl: "https://www.sephora.com",
    commission: "5-10%",
    cookieDays: 1,
    featured: false,
    active: true,
  },

  // ===== ULTA =====
  {
    id: "ulta",
    name: "Ulta Beauty",
    logo: "/images/retailers/ulta.png",
    description: "Beauty products, makeup, skincare, and hair",
    category: ["beauty", "skincare", "hair"],
    network: "direct",
    baseUrl: "https://www.ulta.com",
    affiliateUrl: "https://www.ulta.com",
    commission: "2-5%",
    cookieDays: 30,
    featured: false,
    active: true,
  },

  // ===== WAYFAIR =====
  {
    id: "wayfair",
    name: "Wayfair",
    logo: "/images/retailers/wayfair.png",
    description: "Furniture, home decor, and housewares",
    category: ["home", "furniture"],
    network: "direct",
    baseUrl: "https://www.wayfair.com",
    affiliateUrl: "https://www.wayfair.com",
    commission: "5-7%",
    cookieDays: 7,
    featured: false,
    active: true,
  },

  // ===== KOHL'S =====
  {
    id: "kohls",
    name: "Kohl's",
    logo: "/images/retailers/kohls.png",
    description: "Department store - clothing, home, and more",
    category: ["fashion", "home", "everything"],
    network: "direct",
    baseUrl: "https://www.kohls.com",
    affiliateUrl: "https://www.kohls.com",
    commission: "3-6%",
    cookieDays: 1,
    featured: false,
    active: true,
  },

  // ===== MACY'S =====
  {
    id: "macys",
    name: "Macy's",
    logo: "/images/retailers/macys.png",
    description: "Department store - fashion, beauty, home",
    category: ["fashion", "beauty", "home"],
    network: "direct",
    baseUrl: "https://www.macys.com",
    affiliateUrl: "https://www.macys.com",
    commission: "2-10%",
    cookieDays: 1,
    featured: false,
    active: true,
  },

  // ===== NORDSTROM =====
  {
    id: "nordstrom",
    name: "Nordstrom",
    logo: "/images/retailers/nordstrom.png",
    description: "Fashion, shoes, and designer brands",
    category: ["fashion", "shoes", "luxury"],
    network: "direct",
    baseUrl: "https://www.nordstrom.com",
    affiliateUrl: "https://www.nordstrom.com",
    commission: "2-11%",
    cookieDays: 14,
    featured: false,
    active: true,
  },

  // ===== ZAPPOS =====
  {
    id: "zappos",
    name: "Zappos",
    logo: "/images/retailers/zappos.png",
    description: "Shoes, clothing, and accessories",
    category: ["shoes", "fashion"],
    network: "direct",
    baseUrl: "https://www.zappos.com",
    affiliateUrl: "https://www.zappos.com",
    commission: "7%",
    cookieDays: 14,
    featured: false,
    active: true,
  },

  // ===== REI =====
  {
    id: "rei",
    name: "REI",
    logo: "/images/retailers/rei.png",
    description: "Outdoor gear, clothing, and camping",
    category: ["outdoors", "sports", "camping"],
    network: "direct",
    baseUrl: "https://www.rei.com",
    affiliateUrl: "https://www.rei.com",
    commission: "5%",
    cookieDays: 15,
    featured: false,
    active: true,
  },

  // ===== DICK'S SPORTING GOODS =====
  {
    id: "dicks",
    name: "Dick's Sporting Goods",
    logo: "/images/retailers/dicks.png",
    description: "Sports equipment, apparel, and footwear",
    category: ["sports", "fitness", "outdoors"],
    network: "direct",
    baseUrl: "https://www.dickssportinggoods.com",
    affiliateUrl: "https://www.dickssportinggoods.com",
    commission: "3-5%",
    cookieDays: 10,
    featured: false,
    active: true,
  },

  // ===== COSTCO =====
  // Costco doesn't have a traditional affiliate program
  {
    id: "costco",
    name: "Costco",
    logo: "/images/retailers/costco.png",
    description: "Wholesale club - bulk groceries and more",
    category: ["groceries", "everything", "wholesale"],
    network: "none",
    baseUrl: "https://www.costco.com",
    commission: "N/A",
    featured: false,
    active: false, // No affiliate program
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

// Affiliate program application links
export const AFFILIATE_PROGRAMS = {
  amazon: "https://affiliate-program.amazon.com/",
  walmart: "https://affiliates.walmart.com/",
  target: "https://partners.target.com/",
  bestbuy: "https://www.bestbuy.com/site/affiliate-program",
  homedepot: "https://www.homedepot.com/c/SF_MS_Affiliate_Program",
  chewy: "https://www.chewy.com/app/content/affiliate",
  nike: "https://www.nike.com/help/a/affiliate-program",
  sephora: "https://www.sephora.com/beauty/affiliate-program",
  wayfair: "https://www.wayfair.com/v/affiliate/affiliate_program",
  rakuten: "https://rakutenadvertising.com/", // Network with many brands
  cj: "https://www.cj.com/", // Commission Junction - large network
  shareasale: "https://www.shareasale.com/", // Another large network
};
