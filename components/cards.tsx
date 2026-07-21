"use client";

import { GitHubRepo, NewsItem, ArxivPaper, DevArticle } from "@/lib/types";
import { formatNumber, timeAgo } from "@/lib/utils";
import BookmarkButton from "./BookmarkButton";
import {
  Star,
  GitFork,
  MessageSquare,
  ExternalLink,
  FileText,
  Heart,
  CircleDot,
} from "lucide-react";

const langColor: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  Rust: "#dea584",
  Go: "#00ADD8",
  Cpp: "#f34b7d",
  "C++": "#f34b7d",
  Java: "#b07219",
  Ruby: "#701516",
  Swift: "#F05138",
  Kotlin: "#A97BFF",
};

export function GitHubCard({ repo }: { repo: GitHubRepo }) {
  const color = repo.language ? langColor[repo.language] || "#9ca3af" : "#9ca3af";
  return (
    <a
      href={repo.url}
      target="_blank"
      rel="noreferrer"
      className="card card-hover p-4 flex flex-col gap-2.5 h-full group relative"
    >
      <BookmarkButton
        source="github"
        itemId={repo.id}
        title={repo.name}
        titleZh={repo.name}
        description={repo.description}
        descZh={repo.descZh}
        url={repo.url}
      />
      <div className="flex items-center gap-2 min-w-0">
        <img
          src={repo.ownerAvatar}
          alt=""
          className="h-6 w-6 rounded-md border-line shrink-0"
          loading="lazy"
        />
        <span className="text-sm text-fg-subtle truncate">{repo.owner}</span>
        <span className="text-fg-subtle">/</span>
        <span className="font-semibold text-fg truncate">{repo.name}</span>
      </div>
      <p className="text-sm text-fg-muted line-clamp-2 leading-relaxed min-h-[2.5rem]">
        {repo.description || "暂无描述"}
      </p>
      {/* 中文摘要 */}
      {repo.descZh && repo.descZh !== repo.description && (
        <p className="text-xs text-brand-cyan bg-brand-cyan/5 border-l-2 border-brand-cyan/40 pl-2 py-0.5 rounded-r line-clamp-2">
          {repo.descZh}
        </p>
      )}
      <div className="mt-auto flex items-center gap-3 text-xs text-fg-subtle pt-1">
        {repo.language && (
          <span className="flex items-center gap-1">
            <CircleDot size={12} style={{ color }} />
            {repo.language}
          </span>
        )}
        <span className="flex items-center gap-1">
          <Star size={12} className="text-brand-amber" /> {formatNumber(repo.stars)}
        </span>
        <span className="flex items-center gap-1">
          <GitFork size={12} /> {formatNumber(repo.forks)}
        </span>
      </div>
    </a>
  );
}

export function NewsCard({ item }: { item: NewsItem }) {
  const href = item.url || `https://news.ycombinator.com/item?id=${item.id}`;
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="card card-hover p-4 flex flex-col gap-2 h-full group relative"
    >
      <BookmarkButton
        source="news"
        itemId={item.id}
        title={item.title}
        titleZh={item.titleZh}
        description={null}
        url={href}
      />
      <h4 className="text-sm font-medium text-fg-strong leading-snug line-clamp-3">
        {item.title}
      </h4>
      {/* 中文摘要 */}
      {item.titleZh && item.titleZh !== item.title && (
        <p className="text-xs text-brand-cyan bg-brand-cyan/5 border-l-2 border-brand-cyan/40 pl-2 py-0.5 rounded-r line-clamp-2">
          🇨🇳 {item.titleZh}
        </p>
      )}
      <div className="mt-auto flex items-center gap-3 text-xs text-fg-subtle pt-1">
        <span className="flex items-center gap-1 text-brand-amber">
          <Star size={12} /> {formatNumber(item.points)}
        </span>
        <span className="flex items-center gap-1">
          <MessageSquare size={12} /> {formatNumber(item.comments)}
        </span>
        <span className="ml-auto">{timeAgo(item.createdAt)}</span>
      </div>
    </a>
  );
}

export function PaperCard({ paper }: { paper: ArxivPaper }) {
  return (
    <a
      href={paper.url}
      target="_blank"
      rel="noreferrer"
      className="card card-hover p-4 flex flex-col gap-2 h-full group relative"
    >
      <BookmarkButton
        source="papers"
        itemId={paper.id}
        title={paper.title}
        titleZh={paper.titleZh}
        description={paper.summary}
        descZh={paper.summaryZh}
        url={paper.url}
      />
      <div className="flex items-center gap-1.5 text-[11px] text-brand-blue">
        <FileText size={12} />
        <span className="font-mono">{paper.id}</span>
        <span className="text-fg-subtle ml-auto">{paper.published}</span>
      </div>
      <h4 className="text-sm font-medium text-fg-strong leading-snug line-clamp-2">
        {paper.title}
      </h4>
      {/* 中文标题摘要 */}
      {paper.titleZh && paper.titleZh !== paper.title && (
        <p className="text-xs text-brand-cyan bg-brand-cyan/5 border-l-2 border-brand-cyan/40 pl-2 py-0.5 rounded-r line-clamp-1">
          🇨🇳 {paper.titleZh}
        </p>
      )}
      <p className="text-xs text-fg-muted line-clamp-3 leading-relaxed">
        {paper.summary}
      </p>
      {/* 中文摘要 */}
      {paper.summaryZh && paper.summaryZh !== paper.summary && (
        <p className="text-xs text-brand-cyan/80 bg-brand-cyan/5 border-l-2 border-brand-cyan/30 pl-2 py-0.5 rounded-r line-clamp-2">
          {paper.summaryZh}
        </p>
      )}
      <div className="mt-auto flex items-center gap-2 flex-wrap pt-1">
        {paper.categories.slice(0, 3).map((c) => (
          <span key={c} className="chip text-[10px] text-fg-subtle">{c}</span>
        ))}
        {paper.authors[0] && (
          <span className="text-[11px] text-fg-subtle ml-auto truncate max-w-[50%]">
            {paper.authors[0]}
            {paper.authors.length > 1 ? " 等" : ""}
          </span>
        )}
      </div>
    </a>
  );
}

export function ArticleCard({ article }: { article: DevArticle }) {
  return (
    <a
      href={article.url}
      target="_blank"
      rel="noreferrer"
      className="card card-hover p-4 flex flex-col gap-2 h-full group relative"
    >
      {article.coverImage && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={article.coverImage}
          alt=""
          className="h-28 w-full object-cover rounded-lg border-line"
          loading="lazy"
        />
      )}
      <BookmarkButton
        source="articles"
        itemId={article.id}
        title={article.title}
        titleZh={article.titleZh}
        description={article.description}
        descZh={article.descZh}
        url={article.url}
      />
      <h4 className="text-sm font-medium text-fg-strong leading-snug line-clamp-2">
        {article.title}
      </h4>
      {/* 中文标题摘要 */}
      {article.titleZh && article.titleZh !== article.title && (
        <p className="text-xs text-brand-cyan bg-brand-cyan/5 border-l-2 border-brand-cyan/40 pl-2 py-0.5 rounded-r line-clamp-1">
          🇨🇳 {article.titleZh}
        </p>
      )}
      <p className="text-xs text-fg-muted line-clamp-2 leading-relaxed">
        {article.description}
      </p>
      {/* 中文描述摘要 */}
      {article.descZh && article.descZh !== article.description && (
        <p className="text-xs text-brand-cyan/80 bg-brand-cyan/5 border-l-2 border-brand-cyan/30 pl-2 py-0.5 rounded-r line-clamp-2">
          {article.descZh}
        </p>
      )}
      <div className="mt-auto flex items-center gap-3 text-xs text-fg-subtle pt-1">
        <span className="flex items-center gap-1">
          <Heart size={12} className="text-brand-pink" /> {formatNumber(article.positiveReactions)}
        </span>
        <span className="flex items-center gap-1">
          <MessageSquare size={12} /> {formatNumber(article.comments)}
        </span>
        <span className="ml-auto truncate max-w-[40%]">{article.author}</span>
      </div>
    </a>
  );
}
