"use client";

import { useEffect, useRef, useState } from "react";
import { Send, CheckCircle2, AlertTriangle, X } from "lucide-react";

interface PushChannels {
  wechat: boolean;
  email: boolean;
}
interface PushStatus {
  configured: boolean;
  channels: PushChannels;
}

/**
 * Lightweight header popover for push notifications.
 *
 * - On open, GETs /api/push to learn the configured channels.
 * - If not configured, shows a setup hint with the required env vars.
 * - If configured, offers an "立即推送今日摘要" button that POSTs /api/push.
 */
export function PushSettings() {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<PushStatus | null>(null);
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  // Fetch config status when the panel opens.
  useEffect(() => {
    if (open && !status) {
      fetch("/api/push")
        .then((r) => r.json())
        .then((d: { configured: boolean; channels: PushChannels }) =>
          setStatus({ configured: d.configured, channels: d.channels })
        )
        .catch(() =>
          setStatus({ configured: false, channels: { wechat: false, email: false } })
        );
    }
  }, [open, status]);

  // Close on outside click.
  useEffect(() => {
    function onPointerDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open]);

  const handlePush = async () => {
    setSending(true);
    setResult(null);
    try {
      const res = await fetch("/api/push", { method: "POST" });
      const d = await res.json();
      if (d.ok) {
        setResult("已构造推送内容（占位实现，待接入真实发送逻辑）。");
      } else if (d.reason === "not_configured") {
        setResult(d.hint || "请先配置推送凭据。");
      } else {
        setResult("推送失败，请稍后重试。");
      }
    } catch {
      setResult("网络错误，请稍后重试。");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="推送设置"
        aria-expanded={open}
        className="icon-btn"
      >
        <Send size={16} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-72 z-50 card p-4 text-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="font-semibold text-fg">推送设置</span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="关闭"
              className="text-fg-subtle hover:text-[var(--fg)] transition"
            >
              <X size={14} />
            </button>
          </div>

          {!status ? (
            <p className="text-fg-subtle text-xs">检测推送配置中…</p>
          ) : status.configured ? (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-xs text-brand-emerald">
                <CheckCircle2 size={15} /> 已连接推送渠道
              </div>
              <div className="flex flex-wrap gap-2 text-xs">
                {status.channels.wechat && (
                  <span className="chip border-brand-emerald/30 text-brand-emerald bg-brand-emerald/10">
                    企业微信
                  </span>
                )}
                {status.channels.email && (
                  <span className="chip border-brand-emerald/30 text-brand-emerald bg-brand-emerald/10">
                    邮件
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={handlePush}
                disabled={sending}
                className="mt-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-brand-cyan/15 text-brand-cyan border border-brand-cyan/30 px-3 py-2 text-xs font-medium transition hover:bg-brand-cyan/25 disabled:opacity-60"
              >
                <Send size={14} /> {sending ? "推送中…" : "立即推送今日摘要"}
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-xs text-amber-500">
                <AlertTriangle size={15} /> 尚未配置推送凭据
              </div>
              <p className="text-fg-subtle text-xs leading-relaxed">
                在项目根目录的 <code className="text-fg-muted">.env.local</code> 中配置以下环境变量之一即可启用：
              </p>
              <pre className="text-[11px] text-fg-muted surface-3 rounded-lg p-2 overflow-x-auto">
{`WECHAT_WEBHOOK_URL=https://...
EMAIL_TO=you@example.com`}
              </pre>
            </div>
          )}

          {result && (
            <p className="mt-3 text-xs text-fg-muted border-t border-line pt-2 leading-relaxed">
              {result}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
