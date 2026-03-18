import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer, type DocumentProps } from "@react-pdf/renderer";
import { createElement, type ReactElement } from "react";
import path from "path";
import { readFileSync } from "fs";
import { processKantei } from "@/lib/sanmei";
import { ReportDocument, registerFonts } from "@/lib/pdf/ReportDocument";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { year, month, day, gender, name, currentYear } = body;

  const result = processKantei({ year, month, day, gender, name });
  if (!result) {
    return NextResponse.json({ error: "対応範囲外の年です" }, { status: 400 });
  }

  const cyear = parseInt(currentYear) || new Date().getFullYear();

  const fontsDir = path.join(process.cwd(), "public", "fonts");
  const toDataUrl = (file: string) => {
    const buf = readFileSync(path.join(fontsDir, file));
    return `data:font/truetype;base64,${buf.toString("base64")}`;
  };
  registerFonts(toDataUrl("NotoSerifJP-Regular.ttf"), toDataUrl("NotoSerifJP-Bold.ttf"));

  // 干支画像を base64 で読み込む
  const imageId = String(result.nichi.id).padStart(2, "0");
  const nichiKanshi = result.nichi.k + result.nichi.s;
  let imageSrc: string | undefined;
  try {
    const imgBuf = readFileSync(
      path.join(process.cwd(), "public", "image", "kanshi", `${imageId}_${nichiKanshi}.png`)
    );
    imageSrc = `data:image/png;base64,${imgBuf.toString("base64")}`;
  } catch {
    // 画像が見つからない場合はスキップ
  }

  let buffer: Buffer;
  try {
    const element = createElement(ReportDocument, { result, currentYear: cyear, imageSrc }) as ReactElement<DocumentProps>;
    buffer = await renderToBuffer(element);
  } catch (e) {
    console.error("[PDF-REPORT ERROR]", e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }

  const filename = `report_${result.name}_${year}${String(month).padStart(2, "0")}${String(day).padStart(2, "0")}.pdf`;

  return new NextResponse(buffer as unknown as BodyInit, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(filename)}`,
    },
  });
}
