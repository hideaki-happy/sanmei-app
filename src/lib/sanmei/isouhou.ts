// 位相法の計算

// 地支間の基本位相（地支のみで判定）
function getBasicIsou(a: string, b: string): string {
  const table: Record<string, Record<string, string>> = {
    "子":{"丑":"支合","卯":"刑","未":"害","酉":"破","午":"冲"},
    "丑":{"子":"支合","辰":"破","午":"害","未":"刑・冲","戌":"刑"},
    "寅":{"巳":"害・刑","申":"刑・冲","亥":"支合"},
    "卯":{"子":"刑","辰":"害","午":"破","戌":"支合","酉":"冲"},
    "辰":{"丑":"破","卯":"害","辰":"自刑","酉":"支合","戌":"冲"},
    "巳":{"寅":"害・刑","申":"合・刑","亥":"冲"},
    "午":{"丑":"害","卯":"破","午":"自刑","未":"支合","子":"冲"},
    "未":{"子":"害","丑":"刑・冲","午":"支合","戌":"刑・破"},
    "申":{"寅":"刑・冲","巳":"合・刑","亥":"害"},
    "酉":{"子":"破","辰":"支合","戌":"害","酉":"自刑","卯":"冲"},
    "戌":{"丑":"刑","卯":"支合","未":"刑・破","酉":"害","辰":"冲"},
    "亥":{"寅":"支合","申":"害","亥":"自刑","巳":"冲"},
  };
  return table[a]?.[b] ?? "";
}

// 七殺（干の相剋）チェック
function checkNanasatsu(a: string, b: string): boolean {
  const pairs = [
    ["甲","戊"],["乙","己"],["丙","庚"],["丁","辛"],["戊","壬"],
    ["己","癸"],["庚","甲"],["辛","乙"],["壬","丙"],["癸","丁"],
  ];
  return pairs.some((p) => (p[0] === a && p[1] === b) || (p[0] === b && p[1] === a));
}

// 特殊位相（律音・天剋地冲・納音・半会・大半会・比和・冲）
function getSpecialIsou(kA: string, sA: string, kB: string, sB: string): string {
  if (kA === kB && sA === sB) return "律音";

  const opp: Record<string, string> = {
    "子":"午","丑":"未","寅":"申","卯":"酉","辰":"戌","巳":"亥",
    "午":"子","未":"丑","申":"寅","酉":"卯","戌":"辰","亥":"巳",
  };
  if (opp[sA] === sB) {
    if (kA === kB) return "納音";
    if (checkNanasatsu(kA, kB)) return "天剋地冲";
    return "冲";
  }

  const halfCombine: Record<string, string[]> = {
    "子":["辰","申"],"丑":["巳","酉"],"寅":["午","戌"],"卯":["未","亥"],
    "辰":["子","申"],"巳":["丑","酉"],"午":["寅","戌"],"未":["卯","亥"],
    "申":["子","辰"],"酉":["丑","巳"],"戌":["寅","午"],"亥":["卯","未"],
  };
  if (halfCombine[sA]?.includes(sB)) return kA === kB ? "大半会" : "半会";
  if (sA === sB) return "比和";
  return "";
}

// 位相法のメイン関数
export function checkIsouhou(kA: string, sA: string, kB: string, sB: string): string {
  const special = getSpecialIsou(kA, sA, kB, sB);
  const basic = getBasicIsou(sA, sB);

  const parts: string[] = [];
  if (special) parts.push(special);
  if (basic && special !== basic) {
    basic.split(/[・/]/).forEach((b) => {
      if (b && !parts.includes(b)) parts.push(b);
    });
  }

  // 「冲」を含む複合語がある場合は単独の「冲」を除去
  const hasCompoundChuu = parts.some((x) => x.length > 1 && x.includes("冲"));
  const filtered = hasCompoundChuu ? parts.filter((x) => x !== "冲") : parts;

  return filtered.join("・");
}
