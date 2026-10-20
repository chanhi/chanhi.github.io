import { siteConfig, getCategory } from "@/config/site";
import { getAllPosts } from "@/lib/content";

export const dynamic = "force-static";

function esc(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export function GET() {
  const items = getAllPosts()
    .slice(0, 30)
    .map(
      (p) => `    <item>
      <title>${esc(p.title)}</title>
      <link>${siteConfig.url}${p.url}</link>
      <guid>${siteConfig.url}${p.url}</guid>
      <pubDate>${new Date(p.date).toUTCString()}</pubDate>
      <category>${esc(getCategory(p.category)?.label ?? p.category)}</category>
      <description>${esc(p.summary)}</description>
    </item>`,
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(siteConfig.title)}</title>
    <link>${siteConfig.url}</link>
    <description>${esc(siteConfig.description)}</description>
    <language>ko</language>
    <atom:link href="${siteConfig.url}/rss.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
}
