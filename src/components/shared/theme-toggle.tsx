"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon, Monitor } from "lucide-react";
import { useStore } from "@/lib/store";
import { useState, useRef, useEffect } from "react";

export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const themeMode = useStore(s => s.themeMode);
  const setThemeMode = useStore(s => s.setThemeMode);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const currentIcon = themeMode === "light" ? Sun : themeMode === "system" ? Monitor : Moon;

  if (compact) {
    // Single-click toggle button for tight spaces (cycles light → dark → system)
    return (
      <button
        onClick={() => setThemeMode(themeMode === "dark" ? "light" : "dark")}
        className="relative w-9 h-9 rounded-full flex items-center justify-center hover:bg-foreground/[0.06] transition-colors"
        aria-label="Toggle theme"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={themeMode}
            initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            {themeMode === "light" ? <Sun className="w-4.5 h-4.5 text-[var(--gold)]" /> : <Moon className="w-4.5 h-4.5" />}
          </motion.div>
        </AnimatePresence>
      </button>
    );
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-foreground/[0.06] transition-colors"
        aria-label="Theme options"
        aria-expanded={open}
      >
        <currentIcon className="w-4.5 h-4.5" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-0 mt-2 w-44 glass-card rounded-xl p-1.5 z-50 shadow-xl"
          >
            {[
              { mode: "light" as const, icon: Sun, label: "Light" },
              { mode: "dark" as const, icon: Moon, label: "Dark" },
              { mode: "system" as const, icon: Monitor, label: "System" },
            ].map(opt => {
              const active = themeMode === opt.mode;
              return (
                <button
                  key={opt.mode}
                  onClick={() => { setThemeMode(opt.mode); setOpen(false); }}
                  className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm transition-colors ${active ? "glass-gold text-[var(--gold)]" : "hover:bg-foreground/[0.06]"}`}
                >
                  <opt.icon className="w-4 h-4" />
                  <span>{opt.label}</span>
                  {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[var(--gold)]" />}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
