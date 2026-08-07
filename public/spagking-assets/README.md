# SpagKing Official Assets — Placement Guide

This directory holds SpagKing's official brand assets. The application reads
from these paths. Until real assets are supplied, the app gracefully falls
back to the placeholder content already wired into `src/content/*.ts`.

## Folder structure

```
public/spagking-assets/
├── logo/              ← official logo files (svg preferred)
├── food/              ← meal photography, one file per meal (see menu.ts for filenames)
├── branch-photos/     ← interior / exterior shots per branch
├── chefs/             ← chef headshots used in Kitchen Live + meal details
├── community/         ← real customer / social posts (Instagram, Facebook, etc.)
├── menu/              ← high-res menu scans or item photography
├── banners/           ← promotional banners for the hero carousel
└── reviews/           ← (optional) screenshots of real reviews
```

## Quick-start checklist for the client

1. Drop the official logo SVG into `logo/spagking-logo.svg`
   (already exists as a placeholder — overwrite it)
2. Drop meal photos into `food/` using the exact filenames listed in
   `src/content/menu.ts` (the `image` field of each meal)
3. Drop branch photos into `branch-photos/` using the filenames in
   `src/content/branches.ts`
4. Drop chef headshots into `chefs/` using the filenames in
   `src/content/restaurant.ts` (the `chefs` array)
5. Drop real social posts into `community/` and update `src/content/social.ts`
   with the real captions, dates, and engagement numbers
6. Paste real customer reviews into `src/content/reviews.ts`

That's it — no code changes required. The app picks up the new assets on
the next page load.

## Important notes

- **Only use content SpagKing owns or has rights to.** The restaurant owns
  its own food photos, logo, menu, and social posts. Customer reviews are
  public on Google/Instagram but should be used with care — prefer reviews
  the restaurant has explicitly collected or that name SpagKing publicly.
- **Do not hotlink.** Copy the original files into this folder so the app
  is self-contained and fast.
- **Optimize images before dropping them in.** Aim for ~600×600px webp or
  jpg at 80% quality for food shots. The app lazy-loads everything.
- **Logo format.** SVG is strongly preferred for crisp rendering at every
  size and theme. A PNG fallback can live next to it.

See `CLIENT_CONTENT_GUIDE.md` in the project root for the full editorial
walkthrough of every content file.
