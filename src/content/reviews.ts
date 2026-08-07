/**
 * SpagKing — Customer reviews (single source of truth)
 *
 * EDIT THIS FILE to paste real, publicly-visible customer reviews.
 * Sources the client can pull from (only use publicly visible content):
 *   - Google Business Profile reviews
 *   - Instagram comments naming SpagKing
 *   - Facebook recommendations
 *   - Twitter mentions
 *
 * Each review should reference the source platform so the demo can
 * credit it. Never invent reviews — if none are available, leave
 * the array empty and the UI will show a graceful empty state.
 *
 * IMPORTANT: Paste the reviewer's exact words. Do not paraphrase.
 * If the review is in Pidgin or local language, keep it as-is.
 */

export interface Review {
  id: string;
  name: string;
  role: string; // tier or "Verified customer"
  avatar: string; // initials, e.g. "AN"
  rating: 1 | 2 | 3 | 4 | 5;
  text: string; // exact quote — never invent
  meal: string;
  date: string; // human-readable, e.g. "2 days ago"
  source: "Google" | "Instagram" | "Facebook" | "Twitter" | "In-app";
  color: string; // gradient tailwind classes for avatar
}

// PLACEHOLDER reviews below. These are clearly marked as demo content.
// Replace each entry with a real, verbatim, publicly-visible review
// before launch. The UI shows a "DEMO" badge while placeholders remain.
export const reviews: Review[] = [
  {
    id: "R-001",
    name: "Adaobi N.",
    role: "Gold member",
    avatar: "AN",
    rating: 5,
    text: "Best spaghetti I've had in Lagos! The portion was generous and the sauce was perfect.",
    meal: "SpagKing Royal Bolognese",
    date: "2 days ago",
    source: "In-app",
    color: "from-amber-500 to-yellow-600",
  },
  {
    id: "R-002",
    name: "Tunde A.",
    role: "Silver member",
    avatar: "TA",
    rating: 4,
    text: "Tasty but the delivery was a bit late. Food was still hot though.",
    meal: "Chicken Alfredo Spaghetti",
    date: "1 week ago",
    source: "In-app",
    color: "from-emerald-500 to-green-600",
  },
  {
    id: "R-003",
    name: "Fatima B.",
    role: "King VIP",
    avatar: "FB",
    rating: 5,
    text: "My go-to spot. The Royal Bolognese is unmatched.",
    meal: "SpagKing Royal Bolognese",
    date: "2 weeks ago",
    source: "In-app",
    color: "from-violet-500 to-purple-600",
  },
  {
    id: "R-004",
    name: "Emeka O.",
    role: "Gold member",
    avatar: "EO",
    rating: 5,
    text: "Used the QR table ordering — so smooth! No waiting for waiter. Brilliant idea.",
    meal: "Jollof Rice Special",
    date: "1 week ago",
    source: "In-app",
    color: "from-rose-500 to-pink-600",
  },
  {
    id: "R-005",
    name: "Grace S.",
    role: "Bronze member",
    avatar: "GS",
    rating: 5,
    text: "The combo deals are amazing value. Fed my whole family for under ₦15k!",
    meal: "Rice & Beans Combo",
    date: "3 days ago",
    source: "In-app",
    color: "from-cyan-500 to-blue-600",
  },
];

export const IS_PLACEHOLDER_REVIEWS = true; // flip to false once real reviews are pasted
