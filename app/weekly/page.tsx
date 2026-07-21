"use client";

import { useEffect, useState, useCallback } from "react";
import { PageHero } from "@/components/PageHero";
import { SiteHeader } from "@/components/SiteHeader";
import { WeeklySection } from "@/components/WeeklySection";
import { WeeklyExportButton } from "@/components/WeeklyExportButton";
import { SectionHeading, Skeleton } from "@/components/ui";
import { WeeklySummary, DailyCommentary } from "@/lib/types";
import { CalendarDays } from "lucide-react";

const HERO =
  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1920&q=80";

export default function WeeklyPage() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const [weekly, setWeekly] = useState<WeeklySummary | null>(null);
  const [commentary, setCommentary] = useState<DailyCommentary | null>(null);

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    try {
      const [w, c] = await Promise.all([
        fetch("/api/weekly").then((r) => r.json()),
        fetch("/api/commentary").then((r) => r.json()),
      ]);
      setWeekly(w.data || null);
      setCommentary(c.data || null);
      setLastUpdated(new Date());
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load(false);
  }, [load]);

  return (
    <div className="min-h-screen">
      <SiteHeader
        lastUpdated={lastUpdated}
        refreshing={refreshing}
        onRefresh={() => load(true)}
      />

      <PageHero
        title="本周趋势周报"
        subtitle="Weekly Intelligence Briefing"
        description="自动化聚合近 7 天 AI 评论热点，按类别统计分布，提炼本周关键趋势与学习重心建议。"
        imageUrl={HERO}
        height="md"
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <div className="flex items-center justify-between flex-wrap gap-2 mb-6">
          <SectionHeading
            icon={<CalendarDays size={18} />}
            title="本周热点分类总结"
            hint="自动化聚合 · 近 7 天"
          />
          {weekly && (
            <WeeklyExportButton summary={weekly} commentary={commentary} />
          )}
        </div>

        {loading || !weekly ? (
          <Skeleton className="h-48" />
        ) : (
          <WeeklySection summary={weekly} />
        )}
      </main>
    </div>
  );
}
