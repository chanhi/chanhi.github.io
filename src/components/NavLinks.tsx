"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItems } from "@/config/site";
import { cn } from "@/lib/utils";

/**
 * 상단 메뉴. 활성 메뉴 이동 애니메이션(animate-ui Highlight)은 쓰지 않는다.
 * 헤더가 sticky라 페이지 이동 시 스크롤이 맨 위로 돌아가면 layoutId 애니메이션의
 * 시작 위치가 어긋나 하이라이트가 아래에서 올라오는 문제가 있었다.
 */
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
