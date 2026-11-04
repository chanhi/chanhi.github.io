"use client";

import { useState } from "react";
import type { ProjectMeta } from "@/lib/content";
import { BlurFade } from "@/components/ui/blur-fade";
import { FilterTabs } from "./FilterTabs";
import { ProjectCard, projectTypeLabel } from "./ProjectCard";

const filters = ["all", "company", "school", "personal"] as const;
type Filter = (typeof filters)[number];

export function ProjectGrid({ projects }: { projects: ProjectMeta[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const visible = filter === "all" ? projects : projects.filter((p) => p.type === filter);

  const tabs = filters
    .map((f) => ({
      value: f,
      label: f === "all" ? "전체" : projectTypeLabel[f].label,
      count: f === "all" ? projects.length : projects.filter((p) => p.type === f).length,
    }))
    .filter((t) => t.count > 0);

  return (
    <div>
      <FilterTabs tabs={tabs} value={filter} onChange={(v) => setFilter(v as Filter)} />
      <div key={filter} className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {visible.map((p, i) => (
          <BlurFade key={p.slug} delay={Math.min(i, 8) * 0.05} className="flex">
            <ProjectCard project={p} />
          </BlurFade>
        ))}
      </div>
    </div>
  );
}
