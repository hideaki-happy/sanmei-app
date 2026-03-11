"use client";

import { useState } from "react";
import type { KanteiResult } from "@/types/sanmei";
import { IsouLabel } from "./IsouLabel";

interface Props {
  result: KanteiResult;
  currentYear: number;
}

export function NenunSection({ result, currentYear }: Props) {
  const [showAll, setShowAll] = useState(false);

  const filtered = showAll
    ? result.nenun
    : result.nenun.filter((x) => x.year >= currentYear - 1).slice(0, 12);

  return (
    <div className="border border-stone-200 rounded-lg p-6 relative bg-white mt-6">
      <span className="absolute -top-3 left-4 bg-stone-800 text-white px-3 py-1 rounded text-xs font-semibold tracking-widest">
        年 運
      </span>
      <div className="flex justify-end mt-1 mb-2">
        <button
          onClick={() => setShowAll(!showAll)}
          className="text-blue-700 text-xs underline bg-transparent border-none cursor-pointer font-sans"
        >
          {showAll ? "直近12年に戻す" : "全年表示"}
        </button>
      </div>
      <div className="max-h-96 overflow-y-auto">
        <table className="w-full border-collapse text-xs">
          <tbody>
            {filtered.map((n, i) => (
              <tr
                key={i}
                className={`border-t border-stone-200 ${n.year === currentYear ? "bg-yellow-50" : ""}`}
              >
                <td className={`py-1.5 px-1 text-center ${n.year === currentYear ? "font-bold" : ""}`}>
                  {n.year}
                </td>
                <td className="text-center">{n.kanshi}</td>
                <td className="text-center">{n.syusei}</td>
                <td className="text-center">{n.zyuusei}</td>
                <td className="text-center text-red-700">{n.tenchu}</td>
                <td className="text-center"><IsouLabel text={n.past} /></td>
                <td className="text-center"><IsouLabel text={n.current} /></td>
                <td className="text-center"><IsouLabel text={n.future} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
