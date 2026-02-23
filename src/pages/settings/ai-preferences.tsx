// src/pages/settings/ai-preferences.tsx
// User AI preferences settings page
import Head from "next/head";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/AuthProvider";
import SignInOverlay from "@/components/SignInOverlay";
import AIProviderSelector from "@/components/AIProviderSelector";
import { LLMProviderId, getProviderById } from "@/lib/llmProviders";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebaseClient";

export default function AIPreferencesPage() {
  const { currentUser } = useAuth();
  const [selectedProvider, setSelectedProvider] = useState<LLMProviderId>("openai");
  const [isPro, setIsPro] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load user preferences
  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    const loadPreferences = async () => {
      try {
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setSelectedProvider(data.aiProvider || "openai");
          setIsPro(data.plan === "PRO" || data.tier === "PRO" || data.subscriptionStatus === "active");
        }
      } catch (error) {
        console.error("Error loading preferences:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPreferences();
  }, [currentUser]);

  // Save preferences
  const handleSave = async () => {
    if (!currentUser) return;

    setSaving(true);
    try {
      await setDoc(
        doc(db, "users", currentUser.uid),
        { aiProvider: selectedProvider },
        { merge: true }
      );
      
      // Also save to localStorage for immediate use
      localStorage.setItem("rewmo_ai_provider", selectedProvider);
      
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error("Error saving preferences:", error);
    } finally {
      setSaving(false);
    }
  };

  const selectedConfig = getProviderById(selectedProvider);

  return (
    <div className="min-h-screen bg-[#003B49] text-white">
      <Head>
        <title>AI Preferences | Settings | RewmoAI</title>
      </Head>

      {!currentUser && (
        <SignInOverlay
          title="Sign in to customize your AI"
          description="Choose which AI assistant powers your RewmoAI experience."
        />
      )}

      <main className="max-w-3xl mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link href="/settings" className="text-[#B6E7EB] hover:text-white text-sm">
            ← Back to Settings
          </Link>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#FF9151] mb-2">AI Preferences</h1>
          <p className="text-[#B6E7EB]">
            Choose which AI assistant powers your RewmoAI experience. Different providers
            have different strengths, biases, and data policies.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-[#B6E7EB]">Loading preferences...</p>
          </div>
        ) : (
          <>
            {/* Pro Status */}
            {!isPro && (
              <div className="bg-[#FF9151]/10 border border-[#FF9151]/30 rounded-xl p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-[#FF9151]">Unlock More AI Options</h3>
                    <p className="text-sm text-white/70">
                      Pro members can choose from Claude, Grok, and Mistral in addition to GPT-4.
                    </p>
                  </div>
                  <Link
                    href="/account/upgrade"
                    className="px-4 py-2 bg-[#FF9151] text-[#003B49] font-bold rounded-lg hover:bg-[#FFA36C] transition text-sm"
                  >
                    Upgrade
                  </Link>
                </div>
              </div>
            )}

            {/* AI Selector */}
            <AIProviderSelector
              selectedProvider={selectedProvider}
              onSelect={setSelectedProvider}
              isPro={isPro}
              showDetails={true}
            />

            {/* Save Button */}
            <div className="mt-6 flex items-center gap-4">
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-3 bg-[#15C5C1] text-[#003B49] font-bold rounded-lg hover:bg-[#1DD6D0] transition disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Preferences"}
              </button>
              {saved && (
                <span className="text-green-400 text-sm">✓ Preferences saved!</span>
              )}
            </div>

            {/* Current Selection Summary */}
            {selectedConfig && (
              <div className="mt-8 bg-white/5 rounded-xl border border-white/10 p-6">
                <h3 className="font-bold text-[#15C5C1] mb-4">Your Current Selection</h3>
                <div className="flex items-center gap-4">
                  <span className="text-4xl">{selectedConfig.countryFlag}</span>
                  <div>
                    <div className="text-xl font-bold text-white">{selectedConfig.name}</div>
                    <div className="text-white/60">{selectedConfig.company} • {selectedConfig.country}</div>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="text-white/50">Bias</div>
                    <div className="text-white">{selectedConfig.biasProfile}</div>
                  </div>
                  <div>
                    <div className="text-white/50">Privacy</div>
                    <div className="text-white">{selectedConfig.privacyLevel}</div>
                  </div>
                  <div>
                    <div className="text-white/50">Faith Content</div>
                    <div className="text-white">{selectedConfig.religiousTolerance}</div>
                  </div>
                  <div>
                    <div className="text-white/50">Censorship</div>
                    <div className="text-white">{selectedConfig.censorshipLevel}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Learn More */}
            <div className="mt-8 text-center">
              <Link
                href="/ai-transparency"
                className="text-[#15C5C1] hover:text-[#1DD6D0] underline"
              >
                Learn more about AI bias and data privacy →
              </Link>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
