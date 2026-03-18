import type { NextConfig } from "next";

const securityHeaders = [
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      // Next.js インライン スクリプト + Stripe.js
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com",
      // スタイル
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      // フォント
      "font-src 'self' https://fonts.gstatic.com",
      // 画像（next/image のデータURL含む）
      "img-src 'self' data: blob:",
      // API通信 + Stripe
      "connect-src 'self' https://api.stripe.com",
      // Stripe Checkout iframe
      "frame-src https://js.stripe.com https://hooks.stripe.com https://checkout.stripe.com",
      // フォームのaction先
      "form-action 'self' https://checkout.stripe.com",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
