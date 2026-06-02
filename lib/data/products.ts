import type { CaseStudy, Product, VideoLog } from '@/lib/types';

const stripePriceEnvByProductId = {
  'delta-booking-kit': 'STRIPE_PRICE_DELTA_BOOKING_KIT',
  'main-street-commerce': 'STRIPE_PRICE_MAIN_STREET_COMMERCE',
  'magnolia-client-portal': 'STRIPE_PRICE_MAGNOLIA_CLIENT_PORTAL',
  'county-launch-page': 'STRIPE_PRICE_COUNTY_LAUNCH_PAGE',
} as const;

function getStripePriceId(productId: keyof typeof stripePriceEnvByProductId) {
  const value = process.env[stripePriceEnvByProductId[productId]]?.trim();

  return value ? value : null;
}

export const products: Product[] = [
  {
    id: 'delta-booking-kit',
    name: 'Delta Booking Kit',
    slug: 'delta-booking-kit',
    description:
      'A polished appointment and deposit workflow for Mississippi studios, salons, consultants, and solo operators who need clients booked before the phone rings.',
    short_description:
      'Booking pages, deposit prompts, and client reminders for service businesses.',
    product_type: 'template',
    price: 7900,
    is_subscription: false,
    image_url: '/marketplace/delta-booking-kit.svg',
    demo_url: 'https://example.com/demo/delta-booking-kit',
    demo_video_url: null,
    stripe_price_id: getStripePriceId('delta-booking-kit'),
    stripe_link: null,
    features: [
      'Mobile-first booking request page',
      'Deposit-ready checkout copy blocks',
      'Automated reminder email templates',
      'Editable service menu and intake prompts',
    ],
    category: 'Operations',
    category_id: 'operations',
    is_active: true,
    is_featured: true,
    order_index: 1,
    created_at: '2026-01-08T12:00:00.000Z',
  },
  {
    id: 'main-street-commerce',
    name: 'Main Street Commerce',
    slug: 'main-street-commerce',
    description:
      'A lightweight storefront starter for Mississippi makers and boutiques with curated product sections, local pickup messaging, and conversion-focused product cards.',
    short_description:
      'A boutique storefront starter for makers, pop-ups, and local shops.',
    product_type: 'saas',
    price: 4900,
    is_subscription: true,
    billing_interval: 'month',
    image_url: '/marketplace/main-street-commerce.svg',
    demo_url: 'https://example.com/demo/main-street-commerce',
    demo_video_url: null,
    stripe_price_id: getStripePriceId('main-street-commerce'),
    stripe_link: null,
    features: [
      'Featured product and collection sections',
      'Local pickup and shipping-ready copy',
      'Launch checklist for first inventory drop',
      'Monthly optimization recommendations',
    ],
    category: 'Commerce',
    category_id: 'commerce',
    is_active: true,
    is_featured: true,
    order_index: 2,
    created_at: '2026-01-10T12:00:00.000Z',
  },
  {
    id: 'magnolia-client-portal',
    name: 'Magnolia Client Portal',
    slug: 'magnolia-client-portal',
    description:
      'A custom client portal build for agencies, builders, and professional services teams that need shared files, project milestones, invoices, and approvals in one branded space.',
    short_description:
      'Custom portal builds for approvals, files, milestones, and client updates.',
    product_type: 'custom',
    price: 250000,
    is_subscription: false,
    image_url: '/marketplace/magnolia-client-portal.svg',
    demo_url: null,
    demo_video_url: null,
    stripe_price_id: getStripePriceId('magnolia-client-portal'),
    stripe_link: null,
    features: [
      'Discovery-led workflow mapping',
      'Secure client dashboards and milestone views',
      'Supabase-backed data model and auth plan',
      'Stripe-ready invoice or payment handoff',
    ],
    category: 'Custom Build',
    category_id: 'custom',
    is_active: true,
    is_featured: true,
    order_index: 3,
    created_at: '2026-01-12T12:00:00.000Z',
  },
  {
    id: 'county-launch-page',
    name: 'County Launch Page',
    slug: 'county-launch-page',
    description:
      'A focused one-page launch site for local campaigns, civic initiatives, nonprofit drives, and community events that need clarity fast.',
    short_description:
      'A focused launch page for Mississippi campaigns, nonprofits, and events.',
    product_type: 'template',
    price: 3900,
    is_subscription: false,
    image_url: '/marketplace/county-launch-page.svg',
    demo_url: 'https://example.com/demo/county-launch-page',
    demo_video_url: null,
    stripe_price_id: getStripePriceId('county-launch-page'),
    stripe_link: null,
    features: [
      'Hero, timeline, FAQ, and sponsor sections',
      'Accessible contact and pledge callouts',
      'Warm neutral visual system',
      'Static-export friendly page structure',
    ],
    category: 'Launch',
    category_id: 'launch',
    is_active: true,
    is_featured: false,
    order_index: 4,
    created_at: '2026-01-14T12:00:00.000Z',
  },
];

export const videoLogs: VideoLog[] = [
  {
    id: 'booking-kit-walkthrough',
    title: 'How the Delta Booking Kit reduces back-and-forth',
    description:
      'A quick walkthrough of the booking request, deposit handoff, and follow-up copy flow.',
    video_url: 'https://example.com/videos/booking-kit',
    thumbnail_url: '/marketplace/delta-booking-kit.svg',
    tiktok_url: null,
    linked_product_id: 'delta-booking-kit',
    linked_product_type: 'template',
    views: 1280,
    is_active: true,
    order_index: 1,
    created_at: '2026-01-20T12:00:00.000Z',
  },
];

export const caseStudies: CaseStudy[] = [
  {
    id: 'river-road-pop-up',
    title: 'River Road Pop-up Launch',
    description:
      'A fast storefront and launch page system for a maker collective preparing a weekend market.',
    hero_media_url: '/marketplace/main-street-commerce.svg',
    media_type: 'image',
    tech_stack: ['Next.js', 'Tailwind CSS', 'Supabase'],
    live_site_url: null,
    client_name: 'Mississippi maker collective',
    completed_date: '2026-01-30',
    featured: true,
    display_order: 1,
  },
];

export function getActiveProducts() {
  return products
    .filter((product) => product.is_active)
    .sort((a, b) => a.order_index - b.order_index);
}

export function getFeaturedProducts() {
  return getActiveProducts().filter((product) => product.is_featured);
}

export function getProductBySlug(slug: string) {
  return getActiveProducts().find((product) => product.slug === slug);
}
