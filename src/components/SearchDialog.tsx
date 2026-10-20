"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Fuse from "fuse.js";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

type Entry = { title: string; url: string; summary: string; tags: string[]; category: string; date: string };

/** Cmd/Ctrl+K 검색. 빌드 시 생성된 /search-index.json을 처음 열 때 불러온다 */
export function SearchDialog() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState<Entry[] | null>(null);
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    if (!index) {
      fetch("/search-index.json")
        .then((r) => r.json())
        .then(setIndex)
        .catch(() => setIndex([]));
    }
  }, [open, index]);

  const fuse = useMemo(
    () =>
      new Fuse(index ?? [], {
        keys: [
          { name: "title", weight: 3 },
          { name: "tags", weight: 2 },
          { name: "summary", weight: 1 },
        ],
        threshold: 0.35,
        ignoreLocation: true,
      }),
    [index],
  );

  const results = query.trim() ? fuse.search(query.trim()).slice(0, 10).map((r) => r.item) : (index ?? []).slice(0, 6);

  const go = (url: string) => {
    setOpen(false);
    setQuery("");
    router.push(url);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex h-9 items-center gap-2 rounded-md border-2 border-border bg-card px-2.5 text-sm text-muted-foreground hover-lift"
        aria-label="검색"
      >
        <Search className="size-4" />
        <span className="hidden md:inline">검색</span>
        <kbd className="hidden rounded border border-border px-1 font-mono text-[10px] md:inline">Ctrl K</kbd>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 px-4 pt-[12vh]" onClick={() => setOpen(false)}>
          <div className="card-brutal w-full max-w-xl shadow-[6px_6px_0_0_var(--border)]" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-2 border-b-2 border-border px-4">
              <Search className="size-4 text-muted-foreground" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActive(0);
                }}
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown") setActive((a) => Math.min(a + 1, results.length - 1));
                  if (e.key === "ArrowUp") setActive((a) => Math.max(a - 1, 0));
                  if (e.key === "Enter" && results[active]) go(results[active].url);
                }}
                placeholder="제목, 태그, 내용으로 검색…"
                className="h-12 flex-1 bg-transparent outline-none"
              />
            </div>
            <ul className="max-h-[60vh] overflow-y-auto p-2">
              {index === null && <li className="p-4 text-center text-sm text-muted-foreground">불러오는 중…</li>}
              {index !== null && results.length === 0 && (
                <li className="p-4 text-center text-sm text-muted-foreground">검색 결과가 없습니다.</li>
              )}
              {results.map((r, i) => (
                <li key={r.url}>
                  <button
                    type="button"
                    onMouseEnter={() => setActive(i)}
                    onClick={() => go(r.url)}
                    className={cn("w-full rounded-md px-3 py-2 text-left", i === active && "bg-muted")}
                  >
                    <p className="flex items-center gap-2 font-semibold">
                      <span className="rounded-sm bg-primary px-1 text-[10px] text-primary-foreground">{r.category}</span>
                      {r.title}
                    </p>
                    <p className="line-clamp-1 text-xs text-muted-foreground">{r.summary}</p>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
