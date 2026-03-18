import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { isRateLimited } from "@/lib/rateLimit";
import { validateKanteiInput } from "@/lib/validateInput";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// 1分間に10回まで
const RATE_LIMIT = { limit: 10, windowMs: 60_000 };

export async function POST(req: NextRequest) {
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
            name: "算命学 宿命鑑定",
            description: "算命学による本格鑑定書（PDF付き）",
          },
          unit_amount: 1000,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${appUrl}/kantei/result?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${appUrl}/kantei`,
    metadata: {
      name: (name as string) || "",
      birthday,
      gender,
    },
  });

  return NextResponse.json({ url: session.url });
}
