import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import type { KanteiResult } from "@/types/sanmei";

// フォント登録（API ルートから呼び出すこと）
export function registerFonts(regularSrc: string, boldSrc: string) {
  Font.register({
    family: "NotoSerifJP",
    fonts: [
      { src: regularSrc, fontWeight: 400 },
      { src: boldSrc,    fontWeight: 700 },
    ],
  });
}

const C = {
  bg: "#FAF7F2",
  accent: "#8B6914",
  text: "#2C2417",
  textLight: "#7A6E5D",
  border: "#D8D0C4",
  red: "#C0392B",
  blue: "#2E6B9E",
  headerBg: "#2C2417",
  rowAlt: "#F7F3EC",
  highlight: "#FFF9E6",
};

const s = StyleSheet.create({
  page: {
    fontFamily: "NotoSerifJP",
    backgroundColor: C.bg,
    padding: 32,
    fontSize: 9,
    color: C.text,
  },
  // ヘッダー
  title: {
    fontSize: 20,
    fontWeight: 700,
    textAlign: "center",
    letterSpacing: 6,
    borderBottomWidth: 2,
    borderBottomColor: C.accent,
    paddingBottom: 8,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 8,
    textAlign: "center",
    color: C.textLight,
    letterSpacing: 2,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: C.border,
    paddingBottom: 8,
    marginBottom: 12,
  },
  infoName: { fontSize: 12 },
  infoBirth: { fontSize: 9, color: C.textLight },

  // セクション
  grid2: { flexDirection: "row", gap: 12, marginBottom: 12 },
  section: {
    flex: 1,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 6,
    padding: 10,
  },
  sectionFull: {
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
  },
  sectionLabel: {
    fontSize: 8,
    fontWeight: 700,
    backgroundColor: C.headerBg,
    color: "#fff",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 3,
    alignSelf: "flex-start",
    letterSpacing: 2,
    marginBottom: 8,
  },

  // 陰占
  insenHeader: { flexDirection: "row", marginBottom: 4 },
  insenCol: { flex: 1, alignItems: "center" },
  insenColLabel: { fontSize: 8, color: C.textLight, marginBottom: 4 },
  insenKan: { fontSize: 18, fontWeight: 700 },
  insenShi: { fontSize: 18, fontWeight: 700 },
  insenZoukan: { fontSize: 12, minHeight: 16, textAlign: "center" },
  insenId: { fontSize: 7, color: C.textLight },
  tenshuu: { fontSize: 8, textAlign: "center", marginTop: 6 },
  tenshuuVal: { fontSize: 12, fontWeight: 700, color: C.red },

  // 陽占
  yousenGrid: { alignItems: "center" },
  yousenRow: { flexDirection: "row" },
  yousenCell: {
    width: 68,
    height: 44,
    borderWidth: 1,
    borderColor: C.border,
    alignItems: "center",
    justifyContent: "center",
  },
  yousenCellCenter: { backgroundColor: C.rowAlt },
  yousenCellText: { fontSize: 9, fontWeight: 700 },
  yousenCellSub: { fontSize: 7, color: C.textLight },

  // 位相法
  isouShiRow: { flexDirection: "row", justifyContent: "space-around", marginBottom: 4 },
  isouShi: { fontSize: 14, fontWeight: 700 },
  isouPair: { flexDirection: "row", justifyContent: "space-between", marginBottom: 2 },
  isouLabel: { fontSize: 8, color: C.textLight, width: 48 },
  isouVal: { fontSize: 9, fontWeight: 700 },

  // 八門法
  hachimonGrid: { alignItems: "center", marginBottom: 6 },
  hachimonRow: { flexDirection: "row" },
  hachimonCell: { width: 60, alignItems: "center", padding: 4 },
  hachimonCellLabel: { fontSize: 8, color: C.textLight },
  hachimonCellVal: { fontSize: 12, fontWeight: 700, color: C.accent },
  suuriTotal: { textAlign: "center", fontSize: 9, marginBottom: 4 },
  suuriTotalVal: { fontSize: 14, fontWeight: 700, color: C.accent },
  kanRow: { flexDirection: "row", justifyContent: "center", gap: 3 },
  kanCell: { width: 22, alignItems: "center", backgroundColor: C.rowAlt, borderRadius: 2, padding: 2 },
  kanLabel: { fontSize: 6, color: C.textLight },
  kanVal: { fontSize: 8, fontWeight: 700 },

  // 大運・年運テーブル
  tableHeader: {
    flexDirection: "row",
    backgroundColor: C.headerBg,
    paddingVertical: 3,
    paddingHorizontal: 2,
    borderRadius: 3,
    marginBottom: 2,
  },
  tableHeaderText: { color: "#fff", fontSize: 7, fontWeight: 700 },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: C.border,
    paddingVertical: 3,
    paddingHorizontal: 2,
  },
  tableRowHighlight: { backgroundColor: C.highlight },
  tableCell: { fontSize: 8 },
  tableCellBold: { fontSize: 8, fontWeight: 700 },

  // テーブル列幅
  colYear: { width: 42 },
  colKanshi: { width: 28 },
  colShusei: { width: 42 },
  colZyuusei: { width: 42 },
  colTenchu: { width: 16 },
  colIsou: { flex: 1 },
});

// 位相法の文字色
function isouColor(part: string): string {
  const isBlue = ["半会","大半会","支合","律音","合"].some((b) => part.includes(b));
  return isBlue ? C.blue : part.includes("比和") ? C.text : C.red;
}

function IsouText({ text }: { text: string }) {
  if (!text) return <Text style={[s.tableCell, { color: C.textLight }]}>—</Text>;
  const parts = text.split("・");
  return (
    <Text>
      {parts.map((p, i) => (
        <Text key={i} style={{ color: isouColor(p), fontSize: 7, fontWeight: 700 }}>
          {i > 0 ? " " : ""}{p === "合" ? "支合" : p}
        </Text>
      ))}
    </Text>
  );
}

// 陽占セル
function YousenCell({
  value,
  sub,
  center,
  empty,
}: {
  value?: string;
  sub?: string;
  center?: boolean;
  empty?: boolean;
}) {
  if (empty) return <View style={s.yousenCell} />;
  return (
    <View style={[s.yousenCell, center ? s.yousenCellCenter : {}]}>
      <Text style={s.yousenCellText}>{value}</Text>
      {sub && <Text style={s.yousenCellSub}>{sub}</Text>}
    </View>
  );
}

interface Props {
  result: KanteiResult;
  currentYear: number;
}

export function KanteiDocument({ result, currentYear }: Props) {
  const { nen, tsuki, nichi, shusei: sh, zyuusei: zy, hachimon: hm } = result;
  const KAN_LIST = ["甲","乙","丙","丁","戊","己","庚","辛","壬","癸"];

  return (
    <Document>
      {/* ===== PAGE 1: 基本情報・陰陽占・位相法・八門法 ===== */}
      <Page size="A4" style={s.page}>
        {/* タイトル */}
        <Text style={s.title}>宿 命 鑑 定 書</Text>
        <Text style={s.subtitle}>算命学・本格鑑定システム</Text>

        {/* 個人情報 */}
        <View style={s.infoRow}>
          <Text style={s.infoName}>お名前：{result.name} 様</Text>
          <Text style={s.infoBirth}>
            生年月日：{result.birthday}（{result.gender}）
          </Text>
        </View>

        {/* 陰占 + 陽占 */}
        <View style={s.grid2}>
          {/* 陰占 */}
          <View style={s.section}>
            <Text style={s.sectionLabel}>陰 占</Text>
            <View style={s.insenHeader}>
              {[
                { label: "日柱", p: nichi },
                { label: "月柱", p: tsuki },
                { label: "年柱", p: nen },
              ].map(({ label, p }) => (
                <View key={label} style={s.insenCol}>
                  <Text style={s.insenColLabel}>{label}</Text>
                  <Text style={s.insenId}>({p.id})</Text>
                  <Text style={s.insenKan}>{p.k}</Text>
                  <Text style={s.insenShi}>{p.s}</Text>
                  {p.zoukan.map((z, i) => (
                    <Text
                      key={i}
                      style={[
                        s.insenZoukan,
                        { fontWeight: z.isActive ? 700 : 400, color: z.kan ? C.text : C.bg },
                      ]}
                    >
                      {z.kan || "　"}
                    </Text>
                  ))}
                </View>
              ))}
            </View>
            <Text style={s.tenshuu}>
              天冲殺：<Text style={s.tenshuuVal}>{result.tenshuu}</Text>
            </Text>
          </View>

          {/* 陽占 */}
          <View style={s.section}>
            <Text style={s.sectionLabel}>陽 占</Text>
            <View style={[s.yousenGrid, { marginTop: 8 }]}>
              <View style={s.yousenRow}>
                <YousenCell empty />
                <YousenCell value={sh.n} />
                <YousenCell value={zy.young} sub="初年" />
              </View>
              <View style={s.yousenRow}>
                <YousenCell value={sh.w} />
                <YousenCell value={sh.c} center />
                <YousenCell value={sh.e} />
              </View>
              <View style={s.yousenRow}>
                <YousenCell value={zy.old} sub="晩年" />
                <YousenCell value={sh.s} />
                <YousenCell value={zy.mid} sub="中年" />
              </View>
            </View>
          </View>
        </View>

        {/* 位相法 + 八門法 */}
        <View style={s.grid2}>
          {/* 位相法 */}
          <View style={s.section}>
            <Text style={s.sectionLabel}>位相法</Text>
            <View style={s.isouShiRow}>
              <Text style={s.isouShi}>{nichi.s}</Text>
              <Text style={s.isouShi}>{tsuki.s}</Text>
              <Text style={s.isouShi}>{nen.s}</Text>
            </View>
            {[
              { label: "日支－月支", val: result.isou.getsuNichi },
              { label: "月支－年支", val: result.isou.nenGetsu },
              { label: "日支－年支", val: result.isou.nenNichi },
            ].map(({ label, val }) => (
              <View key={label} style={s.isouPair}>
                <Text style={s.isouLabel}>{label}</Text>
                <IsouText text={val} />
              </View>
            ))}
          </View>

          {/* 八門法・数理法 */}
          <View style={s.section}>
            <Text style={s.sectionLabel}>八門法・数理法</Text>
            <View style={s.hachimonGrid}>
              <View style={s.hachimonRow}>
                <View style={s.hachimonCell} />
                <View style={s.hachimonCell}>
                  <Text style={s.hachimonCellLabel}>[ {hm.nL} ]</Text>
                  <Text style={s.hachimonCellVal}>{hm.nV}</Text>
                </View>
                <View style={s.hachimonCell} />
              </View>
              <View style={s.hachimonRow}>
                {[
                  { l: hm.wL, v: hm.wV },
                  { l: hm.cL, v: hm.cV },
                  { l: hm.eL, v: hm.eV },
                ].map(({ l, v }) => (
                  <View key={l} style={s.hachimonCell}>
                    <Text style={s.hachimonCellLabel}>[ {l} ]</Text>
                    <Text style={s.hachimonCellVal}>{v}</Text>
                  </View>
                ))}
              </View>
              <View style={s.hachimonRow}>
                <View style={s.hachimonCell} />
                <View style={s.hachimonCell}>
                  <Text style={s.hachimonCellLabel}>[ {hm.sL} ]</Text>
                  <Text style={s.hachimonCellVal}>{hm.sV}</Text>
                </View>
                <View style={s.hachimonCell} />
              </View>
            </View>
            <Text style={s.suuriTotal}>
              総エネルギー：<Text style={s.suuriTotalVal}>{result.suuriTotal}</Text> 点
            </Text>
            <View style={s.kanRow}>
              {KAN_LIST.map((k) => (
                <View key={k} style={s.kanCell}>
                  <Text style={s.kanLabel}>{k}</Text>
                  <Text style={s.kanVal}>{result.suuriBreakdown[k] ?? 0}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </Page>

      {/* ===== PAGE 2: 大運・年運 ===== */}
      <Page size="A4" style={s.page}>
        <Text style={[s.title, { fontSize: 16, marginBottom: 12 }]}>
          大運 ・ 年運
        </Text>

        {/* 大運 */}
        <View style={s.sectionFull}>
          <Text style={s.sectionLabel}>大 運</Text>
          <Text style={{ fontSize: 9, marginBottom: 6 }}>
            立運：<Text style={{ fontWeight: 700 }}>{result.taiun.startAge}歳</Text>
            （{result.taiun.direction}）
          </Text>
          <View style={s.tableHeader}>
            {[
              { label: "開始年", style: s.colYear },
              { label: "干支", style: s.colKanshi },
              { label: "守護星", style: s.colShusei },
              { label: "従星", style: s.colZyuusei },
              { label: "天", style: s.colTenchu },
              { label: "対日", style: s.colIsou },
              { label: "対月", style: s.colIsou },
              { label: "対年", style: s.colIsou },
            ].map(({ label, style }) => (
              <Text key={label} style={[s.tableHeaderText, style]}>{label}</Text>
            ))}
          </View>
          {result.taiun.list.map((t, i) => {
            const list = result.taiun.list;
            const isCurrent =
              t.startYear <= currentYear &&
              (i < list.length - 1 ? list[i + 1].startYear > currentYear : true);
            return (
              <View
                key={i}
                style={[s.tableRow, isCurrent ? s.tableRowHighlight : {}]}
              >
                <Text style={[isCurrent ? s.tableCellBold : s.tableCell, s.colYear]}>
                  {t.startYear}〜
                </Text>
                <Text style={[s.tableCell, s.colKanshi]}>{t.kanshi}</Text>
                <Text style={[s.tableCell, s.colShusei]}>{t.syusei}</Text>
                <Text style={[s.tableCell, s.colZyuusei]}>{t.zyuusei}</Text>
                <Text style={[s.tableCell, s.colTenchu, { color: C.red }]}>{t.tenchu}</Text>
                <View style={s.colIsou}><IsouText text={t.past} /></View>
                <View style={s.colIsou}><IsouText text={t.current} /></View>
                <View style={s.colIsou}><IsouText text={t.future} /></View>
              </View>
            );
          })}
        </View>

        {/* 年運（直近12年） */}
        <View style={s.sectionFull}>
          <Text style={s.sectionLabel}>年 運（直近12年）</Text>
          <View style={s.tableHeader}>
            {[
              { label: "年", style: s.colYear },
              { label: "干支", style: s.colKanshi },
              { label: "守護星", style: s.colShusei },
              { label: "従星", style: s.colZyuusei },
              { label: "天", style: s.colTenchu },
              { label: "対日", style: s.colIsou },
              { label: "対月", style: s.colIsou },
              { label: "対年", style: s.colIsou },
            ].map(({ label, style }) => (
              <Text key={label} style={[s.tableHeaderText, style]}>{label}</Text>
            ))}
          </View>
          {result.nenun
            .filter((n) => n.year >= currentYear - 1)
            .slice(0, 12)
            .map((n, i) => (
              <View
                key={i}
                style={[s.tableRow, n.year === currentYear ? s.tableRowHighlight : {}]}
              >
                <Text style={[n.year === currentYear ? s.tableCellBold : s.tableCell, s.colYear]}>
                  {n.year}
                </Text>
                <Text style={[s.tableCell, s.colKanshi]}>{n.kanshi}</Text>
                <Text style={[s.tableCell, s.colShusei]}>{n.syusei}</Text>
                <Text style={[s.tableCell, s.colZyuusei]}>{n.zyuusei}</Text>
                <Text style={[s.tableCell, s.colTenchu, { color: C.red }]}>{n.tenchu}</Text>
                <View style={s.colIsou}><IsouText text={n.past} /></View>
                <View style={s.colIsou}><IsouText text={n.current} /></View>
                <View style={s.colIsou}><IsouText text={n.future} /></View>
              </View>
            ))}
        </View>
      </Page>
    </Document>
  );
}
