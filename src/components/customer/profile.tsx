"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, CreditCard, Heart, Bell, Moon, Settings, LogOut, ChevronRight, Star, Award, Gift, Crown, Smartphone, Sparkles } from "lucide-react";
import { useStore } from "@/lib/store";
import { meals, formatNaira } from "@/lib/data";
import { MealImage } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { toast } from "sonner";

export function CustomerProfile() {
  const user = useStore(s => s.user);
  const favorites = useStore(s => s.favorites);
  const myOrders = useStore(s => s.myOrders);
  const logout = useStore(s => s.logout);
  const themeMode = useStore(s => s.themeMode);
  const [section, setSection] = useState<"overview" | "addresses" | "favorites" | "payments" | "notifications" | "settings">("overview");

  const favMeals = meals.filter(m => favorites.includes(m.id));
  const totalSpent = myOrders.reduce((s, o) => s + o.total, 0);
  const loyaltyPoints = useStore(s => s.loyaltyPoints);
  const loyaltyTier = useStore(s => s.loyaltyTier);

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-4">
        <img src={user?.avatar} alt={user?.name} className="w-20 h-20 rounded-2xl bg-muted ring-2 ring-[var(--gold)]/40" />
        <div className="flex-1">
          <h1 className="font-display text-2xl font-extrabold">{user?.name}</h1>
          <p className="text-sm text-muted-foreground">{user?.email}</p>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold glass-gold text-[var(--gold)]">
              <Crown className="w-3 h-3" /> Gold member
            </span>
            <span className="text-xs text-muted-foreground">{loyaltyPoints.toLocaleString()} pts</span>
          </div>
        </div>
      </div>

      {/* Loyalty card */}
      <motion.button onClick={() => useStore.getState().setCustomerView("loyalty")}
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -2 }}
        className="relative w-full rounded-2xl p-5 bg-gold-shimmer text-black overflow-hidden text-left">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.4),transparent_50%)]" />
        <div className="relative flex items-center justify-between">
          <div>
            <div className="text-xs font-bold opacity-70 mb-1">SPAGKING REWARDS</div>
            <div className="font-display text-3xl font-extrabold num">{loyaltyPoints.toLocaleString()} pts</div>
            <div className="text-xs opacity-70 mt-1">{2500 - loyaltyPoints > 0 ? `${2500 - loyaltyPoints} pts to King VIP` : "You're King VIP! 👑"}</div>
          </div>
          <Award className="w-14 h-14 opacity-80" />
        </div>
        <div className="relative mt-3 h-2 rounded-full bg-black/20 overflow-hidden">
          <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(100, (loyaltyPoints / 2500) * 100)}%` }} transition={{ delay: 0.3, duration: 0.8 }}
            className="h-full bg-black rounded-full" />
        </div>
        <div className="relative mt-2 text-[10px] opacity-70">Tap to view rewards & daily bonuses →</div>
      </motion.button>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-3">
        <Stat icon={Star} label="Orders" value={myOrders.length.toString()} color="text-amber-400" />
        <Stat icon={Gift} label="Rewards" value="3" color="text-emerald-400" />
        <Stat icon={Crown} label="Tier" value={loyaltyTier} color="text-[var(--gold)]" />
      </div>

      {/* Menu */}
      <div className="glass-card rounded-2xl overflow-hidden divide-y divide-border/50">
        <Row icon={Crown} label="SpagKing Rewards" desc={`${loyaltyPoints.toLocaleString()} pts · ${loyaltyTier} tier`} onClick={() => useStore.getState().setCustomerView("loyalty")} />
        <Row icon={Heart} label="Favorite meals" desc={`${favMeals.length} meals`} onClick={() => setSection("favorites")} />
        <Row icon={MapPin} label="Saved addresses" desc="2 saved · Victoria Island, Lekki" onClick={() => setSection("addresses")} />
        <Row icon={CreditCard} label="Payment methods" desc="2 cards · Paystack · Flutterwave" onClick={() => setSection("payments")} />
        <Row icon={Sparkles} label="SpagKing Community" desc="TikTok · Instagram · Facebook · YouTube" onClick={() => useStore.getState().setCustomerView("community")} />
        <Row icon={Bell} label="Notifications" desc="Push, email & SMS" onClick={() => setSection("notifications")} />
        <Row icon={Settings} label="Settings" desc="Privacy, language, currency" onClick={() => setSection("settings")} />
        <Row icon={Moon} label="Appearance" desc={`${themeMode === "system" ? "System" : themeMode === "dark" ? "Dark" : "Light"} theme`} right={<ThemeToggle />} />
        <Row icon={Smartphone} label="App version" desc="SpagKing v2.6.0 · Demo build" />
        <button onClick={logout} className="w-full flex items-center gap-3 p-4 text-left hover:bg-red-500/10 transition-colors text-red-400">
          <LogOut className="w-5 h-5" /> Sign out
        </button>
      </div>

      {/* Saved addresses section */}
      {section === "addresses" && (
        <Section title="Saved addresses" onClose={() => setSection("overview")}>
          {[
            { label: "Home", address: "12 Adeola Odeku St, Victoria Island, Lagos" },
            { label: "Work", address: "5 Adeyemo Alakija St, Lekki Phase 1, Lagos" },
          ].map((a, i) => (
            <div key={i} className="glass-card rounded-xl p-3 flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-[var(--gold)]/15 flex items-center justify-center">
                <MapPin className="w-4 h-4 text-[var(--gold)]" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold">{a.label}</div>
                <div className="text-xs text-muted-foreground">{a.address}</div>
              </div>
              <Button size="sm" variant="ghost" onClick={() => toast.success("Edit address")}>Edit</Button>
            </div>
          ))}
          <Button variant="outline" className="w-full" onClick={() => toast.success("Add new address")}>+ Add new address</Button>
        </Section>
      )}

      {/* Favorites section */}
      {section === "favorites" && (
        <Section title="Favorite meals" onClose={() => setSection("overview")}>
          {favMeals.length === 0 ? (
            <div className="text-center py-10">
              <div className="text-5xl mb-3 animate-float">🍜</div>
              <h4 className="font-display font-semibold text-sm mb-1">No favourites yet</h4>
              <p className="text-xs text-muted-foreground mb-4">Let's find your next favourite meal.</p>
              <Button size="sm" className="btn-gold" onClick={() => useStore.getState().setCustomerView("menu")}>Browse menu</Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {favMeals.map(m => (
                <div key={m.id} className="glass-card rounded-xl overflow-hidden cursor-pointer card-hover"
                  onClick={() => useStore.getState().setSelectedMeal(m.id)}>
                  <div className="aspect-square">
                    <MealImage src={m.image} emoji={m.emoji} alt={m.name} className="w-full h-full" />
                  </div>
                  <div className="p-2">
                    <div className="text-xs font-semibold line-clamp-1">{m.name}</div>
                    <div className="text-[10px] text-[var(--gold)] font-bold">{formatNaira(m.price)}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Section>
      )}

      {/* Payments section */}
      {section === "payments" && (
        <Section title="Payment methods" onClose={() => setSection("overview")}>
          <div className="space-y-2">
            <div className="glass-card rounded-xl p-4 flex items-center gap-3">
              <div className="w-10 h-7 rounded bg-gradient-to-br from-sky-500 to-blue-700" />
              <div className="flex-1">
                <div className="text-sm font-semibold">Visa •••• 4242</div>
                <div className="text-xs text-muted-foreground">Expires 09/27 · Default</div>
              </div>
              <Button size="sm" variant="ghost" onClick={() => toast.success("Edit card")}>Edit</Button>
            </div>
            <div className="glass-card rounded-xl p-4 flex items-center gap-3">
              <div className="w-10 h-7 rounded bg-gradient-to-br from-amber-500 to-orange-600" />
              <div className="flex-1">
                <div className="text-sm font-semibold">Mastercard •••• 8888</div>
                <div className="text-xs text-muted-foreground">Expires 03/26</div>
              </div>
              <Button size="sm" variant="ghost" onClick={() => toast.success("Edit card")}>Edit</Button>
            </div>
          </div>
          <Button variant="outline" className="w-full" onClick={() => toast.success("Add new card")}>+ Add new card</Button>
        </Section>
      )}
    </div>
  );
}

function Stat({ icon: Icon, label, value, color }: { icon: any; label: string; value: string; color: string }) {
  return (
    <div className="glass-card rounded-xl p-3 text-center">
      <Icon className={`w-5 h-5 mx-auto mb-1 ${color}`} />
      <div className="font-display font-bold text-lg">{value}</div>
      <div className="text-[10px] text-muted-foreground uppercase tracking-wide">{label}</div>
    </div>
  );
}

function Row({ icon: Icon, label, desc, onClick, right }: { icon: any; label: string; desc: string; onClick?: () => void; right?: React.ReactNode }) {
  return (
    <button onClick={onClick} className="w-full flex items-center gap-3 p-4 text-left hover:bg-muted/40 transition-colors">
      <div className="w-9 h-9 rounded-lg bg-[var(--gold)]/15 flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4 text-[var(--gold)]" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold">{label}</div>
        <div className="text-xs text-muted-foreground line-clamp-1">{desc}</div>
      </div>
      {right || (onClick && <ChevronRight className="w-4 h-4 text-muted-foreground" />)}
    </button>
  );
}

function Section({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-bold">{title}</h3>
        <button onClick={onClose} className="text-xs text-muted-foreground hover:text-foreground">Close</button>
      </div>
      <div className="space-y-2">{children}</div>
    </motion.div>
  );
}
