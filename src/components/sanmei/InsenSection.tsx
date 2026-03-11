"use client";

import type { KanteiResult } from "@/types/sanmei";

interface Props {
  result: KanteiResult;
}

export function InsenSection({ result }: Props) {
  const pillars = [
    { label: "日柱", pillar: result.nichi },
    { label: "月柱", pillar: result.tsuki },
    { label: "年柱", pillar: result.nen },
  ];

  return (
    <div className="border border-stone-200 rounded-lg p-6 relative bg-white">
      <span className="absolute -top-3 left-4 bg-stone-800 text-white px-3 py-1 rounded text-xs font-semibold tracking-widest">
        陰 占
      </span>
      <table className="w-full border-collapse text-center mt-2">
        <thead>
          <tr>
            {pillars.map(({ label }) => (
              <th key={label} className="font-normal text-stone-400 text-xs pb-3">
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr className="text-xs text-stone-400">
            {pillars.map(({ pillar }) => (
              <td key={pillar.id}>({pillar.id})</td>
            ))}
          </tr>
          <tr className="text-2xl">
            {pillars.map(({ pillar }) => (
              <td key={pillar.k}>{pillar.k}</td>
            ))}
          </tr>
          <tr className="text-2xl">
            {pillars.map(({ pillar }) => (
              <td key={pillar.s}>{pillar.s}</td>
            ))}
          </tr>
          {[0, 1, 2].map((i) => (
            <tr key={i} className="h-7">
              {pillars.map(({ label, pillar }) => {
                const z = pillar.zoukan[i];
                return (
                  <td
                    key={label}
                    className={`text-lg ${z?.isActive ? "font-bold" : "font-normal"} ${z?.kan ? "text-stone-800" : "invisible"}`}
                  >
                    {z?.kan || "　"}
                  </td>
                );
              })}
            </tr>
          ))}
          <tr>
            <td colSpan={3} className="pt-3 text-sm">
              天冲殺：<b className="text-red-700 text-lg">{result.tenshuu}</b>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
