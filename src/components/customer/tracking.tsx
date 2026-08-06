"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, CheckCircle2, Circle, Clock, MapPin, Phone, MessageCircle, Star, Bike, Store, Utensils, Receipt, Download } from "lucide-react";
import { useStore } from "@/lib/store";
import { orders as allOrders, riders, formatNaira, type Order } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const STEPS: { key: Order["status"]; label: string; desc: string; icon: string }[] = [
  { key: "received", label: "Order Received", desc: "We've got your order", icon: "📥" },
  { key: "preparing", label: "Kitchen Accepted", desc: "Chef is gathering ingredients", icon: "👨‍🍳" },
  { key: "cooking", label: "Chef Preparing", desc: "Your meal is on the fire", icon: "🔥" },
  { key: "ready", label: "Quality Check", desc: "Packed and verified", icon: "✅" },
  { key: "picked_up", label: "Rider Assigned", desc: "Rider has collected", icon: "🛵" },
  { key: "on_the_way", label: "On The Way", desc: "Heading to you now", icon: "📍" },
  { key: "delivered", label: "Delivered", desc: "Enjoy your meal!", icon: "🎉" },
];

export function CustomerTracking() {
  const trackingId = useStore(s => s.trackingOrderId);
  const myOrders = useStore(s => s.myOrders);

  const order = myOrders.find(o => o.id === trackingId) || allOrders.find(o => o.id === trackingId);

  if (!order) {
    return <div className="text-center py-20">Order not found</div>;
  }

  // Keyed by order.id so internal step state resets cleanly per order
  return <TrackingContent key={order.id} order={order} />;
}

function TrackingContent({ order }: { order: Order }) {
  const setTrackingOrder = useStore(s => s.setTrackingOrder);
  const rateOrder = useStore(s => s.rateOrder);

  const initialStep = STEPS.findIndex(s => s.key === order.status);
  const [currentStep, setCurrentStep] = useState(initialStep === -1 ? 0 : initialStep);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    // Simulate progress for live orders
    if (order.status !== "delivered" && order.status !== "cancelled") {
      const interval = setInterval(() => {
        setCurrentStep(prev => {
          if (prev >= STEPS.length - 1) { clearInterval(interval); return prev; }
          return prev + 1;
        });
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [order.status]);

  const rider = riders.find(r => r.name === order.rider) || riders[0];
  const isDelivered = currentStep >= STEPS.length - 1 || order.status === "delivered";
  const progress = ((currentStep + 1) / STEPS.length) * 100;

  const handleRate = () => {
    if (rating === 0) { toast.error("Please select a rating"); return; }
    rateOrder(order.id, rating, feedback);
    toast.success("Thanks for your feedback!");
  };

  return (
    <div className="space-y-5">
      <button onClick={() => setTrackingOrder(null)} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="w-4 h-4" /> Back to orders
      </button>

      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-2xl font-extrabold">Track your order</h1>
          <p className="text-sm text-muted-foreground">Order <span className="text-[var(--gold)] font-semibold">{order.code}</span> · {formatNaira(order.total)}</p>
        </div>
        <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${isDelivered ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"}`}>
          {isDelivered ? "✓ Delivered" : "● In progress"}
        </span>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Timeline + map */}
        <div className="lg:col-span-2 space-y-5">
          {/* Live map */}
          <div className="relative h-64 rounded-2xl overflow-hidden glass-card">
            <LiveMap progress={progress} riderName={rider.name} />
            <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
              <span className="px-3 py-1.5 rounded-full glass text-xs font-medium inline-flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 pulse-dot text-emerald-400" /> Live tracking
              </span>
              <span className="px-3 py-1.5 rounded-full glass text-xs font-medium">
                <Clock className="w-3 h-3 inline mr-1 text-[var(--gold)]" />
                ETA {isDelivered ? "Delivered" : `${Math.max(5, 35 - currentStep * 5)} min`}
              </span>
            </div>
          </div>

          {/* Timeline */}
          <div className="glass-card rounded-2xl p-5">
            <h3 className="font-display font-bold mb-4">Order timeline</h3>
            <div className="relative">
              {STEPS.map((step, i) => {
                const done = i <= currentStep && !isDelivered || (isDelivered && true);
                const active = i === currentStep && !isDelivered;
                return (
                  <div key={step.key} className="flex gap-3 pb-5 last:pb-0 relative">
                    {/* Connector */}
                    {i < STEPS.length - 1 && (
                      <div className={`absolute left-[18px] top-9 w-0.5 h-[calc(100%-18px)] ${i < currentStep || isDelivered ? "bg-[var(--gold)]" : "bg-border"}`} />
                    )}
                    <div className={`relative w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all ${done ? "bg-gold-gradient" : "bg-muted"} ${active ? "ring-4 ring-[var(--gold)]/20" : ""}`}>
                      <span className="text-sm">{done ? step.icon : "○"}</span>
                      {active && <motion.div className="absolute inset-0 rounded-full bg-[var(--gold)]" animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }} transition={{ duration: 1.5, repeat: Infinity }} />}
                    </div>
                    <div className={`flex-1 ${done ? "opacity-100" : "opacity-50"}`}>
                      <div className={`text-sm font-semibold ${active ? "text-[var(--gold)]" : ""}`}>{step.label}</div>
                      <div className="text-xs text-muted-foreground">{step.desc}</div>
                    </div>
                    <AnimatePresence>
                      {(active || (isDelivered && i === STEPS.length - 1)) && (
                        <motion.span initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                          className="text-[10px] text-muted-foreground">
                          {new Date().toLocaleTimeString("en-NG", { hour: "2-digit", minute: "2-digit" })}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order items */}
          <div className="glass-card rounded-2xl p-5">
            <h3 className="font-display font-bold mb-3">Your order</h3>
            <div className="space-y-2">
              {order.items.map((it, i) => (
                <div key={i} className="flex items-center gap-3 text-sm">
                  <span className="text-xl">{it.emoji}</span>
                  <div className="flex-1">
                    <div className="font-medium">{it.qty} × {it.name}</div>
                    <div className="text-[11px] text-muted-foreground">{it.size}{it.toppings?.length ? ` · ${it.toppings.join(", ")}` : ""}</div>
                  </div>
                  <span className="font-semibold">{formatNaira(it.price * it.qty)}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t border-border/50 flex justify-between font-bold">
              <span>Total</span><span className="text-gold-gradient">{formatNaira(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Rider + rating */}
        <div className="space-y-4">
          {/* Rider */}
          {order.type === "delivery" && !isDelivered && (
            <div className="glass-card rounded-2xl p-5">
              <h3 className="font-display font-bold mb-3">Your rider</h3>
              <div className="flex items-center gap-3 mb-4">
                <img src={rider.avatar} alt={rider.name} className="w-14 h-14 rounded-full bg-muted" />
                <div className="flex-1">
                  <div className="font-semibold">{rider.name}</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <Star className="w-3 h-3 text-[var(--gold)] fill-[var(--gold)]" /> {rider.rating} · {rider.vehicle}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" onClick={() => toast.success(`Calling ${rider.name}…`)}>
                  <Phone className="w-4 h-4" /> Call
                </Button>
                <Button variant="outline" size="sm" onClick={() => toast.success("Opening chat…")}>
                  <MessageCircle className="w-4 h-4" /> Chat
                </Button>
              </div>
            </div>
          )}

          {/* Order type badge */}
          <div className="glass-card rounded-2xl p-4 flex items-center gap-3">
            {order.type === "delivery" ? <Bike className="w-5 h-5 text-[var(--gold)]" /> : order.type === "pickup" ? <Store className="w-5 h-5 text-[var(--gold)]" /> : <Utensils className="w-5 h-5 text-[var(--gold)]" />}
            <div>
              <div className="text-xs text-muted-foreground">Order type</div>
              <div className="text-sm font-semibold capitalize">{order.type}</div>
            </div>
          </div>

          {/* Download receipt */}
          <Button variant="outline" className="w-full" onClick={() => toast.success("Receipt downloaded")}>
            <Download className="w-4 h-4" /> Download receipt
          </Button>

          {/* Rate order */}
          {isDelivered && (
            <div className="glass-card rounded-2xl p-5">
              <h3 className="font-display font-bold mb-3">Rate your order</h3>
              <div className="flex items-center gap-1 mb-3">
                {[1,2,3,4,5].map(n => (
                  <button key={n} onClick={() => setRating(n)}>
                    <Star className={`w-8 h-8 transition-all ${n <= rating ? "text-[var(--gold)] fill-[var(--gold)] scale-110" : "text-muted-foreground/40 hover:scale-110"}`} />
                  </button>
                ))}
              </div>
              <textarea value={feedback} onChange={(e) => setFeedback(e.target.value)} rows={2}
                placeholder="Tell us about your experience…" className="w-full text-xs p-2.5 rounded-lg bg-input/50 border border-border/50 resize-none mb-3" />
              <Button onClick={handleRate} className="btn-gold w-full">Submit feedback</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function LiveMap({ progress, riderName }: { progress: number; riderName: string }) {
  return (
    <div className="relative w-full h-full bg-[#0a0a0a]">
      {/* Stylized map grid */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 256" preserveAspectRatio="xMidYMid slice">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(212,160,23,0.08)" strokeWidth="0.5" />
          </pattern>
          <linearGradient id="routeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#D4A017" />
            <stop offset="100%" stopColor="#10B981" />
          </linearGradient>
        </defs>
        <rect width="400" height="256" fill="url(#grid)" />
        {/* Roads */}
        <path d="M 0 80 L 400 80" stroke="rgba(255,255,255,0.06)" strokeWidth="14" />
        <path d="M 0 180 L 400 180" stroke="rgba(255,255,255,0.06)" strokeWidth="14" />
        <path d="M 120 0 L 120 256" stroke="rgba(255,255,255,0.06)" strokeWidth="14" />
        <path d="M 280 0 L 280 256" stroke="rgba(255,255,255,0.06)" strokeWidth="14" />
        {/* Route */}
        <motion.path
          d="M 60 200 Q 120 180 180 160 T 340 60"
          stroke="url(#routeGrad)" strokeWidth="3" fill="none" strokeLinecap="round"
          strokeDasharray="400" initial={{ strokeDashoffset: 400 }}
          animate={{ strokeDashoffset: 400 - (400 * progress / 100) }}
          transition={{ duration: 0.8 }}
        />
        {/* Restaurant marker */}
        <g transform="translate(60,200)">
          <circle r="10" fill="#D4A017" opacity="0.3" />
          <circle r="6" fill="#D4A017" />
          <text x="0" y="-14" textAnchor="middle" fill="#D4A017" fontSize="9" fontWeight="bold">SpagKing</text>
        </g>
        {/* Customer marker */}
        <g transform="translate(340,60)">
          <circle r="10" fill="#10B981" opacity="0.3" />
          <circle r="6" fill="#10B981" />
          <text x="0" y="-14" textAnchor="middle" fill="#10B981" fontSize="9" fontWeight="bold">You</text>
        </g>
        {/* Rider marker (animated) */}
        <motion.g
          animate={{
            cx: [60, 120, 180, 240, 300, 340],
            cy: [200, 190, 180, 140, 100, 60],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        >
          <circle cx="60" cy="200" r="12" fill="#D4A017" opacity="0.25">
            <animate attributeName="r" values="12;16;12" dur="1.5s" repeatCount="indefinite" />
          </circle>
          <circle cx="60" cy="200" r="7" fill="#F5D061" stroke="#0B0B0B" strokeWidth="1.5" />
        </motion.g>
      </svg>
      <div className="absolute bottom-3 left-3 glass rounded-lg px-2.5 py-1.5 text-[10px] text-muted-foreground">
        🏍️ {riderName} · {Math.round(progress)}% complete
      </div>
    </div>
  );
}
