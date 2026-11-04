"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Fuse from "fuse.js";
import { FileText, FolderKanban, Search } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";

type Entry = { title: string; url: string; summary: string; tags: string[]; category: string; date: string };

/**
 * Cmd/Ctrl+K 검색 (shadcn Command + Dialog).
 * 빌드 시 생성된 /search-index.json을 처음 열 때 불러오고, 검색은 Fuse.js가 한다(cmdk 자체 필터는 끔).
 */
export function SearchDialog() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState<Entry[] | null>(null);
  const router = useRouter();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!open || index) return;
    fetch("/search-index.json")
      .then((r) => r.json())
      .then(setIndex)
      .catch(() => setIndex([]));
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

  const q = query.trim();
  const results = q ? fuse.search(q).slice(0, 10).map((r) => r.item) : (index ?? []).slice(0, 6);

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

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          showCloseButton={false}
          className="top-[12vh] translate-y-0 overflow-hidden rounded-lg border-2 border-border bg-card p-0 shadow-[6px_6px_0_0_var(--border)] sm:max-w-xl"
        >
          <DialogTitle className="sr-only">검색</DialogTitle>
          <DialogDescription className="sr-only">제목, 태그, 내용으로 글과 프로젝트를 검색합니다.</DialogDescription>
          <Command shouldFilter={false} className="bg-card">
            <div className="border-b-2 border-border [&_[data-slot=command-input-wrapper]]:h-12 [&_[data-slot=command-input-wrapper]]:border-0">
              <CommandInput value={query} onValueChange={setQuery} placeholder="제목, 태그, 내용으로 검색…" className="text-base" />
            </div>
            <CommandList className="max-h-[60vh] p-2">
              {index === null ? (
                <p className="p-4 text-center text-sm text-muted-foreground">불러오는 중…</p>
              ) : (
                <CommandEmpty className="p-4 text-center text-sm text-muted-foreground">검색 결과가 없습니다.</CommandEmpty>
              )}
              {results.length > 0 && (
                <CommandGroup heading={q ? `검색 결과 ${results.length}건` : "최근 글"}>
                  {results.map((r) => (
                    <CommandItem
                      key={r.url}
                      value={r.url}
                      onSelect={() => go(r.url)}
                      className="flex items-start gap-3 rounded-md px-3 py-2 data-[selected=true]:bg-muted data-[selected=true]:text-foreground"
                    >
                      {r.category === "Portfolio" ? (
                        <FolderKanban className="mt-0.5 size-4 shrink-0 text-primary" />
                      ) : (
                        <FileText className="mt-0.5 size-4 shrink-0 text-primary" />
                      )}
                      <div className="min-w-0">
                        <p className="flex items-center gap-2 font-semibold">
                          <span className="shrink-0 rounded-sm bg-primary px-1 text-[10px] text-primary-foreground">{r.category}</span>
                          <span className="truncate">{r.title}</span>
                        </p>
                        <p className="line-clamp-1 text-xs text-muted-foreground">{r.summary}</p>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </DialogContent>
      </Dialog>
    </>
  );
}
