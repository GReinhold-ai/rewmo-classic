// src/lib/useAIChat.ts
// AI Chat hook with multi-provider support and transparency
import { useState, useCallback } from "react";
import { LLMProviderId, LLMProvider, getProviderById, getDefaultProvider } from "./llmProviders";

interface AIProviderInfo {
  id: string;
  name: string;
  company: string;
  country: string;
  countryFlag: string;
}

interface UseAIChatOptions {
  defaultProvider?: LLMProviderId;
  systemPrompt?: string;
  maxTokens?: number;
  isPro?: boolean;
}

interface UseAIChatReturn {
  ask: (prompt: string, overrideProvider?: LLMProviderId) => Promise<void>;
  loading: boolean;
  answer: string | null;
  error: string | null;
  provider: AIProviderInfo | null;
  disclaimer: string | null;
  setAnswer: (answer: string | null) => void;
  setProvider: (providerId: LLMProviderId) => void;
  currentProviderId: LLMProviderId;
  clearResponse: () => void;
}

export function useAIChat(options: UseAIChatOptions = {}): UseAIChatReturn {
  const {
    defaultProvider = "openai",
    systemPrompt,
    maxTokens = 400,
    isPro = false,
  } = options;

  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [provider, setProviderInfo] = useState<AIProviderInfo | null>(null);
  const [disclaimer, setDisclaimer] = useState<string | null>(null);
  const [currentProviderId, setCurrentProviderId] = useState<LLMProviderId>(defaultProvider);

  const setProvider = useCallback((providerId: LLMProviderId) => {
    const providerConfig = getProviderById(providerId);
    if (providerConfig) {
      // Check if provider requires Pro
      if (providerConfig.requiresPro && !isPro) {
        console.warn(`Provider ${providerId} requires Pro membership`);
        return;
      }
      setCurrentProviderId(providerId);
    }
  }, [isPro]);

  const clearResponse = useCallback(() => {
    setAnswer(null);
    setError(null);
    setProviderInfo(null);
    setDisclaimer(null);
  }, []);

  const ask = useCallback(async (prompt: string, overrideProvider?: LLMProviderId) => {
    setLoading(true);
    setError(null);
    setAnswer(null);
    setProviderInfo(null);
    setDisclaimer(null);

    const providerId = overrideProvider || currentProviderId;

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          provider: providerId,
          systemPrompt,
          maxTokens,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Request failed");
      }

      if (data.result) {
        setAnswer(data.result);
        setProviderInfo(data.provider || null);
        setDisclaimer(data.disclaimer || null);
      } else {
        setError(data.error || "No answer received");
      }
    } catch (err: any) {
      setError(err.message || "Failed to connect to AI service");
    } finally {
      setLoading(false);
    }
  }, [currentProviderId, systemPrompt, maxTokens]);

  return {
    ask,
    loading,
    answer,
    error,
    provider,
    disclaimer,
    setAnswer,
    setProvider,
    currentProviderId,
    clearResponse,
  };
}

// Hook for getting user's saved AI preference
export function useAIPreference() {
  const [preference, setPreference] = useState<LLMProviderId>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("rewmo_ai_provider") as LLMProviderId) || "openai";
    }
    return "openai";
  });

  const savePreference = useCallback((providerId: LLMProviderId) => {
    setPreference(providerId);
    if (typeof window !== "undefined") {
      localStorage.setItem("rewmo_ai_provider", providerId);
    }
  }, []);

  return { preference, savePreference };
}

export default useAIChat;
