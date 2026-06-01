import { NextResponse, type NextRequest } from 'next/server';

import { getActiveProducts } from '@/lib/data/products';
import { getStripeServerClient } from '@/lib/stripe/server';

export const runtime = 'nodejs';

type CheckoutPayload = {
  productId?: string;
  priceId?: string;
  quantity?: number;
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

    const product = body.productId
      ? getActiveProducts().find((item) => item.id === body.productId)
      : undefined;
    const priceId = body.priceId ?? product?.stripe_price_id ?? undefined;

    if (!priceId) {
      return NextResponse.json(
        { error: 'This product is not connected to a Stripe price yet.' },
        { status: 400 },
      );
    }

    const origin = process.env.NEXT_PUBLIC_SITE_URL ?? request.nextUrl.origin;
    const quantity =
      Number.isInteger(body.quantity) && body.quantity && body.quantity > 0
        ? body.quantity
        : 1;

    const session = await stripe.checkout.sessions.create({
      mode: product?.is_subscription ? 'subscription' : 'payment',
      line_items: [
        {
          price: priceId,
          quantity,
        },
      ],
      metadata: {
        product_id: product?.id ?? '',
        product_slug: product?.slug ?? '',
      },
      success_url: `${origin}/products/${product?.slug ?? ''}?checkout=success`,
      cancel_url: `${origin}/products/${product?.slug ?? ''}?checkout=cancelled`,
    });

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
