"use client";

import { useState } from "react";

export default function ReportPage() {
  const [name, setName] = useState("");
  const [gender, setGender] = useState("男性");
  const [birthday, setBirthday] = useState("1980-01-01");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!birthday) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/checkout-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, birthday, gender }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "エラーが発生しました");
      window.location.href = data.url;
    } catch (e) {
      setError(e instanceof Error ? e.message : "エラーが発生しました");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF6] p-5" style={{ fontFamily: "'Noto Serif JP', serif" }}>
      <div className="max-w-lg mx-auto">
        <div className="bg-white rounded-xl p-10 shadow-sm border border-stone-200 mt-16">
          <h1
            className="text-center text-3xl font-bold pb-4 border-b-2"
            style={{ color: "#2C3E2D", borderColor: "#2C3E2D", letterSpacing: "0.4em" }}
          >
            パ ー ソ ナ リ テ ィ レ ポ ー ト
          </h1>
          <p className="text-center text-xs text-stone-400 mt-2 tracking-widest">
            算命学・パーソナリティ鑑定システム
          </p>

          <div className="flex flex-col gap-4 mt-8">
            <div>
              <label className="block text-sm text-stone-500 mb-1 tracking-wide">お名前</label>
              <input
                className="w-full px-4 py-3 border border-stone-200 rounded-lg text-base bg-[#FDFCFA] outline-none focus:border-stone-400 text-stone-800 placeholder:text-stone-400"
                style={{ fontFamily: "inherit" }}
                placeholder="山田 太郎"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm text-stone-500 mb-1 tracking-wide">性別</label>
              <select
                className="w-full px-4 py-3 border border-stone-200 rounded-lg text-base bg-[#FDFCFA] text-stone-800"
                style={{ fontFamily: "inherit" }}
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <option>男性</option>
                <option>女性</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-stone-500 mb-1 tracking-wide">生年月日</label>
              <input
                type="date"
                className="w-full px-4 py-3 border border-stone-200 rounded-lg text-base bg-[#FDFCFA] outline-none focus:border-stone-400 text-stone-800"
                style={{ fontFamily: "inherit" }}
                value={birthday}
                onChange={(e) => setBirthday(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <p className="mt-4 text-sm text-red-600 text-center">{error}</p>
          )}

          <button
            className="w-full mt-8 py-4 text-white rounded-lg text-lg font-bold tracking-[0.4em] cursor-pointer hover:opacity-85 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: "linear-gradient(to right, #2C3E2D, #4A6741)", fontFamily: "inherit" }}
            onClick={handleSubmit}
            disabled={loading || !birthday}
          >
            {loading ? "処理中…" : "レ ポ ー ト を 作 成（1,000円）"}
          </button>

          <p className="text-center text-xs text-stone-400 mt-4">
            決済はStripeの安全な画面で行われます
          </p>
        </div>
      </div>
    </div>
  );
}
