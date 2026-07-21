export interface GitHubRepo {
  id: number;
  name: string;
  fullName: string;
  description: string | null;
  url: string;
  homepage: string | null;
  language: string | null;
  stars: number;
  forks: number;
  openIssues: number;
  topics: string[];
  createdAt: string;
  pushedAt: string;
  owner: string;
  ownerAvatar: string;
  // 中文字段
  titleZh?: string;
  descZh?: string;
}

export interface NewsItem {
  id: number;
  title: string;
  url: string | null;
  author: string;
  points: number;
  comments: number;
  createdAt: number; // unix seconds
  tags: string[];
  // 中文字段
  titleZh?: string;
}

export interface ArxivPaper {
  id: string;
  title: string;
  summary: string;
  authors: string[];
  categories: string[];
  published: string;
  url: string;
  pdf: string;
  // 中文字段
  titleZh?: string;
  summaryZh?: string;
}

export interface DevArticle {
  id: number;
  title: string;
  url: string;
  description: string;
  tags: string[];
  positiveReactions: number;
  comments: number;
  publishedAt: string;
  coverImage: string | null;
  author: string;
  // 中文字段
  titleZh?: string;
  descZh?: string;
}

export type Category =
  | "AI大模型"
  | "GitHub开源"
  | "软件工程"
  | "Agent与智能体"
  | "行业动态"
  | "论文研究";

export interface Hotspot {
  id: string;
  title: string;
  source: string;
  category: Category;
  summary: string;
  thinking: string;
  learning: string[];
  importance: "high" | "medium" | "low";
  link?: string;
}

export interface DailyCommentary {
  date: string; // YYYY-MM-DD
  generatedBy: string;
  headline: string;
  hotspots: Hotspot[];
  takeaways: string[]; // 今日总览/行动建议
}

export interface WeeklyCategoryBucket {
  category: Category;
  count: number;
  hotspots: Hotspot[];
}

// ---------- 逐日归档版（完整信号 + AI 中文翻译，供七日归档页使用）----------
export interface ArchiveEdition {
  date: string; // YYYY-MM-DD（覆盖日）
  window: { from: string; to: string }; // ISO 8601，eg. 上个 19:00 → 当天 19:00
  generatedBy: string;
  generatedAt: string; // ISO 8601
  github: ArchiveGitHub[];
  news: ArchiveNews[];
  papers: ArchivePaper[];
  articles: ArchiveArticle[];
}

export interface ArchiveGitHub {
  id: number;
  name: string;
  fullName: string;
  description: string | null;
  url: string;
  language: string | null;
  stars: number;
  ownerAvatar: string;
  descZh?: string;
}

export interface ArchiveNews {
  id: number;
  title: string;
  url: string;
  points: number;
  comments: number;
  createdAt: number; // unix seconds
  titleZh?: string;
}

export interface ArchivePaper {
  id: string; // arxiv id
  title: string;
  summary: string;
  url: string;
  titleZh?: string;
  summaryZh?: string;
}

export interface ArchiveArticle {
  id: number;
  title: string;
  description: string;
  url: string;
  coverImage: string | null;
  author: string;
  titleZh?: string;
  descZh?: string;
}

// ---------- 收藏 ----------
export interface CollectionFolder {
  folderId: string;
  name: string;
  createdAt: string; // ISO 8601
}

export interface FavoriteItem {
  favId: string; // uuid，唯一定位一条收藏
  folderId?: string; // 所属收藏夹 id，为空 = 未分类
  source: "github" | "news" | "papers" | "articles";
  itemId: string; // 原始信号 id（数字型或字符串型，统一存为字符串方便 papers）
  title: string;
  titleZh?: string;
  description: string | null;
  descZh?: string;
  url: string;
  savedAt: string; // ISO 8601
}

export interface WeeklySummary {
  weekStart: string;
  weekEnd: string;
  totalHotspots: number;
  headline: string;
  buckets: WeeklyCategoryBucket[];
  keyTrend: string;
  learningFocus: string[];
  curated?: boolean;
}
