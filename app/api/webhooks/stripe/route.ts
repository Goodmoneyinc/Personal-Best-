import { NextResponse } from "next/server";
import Stripe from "stripe";

import { supabaseAdmin } from "@/lib/supabase/admin";

export const config = {
  api: {
    bodyParser: false,
  },
};

type StripeOrderUpsert = {
  stripe_session_id: string;
  stripe_customer_id: string | null;
  stripe_payment_intent_id: string | null;
  product_id: string | null;
  product_name: string | null;
  amount_total: number | null;
  currency: string | null;
  payment_status: string | null;
  customer_email: string | null;
  raw_session: Stripe.Checkout.Session;
};

type StripeSubscriptionUpsert = {
  stripe_subscription_id: string;
  stripe_customer_id: string | null;
  status: string;
  price_id: string | null;
  product_id: string | null;
  current_period_start: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  raw_subscription: Stripe.Subscription;
};

function getStringId(value: string | Stripe.Customer | Stripe.PaymentIntent | null) {
  if (!value) {
    return null;
  }

  return typeof value === "string" ? value : value.id;
}

function getProductId(session: Stripe.Checkout.Session) {
  return session.metadata?.productId ?? session.client_reference_id ?? null;
}

function getProductName(session: Stripe.Checkout.Session) {
  return session.metadata?.productName ?? null;
}

function isSaasSubscription(session: Stripe.Checkout.Session) {
  return (
    session.mode === "subscription" &&
    (session.metadata?.productType === "saas" ||
      session.metadata?.isSaas === "true")
  );
}

function toIsoString(unixSeconds?: number | null) {
  return unixSeconds ? new Date(unixSeconds * 1000).toISOString() : null;
}

function getSubscriptionProductId(subscription: Stripe.Subscription) {
  const item = subscription.items.data[0];
  const product = item?.price.product;

  if (!product) {
    return subscription.metadata.productId ?? null;
  }

  return typeof product === "string" ? product : product.id;
}

function getSubscriptionPriceId(subscription: Stripe.Subscription) {
  return subscription.items.data[0]?.price.id ?? null;
}

function getSubscriptionPeriod(
  subscription: Stripe.Subscription,
  key: "current_period_start" | "current_period_end",
) {
  const subscriptionWithPeriod = subscription as Stripe.Subscription & {
    current_period_start?: number | null;
    current_period_end?: number | null;
  };

  return toIsoString(subscriptionWithPeriod[key]);
}

async function triggerFollowUpEmail(session: Stripe.Checkout.Session) {
  const functionUrl = process.env.SUPABASE_FUNCTIONS_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!functionUrl || !serviceRoleKey) {
    return;
  }

  await fetch(`${functionUrl.replace(/\/$/, "")}/send-follow-up`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${serviceRoleKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sessionId: session.id,
      productId: getProductId(session),
      customerEmail: session.customer_details?.email ?? session.customer_email,
    }),
  }).catch(() => undefined);
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  if (!supabaseAdmin) {
    throw new Error("Supabase admin client is not configured.");
  }

  const productId = getProductId(session);
  const order: StripeOrderUpsert = {
    stripe_session_id: session.id,
    stripe_customer_id: getStringId(session.customer),
    stripe_payment_intent_id: getStringId(session.payment_intent),
    product_id: productId,
    product_name: getProductName(session),
    amount_total: session.amount_total,
    currency: session.currency,
    payment_status: session.payment_status,
    customer_email: session.customer_details?.email ?? session.customer_email,
    raw_session: session,
  };

  const { error: orderError } = await supabaseAdmin
    .from("stripe_orders")
    .upsert(order, {
      onConflict: "stripe_session_id",
    });

  if (orderError) {
    throw orderError;
  }

  if (productId && isSaasSubscription(session)) {
    const customerEmail = session.customer_details?.email ?? session.customer_email;

    if (customerEmail) {
      const { error: profileError } = await supabaseAdmin
        .from("profiles")
        .update({
          has_access: true,
          purchased_saas_id: productId,
        })
        .eq("email", customerEmail);

      if (profileError) {
        throw profileError;
      }
    }
  }

  await triggerFollowUpEmail(session);
}

async function upsertSubscription(subscription: Stripe.Subscription) {
  if (!supabaseAdmin) {
    throw new Error("Supabase admin client is not configured.");
  }

  const subscriptionRecord: StripeSubscriptionUpsert = {
    stripe_subscription_id: subscription.id,
    stripe_customer_id: getStringId(subscription.customer),
    status: subscription.status,
    price_id: getSubscriptionPriceId(subscription),
    product_id: subscription.metadata.productId ?? getSubscriptionProductId(subscription),
    current_period_start: getSubscriptionPeriod(
      subscription,
      "current_period_start",
    ),
    current_period_end: getSubscriptionPeriod(subscription, "current_period_end"),
    cancel_at_period_end: subscription.cancel_at_period_end,
    raw_subscription: subscription,
  };

  const { error } = await supabaseAdmin
    .from("stripe_subscriptions")
    .upsert(subscriptionRecord, {
      onConflict: "stripe_subscription_id",
    });

  if (error) {
    throw error;
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  await upsertSubscription(subscription);

  const productId = subscription.metadata.productId ?? getSubscriptionProductId(subscription);

  if (!supabaseAdmin || !productId) {
    return;
  }

  const { error } = await supabaseAdmin
    .from("profiles")
    .update({
      has_access: false,
      purchased_saas_id: null,
    })
    .eq("purchased_saas_id", productId);

  if (error) {
    throw error;
  }
}

export async function POST(request: Request) {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripeSecretKey || !stripeWebhookSecret) {
    return NextResponse.json(
      { error: "Stripe webhook is not configured." },
      { status: 500 },
    );
  }

  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing Stripe signature." },
      { status: 400 },
    );
  }

  const stripe = new Stripe(stripeSecretKey);
  const rawBody = await request.text();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      stripeWebhookSecret,
    );
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Invalid Stripe webhook signature.",
      },
      { status: 400 },
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(
          event.data.object as Stripe.Checkout.Session,
        );
        break;
      case "customer.subscription.created":
      case "customer.subscription.updated":
        await upsertSubscription(event.data.object as Stripe.Subscription);
        break;
      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(
          event.data.object as Stripe.Subscription,
        );
        break;
      default:
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Stripe webhook could not be processed.",
      },
      { status: 500 },
    );
  }
}
