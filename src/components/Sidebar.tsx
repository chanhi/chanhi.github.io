import Link from "next/link";
import { Briefcase, ChevronRight } from "lucide-react";
import { categories, siteConfig } from "@/config/site";
import { getAllProjects, getAllTags, getCategoryCounts, getProfile } from "@/lib/content";
import { tagHref } from "@/lib/utils";
import { GithubIcon } from "./icons";

export function Sidebar() {
  const profile = getProfile();
  const counts = getCategoryCounts();
  const tags = getAllTags().slice(0, 20);
  const projectCount = getAllProjects().length;

  return (
    <div className="space-y-6">
      {/* 미니 프로필 */}
      <Link href="/" className="block card-brutal hover-lift p-4">
        <div className="flex items-center gap-3">
          <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-border bg-accent font-mono text-lg font-bold text-accent-foreground">
            {profile.avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={profile.avatar} alt={profile.name} className="size-full object-cover" />
            ) : (
              profile.name.slice(0, 1)
            )}
          </div>
          <div className="min-w-0">
            <p className="truncate font-bold">{profile.name}</p>
            <p className="truncate text-xs text-muted-foreground">{profile.role}</p>
          </div>
        </div>
        <p className="mt-3 text-sm text-muted-foreground">{profile.tagline}</p>
      </Link>

      {/* 카테고리 트리 */}
      <nav aria-label="카테고리">
        <p className="mb-2 font-mono text-xs font-bold uppercase tracking-widest text-muted-foreground">Categories</p>
        <ul className="space-y-1">
          {categories.map((cat) => {
            const c = counts[cat.slug];
            const subs = cat.subcategories.filter((s) => c?.subs[s.slug]);
            return (
              <li key={cat.slug}>
                <Link
                  href={`/${cat.slug}/`}
                  className="flex items-center justify-between rounded-md border-2 border-transparent px-2 py-1.5 font-semibold hover:border-border hover:bg-card"
                >
                  <span className="flex items-center gap-1">
                    <ChevronRight className="size-4 text-primary" />
                    {cat.label}
                  </span>
                  <span className="font-mono text-xs text-muted-foreground">{c?.total ?? 0}</span>
                </Link>
                {subs.length > 0 && (
                  <ul className="ml-5 border-l-2 border-muted pl-2">
                    {subs.map((s) => (
                      <li key={s.slug}>
                        <Link
                          href={`/${cat.slug}/?sub=${s.slug}`}
                          className="flex justify-between rounded px-2 py-1 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
                        >
                          <span>{s.label}</span>
                          <span className="font-mono text-xs">{c?.subs[s.slug]}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
          <li>
            <Link
              href="/portfolio/"
              className="flex items-center justify-between rounded-md border-2 border-transparent px-2 py-1.5 font-semibold hover:border-border hover:bg-card"
            >
              <span className="flex items-center gap-1">
                <Briefcase className="size-4 text-primary" />
                Portfolio
              </span>
              <span className="font-mono text-xs text-muted-foreground">{projectCount}</span>
            </Link>
          </li>
        </ul>
      </nav>

      {/* 태그 */}
      {tags.length > 0 && (
        <div>
          <p className="mb-2 flex items-center justify-between font-mono text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Tags
            <Link href="/tags/" className="normal-case tracking-normal hover:text-foreground">
              전체 보기
            </Link>
          </p>
          <div className="flex flex-wrap gap-1.5">
            {tags.map(([tag, n]) => (
              <Link
                key={tag}
                href={tagHref(tag)}
                className="rounded-sm border border-border bg-card px-2 py-0.5 text-xs hover:bg-accent hover:text-accent-foreground"
              >
                #{tag} <span className="text-muted-foreground">{n}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      <a
        href={siteConfig.links.github}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <GithubIcon className="size-4" /> github.com/chanhi
      </a>
    </div>
  );
}
