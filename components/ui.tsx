"use client";

import { Category } from "@/lib/types";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

// ---------- category theming (brand colors are theme-independent) ----------
const categoryStyles: Record<Category, { dot: string; text: string; ring: string; bg: string }> = {
  "AI大模型": { dot: "bg-brand-violet", text: "text-brand-violet", ring: "border-brand-violet/30", bg: "bg-brand-violet/10" },
  "GitHub开源": { dot: "bg-brand-amber", text: "text-brand-amber", ring: "border-brand-amber/30", bg: "bg-brand-amber/10" },
  "软件工程": { dot: "bg-brand-cyan", text: "text-brand-cyan", ring: "border-brand-cyan/30", bg: "bg-brand-cyan/10" },
  "Agent与智能体": { dot: "bg-brand-pink", text: "text-brand-pink", ring: "border-brand-pink/30", bg: "bg-brand-pink/10" },
  "行业动态": { dot: "bg-brand-emerald", text: "text-brand-emerald", ring: "border-brand-emerald/30", bg: "bg-brand-emerald/10" },
  "论文研究": { dot: "bg-brand-blue", text: "text-brand-blue", ring: "border-brand-blue/30", bg: "bg-brand-blue/10" },
};

export function CategoryBadge({ category }: { category: Category }) {
  const s = categoryStyles[category] || categoryStyles["AI大模型"];
  return (
    <span className={cn("chip", s.ring, s.bg, s.text)}>
      <span className={cn("h-1.5 w-1.5 rounded-full", s.dot)} />
      {category}
    </span>
  );
}

export function ImportanceTag({ level }: { level: "high" | "medium" | "low" }) {
  const map = {
    high: { label: "重磅", cls: "border-brand-pink/40 text-brand-pink bg-brand-pink/10" },
    medium: { label: "关注", cls: "border-brand-amber/40 text-brand-amber bg-brand-amber/10" },
    low: { label: "资讯", cls: "border-line text-fg-subtle surface" },
  } as const;
  const m = map[level];
  return <span className={cn("pill", m.cls)}>{m.label}</span>;
}

export function SectionHeading({
  icon,
  title,
  hint,
}: {
  icon: ReactNode;
  title: string;
  hint?: string;
}) {
  return (
    <div className="section-head">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand-cyan/20 to-brand-violet/20 text-brand-cyan border-line">
        {icon}
      </span>
      <h2 className="section-title">{title}</h2>
      {hint && <span className="text-xs text-fg-subtle ml-1">{hint}</span>}
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("skeleton rounded-xl", className)} />;
}

export function StatPill({
  label,
  value,
  accent = "text-brand-cyan",
}: {
  label: string;
  value: string | number;
  accent?: string;
}) {
  return (
    <div className="glass rounded-2xl px-4 py-3 flex flex-col gap-0.5 min-w-[120px]">
      <span className={cn("text-2xl font-bold tabular-nums", accent)}>{value}</span>
      <span className="text-xs text-fg-subtle">{label}</span>
    </div>
  );
}

export function Reveal({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Shared, theme-aware search input primitive used by {@link GlobalSearch} and
 * {@link CommentaryFilter}. Fully controlled via `value` / `onChange`.
 */
export function SearchInput({
  value,
  onChange,
  placeholder,
  icon,
  className,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  icon?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("relative flex items-center", className)}>
      {icon && (
        <span className="pointer-events-none absolute left-3 flex items-center text-fg-subtle">
          {icon}
        </span>
      )}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          "w-full rounded-xl border border-line surface text-fg placeholder:text-[var(--fg-subtle)]",
          "py-2 text-sm outline-none transition",
          icon ? "pl-9" : "pl-3",
          "pr-3 focus:border-brand-cyan/50 focus:ring-2 focus:ring-brand-cyan/20"
        )}
      />
    </div>
  );
}

// ---------- layout / section primitives (UI cleanup) ----------

/** Themed section container with consistent vertical rhythm. */
export function Section({
  id,
  className,
  children,
}: {
  id?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className={cn("section scroll-anchor", className)}>
      {children}
    </section>
  );
}

/** Source switcher for the unified signal panel (all / github / news / papers / articles). */
export function SourceTabs({
  sources,
  active,
  onChange,
}: {
  sources: { key: string; label: string; icon?: LucideIcon }[];
  active: string;
  onChange: (k: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {sources.map((s) => (
        <button
          key={s.key}
          type="button"
          data-active={active === s.key ? "true" : "false"}
          onClick={() => onChange(s.key)}
          className="chip-btn"
        >
          {s.icon ? (
            <span className="flex items-center gap-1">
              <s.icon size={13} /> {s.label}
            </span>
          ) : (
            s.label
          )}
        </button>
      ))}
    </div>
  );
}

/** Centered "load more" affordance. */
export function LoadMoreButton({
  onClick,
  label = "加载更多",
}: {
  onClick: () => void;
  label?: string;
}) {
  return (
    <div className="flex justify-center mt-6">
      <button type="button" onClick={onClick} className="ghost-btn">
        {label}
      </button>
    </div>
  );
}
