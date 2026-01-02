"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="ps-btn ps-btn-ghost"
      aria-label="Toggle theme"
      title="Toggle theme"
    >
      <span className="ps-badge" style={{ padding: "0.35rem 0.6rem" }}>
        {isDark ? <Sun size={16} /> : <Moon size={16} />}
      </span>
      <span className="hidden sm:inline ps-muted">
        {isDark ? "Light mode" : "Dark mode"}
      </span>
    </button>
  );
}
