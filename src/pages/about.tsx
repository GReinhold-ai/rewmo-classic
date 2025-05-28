import React from "react";
import Image from "next/image";
import Link from "next/link";
import logo from "@/../public/logos/logo.png"; // Adjust as needed
import BottomTabBar from "@/components/BottomTabBar";

export default function AboutPage() {
  return (
    <>
      <main className="min-h-screen bg-neutral-50 pt-4 md:pt-10 pb-8 flex flex-col items-center">
        {/* Logo & Heading */}
        <div className="flex flex-col items-center mb-4">
          <Image
            src={logo}
            alt="RewmoAI Logo"
            width={80}
            height={80}
            priority
            className="mb-2 rounded-full border border-orange-500 shadow-md"
          />
          <h1 className="text-2xl md:text-3xl font-extrabold text-orange-600 mb-1 tracking-tight text-center">
            About RewmoAI
          </h1>
        </div>

        {/* Principles Section */}
        <section className="py-2 px-3 max-w-2xl mx-auto w-full">
          <h2 className="text-lg md:text-xl font-semibold text-orange-600 mb-2 text-center tracking-tight">
            Our Guiding Principles
          </h2>
          <div className="bg-white rounded-xl shadow p-4 md:p-5 space-y-3 md:space-y-4 mb-6 text-sm md:text-base text-gray-700">
            <div>
              <span className="font-medium">Members First:</span> Every decision is made for your benefit—not for shareholders or executives. If it doesn’t help you build wealth, we won’t do it.
            </div>
            <div>
              <span className="font-medium">Total Quality Management (TQM):</span> We run RewMoAI using proven TQM principles—eliminating waste, maximizing efficiency, and delivering the highest quality experience for our members.
            </div>
            <div>
              <span className="font-medium">Continuous Improvement:</span> We never settle. Our AI, technology, and processes are constantly evolving—driven by member feedback and a relentless pursuit of excellence.
            </div>
            <div>
              <span className="font-medium">Radical Transparency:</span> No hidden fees, no secrets. Our operations, costs, and rewards structures are clear and open—so you always know where your money is going and how it’s coming back to you.
            </div>
            <div>
              <span className="font-medium">Lifelong Financial Empowerment:</span> Our mission goes beyond points or perks. We’re here to guide you—step by step—on your journey to financial independence, helping you turn everyday payments into lifelong wealth.
            </div>
            <div>
              <span className="font-medium text-orange-600">American Data Security:</span> We use only U.S.-based AI models, cloud vendors, and technology partners. Your financial data never leaves the country and is never shared with foreign entities—ensuring your information is secure, private, and protected by American law.
            </div>
          </div>
        </section>

        {/* TQM & AI Section */}
        <section className="py-1 px-3 max-w-2xl mx-auto w-full">
          <h2 className="text-lg md:text-xl font-semibold text-orange-600 mb-2 text-center">
            How RewmoAI Works for You
          </h2>
          <div className="bg-white rounded-xl shadow p-4 md:p-5 space-y-3 mb-6 text-sm md:text-base text-gray-700">
            <div>
              <span className="font-medium">AI-Driven Efficiency:</span> RewmoAI uses OpenAI’s advanced LLMs <span className="italic">(large language models)</span> and browser-based intelligence to scan, analyze, and optimize your finances in real time.
            </div>
            <div>
              <span className="font-medium">TQM at Every Step:</span> Every process, recommendation, and interaction is continually optimized to deliver maximum value to you—with less waste, less friction, and fewer mistakes.
            </div>
            <div>
              <span className="font-medium">Member-Powered Innovation:</span> Our technology evolves with your needs—every feature, update, and policy is driven by real member feedback and participation.
            </div>
          </div>
        </section>

        {/* AI Financial Education & Guidance */}
        <section className="py-1 px-3 max-w-2xl mx-auto w-full">
          <h2 className="text-lg md:text-xl font-semibold text-orange-600 mb-2 text-center">
            Groundbreaking Financial Education & Guidance
          </h2>
          <div className="bg-white rounded-xl shadow p-4 md:p-5 space-y-3 mb-6 text-sm md:text-base text-gray-700">
            <div>
              <span className="font-medium">Personalized Learning:</span> Every member gets access to a custom financial learning journey powered by RewmoAI and OpenAI—using live web data and the world’s best financial library, tailored to your goals, life stage, and participation.
            </div>
            <div>
              <span className="font-medium">Real-Time Recommendations:</span> Your dashboard and notifications highlight new opportunities, reward programs, and wealth-building moves—updated daily as your activity and market conditions change.
            </div>
            <div>
              <span className="font-medium">Direct Access to Experts:</span> You can ask questions, get guidance, and explore custom strategies—24/7, right in the app.
            </div>
          </div>
        </section>

        {/* Closing Block */}
        <section className="py-1 px-3 max-w-2xl mx-auto w-full text-center">
          <div className="bg-gradient-to-r from-orange-100 to-orange-50 border border-orange-200 rounded-xl p-4 md:p-5 shadow text-sm md:text-base">
            <div className="text-orange-600 font-bold text-lg mb-1">Ready to experience the future of financial rewards and guidance?</div>
            <div className="text-gray-700 mb-2">Join RewmoAI today, and see how every payment can bring you closer to financial freedom.</div>
            <Link href="/" passHref legacyBehavior>
              <a className="inline-block mt-2 px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold transition">
                Join Rewmo Now
              </a>
            </Link>
          </div>
        </section>
      </main>

      {/* Only show bottom bar on mobile */}
      <div className="md:hidden">
        <BottomTabBar />
      </div>
    </>
  );
}
