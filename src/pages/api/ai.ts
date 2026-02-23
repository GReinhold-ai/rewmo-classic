// src/pages/api/ai.ts
// Multi-provider AI endpoint with transparency and user choice
import type { NextApiRequest, NextApiResponse } from "next";
import { OpenAI } from "openai";
import Anthropic from "@anthropic-ai/sdk";
import { LLMProviderId, LLM_PROVIDERS, getProviderById } from "@/lib/llmProviders";

// Initialize clients
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Mistral client (OpenAI-compatible API)
const mistral = new OpenAI({
  apiKey: process.env.MISTRAL_API_KEY,
  baseURL: "https://api.mistral.ai/v1",
});

// xAI Grok client (OpenAI-compatible API)
const grok = new OpenAI({
  apiKey: process.env.XAI_API_KEY,
  baseURL: "https://api.x.ai/v1",
});

interface AIRequest {
  prompt: string;
  provider?: LLMProviderId;
  systemPrompt?: string;
  maxTokens?: number;
}

interface AIResponse {
  result: string;
  provider: {
    id: string;
    name: string;
    company: string;
    country: string;
    countryFlag: string;
  };
  disclaimer: string;
}

async function callOpenAI(prompt: string, systemPrompt?: string, maxTokens = 400): Promise<string> {
  const messages: OpenAI.ChatCompletionMessageParam[] = [];
  
  if (systemPrompt) {
    messages.push({ role: "system", content: systemPrompt });
  }
  messages.push({ role: "user", content: prompt });

  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages,
    max_tokens: maxTokens,
  });

  return completion.choices[0].message.content || "";
}

async function callAnthropic(prompt: string, systemPrompt?: string, maxTokens = 400): Promise<string> {
  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: maxTokens,
    system: systemPrompt || "You are a helpful assistant.",
    messages: [{ role: "user", content: prompt }],
  });

  const textBlock = message.content.find(block => block.type === 'text');
  return textBlock ? textBlock.text : "";
}

async function callMistral(prompt: string, systemPrompt?: string, maxTokens = 400): Promise<string> {
  const messages: OpenAI.ChatCompletionMessageParam[] = [];
  
  if (systemPrompt) {
    messages.push({ role: "system", content: systemPrompt });
  }
  messages.push({ role: "user", content: prompt });

  const completion = await mistral.chat.completions.create({
    model: "mistral-large-latest",
    messages,
    max_tokens: maxTokens,
  });

  return completion.choices[0].message.content || "";
}

async function callGrok(prompt: string, systemPrompt?: string, maxTokens = 400): Promise<string> {
  const messages: OpenAI.ChatCompletionMessageParam[] = [];
  
  if (systemPrompt) {
    messages.push({ role: "system", content: systemPrompt });
  }
  messages.push({ role: "user", content: prompt });

  const completion = await grok.chat.completions.create({
    model: "grok-beta",
    messages,
    max_tokens: maxTokens,
  });

  return completion.choices[0].message.content || "";
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { prompt, provider = "openai", systemPrompt, maxTokens = 400 }: AIRequest = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "No prompt provided." });
  }

  // Validate provider
  const providerConfig = getProviderById(provider as LLMProviderId);
  if (!providerConfig) {
    return res.status(400).json({ error: `Invalid provider: ${provider}` });
  }

  if (!providerConfig.available) {
    return res.status(400).json({ error: `Provider ${provider} is not currently available.` });
  }

  try {
    let result: string;

    switch (provider) {
      case "openai":
        if (!process.env.OPENAI_API_KEY) {
          throw new Error("OpenAI API key not configured");
        }
        result = await callOpenAI(prompt, systemPrompt, maxTokens);
        break;

      case "anthropic":
        if (!process.env.ANTHROPIC_API_KEY) {
          throw new Error("Anthropic API key not configured");
        }
        result = await callAnthropic(prompt, systemPrompt, maxTokens);
        break;

      case "mistral":
        if (!process.env.MISTRAL_API_KEY) {
          throw new Error("Mistral API key not configured");
        }
        result = await callMistral(prompt, systemPrompt, maxTokens);
        break;

      case "grok":
        if (!process.env.XAI_API_KEY) {
          throw new Error("xAI API key not configured");
        }
        result = await callGrok(prompt, systemPrompt, maxTokens);
        break;

      default:
        throw new Error(`Unsupported provider: ${provider}`);
    }

    const response: AIResponse = {
      result,
      provider: {
        id: providerConfig.id,
        name: providerConfig.name,
        company: providerConfig.company,
        country: providerConfig.country,
        countryFlag: providerConfig.countryFlag,
      },
      disclaimer: `Response generated by ${providerConfig.name} (${providerConfig.company}, ${providerConfig.countryFlag} ${providerConfig.country}). ${providerConfig.promptStoragePolicy}`,
    };

    return res.status(200).json(response);

  } catch (error: any) {
    console.error(`[AI API] Error with provider ${provider}:`, error.message);
    return res.status(500).json({ 
      error: error.message || "AI request failed",
      provider: provider 
    });
  }
}
