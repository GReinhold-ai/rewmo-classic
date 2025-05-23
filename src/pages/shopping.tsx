// src/pages/shopping.tsx

import { useState } from "react";
import Navbar from "@/components/Navbar"; // Adjust if needed
import BottomTabBar from "@/components/BottomTabBar"; 

const filters = ["All", "Made in America", "Made in Australia", "Sustainable"];

const vendors = [
  {
    name: "Amazon",
    logo: "/logos/amazon.png",
    link: "https://www.amazon.com/",
    tags: ["All", "Made in America", "Sustainable", "Made in Australia"], // Added Australia
  },
  {
    name: "Walmart",
    logo: "/logos/walmart.png",
    link: "https://www.walmart.com/",
    tags: ["All", "Made in America"],
  },
  {
    name: "Target",
    logo: "/logos/target.png",
    link: "https://www.target.com/",
    tags: ["All", "Sustainable"],
  },
  // Add more vendors as needed!
];

export default function ShoppingPage() {
  const [selectedFilter, setFilter] = useState("All");
  const filteredVendors =
    selectedFilter === "All"
      ? vendors
      : vendors.filter((v) => v.tags.includes(selectedFilter));

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-black text-white flex flex-col items-center px-3 pb-12 font-sans">
        {/* Logo at the top */}
        <img
          src="/logos/logo.png"
          alt="RewmoAI Logo"
          className="h-12 w-auto mt-6 mb-2"
          style={{ maxWidth: 120 }}
        />

        {/* Readable Headline */}
        <h1 className="text-xl md:text-2xl font-semibold mb-1 mt-2 text-white tracking-tight text-center">
          Shopping Rewards
        </h1>
        <p className="text-sm md:text-base text-gray-300 mb-3 text-center max-w-md">
          Rewmo helps you earn rewards on products that match your values and lifestyle.<br />
          Use the filters to shop <b>Made in America</b>, <b>Made in Australia</b>, or <b>Sustainable</b> picks!
        </p>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 justify-center mb-4">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-full text-xs font-medium border ${
                selectedFilter === f ? "bg-orange-500 text-white" : "bg-gray-900 text-gray-200"
              } transition`}
              style={{ minWidth: 95 }}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Vendor Logos */}
        <div className="flex flex-wrap gap-6 justify-center py-2 w-full max-w-md">
          {filteredVendors.map((vendor) => (
            <a
              href={vendor.link}
              target="_blank"
              rel="noopener noreferrer"
              key={vendor.name}
              className="flex flex-col items-center hover:scale-105 transition"
              style={{ minWidth: 90, minHeight: 90 }}
            >
              <img
                src={vendor.logo}
                alt={vendor.name}
                className="h-14 w-14 object-contain mb-1 rounded-lg shadow border border-gray-700 bg-white"
                style={{ background: "#fff" }}
              />
              <span className="text-xs text-gray-300">{vendor.name}</span>
            </a>
          ))}
        </div>
      </main>
      <BottomTabBar />
    </>
  );
}
