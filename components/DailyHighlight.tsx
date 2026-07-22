"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Star, Zap, ExternalLink, TrendingUp, GitBranch, FileText, Loader2,
} from "lucide-react";
import { cn, formatNumber } from "@/lib/utils";

interface Highlight {
  id: string;
  source: "github" | "news" | "papers";
  title: string;
  titleZh?: string;
  subtitle?: string;
  url: string;
  meta: string;
  color: string;
  gradient: string;
  icon: React.ReactNode;
}

export default function DailyHighlight() {
  const [items, setItems] = useState<Highlight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/github").then((r) => r.json()).catch(() => ({ data: [] })),
      fetch("/api/news").then((r) => r.json()).catch(() => ({ data: [] })),
      fetch("/api/papers").then((r) => r.json()).catch(() => ({ data: [] })),
    ])
      .then(([g, n, p]) => {
        const github = g.data?.[0];
        const news = n.data?.[0];
        const paper = p.data?.[0];

        const result: Highlight[] = [];

        if (github) {
          result.push({
            id: `gh-${github.id}`,
            source: "github",
            title: `${github.owner ?? "?"}/${github.name}`,
            titleZh: github.descZh,
            url: github.url,
            meta: `⭐ ${formatNumber(github.stars)} · ${github.language || "—"}`,
            color: "text-sky-400",
            gradient: "from-sky-500/10 to-transparent",
            icon: <GitBranch size={16} className="text-sky-400" />,
          });
        }
        if (news) {
          result.push({
            id: `hn-${news.id}`,
            source: "news",
            title: news.titleZh || news.title,
            url: news.url || `https://news.ycombinator.com/item?id=${news.id}`,
            meta: `▲ ${formatNumber(news.points)} · 💬 ${news.comments || 0}`,
            color: "text-orange-400",
            gradient: "from-orange-500/10 to-transparent",
            icon: <TrendingUp size={16} className="text-orange-400" />,
          });
        }
        if (paper) {
          result.push({
            id: `ar-${paper.id}`,
            source: "papers",
            title: paper.titleZh || paper.title,
            titleZh: paper.summaryZh,
            url: paper.url,
            meta: paper.id || "",
            color: "text-purple-400",
            gradient: "from-purple-500/10 to-transparent",
            icon: <FileText size={16} className="text-purple-400" />,
          });
        }
        setItems(result);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-6">
        <div className="flex items-center gap-2 mb-3">
          <Loader2 size={14} className="animate-spin text-brand-cyan" />
          <span className="text-xs text-white/30">加载今日精选…</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton rounded-2xl h-28" />
          ))}
        </div>
      </div>
    );
  }

  if (!items.length) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 mt-8 sm:mt-10">
      <div className="flex items-center gap-2 mb-3">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand-cyan/10 border border-brand-cyan/20">
          <Zap size={13} className="text-brand-cyan" />
          <span className="text-[11px] font-bold text-brand-cyan tracking-wider uppercase">今日必看</span>
        </div>
        <span className="text-xs text-white/25">AI 智能精选</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
        {items.map((item, i) => (
          <motion.a
            key={item.id}
            href={item.url}
            target="_blank"
            rel="noreferrer"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={cn(
              "group card p-4 sm:p-5 hover:border-white/[0.12] transition-all relative overflow-hidden flex flex-col",
            )}
          >
            <div className={cn("absolute inset-0 bg-gradient-to-br pointer-events-none", item.gradient)} />
            <div className="flex items-start justify-between mb-2 relative z-10">
              <div className="flex items-center gap-1.5">
                {item.icon}
                <span className={cn("text-[10px] font-bold uppercase tracking-wider", item.color)}>
                  {item.source === "github" ? "GitHub" : item.source === "news" ? "Hacker News" : "ArXiv"}
                </span>
              </div>
              <ExternalLink size={13} className="text-white/15 group-hover:text-white/40 transition-colors shrink-0" />
            </div>
            <h3 className="text-sm font-bold text-white/90 line-clamp-2 leading-snug flex-1 relative z-10">
              {item.title}
            </h3>
            {item.titleZh && (
              <p className="text-xs text-white/40 line-clamp-1 mt-1 relative z-10">
                {item.titleZh}
              </p>
            )}
            <div className="flex items-center gap-2 mt-2 text-[11px] text-white/25 relative z-10">
              <Star size={11} className="shrink-0" />
              <span className="truncate">{item.meta}</span>
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  );
}
