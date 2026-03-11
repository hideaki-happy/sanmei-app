import type { KanshiEntry } from "@/types/sanmei";
import { SETUIRI_DATA } from "./data/setuiri";
import { KANSHI_TABLE } from "./data/kanshiTable";

function getKanshi(id: number): KanshiEntry {
  const entry = KANSHI_TABLE[id];
  if (!entry) throw new Error(`Invalid kanshi id: ${id}`);
  return entry;
}

// 年干支を算出
export function calcNenKanshi(y: number, m: number, d: number): KanshiEntry {
  let k = ((y - 1873) + 10) % 60;
  if (k === 0) k = 60;
  // 1月、または2月の節入り前は前年の干支
  if (m === 1 || (m === 2 && d < SETUIRI_DATA[y][2])) {
    k = k === 1 ? 60 : k - 1;
  }
  return getKanshi(k);
}

// 月干支を算出
export function calcTsukiKanshi(y: number, m: number, d: number): KanshiEntry {
  const base = new Date(1873, 1, 1);
  const target = new Date(y, m - 1, 1);
  const dm =
    (target.getFullYear() - base.getFullYear()) * 12 +
    (target.getMonth() - base.getMonth());
  let k = (51 + dm) % 60;
  if (k === 0) k = 60;
  if (d < SETUIRI_DATA[y][m]) {
    k = k === 1 ? 60 : k - 1;
  }
  return getKanshi(k);
}

// 日干支を算出
export function calcNichiKanshi(y: number, m: number, d: number): KanshiEntry {
  let baseDate: Date;
  if (y <= 1910) baseDate = new Date(1873, 1, 1);
  else if (y <= 1950) baseDate = new Date(1907, 11, 1);
  else if (y <= 1990) baseDate = new Date(1947, 10, 1);
  else if (y <= 2030) baseDate = new Date(1987, 11, 1);
  else baseDate = new Date(2027, 10, 1);

  const diff = Math.floor(
    (new Date(y, m - 1, d).getTime() - baseDate.getTime()) / 86400000
  );
  let k = (21 + diff) % 60;
  if (k === 0) k = 60;
  return getKanshi(k);
}
