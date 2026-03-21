import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { isRateLimited } from "@/lib/rateLimit";
import { validateKanteiInput } from "@/lib/validateInput";

// 1分間に10回まで
const RATE_LIMIT = { limit: 10, windowMs: 60_000 };

export async function POST(req: NextRequest) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ error: "サーバー設定エラーです" }, { status: 500 });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    if (isRateLimited(ip, RATE_LIMIT)) {
      return NextResponse.json({ error: "リクエストが多すぎます。しばらくお待ちください。" }, { status: 429 });
    }

    const body = await req.json();
    const { name, birthday, gender } = body;

    const validation = validateKanteiInput(name, birthday, gender);
    if (!validation.ok) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "jpy",
            product_data: {
              name: "算命学 パーソナリティレポート",
              description: "算命学によるパーソナリティ鑑定レポート",
            },
            unit_amount: 1000,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${appUrl}/report/result?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/report`,
      metadata: {
        name: (name as string) || "",
        birthday,
        gender,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (e) {
    console.error("[checkout-report error]", e);
    return NextResponse.json(
      { error: "決済セッションの作成に失敗しました" },
      { status: 500 }
    );
  }
}
