// src/pages/ponder/index.tsx
// Ponder This listing page
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/lib/AuthProvider";
import PonderThisCard from "@/components/PonderThisCard";
import { 
  getAllPonders, 
  getFeaturedPonders, 
  getPondersByCategory,
  PonderCategory,
  PONDER_CATEGORIES 
} from "@/data/ponderThis";

export default function PonderIndexPage() {
  const { currentUser } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<PonderCategory | 'all'>('all');
  
  const allPonders = getAllPonders();
  const featuredPonders = getFeaturedPonders();
  
  const filteredPonders = selectedCategory === 'all' 
    ? allPonders 
    : getPondersByCategory(selectedCategory);

  const categories = Object.entries(PONDER_CATEGORIES) as [PonderCategory, typeof PONDER_CATEGORIES[PonderCategory]][];

  return (
    <div className="min-h-screen bg-[#003B49] text-white">
      <Head>
        <title>Ponder This | RewmoAI</title>
        <meta name="description" content="Bite-sized insights on AI, finance, and efficiency. Learn something new in 2 minutes." />
      </Head>

      <main className="max-w-5xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-[#FF9151] mb-4">
            🤔 Ponder This
          </h1>
          <p className="text-xl text-[#B6E7EB] max-w-2xl mx-auto">
            Bite-sized insights on AI, finance, and efficiency. 
            Learn something valuable in 2 minutes. Share to earn points.
          </p>
        </div>

        {/* Featured Section */}
        {selectedCategory === 'all' && featuredPonders.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-[#15C5C1] mb-6">⭐ Featured</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {featuredPonders.slice(0, 2).map((ponder) => (
                <Link key={ponder.id} href={`/ponder/${ponder.slug}`}>
                  <PonderThisCard ponder={ponder} />
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              selectedCategory === 'all'
                ? "bg-[#FF9151] text-[#003B49]"
                : "bg-white/10 text-white/70 hover:bg-white/20"
            }`}
          >
            All Topics
          </button>
          {categories.map(([id, category]) => (
            <button
              key={id}
              onClick={() => setSelectedCategory(id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition flex items-center gap-1 ${
                selectedCategory === id
                  ? "bg-[#FF9151] text-[#003B49]"
                  : "bg-white/10 text-white/70 hover:bg-white/20"
              }`}
            >
              <span>{category.emoji}</span>
              <span>{category.name}</span>
            </button>
          ))}
        </div>

        {/* Ponders Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {filteredPonders.map((ponder) => (
            <Link key={ponder.id} href={`/ponder/${ponder.slug}`}>
              <PonderThisCard ponder={ponder} />
            </Link>
          ))}
        </div>

        {filteredPonders.length === 0 && (
          <div className="text-center py-12">
            <p className="text-white/60">No ponders found in this category yet.</p>
          </div>
        )}

        {/* CTA */}
        <div className="mt-12 text-center bg-gradient-to-r from-[#FF9151]/20 to-[#15C5C1]/20 rounded-2xl p-8 border border-white/10">
          <h2 className="text-2xl font-bold text-white mb-4">
            Share Knowledge, Earn Rewards
          </h2>
          <p className="text-[#B6E7EB] mb-6 max-w-xl mx-auto">
            Every Ponder This you share includes your personal referral link. 
            When someone signs up through your share, you both earn points.
          </p>
          <div className="flex justify-center gap-4 text-sm">
            <div className="bg-white/10 rounded-lg px-4 py-2">
              <span className="text-[#FF9151] font-bold">+10 pts</span>
              <span className="text-white/60 ml-2">per share</span>
            </div>
            <div className="bg-white/10 rounded-lg px-4 py-2">
              <span className="text-[#15C5C1] font-bold">+100 pts</span>
              <span className="text-white/60 ml-2">per referral signup</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
