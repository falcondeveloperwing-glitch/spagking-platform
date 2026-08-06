"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Store, Bike, Utensils, CreditCard, Banknote, Wallet, MapPin, StickyNote, Clock, CheckCircle2, QrCode } from "lucide-react";
import { useStore, cartTotals } from "@/lib/store";
import { branches, formatNaira, meals, type Order } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

type OrderType = "delivery" | "pickup" | "dine-in";
type Payment = "paystack" | "flutterwave" | "cash";

export function CustomerCheckout() {
  const cart = useStore(s => s.cart);
  const coupon = useStore(s => s.coupon);
  const setView = useStore(s => s.setCustomerView);
  const user = useStore(s => s.user);
  const placeOrder = useStore(s => s.placeOrder);
  const setTrackingOrder = useStore(s => s.setTrackingOrder);

  const [orderType, setOrderType] = useState<OrderType>("delivery");
  const [payment, setPayment] = useState<Payment>("paystack");
  const [address, setAddress] = useState("12 Adeola Odeku St, Victoria Island, Lagos");
  const [branch, setBranch] = useState(branches[0].name);
  const [table, setTable] = useState("T-12");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const deliveryFee = orderType === "delivery" ? 1500 : 0;
  const totals = cartTotals(cart, coupon?.discount || 0, deliveryFee);

  const handlePlaceOrder = () => {
    if (cart.length === 0) { toast.error("Cart is empty"); return; }
    if (orderType === "delivery" && !address.trim()) { toast.error("Please enter your delivery address"); return; }
    setLoading(true);
    setTimeout(() => {
      const order: Order = {
        id: `O-${Date.now()}`,
        code: `SK${Math.floor(10000 + Math.random() * 89999)}`,
        customer: user?.name || "Guest",
        customerId: user?.id || "C-GUEST",
        branch,
        items: cart.map(c => ({ mealId: c.mealId, name: c.name, emoji: c.emoji, price: c.price, qty: c.qty, size: c.size, toppings: c.toppings })),
        subtotal: totals.subtotal,
        deliveryFee: totals.deliveryFee,
        vat: totals.vat,
        discount: totals.discount,
        tip: 0,
        total: totals.total,
        status: "received",
        type: orderType,
        payment,
        paid: payment !== "cash",
        rider: orderType === "delivery" ? "Tunde Adeleke" : undefined,
        address: orderType === "delivery" ? address : undefined,
        notes: notes || undefined,
        createdAt: new Date().toISOString(),
      };
      placeOrder(order);
      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setTrackingOrder(order.id);
      }, 1800);
    }, 1200);
  };

  if (success) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200 }}
          className="w-24 h-24 rounded-full bg-[var(--success)]/20 flex items-center justify-center mb-6 relative">
          <span className="absolute inset-0 rounded-full bg-[var(--success)]/20 animate-ping" />
          <CheckCircle2 className="w-14 h-14 text-[var(--success)] relative" />
        </motion.div>
        <motion.h2 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="font-display text-3xl font-bold mb-2">Order placed!</motion.h2>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          className="text-muted-foreground mb-6">Your order is now being prepared. Track it in real time.</motion.p>

        {/* Order assignment preview */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="glass-card rounded-2xl p-5 max-w-md w-full">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <div className="w-12 h-12 mx-auto rounded-full bg-gold-gradient flex items-center justify-center mb-2 text-xl">👨‍🍳</div>
              <div className="text-[10px] text-muted-foreground">Assigned chef</div>
              <div className="text-xs font-semibold">Chef Ade</div>
            </div>
            <div>
              <div className="w-12 h-12 mx-auto rounded-full bg-gold-gradient flex items-center justify-center mb-2 text-xl">🛵</div>
              <div className="text-[10px] text-muted-foreground">Assigned rider</div>
              <div className="text-xs font-semibold">Tunde A.</div>
            </div>
            <div>
              <div className="w-12 h-12 mx-auto rounded-full bg-gold-gradient flex items-center justify-center mb-2 text-xl">⏱️</div>
              <div className="text-[10px] text-muted-foreground">Est. delivery</div>
              <div className="text-xs font-semibold">32 min</div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-border/40 text-xs text-muted-foreground">
            <div className="flex justify-between mb-1"><span>🍳 Cooking time</span><span className="font-medium text-foreground">~12 min</span></div>
            <div className="flex justify-between"><span>🛵 Delivery time</span><span className="font-medium text-foreground">~20 min</span></div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <button onClick={() => setView("cart")} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="w-4 h-4" /> Back to cart
      </button>

      <h1 className="font-display text-3xl font-extrabold">Checkout</h1>

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          {/* Order type */}
          <Card title="Order type" icon={Clock}>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "delivery" as const, label: "Delivery", desc: "30-45 min", icon: Bike },
                { id: "pickup" as const, label: "Pickup", desc: "15-20 min", icon: Store },
                { id: "dine-in" as const, label: "Dine-In", desc: "At table", icon: Utensils },
              ].map(t => (
                <button key={t.id} onClick={() => setOrderType(t.id)}
                  className={`p-3 rounded-xl border text-center transition-all ${orderType === t.id ? "glass-gold border-[var(--gold)]/40" : "border-border/50 bg-muted/30 hover:border-border"}`}>
                  <t.icon className={`w-5 h-5 mx-auto mb-1.5 ${orderType === t.id ? "text-[var(--gold)]" : "text-muted-foreground"}`} />
                  <div className="text-xs font-semibold">{t.label}</div>
                  <div className="text-[10px] text-muted-foreground">{t.desc}</div>
                </button>
              ))}
            </div>
          </Card>

          {/* Address / branch / table */}
          {orderType === "delivery" && (
            <Card title="Delivery address" icon={MapPin}>
              <Textarea value={address} onChange={(e) => setAddress(e.target.value)} rows={2}
                placeholder="Enter your full delivery address" className="bg-input/50" />
              <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="w-3.5 h-3.5 text-[var(--gold)]" /> Estimated delivery: <span className="text-foreground font-medium">30-45 minutes</span>
              </div>
            </Card>
          )}

          {orderType === "pickup" && (
            <Card title="Pickup branch" icon={Store}>
              <div className="space-y-2">
                {branches.map(b => (
                  <button key={b.id} onClick={() => setBranch(b.name)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all ${branch === b.name ? "glass-gold border-[var(--gold)]/40" : "border-border/50 bg-muted/30 hover:border-border"}`}>
                    <div>
                      <div className="text-sm font-semibold">{b.name}</div>
                      <div className="text-xs text-muted-foreground">{b.address}</div>
                    </div>
                    {branch === b.name && <CheckCircle2 className="w-4 h-4 text-[var(--gold)]" />}
                  </button>
                ))}
              </div>
            </Card>
          )}

          {orderType === "dine-in" && (
            <Card title="Table selection" icon={Utensils}>
              <div className="grid grid-cols-6 gap-2">
                {["T-01","T-03","T-07","T-09","T-11","T-12","T-14","T-18","T-22","T-25","T-28","T-30"].map(t => (
                  <button key={t} onClick={() => setTable(t)}
                    className={`py-2.5 rounded-lg text-xs font-semibold border transition-all ${table === t ? "btn-gold border-transparent" : "border-border/50 bg-muted/30 hover:border-border"}`}>
                    {t}
                  </button>
                ))}
              </div>
              <div className="mt-3 flex items-center gap-2 p-2.5 rounded-lg glass-gold">
                <QrCode className="w-4 h-4 text-[var(--gold)]" />
                <span className="text-xs">Scan the QR on your table to auto-fill this field</span>
              </div>
            </Card>
          )}

          {/* Payment */}
          <Card title="Payment method" icon={Wallet}>
            <div className="space-y-2">
              {[
                { id: "paystack" as const, label: "Paystack", desc: "Card · Bank · USSD", icon: CreditCard, color: "text-sky-400" },
                { id: "flutterwave" as const, label: "Flutterwave", desc: "Card · Bank transfer", icon: CreditCard, color: "text-amber-400" },
                { id: "cash" as const, label: "Cash on delivery", desc: "Pay rider on arrival", icon: Banknote, color: "text-emerald-400" },
              ].map(p => (
                <button key={p.id} onClick={() => setPayment(p.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${payment === p.id ? "glass-gold border-[var(--gold)]/40" : "border-border/50 bg-muted/30 hover:border-border"}`}>
                  <p.icon className={`w-5 h-5 ${p.color}`} />
                  <div className="flex-1">
                    <div className="text-sm font-semibold">{p.label}</div>
                    <div className="text-xs text-muted-foreground">{p.desc}</div>
                  </div>
                  {payment === p.id && <CheckCircle2 className="w-4 h-4 text-[var(--gold)]" />}
                </button>
              ))}
            </div>
          </Card>

          {/* Notes */}
          <Card title="Order notes" icon={StickyNote}>
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2}
              placeholder="Special instructions (e.g. extra spicy, no onions, call on arrival)…" className="bg-input/50" />
          </Card>
        </div>

        {/* Summary */}
        <div className="space-y-4">
          <div className="glass-card rounded-2xl p-5 sticky top-24">
            <h3 className="font-display font-bold text-lg mb-3">Order summary</h3>
            <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
              {cart.map((item, i) => (
                <div key={i} className="flex items-start gap-2 text-sm">
                  <span className="text-lg">{item.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium line-clamp-1">{item.qty} × {item.name}</div>
                    <div className="text-[10px] text-muted-foreground">{item.size}{item.toppings?.length ? ` · ${item.toppings.join(", ")}` : ""}</div>
                  </div>
                  <span className="font-semibold text-xs whitespace-nowrap">{formatNaira(item.price * item.qty)}</span>
                </div>
              ))}
            </div>

            <div className="space-y-1.5 text-xs border-t border-border/50 pt-3">
              <div className="flex justify-between text-muted-foreground"><span>Subtotal</span><span>{formatNaira(totals.subtotal)}</span></div>
              {totals.discount > 0 && <div className="flex justify-between text-emerald-400"><span>Discount ({coupon?.code})</span><span>-{formatNaira(totals.discount)}</span></div>}
              <div className="flex justify-between text-muted-foreground"><span>VAT (7.5%)</span><span>{formatNaira(totals.vat)}</span></div>
              <div className="flex justify-between text-muted-foreground"><span>Delivery fee</span><span>{orderType === "delivery" ? formatNaira(totals.deliveryFee) : "Free"}</span></div>
              <div className="flex justify-between font-bold text-base pt-2 border-t border-border/50">
                <span>Total</span><span className="text-gold-gradient">{formatNaira(totals.total)}</span>
              </div>
            </div>

            <Button onClick={handlePlaceOrder} disabled={loading} className="btn-gold w-full h-12 mt-4">
              {loading ? "Placing order…" : <>Place order · {formatNaira(totals.total)}</>}
            </Button>
            <p className="text-[10px] text-muted-foreground text-center mt-2">By placing this order you agree to SpagKing's terms & privacy policy</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Card({ title, icon: Icon, children }: { title: string; icon: any; children: React.ReactNode }) {
  return (
    <div className="glass-card rounded-2xl p-5">
      <h3 className="flex items-center gap-2 font-semibold text-sm mb-3">
        <Icon className="w-4 h-4 text-[var(--gold)]" /> {title}
      </h3>
      {children}
    </div>
  );
}
