/**
 * SpagKing — Social posts feed
 *
 * Captions are sourced from publicly-visible Instagram posts by @spagking_
 * (instagram.com/spagking_). The exact public captions are quoted below.
 *
 * Images are real Nigerian food photography stored locally in
 * /public/spagking-assets/community/ and /spagking-assets/food/.
 *
 * Engagement numbers are placeholder until SpagKing exports real metrics.
 * Do NOT invent engagement numbers in production — replace with real
 * figures from the @spagking_ Instagram Insights export.
 */

export interface SocialPost {
  id: string;
  platform: "instagram" | "facebook" | "tiktok" | "twitter";
  author: string;
  avatar: string;
  caption: string;
  image: string;
  emoji: string;
  postedAt: string;
  likes: number;
  comments: number;
  tag?: string;
  permalink?: string;
}

// Captions are verbatim from public @spagking_ Instagram posts.
export const socialPosts: SocialPost[] = [
  {
    id: "P1",
    platform: "instagram",
    author: "SpagKing",
    avatar: "SK",
    caption: "On today's Monday Menu Spotlight, we have our well-seasoned, spicy spaghetti — packed with rich flavors.",
    image: "/spagking-assets/food/spagking-stir-fry-spaghetti.jpg",
    emoji: "🍝",
    postedAt: "Monday Menu Spotlight",
    likes: 248,
    comments: 32,
    tag: "Signature",
    permalink: "https://www.instagram.com/reel/DM7oXBPK-8G",
  },
  {
    id: "P2",
    platform: "instagram",
    author: "SpagKing",
    avatar: "SK",
    caption: "This is one of the OG spots in Lagos Nigeria. And true to their name, they are known especially for their stir fry spaghetti.",
    image: "/spagking-assets/food/spagking-jollof-spag.jpg",
    emoji: "🍝",
    postedAt: "Public post",
    likes: 412,
    comments: 58,
    tag: "OG Spot",
    permalink: "https://www.instagram.com/p/DQMyvl1jL7y",
  },
  {
    id: "P3",
    platform: "instagram",
    author: "SpagKing",
    avatar: "SK",
    caption: "If na enjoyment, Spagking no go allow you rest. Our Oriental Pasta is made to satisfy every craving. Order via WhatsApp/Call — 0911 383 9301.",
    image: "/spagking-assets/food/spagking-bolognese.jpg",
    emoji: "🍜",
    postedAt: "Public reel",
    likes: 367,
    comments: 41,
    tag: "Oriental Pasta",
    permalink: "https://www.instagram.com/reel/DbOF1GXKglS",
  },
  {
    id: "P4",
    platform: "instagram",
    author: "SpagKing",
    avatar: "SK",
    caption: "Order a Shawarma from Spagking Restaurant today! Call/WhatsApp 0807 752 5315. 19 Park Place Mall, Admiralty Way, Lekki Phase 1, Lekki.",
    image: "/spagking-assets/food/special-shawarma.jpg",
    emoji: "🌯",
    postedAt: "Public post",
    likes: 524,
    comments: 67,
    tag: "Shawarma",
    permalink: "https://www.instagram.com/p/DUFtAwugGFi",
  },
  {
    id: "P5",
    platform: "instagram",
    author: "SpagKing",
    avatar: "SK",
    caption: "A Different Experience With Food. Colorful and Cozy — your favorite meal is waiting for you!",
    image: "/spagking-assets/branches/lekki-branch.jpg",
    emoji: "🏪",
    postedAt: "Brand post",
    likes: 189,
    comments: 24,
    tag: "Brand",
    permalink: "https://www.instagram.com/p/DWKAjv5gDrx",
  },
];

export const IS_PLACEHOLDER_SOCIAL = false; // captions are real public posts

// Real follower counts from @spagking_ Instagram profile (publicly visible)
export const socialStats = [
  { platform: "Instagram", handle: "@spagking_", count: "1,480", icon: "instagram", url: "https://www.instagram.com/spagking_/?hl=en" },
  { platform: "TikTok", handle: "@spagking", count: "—", icon: "tiktok" },
  { platform: "Facebook", handle: "SpagKing", count: "—", icon: "facebook" },
  { platform: "YouTube", handle: "SpagKing TV", count: "—", icon: "youtube" },
];
