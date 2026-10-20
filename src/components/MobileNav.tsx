"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

/** 모바일에서 사이드바를 드로어(Sheet)로 표시 */
export function MobileNav({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <>
      <button
        type="button"
        aria-label="메뉴 열기"
        onClick={() => setOpen(true)}
        className="inline-flex size-9 items-center justify-center rounded-md border-2 border-border bg-card lg:hidden"
      >
        <Menu className="size-4" />
      </button>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-[min(20rem,85vw)] overflow-y-auto border-r-2 border-sidebar-border bg-sidebar p-4">
            <div className="mb-4 flex justify-end">
              <button
                type="button"
                aria-label="메뉴 닫기"
                onClick={() => setOpen(false)}
                className="inline-flex size-9 items-center justify-center rounded-md border-2 border-border bg-card"
              >
                <X className="size-4" />
              </button>
            </div>
            {children}
          </aside>
        </div>
      )}
    </>
  );
}
