import type { Metadata } from "next";
import Link from "next/link";
import { getAllTags } from "@/lib/content";
import { tagHref } from "@/lib/utils";

export const metadata: Metadata = { title: "Tags" };

export default function TagsPage() {
  const tags = getAllTags();
  const max = Math.max(1, ...tags.map(([, n]) => n));

  return (
    <div>
      <header className="mb-8">
        <p className="font-mono text-sm text-muted-foreground">/tags</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">Tags</h1>
        <p className="mt-2 text-muted-foreground">{tags.length}개의 태그</p>
      </header>
      <div className="flex flex-wrap gap-2">
        {tags.map(([tag, n]) => (
          <Link
            key={tag}
            href={tagHref(tag)}
            className="card-brutal hover-lift px-3 py-1.5"
            style={{ fontSize: `${0.85 + (n / max) * 0.6}rem` }}
          >
            #{tag} <span className="font-mono text-xs text-muted-foreground">{n}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
