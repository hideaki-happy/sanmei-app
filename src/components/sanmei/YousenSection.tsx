"use client";

import type { KanteiResult } from "@/types/sanmei";

interface Props {
  result: KanteiResult;
}

function CrossCell({
  value,
  sub,
  center,
}: {
  value: string;
  sub?: string;
  center?: boolean;
}) {
  return (
    <td
      className={`w-24 h-16 text-center border border-stone-200 align-middle ${center ? "bg-stone-50 font-bold" : "bg-white"}`}
    >
      <div className={`${sub ? "text-sm" : "text-lg font-semibold"}`}>{value}</div>
      {sub && <div className="text-xs text-stone-400 mt-0.5">{sub}</div>}
    </td>
  );
}

function EmptyCell() {
  return <td className="border-none bg-transparent" />;
}

export function YousenSection({ result }: Props) {
  const { shusei: sh, zyuusei: zy } = result;

  return (
    <div className="border border-stone-200 rounded-lg p-6 relative bg-white">
      <span className="absolute -top-3 left-4 bg-stone-800 text-white px-3 py-1 rounded text-xs font-semibold tracking-widest">
        陽 占
      </span>
      <div className="flex justify-center items-center min-h-[220px] mt-2">
        <table className="border-collapse">
          <tbody>
            <tr>
              <EmptyCell />
              <CrossCell value={sh.n} />
              <CrossCell value={zy.young} sub="初年" />
            </tr>
            <tr>
              <CrossCell value={sh.w} />
              <CrossCell value={sh.c} center />
              <CrossCell value={sh.e} />
            </tr>
            <tr>
              <CrossCell value={zy.old} sub="晩年" />
              <CrossCell value={sh.s} />
              <CrossCell value={zy.mid} sub="中年" />
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
