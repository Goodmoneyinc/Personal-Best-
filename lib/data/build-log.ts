import { getProductBySlug, videoLogs } from '@/lib/data/products';

export const buildLogEntries = videoLogs.map((entry) => ({
  ...entry,
  product: entry.linked_product_id ? getProductBySlug(entry.linked_product_id) : undefined,
}));
