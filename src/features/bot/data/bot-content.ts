const VIDEOS = {
  defaultWait: "/videos/default-wait-answer.mp4",
  intro: "/videos/INTRONEW.mp4",
} as const;

type BotResponse = { videoUrl: string; text: string; scriptId?: string };
type ConversationTurn = { role: "user" | "bot"; text: string };
type BotApiPayload = {
  input: string;
  locale: string;
  previousScriptId?: string | null;
  /** Últimos turnos de la conversación (más antiguo → más reciente) para dar contexto al clasificador. */
  history?: ConversationTurn[];
};

const STATUS_KEYS = ["thinking", "analyzing", "preparing"] as const;

const INACTIVITY_MS = 5 * 60 * 1000;
const INACTIVITY_WARNING_MS = 4 * 60 * 1000 + 30 * 1000;

const MIN_INPUT_WORDS = 1;

// Margen entre que el micrófono queda cerrado y arranca un clip con sonido.
// Con audífonos Bluetooth, abrir el micrófono los pasa a «modo llamada» y volver
// al modo normal tarda; un clip que empieza en ese hueco suena muy fuerte, se
// corta y se traba. Con parlantes por cable basta con mucho menos: se ajusta con
// NEXT_PUBLIC_MIC_RELEASE_MS.
// Medido con audífonos Bluetooth en macOS: Chrome avisa que soltó el micrófono
// al instante, pero con 1 s de margen el clip aún arrancaba fuerte.
const DEFAULT_MIC_RELEASE_MS = 2000;

const parseMs = (raw: string | undefined, fallback: number): number => {
  if (raw === undefined || raw.trim() === "") return fallback;
  const value = Number(raw);
  return Number.isFinite(value) && value >= 0 ? value : fallback;
};

const MIC_RELEASE_MS = parseMs(process.env.NEXT_PUBLIC_MIC_RELEASE_MS, DEFAULT_MIC_RELEASE_MS);

// Script de cierre/despedida: al terminar su video, la conversación se reinicia.
const CLOSING_SCRIPT_ID = "OT11_CIERRE";

type StatusKey = (typeof STATUS_KEYS)[number];

export {
  VIDEOS,
  STATUS_KEYS,
  INACTIVITY_MS,
  INACTIVITY_WARNING_MS,
  MIN_INPUT_WORDS,
  MIC_RELEASE_MS,
  parseMs,
  CLOSING_SCRIPT_ID,
};
export type { BotResponse, BotApiPayload, ConversationTurn, StatusKey };
