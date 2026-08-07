/**
 * SpagKing — Restaurant profile (single source of truth)
 *
 * EDIT THIS FILE with SpagKing's verified public business information.
 * Do NOT invent addresses, phone numbers, hours, or founder info.
 * If a field is unknown, leave it as `null` — the UI gracefully omits
 * fields that are null rather than showing fake content.
 */

export interface ChefProfile {
  name: string;
  role: string;
  specialty: string;
  // Drop the chef photo at /public/spagking-assets/chefs/<filename>
  // and reference it here. `null` falls back to the emoji avatar.
  photo: string | null;
  emoji: string;
  rating: number;
  yearsAtSpagking: number;
  bio: string;
}

export interface RestaurantInfo {
  legalName: string;
  tradingName: string;
  // RC number, TIN — only populate if publicly verified.
  rcNumber: string | null;
  foundedYear: number | null;
  headquarters: string | null;
  currency: "NGN";
  timezone: "Africa/Lagos";
  story: string;
  mission: string;
  values: string[];
  // Founder / leadership — only populate if publicly verified.
  founder: string | null;
  // Public contact channels — replace with the client's verified ones.
  email: string | null;
  phone: string | null;
  website: string | null;
}

export const restaurant: RestaurantInfo = {
  legalName: "SpagKing Foods Ltd",
  tradingName: "SpagKing",
  rcNumber: null, // populate with verified RC number
  foundedYear: null, // populate with verified founding year
  headquarters: null, // populate with verified HQ address
  currency: "NGN",
  timezone: "Africa/Lagos",
  // Replace with the real, client-approved brand story.
  story:
    "SpagKing is a Nigerian restaurant serving premium pasta, rice, shawarma, and local favourites. " +
    "This demo uses placeholder copy — replace with SpagKing's official brand story before launch.",
  mission:
    "To deliver royalty in every bowl — premium taste, fast service, and a memorable experience for every customer.",
  values: [
    "Premium ingredients, sourced fresh daily",
    "Fast, friendly, reliable service",
    "Community-first — we feed our neighbourhoods",
    "Crafted with passion, served with excellence",
  ],
  founder: null, // populate only if publicly verified
  email: null, // populate with verified email
  phone: null, // populate with verified phone
  website: null, // populate with verified website
};

export const chefs: ChefProfile[] = [
  {
    name: "Chef Ibrahim",
    role: "Head Chef",
    specialty: "Signature bowls",
    photo: null, // /spagking-assets/chefs/ibrahim.jpg
    emoji: "👨‍🍳",
    rating: 4.9,
    yearsAtSpagking: 12,
    bio: "Replace with Chef Ibrahim's real bio once provided by the client.",
  },
  {
    name: "Chef Bisi",
    role: "Sous Chef",
    specialty: "Shawarma & grills",
    photo: null,
    emoji: "👩‍🍳",
    rating: 4.8,
    yearsAtSpagking: 6,
    bio: "Replace with Chef Bisi's real bio once provided by the client.",
  },
  {
    name: "Chef Ade",
    role: "Pastry Chef",
    specialty: "Desserts & lava cakes",
    photo: null,
    emoji: "👨‍🍳",
    rating: 5.0,
    yearsAtSpagking: 4,
    bio: "Replace with Chef Ade's real bio once provided by the client.",
  },
  {
    name: "Chef Ngozi",
    role: "Line Cook",
    specialty: "Jollof & rice dishes",
    photo: null,
    emoji: "👩‍🍳",
    rating: 4.7,
    yearsAtSpagking: 3,
    bio: "Replace with Chef Ngozi's real bio once provided by the client.",
  },
];

export type { RestaurantInfo as Restaurant };
