import { ProductManager } from '@/components/admin/ProductManager';
import { getActiveProducts } from '@/lib/data/products';

export const metadata = {
  title: 'Products manager',
};

export default function AdminProductsPage() {
  return <ProductManager products={getActiveProducts()} />;
}
