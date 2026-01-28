// src/pages/lean-lab/index.tsx
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";

// Types
type Tab = "ai" | "rpm" | "finance" | "research";
type SubTab = "intro" | "fundamentals";

type Module = {
  id: string;
  title: string;
  description: string;
  duration: string;
  downloadUrl?: string;
  isPro?: boolean;
  isComingSoon?: boolean;
  slides?: number;
};

// R-PM Module Data
const RPM_INTRO_MODULES: Module[] = [
  {
    id: "rpm-intro",
    title: "Introduction to R-PM",
    description: "A quick overview of RewmoAI Process Management principles. Perfect starting point for anyone new to quality management.",
    duration: "30 min",
    slides: 15,
    downloadUrl: "https://firebasestorage.googleapis.com/v0/b/rewmoai.firebasestorage.app/o/ProcessSync_Module1_LiteDeck%2015Sept2025.pptx?alt=media",
  },
];

const RPM_FUNDAMENTALS_MODULES: Module[] = [
  {
    id: "rpm-fund-1",
    title: "Module 1: Quality Approach",
    description: "Master quality definitions, the 14 dimensions, customer focus, process thinking, and the chain reaction. Includes comprehensive instructor notes.",
    duration: "2-2.5 hours",
    slides: 26,
    isPro: true,
    downloadUrl: "https://firebasestorage.googleapis.com/v0/b/rewmoai.firebasestorage.app/o/R-PM_Fundamentals_Module_1_Expanded.pptx?alt=media",
  },
  {
    id: "rpm-fund-2",
    title: "Module 2: Quality Improvement Teams",
    description: "Learn team structures, roles, responsibilities, and how to organize effective improvement efforts.",
    duration: "2 hours",
    isPro: true,
    isComingSoon: true,
  },
  {
    id: "rpm-fund-3",
    title: "Module 3: Implementation",
    description: "Step-by-step guide to implementing R-PM in your household or small business.",
    duration: "2.5 hours",
    isPro: true,
    isComingSoon: true,
  },
  {
    id: "rpm-fund-4",
    title: "Module 4: Methods for Managing Quality",
    description: "Advanced tools and techniques for continuous quality improvement.",
    duration: "3 hours",
    isPro: true,
    isComingSoon: true,
  },
  {
    id: "rpm-fund-5",
    title: "Module 5: Statistical Thinking",
    description: "Data-driven decision making and understanding variation in processes.",
    duration: "2.5 hours",
    isPro: true,
    isComingSoon: true,
  },
];

// AI Training Data
const AI_MODULES: Module[] = [
  {
    id: "ai-prompting",
    title: "Prompt Engineering Fundamentals",
    description: "Learn how to craft effective prompts for ChatGPT, Claude, and other AI tools.",
    duration: "1 hour",
    downloadUrl: "#",
  },
  {
    id: "ai-agents",
    title: "Building AI Agents",
    description: "Create automated workflows with AI agents for business and personal use.",
    duration: "2 hours",
    isPro: true,
    isComingSoon: true,
  },
];

// Finance Training Data
const FINANCE_MODULES: Module[] = [
  {
    id: "fin-basics",
    title: "Personal Finance Fundamentals",
    description: "Budgeting, saving, and building a solid financial foundation.",
    duration: "1.5 hours",
    downloadUrl: "#",
  },
  {
    id: "fin-investing",
    title: "Investing Basics",
    description: "Understanding stocks, bonds, ETFs, and building a portfolio.",
    duration: "2 hours",
    isPro: true,
    isComingSoon: true,
  },
];

export default function LeanAILab() {
  const [activeTab, setActiveTab] = useState<Tab>("rpm");
  const [rpmSubTab, setRpmSubTab] = useState<SubTab>("intro");
  
  // TODO: Replace with your actual auth check
  // For now, set to true to show all content, or false to show paywall
  const isPro = true;

  return (
    <>
      <Head>
        <title>LeanAI Lab | RewmoAI Training</title>
        <meta name="description" content="World-class process improvement training for individuals and small businesses." />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </Head>

      <div className="min-h-screen bg-[#003B49]">
        {/* Header */}
        <div className="mx-auto max-w-6xl px-4 pt-12 pb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-[#FF6B00] text-center">
            LeanAI Lab
          </h1>
          
          <div className="mt-6 max-w-3xl mx-auto text-center">
            <h2 className="text-xl md:text-2xl font-semibold text-[#15C5C1]">
              Intro to RewmoAI Process Management
            </h2>
            <p className="mt-4 text-slate-300 leading-relaxed">
              Whether you&apos;re running a business, managing a household, or just trying to do more 
              with less—how you <span className="text-[#FF6B00] font-semibold">manage your process</span> is 
              the secret to bigger savings, less stress, and better results.
            </p>
            <p className="mt-4 text-slate-300 leading-relaxed">
              <span className="text-[#15C5C1] font-semibold">LeanAI Lab</span> makes world-class 
              process improvement simple, visual, and accessible for everyone.
            </p>
          </div>
        </div>

        {/* Main Tabs */}
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-wrap justify-center gap-3">
            <TabButton 
              active={activeTab === "ai"} 
              onClick={() => setActiveTab("ai")}
              icon="🤖"
              label="AI Training"
            />
            <TabButton 
              active={activeTab === "rpm"} 
              onClick={() => setActiveTab("rpm")}
              icon="📊"
              label="R-PM Training"
              isNew
            />
            <TabButton 
              active={activeTab === "finance"} 
              onClick={() => setActiveTab("finance")}
              icon="💰"
              label="Finance Training"
            />
            <TabButton 
              active={activeTab === "research"} 
              onClick={() => setActiveTab("research")}
              icon="🔬"
              label="Deep Research"
            />
          </div>
        </div>

        {/* Tab Content */}
        <div className="mx-auto max-w-6xl px-4 py-8">
          
          {/* AI Training Tab */}
          {activeTab === "ai" && (
            <TabContent title="AI Training Courses" icon="🤖">
              <p className="text-slate-300 mb-6">
                Learn how to plan, prompt, and prototype with modern AI tools.
              </p>
              <ModuleGrid modules={AI_MODULES} isPro={isPro} />
            </TabContent>
          )}

          {/* R-PM Training Tab */}
          {activeTab === "rpm" && (
            <TabContent title="R-PM Training" icon="📊">
              <p className="text-slate-300 mb-6">
                Master RewmoAI Process Management—quality principles adapted from world-class 
                methodologies for individuals, households, and small businesses.
              </p>

              {/* R-PM Sub-tabs */}
              <div className="flex gap-3 mb-8">
                <button
                  onClick={() => setRpmSubTab("intro")}
                  className={`px-5 py-2.5 rounded-lg font-medium transition-all ${
                    rpmSubTab === "intro"
                      ? "bg-[#15C5C1] text-[#003B49]"
                      : "bg-[#052B33] text-slate-300 hover:bg-[#0a3d47] border border-[#15C5C1]/30"
                  }`}
                >
                  📖 Introduction (Free)
                </button>
                <button
                  onClick={() => setRpmSubTab("fundamentals")}
                  className={`px-5 py-2.5 rounded-lg font-medium transition-all flex items-center gap-2 ${
                    rpmSubTab === "fundamentals"
                      ? "bg-[#FF6B00] text-white"
                      : "bg-[#052B33] text-slate-300 hover:bg-[#0a3d47] border border-[#FF6B00]/30"
                  }`}
                >
                  🎓 Fundamentals Series
                  {!isPro && <span className="text-xs bg-yellow-500/20 text-yellow-300 px-2 py-0.5 rounded">PRO</span>}
                </button>
              </div>

              {/* Introduction Content */}
              {rpmSubTab === "intro" && (
                <div>
                  <div className="bg-[#052B33] rounded-xl p-6 border border-[#15C5C1]/20 mb-6">
                    <h3 className="text-lg font-semibold text-[#15C5C1] mb-2">
                      🎉 Start Here — It&apos;s Free!
                    </h3>
                    <p className="text-slate-400 text-sm">
                      Get a quick overview of R-PM principles before diving into the full fundamentals course.
                    </p>
                  </div>
                  <ModuleGrid modules={RPM_INTRO_MODULES} isPro={true} />
                </div>
              )}

              {/* Fundamentals Content */}
              {rpmSubTab === "fundamentals" && (
                <div>
                  {!isPro && (
                    <div className="bg-gradient-to-r from-[#FF6B00]/20 to-[#FF6B00]/5 rounded-xl p-6 border border-[#FF6B00]/30 mb-6">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                          <h3 className="text-lg font-semibold text-[#FF6B00] mb-2">
                            🔒 PRO Content
                          </h3>
                          <p className="text-slate-300 text-sm">
                            Unlock the complete R-PM Fundamentals series with detailed instructor notes, 
                            exercises, and full methodology—perfect for small business training.
                          </p>
                        </div>
                        <Link
                          href="/account/upgrade?plan=PRO"
                          className="inline-flex items-center justify-center px-6 py-3 bg-[#FF6B00] hover:bg-[#FF9151] text-white font-semibold rounded-lg transition-colors whitespace-nowrap"
                        >
                          Upgrade to PRO — $10/mo
                        </Link>
                      </div>
                    </div>
                  )}
                  <ModuleGrid modules={RPM_FUNDAMENTALS_MODULES} isPro={isPro} />
                </div>
              )}
            </TabContent>
          )}

          {/* Finance Training Tab */}
          {activeTab === "finance" && (
            <TabContent title="Finance Training" icon="💰">
              <p className="text-slate-300 mb-6">
                Personal finance, investing fundamentals, and building wealth.
              </p>
              <ModuleGrid modules={FINANCE_MODULES} isPro={isPro} />
            </TabContent>
          )}

          {/* Deep Research Tab */}
          {activeTab === "research" && (
            <TabContent title="Deep Financial Research" icon="🔬">
              <p className="text-slate-300 mb-6">
                AI-powered research tools for investment analysis and market insights.
              </p>
              
              <div className="bg-[#052B33] rounded-xl p-8 border border-[#15C5C1]/20 text-center">
                <h3 className="text-2xl font-bold text-[#FF6B00] mb-4">
                  Deep Financial Research (OpenAI)
                </h3>
                <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
                  Use advanced AI to analyze stocks, research companies, and get comprehensive 
                  financial insights powered by OpenAI&apos;s latest models.
                </p>
                <a
                  href="https://chatgpt.com/g/g-..."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-[#FF6B00] hover:bg-[#FF9151] text-white font-semibold rounded-lg transition-colors text-lg"
                >
                  🚀 Launch Research Tool
                </a>
              </div>
            </TabContent>
          )}
        </div>

        {/* Quick Links Footer */}
        <div className="mx-auto max-w-6xl px-4 pb-12">
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/learn"
              className="px-5 py-2.5 bg-[#052B33] text-slate-300 rounded-lg hover:bg-[#0a3d47] border border-white/10 transition-colors"
            >
              📚 All Training Tracks
            </Link>
            <Link
              href="/account"
              className="px-5 py-2.5 bg-[#052B33] text-slate-300 rounded-lg hover:bg-[#0a3d47] border border-white/10 transition-colors"
            >
              👤 My Account
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

// ============================================
// COMPONENTS
// ============================================

function TabButton({ 
  active, 
  onClick, 
  icon, 
  label, 
  isNew 
}: { 
  active: boolean; 
  onClick: () => void; 
  icon: string; 
  label: string;
  isNew?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative px-6 py-3 rounded-xl font-semibold transition-all ${
        active
          ? "bg-[#15C5C1] text-[#003B49] shadow-lg shadow-[#15C5C1]/20"
          : "bg-[#052B33] text-slate-300 hover:bg-[#0a3d47] border border-white/10"
      }`}
    >
      {isNew && (
        <span className="absolute -top-2 -right-2 px-2 py-0.5 text-xs font-bold bg-[#FF6B00] text-white rounded-full animate-pulse">
          NEW
        </span>
      )}
      <span className="mr-2">{icon}</span>
      {label}
    </button>
  );
}

function TabContent({ 
  title, 
  icon, 
  children 
}: { 
  title: string; 
  icon: string; 
  children: React.ReactNode;
}) {
  return (
    <div className="bg-[#052B33]/50 rounded-2xl p-6 md:p-8 border border-white/5">
      <h2 className="text-2xl font-bold text-[#15C5C1] mb-4 flex items-center gap-3">
        <span>{icon}</span>
        {title}
      </h2>
      {children}
    </div>
  );
}

function ModuleGrid({ 
  modules, 
  isPro 
}: { 
  modules: Module[]; 
  isPro: boolean;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {modules.map((module) => (
        <ModuleCard key={module.id} module={module} userIsPro={isPro} />
      ))}
    </div>
  );
}

function ModuleCard({ 
  module, 
  userIsPro 
}: { 
  module: Module; 
  userIsPro: boolean;
}) {
  const canAccess = !module.isPro || userIsPro;
  const isLocked = module.isPro && !userIsPro;

  return (
    <div 
      className={`relative rounded-xl p-5 border transition-all ${
        module.isComingSoon
          ? "bg-[#052B33]/50 border-white/5 opacity-60"
          : isLocked
          ? "bg-[#052B33] border-[#FF6B00]/20"
          : "bg-[#052B33] border-[#15C5C1]/20 hover:border-[#15C5C1]/40"
      }`}
    >
      {/* Badges */}
      <div className="flex gap-2 mb-3">
        {module.isPro && (
          <span className="px-2 py-0.5 text-xs font-semibold bg-[#FF6B00]/20 text-[#FF6B00] rounded">
            PRO
          </span>
        )}
        {module.isComingSoon && (
          <span className="px-2 py-0.5 text-xs font-semibold bg-slate-600/50 text-slate-400 rounded">
            Coming Soon
          </span>
        )}
        {!module.isPro && !module.isComingSoon && (
          <span className="px-2 py-0.5 text-xs font-semibold bg-[#22C55E]/20 text-[#22C55E] rounded">
            FREE
          </span>
        )}
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-white mb-2">
        {module.title}
      </h3>

      {/* Description */}
      <p className="text-slate-400 text-sm mb-4 line-clamp-2">
        {module.description}
      </p>

      {/* Meta */}
      <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
        <span>⏱️ {module.duration}</span>
        {module.slides && <span>📊 {module.slides} slides</span>}
      </div>

      {/* Action Button */}
      {module.isComingSoon ? (
        <button 
          disabled 
          className="w-full py-2.5 px-4 bg-slate-700/50 text-slate-500 rounded-lg cursor-not-allowed"
        >
          Coming Soon
        </button>
      ) : isLocked ? (
        <Link
          href="/account/upgrade?plan=PRO"
          className="block w-full py-2.5 px-4 bg-[#FF6B00]/20 hover:bg-[#FF6B00]/30 text-[#FF6B00] font-medium rounded-lg text-center transition-colors"
        >
          🔒 Unlock with PRO
        </Link>
      ) : (
        <a
          href={module.downloadUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-[#15C5C1] hover:bg-[#1ad4d0] text-[#003B49] font-semibold rounded-lg transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download
        </a>
      )}

      {/* Lock Overlay for Pro Content */}
      {isLocked && (
        <div className="absolute top-3 right-3">
          <span className="text-2xl">🔒</span>
        </div>
      )}
    </div>
  );
}