# Fulatelier

Fulatelier is a Mississippi-focused digital workshop marketplace for practical
templates, SaaS starters, and custom web systems.

## Stack

- Next.js 14 App Router
- TypeScript strict mode
- Tailwind CSS with Fulatelier design tokens
- shadcn/ui-compatible component structure
- Supabase-ready lead capture

## Getting started

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env.local` and add Supabase values when you are ready
to persist lead inquiries.

## Stripe checkout

Checkout Sessions are wired through `/api/create-checkout` and the product
catalog reads Stripe Price IDs from environment variables. Create the products
and prices in Stripe, then set:

```bash
STRIPE_SECRET_KEY=rk_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_DELTA_BOOKING_KIT=price_...
STRIPE_PRICE_MAIN_STREET_COMMERCE=price_...
STRIPE_PRICE_MAGNOLIA_CLIENT_PORTAL=price_...
STRIPE_PRICE_COUNTY_LAUNCH_PAGE=price_...
```

Use a restricted API key with Checkout Sessions permissions when possible. The
webhook endpoint is `/api/webhooks/stripe`; for local testing, forward Stripe
events with:

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

The webhook stores completed checkouts in Supabase, so `SUPABASE_SERVICE_ROLE_KEY`
must also be configured before order persistence is enabled. Static Surge
exports cannot run these API routes; deploy the full Next.js app to a host with
serverless functions for checkout.

## Scripts

- `npm run dev` - start local development
- `npm run lint` - run Next.js lint checks
- `npm run typecheck` - run TypeScript without emitting files
- `npm run build` - build the full production app for Vercel
- `npm run build:public` - export static public pages for Surge


## Component architecture

```
components/
  layout/          SiteHeader, SiteFooter, SkipNav
  home/            HeroSection, FeaturedProducts, BuildLogPreview, ContactCTA
  marketplace/     ProductGrid, ProductCard
  product-detail/  PurchaseButton, VideoPlayer
  admin/           AdminShell, ProductManager, LeadPipeline, A11yChecklist
  contact/         LeadCaptureForm
  video/           BuildLogFeed, VideoCard
  ui/              shadcn-style primitives such as Button, Badge, Card, Input
```

## Static public export

Vercel is the primary deployment target. For Surge-only public pages, build with
`NEXT_OUTPUT=export npm run build`; product detail routes use
`generateStaticParams()` so the initial catalog can be exported.