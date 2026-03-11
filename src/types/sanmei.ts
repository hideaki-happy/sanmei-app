// 算命学の型定義

export interface BirthInfo {
  year: number;
  month: number;
  day: number;
  gender: "男性" | "女性";
  name?: string;
}

export interface KanshiEntry {
  kan: string;   // 天干
  shi: string;   // 地支
  tenshuu: string; // 天冲殺
  id: number;
}

export interface ZoukanEntry {
  kan: string;
  isActive: boolean;
}

export interface Pillar {
  k: string;      // 天干
  s: string;      // 地支
  id: number;
  zoukan: ZoukanEntry[];
}

export interface ShuseiCross {
  c: string; // 中央（自星）
  n: string; // 北（年干）
  s: string; // 南（月支）
  e: string; // 東（年支蔵干）
  w: string; // 西（日支蔵干）
}

export interface ZyuuseiSet {
  young: string; // 初年（年支）
  mid: string;   // 中年（月支）
  old: string;   // 晩年（日支）
}

export interface IsouSet {
  nenGetsu: string;
  getsuNichi: string;
  nenNichi: string;
}

export interface SuuriResult {
  total: number;
  breakdown: Record<string, number>;
}

export interface HachimonConfig {
  cL: string; cV: number; // 中央
  nL: string; nV: number; // 北（母）
  sL: string; sV: number; // 南（子）
  wL: string; wV: number; // 西（剋我）
  eL: string; eV: number; // 東（我剋）
}

export interface TaiunEntry {
  startYear: number;
  kanshi: string;
  syusei: string;
  zyuusei: string;
  tenchu: string;
  past: string;    // 日柱との位相
  current: string; // 月柱との位相
  future: string;  // 年柱との位相
}

export interface TaiunResult {
  startAge: number;
  direction: string;
  list: TaiunEntry[];
}

export interface NenunEntry {
  year: number;
  kanshi: string;
  syusei: string;
  zyuusei: string;
  tenchu: string;
  past: string;
  current: string;
  future: string;
}

export interface KanteiResult {
  name: string;
  birthday: string;
  gender: string;
  nen: Pillar;
  tsuki: Pillar;
  nichi: Pillar;
  tenshuu: string;
  shusei: ShuseiCross;
  zyuusei: ZyuuseiSet;
  suuriTotal: number;
  suuriBreakdown: Record<string, number>;
  hachimon: HachimonConfig;
  isou: IsouSet;
  taiun: TaiunResult;
  nenun: NenunEntry[];
}
