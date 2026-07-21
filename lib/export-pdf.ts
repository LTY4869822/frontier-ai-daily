import { DailyCommentary, WeeklySummary } from "./types";

const CAT_COLORS: Record<string, string> = {
  "AI大模型": "#22d3ee",
  "GitHub开源": "#8b5cf6",
  "软件工程": "#3b82f6",
  "Agent与智能体": "#ec4899",
  "行业动态": "#f59e0b",
  "论文研究": "#10b981",
};

/**
 * Export weekly report as a beautiful print-ready PDF.
 * Opens a new browser window/tab with print-optimized HTML, then auto-triggers the print dialog.
 * The browser's native "Save as PDF" handles Chinese fonts perfectly.
 */
export function exportWeeklyPDF(
  summary: WeeklySummary,
  commentary?: DailyCommentary | null
): void {
  const max = Math.max(1, ...summary.buckets.map((b) => b.count));

  const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head><meta charset="utf-8"><title>AI 日报周报 — ${summary.weekStart}</title>
<style>
  @page { margin: 20mm 18mm; size: A4; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: "PingFang SC", "Microsoft YaHei", "Noto Sans SC", sans-serif;
    font-size: 13px; line-height: 1.7; color: #1a1a2e;
    background: #fff; padding: 0;
  }
  .header-bar { background: linear-gradient(90deg, #22d3ee, #8b5cf6); color: #fff; padding: 6px 0; text-align: center; font-size: 9px; letter-spacing: .4em; text-transform: uppercase; font-weight: 700; }
  .masthead { margin: 28px 0 20px; }
  .masthead h1 { font-size: 26px; font-weight: 900; letter-spacing: -0.02em; }
  .masthead .sub { font-size: 14px; font-weight: 600; color: #22d3ee; margin-top: 2px; }
  .masthead .date { font-size: 10px; color: #94a3b8; margin-top: 4px; }

  .stat-row { display: flex; gap: 10px; margin: 20px 0 24px; }
  .stat-badge { flex: 1; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px 12px; text-align: center; }
  .stat-badge .num { font-size: 20px; font-weight: 800; color: #0f172a; }
  .stat-badge .lbl { font-size: 9px; color: #94a3b8; margin-top: 2px; }

  .section { margin-bottom: 22px; page-break-inside: avoid; }
  .section h2 { font-size: 15px; font-weight: 700; color: #0f172a; margin-bottom: 8px; padding-bottom: 3px; border-bottom: 1.5px solid #e2e8f0; }

  p { font-size: 12px; color: #475569; line-height: 1.8; margin-bottom: 4px; }

  .tags { display: flex; flex-wrap: wrap; gap: 5px; margin: 6px 0; }
  .tag { padding: 3px 10px; border-radius: 20px; font-size: 10px; font-weight: 600; border: 1.5px solid #10b98133; background: #10b9810f; color: #10b981; }

  .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
  .cat-card { border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px; }
  .cat-card .cat-label { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 8px; font-weight: 700; text-transform: uppercase; margin-bottom: 6px; }
  .cat-card .cat-count { font-size: 20px; font-weight: 800; color: #0f172a; float: right; }
  .cat-bar { height: 3px; background: #f1f5f9; border-radius: 2px; overflow: hidden; margin: 5px 0 7px; }
  .cat-bar-fill { height: 100%; border-radius: 2px; }
  ul { list-style: none; font-size: 10px; color: #64748b; }
  ul li::before { content: "· "; color: #cbd5e1; }

  .footer { margin-top: 28px; padding-top: 10px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 8px; color: #cbd5e1; }
  @media print { body { padding: 0; } }
</style></head><body>
<div class="header-bar">FRONTIER AI DAILY · WEEKLY BRIEFING</div>

<div class="masthead">
  <h1>前沿 · AI 日报 本周趋势周报</h1>
  <div class="sub">Frontier Intelligence Weekly</div>
  <div class="date">周期：${summary.weekStart} ～ ${summary.weekEnd} ｜ 共 ${summary.totalHotspots} 条热点 ｜ ${new Date().toLocaleDateString("zh-CN")}</div>
</div>

<div class="stat-row">
  <div class="stat-badge"><div class="num">${summary.totalHotspots}</div><div class="lbl">本周热点</div></div>
  <div class="stat-badge"><div class="num">${summary.buckets.length}</div><div class="lbl">覆盖分类</div></div>
  <div class="stat-badge"><div class="num">${summary.learningFocus.length}</div><div class="lbl">学习重心</div></div>
  <div class="stat-badge"><div class="num">${summary.weekStart.slice(5)}</div><div class="lbl">周期起始</div></div>
</div>

<div class="section">
  <h2>📊 本周趋势判断</h2>
  <p>${summary.keyTrend || "暂无趋势判断"}</p>
</div>

${summary.learningFocus.length ? `
<div class="section">
  <h2>🎯 本周学习重心</h2>
  <div class="tags">${summary.learningFocus.map((f) => `<span class="tag">${f}</span>`).join("")}</div>
</div>` : ""}

<div class="section">
  <h2>📋 热点分类分布</h2>
  <div class="grid">
    ${summary.buckets.map((b) => {
      const color = CAT_COLORS[b.category] || "#cbd5e1";
      const pct = Math.round((b.count / max) * 100);
      return `<div class="cat-card">
        <span class="cat-label" style="background:${color}18;color:${color}">${b.category}</span>
        <span class="cat-count">${b.count}</span>
        <div class="cat-bar"><div class="cat-bar-fill" style="width:${pct}%;background:${color}"></div></div>
        <ul>${b.hotspots.slice(0, 5).map((h) => `<li>${h.title}</li>`).join("")}</ul>
      </div>`;
    }).join("")}
  </div>
</div>

${commentary ? `
<div class="section">
  <h2>🔍 今日速览</h2>
  <p>${commentary.headline || ""}${commentary.takeaways?.length ? "｜行动建议：" + commentary.takeaways.join("；") : ""}</p>
</div>` : ""}

<div class="footer">前沿 · AI 日报 — 自动化生成 — 仅供学习参考</div>
</body></html>`;

  const w = window.open("", "_blank");
  if (!w) return;
  w.document.write(html);
  w.document.close();
  w.onload = () => setTimeout(() => w.print(), 400);
}
