"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Role, User, Meal, Order, AppNotification } from "./data";
import { demoUsers, meals, orders as allOrders, seedNotifications, customers, riders, employees, suppliers } from "./data";

export interface CartItem {
  mealId: string;
  name: string;
  emoji: string;
  image: string;
  price: number;
  qty: number;
  size?: string;
  toppings?: string[];
}

export type CustomerView =
  | "home" | "menu" | "meal" | "cart" | "checkout" | "tracking" | "history" | "profile" | "qr" | "loyalty" | "community";

export type StaffView =
  | "executive" | "pos" | "inventory" | "staff" | "reports" | "crm"
  | "delivery" | "admin" | "notifications" | "search";

interface AppState {
  // Splash
  splashDone: boolean;
  setSplashDone: () => void;

  // Auth
  user: User | null;
  login: (role: Role) => void;
  logout: () => void;

  // View routing
  customerView: CustomerView;
  staffView: StaffView;
  setCustomerView: (v: CustomerView) => void;
  setStaffView: (v: StaffView) => void;

  // Selected meal
  selectedMealId: string | null;
  setSelectedMeal: (id: string | null) => void;

  // Cart
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  updateCartQty: (idx: number, qty: number) => void;
  removeFromCart: (idx: number) => void;
  clearCart: () => void;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;

  // Favorites
  favorites: string[];
  toggleFavorite: (mealId: string) => void;

  // Orders (customer's orders)
  myOrders: Order[];
  placeOrder: (order: Order) => void;
  reorder: (orderId: string) => void;
  rateOrder: (orderId: string, rating: number, feedback?: string) => void;

  // Active tracked order
  trackingOrderId: string | null;
  setTrackingOrder: (id: string | null) => void;

  // Notifications
  notifications: AppNotification[];
  markAllRead: () => void;
  markRead: (id: string) => void;
  pushNotification: (n: Omit<AppNotification, "id" | "time" | "read">) => void;

  // Search
  searchOpen: boolean;
  setSearchOpen: (v: boolean) => void;
  globalQuery: string;
  setGlobalQuery: (q: string) => void;

  // AI Assistant
  aiOpen: boolean;
  setAiOpen: (v: boolean) => void;

  // Customer preferences
  darkMode: boolean;
  toggleDarkMode: () => void;

  // Applied coupon
  coupon: { code: string; discount: number } | null;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;

  // Loyalty & gamification
  loyaltyPoints: number;
  loyaltyTier: "Bronze" | "Silver" | "Gold" | "King";
  checkInStreak: number;
  lastCheckIn: string | null;
  spinAvailable: boolean;
  scratchAvailable: boolean;
  referralCode: string;
  referralsCount: number;
  addPoints: (n: number) => void;
  dailyCheckIn: () => void;
  spinWheel: () => { label: string; points: number; type: "points" | "coupon" | "nothing" };
  scratchCard: () => { label: string; points: number } | null;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      splashDone: false,
      setSplashDone: () => set({ splashDone: true }),

      user: null,
      login: (role) => set({ user: demoUsers[role], customerView: "home", staffView: role === "ceo" ? "executive" : role === "cashier" ? "pos" : role === "inventory" ? "inventory" : role === "hr" ? "staff" : role === "rider" ? "delivery" : role === "admin" ? "admin" : role === "manager" ? "executive" : "reports" }),
      logout: () => set({ user: null, cart: [], myOrders: [], customerView: "home", staffView: "executive" }),

      customerView: "home",
      staffView: "executive",
      setCustomerView: (v) => set({ customerView: v }),
      setStaffView: (v) => set({ staffView: v }),

      selectedMealId: null,
      setSelectedMeal: (id) => set({ selectedMealId: id, customerView: id ? "meal" : "menu" }),

      cart: [],
      addToCart: (item) => {
        const cart = [...get().cart];
        const existingIdx = cart.findIndex(c => c.mealId === item.mealId && c.size === item.size);
        if (existingIdx >= 0) {
          cart[existingIdx] = { ...cart[existingIdx], qty: cart[existingIdx].qty + item.qty };
        } else {
          cart.push(item);
        }
        set({ cart });
      },
      updateCartQty: (idx, qty) => {
        if (qty <= 0) { get().removeFromCart(idx); return; }
        const cart = [...get().cart];
        cart[idx] = { ...cart[idx], qty };
        set({ cart });
      },
      removeFromCart: (idx) => set({ cart: get().cart.filter((_, i) => i !== idx) }),
      clearCart: () => set({ cart: [] }),
      cartOpen: false,
      setCartOpen: (open) => set({ cartOpen: open }),

      favorites: [],
      toggleFavorite: (mealId) => {
        const favs = get().favorites;
        set({ favorites: favs.includes(mealId) ? favs.filter(f => f !== mealId) : [...favs, mealId] });
      },

      myOrders: [],
      placeOrder: (order) => {
        const myOrders = [order, ...get().myOrders];
        // also push to global orders list (in-memory only)
        allOrders.unshift(order);
        set({ myOrders, cart: [], coupon: null });
        get().pushNotification({
          type: "order", title: "Order placed successfully!",
          body: `Order ${order.code} has been received by the kitchen.`,
          level: "success",
        });
      },
      reorder: (orderId) => {
        const order = get().myOrders.find(o => o.id === orderId) || allOrders.find(o => o.id === orderId);
        if (!order) return;
        const cart: CartItem[] = order.items.map(it => {
          const meal = meals.find(m => m.id === it.mealId)!;
          return {
            mealId: it.mealId, name: it.name, emoji: it.emoji, image: meal.image,
            price: it.price, qty: it.qty, size: it.size, toppings: it.toppings,
          };
        });
        set({ cart, customerView: "cart" });
      },
      rateOrder: (orderId, rating, feedback) => {
        const myOrders = get().myOrders.map(o =>
          o.id === orderId ? { ...o, rating, feedback } : o
        );
        set({ myOrders });
      },

      trackingOrderId: null,
      setTrackingOrder: (id) => set({ trackingOrderId: id, customerView: id ? "tracking" : "history" }),

      notifications: seedNotifications,
      markAllRead: () => set({ notifications: get().notifications.map(n => ({ ...n, read: true })) }),
      markRead: (id) => set({ notifications: get().notifications.map(n => n.id === id ? { ...n, read: true } : n) }),
      pushNotification: (n) => set({
        notifications: [{
          ...n,
          id: `N-${Date.now()}`,
          time: new Date().toISOString(),
          read: false,
        }, ...get().notifications].slice(0, 50),
      }),

      searchOpen: false,
      setSearchOpen: (v) => set({ searchOpen: v }),
      globalQuery: "",
      setGlobalQuery: (q) => set({ globalQuery: q }),

      aiOpen: false,
      setAiOpen: (v) => set({ aiOpen: v }),

      darkMode: true,
      toggleDarkMode: () => set({ darkMode: !get().darkMode }),

      coupon: null,
      applyCoupon: (code) => {
        const codes: Record<string, number> = {
          "SPAG10": 0.10, "KING20": 0.20, "LAGOS15": 0.15, "WELCOME": 0.25, "GOLD50": 0.50,
        };
        const upper = code.toUpperCase();
        if (codes[upper]) {
          set({ coupon: { code: upper, discount: codes[upper] } });
          return true;
        }
        return false;
      },
      removeCoupon: () => set({ coupon: null }),

      // Loyalty & gamification
      loyaltyPoints: 1250,
      loyaltyTier: "Gold",
      checkInStreak: 4,
      lastCheckIn: null,
      spinAvailable: true,
      scratchAvailable: true,
      referralCode: "SPAG-CHIDI-2026",
      referralsCount: 7,
      addPoints: (n) => {
        const points = get().loyaltyPoints + n;
        const tier = points > 5000 ? "King" : points > 2500 ? "Gold" : points > 1000 ? "Silver" : "Bronze";
        set({ loyaltyPoints: points, loyaltyTier: tier });
      },
      dailyCheckIn: () => {
        const today = new Date().toDateString();
        const last = get().lastCheckIn;
        if (last === today) return;
        const yesterday = new Date(Date.now() - 86400000).toDateString();
        const streak = last === yesterday ? get().checkInStreak + 1 : 1;
        const reward = 50 + (streak >= 7 ? 100 : streak * 10);
        get().addPoints(reward);
        set({ lastCheckIn: today, checkInStreak: streak });
        get().pushNotification({ type: "system", title: "Daily check-in complete!", body: `+${reward} points · ${streak}-day streak`, level: "success" });
      },
      spinWheel: () => {
        if (!get().spinAvailable) return { label: "Come back tomorrow", points: 0, type: "nothing" };
        const outcomes = [
          { label: "50 points", points: 50, type: "points" as const },
          { label: "100 points", points: 100, type: "points" as const },
          { label: "200 points", points: 200, type: "points" as const },
          { label: "Free delivery coupon", points: 0, type: "coupon" as const },
          { label: "10% off coupon", points: 0, type: "coupon" as const },
          { label: "Try again tomorrow", points: 0, type: "nothing" as const },
        ];
        const result = outcomes[Math.floor(Math.random() * outcomes.length)];
        if (result.type === "points") get().addPoints(result.points);
        set({ spinAvailable: false });
        return result;
      },
      scratchCard: () => {
        if (!get().scratchAvailable) return null;
        const outcomes = [
          { label: "25 points", points: 25 },
          { label: "75 points", points: 75 },
          { label: "150 points", points: 150 },
          { label: "300 points", points: 300 },
          { label: "Better luck next time", points: 0 },
        ];
        const result = outcomes[Math.floor(Math.random() * outcomes.length)];
        if (result.points > 0) get().addPoints(result.points);
        set({ scratchAvailable: false });
        return result;
      },
    }),
    {
      name: "spagking-store",
      partialize: (s) => ({
        user: s.user,
        cart: s.cart,
        favorites: s.favorites,
        myOrders: s.myOrders,
        notifications: s.notifications,
        darkMode: s.darkMode,
        loyaltyPoints: s.loyaltyPoints,
        loyaltyTier: s.loyaltyTier,
        checkInStreak: s.checkInStreak,
        lastCheckIn: s.lastCheckIn,
        spinAvailable: s.spinAvailable,
        scratchAvailable: s.scratchAvailable,
        referralsCount: s.referralsCount,
      }),
    }
  )
);

// Cart totals helper
export const cartTotals = (cart: CartItem[], couponDiscount = 0, deliveryFee = 1500) => {
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const discount = Math.round(subtotal * couponDiscount);
  const vat = Math.round((subtotal - discount) * 0.075);
  const total = subtotal - discount + vat + deliveryFee;
  return { subtotal, discount, vat, deliveryFee, total };
};
