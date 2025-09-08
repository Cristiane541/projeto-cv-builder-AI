import { useState } from "react";
import type { AIEnhanceRequest, AIEnhanceResponse } from "../types/api.types";
import { enhanceText } from "../services/aiService";

export function useAIEnhancement() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  async function run(req: AIEnhanceRequest): Promise<AIEnhanceResponse> {
    setIsLoading(true);
    setError(undefined);
    try {
      const res = await enhanceText(req);
      if (res.error) {
        setError(res.error);
        console.error("[AI] erro:", res.error);
      }
      return res;
    } catch (e: any) {
      const msg = e?.message || "Falha ao melhorar texto.";
      setError(msg);
      console.error("[AI] exceção:", msg);
      return { improvedText: req.text, error: msg };
    } finally {
      setIsLoading(false);
    }
  }

  return { run, isLoading, error };
}
