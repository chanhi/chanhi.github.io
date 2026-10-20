# chanhi.github.io

개인 포트폴리오 & 개발 블로그. Next.js(static export) + Tailwind CSS v4, 글은 Obsidian으로 작성합니다.

## 개발

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # out/ 에 정적 사이트 생성
npm start          # out/ 미리보기
```

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

### Frontmatter

```yaml
title: 글 제목            # 없으면 첫 번째 # 제목 또는 파일명
slug: english-url-slug    # 없으면 파일명
date: 2026-10-19
subcategory: infra        # 없으면 하위 폴더명
tags: [Docker, Linux]
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

1. GitHub에 `chanhi.github.io` 저장소 생성 후 push
2. Settings → Pages → Source: **GitHub Actions**
3. (선택) 댓글: Discussions 활성화 후 [giscus.app](https://giscus.app)에서 발급한 `repoId`, `categoryId`를 `src/config/site.ts`에 입력
