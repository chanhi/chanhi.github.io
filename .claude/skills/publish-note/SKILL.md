---
name: publish-note
description: 사용자가 Obsidian vault의 작성 완료된 노트 경로를 주며 블로그에 올려 달라고 할 때 사용. 노트를 읽기 전용으로 읽어 민감정보를 정제하고, 이 블로그(content/) 형식의 포스트로 새로 만들거나 기존 포스트를 갱신한 뒤, 검증 결과를 보고하고 승인을 받아 커밋·push한다. "블로그에 올려줘", "포스팅해줘", "노트 반영해줘", /publish-note <경로> 등에 사용.
---

# publish-note — Obsidian 노트를 블로그 포스트로 게시

이 저장소는 **공개** 저장소다. 이 스킬 파일과 포스트에 고객사명·사내 시스템명을 적지 않는다. 구체적인 금지어는 저장소 밖 `~/.claude/publish-denylist.txt`에만 있다.

## 0. 원칙

- 원본 vault(기본 `C:\Users\LG\Documents\icnit`)는 **읽기 전용**이다. 절대 수정하지 않는다.
- 기본 허용 범위는 vault의 `기술-연구/` 폴더다. 그 밖의 노트(`2026 프로젝트/`, `개인필기/` 등)를 받으면 회사 프로젝트 내용일 수 있다고 알리고 게시 여부를 먼저 확인한다.
- 편집 수준: **원본 구조(섹션·표·코드·다이어그램)는 유지하고 문체만 블로그 말투(~합니다)로 다듬는다.** 재구성은 사용자가 요청할 때만 한다.
- 커밋·push는 **매번 보고 후 승인**을 받은 뒤에만 한다.

## 1. 원본 읽기와 기존 포스트 찾기

1. 노트 전체를 읽는다. 노트의 frontmatter(`tags`, `aliases`, `date`)를 확인한다.
2. vault 기준 상대 경로를 구한다(예: `기술-연구/AI/Flue.md`). **전체 경로는 공개하지 않는다.**
3. 이미 게시된 글인지 찾는다: `content/` 아래에서 `^source: <상대 경로>$`를 Grep한다.
   - 있으면 → **갱신 모드**: 그 파일을 덮어쓴다. `slug`, 카테고리 위치, `date`(최초 게시일)는 유지하고 `updated: 오늘 날짜`를 추가·갱신한다.
   - 없으면 → **신규 모드**.

## 2. 위치와 메타데이터 결정 (신규 모드)

- 카테고리·하위 카테고리는 `src/config/site.ts`의 `categories`에서 고른다. 기술 연구 노트는 보통 `research/<llm-eval|agent|observability|claude|ontology>`다. 맞는 하위 카테고리가 없으면 새로 만들지 말고 사용자에게 제안한다.
- 파일 경로: `content/<category>/<subcategory>/<slug>.md`
- frontmatter 형식:

```yaml
---
title: <블로그용 제목>
slug: <영문 소문자 kebab-case, 파일명과 동일>
date: <노트 frontmatter의 date, 없으면 오늘>
subcategory: <하위 카테고리>
tags: [<노트 tags 기반 2~5개>]
aliases: [<노트 aliases — 다른 글의 [[위키링크]] 해석에 쓰임>]
series: <같은 주제 글이 2개 이상이면, 선택>
summary: <한 문장 요약>
source: <vault 상대 경로>
---
```

## 3. 본문 변환

- **제거**: 노트의 `# 제목`(페이지 헤더가 렌더링함), frontmatter 직후의 `---`, `^block-id`
- **위키링크**: `[[노트명]]`, `[[노트명#섹션|별칭]]`
  - 블로그에 해당 글이 있으면 `[[포스트파일명|표시텍스트]]`로 바꾼다(포스트 파일명·title·aliases로 Grep해 확인).
  - 회사 프로젝트 노트, 공개하지 않기로 한 노트(예: Hermes Agent), 아직 게시하지 않은 노트로 가는 링크는 **링크를 지우거나 일반 텍스트로** 바꾼다. 문장 자체가 회사 맥락이면 문장째 지운다.
- **이미지** `![[파일.png]]`: 이미지를 직접 열어 사내 화면·내부 주소·고객 데이터가 없는지 확인한 뒤에만 `content/assets/research/`로 복사한다. 의심되면 복사하지 말고 보고한다. 파일명은 그대로 둔다(파일명으로 resolve됨).
- **Excalidraw** `![[x.excalidraw]]`: 같은 이름의 `.svg`가 vault에 있으면 확인 후 복사하고, 없으면 임베드를 지우고 "SVG export 필요"라고 보고한다.
- callout, mermaid, 표, 코드블록, `==하이라이트==`는 그대로 쓴다. 코드블록 파일명 주석은 `ts title="src/app.ts"` 형식의 메타로 옮겨도 된다.
- 외부 글을 번역·요약한 노트라면 긴 번역문은 줄이고 `##### 참조`에 출처 링크를 남긴다.

## 4. 정제 (필수)

다음은 금지어 목록에 없더라도 직접 판단해 지운다.

- 내부 IP·포트·도메인, DB명, 저장소 URL, compose·서버 경로
- 고객사명, 사내 프로젝트명, 사내 서비스·모델 라우팅 이름
- 사내 시스템의 성능·정확도 수치, 회의 내용, 일정
- 프로젝트 고유 함수명이나 코드(일반적인 라이브러리 API 예시는 허용)
- 사람 이름, 연락처, 이메일

## 5. 검증

```bash
export PATH="/c/Program Files/nodejs:$PATH"   # Bash에서 node가 없을 때
node scripts/check-sensitive.mjs <작성한 포스트 파일> [복사한 텍스트 파일...]
npm run typecheck
npm run build
```

- `check-sensitive`가 `[차단]`을 내면(exit 1) 해당 부분을 고치고 다시 실행한다. `[확인]`(IP·포트 형태)은 문서 예시인지 직접 판단해 보고에 포함한다.
- 빌드 후 `out/<category>/<slug>/index.html`에서 `wikilink-missing`이 있는지 확인하고, 있으면 링크를 정리한다.

## 6. 보고하고 승인 받기

다음을 보고하고 커밋·push 여부를 묻는다(AskUserQuestion 사용 가능):

- 신규/갱신 여부, 파일 경로, 게시될 URL(`https://chanhi.github.io/<category>/<slug>/`)
- 정제 과정에서 지우거나 바꾼 내용 목록(링크, 문장, 이미지)
- `check-sensitive`의 `[확인]` 항목과 판단 근거
- 빌드 결과

승인을 받으면:

```bash
git add <포스트 파일> <복사한 assets>
git commit -m "<신규: 글 추가 / 갱신: 글 업데이트>: <제목>"   # 저장소 커밋 규칙의 attribution 포함
git push
```

push 후 GitHub Actions 배포가 끝나면 게시 URL이 200을 반환하는지 확인해 알린다.
