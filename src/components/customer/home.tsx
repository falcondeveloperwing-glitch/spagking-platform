"use client";
import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, ChevronRight, Flame, TrendingUp, Sparkles, Tag, Clock, MapPin, Star, Crown, ArrowRight, Heart, MessageCircle, Play, Instagram, Facebook, Youtube, Music2, Gift, Zap, Trophy, ChefHat } from "lucide-react";
import { useStore } from "@/lib/store";
import { meals, categories, branches, formatNaira } from "@/lib/data";
import { MealCard } from "@/components/meal-card";
import { MealImage } from "@/components/brand";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export function CustomerHome() {
  const setView = useStore(s => s.setCustomerView);
  const setSelectedMeal = useStore(s => s.setSelectedMeal);
  const setSearchOpen = useStore(s => s.setSearchOpen);
  const user = useStore(s => s.user);
  const loyaltyPoints = useStore(s => s.loyaltyPoints);
  const loyaltyTier = useStore(s => s.loyaltyTier);
  const [query, setQuery] = useState("");
  const [mounted, setMounted] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  const hour = mounted ? new Date().getHours() : 17;
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const firstName = user?.name?.split(" ")[0] || "Foodie";

  const recommended = meals.filter(m => m.tags.includes("recommended")).slice(0, 6);
  const popular = meals.filter(m => m.tags.includes("popular")).slice(0, 8);
  const newMeals = meals.filter(m => m.tags.includes("new")).slice(0, 8);
  const combos = meals.filter(m => m.tags.includes("combo")).slice(0, 4);
  const trending = [...meals].sort((a, b) => b.sold - a.sold).slice(0, 6);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchOpen(true);
  };

  return (
    <div className="space-y-10">
      {/* === Greeting + smart search === */}
      <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight">
              {greeting}, <span className="wordmark">{firstName}</span> <span className="inline-block animate-float">👋</span>
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">What are you craving today?</p>
          </div>
          <button onClick={() => setView("loyalty")} className="shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl glass-gold card-hover">
            <Crown className="w-4 h-4 text-[var(--gold)]" />
            <div className="text-left">
              <div className="text-[10px] text-muted-foreground leading-none">{loyaltyTier}</div>
              <div className="text-xs font-bold text-[var(--gold)] leading-tight num">{loyaltyPoints.toLocaleString()} pts</div>
            </div>
          </button>
        </div>

        {/* Smart search */}
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search meals, categories, ingredients, offers…"
              className="pl-10 h-12 bg-foreground/[0.04] border-border/50 backdrop-blur-md focus:border-[var(--gold)]/40" />
          </div>
          <button type="submit" className="btn-gold px-5 rounded-xl text-sm font-semibold">Search</button>
        </form>

        {/* Quick search chips */}
        <div className="flex gap-2 mt-3 overflow-x-auto no-scrollbar">
          {["🔥 Flash sale", "🍱 Combos", "🌶️ Spicy", "🥗 Vegetarian", "🎂 Desserts", "🥤 Drinks", "⭐ Top rated", "⚡ Under 15 min"].map(c => (
            <button key={c} onClick={() => setView("menu")} className="shrink-0 px-3 py-1.5 rounded-full glass text-xs hover:glass-gold hover:text-[var(--gold)] transition-all">
              {c}
            </button>
          ))}
        </div>
      </motion.section>

      {/* === Hero promotion === */}
      <motion.section initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }}>
        <HeroPromoCarousel />
      </motion.section>

      {/* === AI personal greeting === */}
      <motion.button
        onClick={() => useStore.getState().setAiOpen(true)}
        whileHover={{ y: -2 }}
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="w-full glass-card rounded-2xl p-4 flex items-center gap-4 text-left card-hover">
        <div className="relative w-12 h-12 rounded-xl bg-gold-gradient flex items-center justify-center shrink-0">
          <span className="absolute inset-0 rounded-xl bg-gold-gradient opacity-50 blur-md animate-glow-pulse" />
          <Sparkles className="w-5 h-5 text-[#050505] relative" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-xs font-semibold text-[var(--gold)]">SpagKing AI</span>
            <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[var(--success)]/15 text-[var(--success)] font-bold">PERSONAL</span>
          </div>
          <p className="text-sm">Welcome back, {firstName}. You usually enjoy <span className="text-[var(--gold)] font-medium">spicy meals</span> — we think you'll love today's <span className="text-[var(--gold)] font-medium">Suya Spaghetti</span>. 🔥</p>
        </div>
        <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0" />
      </motion.button>

      {/* === Kitchen Live teaser === */}
      <motion.button onClick={() => setView("kitchen")} whileHover={{ y: -2 }}
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="w-full glass-card rounded-2xl p-4 flex items-center gap-4 text-left card-hover relative overflow-hidden">
        <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-[var(--error)]/10 blur-2xl" />
        <div className="relative w-12 h-12 rounded-xl bg-[var(--error)]/15 flex items-center justify-center shrink-0">
          <span className="text-2xl">🔥</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-[var(--error)]/15 text-[var(--error)] text-[9px] font-bold">
              <span className="w-1 h-1 rounded-full bg-[var(--error)] pulse-dot text-[var(--error)]" /> LIVE
            </span>
            <span className="text-xs font-semibold">Kitchen Live</span>
          </div>
          <p className="text-sm">👨‍🍳 Chef Ibrahim is preparing <span className="text-[var(--gold)] font-medium">42 bowls</span> today · 8 min wait · 98% 5★ ratings</p>
        </div>
        <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0" />
      </motion.button>

      {/* === Categories === */}
      <section>
        <SectionHeader title="Categories" subtitle="Pick your craving" onSeeAll={() => setView("menu")} />
        <div className="grid grid-cols-4 sm:grid-cols-7 gap-2.5">
          {categories.map((c, i) => (
            <motion.button key={c.name} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -3 }}
              onClick={() => setView("menu")}
              className="group flex flex-col items-center gap-2">
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full glass-card card-hover flex items-center justify-center overflow-hidden">
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br ${c.color}`} />
                <div className="relative text-2xl sm:text-3xl transition-transform duration-300 group-hover:scale-110">{c.emoji}</div>
                {/* Glow ring on hover */}
                <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ boxShadow: "0 0 24px rgba(255,215,0,0.3) inset" }} />
              </div>
              <div className="text-xs sm:text-sm font-medium">{c.name}</div>
              <div className="text-[10px] text-muted-foreground -mt-1">{c.count}</div>
            </motion.button>
          ))}
        </div>
      </section>

      {/* === Popular Today — horizontal scroll === */}
      <section>
        <SectionHeader title="Popular today" subtitle="What Lagos is loving right now" onSeeAll={() => setView("menu")} />
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
          {popular.map((m, i) => (
            <div key={m.id} className="w-64 sm:w-72 shrink-0">
              <MealCard meal={m} index={i} />
            </div>
          ))}
        </div>
      </section>

      {/* === Recommended For You === */}
      <section>
        <SectionHeader title="Recommended for you" subtitle="Hand-picked by SpagKing AI based on your taste" icon={Sparkles} onSeeAll={() => setView("menu")} />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {recommended.map((m, i) => <MealCard key={m.id} meal={m} index={i} />)}
        </div>
      </section>

      {/* === Combo Deals — large premium cards === */}
      <section>
        <SectionHeader title="Combo deals" subtitle="Save more when you bundle" icon={Tag} onSeeAll={() => setView("menu")} />
        <div className="grid sm:grid-cols-2 gap-4">
          {combos.slice(0, 2).map((m, i) => (
            <motion.div key={m.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              onClick={() => setSelectedMeal(m.id)}
              className="group relative rounded-3xl overflow-hidden glass-card card-hover cursor-pointer aspect-[16/9]">
              <MealImage src={m.image} emoji={m.emoji} alt={m.name} className="absolute inset-0 w-full h-full transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              <div className="absolute top-3 left-3 flex gap-1.5">
                <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-[var(--gold)] text-black">COMBO</span>
                {m.oldPrice && <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-[var(--success)] text-black">SAVE {formatNaira(m.oldPrice - m.price)}</span>}
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <h3 className="font-display font-semibold text-xl text-white mb-1">{m.name}</h3>
                <p className="text-xs text-white/70 mb-3 line-clamp-1">{m.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {m.oldPrice && <span className="text-xs text-white/50 line-through num">{formatNaira(m.oldPrice)}</span>}
                    <span className="font-display font-bold text-2xl text-gold-neon num">{formatNaira(m.price)}</span>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); useStore.getState().addToCart({ mealId: m.id, name: m.name, emoji: m.emoji, image: m.image, price: m.price, qty: 1, size: m.sizes[0].name }); toast.success(`${m.name} added to cart`); }}
                    className="btn-gold px-4 py-2 rounded-xl text-xs font-semibold">Add to cart</button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* === Trending Meals === */}
      <section>
        <SectionHeader title="🔥 Trending now" subtitle="What's hot this week" icon={TrendingUp} onSeeAll={() => setView("menu")} />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {trending.map((m, i) => (
            <div key={m.id} className="relative">
              <span className="absolute -top-1 -left-1 z-10 w-6 h-6 rounded-full bg-gold-gradient text-black text-[10px] font-bold flex items-center justify-center shadow-lg">{i + 1}</span>
              <MealCard meal={m} index={i} />
            </div>
          ))}
        </div>
      </section>

      {/* === New Arrivals === */}
      <section>
        <SectionHeader title="New arrivals" subtitle="Fresh additions from our kitchen" icon={Sparkles} onSeeAll={() => setView("menu")} />
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
          {newMeals.map((m, i) => (
            <div key={m.id} className="w-64 sm:w-72 shrink-0">
              <MealCard meal={m} index={i} />
            </div>
          ))}
        </div>
      </section>

      {/* === Loyalty teaser === */}
      <motion.button onClick={() => setView("loyalty")} whileHover={{ y: -2 }}
        className="w-full relative rounded-3xl overflow-hidden bg-gold-shimmer text-black p-6 text-left">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.4),transparent_50%)]" />
        <div className="relative flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Crown className="w-5 h-5" />
              <span className="font-display font-bold text-lg">SpagKing Rewards</span>
            </div>
            <p className="text-sm opacity-80">You have <span className="font-bold">{loyaltyPoints.toLocaleString()} points</span> · {2500 - loyaltyPoints} pts to <span className="font-bold">King VIP</span></p>
            <div className="mt-3 h-2 rounded-full bg-black/20 overflow-hidden max-w-xs">
              <motion.div initial={{ width: 0 }} animate={{ width: `${(loyaltyPoints / 2500) * 100}%` }} transition={{ duration: 1 }}
                className="h-full bg-black rounded-full" />
            </div>
          </div>
          <div className="hidden sm:flex flex-col items-center">
            <Trophy className="w-10 h-10 opacity-80" />
            <span className="text-[10px] font-bold mt-1">{loyaltyTier.toUpperCase()}</span>
          </div>
        </div>
      </motion.button>

      {/* === Customer Reviews === */}
      <section>
        <SectionHeader title="What customers say" subtitle="Real reviews from the SpagKing family" />
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
          {[
            { name: "Adaobi N.", role: "Gold member", avatar: "AN", rating: 5, text: "Best spaghetti in Lagos! The Royal Bolognese is unmatched. Service was excellent.", meal: "SpagKing Royal Bolognese", color: "from-amber-500 to-yellow-600" },
            { name: "Tunde A.", role: "Silver member", avatar: "TA", rating: 4, text: "Food was great but delivery took 45 mins instead of 30. Still tasty though.", meal: "Chicken Alfredo Spaghetti", color: "from-emerald-500 to-green-600" },
            { name: "Fatima B.", role: "King VIP", avatar: "FB", rating: 5, text: "The shawarma is to die for! Will definitely order again. Rider was polite too.", meal: "SpagKing Special Shawarma", color: "from-violet-500 to-purple-600" },
            { name: "Emeka O.", role: "Gold member", avatar: "EO", rating: 5, text: "Used the QR table ordering — so smooth! No waiting for waiter. Brilliant idea.", meal: "Jollof Rice Special", color: "from-rose-500 to-pink-600" },
            { name: "Grace S.", role: "Bronze member", avatar: "GS", rating: 5, text: "The combo deals are amazing value. Fed my whole family for under ₦15k!", meal: "Rice & Beans Combo", color: "from-cyan-500 to-blue-600" },
          ].map((r, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
              className="w-72 shrink-0 glass-card rounded-2xl p-4 card-hover">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${r.color} flex items-center justify-center text-white text-xs font-bold`}>{r.avatar}</div>
                <div className="flex-1">
                  <div className="text-sm font-semibold">{r.name}</div>
                  <div className="text-[10px] text-muted-foreground">{r.role}</div>
                </div>
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, j) => <Star key={j} className={`w-3 h-3 ${j < r.rating ? "text-[var(--gold)] fill-[var(--gold)]" : "text-muted-foreground/30"}`} />)}
                </div>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed mb-3">"{r.text}"</p>
              <div className="flex items-center gap-1.5 text-[10px] text-[var(--gold)]">
                <ChefHat className="w-3 h-3" /> Reviewed: <span className="font-medium">{r.meal}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* === SpagKing Community teaser === */}
      <motion.button onClick={() => setView("community")} whileHover={{ y: -2 }}
        className="w-full glass-card rounded-3xl p-6 text-left card-hover relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-[var(--gold)]/10 blur-3xl" />
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl">👑</span>
                <h3 className="font-display font-semibold text-lg">SpagKing Community</h3>
              </div>
              <p className="text-xs text-muted-foreground">Behind the scenes, kitchen moments, chef specials & customer reactions</p>
            </div>
            <ArrowRight className="w-5 h-5 text-[var(--gold)]" />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {[
              { icon: Music2, label: "TikTok", count: "48 videos", color: "text-[#FF80AB]" },
              { icon: Instagram, label: "Instagram", count: "312 posts", color: "text-[#FF80AB]" },
              { icon: Facebook, label: "Facebook", count: "8.4k likes", color: "text-[#4FC3F7]" },
              { icon: Youtube, label: "YouTube", count: "24 videos", color: "text-[var(--error)]" },
            ].map(s => (
              <div key={s.label} className="rounded-xl bg-foreground/[0.04] p-3 text-center">
                <s.icon className={`w-5 h-5 mx-auto mb-1 ${s.color}`} />
                <div className="text-xs font-semibold">{s.label}</div>
                <div className="text-[9px] text-muted-foreground">{s.count}</div>
              </div>
            ))}
          </div>
        </div>
      </motion.button>

      {/* === Nearby Branches === */}
      <section>
        <SectionHeader title="Nearby branches" subtitle="Visit us across Nigeria" />
        <div className="grid sm:grid-cols-3 gap-3">
          {branches.map((b, i) => (
            <motion.div key={b.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="glass-card rounded-2xl p-5 card-hover">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-gold-soft flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-[var(--gold)]" />
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                  b.status === "open" ? "bg-[var(--success)]/15 text-[var(--success)]" :
                  b.status === "busy" ? "bg-[var(--warning)]/15 text-[var(--warning)]" : "bg-[var(--error)]/15 text-[var(--error)]"
                }`}>{b.status === "open" ? "OPEN" : b.status === "busy" ? "BUSY" : "CLOSED"}</span>
              </div>
              <h3 className="font-display font-semibold text-base mb-1">{b.name.replace("SpagKing ", "")}</h3>
              <p className="text-xs text-muted-foreground mb-3 leading-relaxed">{b.address}</p>
              <div className="space-y-1.5 text-[11px]">
                <div className="flex items-center gap-1.5 text-muted-foreground"><MapPin className="w-3 h-3 text-[var(--gold)]" /> {i === 0 ? "2.4 km away" : i === 1 ? "8.1 km away" : "12.6 km away"}</div>
                <div className="flex items-center gap-1.5 text-muted-foreground"><Clock className="w-3 h-3 text-[var(--gold)]" /> Open until 11:00 PM</div>
                <div className="flex items-center justify-between pt-2 border-t border-border/40">
                  <span className="inline-flex items-center gap-1"><Star className="w-3 h-3 text-[var(--gold)] fill-[var(--gold)]" /> <span className="num font-medium">{b.rating}</span></span>
                  <span className="text-muted-foreground num">{b.ordersToday} orders today</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}

function HeroPromoCarousel() {
  const promos = [
    { title: "Buy 2 Get 1 Free", desc: "On all spaghetti dishes this weekend", cta: "Order now", emoji: "🍝", bg: "from-[#FFD700]/20 via-[#050505] to-[#050505]", glow: "rgba(255,215,0,0.4)" },
    { title: "Weekend Family Combo", desc: "Feed 4 for just ₦18,500 — save ₦6,000", cta: "View combos", emoji: "👨‍👩‍👧‍👦", bg: "from-[#00E676]/15 via-[#050505] to-[#050505]", glow: "rgba(0,230,118,0.3)" },
    { title: "Free Delivery", desc: "On all orders above ₦10,000 in Lagos", cta: "Start order", emoji: "🛵", bg: "from-[#4FC3F7]/15 via-[#050505] to-[#050505]", glow: "rgba(79,195,247,0.3)" },
    { title: "Flash Sale — 25% Off", desc: "Spicy Arrabbiata & Suya Shawarma · 2hrs only", cta: "Grab deal", emoji: "🔥", bg: "from-[#FF4D6A]/15 via-[#050505] to-[#050505]", glow: "rgba(255,77,106,0.3)" },
  ];
  const [idx, setIdx] = useState(0);
  const promo = promos[idx];

  return (
    <div className="relative">
      <motion.div key={idx} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}
        className={`relative rounded-3xl overflow-hidden bg-gradient-to-br ${promo.bg} border border-[var(--gold)]/20 p-6 sm:p-8`}>
        {/* Steam particles */}
        <div className="absolute top-4 right-8 opacity-30">
          <motion.div animate={{ y: [0, -20, 0], opacity: [0, 0.6, 0] }} transition={{ duration: 3, repeat: Infinity }} className="w-1 h-12 bg-white/30 rounded-full blur-sm" />
        </div>
        <div className="absolute top-8 right-16 opacity-30">
          <motion.div animate={{ y: [0, -25, 0], opacity: [0, 0.5, 0] }} transition={{ duration: 3.5, repeat: Infinity, delay: 0.5 }} className="w-1 h-14 bg-white/20 rounded-full blur-sm" />
        </div>

        <div className="relative flex items-center justify-between gap-4">
          <div className="flex-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full glass-gold text-[10px] font-bold mb-3">
              <Zap className="w-3 h-3 text-[var(--gold)]" /> LIMITED TIME
            </div>
            <h2 className="font-display font-bold text-2xl sm:text-4xl tracking-tight mb-2 leading-tight">
              <span className="text-gold-neon">{promo.title}</span>
            </h2>
            <p className="text-sm text-muted-foreground mb-4">{promo.desc}</p>
            <button onClick={() => useStore.getState().setCustomerView("menu")}
              className="btn-gold px-5 py-2.5 rounded-xl text-sm font-semibold inline-flex items-center gap-2">
              {promo.cta} <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <motion.div animate={{ y: [0, -8, 0], rotate: [0, 5, 0] }} transition={{ duration: 4, repeat: Infinity }}
            className="text-6xl sm:text-8xl shrink-0">{promo.emoji}</motion.div>
        </div>

        {/* Decorative gold particles */}
        <motion.div className="absolute bottom-4 left-1/3 w-1 h-1 rounded-full bg-[var(--gold)]" animate={{ opacity: [0, 1, 0], scale: [0.5, 1.5, 0.5] }} transition={{ duration: 2, repeat: Infinity }} />
        <motion.div className="absolute top-12 left-1/2 w-1 h-1 rounded-full bg-[var(--gold)]" animate={{ opacity: [0, 1, 0], scale: [0.5, 1.5, 0.5] }} transition={{ duration: 2.5, repeat: Infinity, delay: 0.7 }} />
      </motion.div>

      {/* Dot indicators */}
      <div className="flex justify-center gap-1.5 mt-3">
        {promos.map((_, i) => (
          <button key={i} onClick={() => setIdx(i)}
            className={`h-1.5 rounded-full transition-all ${i === idx ? "w-6 bg-gold-gradient" : "w-1.5 bg-foreground/20"}`} />
        ))}
      </div>

      {/* Auto-advance */}
      <AutoAdvance setIdx={setIdx} length={promos.length} />
    </div>
  );
}

function AutoAdvance({ setIdx, length }: { setIdx: (fn: (i: number) => number) => void; length: number }) {
  useMemo(() => {
    const interval = setInterval(() => {
      setIdx(i => (i + 1) % length);
    }, 5000);
    return () => clearInterval(interval);
  }, [setIdx, length]);
  return null;
}

function SectionHeader({ title, subtitle, onSeeAll, icon: Icon }: { title: string; subtitle?: string; onSeeAll?: () => void; icon?: any }) {
  return (
    <div className="flex items-end justify-between mb-4">
      <div>
        <h2 className="font-display font-semibold text-xl sm:text-2xl tracking-tight flex items-center gap-2">
          {Icon && <Icon className="w-5 h-5 text-[var(--gold)]" />}
          {title}
        </h2>
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
