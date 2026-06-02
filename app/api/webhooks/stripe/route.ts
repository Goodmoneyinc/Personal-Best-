import { NextResponse, type NextRequest } from 'next/server';
import Stripe from 'stripe';

import { adminSupabase } from '@/lib/supabase/admin';
import { getStripeServerClient } from '@/lib/stripe/server';

export const runtime = 'nodejs';

async function upsertCompletedCheckout(session: Stripe.Checkout.Session) {
  const { error } = await adminSupabase.from('orders').upsert(
    {
      stripe_checkout_session_id: session.id,
      stripe_customer_id:
        typeof session.customer === 'string' ? session.customer : session.customer?.id ?? null,
      stripe_payment_intent_id:
        typeof session.payment_intent === 'string'
          ? session.payment_intent
          : session.payment_intent?.id ?? null,
      stripe_subscription_id:
        typeof session.subscription === 'string'
          ? session.subscription
          : session.subscription?.id ?? null,
      customer_email: session.customer_details?.email ?? session.customer_email ?? null,
      product_id: session.metadata?.product_id ?? null,
      product_slug: session.metadata?.product_slug ?? null,
      amount_total: session.amount_total,
      currency: session.currency,
      payment_status: session.payment_status,
      checkout_status: session.status,
      raw_event: session,
    },
    {
      onConflict: 'stripe_checkout_session_id',
    },
  );

  if (error) {
    throw error;
  }
}

export async function POST(request: NextRequest) {
  try {
    const stripe = getStripeServerClient();
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!stripe || !webhookSecret) {
      return NextResponse.json(
        { error: 'Stripe webhook handling is not configured.' },
        { status: 503 },
      );
    }

    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json({ error: 'Missing Stripe signature.' }, { status: 400 });
    }

    const body = await request.text();
    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);

    if (event.type === 'checkout.session.completed') {
      await upsertCompletedCheckout(event.data.object);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Unable to process Stripe webhook.',
      },
      { status: 400 },
    );
  }
}
