"use client";

import { useEffect, useState, useCallback, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import type { KanteiResult } from "@/types/sanmei";
import { processKantei } from "@/lib/sanmei";
import { InsenSection } from "@/components/sanmei/InsenSection";
import { YousenSection } from "@/components/sanmei/YousenSection";
import { IsouhouSection } from "@/components/sanmei/IsouhouSection";
import { HachimonSection } from "@/components/sanmei/HachimonSection";
import { TaiunSection } from "@/components/sanmei/TaiunSection";
import { NenunSection } from "@/components/sanmei/NenunSection";

export default function KanteiResultPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center font-serif text-stone-600">
          <p className="tracking-widest">読み込み中…</p>
        </div>
      }
    >
      <ResultContent />
    </Suspense>
  );
}

function ResultContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [result, setResult] = useState<KanteiResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pdfLoading, setPdfLoading] = useState(false);
  const birthdayRef = useRef("");
  const genderRef = useRef("");
  const nameRef = useRef("");

  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    if (!sessionId) {
      router.replace("/kantei");
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
        setResult(r);
      })
      .catch((e) => {
        if (e.message === "payment_required") {
          router.replace("/kantei");
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
      const res = await fetch("/api/pdf", {
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
      a.download = `sanmei_${result.name}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      alert(e instanceof Error ? e.message : "エラーが発生しました");
    } finally {
      setPdfLoading(false);
    }
  }, [result, currentYear]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center font-serif text-stone-600">
        <p className="tracking-widest">鑑定書を作成中…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex flex-col items-center justify-center font-serif text-stone-600 gap-4">
        <p className="text-red-600">{error}</p>
        <button
          onClick={() => router.push("/kantei")}
          className="px-6 py-2 bg-amber-800 text-white rounded-lg text-sm"
        >
          入力ページに戻る
        </button>
      </div>
    );
  }

  if (!result) return null;

  return (
    <div className="min-h-screen bg-[#FAF7F2] font-serif text-stone-800 p-5">
      <div className="max-w-4xl mx-auto">
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
      </div>
    </div>
  );
}
