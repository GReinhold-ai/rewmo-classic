// src/pages/ponder/[slug].tsx
// Individual Ponder This page with full content and sharing
import { GetServerSideProps } from 'next';
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useAuth } from "@/lib/AuthProvider";
import PonderThisCard from "@/components/PonderThisCard";
import { getPonderBySlug, getAllPonders, PonderThis, PONDER_CATEGORIES } from "@/data/ponderThis";

interface PonderPageProps {
  ponder: PonderThis | null;
  relatedPonders: PonderThis[];
}

export default function PonderPage({ ponder, relatedPonders }: PonderPageProps) {
  const router = useRouter();
  const { currentUser } = useAuth();
  const { ref } = router.query;

  // Store referral code if present
  useEffect(() => {
    if (ref && typeof ref === 'string' && typeof window !== 'undefined') {
      localStorage.setItem('rewmo_ref_code', ref);
      console.log('Stored referral code:', ref);
    }
  }, [ref]);

  if (!ponder) {
    return (
      <div className="min-h-screen bg-[#003B49] text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#FF9151] mb-4">Ponder Not Found</h1>
          <Link href="/ponder" className="text-[#15C5C1] underline">
            ← Back to all Ponders
          </Link>
        </div>
      </div>
    );
  }

  const category = PONDER_CATEGORIES[ponder.category];
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://rewmo.ai';
  const referralCode = currentUser?.uid || '';
  const shareUrl = `${baseUrl}/ponder/${ponder.slug}${referralCode ? `?ref=${referralCode}` : ''}`;

  // Open Graph meta for social sharing
  const ogDescription = `${ponder.hook} — ${ponder.takeaway}`;

  return (
    <div className="min-h-screen bg-[#003B49] text-white">
      <Head>
        <title>{ponder.title} | Ponder This | RewmoAI</title>
        <meta name="description" content={ogDescription} />
        
        {/* Open Graph */}
        <meta property="og:title" content={`${ponder.title} | RewmoAI`} />
        <meta property="og:description" content={ogDescription} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={shareUrl} />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${ponder.title} | RewmoAI`} />
        <meta name="twitter:description" content={ogDescription} />
      </Head>

      <main className="max-w-3xl mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link href="/ponder" className="text-[#B6E7EB] hover:text-white text-sm flex items-center gap-2">
            ← Back to Ponder This
          </Link>
        </div>

        {/* Main Content */}
        <PonderThisCard ponder={ponder} showFull={true} />

        {/* Related Course CTA */}
        {ponder.relatedCourse && (
          <div className="mt-8 bg-[#15C5C1]/10 border border-[#15C5C1]/30 rounded-xl p-6">
            <h3 className="font-bold text-[#15C5C1] mb-2">📚 Want to Learn More?</h3>
            <p className="text-white/70 mb-4">
              This Ponder is part of our full course on this topic. Dive deeper and earn 200 points for completion.
            </p>
            <Link
              href={`/training/${ponder.relatedCourse}`}
              className="inline-block px-6 py-2 bg-[#15C5C1] text-[#003B49] font-bold rounded-lg hover:bg-[#1DD6D0] transition"
            >
              View Full Course →
            </Link>
          </div>
        )}

        {/* Related Ponders */}
        {relatedPonders.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-bold text-[#FF9151] mb-6">More to Ponder</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {relatedPonders.map((related) => (
                <Link key={related.id} href={`/ponder/${related.slug}`}>
                  <PonderThisCard ponder={related} />
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Referral Notice */}
        {ref && (
          <div className="mt-8 bg-[#FF9151]/10 border border-[#FF9151]/30 rounded-xl p-4 text-center">
            <p className="text-white/80">
              👋 You were referred by a RewmoAI member! 
              <Link href="/signup" className="text-[#FF9151] font-bold ml-2 underline">
                Sign up now
              </Link> and you'll both earn bonus points.
            </p>
          </div>
        )}

        {/* Share CTA */}
        <div className="mt-8 text-center">
          <p className="text-white/60 text-sm">
            Found this valuable? Share it with your network and earn {ponder.points} points.
          </p>
        </div>
      </main>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const slug = params?.slug as string;
  const ponder = getPonderBySlug(slug);
  
  if (!ponder) {
    return { props: { ponder: null, relatedPonders: [] } };
  }

  // Get related ponders (same category, excluding current)
  const allPonders = getAllPonders();
  const relatedPonders = allPonders
    .filter(p => p.category === ponder.category && p.id !== ponder.id)
    .slice(0, 2);

  return {
    props: {
      ponder,
      relatedPonders,
    },
  };
};
