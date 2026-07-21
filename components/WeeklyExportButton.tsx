"use client";

import { Download, FileDown } from "lucide-react";
import { DailyCommentary, WeeklySummary } from "@/lib/types";

interface Props {
  summary: WeeklySummary;
  commentary?: DailyCommentary | null;
}

export function WeeklyExportButton({ summary, commentary }: Props) {

  const handlePDF = () => {
    import("@/lib/export-pdf").then(({ exportWeeklyPDF }) => {
      exportWeeklyPDF(summary, commentary);
    });
  };

  const handleMD = () => {
    import("@/lib/export").then(({ buildWeeklyMarkdown }) => {
      const md = buildWeeklyMarkdown(summary, commentary);
      const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `weekly-${summary.weekStart}.md`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  };

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={handlePDF}
        className="ghost-btn gap-1.5"
        title="导出 PDF（文字版）"
      >
        <FileDown size={14} />
        导出 PDF
      </button>
      <button
        type="button"
        onClick={handleMD}
        className="ghost-btn gap-1.5"
        title="导出 Markdown"
      >
        <Download size={14} /> 导出 MD
      </button>
    </div>
  );
}
