/**
 * SpagKing — Gallery content (single source of truth)
 *
 * EDIT THIS FILE with SpagKing's official photography. Drop real photos
 * into /public/spagking-assets/food/ or /spagking-assets/branch-photos/
 * and reference them here. Do NOT use copyrighted images without rights.
 */

export interface GalleryImage {
  id: string;
  url: string;
  emoji: string; // shown while image loads or if it fails
  caption: string;
  category: "food" | "interior" | "chef" | "community";
  photographer?: string; // credit if required
}

// PLACEHOLDER — these point at Unsplash demo images. Replace with
// SpagKing's own photography once supplied by the client.
export const gallery: GalleryImage[] = [
  { id: "G1", url: "https://images.unsplash.com/photo-1622973536968-3ead9e780960?w=600&q=80", emoji: "🍝", caption: "Today's special: Royal Bolognese", category: "food" },
  { id: "G2", url: "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=600&q=80", emoji: "🍛", caption: "Jollof season is here", category: "food" },
  { id: "G3", url: "https://images.unsplash.com/photo-1633321088355-d0f81134ca3a?w=600&q=80", emoji: "🌯", caption: "Shawarma Saturday vibes", category: "food" },
  { id: "G4", url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80", emoji: "🍔", caption: "Royale Burger dropped today", category: "food" },
  { id: "G5", url: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=600&q=80", emoji: "🥤", caption: "Fresh Zobo — made daily", category: "food" },
  { id: "G6", url: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&q=80", emoji: "🍫", caption: "Dessert date night", category: "food" },
  { id: "G7", url: "https://images.unsplash.com/photo-1547592180-85f173990554?w=600&q=80", emoji: "🍲", caption: "Egusi & pounded yam — proper Naija", category: "food" },
  { id: "G8", url: "https://images.unsplash.com/photo-1481931098730-318b6f776db0?w=600&q=80", emoji: "🎂", caption: "Birthday cake combos available", category: "food" },
];

export const IS_PLACEHOLDER_GALLERY = true;
