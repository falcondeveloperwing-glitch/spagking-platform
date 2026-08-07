/**
 * SpagKing — Menu content (single source of truth)
 *
 * EDIT THIS FILE to replace placeholder meal data with SpagKing's
 * official menu. For each meal, drop a real photo at
 * /public/spagking-assets/food/<filename> and set the `image` field
 * to "/spagking-assets/food/<filename>".
 *
 * Until real photos are supplied, the `image` field points at the
 * placeholder Unsplash URLs already in the demo — the app shows an
 * emoji fallback if an image fails to load.
 *
 * Do NOT invent prices. Use the real menu prices the client confirms.
 */

export interface MenuMeal {
  id: string;
  name: string;
  category: string;
  description: string;
  longDescription: string;
  price: number; // in NGN
  oldPrice?: number;
  image: string; // swap to /spagking-assets/food/<file>.jpg when ready
  emoji: string;
  rating: number;
  reviews: number;
  prepTime: number; // minutes
  calories: number;
  ingredients: string[];
  allergens: string[];
  sizes: { name: string; price: number }[];
  toppings: { name: string; price: number }[];
  tags: string[]; // "recommended" | "popular" | "new" | "combo" | "flash"
  available: boolean;
  stock: number;
  sold: number;
  spicy?: boolean;
  vegetarian?: boolean;
}

// Standard size + topping options — used unless a meal overrides.
export const DEFAULT_SIZES = [
  { name: "Regular", price: 0 },
  { name: "Large", price: 1200 },
  { name: "Family", price: 2500 },
];

export const DEFAULT_TOPPINGS = [
  { name: "Extra Cheese", price: 500 },
  { name: "Extra Meat", price: 800 },
  { name: "Boiled Egg", price: 300 },
  { name: "Plantain", price: 400 },
  { name: "Avocado", price: 600 },
  { name: "Bacon", price: 700 },
  { name: "Spicy Sauce", price: 200 },
  { name: "Garlic Bread", price: 600 },
];

export const MENU_CATEGORIES = [
  { name: "Spaghetti", emoji: "🍝", color: "from-amber-500/20 to-yellow-600/10" },
  { name: "Rice", emoji: "🍛", color: "from-orange-500/20 to-red-600/10" },
  { name: "Shawarma", emoji: "🌯", color: "from-rose-500/20 to-pink-600/10" },
  { name: "Burgers", emoji: "🍔", color: "from-yellow-500/20 to-amber-600/10" },
  { name: "Drinks", emoji: "🥤", color: "from-cyan-500/20 to-blue-600/10" },
  { name: "Soups", emoji: "🍲", color: "from-emerald-500/20 to-green-600/10" },
  { name: "Desserts", emoji: "🍨", color: "from-pink-500/20 to-rose-600/10" },
];

// The full meal catalogue lives in src/lib/data.ts for backwards compat.
// When the client provides the real menu, move the meal definitions here
// and have data.ts re-export from this file. The shape matches Meal exactly.
export type { MenuMeal as Meal };
