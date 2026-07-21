"use client";

const KEY = "frontier-interests";

const ALL_TAGS = [
  "AI大模型", "GitHub开源", "软件工程", "Agent与智能体",
  "行业动态", "论文研究", "安全", "前端开发", "Rust", "Python",
  "编译器", "数据库", "DevOps", "创业", "硬件",
] as const;

export type InterestTag = (typeof ALL_TAGS)[number];

export function getTags(): InterestTag[] {
  return ALL_TAGS as unknown as InterestTag[];
}

export function getInterests(): InterestTag[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    return JSON.parse(raw) as InterestTag[];
  } catch {
    return [];
  }
}

export function saveInterests(tags: InterestTag[]): void {
  localStorage.setItem(KEY, JSON.stringify(tags));
}

export function matchScore(text: string, interests: InterestTag[]): number {
  if (!interests.length) return 0;
  const lower = text.toLowerCase();
  let score = 0;
  for (const t of interests) {
    if (lower.includes(t.toLowerCase())) score += 3;
    // partial keyword match
    for (const w of t.split(/[\s\/]/)) {
      if (w.length > 1 && lower.includes(w.toLowerCase())) score += 1;
    }
  }
  return score;
}
