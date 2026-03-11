import type { KanteiResult } from "@/types/sanmei";
import { SETUIRI_DATA } from "./data/setuiri";
import { calcNenKanshi, calcTsukiKanshi, calcNichiKanshi } from "./kanshi";
import { getInsenPillar, getZoukan } from "./zoukan";
import { calcSyusei, calcZyuusei } from "./stars";
import { calcSuurihou } from "./suurihou";
import { checkIsouhou } from "./isouhou";
import { getHachimonConfig } from "./hachimon";
import { calcTaiun } from "./taiun";

export interface KanteiInput {
  year: string | number;
  month: string | number;
  day: string | number;
  gender: string;
  name?: string;
}

// メイン鑑定処理
export function processKantei(data: KanteiInput): KanteiResult | null {
  const y = parseInt(String(data.year));
  const m = parseInt(String(data.month));
  const d = parseInt(String(data.day));
  const name = data.name || "（未入力）";
  const gender = data.gender;

  if (!SETUIRI_DATA[y]) return null;

  const nen   = calcNenKanshi(y, m, d);
  const tsuki = calcTsukiKanshi(y, m, d);
  const nichi = calcNichiKanshi(y, m, d);

  const days = d - SETUIRI_DATA[y][m];

  const sr  = calcSuurihou(nichi.kan, tsuki.kan, nen.kan, nichi.shi, tsuki.shi, nen.shi);
  const tai = calcTaiun(y, m, d, gender, nen, tsuki, nichi);
  const hm  = getHachimonConfig(nichi.kan, sr.breakdown);

  return {
    name,
    birthday: `${y}年${m}月${d}日`,
    gender,
    nen:   { k: nen.kan,   s: nen.shi,   id: nen.id,   zoukan: getInsenPillar(nen.shi,   days) },
    tsuki: { k: tsuki.kan, s: tsuki.shi, id: tsuki.id, zoukan: getInsenPillar(tsuki.shi, days) },
    nichi: { k: nichi.kan, s: nichi.shi, id: nichi.id, zoukan: getInsenPillar(nichi.shi, days) },
    tenshuu: nichi.tenshuu,
    shusei: {
      c: calcSyusei(nichi.kan, getZoukan(tsuki.shi, days)),
      n: calcSyusei(nichi.kan, nen.kan),
      s: calcSyusei(nichi.kan, tsuki.kan),
      e: calcSyusei(nichi.kan, getZoukan(nen.shi, days)),
      w: calcSyusei(nichi.kan, getZoukan(nichi.shi, days)),
    },
    zyuusei: {
      young: calcZyuusei(nichi.kan, nen.shi),
      mid:   calcZyuusei(nichi.kan, tsuki.shi),
      old:   calcZyuusei(nichi.kan, nichi.shi),
    },
    suuriTotal:     sr.total,
    suuriBreakdown: sr.breakdown,
    hachimon: hm,
    isou: {
      nenGetsu:  checkIsouhou(nen.kan, nen.shi, tsuki.kan, tsuki.shi),
      getsuNichi: checkIsouhou(tsuki.kan, tsuki.shi, nichi.kan, nichi.shi),
      nenNichi:  checkIsouhou(nen.kan, nen.shi, nichi.kan, nichi.shi),
    },
    taiun: tai,
    nenun: calcNenun(y, nichi.kan, nichi.shi, tsuki.kan, tsuki.shi, nen.kan, nen.shi, nichi.tenshuu),
  };
}

// 年運を計算（生年から120年分）
function calcNenun(
  birthYear: number,
  nichiKan: string, nichiShi: string,
  tsukiKan: string, tsukiShi: string,
  nenKan: string,   nenShi: string,
  tenshuu: string,
) {
  const list = [];
  for (let i = 0; i < 120; i++) {
    const ty = birthYear + i;
    if (!SETUIRI_DATA[ty]) continue;
    const yk = calcNenKanshi(ty, 4, 1);
    list.push({
      year: ty,
      kanshi: yk.kan + yk.shi,
      syusei:  calcSyusei(nichiKan, yk.kan),
      zyuusei: calcZyuusei(nichiKan, yk.shi),
      tenchu: tenshuu.includes(yk.shi) ? "★" : "",
      past:    checkIsouhou(yk.kan, yk.shi, nichiKan, nichiShi),
      current: checkIsouhou(yk.kan, yk.shi, tsukiKan, tsukiShi),
      future:  checkIsouhou(yk.kan, yk.shi, nenKan,   nenShi),
    });
  }
  return list;
}

// 個別ロジックの再エクスポート（年運など外部利用向け）
export { calcNenKanshi, calcSyusei, calcZyuusei, checkIsouhou };
export { SETUIRI_DATA } from "./data/setuiri";
