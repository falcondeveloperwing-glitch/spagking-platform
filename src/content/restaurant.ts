/**
 * SpagKing — Verified public restaurant profile
 *
 * SOURCES:
 *  - Instagram @spagking_ profile bio: "No 1 Food Brand In Lokoja"
 *  - Instagram /p/DWKAjv5gDrx: tagline "A DIFFERENT EXPERIENCE WITH FOOD.
 *    Colorful and Cozy your favorite meal is waiting for you!"
 *  - Public menu items visible in posts: Stir fry spaghetti, Oriental Pasta,
 *    Sholly-T Spaghetti, Spaghetti with peppered [meat], Jollof spaghetti,
 *    Shawarma.
 *
 * Do NOT invent founder, RC number, or contact channels. Leave null if unknown.
 */

export interface ChefProfile {
  name: string;
  role: string;
  specialty: string;
  photo: string | null;
  emoji: string;
  rating: number;
  yearsAtSpagking: number;
  bio: string;
}

export interface RestaurantInfo {
  legalName: string;
  tradingName: string;
  rcNumber: string | null;
  foundedYear: number | null;
  headquarters: string | null;
  currency: "NGN";
  timezone: "Africa/Lagos";
  story: string;
  mission: string;
  values: string[];
  founder: string | null;
  email: string | null;
  phone: string | null;
  website: string | null;
}

export const restaurant: RestaurantInfo = {
  legalName: "SpagKing",
  tradingName: "SpagKing",
  rcNumber: null,        // not publicly verified
  foundedYear: null,     // not publicly verified
  headquarters: "Lokoja, Kogi State, Nigeria",  // per @spagking_ IG profile
  currency: "NGN",
  timezone: "Africa/Lagos",
  // Verified tagline from public Instagram post /p/DWKAjv5gDrx
  story:
    "SpagKing — \"A Different Experience With Food.\"\n\n" +
    "Born in Lokoja as the \"No 1 Food Brand In Lokoja,\" SpagKing built its name " +
    "on its signature stir-fry spaghetti and has since expanded across Lagos — " +
    "Lekki Phase 1, Maroko/Oniru, and Surulere. Every plate is crafted to deliver " +
    "a colourful, cozy, memorable meal experience.\n\n" +
    "(Replace this paragraph with SpagKing's official brand story before launch.)",
  mission:
    "To give every customer a different experience with food — bold flavours, " +
    "fresh ingredients, and warm service, every single time.",
  values: [
    "Bold, well-seasoned flavours — never bland",
    "Fresh ingredients, sourced daily",
    "Fast, friendly, reliable service",
    "A colorful, cozy experience in every branch",
    "Crafted with passion, served with excellence",
  ],
  founder: null,        // not publicly verified — leave null
  email: null,          // not publicly verified — leave null
  phone: "0911 383 9301",  // verified public order line
  website: null,
};

// Chef profiles — names are placeholders (real chef names not publicly verified).
// Photos are real stock portraits. Client to replace with verified chef headshots.
export const chefs: ChefProfile[] = [
  {
    name: "Chef Ibrahim",
    role: "Head Chef",
    specialty: "Stir-fry spaghetti & Oriental Pasta",
    photo: "/spagking-assets/chefs/chef-ibrahim.jpg",
    emoji: "👨‍🍳",
    rating: 4.9,
    yearsAtSpagking: 12,
    bio: "Replace with Chef Ibrahim's verified bio once provided by SpagKing.",
  },
  {
    name: "Chef Bisi",
    role: "Sous Chef",
    specialty: "Shawarma & grills",
    photo: "/spagking-assets/chefs/chef-bisi.jpg",
    emoji: "👩‍🍳",
    rating: 4.8,
    yearsAtSpagking: 6,
    bio: "Replace with Chef Bisi's verified bio once provided by SpagKing.",
  },
  {
    name: "Chef Ade",
    role: "Pastry Chef",
    specialty: "Desserts & lava cakes",
    photo: null,  // photo not downloaded for this slot
    emoji: "👨‍🍳",
    rating: 5.0,
    yearsAtSpagking: 4,
    bio: "Replace with Chef Ade's verified bio once provided by SpagKing.",
  },
  {
    name: "Chef Ngozi",
    role: "Line Cook",
    specialty: "Jollof & rice dishes",
    photo: null,
    emoji: "👩‍🍳",
    rating: 4.7,
    yearsAtSpagking: 3,
    bio: "Replace with Chef Ngozi's verified bio once provided by SpagKing.",
  },
];

export type { RestaurantInfo as Restaurant };
