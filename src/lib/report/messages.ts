import kanshiMessages from "@/lib/sanmei/data/kanshi-messages.json";
import syuseiMessages from "@/lib/sanmei/data/syusei-messages.json";
import unkiMessages from "@/lib/sanmei/data/unki-messages.json";

export interface KanshiMessage {
  kanshi: string;
  alias: string;
  message: string;
}

export interface SyuseiMessage {
  star: string;
  position: string;
  gender: string;
  message: string;
}

export interface UnkiMessage {
  star: string;
  longTerm: string;
  shortTerm: string;
}

export function getKanshiMessage(kanshiName: string): KanshiMessage | undefined {
  return (kanshiMessages as KanshiMessage[]).find((m) => m.kanshi === kanshiName);
}

/** 守護星×方位×性別でメッセージを検索。性別一致がなければ「共通」にフォールバック */
export function getSyuseiMessage(
  star: string,
  position: string,
  gender: string,
): SyuseiMessage | undefined {
  const msgs = syuseiMessages as SyuseiMessage[];
  return (
    msgs.find((m) => m.star === star && m.position === position && m.gender === gender) ??
    msgs.find((m) => m.star === star && m.position === position && m.gender === "共通")
  );
}

export function getUnkiMessage(star: string): UnkiMessage | undefined {
  return (unkiMessages as UnkiMessage[]).find((m) => m.star === star);
}
