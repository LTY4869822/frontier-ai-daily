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
  Clock,
  ChevronRight,
} from "lucide-react";
import { cn, formatNumber } from "@/lib/utils";
import DailyHighlight from "@/components/DailyHighlight";

/* ================================================
   IMAGES — high-quality Unsplash tech/abstract
   ================================================ */
const IMG_HERO =
  "https://images.unsplash.com/photo-1639322537228-f740dcef593e?w=1920&q=90";
const IMG_PULSE =
  "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80";
const IMG_PROCESS =
  "https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?w=1920&q=80";

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
    <div className="min-h-screen overflow-x-hidden bg-[#05060a]">
      {/* ============================================ */}
      {/* HERO — full-viewport statement                  */}
      {/* ============================================ */}
      <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden">
        {/* Background image + deep overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${IMG_HERO})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#05060a]/85 via-[#05060a]/70 to-[#05060a]/95" />

        {/* Animated gradient orbs */}
        <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-brand-cyan/8 blur-[100px] animate-floaty" />
        <div className="absolute bottom-1/4 -right-32 w-80 h-80 rounded-full bg-brand-violet/8 blur-[100px] animate-floaty" style={{ animationDelay: "3s" }} />

        {/* Geometric grid */}
        <div
          className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)]"
          aria-hidden="true"
        />

        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <p className="text-[11px] sm:text-xs font-semibold tracking-[0.3em] uppercase text-brand-cyan mb-4 sm:mb-6">
              Frontier Intelligence Daily
            </p>
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[1.05] mb-4 sm:mb-6">
              <span className="block bg-gradient-to-r from-white via-white to-white/70 bg-clip-text text-transparent">
                前沿 · AI 日报
              </span>
              <span className="block mt-2 bg-gradient-to-r from-brand-cyan via-brand-blue to-brand-violet bg-clip-text text-transparent text-2xl sm:text-4xl md:text-5xl">
                不止聚合，为你思考
              </span>
            </h1>
            <p className="text-sm sm:text-base text-white/50 max-w-xl mx-auto leading-relaxed mb-8 sm:mb-10">
              聚合全球 AI 与软件工程前沿信号，由 AI 对每条热点生成深度评论与学习路径。
              每天 19:00 自动更新，中英双语，电脑手机随时看。
            </p>

            <div className="flex flex-wrap gap-3 justify-center">
              <Link
                href="/signals"
                className="group inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3 text-sm font-bold text-[#05060a] shadow-xl shadow-white/10 hover:shadow-white/20 transition-all hover:scale-105"
              >
                <Zap size={16} />
                开始浏览
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/weekly"
                className="group inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/[0.04] hover:bg-white/[0.08] px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-all"
              >
                <CalendarDays size={16} />
                本周周报
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform opacity-40" />
              </Link>
            </div>

            {/* Live indicator */}
            <div className="mt-8 flex items-center justify-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-emerald opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-emerald" />
              </span>
              <span className="text-[11px] font-medium text-brand-emerald/80 tracking-wider">
                实时 · 5分钟自动刷新
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============================================ */}
      {/* TODAY'S MUST-READ                             */}
      {/* ============================================ */}
      <DailyHighlight />

      {/* ============================================ */}
      {/* TODAY PULSE — live signal strip              */}
      {/* ============================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 -mt-16 relative z-20 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-5 flex items-center justify-between"
        >
          <div>
            <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-brand-cyan mb-1">
              Live Now
            </p>
            <h2 className="text-lg sm:text-xl font-bold text-white">今日脉搏</h2>
          </div>
          <Link
            href="/signals"
            className="inline-flex items-center gap-1 text-xs text-brand-cyan hover:underline"
          >
            全部信号 <ChevronRight size={14} />
          </Link>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton rounded-2xl h-32" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* GitHub spotlight */}
            <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {github.slice(0, 2).map((repo) => (
                <motion.a
                  key={repo.id}
                  href={repo.url}
                  target="_blank"
                  rel="noreferrer"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="group card p-4 sm:p-5 hover:border-brand-cyan/30 transition-all relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-20 h-20 rounded-bl-3xl bg-brand-cyan/[0.03] pointer-events-none" />
                  <div className="flex items-start gap-3">
                    <img src={repo.ownerAvatar} alt="" className="w-9 h-9 rounded-xl shrink-0 ring-1 ring-white/10" loading="lazy" />
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-semibold tracking-wider uppercase text-brand-cyan mb-0.5">GitHub</p>
                      <h4 className="text-sm font-bold text-white/95 truncate">
                        {repo.owner ?? "?"}/{repo.name}
                      </h4>
                      {repo.descZh && repo.descZh !== repo.description && (
                        <p className="text-xs text-brand-cyan/70 mt-1 line-clamp-1">{repo.descZh}</p>
                      )}
                      <div className="flex items-center gap-3 mt-2 text-[11px] text-white/30">
                        <span className="flex items-center gap-1"><Star size={11} className="text-brand-amber" /> {formatNumber(repo.stars)}</span>
                        {repo.language && <span>{repo.language}</span>}
                      </div>
                    </div>
                    <ExternalLink size={14} className="text-white/15 group-hover:text-brand-cyan transition-colors shrink-0 mt-0.5" />
                  </div>
                </motion.a>
              ))}
            </div>

            {/* HN highlight */}
            {news[0] && (
              <motion.a
                key={news[0].id}
                href={news[0].url || `https://news.ycombinator.com/item?id=${news[0].id}`}
                target="_blank"
                rel="noreferrer"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="group card p-4 sm:p-5 hover:border-orange-400/30 transition-all flex flex-col relative overflow-hidden"
                style={{
                  backgroundImage: `linear-gradient(135deg, rgba(245,158,11,0.06) 0%, transparent 60%)`,
                }}
              >
                <div className="absolute top-0 right-0 w-16 h-16 rounded-bl-3xl bg-orange-400/[0.03] pointer-events-none" />
                <p className="text-[10px] font-semibold tracking-wider uppercase text-orange-400 mb-1">Hacker News</p>
                <h4 className="text-sm font-bold text-white/90 line-clamp-3 leading-snug flex-1">
                  {news[0].titleZh || news[0].title}
                </h4>
                <div className="flex items-center gap-3 mt-3 text-[11px] text-white/30">
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
      {/* NETWORK — 4 sources gallery                    */}
      {/* ============================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 border-t border-white/[0.04]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-brand-cyan mb-2">Global Sources</p>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">四路实时数据源</h2>
          <p className="mt-2 text-sm text-white/35">全天候追踪 AI 与软件工程前沿动态</p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {[
            { label: "GitHub", sub: "开源趋势", icon: Github, color: "#f0f6fc" },
            { label: "Hacker News", sub: "技术讨论", icon: Newspaper, color: "#ff6600" },
            { label: "ArXiv", sub: "前沿论文", icon: FileText, color: "#b31b1b" },
            { label: "dev.to", sub: "开发者社区", icon: BookOpen, color: "#4ade80" },
          ].map(({ label, sub, icon: Icon, color }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="group relative rounded-2xl p-5 sm:p-6 text-center border border-white/[0.04] bg-white/[0.015] hover:bg-white/[0.03] transition-all hover:border-white/[0.08]"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl mb-3.5 transition-transform group-hover:scale-110"
                style={{ background: `${color}15` }}
              >
                <Icon size={22} style={{ color }} />
              </div>
              <h3 className="text-sm font-bold text-white/90">{label}</h3>
              <p className="text-[11px] text-white/30 mt-0.5">{sub}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ============================================ */}
      {/* CAPABILITIES — 3 feature cards with images    */}
      {/* ============================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 border-t border-white/[0.04]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-brand-violet mb-2">Why This Matters</p>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            No More FOMO
          </h2>
          <p className="mt-2 text-sm text-white/35 max-w-lg mx-auto">
            从「刷到了」到「学会了」，每条信号都配有 AI 深度分析
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          {[
            {
              title: "AI 深度评论",
              desc: "每天 6–9 条 AI 生成的前沿动态评论，含趋势分析、要点提炼与 actionable 学习路径。",
              href: "/insights",
              btn: "查看评论",
              img: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&q=80",
              accent: "from-brand-violet to-brand-pink",
              icon: Sparkles,
            },
            {
              title: "实时前沿信号",
              desc: "GitHub 热门项目、HN 技术讨论、ArXiv 论文、开发者社区精选，5 分钟刷新。",
              href: "/signals",
              btn: "浏览信号",
              img: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=600&q=80",
              accent: "from-brand-cyan to-brand-blue",
              icon: TrendingUp,
            },
            {
              title: "每周趋势总结",
              desc: "自动聚合 7 天热点，按 6 大类别统计分布，提炼关键趋势与学习重心。",
              href: "/weekly",
              btn: "查看周报",
              img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80",
              accent: "from-brand-emerald to-brand-cyan",
              icon: CalendarDays,
            },
          ].map(({ title, desc, href, btn, img, accent, icon: Icon }, i) => (
            <motion.div
              key={href}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group relative rounded-3xl overflow-hidden border border-white/[0.05] bg-white/[0.01] hover:bg-white/[0.02] hover:border-white/[0.08] transition-all duration-500"
            >
              {/* Image */}
              <div className="relative h-44 overflow-hidden">
                <img src={img} alt={title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#05060a] via-[#05060a]/30 to-transparent" />
                <div className={cn("absolute bottom-3 left-4 w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-lg", accent)}>
                  <Icon size={18} className="text-white" />
                </div>
              </div>
              {/* Body */}
              <div className="p-5 sm:p-6">
                <h3 className="text-base font-bold text-white mb-2">{title}</h3>
                <p className="text-[13px] leading-relaxed text-white/40 mb-4">{desc}</p>
                <Link
                  href={href}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-cyan hover:gap-2.5 transition-all"
                >
                  {btn} <ArrowRight size={14} />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ============================================ */}
      {/* PROCESS — timeline                             */}
      {/* ============================================ */}
      <section className="relative py-16 sm:py-20 border-t border-white/[0.04] overflow-hidden">
        {/* Background image strip */}
        <div className="absolute inset-0">
          <img src={IMG_PROCESS} alt="" className="w-full h-full object-cover opacity-[0.06]" loading="lazy" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#05060a] via-transparent to-[#05060a]" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-brand-cyan mb-2">Pipeline</p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              每天 19:00 · 全自动运转
            </h2>
            <p className="mt-2 text-sm text-white/35">无需人工干预，AI 驱动的内容生产线</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 sm:gap-6">
            {[
              { step: "01", title: "实时抓取", desc: "每 5 分钟轮询 4 路数据源，抓取最新信号", icon: GitBranch },
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
                {/* Connector line (desktop) */}
                {i < 3 && (
                  <div className="hidden sm:block absolute top-6 left-[60%] w-[80%] h-px bg-gradient-to-r from-brand-cyan/20 to-transparent" />
                )}
                <div className="relative z-10 w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center mb-3">
                  <Icon size={20} className="text-brand-cyan" />
                </div>
                <span className="absolute top-1 right-0 text-4xl font-black text-white/[0.02] select-none">{step}</span>
                <h4 className="text-sm font-bold text-white/90 mb-1">{title}</h4>
                <p className="text-xs text-white/30 leading-relaxed max-w-[180px]">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* CTA — bottom banner                            */}
      {/* ============================================ */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative rounded-[2rem] p-8 sm:p-12 md:p-16 text-center overflow-hidden"
          style={{
            background: "linear-gradient(135deg, rgba(34,211,238,0.08) 0%, rgba(139,92,246,0.06) 40%, rgba(59,130,246,0.05) 100%)",
          }}
        >
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-brand-cyan/[0.04] blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-brand-violet/[0.04] blur-3xl pointer-events-none" />

          <h2 className="relative text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight mb-3">
            每天 19:00 · 前沿动态自动抵达
          </h2>
          <p className="relative text-sm text-white/40 max-w-md mx-auto mb-8">
            打开即看，无需手动刷新。支持电脑和手机，收藏跨设备同步。
          </p>
          <div className="relative flex flex-wrap gap-3 justify-center">
            <Link
              href="/signals"
              className="inline-flex items-center gap-2 rounded-2xl bg-white px-7 py-3 text-sm font-bold text-[#05060a] shadow-xl shadow-white/10 hover:shadow-white/20 hover:scale-105 transition-all"
            >
              <Zap size={16} /> 开始使用
            </Link>
            <Link
              href="/archive"
              className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] px-7 py-3 text-sm font-semibold text-white transition-all"
            >
              浏览归档 <ArrowRight size={14} />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ============================================ */}
      {/* FOOTER                                         */}
      {/* ============================================ */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 py-10 text-center text-[11px] text-white/20 border-t border-white/[0.04]">
        前沿 · AI 日报 — 实时聚合 GitHub / Hacker News / ArXiv / dev.to
        <br />
        AI 评论由每日自动化任务生成 · 数据仅供学习参考
      </footer>
    </div>
  );
}
