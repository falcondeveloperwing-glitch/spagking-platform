# SpagKing — Project Handoff README

## Quick Start

```bash
cd /home/z/my-project
bun run dev    # starts on http://localhost:3000
```

The app auto-loads. After a 6-second splash screen, the SpagKing landing
page appears. Click **"Order Now"** to access the demo login.

## Demo Credentials

See `DEMO-CREDENTIALS.md` — 9 roles, no passwords, one-click login.

## Architecture Overview

**Framework:** Next.js 16 with App Router (single-route SPA)
**Language:** TypeScript 5
**Styling:** Tailwind CSS 4 + shadcn/ui (New York style)
**State:** Zustand (persisted to localStorage)
**Charts:** Recharts
**Animation:** Framer Motion
**Icons:** Lucide React
**Fonts:** Inter (body) + Poppins (headings) + Pacifico (wordmark)

**Routing:** Everything lives under `/` — the Zustand store manages view
switching between Landing → Auth → Customer App / Staff App. No
multi-route Next.js pages.

## Major Modules

| Module | Component Path | Description |
|--------|----------------|-------------|
| Landing Page | `src/components/landing/` | Public-facing brand experience |
| Customer App | `src/components/customer-app.tsx` | Full ordering experience |
| Customer Home | `src/components/customer/home.tsx` | Greeting, hero, categories, sections |
| Customer Menu | `src/components/customer/menu.tsx` | Filter, sort, search meals |
| Meal Details | `src/components/customer/meal-details.tsx` | Chef story, pairings, reviews |
| Cart & Checkout | `src/components/customer/cart-sheet.tsx`, `checkout.tsx` | Cart, coupons, checkout flow |
| Order Tracking | `src/components/customer/tracking.tsx` | Animated 7-step timeline |
| Loyalty | `src/components/customer/loyalty.tsx` | Tiers, spin wheel, badges, streak |
| Community | `src/components/customer/community.tsx` | Social feed, TikTok/IG/FB/YT tabs |
| Kitchen Live | `src/components/customer/kitchen-live.tsx` | Live kitchen activity feed |
| POS Terminal | `src/components/staff/pos.tsx` | Product grid, ticket, shift management |
| Inventory | `src/components/staff/inventory.tsx` | Stock, suppliers, POs, waste, expiry |
| Staff & HR | `src/components/staff/staff-mgmt.tsx` | Attendance, shifts, leave, payroll, disciplinary |
| Reports | `src/components/staff/reports.tsx` | Daily, weekly, monthly analytics |
| CRM | `src/components/staff/crm.tsx` | Customer profiles, campaigns, feedback, loyalty |
| Delivery | `src/components/staff/delivery.tsx` | Live map, riders, zones, metrics |
| Executive | `src/components/staff/executive.tsx` | CEO command center |
| Admin | `src/components/staff/admin.tsx` | Branches, users, roles, taxes, audit |

## Content Files (Single Source of Truth)

All brand content is centralized in `src/content/`:

| File | Contents |
|------|----------|
| `brand.ts` | Logo paths, tagline, social handles, brand colors |
| `restaurant.ts` | Business profile, story, mission, chef profiles |
| `branches.ts` | 4 real branches with verified addresses, phones, hours |
| `menu.ts` | Meal type definitions, category metadata, default sizes/toppings |
| `reviews.ts` | 5 verbatim public reviews with source attribution |
| `gallery.ts` | 12 gallery images (local food photography) |
| `social.ts` | 5 real Instagram posts with captions + permalinks |

## Assets

All local assets live in `public/spagking-assets/`:

| Folder | Contents |
|--------|----------|
| `food/` | 25 Nigerian food photos (downloaded from public sources) |
| `branches/` | 4 branch interior/exterior photos |
| `chefs/` | 2 chef portrait photos |
| `community/` | 5 community/social photos |
| `branding/` | 1 hero banner photo |
| `logo/` | (Reserved for official SpagKing logo — currently using `/spagking-logo.svg`) |

See `public/spagking-assets/README.md` for placement instructions.
See `CLIENT_CONTENT_GUIDE.md` for the full content swap guide.

## Production Limitations

| Area | Demo | Production Needs |
|------|------|-----------------|
| Payments | Demo flow (toast confirmation) | Live Paystack + Flutterwave API keys |
| Backend | Client-side mock data (Zustand + localStorage) | Database (PostgreSQL/MySQL) + REST/GraphQL API |
| Authentication | Demo role selection (no real auth) | NextAuth.js or Firebase Auth with real user accounts |
| WhatsApp | Demo campaign cards | WhatsApp Business API integration |
| SMS | Demo campaign cards | Twilio or similar SMS gateway |
| Email | Demo campaign cards | SendGrid or similar email service |
| GPS/Maps | Stylized SVG map | Google Maps JavaScript API or Mapbox |
| Receipt Printing | Toast "printing receipt" | ESC/POS printer integration via WebUSB or network |
| Push Notifications | In-app notification bell | Firebase Cloud Messaging or OneSignal |
| Images | Public web food photography | SpagKing's own official food photography |

## Deployment Notes

The app is a standard Next.js application. To deploy:

1. **Production build:** `bun run build` (creates `.next/standalone/`)
2. **Start:** `NODE_ENV=production bun .next/standalone/server.js`
3. **Environment:** Set `NEXTAUTH_URL`, `PAYSTACK_SECRET_KEY`,
   `FLUTTERWAVE_SECRET_KEY`, `TWILIO_AUTH_TOKEN`, etc. in production env.
4. **Database:** Run `bun run db:push` to create the Prisma schema
5. **CDN:** Host images on a CDN for production (currently local)

## Where to Connect Production Integrations

| Integration | File to Edit | What to Add |
|-------------|-------------|-------------|
| Paystack | `src/components/customer/checkout.tsx` | Replace demo toast with Paystack checkout redirect |
| Flutterwave | `src/components/customer/checkout.tsx` | Replace demo toast with Flutterwave modal |
| WhatsApp | `src/components/staff/crm.tsx` | Replace demo campaign with WhatsApp Business API call |
| SMS | `src/components/staff/crm.tsx` | Replace demo with Twilio API call |
| Email | `src/components/staff/crm.tsx` | Replace demo with SendGrid API call |
| GPS | `src/components/staff/delivery.tsx` | Replace SVG map with Google Maps component |
| Auth | `src/lib/store.ts` | Replace `login()` with NextAuth session check |
| Database | `src/lib/data.ts` | Replace module-level arrays with API fetches |

## Theme System

- **Dark mode** (default): Deep black (#050505) with neon gold (#FFD700)
- **Light mode**: Warm cream (#FAF7F2) with deep gold (#D4A017)
- **System mode**: Follows OS preference
- Toggle via the sun/moon icon in any header
- Preference persists in localStorage
- No flash on reload (inline init script in `<head>`)

## Verification Status

- ✅ Lint: 0 errors, 0 warnings
- ✅ Console: 0 errors, 0 warnings
- ✅ Hydration: 0 warnings
- ✅ Responsive: 320px – 2560px, zero overflow
- ✅ Dark + Light themes verified
- ✅ All 9 roles tested and routing correctly
- ✅ All client requirements demonstrable
