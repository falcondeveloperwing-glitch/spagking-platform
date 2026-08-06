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
  | "home" | "menu" | "meal" | "cart" | "checkout" | "tracking" | "history" | "profile" | "qr" | "loyalty" | "community" | "kitchen";

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

  // Customer preferences — theme system
  darkMode: boolean;
  themeMode: "light" | "dark" | "system";
  setThemeMode: (mode: "light" | "dark" | "system") => void;
  toggleDarkMode: () => void;
  applyTheme: () => void;

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

  // Community & social
  communityPosts: CommunityPost[];
  addCommunityPost: (post: Omit<CommunityPost, "id" | "time" | "likes" | "comments" | "liked" | "saved">) => void;
  togglePostLike: (id: string) => void;
  togglePostSave: (id: string) => void;
  mealOfWeekVotes: Record<string, number>;
  voteMealOfWeek: (mealId: string) => void;
  votedMealOfWeek: string | null;

  // Recent searches
  recentSearches: string[];
  addRecentSearch: (q: string) => void;
  clearRecentSearches: () => void;

  // Achievement badges
  unlockedBadges: string[];
  unlockBadge: (id: string) => void;

  // Reward celebration (confetti trigger)
  celebration: { title: string; subtitle: string; emoji: string } | null;
  triggerCelebration: (c: { title: string; subtitle: string; emoji: string }) => void;
  clearCelebration: () => void;
}

export interface CommunityPost {
  id: string;
  author: string;
  avatar: string;
  mealName: string;
  mealEmoji: string;
  caption: string;
  image: string;
  time: string;
  likes: number;
  comments: number;
  liked: boolean;
  saved: boolean;
  tag?: string;
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
      themeMode: "dark",
      setThemeMode: (mode) => {
        const isDark = mode === "dark" || (mode === "system" && (typeof window === "undefined" || window.matchMedia("(prefers-color-scheme: dark)").matches));
        set({ themeMode: mode, darkMode: isDark });
        if (typeof document !== "undefined") {
          const root = document.documentElement;
          root.classList.remove("dark", "light");
          root.classList.add(isDark ? "dark" : "light");
          root.style.colorScheme = isDark ? "dark" : "light";
        }
      },
      toggleDarkMode: () => get().setThemeMode(get().darkMode ? "light" : "dark"),
      applyTheme: () => {
        const { themeMode } = get();
        const isDark = themeMode === "dark" || (themeMode === "system" && (typeof window === "undefined" || window.matchMedia("(prefers-color-scheme: dark)").matches));
        if (typeof document !== "undefined") {
          const root = document.documentElement;
          root.classList.remove("dark", "light");
          root.classList.add(isDark ? "dark" : "light");
          root.style.colorScheme = isDark ? "dark" : "light";
        }
      },

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

      // Community & social
      communityPosts: [
        { id: "P1", author: "Adaobi N.", avatar: "AN", mealName: "SpagKing Royal Bolognese", mealEmoji: "🍝", caption: "Just had the Royal Bolognese and I'm in heaven! The gold garnish is everything ✨", image: meals[0].image, time: "2h ago", likes: 248, comments: 32, liked: false, saved: false, tag: "5★ review" },
        { id: "P2", author: "Tunde A.", avatar: "TA", mealName: "Spicy Suya Shawarma", mealEmoji: "🌯", caption: "Suya Shawarma hits different at 2am 🔥 SpagKing never misses", image: meals[14].image, time: "5h ago", likes: 412, comments: 58, liked: true, saved: false, tag: "Trending" },
        { id: "P3", author: "Fatima B.", avatar: "FB", mealName: "Jollof Rice Special", mealEmoji: "🍛", caption: "Family dinner sorted! Jollof + plantain + chicken. The kids approved 🥰", image: meals[10].image, time: "8h ago", likes: 189, comments: 24, liked: false, saved: true, tag: "Family" },
        { id: "P4", author: "Emeka O.", avatar: "EO", mealName: "Seafood Spaghetti", mealEmoji: "🍝", caption: "Date night at SpagKing VI. The ambience + this seafood pasta = perfection 💕", image: meals[3].image, time: "1d ago", likes: 367, comments: 41, liked: false, saved: false, tag: "Date night" },
        { id: "P5", author: "Grace S.", avatar: "GS", mealName: "Chocolate Lava Cake", mealEmoji: "🍫", caption: "Molten centre cake with ice cream. Best dessert in Lagos, hands down 🤤", image: meals[51].image, time: "1d ago", likes: 524, comments: 67, liked: true, saved: true, tag: "Dessert" },
      ],
      addCommunityPost: (post) => set(s => ({
        communityPosts: [{
          ...post,
          id: `P-${Date.now()}`,
          time: "Just now",
          likes: 0,
          comments: 0,
          liked: false,
          saved: false,
        }, ...s.communityPosts],
      })),
      togglePostLike: (id) => set(s => ({
        communityPosts: s.communityPosts.map(p => p.id === id ? { ...p, liked: !p.liked, likes: p.likes + (p.liked ? -1 : 1) } : p),
      })),
      togglePostSave: (id) => set(s => ({
        communityPosts: s.communityPosts.map(p => p.id === id ? { ...p, saved: !p.saved } : p),
      })),
      mealOfWeekVotes: { "M-001": 342, "M-011": 218, "M-021": 156, "M-031": 89 },
      votedMealOfWeek: null,
      voteMealOfWeek: (mealId) => {
        if (get().votedMealOfWeek) return;
        set(s => ({
          mealOfWeekVotes: { ...s.mealOfWeekVotes, [mealId]: (s.mealOfWeekVotes[mealId] || 0) + 1 },
          votedMealOfWeek: mealId,
        }));
        get().addPoints(100);
        get().triggerCelebration({ title: "Vote counted!", subtitle: "+100 points for voting · Meal of the Week", emoji: "🗳️" });
      },

      // Recent searches
      recentSearches: ["Spaghetti", "Shawarma", "Jollof"],
      addRecentSearch: (q) => set(s => ({
        recentSearches: [q, ...s.recentSearches.filter(r => r !== q)].slice(0, 6),
      })),
      clearRecentSearches: () => set({ recentSearches: [] }),

      // Achievement badges
      unlockedBadges: ["first-order", "spicy-lover", "weekend-warrior"],
      unlockBadge: (id) => set(s => s.unlockedBadges.includes(id) ? s : ({ unlockedBadges: [...s.unlockedBadges, id] })),

      // Reward celebration
      celebration: null,
      triggerCelebration: (c) => set({ celebration: c }),
      clearCelebration: () => set({ celebration: null }),
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
        themeMode: s.themeMode,
        loyaltyPoints: s.loyaltyPoints,
        loyaltyTier: s.loyaltyTier,
        checkInStreak: s.checkInStreak,
        lastCheckIn: s.lastCheckIn,
        spinAvailable: s.spinAvailable,
        scratchAvailable: s.scratchAvailable,
        referralsCount: s.referralsCount,
        communityPosts: s.communityPosts,
        mealOfWeekVotes: s.mealOfWeekVotes,
        votedMealOfWeek: s.votedMealOfWeek,
        recentSearches: s.recentSearches,
        unlockedBadges: s.unlockedBadges,
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
