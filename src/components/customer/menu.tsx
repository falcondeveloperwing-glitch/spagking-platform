"use client";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, X, Flame, Leaf } from "lucide-react";
import { meals, categories } from "@/lib/data";
import { MealCard } from "@/components/meal-card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export function CustomerMenu() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("All");
  const [sort, setSort] = useState("popular");
  const [filters, setFilters] = useState<{ spicy: boolean; veg: boolean; available: boolean }>({ spicy: false, veg: false, available: false });
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let list = meals.filter(m =>
      (category === "All" || m.category === category) &&
      m.name.toLowerCase().includes(query.toLowerCase()) &&
      (!filters.spicy || m.spicy) &&
      (!filters.veg || m.vegetarian) &&
      (!filters.available || m.available)
    );
    if (sort === "popular") list = list.sort((a, b) => b.sold - a.sold);
    if (sort === "rating") list = list.sort((a, b) => b.rating - a.rating);
    if (sort === "price-low") list = list.sort((a, b) => a.price - b.price);
    if (sort === "price-high") list = list.sort((a, b) => b.price - a.price);
    if (sort === "fastest") list = list.sort((a, b) => a.prepTime - b.prepTime);
    return list;
  }, [query, category, sort, filters]);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-3xl font-extrabold mb-1">Explore our menu</h1>
        <p className="text-sm text-muted-foreground">{filtered.length} meals available across {categories.length} categories</p>
      </div>

      {/* Search + sort */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search meals…"
            className="pl-10 h-11 bg-input/50 border-border/50" />
          {query && (
            <button onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <Button variant="outline" size="icon" onClick={() => setShowFilters(!showFilters)} className={`h-11 w-11 rounded-xl ${showFilters ? "border-[var(--gold)] text-[var(--gold)]" : ""}`}>
          <SlidersHorizontal className="w-4 h-4" />
        </Button>
        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger className="h-11 w-[140px] bg-input/50 border-border/50">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="popular">Most Popular</SelectItem>
            <SelectItem value="rating">Top Rated</SelectItem>
            <SelectItem value="price-low">Price: Low → High</SelectItem>
            <SelectItem value="price-high">Price: High → Low</SelectItem>
            <SelectItem value="fastest">Fastest Prep</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Filters panel */}
      {showFilters && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
          className="glass-card rounded-2xl p-4 flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted-foreground mr-1">Quick filters:</span>
          <FilterChip active={filters.spicy} onClick={() => setFilters(f => ({ ...f, spicy: !f.spicy }))} icon={Flame} label="Spicy" color="text-red-400" />
          <FilterChip active={filters.veg} onClick={() => setFilters(f => ({ ...f, veg: !f.veg }))} icon={Leaf} label="Vegetarian" color="text-emerald-400" />
          <FilterChip active={filters.available} onClick={() => setFilters(f => ({ ...f, available: !f.available }))} label="In stock" color="text-amber-400" />
          <Button variant="ghost" size="sm" onClick={() => setFilters({ spicy: false, veg: false, available: false })}
            className="text-xs ml-auto">Clear all</Button>
        </motion.div>
      )}

      {/* Categories pills */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        <CategoryPill label="All" active={category === "All"} onClick={() => setCategory("All")} count={meals.length} />
        {categories.map(c => (
          <CategoryPill key={c.name} label={`${c.emoji} ${c.name}`} active={category === c.name} onClick={() => setCategory(c.name)} count={c.count} />
        ))}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-3">🔍</div>
          <h3 className="font-semibold mb-1">No meals found</h3>
          <p className="text-sm text-muted-foreground">Try adjusting your filters or search query</p>
        </div>
      ) : (
        <motion.div layout className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {filtered.map((m, i) => <MealCard key={m.id} meal={m} index={i} />)}
        </motion.div>
      )}
    </div>
  );
}

function FilterChip({ active, onClick, icon: Icon, label, color }: { active: boolean; onClick: () => void; icon?: any; label: string; color?: string }) {
  return (
    <button onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${active ? "glass-gold text-[var(--gold)] border-[var(--gold)]/40" : "bg-muted/60 text-muted-foreground hover:bg-muted"}`}>
      {Icon && <Icon className={`w-3 h-3 ${color || ""}`} />} {label}
    </button>
  );
}

function CategoryPill({ label, active, onClick, count }: { label: string; active: boolean; onClick: () => void; count: number }) {
  return (
    <button onClick={onClick}
      className={`shrink-0 px-4 py-2 rounded-full text-xs font-medium transition-all whitespace-nowrap ${active ? "btn-gold" : "glass text-muted-foreground hover:text-foreground"}`}>
      {label} <span className={`ml-1 text-[10px] ${active ? "opacity-70" : "text-muted-foreground"}`}>{count}</span>
    </button>
  );
}
