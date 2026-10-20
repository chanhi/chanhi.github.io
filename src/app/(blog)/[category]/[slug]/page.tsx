import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Calendar, ChevronRight, Clock, RefreshCw } from "lucide-react";
import { getCategory, getSubLabel } from "@/config/site";
import { getAllPosts, getPost, getPostsByCategory, getSeries } from "@/lib/content";
import { renderMarkdown } from "@/lib/markdown";
import { formatDate, tagHref } from "@/lib/utils";
import { Toc } from "@/components/Toc";
import { Mermaid } from "@/components/Mermaid";
import { Comments } from "@/components/Comments";

type Props = { params: Promise<{ category: string; slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  const params = getAllPosts().map((p) => ({ category: p.category, slug: p.slug }));
  return params.length ? params : [{ category: "develop", slug: "_empty" }];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, slug } = await params;
  const post = getPost(category, slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.summary,
    keywords: post.tags,
    openGraph: {
      type: "article",
      title: post.title,
      description: post.summary,
      publishedTime: post.date,
      tags: post.tags,
      ...(post.thumbnail ? { images: [post.thumbnail] } : {}),
    },
  };
}

export default async function PostPage({ params }: Props) {
  const { category, slug } = await params;
  const post = getPost(category, slug);
  const cat = getCategory(category);
  if (!post || !cat) notFound();

  const { html, toc } = await renderMarkdown(post.body);
  const sub = getSubLabel(post.category, post.subcategory);

  const siblings = getPostsByCategory(category);
  const idx = siblings.findIndex((p) => p.url === post.url);
  const newer = siblings[idx - 1];
  const older = siblings[idx + 1];
  const series = post.series ? getSeries(post.series) : [];

  return (
    <div className="flex gap-10">
      <article className="min-w-0 flex-1">
        {/* 브레드크럼 */}
        <nav aria-label="breadcrumb" className="mb-4 flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
          <Link href={`/${cat.slug}/`} className="hover:text-foreground">
            {cat.label}
          </Link>
          {sub && (
            <>
              <ChevronRight className="size-3.5" />
              <Link href={`/${cat.slug}/?sub=${post.subcategory}`} className="hover:text-foreground">
                {sub}
              </Link>
            </>
          )}
        </nav>

        <header className="mb-8 border-b-2 border-border pb-6">
          <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl">{post.title}</h1>
          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <span className="flex items-center gap-1 font-mono">
              <Calendar className="size-4" />
              {formatDate(post.date)}
            </span>
            {post.updated && (
              <span className="flex items-center gap-1 font-mono">
                <RefreshCw className="size-4" />
                {formatDate(post.updated)}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Clock className="size-4" />
              {post.readingMinutes}분 읽기
            </span>
          </div>
          {post.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {post.tags.map((t) => (
                <Link
                  key={t}
                  href={tagHref(t)}
                  className="rounded-sm border border-border bg-card px-2 py-0.5 text-xs hover:bg-accent hover:text-accent-foreground"
                >
                  #{t}
                </Link>
              ))}
            </div>
          )}
        </header>

        {/* 시리즈 */}
        {series.length > 1 && (
          <details className="card-brutal mb-8 bg-accent/20 p-4" open>
            <summary className="cursor-pointer font-bold">
              📚 {post.series} <span className="font-mono text-sm text-muted-foreground">({series.findIndex((s) => s.url === post.url) + 1}/{series.length})</span>
            </summary>
            <ol className="mt-3 list-decimal space-y-1 pl-6 text-sm">
              {series.map((s) => (
                <li key={s.url}>
                  {s.url === post.url ? (
                    <span className="font-semibold text-primary">{s.title}</span>
                  ) : (
                    <Link href={s.url} className="hover:underline">
                      {s.title}
                    </Link>
                  )}
                </li>
              ))}
            </ol>
          </details>
        )}

        <div className="prose prose-neutral dark:prose-invert" dangerouslySetInnerHTML={{ __html: html }} />
        <Mermaid />

        {/* 이전 / 다음 글 */}
        <nav className="mt-12 grid gap-4 sm:grid-cols-2">
          {older ? (
            <Link href={older.url} className="card-brutal hover-lift p-4">
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <ArrowLeft className="size-3.5" /> 이전 글
              </span>
              <span className="mt-1 line-clamp-2 block font-semibold">{older.title}</span>
            </Link>
          ) : (
            <div />
          )}
          {newer && (
            <Link href={newer.url} className="card-brutal hover-lift p-4 text-right">
              <span className="flex items-center justify-end gap-1 text-xs text-muted-foreground">
                다음 글 <ArrowRight className="size-3.5" />
              </span>
              <span className="mt-1 line-clamp-2 block font-semibold">{newer.title}</span>
            </Link>
          )}
        </nav>

        <Comments />
      </article>

      <aside className="hidden w-56 shrink-0 xl:block">
        <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto">
          <Toc items={toc} />
        </div>
      </aside>
    </div>
  );
}
