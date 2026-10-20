import Link from "next/link";
import type { ProjectMeta } from "@/lib/content";
import { cn } from "@/lib/utils";

export const projectTypeLabel: Record<ProjectMeta["type"], { label: string; className: string }> = {
  company: { label: "회사", className: "bg-primary text-primary-foreground" },
  school: { label: "학교", className: "bg-secondary text-secondary-foreground" },
  personal: { label: "개인", className: "bg-accent text-accent-foreground" },
};

export function ProjectCard({ project }: { project: ProjectMeta }) {
  const type = projectTypeLabel[project.type];
  return (
    <article className="group card-brutal hover-lift relative flex flex-col overflow-hidden">
      <div className="relative aspect-[16/9] border-b-2 border-border bg-muted">
        {project.thumbnail ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={project.thumbnail} alt="" loading="lazy" className="size-full object-cover" />
        ) : (
          <div className="flex size-full items-center justify-center bg-[radial-gradient(var(--border)_1px,transparent_1px)] [background-size:14px_14px] p-6">
            <span className="rounded-md border-2 border-border bg-card px-3 py-1.5 text-center font-mono text-sm font-bold">
              {project.title}
            </span>
          </div>
        )}
        <span className={cn("absolute top-3 left-3 rounded-sm border-2 border-border px-2 py-0.5 text-xs font-bold", type.className)}>
          {type.label}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="font-mono text-xs text-muted-foreground">{project.period}</p>
        <h3 className="mt-1 text-lg font-bold leading-snug tracking-tight">
          <Link href={project.url} className="after:absolute after:inset-0 group-hover:text-primary">
            {project.title}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-3 flex-1 text-sm text-muted-foreground">{project.summary}</p>
        {project.role && <p className="mt-3 text-xs font-semibold">🧑‍💻 {project.role}</p>}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {project.stack.slice(0, 6).map((s) => (
            <span key={s} className="rounded-sm border border-border bg-background px-1.5 py-0.5 font-mono text-[11px]">
              {s}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}
