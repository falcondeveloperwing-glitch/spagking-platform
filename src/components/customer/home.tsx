"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Search, ChevronRight, Flame, TrendingUp, Sparkles, Tag, Clock, MapPin, Star, Crown } from "lucide-react";
import { useStore } from "@/lib/store";
import { meals, categories, branches, formatNaira } from "@/lib/data";
import { MealCard } from "@/components/meal-card";
import { MealImage } from "@/components/brand";
import { Input } from "@/components/ui/input";

export function CustomerHome() {
  const setView = useStore(s => s.setCustomerView);
  const setSelectedMeal = useStore(s => s.setSelectedMeal);
  const setSearchOpen = useStore(s => s.setSearchOpen);
  const [query, setQuery] = useState("");

  const recommended = meals.filter(m => m.tags.includes("recommended")).slice(0, 6);
  const popular = meals.filter(m => m.tags.includes("popular")).slice(0, 6);
  const newMeals = meals.filter(m => m.tags.includes("new")).slice(0, 6);
  const combos = meals.filter(m => m.tags.includes("combo")).slice(0, 6);
  const flash = meals.filter(m => m.tags.includes("flash")).slice(0, 4);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchOpen(true);
  };

  return (
    <div className="space-y-8">
      {/* Hero */}
      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="relative rounded-3xl overflow-hidden glass-card p-6 sm:p-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(212,160,23,0.18),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(212,160,23,0.12),transparent_50%)]" />
        <div className="relative grid md:grid-cols-2 gap-6 items-center">
          <div>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-gold text-xs font-medium mb-4">
              <Crown className="w-3.5 h-3.5 text-[var(--gold)]" />
              #1 Pasta House in Lagos
            </motion.div>
            <h1 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight mb-3">
              Royalty in <span className="text-gold-gradient">every plate.</span>
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base mb-5 max-w-md">
              Premium spaghetti, shawarma, jollof & more — crafted fresh, delivered hot in 30 minutes across Lagos, Abuja & Port Harcourt.
            </p>
            <form onSubmit={handleSearch} className="flex gap-2 max-w-md">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search for spaghetti, shawarma…"
                  className="pl-10 h-11 bg-input/50 border-border/50" />
              </div>
              <button type="submit" className="btn-gold px-5 rounded-xl text-sm font-semibold">Search</button>
            </form>
            <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1"><Clock className="w-3 h-3 text-[var(--gold)]" /> 30 min delivery</span>
              <span className="inline-flex items-center gap-1"><Star className="w-3 h-3 text-[var(--gold)] fill-[var(--gold)]" /> 4.8 (12k+ reviews)</span>
              <span className="inline-flex items-center gap-1"><MapPin className="w-3 h-3 text-[var(--gold)]" /> 3 branches</span>
            </div>
          </div>
          <div className="hidden md:grid grid-cols-2 gap-3">
            {meals.slice(0, 4).map((m, i) => (
              <motion.div key={m.id} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * i, type: "spring" }}
                onClick={() => setSelectedMeal(m.id)}
                className={`relative rounded-2xl overflow-hidden cursor-pointer card-hover ${i % 2 === 0 ? "row-span-2 aspect-[3/4]" : "aspect-square"}`}>
                <MealImage src={m.image} emoji={m.emoji} alt={m.name} className="w-full h-full" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-2 left-2 right-2">
                  <div className="text-xs font-semibold text-white line-clamp-1">{m.name}</div>
                  <div className="text-[10px] text-[var(--gold)] font-bold">{formatNaira(m.price)}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Categories */}
      <section>
        <SectionHeader title="Browse by category" subtitle="Pick your craving" onSeeAll={() => setView("menu")} />
        <div className="grid grid-cols-4 sm:grid-cols-7 gap-2.5 sm:gap-3">
          {categories.map((c, i) => (
            <motion.button key={c.name} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -4 }}
              onClick={() => setView("menu")}
              className={`group relative p-3 sm:p-4 rounded-2xl glass-card card-hover bg-gradient-to-br ${c.color}`}>
              <div className="text-3xl sm:text-4xl mb-2">{c.emoji}</div>
              <div className="text-xs sm:text-sm font-semibold">{c.name}</div>
              <div className="text-[10px] text-muted-foreground">{c.count} items</div>
            </motion.button>
          ))}
        </div>
      </section>

      {/* Flash Sale */}
      {flash.length > 0 && (
        <section className="relative rounded-3xl overflow-hidden p-5 sm:p-6 bg-gradient-to-br from-red-500/15 via-orange-500/10 to-amber-500/15 border border-red-500/30">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
                <Flame className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <h2 className="font-display font-bold text-lg flex items-center gap-2">Flash Sale <span className="px-2 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-bold animate-pulse">LIVE</span></h2>
                <p className="text-xs text-muted-foreground">Up to 25% off · ends in 02:14:38</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {flash.map((m, i) => <MealCard key={m.id} meal={m} index={i} />)}
          </div>
        </section>
      )}

      {/* Recommended */}
      <Section title="Recommended for you" subtitle="Picked just for you by SpagKing AI" icon={Sparkles} meals={recommended} onViewAll={() => setView("menu")} />

      {/* Popular Today */}
      <Section title="Popular today" subtitle="What Lagos is loving right now" icon={TrendingUp} meals={popular} onViewAll={() => setView("menu")} />

      {/* New Meals */}
      <Section title="New on the menu" subtitle="Fresh additions from our kitchen" icon={Sparkles} meals={newMeals} onViewAll={() => setView("menu")} />

      {/* Combo Deals */}
      <section className="relative rounded-3xl overflow-hidden p-5 sm:p-6 bg-gradient-to-br from-violet-500/15 via-purple-500/10 to-fuchsia-500/15 border border-violet-500/30">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center">
              <Tag className="w-5 h-5 text-violet-300" />
            </div>
            <div>
              <h2 className="font-display font-bold text-lg">Combo Deals</h2>
              <p className="text-xs text-muted-foreground">Save more when you bundle</p>
            </div>
          </div>
          <button onClick={() => setView("menu")} className="text-xs text-[var(--gold)] font-medium inline-flex items-center">See all <ChevronRight className="w-3 h-3" /></button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {combos.map((m, i) => <MealCard key={m.id} meal={m} index={i} />)}
        </div>
      </section>

      {/* Branches */}
      <section>
        <SectionHeader title="Our branches" subtitle="Visit us across Nigeria" />
        <div className="grid sm:grid-cols-3 gap-3">
          {branches.map((b, i) => (
            <motion.div key={b.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              className="glass-card rounded-2xl p-4 card-hover">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-sm">{b.name}</h3>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1"><MapPin className="w-3 h-3" /> {b.city}</p>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${b.status === "open" ? "bg-emerald-500/20 text-emerald-400" : b.status === "busy" ? "bg-amber-500/20 text-amber-400" : "bg-red-500/20 text-red-400"}`}>
                  {b.status === "open" ? "OPEN" : b.status === "busy" ? "BUSY" : "CLOSED"}
                </span>
              </div>
              <p className="text-xs text-muted-foreground line-clamp-1 mb-3">{b.address}</p>
              <div className="flex items-center justify-between text-xs">
                <span className="inline-flex items-center gap-1"><Star className="w-3 h-3 text-[var(--gold)] fill-[var(--gold)]" /> {b.rating}</span>
                <span className="text-muted-foreground">{b.ordersToday} orders today</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}

function SectionHeader({ title, subtitle, onSeeAll }: { title: string; subtitle?: string; onSeeAll?: () => void }) {
  return (
    <div className="flex items-end justify-between mb-4">
      <div>
        <h2 className="font-display font-bold text-xl sm:text-2xl">{title}</h2>
        {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {onSeeAll && (
        <button onClick={onSeeAll} className="text-xs text-[var(--gold)] font-medium inline-flex items-center hover:gap-2 transition-all">
          See all <ChevronRight className="w-3 h-3" />
        </button>
      )}
    </div>
  );
}

function Section({ title, subtitle, icon: Icon, meals: list, onViewAll }: { title: string; subtitle: string; icon: any; meals: any[]; onViewAll: () => void }) {
  return (
    <section>
      <SectionHeader title={title} subtitle={subtitle} onSeeAll={onViewAll} />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {list.map((m, i) => <MealCard key={m.id} meal={m} index={i} />)}
      </div>
    </section>
  );
}
