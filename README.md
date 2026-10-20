# chanhi.github.io

개인 포트폴리오 & 개발 블로그. Next.js(static export) + Tailwind CSS v4, 글은 Obsidian으로 작성합니다.

## 개발

```bash
npm install
npm run dev              # http://localhost:3000
npm run build            # out/ 에 정적 사이트 생성
npm start                # out/ 미리보기
npm run typecheck        # 타입 검사
npm run check:sensitive -- <파일...>   # 게시 전 민감정보 검사
```

## 새 PC에서 이어서 작업하기

```bash
git clone https://github.com/chanhi/chanhi.github.io.git
cd chanhi.github.io
npm install
```

저장소에 들어 있지 않아서 따로 챙겨야 하는 것:

| 항목 | 위치 | 용도 |
| --- | --- | --- |
| Node.js 22 이상 | – | 빌드·개발 서버 |
| 게시 금지어 목록 | `~/.claude/publish-denylist.txt` | `publish-note` 스킬과 `check:sensitive`가 사용. 없으면 검사가 실패하도록 되어 있음 |
| 연구 노트 vault | 개인 Obsidian vault | `publish-note`로 게시할 원본 노트 |

`node_modules/`, `.next/`, `out/`, `public/assets/`는 빌드 산출물이라 저장소에 없으며 `npm install` / `npm run build`로 다시 생성됩니다.

## 글 쓰기 (Obsidian)

1. Obsidian에서 **`content/` 폴더를 vault로 열기** (첨부파일은 `content/assets/`에 자동 저장되도록 설정되어 있음)
2. 카테고리 폴더에 `.md` 작성 → 템플릿: `content/templates/post.md`
3. `git push` 하면 GitHub Actions가 빌드·배포

| 폴더 | 메뉴 | 하위 폴더 = subcategory |
| --- | --- | --- |
| `content/develop/` | Develop | ai, backend, frontend, infra, git, python |
| `content/research/` | Research | llm-eval, agent, observability, claude, ontology |
| `content/cs/` | CS | algorithm, database, os, network, lecture |
| `content/retrospect/` | 회고/후기 | project, review |
| `content/certificate/` | 자격증 | – |
| `content/portfolio/` | Portfolio | – |

메뉴·카테고리는 [src/config/site.ts](src/config/site.ts) 한 곳에서 관리합니다. 메인 페이지 이력은 [content/profile.yaml](content/profile.yaml)을 수정하세요.

### 연구 노트 게시 (`publish-note` 스킬)

회사 업무와 섞일 수 있는 연구 노트는 이 저장소에서 직접 쓰지 않습니다. 별도 Obsidian vault에서 작성을 마친 뒤 Claude Code에 경로를 알려 주면 [publish-note 스킬](.claude/skills/publish-note/SKILL.md)이 처리합니다.

```text
/publish-note <vault 안 노트 경로>
# 또는 "기술-연구/AI/Flue.md 블로그에 올려줘"
```

1. 원본 노트를 **읽기 전용**으로 읽고, `source` 필드로 기존 글인지 찾습니다(있으면 갱신, 없으면 신규).
2. 구조는 유지하고 문체만 블로그 말투로 다듬은 뒤, 위키링크·이미지를 정리하고 민감정보를 정제합니다.
3. `check:sensitive`, `typecheck`, `build`로 검증합니다.
4. 변경 내용을 보고하고, **승인을 받은 뒤에만** 커밋·push합니다.

> 이 저장소는 공개 저장소입니다. 고객사·사내 시스템 이름 같은 구체적인 금지어는 저장소 밖 `~/.claude/publish-denylist.txt`에만 둡니다(한 줄에 하나, 대소문자 무시, `#` 주석).

### Frontmatter

```yaml
title: 글 제목            # 없으면 첫 번째 # 제목 또는 파일명
slug: english-url-slug    # 없으면 파일명
date: 2026-10-19
updated: 2026-10-21       # (선택) 수정일
subcategory: infra        # 없으면 하위 폴더명
tags: [Docker, Linux]
aliases: [별칭]            # (선택) [[위키링크]] 연결에 사용
source: 기술-연구/AI/Flue.md  # (선택) publish-note가 기록하는 원본 노트 경로
series: 시리즈 이름        # 같은 series끼리 목록·순서 자동 연결
seriesOrder: 1            # (선택) 시리즈 내 순서. 없으면 날짜순
summary: 한 줄 요약        # 없으면 본문에서 자동 추출
thumbnail: image.png      # assets 기준 파일명
draft: true               # 빌드에서 제외
```

포트폴리오 추가 필드: `period`, `role`, `team`, `stack[]`, `type: company|school|personal`, `github`, `demo`, `featured`, `order`.

### 지원하는 Obsidian 문법

- `[[노트]]`, `[[노트|별칭]]`, `[[노트#섹션]]` — 파일명·title·aliases로 연결, 없는 글은 점선 표시
- `![[image.png]]`, `![[image.png|300]]` — `content/assets/` 어디에 있든 파일명으로 찾음
- `![[drawing.excalidraw]]` — Excalidraw 플러그인의 **Auto-export SVG** 옵션을 켜고 SVG를 `assets/`에 두면 표시
- `> [!note]` 콜아웃 (`[!tip]-` 접기), ` ```mermaid `, `==하이라이트==`, `#인라인태그`, `$수식$`

## 학교 강의 노트

`content/cs/lecture/<과목>/` 에 넣고 `series: <과목명>` 을 지정하면 시리즈 목록이 자동 생성됩니다.

## Tistory 이관

```bash
npm run import:tistory -- --from 1 --to 80   # 이미 이관된 글은 건너뜀(--force로 덮어쓰기)
```

## 배포

`main`에 push하면 GitHub Actions([deploy.yml](.github/workflows/deploy.yml))가 빌드해 https://chanhi.github.io 에 배포합니다(Settings → Pages → Source: **GitHub Actions**).

- (선택) 댓글: Discussions 활성화 후 [giscus.app](https://giscus.app)에서 발급한 `repoId`, `categoryId`를 `src/config/site.ts`에 입력
