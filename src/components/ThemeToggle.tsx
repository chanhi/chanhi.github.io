"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { ThemeToggler } from "@/components/animate-ui/primitives/effects/theme-toggler";

/** animate-ui ThemeToggler: View Transition으로 화면을 왼쪽부터 쓸어 넘기며 테마 전환 */
export function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const resolved = resolvedTheme === "dark" ? "dark" : "light";

  return (
    <ThemeToggler
      theme={(theme as "light" | "dark" | "system") ?? "system"}
      resolvedTheme={resolved}
      setTheme={setTheme}
      direction="ltr"
    >
      {({ toggleTheme }) => (
        <button
          type="button"
          aria-label="테마 전환"
          onClick={() => toggleTheme(resolved === "dark" ? "light" : "dark")}
          className="inline-flex size-9 items-center justify-center rounded-md border-2 border-border bg-card hover-lift"
        >
          {/* 아이콘은 CSS로 고른다(SSR 시점엔 테마를 모르므로 hydration 불일치 방지) */}
          <Sun className="size-4 dark:hidden" />
          <Moon className="hidden size-4 dark:block" />
        </button>
      )}
    </ThemeToggler>
  );
}
