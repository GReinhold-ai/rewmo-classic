// src/pages/lean-lab/index.tsx
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import { BookOpen, Brain, Hammer, Zap, Download, Lock, Play, Award, ExternalLink } from "lucide-react";

// Types
type Tab = "rpm" | "ai" | "finance" | "research";
type RpmSubTab = "intro" | "fundamentals";

type Module = {
  id: string;
  title: string;
  description: string;
  duration: string;
  slides?: number;
  downloadUrl?: string;
  pageUrl?: string; // Link to interactive page with quiz
  isPro?: boolean;
  isComingSoon?: boolean;
  hasQuiz?: boolean;
};

// ===========================================
// MODULE DATA
// ===========================================

const RPM_INTRO_MODULES: Module[] = [
  {
    id: "rpm-intro-foundations",
    title: "R-PM Foundations (Lite)",
    description: "Quick overview of workflows, customer-defined quality, inspection vs. improvement, and the quality chain reaction. Includes quiz & badge!",
    duration: "45 min",
    slides: 15,
    pageUrl: "/learn/rpm", // Your existing page with quiz
    hasQuiz: true,
  },
];

const RPM_FUNDAMENTALS_MODULES: Module[] = [
  {
    id: "rpm-fund-1",
    title: "Module 1: The Quality Approach",
    description: "Complete deep-dive into quality definitions, 14 dimensions, customer focus, process thinking, and the chain reaction. Full instructor notes included.",
    duration: "2-2.5 hours",
    slides: 26,
    isPro: true,
    downloadUrl: "https://firebasestorage.googleapis.com/v0/b/rewmoai.firebasestorage.app/o/R-PM_Fundamentals_Module_1_Expanded.pptx?alt=media", // UPDATE THIS URL after upload
  },
  {
    id: "rpm-fund-2",
    title: "Module 2: Quality Improvement Teams",
    description: "Team structures, roles, responsibilities, and organizing effective improvement efforts for your business.",
    duration: "2 hours",
    isPro: true,
    isComingSoon: true,
  },
  {
    id: "rpm-fund-3",
    title: "Module 3: Implementation",
    description: "Step-by-step guide to implementing R-PM methodology in your household or small business.",
    duration: "2.5 hours",
    isPro: true,
    isComingSoon: true,
  },
  {
    id: "rpm-fund-4",
    title: "Module 4: Methods for Managing Quality",
    description: "Advanced tools and techniques for continuous quality improvement and waste reduction.",
    duration: "3 hours",
    isPro: true,
    isComingSoon: true,
  },
  {
    id: "rpm-fund-5",
    title: "Module 5: Statistical Thinking",
    description: "Data-driven decision making and understanding variation in your processes.",
    duration: "2.5 hours",
    isPro: true,
    isComingSoon: true,
  },
];

const AI_MODULES: Module[] = [
  {
    id: "ai-prompting",
    title: "Prompt Engineering Fundamentals",
    description: "Learn to craft effective prompts for ChatGPT, Claude, and other AI tools to get better results.",
    duration: "1 hour",
    pageUrl: "/learn/genai",
  },
  {
    id: "ai-workflows",
    title: "AI-Powered Workflows",
    description: "Automate repetitive tasks and build smart workflows using AI agents.",
    duration: "2 hours",
    isPro: true,
    isComingSoon: true,
  },
];

const FINANCE_MODULES: Module[] = [
  {
    id: "fin-basics",
    title: "Personal Finance Fundamentals",
    description: "Budgeting, saving strategies, and building a solid financial foundation for life.",
    duration: "1.5 hours",
    pageUrl: "/learn/finance",
  },
  {
    id: "fin-investing",
    title: "Investing Basics",
    description: "Understanding stocks, bonds, ETFs, and building your first investment portfolio.",
    duration: "2 hours",
    isPro: true,
    isComingSoon: true,
  },
];

// ===========================================
// MAIN COMPONENT
// ===========================================

export default function LeanAILab() {
  const [activeTab, setActiveTab] = useState<Tab>("rpm");
  const [rpmSubTab, setRpmSubTab] = useState<RpmSubTab>("intro");
  
  // TODO: Replace with your actual auth check when ready
  // Set to false to show paywall, true to unlock all content
  const isPro = true;

  return (
    <>
      <Head>
        <title>LeanAI Lab | RewmoAI Training</title>
        <meta name="description" content="World-class process improvement training for individuals and small businesses. Master R-PM, AI tools, and financial skills." />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </Head>

      <div className="min-h-screen bg-[#003B49]">
        {/* ========== HEADER ========== */}
        <div className="mx-auto max-w-6xl px-4 pt-12 pb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#FF6B00] text-center">
            LeanAI Lab
          </h1>
          
          <div className="mt-8 max-w-3xl mx-auto">
            <div className="bg-[#052B33] rounded-2xl p-6 border border-[#15C5C1]/20">
              <h2 className="text-xl md:text-2xl font-bold text-[#15C5C1] text-center mb-4">
                Intro to RewmoAI Process Management
              </h2>
              <p className="text-slate-300 text-center leading-relaxed">
                Whether you&apos;re running a business, managing a household, or just trying to do more 
                with less—how you <span className="text-[#FF6B00] font-semibold">manage your process</span> is 
                the secret to bigger savings, less stress, and better results.
              </p>
              <p className="mt-4 text-slate-300 text-center leading-relaxed">
                <span className="text-[#15C5C1] font-semibold">LeanAI Lab</span> makes world-class 
                process improvement simple, visual, and accessible for everyone. Our AI-driven tools 
                help you map routines, spot waste, and unlock continuous improvement.
              </p>
              <p className="mt-4 text-[#15C5C1] text-center text-sm">
                Ready to get started? Jump into the resources below!
              </p>
            </div>
          </div>
        </div>

        {/* ========== MAIN TABS ========== */}
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-wrap justify-center gap-3">
            <MainTabButton 
              active={activeTab === "rpm"} 
              onClick={() => setActiveTab("rpm")}
              color="teal"
              isNew
            >
              📊 R-PM Training
            </MainTabButton>
            <MainTabButton 
              active={activeTab === "ai"} 
              onClick={() => setActiveTab("ai")}
              color="orange"
            >
              🤖 AI Training
            </MainTabButton>
            <MainTabButton 
              active={activeTab === "finance"} 
              onClick={() => setActiveTab("finance")}
              color="orange"
            >
              💰 Finance Training
            </MainTabButton>
            <MainTabButton 
              active={activeTab === "research"} 
              onClick={() => setActiveTab("research")}
              color="orange"
            >
              🔬 Deep Research
            </MainTabButton>
          </div>
        </div>

        {/* ========== TAB CONTENT ========== */}
        <div className="mx-auto max-w-6xl px-4 py-8">
          
          {/* ---------- R-PM TRAINING TAB ---------- */}
          {activeTab === "rpm" && (
            <TabPanel>
              <TabHeader 
                icon={<Hammer className="w-6 h-6" />}
                title="R-PM Training"
                description="Master RewmoAI Process Management—quality principles adapted from world-class methodologies for individuals, households, and small businesses."
              />

              {/* R-PM Sub-tabs */}
              <div className="flex flex-wrap gap-3 mb-8">
                <button
                  onClick={() => setRpmSubTab("intro")}
                  className={`px-5 py-2.5 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                    rpmSubTab === "intro"
                      ? "bg-[#15C5C1] text-[#003B49]"
                      : "bg-[#072b33] text-slate-300 hover:bg-[#0a3d47] border border-[#15C5C1]/30"
                  }`}
                >
                  📖 Introduction
                  <span className="text-xs bg-[#22C55E]/20 text-[#22C55E] px-2 py-0.5 rounded">FREE</span>
                </button>
                <button
                  onClick={() => setRpmSubTab("fundamentals")}
                  className={`px-5 py-2.5 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                    rpmSubTab === "fundamentals"
                      ? "bg-[#FF6B00] text-white"
                      : "bg-[#072b33] text-slate-300 hover:bg-[#0a3d47] border border-[#FF6B00]/30"
                  }`}
                >
                  🎓 Fundamentals Series
                  {!isPro && <span className="text-xs bg-yellow-500/20 text-yellow-300 px-2 py-0.5 rounded">PRO</span>}
                </button>
              </div>

              {/* Introduction Sub-tab */}
              {rpmSubTab === "intro" && (
                <div>
                  <div className="bg-[#072b33] rounded-xl p-5 border border-[#15C5C1]/20 mb-6">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-[#15C5C1]/10 rounded-lg">
                        <Zap className="w-5 h-5 text-[#15C5C1]" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-[#15C5C1]">
                          🎉 Start Here — It&apos;s Free!
                        </h3>
                        <p className="text-slate-400 text-sm mt-1">
                          Get a quick overview of R-PM principles, take a quiz, and earn your first badge 
                          before diving into the full fundamentals course.
                        </p>
                      </div>
                    </div>
                  </div>
                  <ModuleGrid modules={RPM_INTRO_MODULES} userIsPro={true} />
                </div>
              )}

              {/* Fundamentals Sub-tab */}
              {rpmSubTab === "fundamentals" && (
                <div>
                  {!isPro && (
                    <ProUpgradeCard />
                  )}
                  <ModuleGrid modules={RPM_FUNDAMENTALS_MODULES} userIsPro={isPro} />
                </div>
              )}
            </TabPanel>
          )}

          {/* ---------- AI TRAINING TAB ---------- */}
          {activeTab === "ai" && (
            <TabPanel>
              <TabHeader 
                icon={<Brain className="w-6 h-6" />}
                title="AI Training Courses"
                description="Learn how to plan, prompt, and prototype with modern AI tools. Supercharge your productivity with practical AI skills."
              />
              <ModuleGrid modules={AI_MODULES} userIsPro={isPro} />
            </TabPanel>
          )}

          {/* ---------- FINANCE TRAINING TAB ---------- */}
          {activeTab === "finance" && (
            <TabPanel>
              <TabHeader 
                icon={<BookOpen className="w-6 h-6" />}
                title="Finance Training"
                description="Personal finance, investing fundamentals, and building wealth. Practical money skills for life."
              />
              <ModuleGrid modules={FINANCE_MODULES} userIsPro={isPro} />
            </TabPanel>
          )}

          {/* ---------- DEEP RESEARCH TAB ---------- */}
          {activeTab === "research" && (
            <TabPanel>
              <TabHeader 
                icon={<Zap className="w-6 h-6" />}
                title="Deep Financial Research"
                description="AI-powered research tools for investment analysis and market insights."
              />
              
              <div className="bg-[#072b33] rounded-2xl p-8 border border-[#FF6B00]/20 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-[#FF6B00]/10 rounded-full mb-4">
                  <Zap className="w-8 h-8 text-[#FF6B00]" />
                </div>
                <h3 className="text-2xl font-bold text-[#FF6B00] mb-3">
                  Deep Financial Research (OpenAI)
                </h3>
                <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
                  Use advanced AI to analyze stocks, research companies, and get comprehensive 
                  financial insights powered by OpenAI&apos;s latest models.
                </p>
                <a
                  href="https://chatgpt.com/g/g-67c61a9aa3108191a0e26f0a31a21b3a-deep-financial-research"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-[#FF6B00] hover:bg-[#FF9151] text-white font-bold rounded-xl transition-colors text-lg"
                >
                  <ExternalLink className="w-5 h-5" />
                  Launch Research Tool
                </a>
              </div>
            </TabPanel>
          )}
        </div>

        {/* ========== QUICK LINKS FOOTER ========== */}
        <div className="mx-auto max-w-6xl px-4 pb-12">
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/learn"
              className="px-5 py-2.5 bg-[#072b33] text-slate-300 rounded-lg hover:bg-[#0a3d47] border border-white/10 transition-colors flex items-center gap-2"
            >
              📚 All Training Tracks
            </Link>
            <Link
              href="/account"
              className="px-5 py-2.5 bg-[#072b33] text-slate-300 rounded-lg hover:bg-[#0a3d47] border border-white/10 transition-colors flex items-center gap-2"
            >
              👤 My Account
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

// ===========================================
// SUB-COMPONENTS
// ===========================================

function MainTabButton({ 
  active, 
  onClick, 
  children,
  color = "teal",
  isNew 
}: { 
  active: boolean; 
  onClick: () => void; 
  children: React.ReactNode;
  color?: "teal" | "orange";
  isNew?: boolean;
}) {
  const activeClass = color === "teal" 
    ? "bg-[#15C5C1] text-[#003B49] shadow-lg shadow-[#15C5C1]/20"
    : "bg-[#FF6B00] text-white shadow-lg shadow-[#FF6B00]/20";
  
  return (
    <button
      onClick={onClick}
      className={`relative px-6 py-3 rounded-xl font-bold transition-all ${
        active
          ? activeClass
          : "bg-[#072b33] text-slate-300 hover:bg-[#0a3d47] border border-white/10"
      }`}
    >
      {isNew && (
        <span className="absolute -top-2 -right-2 px-2 py-0.5 text-xs font-bold bg-[#FF6B00] text-white rounded-full animate-pulse">
          NEW
        </span>
      )}
      {children}
    </button>
  );
}

function TabPanel({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[#052B33]/50 rounded-2xl p-6 md:p-8 border border-white/5">
      {children}
    </div>
  );
}

function TabHeader({ 
  icon, 
  title, 
  description 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
}) {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-bold text-[#15C5C1] flex items-center gap-3 mb-2">
        <span className="text-[#FF6B00]">{icon}</span>
        {title}
      </h2>
      <p className="text-slate-400">{description}</p>
    </div>
  );
}

function ProUpgradeCard() {
  return (
    <div className="bg-gradient-to-r from-[#FF6B00]/20 to-[#FF6B00]/5 rounded-xl p-6 border border-[#FF6B00]/30 mb-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-[#FF6B00]/10 rounded-lg">
            <Lock className="w-5 h-5 text-[#FF6B00]" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#FF6B00]">
              PRO Content
            </h3>
            <p className="text-slate-300 text-sm mt-1">
              Unlock the complete R-PM Fundamentals series with detailed instructor notes, 
              exercises, and full methodology—perfect for small business training.
            </p>
          </div>
        </div>
        <Link
          href="/account/upgrade?plan=PRO"
          className="inline-flex items-center justify-center px-6 py-3 bg-[#FF6B00] hover:bg-[#FF9151] text-white font-bold rounded-lg transition-colors whitespace-nowrap"
        >
          Upgrade to PRO — $10/mo
        </Link>
      </div>
    </div>
  );
}

function ModuleGrid({ 
  modules, 
  userIsPro 
}: { 
  modules: Module[]; 
  userIsPro: boolean;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {modules.map((module) => (
        <ModuleCard key={module.id} module={module} userIsPro={userIsPro} />
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
          ? "bg-[#072b33]/50 border-white/5 opacity-60"
          : isLocked
          ? "bg-[#072b33] border-[#FF6B00]/20"
          : "bg-[#072b33] border-[#15C5C1]/20 hover:border-[#15C5C1]/40"
      }`}
    >
      {/* Badges Row */}
      <div className="flex flex-wrap gap-2 mb-3">
        {module.isPro && (
          <span className="px-2 py-0.5 text-xs font-bold bg-[#FF6B00]/20 text-[#FF6B00] rounded">
            PRO
          </span>
        )}
        {module.isComingSoon && (
          <span className="px-2 py-0.5 text-xs font-bold bg-slate-600/50 text-slate-400 rounded">
            Coming Soon
          </span>
        )}
        {!module.isPro && !module.isComingSoon && (
          <span className="px-2 py-0.5 text-xs font-bold bg-[#22C55E]/20 text-[#22C55E] rounded">
            FREE
          </span>
        )}
        {module.hasQuiz && (
          <span className="px-2 py-0.5 text-xs font-bold bg-amber-500/20 text-amber-400 rounded flex items-center gap-1">
            <Award className="w-3 h-3" /> Quiz + Badge
          </span>
        )}
      </div>

      {/* Title */}
      <h3 className="text-lg font-bold text-white mb-2">
        {module.title}
      </h3>

      {/* Description */}
      <p className="text-slate-400 text-sm mb-4 line-clamp-3">
        {module.description}
      </p>

      {/* Meta Info */}
      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mb-4">
        <span>⏱️ {module.duration}</span>
        {module.slides && <span>📊 {module.slides} slides</span>}
      </div>

      {/* Action Button */}
      {module.isComingSoon ? (
        <button 
          disabled 
          className="w-full py-2.5 px-4 bg-slate-700/50 text-slate-500 rounded-lg cursor-not-allowed font-semibold"
        >
          Coming Soon
        </button>
      ) : isLocked ? (
        <Link
          href="/account/upgrade?plan=PRO"
          className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-[#FF6B00]/20 hover:bg-[#FF6B00]/30 text-[#FF6B00] font-semibold rounded-lg transition-colors"
        >
          <Lock className="w-4 h-4" />
          Unlock with PRO
        </Link>
      ) : module.pageUrl ? (
        <Link
          href={module.pageUrl}
          className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-[#15C5C1] hover:bg-[#1ad4d0] text-[#003B49] font-bold rounded-lg transition-colors"
        >
          <Play className="w-4 h-4" />
          Start Learning
        </Link>
      ) : module.downloadUrl ? (
        <a
          href={module.downloadUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-[#15C5C1] hover:bg-[#1ad4d0] text-[#003B49] font-bold rounded-lg transition-colors"
        >
          <Download className="w-4 h-4" />
          Download
        </a>
      ) : null}

      {/* Lock Icon Overlay */}
      {isLocked && (
        <div className="absolute top-4 right-4">
          <Lock className="w-5 h-5 text-[#FF6B00]/50" />
        </div>
      )}
    </div>
  );
}