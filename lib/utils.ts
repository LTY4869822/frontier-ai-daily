export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

export function formatNumber(n: number): string {
  if (n >= 1000) {
    return (n / 1000).toFixed(n >= 10000 ? 0 : 1).replace(/\.0$/, "") + "k";
  }
  return String(n);
}

export function timeAgo(unixSeconds: number): string {
  const now = Math.floor(Date.now() / 1000);
  const diff = Math.max(0, now - unixSeconds);
  if (diff < 60) return `${diff}秒前`;
  if (diff < 3600) return `${Math.floor(diff / 60)}分钟前`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}小时前`;
  const days = Math.floor(diff / 86400);
  if (days < 30) return `${days}天前`;
  return `${Math.floor(days / 30)}个月前`;
}

export function relativeDate(dateStr: string): string {
  // YYYY-MM-DD
  const d = new Date(dateStr + "T00:00:00");
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - d.getTime()) / 86400000);
  if (diffDays <= 0) return "今天";
  if (diffDays === 1) return "昨天";
  if (diffDays < 7) return `${diffDays}天前`;
  return dateStr;
}

export async function fetchJson(url: string, init?: RequestInit): Promise<any> {
  const res = await fetch(url, {
    ...init,
    headers: {
      "User-Agent": "frontier-ai-daily/1.0",
      Accept: "application/json",
      ...(init?.headers || {}),
    },
  });
  if (!res.ok) {
    throw new Error(`Request failed ${res.status} for ${url}`);
  }
  return res.json();
}
