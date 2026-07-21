"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { PageHero } from "@/components/PageHero";
import { SiteHeader } from "@/components/SiteHeader";
import { SignalPanel } from "@/components/SignalPanel";
import { GitHubRepo, NewsItem, ArxivPaper, DevArticle } from "@/lib/types";
import { Radio, Github, Newspaper, FileText, NotebookPen, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import InterestPicker from "@/components/InterestPicker";
import { getInterests, matchScore, type InterestTag } from "@/lib/interests";

const HERO =
  "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=1920&q=80";

type Source = "all" | "github" | "news" | "papers" | "articles";

const SOURCES: {
  key: Source;
  label: string;
  icon: any;
  color: string;
  bg: string;
  border: string;
  dot: string;
}[] = [
  {
    key: "all",
    label: "全部",
    icon: Radio,
    color: "text-brand-cyan",
    bg: "bg-brand-cyan/10",
    border: "border-brand-cyan/30",
    dot: "bg-brand-cyan",
  },
  {
    key: "github",
    label: "GitHub",
    icon: Github,
    color: "text-sky-400",
    bg: "bg-sky-400/10",
    border: "border-sky-400/30",
    dot: "bg-sky-400",
  },
  {
    key: "news",
    label: "技术新闻",
    icon: Newspaper,
    color: "text-orange-400",
    bg: "bg-orange-400/10",
    border: "border-orange-400/30",
    dot: "bg-orange-400",
  },
  {
    key: "papers",
    label: "论文",
    icon: FileText,
    color: "text-purple-400",
    bg: "bg-purple-400/10",
    border: "border-purple-400/30",
    dot: "bg-purple-400",
  },
  {
    key: "articles",
    label: "社区文章",
    icon: NotebookPen,
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
    border: "border-emerald-400/30",
    dot: "bg-emerald-400",
  },
];

const SIGNAL_STEP = 12;

export default function SignalsPage() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [github, setGithub] = useState<GitHubRepo[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [papers, setPapers] = useState<ArxivPaper[]>([]);
  const [articles, setArticles] = useState<DevArticle[]>([]);
  const [activeSource, setActiveSource] = useState<Source>("all");
  const [signalQuery, setSignalQuery] = useState("");
  const [signalVisible, setSignalVisible] = useState(SIGNAL_STEP);
  const [interests, setInterests] = useState<InterestTag[]>([]);

  useEffect(() => { setInterests(getInterests()); }, []);

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    try {
      const [g, n, p, a] = await Promise.all([
        fetch("/api/github").then((r) => r.json()),
        fetch("/api/news").then((r) => r.json()),
        fetch("/api/papers").then((r) => r.json()),
        fetch("/api/articles").then((r) => r.json()),
      ]);
      setGithub(g.data || []);
      setNews(n.data || []);
      setPapers(p.data || []);
      setArticles(a.data || []);
      setLastUpdated(new Date());
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load(false);
    const id = setInterval(() => load(true), 5 * 60 * 1000);
    return () => clearInterval(id);
  }, [load]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      const keys = ["all", "github", "news", "papers", "articles"] as const;
      const num = parseInt(e.key);
      if (num >= 1 && num <= 5) { e.preventDefault(); setActiveSource(keys[num - 1]); }
      if (e.key === "r" && !e.ctrlKey && !e.metaKey) { e.preventDefault(); load(true); }
      if (e.key === "/") {
        e.preventDefault();
        const inp = document.querySelector<HTMLInputElement>('[placeholder*="搜索"]');
        inp?.focus();
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [load]);

  useEffect(() => setSignalVisible(SIGNAL_STEP), [activeSource, signalQuery]);

  const counts = useMemo(
    () => ({
      all: github.length + news.length + papers.length + articles.length,
      github: github.length,
      news: news.length,
      papers: papers.length,
      articles: articles.length,
    }),
    [github, news, papers, articles]
  );

  // text search handler
  const [queryInput, setQueryInput] = useState("");
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSignalQuery(queryInput);
  };

  return (
    <div className="min-h-screen bg-[#05060a]">
      <SiteHeader
        lastUpdated={lastUpdated}
        refreshing={refreshing}
        onRefresh={() => load(true)}
      />

      <PageHero
        title="实时前沿信号"
        subtitle="Live Intelligence Stream"
        description="GitHub 热门项目 · HN 技术讨论 · ArXiv 最新论文 · dev.to 社区精选"
        imageUrl={HERO}
        height="sm"
      />

      {/* ======================================== */}
      {/* STICKY FILTER BAR                          */}
      {/* ======================================== */}
      <div className="sticky top-14 z-40 bg-[#05060a]/90 backdrop-blur-xl border-b border-white/[0.04]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Tab row */}
          <div className="flex items-center gap-0.5 sm:gap-1.5 py-3 overflow-x-auto no-scrollbar">
            {SOURCES.map(({ key, label, icon: Icon, color, bg, border }) => {
              const active = activeSource === key;
              return (
                <button
                  key={key}
                  onClick={() => setActiveSource(key)}
                  className={cn(
                    "group relative flex items-center gap-2 sm:gap-2.5 px-3 sm:px-4 py-2.5 sm:py-3 rounded-2xl text-sm font-semibold transition-all duration-300 shrink-0",
                    active
                      ? `${bg} ${border} border ${color} shadow-sm`
                      : "text-white/40 hover:text-white/70 hover:bg-white/[0.03] border border-transparent"
                  )}
                >
                  <Icon size={17} className={cn(active ? color : "text-white/25 group-hover:text-white/50 transition-colors")} />
                  <span className="hidden sm:inline">{label}</span>
                  {/* Count badge */}
                  <span
                    className={cn(
                      "ml-0.5 px-1.5 py-0.5 rounded-full text-[11px] font-bold tabular-nums",
                      active
                        ? "bg-white/10 text-white/60"
                        : "bg-white/[0.04] text-white/25"
                    )}
                  >
                    {counts[key]}
                  </span>
                  {/* Active indicator dot (mobile) */}
                  {active && (
                    <span className={cn("absolute -bottom-[1px] left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full", color.replace("text-", "bg-"))} />
                  )}
                </button>
              );
            })}

            {/* Search (desktop, right-aligned) */}
            <div className="hidden sm:flex ml-auto pl-4 items-center gap-2">
              <InterestPicker onInterestsChange={setInterests} />
              <form onSubmit={handleSearch} className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25" />
                <input
                  value={queryInput}
                  onChange={(e) => setQueryInput(e.target.value)}
                  placeholder="搜索…"
                  className="w-44 pl-9 pr-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.06] text-sm text-white/80 placeholder:text-white/25 outline-none focus:border-brand-cyan/30 focus:bg-white/[0.06] transition-all"
                />
              </form>
            </div>
          </div>

          {/* Active source header */}
          {activeSource !== "all" && (
            <div className="pb-3 flex items-center gap-3">
              {(() => {
                const src = SOURCES.find((s) => s.key === activeSource);
                if (!src) return null;
                const Icon = src.icon;
                return (
                  <>
                    <div className={cn("flex items-center gap-1.5", src.color)}>
                      <Icon size={16} />
                      <span className="text-xs font-semibold uppercase tracking-wider">{src.label}</span>
                    </div>
                    <span className="text-xs text-white/20">{counts[activeSource]} 条</span>
                  </>
                );
              })()}
            </div>
          )}
        </div>
      </div>

      {/* Mobile search */}
      <div className="sm:hidden max-w-7xl mx-auto px-4 pt-4">
        <form onSubmit={handleSearch} className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25" />
          <input
            value={queryInput}
            onChange={(e) => setQueryInput(e.target.value)}
            placeholder="搜索信号…"
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06] text-sm text-white/80 placeholder:text-white/25 outline-none focus:border-brand-cyan/30 transition-all"
          />
        </form>
      </div>

      {/* ======================================== */}
      {/* SIGNAL LIST                               */}
      {/* ======================================== */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <SignalPanel
          loading={loading}
          github={github}
          news={news}
          papers={papers}
          articles={articles}
          activeSource={activeSource}
          signalQuery={signalQuery}
          signalVisible={signalVisible}
          interests={interests}
          onLoadMore={() => setSignalVisible((v) => v + SIGNAL_STEP)}
        />
      </main>
    </div>
  );
}
