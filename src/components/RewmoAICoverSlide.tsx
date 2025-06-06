import React from "react";

// Adjust the logo import based on where you save your logo file
import logo from "@/public/rewmo-logo.png"; // update the path as needed

export default function RewmoAICoverSlide() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#003B49] font-sans p-8">
      <div className="bg-[#072b33] rounded-2xl shadow-xl border border-[#15C5C1] p-10 max-w-xl w-full text-center">
        <img
          src="/rewmo-logo.png" // or use {logo} if importing directly
          alt="RewmoAI Logo"
          className="mx-auto mb-6"
          style={{ height: 64, width: 'auto' }}
        />
        <h1 className="text-4xl font-black mb-4 text-[#FF9151]">RewmoAI Process Management</h1>
        <h2 className="text-2xl font-semibold mb-3 text-[#15C5C1]">Unlocking Quality in Everything You Do</h2>
        <p className="text-[#B6E7EB] text-lg">
          A practical, AI-powered guide to continuous improvement for life and business
        </p>
      </div>
    </div>
  );
}
