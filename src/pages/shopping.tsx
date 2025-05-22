// src/pages/shopping.tsx

import React, { useState } from "react";
import products from "@/data/products";

const filterOptions = [
  { label: "All", value: "all" },
  { label: "Made in America", value: "Made in America" },
  { label: "Made in Australia", value: "Made in Australia" },
  { label: "Sustainable", value: "Sustainable" },
];

export default function Shopping() {
  const [filter, setFilter] = useState("all");

  const filteredProducts =
    filter === "all"
      ? products
      : products.filter((p) => p.tags.includes(filter));

  return (
    <div style={{ maxWidth: 1200, margin: "40px auto 0", padding: 24 }}>
      <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>
        Shopping Rewards
      </h1>
      <div style={{ color: "#333", marginBottom: 22, fontSize: 17 }}>
        RewMo helps you earn rewards on products that match your values and lifestyle.<br />
        Use the filters to shop <b>“Made in America”</b>, <b>“Made in Australia”</b>, or <b>Sustainable</b> picks!
      </div>
      <div style={{ display: "flex", gap: 14, marginBottom: 30, flexWrap: "wrap" }}>
        {filterOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setFilter(opt.value)}
            style={{
              fontWeight: 700,
              fontSize: 17,
              background: filter === opt.value ? "#FF7900" : "#fff",
              color: filter === opt.value ? "#fff" : "#333",
              border: "2px solid #eee",
              padding: "8px 25px",
              borderRadius: 24,
              cursor: "pointer",
              boxShadow: filter === opt.value ? "0 2px 7px rgba(255,121,0,0.13)" : "none",
              transition: "all 0.18s",
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
          gap: "28px",
        }}
      >
        {filteredProducts.map((product) => {
          const isComingSoon = product.vendor !== "Amazon";
          return (
            <div
              key={product.id}
              style={{
                background: "#fff",
                borderRadius: 18,
                padding: "18px 18px 20px",
                boxShadow: "0 4px 18px 0 rgba(40,40,40,0.07)",
                position: "relative",
                minHeight: 330,
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                marginBottom: 28,
                overflow: "visible",
              }}
            >
              {/* Coming Soon Badge */}
              {isComingSoon && (
                <span
                  style={{
                    position: "absolute",
                    top: 14,
                    left: 14,
                    background: "#FF7900",
                    color: "#fff",
                    fontWeight: 800,
                    fontSize: 16,
                    borderRadius: 8,
                    padding: "6px 20px",
                    zIndex: 50,
                    boxShadow: "0 1px 3px 0 rgba(0,0,0,0.18)",
                    pointerEvents: "none",
                    letterSpacing: 0.5,
                    border: "2px solid #fff",
                    textShadow: "0 1px 3px 0 rgba(0,0,0,0.18)",
                    transition: "all 0.2s cubic-bezier(.42,0,.58,1.0)",
                  }}
                >
                  Coming Soon
                </span>
              )}
              {/* Vendor logo */}
              <img
                src={product.vendorLogo}
                alt={product.vendor}
                style={{
                  height: 38,
                  width: 38,
                  objectFit: "contain",
                  position: "absolute",
                  top: 14,
                  right: 14,
                  background: "#fff",
                  borderRadius: 8,
                  boxShadow: "0 1px 4px rgba(0,0,0,0.10)",
                  padding: 5,
                  zIndex: 10,
                }}
              />
              {/* Product image */}
              <img
                src={product.img}
                alt={product.name}
                style={{
                  width: "100%",
                  maxHeight: 120,
                  objectFit: "contain",
                  borderRadius: 10,
                  marginBottom: 18,
                  background: "#f4f4f4",
                }}
              />
              {/* Product info */}
              <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 3 }}>
                {product.name}
              </div>
              <div style={{ color: "#5b5b5b", marginBottom: 9, fontSize: 15 }}>
                {product.desc}
              </div>
              {/* Shop & Earn button */}
              <a
                href={product.link}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "block",
                  background: isComingSoon ? "#ddd" : "#FF7900",
                  color: isComingSoon ? "#999" : "#fff",
                  padding: "13px 0",
                  textAlign: "center",
                  borderRadius: 10,
                  fontWeight: 700,
                  fontSize: 17,
                  marginTop: "auto",
                  marginBottom: 0,
                  textDecoration: "none",
                  pointerEvents: isComingSoon ? "none" : "auto",
                  boxShadow: "0 2px 8px rgba(255,121,0,0.10)",
                  opacity: isComingSoon ? 0.7 : 1,
                  cursor: isComingSoon ? "not-allowed" : "pointer",
                }}
              >
                Shop & Earn
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
}
