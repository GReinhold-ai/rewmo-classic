// src/components/EligibleStoresBusiness.tsx
import React from "react";
import Link from "next/link";

const businessStores = [
  {
    name: "Amazon Business",
    href: "https://www.amazon.com/business?tag=YOUR_AFFILIATE_ID", // Replace with your affiliate ID
    available: true,
    logo: "/logos/amazon-business.png", // add your logo or use the main Amazon logo
  },
  {
    name: "Staples",
    available: false,
    logo: "/logos/staples.png",
  },
  {
    name: "Office Depot",
    available: false,
    logo: "/logos/officedepot.png",
  },
  {
    name: "Sam's Club",
    available: false,
    logo: "/logos/samsclub.png",
  },
];

export default function EligibleStoresBusiness() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {businessStores.map(({ name, href, available, logo }) => (
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
