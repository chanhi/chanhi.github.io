"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItems } from "@/config/site";
import { cn } from "@/lib/utils";

export function NavLinks() {
  const pathname = usePathname();
  return (
    <nav className="hidden items-center gap-1 lg:flex">
      {navItems.map((item) => {
        const active = pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "rounded-md border-2 px-3 py-1.5 text-sm font-semibold transition-colors",
              active ? "border-border bg-primary text-primary-foreground" : "border-transparent hover:border-border hover:bg-card",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
