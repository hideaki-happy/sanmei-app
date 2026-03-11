import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer, type DocumentProps } from "@react-pdf/renderer";
import { createElement, type ReactElement } from "react";
import path from "path";
import { readFileSync } from "fs";
import { processKantei } from "@/lib/sanmei";
import { KanteiDocument, registerFonts } from "@/lib/pdf/KanteiDocument";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { year, month, day, gender, name, currentYear } = body;

  const result = processKantei({ year, month, day, gender, name });
  if (!result) {
    return NextResponse.json({ error: "対応範囲外の年です" }, { status: 400 });
  }

  const cyear = parseInt(currentYear) || new Date().getFullYear();

  // フォントを base64 data URL として渡す（react-pdf v4 のファイルパス問題を回避）
  const fontsDir = path.join(process.cwd(), "public", "fonts");
  const toDataUrl = (file: string) => {
    const buf = readFileSync(path.join(fontsDir, file));
    return `data:font/truetype;base64,${buf.toString("base64")}`;
  };
  registerFonts(toDataUrl("NotoSerifJP-Regular.ttf"), toDataUrl("NotoSerifJP-Bold.ttf"));

  let buffer: Buffer;
  try {
    const element = createElement(KanteiDocument, { result, currentYear: cyear }) as ReactElement<DocumentProps>;
    buffer = await renderToBuffer(element);
  } catch (e) {
    console.error("[PDF ERROR]", e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }

  const filename = `sanmei_${result.name}_${year}${String(month).padStart(2,"0")}${String(day).padStart(2,"0")}.pdf`;

  return new NextResponse(buffer as unknown as BodyInit, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(filename)}`,
    },
  });
}
