"use client";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, DollarSign, ShoppingBag, Users, Star, AlertTriangle, Crown, Activity, ArrowUpRight, Flame } from "lucide-react";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import { branches, meals, orders, formatNaira } from "@/lib/data";
import { useStore } from "@/lib/store";

const COLORS = ["#D4A017", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#06B6D4"];

const salesTrend = [
  { day: "Mon", today: 1.84, yesterday: 1.62 },
  { day: "Tue", today: 2.05, yesterday: 1.78 },
  { day: "Wed", today: 1.92, yesterday: 1.85 },
  { day: "Thu", today: 2.18, yesterday: 1.95 },
  { day: "Fri", today: 2.45, yesterday: 2.10 },
  { day: "Sat", today: 2.78, yesterday: 2.35 },
  { day: "Sun", today: 2.32, yesterday: 2.05 },
];

const categorySplit = [
  { name: "Spaghetti", value: 35, color: "#D4A017" },
  { name: "Rice", value: 22, color: "#10B981" },
  { name: "Shawarma", value: 15, color: "#F59E0B" },
  { name: "Burgers", value: 12, color: "#EF4444" },
  { name: "Drinks", value: 9, color: "#8B5CF6" },
  { name: "Others", value: 7, color: "#06B6D4" },
];

const hourlyOrders = Array.from({ length: 12 }, (_, i) => ({
  hour: `${i + 9}h`,
  orders: Math.floor(20 + Math.sin(i / 2) * 30 + Math.random() * 25),
}));

export function ExecutiveDashboard() {
  const topMeals = [...meals].sort((a, b) => b.sold - a.sold).slice(0, 5);
  const lowStock = meals.filter(m => m.stock < 20).slice(0, 5);
  const recentActivities = [
    { icon: ShoppingBag, color: "text-blue-400 bg-blue-500/15", text: "New order SK48291 placed", time: "2 min ago" },
    { icon: Users, color: "text-emerald-400 bg-emerald-500/15", text: "Folake Adeyemi clocked in at VI branch", time: "12 min ago" },
    { icon: AlertTriangle, color: "text-amber-400 bg-amber-500/15", text: "Mushroom Truffle Spag is below reorder level", time: "28 min ago" },
    { icon: Crown, color: "text-[var(--gold)] bg-[var(--gold)]/15", text: "Customer Adaobi N. reached Platinum tier", time: "1 hour ago" },
    { icon: TrendingUp, color: "text-emerald-400 bg-emerald-500/15", text: "Daily sales target hit (102%)", time: "2 hours ago" },
    { icon: Star, color: "text-[var(--gold)] bg-[var(--gold)]/15", text: "New 5★ review from Tunde A.", time: "3 hours ago" },
  ];

  return (
    <div className="space-y-5">
      {/* Hero KPI row — Bloomberg meets Apple */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KPICard title="Today's Sales" value={formatNaira(1_845_000)} change="+12.4%" up icon={DollarSign} accent="from-[var(--gold)]/15" />
        <KPICard title="Orders Today" value="187" change="+8.2%" up icon={ShoppingBag} accent="from-[var(--success)]/15" />
        <KPICard title="Avg Order Value" value={formatNaira(9_866)} change="+3.8%" up icon={TrendingUp} accent="from-[#60A5FA]/15" />
        <KPICard title="Satisfaction" value="4.8★" change="+0.2" up icon={Star} accent="from-[#A78BFA]/15" />
      </div>

      {/* Yesterday vs Today chart */}
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 glass-card rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-display font-semibold tracking-tight">Revenue · Yesterday vs Today</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Last 7 days · ₦ millions</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[var(--gold)]" /> Today</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-muted-foreground/50" /> Yesterday</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={salesTrend} margin={{ left: -20, right: 5, top: 5 }}>
              <defs>
                <linearGradient id="gold" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#E8B84A" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#E8B84A" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gray" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6b7280" stopOpacity={0.22} />
                  <stop offset="100%" stopColor="#6b7280" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(245,239,230,0.05)" />
              <XAxis dataKey="day" stroke="rgba(245,239,230,0.4)" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="rgba(245,239,230,0.4)" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: "rgba(28,24,20,0.96)", border: "1px solid rgba(232,184,74,0.25)", borderRadius: 12, color: "#F5EFE6", fontSize: 12 }} />
              <Area type="monotone" dataKey="yesterday" stroke="#6b7280" strokeWidth={2} fill="url(#gray)" />
              <Area type="monotone" dataKey="today" stroke="#E8B84A" strokeWidth={2.5} fill="url(#gold)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Category split */}
        <div className="glass-card rounded-2xl p-5">
          <h3 className="font-display font-bold mb-1">Sales by category</h3>
          <p className="text-xs text-muted-foreground mb-2">Today's distribution</p>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={categorySplit} dataKey="value" nameKey="name" innerRadius={45} outerRadius={75} paddingAngle={3}>
                {categorySplit.map((e, i) => <Cell key={i} fill={e.color} stroke="none" />)}
              </Pie>
              <Tooltip contentStyle={{ background: "rgba(20,20,20,0.95)", border: "1px solid rgba(212,160,23,0.3)", borderRadius: 12, color: "#fff" }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-1.5 mt-2">
            {categorySplit.map(c => (
              <div key={c.name} className="flex items-center gap-1.5 text-[11px]">
                <span className="w-2 h-2 rounded-full" style={{ background: c.color }} /> {c.name} <span className="text-muted-foreground ml-auto">{c.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Hourly orders + cost metrics */}
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 glass-card rounded-2xl p-5">
          <h3 className="font-display font-bold mb-1">Hourly order volume</h3>
          <p className="text-xs text-muted-foreground mb-2">Today · 9am – 9pm</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={hourlyOrders} margin={{ left: -20, right: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="hour" stroke="rgba(255,255,255,0.4)" fontSize={11} />
              <YAxis stroke="rgba(255,255,255,0.4)" fontSize={11} />
              <Tooltip cursor={{ fill: "rgba(212,160,23,0.08)" }} contentStyle={{ background: "rgba(20,20,20,0.95)", border: "1px solid rgba(212,160,23,0.3)", borderRadius: 12, color: "#fff" }} />
              <Bar dataKey="orders" fill="#D4A017" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card rounded-2xl p-5 space-y-3">
          <h3 className="font-display font-bold">Cost metrics</h3>
          <CostBar label="Food Cost %" value={28.4} target={30} color="#D4A017" />
          <CostBar label="Labour Cost %" value={22.1} target={25} color="#10B981" />
          <CostBar label="Overhead %" value={11.8} target={15} color="#8B5CF6" />
          <CostBar label="Waste %" value={3.2} target={5} color="#EF4444" />
          <div className="pt-2 border-t border-border/50 flex justify-between text-sm">
            <span className="text-muted-foreground">Net Profit Margin</span>
            <span className="font-bold text-emerald-400">34.5%</span>
          </div>
        </div>
      </div>

      {/* Top meals + branch ranking */}
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="glass-card rounded-2xl p-5">
          <h3 className="font-display font-bold mb-3 flex items-center gap-2"><Crown className="w-4 h-4 text-[var(--gold)]" /> Top selling meals</h3>
          <div className="space-y-2.5">
            {topMeals.map((m, i) => (
              <motion.div key={m.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                className="flex items-center gap-3">
                <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${i === 0 ? "bg-gold-gradient text-black" : "bg-muted text-muted-foreground"}`}>{i + 1}</span>
                <span className="text-xl">{m.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold line-clamp-1">{m.name}</div>
                  <div className="text-[10px] text-muted-foreground">{m.sold.toLocaleString()} sold · {formatNaira(m.price)}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-[var(--gold)]">{formatNaira(m.sold * m.price)}</div>
                  <div className="text-[10px] text-emerald-400 inline-flex items-center gap-0.5"><TrendingUp className="w-2.5 h-2.5" /> +{Math.floor(Math.random() * 20) + 5}%</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5">
          <h3 className="font-display font-bold mb-3">Branch ranking</h3>
          <div className="space-y-2.5">
            {[...branches].sort((a, b) => b.revenueToday - a.revenueToday).map((b, i) => {
              const max = Math.max(...branches.map(x => x.revenueToday));
              return (
                <motion.div key={b.id} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                  className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <span className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold ${i === 0 ? "bg-gold-gradient text-black" : "bg-muted"}`}>{i + 1}</span>
                      <span className="font-medium line-clamp-1">{b.name.replace("SpagKing ", "")}</span>
                    </span>
                    <span className="font-bold text-[var(--gold)]">{formatNaira(b.revenueToday)}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden ml-7">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${(b.revenueToday / max) * 100}%` }} transition={{ delay: 0.3 + i * 0.08, duration: 0.6 }}
                      className="h-full bg-gold-gradient" />
                  </div>
                  <div className="text-[10px] text-muted-foreground ml-7">{b.ordersToday} orders · {b.rating}★ · {b.city}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Low stock + recent activity */}
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="glass-card rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display font-bold flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-amber-400" /> Low stock alerts</h3>
            <span className="text-[10px] text-amber-400 font-semibold">{lowStock.length} items</span>
          </div>
          <div className="space-y-2">
            {lowStock.map(m => (
              <div key={m.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/40">
                <span className="text-lg">{m.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold line-clamp-1">{m.name}</div>
                  <div className="flex items-center gap-2">
                    <div className="h-1 w-20 rounded-full bg-muted overflow-hidden">
                      <div className="h-full bg-amber-500" style={{ width: `${Math.min(100, m.stock * 5)}%` }} />
                    </div>
                    <span className="text-[10px] text-amber-400">{m.stock} units left</span>
                  </div>
                </div>
                <span className="text-[10px] text-[var(--gold)] font-medium hover:underline cursor-pointer">Reorder</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5">
          <h3 className="font-display font-bold mb-3 flex items-center gap-2"><Activity className="w-4 h-4 text-[var(--gold)]" /> Recent activity</h3>
          <div className="space-y-3 max-h-72 overflow-y-auto">
            {recentActivities.map((a, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${a.color}`}>
                  <a.icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs">{a.text}</div>
                  <div className="text-[10px] text-muted-foreground">{a.time}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function KPICard({ title, value, change, up, icon: Icon, accent }: { title: string; value: string; change: string; up: boolean; icon: any; accent: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ ease: [0.22, 1, 0.36, 1] }}
      className="glass-card rounded-2xl p-5 relative overflow-hidden card-hover">
      <div className={`absolute inset-0 bg-gradient-to-br ${accent} to-transparent opacity-60`} />
      <div className="relative">
        <div className="flex items-start justify-between mb-3">
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">{title}</span>
          <div className="w-8 h-8 rounded-lg bg-foreground/[0.06] border border-border/50 flex items-center justify-center">
            <Icon className="w-4 h-4 text-[var(--gold)]" />
          </div>
        </div>
        <div className="font-display font-semibold text-2xl tracking-tight num mb-1">{value}</div>
        <div className={`text-[11px] inline-flex items-center gap-1 ${up ? "text-[var(--success)]" : "text-[var(--error)]"}`}>
          {up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />} <span className="font-medium">{change}</span> <span className="text-muted-foreground">vs yesterday</span>
        </div>
      </div>
    </motion.div>
  );
}

function CostBar({ label, value, target, color }: { label: string; value: number; target: number; color: string }) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-semibold" style={{ color }}>{value}% <span className="text-muted-foreground text-[10px]">/ {target}%</span></span>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <motion.div initial={{ width: 0 }} animate={{ width: `${(value / target) * 100}%` }} transition={{ duration: 0.8, delay: 0.2 }}
          className="h-full rounded-full" style={{ background: color }} />
      </div>
    </div>
  );
}
