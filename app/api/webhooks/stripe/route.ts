import { NextResponse, type NextRequest } from 'next/server';
import Stripe from 'stripe';

import { adminSupabase } from '@/lib/supabase/admin';
import { getStripeServerClient } from '@/lib/stripe/server';

export const runtime = 'nodejs';

class WebhookDatabaseError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message);
    this.name = 'WebhookDatabaseError';
    this.cause = options?.cause;
  }
}

function getCustomerId(customer: Stripe.Subscription['customer']) {
  return typeof customer === 'string' ? customer : customer.id;
}

function getSubscriptionPriceId(subscription: Stripe.Subscription) {
  return subscription.items.data[0]?.price.id ?? null;
}

function getSubscriptionCurrentPeriodEnd(subscription: Stripe.Subscription) {
  const currentPeriodEnd = subscription.items.data[0]?.current_period_end;

  return currentPeriodEnd ? new Date(currentPeriodEnd * 1000).toISOString() : null;
}

async function upsertCompletedCheckout(session: Stripe.Checkout.Session) {
  try {
    const { error } = await adminSupabase.from('stripe_orders').upsert(
      {
        stripe_session_id: session.id,
        customer_email: session.customer_details?.email ?? session.customer_email ?? null,
        amount_total: session.amount_total,
        currency: session.currency,
        payment_status: session.payment_status,
        product_id: session.metadata?.productId ?? null,
        created_at: new Date(session.created * 1000).toISOString(),
      },
      {
        onConflict: 'stripe_session_id',
      },
    );

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Failed to upsert completed Stripe checkout session:', {
      sessionId: session.id,
      error,
    });
    throw new WebhookDatabaseError('Unable to persist completed checkout session.', {
      cause: error,
    });
  }
}

async function upsertSubscription(subscription: Stripe.Subscription) {
  try {
    const { error } = await adminSupabase.from('stripe_subscriptions').upsert(
      {
        stripe_subscription_id: subscription.id,
        customer_id: getCustomerId(subscription.customer),
        status: subscription.status,
        price_id: getSubscriptionPriceId(subscription),
        current_period_end: getSubscriptionCurrentPeriodEnd(subscription),
        created_at: new Date(subscription.created * 1000).toISOString(),
      },
      {
        onConflict: 'stripe_subscription_id',
      },
    );

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Failed to upsert Stripe subscription:', {
      subscriptionId: subscription.id,
      error,
    });
    throw new WebhookDatabaseError('Unable to persist subscription update.', {
      cause: error,
    });
  }
}

async function cancelSubscription(subscription: Stripe.Subscription) {
  try {
    const { error } = await adminSupabase
      .from('stripe_subscriptions')
      .update({ status: 'canceled' })
      .eq('stripe_subscription_id', subscription.id);

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Failed to mark Stripe subscription canceled:', {
      subscriptionId: subscription.id,
      error,
    });
    throw new WebhookDatabaseError('Unable to persist subscription cancellation.', {
      cause: error,
    });
  }
}

async function handleStripeEvent(event: Stripe.Event) {
  switch (event.type) {
    case 'checkout.session.completed':
      await upsertCompletedCheckout(event.data.object);
      return;
    case 'customer.subscription.created':
    case 'customer.subscription.updated':
      await upsertSubscription(event.data.object);
      return;
    case 'customer.subscription.deleted':
      await cancelSubscription(event.data.object);
      return;
    default:
      return;
  }
}


export async function POST(request: NextRequest) {
  const stripe = getStripeServerClient();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripe || !webhookSecret) {
    console.error('Stripe webhook handling is not configured.');
    return NextResponse.json(
      { error: 'Stripe webhook handling is not configured.' },
      { status: 500 },
    );
  }

  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    console.error('Stripe webhook request is missing stripe-signature header.');
    return NextResponse.json({ error: 'Missing Stripe signature.' }, { status: 400 });
  }

  const body = await request.text();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    console.error('Stripe webhook signature verification failed:', error);
    return NextResponse.json({ error: 'Invalid Stripe webhook signature.' }, { status: 400 });
  }

  try {
    await handleStripeEvent(event);

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Stripe webhook database operation failed:', error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : 'Unable to process Stripe webhook.',
      },
      { status: 500 },
    );
  }
}
