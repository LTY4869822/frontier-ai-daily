"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WeeklySummary } from "@/lib/types";
import { CategoryBadge, Reveal } from "./ui";
import {
  TrendingUp,
  Sparkles,
  Layers,
  ChevronDown,
  BarChart3,
  Target,
  Hash,
  Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";

const CATEGORY_ICONS: Record<string, string> = {
  "AI大模型": "🧠",
  "GitHub开源": "🐙",
  "软件工程": "⚙️",
  "Agent与智能体": "🤖",
  "行业动态": "📡",
  "论文研究": "📄",
};

export function WeeklySection({ summary }: { summary: WeeklySummary }) {
  const max = Math.max(1, ...summary.buckets.map((b) => b.count));
  const [open, setOpen] = useState(true);
  const total = summary.totalHotspots || summary.buckets.reduce((s, b) => s + b.count, 0);

  return (
    <div className="flex flex-col gap-6">
      {/* ---- 统计横幅 ---- */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-3"
      >
        {[
          {
            icon: Hash,
            value: total,
            label: "本周热点",
            color: "text-brand-cyan",
            bg: "from-brand-cyan/10 to-transparent",
          },
          {
            icon: Layers,
            value: summary.buckets.length,
            label: "覆盖分类",
            color: "text-brand-violet",
            bg: "from-brand-violet/10 to-transparent",
          },
          {
            icon: Target,
            value: summary.learningFocus.length,
            label: "学习重心",
            color: "text-brand-emerald",
            bg: "from-brand-emerald/10 to-transparent",
          },
          {
            icon: Calendar,
            value: summary.weekStart.slice(5),
            label: "数据周期",
            color: "text-brand-amber",
            bg: "from-brand-amber/10 to-transparent",
            suffix: ` ~ ${summary.weekEnd.slice(5)}`,
          },
        ].map(({ icon: Icon, value, label, color, bg, suffix }, i) => (
          <div
            key={label}
            className={cn(
              "relative overflow-hidden rounded-2xl p-4 border border-white/5 bg-gradient-to-br",
              bg
            )}
          >
            <Icon size={16} className={cn("mb-2", color)} />
            <div className={cn("text-xl sm:text-2xl font-extrabold", color)}>
              {value}
              {suffix && (
                <span className="text-xs font-normal text-white/30 ml-1">{suffix}</span>
              )}
            </div>
            <div className="text-[11px] text-white/40 mt-0.5">{label}</div>
          </div>
        ))}
      </motion.div>

      {/* ---- 趋势判断 ---- */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card p-5 sm:p-6 border-brand-violet/20 bg-gradient-to-br from-brand-violet/[0.06] via-transparent to-transparent relative overflow-hidden"
      >
        <div
          className="absolute top-0 right-0 w-32 h-32 rounded-full bg-brand-violet/5 blur-3xl pointer-events-none"
          aria-hidden="true"
        />
        <div className="flex items-center gap-2 text-brand-violet text-sm font-semibold mb-3 relative">
          <TrendingUp size={16} /> 本周趋势判断
        </div>
        <p className="text-fg-muted leading-relaxed text-sm relative">{summary.keyTrend}</p>
        {summary.learningFocus.length > 0 && (
          <div className="mt-4 relative">
            <div className="text-xs text-fg-subtle mb-2 flex items-center gap-1.5">
              <Sparkles size={13} /> 本周学习重心
            </div>
            <div className="flex flex-wrap gap-2">
              {summary.learningFocus.map((f, i) => (
                <span
                  key={i}
                  className="chip text-brand-emerald border-brand-emerald/30 bg-brand-emerald/10"
                >
                  {f}
                </span>
              ))}
            </div>
          </div>
        )}
      </motion.div>

      {/* ---- 分类分布 ---- */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="ghost-btn w-full justify-between mb-3"
        >
          <span className="flex items-center gap-1.5 text-fg-muted">
            <BarChart3 size={15} /> 热点分类分布（共 {total} 条）
          </span>
          <ChevronDown
            size={16}
            className={cn("transition-transform duration-300", open && "rotate-180")}
          />
        </button>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
                {summary.buckets.length ? (
                  summary.buckets.map((b, i) => (
                    <Reveal key={b.category} delay={i * 0.05}>
                      <div className="card p-4 flex flex-col gap-3 h-full hover:border-brand-cyan/20 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">
                              {CATEGORY_ICONS[b.category] || "📌"}
                            </span>
                            <CategoryBadge category={b.category} />
                          </div>
                          <div className="flex items-baseline gap-1">
                            <span className="text-xl font-extrabold text-fg-strong tabular-nums">
                              {b.count}
                            </span>
                            <span className="text-xs text-fg-subtle">条</span>
                          </div>
                        </div>

                        {/* Progress bar */}
                        <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden">
                          <motion.div
                            className="h-full rounded-full bg-gradient-to-r from-brand-cyan via-brand-blue to-brand-violet"
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.round((b.count / max) * 100)}%` }}
                            transition={{ duration: 0.8, delay: i * 0.1, ease: "easeOut" }}
                          />
                        </div>

                        <ul className="flex flex-col gap-1.5 mt-1">
                          {b.hotspots.slice(0, 4).map((h) => (
                            <li
                              key={h.id}
                              className="text-xs text-fg-subtle line-clamp-1 leading-relaxed"
                            >
                              {h.link ? (
                                <a
                                  href={h.link}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="hover:text-brand-cyan transition-colors"
                                >
                                  · {h.title}
                                </a>
                              ) : (
                                <span>· {h.title}</span>
                              )}
                            </li>
                          ))}
                          {b.hotspots.length > 4 && (
                            <li className="text-[10px] text-fg-subtle/50">
                              …还有 {b.hotspots.length - 4} 条
                            </li>
                          )}
                        </ul>
                      </div>
                    </Reveal>
                  ))
                ) : (
                  <p className="text-fg-subtle text-sm col-span-full">
                    暂无热点数据，每日自动化任务运行后自动补充。
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
