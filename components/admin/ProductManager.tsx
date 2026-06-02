'use client';

import { type FormEvent, useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { formatPrice, type Product, type ProductType } from '@/lib/types';

type ProductFormValues = {
  name: string;
  slug: string;
  short_description: string;
  description: string;
  product_type: ProductType;
  price: string;
  is_subscription: boolean;
  billing_interval: '' | 'month' | 'year';
  image_url: string;
  category: string;
  features: string;
  is_active: boolean;
  is_featured: boolean;
  order_index: string;
};

const initialFormValues: ProductFormValues = {
  name: '',
  slug: '',
  short_description: '',
  description: '',
  product_type: 'template',
  price: '0',
  is_subscription: false,
  billing_interval: '',
  image_url: '/marketplace/delta-booking-kit.svg',
  category: '',
  features: '',
  is_active: true,
  is_featured: false,
  order_index: '0',
};

const typeLabels: Record<ProductType, string> = {
  saas: 'SaaS',
  template: 'Template',
  custom: 'Custom',
};

function isProduct(value: unknown): value is Product {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'name' in value &&
    'slug' in value
  );
}

function isProductsResponse(value: unknown): value is { products: Product[] } {
  return (
    typeof value === 'object' &&
    value !== null &&
    'products' in value &&
    Array.isArray((value as { products?: unknown }).products)
  );
}

function getErrorMessage(value: unknown, fallback: string) {
  if (typeof value === 'object' && value !== null && 'error' in value) {
    const error = (value as { error?: unknown }).error;
    if (typeof error === 'string') {
      return error;
    }
  }

  return fallback;
}

function getFormValues(product: Product): ProductFormValues {
  return {
    name: product.name,
    slug: product.slug,
    short_description: product.short_description,
    description: product.description,
    product_type: product.product_type,
    price: String(product.price),
    is_subscription: product.is_subscription,
    billing_interval: product.billing_interval ?? '',
    image_url: product.image_url,
    category: product.category,
    features: product.features.join('\n'),
    is_active: product.is_active,
    is_featured: product.is_featured,
    order_index: String(product.order_index),
  };
}

function getPayload(values: ProductFormValues) {
  return {
    name: values.name.trim(),
    slug: values.slug.trim(),
    short_description: values.short_description.trim(),
    description: values.description.trim(),
    product_type: values.product_type,
    price: Number.parseInt(values.price, 10),
    is_subscription: values.is_subscription,
    billing_interval: values.is_subscription && values.billing_interval ? values.billing_interval : null,
    image_url: values.image_url.trim(),
    category: values.category.trim(),
    features: values.features
      .split('\n')
      .map((feature) => feature.trim())
      .filter(Boolean),
    is_active: values.is_active,
    is_featured: values.is_featured,
    order_index: Number.parseInt(values.order_index, 10),
  };
}

export function ProductManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [formValues, setFormValues] = useState<ProductFormValues>(initialFormValues);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  async function loadProducts() {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await fetch('/api/admin/products');
      const data: unknown = await response.json();

      if (!response.ok) {
        throw new Error(getErrorMessage(data, 'Unable to load products.'));
      }

      if (!isProductsResponse(data)) {
        throw new Error('Products response was not in the expected format.');
      }

      setProducts(data.products.filter(isProduct));
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to load products.');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadProducts();
  }, []);

  function updateFormValue<K extends keyof ProductFormValues>(
    key: K,
    value: ProductFormValues[K],
  ) {
    setFormValues((currentValues) => ({
      ...currentValues,
      [key]: value,
    }));
  }

  function openAddForm() {
    setEditingProductId(null);
    setFormValues(initialFormValues);
    setIsFormOpen(true);
    setMessage('');
    setErrorMessage('');
  }

  function openEditForm(product: Product) {
    setEditingProductId(product.id);
    setFormValues(getFormValues(product));
    setIsFormOpen(true);
    setMessage('');
    setErrorMessage('');
  }

  async function submitProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage('');
    setMessage('');

    const payload = getPayload(formValues);
    const url = editingProductId
      ? `/api/admin/products/${editingProductId}`
      : '/api/admin/products';
    const method = editingProductId ? 'PATCH' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      const data: unknown = await response.json();

      if (!response.ok) {
        throw new Error(getErrorMessage(data, 'Unable to save product.'));
      }

      if (
        typeof data !== 'object' ||
        data === null ||
        !('product' in data) ||
        !isProduct((data as { product?: unknown }).product)
      ) {
        throw new Error('Product response was not in the expected format.');
      }

      const savedProduct = (data as { product: Product }).product;
      setProducts((currentProducts) =>
        editingProductId
          ? currentProducts.map((product) =>
              product.id === savedProduct.id ? savedProduct : product,
            )
          : [...currentProducts, savedProduct].sort((a, b) => a.order_index - b.order_index),
      );
      setIsFormOpen(false);
      setEditingProductId(null);
      setMessage(`${savedProduct.name} was saved.`);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to save product.');
    }
  }

  async function toggleActive(product: Product) {
    const nextActive = !product.is_active;
    setProducts((currentProducts) =>
      currentProducts.map((item) =>
        item.id === product.id ? { ...item, is_active: nextActive } : item,
      ),
    );
    setMessage(`${product.name} marked ${nextActive ? 'active' : 'inactive'}.`);
    setErrorMessage('');

    try {
      const response = await fetch(`/api/admin/products/${product.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_active: nextActive }),
      });
      const data: unknown = await response.json();

      if (!response.ok) {
        throw new Error(getErrorMessage(data, 'Unable to update product status.'));
      }
    } catch (error) {
      setProducts((currentProducts) =>
        currentProducts.map((item) =>
          item.id === product.id ? { ...item, is_active: product.is_active } : item,
        ),
      );
      setMessage('');
      setErrorMessage(
        error instanceof Error ? error.message : 'Unable to update product status.',
      );
    }
  }

  async function deleteProduct(product: Product) {
    setErrorMessage('');
    setMessage('');

    try {
      const response = await fetch(`/api/admin/products/${product.id}`, {
        method: 'DELETE',
      });
      const data: unknown = await response.json();

      if (!response.ok) {
        throw new Error(getErrorMessage(data, 'Unable to delete product.'));
      }

      setProducts((currentProducts) =>
        currentProducts.filter((item) => item.id !== product.id),
      );
      setMessage(`${product.name} was deleted.`);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to delete product.');
    }
  }

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
        <Button onClick={openAddForm} type="button" variant="secondary">
          Add Product
        </Button>
      </div>

      <div className="mt-5 min-h-6">
        {errorMessage ? (
          <p className="text-sm font-semibold text-red-700" role="alert">
            {errorMessage}
          </p>
        ) : (
          <p aria-live="polite" className="text-sm font-semibold text-ink/75" role="status">
            {message || (isLoading ? 'Loading products...' : `${products.length} products loaded.`)}
          </p>
        )}
      </div>

      {isFormOpen ? (
        <form
          className="mt-8 grid gap-5 rounded-3xl border border-navy/10 bg-white p-5 md:grid-cols-2"
          onSubmit={submitProduct}
        >
          <div>
            <label className="text-sm font-semibold text-navy" htmlFor="product-name">
              Product name
            </label>
            <Input
              id="product-name"
              onChange={(event) => updateFormValue('name', event.target.value)}
              required
              type="text"
              value={formValues.name}
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-navy" htmlFor="product-slug">
              Slug
            </label>
            <Input
              id="product-slug"
              onChange={(event) => updateFormValue('slug', event.target.value)}
              required
              type="text"
              value={formValues.slug}
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-navy" htmlFor="product-type">
              Type
            </label>
            <Select
              id="product-type"
              onChange={(event) =>
                updateFormValue('product_type', event.target.value as ProductType)
              }
              value={formValues.product_type}
            >
              <option value="saas">SaaS</option>
              <option value="template">Template</option>
              <option value="custom">Custom</option>
            </Select>
          </div>
          <div>
            <label className="text-sm font-semibold text-navy" htmlFor="product-price">
              Price in cents
            </label>
            <Input
              id="product-price"
              min="0"
              onChange={(event) => updateFormValue('price', event.target.value)}
              required
              type="number"
              value={formValues.price}
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-navy" htmlFor="product-category">
              Category
            </label>
            <Input
              id="product-category"
              onChange={(event) => updateFormValue('category', event.target.value)}
              required
              type="text"
              value={formValues.category}
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-navy" htmlFor="product-order">
              Order index
            </label>
            <Input
              id="product-order"
              onChange={(event) => updateFormValue('order_index', event.target.value)}
              required
              type="number"
              value={formValues.order_index}
            />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm font-semibold text-navy" htmlFor="product-image">
              Image URL
            </label>
            <Input
              id="product-image"
              onChange={(event) => updateFormValue('image_url', event.target.value)}
              required
              type="text"
              value={formValues.image_url}
            />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm font-semibold text-navy" htmlFor="product-short-description">
              Short description
            </label>
            <Textarea
              id="product-short-description"
              onChange={(event) => updateFormValue('short_description', event.target.value)}
              required
              value={formValues.short_description}
            />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm font-semibold text-navy" htmlFor="product-description">
              Full description
            </label>
            <Textarea
              id="product-description"
              onChange={(event) => updateFormValue('description', event.target.value)}
              required
              value={formValues.description}
            />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm font-semibold text-navy" htmlFor="product-features">
              Features, one per line
            </label>
            <Textarea
              id="product-features"
              onChange={(event) => updateFormValue('features', event.target.value)}
              value={formValues.features}
            />
          </div>
          <div className="flex flex-wrap gap-5 md:col-span-2">
            <label className="inline-flex items-center gap-2 text-sm font-semibold text-navy">
              <input
                checked={formValues.is_active}
                className="h-4 w-4 rounded border-navy/20 text-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
                onChange={(event) => updateFormValue('is_active', event.target.checked)}
                type="checkbox"
              />
              Active
            </label>
            <label className="inline-flex items-center gap-2 text-sm font-semibold text-navy">
              <input
                checked={formValues.is_featured}
                className="h-4 w-4 rounded border-navy/20 text-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
                onChange={(event) => updateFormValue('is_featured', event.target.checked)}
                type="checkbox"
              />
              Featured
            </label>
            <label className="inline-flex items-center gap-2 text-sm font-semibold text-navy">
              <input
                checked={formValues.is_subscription}
                className="h-4 w-4 rounded border-navy/20 text-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
                onChange={(event) => updateFormValue('is_subscription', event.target.checked)}
                type="checkbox"
              />
              Subscription
            </label>
          </div>
          {formValues.is_subscription ? (
            <div>
              <label className="text-sm font-semibold text-navy" htmlFor="product-billing">
                Billing interval
              </label>
              <Select
                id="product-billing"
                onChange={(event) =>
                  updateFormValue('billing_interval', event.target.value as '' | 'month' | 'year')
                }
                value={formValues.billing_interval}
              >
                <option value="">Select interval</option>
                <option value="month">Month</option>
                <option value="year">Year</option>
              </Select>
            </div>
          ) : null}
          <div className="flex flex-wrap gap-3 md:col-span-2">
            <Button type="submit" variant="secondary">
              {editingProductId ? 'Save changes' : 'Create product'}
            </Button>
            <Button
              onClick={() => {
                setIsFormOpen(false);
                setEditingProductId(null);
              }}
              type="button"
              variant="ghost"
            >
              Cancel
            </Button>
          </div>
        </form>
      ) : null}

      <div className="mt-8 overflow-hidden rounded-3xl border border-navy/10 bg-white">
        <table className="w-full min-w-[760px] border-collapse text-left text-sm">
          <caption className="sr-only">Fulatelier product manager table</caption>
          <thead className="bg-navy text-warm">
            <tr>
              <th className="px-5 py-4 font-semibold" scope="col">Product</th>
              <th className="px-5 py-4 font-semibold" scope="col">Type</th>
              <th className="px-5 py-4 font-semibold" scope="col">Price</th>
              <th className="px-5 py-4 font-semibold" scope="col">Active</th>
              <th className="px-5 py-4 font-semibold" scope="col">Order</th>
              <th className="px-5 py-4 font-semibold" scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr className="border-t border-navy/10" key={product.id}>
                <th className="px-5 py-4 font-semibold" scope="row">
                  {product.name}
                </th>
                <td className="px-5 py-4">
                  <span className="rounded-full border border-gold/30 bg-gold/20 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-[#6F5921]">
                    {typeLabels[product.product_type]}
                  </span>
                </td>
                <td className="px-5 py-4 text-ink/75">
                  {formatPrice(product.price, product.is_subscription, product.billing_interval)}
                </td>
                <td className="px-5 py-4">
                  <button
                    aria-label={`${product.is_active ? 'Deactivate' : 'Activate'} ${product.name}`}
                    aria-pressed={product.is_active}
                    className="rounded-full border border-navy/20 bg-warm px-3 py-1 text-sm font-semibold text-navy transition hover:border-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
                    onClick={() => void toggleActive(product)}
                    type="button"
                  >
                    {product.is_active ? 'Active' : 'Inactive'}
                  </button>
                </td>
                <td className="px-5 py-4 text-ink/75">{product.order_index}</td>
                <td className="px-5 py-4">
                  <div className="flex flex-wrap gap-2">
                    <button
                      aria-label={`Edit ${product.name}`}
                      className="rounded-full border border-navy/20 bg-white px-3 py-1 text-sm font-semibold text-navy transition hover:border-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
                      onClick={() => openEditForm(product)}
                      type="button"
                    >
                      Edit
                    </button>
                    <button
                      aria-label={`Delete ${product.name}`}
                      className="rounded-full border border-red-700/30 bg-red-50 px-3 py-1 text-sm font-semibold text-red-700 transition hover:border-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
                      onClick={() => void deleteProduct(product)}
                      type="button"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {!isLoading && products.length === 0 ? (
              <tr>
                <td className="px-5 py-8 text-center text-ink/75" colSpan={6}>
                  No products are available yet.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </section>
  );
}
