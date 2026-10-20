// content/assets → public/assets 복사 (Obsidian 첨부파일을 정적 파일로 제공)
import { cpSync, existsSync, rmSync } from "node:fs";

const src = "content/assets";
const dest = "public/assets";

if (existsSync(dest)) rmSync(dest, { recursive: true, force: true });
if (existsSync(src)) cpSync(src, dest, { recursive: true });
console.log(`[copy-assets] ${src} → ${dest}`);
