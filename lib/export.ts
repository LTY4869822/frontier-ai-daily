import { DailyCommentary, Hotspot, WeeklySummary } from "./types";

/** Human-readable label for an importance level. */
function importanceLabel(level: Hotspot["importance"]): string {
  if (level === "high") return "重磅";
  if (level === "medium") return "关注";
  return "资讯";
}

/** Render a single hotspot as a numbered Markdown block. */
function hotspotBlock(h: Hotspot, n: number): string {
  return [
    `${n}. **${h.title}** — 来源：${h.source} · 重要性：${importanceLabel(h.importance)}`,
    `   - 摘要：${h.summary}`,
    `   - 思考：${h.thinking}`,
    `   - 怎么学：${(h.learning || []).join("；")}`,
    `   - 链接：${h.link || "—"}`,
  ].join("\n");
}

/**
 * Build a structured Markdown weekly report.
 *
 * @param summary   Weekly summary (trend, learning focus, category buckets).
 * @param commentary Optional latest daily commentary appended as "今日速览".
 * @returns A complete Markdown document string.
 */
export function buildWeeklyMarkdown(
  summary: WeeklySummary,
  commentary?: DailyCommentary | null
): string {
  const parts: string[] = [];

  parts.push("# 前沿 · AI 日报 · 本周热点总结");
  parts.push("");
  parts.push(
    `> 周期：${summary.weekStart} ~ ${summary.weekEnd} · 共 ${summary.totalHotspots} 条热点`
  );
  parts.push("");

  parts.push("## 本周趋势判断");
  parts.push(summary.keyTrend || "（暂无趋势判断）");
  parts.push("");

  parts.push("## 本周学习重心");
  if (summary.learningFocus.length) {
    summary.learningFocus.forEach((f) => parts.push(`- ${f}`));
  } else {
    parts.push("- （暂无学习重心）");
  }
  parts.push("");

  parts.push("## 热点分类分布");
  if (summary.buckets.length) {
    summary.buckets.forEach((b) => {
      parts.push(`### ${b.category}（${b.count} 条）`);
      b.hotspots.forEach((h, i) => parts.push(hotspotBlock(h, i + 1)));
      parts.push("");
    });
  } else {
    parts.push("_本周暂无分类热点数据。_");
    parts.push("");
  }

  if (commentary) {
    parts.push("## 今日速览（来自最新每日评论）");
    parts.push(`- 日期：${commentary.date}`);
    if (commentary.headline) parts.push(`- 标题：${commentary.headline}`);
    if (commentary.takeaways?.length) {
      parts.push(`- 行动建议：${commentary.takeaways.join("；")}`);
    }
    parts.push("");
  }

  // Collapse any accidental triple+ newlines, then ensure a trailing newline.
  return parts.join("\n").replace(/\n{3,}/g, "\n\n").trimEnd() + "\n";
}
