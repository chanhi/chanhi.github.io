// 게시 전 민감정보 검사
//   node scripts/check-sensitive.mjs <파일...>
// - 금지어 목록: ~/.claude/publish-denylist.txt (공개 저장소 밖, 환경변수 PUBLISH_DENYLIST로 변경 가능)
//   한 줄에 하나, 대소문자 무시 부분 일치, # 주석. 하나라도 걸리면 exit 1
// - IP·포트 패턴은 문서 예시일 수 있으므로 경고로만 보고 (사람이 확인)
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const files = process.argv.slice(2);
if (files.length === 0) {
  console.error("사용법: node scripts/check-sensitive.mjs <파일...>");
  process.exit(2);
}

const denylistPath = process.env.PUBLISH_DENYLIST ?? path.join(os.homedir(), ".claude", "publish-denylist.txt");
if (!fs.existsSync(denylistPath)) {
  console.error(`금지어 목록이 없습니다: ${denylistPath}`);
  process.exit(2);
}
const denylist = fs
  .readFileSync(denylistPath, "utf8")
  .split(/\r?\n/)
  .map((l) => l.replace(/#.*$/, "").trim())
  .filter(Boolean);

const IPV4 = /\b(?:\d{1,3}\.){3}\d{1,3}\b/g;
const SAFE_IP = /^(0\.0\.0\.0|127\.0\.0\.1|000\.000\.000\.000|100\.x\.y\.z)$/;
const PORT = /([\w.-]+):(\d{4,5})\b/g;
const SAFE_HOST = /^(localhost|127\.0\.0\.1|0\.0\.0\.0|example\.com)$/;

let blocked = 0;
let warned = 0;

for (const file of files) {
  const lines = fs.readFileSync(file, "utf8").split(/\r?\n/);
  lines.forEach((line, i) => {
    const where = `${file}:${i + 1}`;
    const lower = line.toLowerCase();
    for (const word of denylist) {
      if (lower.includes(word.toLowerCase())) {
        blocked++;
        console.log(`[차단] ${where} 금지어 "${word}"`);
      }
    }
    for (const m of line.matchAll(IPV4)) {
      if (SAFE_IP.test(m[0])) continue;
      warned++;
      console.log(`[확인] ${where} IP 형태 "${m[0]}"`);
    }
    for (const m of line.matchAll(PORT)) {
      if (SAFE_HOST.test(m[1])) continue;
      warned++;
      console.log(`[확인] ${where} 포트 형태 "${m[0]}"`);
    }
  });
}

console.log(`\n금지어 ${blocked}건, 확인 필요 ${warned}건 (목록: ${denylist.length}개 항목)`);
process.exit(blocked > 0 ? 1 : 0);
