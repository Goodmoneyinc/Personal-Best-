import { getSupabaseServiceRoleClient } from '@/lib/supabase/server';
import type { Product, VideoLog } from '@/lib/types';

const productColumns = `
  id,
  name,
  slug,
  description,
  short_description,
  product_type,
  price,
  is_subscription,
  billing_interval,
  image_url,
  demo_url,
  demo_video_url,
  stripe_price_id,
  stripe_link,
  features,
  category,
  category_id,
  is_active,
  is_featured,
  order_index,
  created_at
`;

const videoLogColumns = `
  id,
  title,
  description,
  video_url,
  thumbnail_url,
  tiktok_url,
  linked_product_id,
  linked_product_type,
  views,
  is_active,
  order_index,
  created_at
`;

class SupabaseConfigurationError extends Error {
  constructor() {
    super('Supabase server client is not configured.');
    this.name = 'SupabaseConfigurationError';
  }
}

function getServerClient() {
  const supabase = getSupabaseServiceRoleClient();

  if (!supabase) {
    throw new SupabaseConfigurationError();
  }

  return supabase;
}

function logSupabaseError(message: string, error: unknown) {
  if (error instanceof SupabaseConfigurationError) {
    return;
  }

  console.error(message, error);
}

export async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const supabase = getServerClient();
    const { data, error } = await supabase
      .from('products')
      .select(productColumns)
      .eq('is_featured', true)
      .eq('is_active', true)
      .order('order_index', { ascending: true })
      .overrideTypes<Product[], { merge: false }>();

    if (error) {
      throw error;
    }

    return data ?? [];
  } catch (error) {
    logSupabaseError('Unable to fetch featured products from Supabase:', error);
    throw new Error('Unable to load featured products.');
  }
}

export async function getLatestVideoLogs(limit: number): Promise<VideoLog[]> {
  try {
    const supabase = getServerClient();
    const safeLimit = Math.max(0, Math.floor(limit));
    const { data, error } = await supabase
      .from('video_logs')
      .select(videoLogColumns)
      .eq('is_active', true)
      .order('order_index', { ascending: true })
      .limit(safeLimit)
      .overrideTypes<VideoLog[], { merge: false }>();

    if (error) {
      throw error;
    }

    return data ?? [];
  } catch (error) {
    logSupabaseError('Unable to fetch video logs from Supabase:', error);
    throw new Error('Unable to load video logs.');
  }
}
