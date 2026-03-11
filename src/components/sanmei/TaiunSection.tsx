"use client";

import type { KanteiResult } from "@/types/sanmei";
import { IsouLabel } from "./IsouLabel";

interface Props {
  result: KanteiResult;
  currentYear: number;
}

export function TaiunSection({ result, currentYear }: Props) {
  const { taiun } = result;

  return (
    <div className="border border-stone-200 rounded-lg p-6 relative bg-white mt-6">
      <span className="absolute -top-3 left-4 bg-stone-800 text-white px-3 py-1 rounded text-xs font-semibold tracking-widest">
        大 運
      </span>
      <div className="mt-2 mb-3 text-sm">
        立運：<b>{taiun.startAge}歳</b>（{taiun.direction}）
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-xs">
          <tbody>
            {taiun.list.map((t, i) => {
              const isCurrent =
                t.startYear <= currentYear &&
                (i < taiun.list.length - 1
                  ? taiun.list[i + 1].startYear > currentYear
                  : true);
              return (
                <tr
                  key={i}
                  className={`border-t border-stone-200 ${isCurrent ? "bg-yellow-50" : ""}`}
                >
                  <td className={`py-1.5 px-1 text-center ${isCurrent ? "font-bold" : ""}`}>
                    {t.startYear}〜
                  </td>
                  <td className="text-center">{t.kanshi}</td>
                  <td className="text-center">{t.syusei}</td>
                  <td className="text-center">{t.zyuusei}</td>
                  <td className="text-center text-red-700">{t.tenchu}</td>
                  <td className="text-center"><IsouLabel text={t.past} /></td>
                  <td className="text-center"><IsouLabel text={t.current} /></td>
                  <td className="text-center"><IsouLabel text={t.future} /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
