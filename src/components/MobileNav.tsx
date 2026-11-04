"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/animate-ui/components/radix/sheet";

/** 모바일에서 사이드바를 왼쪽 드로어(animate-ui Sheet)로 표시 */
export function MobileNav({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => setOpen(false), [pathname]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          type="button"
          aria-label="메뉴 열기"
          className="inline-flex size-9 items-center justify-center rounded-md border-2 border-border bg-card lg:hidden"
        >
          <Menu className="size-4" />
        </button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="w-[min(20rem,85vw)] overflow-y-auto border-r-2 border-sidebar-border bg-sidebar p-4 pt-14"
      >
        <SheetTitle className="sr-only">메뉴</SheetTitle>
        <SheetDescription className="sr-only">카테고리와 태그 탐색</SheetDescription>
        {children}
      </SheetContent>
    </Sheet>
  );
}
