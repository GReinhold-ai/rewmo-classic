import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function LeanLabPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#003B49] font-sans">
      <main className="flex-1 flex flex-col items-center px-4 py-10">
        <Image
          src="/logos/logo.png"
          alt="RewmoAI Logo"
          width={70}
          height={70}
          className="mb-3 mx-auto rounded-full border-2 border-[#FF9151]"
        />
        <h1 className="text-3xl md:text-5xl font-black mb-7 text-[#FF9151] tracking-tight text-center">
          LeanAI Lab
        </h1>

        {/* Intro Section */}
        <section className="max-w-3xl mx-auto mb-10 w-full">
          <div className="bg-[#072b33] rounded-2xl px-8 py-6 shadow text-center border border-[#15C5C1]">
            <h2 className="text-2xl md:text-3xl font-black mb-3 text-[#15C5C1] tracking-tight">
              Intro to RewmoAI Process Management
            </h2>
            <p className="text-[#B6E7EB] text-lg mb-2">
              Whether you’re running a business, managing a household, or just trying to do more with less—how you <span className="text-[#FF9151] font-bold">manage your process</span> is the secret to bigger savings, less stress, and better results.
            </p>
            <p className="text-[#F7F6F2] text-base mb-3">
              <span className="text-[#FF9151] font-bold">LeanAI Lab</span> makes world-class process improvement simple, visual, and accessible for everyone. Our AI-driven tools help you map out routines, spot waste, and unlock continuous improvement—so you can focus on what matters most.
            </p>
            <p className="text-[#B6E7EB] text-base mt-4">
              <span className="font-semibold text-[#15C5C1]">Ready to get started?</span> Jump into our Process Visualization tool, or explore the modules below!
            </p>
          </div>
        </section>

        {/* Module 1: Quality Approach */}
        <section className="w-full max-w-3xl mb-10">
          <div className="bg-[#072b33] rounded-2xl shadow-xl border border-[#15C5C1] px-8 py-8">
            <h2 className="text-2xl font-bold mb-2 text-[#FF9151]">Module 1: RewmoAI Quality Approach</h2>
            <p className="text-lg text-[#B6E7EB] mb-3">
              <span className="font-semibold text-[#15C5C1]">Total Quality Management for Individuals & Small Businesses</span>
            </p>
            <div className="mb-4">
              <h3 className="font-bold text-[#FFA36C] mb-1">Learning Objectives</h3>
              <ul className="list-disc pl-5 space-y-1 text-[#B6E7EB] text-base">
                <li>Understand why “quality” matters for your business or personal financial life.</li>
                <li>Define what “quality” means for you or your customers.</li>
                <li>Identify your most important processes (and why they matter).</li>
                <li>Explain the difference between “inspection” and “process improvement.”</li>
                <li>See how small changes can create big results.</li>
                <li>Use RewmoAI features to automate and improve your success.</li>
              </ul>
            </div>
            {/* ...rest of module content (unchanged from your code, palette matched) */}
            {/* You can keep all your module breakdown here, just like your example above */}
          </div>
        </section>

        {/* Placeholder for Module 2 */}
        <section className="w-full max-w-3xl mb-10">
          <div className="bg-[#072b33] rounded-2xl shadow-xl border border-[#15C5C1] px-8 py-8 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-[#FFA36C] mb-2">Module 2: Intro to Tool Flow Charting</h2>
              <p className="text-lg text-[#B6E7EB]">Coming Soon: Learn how to map and measure your most important processes, then optimize them with RewmoAI’s visual tools.</p>
            </div>
            <div>
              <Image src="/icons/flowchart.svg" alt="Flowcharting" width={50} height={50} />
            </div>
          </div>
        </section>
      </main>

      <footer className="text-[#F7F6F2] text-xs py-4 text-center border-t border-[#072b33] bg-[#003B49]">
        <span>
          © {new Date().getFullYear()} RewmoAI |{" "}
          <Link href="/affiliate-disclosure" className="underline hover:text-[#FFA36C] text-[#FF9151]">Affiliate Disclosure</Link> |{" "}
          <Link href="/privacy" className="underline hover:text-[#FFA36C] text-[#FF9151]">Privacy</Link> |{" "}
          <Link href="/terms" className="underline hover:text-[#FFA36C] text-[#FF9151]">Terms</Link>
        </span>
      </footer>
    </div>
  );
}
