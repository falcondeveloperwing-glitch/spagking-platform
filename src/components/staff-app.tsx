"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SpagKingLogo } from "@/components/brand";
import { useStore } from "@/lib/store";
import { ExecutiveDashboard } from "@/components/staff/executive";
import { POSDashboard } from "@/components/staff/pos";
import { InventoryDashboard } from "@/components/staff/inventory";
import { StaffDashboard } from "@/components/staff/staff-mgmt";
import { ReportsDashboard } from "@/components/staff/reports";
import { CRMDashboard } from "@/components/staff/crm";
import { DeliveryDashboard } from "@/components/staff/delivery";
import { AdminDashboard } from "@/components/staff/admin";
import { GlobalSearch } from "@/components/shared/search";
import { NotificationBell } from "@/components/shared/notifications";
import { AIAssistant } from "@/components/shared/ai-assistant";
import {
  LayoutDashboard, ShoppingCart, Boxes, Users, BarChart3, Heart,
  Truck, ShieldCheck, Search, Sparkles, LogOut, Menu as MenuIcon, X, Bell,
} from "lucide-react";
import type { Role } from "@/lib/data";
import { Button } from "@/components/ui/button";

const NAV: { id: string; label: string; icon: any; roles: Role[] }[] = [
  { id: "executive", label: "Executive", icon: LayoutDashboard, roles: ["ceo", "manager", "admin"] },
  { id: "pos", label: "POS Terminal", icon: ShoppingCart, roles: ["cashier", "manager", "admin"] },
  { id: "inventory", label: "Inventory", icon: Boxes, roles: ["inventory", "manager", "admin"] },
  { id: "staff", label: "Staff & HR", icon: Users, roles: ["hr", "manager", "admin"] },
  { id: "reports", label: "Reports", icon: BarChart3, roles: ["manager", "admin", "ceo"] },
  { id: "crm", label: "CRM", icon: Heart, roles: ["manager", "admin", "ceo"] },
  { id: "delivery", label: "Delivery", icon: Truck, roles: ["rider", "manager", "admin"] },
  { id: "admin", label: "Admin Panel", icon: ShieldCheck, roles: ["admin", "ceo"] },
];

export function StaffApp() {
  const user = useStore(s => s.user)!;
  const view = useStore(s => s.staffView);
  const setView = useStore(s => s.setStaffView);
  const setSearchOpen = useStore(s => s.setSearchOpen);
  const setAiOpen = useStore(s => s.setAiOpen);
  const logout = useStore(s => s.logout);
  const [mobileNav, setMobileNav] = useState(false);

  const allowed = NAV.filter(n => n.roles.includes(user.role));

  return (
    <div className="min-h-screen bg-matte text-foreground flex">
      {/* Sidebar (desktop) */}
      <aside className="hidden lg:flex flex-col w-64 shrink-0 glass border-r border-border/50 fixed inset-y-0 left-0 z-30">
        <div className="p-5 border-b border-border/50">
          <SpagKingLogo size={36} />
        </div>
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {allowed.map(item => (
            <NavButton key={item.id} active={view === item.id} onClick={() => setView(item.id as any)} icon={item.icon} label={item.label} />
          ))}
        </nav>
        <div className="p-3 border-t border-border/50">
          <button onClick={() => setAiOpen(true)} className="w-full flex items-center gap-2 p-2.5 rounded-xl glass-gold text-[var(--gold)] text-sm font-medium hover:scale-[1.02] transition-transform mb-2">
            <Sparkles className="w-4 h-4" /> Ask SpagKing AI
          </button>
          <div className="flex items-center gap-2 p-2">
            <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-lg bg-muted" />
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold truncate">{user.name}</div>
              <div className="text-[10px] text-muted-foreground capitalize">{user.role}{user.branch ? ` · ${user.branch.split("SpagKing ")[1] || user.branch}` : ""}</div>
            </div>
            <button onClick={logout} className="text-muted-foreground hover:text-red-400 p-1.5"><LogOut className="w-4 h-4" /></button>
          </div>
        </div>
      </aside>

      {/* Mobile nav drawer */}
      <AnimatePresence>
        {mobileNav && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMobileNav(false)} className="fixed inset-0 bg-black/60 z-40 lg:hidden" />
            <motion.aside initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              className="fixed inset-y-0 left-0 w-64 glass border-r border-border/50 z-50 lg:hidden flex flex-col">
              <div className="p-4 border-b border-border/50 flex items-center justify-between">
                <SpagKingLogo size={32} />
                <button onClick={() => setMobileNav(false)}><X className="w-5 h-5" /></button>
              </div>
              <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
                {allowed.map(item => (
                  <NavButton key={item.id} active={view === item.id} onClick={() => { setView(item.id as any); setMobileNav(false); }} icon={item.icon} label={item.label} />
                ))}
              </nav>
              <div className="p-3 border-t border-border/50">
                <div className="flex items-center gap-2 p-2">
                  <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-lg bg-muted" />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold truncate">{user.name}</div>
                    <div className="text-[10px] text-muted-foreground capitalize">{user.role}</div>
                  </div>
                  <button onClick={logout} className="text-muted-foreground hover:text-red-400 p-1.5"><LogOut className="w-4 h-4" /></button>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="flex-1 lg:ml-64 flex flex-col min-w-0">
        <header className="sticky top-0 z-20 px-4 sm:px-6 py-3 glass border-b border-border/50">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button onClick={() => setMobileNav(true)} className="lg:hidden p-2 rounded-lg hover:bg-muted/50">
                <MenuIcon className="w-5 h-5" />
              </button>
              <div>
                <h1 className="font-display font-bold text-lg leading-none">
                  {NAV.find(n => n.id === view)?.label || "Dashboard"}
                </h1>
                <p className="text-[10px] text-muted-foreground hidden sm:block">
                  {new Date().toLocaleDateString("en-NG", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <Button variant="ghost" size="icon" onClick={() => setSearchOpen(true)} className="rounded-full">
                <Search className="w-5 h-5" />
              </Button>
              <NotificationBell />
              <div className="hidden sm:flex items-center gap-2 ml-2 pl-3 border-l border-border/50">
                <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-lg bg-muted" />
                <div className="text-xs">
                  <div className="font-semibold leading-none">{user.name.split(" ")[0]}</div>
                  <div className="text-[10px] text-muted-foreground capitalize">{user.role}</div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6">
          <AnimatePresence mode="wait">
            <motion.div key={view}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}>
              {view === "executive" && <ExecutiveDashboard />}
              {view === "pos" && <POSDashboard />}
              {view === "inventory" && <InventoryDashboard />}
              {view === "staff" && <StaffDashboard />}
              {view === "reports" && <ReportsDashboard />}
              {view === "crm" && <CRMDashboard />}
              {view === "delivery" && <DeliveryDashboard />}
              {view === "admin" && <AdminDashboard />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <GlobalSearch />
      <AIAssistant />

      {/* AI FAB */}
      <button onClick={() => setAiOpen(true)}
        className="fixed bottom-6 right-6 z-30 w-14 h-14 rounded-full btn-gold shadow-2xl flex items-center justify-center animate-float"
        aria-label="AI Assistant">
        <Sparkles className="w-6 h-6" />
      </button>
    </div>
  );
}

function NavButton({ active, onClick, icon: Icon, label }: { active: boolean; onClick: () => void; icon: any; label: string }) {
  return (
    <button onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${active ? "glass-gold text-[var(--gold)]" : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"}`}>
      <Icon className="w-4 h-4" /> {label}
      {active && <motion.div layoutId="nav-active" className="ml-auto w-1.5 h-1.5 rounded-full bg-[var(--gold)]" />}
    </button>
  );
}
