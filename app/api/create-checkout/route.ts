import { NextResponse, type NextRequest } from 'next/server';

import { getStripeServerClient } from '@/lib/stripe/server';

export const runtime = 'nodejs';

type CheckoutPayload = {
  priceId?: string;
};

function isCheckoutPayload(value: unknown): value is CheckoutPayload {
  return typeof value === 'object' && value !== null;
}

export async function POST(request: NextRequest) {
  try {
    const stripe = getStripeServerClient();

    if (!stripe) {
      return NextResponse.json(
        { error: 'Stripe checkout is not configured.' },
        { status: 503 },
      );
    }

    const body: unknown = await request.json();

    if (!isCheckoutPayload(body)) {
      return NextResponse.json({ error: 'Invalid checkout request.' }, { status: 400 });
    }

    const priceId = body.priceId;

    if (typeof priceId !== 'string' || priceId.trim().length === 0) {
      return NextResponse.json(
        { error: 'A Stripe price ID is required to start checkout.' },
        { status: 400 },
      );
    }

    const normalizedPriceId = priceId.trim();
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

    if (!siteUrl) {
      return NextResponse.json(
        { error: 'Checkout is missing the public site URL configuration.' },
        { status: 503 },
      );
    }

    const normalizedSiteUrl = siteUrl.replace(/\/$/, '');
    const price = await stripe.prices.retrieve(normalizedPriceId);
    const mode = price.recurring ? 'subscription' : 'payment';

    const session = await stripe.checkout.sessions.create({
      mode,
      line_items: [
        {
          price: normalizedPriceId,
          quantity: 1,
        },
      ],
      success_url: `${normalizedSiteUrl}/products?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${normalizedSiteUrl}/products?checkout=cancelled`,
    });

    if (!session.url) {
      return NextResponse.json(
        { error: 'Stripe did not return a checkout URL.' },
        { status: 502 },
      );
    }

    return NextResponse.json({ url: session.url });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Unable to create checkout session.',
      },
      { status: 500 },
    );
  }
}
