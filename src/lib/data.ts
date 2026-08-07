// SpagKing demo data generator — deterministic, Nigerian-flavored
// 250 customers · 60 meals · 12 riders · 35 employees · 18 suppliers · 700 orders · 3 branches

export type Role =
  | "customer"
  | "cashier"
  | "manager"
  | "inventory"
  | "hr"
  | "rider"
  | "admin"
  | "ceo";

export interface User {
  id: string;
  role: Role;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  branch?: string;
}

export interface Branch {
  id: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  manager: string;
  status: "open" | "closed" | "busy";
  revenueToday: number;
  ordersToday: number;
  rating: number;
  lat: number;
  lng: number;
}

export interface Meal {
  id: string;
  name: string;
  category: string;
  description: string;
  longDescription: string;
  price: number;
  oldPrice?: number;
  image: string;
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

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  joinedAt: string;
  orders: number;
  totalSpent: number;
  loyaltyPoints: number;
  tier: "Bronze" | "Silver" | "Gold" | "Platinum";
  birthday: string;
  lastOrder?: string;
  feedback: number; // 0-5
  segment: "VIP" | "Regular" | "At-Risk" | "New";
}

export interface Rider {
  id: string;
  name: string;
  phone: string;
  avatar: string;
  vehicle: string;
  plate: string;
  status: "online" | "on-delivery" | "offline" | "break";
  rating: number;
  completedToday: number;
  completedTotal: number;
  earningsToday: number;
  zone: string;
  lat: number;
  lng: number;
}

export interface Employee {
  id: string;
  name: string;
  role: string;
  department: "Kitchen" | "Front of House" | "Management" | "Delivery" | "Finance" | "HR" | "Inventory";
  email: string;
  phone: string;
  avatar: string;
  branch: string;
  status: "active" | "on-leave" | "off-duty" | "suspended";
  joinedAt: string;
  salary: number;
  rating: number;
  attendance: number; // %
  shift: string;
  performance: number; // 0-100
}

export interface Supplier {
  id: string;
  name: string;
  contact: string;
  phone: string;
  email: string;
  category: string;
  rating: number;
  totalOrders: number;
  totalSpent: number;
  outstanding: number;
  leadTime: number; // days
  status: "active" | "inactive";
  address: string;
}

export interface OrderItem {
  mealId: string;
  name: string;
  emoji: string;
  price: number;
  qty: number;
  size?: string;
  toppings?: string[];
}

export interface Order {
  id: string;
  code: string;
  customer: string;
  customerId: string;
  branch: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  vat: number;
  discount: number;
  tip: number;
  total: number;
  status: "received" | "preparing" | "cooking" | "ready" | "picked_up" | "on_the_way" | "delivered" | "cancelled";
  type: "delivery" | "pickup" | "dine-in";
  payment: "paystack" | "flutterwave" | "cash";
  paid: boolean;
  rider?: string;
  address?: string;
  notes?: string;
  createdAt: string;
  deliveredAt?: string;
  rating?: number;
  feedback?: string;
}

// Seeded PRNG for deterministic generation
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6D2B79F5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(42);
const pick = <T,>(arr: T[]): T => arr[Math.floor(rand() * arr.length)];
const int = (min: number, max: number) => Math.floor(rand() * (max - min + 1)) + min;
const money = (min: number, max: number) => int(min, max);

// Nigerian name pools
const firstNames = [
  "Chidi", "Adaobi", "Tunde", "Ngozi", "Emeka", "Folake", "Bola", "Kunle", "Chioma", "Ibrahim",
  "Aisha", "Yusuf", "Funke", "Seyi", "Zainab", "Obinna", "Halima", "Damilola", "Tope", "Rasheed",
  "Amara", "Chukwu", "Fatima", "Wale", "Bisi", "Olu", "Hauwa", "Emmanuel", "Grace", "Sani",
  "Adaeze", "Bashir", "Yetunde", "Kemi", "Musa", "Chinwe", "Tunde", "Loveth", "Ahmed", "Nneka",
  "Samuel", "Blessing", "Hassan", "Ifeoma", "Gbenga", "Maryam", "Onyeka", "Tari", "Idris", "Ebere",
  "Adesuwa", "Yakubu", "Osaze", "Happiness", "Chidera", "Mustapha", "Titilayo", "Okechukwu", "Aminat", "Jumoke",
];
const lastNames = [
  "Okoro", "Adeyemi", "Mohammed", "Eze", "Okafor", "Bello", "Adeleke", "Nwosu", "Olawale", "Sani",
  "Ojo", "Abdullahi", "Okafor", "Balogun", "Ezeobi", "Adebayo", "Ibrahim", "Oyelowo", "Uche", "Adamu",
  "Okeke", "Salami", "Mohammed", "Okonkwo", "Ogunleye", "Yusuf", "Nwankwo", "Adeyemi", "Aliyu", "Onuoha",
  "Adewale", "Chukwu", "Bashir", "Okoye", "Olabisi", "Musa", "Eze", "Idris", "Lawal", "Ifeanyi",
  "Abubakar", "Ogun", "Olanrewaju", "Hassan", "Nnamdi", "Suleiman", "Oyedeji", "Adebanjo", "Buhari", "Nnamdi",
];
const cities = ["Lagos", "Abuja", "Port Harcourt", "Ibadan", "Kano"];
const addresses = [
  "12 Adeola Odeku St, Victoria Island", "5 Adeyemo Alakija St, Lekki Phase 1",
  "78 Awolowo Rd, Ikoyi", "23 Marina Rd, Lagos Island", "201 Aminu Kano Cres, Wuse 2",
  "15 Ahmadu Bello Way, Garki", "8 Trans Amadi Rd, GRA Phase 2", "44 Aba Rd, Port Harcourt",
  "17 Jericho Rd, Ibadan", "31 Emir Rd, Kano", "9 Bourdillon Rd, Ikoyi", "65A Adeniran Ogunsanya St, Surulere",
  "3 Aguiyi Ironsi Way, Maitama", "27 Gowon Ave, Ikeja GRA", "100A Opebi Rd, Ikeja",
];
const phone = () => `+234 80${int(2, 9)} ${int(100, 999)} ${int(1000, 9999)}`;
const avatarFor = (seed: string) => `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(seed)}&backgroundColor=D4A017,10B981,8B5CF6,EF4444&textColor=0B0B0B`;

// Branches
// Branches — sourced from src/content/branches.ts (single source of truth)
// Demo KPIs (revenueToday, ordersToday, rating) are layered on top so the
// dashboards still show believable numbers. Replace the content file with
// the client's verified branch info before launch.
import { branches as contentBranches } from "@/content/branches";

export const branches: Branch[] = contentBranches.map(b => ({
  id: b.id,
  name: b.name,
  address: b.address ?? "Address pending verification",
  city: b.city,
  phone: b.phone ?? "Phone pending",
  manager: b.manager,
  status: b.status,
  revenueToday: b.revenueToday,
  ordersToday: b.ordersToday,
  rating: b.rating,
  lat: b.lat ?? 6.4 + Math.random() * 0.3, // fallback for demo map only
  lng: b.lng ?? 3.3 + Math.random() * 0.3,
}));

// Meal catalogue (60 meals across 7 categories)
const mealTemplates: Array<Partial<Meal> & { name: string; category: string; price: number; emoji: string }> = [
  // Spaghetti (10)
  { name: "SpagKing Royal Bolognese", category: "Spaghetti", price: 4500, emoji: "🍝", description: "Signature slow-cooked beef bolognese over al dente spaghetti.", tags: ["recommended", "popular"] },
  { name: "Chicken Alfredo Spaghetti", category: "Spaghetti", price: 5200, emoji: "🍝", description: "Creamy parmesan alfredo with grilled chicken strips.", tags: ["popular"] },
  { name: "Spicy Arrabbiata", category: "Spaghetti", price: 3800, emoji: "🌶️", description: "Fiery tomato arrabbiata with chilli flakes & basil.", tags: ["flash"], spicy: true },
  { name: "Seafood Spaghetti", category: "Spaghetti", price: 7500, emoji: "🦐", description: "Prawns, calamari & mussels in white wine sauce.", tags: ["recommended"] },
  { name: "SpagKing Jollof-Spag", category: "Spaghetti", price: 4200, emoji: "🍲", description: "Nigerian-style jollof-spice spaghetti with smoked turkey.", tags: ["popular", "combo"] },
  { name: "Carbonara Classic", category: "Spaghetti", price: 4800, emoji: "🧀", description: "Guanciale, pecorino & egg yolk — Roman classic.", tags: [] },
  { name: "Pesto Genovese", category: "Spaghetti", price: 4600, emoji: "🌿", description: "Fresh basil pesto with pine nuts & parmesan.", tags: ["new"], vegetarian: true },
  { name: "Suya Spaghetti", category: "Spaghetti", price: 4400, emoji: "🍢", description: "Suya-spiced beef strips over peppered spaghetti.", tags: ["new"], spicy: true },
  { name: "Mushroom Truffle Spag", category: "Spaghetti", price: 8200, emoji: "🍄", description: "Wild mushrooms finished with truffle oil.", tags: ["recommended"], vegetarian: true },
  { name: "SpagKing Peppered Spag", category: "Spaghetti", price: 4100, emoji: "🌶️", description: "Scotch bonnet pepper sauce with assorted meat.", tags: ["popular"], spicy: true },

  // Rice (10)
  { name: "Jollof Rice Special", category: "Rice", price: 3800, emoji: "🍛", description: "Party-style smoky jollof with chicken & plantain.", tags: ["recommended", "popular"] },
  { name: "Fried Rice Royale", category: "Rice", price: 4200, emoji: "🍚", description: "Classic Nigerian fried rice with veggies & liver.", tags: ["popular"] },
  { name: "Coconut Rice & Fish", category: "Rice", price: 4500, emoji: "🥥", description: "Coconut-infused rice with grilled croaker fish.", tags: [] },
  { name: "Ofada Rice & Ayamase", category: "Rice", price: 4800, emoji: "🌶️", description: "Local ofada rice with spicy ayamase stew.", tags: ["popular"], spicy: true },
  { name: "Banga Rice & Beef", category: "Rice", price: 4600, emoji: "🍲", description: "Delta-style banga (palm fruit) rice with goat meat.", tags: ["new"] },
  { name: "White Rice & Stew", category: "Rice", price: 3200, emoji: "🍚", description: "Steamed white rice with rich tomato stew & chicken.", tags: ["combo"] },
  { name: "Chinese Fried Rice", category: "Rice", price: 4900, emoji: "🥡", description: "Wok-fried rice with prawns, egg & soy.", tags: [] },
  { name: "Biryani Lamb", category: "Rice", price: 6500, emoji: "🍖", description: "Aromatic basmati biryani with spiced lamb.", tags: ["recommended"] },
  { name: "Rice & Beans Combo", category: "Rice", price: 3600, emoji: "🫘", description: "Steamed rice & beans with stew & plantain.", tags: ["combo"] },
  { name: "Seafood Paella", category: "Rice", price: 7800, emoji: "🦞", description: "Spanish-style saffron rice with seafood medley.", tags: ["new"] },

  // Shawarma (8)
  { name: "SpagKing Special Shawarma", category: "Shawarma", price: 3500, emoji: "🌯", description: "Loaded beef & chicken shawarma with SpagKing sauce.", tags: ["recommended", "popular"] },
  { name: "Chicken Shawarma", category: "Shawarma", price: 3000, emoji: "🌯", description: "Grilled chicken wrap with garlic sauce.", tags: ["popular"] },
  { name: "Beef Shawarma", category: "Shawarma", price: 3200, emoji: "🥙", description: "Tender spiced beef wrap with veggies.", tags: [] },
  { name: "Spicy Suya Shawarma", category: "Shawarma", price: 3600, emoji: "🌶️", description: "Suya-spiced chicken shawarma with extra pepper.", tags: ["flash"], spicy: true },
  { name: "Veggie Shawarma", category: "Shawarma", price: 2800, emoji: "🥗", description: "Plant-based shawarma with hummus & falafel.", tags: ["new"], vegetarian: true },
  { name: "Jumbo Shrimp Shawarma", category: "Shawarma", price: 4500, emoji: "🦐", description: "Crispy shrimp with spicy mayo.", tags: ["recommended"] },
  { name: "Double-Meat Shawarma", category: "Shawarma", price: 4200, emoji: "🌯", description: "Twice the chicken & beef — for the hungry.", tags: ["combo"] },
  { name: "Cheesy Shawarma Melt", category: "Shawarma", price: 3800, emoji: "🧀", description: "Mozzarella-stuffed shawarma, toasted.", tags: ["popular"] },

  // Burgers (8)
  { name: "SpagKing Royale Burger", category: "Burgers", price: 4800, emoji: "🍔", description: "Double beef patty, gold-leaf bun, smoked cheddar.", tags: ["recommended", "popular"] },
  { name: "Crispy Chicken Burger", category: "Burgers", price: 3800, emoji: "🍔", description: "Buttermilk-fried chicken with slaw & pickles.", tags: ["popular"] },
  { name: "Beef Burger Classic", category: "Burgers", price: 3500, emoji: "🍔", description: "Single patty, lettuce, tomato, SpagKing sauce.", tags: [] },
  { name: "Spicy Jalapeño Burger", category: "Burgers", price: 4000, emoji: "🌶️", description: "Jalapeño-loaded beef patty with pepper jack.", tags: ["flash"], spicy: true },
  { name: "Grilled Chicken Burger", category: "Burgers", price: 3700, emoji: "🍔", description: "Flame-grilled chicken with avocado mayo.", tags: [] },
  { name: "Veggie Bean Burger", category: "Burgers", price: 3300, emoji: "🥬", description: "Black bean patty with chipotle mayo.", tags: ["new"], vegetarian: true },
  { name: "Double Cheese Burger", category: "Burgers", price: 4500, emoji: "🧀", description: "Two patties, double cheese, brioche bun.", tags: ["combo"] },
  { name: "Suya Beef Burger", category: "Burgers", price: 4300, emoji: "🍢", description: "Suya-rubbed beef patty with onion rings.", tags: ["recommended"], spicy: true },

  // Drinks (10)
  { name: "Fresh Zobo", category: "Drinks", price: 1200, emoji: "🥤", description: "Hibiscus drink infused with ginger & pineapple.", tags: ["popular"] },
  { name: "Chapman Cocktail", category: "Drinks", price: 1800, emoji: "🍹", description: "Iconic Nigerian mocktail with citrus & grenadine.", tags: ["recommended"] },
  { name: "Pineapple Smoothie", category: "Drinks", price: 2000, emoji: "🍍", description: "Fresh pineapple blended with yoghurt.", tags: ["new"] },
  { name: "Mango Lassi", category: "Drinks", price: 1800, emoji: "🥭", description: "Creamy mango-yoghurt smoothie.", tags: [] },
  { name: "Soya Milk (Fresh)", category: "Drinks", price: 1000, emoji: "🥛", description: "Stone-ground soya milk, lightly sweetened.", tags: [], vegetarian: true },
  { name: "Coca-Cola", category: "Drinks", price: 600, emoji: "🥤", description: "Chilled 35cl bottle.", tags: [] },
  { name: "Fresh Tiger Nut Drink", category: "Drinks", price: 1500, emoji: "🥥", description: "Kunu aya — tiger nut & coconut blend.", tags: ["new"] },
  { name: "Watermelon Juice", category: "Drinks", price: 1700, emoji: "🍉", description: "Cold-pressed watermelon with mint.", tags: [], vegetarian: true },
  { name: "Iced Caramel Macchiato", category: "Drinks", price: 2500, emoji: "☕", description: "Espresso, milk, caramel over ice.", tags: ["popular"] },
  { name: "Bottled Water", category: "Drinks", price: 300, emoji: "💧", description: "75cl Eva still water.", tags: [] },

  // Soups (6)
  { name: "Egusi Soup & Pounded Yam", category: "Soups", price: 4500, emoji: "🍲", description: "Rich melon-seed soup with assorted meat.", tags: ["recommended", "popular"] },
  { name: "Efo Riro & Semo", category: "Soups", price: 4200, emoji: "🥬", description: "Spinach & pepper stew with ponmo & fish.", tags: ["popular"] },
  { name: "Banga Soup & Starch", category: "Soups", price: 4600, emoji: "🥥", description: "Delta palm-fruit soup with catfish.", tags: [] },
  { name: "Oha Soup & Fufu", category: "Soups", price: 4800, emoji: "🍲", description: "Ora leaves in thickened broth with goat meat.", tags: ["new"] },
  { name: "Okra Soup & Garri", category: "Soups", price: 4000, emoji: "🥘", description: "Okra & assorted meat soup.", tags: [] },
  { name: "Pepper Soup (Catfish)", category: "Soups", price: 4500, emoji: "🐟", description: "Spicy catfish pepper soup with utazi.", tags: ["flash"], spicy: true },

  // Desserts (8)
  { name: "Puff-Puff (6 pcs)", category: "Desserts", price: 1500, emoji: "🍩", description: "Fluffy golden Nigerian puff-puff.", tags: ["popular"] },
  { name: "Chocolate Lava Cake", category: "Desserts", price: 2800, emoji: "🍫", description: "Warm molten-centre cake with vanilla ice-cream.", tags: ["recommended", "popular"] },
  { name: "Chin Chin (Pack)", category: "Desserts", price: 1200, emoji: "🍪", description: "Crunchy fried snack cubes.", tags: [] },
  { name: "Coconut Candy", category: "Desserts", price: 1000, emoji: "🥥", description: "Sweet toasted coconut bites.", tags: ["new"] },
  { name: "Tiramisu Royale", category: "Desserts", price: 3200, emoji: "☕", description: "Espresso-soaked layers with mascarpone.", tags: ["recommended"] },
  { name: "Plantain Mosa", category: "Desserts", price: 1800, emoji: "🍌", description: "Sweet fried plantain puffs.", tags: [] },
  { name: "Ice-Cream Sundae", category: "Desserts", price: 2500, emoji: "🍨", description: "Three scoops, chocolate & caramel drizzle.", tags: ["popular"] },
  { name: "Tropical Fruit Bowl", category: "Desserts", price: 2200, emoji: "🥭", description: "Seasonal fruits with honey-yoghurt dip.", tags: ["new"], vegetarian: true },
];

const ingredientBank = [
  "Beef", "Chicken", "Prawns", "Tomato", "Onion", "Garlic", "Ginger", "Pepper", "Basil", "Parmesan",
  "Pasta", "Rice", "Egg", "Mushroom", "Olive Oil", "Curry", "Suya Spice", "Palm Oil", "Vegetable", "Plantain",
];
const allergenBank = ["Gluten", "Egg", "Dairy", "Seafood", "Peanuts", "Soy"];
const toppingOptions = [
  { name: "Extra Cheese", price: 500 }, { name: "Extra Meat", price: 800 },
  { name: "Boiled Egg", price: 300 }, { name: "Plantain", price: 400 },
  { name: "Avocado", price: 600 }, { name: "Bacon", price: 700 },
  { name: "Spicy Sauce", price: 200 }, { name: "Garlic Bread", price: 600 },
];
const sizeOptions = [
  { name: "Regular", price: 0 }, { name: "Large", price: 1200 }, { name: "Family", price: 2500 },
];

const imagePool: Record<string, string[]> = {
  Spaghetti: [
    "https://images.unsplash.com/photo-1622973536968-3ead9e780960?w=600&q=80",
    "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=600&q=80",
    "https://images.unsplash.com/photo-1572441710534-f3b8b3a3b3a3?w=600&q=80",
    "https://images.unsplash.com/photo-1481931098730-318b6f776db0?w=600&q=80",
    "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=600&q=80",
  ],
  Rice: [
    "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=600&q=80",
    "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=600&q=80",
    "https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?w=600&q=80",
    "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&q=80",
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80",
  ],
  Shawarma: [
    "https://images.unsplash.com/photo-1633321088355-d0f81134ca3a?w=600&q=80",
    "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80",
    "https://images.unsplash.com/photo-1502302803615-9b805743566e?w=600&q=80",
    "https://images.unsplash.com/photo-1550317138-10000687a72b?w=600&q=80",
  ],
  Burgers: [
    "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80",
    "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=600&q=80",
    "https://images.unsplash.com/photo-1550547660-d9450f859349?w=600&q=80",
    "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=600&q=80",
  ],
  Drinks: [
    "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=600&q=80",
    "https://images.unsplash.com/photo-1546173159-315724a31696?w=600&q=80",
    "https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=600&q=80",
    "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=600&q=80",
  ],
  Soups: [
    "https://images.unsplash.com/photo-1547592180-85f173990554?w=600&q=80",
    "https://images.unsplash.com/photo-1601314167099-3c8a9c4c8a3a?w=600&q=80",
    "https://images.unsplash.com/photo-1603105037880-880cd4edfb0d?w=600&q=80",
  ],
  Desserts: [
    "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=600&q=80",
    "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&q=80",
    "https://images.unsplash.com/photo-1559620192-032c4bc4674e?w=600&q=80",
    "https://images.unsplash.com/photo-1481931098730-318b6f776db0?w=600&q=80",
  ],
};

export const meals: Meal[] = mealTemplates.map((t, i) => {
  const id = `M-${String(i + 1).padStart(3, "0")}`;
  const images = imagePool[t.category] || imagePool.Spaghetti;
  return {
    id,
    name: t.name,
    category: t.category,
    description: t.description,
    longDescription: `${t.description} Crafted daily in SpagKing kitchens using premium ingredients and our signature recipes. Each plate is finished with our house gold-dust garnish and served on hand-thrown ceramics. A guest favourite that keeps SpagKing on the throne of Nigerian pasta houses.`,
    price: t.price,
    oldPrice: t.tags.includes("flash") || t.tags.includes("combo") ? t.price + int(300, 800) : undefined,
    image: images[i % images.length],
    emoji: t.emoji,
    rating: Number((3.9 + rand() * 1.1).toFixed(1)),
    reviews: int(28, 940),
    prepTime: int(8, 28),
    calories: int(280, 920),
    ingredients: Array.from(new Set(Array.from({ length: 5 }, () => pick(ingredientBank)))),
    allergens: Array.from(new Set(Array.from({ length: 2 }, () => pick(allergenBank)))),
    sizes: sizeOptions,
    toppings: toppingOptions,
    tags: t.tags || [],
    available: rand() > 0.08,
    stock: int(8, 120),
    sold: int(80, 4800),
    spicy: t.spicy,
    vegetarian: t.vegetarian,
  };
});

// Customers (250)
export const customers: Customer[] = Array.from({ length: 250 }, (_, i) => {
  const first = pick(firstNames);
  const last = pick(lastNames);
  const name = `${first} ${last}`;
  const totalSpent = money(3500, 480_000);
  const orders = int(1, 140);
  const daysAgo = int(0, 540);
  return {
    id: `C-${String(i + 1).padStart(4, "0")}`,
    name,
    email: `${first.toLowerCase()}.${last.toLowerCase()}${int(1, 99)}@gmail.com`,
    phone: phone(),
    address: pick(addresses),
    city: pick(cities),
    joinedAt: new Date(Date.now() - daysAgo * 86400000).toISOString(),
    orders,
    totalSpent,
    loyaltyPoints: Math.floor(totalSpent / 100),
    tier: totalSpent > 250_000 ? "Platinum" : totalSpent > 120_000 ? "Gold" : totalSpent > 40_000 ? "Silver" : "Bronze",
    birthday: `${String(int(1, 28)).padStart(2, "0")}/${String(int(1, 12)).padStart(2, "0")}`,
    lastOrder: new Date(Date.now() - int(0, 30) * 86400000).toISOString(),
    feedback: Number((3.4 + rand() * 1.6).toFixed(1)),
    segment: orders > 60 ? "VIP" : orders > 20 ? "Regular" : orders < 3 ? "New" : "At-Risk",
  };
});

// Riders (12)
export const riders: Rider[] = Array.from({ length: 12 }, (_, i) => {
  const first = pick(firstNames);
  const last = pick(lastNames);
  const name = `${first} ${last}`;
  return {
    id: `R-${String(i + 1).padStart(3, "0")}`,
    name,
    phone: phone(),
    avatar: avatarFor(name),
    vehicle: pick(["Honda OKada", "TVS Tricycle", "Yamaha Bike", "Bajaj Boxer"]),
    plate: `LAG ${int(100, 999)} ${pick(["KR", "GX", "AB", "FST", "GOLD"])}`,
    status: pick(["online", "on-delivery", "offline", "break"]) as Rider["status"],
    rating: Number((4.2 + rand() * 0.8).toFixed(1)),
    completedToday: int(2, 24),
    completedTotal: int(180, 2400),
    earningsToday: money(8_000, 42_000),
    zone: pick(["VI / Lekki", "Wuse / Maitama", "GRA / Trans Amadi", "Ikeja / Surulere", "Yaba / Ebute-Metta"]),
    lat: 6.4 + rand() * 0.3,
    lng: 3.3 + rand() * 0.3,
  };
});

// Employees (35)
const departments: Employee["department"][] = ["Kitchen", "Front of House", "Management", "Delivery", "Finance", "HR", "Inventory"];
const rolesByDept: Record<Employee["department"], string[]> = {
  Kitchen: ["Head Chef", "Sous Chef", "Line Cook", "Pastry Chef", "Kitchen Assistant"],
  "Front of House": ["Host", "Waiter", "Bartender", "Supervisor"],
  Management: ["Branch Manager", "Assistant Manager", "Operations Lead"],
  Delivery: ["Rider Lead", "Dispatcher"],
  Finance: ["Accountant", "Cashier", "Auditor"],
  HR: ["HR Officer", "Recruiter"],
  Inventory: ["Store Keeper", "Inventory Officer"],
};
export const employees: Employee[] = Array.from({ length: 35 }, (_, i) => {
  const dept = pick(departments);
  const first = pick(firstNames);
  const last = pick(lastNames);
  const name = `${first} ${last}`;
  return {
    id: `E-${String(i + 1).padStart(3, "0")}`,
    name,
    role: pick(rolesByDept[dept]),
    department: dept,
    email: `${first.toLowerCase()}.${last.toLowerCase()}@spagking.ng`,
    phone: phone(),
    avatar: avatarFor(name),
    branch: pick(branches).name,
    status: pick(["active", "active", "active", "on-leave", "off-duty"]) as Employee["status"],
    joinedAt: new Date(Date.now() - int(30, 1500) * 86400000).toISOString(),
    salary: money(75_000, 650_000),
    rating: Number((3.6 + rand() * 1.4).toFixed(1)),
    attendance: int(78, 99),
    shift: pick(["Morning (7am-3pm)", "Evening (3pm-11pm)", "Night (11pm-7am)", "Flexi"]),
    performance: int(55, 98),
  };
});

// Suppliers (18)
export const suppliers: Supplier[] = Array.from({ length: 18 }, (_, i) => {
  const cats = ["Produce", "Meat & Poultry", "Seafood", "Dairy", "Spices & Dry Goods", "Beverages", "Packaging", "Cleaning"];
  const name = pick([
    "Lagos Fresh Farms", "Hassan Meat Supply", "Atlantic Seafoods", "Prime Dairy Co", "GoldSpice Merchants",
    "Beverage Hub NG", "EcoPack Solutions", "CleanPro Supplies", "Ibadan Produce", "Kano Grain Co",
    "NigerDelta Fisheries", "Royal Poultry", "SpiceRoute NG", "FreshMark Logistics", "AgroBest Distributors",
    "PastaWorks", "VeggieSource", "PureWater Co",
  ]);
  return {
    id: `S-${String(i + 1).padStart(3, "0")}`,
    name,
    contact: `${pick(firstNames)} ${pick(lastNames)}`,
    phone: phone(),
    email: `sales@${name.toLowerCase().replace(/[^a-z]/g, "")}.com`,
    category: pick(cats),
    rating: Number((3.8 + rand() * 1.2).toFixed(1)),
    totalOrders: int(12, 240),
    totalSpent: money(280_000, 18_000_000),
    outstanding: money(0, 1_400_000),
    leadTime: int(1, 7),
    status: pick(["active", "active", "active", "inactive"]) as Supplier["status"],
    address: pick(addresses),
  };
});

// Orders (700)
const orderStatuses: Order["status"][] = ["received", "preparing", "cooking", "ready", "picked_up", "on_the_way", "delivered", "cancelled"];
export const orders: Order[] = Array.from({ length: 700 }, (_, i) => {
  const customer = pick(customers);
  const branch = pick(branches);
  const itemCount = int(1, 5);
  const items: OrderItem[] = Array.from({ length: itemCount }, () => {
    const m = pick(meals);
    const size = pick(m.sizes);
    const toppings = rand() > 0.6 ? [pick(m.toppings).name] : [];
    return {
      mealId: m.id, name: m.name, emoji: m.emoji,
      price: m.price + size.price, qty: int(1, 3), size: size.name, toppings,
    };
  });
  const subtotal = items.reduce((s, it) => s + it.price * it.qty, 0);
  const deliveryFee = rand() > 0.4 ? money(800, 2500) : 0;
  const vat = Math.round(subtotal * 0.075);
  const discount = rand() > 0.7 ? money(300, 1500) : 0;
  const tip = rand() > 0.5 ? money(0, 1500) : 0;
  const total = subtotal + deliveryFee + vat - discount + tip;
  const statusRoll = rand();
  const status: Order["status"] =
    statusRoll < 0.55 ? "delivered" : statusRoll < 0.62 ? "on_the_way" : statusRoll < 0.68 ? "picked_up" :
    statusRoll < 0.74 ? "ready" : statusRoll < 0.82 ? "cooking" : statusRoll < 0.9 ? "preparing" :
    statusRoll < 0.94 ? "received" : "cancelled";
  const type = pick(["delivery", "pickup", "dine-in"]) as Order["type"];
  const created = Date.now() - int(0, 60) * 86400000 - int(0, 23) * 3600000;
  return {
    id: `O-${String(i + 1).padStart(5, "0")}`,
    code: `SK${int(10000, 99999)}`,
    customer: customer.name,
    customerId: customer.id,
    branch: branch.name,
    items, subtotal, deliveryFee, vat, discount, tip, total,
    status, type,
    payment: pick(["paystack", "flutterwave", "cash"]) as Order["payment"],
    paid: status !== "cancelled" ? rand() > 0.05 : rand() > 0.7,
    rider: type === "delivery" && status !== "cancelled" ? pick(riders).name : undefined,
    address: type === "delivery" ? customer.address : undefined,
    notes: rand() > 0.7 ? "Extra spicy, no onions. Call on arrival." : undefined,
    createdAt: new Date(created).toISOString(),
    deliveredAt: status === "delivered" ? new Date(created + int(20, 70) * 60000).toISOString() : undefined,
    rating: status === "delivered" ? int(3, 5) : undefined,
    feedback: status === "delivered" ? pick(["Excellent service!", "Food was hot & fresh.", "Tasty but late.", "Will order again!", "Best spaghetti in Lagos!"]) : undefined,
  };
});

// Demo user accounts for each role
export const demoUsers: Record<Role, User> = {
  customer: { id: "U-CUST", role: "customer", name: "Chidi Okafor", email: "chidi@gmail.com", phone: "+234 802 111 2222", avatar: avatarFor("Chidi Okafor") },
  cashier: { id: "U-CASH", role: "cashier", name: "Folake Adeyemi", email: "folake@spagking.ng", phone: "+234 803 222 3333", avatar: avatarFor("Folake Adeyemi"), branch: branches[0].name },
  manager: { id: "U-MGR", role: "manager", name: "Emeka Okoro", email: "emeka@spagking.ng", phone: "+234 802 345 6789", avatar: avatarFor("Emeka Okoro"), branch: branches[0].name },
  inventory: { id: "U-INV", role: "inventory", name: "Bashir Sani", email: "bashir@spagking.ng", phone: "+234 804 333 4444", avatar: avatarFor("Bashir Sani"), branch: branches[0].name },
  hr: { id: "U-HR", role: "hr", name: "Aisha Bello", email: "aisha@spagking.ng", phone: "+234 803 456 7890", avatar: avatarFor("Aisha Bello") },
  rider: { id: "U-RDR", role: "rider", name: "Tunde Adeleke", email: "tunde@spagking.ng", phone: "+234 805 444 5555", avatar: avatarFor("Tunde Adeleke") },
  admin: { id: "U-ADM", role: "admin", name: "Ngozi Eze", email: "ngozi@spagking.ng", phone: "+234 806 555 6666", avatar: avatarFor("Ngozi Eze") },
  ceo: { id: "U-CEO", role: "ceo", name: "Dr. Kunle Mohammed", email: "ceo@spagking.ng", phone: "+234 807 666 7777", avatar: avatarFor("Kunle Mohammed") },
};

// Notifications seed
export interface AppNotification {
  id: string;
  type: "order" | "stock" | "refund" | "delivery" | "feedback" | "staff" | "system";
  title: string;
  body: string;
  time: string;
  read: boolean;
  level: "info" | "success" | "warning" | "error";
}
const notifSeed: Omit<AppNotification, "id" | "time" | "read">[] = [
  // Customer-emotional notifications first
  { type: "system", title: "🎉 You earned 150 points!", body: "Thanks for your last order. You're 750 points from King VIP 👑", level: "success" },
  { type: "order", title: "🔥 Your favourite meal is back", body: "SpagKing Royal Bolognese is freshly restocked and 20% off today", level: "info" },
  { type: "order", title: "🍜 Chef has started preparing your order", body: "Chef Ibrahim is on it — est. 12 min to perfection", level: "info" },
  { type: "delivery", title: "🛵 Rider is nearby", body: "Tunde is 4 minutes away. Get ready to dig in!", level: "success" },
  { type: "system", title: "🎁 New reward unlocked!", body: "You've unlocked the Spicy Lover badge. Tap to view your rewards.", level: "success" },
  { type: "feedback", title: "⭐ How was your meal?", body: "Rate your last order in 10 seconds and earn 50 points", level: "info" },
  { type: "system", title: "🎂 Birthday month surprise", body: "As a Gold member, enjoy 25% off all of August. Tap to claim.", level: "success" },
  { type: "order", title: "🔥 Flash sale live now", body: "Spicy Arrabbiata is 25% off for the next 2 hours — don't miss it!", level: "warning" },
  // Staff/system notifications
  { type: "order", title: "New order received", body: `Order SK${int(10000,99999)} placed by ${pick(customers).name}`, level: "info" },
  { type: "stock", title: "Low stock alert", body: `${pick(meals).name} is below reorder level (8 left)`, level: "warning" },
  { type: "delivery", title: "Delivery completed", body: `Rider ${pick(riders).name} delivered order SK${int(10000,99999)}`, level: "success" },
  { type: "feedback", title: "New customer feedback", body: `${pick(customers).name} rated their order 5★`, level: "info" },
  { type: "system", title: "End-of-day reconciliation ready", body: "Cash drawer closing balance is ready for review", level: "info" },
];
export const seedNotifications: AppNotification[] = notifSeed.map((n, i) => ({
  ...n,
  id: `N-${i + 1}`,
  time: new Date(Date.now() - i * int(8, 45) * 60000).toISOString(),
  read: i > 4,
}));

// Categories
export const categories = [
  { name: "Spaghetti", emoji: "🍝", count: meals.filter(m => m.category === "Spaghetti").length, color: "from-amber-500/20 to-yellow-600/10" },
  { name: "Rice", emoji: "🍛", count: meals.filter(m => m.category === "Rice").length, color: "from-orange-500/20 to-red-600/10" },
  { name: "Shawarma", emoji: "🌯", count: meals.filter(m => m.category === "Shawarma").length, color: "from-rose-500/20 to-pink-600/10" },
  { name: "Burgers", emoji: "🍔", count: meals.filter(m => m.category === "Burgers").length, color: "from-yellow-500/20 to-amber-600/10" },
  { name: "Drinks", emoji: "🥤", count: meals.filter(m => m.category === "Drinks").length, color: "from-cyan-500/20 to-blue-600/10" },
  { name: "Soups", emoji: "🍲", count: meals.filter(m => m.category === "Soups").length, color: "from-emerald-500/20 to-green-600/10" },
  { name: "Desserts", emoji: "🍨", count: meals.filter(m => m.category === "Desserts").length, color: "from-pink-500/20 to-rose-600/10" },
];

export const formatNaira = (n: number) =>
  "₦" + Math.round(n).toLocaleString("en-NG");

export const stats = {
  totalCustomers: customers.length,
  totalMeals: meals.length,
  totalRiders: riders.length,
  totalEmployees: employees.length,
  totalSuppliers: suppliers.length,
  totalOrders: orders.length,
  totalBranches: branches.length,
};
