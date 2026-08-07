"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, ChefHat, Bike, Sparkles, Star, Clock, Users, TrendingUp, Leaf, Heart, Activity, Zap } from "lucide-react";
import { meals, branches, formatNaira } from "@/lib/data";
import { toast } from "sonner";

interface KitchenEvent {
  id: number;
  icon: string;
  text: string;
  time: string;
  color: string;
}

const LIVE_EVENTS = [
  { icon: "👨‍🍳", text: "Chef Ibrahim is preparing today's signature bowl", color: "text-[var(--gold)]" },
  { icon: "🍜", text: "42 bowls served today", color: "text-[var(--success)]" },
  { icon: "🔥", text: "Current kitchen wait time: 8 minutes", color: "text-[var(--warning)]" },
  { icon: "🥬", text: "Fresh vegetables delivered at 7:15 AM", color: "text-[var(--success)]" },
  { icon: "⭐", text: "98% of customers rated today's meals 5 stars", color: "text-[var(--gold)]" },
  { icon: "🛵", text: "12 riders currently on delivery across Lagos", color: "text-[#4FC3F7]" },
  { icon: "👨‍🍳", text: "Chef Bisi just plated the SpagKing Royal Bolognese", color: "text-[var(--gold)]" },
  { icon: "🔥", text: "Kitchen fired up 6 Suya Shawarmas in the last 10 min", color: "text-[var(--warning)]" },
  { icon: "🥘", text: "Fresh batch of Egusi soup just finished cooking", color: "text-[var(--success)]" },
  { icon: "✨", text: "Gold garnish restocked — every plate gets the royal touch", color: "text-[var(--gold)]" },
  { icon: "📦", text: "Premium seafood delivery arrived from Atlantic Seafoods", color: "text-[#4FC3F7]" },
  { icon: "👨‍👩‍👧", text: "Family of 5 just ordered the Weekend Combo in VI", color: "text-[#FF80AB]" },
];

const CHEFS = [
  { name: "Chef Ibrahim", role: "Head Chef", specialty: "Signature bowls", avatar: "👨‍🍳", status: "cooking", mealsToday: 47, rating: 4.9 },
  { name: "Chef Bisi", role: "Sous Chef", specialty: "Shawarma & grills", avatar: "👩‍🍳", status: "cooking", mealsToday: 38, rating: 4.8 },
  { name: "Chef Ade", role: "Pastry Chef", specialty: "Desserts & lava cakes", avatar: "👨‍🍳", status: "preparing", mealsToday: 22, rating: 5.0 },
  { name: "Chef Ngozi", role: "Line Cook", specialty: "Jollof & rice dishes", avatar: "👩‍🍳", status: "cooking", mealsToday: 31, rating: 4.7 },
];

export function CustomerKitchenLive() {
  const [events, setEvents] = useState<KitchenEvent[]>(
    LIVE_EVENTS.slice(0, 5).map((e, i) => ({ ...e, id: i, time: `${i * 3 + 1}m ago` }))
  );
  const [nextId, setNextId] = useState(100);
  const [bowlsServed, setBowlsServed] = useState(42);
  const [satisfaction, setSatisfaction] = useState(98);

  // Simulate live events streaming in
  useEffect(() => {
    const interval = setInterval(() => {
      const template = LIVE_EVENTS[Math.floor(Math.random() * LIVE_EVENTS.length)];
      const newEvent: KitchenEvent = { ...template, id: nextId, time: "Just now" };
      setEvents(prev => [newEvent, ...prev].slice(0, 12));
      setNextId(n => n + 1);
      // Bump live counters occasionally
      if (template.icon === "🍜" || template.icon === "👨‍🍳") {
        setBowlsServed(b => b + Math.floor(Math.random() * 3) + 1);
      }
      if (template.icon === "⭐") {
        setSatisfaction(s => Math.min(99, s + (Math.random() > 0.5 ? 1 : 0)));
      }
    }, 4500);
    return () => clearInterval(interval);
  }, [nextId]);

  return (
    <div className="space-y-6">
      {/* Hero — live kitchen status */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        className="relative rounded-3xl overflow-hidden glass-card p-6 sm:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(255,215,0,0.10),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(0,230,118,0.06),transparent_50%)]" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--error)]/15 text-[var(--error)] text-[10px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--error)] pulse-dot text-[var(--error)]" /> LIVE
            </span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider">SpagKing Victoria Island Kitchen</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight mb-2">
            The kitchen is <span className="text-gold-neon">alive</span> right now
          </h1>
          <p className="text-sm text-muted-foreground max-w-lg">Real-time activity from our chefs, kitchen, and delivery fleet. This is what makes SpagKing feel like home.</p>

          {/* Live counters */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
            <LiveCounter icon="🍜" label="Bowls served today" value={bowlsServed} color="text-[var(--gold)]" />
            <LiveCounter icon="⭐" label="Satisfaction today" value={`${satisfaction}%`} color="text-[var(--success)]" />
            <LiveCounter icon="🔥" label="Kitchen wait" value="8 min" color="text-[var(--warning)]" />
            <LiveCounter icon="🛵" label="Riders on delivery" value="12" color="text-[#4FC3F7]" />
          </div>
        </div>
      </motion.div>

      {/* Live activity feed */}
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="glass-card rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold flex items-center gap-2"><Activity className="w-4 h-4 text-[var(--gold)]" /> Live activity</h3>
            <span className="text-[10px] text-[var(--success)] font-medium inline-flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--success)] pulse-dot text-[var(--success)]" /> Streaming
            </span>
          </div>
          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            <AnimatePresence initial={false}>
              {events.map((e) => (
                <motion.div key={e.id}
                  initial={{ opacity: 0, x: -20, height: 0 }}
                  animate={{ opacity: 1, x: 0, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="flex items-center gap-3 p-2.5 rounded-xl bg-foreground/[0.03] hover:bg-foreground/[0.06] transition-colors">
                  <span className="text-xl shrink-0">{e.icon}</span>
                  <p className={`text-xs flex-1 ${e.color}`}>{e.text}</p>
                  <span className="text-[10px] text-muted-foreground shrink-0">{e.time}</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Chef spotlight */}
        <div className="glass-card rounded-2xl p-5">
          <h3 className="font-display font-semibold flex items-center gap-2 mb-4"><ChefHat className="w-4 h-4 text-[var(--gold)]" /> Chefs on shift now</h3>
          <div className="space-y-3">
            {CHEFS.map((c, i) => (
              <motion.div key={c.name} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                className="flex items-center gap-3 p-3 rounded-xl bg-foreground/[0.03]">
                <div className="relative">
                  <div className="w-11 h-11 rounded-xl bg-gold-soft flex items-center justify-center text-2xl">{c.avatar}</div>
                  <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-card ${c.status === "cooking" ? "bg-[var(--success)] pulse-dot text-[var(--success)]" : "bg-[var(--warning)]"}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold">{c.name}</div>
                  <div className="text-[10px] text-muted-foreground">{c.role} · {c.specialty}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-[var(--gold)] num">{c.mealsToday}</div>
                  <div className="text-[9px] text-muted-foreground">meals today</div>
                </div>
              </motion.div>
            ))}
          </div>
          <button onClick={() => toast.success("Chef appreciation sent! 👨‍🍳")}
            className="w-full mt-3 btn-gold py-2 rounded-xl text-xs font-semibold">
            Send chef appreciation 🙏
          </button>
        </div>
      </div>

      {/* Fresh ingredients today */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-2xl p-5">
        <h3 className="font-display font-semibold flex items-center gap-2 mb-4"><Leaf className="w-4 h-4 text-[var(--success)]" /> Fresh ingredients arrived today</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { name: "Premium beef", source: "Hassan Meat Supply", time: "7:15 AM", emoji: "🥩" },
            { name: "Fresh seafood", source: "Atlantic Seafoods", time: "6:42 AM", emoji: "🦐" },
            { name: "Organic vegetables", source: "Lagos Fresh Farms", time: "6:30 AM", emoji: "🥬" },
            { name: "Stone-ground spices", source: "GoldSpice Merchants", time: "Yesterday", emoji: "🌶️" },
          ].map((ing, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
              className="rounded-xl bg-foreground/[0.03] p-3 border border-border/30">
              <div className="text-3xl mb-1.5">{ing.emoji}</div>
              <div className="text-xs font-semibold">{ing.name}</div>
              <div className="text-[9px] text-muted-foreground mt-0.5">{ing.source}</div>
              <div className="text-[9px] text-[var(--success)] mt-1 inline-flex items-center gap-0.5"><Clock className="w-2 h-2" /> {ing.time}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Trending in kitchen right now */}
      <div>
        <h3 className="font-display font-semibold text-lg mb-3 flex items-center gap-2"><Flame className="w-4 h-4 text-[var(--warning)]" /> Cooking hot right now</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {meals.slice(0, 6).map((m, i) => {
            const cooking = Math.floor(Math.random() * 4) + 1;
            return (
              <motion.div key={m.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                onClick={() => { useStore.getState().setSelectedMeal(m.id); }}
                className="glass-card rounded-2xl p-4 card-hover cursor-pointer">
                <div className="flex items-start gap-3">
                  <div className="text-3xl">{m.emoji}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold line-clamp-1">{m.name}</div>
                    <div className="text-[10px] text-muted-foreground">{m.category}</div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-[var(--warning)]/15 text-[var(--warning)] font-medium">
                        <span className="w-1 h-1 rounded-full bg-[var(--warning)] pulse-dot text-[var(--warning)]" /> {cooking} cooking now
                      </span>
                      <span className="text-[10px] text-muted-foreground num">{m.sold}+ sold</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Kitchen stats banner */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-2xl p-5 grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Stat icon={Users} value="247" label="Customers served today" color="text-[var(--gold)]" />
        <Stat icon={Clock} value="32 min" label="Avg order-to-door time" color="text-[var(--success)]" />
        <Stat icon={TrendingUp} value="+18%" label="Sales vs yesterday" color="text-[var(--success)]" />
        <Stat icon={Star} value="4.9★" label="Today's avg rating" color="text-[var(--gold)]" />
      </motion.div>
    </div>
  );
}

function LiveCounter({ icon, label, value, color }: { icon: string; label: string; value: string | number; color: string }) {
  return (
    <div className="rounded-xl bg-foreground/[0.04] border border-border/30 p-3">
      <div className="text-2xl mb-1">{icon}</div>
      <motion.div key={String(value)} initial={{ scale: 1.15, color: "#FFD700" }} animate={{ scale: 1, color: "currentColor" }}
        transition={{ duration: 0.4 }} className={`font-display font-bold text-xl num ${color}`}>{value}</motion.div>
      <div className="text-[10px] text-muted-foreground mt-0.5">{label}</div>
    </div>
  );
}

function Stat({ icon: Icon, value, label, color }: { icon: any; value: string; label: string; color: string }) {
  return (
    <div className="text-center">
      <Icon className={`w-5 h-5 mx-auto mb-1.5 ${color}`} />
      <div className="font-display font-bold text-lg num">{value}</div>
      <div className="text-[10px] text-muted-foreground">{label}</div>
    </div>
  );
}
