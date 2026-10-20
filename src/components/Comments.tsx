"use client";

import Giscus from "@giscus/react";
import { useTheme } from "next-themes";
import { siteConfig } from "@/config/site";

/** giscus 댓글 — site.ts의 repoId / categoryId를 채우면 활성화 */
export function Comments() {
  const { resolvedTheme } = useTheme();
  const { repo, repoId, category, categoryId } = siteConfig.giscus;
  if (!repoId || !categoryId) return null;

  return (
    <section className="mt-12 border-t-2 border-border pt-8">
      <Giscus
        repo={repo}
        repoId={repoId}
        category={category}
        categoryId={categoryId}
        mapping="pathname"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="top"
        theme={resolvedTheme === "dark" ? "dark" : "light"}
        lang="ko"
        loading="lazy"
      />
    </section>
  );
}
