"use client";

import { Suspense, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
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

/**
 * 하위 카테고리 탭 + 페이지네이션. 정적 export이므로 클라이언트에서 ?sub= / ?page= 를 읽는다.
 * useSearchParams는 Suspense 경계가 필요하므로, 빌드 시 HTML에는 fallback(전체 목록 1페이지)이 들어간다.
 */
export function PostList(props: Props) {
  return (
    <Suspense fallback={<PostListView {...props} sub="all" page={1} />}>
      <PostListWithParams {...props} />
    </Suspense>
  );
}

function PostListWithParams(props: Props) {
  // 사이드바 링크처럼 같은 경로에서 쿼리만 바뀌어도 다시 렌더링되도록 URL을 상태의 기준으로 사용
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const sub = searchParams.get("sub") ?? "all";
  const page = Number(searchParams.get("page") ?? 1) || 1;

  const update = (nextSub: string, nextPage: number) => {
    const params = new URLSearchParams();
    if (nextSub !== "all") params.set("sub", nextSub);
    if (nextPage > 1) params.set("page", String(nextPage));
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  return <PostListView {...props} sub={sub} page={page} onChange={update} />;
}

type ViewProps = Props & { sub: string; page: number; onChange?: (sub: string, page: number) => void };

function PostListView({ posts, subcategories = [], perPage, showCategory, sub, page, onChange }: ViewProps) {
  const update = (nextSub: string, nextPage: number) => onChange?.(nextSub, nextPage);

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
