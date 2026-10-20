import type { Root, Blockquote, Paragraph, Text } from "mdast";
import { visit } from "unist-util-visit";

const CALLOUT = /^\[!([\w-]+)\]([+-])?[ \t]*(.*)$/;

/**
 * Obsidian callout
 *   > [!warning] 제목
 *   > 내용
 * → <div class="callout" data-callout="warning"><div class="callout-title">…</div><div class="callout-content">…</div></div>
 * 접기(`[!note]-` / `[!note]+`)는 <details>로 변환
 */
export default function remarkCallout() {
  return (tree: Root) => {
    visit(tree, "blockquote", (node: Blockquote) => {
      const first = node.children[0];
      if (first?.type !== "paragraph") return;
      const head = first.children[0];
      if (head?.type !== "text") return;

      const [line, ...restLines] = head.value.split("\n");
      const match = line.match(CALLOUT);
      if (!match) return;

      const [, rawType, fold, rawTitle] = match;
      const type = rawType.toLowerCase();
      const collapsible = Boolean(fold);

      // 제목 줄 이후 첫 문단에 남은 내용
      const rest = restLines.join("\n");
      const titleChildren: Paragraph["children"] = [
        { type: "text", value: rawTitle || type.charAt(0).toUpperCase() + type.slice(1) },
      ];
      const remaining: Paragraph["children"] = [];
      if (restLines.length === 0) {
        // 같은 줄에 인라인 요소(링크 등)가 이어지는 경우 제목에 포함
        titleChildren.push(...first.children.slice(1).filter((c) => !(c.type === "text" && c.value.startsWith("\n"))));
      } else {
        if (rest) remaining.push({ type: "text", value: rest } as Text);
        remaining.push(...first.children.slice(1));
      }

      const body = [...(remaining.length ? [{ ...first, children: remaining }] : []), ...node.children.slice(1)];

      node.data = {
        hName: collapsible ? "details" : "div",
        hProperties: {
          className: ["callout"],
          "data-callout": type,
          ...(fold === "+" ? { open: true } : {}),
        },
      };
      node.children = [
        {
          type: "paragraph",
          data: { hName: collapsible ? "summary" : "div", hProperties: { className: ["callout-title"] } },
          children: titleChildren,
        },
        {
          type: "blockquote",
          data: { hName: "div", hProperties: { className: ["callout-content"] } },
          children: body as Blockquote["children"],
        },
      ];
    });
  };
}
