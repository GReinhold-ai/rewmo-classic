// src/components/EligibleStoresPersonal.tsx
import React from "react";
import Link from "next/link";

const personalStores = [
  {
    name: "Amazon",
    href: "https://www.amazon.com/?tag=YOUR_AFFILIATE_ID", // Replace with your affiliate ID
    available: true,
    logo: "/logos/amazon.png",
  },
  {
    name: "Walmart",
    available: false,
    logo: "/logos/walmart.png",
  },
  {
    name: "Target",
    available: false,
    logo: "/logos/target.png",
  },
  {
    name: "Best Buy",
    available: false,
    logo: "/logos/bestbuy.png",
  },
];

export default function EligibleStoresPersonal() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {personalStores.map(({ name, href, available, logo }) => (
        <div
          key={name}
          className={`flex items-center gap-3 p-4 rounded-xl border shadow
            ${available ? "border-[#15C5C1] bg-white/90" : "border-gray-400 bg-gray-100 opacity-60"}
          `}
        >
          <img src={logo} alt={name} className="w-10 h-10 rounded bg-white" />
          <span className="flex-1 text-lg font-semibold">{name}</span>
          {available ? (
            <Link
              href={href!}
              className="px-4 py-2 bg-[#FF9151] text-[#003B49] rounded-lg font-bold hover:bg-[#FFA36C]"
              target="_blank"
              rel="noopener noreferrer"
            >
              Shop now
            </Link>
          ) : (
            <span className="px-4 py-2 bg-gray-300 text-gray-600 rounded-lg font-bold cursor-not-allowed">
              Coming Soon
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
