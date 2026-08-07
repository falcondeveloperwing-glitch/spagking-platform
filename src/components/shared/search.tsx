"use client";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Search, X, Utensils, Receipt, Users, Boxes, Truck, BarChart3, ArrowRight, TrendingUp, Mic, Flame, Clock3 } from "lucide-react";
import { useStore } from "@/lib/store";
import { meals, orders, customers, employees, suppliers, branches, formatNaira } from "@/lib/data";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export function GlobalSearch() {
  const open = useStore(s => s.searchOpen);
  const setOpen = useStore(s => s.setSearchOpen);
  const recentSearches = useStore(s => s.recentSearches);
  const addRecentSearch = useStore(s => s.addRecentSearch);
  const clearRecentSearches = useStore(s => s.clearRecentSearches);
  const [q, setQ] = useState("");

  const results = useMemo(() => {
    if (!q.trim()) return null;
    const query = q.toLowerCase();
    return {
      meals: meals.filter(m => m.name.toLowerCase().includes(query) || m.category.toLowerCase().includes(query)).slice(0, 4),
      orders: orders.filter(o => o.code.toLowerCase().includes(query) || o.customer.toLowerCase().includes(query)).slice(0, 4),
      customers: customers.filter(c => c.name.toLowerCase().includes(query) || c.email.toLowerCase().includes(query)).slice(0, 4),
      employees: employees.filter(e => e.name.toLowerCase().includes(query) || e.role.toLowerCase().includes(query)).slice(0, 3),
      suppliers: suppliers.filter(s => s.name.toLowerCase().includes(query) || s.category.toLowerCase().includes(query)).slice(0, 3),
      branches: branches.filter(b => b.name.toLowerCase().includes(query) || b.city.toLowerCase().includes(query)).slice(0, 3),
    };
  }, [q]);

  const hasResults = results && Object.values(results).some(arr => arr.length > 0);
  const total = results ? Object.values(results).reduce((s, a) => s + a.length, 0) : 0;

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setQ(""); }}>
      <DialogContent className="max-w-2xl p-0 bg-card/95 backdrop-blur-xl border-border/50 top-[15vh] translate-y-0">
        <div className="p-4 border-b border-border/50">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input autoFocus value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && q.trim()) addRecentSearch(q.trim()); }} placeholder="Search meals, categories, ingredients, offers…"
              className="pl-10 h-11 bg-input/50 border-border/50 text-base" />
            {q ? (
              <button onClick={() => setQ("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            ) : (
              <button onClick={() => toast.success("Voice search activated 🎤")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-[var(--gold)] transition-colors">
                <Mic className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        <div className="max-h-[55vh] overflow-y-auto p-2">
          {!q.trim() ? (
            <div className="p-6">
              {/* Recent searches */}
              {recentSearches.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Recent</div>
                    <button onClick={clearRecentSearches} className="text-[10px] text-muted-foreground hover:text-foreground">Clear</button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map(s => (
                      <button key={s} onClick={() => { setQ(s); addRecentSearch(s); }} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full glass text-xs hover:glass-gold transition-all">
                        <Clock3 className="w-3 h-3 text-muted-foreground" /> {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Trending searches */}
              <div className="mb-6">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 flex items-center gap-1.5">
                  <Flame className="w-3 h-3 text-[var(--warning)]" /> Trending now
                </div>
                <div className="flex flex-wrap gap-2">
                  {["SpagKing Royal Bolognese", "Suya Shawarma", "Flash sale", "Family combo", "Jollof rice", "Free delivery"].map(s => (
                    <button key={s} onClick={() => { setQ(s); addRecentSearch(s); }} className="px-3 py-1.5 rounded-full glass-gold text-[var(--gold)] text-xs hover:scale-105 transition-transform">
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick categories */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { icon: Utensils, label: "Meals", count: meals.length },
                  { icon: Receipt, label: "Orders", count: orders.length },
                  { icon: Users, label: "Customers", count: customers.length },
                  { icon: Users, label: "Staff", count: employees.length },
                  { icon: Boxes, label: "Suppliers", count: suppliers.length },
                  { icon: TrendingUp, label: "Reports", count: 12 },
                ].map(c => (
                  <button key={c.label} onClick={() => setQ(c.label)} className="glass-card rounded-2xl p-3 flex items-center gap-2.5 hover:glass-gold transition-all text-left">
                    <c.icon className="w-4 h-4 text-[var(--gold)]" />
                    <div>
                      <div className="text-xs font-semibold">{c.label}</div>
                      <div className="text-[10px] text-muted-foreground">{c.count} records</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : !hasResults ? (
            <div className="p-10 text-center">
              <div className="text-4xl mb-2">🔍</div>
              <p className="text-sm text-muted-foreground">No results for "{q}"</p>
            </div>
          ) : (
            <div className="space-y-1">
              <div className="px-3 py-2 text-[10px] text-muted-foreground uppercase tracking-wide">{total} results for "{q}"</div>
              {results!.meals.length > 0 && <Group icon={Utensils} label="Meals">
                {results!.meals.map(m => (
                  <Item key={m.id} icon={<span className="text-xl">{m.emoji}</span>} title={m.name} subtitle={`${m.category} · ${formatNaira(m.price)}`} />
                ))}
              </Group>}
              {results!.orders.length > 0 && <Group icon={Receipt} label="Orders">
                {results!.orders.map(o => (
                  <Item key={o.id} icon={<Receipt className="w-4 h-4 text-[var(--gold)]" />} title={o.code} subtitle={`${o.customer} · ${formatNaira(o.total)} · ${o.status}`} />
                ))}
              </Group>}
              {results!.customers.length > 0 && <Group icon={Users} label="Customers">
                {results!.customers.map(c => (
                  <Item key={c.id} icon={<Users className="w-4 h-4 text-[var(--gold)]" />} title={c.name} subtitle={`${c.tier} · ${c.orders} orders · ${formatNaira(c.totalSpent)}`} />
                ))}
              </Group>}
              {results!.employees.length > 0 && <Group icon={Users} label="Staff">
                {results!.employees.map(e => (
                  <Item key={e.id} icon={<Users className="w-4 h-4 text-[var(--gold)]" />} title={e.name} subtitle={`${e.role} · ${e.department}`} />
                ))}
              </Group>}
              {results!.suppliers.length > 0 && <Group icon={Boxes} label="Suppliers">
                {results!.suppliers.map(s => (
                  <Item key={s.id} icon={<Boxes className="w-4 h-4 text-[var(--gold)]" />} title={s.name} subtitle={`${s.category} · ${s.rating}★`} />
                ))}
              </Group>}
              {results!.branches.length > 0 && <Group icon={BarChart3} label="Branches">
                {results!.branches.map(b => (
                  <Item key={b.id} icon={<BarChart3 className="w-4 h-4 text-[var(--gold)]" />} title={b.name} subtitle={`${b.city} · ${b.status}`} />
                ))}
              </Group>}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Group({ icon: Icon, label, children }: { icon: any; label: string; children: React.ReactNode }) {
  return (
    <div className="mb-2">
      <div className="px-3 py-1.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
        <Icon className="w-3 h-3" /> {label}
      </div>
      <div>{children}</div>
    </div>
  );
}

function Item({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle: string }) {
  return (
    <button className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted/50 transition-colors text-left">
      <div className="w-9 h-9 rounded-lg bg-muted/50 flex items-center justify-center shrink-0">{icon}</div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium line-clamp-1">{title}</div>
        <div className="text-xs text-muted-foreground line-clamp-1">{subtitle}</div>
      </div>
      <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
    </button>
  );
}
