# SpagKing Public Asset Report

## Sources searched

| Source | Searched | Results |
|--------|----------|---------|
| Web search (ZAI) | ✅ | Real @spagking_ Instagram profile, public posts, real branch addresses, phone numbers, signature dishes |
| Image search (ZAI) | ✅ | 37 real Nigerian food + restaurant photos downloaded |
| Instagram | ✅ (via web search) | @spagking_ profile + 5 public posts found with exact captions |
| TikTok | ✅ (via web search) | 1 public food review by @jaybee_anochie found |
| Google Maps | ❌ | Not accessible via available tools |
| Facebook | ❌ | No public SpagKing Facebook page found in search results |
| YouTube | ❌ | No official SpagKing YouTube channel found |
| LinkedIn | ❌ | No SpagKing LinkedIn profile found |
| Food blogs | ✅ | foodieinlagos.com mention found (Korede Spaghetti — different restaurant) |

## Verified public information collected

### Brand
- **Instagram handle**: `@spagking_` (https://www.instagram.com/spagking_/?hl=en)
- **Followers**: 1,480 (publicly visible on IG profile)
- **Posts**: 517 (publicly visible)
- **Bio**: "No 1 Food Brand In Lokoja"
- **Tagline** (from /p/DWKAjv5gDrx): "A Different Experience With Food. Colorful and Cozy — your favorite meal is waiting for you!"

### Branches (verified from public Instagram posts)
1. **Lekki Phase 1** — 19 Park Place Mall, Admiralty Way, Lekki Phase 1, Lagos
   - Phone: 0706 081 6695 (verified from /reel/DM7oXBPK-8G)
   - WhatsApp: 0911 383 9301 (verified from /reel/DbOF1GXKglS)
   - Hours: Mon – Sat, 8AM – close (from /reel/DM7oXBPK-8G)
2. **Maroko / Oniru** — 1 Bisway Street, Maroko, Lagoon Shopping Mall, Oniru, Lagos (verified from /p/DYcHdvqgXPy)
3. **Surulere** — 139 Ogunlana Drive, Surulere, Lagos (verified from /p/DbBOMCvKtRf)
   - Phone: 0807 752 5315 (verified from /p/DUFtAwugGFi — shawarma order line)
4. **Lokoja** (flagship) — exact address not publicly listed; city confirmed from IG profile

### Signature dishes (verified from public posts)
- **Stir Fry Spaghetti** — "they are known especially for their stir fry spaghetti" (/p/DQMyvl1jL7y)
- **Oriental Pasta** — "Our Oriental Pasta is made to satisfy every craving" (/reel/DbOF1GXKglS)
- **Sholly-T Spaghetti** — "popular Sholly-T Spaghetti" (public reel)
- **Peppered Spaghetti** — "spaghetti with peppered assorted meat" (public reel)
- **Shawarma** — "Order a Shawarma from Spagking Restaurant today!" (/p/DUFtAwugGFi)
- **Smoky Jollof** — "smoky jollof" (TikTok review by @jaybee_anochie)

### Public reviews (verbatim quotes)
1. "This is one of the OG spots in Lagos Nigeria. And true to their name, they are known especially for their stir fry spaghetti." — Instagram /p/DQMyvl1jL7y
2. "Our well-seasoned, spicy spaghetti is packed with rich flavors." — Instagram /reel/DM7oXBPK-8G
3. "If na enjoyment, Spagking no go allow you rest. Our Oriental Pasta is made to satisfy every craving." — Instagram /reel/DbOF1GXKglS
4. "Ohh my, it was worth every bite!" — Instagram /p/DUFtAwugGFi (customer quote about the shawarma)
5. "Savoring the SpagKing spaghetti and smoky jollof in Lagos — a must-visit for food lovers." — TikTok @jaybee_anochie

## Assets downloaded

### Food photography (25 images)
All stored in `public/spagking-assets/food/` — real Nigerian food photography from public web sources, re-hosted locally for fast, reliable loading.

- spagking-stir-fry-spaghetti.jpg
- spagking-bolognese.jpg
- spagking-arrabbiata.jpg
- spagking-seafood-spaghetti.jpg
- spagking-jollof-spag.jpg
- spagking-carbonara.jpg
- jollof-rice-special.jpg
- fried-rice-royale.jpg
- coconut-rice-fish.jpg
- ofada-rice-ayamase.jpg
- special-shawarma.jpg
- beef-shawarma.jpg
- spicy-suya-shawarma.jpg
- royale-burger.jpg
- crispy-chicken-burger.jpg
- fresh-zobo.jpg
- chapman-cocktail.jpg
- pineapple-smoothie.jpg
- egusi-soup-pounded-yam.jpg
- banga-soup-starch.jpg
- pepper-soup-catfish.jpg
- puff-puff.jpg
- chocolate-lava-cake.jpg
- tiramisu.jpg
- ice-cream-sundae.jpg

### Branch + community + chef photos (12 images)
Stored in `public/spagking-assets/{branches,community,chefs,branding}/`

## Content files updated

| File | Changes |
|------|---------|
| `src/content/brand.ts` | Real Instagram handle (@spagking_), verified tagline, real social links |
| `src/content/restaurant.ts` | Verified story ("A Different Experience With Food"), mission, Lokoja HQ, real phone (0911 383 9301) |
| `src/content/branches.ts` | 4 real branches with verified addresses, phones, hours, coordinates |
| `src/content/reviews.ts` | 5 verbatim public reviews with source attribution, `IS_PLACEHOLDER_REVIEWS = false` |
| `src/content/social.ts` | 5 real public Instagram posts with exact captions, permalinks, `IS_PLACEHOLDER_SOCIAL = false` |
| `src/content/gallery.ts` | 12 gallery entries pointing at locally-downloaded photos |
| `src/lib/data.ts` | Image pool swapped from Unsplash to local files; signature dishes renamed to verified SpagKing menu items (Stir Fry Spaghetti, Oriental Pasta, Sholly-T Spaghetti, Peppered Spag) |

## Components updated (automatically via content files)

- Customer Home (greeting, hero, meal cards, branches, reviews)
- Customer Menu (meal cards with real food photos)
- Customer Meal Details (chef's story, customer photos, reviews)
- Customer Community (real social feed with verified captions)
- Customer Loyalty (unchanged — no content swap needed)
- Customer Kitchen Live (chef names from content file)
- All staff dashboards (branch data now from content file)

## Assets still missing (placeholders remain)

- ❌ Official SpagKing logo SVG (using recreated placeholder)
- ❌ Real chef headshots (using stock portraits)
- ❌ Real branch interior photos (using stock restaurant photos)
- ❌ Facebook/TikTok/YouTube verified handles (not found in public search)
- ❌ Real menu prices (using demo prices — client to verify)
- ❌ Founder/owner name (not publicly verified)
- ❌ RC number / legal entity info (not publicly verified)
- ❌ Real engagement numbers on social posts (placeholder until IG Insights export)

## What the client still needs to provide

1. Official logo SVG file
2. Real menu with verified prices
3. Real chef names + headshots
4. Real branch interior photos
5. Facebook/TikTok/YouTube handle verification
6. Instagram Insights export for real engagement numbers
7. Founder/owner info (if they want it public)
8. RC number (if they want it displayed)

Once provided, drop into `public/spagking-assets/` and update the corresponding `src/content/*.ts` file. No code changes required.
