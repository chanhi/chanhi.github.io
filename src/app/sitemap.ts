import type { MetadataRoute } from "next";
import { categories, siteConfig } from "@/config/site";
import { getAllPosts, getAllProjects } from "@/lib/content";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const url = (path: string) => `${siteConfig.url}${path}`;
  return [
    { url: url("/"), priority: 1 },
    { url: url("/portfolio/"), priority: 0.9 },
    ...categories.map((c) => ({ url: url(`/${c.slug}/`), priority: 0.8 })),
    ...getAllProjects().map((p) => ({ url: url(p.url), priority: 0.7 })),
    ...getAllPosts().map((p) => ({ url: url(encodeURI(p.url)), lastModified: p.updated ?? p.date, priority: 0.6 })),
  ];
}
