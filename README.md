# chanhi.github.io

AI · 백엔드 개발자 정찬희의 **개발 블로그 & 포트폴리오**입니다.

🔗 **[chanhi.github.io](https://chanhi.github.io)**

## 소개

- **프로필 / 이력**: 경력, 학력, 기술 스택, 자격증을 한 페이지에 정리했습니다.
- **블로그**: Develop · Research · CS · 회고/후기 · 자격증 카테고리로 개발하며 배운 것과 기술 연구를 기록합니다.
- **포트폴리오**: 학교·개인 프로젝트의 개요, 아키텍처, 담당 역할, 트러블슈팅, 배운 점을 정리했습니다.

## 주요 기능

- Obsidian으로 작성한 Markdown을 그대로 게시 (`[[위키링크]]`, `![[이미지]]`, 콜아웃, 하이라이트)
- 코드 하이라이팅(Shiki), Mermaid 다이어그램, KaTeX 수식
- 카테고리 · 하위 카테고리 · 태그 · 시리즈 분류, 목차(TOC)
- `Ctrl + K` 전체 검색, 다크 모드, 반응형 레이아웃
- RSS(`/rss.xml`), sitemap, Open Graph 메타데이터

## 기술 스택

| 영역 | 기술 |
| --- | --- |
| Framework | Next.js (App Router, Static Export), React, TypeScript |
| Style | Tailwind CSS v4, next-themes |
| Content | Markdown + Obsidian, unified (remark / rehype), Shiki, Mermaid, KaTeX |
| Search | Fuse.js |
| Deploy | GitHub Actions → GitHub Pages |

## 프로젝트 구조

```text
content/            # 글 · 포트폴리오 · 프로필 (Obsidian vault)
├─ develop/ research/ cs/ retrospect/ certificate/
├─ portfolio/
├─ assets/          # 이미지 등 첨부파일
└─ profile.yaml     # 메인 페이지 이력 데이터
src/
├─ app/             # 페이지 · 라우트
├─ components/      # UI 컴포넌트
├─ config/site.ts   # 사이트 정보 · 카테고리 설정
└─ lib/             # 콘텐츠 로딩, Markdown 변환 (Obsidian 문법 플러그인)
scripts/            # 빌드 보조 · 이관 스크립트
```

## 로컬 실행

Node.js 22 이상이 필요합니다.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # out/ 에 정적 사이트 생성
```

`main` 브랜치에 push하면 GitHub Actions가 빌드해 GitHub Pages에 배포합니다.
