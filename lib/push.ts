import { DailyCommentary, WeeklySummary } from "./types";

/**
 * Build a plain-text / WeChat-markdown summary suitable for pushing to
 * 企业微信 (markdown) or email (plain text). The same string works for both
 * channels; real delivery is stubbed in the route handler.
 */
export function buildPushText(
  summary: WeeklySummary,
  commentary?: DailyCommentary | null
): string {
  const lines: string[] = [];

  lines.push("# 前沿 · AI 日报 · 每日摘要");
  lines.push("");
  lines.push(
    `> 周期：${summary.weekStart} ~ ${summary.weekEnd} · 共 ${summary.totalHotspots} 条热点`
  );
  lines.push("");

  lines.push("【本周趋势】");
  lines.push(summary.keyTrend || "（暂无）");
  lines.push("");

  if (summary.learningFocus.length) {
    lines.push("【学习重心】");
    summary.learningFocus.forEach((f) => lines.push(`- ${f}`));
    lines.push("");
  }

  if (summary.buckets.length) {
    lines.push("【热点分类】");
    summary.buckets.forEach((b) => {
      const titles = b.hotspots
        .slice(0, 3)
        .map((h) => h.title)
        .join("、");
      lines.push(`- ${b.category}（${b.count} 条）：${titles}`);
    });
    lines.push("");
  }

  if (commentary) {
    lines.push("【今日速览】");
    lines.push(`日期：${commentary.date}`);
    if (commentary.headline) lines.push(`标题：${commentary.headline}`);
    if (commentary.takeaways?.length) {
      lines.push(`行动建议：${commentary.takeaways.join("；")}`);
    }
  }

  return lines.join("\n").trimEnd() + "\n";
}
