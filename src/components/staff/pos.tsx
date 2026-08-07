"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ScanLine, Printer, Split, RefreshCw, DollarSign, Clock, X, Plus, Minus, CreditCard, Banknote, Wallet, CheckCircle2, ChefHat, Lock, Unlock, Receipt } from "lucide-react";
import { meals, categories, formatNaira } from "@/lib/data";
import { MealImage } from "@/components/brand";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

interface TicketItem { mealId: string; name: string; emoji: string; price: number; qty: number }

export function POSDashboard() {
  const user = useStore(s => s.user);
  const [activeCat, setActiveCat] = useState("All");
  const [query, setQuery] = useState("");
  const [ticket, setTicket] = useState<TicketItem[]>([]);
  const [discount, setDiscount] = useState(0);
  const [payment, setPayment] = useState<"cash" | "card" | "wallet">("card");
  const [shiftOpen, setShiftOpen] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [receiptOpen, setReceiptOpen] = useState(false);
  const [splitOpen, setSplitOpen] = useState(false);
  const [refundOpen, setRefundOpen] = useState(false);
  const [shiftCloseOpen, setShiftCloseOpen] = useState(false);
  const [orderType, setOrderType] = useState<"walk-in" | "pickup" | "delivery">("walk-in");
  const [lastOrder, setLastOrder] = useState<{ code: string; total: number; items: TicketItem[] } | null>(null);

  const filtered = meals.filter(m =>
    (activeCat === "All" || m.category === activeCat) &&
    m.name.toLowerCase().includes(query.toLowerCase())
  );

  const subtotal = ticket.reduce((s, i) => s + i.price * i.qty, 0);
  const vat = Math.round(subtotal * 0.075);
  const total = subtotal - discount + vat;

  const addItem = (meal: typeof meals[0]) => {
    setTicket(t => {
      const idx = t.findIndex(x => x.mealId === meal.id);
      if (idx >= 0) { const next = [...t]; next[idx] = { ...next[idx], qty: next[idx].qty + 1 }; return next; }
      return [...t, { mealId: meal.id, name: meal.name, emoji: meal.emoji, price: meal.price, qty: 1 }];
    });
  };

  const updateQty = (idx: number, delta: number) => {
    setTicket(t => {
      const next = [...t];
      next[idx] = { ...next[idx], qty: next[idx].qty + delta };
      return next.filter(x => x.qty > 0);
    });
  };

  const handleCheckout = () => {
    if (ticket.length === 0) { toast.error("Ticket is empty"); return; }
    if (!shiftOpen) { toast.error("Open your shift first"); return; }
    const code = `SK${Math.floor(10000 + Math.random() * 89999)}`;
    setLastOrder({ code, total, items: ticket });
    setReceiptOpen(true);
    setTicket([]);
    setDiscount(0);
    toast.success(`Order ${code} completed · ${formatNaira(total)}`);
  };

  return (
    <div className="grid lg:grid-cols-[1fr_380px] gap-4 h-[calc(100vh-120px)]">
      {/* Left: products */}
      <div className="flex flex-col gap-3 min-w-0">
        {/* Top toolbar */}
        <div className="glass-card rounded-2xl p-3 flex items-center gap-2 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search products or scan barcode…"
              className="pl-10 h-10 bg-input/50" />
          </div>
          <Button variant="outline" size="sm" onClick={() => toast.success("Barcode scanner ready — scan an item")}>
            <ScanLine className="w-4 h-4" /> Scan
          </Button>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg glass">
            <div className={`w-2 h-2 rounded-full ${shiftOpen ? "bg-emerald-400 pulse-dot text-emerald-400" : "bg-red-400"}`} />
            <span className="text-xs font-medium">{shiftOpen ? "Shift open" : "Shift closed"}</span>
          </div>
          <Button variant="outline" size="sm" onClick={() => setDrawerOpen(true)}>
            <DollarSign className="w-4 h-4" /> Cash Drawer
          </Button>
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          <CatPill label="All" active={activeCat === "All"} onClick={() => setActiveCat("All")} />
          {categories.map(c => (
            <CatPill key={c.name} label={`${c.emoji} ${c.name}`} active={activeCat === c.name} onClick={() => setActiveCat(c.name)} />
          ))}
        </div>

        {/* Product grid */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-2.5">
            {filtered.map((m, i) => (
              <motion.button key={m.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: Math.min(i * 0.02, 0.3) }}
                whileTap={{ scale: 0.95 }}
                onClick={() => addItem(m)}
                className="group glass-card rounded-2xl overflow-hidden text-left card-hover relative">
                <div className="relative aspect-square">
                  <MealImage src={m.image} emoji={m.emoji} alt={m.name} className="w-full h-full" />
                  {m.stock < 20 && <span className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-amber-500/90 text-white">{m.stock} left</span>}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity w-10 h-10 rounded-full btn-gold flex items-center justify-center">
                      <Plus className="w-5 h-5" />
                    </div>
                  </div>
                </div>
                <div className="p-2">
                  <div className="text-xs font-semibold line-clamp-1">{m.name}</div>
                  <div className="text-[10px] text-muted-foreground line-clamp-1">{m.category}</div>
                  <div className="text-xs font-bold text-[var(--gold)] mt-0.5">{formatNaira(m.price)}</div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Right: ticket */}
      <div className="glass-card rounded-2xl flex flex-col overflow-hidden">
        <div className="p-4 border-b border-border/50">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display font-bold flex items-center gap-2">
              <Receipt className="w-4 h-4 text-[var(--gold)]" /> Current Ticket
            </h3>
            <span className="text-xs text-muted-foreground">{ticket.length} items</span>
          </div>
          {/* Order type */}
          <div className="grid grid-cols-3 gap-1.5">
            {(["walk-in", "pickup", "delivery"] as const).map(t => (
              <button key={t} onClick={() => setOrderType(t)}
                className={`py-1.5 rounded-lg text-[11px] font-semibold capitalize transition-all ${orderType === t ? "btn-gold" : "bg-muted/50 text-muted-foreground"}`}>
                {t.replace("-", " ")}
              </button>
            ))}
          </div>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {ticket.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center px-6">
              <div className="text-5xl mb-2 opacity-50">🧾</div>
              <p className="text-sm text-muted-foreground">Tap products to add to ticket</p>
            </div>
          ) : (
            <AnimatePresence>
              {ticket.map((it, idx) => (
                <motion.div key={`${it.mealId}-${idx}`} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20, height: 0 }}
                  className="flex items-center gap-2 p-2 rounded-lg bg-muted/30">
                  <span className="text-lg">{it.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold line-clamp-1">{it.name}</div>
                    <div className="text-[10px] text-muted-foreground">{formatNaira(it.price)} each</div>
                  </div>
                  <div className="flex items-center gap-1 bg-muted rounded-lg p-0.5">
                    <button onClick={() => updateQty(idx, -1)} className="w-6 h-6 rounded flex items-center justify-center hover:bg-background"><Minus className="w-3 h-3" /></button>
                    <span className="w-5 text-center text-xs font-bold">{it.qty}</span>
                    <button onClick={() => updateQty(idx, 1)} className="w-6 h-6 rounded flex items-center justify-center hover:bg-background"><Plus className="w-3 h-3" /></button>
                  </div>
                  <span className="text-xs font-bold w-16 text-right">{formatNaira(it.price * it.qty)}</span>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        {/* Totals + actions */}
        {ticket.length > 0 && (
          <div className="border-t border-border/50 p-3 space-y-2">
            <div className="flex gap-1.5">
              <Button size="sm" variant="outline" className="flex-1 text-xs" onClick={() => setDiscount(d => d === 0 ? 500 : 0)}>
                <Split className="w-3 h-3" /> {discount > 0 ? `-${formatNaira(discount)}` : "Discount"}
              </Button>
              <Button size="sm" variant="outline" className="flex-1 text-xs" onClick={() => setSplitOpen(true)}>
                <Split className="w-3 h-3" /> Split
              </Button>
              <Button size="sm" variant="outline" className="flex-1 text-xs" onClick={() => setRefundOpen(true)}>
                <RefreshCw className="w-3 h-3" /> Refund
              </Button>
            </div>

            <div className="space-y-1 text-xs">
              <div className="flex justify-between text-muted-foreground"><span>Subtotal</span><span>{formatNaira(subtotal)}</span></div>
              {discount > 0 && <div className="flex justify-between text-emerald-400"><span>Discount</span><span>-{formatNaira(discount)}</span></div>}
              <div className="flex justify-between text-muted-foreground"><span>VAT (7.5%)</span><span>{formatNaira(vat)}</span></div>
              <div className="flex justify-between font-bold text-base pt-1 border-t border-border/50">
                <span>Total</span><span className="text-gold-gradient">{formatNaira(total)}</span>
              </div>
            </div>

            {/* Payment methods */}
            <div className="grid grid-cols-3 gap-1.5">
              {([
                { id: "card" as const, label: "Card", icon: CreditCard, color: "text-sky-400" },
                { id: "cash" as const, label: "Cash", icon: Banknote, color: "text-emerald-400" },
                { id: "wallet" as const, label: "Wallet", icon: Wallet, color: "text-amber-400" },
              ]).map(p => (
                <button key={p.id} onClick={() => setPayment(p.id)}
                  className={`flex flex-col items-center gap-1 py-2 rounded-lg border text-[10px] font-semibold transition-all ${payment === p.id ? "glass-gold border-[var(--gold)]/40 text-[var(--gold)]" : "border-border/50 bg-muted/30"}`}>
                  <p.icon className={`w-4 h-4 ${payment === p.id ? "text-[var(--gold)]" : p.color}`} /> {p.label}
                </button>
              ))}
            </div>

            <div className="flex gap-1.5">
              <Button size="sm" variant="outline" className="flex-1" onClick={() => { toast.success("Kitchen ticket sent to display"); }}>
                <ChefHat className="w-3.5 h-3.5" /> Kitchen
              </Button>
              <Button size="sm" variant="outline" onClick={() => toast.success("Printing receipt…")}>
                <Printer className="w-3.5 h-3.5" />
              </Button>
              <Button size="sm" className="btn-gold flex-[2]" onClick={handleCheckout}>
                Charge {formatNaira(total)}
              </Button>
            </div>
            <Button size="sm" variant="ghost" className="w-full text-xs" onClick={() => setShiftCloseOpen(true)}>
              {shiftOpen ? "Close shift & reconcile" : "Open shift"}
            </Button>
          </div>
        )}
      </div>

      {/* Receipt modal */}
      <Dialog open={receiptOpen} onOpenChange={setReceiptOpen}>
        <DialogContent className="max-w-sm bg-card border-border/50">
          <DialogHeader><DialogTitle className="text-center font-display">Order Complete</DialogTitle></DialogHeader>
          {lastOrder && (
            <div className="text-center">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200 }}
                className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 flex items-center justify-center mb-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-400" />
              </motion.div>
              <h3 className="font-display font-bold text-xl mb-1">Order {lastOrder.code}</h3>
              <p className="text-sm text-muted-foreground mb-4">Total: <span className="font-bold text-[var(--gold)]">{formatNaira(lastOrder.total)}</span></p>
              <div className="text-left glass-card rounded-2xl p-3 mb-4 max-h-48 overflow-y-auto">
                {lastOrder.items.map((it, i) => (
                  <div key={i} className="flex justify-between text-xs py-1">
                    <span>{it.qty} × {it.emoji} {it.name}</span>
                    <span className="font-semibold">{formatNaira(it.price * it.qty)}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => toast.success("Printing receipt…")}><Printer className="w-4 h-4" /> Print</Button>
                <Button className="btn-gold flex-1" onClick={() => setReceiptOpen(false)}>New Order</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Cash drawer modal */}
      <Dialog open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DialogContent className="max-w-md bg-card border-border/50">
          <DialogHeader><DialogTitle>Cash Drawer</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="glass-card rounded-2xl p-3">
                <div className="text-[10px] text-muted-foreground uppercase">Opening balance</div>
                <div className="font-display font-bold text-lg">{formatNaira(50_000)}</div>
              </div>
              <div className="glass-card rounded-2xl p-3">
                <div className="text-[10px] text-muted-foreground uppercase">Cash sales</div>
                <div className="font-display font-bold text-lg text-emerald-400">{formatNaira(184_500)}</div>
              </div>
              <div className="glass-card rounded-2xl p-3">
                <div className="text-[10px] text-muted-foreground uppercase">Refunds paid</div>
                <div className="font-display font-bold text-lg text-red-400">{formatNaira(4_500)}</div>
              </div>
              <div className="glass-card rounded-2xl p-3 bg-gradient-to-br from-[var(--gold)]/15 to-transparent">
                <div className="text-[10px] text-muted-foreground uppercase">Expected</div>
                <div className="font-display font-bold text-lg text-gold-gradient">{formatNaira(230_000)}</div>
              </div>
            </div>
            <Button className="btn-gold w-full" onClick={() => { setDrawerOpen(false); toast.success("Drawer opened"); }}>
              <Unlock className="w-4 h-4" /> Open drawer physically
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Split bill */}
      <Dialog open={splitOpen} onOpenChange={setSplitOpen}>
        <DialogContent className="max-w-md bg-card border-border/50">
          <DialogHeader><DialogTitle>Split bill</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              {[2, 3, 4].map(n => (
                <button key={n} className="glass-card rounded-2xl p-3 hover:glass-gold text-center">
                  <div className="font-display font-bold text-lg">{n} ways</div>
                  <div className="text-xs text-muted-foreground">{formatNaira(Math.round(total / n))} each</div>
                </button>
              ))}
            </div>
            <Button className="btn-gold w-full" onClick={() => { setSplitOpen(false); toast.success("Bill split into 2 — both paid"); }}>Confirm split</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Refund */}
      <Dialog open={refundOpen} onOpenChange={setRefundOpen}>
        <DialogContent className="max-w-md bg-card border-border/50">
          <DialogHeader><DialogTitle>Process refund</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <Input placeholder="Order code (e.g. SK48291)" />
            <Input placeholder="Refund amount (₦)" type="number" />
            <textarea placeholder="Reason for refund…" rows={2} className="w-full bg-input/50 border border-border/50 rounded-lg p-2.5 text-sm resize-none" />
            <Button className="btn-gold w-full" onClick={() => { setRefundOpen(false); toast.success("Refund processed · awaiting manager approval"); }}>Submit refund request</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Shift close */}
      <Dialog open={shiftCloseOpen} onOpenChange={setShiftCloseOpen}>
        <DialogContent className="max-w-md bg-card border-border/50">
          <DialogHeader><DialogTitle>Shift reconciliation</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="glass-card rounded-2xl p-4 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Cashier</span><span className="font-semibold">{user?.name}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Shift started</span><span>08:00 AM</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Orders processed</span><span>47</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Cash sales</span><span className="text-emerald-400">{formatNaira(184_500)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Card sales</span><span className="text-emerald-400">{formatNaira(612_000)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Refunds</span><span className="text-red-400">{formatNaira(4_500)}</span></div>
              <div className="flex justify-between font-bold pt-2 border-t border-border/50"><span>Expected in drawer</span><span className="text-gold-gradient">{formatNaira(230_000)}</span></div>
            </div>
            <Input placeholder="Counted cash in drawer" type="number" />
            <Button className="btn-gold w-full" onClick={() => { setShiftCloseOpen(false); setShiftOpen(false); toast.success("Shift closed · reconciliation saved"); }}>
              <Lock className="w-4 h-4" /> Close shift & lock drawer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function CatPill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick}
      className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${active ? "btn-gold" : "glass text-muted-foreground hover:text-foreground"}`}>
      {label}
    </button>
  );
}
