import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer, type DocumentProps } from "@react-pdf/renderer";
import { createElement, type ReactElement } from "react";
import path from "path";
import { readFileSync } from "fs";
import Stripe from "stripe";
import { processKantei } from "@/lib/sanmei";
import { ReportDocument, registerFonts } from "@/lib/pdf/ReportDocument";
import { isRateLimited } from "@/lib/rateLimit";

// PDF生成は重い処理なので、1分間に5回までに制限
const RATE_LIMIT = { limit: 5, windowMs: 60_000 };

export async function POST(req: NextRequest) {
  // レートリミット：同一IPからの大量リクエストを防止
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (isRateLimited(`pdf-report:${ip}`, RATE_LIMIT)) {
    return NextResponse.json({ error: "リクエストが多すぎます。しばらくお待ちください。" }, { status: 429 });
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: "サーバー設定エラーです" }, { status: 500 });
  }

  const body = await req.json();
  const { session_id, currentYear } = body;

  // session_id の形式チェック
  if (!session_id || !/^cs_[a-zA-Z0-9_]+$/.test(session_id)) {
    return NextResponse.json({ error: "session_id が不正です" }, { status: 400 });
  }

  // Stripe で決済済みか確認（未決済ならPDFを生成しない）
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const session = await stripe.checkout.sessions.retrieve(session_id);
  if (session.payment_status !== "paid") {
    return NextResponse.json({ error: "決済が完了していません" }, { status: 402 });
  }

  // 決済セッションのメタデータから鑑定情報を取得（改ざん防止）
  const { name, birthday, gender } = session.metadata ?? {};
  if (!birthday || !gender) {
    return NextResponse.json({ error: "セッションデータが不正です" }, { status: 400 });
  }
  const [year, month, day] = birthday.split("-");

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

  // 干支画像はパブリックURLで指定（ファイル読み込みはサイズ制限超過のため使用不可）
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const imageId = String(result.nichi.id).padStart(2, "0");
  const nichiKanshi = result.nichi.k + result.nichi.s;
  const imageSrc = `${appUrl}/image/kanshi/${imageId}_${nichiKanshi}.png`;

  let buffer: Buffer;
  try {
    const element = createElement(ReportDocument, { result, currentYear: cyear, imageSrc }) as ReactElement<DocumentProps>;
    buffer = await renderToBuffer(element);
  } catch (e) {
    console.error("[PDF-REPORT ERROR]", e);
    // ユーザーには内部エラーの詳細を見せない（攻撃者にヒントを与えないため）
    return NextResponse.json({ error: "PDF生成に失敗しました" }, { status: 500 });
  }

  const filename = `report_${result.name}_${year}${String(month).padStart(2, "0")}${String(day).padStart(2, "0")}.pdf`;

  return new NextResponse(buffer as unknown as BodyInit, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(filename)}`,
    },
  });
}
