"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";

import type { Product } from "@/lib/types";

type PurchaseButtonProps = {
  product: Product;
};

type CheckoutResponse = {
  url?: string;
  checkoutUrl?: string;
};

const focusRingClasses =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-gold,var(--color-accent-gold,#C9A84C))]";

const buttonClasses = [
  "inline-flex w-full items-center justify-center rounded-md px-5 py-3 text-base font-semibold transition-colors sm:w-auto",
  focusRingClasses,
].join(" ");

function getCheckoutUrl(value: unknown) {
  if (!value || typeof value !== "object") {
    return undefined;
  }

  const response = value as CheckoutResponse;
  return response.url ?? response.checkoutUrl;
}

export function PurchaseButton({ product }: PurchaseButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (product.product_type === "custom") {
    return (
      <Link
        href="/contact?service=Custom+Work"
        aria-label={`Start a custom work inquiry for ${product.name}`}
        className={`${buttonClasses} bg-[var(--accent-gold,var(--color-accent-gold,#C9A84C))] text-[var(--navy,var(--color-navy,#0A0F1E))] hover:bg-[var(--navy,var(--color-navy,#0A0F1E))] hover:text-white`}
      >
        Start Custom Work
      </Link>
    );
  }

  async function handlePurchase() {
    if (isLoading) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      if (product.stripe_price_id) {
        const response = await fetch("/api/create-checkout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            priceId: product.stripe_price_id,
            productName: product.name,
            productId: product.id,
            productSlug: product.slug,
            productType: product.product_type,
          }),
        });

        const payload = (await response.json()) as unknown;
        const checkoutUrl = getCheckoutUrl(payload);

        if (!response.ok || !checkoutUrl) {
          throw new Error("Checkout could not be started.");
        }

        window.location.href = checkoutUrl;
        return;
      }

      if (product.stripe_link) {
        window.open(product.stripe_link, "_blank", "noopener,noreferrer");
        setIsLoading(false);
        return;
      }

      throw new Error("This product is not available for purchase yet.");
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Something went wrong starting checkout.",
      );
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-3">
      <button
        type="button"
        aria-label={
          isLoading ? "Processing payment, please wait" : `Get ${product.name}`
        }
        disabled={isLoading}
        className={`${buttonClasses} bg-[var(--accent-gold,var(--color-accent-gold,#C9A84C))] text-[var(--navy,var(--color-navy,#0A0F1E))] hover:bg-[var(--navy,var(--color-navy,#0A0F1E))] hover:text-white disabled:cursor-not-allowed disabled:opacity-70`}
        onClick={handlePurchase}
      >
        {isLoading ? (
          <>
            <Loader2 aria-hidden="true" className="mr-2 h-5 w-5 animate-spin" />
            Processing
          </>
        ) : (
          "Get This Product"
        )}
      </button>

      {error ? (
        <div
          role="alert"
          className="rounded-md border border-red-700 bg-red-50 px-4 py-3 text-sm text-red-800"
        >
          {error}
        </div>
      ) : null}
    </div>
  );
}
