import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import type { KanteiResult } from "@/types/sanmei";
import { getKanshiMessage, getSyuseiMessage, getUnkiMessage } from "@/lib/report/messages";
import { getGogyouTheme } from "@/lib/report/gogyouTheme";

export function registerFonts(regularSrc: string, boldSrc: string) {
  Font.register({
    family: "NotoSerifJP",
    fonts: [
      { src: regularSrc, fontWeight: 400 },
      { src: boldSrc,    fontWeight: 700 },
    ],
  });
}

// カラーに依存しない固定スタイル
const s = StyleSheet.create({
  page: {
    fontFamily: "NotoSerifJP",
    padding: 24,
    fontSize: 8,
    color: "#1C2518",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 6,
    marginBottom: 10,
    borderBottomWidth: 1,
  },
  infoName: { fontSize: 10 },
  infoBirth: { fontSize: 8, color: "#6B7280" },
  sectionLabel: {
    fontSize: 9,
    fontWeight: 700,
    color: "#fff",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 3,
    alignSelf: "flex-start",
    letterSpacing: 2,
    marginBottom: 6,
  },
  sectionBox: {
    borderWidth: 1,
    borderRadius: 5,
    padding: 8,
    marginBottom: 8,
  },
  essenceName: { fontSize: 12, fontWeight: 700 },
  essenceKanshi: { fontSize: 10, fontWeight: 700, marginLeft: 4 },
  essenceBadge: {
    fontSize: 8,
    fontWeight: 700,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 3,
    marginLeft: 4,
  },
  essenceMsg: { fontSize: 8, lineHeight: 1.6, color: "#374151", marginTop: 4 },
  tableHeaderRow: {
    flexDirection: "row",
    paddingVertical: 3,
    paddingHorizontal: 2,
    borderBottomWidth: 1,
  },
  tableHeaderText: { fontSize: 7, fontWeight: 700 },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    paddingVertical: 3,
    paddingHorizontal: 2,
  },
  tableCell: { fontSize: 7 },
  tableCellBold: { fontSize: 7, fontWeight: 700 },
  tableCellHead: { fontSize: 7, fontWeight: 700 },
  unkiGrid: { flexDirection: "row", gap: 10 },
  unkiCol: { flex: 1 },
  colYear: { width: 40 },
  colStar: { width: 44 },
  colMsg: { flex: 1 },
  colPos: { width: 72 },
  colEnergy: { flex: 1, textAlign: "center" },
});

const POSITIONS = [
  { key: "c" as const, line1: "中央", line2: "（本人）",          posLabel: "中央" },
  { key: "e" as const, line1: "東方", line2: "（仕事・未来）",    posLabel: "東方" },
  { key: "w" as const, line1: "西方", line2: "（家庭・パートナー）", posLabel: "西方" },
  { key: "n" as const, line1: "北方", line2: "（目上・人生哲学）", posLabel: "北方" },
  { key: "s" as const, line1: "南方", line2: "（目下・夢）",      posLabel: "南方" },
] as const;

interface Props {
  result: KanteiResult;
  currentYear: number;
  imageSrc?: string;
}

export function ReportDocument({ result, currentYear, imageSrc }: Props) {
  const { nichi, shusei, hachimon: hm, taiun, nenun, gender } = result;
  const nichiKanshi = nichi.k + nichi.s;
  const kanshiMsg = getKanshiMessage(nichiKanshi);
  const gogyou = hm.cL + "性";

  // 五行テーマ
  const C = getGogyouTheme(hm.cL);

  const currentTaiun = taiun.list.find((t, i) => {
    const next = taiun.list[i + 1];
    return t.startYear <= currentYear && (!next || next.startYear > currentYear);
  });

  const nearNenun = nenun.filter(
    (n) => n.year >= currentYear && n.year < currentYear + 12
  );

  const bd = result.suuriBreakdown;
  const energy = {
    total:    result.suuriTotal,
    shuubi:   (bd["甲"] ?? 0) + (bd["乙"] ?? 0),
    dentatsu: (bd["丙"] ?? 0) + (bd["丁"] ?? 0),
    inryoku:  (bd["戊"] ?? 0) + (bd["己"] ?? 0),
    kougeki:  (bd["庚"] ?? 0) + (bd["辛"] ?? 0),
    shutoku:  (bd["壬"] ?? 0) + (bd["癸"] ?? 0),
  };

  return (
    <Document>
      <Page size="A4" style={[s.page, { backgroundColor: C.bg }]}>
        {/* タイトル */}
        <Text style={{
          fontSize: 16, fontWeight: 700, textAlign: "center", letterSpacing: 6,
          borderBottomWidth: 2, borderBottomColor: C.heading,
          paddingBottom: 6, marginBottom: 4, color: C.heading,
        }}>
          算 命 学 パ ー ソ ナ リ テ ィ レ ポ ー ト
        </Text>

        {/* 個人情報 */}
        <View style={[s.infoRow, { borderBottomColor: C.border }]}>
          <Text style={s.infoName}>お名前：{result.name} 様</Text>
          <Text style={s.infoBirth}>生年月日：{result.birthday}（{result.gender}）</Text>
        </View>

        {/* ─── 1. あなたの本質 ─── */}
        <View style={[s.sectionBox, { borderColor: C.border }]}>
          <Text style={[s.sectionLabel, { backgroundColor: C.heading }]}>あなたの本質</Text>
          <View style={{ flexDirection: "row", gap: 10 }}>
            {imageSrc && (
              <Image src={imageSrc} style={{ width: 56, height: 80, borderRadius: 4 }} />
            )}
            <View style={{ flex: 1 }}>
              {kanshiMsg ? (
                <>
                  <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 4 }}>
                    <Text style={[s.essenceName, { color: C.heading }]}>{kanshiMsg.alias}</Text>
                    <Text style={[s.essenceKanshi, { color: C.heading }]}>（{nichiKanshi}）</Text>
                    <Text style={[s.essenceBadge, { backgroundColor: C.tableHeader, color: C.heading }]}>{gogyou}</Text>
                  </View>
                  <Text style={s.essenceMsg}>{kanshiMsg.message}</Text>
                </>
              ) : (
                <Text style={{ fontSize: 8, color: "#6B7280" }}>データが見つかりません</Text>
              )}
            </View>
          </View>
        </View>

        {/* ─── 2. 能力 ─── */}
        <View style={[s.sectionBox, { borderColor: C.border }]}>
          <Text style={[s.sectionLabel, { backgroundColor: C.heading }]}>能力</Text>
          <View style={[s.tableHeaderRow, { backgroundColor: C.tableHeader, borderBottomColor: C.border }]}>
            <Text style={[s.tableHeaderText, s.colPos, { color: C.heading }]}>方位（意味）</Text>
            <Text style={[s.tableHeaderText, s.colStar, { color: C.heading }]}>主星</Text>
            <Text style={[s.tableHeaderText, s.colMsg, { color: C.heading }]}>メッセージ</Text>
          </View>
          {POSITIONS.map(({ key, line1, line2, posLabel }, idx) => {
            const star = shusei[key];
            const msg = getSyuseiMessage(star, posLabel, gender);
            return (
              <View key={key} style={[s.tableRow, { borderBottomColor: C.border }, idx % 2 !== 0 ? { backgroundColor: C.rowAlt } : {}]}>
                <View style={s.colPos}>
                  <Text style={s.tableCell}>{line1}</Text>
                  <Text style={s.tableCell}>{line2}</Text>
                </View>
                <Text style={[s.tableCellHead, s.colStar, { color: C.heading }]}>{star}</Text>
                <Text style={[s.tableCell, s.colMsg]}>{msg?.message ?? "—"}</Text>
              </View>
            );
          })}
        </View>

        {/* ─── 3. 運気の流れ ─── */}
        <View style={[s.sectionBox, { borderColor: C.border }]}>
          <Text style={[s.sectionLabel, { backgroundColor: C.heading }]}>運気の流れ</Text>
          <View style={s.unkiGrid}>
            {/* 大運 */}
            <View style={s.unkiCol}>
              <View style={[s.tableHeaderRow, { backgroundColor: C.tableHeader, borderBottomColor: C.border }]}>
                <Text style={[s.tableHeaderText, s.colYear, { color: C.heading }]}>開始年</Text>
                <Text style={[s.tableHeaderText, s.colStar, { color: C.heading }]}>主星</Text>
                <Text style={[s.tableHeaderText, s.colMsg, { color: C.heading }]}>メッセージ</Text>
              </View>
              {taiun.list.map((t) => {
                const isCurrent = t === currentTaiun;
                const unki = getUnkiMessage(t.syusei);
                const message = unki
                  ? unki.longTerm + (t.tenchu ? " ★" : "")
                  : t.tenchu ? "★" : "—";
                return (
                  <View key={t.startYear} style={[s.tableRow, { borderBottomColor: C.border }, isCurrent ? { backgroundColor: C.highlight } : {}]}>
                    <Text style={[isCurrent ? s.tableCellBold : s.tableCell, s.colYear]}>{t.startYear}〜</Text>
                    <Text style={[s.tableCellHead, s.colStar, { color: C.heading }]}>{t.syusei}</Text>
                    <Text style={[s.tableCell, s.colMsg]}>{message}</Text>
                  </View>
                );
              })}
            </View>

            {/* 年運 */}
            <View style={s.unkiCol}>
              <View style={[s.tableHeaderRow, { backgroundColor: C.tableHeader, borderBottomColor: C.border }]}>
                <Text style={[s.tableHeaderText, s.colYear, { color: C.heading }]}>年</Text>
                <Text style={[s.tableHeaderText, s.colStar, { color: C.heading }]}>主星</Text>
                <Text style={[s.tableHeaderText, s.colMsg, { color: C.heading }]}>メッセージ</Text>
              </View>
              {nearNenun.map((n) => {
                const isCurrent = n.year === currentYear;
                const unki = getUnkiMessage(n.syusei);
                const message = unki
                  ? unki.shortTerm + (n.tenchu ? " ★" : "")
                  : n.tenchu ? "★" : "—";
                return (
                  <View key={n.year} style={[s.tableRow, { borderBottomColor: C.border }, isCurrent ? { backgroundColor: C.highlight } : {}]}>
                    <Text style={[isCurrent ? s.tableCellBold : s.tableCell, s.colYear]}>{n.year}〜</Text>
                    <Text style={[s.tableCellHead, s.colStar, { color: C.heading }]}>{n.syusei}</Text>
                    <Text style={[s.tableCell, s.colMsg]}>{message}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        </View>

        {/* ─── 4. エネルギー値 ─── */}
        <View style={[s.sectionBox, { borderColor: C.border }]}>
          <Text style={[s.sectionLabel, { backgroundColor: C.heading }]}>エネルギー値</Text>
          <View style={[s.tableHeaderRow, { backgroundColor: C.tableHeader, borderBottomColor: C.border }]}>
            {["総合計", "守備（木性）", "伝達（火性）", "引力（土性）", "攻撃（金性）", "習得（水性）"].map((h) => (
              <Text key={h} style={[s.tableHeaderText, s.colEnergy, { color: C.heading }]}>{h}</Text>
            ))}
          </View>
          <View style={[s.tableRow, { borderBottomWidth: 0 }]}>
            {[energy.total, energy.shuubi, energy.dentatsu, energy.inryoku, energy.kougeki, energy.shutoku].map((v, i) => (
              <Text
                key={i}
                style={[
                  { fontSize: 12, fontWeight: 700, textAlign: "center" },
                  s.colEnergy,
                  i === 0 ? { color: C.heading } : {},
                ]}
              >
                {v}
              </Text>
            ))}
          </View>
          <Text style={{ fontSize: 7, color: "#6B7280", marginTop: 4 }}>
            守備：自立力・信念の強さ / 伝達：表現・発信力 / 引力：財運・引き寄せ力 / 攻撃：行動・突破力 / 習得：学習・吸収力
          </Text>
        </View>
      </Page>
    </Document>
  );
}
