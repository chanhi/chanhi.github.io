# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 언어

- **모든 답변은 한국어로 한다.** 코드 주석과 블로그 콘텐츠도 한국어로 작성한다(기술 용어는 원어 병기 가능).

## 개요

개인 포트폴리오 & 개발 블로그(https://chanhi.github.io). Next.js 16 App Router를 `output: "export"`로 정적 빌드해 GitHub Pages에 배포한다. 글은 Obsidian으로 `content/`에 작성한다.

## 명령어

```bash
npm run dev          # 개발 서버 (predev로 content/assets → public/assets 복사)
npm run build        # out/ 에 정적 사이트 생성 (prebuild로 assets 복사)
npm start            # out/ 미리보기 (npx serve out)
npm run typecheck    # tsc --noEmit
npm run import:tistory -- --from 1 --to 80   # Tistory 이관 (--force 덮어쓰기, --links-only 내부 링크만 변환)
npm run check:sensitive -- <파일...>          # 게시 전 민감정보 검사 (금지어 목록: ~/.claude/publish-denylist.txt, PUBLISH_DENYLIST로 변경)
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
- 서버에서 `searchParams`를 쓸 수 없다. 하위 카테고리 필터와 페이지네이션은 클라이언트 컴포넌트 `PostList.tsx`가 `useSearchParams`로 `?sub=`, `?page=`를 읽는다. 같은 경로에서 쿼리만 바뀌어도 갱신되려면 URL을 상태의 기준으로 써야 한다. `useSearchParams`는 Suspense 경계가 필요하고, 빌드 HTML에는 fallback(전체 목록 1페이지)이 들어간다.
- Route handler(`rss.xml`, `search-index.json`)와 `sitemap.ts`, `robots.ts`는 `dynamic = "force-static"`이 필요하다.
- `(blog)` 라우트 그룹이 사이드바 레이아웃을 제공한다. 홈(`/`)은 사이드바 없는 이력서 페이지다.

### 저작권과 크롤링 정책

글은 공개하되 **무단 복제와 AI 학습 이용은 금지**한다. 원문 저장소는 공개로 두고, 라이선스로 보호한다(저장소 비공개 전환은 하지 않기로 했다).

- `LICENSE`: 콘텐츠(`content/`와 사이트의 글·이미지)는 All Rights Reserved이며 TDM(텍스트·데이터 마이닝) 권리를 유보한다. 소스 코드는 MIT다.
- `src/app/robots.ts`: `AI_CRAWLERS` 배열의 AI 학습·수집 봇을 `Disallow: /`로 막는다. 검색 엔진 크롤러는 허용한다. 새 AI 봇을 막을 때는 이 배열에만 추가한다.
- `src/app/layout.tsx`의 `metadata.other`: 모든 페이지에 `robots: noai, noimageai`, `tdm-reservation: 1` 메타를 넣는다.
- `src/components/Footer.tsx`: 무단 복제·AI 학습 금지 문구를 표시한다.
- 위 네 곳은 함께 유지한다. 하나를 지우거나 완화할 때는 사용자에게 먼저 확인한다.

### 디자인

- 테마 토큰은 `src/app/globals.css`에 있다. 원본은 사용자가 준 `index.css`이고, Tailwind v4 `@theme inline`과 shadcn 스타일 oklch 변수를 쓴다.
- 다크 모드는 `.dark` 클래스(next-themes)로 전환한다.
- 공통 유틸리티로 `card-brutal`(테두리 카드)과 `hover-lift`(하드 섀도우 hover)를 쓴다. 새 UI도 이 브루탈리즘 스타일(2px 테두리, 하드 섀도우)에 맞춘다.
- **UI 컴포넌트 라이브러리**: shadcn CLI로 소스를 복사해 쓴다(`components.json`, 레지스트리 `@magicui`, `@animate-ui`). 애니메이션은 `motion`을 쓴다.
  - `src/components/ui/`: shadcn(command, dialog)과 magicui(blur-fade, dot-pattern, word-rotate, marquee, number-ticker, scroll-progress)
  - `src/components/animate-ui/`: animate-ui(highlight, sheet, copy button, theme-toggler). highlight는 목록 필터 탭(`FilterTabs`)에만 쓴다. sticky 헤더 메뉴에 쓰면 페이지 이동으로 스크롤이 바뀔 때 하이라이트가 아래에서 올라오는 문제가 있어 뺐다.
  - 복사된 소스는 프로젝트 코드이므로 필요하면 고친다. 이미 고친 곳: word-rotate(`h1`→`span`, 첫 단어 즉시 표시), number-ticker(`-0` 표시 방지), dialog(animate-ui Button 의존 제거).
  - **`npx shadcn init`은 실행하지 않는다.** `globals.css` 테마를 덮어쓴다. 컴포넌트는 `npx shadcn@latest add <이름>`으로만 추가한다.
  - `add` 후에는 `package.json`과 import를 확인한다. 레지스트리가 `cn` 같은 불필요한 npm 패키지를 넣거나 `import { cn } from "cn"`으로 쓴 적이 있다. `cn`은 항상 `@/lib/utils`에서 가져온다.
- 애니메이션은 `ThemeProvider`의 `MotionConfig reducedMotion="user"`로 OS의 동작 줄이기 설정을 따른다.

## 콘텐츠 작성 규칙

- **공개 저장소**다. 개인정보나 외부에 공개하면 안 되는 이름·주소를 어떤 파일에도 적지 않는다.
- **재직 회사명은 공개하지 않는다.** 이력(`profile.yaml`), 글, 포트폴리오, 문서, 커밋 메시지 어디에도 적지 않는다. 이력에는 `IT 기업 (재직 중)`처럼 쓰고 한 일만 적는다. 회사명은 금지어 목록에 있으므로 `check:sensitive`로 검사할 수 있다.
- **`draft: true`도 공개된다.** 사이트에서만 빠지고, push하면 저장소에서는 누구나 원문을 볼 수 있다. 공개하면 안 되는 내용은 초안이라도 커밋하지 않는다.
- 민감정보가 커밋된 뒤에 지우면 git 이력에 남는다. 이력에서 지우려면 `git filter-repo`로 이력을 다시 쓰고 강제 push해야 하므로 push 전에 검사한다.

## Git

- **커밋 작성자 이메일은 GitHub noreply 주소**(`61691088+chanhi@users.noreply.github.com`)다. 저장소 로컬 `git config user.email`로 설정되어 있다. 전역 설정은 회사 이메일일 수 있으므로, 새로 clone한 경우 커밋 전에 `git config user.email`을 확인하고 noreply로 설정한다.
- 커밋 메시지 접두어: `신규:` / `갱신:` (예: `갱신: CS 글 7편 공개 (draft 해제)`).
- **frontmatter**: `title, slug(영문 권장), date, updated, subcategory, tags, aliases, series, seriesOrder, summary, thumbnail, draft, source`
  - `source`: 외부 노트에서 옮겨 온 글의 원본 경로. 다시 옮길 때 기존 포스트를 찾는 키이고, 사이트 렌더링에는 쓰지 않는다.
  - 포트폴리오 추가 필드: `period, role, team, stack[], type(company|school|personal), github, demo, playstore(Google Play 설치 링크), featured, order`
  - 템플릿: `content/templates/post.md`
- **이미지**: 모두 `content/assets/`에 둔다. Obsidian vault 설정(`content/.obsidian/app.json`)이 첨부 폴더를 여기로 지정한다.
- **Excalidraw**: SVG export 파일이 `assets`에 있어야 표시된다.
- **팀 프로젝트 포트폴리오**: 팀원 실명·학번·연락처는 넣지 않는다.
