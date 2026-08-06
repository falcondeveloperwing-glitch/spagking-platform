"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Search, ChevronRight, Flame, TrendingUp, Sparkles, Tag, Clock, MapPin, Star, Crown, ArrowRight } from "lucide-react";
import { useStore } from "@/lib/store";
import { meals, categories, branches, formatNaira } from "@/lib/data";
import { MealCard } from "@/components/meal-card";
import { MealImage } from "@/components/brand";
import { Input } from "@/components/ui/input";

export function CustomerHome() {
  const setView = useStore(s => s.setCustomerView);
  const setSelectedMeal = useStore(s => s.setSelectedMeal);
  const setSearchOpen = useStore(s => s.setSearchOpen);
  const setView2 = useStore(s => s.setCustomerView);
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
    <div className="space-y-10">
      {/* Hero — editorial, Apple-grade */}
      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative rounded-3xl overflow-hidden">
        {/* Background image with dark gradient */}
        <div className="absolute inset-0">
          <MealImage src={meals[0].image} emoji="🍝" alt="SpagKing signature dish" className="w-full h-full" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#100D0A] via-[#100D0A]/85 to-[#100D0A]/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#100D0A] via-transparent to-transparent" />
        </div>

        <div className="relative px-6 sm:px-10 py-10 sm:py-16 max-w-2xl">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-gold text-[11px] font-medium mb-5">
            <Crown className="w-3 h-3 text-[var(--gold)]" />
            #1 Pasta House in Lagos
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.7 }}
            className="font-display text-4xl sm:text-6xl font-semibold tracking-tight leading-[1.02] mb-4">
            Royalty in <br/><span className="text-gold-neon">every bowl.</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.7 }}
            className="text-muted-foreground text-sm sm:text-base mb-6 max-w-md leading-relaxed">
            Premium spaghetti, shawarma, jollof & more — crafted fresh, delivered hot in 30 minutes across Lagos, Abuja & Port Harcourt.
          </motion.p>

          <motion.form onSubmit={handleSearch} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45, duration: 0.7 }}
            className="flex gap-2 max-w-md mb-5">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search for spaghetti, shawarma…"
                className="pl-10 h-12 bg-foreground/[0.06] border-border/50 backdrop-blur-md focus:border-[var(--gold)]/40" />
            </div>
            <button type="submit" className="btn-gold px-6 rounded-xl text-sm font-semibold">Search</button>
          </motion.form>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
            className="flex items-center gap-5 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-[var(--gold)]" /> 30 min delivery</span>
            <span className="inline-flex items-center gap-1.5"><Star className="w-3.5 h-3.5 text-[var(--gold)] fill-[var(--gold)]" /> 4.8 (12k+ reviews)</span>
            <span className="inline-flex items-center gap-1.5 hidden sm:inline-flex"><MapPin className="w-3.5 h-3.5 text-[var(--gold)]" /> 3 branches</span>
          </motion.div>
        </div>
      </motion.section>

      {/* Categories — refined tiles */}
      <section>
        <SectionHeader title="Browse by category" subtitle="Pick your craving" onSeeAll={() => setView("menu")} />
        <div className="grid grid-cols-4 sm:grid-cols-7 gap-2.5">
          {categories.map((c, i) => (
            <motion.button key={c.name} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -3 }}
              onClick={() => setView("menu")}
              className="group relative p-3 sm:p-4 rounded-2xl glass-card card-hover overflow-hidden">
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br ${c.color}`} />
              <div className="relative">
                <div className="text-2xl sm:text-3xl mb-2 transition-transform duration-300 group-hover:scale-110">{c.emoji}</div>
                <div className="text-xs sm:text-sm font-medium">{c.name}</div>
                <div className="text-[10px] text-muted-foreground mt-0.5">{c.count} items</div>
              </div>
            </motion.button>
          ))}
        </div>
      </section>

      {/* Flash Sale — urgent but elegant */}
      {flash.length > 0 && (
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          className="relative rounded-3xl overflow-hidden p-5 sm:p-6 border border-[#E5586E]/20 bg-gradient-to-br from-[#E5586E]/10 via-[#100D0A] to-[#100D0A]">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#E5586E]/20 flex items-center justify-center">
                <Flame className="w-5 h-5 text-[#E5586E]" />
              </div>
              <div>
                <h2 className="font-display font-semibold text-lg flex items-center gap-2">
                  Flash Sale
                  <span className="px-1.5 py-0.5 rounded-full bg-[#E5586E] text-white text-[9px] font-bold animate-pulse">LIVE</span>
                </h2>
                <p className="text-[11px] text-muted-foreground">Up to 25% off · ends in <span className="text-[#E5586E] font-medium num">02:14:38</span></p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {flash.map((m, i) => <MealCard key={m.id} meal={m} index={i} />)}
          </div>
        </motion.section>
      )}

      {/* Recommended */}
      <Section title="Recommended for you" subtitle="Hand-picked by SpagKing AI" icon={Sparkles} meals={recommended} onViewAll={() => setView("menu")} />

      {/* Popular Today */}
      <Section title="Popular today" subtitle="What Lagos is loving right now" icon={TrendingUp} meals={popular} onViewAll={() => setView("menu")} />

      {/* New Meals */}
      <Section title="New on the menu" subtitle="Fresh additions from our kitchen" icon={Sparkles} meals={newMeals} onViewAll={() => setView("menu")} />

      {/* Combo Deals */}
      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
        className="relative rounded-3xl overflow-hidden p-5 sm:p-6 border border-[#A78BFA]/20 bg-gradient-to-br from-[#A78BFA]/10 via-[#100D0A] to-[#100D0A]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#A78BFA]/20 flex items-center justify-center">
              <Tag className="w-5 h-5 text-[#A78BFA]" />
            </div>
            <div>
              <h2 className="font-display font-semibold text-lg">Combo Deals</h2>
              <p className="text-[11px] text-muted-foreground">Save more when you bundle</p>
            </div>
          </div>
          <button onClick={() => setView("menu")} className="text-xs text-[var(--gold)] font-medium inline-flex items-center hover:gap-2 transition-all">
            See all <ChevronRight className="w-3 h-3" />
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {combos.map((m, i) => <MealCard key={m.id} meal={m} index={i} />)}
        </div>
      </motion.section>

      {/* Branches — elegant cards */}
      <section>
        <SectionHeader title="Visit us across Nigeria" subtitle="Three premium locations" />
        <div className="grid sm:grid-cols-3 gap-3">
          {branches.map((b, i) => (
            <motion.div key={b.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="glass-card rounded-2xl p-5 card-hover group">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-gold-soft flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-[var(--gold)]" />
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                  b.status === "open" ? "bg-[var(--success)]/15 text-[var(--success)]" :
                  b.status === "busy" ? "bg-[var(--warning)]/15 text-[var(--warning)]" : "bg-[var(--error)]/15 text-[var(--error)]"
                }`}>
                  {b.status === "open" ? "OPEN" : b.status === "busy" ? "BUSY" : "CLOSED"}
                </span>
              </div>
              <h3 className="font-display font-semibold text-base mb-1">{b.name.replace("SpagKing ", "")}</h3>
              <p className="text-xs text-muted-foreground mb-4 leading-relaxed">{b.address}</p>
              <div className="flex items-center justify-between text-xs pt-3 border-t border-border/40">
                <span className="inline-flex items-center gap-1"><Star className="w-3 h-3 text-[var(--gold)] fill-[var(--gold)]" /> <span className="num font-medium">{b.rating}</span></span>
                <span className="text-muted-foreground num">{b.ordersToday} orders today</span>
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
    <div className="flex items-end justify-between mb-5">
      <div>
        <h2 className="font-display font-semibold text-xl sm:text-2xl tracking-tight">{title}</h2>
        {subtitle && <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>}
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
