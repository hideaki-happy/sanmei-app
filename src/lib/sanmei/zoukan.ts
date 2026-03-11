import type { ZoukanEntry } from "@/types/sanmei";

// 地支に対応するすべての蔵干を返す（空文字は「なし」）
export function getZoukanAll(shi: string): string[] {
  switch (shi) {
    case "子": return ["", "", "癸"];
    case "丑": return ["癸", "辛", "己"];
    case "寅": return ["戊", "丙", "甲"];
    case "卯": return ["", "", "乙"];
    case "辰": return ["乙", "癸", "戊"];
    case "巳": return ["戊", "庚", "丙"];
    case "午": return ["", "己", "丁"];
    case "未": return ["丁", "乙", "己"];
    case "申": return ["戊", "壬", "庚"];
    case "酉": return ["", "", "辛"];
    case "戌": return ["辛", "丁", "戊"];
    case "亥": return ["", "甲", "壬"];
    default: return ["", "", ""];
  }
}

// 生日から何日目かに応じてアクティブな蔵干を返す
export function getZoukan(shi: string, days: number): string {
  switch (shi) {
    case "子": return "癸";
    case "丑": return days >= 0 && days <= 9 ? "癸" : days > 9 && days <= 12 ? "辛" : "己";
    case "寅": return days >= 0 && days <= 7 ? "戊" : days > 7 && days <= 14 ? "丙" : "甲";
    case "卯": return "乙";
    case "辰": return days >= 0 && days <= 9 ? "乙" : days > 9 && days <= 12 ? "癸" : "戊";
    case "巳": return days >= 0 && days <= 5 ? "戊" : days > 5 && days <= 14 ? "庚" : "丙";
    case "午": return days >= 0 && days <= 19 ? "己" : "丁";
    case "未": return days >= 0 && days <= 9 ? "丁" : days > 9 && days <= 12 ? "乙" : "己";
    case "申": return days >= 0 && days <= 10 ? "戊" : days > 10 && days <= 13 ? "壬" : "庚";
    case "酉": return "辛";
    case "戌": return days >= 0 && days <= 9 ? "辛" : days > 9 && days <= 12 ? "丁" : "戊";
    case "亥": return days >= 0 && days <= 12 ? "甲" : "壬";
    default: return "";
  }
}

// 陰占の柱（蔵干リスト＋アクティブ判定）を構築
export function getInsenPillar(shi: string, days: number): ZoukanEntry[] {
  const all = getZoukanAll(shi);
  const active = getZoukan(shi, days);
  return all.map((kan) => ({ kan, isActive: kan !== "" && kan === active }));
}
