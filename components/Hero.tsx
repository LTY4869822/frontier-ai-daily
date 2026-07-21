"use client";

import { motion } from "framer-motion";
import { Sparkles, BrainCircuit } from "lucide-react";

export function Hero({ date, hotspots }: { date: string; hotspots: number }) {
  return (
    <section className="relative overflow-hidden">
      {/* softened ambient glow — lighter than before */}
      <div className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 h-48 w-[40rem] bg-gradient-to-r from-brand-cyan/10 via-brand-blue/10 to-brand-violet/10 blur-3xl rounded-full" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-10 pb-3">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="chip text-brand-cyan border-brand-cyan/30 bg-brand-cyan/10 mb-3">
            <Sparkles size={12} /> {date} · 每日自动更新
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.1]">
            <span className="gradient-text">AI 与软件前沿</span> 每日洞察
          </h1>
          <p className="mt-3 max-w-2xl text-fg-muted text-sm sm:text-base leading-relaxed">
            聚合 GitHub、Hacker News、ArXiv 与开发者社区的真实时信号，并由 AI 对每条热点给出
            <strong className="text-fg-strong">思考</strong>与<strong className="text-fg-strong">学习路径</strong>——让你不只是“知道”，而是“该怎么做”。
          </p>
          <div className="mt-4 flex items-center gap-2 text-xs text-fg-subtle">
            <BrainCircuit size={14} className="text-brand-violet" />
            <span className="text-fg-muted font-medium">今日 {hotspots} 篇 AI 深度评论</span>
            <span className="hidden sm:inline">· 数据源：GitHub · Hacker News · ArXiv · dev.to</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
