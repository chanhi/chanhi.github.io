import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeKatex from "rehype-katex";
import rehypeStringify from "rehype-stringify";
import type { Root, Element, ElementContent } from "hast";
import { visit } from "unist-util-visit";
import remarkCallout from "./remark/callout";
import remarkObsidian from "./remark/obsidian";

export type TocItem = { id: string; text: string; depth: number };

function textOf(node: ElementContent): string {
  if (node.type === "text") return node.value;
  if (node.type === "element") return node.children.map(textOf).join("");
  return "";
}

/** h2·h3로 목차 수집 + 외부 링크 새 탭 처리 */
function rehypeCollect() {
  return (tree: Root, file: { data: Record<string, unknown> }) => {
    const toc: TocItem[] = [];
    visit(tree, "element", (node: Element) => {
      if ((node.tagName === "h2" || node.tagName === "h3") && node.properties?.id) {
        toc.push({ id: String(node.properties.id), text: node.children.map(textOf).join("").trim(), depth: Number(node.tagName[1]) });
      }
      if (node.tagName === "a" && typeof node.properties?.href === "string" && /^https?:/.test(node.properties.href)) {
        node.properties.target = "_blank";
        node.properties.rel = ["noopener", "noreferrer"];
      }
      if (node.tagName === "img") node.properties.loading ??= "lazy";
    });
    file.data.toc = toc;
  };
}

const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkMath)
  .use(remarkCallout)
  .use(remarkObsidian)
  .use(remarkRehype, { allowDangerousHtml: true })
  .use(rehypeRaw)
  .use(rehypeSlug)
  .use(rehypeAutolinkHeadings, { behavior: "wrap", properties: { className: ["anchor"] } })
  .use(rehypePrettyCode, {
    theme: { light: "github-light", dark: "github-dark-dimmed" },
    keepBackground: true,
    defaultLang: { block: "text" },
  })
  .use(rehypeKatex)
  .use(rehypeCollect)
  .use(rehypeStringify);

export async function renderMarkdown(source: string) {
  const file = await processor.process(source);
  return { html: String(file), toc: (file.data.toc as TocItem[]) ?? [] };
}
