// src/pages/team.tsx
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Linkedin } from "lucide-react";

export default function MeetTheTeamPage() {
  return (
    <div className="min-h-screen bg-[#003B49] flex flex-col items-center justify-start py-16 px-4 font-sans">
      <div className="bg-[#072b33] rounded-2xl p-8 shadow-xl border border-[#15C5C1] max-w-xl w-full text-center flex flex-col items-center">
        <Image
          src="/team/gary.png"
          alt="Gary Reinhold, Founder & CEO of RewmoAI"
          width={140}
          height={140}
          className="rounded-full mb-6 border-4 border-[#FF9151] shadow-xl"
        />
        <h1 className="text-2xl md:text-3xl font-extrabold text-[#FF9151] mb-2">
          Gary Reinhold
        </h1>
        <h2 className="text-lg font-semibold text-[#15C5C1] mb-4">
          Founder & CEO, RewmoAI
        </h2>
        <p className="text-[#B6E7EB] mb-6 leading-relaxed">
          As the Founder and CEO of Rewmo, and a master of Revolutionary Systems Design, I am dedicated to revolutionizing how Americans manage their finances by developing Financial AI Agents.
          <br /><br />
          With over 30 years of trust and experience in the military, aviation, commercial construction, and sustainable energy industries, I have a proven track record of leading successful startups.
          <br /><br />
          At Rewmo, we're pioneering the use of Generative AI to turn everyday payments—like rent and loans—into valuable rewards. Our mission is to provide financial freedom for every American by transforming essential expenses into opportunities for growth.
          <br /><br />
          Based in Scottsdale, AZ, I lead a dynamic team committed to making financial management more rewarding for everyone.
        </p>
        <div className="flex flex-col items-center gap-3 mb-4">
          <a
            href="mailto:support@rewmo.ai"
            className="underline text-[#15C5C1] hover:text-[#FFA36C] font-medium"
          >
            Contact Gary
          </a>
          <a
            href="https://www.linkedin.com/in/rewmoai"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-[#15C5C1] hover:bg-[#FFA36C] text-[#003B49] font-semibold px-4 py-2 rounded-lg mt-2 transition"
          >
            <Linkedin className="w-5 h-5" />
            Connect on LinkedIn
          </a>
        </div>
        <Link
          href="/"
          className="inline-block mt-4 px-6 py-2 bg-[#FF9151] hover:bg-[#FFA36C] text-[#003B49] font-bold rounded-xl shadow transition"
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}
