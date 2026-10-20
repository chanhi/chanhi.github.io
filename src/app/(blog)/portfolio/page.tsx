import type { Metadata } from "next";
import { getAllProjects, toProjectMeta } from "@/lib/content";
import { ProjectGrid } from "@/components/ProjectGrid";

export const metadata: Metadata = {
  title: "Portfolio",
  description: "회사·학교·개인 프로젝트 모음",
};

export default function PortfolioPage() {
  const projects = getAllProjects().map(toProjectMeta);
  return (
    <div>
      <header className="mb-8">
        <p className="font-mono text-sm text-muted-foreground">/portfolio</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">Portfolio</h1>
        <p className="mt-2 text-muted-foreground">회사 업무, 학교 캡스톤, 개인 프로젝트에서 만든 것들</p>
      </header>
      <ProjectGrid projects={projects} />
    </div>
  );
}
