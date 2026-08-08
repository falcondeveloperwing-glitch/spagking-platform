# SpagKing Restaurant Management Platform

A premium, full-featured restaurant management platform built for SpagKing Foods — unifying customer ordering, POS operations, inventory, staff management, delivery, CRM, business intelligence, and executive dashboards into one connected ecosystem.

## Modules

- **Customer App** — Home, menu, search, meal details, cart, checkout (delivery/pickup/dine-in), QR ordering, live tracking, order history, loyalty, community
- **POS Terminal** — Walk-in orders, discounts, refunds, receipts, shift management, cash reconciliation, split bills, kitchen tickets
- **Inventory** — Stock receiving, daily counts, low-stock alerts, suppliers, purchase orders, waste logging, expiry tracking
- **Staff & HR** — Attendance, clock in/out, shift planning, leave, performance reviews, training, disciplinary records
- **Reports** — Daily (sales, orders, food cost, waste, labour, complaints), Weekly (branch ranking, staff ranking, best sellers), Monthly (P&L, inventory variance, customer growth)
- **CRM** — Customer profiles, feedback, loyalty program, WhatsApp/email/SMS campaigns
- **Delivery** — Rider assignment, live map, delivery zones, fees, performance metrics
- **Executive Dashboard** — Real-time KPIs, yesterday vs today, top meals, branch ranking, stock alerts
- **Admin** — Branches, users, roles, taxes, settings, QR codes, integrations, audit logs

## Technology Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS 4 + shadcn/ui
- **State:** Zustand (persisted to localStorage)
- **Charts:** Recharts
- **Animation:** Framer Motion
- **Icons:** Lucide React
- **Fonts:** Inter, Poppins, Pacifico

## Local Development

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Demo Roles

The platform includes 9 role-based demo accounts (no passwords needed):

| Role | Dashboard |
|------|-----------|
| Customer | Customer ordering app |
| Cashier | POS Terminal |
| Kitchen | POS + Inventory |
| Manager | Executive Dashboard + all modules |
| Inventory Officer | Inventory Management |
| HR Officer | Staff & HR |
| Delivery Rider | Delivery Dashboard |
| Administrator | Admin Panel |
| CEO | Executive Dashboard + Reports + CRM |

## Demo Limitations

The following are demo flows that require production credentials to go live:

- **Payments** — Paystack/Flutterwave flows show the payment selection UI without processing real transactions
- **Backend** — All data is client-side (Zustand + localStorage); production needs a database + API
- **Authentication** — Demo uses role selection without passwords; production needs NextAuth
- **WhatsApp/SMS/Email** — Campaign screens are demo; production needs Twilio/SendGrid/WhatsApp Business API
- **GPS/Maps** — Stylized SVG map; production needs Google Maps API
- **Receipt Printing** — Toast notification; production needs ESC/POS printer integration

## Environment Variables

See `.env.example` for all required variables. The demo works without any of them.

## Production Build

```bash
npm run build
```

## Netlify Deployment

1. Connect this repository to Netlify
2. Build command: `npm run build`
3. Publish directory: `.next` (auto-detected by Netlify Next.js plugin)
4. Node version: 20
5. See `netlify.toml` for configuration

Add production environment variables in the Netlify dashboard (never commit secrets to the repository).

## Project Structure

```
src/
├── app/              # Next.js App Router (single route — SPA via Zustand)
├── components/
│   ├── customer/     # Customer app views
│   ├── staff/        # Staff dashboard views
│   ├── shared/       # Cross-cutting (search, AI, theme, notifications)
│   ├── landing/      # Public landing page
│   └── ui/           # shadcn/ui component library
├── content/          # Centralized brand content (single source of truth)
├── lib/              # Store, demo data, utilities
└── hooks/            # React hooks
public/
├── spagking-assets/  # Food photography, branch photos, chef portraits
├── spagking-logo.svg # Brand logo
└── favicon.svg       # Favicon
```

## Theme

The platform supports dark, light, and system themes. Toggle via the sun/moon icon in any header. Preference persists across sessions.

## SpagKing Brand

- **Instagram:** @spagking_
- **Tagline:** "A Different Experience With Food"
- **Branches:** Lekki Phase 1, Maroko/Oniru, Surulere (Lagos), Lokoja (Kogi)
- **Currency:** Nigerian Naira (₦)
