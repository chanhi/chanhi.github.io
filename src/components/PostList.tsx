"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { PostMeta } from "@/lib/content";
import type { SubCategory } from "@/config/site";
import { cn } from "@/lib/utils";
import { PostCard } from "./PostCard";

type Props = {
  posts: PostMeta[];
  subcategories?: SubCategory[];
  perPage: number;
  showCategory?: boolean;
};

/** 하위 카테고리 탭 + 페이지네이션. 정적 export이므로 클라이언트에서 처리하고 ?sub= / ?page= 와 동기화 */
export function PostList({ posts, subcategories = [], perPage, showCategory }: Props) {
  const [sub, setSub] = useState("all");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const read = () => {
      const params = new URLSearchParams(window.location.search);
      setSub(params.get("sub") ?? "all");
      setPage(Number(params.get("page") ?? 1) || 1);
    };
    read();
    window.addEventListener("popstate", read);
    return () => window.removeEventListener("popstate", read);
  }, []);

  const update = (nextSub: string, nextPage: number) => {
    setSub(nextSub);
    setPage(nextPage);
    const params = new URLSearchParams();
    if (nextSub !== "all") params.set("sub", nextSub);
    if (nextPage > 1) params.set("page", String(nextPage));
    const qs = params.toString();
    window.history.pushState(null, "", qs ? `?${qs}` : window.location.pathname);
  };

  const tabs = subcategories
    .map((s) => ({ ...s, count: posts.filter((p) => p.subcategory === s.slug).length }))
    .filter((s) => s.count > 0);

  const filtered = useMemo(() => (sub === "all" ? posts : posts.filter((p) => p.subcategory === sub)), [posts, sub]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const current = Math.min(page, totalPages);
  const visible = filtered.slice((current - 1) * perPage, current * perPage);

  return (
    <div>
      {tabs.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
          {[{ slug: "all", label: "전체", count: posts.length }, ...tabs].map((t) => (
            <button
              key={t.slug}
              type="button"
              onClick={() => update(t.slug, 1)}
              className={cn(
                "rounded-md border-2 border-border px-3 py-1 text-sm font-semibold transition-colors",
                sub === t.slug ? "bg-foreground text-background" : "bg-card hover:bg-muted",
              )}
            >
              {t.label} <span className="font-mono text-xs opacity-70">{t.count}</span>
            </button>
          ))}
        </div>
      )}

      {visible.length === 0 ? (
        <p className="card-brutal p-8 text-center text-muted-foreground">아직 작성된 글이 없습니다.</p>
      ) : (
        <div className="space-y-4">
          {visible.map((p) => (
            <PostCard key={p.url} post={p} showCategory={showCategory} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <nav aria-label="페이지" className="mt-8 flex items-center justify-center gap-1.5">
          <button
            type="button"
            disabled={current === 1}
            onClick={() => update(sub, current - 1)}
            className="inline-flex size-9 items-center justify-center rounded-md border-2 border-border bg-card disabled:opacity-40"
            aria-label="이전 페이지"
          >
            <ChevronLeft className="size-4" />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => update(sub, n)}
              className={cn(
                "size-9 rounded-md border-2 border-border font-mono text-sm",
                n === current ? "bg-primary text-primary-foreground" : "bg-card hover:bg-muted",
              )}
            >
              {n}
            </button>
          ))}
          <button
            type="button"
            disabled={current === totalPages}
            onClick={() => update(sub, current + 1)}
            className="inline-flex size-9 items-center justify-center rounded-md border-2 border-border bg-card disabled:opacity-40"
            aria-label="다음 페이지"
          >
            <ChevronRight className="size-4" />
          </button>
        </nav>
      )}
    </div>
  );
}
