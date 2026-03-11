"use client";

import type { KanteiResult } from "@/types/sanmei";

interface Props {
  result: KanteiResult;
}

const BLUE_KEYWORDS = ["半会", "大半会", "支合", "律音", "合"];

function IsouSvgText({
  text,
  x,
  yBase,
}: {
  text: string;
  x: number;
  yBase: number;
}) {
  if (!text) return null;
  return (
    <>
      {text.split("・").map((part, i) => {
        const isBlue = BLUE_KEYWORDS.some((b) => part.includes(b));
        const fill = isBlue ? "#2E6B9E" : part.includes("比和") ? "#333" : "#C0392B";
        const label = part === "合" ? "支合" : part;
        return (
          <text
            key={i}
            x={x}
            y={yBase + i * 18}
            textAnchor="middle"
            fill={fill}
            fontSize="15"
            fontWeight="600"
            fontFamily="'Noto Serif JP',serif"
          >
            {label}
          </text>
        );
      })}
    </>
  );
}

export function IsouhouSection({ result }: Props) {
  const { isou, nichi, tsuki, nen } = result;

  return (
    <div className="border border-stone-200 rounded-lg p-6 relative bg-white">
      <span className="absolute -top-3 left-4 bg-stone-800 text-white px-3 py-1 rounded text-xs font-semibold tracking-widest">
        位相法
      </span>
      <div className="text-center pt-4">
        <div className="flex justify-center gap-12 text-2xl font-semibold mb-2">
          <span>{nichi.s}</span>
          <span>{tsuki.s}</span>
          <span>{nen.s}</span>
        </div>
        <svg
          width="280"
          height="140"
          viewBox="0 0 280 140"
          className="block mx-auto"
        >
          {/* 上段括弧：日支-月支 */}
          <path d="M 46 5 V 20 H 140 V 5" fill="none" stroke="#333" strokeWidth="1.2" />
          {/* 上段括弧：月支-年支 */}
          <path d="M 140 5 V 20 H 234 V 5" fill="none" stroke="#333" strokeWidth="1.2" />
          <IsouSvgText text={isou.getsuNichi} x={93} yBase={42} />
          <IsouSvgText text={isou.nenGetsu} x={187} yBase={42} />
          {/* 下段括弧：日支-年支 */}
          <path d="M 46 75 V 90 H 234 V 75" fill="none" stroke="#333" strokeWidth="1.2" />
          <IsouSvgText text={isou.nenNichi} x={140} yBase={112} />
        </svg>
      </div>
    </div>
  );
}
