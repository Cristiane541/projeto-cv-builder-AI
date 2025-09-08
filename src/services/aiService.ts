// 100% local — sem chamadas externas.
// Usa regras simples para “polir” o texto em PT-BR de forma determinística.

import type { AIEnhanceRequest, AIEnhanceResponse } from "../types/api.types";

export async function enhanceText(
  req: AIEnhanceRequest
): Promise<AIEnhanceResponse> {
  const text = (req.text || "").trim();
  if (!text) return { improvedText: "" };

  // pipeline de melhorias locais
  let out = text;
  out = normalizeWhitespace(out);
  out = fixCommonTyposPtBR(out);
  out = normalizeTechTerms(out);
  out = ensureSentenceCase(out);
  out = ensureEnding(out);

  // Ajustes leves por tipo de campo
  if (req.field === "summary") {
    out = compactSummary(out);
  } else {
    out = limitLines(out, 6); // evita descrições enormes
  }

  return { improvedText: out };
}

/* --------- helpers locais (sem IA) ---------- */

function normalizeWhitespace(s: string): string {
  return s
    .replace(/\s+/g, " ")
    .replace(/ ?([.,;:!?]) ?/g, "$1 ") // espaço depois de pontuação
    .replace(/\s+$/g, "")
    .trim();
}

function fixCommonTyposPtBR(s: string): string {
  // correções frequentes e padronizações simples
  const map: Array<[RegExp, string]> = [
    [/(^|[\s"'])voce($|[\s"'.!,?])/gi, "$1você$2"],
    [/(^|[\s"'])pra($|[\s"'.!,?])/gi, "$1para$2"],
    [/\barea\b/gi, "área"],
    [/\btecnologia\b/gi, "tecnologia"], // placeholder (mantém)
    [/\bfront ?end\b/gi, "front-end"],
    [/\bback ?end\b/gi, "back-end"],
    [/\bfull ?stack\b/gi, "full-stack"],
    [/\bjavascript\b/gi, "JavaScript"],
    [/\btypescript\b/gi, "TypeScript"],
    [/\breact ?native\b/gi, "React Native"],
    [/\breact\b/gi, "React"],
    [/\bnode\.?js\b/gi, "Node.js"],
    [/\bdocker\b/gi, "Docker"],
    [/\bgithub\b/gi, "GitHub"],
    [/\blinkedin\b/gi, "LinkedIn"],
    // erros comuns de digitação
    [/\btenhos\b/gi, "tenho"],
    [/\bvoltad[oa]s?\b/gi, "voltadas"],
  ];
  let out = s;
  for (const [re, rep] of map) out = out.replace(re, rep);
  // remover espaços antes de vírgulas/pontos
  out = out.replace(/\s+([.,;:!?])/g, "$1");
  return out.trim();
}

function normalizeTechTerms(s: string): string {
  // padroniza alguns termos de CV
  const map: Array<[RegExp, string]> = [
    [/\bpo\b/gi, "PO"],
    [/\bpm\b/gi, "PM"],
    [/\bsql\b/gi, "SQL"],
    [/\bapi\b/gi, "API"],
    [/\brest\b/gi, "REST"],
    [/\bgraphql\b/gi, "GraphQL"],
    [/\baws\b/gi, "AWS"],
    [/\bazure\b/gi, "Azure"],
    [/\bgcp\b/gi, "GCP"],
  ];
  let out = s;
  for (const [re, rep] of map) out = out.replace(re, rep);
  return out;
}

function ensureSentenceCase(s: string): string {
  // coloca a 1ª letra de cada frase em maiúscula, preservando siglas comuns
  const sentences = s
    .split(/([.!?])\s+/)
    .reduce<string[]>((acc, part, idx, arr) => {
      if (idx % 2 === 0) {
        const end = arr[idx + 1] || "";
        const trimmed = part.trim();
        if (!trimmed) return acc;
        const first = trimmed.charAt(0).toUpperCase();
        const rest = trimmed.slice(1);
        acc.push(first + rest + (end ? end + " " : ""));
      }
      return acc;
    }, []);
  const out = sentences.join("").trim();
  return out || s;
}

function ensureEnding(s: string): string {
  // termina com ponto final quando for uma única frase
  if (!/[.!?]\s*$/.test(s)) return s + ".";
  return s;
}

function compactSummary(s: string): string {
  // remove frases redundantes muito curtas
  let out = s.replace(
    /\b(Atualmente|No momento|Busco|Estou|Tenho)\b\s+/gi,
    (m) => m.toLowerCase()
  );
  out = out.replace(/\s{2,}/g, " ").trim();
  return out;
}

function limitLines(s: string, maxLines: number): string {
  const lines = s.split(/\n+/);
  if (lines.length <= maxLines) return s;
  return lines.slice(0, maxLines).join("\n");
}
