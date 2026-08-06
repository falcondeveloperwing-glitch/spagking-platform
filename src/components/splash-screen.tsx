"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/lib/store";

export function SplashScreen() {
  const splashDone = useStore(s => s.splashDone);
  const setSplashDone = useStore(s => s.setSplashDone);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    // Total cinematic duration: ~5.5s before exit begins
    const exitTimer = setTimeout(() => setExiting(true), 5200);
    const doneTimer = setTimeout(() => setSplashDone(), 6000);
    return () => { clearTimeout(exitTimer); clearTimeout(doneTimer); };
  }, [setSplashDone]);

  return (
    <AnimatePresence>
      {!splashDone && (
        <motion.div
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-brand overflow-hidden ${exiting ? "animate-splash-exit" : ""}`}
        >
          {/* Ambient gold orbs that breathe */}
          <motion.div
            className="absolute top-1/4 left-1/3 w-[480px] h-[480px] rounded-full blur-3xl pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(232,184,74,0.18), transparent 65%)" }}
            animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/3 w-[420px] h-[420px] rounded-full blur-3xl pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(232,184,74,0.12), transparent 65%)" }}
            animate={{ scale: [1.1, 1, 1.1], opacity: [0.4, 0.6, 0.4] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Subtle grain vignette */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.6)_100%)] pointer-events-none" />

          {/* Logo + steam composition */}
          <div className="relative flex flex-col items-center">
            {/* Steam wisps rising above the logo bowl */}
            <div className="relative h-16 w-32 mb-[-12px]">
              <svg viewBox="0 0 120 60" className="absolute inset-0 w-full h-full">
                <path className="animate-steam-1" d="M 40 60 Q 34 40 40 22 Q 46 8 40 0" stroke="url(#steamG)" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0"/>
                <path className="animate-steam-2" d="M 60 60 Q 54 38 60 18 Q 66 4 60 -4" stroke="url(#steamG)" strokeWidth="3.5" strokeLinecap="round" fill="none" opacity="0"/>
                <path className="animate-steam-3" d="M 80 60 Q 74 40 80 22 Q 86 8 80 0" stroke="url(#steamG)" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0"/>
                <defs>
                  <linearGradient id="steamG" x1="0%" y1="100%" x2="0%" y2="0%">
                    <stop offset="0%" stopColor="#FCE9B0" stopOpacity="0.9"/>
                    <stop offset="100%" stopColor="#FCE9B0" stopOpacity="0"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/* The SpagKing logo, fading in with a glow */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, filter: "blur(8px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              transition={{ duration: 1.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="relative"
            >
              {/* Glow behind logo */}
              <div className="absolute inset-0 blur-2xl opacity-60 animate-glow-pulse">
                <img src="/spagking-logo.svg" alt="" className="w-32 h-32 sm:w-40 sm:h-40" />
              </div>
              <img src="/spagking-logo.svg" alt="SpagKing" className="relative w-32 h-32 sm:w-40 sm:h-40" />
            </motion.div>

            {/* Wordmark */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.4, ease: [0.22, 1, 0.36, 1] }}
              className="mt-6 font-display font-bold text-3xl sm:text-4xl tracking-tight"
            >
              <span className="text-gold-gradient">Spag</span><span className="text-foreground">King</span>
            </motion.div>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0, y: 10, letterSpacing: "0.15em" }}
              animate={{ opacity: 1, y: 0, letterSpacing: "0.08em" }}
              transition={{ duration: 1.4, delay: 2.4, ease: [0.22, 1, 0.36, 1] }}
              className="mt-3 text-xs sm:text-sm text-muted-foreground font-light uppercase"
              style={{ letterSpacing: "0.2em" }}
            >
              Crafted with Passion · Served with Excellence
            </motion.p>
          </div>

          {/* Loading indicator — elegant gold line */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3, duration: 0.6 }}
            className="absolute bottom-16 flex flex-col items-center gap-3"
          >
            <div className="w-40 h-px bg-foreground/10 overflow-hidden rounded-full">
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 3 }}
                className="h-full w-1/2 bg-gold-gradient"
              />
            </div>
            <p className="text-[10px] text-muted-foreground/60 tracking-[0.3em] uppercase">Preparing your table</p>
          </motion.div>

          {/* Brand sparkle dots in corners */}
          <motion.div
            className="absolute top-12 left-12 w-1 h-1 rounded-full bg-[var(--gold)]"
            animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, delay: 1 }}
          />
          <motion.div
            className="absolute top-20 right-16 w-1 h-1 rounded-full bg-[var(--gold)]"
            animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5] }}
            transition={{ duration: 2.4, repeat: Infinity, delay: 1.6 }}
          />
          <motion.div
            className="absolute bottom-24 left-20 w-1 h-1 rounded-full bg-[var(--gold)]"
            animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5] }}
            transition={{ duration: 2.2, repeat: Infinity, delay: 2.2 }}
          />
          <motion.div
            className="absolute bottom-32 right-24 w-1 h-1 rounded-full bg-[var(--gold)]"
            animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5] }}
            transition={{ duration: 2.6, repeat: Infinity, delay: 1.4 }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
