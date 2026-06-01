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