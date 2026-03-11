import type { KanshiEntry, TaiunResult } from "@/types/sanmei";
import { SETUIRI_DATA } from "./data/setuiri";
import { KANSHI_TABLE } from "./data/kanshiTable";
import { calcSyusei, calcZyuusei } from "./stars";
import { checkIsouhou } from "./isouhou";

// 大運を計算
export function calcTaiun(
  y: number,
  m: number,
  d: number,
  gender: string,
  nen: KanshiEntry,
  tsuki: KanshiEntry,
  nichi: KanshiEntry,
): TaiunResult {
  const yangKan = ["甲","丙","戊","庚","壬"];
  const isYangYear = yangKan.includes(nen.kan);
  // 男性＋陽年 or 女性＋陰年 → 順回り
  const isForward = gender === "男性" ? isYangYear : !isYangYear;

  const setuiriDay = SETUIRI_DATA[y][m];
  let dayDiff = 0;

  if (isForward) {
    if (d < setuiriDay) {
      dayDiff = setuiriDay - d;
    } else {
      const nextDate = new Date(y, m, 1);
      const nextSetuiri = SETUIRI_DATA[nextDate.getFullYear()]?.[nextDate.getMonth() + 1] ?? setuiriDay;
      dayDiff = new Date(y, m, 0).getDate() - d + nextSetuiri;
    }
  } else {
    if (d > setuiriDay) {
      dayDiff = d - setuiriDay;
    } else {
      const prevDate = new Date(y, m - 2, 1);
      const prevSetuiri = SETUIRI_DATA[prevDate.getFullYear()]?.[prevDate.getMonth() + 1] ?? setuiriDay;
      dayDiff = new Date(prevDate.getFullYear(), prevDate.getMonth() + 1, 0).getDate() - prevSetuiri + d;
    }
  }

  const startAge = Math.round(dayDiff / 3) || 1;
  const list = [];
  let currentId = tsuki.id;

  for (let i = 0; i < 12; i++) {
    currentId = isForward ? (currentId % 60) + 1 : currentId === 1 ? 60 : currentId - 1;
    const ks = KANSHI_TABLE[currentId]!;
    list.push({
      startYear: y + startAge + i * 10,
      kanshi: ks.kan + ks.shi,
      syusei: calcSyusei(nichi.kan, ks.kan),
      zyuusei: calcZyuusei(nichi.kan, ks.shi),
      tenchu: nichi.tenshuu.includes(ks.shi) ? "★" : "",
      past:    checkIsouhou(ks.kan, ks.shi, nichi.kan, nichi.shi),
      current: checkIsouhou(ks.kan, ks.shi, tsuki.kan, tsuki.shi),
      future:  checkIsouhou(ks.kan, ks.shi, nen.kan, nen.shi),
    });
  }

  return { startAge, direction: isForward ? "順回り" : "逆回り", list };
}
