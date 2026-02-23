// src/components/PonderThisCard.tsx
// Shareable Ponder This card with PDF save and social sharing
import { useState } from "react";
import { useAuth } from "@/lib/AuthProvider";
import { PonderThis, PONDER_CATEGORIES } from "@/data/ponderThis";

interface PonderThisCardProps {
  ponder: PonderThis;
  onShare?: (ponder: PonderThis) => void;
  onSave?: (ponder: PonderThis) => void;
  showFull?: boolean;
}

export default function PonderThisCard({ 
  ponder, 
  onShare, 
  onSave,
  showFull = false 
}: PonderThisCardProps) {
  const { currentUser } = useAuth();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);

  const category = PONDER_CATEGORIES[ponder.category];
  
  // Get user's referral code
  const referralCode = currentUser?.uid || '';
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://rewmo.ai';
  const shareUrl = `${baseUrl}/ponder/${ponder.slug}?ref=${referralCode}`;

  // Generate share text
  const shareText = `${ponder.hook}\n\n💡 ${ponder.takeaway}\n\nRead more:`;

  // Handle PDF save
  const handleSavePDF = async () => {
    if (!currentUser) {
      alert('Please sign in to save PDFs');
      return;
    }

    setSaving(true);
    try {
      const response = await fetch('/api/ponder/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ponderId: ponder.id,
          userId: currentUser.uid,
          referralCode,
        }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `RewmoAI-Ponder-${ponder.slug}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
        
        if (onSave) onSave(ponder);
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Handle social sharing
  const handleShare = (platform: 'linkedin' | 'twitter' | 'copy') => {
    const encodedText = encodeURIComponent(shareText);
    const encodedUrl = encodeURIComponent(shareUrl);

    switch (platform) {
      case 'linkedin':
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
          '_blank',
          'width=600,height=400'
        );
        break;
      case 'twitter':
        window.open(
          `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
          '_blank',
          'width=600,height=400'
        );
        break;
      case 'copy':
        navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
        alert('Copied to clipboard!');
        break;
    }

    setShowShareOptions(false);
    if (onShare) onShare(ponder);
  };

  return (
    <div className={`bg-[#072b33] rounded-xl border border-white/10 overflow-hidden ${
      showFull ? '' : 'hover:border-[#FF9151]/50 transition'
    }`}>
      {/* Category Header */}
      <div className={`px-4 py-2 flex items-center justify-between ${
        category.color === 'blue' ? 'bg-blue-500/10' :
        category.color === 'green' ? 'bg-green-500/10' :
        category.color === 'yellow' ? 'bg-yellow-500/10' :
        category.color === 'orange' ? 'bg-orange-500/10' :
        category.color === 'purple' ? 'bg-purple-500/10' :
        'bg-red-500/10'
      }`}>
        <div className="flex items-center gap-2">
          <span>{category.emoji}</span>
          <span className={`text-sm font-medium ${
            category.color === 'blue' ? 'text-blue-400' :
            category.color === 'green' ? 'text-green-400' :
            category.color === 'yellow' ? 'text-yellow-400' :
            category.color === 'orange' ? 'text-orange-400' :
            category.color === 'purple' ? 'text-purple-400' :
            'text-red-400'
          }`}>
            {category.name}
          </span>
        </div>
        <span className="text-xs text-white/50">Ponder This</span>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-white mb-3">{ponder.title}</h3>
        
        {/* Hook */}
        <p className="text-lg text-[#FF9151] font-medium mb-4 italic">
          "{ponder.hook}"
        </p>

        {/* Full content if expanded */}
        {showFull && (
          <>
            <div className="text-white/80 mb-6 whitespace-pre-line">
              {ponder.content}
            </div>

            {/* Takeaway */}
            <div className="bg-[#15C5C1]/10 border border-[#15C5C1]/30 rounded-lg p-4 mb-4">
              <h4 className="text-sm font-bold text-[#15C5C1] mb-1">💡 Key Takeaway</h4>
              <p className="text-white/90">{ponder.takeaway}</p>
            </div>

            {/* Action Item */}
            {ponder.actionItem && (
              <div className="bg-[#FF9151]/10 border border-[#FF9151]/30 rounded-lg p-4 mb-4">
                <h4 className="text-sm font-bold text-[#FF9151] mb-1">🎯 Try This</h4>
                <p className="text-white/90">{ponder.actionItem}</p>
              </div>
            )}
          </>
        )}

        {/* Preview takeaway if not expanded */}
        {!showFull && (
          <p className="text-white/70 text-sm mb-4 line-clamp-2">
            {ponder.takeaway}
          </p>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <div className="flex items-center gap-2">
            {/* Save PDF Button */}
            <button
              onClick={handleSavePDF}
              disabled={saving}
              className="flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition"
            >
              {saving ? (
                <span className="text-white/70">Saving...</span>
              ) : saved ? (
                <span className="text-green-400">✓ Saved!</span>
              ) : (
                <>
                  <svg className="w-4 h-4 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="text-white/70">Save PDF</span>
                </>
              )}
            </button>

            {/* Share Button */}
            <div className="relative">
              <button
                onClick={() => setShowShareOptions(!showShareOptions)}
                className="flex items-center gap-2 px-3 py-2 bg-[#FF9151]/20 hover:bg-[#FF9151]/30 rounded-lg text-sm transition"
              >
                <svg className="w-4 h-4 text-[#FF9151]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                <span className="text-[#FF9151]">Share +{ponder.points} pts</span>
              </button>

              {/* Share Options Dropdown */}
              {showShareOptions && (
                <div className="absolute bottom-full left-0 mb-2 bg-[#003B49] border border-white/20 rounded-lg shadow-xl overflow-hidden z-10">
                  <button
                    onClick={() => handleShare('linkedin')}
                    className="flex items-center gap-2 px-4 py-2 hover:bg-white/10 w-full text-left"
                  >
                    <span>💼</span>
                    <span className="text-white">LinkedIn</span>
                  </button>
                  <button
                    onClick={() => handleShare('twitter')}
                    className="flex items-center gap-2 px-4 py-2 hover:bg-white/10 w-full text-left"
                  >
                    <span>𝕏</span>
                    <span className="text-white">X (Twitter)</span>
                  </button>
                  <button
                    onClick={() => handleShare('copy')}
                    className="flex items-center gap-2 px-4 py-2 hover:bg-white/10 w-full text-left"
                  >
                    <span>📋</span>
                    <span className="text-white">Copy Link</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Points indicator */}
          <div className="text-xs text-white/50">
            Share to earn points • Your referral link included
          </div>
        </div>
      </div>

      {/* Referral Footer (shown on full view) */}
      {showFull && currentUser && (
        <div className="px-6 py-3 bg-white/5 border-t border-white/10">
          <p className="text-xs text-white/50 text-center">
            🔗 Your referral link: <span className="text-[#15C5C1]">{shareUrl}</span>
          </p>
        </div>
      )}
    </div>
  );
}
