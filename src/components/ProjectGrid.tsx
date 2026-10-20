"use client";

import { useState } from "react";
import type { ProjectMeta } from "@/lib/content";
import { cn } from "@/lib/utils";
import { ProjectCard, projectTypeLabel } from "./ProjectCard";

const filters = ["all", "company", "school", "personal"] as const;

export function ProjectGrid({ projects }: { projects: ProjectMeta[] }) {
  const [filter, setFilter] = useState<(typeof filters)[number]>("all");
  const visible = filter === "all" ? projects : projects.filter((p) => p.type === filter);

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-2">
        {filters.map((f) => {
          const count = f === "all" ? projects.length : projects.filter((p) => p.type === f).length;
          if (count === 0) return null;
          return (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={cn(
                "rounded-md border-2 border-border px-3 py-1 text-sm font-semibold",
                filter === f ? "bg-foreground text-background" : "bg-card hover:bg-muted",
              )}
            >
              {f === "all" ? "전체" : projectTypeLabel[f].label} <span className="font-mono text-xs opacity-70">{count}</span>
            </button>
          );
        })}
      </div>
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {visible.map((p) => (
          <ProjectCard key={p.slug} project={p} />
        ))}
      </div>
    </div>
  );
}
