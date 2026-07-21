"use client";

import { useMemo } from "react";
import { Activity, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { matchScore, type InterestTag } from "@/lib/interests";
import { GitHubRepo, NewsItem, ArxivPaper, DevArticle } from "@/lib/types";
import { GitHubCard, NewsCard, PaperCard, ArticleCard } from "@/components/cards";
import { SectionHeading, SearchInput, LoadMoreButton, Skeleton } from "@/components/ui";
import { matchSignal } from "@/lib/filter";
import { SIGNAL_SOURCES, type SignalSource } from "@/lib/signals";

interface SignalPanelProps {
  loading: boolean;
  github: GitHubRepo[];
  news: NewsItem[];
  papers: ArxivPaper[];
  articles: DevArticle[];
  /** 外部受控：当前来源 Tab（可选，不传则内部自理） */
  activeSource?: SignalSource;
  /** 外部受控：搜索词 */
  signalQuery?: string;
  /** 外部受控：当前显示条数 */
  signalVisible?: number;
  /** 外部受控：加载更多回调 */
  onLoadMore?: () => void;
  /** 兴趣标签 */
  interests?: InterestTag[];
}

export function SignalPanel({
  loading,
  github,
  news,
  papers,
  articles,
  activeSource,
  signalQuery,
  signalVisible: extVisible,
  onLoadMore,
  interests,
}: SignalPanelProps) {
  // ---- 搜索过滤（始终在组件内执行，保证单一数据源） ----
  const qGithub = useMemo(
    () => matchSignal(github, signalQuery ?? "", (r) => [r.name, r.description ?? ""]),
    [github, signalQuery]
  );
  const qNews = useMemo(
    () => matchSignal(news, signalQuery ?? "", (n) => [n.title, n.author, (n.tags || []).join(" ")]),
    [news, signalQuery]
  );
  const qPapers = useMemo(
    () => matchSignal(papers, signalQuery ?? "", (p) => [p.title, p.summary]),
    [papers, signalQuery]
  );
  const qArticles = useMemo(
    () => matchSignal(articles, signalQuery ?? "", (a) => [a.title, a.description]),
    [articles, signalQuery]
  );

  // ---- 合并流 + 来源过滤 + 兴趣排序 ----
  type Item = { id: string; source: SignalSource; label: string; node: JSX.Element; score: number };
  const combined = useMemo(() => {
    const list: Item[] = [];
    const tags = interests || [];
    qGithub.forEach((r) =>
      list.push({ id: `gh-${r.id}`, source: "github", label: "GitHub", node: <GitHubCard repo={r} />, score: tags.length ? matchScore((r.description ?? "") + " " + r.name, tags) : 0 })
    );
    qNews.forEach((n) =>
      list.push({ id: `hn-${n.id}`, source: "news", label: "新闻", node: <NewsCard item={n} />, score: tags.length ? matchScore(n.title, tags) : 0 })
    );
    qPapers.forEach((p) =>
      list.push({ id: `ar-${p.id}`, source: "papers", label: "论文", node: <PaperCard paper={p} />, score: tags.length ? matchScore(p.title + " " + p.summary, tags) : 0 })
    );
    qArticles.forEach((a) =>
      list.push({ id: `dv-${a.id}`, source: "articles", label: "社区", node: <ArticleCard article={a} />, score: tags.length ? matchScore(a.title + " " + a.description, tags) : 0 })
    );
    if (tags.length) list.sort((a, b) => b.score - a.score);
    const src = activeSource ?? "all";
    return src === "all" ? list : list.filter((i) => i.source === src);
  }, [qGithub, qNews, qPapers, qArticles, activeSource, interests]);

  const visible = extVisible ?? combined.length;
  const shown = combined.slice(0, visible);

  return (
    <div>
      {/* 搜索框（仅外部未提供 query 时显示内部搜索；多页架构下搜索由页面管理） */}
      {signalQuery !== undefined && (
        <div className="mb-5">
          <SearchInput
            value={signalQuery}
            onChange={() => {}} // 受控：由父组件管理
            placeholder="搜索信号（标题 / 描述 / 作者）"
            icon={<Search size={15} />}
            className="w-full sm:max-w-md"
          />
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
      ) : combined.length === 0 ? (
        <div className="card p-8 text-center flex flex-col items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-2xl surface border-line text-fg-subtle">
            <Search size={22} />
          </span>
          <h3 className="text-fg-strong font-medium">没有匹配的信号</h3>
          <p className="text-fg-subtle text-sm max-w-md leading-relaxed">
            当前的搜索词或来源筛选没有命中任何内容，试试调整关键词或切换来源。
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {shown.map((item) => (
              <div key={item.id} className="flex flex-col">
                {activeSource === "all" && (
                  <span className={cn(
                    "self-start inline-flex items-center gap-1.5 px-3 py-1 mb-2 rounded-xl text-xs font-bold tracking-wide uppercase z-10 relative",
                    item.source === "github" && "bg-sky-500/15 text-sky-400 border border-sky-500/30",
                    item.source === "news" && "bg-orange-500/15 text-orange-400 border border-orange-500/30",
                    item.source === "papers" && "bg-purple-500/15 text-purple-400 border border-purple-500/30",
                    item.source === "articles" && "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
                  )}>
                    {item.label}
                  </span>
                )}
                {item.node}
              </div>
            ))}
          </div>
          {onLoadMore && combined.length > visible && (
            <LoadMoreButton onClick={onLoadMore} label="加载更多信号" />
          )}
        </>
      )}
    </div>
  );
}
