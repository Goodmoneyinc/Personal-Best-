"use client";

import type { FormEvent } from "react";
import { useEffect, useMemo, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import type { Product, ProductType } from "@/lib/types";

type ProductFormProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: Product | null;
  onSaved: (message: string) => void;
};

type ProductFormState = {
  name: string;
  product_type: ProductType;
  short_description: string;
  description: string;
  price_dollars: string;
  is_subscription: boolean;
  billing_interval: "month" | "year";
  category: string;
  stripe_price_id: string;
  image_url: string;
  demo_url: string;
  demo_video_url: string;
  features: string[];
  is_active: boolean;
  is_featured: boolean;
};

type ProductApiResponse = {
  error?: string;
};

const inputClasses =
  "w-full rounded-md border border-[color-mix(in_srgb,var(--navy,var(--color-navy,#0A0F1E))_22%,transparent)] bg-white px-3 py-2 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-gold,var(--color-accent-gold,#C9A84C))]";

const buttonFocusClasses =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-gold,var(--color-accent-gold,#C9A84C))]";

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getInitialState(product?: Product | null): ProductFormState {
  return {
    name: product?.name ?? "",
    product_type: product?.product_type ?? "saas",
    short_description: product?.short_description ?? "",
    description: product?.description ?? "",
    price_dollars: product ? (product.price / 100).toString() : "0",
    is_subscription: product?.is_subscription ?? false,
    billing_interval: product?.billing_interval ?? "month",
    category: product?.category ?? "general",
    stripe_price_id: product?.stripe_price_id ?? "",
    image_url: product?.image_url ?? "",
    demo_url: product?.demo_url ?? "",
    demo_video_url: product?.demo_video_url ?? "",
    features: product?.features.length ? product.features : [""],
    is_active: product?.is_active ?? true,
    is_featured: product?.is_featured ?? false,
  };
}

function getRequiredFieldErrors(state: ProductFormState) {
  const errors: string[] = [];

  if (!state.name.trim()) {
    errors.push("Name is required.");
  }

  if (!state.short_description.trim()) {
    errors.push("Short description is required.");
  }

  if (!state.description.trim()) {
    errors.push("Full description is required.");
  }

  if (!state.image_url.trim()) {
    errors.push("Image URL is required.");
  }

  if (!state.category.trim()) {
    errors.push("Category is required.");
  }

  const price = Number(state.price_dollars);

  if (!Number.isFinite(price) || price < 0) {
    errors.push("Price must be a valid non-negative number.");
  }

  if (state.short_description.length > 160) {
    errors.push("Short description must be 160 characters or less.");
  }

  return errors;
}

export function ProductForm({
  open,
  onOpenChange,
  product,
  onSaved,
}: ProductFormProps) {
  const [state, setState] = useState<ProductFormState>(() =>
    getInitialState(product),
  );
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const slugPreview = useMemo(() => slugify(state.name), [state.name]);

  useEffect(() => {
    if (open) {
      setState(getInitialState(product));
      setErrors([]);
      setIsSubmitting(false);
    }
  }, [open, product]);

  function updateField<Field extends keyof ProductFormState>(
    field: Field,
    value: ProductFormState[Field],
  ) {
    setState((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function updateFeature(index: number, value: string) {
    setState((current) => ({
      ...current,
      features: current.features.map((feature, featureIndex) =>
        featureIndex === index ? value : feature,
      ),
    }));
  }

  function addFeature() {
    setState((current) => ({
      ...current,
      features: [...current.features, ""],
    }));
  }

  function removeFeature(index: number) {
    setState((current) => ({
      ...current,
      features:
        current.features.length > 1
          ? current.features.filter((_, featureIndex) => featureIndex !== index)
          : [""],
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = getRequiredFieldErrors(state);

    if (nextErrors.length > 0) {
      setErrors(nextErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors([]);

    const payload = {
      name: state.name.trim(),
      slug: slugPreview,
      description: state.description.trim(),
      short_description: state.short_description.trim(),
      product_type: state.product_type,
      price: Math.round(Number(state.price_dollars) * 100),
      is_subscription: state.is_subscription,
      billing_interval: state.is_subscription ? state.billing_interval : null,
      category: state.category.trim(),
      stripe_price_id: state.stripe_price_id.trim() || null,
      image_url: state.image_url.trim(),
      demo_url: state.demo_url.trim() || null,
      demo_video_url: state.demo_video_url.trim() || null,
      features: state.features.map((feature) => feature.trim()).filter(Boolean),
      is_active: state.is_active,
      is_featured: state.is_featured,
    };

    const response = await fetch(
      product ? `/api/admin/products/${product.id}` : "/api/admin/products",
      {
        method: product ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      },
    );
    const responseBody = (await response.json()) as ProductApiResponse;

    if (!response.ok) {
      setErrors([responseBody.error ?? "Product could not be saved."]);
      setIsSubmitting(false);
      return;
    }

    onSaved(product ? "Product updated successfully." : "Product added successfully.");
    setIsSubmitting(false);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        aria-labelledby="product-form-title"
        aria-describedby="product-form-description"
      >
        <DialogHeader>
          <DialogTitle id="product-form-title">
            {product ? "Edit product" : "Add product"}
          </DialogTitle>
          <DialogDescription id="product-form-description">
            Manage marketplace product details, pricing, media, and visibility.
          </DialogDescription>
        </DialogHeader>

        {errors.length > 0 ? (
          <div
            role="alert"
            className="mt-4 rounded-md border border-red-700 bg-red-50 px-4 py-3 text-sm text-red-800"
          >
            <p className="font-semibold">Please fix the following:</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              {errors.map((error) => (
                <li key={error}>{error}</li>
              ))}
            </ul>
          </div>
        ) : null}

        <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="product-name">Name</Label>
              <input
                id="product-name"
                type="text"
                className={inputClasses}
                value={state.name}
                onChange={(event) => updateField("name", event.target.value)}
                required
              />
              <p className="text-xs text-[var(--slate-gray,var(--color-slate-gray,#64748B))]">
                Slug preview: {slugPreview || "product-slug"}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="product-type">Product Type</Label>
              <Select
                id="product-type"
                value={state.product_type}
                onChange={(event) =>
                  updateField("product_type", event.target.value as ProductType)
                }
              >
                <option value="saas">SaaS</option>
                <option value="template">Template</option>
                <option value="custom">Custom</option>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="short-description">Short Description</Label>
            <textarea
              id="short-description"
              className={inputClasses}
              maxLength={160}
              rows={3}
              value={state.short_description}
              onChange={(event) =>
                updateField("short_description", event.target.value)
              }
              required
            />
            <p className="text-xs text-[var(--slate-gray,var(--color-slate-gray,#64748B))]">
              {state.short_description.length}/160 characters
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="full-description">Full Description</Label>
            <textarea
              id="full-description"
              className={inputClasses}
              rows={5}
              value={state.description}
              onChange={(event) =>
                updateField("description", event.target.value)
              }
              required
            />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="price-dollars">Price in dollars</Label>
              <input
                id="price-dollars"
                type="number"
                min="0"
                step="0.01"
                className={inputClasses}
                value={state.price_dollars}
                onChange={(event) =>
                  updateField("price_dollars", event.target.value)
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="is-subscription">Is Subscription</Label>
              <Switch
                id="is-subscription"
                checked={state.is_subscription}
                onCheckedChange={(checked) =>
                  updateField("is_subscription", checked)
                }
              />
            </div>

            {state.is_subscription ? (
              <div className="space-y-2">
                <Label htmlFor="billing-interval">Billing Interval</Label>
                <Select
                  id="billing-interval"
                  value={state.billing_interval}
                  onChange={(event) =>
                    updateField(
                      "billing_interval",
                      event.target.value as "month" | "year",
                    )
                  }
                >
                  <option value="month">Month</option>
                  <option value="year">Year</option>
                </Select>
              </div>
            ) : null}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <input
                id="category"
                type="text"
                className={inputClasses}
                value={state.category}
                onChange={(event) => updateField("category", event.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stripe-price-id">Stripe Price ID</Label>
              <input
                id="stripe-price-id"
                type="text"
                className={inputClasses}
                value={state.stripe_price_id}
                aria-describedby="stripe-price-id-help"
                onChange={(event) =>
                  updateField("stripe_price_id", event.target.value)
                }
              />
              <p
                id="stripe-price-id-help"
                className="text-xs text-[var(--slate-gray,var(--color-slate-gray,#64748B))]"
              >
                Use the Stripe price ID for checkout-backed products.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image-url">Image URL</Label>
            <input
              id="image-url"
              type="text"
              className={inputClasses}
              value={state.image_url}
              onChange={(event) => updateField("image_url", event.target.value)}
              required
            />
            {state.image_url ? (
              <img
                src={state.image_url}
                alt={`${state.name || "Product"} image preview`}
                className="h-32 w-48 rounded-md object-cover"
              />
            ) : null}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="demo-url">Demo URL</Label>
              <input
                id="demo-url"
                type="text"
                className={inputClasses}
                value={state.demo_url}
                onChange={(event) => updateField("demo_url", event.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="demo-video-url">Demo Video URL</Label>
              <input
                id="demo-video-url"
                type="text"
                className={inputClasses}
                value={state.demo_video_url}
                onChange={(event) =>
                  updateField("demo_video_url", event.target.value)
                }
              />
            </div>
          </div>

          <fieldset className="space-y-3">
            <legend className="text-sm font-semibold">Features</legend>
            {state.features.map((feature, index) => (
              <div key={`feature-${index + 1}`} className="flex gap-2">
                <div className="flex-1 space-y-2">
                  <Label htmlFor={`feature-${index}`}>
                    Feature {index + 1}
                  </Label>
                  <input
                    id={`feature-${index}`}
                    type="text"
                    className={inputClasses}
                    value={feature}
                    onChange={(event) =>
                      updateFeature(index, event.target.value)
                    }
                  />
                </div>
                <button
                  type="button"
                  aria-label={`Remove feature ${index + 1}`}
                  className={`mt-7 rounded-md border px-3 py-2 text-sm font-semibold ${buttonFocusClasses}`}
                  onClick={() => removeFeature(index)}
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              className={`rounded-md border px-4 py-2 text-sm font-semibold ${buttonFocusClasses}`}
              onClick={addFeature}
            >
              Add feature
            </button>
          </fieldset>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="is-active">Is Active</Label>
              <Switch
                id="is-active"
                checked={state.is_active}
                onCheckedChange={(checked) => updateField("is_active", checked)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="is-featured">Is Featured</Label>
              <Switch
                id="is-featured"
                checked={state.is_featured}
                onCheckedChange={(checked) =>
                  updateField("is_featured", checked)
                }
              />
            </div>
          </div>

          <div className="flex flex-col-reverse gap-3 border-t pt-6 sm:flex-row sm:justify-end">
            <button
              type="button"
              className={`rounded-md border px-5 py-2 text-sm font-semibold ${buttonFocusClasses}`}
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`rounded-md bg-[var(--navy,var(--color-navy,#0A0F1E))] px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-[var(--accent-gold,var(--color-accent-gold,#C9A84C))] hover:text-[var(--navy,var(--color-navy,#0A0F1E))] disabled:cursor-not-allowed disabled:opacity-70 ${buttonFocusClasses}`}
            >
              {isSubmitting ? "Saving..." : "Save product"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
