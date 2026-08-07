# SpagKing — Client Content Guide

This guide shows the SpagKing team exactly where to drop official brand
assets so the demo becomes real. No code changes are required — the app
reads from typed content files that already point at the asset folders.

---

## TL;DR — the 20-minute path to a real demo

1. Collect your official assets (food photos, logo, real reviews, social
   posts, branch info, menu with prices) into one folder.
2. Copy them into `public/spagking-assets/` using the filenames below.
3. Edit the seven files in `src/content/` with your real captions, prices,
   reviews, and branch info.
4. Reload the app. Done.

---

## Folder structure

```
public/spagking-assets/
├── logo/              ← official logo (svg preferred)
├── food/              ← one photo per meal (filenames listed in menu.ts)
├── branch-photos/     ← interior / exterior shots per branch
├── chefs/             ← chef headshots
├── community/         ← real Instagram/Facebook/social posts
├── menu/              ← high-res menu scans (optional)
├── banners/           ← promotional banners for the hero carousel
└── reviews/           ← (optional) review screenshots
```

---

## The seven content files

Each file is heavily commented and shows exactly what to replace.
All files live in `src/content/`.

### 1. `brand.ts` — brand identity

- `name`, `tagline`, `wordmark`
- `logo.full` / `logo.mark` / `logo.favicon` → paths to your logo files
- `social.instagram`, `social.facebook`, etc. → your real handles

**Action:** Drop your logo SVG at
`public/spagking-assets/logo/spagking-logo.svg` and update `logo.full`
to `"/spagking-assets/logo/spagking-logo.svg"`.

### 2. `restaurant.ts` — business profile

- `legalName`, `tradingName`, `rcNumber`, `foundedYear`, `headquarters`
- `story`, `mission`, `values`
- `founder`, `email`, `phone`, `website`
- The `chefs` array (name, role, photo, bio)

**Action:** Paste your verified business info. Leave any unknown field as
`null` — the UI will omit it gracefully. Drop chef headshots into
`public/spagking-assets/chefs/` and set each chef's `photo` field to
`"/spagking-assets/chefs/<filename>.jpg"`.

### 3. `branches.ts` — branch locations

- One entry per branch: `name`, `address`, `city`, `state`, `phone`,
  `manager`, `openingHours`, `photo`, `lat`/`lng` (Google Maps coords)

**Action:** Paste your verified branch info. Coordinates can be copied
from Google Maps (right-click a location → coordinates). Drop branch
photos into `public/spagking-assets/branch-photos/`.

### 4. `menu.ts` — meal catalogue

- Full meal definitions: name, category, price, description, photo,
  ingredients, allergens, sizes, toppings, tags

**Action:** When you provide your real menu, move the meal list from
`src/lib/data.ts` (where it currently lives for backwards compat) into
this file. Drop one photo per meal into
`public/spagking-assets/food/` using the meal's `id` as the filename
(e.g. `M-001.jpg`).

### 5. `reviews.ts` — customer testimonials

- Each review: `name`, `rating`, `text`, `meal`, `source`

**Action:** Paste real, publicly-visible reviews verbatim from Google
Business Profile, Instagram comments, or Facebook. Set
`IS_PLACEHOLDER_REVIEWS = false` once real reviews are in. **Never
invent reviews.**

### 6. `gallery.ts` — photo gallery

- One entry per image: `url`, `caption`, `category`

**Action:** Drop your food/interior photography into
`public/spagking-assets/food/` or `/branch-photos/` and update the `url`
field for each gallery entry.

### 7. `social.ts` — social posts feed

- Each post: `platform`, `author`, `caption`, `image`, `postedAt`,
  `likes`, `comments`
- `socialStats` array for follower counts

**Action:** Export your own Instagram/Facebook posts (you own your
content — no rights issues). Drop the post images into
`public/spagking-assets/community/`. Paste the exact caption, posted
date, and engagement numbers. Set `IS_PLACEHOLDER_SOCIAL = false`.

---

## Image optimization tips

- **Food shots:** ~600×600px, webp or jpg at 80% quality
- **Branch photos:** ~1200×800px landscape
- **Logo:** SVG (vector) — renders crisp at every size and theme
- **Chef headshots:** ~400×400px square
- **Social posts:** ~600×600px square (Instagram aspect)

The app lazy-loads every image and shows an emoji fallback if an image
fails to load — so you can drop assets in incrementally without breaking
the demo.

---

## What NOT to do

- ❌ Do not invent reviews, addresses, phone numbers, or business info
- ❌ Do not use copyrighted images you don't have rights to
- ❌ Do not hotlink — copy files into the assets folder so the app is
  self-contained and fast
- ❌ Do not paraphrase reviews — paste the reviewer's exact words
- ❌ Do not remove the `IS_PLACEHOLDER_*` flags until real content is in

---

## Need help?

Once you've collected the assets, hand them to the developer along
with this guide. The swap takes about 15 minutes — no UI changes, no
redesign, just content replacement. The premium look and feel stays
exactly as it is now.
