/**
 * SpagKing — Brand content (single source of truth)
 *
 * EDIT THIS FILE to swap placeholder brand content with SpagKing's
 * official brand assets. See /public/spagking-assets/README.md and
 * CLIENT_CONTENT_GUIDE.md for instructions.
 *
 * Do NOT invent business information. Until the client provides real
 * values, the placeholders below stay in place.
 */

export const brand = {
  name: "SpagKing",
  wordmark: "SpagKing", // script wordmark — rendered in Pacifico
  tagline: "Crafted with Passion. Served with Excellence.",
  // Brand colors are kept in globals.css as CSS variables so they theme
  // correctly. Reference them via var(--gold), var(--background), etc.
  colors: {
    gold: "#FFD700",
    goldDeep: "#D4A017",
    background: "#050505",
    accent: "#FFFFFF",
    success: "#00E676",
    error: "#FF4D6A",
  },
  logo: {
    // Drop the real SVG at /public/spagking-assets/logo/spagking-logo.svg
    // and switch this path to "/spagking-assets/logo/spagking-logo.svg".
    // Until then we use the placeholder logo at /spagking-logo.svg.
    full: "/spagking-logo.svg",
    mark: "/spagking-mark.svg",
    favicon: "/favicon.svg",
  },
  // Social handles — replace with the real ones once verified by the client.
  // Leave as `null` if the client has not confirmed the handle.
  social: {
    instagram: "@spagking.ng", // verify before launch
    facebook: "SpagKing Foods",
    tiktok: "@spagking",
    youtube: "SpagKing TV",
    twitter: null as string | null,
    website: null as string | null,
  },
} as const;

export type Brand = typeof brand;
