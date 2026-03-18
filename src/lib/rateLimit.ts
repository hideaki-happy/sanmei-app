/**
 * シンプルなインメモリレートリミッター
 * 同一IPから指定時間内に指定回数以上リクエストが来た場合にブロック
 * ※ Vercel Serverless では関数インスタンスごとに独立するため
 *    完全な一貫性は保証されないが、基本的な乱用防止として有効
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// 古いエントリを定期的に掃除（メモリリーク防止）
const CLEANUP_INTERVAL = 5 * 60 * 1000; // 5分
let lastCleanup = Date.now();

function cleanup() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  lastCleanup = now;
  for (const [key, entry] of store.entries()) {
    if (entry.resetAt < now) store.delete(key);
  }
}

export interface RateLimitOptions {
  /** 許可するリクエスト数 */
  limit: number;
  /** ウィンドウ幅（ミリ秒） */
  windowMs: number;
}

/**
 * @returns true = リミット超過（ブロックすべき）
 */
export function isRateLimited(ip: string, options: RateLimitOptions): boolean {
  cleanup();
  const now = Date.now();
  const entry = store.get(ip);

  if (!entry || entry.resetAt < now) {
    store.set(ip, { count: 1, resetAt: now + options.windowMs });
    return false;
  }

  entry.count += 1;
  if (entry.count > options.limit) return true;

  return false;
}
