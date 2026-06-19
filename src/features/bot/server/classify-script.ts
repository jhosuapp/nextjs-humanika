import {
  humanikaScripts,
  scriptsById,
  type HumanikaScript,
} from "@/src/features/bot/data/humanika-scripts.type";
import type { ConversationTurn } from "@/src/features/bot/data/bot-content";

/**
 * Clasificador de intención del avatar Humanika.
 *
 * Port de la lógica de `bot_merck/vph_videos/nlp_analyzer.py`:
 *  - GPT (OpenAI) como método principal.
 *  - Respaldo por palabras clave cuando GPT no está disponible o da baja confianza.
 *
 * Orden de prioridad (equivalente al esquema de restricciones del original):
 *  1. CTA explícito (afirmaciones / interés en demo) — sobre todo si el turno previo ofreció un siguiente paso.
 *  2. Manejadores especiales OT (clima, groserías, piropos, personal, IA, presentación, interrupción, cierre, charla).
 *  3. Fuera de alcance (OT9).
 *  4. Mejor guion temático (A–M) por coincidencia de keywords.
 *  5. Fallback → OT10 (no entendí).
 */

type ClassificationResult = {
  scriptId: string;
  confidence: number;
  reasonCode: string;
  reason: string;
  method: "gpt" | "keywords";
};

const GPT_CONFIDENCE_THRESHOLD = 0.5;
const FALLBACK_SCRIPT_ID = "OT10_NO_ENTENDI";
const OUT_OF_SCOPE_SCRIPT_ID = "OT9_FUERA_ALCANCE";
const CTA_SCRIPT_ID = "CTA_MAS_INFORMACION";
const OPENAI_URL = "https://api.openai.com/v1/chat/completions";

// Guiones "de cierre": terminan ofreciendo un siguiente paso ("¿te interesa...?").
// Tras mostrarlos, cualquier muestra de interés o elección que no encaje en un
// tema/OT distinto se encamina al CTA ("Excelente... contáctanos") en vez de a
// "no entendí". Regla de negocio: "te interesa conocer más..." → "excelente, contáctanos".
const CTA_LEADING_TERMINALS: ReadonlySet<string> = new Set([
  "M_EDUCACION",
  "M_INTEGRACIONES",
]);

/** Normaliza: minúsculas, sin acentos, sin signos, espacios colapsados. */
const normalize = (text: string): string =>
  text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const includesAny = (haystack: string, needles: string[]): boolean =>
  needles.some((n) => haystack.includes(normalize(n)));

// Afirmaciones cortas que, tras una oferta del avatar, llevan al CTA.
const SHORT_AFFIRMATIVES = [
  "si",
  "claro",
  "dale",
  "ok",
  "vale",
  "por supuesto",
  "me interesa",
  "obvio",
  "de una",
  "adelante",
];

// ---------------------------------------------------------------------------
// Clasificador por palabras clave (respaldo)
// ---------------------------------------------------------------------------

const detectCta = (
  normalized: string,
  previousScriptId: string | null,
): boolean => {
  const cta = scriptsById.get(CTA_SCRIPT_ID);
  if (cta && includesAny(normalized, cta.triggers)) return true;
  // "sí / claro / dale" solos solo cuentan como CTA si el avatar acaba de ofrecer algo.
  if (previousScriptId && SHORT_AFFIRMATIVES.includes(normalized)) return true;
  return false;
};

const scoreThematic = (normalized: string): { id: string; score: number } => {
  let best = { id: "", score: 0 };
  for (const script of humanikaScripts) {
    // El CTA y los OT no compiten como "tema"; se resuelven por sus propias reglas.
    if (script.group === "CTA" || script.group === "OT") continue;
    let score = 0;
    for (const keyword of script.keywords) {
      const normalizedKeyword = normalize(keyword);
      if (!normalizedKeyword) continue;
      if (normalized.includes(normalizedKeyword)) {
        // Las frases (varias palabras) pesan más que palabras sueltas.
        score += normalizedKeyword.includes(" ") ? 2 : 1;
      }
    }
    if (score > best.score) best = { id: script.id, score };
  }
  return best;
};

/** Devuelve el id de un OT especial si el mensaje encaja en uno; si no, null. */
const detectSpecialOt = (normalized: string): string | null => {
  // El orden importa: lo más específico primero.
  const ot = (id: string) => scriptsById.get(id);
  const matches = (id: string) => {
    const script = ot(id);
    return script ? includesAny(normalized, script.keywords) : false;
  };

  if (matches("OT12_PRECIO")) return "OT12_PRECIO";
  if (matches("OT5_CLIMA")) return "OT5_CLIMA";
  if (matches("OT6_GROSERIAS")) return "OT6_GROSERIAS";
  if (matches("OT7_PIROPOS")) return "OT7_PIROPOS";
  if (matches("OT8_IA")) return "OT8_IA";
  if (matches("OT2_PERSONAL")) return "OT2_PERSONAL";
  if (matches("OT1_PRESENTACION")) return "OT1_PRESENTACION";
  if (matches("OT4_INTERRUPCION")) return "OT4_INTERRUPCION";
  if (matches("OT11_CIERRE")) return "OT11_CIERRE";
  if (matches("OT3_CONVERSACION_GENERAL")) return "OT3_CONVERSACION_GENERAL";
  if (matches("OT9_FUERA_ALCANCE")) return OUT_OF_SCOPE_SCRIPT_ID;
  return null;
};

const classifyWithKeywords = (
  input: string,
  previousScriptId: string | null,
): ClassificationResult => {
  const normalized = normalize(input);

  if (!normalized) {
    return {
      scriptId: FALLBACK_SCRIPT_ID,
      confidence: 0.8,
      reasonCode: "LOW_CONFIDENCE",
      reason: "Mensaje vacío.",
      method: "keywords",
    };
  }

  // 1. CTA (máxima prioridad).
  if (detectCta(normalized, previousScriptId)) {
    return {
      scriptId: CTA_SCRIPT_ID,
      confidence: 0.9,
      reasonCode: "CTA",
      reason: "El usuario muestra interés o acepta la oferta del avatar.",
      method: "keywords",
    };
  }

  // 2. Manejadores especiales OT.
  const special = detectSpecialOt(normalized);

  // 3 / 4. Tema vs OT especial: gana el de mayor evidencia.
  const thematic = scoreThematic(normalized);
  if (thematic.score > 0 && (!special || thematic.score >= 2)) {
    return {
      scriptId: thematic.id,
      confidence: Math.min(0.6 + thematic.score * 0.1, 0.95),
      reasonCode: "IN_SCOPE_TOPIC",
      reason: "Coincidencia temática por palabras clave.",
      method: "keywords",
    };
  }

  if (special) {
    return {
      scriptId: special,
      confidence: 0.85,
      reasonCode:
        special === OUT_OF_SCOPE_SCRIPT_ID ? "OUT_OF_SCOPE" : "SPECIAL",
      reason: "Coincidencia con un manejador especial.",
      method: "keywords",
    };
  }

  // 5. Tras un guion de cierre ("¿te interesa...?"), el interés que no encajó en
  //    un tema/OT concreto se encamina al CTA en lugar de "no entendí".
  if (previousScriptId && CTA_LEADING_TERMINALS.has(previousScriptId)) {
    return {
      scriptId: CTA_SCRIPT_ID,
      confidence: 0.85,
      reasonCode: "CTA",
      reason:
        "Guion de cierre previo: el interés del usuario se encamina al CTA.",
      method: "keywords",
    };
  }

  // 6. Fallback.
  return {
    scriptId: FALLBACK_SCRIPT_ID,
    confidence: 0.8,
    reasonCode: "LOW_CONFIDENCE",
    reason: "Sin coincidencia clara; se pide reformular.",
    method: "keywords",
  };
};

// ---------------------------------------------------------------------------
// Clasificador GPT (principal)
// ---------------------------------------------------------------------------

const buildPrompt = (
  input: string,
  previous: HumanikaScript | null,
  history: ConversationTurn[],
): string => {
  const catalog = humanikaScripts
    .map((s) => `- ${s.id}: ${s.description}`)
    .join("\n");

  const context = previous
    ? `\nEl avatar acababa de mostrar el guion "${previous.id}", que terminaba ofreciendo un siguiente paso. Si el usuario responde afirmativamente (sí, claro, dale, cuéntame más, quiero una demo), normalmente corresponde CTA_MAS_INFORMACION o el siguiente tema ofrecido.\n`
    : "";

  const transcript =
    history.length > 0
      ? `\nHISTORIAL RECIENTE (del más antiguo al más reciente):\n${history
          .map((h) => `${h.role === "user" ? "Usuario" : "Avatar"}: ${h.text}`)
          .join("\n")}\n\nSi el mensaje actual es un seguimiento (usa "eso", "y de...", pronombres, o se apoya en lo ya dicho), usa el historial para resolver a qué tema se refiere y elige el guion temático (A–M) u OT correspondiente.\n`
      : "";

  return `Eres un clasificador de intención para el avatar conversacional de Humanika (una empresa que crea colaboradores digitales con IA).

Tu tarea es elegir exactamente UN script_id del catálogo según el mensaje del usuario.

CATÁLOGO:
${catalog}

REGLAS DE PRIORIDAD (en este orden):
1. Si el usuario acepta una oferta o pide profundizar/demo/contacto → CTA_MAS_INFORMACION.
2. Preguntas sobre el avatar: quién eres → OT1_PRESENTACION; datos personales → OT2_PERSONAL; qué IA usas → OT8_IA.
3. Precio / costo / tarifa / presupuesto / cotización (cuánto cuesta, cuánto vale, es caro) → OT12_PRECIO.
4. Clima → OT5_CLIMA; groserías → OT6_GROSERIAS; piropos → OT7_PIROPOS; despedida → OT11_CIERRE; charla casual → OT3_CONVERSACION_GENERAL; interrupción → OT4_INTERRUPCION.
5. Tema completamente ajeno a Humanika / colaboradores digitales / IA → OT9_FUERA_ALCANCE.
6. Mensaje incomprensible o ambiguo → OT10_NO_ENTENDI.
7. En cualquier otro caso, elige el mejor guion temático (A–M).
8. M_EDUCACION y M_INTEGRACIONES son guiones de cierre que terminan con "¿te interesa...?". Tras uno de ellos, si el usuario muestra interés, afirma o elige una de las opciones ofrecidas → CTA_MAS_INFORMACION.
${context}${transcript}
Debes elegir SOLO un script_id del catálogo.
${previous ? `Contexto: guion previo = ${previous.id}.` : ""}
Mensaje del usuario: "${input}"

reason_code permitidos: GREETING, IN_SCOPE_TOPIC, CTA, PRESENTATION, PERSONAL, AI_QUESTION, WEATHER, PROFANITY, COMPLIMENT, INTERRUPTION, SMALL_TALK, CLOSING, PRICE, OUT_OF_SCOPE, LOW_CONFIDENCE.

Responde SOLO en JSON estricto:
{"script_id":"...","confidence":0.00,"reason_code":"...","reason":"explicación breve"}`;
};

const classifyWithGpt = async (
  input: string,
  previousScriptId: string | null,
  history: ConversationTurn[],
): Promise<ClassificationResult | null> => {
  const apiKey = process.env.OPENAI_API_KEY;
  const useGpt = (process.env.USE_GPT_ANALYZER ?? "true").toLowerCase() === "true";
  if (!apiKey || !useGpt) return null;

  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
  const maxTokens = Number(process.env.MAX_TOKENS ?? 150);
  const previous = previousScriptId
    ? scriptsById.get(previousScriptId) ?? null
    : null;

  try {
    const upstream = await fetch(OPENAI_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        temperature: 0.1,
        max_tokens: maxTokens,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content:
              "Eres un clasificador experto. Respondes siempre en JSON válido.",
          },
          { role: "user", content: buildPrompt(input, previous, history) },
        ],
      }),
    });

    if (!upstream.ok) return null;

    const data = (await upstream.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const content = data.choices?.[0]?.message?.content;
    if (!content) return null;

    const parsed = JSON.parse(content) as {
      script_id?: string;
      confidence?: number;
      reason_code?: string;
      reason?: string;
    };

    const scriptId = parsed.script_id ?? "";
    if (!scriptsById.has(scriptId)) return null; // id inválido → cae al respaldo

    return {
      scriptId,
      confidence: Number(parsed.confidence ?? 0),
      reasonCode: parsed.reason_code ?? "IN_SCOPE_TOPIC",
      reason: parsed.reason ?? "",
      method: "gpt",
    };
  } catch {
    return null;
  }
};

// ---------------------------------------------------------------------------
// Entrada principal
// ---------------------------------------------------------------------------

const classifyScript = async (
  input: string,
  previousScriptId: string | null,
  history: ConversationTurn[] = [],
): Promise<ClassificationResult> => {
  const gpt = await classifyWithGpt(input, previousScriptId, history);
  if (gpt && gpt.confidence > GPT_CONFIDENCE_THRESHOLD) return gpt;
  return classifyWithKeywords(input, previousScriptId);
};

export { classifyScript, classifyWithKeywords };
export type { ClassificationResult };
