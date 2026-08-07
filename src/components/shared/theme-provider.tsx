"use client";
import { useEffect } from "react";
import { useStore } from "@/lib/store";

/**
 * Applies the persisted theme on mount and keeps it in sync with system preference.
 * Renders nothing — purely a side-effect controller.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const applyTheme = useStore(s => s.applyTheme);
  const themeMode = useStore(s => s.themeMode);
  const setThemeMode = useStore(s => s.setThemeMode);

  // Apply theme on mount and whenever themeMode changes
  useEffect(() => {
    applyTheme();
  }, [applyTheme, themeMode]);

  // Listen to system preference changes when in "system" mode
  useEffect(() => {
    if (themeMode !== "system") return;
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => setThemeMode("system");
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [themeMode, setThemeMode]);

  return <>{children}</>;
}
