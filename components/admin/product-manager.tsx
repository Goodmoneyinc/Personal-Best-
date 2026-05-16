"use client";

import { useCallback, useEffect, useState } from "react";
import { Edit, Plus, Power, Star, Trash2 } from "lucide-react";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ProductForm } from "@/components/admin/product-form";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/types";

type ProductsApiResponse = {
  products?: Product[];
  error?: string;
};

type ProductApiResponse = {
  product?: Product;
  error?: string;
};

const focusRingClasses =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-gold,var(--color-accent-gold,#C9A84C))]";

const actionButtonClasses = [
  "inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-semibold transition-colors",
  "hover:border-[var(--accent-gold,var(--color-accent-gold,#C9A84C))] hover:text-[var(--accent-gold,var(--color-accent-gold,#C9A84C))]",
  focusRingClasses,
].join(" ");

const productTypeLabels: Record<Product["product_type"], string> = {
  saas: "Micro SaaS",
  template: "Template",
  custom: "Custom",
};

function getProductPayload(product: Product, overrides: Partial<Product> = {}) {
  const nextProduct = { ...product, ...overrides };

  return {
    name: nextProduct.name,
    slug: nextProduct.slug,
    description: nextProduct.description,
    short_description: nextProduct.short_description,
    product_type: nextProduct.product_type,
    price: nextProduct.price,
    is_subscription: nextProduct.is_subscription,
    billing_interval: nextProduct.billing_interval ?? null,
    image_url: nextProduct.image_url,
    demo_url: nextProduct.demo_url ?? null,
    demo_video_url: nextProduct.demo_video_url ?? null,
    stripe_price_id: nextProduct.stripe_price_id ?? null,
    features: nextProduct.features,
    category: nextProduct.category,
    is_active: nextProduct.is_active,
    is_featured: nextProduct.is_featured,
  };
}

export function ProductManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    const response = await fetch("/api/admin/products", {
      cache: "no-store",
    });
    const body = (await response.json()) as ProductsApiResponse;

    if (!response.ok) {
      setProducts([]);
      setErrorMessage(body.error ?? "Products could not be loaded.");
      setIsLoading(false);
      return;
    }

    setProducts(body.products ?? []);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    void fetchProducts();
  }, [fetchProducts]);

  function handleAddProduct() {
    setSelectedProduct(null);
    setIsFormOpen(true);
  }

  function handleEditProduct(product: Product) {
    setSelectedProduct(product);
    setIsFormOpen(true);
  }

  async function handleFormSaved(message: string) {
    setStatusMessage(message);
    await fetchProducts();
  }

  async function handleToggleActive(product: Product) {
    setIsMutating(true);
    setErrorMessage(null);

    const response = await fetch(`/api/admin/products/${product.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(
        getProductPayload(product, {
          is_active: !product.is_active,
        }),
      ),
    });
    const body = (await response.json()) as ProductApiResponse;

    if (!response.ok) {
      setErrorMessage(body.error ?? "Product status could not be updated.");
      setIsMutating(false);
      return;
    }

    setStatusMessage(
      `${product.name} marked as ${product.is_active ? "inactive" : "active"}.`,
    );
    setIsMutating(false);
    await fetchProducts();
  }

  async function handleDeleteProduct() {
    if (!deleteProduct) {
      return;
    }

    setIsMutating(true);
    setErrorMessage(null);

    const response = await fetch(`/api/admin/products/${deleteProduct.id}`, {
      method: "DELETE",
    });
    const body = (await response.json()) as ProductApiResponse;

    if (!response.ok) {
      setErrorMessage(body.error ?? "Product could not be deleted.");
      setIsMutating(false);
      return;
    }

    setStatusMessage(`${deleteProduct.name} deleted.`);
    setDeleteProduct(null);
    setIsMutating(false);
    await fetchProducts();
  }

  return (
    <section aria-labelledby="product-manager-heading" className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1
            id="product-manager-heading"
            className="text-3xl font-semibold tracking-tight"
          >
            Products
          </h1>
          <p className="mt-2 text-sm text-[var(--slate-gray,var(--color-slate-gray,#64748B))]">
            Create, update, feature, and retire marketplace products.
          </p>
        </div>
        <button
          type="button"
          className={`inline-flex items-center gap-2 rounded-md bg-[var(--navy,var(--color-navy,#0A0F1E))] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[var(--accent-gold,var(--color-accent-gold,#C9A84C))] hover:text-[var(--navy,var(--color-navy,#0A0F1E))] ${focusRingClasses}`}
          onClick={handleAddProduct}
        >
          <Plus aria-hidden="true" className="h-4 w-4" />
          Add product
        </button>
      </div>

      {statusMessage ? (
        <div
          role="status"
          aria-live="polite"
          className="rounded-md border border-green-700 bg-green-50 px-4 py-3 text-sm text-green-800"
        >
          {statusMessage}
        </div>
      ) : null}

      {errorMessage ? (
        <div
          role="alert"
          className="rounded-md border border-red-700 bg-red-50 px-4 py-3 text-sm text-red-800"
        >
          {errorMessage}
        </div>
      ) : null}

      <div className="overflow-x-auto rounded-2xl border bg-white shadow-sm">
        <table className="min-w-full divide-y divide-black/10">
          <caption className="sr-only">Manage Products</caption>
          <thead className="bg-[var(--warm-white,var(--color-warm-white,#F5F0E8))]">
            <tr>
              <th scope="col" className="px-4 py-3 text-left text-sm font-semibold">
                Name
              </th>
              <th scope="col" className="px-4 py-3 text-left text-sm font-semibold">
                Type
              </th>
              <th scope="col" className="px-4 py-3 text-left text-sm font-semibold">
                Price
              </th>
              <th scope="col" className="px-4 py-3 text-left text-sm font-semibold">
                Status
              </th>
              <th scope="col" className="px-4 py-3 text-left text-sm font-semibold">
                Featured
              </th>
              <th scope="col" className="px-4 py-3 text-left text-sm font-semibold">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/10">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center">
                  <span role="status" aria-live="polite">
                    Loading products...
                  </span>
                </td>
              </tr>
            ) : products.length > 0 ? (
              products.map((product) => (
                <tr key={product.id}>
                  <td className="px-4 py-4 align-top">
                    <div className="font-semibold">{product.name}</div>
                    <div className="mt-1 text-sm text-[var(--slate-gray,var(--color-slate-gray,#64748B))]">
                      {product.slug}
                    </div>
                  </td>
                  <td className="px-4 py-4 align-top">
                    {productTypeLabels[product.product_type]}
                  </td>
                  <td className="px-4 py-4 align-top">
                    {product.product_type === "custom"
                      ? "Quote"
                      : formatPrice(
                          product.price,
                          product.is_subscription,
                          product.billing_interval,
                        )}
                  </td>
                  <td className="px-4 py-4 align-top">
                    <span
                      className={[
                        "rounded-full px-3 py-1 text-xs font-semibold",
                        product.is_active
                          ? "bg-green-100 text-green-900"
                          : "bg-slate-200 text-slate-900",
                      ].join(" ")}
                    >
                      {product.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-4 align-top">
                    <span className="inline-flex items-center gap-1">
                      {product.is_featured ? (
                        <Star
                          aria-hidden="true"
                          className="h-4 w-4 fill-[var(--accent-gold,var(--color-accent-gold,#C9A84C))] text-[var(--accent-gold,var(--color-accent-gold,#C9A84C))]"
                        />
                      ) : null}
                      {product.is_featured ? "Featured" : "No"}
                    </span>
                  </td>
                  <td className="px-4 py-4 align-top">
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        aria-label={`Edit ${product.name}`}
                        className={actionButtonClasses}
                        onClick={() => handleEditProduct(product)}
                      >
                        <Edit aria-hidden="true" className="h-4 w-4" />
                        Edit
                      </button>
                      <button
                        type="button"
                        aria-label={`Mark ${product.name} as ${
                          product.is_active ? "inactive" : "active"
                        }`}
                        disabled={isMutating}
                        className={actionButtonClasses}
                        onClick={() => void handleToggleActive(product)}
                      >
                        <Power aria-hidden="true" className="h-4 w-4" />
                        {product.is_active ? "Deactivate" : "Activate"}
                      </button>
                      <button
                        type="button"
                        aria-label={`Delete ${product.name}`}
                        disabled={isMutating}
                        className={`${actionButtonClasses} text-red-800 hover:border-red-800 hover:text-red-800`}
                        onClick={() => setDeleteProduct(product)}
                      >
                        <Trash2 aria-hidden="true" className="h-4 w-4" />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-8 text-center text-[var(--slate-gray,var(--color-slate-gray,#64748B))]"
                >
                  No products have been created yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <ProductForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        product={selectedProduct}
        onSaved={(message) => void handleFormSaved(message)}
      />

      <AlertDialog
        open={Boolean(deleteProduct)}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteProduct(null);
          }
        }}
      >
        <AlertDialogContent
          aria-labelledby="delete-product-title"
          aria-describedby="delete-product-description"
        >
          <AlertDialogHeader>
            <AlertDialogTitle id="delete-product-title">
              Delete product?
            </AlertDialogTitle>
            <AlertDialogDescription id="delete-product-description">
              This will permanently delete {deleteProduct?.name ?? "this product"}
              from the marketplace.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <button
              type="button"
              className={`rounded-md border px-4 py-2 text-sm font-semibold ${focusRingClasses}`}
              onClick={() => setDeleteProduct(null)}
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={isMutating}
              className={`rounded-md bg-red-800 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70 ${focusRingClasses}`}
              onClick={() => void handleDeleteProduct()}
            >
              {isMutating ? "Deleting..." : "Delete product"}
            </button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}

export default ProductManager;
