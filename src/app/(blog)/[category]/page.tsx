import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { categories, getCategory, siteConfig } from "@/config/site";
import { getPostsByCategory, toMeta } from "@/lib/content";
import { PostList } from "@/components/PostList";

type Props = { params: Promise<{ category: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return categories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const cat = getCategory((await params).category);
  return { title: cat?.label, description: cat?.description };
}

export default async function CategoryPage({ params }: Props) {
  const cat = getCategory((await params).category);
  if (!cat) notFound();
  const posts = getPostsByCategory(cat.slug).map(toMeta);

  return (
    <div>
      <header className="mb-8">
        <p className="font-mono text-sm text-muted-foreground">/{cat.slug}</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">{cat.label}</h1>
        <p className="mt-2 text-muted-foreground">{cat.description}</p>
        <p className="mt-1 font-mono text-xs text-muted-foreground">{posts.length} posts</p>
      </header>
      <PostList posts={posts} subcategories={cat.subcategories} perPage={siteConfig.postsPerPage} />
    </div>
  );
}
