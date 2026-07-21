"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Github,
  Newspaper,
  CalendarDays,
  ArrowRight,
  Sparkles,
  TrendingUp,
  BookOpen,
  FileText,
  GitBranch,
  Star,
  Zap,
  ExternalLink,
  ChevronRight,
  Monitor,
  Smartphone,
  Globe,
  Clock4,
} from "lucide-react";
import { cn, formatNumber } from "@/lib/utils";
import DailyHighlight from "@/components/DailyHighlight";

/* ================================================
   CURATED IMAGES — smaller sizes for mobile, quality for desktop
   ================================================ */
const IMG_HERO =
  "https://images.unsplash.com/photo-1509228627152-72ae9ae6848d?w=1200&q=80";
const IMG_DIVIDER =
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1000&q=70";
const IMG_MOUNTAINS =
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1000&q=70";
const IMG_CITY =
  "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1000&q=70";

/* ================================================
   TODAY PULSE — live signal preview
   ================================================ */
function useTodayPulse() {
  const [github, setGithub] = useState<any[]>([]);
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const load = () =>
      Promise.all([
        fetch("/api/github").then((r) => r.json()),
        fetch("/api/news").then((r) => r.json()),
      ])
        .then(([g, n]) => {
          setGithub((g.data || []).slice(0, 3));
          setNews((n.data || []).slice(0, 3));
        })
        .finally(() => setLoading(false));
    load();
    const t = setInterval(load, 300_000);
    return () => clearInterval(t);
  }, []);
  return { github, news, loading };
}

/* ================================================
   PAGE
   ================================================ */
export default function HomePage() {
  const { github, news, loading } = useTodayPulse();

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#080b10]">
      {/* ============================================ */}
      {/* HERO — editorial statement                     */}
      {/* ============================================ */}
      <section className="relative min-h-[70vh] sm:min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Mountain background */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat sm:bg-fixed"
          style={{ backgroundImage: `url(${IMG_HERO})` }}
        />
        {/* Subtle layered gradient — lets image breathe */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#080b10]/70 via-[#080b10]/50 to-[#080b10]" />
        {/* Warm accent glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-amber-400/5 blur-[120px]" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <p className="text-[11px] sm:text-xs font-medium tracking-[0.35em] uppercase text-amber-200/80 mb-5 sm:mb-7">
              前沿 · AI 日报
            </p>
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[1.08] mb-5 sm:mb-7">
              <span className="text-white">
                今天的前沿信号
              </span>
              <br />
              <span className="text-white/70">
                明天的行动指南
              </span>
            </h1>
            <p className="text-sm sm:text-base text-white/35 max-w-lg mx-auto leading-relaxed mb-8 sm:mb-10">
              每天 19:00，精选全球 AI 与软件工程前沿动态，
              中英双语，AI 深度评论，手机电脑随时看。
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link
                href="/signals"
                className="group inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-bold text-[#080b10] hover:bg-white/90 transition-all"
              >
                <Zap size={16} />
                开始浏览
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/archive"
                className="group inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.02] hover:bg-white/[0.06] px-7 py-3 text-sm font-medium text-white/80 backdrop-blur-sm transition-all"
              >
                七日归档
              </Link>
            </div>
            <div className="mt-10 flex items-center justify-center gap-2">
              <span className="relative flex h-2 h-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              <span className="text-[11px] text-white/30">
                每 5 分钟自动刷新 · 每天 19:00 更新日报
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============================================ */}
      {/* TODAY'S MUST-READ */}
      {/* ============================================ */}
      <DailyHighlight />

      {/* ============================================ */}
      {/* DIVIDER — nature image break                  */}
      {/* ============================================ */}
      <div className="relative h-40 sm:h-80 my-12 sm:my-20 overflow-hidden">
        <img src={IMG_DIVIDER} alt="" className="w-full h-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#080b10] via-transparent to-[#080b10]" />
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-xl sm:text-2xl font-light tracking-[0.3em] text-white/40">
            不止聚合 · 为你思考
          </p>
        </div>
      </div>

      {/* ============================================ */}
      {/* TODAY PULSE — live signal strip              */}
      {/* ============================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-6"
        >
          <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-amber-200/50 mb-2">
            Live Now
          </p>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-1">今日脉搏</h2>
          <p className="text-sm text-white/25">实时精选 · 每 5 分钟刷新</p>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton rounded-2xl h-32" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {github.slice(0, 2).map((repo) => (
              <motion.a
                key={repo.id}
                href={repo.url}
                target="_blank"
                rel="noreferrer"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="group card p-4 sm:p-5 hover:border-white/[0.08] transition-all"
              >
                <p className="text-[10px] font-semibold tracking-wider uppercase text-sky-400 mb-2">GitHub</p>
                <div className="flex items-start gap-3">
                  <img src={repo.ownerAvatar} alt="" className="w-8 h-8 rounded-lg shrink-0" loading="lazy" />
                  <div className="min-w-0 flex-1">
                    <h4 className="text-sm font-bold text-white/90 truncate">
                      {repo.owner ?? "?"}/{repo.name}
                    </h4>
                    {repo.descZh && repo.descZh !== repo.description && (
                      <p className="text-xs text-white/40 mt-0.5 line-clamp-1">{repo.descZh}</p>
                    )}
                    <div className="flex items-center gap-3 mt-2 text-[11px] text-white/25">
                      <span className="flex items-center gap-1"><Star size={11} /> {formatNumber(repo.stars)}</span>
                      {repo.language && <span>{repo.language}</span>}
                    </div>
                  </div>
                </div>
              </motion.a>
            ))}
            {news[0] && (
              <motion.a
                key={news[0].id}
                href={news[0].url || `https://news.ycombinator.com/item?id=${news[0].id}`}
                target="_blank"
                rel="noreferrer"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="group card p-4 sm:p-5 flex flex-col hover:border-white/[0.08] transition-all"
                style={{ background: "linear-gradient(135deg, rgba(245,158,11,0.04) 0%, transparent 50%)" }}
              >
                <p className="text-[10px] font-semibold tracking-wider uppercase text-orange-400 mb-1">Hacker News</p>
                <h4 className="text-sm font-bold text-white/90 line-clamp-3 leading-snug flex-1">
                  {news[0].titleZh || news[0].title}
                </h4>
                <div className="flex items-center gap-3 mt-3 text-[11px] text-white/25">
                  <span className="flex items-center gap-1 text-orange-400">
                    <TrendingUp size={11} /> {formatNumber(news[0].points)}
                  </span>
                  <span>{news[0].comments} 评论</span>
                </div>
              </motion.a>
            )}
          </div>
        )}
      </section>

      {/* ============================================ */}
      {/* DIVIDER — cityscape                             */}
      {/* ============================================ */}
      <div className="relative h-32 sm:h-64 overflow-hidden">
        <img src={IMG_CITY} alt="" className="w-full h-full object-cover opacity-60" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#080b10] via-transparent to-[#080b10]" />
      </div>

      {/* ============================================ */}
      {/* NETWORK — 4 sources                            */}
      {/* ============================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-[10px] font-semibold tracking-[0.3em] uppercase text-amber-200/50 mb-3">Global Sources</p>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">四路实时数据源</h2>
          <p className="mt-3 text-base text-white/25">全天候追踪 AI 与软件工程前沿动态</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {[
            { label: "GitHub", sub: "全球最大的代码托管平台，实时追踪热门开源项目", icon: Github, color: "#f0f6fc" },
            { label: "Hacker News", sub: "硅谷顶级技术社区，捕捉前沿讨论与行业风向", icon: Newspaper, color: "#ff6600" },
            { label: "ArXiv", sub: "学术论文预印本平台，跟进 AI / ML 最新研究", icon: FileText, color: "#b31b1b" },
            { label: "dev.to", sub: "开发者社区精选，实战经验与工具推荐", icon: BookOpen, color: "#4ade80" },
          ].map(({ label, sub, icon: Icon, color }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="group relative rounded-3xl p-6 sm:p-7 border border-white/[0.03] bg-white/[0.01] hover:bg-white/[0.02] hover:border-white/[0.06] transition-all duration-500"
            >
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                style={{ background: `${color}15` }}
              >
                <Icon size={20} style={{ color }} />
              </div>
              <h3 className="text-base font-bold text-white mb-2">{label}</h3>
              <p className="text-[13px] text-white/30 leading-relaxed">{sub}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ============================================ */}
      {/* CAPABILITIES — 3 feature cards with images    */}
      {/* ============================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20 border-t border-white/[0.04]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-[10px] font-semibold tracking-[0.3em] uppercase text-amber-200/50 mb-3">Why This Matters</p>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">消除信息焦虑</h2>
          <p className="mt-3 text-base text-white/25 max-w-lg mx-auto">
            从「刷到了」到「学会了」，每条信号都配有 AI 深度分析
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          {[
            {
              title: "深度评论",
              desc: "每天 AI 对前沿动态生成趋势分析、要点提炼与 actionable 学习路径。",
              href: "/insights",
              btn: "查看评论",
              img: "https://images.unsplash.com/photo-1512314889357-e157c22f938d?w=400&q=70",
              icon: Sparkles,
              accent: "border-amber-400/30",
            },
            {
              title: "实时信号",
              desc: "GitHub、HN、ArXiv、dev.to，四路数据源实时汇聚，按兴趣排序。",
              href: "/signals",
              btn: "浏览信号",
              img: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&q=70",
              icon: TrendingUp,
              accent: "border-sky-400/30",
            },
            {
              title: "每周总结",
              desc: "自动聚合 7 天热点，分类统计分布，提炼关键趋势与学习重心。",
              href: "/weekly",
              btn: "查看周报",
              img: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&q=70",
              icon: CalendarDays,
              accent: "border-emerald-400/30",
            },
          ].map(({ title, desc, href, btn, img, icon: Icon, accent }, i) => (
            <motion.div
              key={href}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={cn(
                "group relative rounded-3xl overflow-hidden border border-white/[0.04] bg-white/[0.01]",
                "hover:bg-white/[0.02] hover:border-white/[0.08] transition-all duration-500",
                accent
              )}
            >
              <div className="relative h-44 overflow-hidden">
                <img src={img} alt={title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#080b10] via-[#080b10]/20 to-transparent" />
                <div className="absolute bottom-4 left-4 flex items-center gap-3">
                  <Icon size={16} className="text-white" />
                  <span className="text-xs font-bold tracking-wider uppercase text-white/60">{title}</span>
                </div>
              </div>
              <div className="p-5 sm:p-6">
                <p className="text-[13px] leading-relaxed text-white/35 mb-4">{desc}</p>
                <Link href={href} className="inline-flex items-center gap-1.5 text-sm font-semibold text-amber-200/70 hover:text-amber-200 transition-colors">
                  {btn} <ArrowRight size={14} />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ============================================ */}
      {/* PROCESS — natural background                   */}
      {/* ============================================ */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <img src={IMG_MOUNTAINS} alt="" className="w-full h-full object-cover opacity-[0.06]" loading="lazy" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#080b10] via-transparent to-[#080b10]" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <p className="text-[10px] font-semibold tracking-[0.3em] uppercase text-amber-200/50 mb-3">Pipeline</p>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">每天 19:00 · 全自动运转</h2>
            <p className="mt-3 text-base text-white/25">无需人工干预，AI 驱动的内容生产线</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 sm:gap-8">
            {[
              { step: "01", title: "实时抓取", desc: "每 5 分钟轮询 4 路数据源，抓取最新信号", icon: Globe },
              { step: "02", title: "AI 翻译分析", desc: "精准中文翻译 + 深度评论 + 学习路径", icon: Sparkles },
              { step: "03", title: "分类归档", desc: "按 6 大领域自动归类，存入每日归档", icon: CalendarDays },
              { step: "04", title: "每周总结", desc: "周一自动生成热点分布趋势周报 + PDF", icon: TrendingUp },
            ].map(({ step, title, desc, icon: Icon }, i) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative flex flex-col items-center text-center"
              >
                {i < 3 && (
                  <div className="hidden sm:block absolute top-5 left-[62%] w-[76%] h-px bg-gradient-to-r from-white/10 to-transparent" />
                )}
                <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/[0.04] flex items-center justify-center mb-4">
                  <Icon size={22} className="text-white/50" />
                </div>
                <span className="absolute top-0 right-0 text-5xl font-black text-white/[0.015] select-none">{step}</span>
                <h4 className="text-sm font-bold text-white/80 mb-1">{title}</h4>
                <p className="text-xs text-white/30 leading-relaxed max-w-[200px]">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* CROSS-DEVICE — phone + desktop                 */}
      {/* ============================================ */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center justify-center gap-8 sm:gap-16 mb-10">
            <div className="flex flex-col items-center gap-2">
              <Monitor size={32} className="text-white/40" />
              <span className="text-xs text-white/30">电脑端</span>
            </div>
            <div className="text-white/10 text-2xl">—</div>
            <div className="flex flex-col items-center gap-2">
              <Smartphone size={32} className="text-white/40" />
              <span className="text-xs text-white/30">手机端</span>
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-3">随时随地打开</h2>
          <p className="text-base text-white/25 max-w-md mx-auto mb-8">
            PWA 支持添加到手机主屏幕，像原生 App 一样流畅。跨设备同步收藏夹。
          </p>
          <Link
            href="/signals"
            className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-3 text-sm font-bold text-[#080b10] hover:bg-white/90 transition-all"
          >
            <Zap size={16} /> 打开网站
          </Link>
        </motion.div>
      </section>

      {/* ============================================ */}
      {/* FOOTER                                         */}
      {/* ============================================ */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 py-12 text-center text-[11px] text-white/15 border-t border-white/[0.03]">
        <p className="mb-1">前沿 · AI 日报 — 实时聚合 GitHub / Hacker News / ArXiv / dev.to</p>
        <p>AI 评论由每日自动化任务生成 · 数据仅供学习参考</p>
      </footer>
    </div>
  );
}
