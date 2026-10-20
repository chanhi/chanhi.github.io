import type { Root, PhrasingContent, Text, Code, Image } from "mdast";
import { visit, SKIP } from "unist-util-visit";
import GithubSlugger from "github-slugger";
import { bundledLanguages } from "shiki";
import { resolveAsset, resolveWikiLink } from "@/lib/content";
import { tagHref } from "@/lib/utils";

const IMAGE_EXT = /\.(png|jpe?g|gif|webp|svg|avif|bmp)$/i;
const TOKEN = /(!?)\[\[([^\]]+?)\]\]|==([^=\n]+?)==|(^|\s)#([\p{L}_][\p{L}\p{N}_\-/]*)|\s\^[\w-]+$/gu;

function escapeHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

/** `노트#섹션|별칭` 파싱 (표 안에서 쓰는 `\|`도 허용) */
function parseTarget(inner: string) {
  const [targetPart, alias] = inner.split(/\\?\|/);
  const [file, heading] = targetPart.split("#");
  return { file: file.trim(), heading: heading?.trim(), alias: alias?.trim() };
}

function wikiLink(inner: string): PhrasingContent {
  const { file, heading, alias } = parseTarget(inner);
  const label = alias || (heading ? `${file} › ${heading}` : file);
  const base = file ? resolveWikiLink(file) : "";
  if (base === undefined) {
    return { type: "html", value: `<span class="wikilink-missing" title="아직 작성되지 않은 글">${escapeHtml(label)}</span>` };
  }
  const hash = heading ? `#${new GithubSlugger().slug(heading)}` : "";
  return { type: "link", url: `${base}${hash}`, children: [{ type: "text", value: label }] };
}

function embed(inner: string): PhrasingContent {
  const { file, alias } = parseTarget(inner);
  const width = alias && /^\d+(x\d+)?$/.test(alias) ? alias.split("x")[0] : undefined;

  // Excalidraw: Obsidian Excalidraw 플러그인의 Auto-export SVG 결과물 사용
  if (/\.excalidraw(\.md)?$/i.test(file) || !/\.\w+$/.test(file)) {
    const svg = resolveAsset(`${file.replace(/\.md$/i, "")}.svg`) ?? resolveAsset(`${file}.excalidraw.svg`);
    if (svg) return { type: "image", url: svg, alt: file };
    if (/excalidraw/i.test(file)) {
      return { type: "html", value: `<span class="wikilink-missing" title="SVG로 export 필요">🖼 ${escapeHtml(file)}</span>` };
    }
    // 노트 임베드는 링크로 대체
    return wikiLink(inner);
  }

  const url = resolveAsset(file);
  if (!url) return { type: "html", value: `<span class="wikilink-missing" title="첨부파일 없음">🖼 ${escapeHtml(file)}</span>` };
  if (IMAGE_EXT.test(file)) {
    if (width) return { type: "html", value: `<img src="${url}" alt="${escapeHtml(file)}" width="${width}" loading="lazy" />` };
    return { type: "image", url, alt: alias ?? file };
  }
  return { type: "link", url, children: [{ type: "text", value: `📎 ${file}` }] };
}

function splitText(node: Text): PhrasingContent[] | null {
  const value = node.value;
  const out: PhrasingContent[] = [];
  let last = 0;
  let changed = false;

  for (const m of value.matchAll(TOKEN)) {
    const start = m.index!;
    const [whole, bang, wiki, mark, pre, tag] = m;
    changed = true;
    if (start > last) out.push({ type: "text", value: value.slice(last, start) });

    if (wiki !== undefined) out.push(bang ? embed(wiki) : wikiLink(wiki));
    else if (mark !== undefined) out.push({ type: "html", value: `<mark>${escapeHtml(mark)}</mark>` });
    else if (tag !== undefined) {
      if (pre) out.push({ type: "text", value: pre });
      out.push({ type: "link", url: tagHref(tag), children: [{ type: "text", value: `#${tag}` }] });
    }
    // 그 외: ^block-id → 제거
    last = start + whole.length;
  }
  if (!changed) return null;
  if (last < value.length) out.push({ type: "text", value: value.slice(last) });
  return out;
}

/** Obsidian 문법 → 표준 mdast */
export default function remarkObsidian() {
  return (tree: Root) => {
    visit(tree, "text", (node, index, parent) => {
      if (!parent || index === undefined || parent.type === "link") return;
      const replaced = splitText(node);
      if (!replaced) return;
      parent.children.splice(index, 1, ...(replaced as typeof parent.children));
      return [SKIP, index + replaced.length];
    });

    // 일반 마크다운 이미지의 상대경로도 assets 기준으로 resolve
    visit(tree, "image", (node: Image) => {
      if (/^(https?:|data:|\/)/.test(node.url)) return;
      const url = resolveAsset(node.url);
      if (url) node.url = url;
    });

    visit(tree, "code", (node: Code, index, parent) => {
      if (node.lang === "mermaid" && parent && index !== undefined) {
        parent.children.splice(index, 1, { type: "html", value: `<pre class="mermaid">${escapeHtml(node.value)}</pre>` });
        return;
      }
      // shiki가 모르는 언어는 plain text로 (빌드 실패 방지)
      const lang = node.lang?.toLowerCase();
      if (lang && !(lang in bundledLanguages)) {
        node.meta = [node.meta, `title="${node.lang}"`].filter(Boolean).join(" ");
        node.lang = "text";
      }
      // rehype-raw를 거치면 node.data.meta가 사라지므로 속성으로 전달 (rehype-pretty-code가 metastring을 읽음)
      if (node.meta) node.data = { ...node.data, hProperties: { metastring: node.meta } };
    });
  };
}
