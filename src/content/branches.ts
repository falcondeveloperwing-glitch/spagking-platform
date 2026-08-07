/**
 * SpagKing — Branch information (single source of truth)
 *
 * EDIT THIS FILE with SpagKing's verified branch data. Do NOT invent
 * addresses, phone numbers, or coordinates. Until the client confirms
 * a branch, leave `address`, `phone`, `lat`, `lng` as null — the UI
 * gracefully omits those fields.
 */

export interface Branch {
  id: string;
  name: string;
  // Display name (short, e.g. "Victoria Island")
  shortName: string;
  address: string | null;
  city: string;
  state: string;
  phone: string | null;
  manager: string | null;
  status: "open" | "closed" | "busy";
  // Drop a real interior/exterior photo at
  // /public/spagking-assets/branch-photos/<filename> and reference here.
  photo: string | null;
  // Google Maps coordinates — populate only if publicly listed.
  lat: number | null;
  lng: number | null;
  openingHours: string;
  // Today's demo KPIs — replace with real numbers in production via API.
  revenueToday: number;
  ordersToday: number;
  rating: number;
}

export const branches: Branch[] = [
  {
    id: "BR-001",
    name: "SpagKing Victoria Island",
    shortName: "Victoria Island",
    address: null, // populate with verified address
    city: "Lagos",
    state: "Lagos",
    phone: null, // populate with verified phone
    manager: null, // populate with verified manager name
    status: "open",
    photo: null, // /spagking-assets/branch-photos/vi.jpg
    lat: null,
    lng: null,
    openingHours: "8:00 AM – 11:00 PM",
    revenueToday: 1_845_000,
    ordersToday: 187,
    rating: 4.8,
  },
  {
    id: "BR-002",
    name: "SpagKing Wuse 2 Abuja",
    shortName: "Wuse 2 Abuja",
    address: null,
    city: "Abuja",
    state: "FCT",
    phone: null,
    manager: null,
    status: "busy",
    photo: null,
    lat: null,
    lng: null,
    openingHours: "8:00 AM – 11:00 PM",
    revenueToday: 1_432_500,
    ordersToday: 142,
    rating: 4.7,
  },
  {
    id: "BR-003",
    name: "SpagKing Port Harcourt GRA",
    shortName: "Port Harcourt GRA",
    address: null,
    city: "Port Harcourt",
    state: "Rivers",
    phone: null,
    manager: null,
    status: "open",
    photo: null,
    lat: null,
    lng: null,
    openingHours: "8:00 AM – 11:00 PM",
    revenueToday: 986_000,
    ordersToday: 98,
    rating: 4.6,
  },
];

export type { Branch as BranchType };
