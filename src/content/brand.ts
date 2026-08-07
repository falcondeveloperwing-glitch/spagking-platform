/**
 * SpagKing — Verified public brand content
 *
 * SOURCES (publicly visible):
 *  - Instagram: https://www.instagram.com/spagking_/?hl=en  (@spagking_)
 *  - Instagram posts: /p/DUFtAwugGFi, /p/DYcHdvqgXPy, /p/DbBOMCvKtRf, /p/DWKAjv5gDrx
 *  - Public posts list real branch addresses, phone numbers, and tagline.
 *
 * Do NOT invent. If a field is unknown, leave null.
 */

export const brand = {
  name: "SpagKing",
  wordmark: "SpagKing",
  tagline: "A Different Experience With Food. Colorful and Cozy — your favourite meal is waiting for you!",
  colors: {
    gold: "#FFD700",
    goldDeep: "#D4A017",
    background: "#050505",
    accent: "#FFFFFF",
    success: "#00E676",
    error: "#FF4D6A",
  },
  logo: {
    full: "/spagking-logo.svg",
    mark: "/spagking-mark.svg",
    favicon: "/favicon.svg",
  },
  social: {
    instagram: "@spagking_",           // verified: instagram.com/spagking_
    instagramUrl: "https://www.instagram.com/spagking_/?hl=en",
    facebook: null as string | null,    // not verified — leave null
    tiktok: null as string | null,
    youtube: null as string | null,
    twitter: null as string | null,
    website: null as string | null,
  },
} as const;

export type Brand = typeof brand;
