import fs from "fs";
import path from "path";
import { DailyCommentary, Hotspot, WeeklySummary, Category } from "./types";

const DATA_DIR = path.join(process.cwd(), "data", "commentary");

function listFiles(): string[] {
  try {
    return fs
      .readdirSync(DATA_DIR)
      .filter((f) => f.endsWith(".json"))
      .sort()
      .reverse(); // newest first
  } catch {
    return [];
  }
}

function readFileSafe(name: string): DailyCommentary | null {
  try {
    const raw = fs.readFileSync(path.join(DATA_DIR, name), "utf-8");
    return JSON.parse(raw) as DailyCommentary;
  } catch {
    return null;
  }
}

export function getLatestCommentary(): DailyCommentary | null {
  const files = listFiles();
  for (const f of files) {
    const c = readFileSafe(f);
    if (c) return c;
  }
  return null;
}

export function getAllCommentary(): DailyCommentary[] {
  return listFiles()
    .map(readFileSafe)
    .filter((c): c is DailyCommentary => c !== null);
}

export function getWeeklySummary(): WeeklySummary {
  const all = getAllCommentary();
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 86400000);
  const weekStart = weekAgo.toISOString().slice(0, 10);
  const weekEnd = now.toISOString().slice(0, 10);

  const recent = all.filter((c) => c.date >= weekStart);
  const hotspots: Hotspot[] = recent.flatMap((c) => c.hotspots || []);

  const buckets: Record<string, Hotspot[]> = {};
  for (const h of hotspots) {
    (buckets[h.category] ||= []).push(h);
  }
  const ordered = Object.entries(buckets)
    .map(([category, list]) => ({
      category: category as Category,
      count: list.length,
      hotspots: list,
    }))
    .sort((a, b) => b.count - a.count);

  const total = hotspots.length;
  const topCategory = ordered[0]?.category ?? "AI大模型";
  const highImpact = hotspots
    .filter((h) => h.importance === "high")
    .slice(0, 6);
  const learningFocus = Array.from(
    new Set(highImpact.flatMap((h) => h.learning))
  ).slice(0, 8);

  const headline = recent.length
    ? `过去 7 天共捕捉 ${total} 个前沿热点，重心落在「${topCategory}」`
    : "本周暂无评论数据，以下内容来自实时信号归档。";

  const keyTrend = ordered.length
    ? `本周信号最强的方向是「${topCategory}」（占 ${ordered[0].count} 条），建议优先投入学习资源。`
    : "基于近 7 天归档信号自动生成，等待 AI 评论数据以提供深度趋势判断。";

  // optional curated override from the weekly automation (data/weekly/latest.json)
  let curated = null;
  try {
    const raw = fs.readFileSync(path.join(process.cwd(), "data", "weekly", "latest.json"), "utf-8");
    curated = JSON.parse(raw);
  } catch {
    curated = null;
  }

  // ---- Archive fallback: when no commentary exists, build summary from archive editions ----
  if (ordered.length === 0) {
    try {
      const { loadRecentEditions } = require("./archive-store");
      const editions = loadRecentEditions(7);
      const signalHotspots: Hotspot[] = [];
      let id = 0;
      for (const ed of editions) {
        for (const g of ed.github || []) {
          signalHotspots.push({
            id: `ar-gh-${++id}`, title: g.name, summary: g.descZh || g.description || g.name,
            thinking: "来自实时信号归档", learning: [], category: "GitHub开源" as Category,
            importance: "medium" as const, source: "GitHub", link: g.url,
          });
        }
        for (const n of (ed.news || []).slice(0, 5)) {
          signalHotspots.push({
            id: `ar-hn-${++id}`, title: n.titleZh || n.title, summary: n.titleZh || n.title,
            thinking: "来自实时信号归档", learning: [], category: "行业动态" as Category,
            importance: "medium" as const, source: "Hacker News", link: n.url,
          });
        }
      }
      const fbBuckets: Record<string, Hotspot[]> = {};
      for (const h of signalHotspots) (fbBuckets[h.category] ||= []).push(h);
      const fbOrdered = Object.entries(fbBuckets)
        .map(([category, list]) => ({ category: category as Category, count: list.length, hotspots: list.slice(0, 20) }))
        .sort((a, b) => b.count - a.count);

      return {
        weekStart, weekEnd, totalHotspots: signalHotspots.length,
        headline: `过去 7 天归档中捕获 ${signalHotspots.length} 条前沿信号（来自 ${editions.length} 天数据）`,
        buckets: fbOrdered, keyTrend: fbOrdered.length
          ? `归档信号覆盖 ${fbOrdered.length} 个类别，其中「${fbOrdered[0].category}」占比最高。` : "暂无信号数据。",
        learningFocus: [], curated: false,
      };
    } catch { /* fall through */ }
  }

  return {
    weekStart,
    weekEnd,
    totalHotspots: total,
    headline: curated?.headline || headline,
    buckets: ordered,
    keyTrend: curated?.keyTrend || keyTrend,
    learningFocus: curated?.learningFocus?.length ? curated.learningFocus : learningFocus,
    curated: !!curated,
  };
}
