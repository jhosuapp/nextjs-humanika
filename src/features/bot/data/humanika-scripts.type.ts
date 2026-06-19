import scriptsJson from "@/src/features/bot/data/humanika-scripts.json";

/**
 * Un guion del catálogo Humanika. El catálogo es la fuente de verdad del
 * contenido del avatar (equivale a lo que iría en una BD); se consume
 * server-side desde el clasificador y el API route, no desde componentes.
 */
type HumanikaScript = {
  /** Identificador único, ej. "B1_COLABORADOR_DIGITAL". También nombra el video: /videos/<id>.mp4 */
  id: string;
  /** Grupo temático: A–M para temas, OT para manejo especial, CTA para el llamado a la acción */
  group: string;
  /** Guion completo que "habla" el avatar (texto mostrado en el chat) */
  text: string;
  /** Cuándo usar este guion — alimenta el prompt de GPT */
  description: string;
  /** Palabras/frases clave para el clasificador de respaldo */
  keywords: string[];
  /** Frases activadoras explícitas (solo CTA_MAS_INFORMACION las usa) */
  triggers: string[];
};

const humanikaScripts = scriptsJson as ReadonlyArray<HumanikaScript>;

const scriptsById: ReadonlyMap<string, HumanikaScript> = new Map(
  humanikaScripts.map((script) => [script.id, script]),
);

const getScriptById = (id: string): HumanikaScript | undefined =>
  scriptsById.get(id);

export { humanikaScripts, scriptsById, getScriptById };
export type { HumanikaScript };
