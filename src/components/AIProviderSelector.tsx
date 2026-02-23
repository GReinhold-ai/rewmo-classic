// src/components/AIProviderSelector.tsx
// User-facing AI provider selector with transparency information
import { useState } from "react";
import { 
  LLMProviderId, 
  LLMProvider, 
  LLM_PROVIDERS, 
  getAvailableProviders,
  CHINESE_PROVIDERS_WARNING 
} from "@/lib/llmProviders";

interface AIProviderSelectorProps {
  selectedProvider: LLMProviderId;
  onSelect: (providerId: LLMProviderId) => void;
  isPro?: boolean;
  showDetails?: boolean;
  compact?: boolean;
}

export default function AIProviderSelector({
  selectedProvider,
  onSelect,
  isPro = false,
  showDetails = true,
  compact = false,
}: AIProviderSelectorProps) {
  const [showChinaWarning, setShowChinaWarning] = useState(false);
  const availableProviders = getAvailableProviders(isPro);
  const selectedConfig = LLM_PROVIDERS[selectedProvider];

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <label className="text-sm text-white/60">AI:</label>
        <select
          value={selectedProvider}
          onChange={(e) => onSelect(e.target.value as LLMProviderId)}
          className="bg-white/10 border border-white/20 rounded-lg px-3 py-1 text-sm text-white focus:ring-2 focus:ring-[#FF9151] focus:border-transparent"
        >
          {availableProviders.map((provider) => (
            <option key={provider.id} value={provider.id} className="bg-[#003B49] text-white">
              {provider.countryFlag} {provider.name} ({provider.company})
            </option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <div className="bg-[#072b33] rounded-xl border border-white/10 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-[#15C5C1]">🤖 Choose Your AI</h3>
        <button
          onClick={() => setShowChinaWarning(!showChinaWarning)}
          className="text-xs text-white/50 hover:text-white/80 underline"
        >
          Why no Chinese AI?
        </button>
      </div>

      {/* Provider Options */}
      <div className="grid gap-3 mb-4">
        {availableProviders.map((provider) => (
          <button
            key={provider.id}
            onClick={() => onSelect(provider.id)}
            className={`w-full text-left p-4 rounded-lg border transition ${
              selectedProvider === provider.id
                ? "border-[#FF9151] bg-[#FF9151]/10"
                : "border-white/10 bg-white/5 hover:bg-white/10"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{provider.countryFlag}</span>
                <div>
                  <div className="font-bold text-white">
                    {provider.name}
                    {provider.requiresPro && !isPro && (
                      <span className="ml-2 text-xs bg-[#FF9151]/20 text-[#FF9151] px-2 py-0.5 rounded">
                        PRO
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-white/60">
                    {provider.company} • {provider.country}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-xs px-2 py-1 rounded ${
                  provider.biasProfile === 'Minimal filtering' 
                    ? 'bg-green-500/20 text-green-400'
                    : provider.biasProfile === 'Cautious, balanced'
                    ? 'bg-blue-500/20 text-blue-400'
                    : provider.biasProfile === 'More neutral'
                    ? 'bg-teal-500/20 text-teal-400'
                    : 'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {provider.biasProfile}
                </div>
              </div>
            </div>

            {selectedProvider === provider.id && showDetails && (
              <div className="mt-3 pt-3 border-t border-white/10 text-sm">
                <div className="grid grid-cols-2 gap-2 text-white/70">
                  <div>
                    <span className="text-white/50">Censorship:</span>{" "}
                    <span className={
                      provider.censorshipLevel === 'Low' ? 'text-green-400' :
                      provider.censorshipLevel === 'Moderate' ? 'text-yellow-400' :
                      'text-red-400'
                    }>
                      {provider.censorshipLevel}
                    </span>
                  </div>
                  <div>
                    <span className="text-white/50">Privacy:</span>{" "}
                    <span className={
                      provider.privacyLevel === 'GDPR Protected' ? 'text-green-400' :
                      provider.privacyLevel === 'Strong' ? 'text-blue-400' :
                      'text-yellow-400'
                    }>
                      {provider.privacyLevel}
                    </span>
                  </div>
                  <div>
                    <span className="text-white/50">Faith Content:</span>{" "}
                    <span className={
                      provider.religiousTolerance === 'Respectful' ? 'text-green-400' :
                      provider.religiousTolerance === 'Neutral' ? 'text-blue-400' :
                      'text-yellow-400'
                    }>
                      {provider.religiousTolerance}
                    </span>
                  </div>
                  <div>
                    <span className="text-white/50">Data:</span>{" "}
                    <span className="text-white/70">{provider.dataJurisdiction}</span>
                  </div>
                </div>
                <p className="mt-2 text-white/50 text-xs">
                  {provider.biasDescription}
                </p>
              </div>
            )}
          </button>
        ))}

        {/* Locked providers for non-Pro */}
        {!isPro && Object.values(LLM_PROVIDERS)
          .filter(p => p.requiresPro && p.available)
          .map((provider) => (
            <div
              key={provider.id}
              className="w-full text-left p-4 rounded-lg border border-white/5 bg-white/5 opacity-50"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{provider.countryFlag}</span>
                  <div>
                    <div className="font-bold text-white/60">
                      {provider.name}
                      <span className="ml-2 text-xs bg-[#FF9151]/20 text-[#FF9151] px-2 py-0.5 rounded">
                        PRO
                      </span>
                    </div>
                    <div className="text-sm text-white/40">
                      {provider.company} • {provider.country}
                    </div>
                  </div>
                </div>
                <span className="text-2xl">🔒</span>
              </div>
            </div>
          ))
        }
      </div>

      {/* China Warning */}
      {showChinaWarning && (
        <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
          <div className="flex items-start gap-3">
            <span className="text-2xl">🇨🇳</span>
            <div>
              <h4 className="font-bold text-red-400 mb-2">
                Why We Don't Offer Chinese AI
              </h4>
              <p className="text-sm text-white/70 mb-2">
                {CHINESE_PROVIDERS_WARNING.reason}
              </p>
              <div className="text-xs text-white/50">
                <strong>Affected providers:</strong> {CHINESE_PROVIDERS_WARNING.providers.join(", ")}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Selected Provider Details */}
      {showDetails && selectedConfig && (
        <div className="mt-4 p-4 bg-white/5 rounded-lg">
          <h4 className="font-semibold text-[#FF9151] mb-2">
            {selectedConfig.countryFlag} {selectedConfig.name} Details
          </h4>
          <div className="text-sm text-white/70 space-y-2">
            <p><strong>Best for:</strong> {selectedConfig.bestFor.join(", ")}</p>
            <p><strong>Data storage:</strong> {selectedConfig.promptStoragePolicy}</p>
            <p><strong>Government access:</strong> {selectedConfig.governmentAccessRisk}</p>
          </div>
          <div className="mt-3">
            <h5 className="text-xs font-semibold text-white/50 mb-1">CONSIDERATIONS:</h5>
            <ul className="text-xs text-white/60 space-y-1">
              {selectedConfig.considerations.map((item, i) => (
                <li key={i}>• {item}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
