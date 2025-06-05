import React from "react";
import Link from "next/link";
import { BookOpen, Brain, Hammer, Zap } from "lucide-react";

export default function LearningLabIntro() {
  return (
    <main className="min-h-screen bg-[#003B49] text-[#15C5C1] py-10 px-4 flex flex-col items-center">
      <div className="max-w-2xl w-full bg-[#072b33] rounded-2xl shadow-lg p-8 mb-8 border border-[#15C5C1]/10">
        <div className="flex items-center gap-3 mb-4">
          <BookOpen className="w-7 h-7 text-[#FF9151]" />
          <h1 className="text-3xl font-extrabold text-[#FF9151]">
            Welcome to the RewmoAI Learning Lab
          </h1>
        </div>
        <p className="mb-3 text-[#F7F6F2] text-lg">
          <span className="font-bold text-[#FF9151]">Supercharge your financial journey</span>—and your business—by learning the art of process management, simplified for everyone.  
        </p>
        <p className="mb-4 text-[#F7F6F2]">
          <span className="font-semibold text-[#15C5C1]">RewmoAI</span> is more than rewards. It's your digital coach for mastering everyday decisions, business workflows, and even family finances—using proven methods like Total Quality Management (TQM), now powered by AI.
        </p>
        <div className="flex flex-col md:flex-row gap-4 mt-6 mb-6">
          <div className="flex items-start gap-3">
            <Brain className="w-6 h-6 text-[#15C5C1]" />
            <div>
              <span className="font-bold text-[#15C5C1]">What is Process Management?</span>
              <p className="text-[#F7F6F2] text-sm">
                It's the art and science of making life, work, and money flow better—one smart improvement at a time.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Hammer className="w-6 h-6 text-[#FF9151]" />
            <div>
              <span className="font-bold text-[#FF9151]">Why use TQM?</span>
              <p className="text-[#F7F6F2] text-sm">
                TQM (Total Quality Management) is a set of tools used by the world's best companies—and now by RewmoAI—to make every process more efficient, more reliable, and less stressful.
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-xl bg-[#ff915111] p-4 mb-6">
          <Zap className="w-5 h-5 text-[#15C5C1] inline mr-1" />
          <span className="font-semibold text-[#15C5C1]">
            How does AI help?
          </span>
          <p className="text-[#F7F6F2] text-sm mt-1">
            Our AI agents can analyze, suggest, and automate improvements—saving you hours, dollars, and headaches.
          </p>
        </div>
        <p className="mb-4 text-[#F7F6F2] text-sm">
          In this Learning Lab, you’ll discover quick, practical lessons from process management and TQM—plus AI-driven tips you can use instantly.  
        </p>
        <div className="flex flex-col gap-2">
          <Link
            href="/learning-lab/flowcharts"
            className="block bg-[#15C5C1] hover:bg-[#13a7a3] text-[#003B49] font-bold py-3 rounded-xl text-center shadow-md transition"
          >
            Start: Module 1 – Flowcharts & Visualization
          </Link>
          <span className="text-xs text-[#15C5C1] mt-2 text-center">
            More modules coming soon: Checklists, Root Cause Analysis, and AI-powered process tools!
          </span>
        </div>
      </div>
      <div className="text-xs text-[#F7F6F2]/70 text-center">
        Want advanced process coaching for your team or business? <span className="underline">Contact RewmoAI</span> for custom training and automation.
      </div>
    </main>
  );
}
