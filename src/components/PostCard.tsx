import Link from "next/link";
import { Calendar, Clock } from "lucide-react";
import type { PostMeta } from "@/lib/content";
import { getCategory, getSubLabel } from "@/config/site";
import { formatDate } from "@/lib/utils";

export function PostCard({ post, showCategory = false }: { post: PostMeta; showCategory?: boolean }) {
  const sub = getSubLabel(post.category, post.subcategory);
  return (
    <article className="group card-brutal hover-lift relative flex gap-4 p-5">
      <div className="min-w-0 flex-1">
        <div className="mb-2 flex flex-wrap items-center gap-2 text-xs">
          {showCategory && (
            <span className="rounded-sm bg-primary px-1.5 py-0.5 font-semibold text-primary-foreground">
              {getCategory(post.category)?.label}
            </span>
          )}
          {sub && <span className="rounded-sm border border-border px-1.5 py-0.5 font-semibold">{sub}</span>}
          {post.series && (
            <span className="rounded-sm bg-accent px-1.5 py-0.5 font-semibold text-accent-foreground">📚 {post.series}</span>
          )}
        </div>
        <h3 className="text-lg font-bold leading-snug tracking-tight">
          <Link href={post.url} className="after:absolute after:inset-0 group-hover:text-primary">
            {post.title}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{post.summary}</p>
        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <span className="flex items-center gap-1 font-mono">
            <Calendar className="size-3.5" />
            {formatDate(post.date)}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="size-3.5" />
            {post.readingMinutes}분
          </span>
          {post.tags.slice(0, 4).map((t) => (
            <span key={t}>#{t}</span>
          ))}
        </div>
      </div>
      {post.thumbnail && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={post.thumbnail}
          alt=""
          loading="lazy"
          className="hidden size-24 shrink-0 rounded-md border-2 border-border object-cover sm:block"
        />
      )}
    </article>
  );
}
