"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, Crown, Star, Mail, MessageCircle, Smartphone, Cake, Plus, Search, TrendingUp, Users, Sparkles, Filter } from "lucide-react";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { customers, formatNaira } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const COLORS = ["var(--gold-deep)", "var(--success)", "var(--warning)", "var(--error)"];

const segmentSplit = [
  { name: "VIP", value: 47, color: "var(--gold-deep)" },
  { name: "Regular", value: 142, color: "var(--success)" },
  { name: "At-Risk", value: 38, color: "var(--error)" },
  { name: "New", value: 23, color: "var(--chart-3)" },
];

const campaignPerf = [
  { name: "Email", sent: 4280, opened: 2680, clicked: 920 },
  { name: "SMS", sent: 3120, opened: 2840, clicked: 680 },
  { name: "WhatsApp", sent: 2540, opened: 2380, clicked: 890 },
];

export function CRMDashboard() {
  const [tab, setTab] = useState<"customers" | "campaigns" | "feedback" | "loyalty">("customers");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<typeof customers[0] | null>(null);

  const filtered = customers.filter(c => c.name.toLowerCase().includes(query.toLowerCase()) || c.email.toLowerCase().includes(query.toLowerCase()));
  const totalLoyalty = customers.reduce((s, c) => s + c.loyaltyPoints, 0);
  const birthdaysThisMonth = customers.filter(c => c.birthday.startsWith("08")).length;

  return (
    <div className="space-y-5">
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KPI title="Total Customers" value={customers.length.toString()} sub="+312 this month" icon={Users} accent="from-amber-500/20" />
        <KPI title="Loyalty Points" value={totalLoyalty.toLocaleString()} sub="in circulation" icon={Crown} accent="from-emerald-500/20" />
        <KPI title="Avg Satisfaction" value="4.7★" sub="+0.2 vs last month" icon={Star} accent="from-violet-500/20" />
        <KPI title="Birthdays" value={birthdaysThisMonth.toString()} sub="this month — send offers" icon={Cake} accent="from-pink-500/20" />
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="glass-card rounded-2xl p-5">
          <h3 className="font-display font-bold mb-1">Customer segments</h3>
          <p className="text-xs text-muted-foreground mb-2">250 total</p>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={segmentSplit} dataKey="value" nameKey="name" innerRadius={45} outerRadius={75} paddingAngle={3}>
                {segmentSplit.map((e, i) => <Cell key={i} fill={e.color} stroke="none" />)}
              </Pie>
              <Tooltip contentStyle={{ background: "rgba(13,13,13,0.95)", border: "1px solid rgba(232,184,74,0.2)", borderRadius: 12, color: "#ECECEC" }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-1.5 mt-2">
            {segmentSplit.map(s => (
              <div key={s.name} className="flex items-center gap-1.5 text-[11px]">
                <span className="w-2 h-2 rounded-full" style={{ background: s.color }} /> {s.name} <span className="text-muted-foreground ml-auto">{s.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5 lg:col-span-2">
          <h3 className="font-display font-bold mb-1">Campaign performance</h3>
          <p className="text-xs text-muted-foreground mb-3">Last 30 days · sent vs opened vs clicked</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={campaignPerf} margin={{ left: -10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="name" stroke="rgba(255,255,255,0.4)" fontSize={11} />
              <YAxis stroke="rgba(255,255,255,0.4)" fontSize={11} />
              <Tooltip cursor={{ fill: "rgba(232,184,74,0.06)" }} contentStyle={{ background: "rgba(13,13,13,0.95)", border: "1px solid rgba(232,184,74,0.2)", borderRadius: 12, color: "#ECECEC" }} />
              <Bar dataKey="sent" fill="var(--muted-foreground)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="opened" fill="var(--gold-deep)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="clicked" fill="var(--success)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
        {[
          { id: "customers", label: "Customer Profiles", icon: Users },
          { id: "campaigns", label: "Campaigns", icon: Sparkles },
          { id: "feedback", label: "Feedback", icon: MessageCircle },
          { id: "loyalty", label: "Loyalty & Rewards", icon: Crown },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id as any)}
            className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${tab === t.id ? "btn-gold" : "glass text-muted-foreground"}`}>
            <t.icon className="w-3.5 h-3.5" /> {t.label}
          </button>
        ))}
      </div>

      {/* Customers */}
      {tab === "customers" && (
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="p-3 flex items-center gap-2 border-b border-border/50">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search customers by name or email…" className="pl-10 h-9 bg-input/50" />
            </div>
            <Button size="sm" className="btn-gold" onClick={() => toast.success("New customer form opened")}><Plus className="w-3.5 h-3.5" /> Add</Button>
          </div>
          <div className="overflow-x-auto max-h-[60vh]">
            <table className="w-full text-sm">
              <thead className="bg-muted/30 text-xs text-muted-foreground sticky top-0">
                <tr>
                  <th className="text-left p-3 font-medium">Customer</th>
                  <th className="text-left p-3 font-medium hidden sm:table-cell">Tier</th>
                  <th className="text-left p-3 font-medium hidden md:table-cell">Segment</th>
                  <th className="text-right p-3 font-medium hidden sm:table-cell">Orders</th>
                  <th className="text-right p-3 font-medium">Spent</th>
                  <th className="text-left p-3 font-medium hidden lg:table-cell">Last order</th>
                </tr>
              </thead>
              <tbody>
                {filtered.slice(0, 20).map(c => (
                  <tr key={c.id} onClick={() => setSelected(c)} className="border-t border-border/30 hover:bg-muted/20 cursor-pointer">
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gold-gradient flex items-center justify-center text-black text-xs font-bold">{c.name.split(" ").map(n => n[0]).join("")}</div>
                        <div>
                          <div className="font-medium text-xs">{c.name}</div>
                          <div className="text-[10px] text-muted-foreground">{c.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 hidden sm:table-cell">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                        c.tier === "Platinum" ? "bg-violet-500/20 text-violet-300" :
                        c.tier === "Gold" ? "bg-amber-500/20 text-amber-300" :
                        c.tier === "Silver" ? "bg-slate-400/20 text-slate-300" : "bg-orange-700/20 text-orange-400"
                      }`}>{c.tier.toUpperCase()}</span>
                    </td>
                    <td className="p-3 hidden md:table-cell">
                      <span className={`text-[10px] font-semibold ${
                        c.segment === "VIP" ? "text-[var(--gold)]" :
                        c.segment === "At-Risk" ? "text-red-400" :
                        c.segment === "New" ? "text-cyan-400" : "text-emerald-400"
                      }`}>{c.segment}</span>
                    </td>
                    <td className="p-3 hidden sm:table-cell text-right text-xs">{c.orders}</td>
                    <td className="p-3 text-right text-xs font-semibold text-[var(--gold)]">{formatNaira(c.totalSpent)}</td>
                    <td className="p-3 hidden lg:table-cell text-[10px] text-muted-foreground">{c.lastOrder ? new Date(c.lastOrder).toLocaleDateString("en-NG", { day: "numeric", month: "short" }) : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Campaigns */}
      {tab === "campaigns" && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { type: "Email", icon: Mail, title: "August Weekend Special", sent: 1240, opened: 842, clicked: 312, status: "active", color: "text-sky-400" },
            { type: "WhatsApp", icon: MessageCircle, title: "Flash Sale — 25% off", sent: 856, opened: 812, clicked: 421, status: "active", color: "text-emerald-400" },
            { type: "SMS", icon: Smartphone, title: "Birthday surprise!", sent: 47, opened: 47, clicked: 28, status: "active", color: "text-amber-400" },
            { type: "Email", icon: Mail, title: "Win-back — we miss you", sent: 38, opened: 12, clicked: 3, status: "scheduled", color: "text-sky-400" },
            { type: "WhatsApp", icon: MessageCircle, title: "New menu alert", sent: 1240, opened: 1180, clicked: 456, status: "completed", color: "text-emerald-400" },
            { type: "SMS", icon: Smartphone, title: "Loyalty reward unlocked", sent: 47, opened: 47, clicked: 38, status: "completed", color: "text-amber-400" },
          ].map((c, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="glass-card rounded-2xl p-4">
              <div className="flex items-start justify-between mb-3">
                <div className={`w-9 h-9 rounded-lg bg-muted/50 flex items-center justify-center ${c.color}`}><c.icon className="w-4 h-4" /></div>
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${c.status === "active" ? "bg-emerald-500/20 text-emerald-400" : c.status === "scheduled" ? "bg-amber-500/20 text-amber-400" : "bg-muted text-muted-foreground"}`}>{c.status.toUpperCase()}</span>
              </div>
              <div className="text-[10px] text-muted-foreground uppercase">{c.type}</div>
              <h4 className="font-semibold text-sm mb-3 line-clamp-1">{c.title}</h4>
              <div className="grid grid-cols-3 gap-1.5 text-center">
                <div><div className="font-bold text-sm">{c.sent}</div><div className="text-[9px] text-muted-foreground">Sent</div></div>
                <div><div className="font-bold text-sm text-[var(--gold)]">{c.opened}</div><div className="text-[9px] text-muted-foreground">Opened</div></div>
                <div><div className="font-bold text-sm text-emerald-400">{c.clicked}</div><div className="text-[9px] text-muted-foreground">Clicked</div></div>
              </div>
            </motion.div>
          ))}
          <button onClick={() => toast.success("New campaign builder opened")}
            className="glass-card rounded-2xl p-4 flex flex-col items-center justify-center gap-2 border-dashed border-2 border-border/50 hover:border-[var(--gold)]/40 transition-colors min-h-[160px]">
            <Plus className="w-6 h-6 text-[var(--gold)]" />
            <span className="text-xs font-medium">New campaign</span>
          </button>
        </div>
      )}

      {/* Feedback */}
      {tab === "feedback" && (
        <div className="space-y-3">
          {[
            { name: "Adaobi Nwosu", rating: 5, comment: "Absolutely the best spaghetti in Lagos! The Royal Bolognese is unmatched. Service was excellent.", date: "2 hours ago", branch: "Victoria Island" },
            { name: "Tunde Adeleke", rating: 4, comment: "Food was great but delivery took 45 mins instead of 30. Still tasty though.", date: "5 hours ago", branch: "Wuse 2 Abuja" },
            { name: "Fatima Bello", rating: 5, comment: "The shawarma is to die for! Will definitely order again. Rider was polite too.", date: "1 day ago", branch: "Port Harcourt GRA" },
            { name: "Emeka Okafor", rating: 3, comment: "Jollof was a bit salty this time. Usually it's perfect. Hope they fix it.", date: "1 day ago", branch: "Victoria Island" },
            { name: "Grace Sani", rating: 5, comment: "Used the QR table ordering — so smooth! No waiting for waiter. Brilliant idea.", date: "2 days ago", branch: "Wuse 2 Abuja" },
          ].map((f, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
              className="glass-card rounded-2xl p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-lg bg-gold-gradient flex items-center justify-center text-black text-xs font-bold">{f.name.split(" ").map(n => n[0]).join("")}</div>
                  <div>
                    <div className="text-sm font-semibold">{f.name}</div>
                    <div className="text-[10px] text-muted-foreground">{f.branch} · {f.date}</div>
                  </div>
                </div>
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, j) => <Star key={j} className={`w-3.5 h-3.5 ${j < f.rating ? "text-[var(--gold)] fill-[var(--gold)]" : "text-muted-foreground/30"}`} />)}
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{f.comment}</p>
              <div className="flex gap-1.5 mt-3">
                <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => toast.success("Reply sent")}>Reply</Button>
                <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => toast.success("Marked as resolved")}>Resolve</Button>
                {f.rating <= 3 && <Button size="sm" variant="ghost" className="h-7 text-xs text-amber-400" onClick={() => toast.success("Escalated to manager")}>Escalate</Button>}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Loyalty */}
      {tab === "loyalty" && (
        <div className="grid lg:grid-cols-3 gap-4">
          {[
            { tier: "Bronze", color: "from-orange-700 to-amber-900", members: 98, perks: ["5% off birthdays", "1 pt per ₦100", "Early access to flash sales"], icon: "🥉" },
            { tier: "Silver", color: "from-slate-400 to-slate-600", members: 62, perks: ["10% off birthdays", "1.5 pts per ₦100", "Free delivery Mondays", "Priority support"], icon: "🥈" },
            { tier: "Gold", color: "from-amber-400 to-yellow-600", members: 43, perks: ["15% off birthdays", "2 pts per ₦100", "Free delivery always", "Skip-the-queue", "Exclusive tastings"], icon: "🥇" },
            { tier: "Platinum", color: "from-violet-400 to-purple-600", members: 47, perks: ["25% off birthdays", "3 pts per ₦100", "Free delivery + concierge", "Personal chef events", "Annual gift", "Branch access"], icon: "💎" },
          ].map((t, i) => (
            <motion.div key={t.tier} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className={`glass-card rounded-2xl p-5 relative overflow-hidden bg-gradient-to-br ${t.color}`}>
              <div className="absolute inset-0 bg-black/40" />
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-4xl">{t.icon}</div>
                  <div className="text-right">
                    <div className="font-display font-bold text-2xl">{t.members}</div>
                    <div className="text-[10px] opacity-80">members</div>
                  </div>
                </div>
                <h3 className="font-display font-bold text-xl mb-3">{t.tier} Tier</h3>
                <ul className="space-y-1.5">
                  {t.perks.map(p => (
                    <li key={p} className="text-xs flex items-start gap-2">
                      <span className="text-[var(--gold)] mt-0.5">✓</span> {p}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Customer detail drawer */}
      {selected && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center p-4" onClick={() => setSelected(null)}>
          <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50 }}
            onClick={(e) => e.stopPropagation()}
            className="glass-card rounded-3xl p-6 max-w-lg w-full max-h-[85vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-xl bg-gold-gradient flex items-center justify-center text-black text-lg font-bold">{selected.name.split(" ").map(n => n[0]).join("")}</div>
                <div>
                  <h3 className="font-display font-bold text-lg">{selected.name}</h3>
                  <p className="text-xs text-muted-foreground">{selected.email}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold glass-gold text-[var(--gold)]">{selected.tier.toUpperCase()}</span>
                    <span className="text-xs text-muted-foreground">{selected.loyaltyPoints.toLocaleString()} pts</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setSelected(null)} className="text-muted-foreground hover:text-foreground"><Heart className="w-4 h-4" /></button>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-4">
              <MiniStat label="Orders" value={selected.orders.toString()} />
              <MiniStat label="Spent" value={formatNaira(selected.totalSpent)} />
              <MiniStat label="Rating" value={`${selected.feedback}★`} />
            </div>

            <div className="space-y-3">
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Contact</h4>
                <div className="glass-card rounded-2xl p-3 text-xs space-y-1">
                  <div>📞 {selected.phone}</div>
                  <div>📍 {selected.address}, {selected.city}</div>
                  <div>🎂 Birthday: {selected.birthday}</div>
                  <div>📅 Joined: {new Date(selected.joinedAt).toLocaleDateString("en-NG", { month: "long", year: "numeric" })}</div>
                </div>
              </div>
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Customer timeline</h4>
                <div className="space-y-2">
                  {[
                    { event: "Placed order SK48291", time: "2 hours ago", value: formatNaira(12_400) },
                    { event: "Earned 124 loyalty points", time: "2 hours ago" },
                    { event: "Left 5★ review on Jollof Rice Special", time: "3 hours ago" },
                    { event: "Redeemed birthday reward", time: "1 day ago", value: "Free dessert" },
                    { event: "Upgraded to Gold tier", time: "2 weeks ago" },
                    { event: "First order placed", time: new Date(selected.joinedAt).toLocaleDateString("en-NG", { month: "short", year: "numeric" }) },
                  ].map((e, i) => (
                    <div key={i} className="flex items-start gap-3 text-xs">
                      <div className="w-1.5 h-1.5 rounded-full bg-[var(--gold)] mt-1.5 shrink-0" />
                      <div className="flex-1">
                        <div className="font-medium">{e.event}</div>
                        <div className="text-muted-foreground">{e.time}</div>
                      </div>
                      {e.value && <span className="text-[var(--gold)] font-semibold">{e.value}</span>}
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="flex-1" onClick={() => toast.success("Email sent")}><Mail className="w-3.5 h-3.5" /> Email</Button>
                <Button size="sm" variant="outline" className="flex-1" onClick={() => toast.success("WhatsApp opened")}><MessageCircle className="w-3.5 h-3.5" /> WhatsApp</Button>
                <Button size="sm" className="btn-gold flex-1" onClick={() => toast.success("Reward added")}><Plus className="w-3.5 h-3.5" /> Reward</Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

function KPI({ title, value, sub, icon: Icon, accent }: { title: string; value: string; sub: string; icon: any; accent: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      className={`glass-card rounded-2xl p-4 bg-gradient-to-br ${accent} to-transparent`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] text-muted-foreground uppercase tracking-wide">{title}</span>
        <Icon className="w-4 h-4 text-[var(--gold)]" />
      </div>
      <div className="font-display font-bold text-xl sm:text-2xl mb-0.5">{value}</div>
      <div className="text-[10px] text-muted-foreground">{sub}</div>
    </motion.div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="glass-card rounded-2xl p-2 text-center">
      <div className="font-bold text-sm">{value}</div>
      <div className="text-[10px] text-muted-foreground">{label}</div>
    </div>
  );
}
