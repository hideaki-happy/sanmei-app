"use client";

import { useState, useCallback, useRef } from "react";
import type { KanteiResult } from "@/types/sanmei";
import { processKantei } from "@/lib/sanmei";
import { InsenSection } from "@/components/sanmei/InsenSection";
import { YousenSection } from "@/components/sanmei/YousenSection";
import { IsouhouSection } from "@/components/sanmei/IsouhouSection";
import { HachimonSection } from "@/components/sanmei/HachimonSection";
import { TaiunSection } from "@/components/sanmei/TaiunSection";
import { NenunSection } from "@/components/sanmei/NenunSection";

export default function Home() {
  const [name, setName] = useState("");
  const [gender, setGender] = useState("男性");
  const [birthday, setBirthday] = useState("1980-01-01");
  const [result, setResult] = useState<KanteiResult | null>(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  const birthdayRef = useRef(birthday);

  const currentYear = new Date().getFullYear();

  const run = useCallback(() => {
    if (!birthday) return;
    birthdayRef.current = birthday;
    const [y, m, d] = birthday.split("-");
    const r = processKantei({ name, year: y, month: m, day: d, gender });
    if (!r) {
      alert("対応範囲外の年です（1874〜2050）");
      return;
    }
    setResult(r);
  }, [name, gender, birthday]);

  const downloadPdf = useCallback(async () => {
    if (!result) return;
    setPdfLoading(true);
    try {
      const [y, m, d] = birthdayRef.current.split("-");
      const res = await fetch("/api/pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ year: y, month: m, day: d, gender, name, currentYear }),
      });
      if (!res.ok) throw new Error("PDF生成に失敗しました");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `sanmei_${result.name}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      alert(e instanceof Error ? e.message : "エラーが発生しました");
    } finally {
      setPdfLoading(false);
    }
  }, [result, gender, name, currentYear]);

  const birthYear = parseInt(birthday.split("-")[0]);

  return (
    <div className="min-h-screen bg-[#FAF7F2] font-serif text-stone-800 p-5">
      <div className="max-w-4xl mx-auto">
        {/* 入力フォーム */}
        <div className="bg-white rounded-xl p-10 shadow-sm border border-stone-200 mb-8">
          <h1 className="text-center text-3xl font-bold tracking-[0.5em] text-stone-800 pb-4 border-b-2 border-amber-700">
            宿 命 鑑 定 書
          </h1>
          <p className="text-center text-xs text-stone-400 mt-2 tracking-widest">
            算命学・本格鑑定システム
          </p>
          <div className="flex gap-4 mt-6 flex-wrap">
            <input
              className="flex-1 min-w-[120px] px-4 py-3 border border-stone-200 rounded-lg text-base font-serif bg-[#FDFCFA] outline-none focus:border-amber-600"
              placeholder="お名前"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <select
              className="px-4 py-3 border border-stone-200 rounded-lg text-base font-serif bg-[#FDFCFA] min-w-[100px]"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option>男性</option>
              <option>女性</option>
            </select>
            <input
              type="date"
              className="flex-1 min-w-[180px] px-4 py-3 border border-stone-200 rounded-lg text-base font-serif bg-[#FDFCFA] outline-none focus:border-amber-600"
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
            />
          </div>
          <button
            className="w-full mt-6 py-4 bg-gradient-to-r from-amber-800 to-amber-500 text-white rounded-lg text-lg font-bold tracking-[0.4em] cursor-pointer hover:opacity-85 transition-opacity"
            onClick={run}
          >
            鑑 定 す る
          </button>
        </div>

        {/* 鑑定結果 */}
        {result && (
          <div className="bg-white rounded-xl p-10 shadow-sm border border-stone-200">
            <h1 className="text-center text-2xl font-bold tracking-[0.5em] text-stone-800 pb-4 border-b-2 border-amber-700">
              宿 命 鑑 定 書
            </h1>
            <div className="flex justify-between mt-5 pb-3 border-b border-stone-200 flex-wrap gap-2 items-center">
              <div>
                お名前：
                <span className="text-xl border-b border-stone-800 pb-0.5">
                  {result.name}
                </span>{" "}
                様
              </div>
              <div className="flex items-center gap-4">
                <div className="text-stone-400 text-sm">
                  生年月日：{result.birthday}（{result.gender}）
                </div>
                <button
                  onClick={downloadPdf}
                  disabled={pdfLoading}
                  className="px-4 py-2 bg-stone-800 text-white text-sm rounded-lg hover:bg-stone-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {pdfLoading ? "生成中…" : "PDF 出力"}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mt-6">
              <InsenSection result={result} />
              <YousenSection result={result} />
            </div>

            <div className="grid grid-cols-2 gap-6 mt-6">
              <IsouhouSection result={result} />
              <HachimonSection result={result} />
            </div>

            <TaiunSection result={result} currentYear={currentYear} />
            <NenunSection result={result} currentYear={currentYear} />
          </div>
        )}
      </div>
    </div>
  );
}
