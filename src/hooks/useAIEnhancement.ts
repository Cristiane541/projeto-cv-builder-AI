// src/hooks/useAIEnhancement.ts
import { useState, useCallback } from "react";
import type { AIEnhanceRequest, AIEnhanceResponse } from "../types/api.types";
import { enhanceText } from "../services/aiService";

/** Fallback local simples se a API falhar */
function localFallback(req: AIEnhanceRequest): AIEnhanceResponse {
  const txt = (req.text || "").trim().replace(/\s+/g, " ");
  const cap = txt ? txt[0].toUpperCase() + txt.slice(1) : "";

  const base: AIEnhanceResponse = {
    improvedText: cap,
    suggestions: [
      "Inclua impacto com números (%, R$, tempo, volume).",
      "Use verbos de ação no início das frases.",
      "Evite primeira pessoa; vá direto ao ponto.",
    ],
  };

  if (req.field === "experience") {
    base.suggestions?.unshift(
      "Especifique tecnologia, escala e resultado alcançado."
    );
  }
  return base;
}

export function useAIEnhancement() {
  const [isLoading, setIsLoading] = useState(false);
  const run = useCallback(async (req: AIEnhanceRequest) => {
    setIsLoading(true);
    try {
      return await enhanceText(req);
    } catch (e) {
      console.error("IA (Gemini) falhou, usando fallback local:", e);
      return localFallback(req);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { run, isLoading };
}
