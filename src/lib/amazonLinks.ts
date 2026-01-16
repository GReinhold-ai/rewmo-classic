// src/lib/amazonLinks.ts
// Utility functions for generating Amazon affiliate links with member tracking

// Your Amazon Associates tag
export const AMAZON_TAG = "rewmoai-20";

/**
 * Generate an Amazon product link with member tracking
 * @param asin - Amazon product ASIN
 * @param memberId - RewmoAI member ID for tracking
 * @returns Full Amazon affiliate URL
 */
export function generateAmazonProductLink(asin: string, memberId?: string): string {
  const baseUrl = `https://www.amazon.com/dp/${asin}`;
  const tag = memberId ? `${AMAZON_TAG}-${memberId.substring(0, 8)}` : AMAZON_TAG;
  
  return `${baseUrl}?tag=${tag}`;
}

/**
 * Generate an Amazon search link with member tracking
 * @param searchTerm - Search query
 * @param memberId - RewmoAI member ID for tracking
 * @returns Full Amazon search affiliate URL
 */
export function generateAmazonSearchLink(searchTerm: string, memberId?: string): string {
  const encodedSearch = encodeURIComponent(searchTerm);
  const tag = memberId ? `${AMAZON_TAG}-${memberId.substring(0, 8)}` : AMAZON_TAG;
  
  return `https://www.amazon.com/s?k=${encodedSearch}&tag=${tag}`;
}

/**
 * Generate a generic Amazon homepage link with member tracking
 * @param memberId - RewmoAI member ID for tracking
 * @returns Amazon homepage affiliate URL
 */
export function generateAmazonHomepageLink(memberId?: string): string {
  const tag = memberId ? `${AMAZON_TAG}-${memberId.substring(0, 8)}` : AMAZON_TAG;
  
  return `https://www.amazon.com?tag=${tag}`;
}

/**
 * Add affiliate tag to any Amazon URL
 * @param amazonUrl - Any Amazon URL
 * @param memberId - RewmoAI member ID for tracking
 * @returns URL with affiliate tag added/replaced
 */
export function addAffiliateTag(amazonUrl: string, memberId?: string): string {
  try {
    const url = new URL(amazonUrl);
    
    // Only process amazon.com URLs
    if (!url.hostname.includes("amazon.com")) {
      return amazonUrl;
    }
    
    const tag = memberId ? `${AMAZON_TAG}-${memberId.substring(0, 8)}` : AMAZON_TAG;
    
    // Remove existing tag if present
    url.searchParams.delete("tag");
    
    // Add our tag
    url.searchParams.set("tag", tag);
    
    return url.toString();
  } catch {
    return amazonUrl;
  }
}

/**
 * Extract ASIN from Amazon URL
 * @param amazonUrl - Amazon product URL
 * @returns ASIN or null if not found
 */
export function extractASIN(amazonUrl: string): string | null {
  // Match patterns like /dp/B08N5WRWNW or /gp/product/B08N5WRWNW
  const patterns = [
    /\/dp\/([A-Z0-9]{10})/i,
    /\/gp\/product\/([A-Z0-9]{10})/i,
    /\/product\/([A-Z0-9]{10})/i,
    /\/ASIN\/([A-Z0-9]{10})/i,
  ];
  
  for (const pattern of patterns) {
    const match = amazonUrl.match(pattern);
    if (match) {
      return match[1];
    }
  }
  
  return null;
}

/**
 * Popular Amazon category links
 */
export const AMAZON_CATEGORIES = {
  electronics: "https://www.amazon.com/electronics/b?node=172282",
  homeKitchen: "https://www.amazon.com/home-garden/b?node=1055398",
  clothing: "https://www.amazon.com/fashion/b?node=7141123011",
  beauty: "https://www.amazon.com/beauty/b?node=3760911",
  sports: "https://www.amazon.com/sports-outdoors/b?node=3375251",
  toys: "https://www.amazon.com/toys-games/b?node=165793011",
  books: "https://www.amazon.com/books/b?node=283155",
  pets: "https://www.amazon.com/pet-supplies/b?node=2619533011",
  baby: "https://www.amazon.com/baby-products/b?node=165796011",
  health: "https://www.amazon.com/health-personal-care/b?node=3760901",
};

/**
 * Generate category link with member tracking
 */
export function generateAmazonCategoryLink(
  category: keyof typeof AMAZON_CATEGORIES,
  memberId?: string
): string {
  return addAffiliateTag(AMAZON_CATEGORIES[category], memberId);
}
