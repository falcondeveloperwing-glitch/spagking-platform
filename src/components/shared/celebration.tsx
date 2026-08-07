"use client";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/lib/store";

export function Celebration() {
  const celebration = useStore(s => s.celebration);
  const clearCelebration = useStore(s => s.clearCelebration);

  useEffect(() => {
    if (!celebration) return;
    const timer = setTimeout(() => clearCelebration(), 4000);
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") clearCelebration(); };
    window.addEventListener("keydown", onKey);
    return () => { clearTimeout(timer); window.removeEventListener("keydown", onKey); };
  }, [celebration, clearCelebration]);

  return (
    <AnimatePresence>
      {celebration && (
        <motion.div
          key="celebration-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[90] flex items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-label={celebration.title}
          onClick={clearCelebration}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          {/* Confetti particles */}
          {Array.from({ length: 30 }).map((_, i) => {
            const angle = (i / 30) * Math.PI * 2;
            const distance = 200 + Math.random() * 150;
            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance;
            const colors = ["#FFD700", "#00E676", "#FF80AB", "#4FC3F7", "#A78BFA", "#FFF099"];
            const color = colors[i % colors.length];
            return (
              <motion.div
                key={i}
                initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
                animate={{ x, y, opacity: 0, scale: 1, rotate: Math.random() * 720 }}
                transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1], delay: Math.random() * 0.2 }}
                className="absolute w-2 h-3 rounded-sm"
                style={{ background: color, boxShadow: `0 0 6px ${color}` }}
              />
            );
          })}

          {/* Center card */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: -20 }}
            transition={{ type: "spring", stiffness: 220, delay: 0.1 }}
            className="relative glass-card rounded-3xl p-8 max-w-sm mx-4 text-center pointer-events-auto"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: [0, -10, 10, 0] }}
              transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
              className="text-6xl mb-3"
            >
              {celebration.emoji}
            </motion.div>
            <h2 className="font-display text-2xl font-bold mb-1 text-gold-neon">{celebration.title}</h2>
            <p className="text-sm text-muted-foreground">{celebration.subtitle}</p>
            <button
              onClick={clearCelebration}
              className="mt-5 btn-gold px-6 py-2 rounded-xl text-sm font-semibold"
            >
              Continue
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
