import type { SuuriResult } from "@/types/sanmei";
import { SUURI_POINTS_TABLE, KAN_INDEX, KAN_LIST } from "./data/maps";
import { getZoukanAll } from "./zoukan";

// 数理法を計算
export function calcSuurihou(
  nichiKan: string,
  tsukiKan: string,
  nenKan: string,
  nichiShi: string,
  tsukiShi: string,
  nenShi: string,
): SuuriResult {
  const count = Array(10).fill(0) as number[];

  // 三柱の天干・地支（蔵干含む）をカウント
  [
    { kan: nichiKan, shi: nichiShi },
    { kan: tsukiKan, shi: tsukiShi },
    { kan: nenKan,   shi: nenShi   },
  ].forEach(({ kan, shi }) => {
    if (KAN_INDEX[kan] !== undefined) count[KAN_INDEX[kan]]++;
    getZoukanAll(shi).forEach((h) => {
      if (h && KAN_INDEX[h] !== undefined) count[KAN_INDEX[h]]++;
    });
  });

  let total = 0;
  const breakdown: Record<string, number> = {};

  KAN_LIST.forEach((k, i) => {
    const pts =
      (SUURI_POINTS_TABLE[nichiShi][i] +
       SUURI_POINTS_TABLE[tsukiShi][i] +
       SUURI_POINTS_TABLE[nenShi][i]) *
      count[i];
    breakdown[k] = pts;
    total += pts;
  });

  return { total, breakdown };
}
