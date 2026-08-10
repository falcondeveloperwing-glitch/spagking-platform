"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Bike, MapPin, Clock, CheckCircle2, XCircle, Navigation, Plus, Phone, MessageCircle, Star, TrendingUp, Filter } from "lucide-react";
import { riders, orders, formatNaira } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function DeliveryDashboard() {
  const [view, setView] = useState<"map" | "riders" | "zones" | "metrics">("map");
  const [selectedRider, setSelectedRider] = useState<string | null>(null);

  const activeDeliveries = orders.filter(o => o.type === "delivery" && ["on_the_way", "picked_up", "ready", "cooking"].includes(o.status)).slice(0, 8);
  const onlineRiders = riders.filter(r => r.status === "online" || r.status === "on-delivery");
  const completed = orders.filter(o => o.status === "delivered" && o.type === "delivery").length;
  const pending = orders.filter(o => o.type === "delivery" && ["received", "preparing", "cooking", "ready"].includes(o.status)).length;
  const cancelled = orders.filter(o => o.status === "cancelled" && o.type === "delivery").length;

  return (
    <div className="space-y-5">
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KPI title="Online Riders" value={`${onlineRiders.length}/${riders.length}`} sub="available now" icon={Bike} accent="from-emerald-500/20" />
        <KPI title="Active Deliveries" value={activeDeliveries.length.toString()} sub="in progress" icon={Navigation} accent="from-amber-500/20" />
        <KPI title="Completed Today" value="142" sub="98.4% success rate" icon={CheckCircle2} accent="from-cyan-500/20" />
        <KPI title="Avg Delivery Time" value="32 min" sub="-4 min vs target" icon={Clock} accent="from-violet-500/20" />
      </div>

      {/* View tabs */}
      <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
        {[
          { id: "map", label: "Live Map", icon: MapPin },
          { id: "riders", label: "Riders", icon: Bike },
          { id: "zones", label: "Delivery Zones", icon: Filter },
          { id: "metrics", label: "Performance", icon: TrendingUp },
        ].map(t => (
          <button key={t.id} onClick={() => setView(t.id as any)}
            className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${view === t.id ? "btn-gold" : "glass text-muted-foreground"}`}>
            <t.icon className="w-3.5 h-3.5" /> {t.label}
          </button>
        ))}
      </div>

      {/* Map view */}
      {view === "map" && (
        <div className="grid lg:grid-cols-[1fr_320px] gap-4">
          <div className="glass-card rounded-2xl p-3 h-[500px] relative overflow-hidden">
            <DeliveryMap riders={riders} selectedRider={selectedRider} setSelectedRider={setSelectedRider} />
            <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
              <span className="px-3 py-1.5 rounded-full glass text-xs font-medium inline-flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 pulse-dot text-emerald-400" /> Live · {onlineRiders.length} riders online
              </span>
              <span className="px-3 py-1.5 rounded-full glass text-xs font-medium">Lagos · VI / Lekki</span>
            </div>
          </div>

          {/* Active deliveries list */}
          <div className="glass-card rounded-2xl p-4 h-[500px] flex flex-col">
            <h3 className="font-display font-bold mb-3">Active deliveries</h3>
            <div className="flex-1 overflow-y-auto space-y-2">
              {activeDeliveries.map(o => {
                const rider = riders.find(r => r.name === o.rider) || riders[0];
                return (
                  <div key={o.id} className="glass-card rounded-2xl p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-xs">{o.code}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                        o.status === "on_the_way" ? "bg-purple-500/20 text-purple-400" :
                        o.status === "picked_up" ? "bg-violet-500/20 text-violet-400" :
                        o.status === "ready" ? "bg-cyan-500/20 text-cyan-400" : "bg-amber-500/20 text-amber-400"
                      }`}>{o.status.replace(/_/g, " ").toUpperCase()}</span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <img src={rider.avatar} alt={rider.name} className="w-7 h-7 rounded bg-muted" />
                      <div className="flex-1 min-w-0">
                        <div className="text-[11px] font-semibold">{rider.name}</div>
                        <div className="text-[9px] text-muted-foreground">{rider.vehicle} · {rider.plate}</div>
                      </div>
                      <button onClick={() => toast.success(`Calling ${rider.name}`)} className="w-6 h-6 rounded flex items-center justify-center hover:bg-muted"><Phone className="w-3 h-3" /></button>
                      <button onClick={() => toast.success("Opening chat")} className="w-6 h-6 rounded flex items-center justify-center hover:bg-muted"><MessageCircle className="w-3 h-3" /></button>
                    </div>
                    <div className="text-[10px] text-muted-foreground line-clamp-1">📍 {o.address}</div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-[10px] text-[var(--gold)] font-semibold">{formatNaira(o.total)}</span>
                      <span className="text-[10px] text-muted-foreground">ETA {Math.floor(Math.random() * 25) + 8} min</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Riders */}
      {view === "riders" && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {riders.map((r, i) => (
            <motion.div key={r.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
              className="glass-card rounded-2xl p-4 card-hover">
              <div className="flex items-center gap-3 mb-3">
                <div className="relative">
                  <img src={r.avatar} alt={r.name} className="w-12 h-12 rounded-xl bg-muted" />
                  <span className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-card ${
                    r.status === "online" ? "bg-emerald-400" : r.status === "on-delivery" ? "bg-amber-400" : r.status === "break" ? "bg-cyan-400" : "bg-muted"
                  }`} />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold">{r.name}</div>
                  <div className="text-[10px] text-muted-foreground">{r.vehicle} · {r.plate}</div>
                </div>
                <div className="flex items-center gap-0.5">
                  <Star className="w-3 h-3 text-[var(--gold)] fill-[var(--gold)]" />
                  <span className="text-xs font-semibold">{r.rating}</span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-1.5 text-center mb-3">
                <div className="glass-card rounded-2xl p-1.5">
                  <div className="text-xs font-bold">{r.completedToday}</div>
                  <div className="text-[8px] text-muted-foreground">TODAY</div>
                </div>
                <div className="glass-card rounded-2xl p-1.5">
                  <div className="text-xs font-bold">{r.completedTotal}</div>
                  <div className="text-[8px] text-muted-foreground">TOTAL</div>
                </div>
                <div className="glass-card rounded-2xl p-1.5">
                  <div className="text-xs font-bold text-[var(--gold)]">{formatNaira(r.earningsToday).replace("₦", "₦")}</div>
                  <div className="text-[8px] text-muted-foreground">EARNED</div>
                </div>
              </div>
              <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-3">
                <span>📍 {r.zone}</span>
                <span className={`px-1.5 py-0.5 rounded-full font-bold ${
                  r.status === "online" ? "bg-emerald-500/20 text-emerald-400" :
                  r.status === "on-delivery" ? "bg-amber-500/20 text-amber-400" :
                  r.status === "break" ? "bg-cyan-500/20 text-cyan-400" : "bg-muted text-muted-foreground"
                }`}>{r.status.replace("-", " ").toUpperCase()}</span>
              </div>
              <div className="flex gap-1.5">
                <Button size="sm" variant="outline" className="flex-1 text-xs" onClick={() => toast.success(`Assigned new order to ${r.name}`)}>Assign</Button>
                <Button size="sm" variant="ghost" className="text-xs" onClick={() => toast.success("Tracking rider")}><Navigation className="w-3.5 h-3.5" /></Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Zones */}
      {view === "zones" && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { name: "VI / Lekki", fee: 1500, eta: "20-30 min", riders: 5, orders: 47, color: "from-amber-500/20" },
            { name: "Wuse / Maitama", fee: 1200, eta: "25-35 min", riders: 3, orders: 32, color: "from-emerald-500/20" },
            { name: "GRA / Trans Amadi", fee: 1800, eta: "30-40 min", riders: 2, orders: 18, color: "from-cyan-500/20" },
            { name: "Ikeja / Surulere", fee: 2000, eta: "35-45 min", riders: 2, orders: 21, color: "from-violet-500/20" },
            { name: "Yaba / Ebute-Metta", fee: 2200, eta: "40-50 min", riders: 1, orders: 14, color: "from-rose-500/20" },
            { name: "Ikoyi", fee: 1500, eta: "20-30 min", riders: 2, orders: 10, color: "from-pink-500/20" },
          ].map((z, i) => (
            <motion.div key={z.name} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className={`glass-card rounded-2xl p-4 bg-gradient-to-br ${z.color} to-transparent`}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-display font-bold text-base">{z.name}</h3>
                  <p className="text-[10px] text-muted-foreground">{z.riders} riders · {z.orders} active orders</p>
                </div>
                <MapPin className="w-4 h-4 text-[var(--gold)]" />
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                <div className="rounded-lg bg-muted/30 p-2">
                  <div className="text-[9px] text-muted-foreground">Delivery fee</div>
                  <div className="font-bold text-[var(--gold)]">{formatNaira(z.fee)}</div>
                </div>
                <div className="rounded-lg bg-muted/30 p-2">
                  <div className="text-[9px] text-muted-foreground">ETA</div>
                  <div className="font-bold">{z.eta}</div>
                </div>
              </div>
              <Button size="sm" variant="outline" className="w-full text-xs" onClick={() => toast.success(`Editing zone ${z.name}`)}>Configure zone</Button>
            </motion.div>
          ))}
        </div>
      )}

      {/* Metrics */}
      {view === "metrics" && (
        <div className="grid lg:grid-cols-3 gap-4">
          <div className="glass-card rounded-2xl p-5">
            <h3 className="font-display font-bold mb-3">Delivery status today</h3>
            <div className="space-y-3">
              {[
                { label: "Completed", value: completed, color: "bg-emerald-500", icon: CheckCircle2, iconColor: "text-emerald-400" },
                { label: "In progress", value: pending, color: "bg-amber-500", icon: Navigation, iconColor: "text-amber-400" },
                { label: "Cancelled", value: cancelled, color: "bg-red-500", icon: XCircle, iconColor: "text-red-400" },
              ].map(s => {
                const total = completed + pending + cancelled;
                return (
                  <div key={s.label}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="flex items-center gap-1.5"><s.icon className={`w-3.5 h-3.5 ${s.iconColor}`} /> {s.label}</span>
                      <span className="font-bold">{s.value} · {Math.round(s.value / total * 100)}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${(s.value / total) * 100}%` }} transition={{ duration: 0.6 }} className={`h-full ${s.color}`} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="glass-card rounded-2xl p-5 lg:col-span-2">
            <h3 className="font-display font-bold mb-3">Top riders by earnings · today</h3>
            <div className="space-y-2">
              {[...riders].sort((a, b) => b.earningsToday - a.earningsToday).slice(0, 6).map((r, i) => (
                <div key={r.id} className="flex items-center gap-3">
                  <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold ${i === 0 ? "bg-gold-gradient text-black" : "bg-muted"}`}>{i + 1}</span>
                  <img src={r.avatar} alt={r.name} className="w-8 h-8 rounded-lg bg-muted" />
                  <div className="flex-1">
                    <div className="text-sm font-semibold">{r.name}</div>
                    <div className="text-[10px] text-muted-foreground">{r.completedToday} deliveries · {r.rating}★</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-[var(--gold)]">{formatNaira(r.earningsToday)}</div>
                    <div className="text-[10px] text-emerald-400">+{Math.floor(Math.random() * 15) + 5}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DeliveryMap({ riders, selectedRider, setSelectedRider }: { riders: typeof riders; selectedRider: string | null; setSelectedRider: (id: string | null) => void }) {
  // Stylised map of Lagos VI/Lekki area
  return (
    <div className="relative w-full h-full bg-[#0a0a0a] rounded-xl overflow-hidden">
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 600 480" preserveAspectRatio="xMidYMid slice">
        <defs>
          <pattern id="dgrid" width="50" height="50" patternUnits="userSpaceOnUse">
            <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(212,160,23,0.06)" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="600" height="480" fill="url(#dgrid)" />
        {/* Water (Atlantic) */}
        <path d="M 0 320 Q 150 290 300 310 T 600 300 L 600 480 L 0 480 Z" fill="rgba(6,182,212,0.06)" stroke="rgba(6,182,212,0.15)" />
        <text x="450" y="380" fill="rgba(6,182,212,0.4)" fontSize="11" fontStyle="italic">Atlantic Ocean</text>
        {/* Roads */}
        <path d="M 0 180 L 600 180" stroke="rgba(255,255,255,0.04)" strokeWidth="20" />
        <path d="M 0 260 L 600 260" stroke="rgba(255,255,255,0.04)" strokeWidth="16" />
        <path d="M 150 0 L 150 480" stroke="rgba(255,255,255,0.04)" strokeWidth="18" />
        <path d="M 350 0 L 350 480" stroke="rgba(255,255,255,0.04)" strokeWidth="16" />
        <path d="M 480 0 L 480 320" stroke="rgba(255,255,255,0.04)" strokeWidth="14" />
        {/* SpagKing branch markers */}
        <g>
          <circle cx="180" cy="200" r="16" fill="var(--gold-deep)" opacity="0.2" />
          <circle cx="180" cy="200" r="9" fill="var(--gold-deep)" stroke="#0B0B0B" strokeWidth="2" />
          <text x="180" y="178" textAnchor="middle" fill="var(--gold-deep)" fontSize="10" fontWeight="bold">SpagKing VI</text>
        </g>
        <g>
          <circle cx="380" cy="240" r="14" fill="var(--gold-deep)" opacity="0.2" />
          <circle cx="380" cy="240" r="8" fill="var(--gold-deep)" stroke="#0B0B0B" strokeWidth="2" />
          <text x="380" y="220" textAnchor="middle" fill="var(--gold-deep)" fontSize="10" fontWeight="bold">SpagKing Lekki</text>
        </g>
        {/* Rider markers (animated) */}
        {riders.slice(0, 10).map((r, i) => {
          const x = 80 + (i * 47) % 480;
          const y = 80 + (i * 73) % 240;
          const active = selectedRider === r.id;
          const isOnDelivery = r.status === "on-delivery";
          const isOnline = r.status === "online";
          return (
            <g key={r.id} onClick={() => setSelectedRider(active ? null : r.id)} style={{ cursor: "pointer" }}>
              {active && <circle cx={x} cy={y} r="22" fill="var(--gold-deep)" opacity="0.15"><animate attributeName="r" values="18;26;18" dur="2s" repeatCount="indefinite" /></circle>}
              <circle cx={x} cy={y} r="11" fill={isOnDelivery ? "var(--warning)" : isOnline ? "var(--success)" : "var(--muted-foreground)"} opacity="0.25" />
              <circle cx={x} cy={y} r="7" fill={isOnDelivery ? "var(--warning)" : isOnline ? "var(--success)" : "var(--muted-foreground)"} stroke="#0B0B0B" strokeWidth="1.5" />
              <text x={x} y={y + 2.5} textAnchor="middle" fontSize="7" fill="#0B0B0B" fontWeight="bold">{r.name.split(" ").map(n => n[0]).join("")}</text>
            </g>
          );
        })}
      </svg>
      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
        <div className="flex items-center gap-3 glass rounded-lg px-3 py-1.5 text-[10px]">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-400" /> Online</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400" /> On delivery</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[var(--gold)]" /> Branch</span>
        </div>
        {selectedRider && (
          <div className="glass rounded-lg px-3 py-1.5 text-[10px]">
            Selected: {riders.find(r => r.id === selectedRider)?.name}
          </div>
        )}
      </div>
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
