import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { isRateLimited } from "@/lib/rateLimit";

// 1分間に30回まで（リダイレクト直後に呼ばれるため少し緩め）
const RATE_LIMIT = { limit: 30, windowMs: 60_000 };

export async function GET(req: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (isRateLimited(ip, RATE_LIMIT)) {
    return NextResponse.json({ error: "リクエストが多すぎます。しばらくお待ちください。" }, { status: 429 });
  }

  const sessionId = req.nextUrl.searchParams.get("session_id");

  if (!sessionId || !/^cs_[a-zA-Z0-9_]+$/.test(sessionId)) {
    return NextResponse.json({ error: "session_id が不正です" }, { status: 400 });
  }

  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (session.payment_status !== "paid") {
    return NextResponse.json({ error: "決済が完了していません" }, { status: 402 });
  }

  const { name, birthday, gender } = session.metadata ?? {};

  if (!birthday || !gender) {
    return NextResponse.json({ error: "セッションデータが不正です" }, { status: 400 });
  }

  return NextResponse.json({ name, birthday, gender });
}
