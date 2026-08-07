/**
 * SpagKing — Social posts feed (single source of truth)
 *
 * EDIT THIS FILE with SpagKing's real, publicly-visible social posts.
 * The client can export their own Instagram / Facebook / TikTok posts
 * (they own their own content — no rights issues) and paste the
 * captions, dates, and engagement numbers here.
 *
 * Drop the post images into /public/spagking-assets/community/
 * using the `image` filename you reference below.
 *
 * Do NOT invent posts. If no real posts are available yet, leave the
 * PLACEHOLDER array in place — it is clearly labelled as demo content.
 */

export interface SocialPost {
  id: string;
  platform: "instagram" | "facebook" | "tiktok" | "twitter";
  author: string;
  avatar: string; // initials
  caption: string; // exact caption from the real post
  image: string; // /spagking-assets/community/<file>.jpg
  emoji: string; // shown while image loads
  postedAt: string; // human-readable, e.g. "2h ago"
  likes: number;
  comments: number;
  tag?: string; // "5★ review" | "Trending" | "Family" | etc.
}

// PLACEHOLDER — replace with SpagKing's real social posts.
export const socialPosts: SocialPost[] = [
  {
    id: "P1",
    platform: "instagram",
    author: "Adaobi N.",
    avatar: "AN",
    caption: "Just had the Royal Bolognese and I'm in heaven! The gold garnish is everything ✨",
    image: "https://images.unsplash.com/photo-1622973536968-3ead9e780960?w=600&q=80",
    emoji: "🍝",
    postedAt: "2h ago",
    likes: 248,
    comments: 32,
    tag: "5★ review",
  },
  {
    id: "P2",
    platform: "instagram",
    author: "Tunde A.",
    avatar: "TA",
    caption: "Suya Shawarma hits different at 2am 🔥 SpagKing never misses",
    image: "https://images.unsplash.com/photo-1633321088355-d0f81134ca3a?w=600&q=80",
    emoji: "🌯",
    postedAt: "5h ago",
    likes: 412,
    comments: 58,
    tag: "Trending",
  },
  {
    id: "P3",
    platform: "facebook",
    author: "Fatima B.",
    avatar: "FB",
    caption: "Family dinner sorted! Jollof + plantain + chicken. The kids approved 🥰",
    image: "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=600&q=80",
    emoji: "🍛",
    postedAt: "8h ago",
    likes: 189,
    comments: 24,
    tag: "Family",
  },
  {
    id: "P4",
    platform: "instagram",
    author: "Emeka O.",
    avatar: "EO",
    caption: "Date night at SpagKing VI. The ambience + this seafood pasta = perfection 💕",
    image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=600&q=80",
    emoji: "🍝",
    postedAt: "1d ago",
    likes: 367,
    comments: 41,
    tag: "Date night",
  },
  {
    id: "P5",
    platform: "instagram",
    author: "Grace S.",
    avatar: "GS",
    caption: "Molten centre cake with ice cream. Best dessert in Lagos, hands down 🤤",
    image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&q=80",
    emoji: "🍫",
    postedAt: "1d ago",
    likes: 524,
    comments: 67,
    tag: "Dessert",
  },
];

export const IS_PLACEHOLDER_SOCIAL = true;

// Social platform aggregates — replace with real follower counts
// pulled from SpagKing's official profiles.
export const socialStats = [
  { platform: "TikTok", handle: "@spagking", count: "284K", icon: "tiktok" },
  { platform: "Instagram", handle: "@spagking.ng", count: "156K", icon: "instagram" },
  { platform: "Facebook", handle: "SpagKing Foods", count: "8.4K", icon: "facebook" },
  { platform: "YouTube", handle: "SpagKing TV", count: "42K", icon: "youtube" },
];
