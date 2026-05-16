export type ProductType = 'saas' | 'template' | 'custom';

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  short_description: string;
  product_type: ProductType;
  price: number; // in cents (e.g. 4900 = $49.00)
  is_subscription: boolean;
  billing_interval?: 'month' | 'year';
  image_url: string;
  demo_url?: string | null;
  demo_video_url?: string | null;
  stripe_price_id?: string | null;
  stripe_link?: string | null;
  features: string[];
  category: string;
  category_id?: string | null;
  is_active: boolean;
  is_featured: boolean;
  order_index: number;
  created_at: string;
}

export interface VideoLog {
  id: string;
  title: string;
  description: string;
  video_url: string;
  thumbnail_url: string;
  tiktok_url?: string | null;
  linked_product_id?: string | null;
  linked_product_type?: ProductType | null;
  views: number;
  is_active: boolean;
  order_index: number;
  created_at: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  project_details: string;
  budget_range?: string | null;
  timeline?: string | null;
  source: string;
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'closed';
  notes?: string | null;
  email_sent: boolean;
  created_at: string;
}

export interface CaseStudy {
  id: string;
  title: string;
  description: string;
  hero_media_url: string;
  media_type: 'image' | 'video';
  tech_stack: string[];
  live_site_url?: string | null;
  client_name?: string | null;
  completed_date?: string | null;
  featured: boolean;
  display_order: number;
}

export function formatPrice(
  cents: number,
  isSubscription = false,
  interval?: string,
): string {
  const dollars = (cents / 100).toFixed(2);

  if (isSubscription) {
    return `$${dollars}/${interval ?? 'mo'}`;
  }

  return `$${dollars}`;
}
