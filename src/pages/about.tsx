// src/pages/about.tsx

import React from "react";

export default function About() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-orange-50 flex flex-col items-center px-4 py-12">
      <h1 className="text-4xl md:text-5xl font-extrabold text-center text-black mb-6">
        RewMoAI: Wealth for Members, Not Institutions
      </h1>
      <p className="text-lg md:text-xl text-center max-w-3xl mb-6 text-gray-700">
        For too long, financial institutions have made billions while everyday people fall behind—profiting from excessive fees, bloated executive salaries, and needless overhead.
        <br />
        <span className="text-orange-600 font-bold">
          RewMoAI flips the script:
        </span>{" "}
        we give those profits back to you, the member—transforming every payment into real rewards and lifelong savings. No corporate bonuses. No fancy buildings. Just smarter AI, lower costs, and more cash in your pocket.
      </p>

      <section className="w-full max-w-3xl mb-10">
        <h2 className="text-2xl md:text-3xl font-bold text-orange-600 mb-3 text-center">
          Our Guiding Principles
        </h2>
        <ul className="bg-white rounded-xl shadow p-6 md:p-8 grid gap-4 text-base md:text-lg">
          <li>
            <b>Members First:</b> Every decision is made for your benefit—not for shareholders or executives. If it doesn’t help you build wealth, we won’t do it.
          </li>
          <li>
            <b>Total Quality Management (TQM):</b> We run RewMoAI using proven TQM principles—eliminating waste, maximizing efficiency, and delivering the highest quality experience for our members.
          </li>
          <li>
            <b>Continuous Improvement:</b> We never settle. Our AI, our technology, and our processes are constantly evolving—driven by member feedback and a relentless pursuit of excellence. Every update is designed to make RewMoAI even better for you.
          </li>
          <li>
            <b>Radical Transparency:</b> No hidden fees, no secrets. Our operations, costs, and rewards structures are clear and open—so you always know where your money is going and how it’s coming back to you.
          </li>
          <li>
            <b>Lifelong Financial Empowerment:</b> Our mission goes beyond points or perks. We’re here to guide you—step by step—on your journey to financial independence, helping you turn everyday payments into lifelong wealth.
          </li>
        </ul>
      </section>

      <section className="max-w-2xl mb-10 text-center">
        <h3 className="text-xl font-semibold mb-2 text-black">Why TQM Matters</h3>
        <p className="mb-2 text-gray-700">
          By committing to <b>Total Quality Management</b> and continuous improvement, RewMoAI ensures that:
        </p>
        <ul className="list-disc list-inside text-left mx-auto text-gray-700 mb-2">
          <li>No dollar is wasted—every resource is optimized to maximize your rewards and savings</li>
          <li>Your experience gets better every year, powered by your feedback and our data-driven insights</li>
          <li>The value of your membership keeps growing—now and for the future</li>
        </ul>
      </section>

      <div className="mt-6 mb-12">
        <span className="inline-block bg-orange-600 text-white text-lg font-bold px-7 py-4 rounded-xl shadow">
          RewMoAI: Turn your payments into prosperity—with a platform that’s always improving for you.
        </span>
      </div>

      <a
        href="/signup"
        className="bg-black text-orange-200 px-8 py-4 rounded-xl font-bold text-xl shadow hover:bg-orange-600 hover:text-white transition"
      >
        Join RewMoAI Now
      </a>
    </main>
  );
}
