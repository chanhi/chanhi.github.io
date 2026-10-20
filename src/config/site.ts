export type SubCategory = { slug: string; label: string };
export type Category = {
  slug: string;
  label: string;
  description: string;
  color: "primary" | "secondary" | "accent" | "chart-4" | "chart-5";
  subcategories: SubCategory[];
};

export const siteConfig = {
  name: "chanhi.dev",
  title: "chanhi.dev — 개발 블로그 & 포트폴리오",
  description: "AI·백엔드 개발자 정찬희의 개발 블로그와 포트폴리오",
  url: "https://chanhi.github.io",
  author: "ChanHuy Jeong",
  links: {
    github: "https://github.com/chanhi",
    tistory: "https://chanhuy.tistory.com",
  },
  postsPerPage: 10,
  // giscus 설정: https://giscus.app 에서 값을 발급받아 채우면 댓글이 활성화됩니다.
  giscus: {
    repo: "chanhi/chanhi.github.io" as `${string}/${string}`,
    repoId: "",
    category: "Comments",
    categoryId: "",
  },
};

/** Header·Sidebar 메뉴와 content/ 폴더 구조의 단일 기준 */
export const categories: Category[] = [
  {
    slug: "develop",
    label: "Develop",
    description: "개발하면서 배우고 삽질한 기록",
    color: "primary",
    subcategories: [
      { slug: "ai", label: "AI · LLM" },
      { slug: "backend", label: "Backend" },
      { slug: "frontend", label: "Frontend" },
      { slug: "infra", label: "Infra · DevOps" },
      { slug: "git", label: "Git" },
      { slug: "python", label: "Python" },
    ],
  },
  {
    slug: "research",
    label: "Research",
    description: "업무에서 진행한 기술 연구·리서치 정리",
    color: "secondary",
    subcategories: [
      { slug: "llm-eval", label: "LLM 평가" },
      { slug: "agent", label: "Agent · LangGraph" },
      { slug: "observability", label: "Langfuse · 관측" },
      { slug: "claude", label: "Claude" },
      { slug: "ontology", label: "온톨로지 · 디지털트윈" },
    ],
  },
  {
    slug: "cs",
    label: "CS",
    description: "알고리즘, 데이터베이스, 운영체제 등 컴퓨터 과학 기초",
    color: "chart-5",
    subcategories: [
      { slug: "algorithm", label: "Algorithm" },
      { slug: "database", label: "Database" },
      { slug: "os", label: "Operating System" },
      { slug: "network", label: "Network" },
      { slug: "lecture", label: "강의 노트" },
    ],
  },
  {
    slug: "retrospect",
    label: "회고/후기",
    description: "프로젝트 회고와 이런저런 후기",
    color: "accent",
    subcategories: [
      { slug: "project", label: "프로젝트 회고" },
      { slug: "review", label: "후기" },
    ],
  },
  {
    slug: "certificate",
    label: "자격증",
    description: "자격증 취득 과정과 시험 대비 정리",
    color: "chart-4",
    subcategories: [],
  },
];

export const navItems = [
  ...categories.map((c) => ({ href: `/${c.slug}/`, label: c.label })),
  { href: "/portfolio/", label: "Portfolio" },
];

export function getCategory(slug: string) {
  return categories.find((c) => c.slug === slug);
}

export function getSubLabel(category: string, sub?: string) {
  if (!sub) return undefined;
  return getCategory(category)?.subcategories.find((s) => s.slug === sub)?.label ?? sub;
}

/** Tailwind가 클래스를 정적으로 찾을 수 있도록 색상별 클래스를 미리 나열 */
export const colorClass: Record<Category["color"], string> = {
  primary: "bg-primary text-primary-foreground",
  secondary: "bg-secondary text-secondary-foreground",
  accent: "bg-accent text-accent-foreground",
  "chart-4": "bg-chart-4 text-white dark:text-black",
  "chart-5": "bg-chart-5 text-black",
};
