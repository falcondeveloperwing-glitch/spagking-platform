"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore, type RestaurantTable, type TableStatus } from "@/lib/store";
import { meals, formatNaira } from "@/lib/data";
import { MealImage } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Users, Clock, Plus, ShoppingCart, Receipt, RotateCcw, X, ArrowRight, Check, Utensils, ChefHat } from "lucide-react";

const STATUS_CONFIG: Record<TableStatus, { label: string; cls: string; dot: string }> = {
  available: { label: "Available", cls: "border-[var(--success)]/20 bg-[var(--success)]/5", dot: "bg-[var(--success)]" },
  occupied: { label: "Occupied", cls: "border-[var(--gold)]/20 bg-[var(--gold)]/5", dot: "bg-[var(--gold)]" },
  reserved: { label: "Reserved", cls: "border-[var(--chart-3)]/20 bg-[var(--chart-3)]/5", dot: "bg-[var(--chart-3)]" },
  ordering: { label: "Ordering", cls: "border-[var(--gold)]/30 bg-[var(--gold)]/8", dot: "bg-[var(--gold)] pulse-dot" },
  preparing: { label: "Preparing", cls: "border-[var(--warning)]/20 bg-[var(--warning)]/5", dot: "bg-[var(--warning)] pulse-dot" },
  ready: { label: "Ready", cls: "border-[var(--success)]/30 bg-[var(--success)]/8", dot: "bg-[var(--success)] pulse-dot" },
  bill_requested: { label: "Bill Requested", cls: "border-[var(--chart-5)]/20 bg-[var(--chart-5)]/5", dot: "bg-[var(--chart-5)]" },
  payment_pending: { label: "Payment", cls: "border-[var(--error)]/20 bg-[var(--error)]/5", dot: "bg-[var(--error)]" },
  cleaning: { label: "Cleaning", cls: "border-muted bg-muted/20", dot: "bg-muted-foreground" },
  maintenance: { label: "Maintenance", cls: "border-[var(--error)]/10 bg-[var(--error)]/3", dot: "bg-[var(--error)]" },
};

export function TablesDashboard() {
  const tables = useStore(s => s.restaurantTables);
  const openTable = useStore(s => s.openTable);
  const addTableOrder = useStore(s => s.addTableOrder);
  const updateTableStatus = useStore(s => s.updateTableStatus);
  const closeTable = useStore(s => s.closeTable);
  const sendToKitchen = useStore(s => s.sendToKitchen);
  const resetTables = useStore(s => s.resetTables);
  const user = useStore(s => s.user);

  const [selectedTableId, setSelectedTableId] = useState<string | null>(null);
  const selectedTable = tables.find(t => t.id === selectedTableId) || null;
  const [orderModal, setOrderModal] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [tableQuery, setTableQuery] = useState("");
  const [cart, setCart] = useState<{ mealId: string; name: string; emoji: string; price: number; qty: number }[]>([]);
  const [mealQuery, setMealQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredMeals = meals.filter(m =>
    (activeCategory === "All" || m.category === activeCategory) &&
    m.name.toLowerCase().includes(mealQuery.toLowerCase())
  );

  const categories = ["All", "Spaghetti", "Rice", "Shawarma", "Burgers", "Drinks", "Soups", "Desserts"];
  const filteredTables = tables.filter(t => t.number.toLowerCase().includes(tableQuery.toLowerCase()));
  const stats = {
    available: tables.filter(t => t.status === "available").length,
    occupied: tables.filter(t => ["ordering", "preparing", "ready", "occupied"].includes(t.status)).length,
    cleaning: tables.filter(t => t.status === "cleaning").length,
    revenue: tables.reduce((s, t) => s + t.orderTotal, 0),
  };

  const handleOpenTable = () => {
    if (!selectedTable || !customerName.trim()) { toast.error("Enter customer name"); return; }
    openTable(selectedTable.id, customerName, user?.name || "Staff");
    toast.success(`${selectedTable.number} opened for ${customerName}`);
    setOpenModal(false);
    setCustomerName("");
    setSelectedTableId(null);
  };

  const handleAddOrder = () => {
    if (!selectedTable || cart.length === 0) { toast.error("Add at least one item"); return; }
    addTableOrder(selectedTable.id, cart);
    toast.success(`${cart.length} items added to ${selectedTable.number}`);
    setCart([]);
    setOrderModal(false);
  };

  const handleSendKitchen = (tableId: string) => {
    sendToKitchen(tableId);
    toast.success("Order sent to kitchen display");
  };

  const handleRequestBill = (tableId: string) => {
    updateTableStatus(tableId, "bill_requested");
    toast.success("Bill requested — POS notified");
  };

  const handleCloseTable = (tableId: string) => {
    closeTable(tableId);
    toast.success("Table closed — now cleaning");
    setSelectedTableId(null);
  };

  const handleSetAvailable = (tableId: string) => {
    updateTableStatus(tableId, "available");
    toast.success("Table available");
    setSelectedTableId(null);
  };

  const elapsed = (ts?: number) => {
    if (!ts) return "—";
    const mins = Math.floor((Date.now() - ts) / 60000);
    if (mins < 60) return `${mins}m`;
    return `${Math.floor(mins / 60)}h ${mins % 60}m`;
  };

  return (
    <div className="space-y-5">
      {/* Header + stats */}
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">Table Management</h1>
          <p className="text-sm text-muted-foreground">{tables.length} tables · {stats.available} available · {stats.occupied} active</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => { resetTables(); toast.success("All tables reset"); }}>
            <RotateCcw className="w-3.5 h-3.5" /> Reset
          </Button>
        </div>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Available", value: stats.available, color: "text-[var(--success)]" },
          { label: "Active", value: stats.occupied, color: "text-[var(--gold)]" },
          { label: "Cleaning", value: stats.cleaning, color: "text-muted-foreground" },
          { label: "Table Revenue", value: formatNaira(stats.revenue), color: "text-[var(--gold)]" },
        ].map(k => (
          <div key={k.label} className="glass-card rounded-xl p-3">
            <div className={`font-display font-bold text-lg ${k.color} num`}>{k.value}</div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wide">{k.label}</div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-xs">
        <Input value={tableQuery} onChange={e => setTableQuery(e.target.value)} placeholder="Search tables…" className="h-9 bg-input/50" />
      </div>

      {/* Tables grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
        {filteredTables.map((table, i) => {
          const cfg = STATUS_CONFIG[table.status];
          return (
            <motion.div
              key={table.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              onClick={() => setSelectedTableId(table.id)}
              className={`glass-card rounded-2xl p-4 cursor-pointer card-hover border-2 ${cfg.cls}`}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="font-display font-bold text-lg">{table.number}</div>
                  <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <Users className="w-2.5 h-2.5" /> {table.capacity} seats
                  </div>
                </div>
                <div className={`w-2.5 h-2.5 rounded-full ${cfg.dot}`} />
              </div>
              <div className="text-[10px] font-semibold uppercase tracking-wide mb-2">{cfg.label}</div>
              {table.customerName && (
                <div className="text-xs font-medium truncate">{table.customerName}</div>
              )}
              {table.orderTotal > 0 && (
                <div className="text-xs font-bold text-[var(--gold)] mt-1 num">{formatNaira(table.orderTotal)}</div>
              )}
              {table.openedAt && (
                <div className="text-[9px] text-muted-foreground flex items-center gap-0.5 mt-1">
                  <Clock className="w-2.5 h-2.5" /> {elapsed(table.openedAt)}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Table detail modal */}
      <Dialog open={!!selectedTable} onOpenChange={(v) => !v && setSelectedTableId(null)}>
        <DialogContent aria-describedby={undefined} className="max-w-md bg-card border-border/50">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>{selectedTable?.number} · {selectedTable && STATUS_CONFIG[selectedTable.status].label}</span>
              {selectedTable && <span className="text-xs text-muted-foreground">{selectedTable.section}</span>}
            </DialogTitle>
          </DialogHeader>
          {selectedTable && (
            <div className="space-y-3">
              {selectedTable.customerName && (
                <div className="text-sm">
                  <span className="text-muted-foreground">Customer:</span> {selectedTable.customerName}
                </div>
              )}
              {selectedTable.serverName && (
                <div className="text-sm">
                  <span className="text-muted-foreground">Server:</span> {selectedTable.serverName}
                </div>
              )}

              {/* Order items */}
              {selectedTable.orderItems.length > 0 && (
                <div className="glass-card rounded-xl p-3 max-h-40 overflow-y-auto">
                  {selectedTable.orderItems.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs py-1">
                      <span>{item.qty}× {item.emoji} {item.name}</span>
                      <span className="font-semibold num">{formatNaira(item.price * item.qty)}</span>
                    </div>
                  ))}
                  <div className="border-t border-border/40 mt-2 pt-2 flex justify-between font-bold text-sm">
                    <span>Total</span>
                    <span className="text-[var(--gold)] num">{formatNaira(selectedTable.orderTotal)}</span>
                  </div>
                </div>
              )}

              {/* Actions based on status */}
              <div className="space-y-2">
                {selectedTable.status === "available" && (
                  <Button className="btn-gold w-full" onClick={() => setOpenModal(true)}>
                    <Plus className="w-4 h-4" /> Open Table
                  </Button>
                )}
                {(selectedTable.status === "ordering" || selectedTable.status === "occupied") && (
                  <>
                    <Button className="btn-gold w-full" onClick={() => setOrderModal(true)}>
                      <ShoppingCart className="w-4 h-4" /> Add Order
                    </Button>
                    {selectedTable.orderItems.length > 0 && selectedTable.status === "ordering" && (
                      <Button variant="outline" className="w-full" onClick={() => handleSendKitchen(selectedTable.id)}>
                        <ChefHat className="w-4 h-4" /> Send to Kitchen
                      </Button>
                    )}
                  </>
                )}
                {selectedTable.status === "ready" && (
                  <Button className="btn-gold w-full" onClick={() => updateTableStatus(selectedTable.id, "occupied")}>
                    <Check className="w-4 h-4" /> Mark Served
                  </Button>
                )}
                {(selectedTable.status === "occupied" || selectedTable.status === "ready") && selectedTable.orderItems.length > 0 && (
                  <Button variant="outline" className="w-full" onClick={() => handleRequestBill(selectedTable.id)}>
                    <Receipt className="w-4 h-4" /> Request Bill
                  </Button>
                )}
                {selectedTable.status === "bill_requested" && (
                  <Button className="btn-gold w-full" onClick={() => updateTableStatus(selectedTable.id, "payment_pending")}>
                    <Receipt className="w-4 h-4" /> Process Payment
                  </Button>
                )}
                {selectedTable.status === "payment_pending" && (
                  <Button className="btn-gold w-full" onClick={() => handleCloseTable(selectedTable.id)}>
                    <Check className="w-4 h-4" /> Complete & Close
                  </Button>
                )}
                {selectedTable.status === "cleaning" && (
                  <Button className="btn-gold w-full" onClick={() => handleSetAvailable(selectedTable.id)}>
                    <Check className="w-4 h-4" /> Mark Available
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Open table modal */}
      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent aria-describedby={undefined} className="max-w-sm bg-card border-border/50">
          <DialogHeader><DialogTitle>Open {selectedTable?.number}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <Input value={customerName} onChange={e => setCustomerName(e.target.value)} placeholder="Customer name" className="bg-input/50" />
            <Button className="btn-gold w-full" onClick={handleOpenTable}>
              <Plus className="w-4 h-4" /> Open Table
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add order modal */}
      <Dialog open={orderModal} onOpenChange={setOrderModal}>
        <DialogContent aria-describedby={undefined} className="max-w-lg bg-card border-border/50">
          <DialogHeader><DialogTitle>Add Order to {selectedTable?.number}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <Input value={mealQuery} onChange={e => setMealQuery(e.target.value)} placeholder="Search meals…" className="bg-input/50" />
            <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
              {categories.map(c => (
                <button key={c} onClick={() => setActiveCategory(c)}
                  className={`shrink-0 px-2.5 py-1 rounded-full text-[10px] font-medium ${activeCategory === c ? "btn-gold" : "bg-muted/40 text-muted-foreground"}`}>
                  {c}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
              {filteredMeals.slice(0, 12).map(m => {
                const inCart = cart.find(c => c.mealId === m.id);
                return (
                  <button key={m.id} onClick={() => {
                    if (inCart) {
                      setCart(prev => prev.map(c => c.mealId === m.id ? { ...c, qty: c.qty + 1 } : c));
                    } else {
                      setCart(prev => [...prev, { mealId: m.id, name: m.name, emoji: m.emoji, price: m.price, qty: 1 }]);
                    }
                  }} className="flex items-center gap-2 p-2 rounded-lg glass-card text-left hover:glass-gold transition-all">
                    <span className="text-lg">{m.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium line-clamp-1">{m.name}</div>
                      <div className="text-[10px] text-[var(--gold)] num">{formatNaira(m.price)}</div>
                    </div>
                    {inCart && <span className="text-xs font-bold text-[var(--gold)]">{inCart.qty}</span>}
                  </button>
                );
              })}
            </div>
            {cart.length > 0 && (
              <div className="glass-card rounded-xl p-2 space-y-1 max-h-24 overflow-y-auto">
                {cart.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs">
                    <span>{item.qty}× {item.emoji} {item.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold num">{formatNaira(item.price * item.qty)}</span>
                      <button onClick={() => setCart(prev => prev.filter((_, i) => i !== idx))}>
                        <X className="w-3 h-3 text-muted-foreground" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <Button className="btn-gold w-full" onClick={handleAddOrder} disabled={cart.length === 0}>
              Add {cart.length} item{cart.length !== 1 ? "s" : ""} to {selectedTable?.number}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
