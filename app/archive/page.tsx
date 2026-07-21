"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  CalendarDays,
  GitBranch,
  Newspaper,
  FileText,
  BookOpen,
  ExternalLink,
  Loader2,
  AlertTriangle,
  Inbox,
} from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { PageHero } from "@/components/PageHero";
import BookmarkButton from "@/components/BookmarkButton";

interface ArchiveDay {
  date: string;
  window: { from: string; to: string };
  github: any[];
  news: any[];
  papers: any[];
  articles: any[];
}

function formatDateLabel(date: string) {
  const d = new Date(date + "T12:00:00");
  return `${d.getMonth() + 1}/${d.getDate()} ${["日","一","二","三","四","五","六"][d.getDay()]}周${
    ["日","一","二","三","四","五","六"][d.getDay()]
  }`;
}

function formatDateRange(day: ArchiveDay) {
  const from = new Date(day.window.from);
  const to = new Date(day.window.to);
  const fmt = (d: Date) =>
    `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  return `${fmt(from)} — ${fmt(to)}`;
}

export default function ArchivePage() {
  const [editions, setEditions] = useState<ArchiveDay[]>([]);
  const [active, setActive] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/archive")
      .then((r) => r.json())
      .then((d) => {
        if (d.ok) setEditions(d.editions || []);
        else setError(d.error || "加载失败");
      })
      .catch(() => setError("网络错误"))
      .finally(() => setLoading(false));
  }, []);

  const day = editions[active];

  return (
    <>
      <SiteHeader lastUpdated={null} refreshing={false} onRefresh={() => {}} />
      <PageHero
        title="七日归档"
        subtitle="每日 19:00 更新前一天 19:00 至当天的前沿信号精选"
        imageUrl="https://images.unsplash.com/photo-1506784365847-bbad939e9335?w=1200&q=80"
        imageAlt="Archive calendar background"
      />

      <section className="section py-8">
        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20 text-white/40 gap-3">
            <Loader2 size={22} className="animate-spin" />
            <span>加载归档数据…</span>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="flex flex-col items-center gap-3 py-20 text-red-400">
            <AlertTriangle size={32} />
            <p>{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="text-sm text-brand-cyan hover:underline mt-2"
            >
              重试
            </button>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && editions.length === 0 && (
          <div className="flex flex-col items-center gap-3 py-20 text-white/30">
            <Inbox size={48} />
            <p>暂无归档数据</p>
            <p className="text-xs">每日 19:00 自动生成，明天回来就有啦</p>
          </div>
        )}

        {/* Content */}
        {!loading && !error && editions.length > 0 && (
          <>
            {/* Date Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-3 mb-6 scrollbar-thin -mx-2 px-2">
              {editions.map((ed, i) => (
                <button
                  key={ed.date}
                  onClick={() => setActive(i)}
                  className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                    i === active
                      ? "bg-brand-cyan text-black shadow-lg shadow-brand-cyan/20"
                      : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/80"
                  }`}
                >
                  {formatDateLabel(ed.date)}
                </button>
              ))}
            </div>

            {/* Day Content */}
            {day && (
              <div className="space-y-6">
                {/* Window info */}
                <p className="text-xs text-white/30 text-center">
                  时间窗口：{formatDateRange(day)}（北京时间）
                </p>

                {/* GitHub Section */}
                {day.github.length > 0 && (
                  <SectionBlock
                    icon={<GitBranch size={18} />}
                    title="GitHub 热门仓库"
                    color="border-l-amber-400"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {day.github.map((g) => (
                        <Card key={g.id} href={g.url}>
                          <BookmarkButton
                            source="github" itemId={g.id} title={g.name} titleZh={g.name}
                            description={g.description} descZh={g.descZh} url={g.url}
                          />
                          <div className="flex items-center gap-2 mb-1">
                            {g.ownerAvatar && (
                              <img src={g.ownerAvatar} alt="" className="w-5 h-5 rounded-full" />
                            )}
                            <span className="text-sm font-semibold text-white truncate">{g.name}</span>
                            <span className="text-xs text-white/30 ml-auto">★{g.stars}</span>
                          </div>
                          <p className="text-xs text-white/60 line-clamp-2">
                            {g.descZh || g.description}
                          </p>
                          {g.language && (
                            <span className="inline-block mt-1 text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-white/40">
                              {g.language}
                            </span>
                          )}
                        </Card>
                      ))}
                    </div>
                  </SectionBlock>
                )}

                {/* News Section */}
                {day.news.length > 0 && (
                  <SectionBlock
                    icon={<Newspaper size={18} />}
                    title="Hacker News 热门"
                    color="border-l-orange-400"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {day.news.map((n) => (
                        <Card key={n.id} href={n.url} small>
                          <BookmarkButton
                            source="news" itemId={n.id} title={n.title} titleZh={n.titleZh}
                            description={null} url={n.url}
                          />
                          <div className="flex items-start gap-2">
                            <span className="text-xs text-orange-400 mt-0.5 shrink-0">
                              ▲{n.points}
                            </span>
                            <div>
                              <p className="text-sm text-white/90 line-clamp-2 font-medium">
                                {n.titleZh || n.title}
                              </p>
                              <p className="text-xs text-white/30 mt-0.5">
                                💬{n.comments || 0}
                              </p>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </SectionBlock>
                )}

                {/* Papers Section */}
                {day.papers.length > 0 && (
                  <SectionBlock
                    icon={<FileText size={18} />}
                    title="ArXiv 论文"
                    color="border-l-purple-400"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {day.papers.map((p) => (
                        <Card key={p.id} href={p.url} small>
                          <BookmarkButton
                            source="papers" itemId={p.id} title={p.title} titleZh={p.titleZh}
                            description={p.summary} descZh={p.summaryZh} url={p.url}
                          />
                          <h4 className="text-sm font-semibold text-white/90 line-clamp-2 mb-1">
                            {p.titleZh || p.title}
                          </h4>
                          {(p.summaryZh || p.summary) && (
                            <p className="text-xs text-white/50 line-clamp-2">
                              {p.summaryZh || p.summary}
                            </p>
                          )}
                        </Card>
                      ))}
                    </div>
                  </SectionBlock>
                )}

                {/* Articles Section */}
                {day.articles.length > 0 && (
                  <SectionBlock
                    icon={<BookOpen size={18} />}
                    title="dev.to 技术文章"
                    color="border-l-green-400"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {day.articles.map((a) => (
                        <Card key={a.id} href={a.url}>
                          {a.coverImage && (
                            <img src={a.coverImage} alt="" className="w-full h-28 object-cover rounded-lg mb-2" />
                          )}
                          <BookmarkButton
                            source="articles" itemId={a.id} title={a.title} titleZh={a.titleZh}
                            description={a.description} descZh={a.descZh} url={a.url}
                          />
                          <h4 className="text-sm font-semibold text-white/90 line-clamp-2">
                            {a.titleZh || a.title}
                          </h4>
                          <p className="text-xs text-white/50 line-clamp-2 mt-1">
                            {a.descZh || a.description}
                          </p>
                          <p className="text-xs text-white/30 mt-1">@{a.author}</p>
                        </Card>
                      ))}
                    </div>
                  </SectionBlock>
                )}
              </div>
            )}
          </>
        )}
      </section>
    </>
  );
}

/* ---- sub-components ---- */

function SectionBlock({
  icon,
  title,
  color,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`bg-white/5 rounded-2xl p-4 sm:p-5 border-l-2 ${color}`}>
      <h3 className="flex items-center gap-2 text-sm font-semibold text-white/80 mb-3">
        {icon} {title}
      </h3>
      {children}
    </div>
  );
}

function Card({
  href,
  small,
  children,
}: {
  href: string;
  small?: boolean;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`block bg-white/[0.03] hover:bg-white/[0.08] rounded-xl p-3 transition-all group relative ${
        small ? "" : ""
      }`}
    >
      {children}
      <ExternalLink
        size={12}
        className="absolute top-2 right-2 text-white/20 opacity-0 group-hover:opacity-100 transition-opacity"
      />
    </a>
  );
}
