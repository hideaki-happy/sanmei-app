"use client";

import { useEffect, useState, useCallback, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import type { KanteiResult } from "@/types/sanmei";
import { processKantei } from "@/lib/sanmei";
import { getKanshiMessage, getSyuseiMessage, getUnkiMessage } from "@/lib/report/messages";
import { getGogyouTheme } from "@/lib/report/gogyouTheme";

const POSITIONS = [
  { key: "c" as const, label: "中央（本人）" },
  { key: "e" as const, label: "東方（仕事・未来）" },
  { key: "w" as const, label: "西方（家庭・パートナー）" },
  { key: "n" as const, label: "北方（目上・人生哲学）" },
  { key: "s" as const, label: "南方（目下・夢）" },
] as const;

// 方位キーを日本語に対応
const POSITION_LABEL_MAP: Record<string, string> = {
  c: "中央",
  e: "東方",
  w: "西方",
  n: "北方",
  s: "南方",
};

// ─── セクション見出し ─────────────────────────────────────
function SectionHeading({ title, color }: { title: string; color: string }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <h2
        className="text-lg font-bold tracking-widest pb-1 border-b-2"
        style={{ color, borderColor: color }}
      >
        【{title}】
      </h2>
    </div>
  );
}

// ─── メインコンテンツ ─────────────────────────────────────
function ResultContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [result, setResult] = useState<KanteiResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pdfLoading, setPdfLoading] = useState(false);
  const [autoDownload, setAutoDownload] = useState(false);
  const [element, setElement] = useState("木"); // 五行（初期値=木）
  const birthdayRef = useRef("");
  const genderRef = useRef("");
  const nameRef = useRef("");

  const currentYear = new Date().getFullYear();
  const C = getGogyouTheme(element);

  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    if (!sessionId) {
      router.replace("/report");
      return;
    }

    fetch(`/api/verify?session_id=${sessionId}`)
      .then((res) => {
        if (res.status === 402) throw new Error("payment_required");
        if (!res.ok) throw new Error("verify_failed");
        return res.json();
      })
      .then(({ name, birthday, gender }) => {
        birthdayRef.current = birthday;
        genderRef.current = gender;
        nameRef.current = name;

        const [y, m, d] = birthday.split("-");
        const r = processKantei({ name, year: y, month: m, day: d, gender });
        if (!r) throw new Error("対応範囲外の年です（1874〜2050）");
        setElement(r.hachimon.cL);
        setResult(r);
        setAutoDownload(true);
      })
      .catch((e) => {
        if (e.message === "payment_required") {
          router.replace("/report");
        } else {
          setError(e.message || "エラーが発生しました");
        }
      })
      .finally(() => setLoading(false));
  }, [searchParams, router]);

  const downloadPdf = useCallback(async () => {
    if (!result) return;
    setPdfLoading(true);
    try {
      const [y, m, d] = birthdayRef.current.split("-");
      const res = await fetch("/api/pdf-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          year: y,
          month: m,
          day: d,
          gender: genderRef.current,
          name: nameRef.current,
          currentYear,
        }),
      });
      if (!res.ok) throw new Error("PDF生成に失敗しました");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `report_${result.name}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      alert(e instanceof Error ? e.message : "エラーが発生しました");
    } finally {
      setPdfLoading(false);
    }
  }, [result, currentYear]);

  // 決済完了後に自動ダウンロード
  useEffect(() => {
    if (autoDownload && result) {
      setAutoDownload(false);
      downloadPdf();
    }
  }, [autoDownload, result, downloadPdf]);

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: C.bg, fontFamily: "'Noto Serif JP', serif" }}
      >
        <p className="tracking-widest text-stone-600">レポートを作成中…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center gap-4"
        style={{ background: C.bg, fontFamily: "'Noto Serif JP', serif" }}
      >
        <p className="text-red-600">{error}</p>
        <button
          onClick={() => router.push("/report")}
          className="px-6 py-2 text-white rounded-lg text-sm"
          style={{ background: C.heading }}
        >
          入力ページに戻る
        </button>
      </div>
    );
  }

  if (!result) return null;

  const { nichi, shusei, hachimon: hm, taiun, nenun, gender } = result;
  const nichiKanshi = nichi.k + nichi.s;
  const kanshiMsg = getKanshiMessage(nichiKanshi);
  const imageId = String(nichi.id).padStart(2, "0");
  const imageSrc = `/image/kanshi/${imageId}_${nichiKanshi}.png`;
  // 日干の五行（hm.cLは自分と同じ五行 = 日干の五行）
  const gogyou = hm.cL + "性";

  // 現在の大運ブロック判定
  const currentTaiun = taiun.list.find((t, i) => {
    const next = taiun.list[i + 1];
    return t.startYear <= currentYear && (!next || next.startYear > currentYear);
  });

  // 年運：現在年から12年
  const nearNenun = nenun.filter(
    (n) => n.year >= currentYear && n.year < currentYear + 12,
  );

  // エネルギー値（suuriBreakdownを五行ごとに集計・固定マッピング）
  const bd = result.suuriBreakdown;
  const energy = {
    total:    result.suuriTotal,
    shuubi:   (bd["甲"] ?? 0) + (bd["乙"] ?? 0), // 守備（木性）
    dentatsu: (bd["丙"] ?? 0) + (bd["丁"] ?? 0), // 伝達（火性）
    inryoku:  (bd["戊"] ?? 0) + (bd["己"] ?? 0), // 引力（土性）
    kougeki:  (bd["庚"] ?? 0) + (bd["辛"] ?? 0), // 攻撃（金性）
    shutoku:  (bd["壬"] ?? 0) + (bd["癸"] ?? 0), // 習得（水性）
  };

  return (
    <div
      className="min-h-screen p-4 md:p-8"
      style={{ background: C.bg, fontFamily: "'Noto Serif JP', serif", color: "#1C2518" }}
    >
      <div className="max-w-3xl mx-auto">
        {/* ヘッダー */}
        <div className="bg-white rounded-xl p-8 shadow-sm border mb-6" style={{ borderColor: C.border }}>
          <h1
            className="text-center text-2xl font-bold pb-3 border-b-2 tracking-[0.5em]"
            style={{ color: C.heading, borderColor: C.heading }}
          >
            算 命 学 簡 易 レ ポ ー ト
          </h1>
          <div className="flex justify-between mt-4 text-sm flex-wrap gap-2">
            <div>
              お名前：
              <span className="text-lg font-bold border-b border-stone-700 pb-0.5">
                {result.name}
              </span>{" "}
              様
            </div>
            <div className="text-stone-500">
              生年月日：{result.birthday}（{result.gender}）
            </div>
          </div>
        </div>

        {/* ─── 1. あなたの本質 ──────────────────────────── */}
        <div className="bg-white rounded-xl p-8 shadow-sm border mb-6" style={{ borderColor: C.border }}>
          <SectionHeading title="あなたの本質" color={C.heading} />
          <div className="flex gap-6 items-start">
            {/* 干支画像 */}
            <div className="flex-shrink-0">
              <Image
                src={imageSrc}
                alt={nichiKanshi}
                width={150}
                height={212}
                className="rounded-lg border"
                style={{ borderColor: C.border, objectFit: "cover" }}
                onError={() => {}}
              />
            </div>
            {/* テキスト */}
            <div className="flex-1">
              {kanshiMsg ? (
                <>
                  <div className="mb-3">
                    <span
                      className="text-xl font-bold tracking-wider"
                      style={{ color: C.heading }}
                    >
                      {kanshiMsg.alias}
                    </span>
                    <span className="ml-2 text-xl font-bold tracking-wider" style={{ color: C.heading }}>
                      （{nichiKanshi}）
                    </span>
                    <span className="ml-2 text-base font-semibold px-2 py-0.5 rounded" style={{ background: C.tableHeader, color: C.heading }}>
                      {gogyou}
                    </span>
                  </div>
                  <p className="text-sm leading-7 text-stone-700">{kanshiMsg.message}</p>
                </>
              ) : (
                <p className="text-sm text-stone-500">データが見つかりません</p>
              )}
            </div>
          </div>
        </div>

        {/* ─── 2. 能力 ─────────────────────────────────── */}
        <div className="bg-white rounded-xl p-8 shadow-sm border mb-6" style={{ borderColor: C.border }}>
          <SectionHeading title="能力" color={C.heading} />
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr style={{ background: C.tableHeader }}>
                <th className="px-3 py-2 text-left border font-semibold" style={{ borderColor: C.border, color: C.heading }}>
                  方位・意味
                </th>
                <th className="px-3 py-2 text-left border font-semibold" style={{ borderColor: C.border, color: C.heading }}>
                  主星
                </th>
                <th className="px-3 py-2 text-left border font-semibold" style={{ borderColor: C.border, color: C.heading }}>
                  メッセージ
                </th>
              </tr>
            </thead>
            <tbody>
              {POSITIONS.map(({ key, label }, idx) => {
                const star = shusei[key];
                const posLabel = POSITION_LABEL_MAP[key];
                const msg = getSyuseiMessage(star, posLabel, gender);
                return (
                  <tr
                    key={key}
                    style={{ background: idx % 2 === 0 ? "white" : C.rowAlt }}
                  >
                    <td className="px-3 py-2 border whitespace-nowrap font-medium" style={{ borderColor: C.border }}>
                      {label}
                    </td>
                    <td className="px-3 py-2 border whitespace-nowrap" style={{ borderColor: C.border, color: C.heading, fontWeight: 600 }}>
                      {star}
                    </td>
                    <td className="px-3 py-2 border leading-6" style={{ borderColor: C.border }}>
                      {msg?.message ?? "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* ─── 3. 運気の流れ ───────────────────────────── */}
        <div className="bg-white rounded-xl p-8 shadow-sm border mb-6" style={{ borderColor: C.border }}>
          <SectionHeading title="運気の流れ" color={C.heading} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 unki-grid">
            {/* 大運（10年スパン） */}
            <div>
              <table className="w-full text-xs border-collapse">
                <tbody>
                  {taiun.list.map((t, i) => {
                    const isCurrent = t === currentTaiun;
                    const unki = getUnkiMessage(t.syusei);
                    const message = unki
                      ? unki.longTerm + (t.tenchu ? " ★" : "")
                      : t.tenchu ? "★" : "—";
                    return (
                      <tr
                        key={t.startYear}
                        style={{ background: isCurrent ? C.highlight : "white" }}
                      >
                        <td className="px-2 py-1 border whitespace-nowrap" style={{ borderColor: C.border }}>
                          {t.startYear}〜
                        </td>
                        <td className="px-2 py-1 border whitespace-nowrap font-medium" style={{ borderColor: C.border, color: C.heading }}>
                          {t.syusei}
                        </td>
                        <td className="px-2 py-1 border leading-5" style={{ borderColor: C.border }}>
                          {message}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* 年運（1年スパン） */}
            <div>
              <table className="w-full text-xs border-collapse">
                <tbody>
                  {nearNenun.map((n) => {
                    const isCurrent = n.year === currentYear;
                    const unki = getUnkiMessage(n.syusei);
                    const message = unki
                      ? unki.shortTerm + (n.tenchu ? " ★" : "")
                      : n.tenchu ? "★" : "—";
                    return (
                      <tr
                        key={n.year}
                        style={{ background: isCurrent ? C.highlight : "white" }}
                      >
                        <td className="px-2 py-1 border whitespace-nowrap" style={{ borderColor: C.border }}>
                          {n.year}〜
                        </td>
                        <td className="px-2 py-1 border whitespace-nowrap font-medium" style={{ borderColor: C.border, color: C.heading }}>
                          {n.syusei}
                        </td>
                        <td className="px-2 py-1 border leading-5" style={{ borderColor: C.border }}>
                          {message}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ─── 4. エネルギー値 ────────────────────────────── */}
        <div className="bg-white rounded-xl p-8 shadow-sm border mb-6" style={{ borderColor: C.border }}>
          <SectionHeading title="エネルギー値" color={C.heading} />
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr style={{ background: C.tableHeader }}>
                {[
                  "総合計",
                  "守備（木性）",
                  "伝達（火性）",
                  "引力（土性）",
                  "攻撃（金性）",
                  "習得（水性）",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-2 border text-center font-semibold"
                    style={{ borderColor: C.border, color: C.heading }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                {[
                  energy.total,
                  energy.shuubi,
                  energy.dentatsu,
                  energy.inryoku,
                  energy.kougeki,
                  energy.shutoku,
                ].map((v, i) => (
                  <td
                    key={i}
                    className="px-4 py-3 border text-center text-lg font-bold"
                    style={{
                      borderColor: C.border,
                      color: i === 0 ? C.heading : "#1C2518",
                      background: i === 0 ? C.rowAlt : "white",
                    }}
                  >
                    {v}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
          <p className="text-xs text-stone-500 mt-3">
            守備：自立力・信念の強さ / 伝達：表現・発信力 / 引力：財運・引き寄せ力 / 攻撃：行動・突破力 / 習得：学習・吸収力
          </p>
        </div>

        {/* PDFダウンロードボタン */}
        <div className="text-center pb-8 no-print">
          <button
            onClick={downloadPdf}
            disabled={pdfLoading}
            className="px-8 py-3 text-white rounded-lg text-sm font-semibold tracking-widest hover:opacity-85 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: C.heading, fontFamily: "inherit" }}
          >
            {pdfLoading ? "生成中…" : "PDF 出力"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── ページエントリ ───────────────────────────────────────
export default function ReportResultPage() {
  return (
    <Suspense
      fallback={
        <div
          className="min-h-screen flex items-center justify-center"
          style={{ background: "#FAFAF6", fontFamily: "'Noto Serif JP', serif" }}
        >
          <p className="tracking-widest text-stone-600">読み込み中…</p>
        </div>
      }
    >
      <ResultContent />
    </Suspense>
  );
}
