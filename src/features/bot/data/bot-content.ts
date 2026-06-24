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

// Script de cierre/despedida: al terminar su video, la conversación se reinicia.
const CLOSING_SCRIPT_ID = "OT11_CIERRE";

type StatusKey = (typeof STATUS_KEYS)[number];

export {
  VIDEOS,
  STATUS_KEYS,
  INACTIVITY_MS,
  INACTIVITY_WARNING_MS,
  MIN_INPUT_WORDS,
  CLOSING_SCRIPT_ID,
};
export type { BotResponse, BotApiPayload, ConversationTurn, StatusKey };
