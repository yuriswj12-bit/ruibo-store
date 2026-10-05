/**
 * OE 零件号归一化。
 * 用户无论输入空格、连字符还是大小写混杂，入库与检索都使用同一结果。
 * 例: "0 258 006 027" / "0-258-006-027" -> "0258006027"
 */
export function normalizeOeNumber(input: string): string {
  if (!input) return "";
  return input.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
}

export function splitOeNumbers(raw: string): string[] {
  return raw
    .split(/[,;|/]/)
    .map((item) => item.trim())
    .filter(Boolean);
}
