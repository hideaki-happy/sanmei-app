import type { HachimonConfig } from "@/types/sanmei";

// 八門法の配置を算出
export function getHachimonConfig(
  nichiKan: string,
  breakdown: Record<string, number>,
): HachimonConfig {
  const g = {
    moku: (breakdown["甲"] ?? 0) + (breakdown["乙"] ?? 0),
    ka:   (breakdown["丙"] ?? 0) + (breakdown["丁"] ?? 0),
    d:    (breakdown["戊"] ?? 0) + (breakdown["己"] ?? 0),
    gon:  (breakdown["庚"] ?? 0) + (breakdown["辛"] ?? 0),
    sui:  (breakdown["壬"] ?? 0) + (breakdown["癸"] ?? 0),
  };

  const phase =
    ["甲","乙"].includes(nichiKan) ? "木" :
    ["丙","丁"].includes(nichiKan) ? "火" :
    ["戊","己"].includes(nichiKan) ? "土" :
    ["庚","辛"].includes(nichiKan) ? "金" :
    ["壬","癸"].includes(nichiKan) ? "水" : "";

  switch (phase) {
    case "木": return { cL:"木",cV:g.moku, nL:"水",nV:g.sui, sL:"火",sV:g.ka, wL:"金",wV:g.gon, eL:"土",eV:g.d };
    case "火": return { cL:"火",cV:g.ka,   nL:"木",nV:g.moku, sL:"土",sV:g.d, wL:"水",wV:g.sui, eL:"金",eV:g.gon };
    case "土": return { cL:"土",cV:g.d,    nL:"火",nV:g.ka,  sL:"金",sV:g.gon, wL:"木",wV:g.moku, eL:"水",eV:g.sui };
    case "金": return { cL:"金",cV:g.gon,  nL:"土",nV:g.d,   sL:"水",sV:g.sui, wL:"火",wV:g.ka, eL:"木",eV:g.moku };
    case "水": return { cL:"水",cV:g.sui,  nL:"金",nV:g.gon, sL:"木",sV:g.moku, wL:"土",wV:g.d, eL:"火",eV:g.ka };
    default: return { cL:"",cV:0, nL:"",nV:0, sL:"",sV:0, wL:"",wV:0, eL:"",eV:0 };
  }
}
