import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { parse as parseYaml } from "yaml";
import { categories } from "@/config/site";

const CONTENT_DIR = path.join(process.cwd(), "content");
const ASSET_DIR = path.join(CONTENT_DIR, "assets");

export type PostMeta = {
  slug: string;
  category: string;
  subcategory?: string;
  title: string;
  date: string;
  updated?: string;
  tags: string[];
  series?: string;
  seriesOrder?: number;
  summary: string;
  thumbnail?: string;
  readingMinutes: number;
  url: string;
};

export type Post = PostMeta & {
  fileName: string;
  aliases: string[];
  body: string;
};

export type ProjectMeta = {
  slug: string;
  title: string;
  summary: string;
  period: string;
  role?: string;
  team?: string;
  stack: string[];
  type: "company" | "school" | "personal";
  github?: string;
  demo?: string;
  thumbnail?: string;
  featured: boolean;
  order: number;
  url: string;
};

export type Project = ProjectMeta & {
  fileName: string;
  aliases: string[];
  body: string;
};

/* ───────────── 공통 유틸 ───────────── */

function walk(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    if (e.name.startsWith(".")) return [];
    const full = path.join(dir, e.name);
    return e.isDirectory() ? walk(full) : [full];
  });
}

function toDateString(value: unknown): string {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  if (typeof value === "string") return value.slice(0, 10);
  return "";
}

function toArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String).filter(Boolean);
  if (typeof value === "string" && value.trim()) return value.split(",").map((v) => v.trim());
  return [];
}

/** 파일명에서 URL slug 생성: 공백 → '-', URL에 문제가 되는 문자 제거 (한글은 유지) */
export function slugify(name: string) {
  return name
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, "-")
    .replace(/[^\p{L}\p{N}-]/gu, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/** 본문에서 요약문 추출 (frontmatter summary가 없을 때) */
function excerpt(body: string, length = 140) {
  const text = body
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/^>\s*\[![^\]]+\].*$/gm, " ")
    .replace(/^🔗.*$/gm, " ")
    .replace(/\\([\\[\]()*_#.-])/g, "$1")
    .replace(/!\[\[[^\]]*\]\]|!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[\[([^\]|#]+)(?:#[^\]|]*)?(?:\|([^\]]+))?\]\]/g, (_, a, b) => b ?? a)
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/https?:\/\/\S+/g, " ")
    .replace(/^#+\s.*$/gm, " ")
    .replace(/[*_`>#|=~-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return text.length > length ? `${text.slice(0, length)}…` : text;
}

function readingMinutes(body: string) {
  // 한글 기준 분당 약 500자
  const chars = body.replace(/```[\s\S]*?```/g, "").replace(/\s+/g, "").length;
  return Math.max(1, Math.round(chars / 500));
}

function firstHeading(body: string) {
  return body.match(/^#\s+(.+)$/m)?.[1]?.trim();
}

/** Obsidian 노트에서 frontmatter 직후의 `---` 구분선과 제목(h1)을 제거 — 제목은 페이지 헤더에서 렌더링 */
function cleanBody(body: string) {
  return body.replace(/^\s*---\s*\n/, "").replace(/^\s*#\s+.+\n/, "");
}

/* ───────────── 블로그 글 ───────────── */

let postCache: Post[] | null = null;

export function getAllPosts(): Post[] {
  if (postCache && process.env.NODE_ENV === "production") return postCache;

  const posts: Post[] = [];
  for (const cat of categories) {
    const dir = path.join(CONTENT_DIR, cat.slug);
    for (const file of walk(dir)) {
      if (!file.endsWith(".md")) continue;
      const raw = fs.readFileSync(file, "utf8");
      const { data, content } = matter(raw);
      if (data.draft === true) continue;

      const fileName = path.basename(file, ".md");
      const rel = path.relative(dir, path.dirname(file)).split(path.sep).filter(Boolean);
      const slug = slugify(String(data.slug ?? fileName));
      const date = toDateString(data.date) || toDateString(fs.statSync(file).mtime);

      posts.push({
        slug,
        category: cat.slug,
        subcategory: data.subcategory ? String(data.subcategory) : rel[0],
        title: String(data.title ?? firstHeading(content) ?? fileName),
        date,
        updated: toDateString(data.updated) || undefined,
        tags: toArray(data.tags),
        series: data.series ? String(data.series) : undefined,
        seriesOrder: data.seriesOrder !== undefined ? Number(data.seriesOrder) : undefined,
        summary: String(data.summary ?? excerpt(cleanBody(content))),
        thumbnail: data.thumbnail ? (resolveAsset(String(data.thumbnail)) ?? String(data.thumbnail)) : undefined,
        readingMinutes: readingMinutes(content),
        url: `/${cat.slug}/${slug}/`,
        fileName,
        aliases: toArray(data.aliases),
        body: cleanBody(content),
      });
    }
  }

  posts.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : a.title.localeCompare(b.title)));
  postCache = posts;
  return posts;
}

export function toMeta(p: Post): PostMeta {
  const { fileName: _f, aliases: _a, body: _b, ...meta } = p;
  return meta;
}

export function getPostsByCategory(category: string) {
  return getAllPosts().filter((p) => p.category === category);
}

export function getPost(category: string, slug: string) {
  return getAllPosts().find((p) => p.category === category && p.slug === decodeURIComponent(slug));
}

export function getSeries(series: string) {
  return getAllPosts()
    .filter((p) => p.series === series)
    .sort(
      (a, b) =>
        (a.seriesOrder ?? Infinity) - (b.seriesOrder ?? Infinity) ||
        (a.date < b.date ? -1 : a.date > b.date ? 1 : a.title.localeCompare(b.title)),
    );
}

export function getAllTags() {
  const counts = new Map<string, number>();
  for (const p of getAllPosts()) for (const t of p.tags) counts.set(t, (counts.get(t) ?? 0) + 1);
  return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
}

export function getCategoryCounts() {
  const result: Record<string, { total: number; subs: Record<string, number> }> = {};
  for (const p of getAllPosts()) {
    const entry = (result[p.category] ??= { total: 0, subs: {} });
    entry.total++;
    if (p.subcategory) entry.subs[p.subcategory] = (entry.subs[p.subcategory] ?? 0) + 1;
  }
  return result;
}

/* ───────────── 포트폴리오 ───────────── */

let projectCache: Project[] | null = null;

export function getAllProjects(): Project[] {
  if (projectCache && process.env.NODE_ENV === "production") return projectCache;

  const dir = path.join(CONTENT_DIR, "portfolio");
  const projects: Project[] = walk(dir)
    .filter((f) => f.endsWith(".md"))
    .map((file) => {
      const { data, content } = matter(fs.readFileSync(file, "utf8"));
      const fileName = path.basename(file, ".md");
      const slug = slugify(String(data.slug ?? fileName));
      return {
        slug,
        title: String(data.title ?? firstHeading(content) ?? fileName),
        summary: String(data.summary ?? excerpt(cleanBody(content))),
        period: String(data.period ?? ""),
        role: data.role ? String(data.role) : undefined,
        team: data.team ? String(data.team) : undefined,
        stack: toArray(data.stack),
        type: (["company", "school", "personal"].includes(data.type) ? data.type : "personal") as Project["type"],
        github: data.github ? String(data.github) : undefined,
        demo: data.demo ? String(data.demo) : undefined,
        thumbnail: data.thumbnail ? (resolveAsset(String(data.thumbnail)) ?? String(data.thumbnail)) : undefined,
        featured: data.featured === true,
        order: Number(data.order ?? 100),
        url: `/portfolio/${slug}/`,
        fileName,
        aliases: toArray(data.aliases),
        body: cleanBody(content),
        draft: data.draft === true,
      };
    })
    .filter((p) => !p.draft)
    .map(({ draft: _d, ...p }) => p);

  projects.sort((a, b) => a.order - b.order || b.period.localeCompare(a.period));
  projectCache = projects;
  return projects;
}

export function toProjectMeta(p: Project): ProjectMeta {
  const { fileName: _f, aliases: _a, body: _b, ...meta } = p;
  return meta;
}

export function getProject(slug: string) {
  return getAllProjects().find((p) => p.slug === decodeURIComponent(slug));
}

/* ───────────── 프로필 ───────────── */

export type Profile = {
  name: string;
  nameEn?: string;
  role: string;
  tagline: string;
  avatar?: string;
  about: string;
  links: { label: string; href: string }[];
  experience: { org: string; title: string; period: string; description?: string; items?: string[] }[];
  education: { org: string; major?: string; period: string; description?: string }[];
  skills: { group: string; items: string[] }[];
  certificates: { name: string; issuer?: string; date: string }[];
};

export function getProfile(): Profile {
  const raw = fs.readFileSync(path.join(CONTENT_DIR, "profile.yaml"), "utf8");
  return parseYaml(raw) as Profile;
}

/* ───────────── 첨부파일 (Obsidian vault 내 파일명 기준 resolve) ───────────── */

let assetIndex: Map<string, string> | null = null;

/** 파일명(또는 상대경로) → /assets/... 공개 URL */
export function resolveAsset(name: string): string | undefined {
  if (!assetIndex) {
    assetIndex = new Map();
    for (const file of walk(ASSET_DIR)) {
      const rel = path.relative(ASSET_DIR, file).split(path.sep).join("/");
      assetIndex.set(path.basename(file).toLowerCase(), rel);
      assetIndex.set(rel.toLowerCase(), rel);
    }
  }
  const key = decodeURIComponent(name).replace(/^(\.\/|\/)?(assets\/)?/, "").toLowerCase();
  const rel = assetIndex.get(key) ?? assetIndex.get(path.posix.basename(key));
  return rel ? `/assets/${rel.split("/").map(encodeURIComponent).join("/")}` : undefined;
}

/** [[위키링크]] 대상 → URL. 파일명·제목·aliases로 매칭 */
let linkIndex: Map<string, string> | null = null;

export function resolveWikiLink(target: string): string | undefined {
  if (!linkIndex) {
    linkIndex = new Map();
    const docs: { fileName: string; title: string; aliases: string[]; url: string }[] = [
      ...getAllPosts(),
      ...getAllProjects(),
    ];
    for (const d of docs) {
      for (const key of [d.fileName, d.title, ...d.aliases]) {
        const k = key.toLowerCase();
        if (!linkIndex.has(k)) linkIndex.set(k, d.url);
      }
    }
  }
  return linkIndex.get(target.trim().toLowerCase());
}
