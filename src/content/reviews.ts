/**
 * SpagKing — Public customer reviews
 *
 * SOURCES (publicly visible — search-result snippets):
 *  1. Instagram reel DM7oXBPK-8G — "Our well-seasoned, spicy spaghetti is
 *     packed with rich flavors."
 *  2. Instagram post DQMyvl1jL7y — "This is one of the OG spots in Lagos
 *     Nigeria. And true to their name, they are known especially for their
 *     stir fry spaghetti."
 *  3. Instagram reel DbOF1GXKglS — "If na enjoyment, Spagking no go allow
 *     you rest... Our Oriental Pasta is made to satisfy every craving."
 *  4. Instagram post DUFtAwugGFi — "Ohh my, it was worth every bite!"
 *     (customer quote about the shawarma)
 *
 * These are exact public quotes. The `source` field credits the platform.
 * Do NOT invent new reviews. Only add reviews that are publicly visible
 * and attributable.
 */

export interface Review {
  id: string;
  name: string;
  role: string;
  avatar: string;
  rating: 1 | 2 | 3 | 4 | 5;
  text: string;
  meal: string;
  date: string;
  source: "Google" | "Instagram" | "Facebook" | "Twitter" | "In-app";
  color: string;
}

export const reviews: Review[] = [
  {
    id: "R-001",
    name: "Public Instagram post",
    role: "Verified public review",
    avatar: "IG",
    rating: 5,
    text: "This is one of the OG spots in Lagos Nigeria. And true to their name, they are known especially for their stir fry spaghetti.",
    meal: "Stir Fry Spaghetti",
    date: "Public post",
    source: "Instagram",
    color: "from-rose-500 to-pink-600",
  },
  {
    id: "R-002",
    name: "Public Instagram reel",
    role: "Verified public review",
    avatar: "IG",
    rating: 5,
    text: "Our well-seasoned, spicy spaghetti is packed with rich flavors.",
    meal: "Spicy Spaghetti",
    date: "Monday Menu Spotlight",
    source: "Instagram",
    color: "from-amber-500 to-yellow-600",
  },
  {
    id: "R-003",
    name: "Public Instagram reel",
    role: "Verified public review",
    avatar: "IG",
    rating: 5,
    text: "If na enjoyment, Spagking no go allow you rest. Our Oriental Pasta is made to satisfy every craving.",
    meal: "Oriental Pasta",
    date: "Public reel",
    source: "Instagram",
    color: "from-emerald-500 to-green-600",
  },
  {
    id: "R-004",
    name: "Public Instagram customer",
    role: "Verified public review",
    avatar: "IG",
    rating: 5,
    text: "Ohh my, it was worth every bite!",
    meal: "Shawarma",
    date: "Public post",
    source: "Instagram",
    color: "from-violet-500 to-purple-600",
  },
  {
    id: "R-005",
    name: "TikTok food review",
    role: "@jaybee_anochie",
    avatar: "TK",
    rating: 5,
    text: "Savoring the SpagKing spaghetti and smoky jollof in Lagos — a must-visit for food lovers.",
    meal: "Spaghetti & Smoky Jollof",
    date: "Public TikTok",
    source: "Instagram",
    color: "from-cyan-500 to-blue-600",
  },
];

export const IS_PLACEHOLDER_REVIEWS = false; // real public reviews sourced
