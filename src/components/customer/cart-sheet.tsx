"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useStore, cartTotals } from "@/lib/store";
import { meals, formatNaira } from "@/lib/data";
import { MealImage } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Minus, Plus, Trash2, Tag, ShoppingBag, Sparkles, ArrowRight, Check } from "lucide-react";
import { toast } from "sonner";

export function CartSheet() {
  const open = useStore(s => s.cartOpen);
  const setOpen = useStore(s => s.setCartOpen);
  const cart = useStore(s => s.cart);
  const updateQty = useStore(s => s.updateCartQty);
  const removeItem = useStore(s => s.removeFromCart);
  const clearCart = useStore(s => s.clearCart);
  const coupon = useStore(s => s.coupon);
  const applyCoupon = useStore(s => s.applyCoupon);
  const removeCoupon = useStore(s => s.removeCoupon);
  const setView = useStore(s => s.setCustomerView);

  const [couponCode, setCouponCode] = useState("");
  const [tip, setTip] = useState(0);

  const totals = cartTotals(cart, coupon?.discount || 0, 1500);

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) return;
    if (applyCoupon(couponCode)) {
      toast.success(`Coupon ${couponCode.toUpperCase()} applied!`);
      setCouponCode("");
    } else {
      toast.error("Invalid coupon code. Try SPAG10, KING20, WELCOME, LAGOS15 or GOLD50");
    }
  };

  const handleCheckout = () => {
    if (cart.length === 0) { toast.error("Your cart is empty"); return; }
    setOpen(false);
    setView("checkout");
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className="w-full sm:max-w-md p-0 bg-card/95 backdrop-blur-xl border-l border-border/50">
        <SheetHeader className="px-5 pt-5 pb-3 border-b border-border/50">
          <SheetTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2 font-display">
              <ShoppingBag className="w-5 h-5 text-[var(--gold)]" /> Your Cart
            </span>
            {cart.length > 0 && (
              <button onClick={clearCart} className="text-xs text-muted-foreground hover:text-red-400 inline-flex items-center gap-1">
                <Trash2 className="w-3 h-3" /> Clear
              </button>
            )}
          </SheetTitle>
        </SheetHeader>

        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[70vh] px-8 text-center">
            <div className="text-6xl mb-4 animate-float">🛒</div>
            <h3 className="font-display font-bold text-lg mb-1">Your cart is empty</h3>
            <p className="text-sm text-muted-foreground mb-4">Add some delicious meals to get started</p>
            <Button onClick={() => { setOpen(false); setView("menu"); }} className="btn-gold">
              Browse menu <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <div className="flex flex-col h-[calc(100vh-80px)]">
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
              <AnimatePresence>
                {cart.map((item, idx) => (
                  <motion.div key={`${item.mealId}-${item.size}-${idx}`}
                    initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30, height: 0 }}
                    className="flex gap-3 glass-card rounded-xl p-2.5">
                    <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0">
                      <MealImage src={item.image} emoji={item.emoji} alt={item.name} className="w-full h-full" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-semibold text-sm line-clamp-1">{item.name}</h4>
                        <button onClick={() => removeItem(idx)} className="text-muted-foreground hover:text-red-400 shrink-0">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="text-[11px] text-muted-foreground mb-1.5">
                        {item.size}{item.toppings?.length ? ` · ${item.toppings.join(", ")}` : ""}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 bg-muted/50 rounded-lg p-0.5">
                          <button onClick={() => updateQty(idx, item.qty - 1)} className="w-6 h-6 rounded flex items-center justify-center hover:bg-muted">
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center text-xs font-semibold">{item.qty}</span>
                          <button onClick={() => updateQty(idx, item.qty + 1)} className="w-6 h-6 rounded flex items-center justify-center hover:bg-muted">
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <span className="font-bold text-sm text-[var(--gold)]">{formatNaira(item.price * item.qty)}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Coupons + tips + totals */}
            <div className="border-t border-border/50 px-5 py-4 space-y-3 bg-background/40">
              {/* Coupon */}
              {coupon ? (
                <div className="flex items-center justify-between p-2.5 rounded-lg glass-gold">
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--gold)]">
                    <Check className="w-3.5 h-3.5" /> {coupon.code} applied ({Math.round(coupon.discount * 100)}% off)
                  </span>
                  <button onClick={removeCoupon} className="text-xs text-muted-foreground hover:text-foreground"><X className="w-3.5 h-3.5" /></button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                    <Input value={couponCode} onChange={(e) => setCouponCode(e.target.value)} placeholder="Coupon code"
                      className="pl-9 h-9 text-xs bg-input/50" />
                  </div>
                  <Button size="sm" onClick={handleApplyCoupon} variant="outline" className="h-9">Apply</Button>
                </div>
              )}

              {/* Tips */}
              <div>
                <div className="text-xs text-muted-foreground mb-1.5">Add a tip for your rider</div>
                <div className="grid grid-cols-5 gap-1.5">
                  {[0, 200, 500, 1000, 2000].map(t => (
                    <button key={t} onClick={() => setTip(t)}
                      className={`py-1.5 rounded-lg text-xs font-medium transition-all ${tip === t ? "btn-gold" : "bg-muted/50 text-muted-foreground hover:bg-muted"}`}>
                      {t === 0 ? "None" : formatNaira(t)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Totals */}
              <div className="space-y-1 text-xs">
                <div className="flex justify-between text-muted-foreground"><span>Subtotal</span><span>{formatNaira(totals.subtotal)}</span></div>
                {totals.discount > 0 && <div className="flex justify-between text-emerald-400"><span>Discount</span><span>-{formatNaira(totals.discount)}</span></div>}
                <div className="flex justify-between text-muted-foreground"><span>VAT (7.5%)</span><span>{formatNaira(totals.vat)}</span></div>
                <div className="flex justify-between text-muted-foreground"><span>Delivery fee</span><span>{formatNaira(totals.deliveryFee)}</span></div>
                {tip > 0 && <div className="flex justify-between text-muted-foreground"><span>Rider tip</span><span>{formatNaira(tip)}</span></div>}
                <div className="flex justify-between font-bold text-sm pt-1.5 border-t border-border/50">
                  <span>Total</span><span className="text-gold-gradient">{formatNaira(totals.total + tip)}</span>
                </div>
              </div>

              <Button onClick={handleCheckout} className="btn-gold w-full h-11">
                Checkout · {formatNaira(totals.total + tip)} <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
