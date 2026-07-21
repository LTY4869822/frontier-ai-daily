"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { PageHero } from "@/components/PageHero";
import { SiteHeader } from "@/components/SiteHeader";
import { CommentaryCard } from "@/components/CommentaryCard";
import { CommentaryFilter } from "@/components/CommentaryFilter";
import { SectionHeading, Skeleton, Reveal, LoadMoreButton } from "@/components/ui";
import { WeeklyExportButton } from "@/components/WeeklyExportButton";
import { filterHotspots } from "@/lib/filter";
import { relativeDate } from "@/lib/utils";
import { DailyCommentary, Hotspot, Category } from "@/lib/types";
import {
  BrainCircuit,
  CalendarDays,
  Inbox,
  TrendingUp,
  ExternalLink,
  Lightbulb,
  BookOpen,
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

const HERO =
  "https://images.unsplash.com/photo-1639322537228-f740dcef593e?w=1920&q=80";

const CATEGORY_IMAGES: Record<string, string> = {
  "AI大模型": "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80",
  "GitHub开源": "https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=800&q=80",
  "软件工程": "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80",
  "Agent与智能体": "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80",
  "行业动态": "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80",
  "论文研究": "https://images.unsplash.com/photo-1532619675605-1ede6c2ed2b0?w=800&q=80",
};

const COMMENTARY_STEP = 6;

export default function InsightsPage() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [commentary, setCommentary] = useState<DailyCommentary | null>(null);
  const [weekly, setWeekly] = useState<{ data: any } | null>(null);
  const [query, setQuery] = useState("");
  const [activeCategories, setActiveCategories] = useState<Category[]>([]);
  const [visible, setVisible] = useState(COMMENTARY_STEP);

  const toggleCategory = useCallback((c: Category) => {
    setActiveCategories((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]));
  }, []);
  const clearFilters = useCallback(() => { setQuery(""); setActiveCategories([]); }, []);

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true); else setLoading(true);
    try {
      const [c, w] = await Promise.all([
        fetch("/api/commentary").then((r) => r.json()),
        fetch("/api/weekly").then((r) => r.json()),
      ]);
      setCommentary(c.data || null);
      setWeekly(w || null);
      setLastUpdated(new Date());
    } finally { setLoading(false); setRefreshing(false); }
  }, []);

  useEffect(() => { load(false); const id = setInterval(() => load(true), 5 * 60 * 1000); return () => clearInterval(id); }, [load]);
  useEffect(() => setVisible(COMMENTARY_STEP), [query, activeCategories]);

  const today = new Date().toISOString().slice(0, 10);
  const isFresh = commentary?.date === today;
  const filtered = useMemo(
    () => filterHotspots(commentary?.hotspots ?? [], query, activeCategories),
    [commentary, query, activeCategories]
  );

  const spotlight = filtered[0];
  const rest = filtered.slice(1);

  return (
    <div className="min-h-screen bg-[#05060a]">
      <SiteHeader lastUpdated={lastUpdated} refreshing={refreshing} onRefresh={() => load(true)} />

      <PageHero
        title="AI 深度评论"
        subtitle="Daily Insights & Learning Paths"
        description="每条热点都配有 AI 思考分析——不只告诉你发生了什么，还帮你理解为什么重要、该怎么学。"
        imageUrl={HERO}
        height="sm"
      />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-2 mb-6">
          <div>
            <h2 className="text-xl font-extrabold text-white tracking-tight">今日深度评论</h2>
            <p className="text-xs text-white/30 mt-1">AI 驱动的趋势分析与学习路径</p>
          </div>
          <div className="flex items-center gap-3">
            {commentary && (
              <span className="text-xs text-white/30 flex items-center gap-1.5">
                <CalendarDays size={13} />
                {relativeDate(commentary.date)}
                {isFresh && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/20">
                    今日
                  </span>
                )}
              </span>
            )}
            {weekly?.data && <WeeklyExportButton summary={weekly.data} commentary={commentary} />}
          </div>
        </div>

        {/* Filter */}
        {!loading && commentary && commentary.hotspots.length > 0 && (
          <CommentaryFilter
            query={query} onQueryChange={setQuery}
            selected={activeCategories} onToggleCategory={toggleCategory}
            onClear={clearFilters} resultCount={filtered.length}
          />
        )}

        {/* Headline + Takeaways */}
        {!loading && (commentary?.headline || commentary?.takeaways?.length) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-5 sm:p-6 rounded-2xl border border-brand-violet/15 bg-brand-violet/[0.03]"
          >
            {commentary?.headline && (
              <p className="text-sm text-white/70 leading-relaxed mb-3">{commentary.headline}</p>
            )}
            {commentary?.takeaways?.length ? (
              <div className="flex flex-wrap gap-2">
                {commentary.takeaways.map((t: string, i: number) => (
                  <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-brand-emerald/10 text-brand-emerald border border-brand-emerald/20">
                    <Lightbulb size={11} /> {t}
                  </span>
                ))}
              </div>
            ) : null}
          </motion.div>
        )}

        {/* Content */}
        {loading ? (
          <div className="space-y-6">
            <Skeleton className="h-72 rounded-2xl" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1,2,3,4].map((i) => <Skeleton key={i} className="h-56 rounded-2xl" />)}
            </div>
          </div>
        ) : filtered.length ? (
          <>
            {/* Spotlight — full width first card */}
            {spotlight && (
              <div className="mb-8">
                <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-brand-cyan mb-3">Spotlight</p>
                <CommentaryCard spot={spotlight} index={0} spotlight />
              </div>
            )}

            {/* Grid — remaining cards */}
            {rest.length > 0 && (
              <>
                <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-white/20 mb-3">
                  More Insights · {rest.length} 条
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {rest.slice(0, visible - 1).map((h: Hotspot, i: number) => (
                    <Reveal key={h.id} delay={i * 0.04}>
                      <CommentaryCard spot={h} index={i + 1} />
                    </Reveal>
                  ))}
                </div>
                {filtered.length > visible && (
                  <LoadMoreButton onClick={() => setVisible((v) => v + COMMENTARY_STEP)} label="加载更多评论" />
                )}
              </>
            )}
          </>
        ) : (
          <div className="card p-8 text-center flex flex-col items-center gap-3">
            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-white/[0.03] border border-white/5 text-white/20">
              <Inbox size={24} />
            </span>
            <h3 className="text-white/70 font-semibold">
              {commentary ? "没有匹配的评论" : "今日评论尚未生成"}
            </h3>
            <p className="text-white/25 text-sm max-w-md leading-relaxed">
              {commentary
                ? "试试调整搜索词或清除筛选条件。"
                : "深度评论由每日自动化任务生成，配置完成后将每日自动更新。"}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
