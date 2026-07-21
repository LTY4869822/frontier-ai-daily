import { NextResponse } from "next/server";
import { getWeeklySummary, getLatestCommentary } from "@/lib/commentary";
import { buildPushText } from "@/lib/push";

// Always evaluate at request time (env vars / latest data may change).
export const dynamic = "force-dynamic";

/**
 * GET /api/push
 * Returns the current push configuration status for the UI to display.
 */
export async function GET() {
  const channels = {
    wechat: !!process.env.WECHAT_WEBHOOK_URL,
    email: !!process.env.EMAIL_TO,
  };
  return NextResponse.json({
    ok: true,
    configured: channels.wechat || channels.email,
    channels,
  });
}

/**
 * POST /api/push
 * Validates credentials. If neither env var is set, returns a
 * `not_configured` envelope. Otherwise constructs the summary text and
 * performs a placeholder "send" (logging only).
 */
export async function POST() {
  const wechat = process.env.WECHAT_WEBHOOK_URL;
  const email = process.env.EMAIL_TO;

  if (!wechat && !email) {
    return NextResponse.json({
      ok: false,
      reason: "not_configured",
      hint:
        "请配置推送凭据环境变量：WECHAT_WEBHOOK_URL（企业微信群机器人 Webhook）或 EMAIL_TO（接收邮箱）。",
    });
  }

  const summary = getWeeklySummary();
  const commentary = getLatestCommentary();
  const text = buildPushText(summary, commentary);

  // TODO: real delivery — POST `text` to the WeChat webhook as
  // { msgtype: "markdown", markdown: { content: text } }; send email via
  // SMTP / email API. This release only constructs the payload:
  console.log("[push] payload constructed, channels:", {
    wechat: !!wechat,
    email: !!email,
  });
  console.log("[push] content:\n" + text);

  return NextResponse.json({
    ok: true,
    delivered: false,
    note: "已构造推送内容（占位实现，待接入真实发送逻辑）",
    channels: { wechat: !!wechat, email: !!email },
  });
}
