"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Package, Truck, AlertTriangle, TrendingDown, Plus, Search, Boxes, Trash2, Calendar, DollarSign, ArrowRight, Filter } from "lucide-react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { meals, suppliers, formatNaira } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const stockTrend = Array.from({ length: 14 }, (_, i) => ({
  day: `D${i + 1}`, value: 100 - i * 3 + Math.floor(Math.random() * 8),
}));

const wasteByCat = [
  { cat: "Spaghetti", waste: 4.2 }, { cat: "Rice", waste: 6.8 },
  { cat: "Shawarma", waste: 2.1 }, { cat: "Burgers", waste: 3.5 },
  { cat: "Drinks", waste: 1.2 }, { cat: "Soups", waste: 5.4 }, { cat: "Desserts", waste: 2.8 },
];

export function InventoryDashboard() {
  const [tab, setTab] = useState<"stock" | "suppliers" | "po" | "waste" | "expiry">("stock");
  const [query, setQuery] = useState("");

  const items = meals.map(m => ({
    ...m,
    unit: "packs",
    reorder: 20,
    supplier: suppliers[Math.floor(Math.random() * suppliers.length)].name,
    lastReceived: `${Math.floor(Math.random() * 7) + 1} days ago`,
    expiry: `${Math.floor(Math.random() * 30) + 2} days`,
  }));
  const filtered = items.filter(i => i.name.toLowerCase().includes(query.toLowerCase()));
  const lowStock = items.filter(i => i.stock < i.reorder);
  const totalValue = items.reduce((s, i) => s + i.price * i.stock, 0);
  const expiringSoon = items.filter((_, i) => i % 7 === 0).slice(0, 5);

  return (
    <div className="space-y-5">
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KPI title="Total SKUs" value={items.length.toString()} sub="across 7 categories" icon={Boxes} accent="from-amber-500/20" />
        <KPI title="Inventory Value" value={formatNaira(totalValue)} sub="at current cost" icon={DollarSign} accent="from-emerald-500/20" />
        <KPI title="Low Stock" value={lowStock.length.toString()} sub="need reorder" icon={AlertTriangle} accent="from-amber-500/20" warning />
        <KPI title="Waste This Week" value="3.2%" sub="↓ 0.8% vs last week" icon={TrendingDown} accent="from-red-500/20" />
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="glass-card rounded-2xl p-5">
          <h3 className="font-display font-bold mb-1">Stock level trend</h3>
          <p className="text-xs text-muted-foreground mb-3">Last 14 days · aggregate units</p>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={stockTrend} margin={{ left: -20 }}>
              <defs><linearGradient id="inv" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#10B981" stopOpacity={0.4} /><stop offset="100%" stopColor="#10B981" stopOpacity={0} /></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="day" stroke="rgba(255,255,255,0.4)" fontSize={10} />
              <YAxis stroke="rgba(255,255,255,0.4)" fontSize={10} />
              <Tooltip contentStyle={{ background: "rgba(20,20,20,0.95)", border: "1px solid rgba(212,160,23,0.3)", borderRadius: 12, color: "#fff" }} />
              <Area type="monotone" dataKey="value" stroke="#10B981" strokeWidth={2.5} fill="url(#inv)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="glass-card rounded-2xl p-5">
          <h3 className="font-display font-bold mb-1">Waste by category (%)</h3>
          <p className="text-xs text-muted-foreground mb-3">This week</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={wasteByCat} margin={{ left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="cat" stroke="rgba(255,255,255,0.4)" fontSize={10} />
              <YAxis stroke="rgba(255,255,255,0.4)" fontSize={10} />
              <Tooltip cursor={{ fill: "rgba(212,160,23,0.08)" }} contentStyle={{ background: "rgba(20,20,20,0.95)", border: "1px solid rgba(212,160,23,0.3)", borderRadius: 12, color: "#fff" }} />
              <Bar dataKey="waste" fill="#EF4444" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
        {[
          { id: "stock", label: "Stock Items", icon: Package },
          { id: "suppliers", label: "Suppliers", icon: Truck },
          { id: "po", label: "Purchase Orders", icon: Boxes },
          { id: "waste", label: "Waste Log", icon: Trash2 },
          { id: "expiry", label: "Expiry Tracking", icon: Calendar },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id as any)}
            className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${tab === t.id ? "btn-gold" : "glass text-muted-foreground"}`}>
            <t.icon className="w-3.5 h-3.5" /> {t.label}
          </button>
        ))}
      </div>

      {/* Stock tab */}
      {tab === "stock" && (
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="p-3 flex items-center gap-2 border-b border-border/50 flex-wrap">
            <div className="relative flex-1 min-w-[180px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search items…" className="pl-10 h-9 bg-input/50" />
            </div>
            <Button size="sm" variant="outline" onClick={() => toast.success("Stock count sheet opened")}><Calendar className="w-3.5 h-3.5" /> Daily Count</Button>
            <Button size="sm" variant="outline" onClick={() => toast.success("Stock transfer initiated")}><ArrowRight className="w-3.5 h-3.5" /> Transfer</Button>
            <Button size="sm" className="btn-gold" onClick={() => toast.success("Stock receiving form opened")}><Plus className="w-3.5 h-3.5" /> Receive Stock</Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/30 text-xs text-muted-foreground">
                <tr>
                  <th className="text-left p-3 font-medium">Item</th>
                  <th className="text-left p-3 font-medium hidden sm:table-cell">Category</th>
                  <th className="text-left p-3 font-medium">Stock</th>
                  <th className="text-left p-3 font-medium hidden md:table-cell">Supplier</th>
                  <th className="text-right p-3 font-medium">Value</th>
                  <th className="text-right p-3 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.slice(0, 20).map(item => (
                  <tr key={item.id} className="border-t border-border/30 hover:bg-muted/20">
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{item.emoji}</span>
                        <div>
                          <div className="font-medium text-xs">{item.name}</div>
                          <div className="text-[10px] text-muted-foreground">{item.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 hidden sm:table-cell text-xs text-muted-foreground">{item.category}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <span className={`font-semibold ${item.stock < item.reorder ? "text-amber-400" : "text-foreground"}`}>{item.stock}</span>
                        <span className="text-[10px] text-muted-foreground">{item.unit}</span>
                        {item.stock < item.reorder && <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-amber-500/20 text-amber-400">LOW</span>}
                      </div>
                    </td>
                    <td className="p-3 hidden md:table-cell text-xs text-muted-foreground">{item.supplier}</td>
                    <td className="p-3 text-right font-semibold text-[var(--gold)]">{formatNaira(item.price * item.stock)}</td>
                    <td className="p-3 text-right">
                      <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => toast.success(`Reorder initiated for ${item.name}`)}>Reorder</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Suppliers tab */}
      {tab === "suppliers" && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {suppliers.map((s, i) => (
            <motion.div key={s.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i * 0.03, 0.3) }}
              className="glass-card rounded-2xl p-4 card-hover">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-sm">{s.name}</h3>
                  <p className="text-[10px] text-muted-foreground">{s.category}</p>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${s.status === "active" ? "bg-emerald-500/20 text-emerald-400" : "bg-muted text-muted-foreground"}`}>{s.status.toUpperCase()}</span>
              </div>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between"><span className="text-muted-foreground">Contact</span><span>{s.contact}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Total orders</span><span>{s.totalOrders}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Total spent</span><span className="font-semibold">{formatNaira(s.totalSpent)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Outstanding</span><span className={s.outstanding > 0 ? "text-amber-400 font-semibold" : ""}>{formatNaira(s.outstanding)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Lead time</span><span>{s.leadTime} days</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Rating</span><span className="text-[var(--gold)]">★ {s.rating}</span></div>
              </div>
              <Button size="sm" variant="outline" className="w-full mt-3 text-xs" onClick={() => toast.success(`Purchase order started with ${s.name}`)}>
                <Plus className="w-3 h-3" /> Create PO
              </Button>
            </motion.div>
          ))}
        </div>
      )}

      {/* Purchase orders */}
      {tab === "po" && (
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="p-3 flex items-center justify-between border-b border-border/50">
            <h3 className="font-semibold text-sm">Purchase Orders</h3>
            <Button size="sm" className="btn-gold" onClick={() => toast.success("New PO created")}><Plus className="w-3.5 h-3.5" /> New PO</Button>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-muted/30 text-xs text-muted-foreground">
              <tr>
                <th className="text-left p-3 font-medium">PO #</th>
                <th className="text-left p-3 font-medium hidden sm:table-cell">Supplier</th>
                <th className="text-left p-3 font-medium">Items</th>
                <th className="text-right p-3 font-medium">Total</th>
                <th className="text-left p-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 8 }).map((_, i) => {
                const s = suppliers[i % suppliers.length];
                const statuses = ["pending", "approved", "delivered", "partial"];
                const status = statuses[i % 4];
                return (
                  <tr key={i} className="border-t border-border/30 hover:bg-muted/20">
                    <td className="p-3 font-medium">PO-{String(1024 + i)}</td>
                    <td className="p-3 hidden sm:table-cell text-xs text-muted-foreground">{s.name}</td>
                    <td className="p-3 text-xs">{Math.floor(Math.random() * 8) + 2} items</td>
                    <td className="p-3 text-right font-semibold text-[var(--gold)]">{formatNaira(Math.floor(Math.random() * 800_000) + 80_000)}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${status === "delivered" ? "bg-emerald-500/20 text-emerald-400" : status === "approved" ? "bg-sky-500/20 text-sky-400" : status === "partial" ? "bg-amber-500/20 text-amber-400" : "bg-muted text-muted-foreground"}`}>{status.toUpperCase()}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Waste log */}
      {tab === "waste" && (
        <div className="glass-card rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-display font-bold">Waste log</h3>
              <p className="text-xs text-muted-foreground">Total waste value this week: {formatNaira(184_500)}</p>
            </div>
            <Button size="sm" className="btn-gold" onClick={() => toast.success("Waste entry form opened")}><Plus className="w-3.5 h-3.5" /> Log waste</Button>
          </div>
          <div className="space-y-2">
            {meals.slice(0, 8).map((m, i) => (
              <div key={m.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                <span className="text-xl">{m.emoji}</span>
                <div className="flex-1">
                  <div className="text-sm font-semibold">{m.name}</div>
                  <div className="text-xs text-muted-foreground">{Math.floor(Math.random() * 5) + 1} units · {["Burnt", "Expired", "Dropped", "Spoiled", "Over-prepped"][i % 5]}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-red-400">-{formatNaira(m.price * (Math.floor(Math.random() * 3) + 1))}</div>
                  <div className="text-[10px] text-muted-foreground">{i + 1} day{i === 0 ? "" : "s"} ago</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Expiry */}
      {tab === "expiry" && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {expiringSoon.map((m, i) => (
            <motion.div key={m.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className={`glass-card rounded-2xl p-4 ${i < 2 ? "border-red-500/30" : "border-amber-500/30"}`}>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{m.emoji}</span>
                <div className="flex-1">
                  <div className="font-semibold text-sm">{m.name}</div>
                  <div className="text-[10px] text-muted-foreground">{m.stock} units in stock</div>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${i < 2 ? "bg-red-500/20 text-red-400" : "bg-amber-500/20 text-amber-400"}`}>
                  {i < 2 ? "EXPIRES SOON" : "WATCH"}
                </span>
              </div>
              <div className="text-xs text-muted-foreground mb-2">Expires in <span className={`font-bold ${i < 2 ? "text-red-400" : "text-amber-400"}`}>{i + 2} days</span></div>
              <div className="flex gap-1.5">
                <Button size="sm" variant="outline" className="flex-1 text-xs" onClick={() => toast.success("Marked for discount")}>Discount</Button>
                <Button size="sm" variant="outline" className="flex-1 text-xs" onClick={() => toast.success("Marked for donation")}>Donate</Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

function KPI({ title, value, sub, icon: Icon, accent, warning }: { title: string; value: string; sub: string; icon: any; accent: string; warning?: boolean }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      className={`glass-card rounded-2xl p-4 bg-gradient-to-br ${accent} to-transparent`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] text-muted-foreground uppercase tracking-wide">{title}</span>
        <Icon className={`w-4 h-4 ${warning ? "text-amber-400" : "text-[var(--gold)]"}`} />
      </div>
      <div className="font-display font-bold text-xl sm:text-2xl mb-0.5">{value}</div>
      <div className="text-[10px] text-muted-foreground">{sub}</div>
    </motion.div>
  );
}
