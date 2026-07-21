"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * 每页顶部的全宽 Hero 区——
 * 固定高度、背景图片（带深色渐变叠加）、大标题、描述、可选 children（如操作按钮）。
 *
 * 图片使用 Unsplash 免费 CDN 链接；若加载失败，回退到主题渐变背景。
 */
export function PageHero({
  title,
  subtitle,
  description,
  imageUrl,
  imageAlt = "hero background",
  children,
  height = "md",
  align = "center",
}: {
  title: string;
  subtitle?: string;
  description?: string;
  imageUrl: string;
  imageAlt?: string;
  children?: ReactNode;
  height?: "sm" | "md" | "lg";
  align?: "center" | "left";
}) {
  const h =
    height === "sm" ? "h-[260px]" : height === "lg" ? "h-[480px]" : "h-[360px]";

  const overlay = cn(
    "absolute inset-0",
    "bg-gradient-to-b from-black/70 via-black/50 to-[var(--bg)]"
  );

  return (
    <section className={cn("relative w-full overflow-hidden", h)}>
      {/* 背景图 */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${imageUrl})` }}
        aria-hidden="true"
      />
      {/* 渐变叠加——确保文字可读性，且底部与页面背景无缝融合 */}
      <div className={overlay} aria-hidden="true" />
      {/* 内容 */}
      <div
        className={cn(
          "relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 flex flex-col justify-center",
          align === "center" ? "items-center text-center" : "items-start text-left"
        )}
      >
        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-xs sm:text-sm font-medium tracking-[0.2em] uppercase text-brand-cyan mb-3"
          >
            {subtitle}
          </motion.p>
        )}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white max-w-2xl leading-tight"
        >
          {title}
        </motion.h1>
        {description && (
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mt-4 text-sm sm:text-base text-white/70 max-w-xl leading-relaxed"
          >
            {description}
          </motion.p>
        )}
        {children && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-6"
          >
            {children}
          </motion.div>
        )}
      </div>
    </section>
  );
}
