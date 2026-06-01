import { formatPrice, type Product } from '@/lib/types';

interface ProductManagerProps {
  products: Product[];
}

export function ProductManager({ products }: ProductManagerProps) {
  return (
    <section aria-labelledby="admin-products-title" className="rounded-[2rem] bg-warm p-6 text-navy shadow-card md:p-8">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#6F5921]">
            Products manager
          </p>
          <h2 className="mt-3 font-display text-4xl font-bold" id="admin-products-title">
            Offers and checkout readiness
          </h2>
        </div>
        <p className="max-w-lg text-sm leading-6 text-ink/75">
          CRUD requests should use /api/admin/products with an ADMIN_API_TOKEN
          bearer token and Supabase service-role configuration.
        </p>
      </div>
      <div className="mt-8 overflow-hidden rounded-3xl border border-navy/10 bg-white">
        <table className="w-full min-w-[760px] border-collapse text-left text-sm">
          <caption className="sr-only">Fulatelier product manager table</caption>
          <thead className="bg-navy text-warm">
            <tr>
              <th className="px-5 py-4 font-semibold" scope="col">Product</th>
              <th className="px-5 py-4 font-semibold" scope="col">Type</th>
              <th className="px-5 py-4 font-semibold" scope="col">Price</th>
              <th className="px-5 py-4 font-semibold" scope="col">Featured</th>
              <th className="px-5 py-4 font-semibold" scope="col">Stripe</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr className="border-t border-navy/10" key={product.id}>
                <th className="px-5 py-4 font-semibold" scope="row">
                  {product.name}
                </th>
                <td className="px-5 py-4 text-ink/75">{product.product_type}</td>
                <td className="px-5 py-4 text-ink/75">
                  {formatPrice(product.price, product.is_subscription, product.billing_interval)}
                </td>
                <td className="px-5 py-4 text-ink/75">{product.is_featured ? 'Yes' : 'No'}</td>
                <td className="px-5 py-4 text-ink/75">
                  {product.stripe_price_id || product.stripe_link ? 'Connected' : 'Not connected'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
