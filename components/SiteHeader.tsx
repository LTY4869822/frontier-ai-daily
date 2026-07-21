"use client";

import { RefreshCw } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./ThemeToggle";
import { PushSettings } from "./PushSettings";
import GlobalSearch from "./GlobalSearch";

const NAV = [
  { href: "/", label: "首页" },
  { href: "/signals", label: "实时信号" },
  { href: "/archive", label: "七日归档" },
  { href: "/favorites", label: "收藏" },
  { href: "/insights", label: "AI 评论" },
  { href: "/weekly", label: "本周周报" },
];

export function SiteHeader({
  lastUpdated,
  refreshing,
  onRefresh,
}: {
  lastUpdated: Date | null;
  refreshing: boolean;
  onRefresh: () => void;
}) {
  const pathname = usePathname();
  const timeLabel = lastUpdated
    ? lastUpdated.toLocaleTimeString("zh-CN", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    : "—";
  return (
    <header className="sticky top-0 z-50 topbar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        {/* ---- 左：Logo + 导航 ---- */}
        <div className="flex items-center gap-3 sm:gap-6 min-w-0">
          <a href="/" className="flex items-center gap-2 sm:gap-3 min-w-0 shrink-0">
            <div className="relative grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-brand-cyan to-brand-violet text-[#05060a] font-bold text-sm">
              AI
              <span className="absolute -inset-0.5 rounded-lg bg-gradient-to-br from-brand-cyan to-brand-violet opacity-30 blur-sm -z-10" />
            </div>
            <span className="hidden sm:inline font-semibold text-fg text-sm truncate">
              前沿 · AI 日报
            </span>
          </a>

          <nav className="hidden md:flex items-center gap-1">
            {NAV.map(({ href, label }) => {
              const active = pathname === href;
              return (
                <a
                  key={href}
                  href={href}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-medium transition",
                    active
                      ? "bg-brand-cyan/10 text-brand-cyan"
                      : "text-fg-subtle hover:text-fg hover:bg-surface"
                  )}
                >
                  {label}
                </a>
              );
            })}
          </nav>
        </div>

        {/* ---- 右：状态 + 操作 ---- */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          <span className="hidden sm:flex items-center gap-1.5 text-[11px] text-brand-emerald">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-emerald opacity-60" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-emerald" />
            </span>
            实时
          </span>
          <span className="hidden lg:block text-[11px] text-fg-subtle tabular-nums">
            {timeLabel}
          </span>
          <ThemeToggle />
          <GlobalSearch />
          <PushSettings />
          <button
            onClick={onRefresh}
            disabled={refreshing}
            className={cn("icon-btn", refreshing && "opacity-70")}
            aria-label="刷新数据"
          >
            <RefreshCw size={15} className={cn(refreshing && "animate-spin")} />
          </button>
        </div>
      </div>

      {/* 移动端导航 */}
      <nav className="md:hidden border-t border-line px-2 pb-1.5 pt-1 flex gap-1 overflow-x-auto no-scrollbar">
        {NAV.map(({ href, label }) => {
          const active = pathname === href;
          return (
            <a
              key={href}
              href={href}
              className={cn(
                "px-2.5 py-1 rounded-md text-[11px] font-medium whitespace-nowrap transition",
                active
                  ? "bg-brand-cyan/10 text-brand-cyan"
                  : "text-fg-subtle hover:text-fg"
              )}
            >
              {label}
            </a>
          );
        })}
      </nav>
    </header>
  );
}
