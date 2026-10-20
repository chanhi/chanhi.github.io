import Link from "next/link";
import { siteConfig } from "@/config/site";

export function Footer() {
  return (
    <footer className="mt-16 border-t-2 border-border">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-6 text-sm text-muted-foreground sm:flex-row">
        <p className="font-mono">© {new Date().getFullYear()} {siteConfig.author}</p>
        <div className="flex gap-4">
          <a href={siteConfig.links.github} target="_blank" rel="noopener noreferrer" className="hover:text-foreground">GitHub</a>
          <a href={siteConfig.links.tistory} target="_blank" rel="noopener noreferrer" className="hover:text-foreground">Tistory</a>
          <Link href="/rss.xml" className="hover:text-foreground">RSS</Link>
        </div>
      </div>
    </footer>
  );
}
