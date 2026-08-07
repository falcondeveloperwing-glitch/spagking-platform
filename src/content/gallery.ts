/**
 * SpagKing — Photo gallery
 *
 * Photos are real Nigerian food photography downloaded to
 * /public/spagking-assets/food/ from public web image sources.
 * Captions are generic until SpagKing provides official ones.
 */

export interface GalleryImage {
  id: string;
  url: string;
  emoji: string;
  caption: string;
  category: "food" | "interior" | "chef" | "community";
  photographer?: string;
}

export const gallery: GalleryImage[] = [
  { id: "G1", url: "/spagking-assets/food/spagking-stir-fry-spaghetti.jpg", emoji: "🍝", caption: "Signature Stir-Fry Spaghetti", category: "food" },
  { id: "G2", url: "/spagking-assets/food/jollof-rice-special.jpg", emoji: "🍛", caption: "Jollof season is here", category: "food" },
  { id: "G3", url: "/spagking-assets/food/special-shawarma.jpg", emoji: "🌯", caption: "Shawarma Saturday vibes", category: "food" },
  { id: "G4", url: "/spagking-assets/food/royale-burger.jpg", emoji: "🍔", caption: "Royale Burger dropped today", category: "food" },
  { id: "G5", url: "/spagking-assets/food/fresh-zobo.jpg", emoji: "🥤", caption: "Fresh Zobo — made daily", category: "food" },
  { id: "G6", url: "/spagking-assets/food/chocolate-lava-cake.jpg", emoji: "🍫", caption: "Dessert date night", category: "food" },
  { id: "G7", url: "/spagking-assets/food/egusi-soup-pounded-yam.jpg", emoji: "🍲", caption: "Egusi & pounded yam — proper Naija", category: "food" },
  { id: "G8", url: "/spagking-assets/food/puff-puff.jpg", emoji: "🍩", caption: "Puff-puff — golden and fluffy", category: "food" },
  { id: "G9", url: "/spagking-assets/branches/lekki-branch.jpg", emoji: "🏪", caption: "Inside our Lekki Phase 1 branch", category: "interior" },
  { id: "G10", url: "/spagking-assets/branches/lekki-exterior.jpg", emoji: "🌃", caption: "Maroko / Oniru branch at night", category: "interior" },
  { id: "G11", url: "/spagking-assets/chefs/chef-ibrahim.jpg", emoji: "👨‍🍳", caption: "Chef at work", category: "chef" },
  { id: "G12", url: "/spagking-assets/community/post-2.jpg", emoji: "🍽️", caption: "Naija food flat lay", category: "community" },
];

export const IS_PLACEHOLDER_GALLERY = true; // real food photos, generic captions
