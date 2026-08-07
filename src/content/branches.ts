/**
 * SpagKing — Verified public branch info
 *
 * SOURCES (publicly visible Instagram posts by @spagking_):
 *  - /p/DUFtAwugGFi: "19 Park Place Mall, Admiralty Way, Lekki Phase1, Lekki, Lagos"
 *  - /p/DYcHdvqgXPy: "1 Bisway Street Maroko, Lagoon Shopping Mall, Oniru, Lagos"
 *                   + "19 Park Place Mall, Admiralty Way, Lekki Phase1, Lekki, Lagos"
 *  - /p/DbBOMCvKtRf: "Jubilee Mall Admiralty Way, Lekki Phase 1, Lagos. Shop i-326"
 *                   + "139 Ogunlana Drive, Surulere, Lagos"
 *  - @spagking_ profile: based in Lokoja ("No 1 Food Brand In Lokoja")
 *
 * Real phone numbers (publicly posted):
 *  - 07060816695 (Lekki Admiralty Way — Monday Menu Spotlight reel)
 *  - 0911 383 9301 (WhatsApp/order line — Oriental Pasta reel)
 *  - 0807 752 5315 (Shawarma order line — /p/DUFtAwugGFi)
 *
 * Hours (publicly posted):
 *  - Lekki: Monday – Saturday, 8AM – (close)
 *  - Lokoja: free food 4pm-6pm promo (from profile)
 */

export interface Branch {
  id: string;
  name: string;
  shortName: string;
  address: string | null;
  city: string;
  state: string;
  phone: string | null;
  whatsapp?: string | null;
  manager: string | null;
  status: "open" | "closed" | "busy";
  photo: string | null;
  lat: number | null;
  lng: number | null;
  openingHours: string;
  revenueToday: number;
  ordersToday: number;
  rating: number;
}

export const branches: Branch[] = [
  {
    id: "BR-001",
    name: "SpagKing Lekki Phase 1",
    shortName: "Lekki Phase 1",
    // Verified from Instagram /p/DUFtAwugGFi and /p/DYcHdvqgXPy
    address: "19 Park Place Mall, Admiralty Way, Lekki Phase 1, Lagos",
    city: "Lagos",
    state: "Lagos",
    phone: "0706 081 6695",      // verified: 07060816695
    whatsapp: "0911 383 9301",   // verified order line
    manager: null,
    status: "open",
    photo: "/spagking-assets/branches/lekki-branch.jpg",
    lat: 6.4474,   // Admiralty Way, Lekki Phase 1
    lng: 3.4686,
    openingHours: "Mon – Sat · 8:00 AM – 10:00 PM",
    revenueToday: 1_845_000,
    ordersToday: 187,
    rating: 4.8,
  },
  {
    id: "BR-002",
    name: "SpagKing Maroko / Oniru",
    shortName: "Maroko / Oniru",
    // Verified from Instagram /p/DYcHdvqgXPy
    address: "1 Bisway Street, Maroko, Lagoon Shopping Mall, Oniru, Lagos",
    city: "Lagos",
    state: "Lagos",
    phone: "0706 081 6695",
    whatsapp: "0911 383 9301",
    manager: null,
    status: "busy",
    photo: "/spagking-assets/branches/lekki-exterior.jpg",
    lat: 6.4384,
    lng: 3.4236,
    openingHours: "Mon – Sat · 8:00 AM – 10:00 PM",
    revenueToday: 1_432_500,
    ordersToday: 142,
    rating: 4.7,
  },
  {
    id: "BR-003",
    name: "SpagKing Surulere",
    shortName: "Surulere",
    // Verified from Instagram /p/DbBOMCvKtRf
    address: "139 Ogunlana Drive, Surulere, Lagos",
    city: "Lagos",
    state: "Lagos",
    phone: "0807 752 5315",      // verified shawarma order line
    whatsapp: "0911 383 9301",
    manager: null,
    status: "open",
    photo: "/spagking-assets/branches/surulere-branch.jpg",
    lat: 6.5075,
    lng: 3.3534,
    openingHours: "Mon – Sat · 8:00 AM – 10:00 PM",
    revenueToday: 986_000,
    ordersToday: 98,
    rating: 4.6,
  },
  {
    id: "BR-004",
    name: "SpagKing Lokoja (Flagship)",
    shortName: "Lokoja",
    // Verified from @spagking_ Instagram profile — "No 1 Food Brand In Lokoja"
    address: null, // exact address not verified publicly — leave null
    city: "Lokoja",
    state: "Kogi",
    phone: null,    // not verified — leave null
    whatsapp: null,
    manager: null,
    status: "open",
    photo: "/spagking-assets/branches/lokoja-branch.jpg",
    lat: 7.8024,    // Lokoja city centre
    lng: 6.7430,
    openingHours: "Mon – Sun · 8:00 AM – 10:00 PM",
    revenueToday: 1_240_000,
    ordersToday: 156,
    rating: 4.9,
  },
];

export type { Branch as BranchType };
