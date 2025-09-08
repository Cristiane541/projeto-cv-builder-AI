// src/services/aiService.ts

export type AIEnhanceField = "summary" | "experience";

export type AIEnhanceRequest = {
  field: AIEnhanceField;
  text: string;
  context?: string;
  meta?: {
    role?: string;
    company?: string;
    period?: string;
  };
};

export type AIEnhanceResponse = {
  improvedText: string;
  suggestions?: string[];
};

import { getActiveGeminiKey } from "../utils/settings";

const MODEL = "gemini-2.0-flash";
const GEMINI_ENDPOINT = (apiKey: string) =>
  `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`;

const GENERATION_CONFIG = {
  temperature: 0.35,
  topK: 40,
  topP: 0.95,
  maxOutputTokens: 600,
};

export function buildGeminiPrompt(req: AIEnhanceRequest): string {
  const TEXT = (req.text || "").trim();
  const CONTEXT = (req.context || "").trim();

  const commonGuard = `Regras gerais:
- Escreva em PT-BR (Brasil).
- Não invente fatos nem certificados.
- Seja específico e objetivo.`;

  if (req.field === "summary") {
    return `
${commonGuard}

Você é um redator de currículos (BR-PT) especialista em torná-los objetivos e competitivos para vagas de tecnologia.

TAREFA
- Reescreva o RESUMO PROFISSIONAL abaixo para ficar claro, direto, convincente e alinhado ao objetivo de carreira.
- Mantenha 450–500 caracteres (2–3 frases).
- Sem clichês vazios (“proativo”, “dinâmico”), sem fluff, sem inventar fatos.
- Destaque impacto, tecnologias e diferenciais. Use verbos de ação.
- Se houver CONTEXTO da vaga, priorize termos e requisitos compatíveis.

ENTRADA (do usuário)
<<<RESUMO>>>
${TEXT}
</RESUMO>

<<<CONTEXTO (opcional)>>>
${CONTEXT}
</CONTEXTO>

SAÍDA
- Apenas o texto final do resumo, em PT-BR.
- 1 parágrafo, 450–500 caracteres.
`.trim();
  }

  // EXPERIENCE
  const role = req.meta?.role ?? "";
  const company = req.meta?.company ?? "";
  const period = req.meta?.period ?? "";

  return `
${commonGuard}

Você é um redator de currículos (BR-PT) especializado em transformar descrições de experiência em bullets de alto impacto.

TAREFA
- Reescreva a EXPERIÊNCIA abaixo em 3 a 5 bullets no formato:
  • Verbo no passado + ação + tecnologia(s) + impacto/resultado (números, %, tempo, R$ quando possível).
- Use o método STAR (Situação, Tarefa, Ação, Resultado) de forma concisa.
- Evite “responsável por”. Comece cada bullet com verbo forte.
- Não invente fatos; caso não existam métricas, foque em escopo/volume (ex.: “+X telas”, “Y usuários”, “Z microserviços”).

ENTRADA
<<<CARGO | EMPRESA | PERÍODO>>>
${role} | ${company} | ${period}
</CABECALHO>

<<<DESCRIÇÃO ORIGINAL>>>
${TEXT}
</DESCRIÇÃO ORIGINAL>

<<<ALINHAMENTO À VAGA (opcional)>>>
${CONTEXT}
</ALINHAMENTO>

SAÍDA
- Lista de bullets (• ...), 3–5 itens, uma linha por bullet, PT-BR.
`.trim();
}

function extractTextFromCandidates(json: any): string {
  try {
    const parts = json?.candidates?.[0]?.content?.parts;
    if (!Array.isArray(parts)) return "";
    const joined = parts
      .map((p: any) => (typeof p?.text === "string" ? p.text : ""))
      .join("\n")
      .trim();

    // Remove cercas de código caso o modelo retorne em bloco
    return joined.replace(/^```[\s\S]*?\n|```$/g, "").trim();
  } catch {
    return "";
  }
}

function localFallback(req: AIEnhanceRequest): AIEnhanceResponse {
  const txt = (req.text || "").trim();
  const cap = txt
    ? txt[0].toUpperCase() + txt.slice(1)
    : "Texto não informado.";

  const base: AIEnhanceResponse = {
    improvedText: req.field === "experience" ? `• ${cap}` : cap,
    suggestions: [
      "Inclua impacto com números (%, R$, tempo, volume).",
      "Use verbos de ação no início dos bullets/frases.",
      "Evite 'responsável por'; descreva a ação e o resultado.",
    ],
  };

  if (req.field === "experience") {
    base.suggestions?.unshift(
      "Modele no estilo STAR (Situação, Tarefa, Ação, Resultado)."
    );
  }

  return base;
}

export async function enhanceText(
  req: AIEnhanceRequest
): Promise<AIEnhanceResponse> {
  const apiKey = getActiveGeminiKey?.() || "";

  // Sem chave → fallback local
  if (!apiKey) return localFallback(req);

  const prompt = buildGeminiPrompt(req);

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20_000); // 20s

    const resp = await fetch(GEMINI_ENDPOINT(apiKey), {
      method: "POST",
      signal: controller.signal,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: GENERATION_CONFIG,
      }),
    });

    clearTimeout(timeout);

    if (!resp.ok) {
      // status 429/4xx/5xx → fallback
      return localFallback(req);
    }

    const data = await resp.json();
    const text = extractTextFromCandidates(data);
    const improved = text || req.text || "";

    // Se o modelo retornar demais, dá uma leve aparada
    const cleaned =
      req.field === "summary" ? improved.trim().slice(0, 700) : improved.trim();

    // Sugestões úteis adicionais
    const suggestions =
      req.field === "summary"
        ? [
            "Mantenha ~500 caracteres e destaque 2–3 diferenciais técnicos.",
            "Evite adjetivos genéricos; prefira resultados e tecnologias.",
          ]
        : [
            "Cada bullet: Verbo + Ação + Tecnologia + Resultado.",
            "Inclua volume: nº de usuários, telas, endpoints, etc.",
          ];

    return { improvedText: cleaned, suggestions };
  } catch (e) {
    // Timeout / rede / parse → fallback
    return localFallback(req);
  }
}

/* ========================================================================
 * Exemplo de uso:
 * ----------------------------------------------------------------------
 * const res = await enhanceText({
 *   field: "experience",
 *   text: exp.description,
 *   context: "Vaga foco React + TypeScript em e-commerce",
 *   meta: { role: exp.role, company: exp.company, period: exp.period }
 * });
 * actions.updateExperience(exp.id, { description: res.improvedText });
 * ====================================================================== */
