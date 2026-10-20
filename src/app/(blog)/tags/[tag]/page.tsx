import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllPosts, getAllTags, toMeta } from "@/lib/content";
import { siteConfig } from "@/config/site";
import { PostList } from "@/components/PostList";

type Props = { params: Promise<{ tag: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  const params = getAllTags().map(([tag]) => ({ tag }));
  return params.length ? params : [{ tag: "_empty" }];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return { title: `#${decodeURIComponent((await params).tag)}` };
}

export default async function TagPage({ params }: Props) {
  const tag = decodeURIComponent((await params).tag);
  if (tag === "_empty") notFound();
  const posts = getAllPosts()
    .filter((p) => p.tags.includes(tag))
    .map(toMeta);

  return (
    <div>
      <header className="mb-8">
        <p className="font-mono text-sm text-muted-foreground">/tags</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">#{tag}</h1>
        <p className="mt-2 font-mono text-xs text-muted-foreground">{posts.length} posts</p>
      </header>
      <PostList posts={posts} perPage={siteConfig.postsPerPage} showCategory />
    </div>
  );
}
