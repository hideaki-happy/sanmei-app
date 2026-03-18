const VALID_GENDERS = ["男性", "女性"] as const;
const BIRTHDAY_RE = /^\d{4}-\d{2}-\d{2}$/;
const MIN_YEAR = 1874;
const MAX_YEAR = 2050;
const MAX_NAME_LENGTH = 50;

export interface ValidationResult {
  ok: boolean;
  error?: string;
}

export function validateKanteiInput(
  name: unknown,
  birthday: unknown,
  gender: unknown,
): ValidationResult {
  // gender
  if (typeof gender !== "string" || !VALID_GENDERS.includes(gender as typeof VALID_GENDERS[number])) {
    return { ok: false, error: "性別が不正です" };
  }

  // birthday
  if (typeof birthday !== "string" || !BIRTHDAY_RE.test(birthday)) {
    return { ok: false, error: "生年月日の形式が不正です（YYYY-MM-DD）" };
  }
  const [y, m, d] = birthday.split("-").map(Number);
  if (y < MIN_YEAR || y > MAX_YEAR) {
    return { ok: false, error: `生年は${MIN_YEAR}〜${MAX_YEAR}年の範囲で入力してください` };
  }
  const date = new Date(y, m - 1, d);
  if (date.getFullYear() !== y || date.getMonth() + 1 !== m || date.getDate() !== d) {
    return { ok: false, error: "存在しない日付です" };
  }

  // name（任意項目だが長さ制限）
  if (name !== undefined && name !== null) {
    if (typeof name !== "string" || name.length > MAX_NAME_LENGTH) {
      return { ok: false, error: `名前は${MAX_NAME_LENGTH}文字以内で入力してください` };
    }
  }

  return { ok: true };
}
