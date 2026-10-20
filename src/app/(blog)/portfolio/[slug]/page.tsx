import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, ExternalLink, User, Users } from "lucide-react";
import { getAllProjects, getProject } from "@/lib/content";
import { renderMarkdown } from "@/lib/markdown";
import { cn } from "@/lib/utils";
import { GithubIcon } from "@/components/icons";
import { Toc } from "@/components/Toc";
import { Mermaid } from "@/components/Mermaid";
import { projectTypeLabel } from "@/components/ProjectCard";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  const params = getAllProjects().map((p) => ({ slug: p.slug }));
  // output: export는 최소 1개 경로가 필요 — 비어 있으면 404로 처리되는 placeholder
  return params.length ? params : [{ slug: "_empty" }];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = getProject((await params).slug);
  if (!project) return {};
  return { title: project.title, description: project.summary };
}

export default async function ProjectPage({ params }: Props) {
  const project = getProject((await params).slug);
  if (!project) notFound();
  const { html, toc } = await renderMarkdown(project.body);
  const type = projectTypeLabel[project.type];

  return (
    <div className="flex gap-10">
      <article className="min-w-0 flex-1">
        <Link href="/portfolio/" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" /> Portfolio
        </Link>

        <header className="card-brutal mb-8 p-6 shadow-[6px_6px_0_0_var(--primary)]">
          <span className={cn("rounded-sm border-2 border-border px-2 py-0.5 text-xs font-bold", type.className)}>{type.label}</span>
          <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight sm:text-4xl">{project.title}</h1>
          <p className="mt-3 text-muted-foreground">{project.summary}</p>

          <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-3">
            <div className="flex items-center gap-2">
              <Calendar className="size-4 text-primary" />
              <dt className="sr-only">기간</dt>
              <dd className="font-mono">{project.period}</dd>
            </div>
            {project.role && (
              <div className="flex items-center gap-2">
                <User className="size-4 text-primary" />
                <dt className="sr-only">역할</dt>
                <dd>{project.role}</dd>
              </div>
            )}
            {project.team && (
              <div className="flex items-center gap-2">
                <Users className="size-4 text-primary" />
                <dt className="sr-only">팀 구성</dt>
                <dd>{project.team}</dd>
              </div>
            )}
          </dl>

          <div className="mt-4 flex flex-wrap gap-1.5">
            {project.stack.map((s) => (
              <span key={s} className="rounded-sm border border-border bg-background px-2 py-0.5 font-mono text-xs">
                {s}
              </span>
            ))}
          </div>

          {(project.github || project.demo) && (
            <div className="mt-5 flex flex-wrap gap-2">
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-md border-2 border-border bg-foreground px-3 py-1.5 text-sm font-semibold text-background hover-lift"
                >
                  <GithubIcon className="size-4" /> GitHub
                </a>
              )}
              {project.demo && (
                <a
                  href={project.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-md border-2 border-border bg-card px-3 py-1.5 text-sm font-semibold hover-lift"
                >
                  <ExternalLink className="size-4" /> Demo
                </a>
              )}
            </div>
          )}
        </header>

        <div className="prose prose-neutral dark:prose-invert" dangerouslySetInnerHTML={{ __html: html }} />
        <Mermaid />
      </article>

      <aside className="hidden w-56 shrink-0 xl:block">
        <div className="sticky top-24">
          <Toc items={toc} />
        </div>
      </aside>
    </div>
  );
}
