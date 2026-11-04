import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export const dynamic = "force-static";

/**
 * AI 학습·수집용 크롤러 차단 목록 (검색 엔진 크롤러는 허용)
 * robots.txt는 강제력이 없어 규칙을 지키는 봇에만 효과가 있다.
 */
const AI_CRAWLERS = [
  "GPTBot", // OpenAI 학습
  "ChatGPT-User",
  "OAI-SearchBot",
  "ClaudeBot", // Anthropic
  "Claude-User",
  "Claude-SearchBot",
  "anthropic-ai",
  "Google-Extended", // Gemini 학습 (Google 검색에는 영향 없음)
  "Applebot-Extended", // Apple AI 학습
  "CCBot", // Common Crawl (여러 LLM 학습 데이터 출처)
  "PerplexityBot",
  "Perplexity-User",
  "Meta-ExternalAgent",
  "Meta-ExternalFetcher",
  "FacebookBot",
  "Bytespider", // ByteDance
  "Amazonbot",
  "cohere-ai",
  "cohere-training-data-crawler",
  "Diffbot",
  "omgili",
  "omgilibot",
  "ImagesiftBot",
  "Timpibot",
  "AI2Bot",
  "YouBot",
  "DuckAssistBot",
  "MistralAI-User",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: AI_CRAWLERS, disallow: "/" },
      { userAgent: "*", allow: "/" },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
