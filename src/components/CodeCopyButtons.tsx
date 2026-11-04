"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { CopyButton } from "@/components/animate-ui/components/buttons/copy";

type Target = { host: HTMLElement; code: string };

/**
 * 본문(dangerouslySetInnerHTML)의 코드 블록마다 animate-ui CopyButton을 portal로 붙인다.
 * mermaid 블록은 rehype-pretty-code figure가 아니므로 대상에서 빠진다.
 */
export function CodeCopyButtons({ containerId }: { containerId: string }) {
  const [targets, setTargets] = useState<Target[]>([]);

  useEffect(() => {
    const root = document.getElementById(containerId);
    if (!root) return;
    const hosts: HTMLElement[] = [];
    const found = Array.from(root.querySelectorAll<HTMLElement>("figure[data-rehype-pretty-code-figure]")).flatMap((figure) => {
      const pre = figure.querySelector("pre");
      if (!pre) return [];
      const host = document.createElement("div");
      host.className = "code-copy";
      figure.appendChild(host);
      hosts.push(host);
      return [{ host, code: pre.innerText.replace(/\n$/, "") }];
    });
    setTargets(found);
    return () => hosts.forEach((h) => h.remove());
  }, [containerId]);

  return targets.map(({ host, code }, i) =>
    createPortal(
      <CopyButton
        key={i}
        content={code}
        size="sm"
        delay={2000}
        aria-label="코드 복사"
        className="rounded-md border-2 border-border bg-card text-foreground shadow-none hover:bg-muted"
      />,
      host,
    ),
  );
}
