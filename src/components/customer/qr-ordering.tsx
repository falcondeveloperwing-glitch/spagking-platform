"use client";
import { motion } from "framer-motion";
import { QrCode, ScanLine, ArrowLeft, Smartphone, Sparkles, Utensils } from "lucide-react";
import { useStore } from "@/lib/store";
import { branches } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function CustomerQROrdering() {
  const setView = useStore(s => s.setCustomerView);
  const setSelectedMeal = useStore(s => s.setSelectedMeal);

  return (
    <div className="space-y-5">
      <button onClick={() => setView("home")} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="w-4 h-4" /> Back to home
      </button>

      <div className="text-center max-w-2xl mx-auto">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-gold text-xs font-medium mb-4">
          <QrCode className="w-3.5 h-3.5 text-[var(--gold)]" /> QR Table Ordering
        </motion.div>
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold mb-3">
          Scan. Order. <span className="text-gold-gradient">Eat.</span>
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Skip the waiter. Scan the QR code on your table to instantly open SpagKing's menu, place your order, and pay — all from your phone. Your food comes straight to your table.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        {/* QR code */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
          className="glass-card rounded-3xl p-8 flex flex-col items-center text-center">
          <div className="relative w-56 h-56 rounded-2xl bg-white p-4 mb-4">
            <QRCodePattern />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 rounded-xl bg-gold-gradient flex items-center justify-center">
                <Utensils className="w-6 h-6 text-black" />
              </div>
            </div>
          </div>
          <h3 className="font-display font-bold text-lg">Table T-12 · SpagKing VI</h3>
          <p className="text-xs text-muted-foreground mb-4">Show this to your customer, or scan to demo</p>
          <div className="flex gap-2 w-full">
            <Button variant="outline" className="flex-1" onClick={() => toast.success("QR code downloaded")}>
              <Smartphone className="w-4 h-4" /> Download
            </Button>
            <Button className="btn-gold flex-1" onClick={() => { setSelectedMeal(null); setView("menu"); toast.success("Menu opened via QR scan!"); }}>
              <ScanLine className="w-4 h-4" /> Scan to demo
            </Button>
          </div>
        </motion.div>

        {/* How it works */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-3">
          <h3 className="font-display font-bold text-lg mb-2">How it works</h3>
          {[
            { n: 1, title: "Scan the QR", desc: "Use your phone camera to scan the QR on your table", icon: ScanLine },
            { n: 2, title: "Browse the menu", desc: "See live availability, prices, photos & allergens", icon: Smartphone },
            { n: 3, title: "Place your order", desc: "Customise meals, add notes, pay with Paystack or cash", icon: Utensils },
            { n: 4, title: "Track & enjoy", desc: "Watch your order move from kitchen to your table", icon: Sparkles },
          ].map((step, i) => (
            <motion.div key={step.n} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="flex gap-3 glass-card rounded-2xl p-4">
              <div className="w-10 h-10 rounded-xl bg-gold-gradient flex items-center justify-center shrink-0 text-black font-bold">
                {step.n}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <step.icon className="w-4 h-4 text-[var(--gold)]" />
                  <span className="font-semibold text-sm">{step.title}</span>
                </div>
                <p className="text-xs text-muted-foreground">{step.desc}</p>
              </div>
            </motion.div>
          ))}

          <div className="glass-card rounded-2xl p-4 bg-gradient-to-br from-emerald-500/10 to-green-600/5 border-emerald-500/20">
            <h4 className="font-semibold text-sm mb-2">Active tables with QR</h4>
            <div className="space-y-1.5">
              {branches.map(b => (
                <div key={b.id} className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{b.name}</span>
                  <span className="font-semibold text-emerald-400">{Math.floor(Math.random() * 8) + 4} tables</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function QRCodePattern() {
  // Stylised QR-like pattern using deterministic dots
  const cells = Array.from({ length: 25 * 25 }, (_, i) => {
    const x = i % 25, y = Math.floor(i / 25);
    // Corner finder patterns
    const inCorner = (cx: number, cy: number) => x >= cx && x < cx + 7 && y >= cy && y < cy + 7;
    if (inCorner(0, 0) || inCorner(18, 0) || inCorner(0, 18)) {
      const cx = inCorner(0, 0) ? 0 : inCorner(18, 0) ? 18 : 0;
      const cy = inCorner(0, 0) ? 0 : inCorner(18, 0) ? 0 : 18;
      const rx = x - cx, ry = y - cy;
      const isBorder = rx === 0 || rx === 6 || ry === 0 || ry === 6;
      const isInner = rx >= 2 && rx <= 4 && ry >= 2 && ry <= 4;
      return isBorder || isInner;
    }
    // Pseudo-random fill
    return ((x * 7 + y * 11 + (x ^ y) * 3) % 3) === 0;
  });
  return (
    <svg viewBox="0 0 25 25" className="w-full h-full">
      <rect width="25" height="25" fill="white" />
      {cells.map((on, i) => on ? (
        <rect key={i} x={i % 25} y={Math.floor(i / 25)} width="1" height="1" fill="#0B0B0B" />
      ) : null)}
    </svg>
  );
}
