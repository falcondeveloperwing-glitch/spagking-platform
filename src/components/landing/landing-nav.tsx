"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/lib/store";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Menu, X, ShoppingCart, ArrowRight } from "lucide-react";

const NAV_LINKS = [
  { label: "Home", target: "hero" },
  { label: "Menu", target: "menu" },
  { label: "Story", target: "story" },
  { label: "Community", target: "community" },
  { label: "Branches", target: "branches" },
  { label: "Reviews", target: "reviews" },
];

export function LandingNav() {
  const setAppView = useStore(s => s.setAppView);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
      // Track active section
      const sections = NAV_LINKS.map(l => document.getElementById(l.target)).filter(Boolean);
      for (let i = sections.length - 1; i >= 0; i--) {
        const rect = sections[i].getBoundingClientRect();
        if (rect.top <= 120) {
          setActiveSection(NAV_LINKS[i].target);
          break;
        }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setMobileOpen(false);
  };

  const goToAuth = () => setAppView("auth");

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "glass border-b border-border/40 py-2.5" : "py-4 bg-transparent"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          {/* Logo */}
          <button onClick={() => scrollTo("hero")} className="flex items-center gap-2.5 group">
            <img src="/spagking-logo.svg" alt="SpagKing" className="w-9 h-9 transition-transform group-hover:scale-105" />
            <span className="wordmark text-xl">SpagKing</span>
          </button>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map(link => (
              <button
                key={link.target}
                onClick={() => scrollTo(link.target)}
                className={`relative px-3 py-2 text-sm font-medium transition-colors ${activeSection === link.target ? "text-[var(--gold)]" : "text-muted-foreground hover:text-foreground"}`}
              >
                {link.label}
                {activeSection === link.target && (
                  <motion.div layoutId="nav-active-landing" className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-[var(--gold)]" />
                )}
              </button>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <ThemeToggle compact />
            <button
              onClick={goToAuth}
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold btn-gold"
            >
              Order Now <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden w-9 h-9 rounded-lg flex items-center justify-center hover:bg-foreground/[0.06]"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden"
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 260 }}
              className="fixed top-0 right-0 bottom-0 w-72 glass border-l border-border/40 z-[70] lg:hidden flex flex-col"
            >
              <div className="flex items-center justify-between p-4 border-b border-border/40">
                <span className="wordmark text-lg">SpagKing</span>
                <button onClick={() => setMobileOpen(false)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-foreground/[0.06]">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <nav className="flex-1 p-3 space-y-1">
                {NAV_LINKS.map((link, i) => (
                  <motion.button
                    key={link.target}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => scrollTo(link.target)}
                    className={`w-full text-left px-3 py-3 rounded-xl text-sm font-medium transition-colors ${activeSection === link.target ? "glass-gold text-[var(--gold)]" : "hover:bg-foreground/[0.04]"}`}
                  >
                    {link.label}
                  </motion.button>
                ))}
              </nav>
              <div className="p-4 border-t border-border/40">
                <button onClick={goToAuth} className="w-full btn-gold py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2">
                  Order Now <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
