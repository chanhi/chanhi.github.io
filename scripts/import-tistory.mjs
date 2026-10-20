// Tistory 글 → Obsidian 마크다운 1회성 이관 스크립트
//   node scripts/import-tistory.mjs [--from 1] [--to 80] [--force]
// - 글 번호(/1 ~ /N)를 순회하며 본문(.contents_style)을 추출해 Markdown으로 변환
// - 이미지는 content/assets/tistory/ 로 내려받아 ![[파일명]] 임베드로 연결
// - 이미 이관된 글(frontmatter tistory: URL)은 --force 없이는 건너뜀
import fs from "node:fs";
import path from "node:path";
import * as cheerio from "cheerio";
import TurndownService from "turndown";
import { gfm } from "turndown-plugin-gfm";

const BLOG = "https://chanhuy.tistory.com";
const CONTENT = "content";
const ASSET_DIR = path.join(CONTENT, "assets", "tistory");

const args = process.argv.slice(2);
const arg = (name, def) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? Number(args[i + 1]) : def;
};
const FROM = arg("from", 1);
const TO = arg("to", 80);
const FORCE = args.includes("--force");

/** Tistory 카테고리 → [category, subcategory] */
const CATEGORY_MAP = {
  algorithm: ["cs", "algorithm"],
  database: ["cs", "database"],
  "operating system": ["cs", "os"],
  "git & github": ["develop", "git"],
  python: ["develop", "python"],
  토이플젝: ["develop", "infra"],
  정보처리기사: ["certificate", undefined],
  "프로젝트 회고": ["retrospect", "project"],
  csts: ["certificate", undefined],
  오픈소스sw: ["retrospect", "project"],
};

const KNOWN_LANGS =
  /^(bash|sh|shell|zsh|powershell|python|py|java|javascript|js|typescript|ts|jsx|tsx|json|yaml|yml|sql|html|xml|css|c|cpp|csharp|go|rust|kotlin|dockerfile|ini|toml|text|plaintext|markdown|md|diff)$/;

const td = new TurndownService({ headingStyle: "atx", codeBlockStyle: "fenced", bulletListMarker: "-", emDelimiter: "*" });
td.use(gfm);

// Tistory 코드블록: <pre data-ke-language="bash"><code>…</code></pre>
td.addRule("tistoryCode", {
  filter: (node) => node.nodeName === "PRE",
  replacement: (_c, node) => {
    // class는 에디터 자동감지 값(vim, routeros 등)이라 신뢰하지 않고 흔한 언어만 인정
    const raw = (node.getAttribute("data-ke-language") || node.className || "").split(/\s+/)[0].replace(/^language-/, "").toLowerCase();
    const lang = KNOWN_LANGS.test(raw) ? raw : "";
    const code = node.textContent.replace(/\n$/, "");
    const fence = code.includes("```") ? "````" : "```";
    return `\n\n${fence}${lang === "plaintext" ? "text" : lang}\n${code}\n${fence}\n\n`;
  },
});
td.addRule("figcaption", { filter: "figcaption", replacement: (c) => (c.trim() ? `\n*${c.trim()}*\n` : "") });
td.addRule("emptyParagraph", {
  filter: (node) => node.nodeName === "P" && !node.textContent.trim() && !node.querySelector("img"),
  replacement: () => "\n",
});

function sanitizeFileName(s) {
  return s.replace(/[\\/:*?"<>|#^[\]]/g, " ").replace(/\s+/g, " ").trim().slice(0, 80);
}

function existingImports() {
  const map = new Map();
  const walk = (dir) => {
    if (!fs.existsSync(dir)) return;
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) walk(full);
      else if (e.name.endsWith(".md")) {
        const m = fs.readFileSync(full, "utf8").match(/^tistory:\s*(\S+)/m);
        if (m) map.set(m[1], full);
      }
    }
  };
  walk(CONTENT);
  return map;
}

async function download(url, base) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  const type = res.headers.get("content-type") ?? "";
  const ext = type.includes("png") ? "png" : type.includes("gif") ? "gif" : type.includes("webp") ? "webp" : type.includes("svg") ? "svg" : "jpg";
  const file = `${base}.${ext}`;
  fs.writeFileSync(path.join(ASSET_DIR, file), Buffer.from(await res.arrayBuffer()));
  return file;
}

function yamlString(s) {
  return JSON.stringify(s);
}

async function importPost(id) {
  const url = `${BLOG}/${id}`;
  const res = await fetch(url);
  if (!res.ok) return null;
  const html = await res.text();
  const $ = cheerio.load(html);
  const body = $(".contents_style").first();
  if (!body.length) return null;

  const title = $('meta[property="og:title"]').attr("content")?.trim() ?? `tistory-${id}`;
  const date = ($('meta[property="article:published_time"]').attr("content") ?? "").slice(0, 10);
  const tistoryCategory = $("a.category").first().text().trim();
  const [category, subcategory] = CATEGORY_MAP[tistoryCategory.toLowerCase()] ?? ["retrospect", "review"];

  // 링크 미리보기(opengraph) 카드 → 일반 링크
  body.find('figure[data-ke-type="opengraph"]').each((_, el) => {
    const href = $(el).attr("data-og-url") || $(el).find("a").attr("href") || "";
    const label = $(el).attr("data-og-title") || href;
    $(el).replaceWith($("<p>").append("🔗 ", $("<a>").attr("href", href).text(label)));
  });

  // 이미지 다운로드 → Obsidian 임베드 placeholder
  let n = 0;
  const embeds = [];
  for (const img of body.find("img").toArray()) {
    const src = $(img).attr("data-src") || $(img).attr("src") || $(img).attr("data-url");
    if (!src || src.startsWith("data:")) continue;
    try {
      const file = await download(src.startsWith("//") ? `https:${src}` : src, `${id}-${++n}`);
      const token = `IMGEMBED${embeds.length}X`;
      embeds.push(`![[${file}]]`);
      $(img).replaceWith(`<p>${token}</p>`);
    } catch (e) {
      console.warn(`  ! 이미지 실패 ${src}: ${e.message}`);
    }
  }
  body.find("script, style, .another_category, .container_postbtn, iframe[src*='ad']").remove();

  let md = td.turndown(body.html() ?? "");
  embeds.forEach((e, i) => (md = md.replace(`IMGEMBED${i}X`, e)));
  md = md.replace(/\n{3,}/g, "\n\n").replace(/ /g, " ").trim();

  const prefix = title.match(/^\[([^\]]+)\]/)?.[1];
  // 요약(summary)은 비워 두면 사이트 빌드 시 본문에서 자동 추출
  const tags = [...new Set([prefix, tistoryCategory].filter(Boolean).map((t) => t.replace(/\s+/g, "")))];

  return { id, url, title, date, category, subcategory, tags, md };
}

async function main() {
  fs.mkdirSync(ASSET_DIR, { recursive: true });
  const done = existingImports();
  const posts = [];

  for (let id = FROM; id <= TO; id++) {
    const url = `${BLOG}/${id}`;
    if (done.has(url) && !FORCE) {
      console.log(`- ${id} 건너뜀 (이미 이관됨)`);
      continue;
    }
    const post = await importPost(id);
    if (!post) continue;
    console.log(`✓ ${id} [${post.category}/${post.subcategory ?? "-"}] ${post.title}`);
    posts.push(post);
  }

  // 제목 끝 숫자만 다른 글들은 series로 묶음 (예: "원격 서버 만들기1", "원격 서버 만들기2")
  const base = (t) => t.replace(/\s*\d+\s*$/, "").trim();
  const groups = new Map();
  for (const p of posts) if (/\d\s*$/.test(p.title)) groups.set(base(p.title), (groups.get(base(p.title)) ?? 0) + 1);

  for (const p of posts) {
    const series = groups.get(base(p.title)) > 1 ? base(p.title).replace(/^\[[^\]]+\]\s*/, "") : undefined;
    const dir = path.join(CONTENT, p.category, p.subcategory ?? "");
    fs.mkdirSync(dir, { recursive: true });
    const file = done.get(p.url) ?? path.join(dir, `${sanitizeFileName(p.title)}.md`);
    const fm = [
      "---",
      `title: ${yamlString(p.title)}`,
      `slug: tistory-${p.id}`,
      `date: ${p.date}`,
      ...(p.subcategory ? [`subcategory: ${p.subcategory}`] : []),
      `tags: [${p.tags.map(yamlString).join(", ")}]`,
      ...(series ? [`series: ${yamlString(series)}`] : []),
      `tistory: ${p.url}`,
      "---",
      "",
    ].join("\n");
    fs.writeFileSync(file, `${fm}\n${p.md}\n`);
  }
  console.log(`\n${posts.length}개 글 이관 완료`);
  rewriteInternalLinks();
}

/** 본문 속 chanhuy.tistory.com/{id} 링크 → 새 블로그 URL (/category/tistory-{id}/) */
function rewriteInternalLinks() {
  const imported = existingImports();
  const urlOf = new Map();
  for (const [tistoryUrl, file] of imported) {
    const id = tistoryUrl.split("/").pop();
    const category = path.relative(CONTENT, file).split(path.sep)[0];
    urlOf.set(id, `/${category}/tistory-${id}/`);
  }
  let changed = 0;
  for (const file of imported.values()) {
    const src = fs.readFileSync(file, "utf8");
    const [, fm, body] = src.match(/^(---[\s\S]*?\n---\n)([\s\S]*)$/) ?? [null, "", src];
    const next = body
      // [https://chanhuy.tistory.com/40](https://chanhuy.tistory.com/40) 처럼 URL만 있는 링크는 제목 링크와 중복이므로 제거
      .replace(/^\[https?:\/\/chanhuy\.tistory\.com\/(\d+)\]\(https?:\/\/chanhuy\.tistory\.com\/\1\)\s*$/gm, "")
      .replace(/\(https?:\/\/chanhuy\.tistory\.com\/(\d+)\)/g, (m, id) => (urlOf.has(id) ? `(${urlOf.get(id)})` : m));
    if (next !== body) {
      fs.writeFileSync(file, fm + next.replace(/\n{3,}/g, "\n\n"));
      changed++;
    }
  }
  console.log(`내부 링크 변환: ${changed}개 파일`);
}

if (args.includes("--links-only")) {
  rewriteInternalLinks();
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
