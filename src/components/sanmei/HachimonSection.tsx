"use client";

import type { KanteiResult } from "@/types/sanmei";

interface Props {
  result: KanteiResult;
}

const KAN_LIST = ["甲","乙","丙","丁","戊","己","庚","辛","壬","癸"] as const;

function HachimonCell({ label, value }: { label: string; value: number }) {
  return (
    <div className="p-1.5 text-base">
      [ {label} ]<br />
      <span className="text-amber-700 font-bold">{value}</span>
    </div>
  );
}

export function HachimonSection({ result }: Props) {
  const { hachimon: hm, suuriTotal, suuriBreakdown } = result;

  return (
    <div className="border border-stone-200 rounded-lg p-6 relative bg-white">
      <span className="absolute -top-3 left-4 bg-stone-800 text-white px-3 py-1 rounded text-xs font-semibold tracking-widest">
        八門法・数理法
      </span>
      <div className="text-center pt-3">
        <table className="mx-auto border-collapse">
          <tbody>
            <tr>
              <td />
              <td className="text-center">
                <HachimonCell label={hm.nL} value={hm.nV} />
              </td>
              <td />
            </tr>
            <tr>
              <td><HachimonCell label={hm.wL} value={hm.wV} /></td>
              <td><HachimonCell label={hm.cL} value={hm.cV} /></td>
              <td><HachimonCell label={hm.eL} value={hm.eV} /></td>
            </tr>
            <tr>
              <td colSpan={3} className="text-center">
                <HachimonCell label={hm.sL} value={hm.sV} />
              </td>
            </tr>
          </tbody>
        </table>

        <div className="mt-4 text-sm">
          総エネルギー：
          <span className="text-amber-700 font-bold text-xl">{suuriTotal}</span> 点
        </div>

        <div className="flex justify-center gap-1 mt-2 flex-nowrap">
          {KAN_LIST.map((k) => (
            <div
              key={k}
              className="text-center px-1 py-1 bg-stone-50 rounded flex-1 min-w-0"
            >
              <div className="text-xs text-stone-400">{k}</div>
              <div className="text-sm font-semibold">{suuriBreakdown[k] ?? 0}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
