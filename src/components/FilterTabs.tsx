"use client";

import { cn } from "@/lib/utils";
import { Highlight, HighlightItem } from "@/components/animate-ui/primitives/effects/highlight";

export type FilterTab = { value: string; label: string; count: number };

/** 하위 카테고리·프로젝트 유형 필터 탭. 선택 배경이 animate-ui Highlight로 이동한다 */
export function FilterTabs({ tabs, value, onChange }: { tabs: FilterTab[]; value: string; onChange: (value: string) => void }) {
  return (
    <div className="mb-6 flex flex-wrap gap-2">
      <Highlight
        controlledItems
        value={value}
        click={false}
        className="inset-0 rounded-md bg-foreground"
        transition={{ type: "spring", stiffness: 400, damping: 34 }}
      >
        {tabs.map((t) => (
          <HighlightItem key={t.value} value={t.value} className="rounded-md border-2 border-border bg-card">
            <button
              type="button"
              onClick={() => onChange(t.value)}
              aria-pressed={value === t.value}
              className={cn(
                "rounded-md px-3 py-1 text-sm font-semibold transition-colors",
                value === t.value ? "text-background" : "hover:bg-muted",
              )}
            >
              {t.label} <span className="font-mono text-xs opacity-70">{t.count}</span>
            </button>
          </HighlightItem>
        ))}
      </Highlight>
    </div>
  );
}
