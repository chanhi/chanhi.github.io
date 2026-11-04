import Link from "next/link";
import { ArrowUpRight, Award, BookOpen, Briefcase, Flag, GraduationCap, Rss, Trophy, Wrench } from "lucide-react";
import { getAllPosts, getAllProjects, getAllTags, getProfile, toMeta, toProjectMeta } from "@/lib/content";
import { siteConfig } from "@/config/site";
import { GithubIcon } from "@/components/icons";
import { PostCard } from "@/components/PostCard";
import { ProjectCard } from "@/components/ProjectCard";
import { BlurFade } from "@/components/ui/blur-fade";
import { DotPattern } from "@/components/ui/dot-pattern";
import { Marquee } from "@/components/ui/marquee";
import { NumberTicker } from "@/components/ui/number-ticker";
import { WordRotate } from "@/components/ui/word-rotate";
import { cn } from "@/lib/utils";

function Section({ id, icon: Icon, title, action, children }: {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    // magicui BlurFade: 스크롤해서 화면에 들어올 때 섹션이 흐림→선명하게 나타남
    <BlurFade inView inViewMargin="-80px">
      <section id={id} className="scroll-mt-24">
        <div className="mb-5 flex items-end justify-between gap-4 border-b-2 border-border pb-2">
          <h2 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
            <Icon className="size-6 text-primary" />
            {title}
          </h2>
          {action}
        </div>
        {children}
      </section>
    </BlurFade>
  );
}

function MoreLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="flex items-center gap-1 text-sm font-semibold text-muted-foreground hover:text-primary">
      {children} <ArrowUpRight className="size-4" />
    </Link>
  );
}

export default function HomePage() {
  const profile = getProfile();
  const featured = getAllProjects().filter((p) => p.featured).slice(0, 4).map(toProjectMeta);
  const allPosts = getAllPosts();
  const recent = allPosts.slice(0, 5).map(toMeta);
  const projectCount = getAllProjects().length;
  const stats = [
    { label: "Posts", value: allPosts.length },
    { label: "Projects", value: projectCount },
    { label: "Tags", value: getAllTags().length },
  ];
  const allSkills = profile.skills.flatMap((g) => g.items);
  // 히어로에서 순환 표시할 핵심 기술 (Skills 앞쪽 두 그룹)
  const rotating = profile.skills.slice(0, 2).flatMap((g) => g.items).slice(0, 8);

  return (
    <main className="mx-auto max-w-5xl space-y-16 px-4 py-10 sm:py-16">
      {/* Hero */}
      <BlurFade>
      <section className="card-brutal relative overflow-hidden p-6 shadow-[8px_8px_0_0_var(--border)] sm:p-10">
        {/* magicui DotPattern 배경 (왼쪽 위에서 퍼지도록 마스크) */}
        <DotPattern
          width={18}
          height={18}
          cr={1.2}
          className="text-foreground/25 [mask-image:radial-gradient(420px_circle_at_top_left,white,transparent)]"
        />
        <div className="pointer-events-none absolute -top-10 -right-10 size-48 rounded-full border-2 border-border bg-accent" />
        <div className="pointer-events-none absolute right-24 -bottom-12 size-28 rounded-full border-2 border-border bg-secondary" />
        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center">
          <div className="flex size-28 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-border bg-primary font-mono text-4xl font-bold text-primary-foreground">
            {profile.avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={profile.avatar} alt={profile.name} className="size-full object-cover" />
            ) : (
              profile.name.slice(0, 1)
            )}
          </div>
          <div className="min-w-0">
            <p className="font-mono text-sm text-muted-foreground">Hello, I&apos;m</p>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              {profile.name}
              {profile.nameEn && <span className="ml-3 text-xl font-normal text-muted-foreground">{profile.nameEn}</span>}
            </h1>
            <p className="mt-2 inline-block rounded-md border-2 border-border bg-accent px-2 py-0.5 font-semibold text-accent-foreground">
              {profile.role}
            </p>
            <p className="mt-4 max-w-2xl text-lg">{profile.tagline}</p>
            {rotating.length > 0 && (
              // magicui WordRotate: 주요 기술 스택을 순서대로 보여줌
              <p className="mt-2 flex items-center gap-2 font-mono text-sm text-muted-foreground">
                <span>building with</span>
                <WordRotate
                  words={rotating}
                  duration={2200}
                  className="rounded-sm bg-foreground px-1.5 font-bold text-background"
                  motionProps={{
                    initial: { opacity: 0, y: -14 },
                    animate: { opacity: 1, y: 0 },
                    exit: { opacity: 0, y: 14 },
                    transition: { duration: 0.22, ease: "easeOut" },
                  }}
                />
              </p>
            )}
            <div className="mt-5 flex flex-wrap gap-2">
              {profile.links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  target={l.href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-md border-2 border-border bg-card px-3 py-1.5 text-sm font-semibold hover-lift"
                >
                  {l.label === "GitHub" ? <GithubIcon className="size-4" /> : l.label === "Blog" ? <Rss className="size-4" /> : <ArrowUpRight className="size-4" />}
                  {l.label}
                </a>
              ))}
            </div>
            {/* magicui NumberTicker: 화면에 보이면 0부터 숫자가 올라감 */}
            <dl className="mt-6 flex flex-wrap gap-3">
              {stats.map((s) => (
                <div key={s.label} className="rounded-md border-2 border-border bg-card px-3 py-1.5">
                  <dt className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{s.label}</dt>
                  <dd className="text-2xl font-bold">
                    <NumberTicker value={s.value} className="tracking-tight text-foreground dark:text-foreground" />
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>
      </BlurFade>

      {/* magicui Marquee: 기술 스택 띠 (마우스를 올리면 멈춤) */}
      {allSkills.length > 0 && (
        <BlurFade delay={0.15}>
          <div
            aria-hidden="true"
            className="relative -mt-6 overflow-hidden rounded-lg border-2 border-border bg-foreground py-1 text-background"
          >
            <Marquee pauseOnHover className="[--duration:45s] [--gap:0.75rem]">
              {allSkills.map((s, i) => (
                <span
                  key={s}
                  className={cn(
                    "rounded-sm border-2 border-background/20 px-2 py-0.5 font-mono text-sm font-bold whitespace-nowrap",
                    i % 4 === 0 && "text-accent",
                    i % 4 === 2 && "text-secondary",
                  )}
                >
                  {s}
                </span>
              ))}
            </Marquee>
            <div className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-foreground" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-foreground" />
          </div>
        </BlurFade>
      )}

      {/* About */}
      <Section id="about" icon={BookOpen} title="About">
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          {profile.about.split(/\n{2,}/).map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </Section>

      {/* Experience */}
      <Section id="experience" icon={Briefcase} title="Experience">
        <ol className="relative space-y-6 border-l-2 border-border pl-6">
          {profile.experience.map((e) => (
            <li key={`${e.org}-${e.period}`} className="relative">
              <span className="absolute top-1.5 -left-[33px] size-4 rounded-full border-2 border-border bg-primary" />
              <div className="card-brutal p-5">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-lg font-bold">
                    {e.org} <span className="font-normal text-muted-foreground">· {e.title}</span>
                  </h3>
                  <span className="font-mono text-sm text-muted-foreground">{e.period}</span>
                </div>
                {e.description && <p className="mt-2 text-sm text-muted-foreground">{e.description}</p>}
                {e.items && (
                  <ul className="mt-3 list-disc space-y-1 pl-5 text-sm marker:text-primary">
                    {e.items.map((it) => (
                      <li key={it}>{it}</li>
                    ))}
                  </ul>
                )}
              </div>
            </li>
          ))}
        </ol>
      </Section>

      {/* Education */}
      <Section id="education" icon={GraduationCap} title="Education">
        <div className="grid gap-4 sm:grid-cols-2">
          {profile.education.map((e) => (
            <div key={`${e.org}-${e.period}`} className="card-brutal p-5">
              <p className="font-mono text-sm text-muted-foreground">{e.period}</p>
              <h3 className="mt-1 text-lg font-bold">{e.org}</h3>
              {e.major && <p className="text-sm">{e.major}</p>}
              {e.description && <p className="mt-2 text-sm text-muted-foreground">{e.description}</p>}
            </div>
          ))}
        </div>
      </Section>

      {/* Activities */}
      {!!profile.activities?.length && (
        <Section id="activities" icon={Flag} title="Activities">
          <div className="grid gap-4 sm:grid-cols-2">
            {profile.activities.map((a) => (
              <div key={a.name} className="card-brutal p-5">
                {a.period && <p className="font-mono text-sm text-muted-foreground">{a.period}</p>}
                <h3 className="mt-1 text-lg font-bold">{a.name}</h3>
                {a.description && <p className="mt-2 text-sm text-muted-foreground">{a.description}</p>}
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Skills */}
      <Section id="skills" icon={Wrench} title="Skills">
        <div className="grid gap-4 sm:grid-cols-2">
          {profile.skills.map((g, i) => (
            <div key={g.group} className="card-brutal p-5">
              <h3 className="mb-3 font-mono text-sm font-bold uppercase tracking-wider">{g.group}</h3>
              <div className="flex flex-wrap gap-1.5">
                {g.items.map((s) => (
                  <span
                    key={s}
                    className={
                      [
                        "bg-primary text-primary-foreground",
                        "bg-secondary text-secondary-foreground",
                        "bg-accent text-accent-foreground",
                        "bg-chart-5 text-black",
                      ][i % 4] + " rounded-sm border-2 border-border px-2 py-0.5 text-sm font-semibold"
                    }
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Projects */}
      {featured.length > 0 && (
        <Section id="projects" icon={Briefcase} title="Featured Projects" action={<MoreLink href="/portfolio/">전체 보기</MoreLink>}>
          <div className="grid gap-5 sm:grid-cols-2">
            {featured.map((p) => (
              <ProjectCard key={p.slug} project={p} />
            ))}
          </div>
        </Section>
      )}

      {/* Awards */}
      {!!profile.awards?.length && (
        <Section id="awards" icon={Trophy} title="Awards">
          <ul className="grid gap-3 sm:grid-cols-2">
            {profile.awards.map((a) => (
              <li key={`${a.name}-${a.date}`} className="card-brutal flex items-center justify-between gap-3 p-4">
                <div>
                  <p className="font-bold">{a.name}</p>
                  {a.issuer && <p className="text-sm text-muted-foreground">{a.issuer}</p>}
                  {a.description && <p className="text-sm text-muted-foreground">{a.description}</p>}
                </div>
                <span className="shrink-0 font-mono text-sm text-muted-foreground">{a.date}</span>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* Certificates */}
      {profile.certificates.length > 0 && (
        <Section id="certificates" icon={Award} title="Certificates" action={<MoreLink href="/certificate/">관련 글</MoreLink>}>
          <ul className="grid gap-3 sm:grid-cols-2">
            {profile.certificates.map((c) => (
              <li key={c.name} className="card-brutal flex items-center justify-between gap-3 p-4">
                <div>
                  <p className="font-bold">{c.name}</p>
                  {c.issuer && <p className="text-sm text-muted-foreground">{c.issuer}</p>}
                </div>
                <span className="font-mono text-sm text-muted-foreground">{c.date}</span>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* Recent posts */}
      {recent.length > 0 && (
        <Section id="posts" icon={Rss} title="Recent Posts" action={<MoreLink href="/develop/">블로그</MoreLink>}>
          <div className="space-y-4">
            {recent.map((p) => (
              <PostCard key={p.url} post={p} showCategory />
            ))}
          </div>
        </Section>
      )}

      <p className="text-center font-mono text-sm text-muted-foreground">
        <a href={siteConfig.links.github} className="hover:text-foreground">github.com/chanhi</a>
      </p>
    </main>
  );
}
