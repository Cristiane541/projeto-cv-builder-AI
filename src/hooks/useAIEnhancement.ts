// src/hooks/useAIEnhancement.ts
import { useState, useEffect } from "react";
import type { AIEnhanceRequest, AIEnhanceResponse } from "../types/api.types";
import { enhanceText } from "../services/aiService";
import { useDebounce } from "./useDebounce";

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

export function useAIEnhancement(field: AIEnhanceRequest["field"]) {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState<AIEnhanceResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const debouncedPrompt = useDebounce(prompt, 750);

  useEffect(() => {
    if (!debouncedPrompt) {
      setResult(null);
      return;
    }

    const runEnhancement = async () => {
      setIsLoading(true);
      const request: AIEnhanceRequest = { text: debouncedPrompt, field };
      try {
        const response = await enhanceText(request);
        setResult(response);
      } catch (e) {
        console.error("IA (Gemini) falhou, usando fallback local:", e);
        setResult(localFallback(request));
      } finally {
        setIsLoading(false);
      }
    };

    runEnhancement();
  }, [debouncedPrompt, field]);

  return { prompt, setPrompt, result, isLoading };
}
