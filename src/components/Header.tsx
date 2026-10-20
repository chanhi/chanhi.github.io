import Link from "next/link";
import { siteConfig } from "@/config/site";
import { GithubIcon } from "./icons";
import { MobileNav } from "./MobileNav";
import { NavLinks } from "./NavLinks";
import { SearchDialog } from "./SearchDialog";
import { Sidebar } from "./Sidebar";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b-2 border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4">
        <MobileNav>
          <Sidebar />
        </MobileNav>
        <Link href="/" className="font-mono text-lg font-bold tracking-tight">
          <span className="rounded-md bg-primary px-1.5 py-0.5 text-primary-foreground">chanhi</span>
          <span>.dev</span>
        </Link>
        <div className="flex-1" />
        <NavLinks />
        <div className="flex items-center gap-2">
          <SearchDialog />
          <ThemeToggle />
          <a
            href={siteConfig.links.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="hidden size-9 items-center justify-center rounded-md border-2 border-border bg-card hover-lift sm:inline-flex"
          >
            <GithubIcon className="size-4" />
          </a>
        </div>
      </div>
    </header>
  );
}
