# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 언어

- **모든 답변은 한국어로 한다.** 코드 주석과 블로그 콘텐츠도 한국어로 작성한다(기술 용어는 원어 병기 가능).

## 개요

개인 포트폴리오 & 개발 블로그(https://chanhi.github.io). Next.js 16 App Router를 `output: "export"`로 정적 빌드해 GitHub Pages에 배포한다. 글은 Obsidian으로 `content/`에 작성한다.

## 명령어

Node가 PATH에 없을 수 있다. Bash에서는 `export PATH="/c/Program Files/nodejs:$PATH"`를 먼저 실행한다.

```bash
npm run dev          # 개발 서버 (predev로 content/assets → public/assets 복사)
npm run build        # out/ 에 정적 사이트 생성 (prebuild로 assets 복사)
npm start            # out/ 미리보기 (npx serve out)
npm run typecheck    # tsc --noEmit
npm run import:tistory -- --from 1 --to 80   # Tistory 이관 (--force 덮어쓰기, --links-only 내부 링크만 변환)
```

테스트·린트 설정은 없다. 변경 검증은 `npm run typecheck`와 `npm run build` 성공 여부로 한다.

배포: `main`에 push하면 `.github/workflows/deploy.yml`이 빌드 후 GitHub Pages에 배포한다.

## 아키텍처

### 콘텐츠 → 페이지 흐름

- **카테고리 단일 기준**: `src/config/site.ts`의 `categories` 배열이 Header·Sidebar 메뉴, 라우트(`/[category]`), `content/<slug>/` 폴더를 모두 결정한다. 카테고리를 추가하려면 여기와 폴더만 바꾸면 된다. Portfolio는 별도 라우트(`/portfolio`)다.
- **`src/lib/content.ts`**: `content/<category>/**/*.md`를 gray-matter로 읽는다. 처리 규칙은 다음과 같다.
  - `draft: true`는 제외한다.
  - `subcategory`가 없으면 하위 폴더명을 쓴다.
  - `slug`가 없으면 파일명을 slugify한다(한글 유지).
  - `summary`가 없으면 본문에서 자동으로 추출한다.
  - frontmatter 직후의 `---`와 첫 `# 제목`은 본문에서 제거한다. 제목은 페이지 헤더가 렌더링한다.
  - 포트폴리오(`content/portfolio/`)와 프로필(`content/profile.yaml`, 메인 페이지 이력 데이터)도 이 파일에서 읽는다.
- **`src/lib/markdown.ts`**: unified 파이프라인이다. 순서는 remark(gfm, math, **callout**, **obsidian**) → rehype(raw, slug, autolink, pretty-code, katex, 목차 수집)이다. HTML 문자열과 TOC를 반환하고, 페이지는 `dangerouslySetInnerHTML`로 렌더링한다.
- **Obsidian 문법 변환** (`src/lib/remark/`)
  - `obsidian.ts`: `[[위키링크]]`는 파일명·title·aliases로 URL을 찾는다(`resolveWikiLink`). 대상이 없으면 `.wikilink-missing`으로 표시한다. 같은 파일에서 아래 문법도 처리한다.
    - `![[첨부]]`: `content/assets/` 아래 파일명으로 resolve한다(`resolveAsset`).
    - `==하이라이트==`, 인라인 `#태그`, `^block-id` 제거
    - mermaid 코드블록은 `<pre class="mermaid">`로 바꾼다. 실제 렌더링은 클라이언트 `Mermaid.tsx`가 한다.
    - shiki가 모르는 언어는 `text`로 처리한다.
    - rehype-raw가 code meta를 지우므로 `hProperties.metastring`으로 전달한다. 코드블록 title이 이 값에 의존한다.
  - `callout.ts`: `> [!type]`은 `div.callout`으로, `> [!type]-`/`+`는 `details`로 바꾼다. 스타일은 `globals.css`에 있다.

### 정적 export 제약

- 모든 동적 라우트는 `generateStaticParams` + `dynamicParams = false`를 쓴다. 결과가 비면 빌드가 실패하므로 `_empty` placeholder로 대체하고 `notFound()` 처리한다.
- `searchParams`를 쓸 수 없다. 하위 카테고리 필터와 페이지네이션은 클라이언트 컴포넌트 `PostList.tsx`가 `?sub=`, `?page=`를 직접 읽는다.
- Route handler(`rss.xml`, `search-index.json`)와 `sitemap.ts`, `robots.ts`는 `dynamic = "force-static"`이 필요하다.
- `(blog)` 라우트 그룹이 사이드바 레이아웃을 제공한다. 홈(`/`)은 사이드바 없는 이력서 페이지다.

### 디자인

- 테마 토큰은 `src/app/globals.css`에 있다. 원본은 사용자가 준 `index.css`이고, Tailwind v4 `@theme inline`과 shadcn 스타일 oklch 변수를 쓴다.
- 다크 모드는 `.dark` 클래스(next-themes)로 전환한다.
- 공통 유틸리티로 `card-brutal`(테두리 카드)과 `hover-lift`(하드 섀도우 hover)를 쓴다. shadcn 패키지는 설치하지 않았고 컴포넌트를 직접 작성한다.

## 콘텐츠 작성 규칙

- **frontmatter**: `title, slug(영문 권장), date, subcategory, tags, series, seriesOrder, summary, thumbnail, draft`
  - 포트폴리오 추가 필드: `period, role, team, stack[], type(company|school|personal), github, demo, featured, order`
  - 템플릿: `content/templates/post.md`
- **이미지**: 모두 `content/assets/`에 둔다. Obsidian vault 설정(`content/.obsidian/app.json`)이 첨부 폴더를 여기로 지정한다.
- **Excalidraw**: SVG export 파일이 `assets`에 있어야 표시된다.
- **회사(ICNIT) 관련 공개 범위**: 회사 프로젝트는 게시하지 않는다. Research 글은 사내 vault의 `기술-연구/` 폴더 내용만 쓴다.
  - 쓰기 전에 내부 IP·포트, DB·서비스명, 고객사명, 사내 수치, 프로젝트 고유 함수명을 제거한다.
  - 원본 vault(`C:\Users\LG\Documents\icnit`)는 읽기 전용으로만 다룬다.
- **팀 프로젝트 포트폴리오**: 팀원 실명·학번·연락처는 넣지 않는다.
