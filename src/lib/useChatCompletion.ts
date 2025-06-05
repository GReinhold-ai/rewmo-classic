// src/lib/useChatCompletion.ts
import { useState } from "react";

export function useChatCompletion() {
  const [response, setResponse] = useState<string>("");

  // This just returns a canned response for demo purposes.
  const sendPrompt = async (prompt: string) => {
    setResponse("AI (demo): " + prompt);
  };

  return { response, sendPrompt };
}
