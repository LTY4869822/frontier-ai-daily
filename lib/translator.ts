/**
 * 信号中文摘要模块
 * 使用关键词映射生成基本中文摘要（无需 AI API）
 * 后续可接入 AI 翻译作为增强
 */

import {
  generateSimpleChineseSummary,
} from "./simple-translator";

/**
 * 为文本生成中文摘要（直接调用 simple-translator）
 * 保留此函数签名以兼容现有代码，后续可替换为 AI 翻译
 */
export async function translateText(text: string): Promise<string> {
  return generateSimpleChineseSummary(text);
}

/**
 * 批量翻译（当前为逐条处理，后续可优化为一次 AI 调用翻译多条）
 */
export async function batchTranslate(
  texts: string[]
): Promise<Record<string, string>> {
  const results: Record<string, string> = {};
  for (const text of texts) {
    results[text] = await translateText(text);
  }
  return results;
}
