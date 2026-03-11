"use client";

interface IsouLabelProps {
  text: string;
}

const BLUE_KEYWORDS = ["半会", "大半会", "支合", "律音", "合"];

export function IsouLabel({ text }: IsouLabelProps) {
  if (!text) return <span className="text-stone-400 text-xs">—</span>;

  return (
    <>
      {text.split("・").map((part, i) => {
        const isBlue = BLUE_KEYWORDS.some((b) => part.includes(b));
        const colorClass = isBlue
          ? "text-blue-700"
          : part.includes("比和")
          ? "text-stone-700"
          : "text-red-700";
        const label = part === "合" ? "支合" : part;
        return (
          <span key={i} className={`font-semibold text-xs ${colorClass}`}>
            {i > 0 ? " " : ""}
            {label}
          </span>
        );
      })}
    </>
  );
}
