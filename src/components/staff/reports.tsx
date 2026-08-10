"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, DollarSign, ShoppingBag, Utensils, Trash2, Users, MessageSquare, Crown, Star, ArrowDownRight, ArrowUpRight, Award } from "lucide-react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area, RadialBarChart, RadialBar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import { meals, branches, employees, orders, formatNaira } from "@/lib/data";

const COLORS = ["var(--gold-deep)", "var(--success)", "var(--warning)", "var(--error)", "var(--chart-5)", "var(--chart-3)"];

const dailySales = Array.from({ length: 30 }, (_, i) => ({
  day: `${i + 1}`,
  sales: Math.floor(1_400_000 + Math.sin(i / 4) * 400_000 + Math.random() * 300_000),
  orders: Math.floor(120 + Math.sin(i / 4) * 30 + Math.random() * 20),
}));

const monthlyPnL = [
  { month: "Jan", revenue: 42.5, cost: 28.2, profit: 14.3 },
  { month: "Feb", revenue: 45.8, cost: 29.8, profit: 16.0 },
  { month: "Mar", revenue: 51.2, cost: 32.4, profit: 18.8 },
  { month: "Apr", revenue: 48.6, cost: 31.0, profit: 17.6 },
  { month: "May", revenue: 53.9, cost: 33.8, profit: 20.1 },
  { month: "Jun", revenue: 58.2, cost: 35.9, profit: 22.3 },
  { month: "Jul", revenue: 62.4, cost: 38.1, profit: 24.3 },
];

const complaintTypes = [
  { name: "Late delivery", value: 38, color: "var(--error)" },
  { name: "Cold food", value: 24, color: "var(--warning)" },
  { name: "Wrong order", value: 18, color: "var(--chart-5)" },
  { name: "Rude staff", value: 12, color: "var(--chart-3)" },
  { name: "Other", value: 8, color: "var(--muted-foreground)" },
];

export function ReportsDashboard() {
  const [tab, setTab] = useState<"daily" | "weekly" | "monthly">("daily");

  const topSellers = [...meals].sort((a, b) => b.sold - a.sold).slice(0, 8);
  const slowMovers = [...meals].sort((a, b) => a.sold - b.sold).slice(0, 5);

  return (
    <div className="space-y-5">
      {/* Period tabs */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex gap-1.5">
          {(["daily", "weekly", "monthly"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all ${tab === t ? "btn-gold" : "glass text-muted-foreground"}`}>
              {t} Report
            </button>
          ))}
        </div>
        <div className="text-xs text-muted-foreground">
          {new Date().toLocaleDateString("en-NG", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
        </div>
      </div>

      {/* Daily */}
      {tab === "daily" && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
          {/* KPIs */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <Stat icon={DollarSign} label="Sales" value={formatNaira(1_845_000)} change="+12.4%" up accent="from-amber-500/20" />
            <Stat icon={ShoppingBag} label="Orders" value="187" change="+8.2%" up accent="from-emerald-500/20" />
            <Stat icon={Utensils} label="Food Cost" value="28.4%" change="-1.2%" up accent="from-cyan-500/20" />
            <Stat icon={Trash2} label="Waste" value="3.2%" change="-0.4%" up accent="from-violet-500/20" />
          </div>

          {/* Sales + Orders trend */}
          <div className="grid lg:grid-cols-2 gap-4">
            <ChartCard title="Sales trend" subtitle="Last 30 days · ₦">
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={dailySales} margin={{ left: -10 }}>
                  <defs><linearGradient id="sales" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--gold-deep)" stopOpacity={0.4} /><stop offset="100%" stopColor="var(--gold-deep)" stopOpacity={0} /></linearGradient></defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="day" stroke="rgba(255,255,255,0.4)" fontSize={10} />
                  <YAxis stroke="rgba(255,255,255,0.4)" fontSize={10} tickFormatter={(v) => `${(v / 1_000_000).toFixed(1)}M`} />
                  <Tooltip contentStyle={{ background: "rgba(13,13,13,0.95)", border: "1px solid rgba(232,184,74,0.2)", borderRadius: 12, color: "#ECECEC" }} formatter={(v: any) => formatNaira(v)} />
                  <Area type="monotone" dataKey="sales" stroke="var(--gold-deep)" strokeWidth={2.5} fill="url(#sales)" />
                </AreaChart>
              </ResponsiveContainer>
            </ChartCard>
            <ChartCard title="Orders volume" subtitle="Last 30 days">
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={dailySales} margin={{ left: -10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="day" stroke="rgba(255,255,255,0.4)" fontSize={10} />
                  <YAxis stroke="rgba(255,255,255,0.4)" fontSize={10} />
                  <Tooltip cursor={{ fill: "rgba(232,184,74,0.06)" }} contentStyle={{ background: "rgba(13,13,13,0.95)", border: "1px solid rgba(232,184,74,0.2)", borderRadius: 12, color: "#ECECEC" }} />
                  <Bar dataKey="orders" fill="var(--success)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          {/* Complaints + Labour */}
          <div className="grid lg:grid-cols-2 gap-4">
            <ChartCard title="Complaints breakdown" subtitle="This week · 87 total">
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={complaintTypes} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={3}>
                    {complaintTypes.map((e, i) => <Cell key={i} fill={e.color} stroke="none" />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: "rgba(13,13,13,0.95)", border: "1px solid rgba(232,184,74,0.2)", borderRadius: 12, color: "#ECECEC" }} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>
            <ChartCard title="Labour cost analysis" subtitle="By department · today">
              <div className="space-y-3 pt-2">
                {[
                  { dept: "Kitchen", cost: 82_000, target: 95_000 },
                  { dept: "Front of House", cost: 61_000, target: 70_000 },
                  { dept: "Management", cost: 108_000, target: 110_000 },
                  { dept: "Delivery", cost: 33_000, target: 40_000 },
                  { dept: "Finance & HR", cost: 62_000, target: 65_000 },
                ].map(d => {
                  const pct = (d.cost / d.target) * 100;
                  return (
                    <div key={d.dept}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-muted-foreground">{d.dept}</span>
                        <span className="font-semibold">{formatNaira(d.cost)} <span className="text-muted-foreground text-[10px]">/ {formatNaira(d.target)}</span></span>
                      </div>
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.6 }}
                          className={`h-full ${pct > 95 ? "bg-red-500" : pct > 80 ? "bg-amber-500" : "bg-emerald-500"}`} />
                      </div>
                    </div>
                  );
                })}
                <div className="pt-3 border-t border-border/50 flex justify-between text-sm">
                  <span className="text-muted-foreground">Total labour · 22.1% of sales</span>
                  <span className="font-bold text-gold-gradient">{formatNaira(346_000)}</span>
                </div>
              </div>
            </ChartCard>
          </div>

          {/* Manager report */}
          <div className="glass-card rounded-2xl p-5">
            <h3 className="font-display font-bold mb-3 flex items-center gap-2"><Crown className="w-4 h-4 text-[var(--gold)]" /> Manager's daily report</h3>
            <div className="grid sm:grid-cols-2 gap-3 text-sm">
              {[
                { label: "Opening cash", value: formatNaira(50_000) },
                { label: "Closing cash", value: formatNaira(230_000) },
                { label: "Cash sales", value: formatNaira(184_500) },
                { label: "Card sales", value: formatNaira(1_422_000) },
                { label: "Refunds", value: formatNaira(4_500), neg: true },
                { label: "Discounts", value: formatNaira(28_500), neg: true },
                { label: "Complimentary", value: formatNaira(12_000), neg: true },
                { label: "Net revenue", value: formatNaira(1_561_500), highlight: true },
              ].map(r => (
                <div key={r.label} className="flex justify-between p-2.5 rounded-lg bg-muted/30">
                  <span className="text-muted-foreground">{r.label}</span>
                  <span className={`font-semibold ${r.highlight ? "text-gold-gradient" : r.neg ? "text-red-400" : ""}`}>{r.neg ? "-" : ""}{r.value}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Weekly */}
      {tab === "weekly" && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
          {/* Branch + staff ranking */}
          <div className="grid lg:grid-cols-2 gap-4">
            <div className="glass-card rounded-2xl p-5">
              <h3 className="font-display font-bold mb-3 flex items-center gap-2"><Award className="w-4 h-4 text-[var(--gold)]" /> Branch ranking · this week</h3>
              <div className="space-y-3">
                {[...branches].sort((a, b) => b.revenueToday * 7 - a.revenueToday * 7).map((b, i) => (
                  <div key={b.id}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="flex items-center gap-2">
                        <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold ${i === 0 ? "bg-gold-gradient text-black" : "bg-muted"}`}>{i + 1}</span>
                        {b.name.replace("SpagKing ", "")}
                      </span>
                      <span className="font-bold text-[var(--gold)]">{formatNaira(b.revenueToday * 7)}</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden ml-8">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${80 - i * 18}%` }} transition={{ duration: 0.6 }}
                        className="h-full bg-gold-gradient" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="glass-card rounded-2xl p-5">
              <h3 className="font-display font-bold mb-3 flex items-center gap-2"><Star className="w-4 h-4 text-[var(--gold)]" /> Staff ranking · top performers</h3>
              <div className="space-y-2">
                {[...employees].sort((a, b) => b.performance - a.performance).slice(0, 6).map((e, i) => (
                  <div key={e.id} className="flex items-center gap-3">
                    <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold ${i === 0 ? "bg-gold-gradient text-black" : "bg-muted"}`}>{i + 1}</span>
                    <img src={e.avatar} alt={e.name} className="w-8 h-8 rounded-lg bg-muted" />
                    <div className="flex-1">
                      <div className="text-sm font-semibold">{e.name}</div>
                      <div className="text-[10px] text-muted-foreground">{e.role}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-[var(--gold)]">{e.performance}%</div>
                      <div className="text-[10px] text-muted-foreground">{e.rating}★</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Best sellers + slow movers */}
          <div className="grid lg:grid-cols-2 gap-4">
            <div className="glass-card rounded-2xl p-5">
              <h3 className="font-display font-bold mb-3 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-emerald-400" /> Best sellers</h3>
              <div className="space-y-2">
                {topSellers.map((m, i) => (
                  <div key={m.id} className="flex items-center gap-3">
                    <span className="text-lg">{m.emoji}</span>
                    <div className="flex-1">
                      <div className="text-xs font-semibold">{m.name}</div>
                      <div className="text-[10px] text-muted-foreground">{m.sold.toLocaleString()} sold</div>
                    </div>
                    <span className="text-sm font-bold text-emerald-400">{formatNaira(m.sold * m.price)}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="glass-card rounded-2xl p-5">
              <h3 className="font-display font-bold mb-3 flex items-center gap-2"><ArrowDownRight className="w-4 h-4 text-red-400" /> Slow moving items</h3>
              <div className="space-y-2">
                {slowMovers.map((m, i) => (
                  <div key={m.id} className="flex items-center gap-3">
                    <span className="text-lg">{m.emoji}</span>
                    <div className="flex-1">
                      <div className="text-xs font-semibold">{m.name}</div>
                      <div className="text-[10px] text-muted-foreground">{m.sold} sold · {m.stock} in stock</div>
                    </div>
                    <button className="text-[10px] text-[var(--gold)] font-medium hover:underline" onClick={() => {}}>Promote</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Monthly */}
      {tab === "monthly" && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
          {/* P&L */}
          <ChartCard title="Profit & Loss · 7 month trend" subtitle="₦ millions · revenue vs cost vs profit">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={monthlyPnL} margin={{ left: -10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="month" stroke="rgba(255,255,255,0.4)" fontSize={11} />
                <YAxis stroke="rgba(255,255,255,0.4)" fontSize={11} />
                <Tooltip contentStyle={{ background: "rgba(13,13,13,0.95)", border: "1px solid rgba(232,184,74,0.2)", borderRadius: 12, color: "#ECECEC" }} formatter={(v: any) => `₦${v}M`} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="revenue" fill="var(--gold-deep)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="cost" fill="var(--error)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="profit" fill="var(--success)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <div className="grid lg:grid-cols-2 gap-4">
            {/* Inventory variance */}
            <div className="glass-card rounded-2xl p-5">
              <h3 className="font-display font-bold mb-3">Inventory variance</h3>
              <div className="space-y-2 text-xs">
                {["Spaghetti", "Rice", "Chicken", "Beef", "Vegetable Oil", "Tomatoes"].map((item, i) => {
                  const variance = [2.1, -1.4, 3.2, -0.8, 1.5, -2.3][i];
                  return (
                    <div key={item} className="flex items-center justify-between p-2.5 rounded-lg bg-muted/30">
                      <span>{item}</span>
                      <span className={`font-bold ${variance > 0 ? "text-red-400" : "text-emerald-400"}`}>
                        {variance > 0 ? "+" : ""}{variance}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Customer growth */}
            <div className="glass-card rounded-2xl p-5">
              <h3 className="font-display font-bold mb-3">Customer growth</h3>
              <ResponsiveContainer width="100%" height={180}>
                <AreaChart data={Array.from({ length: 7 }, (_, i) => ({ m: monthlyPnL[i].month, customers: 180 + i * 22 + Math.floor(Math.random() * 10) }))} margin={{ left: -20 }}>
                  <defs><linearGradient id="cg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--success)" stopOpacity={0.4} /><stop offset="100%" stopColor="var(--success)" stopOpacity={0} /></linearGradient></defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="m" stroke="rgba(255,255,255,0.4)" fontSize={11} />
                  <YAxis stroke="rgba(255,255,255,0.4)" fontSize={11} />
                  <Tooltip contentStyle={{ background: "rgba(13,13,13,0.95)", border: "1px solid rgba(232,184,74,0.2)", borderRadius: 12, color: "#ECECEC" }} />
                  <Area type="monotone" dataKey="customers" stroke="var(--success)" strokeWidth={2.5} fill="url(#cg)" />
                </AreaChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-3 gap-2 mt-3 text-center">
                <div><div className="font-bold text-lg">312</div><div className="text-[10px] text-muted-foreground">New this month</div></div>
                <div><div className="font-bold text-lg text-emerald-400">68%</div><div className="text-[10px] text-muted-foreground">Repeat rate</div></div>
                <div><div className="font-bold text-lg text-[var(--gold)]">47</div><div className="text-[10px] text-muted-foreground">VIPs</div></div>
              </div>
            </div>
          </div>

          {/* Staff performance radial */}
          <div className="glass-card rounded-2xl p-5">
            <h3 className="font-display font-bold mb-3">Department performance radar</h3>
            <ResponsiveContainer width="100%" height={260}>
              <RadialBarChart innerRadius="20%" outerRadius="100%" data={[
                { name: "Kitchen", value: 88, fill: "var(--gold-deep)" },
                { name: "Front of House", value: 92, fill: "var(--success)" },
                { name: "Delivery", value: 76, fill: "var(--chart-3)" },
                { name: "Management", value: 85, fill: "var(--chart-5)" },
                { name: "Inventory", value: 71, fill: "var(--warning)" },
              ]}>
                <RadialBar dataKey="value" background={{ fill: "rgba(255,255,255,0.04)" }} cornerRadius={8} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} layout="vertical" verticalAlign="middle" align="right" />
                <Tooltip contentStyle={{ background: "rgba(13,13,13,0.95)", border: "1px solid rgba(232,184,74,0.2)", borderRadius: 12, color: "#ECECEC" }} />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      )}
    </div>
  );
}

function Stat({ icon: Icon, label, value, change, up, accent }: { icon: any; label: string; value: string; change: string; up: boolean; accent: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      className={`glass-card rounded-2xl p-4 bg-gradient-to-br ${accent} to-transparent`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] text-muted-foreground uppercase tracking-wide">{label}</span>
        <Icon className="w-4 h-4 text-[var(--gold)]" />
      </div>
      <div className="font-display font-bold text-xl sm:text-2xl mb-0.5">{value}</div>
      <div className={`text-[11px] inline-flex items-center gap-0.5 ${up ? "text-emerald-400" : "text-red-400"}`}>
        {up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />} {change}
      </div>
    </motion.div>
  );
}

function ChartCard({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="glass-card rounded-2xl p-5">
      <h3 className="font-display font-bold">{title}</h3>
      <p className="text-xs text-muted-foreground mb-3">{subtitle}</p>
      {children}
    </div>
  );
}
