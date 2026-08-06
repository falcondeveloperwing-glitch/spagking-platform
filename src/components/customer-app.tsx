"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/lib/store";
import { CustomerHome } from "@/components/customer/home";
import { CustomerMenu } from "@/components/customer/menu";
import { CustomerMealDetails } from "@/components/customer/meal-details";
import { CustomerCheckout } from "@/components/customer/checkout";
import { CustomerTracking } from "@/components/customer/tracking";
import { CustomerHistory } from "@/components/customer/history";
import { CustomerProfile } from "@/components/customer/profile";
import { CustomerQROrdering } from "@/components/customer/qr-ordering";
import { CustomerLoyalty } from "@/components/customer/loyalty";
import { CustomerCommunity } from "@/components/customer/community";
import { CustomerKitchenLive } from "@/components/customer/kitchen-live";
import { CartSheet } from "@/components/customer/cart-sheet";
import { GlobalSearch } from "@/components/shared/search";
import { NotificationBell } from "@/components/shared/notifications";
import { AIAssistant } from "@/components/shared/ai-assistant";
import { Celebration } from "@/components/shared/celebration";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Bell, Search, ShoppingCart, Home, Menu as MenuIcon, Receipt, User, Sparkles, Crown, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function CustomerApp() {
  const user = useStore(s => s.user);
  const view = useStore(s => s.customerView);
  const setView = useStore(s => s.setCustomerView);
  const cart = useStore(s => s.cart);
  const cartOpen = useStore(s => s.cartOpen);
  const setCartOpen = useStore(s => s.setCartOpen);
  const setSearchOpen = useStore(s => s.setSearchOpen);
  const aiOpen = useStore(s => s.aiOpen);
  const setAiOpen = useStore(s => s.setAiOpen);
  const logout = useStore(s => s.logout);
  const notifications = useStore(s => s.notifications);
  const unread = notifications.filter(n => !n.read).length;

  const navItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "menu", label: "Menu", icon: MenuIcon },
    { id: "cart", label: "Cart", icon: ShoppingCart, badge: cart.length },
    { id: "loyalty", label: "Rewards", icon: Crown },
    { id: "profile", label: "Profile", icon: User },
  ] as const;

  return (
    <div className="min-h-screen bg-brand text-foreground relative">
      {/* Ambient floating gold particles */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        {[
          { left: "10%", top: "20%", delay: 0, size: 2 },
          { left: "80%", top: "30%", delay: 1.5, size: 3 },
          { left: "40%", top: "60%", delay: 0.8, size: 2 },
          { left: "65%", top: "75%", delay: 2.2, size: 2.5 },
          { left: "25%", top: "80%", delay: 1.2, size: 2 },
          { left: "90%", top: "55%", delay: 2.8, size: 2 },
        ].map((p, i) => (
          <motion.div key={i}
            className="absolute rounded-full bg-[var(--gold)]"
            style={{ left: p.left, top: p.top, width: p.size, height: p.size, boxShadow: "0 0 8px rgba(255,215,0,0.6)" }}
            animate={{ y: [0, -30, 0], opacity: [0, 0.7, 0] }}
            transition={{ duration: 8, repeat: Infinity, delay: p.delay, ease: "easeInOut" }}
          />
        ))}
      </div>

      {/* Top bar — frosted, slim, premium */}
      <header className="sticky top-0 z-40 px-4 sm:px-6 py-2.5 glass border-b border-border/40">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
          <button onClick={() => setView("home")} className="flex items-center gap-2.5 group">
            <img src="/spagking-logo.svg" alt="SpagKing" className="w-8 h-8 transition-transform group-hover:scale-105" />
            <span className="hidden sm:block wordmark text-xl">SpagKing</span>
          </button>

          <button onClick={() => setSearchOpen(true)}
            className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-foreground/[0.04] border border-border/50 text-sm text-muted-foreground hover:border-[var(--gold)]/30 hover:bg-foreground/[0.06] transition-all min-w-[280px]">
            <Search className="w-4 h-4" /> Search meals, orders, restaurants…
            <kbd className="ml-auto text-[10px] px-1.5 py-0.5 rounded bg-foreground/[0.06] border border-border/50 text-muted-foreground">⌘K</kbd>
          </button>

          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" onClick={() => setSearchOpen(true)} className="sm:hidden rounded-full h-9 w-9">
              <Search className="w-4.5 h-4.5" />
            </Button>
            <ThemeToggle compact />
            <NotificationBell />
            <Button variant="ghost" size="icon" onClick={() => setCartOpen(true)} className="relative rounded-full">
              <ShoppingCart className="w-5 h-5" />
              {cart.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[var(--gold)] text-black text-[10px] font-bold flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 pb-28 sm:pb-12">
        <AnimatePresence mode="wait">
          <motion.div key={view}
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}>
            {view === "home" && <CustomerHome />}
            {view === "menu" && <CustomerMenu />}
            {view === "meal" && <CustomerMealDetails />}
            {view === "checkout" && <CustomerCheckout />}
            {view === "tracking" && <CustomerTracking />}
            {view === "history" && <CustomerHistory />}
            {view === "profile" && <CustomerProfile />}
            {view === "qr" && <CustomerQROrdering />}
            {view === "loyalty" && <CustomerLoyalty />}
            {view === "community" && <CustomerCommunity />}
            {view === "kitchen" && <CustomerKitchenLive />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom navigation (mobile + tablet) — frosted, refined */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 glass border-t border-border/40 px-2 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
            const active = view === item.id || (item.id === "cart" && cartOpen);
            return (
              <button key={item.id}
                onClick={() => item.id === "cart" ? setCartOpen(true) : setView(item.id as any)}
                className={`relative flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-colors ${active ? "text-[var(--gold)]" : "text-muted-foreground"}`}>
                <item.icon className="w-5 h-5" />
                <span className="text-[10px] font-medium">{item.label}</span>
                {"badge" in item && item.badge ? (
                  <span className="absolute top-0.5 right-1 w-3.5 h-3.5 rounded-full bg-[var(--gold)] text-black text-[9px] font-bold flex items-center justify-center">
                    {item.badge}
                  </span>
                ) : null}
                {active && <motion.div layoutId="nav-dot" className="absolute -bottom-0.5 w-1 h-1 rounded-full bg-[var(--gold)]" />}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Desktop footer nav (optional - for desktop) */}
      <CartSheet />

      {/* Global search */}
      <GlobalSearch />

      {/* AI Assistant FAB — premium gold orb */}
      <motion.button
        onClick={() => setAiOpen(true)}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        className="fixed bottom-24 sm:bottom-6 right-4 sm:right-6 z-30 w-14 h-14 rounded-full btn-gold flex items-center justify-center group"
        aria-label="Ask SpagKing AI">
        <span className="absolute inset-0 rounded-full bg-gold-gradient opacity-40 blur-md group-hover:opacity-60 transition-opacity animate-glow-pulse" />
        <Sparkles className="w-5 h-5 relative" />
      </motion.button>
      <AIAssistant />
      <Celebration />
    </div>
  );
}
