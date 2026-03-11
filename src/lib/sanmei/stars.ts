import { SYUSEI_MAP, ZYUUSEI_MAP } from "./data/maps";

// 守護星を算出: 日干 × 対象天干
export function calcSyusei(nichiKan: string, targetKan: string): string {
  return SYUSEI_MAP[nichiKan]?.[targetKan] ?? "";
}

// 従星を算出: 日干 × 対象地支
export function calcZyuusei(nichiKan: string, targetShi: string): string {
  return ZYUUSEI_MAP[nichiKan]?.[targetShi] ?? "";
}
