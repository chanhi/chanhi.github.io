import { getCategory } from "@/config/site";
import { getAllPosts, getAllProjects } from "@/lib/content";

export const dynamic = "force-static";

/** SearchDialog에서 사용하는 검색 인덱스 */
export function GET() {
  const posts = getAllPosts().map((p) => ({
    title: p.title,
    url: p.url,
    summary: p.summary,
    tags: p.tags,
    category: getCategory(p.category)?.label ?? p.category,
    date: p.date,
  }));
  const projects = getAllProjects().map((p) => ({
    title: p.title,
    url: p.url,
    summary: p.summary,
    tags: p.stack,
    category: "Portfolio",
    date: p.period,
  }));
  return Response.json([...posts, ...projects]);
}
