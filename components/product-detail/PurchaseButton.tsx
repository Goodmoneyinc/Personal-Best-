'use client';

import { useState } from 'react';

import { Button, ButtonLink } from '@/components/ui/button';

interface PurchaseButtonProps {
  stripe_price_id?: string | null;
  stripe_link?: string | null;
}

export function PurchaseButton({ stripe_link, stripe_price_id }: PurchaseButtonProps) {
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (stripe_link) {
    return (
      <ButtonLink href={stripe_link} rel="noopener noreferrer" target="_blank">
        Buy now
      </ButtonLink>
    );
  }

  if (!stripe_price_id) {
    return <ButtonLink href="/contact">Request this product</ButtonLink>;
  }

  const priceId = stripe_price_id;

  async function handleCheckout() {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priceId }),
      });
      const data: unknown = await response.json();

      if (!response.ok) {
        const apiError =
          typeof data === 'object' && data !== null && 'error' in data
            ? (data as { error?: unknown }).error
            : null;

        throw new Error(
          typeof apiError === 'string'
            ? apiError
            : 'Unable to start checkout for this product.',
        );
      }

      if (typeof data !== 'object' || data === null || !('url' in data)) {
        throw new Error('Unable to start checkout for this product.');
      }

      const checkoutUrl = (data as { url?: unknown }).url;

      if (typeof checkoutUrl !== 'string') {
        throw new Error('Checkout did not return a valid redirect URL.');
      }

      window.location.assign(checkoutUrl);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Unable to start checkout for this product.',
      );
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <Button aria-busy={isLoading} disabled={isLoading} onClick={handleCheckout} type="button">
        {isLoading ? (
          <span className="inline-flex items-center gap-2">
            <span
              aria-hidden="true"
              className="h-4 w-4 animate-spin rounded-full border-2 border-navy/30 border-t-navy"
            />
            Starting checkout...
            <span className="sr-only">Processing...</span>
          </span>
        ) : (
          'Buy now'
        )}
      </Button>
      {errorMessage ? (
        <p className="text-sm font-semibold text-[#F7B5A5]" role="alert">
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
}
