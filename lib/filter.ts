import { Category, Hotspot } from "./types";

/**
 * Canonical category order used across the app (commentary filter chips,
 * weekly buckets, etc.). Mirrors the `Category` union in `lib/types.ts`.
 */
export const CATEGORIES: Category[] = [
  "AI大模型",
  "GitHub开源",
  "软件工程",
  "Agent与智能体",
  "行业动态",
  "论文研究",
];

/**
 * Filter AI commentary hotspots.
 *
 * - `query`: case-insensitive substring match across `title`, `summary`,
 *   `thinking` and each `learning` entry. Empty query = no keyword filter.
 * - `cats`: multi-select OR on `hotspot.category`. Empty array = all categories.
 *
 * The two dimensions combine with AND (both must pass). The original `items`
 * array is never mutated; a new filtered array is returned.
 */
export function filterHotspots(
  items: Hotspot[],
  query: string,
  cats: Category[]
): Hotspot[] {
  const q = query.trim().toLowerCase();
  const catSet = new Set(cats);

  return items.filter((h) => {
    if (catSet.size > 0 && !catSet.has(h.category)) return false;

    if (q) {
      const haystack = [
        h.title,
        h.summary,
        h.thinking,
        ...(h.learning || []),
      ]
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });
}

/**
 * Generic signal/entity filter. Matches `query` (case-insensitive substring)
 * against the concatenation of the strings returned by `fields(item)`.
 * An empty query returns the items unchanged.
 */
export function matchSignal<T>(
  items: T[],
  query: string,
  fields: (item: T) => string[]
): T[] {
  const q = query.trim().toLowerCase();
  if (!q) return items;
  return items.filter((item) => {
    const haystack = fields(item).join(" ").toLowerCase();
    return haystack.includes(q);
  });
}
