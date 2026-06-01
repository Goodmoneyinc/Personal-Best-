'use client';

import { useState } from 'react';

import { Button, ButtonLink } from '@/components/ui/button';
import type { Product } from '@/lib/types';

interface PurchaseButtonProps {
  product: Product;
}

export function PurchaseButton({ product }: PurchaseButtonProps) {
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (product.stripe_link) {
    return (
      <ButtonLink href={product.stripe_link} target="_blank">
        Buy now
      </ButtonLink>
    );
  }

  if (!product.stripe_price_id) {
    return <ButtonLink href="/contact">Request this product</ButtonLink>;
  }

  async function handleCheckout() {
    setIsLoading(true);
    setStatus('Creating secure checkout session...');

    try {
      const response = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId: product.id }),
      });
      const data: unknown = await response.json();

      if (!response.ok || typeof data !== 'object' || data === null || !('url' in data)) {
        throw new Error('Unable to start checkout for this product.');
      }

      const checkoutUrl = (data as { url?: unknown }).url;

      if (typeof checkoutUrl !== 'string') {
        throw new Error('Checkout did not return a valid redirect URL.');
      }

      window.location.assign(checkoutUrl);
    } catch (error) {
      setStatus(
        error instanceof Error
          ? error.message
          : 'Unable to start checkout for this product.',
      );
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <Button disabled={isLoading} onClick={handleCheckout} type="button">
        {isLoading ? 'Starting checkout...' : 'Buy now'}
      </Button>
      <p aria-live="polite" className="text-sm font-semibold text-warm/80" role="status">
        {status}
      </p>
    </div>
  );
}
