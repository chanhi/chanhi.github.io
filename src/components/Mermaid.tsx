"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";

/** 본문 내 <pre class="mermaid"> 블록을 클라이언트에서 렌더링 (테마 변경 시 다시 그림) */
export function Mermaid() {
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const blocks = Array.from(document.querySelectorAll<HTMLElement>("pre.mermaid"));
    if (blocks.length === 0) return;

    let cancelled = false;
    (async () => {
      const { default: mermaid } = await import("mermaid");
      if (cancelled) return;
      for (const el of blocks) {
        el.dataset.source ??= el.textContent ?? "";
        el.removeAttribute("data-processed");
        el.textContent = el.dataset.source;
      }
      mermaid.initialize({ startOnLoad: false, theme: resolvedTheme === "dark" ? "dark" : "default", securityLevel: "strict" });
      await mermaid.run({ nodes: blocks, suppressErrors: true });
    })();
    return () => {
      cancelled = true;
    };
  }, [resolvedTheme]);

  return null;
}
