"use client";
import { motion } from "framer-motion";
import { Receipt, RotateCw, Download, Star, MapPin, ShoppingBag, Clock } from "lucide-react";
import { useStore } from "@/lib/store";
import { orders as allOrders, formatNaira, type Order } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";

const STATUS_STYLES: Record<Order["status"], { label: string; cls: string }> = {
  received: { label: "Received", cls: "bg-blue-500/20 text-blue-400" },
  preparing: { label: "Preparing", cls: "bg-amber-500/20 text-amber-400" },
  cooking: { label: "Cooking", cls: "bg-orange-500/20 text-orange-400" },
  ready: { label: "Ready", cls: "bg-cyan-500/20 text-cyan-400" },
  picked_up: { label: "Picked Up", cls: "bg-violet-500/20 text-violet-400" },
  on_the_way: { label: "On The Way", cls: "bg-purple-500/20 text-purple-400" },
  delivered: { label: "Delivered", cls: "bg-emerald-500/20 text-emerald-400" },
  cancelled: { label: "Cancelled", cls: "bg-red-500/20 text-red-400" },
};

export function CustomerHistory() {
  const myOrders = useStore(s => s.myOrders);
  const reorder = useStore(s => s.reorder);
  const setTrackingOrder = useStore(s => s.setTrackingOrder);
  const user = useStore(s => s.user);
  const [filter, setFilter] = useState<"all" | "active" | "delivered">("all");

  // Combine customer's orders with some seed orders from data
  const customerOrders = [
    ...myOrders,
    ...allOrders.filter(o => o.customerId === "C-0001" || o.customer === user?.name).slice(0, 8),
  ].filter((o, i, arr) => arr.findIndex(x => x.id === o.id) === i)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const filtered = customerOrders.filter(o => {
    if (filter === "active") return !["delivered", "cancelled"].includes(o.status);
    if (filter === "delivered") return o.status === "delivered";
    return true;
  });

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-display text-3xl font-extrabold">Order history</h1>
          <p className="text-sm text-muted-foreground">{customerOrders.length} orders · {formatNaira(customerOrders.reduce((s, o) => s + o.total, 0))} total spent</p>
        </div>
        <div className="flex gap-1.5">
          {(["all", "active", "delivered"] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${filter === f ? "btn-gold" : "glass text-muted-foreground"}`}>
              {f === "all" ? "All" : f === "active" ? "Active" : "Delivered"}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 200 }}
            className="text-7xl mb-4 animate-float">🧾</motion.div>
          <h3 className="font-display font-bold text-lg mb-1">No orders yet</h3>
          <p className="text-sm text-muted-foreground mb-5 max-w-xs mx-auto">Your delicious journey starts here. Let's find your next favourite meal.</p>
          <Button onClick={() => useStore.getState().setCustomerView("menu")} className="btn-gold">
            <ShoppingBag className="w-4 h-4" /> Browse the menu
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((order, idx) => {
            const style = STATUS_STYLES[order.status];
            return (
              <motion.div key={order.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(idx * 0.05, 0.3) }}
                className="glass-card rounded-2xl p-4 card-hover">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-display font-bold">{order.code}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${style.cls}`}>{style.label}</span>
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center gap-3">
                      <span className="inline-flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(order.createdAt).toLocaleString("en-NG", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</span>
                      <span className="capitalize">{order.type}</span>
                      {order.address && <span className="inline-flex items-center gap-1"><MapPin className="w-3 h-3" /> {order.address.split(",")[0]}</span>}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-display font-bold text-lg text-gold-gradient">{formatNaira(order.total)}</div>
                    <div className="text-[10px] text-muted-foreground">{order.items.reduce((s, i) => s + i.qty, 0)} items</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-3 overflow-x-auto no-scrollbar">
                  {order.items.map((it, i) => (
                    <div key={i} className="shrink-0 flex items-center gap-1.5 px-2 py-1 rounded-lg bg-muted/40 text-xs">
                      <span>{it.emoji}</span>
                      <span className="text-muted-foreground">{it.qty}×</span>
                      <span className="font-medium line-clamp-1 max-w-[120px]">{it.name}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {order.status !== "delivered" && order.status !== "cancelled" && (
                    <Button size="sm" onClick={() => setTrackingOrder(order.id)} className="btn-gold">
                      Track order
                    </Button>
                  )}
                  <Button size="sm" variant="outline" onClick={() => { reorder(order.id); toast.success("Items added to cart"); }}>
                    <RotateCw className="w-3.5 h-3.5" /> Reorder
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => toast.success("Receipt downloaded")}>
                    <Download className="w-3.5 h-3.5" /> Receipt
                  </Button>
                  {order.rating && (
                    <div className="ml-auto flex items-center gap-1 text-xs text-muted-foreground">
                      <Star className="w-3 h-3 text-[var(--gold)] fill-[var(--gold)]" /> You rated {order.rating}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
