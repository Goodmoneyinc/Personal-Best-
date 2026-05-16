import { NextResponse } from "next/server";
import Stripe from "stripe";

type CreateCheckoutRequest = {
  priceId?: unknown;
  productName?: unknown;
  productId?: unknown;
  productSlug?: unknown;
};

function getString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getSiteUrl(request: Request) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  if (siteUrl) {
    return siteUrl.replace(/\/$/, "");
  }

  return new URL(request.url).origin;
}

function getCheckoutMode(price: Stripe.Price): Stripe.Checkout.SessionCreateParams.Mode {
  const metadataMode = price.metadata.checkout_mode ?? price.metadata.mode;

  if (metadataMode === "subscription" || metadataMode === "payment") {
    return metadataMode;
  }

  if (
    price.metadata.is_subscription === "true" ||
    price.metadata.billing_interval
  ) {
    return "subscription";
  }

  return price.recurring ? "subscription" : "payment";
}

function getStripeErrorStatus(error: unknown) {
  if (
    error &&
    typeof error === "object" &&
    "statusCode" in error &&
    typeof error.statusCode === "number"
  ) {
    return error.statusCode;
  }

  return 500;
}

function getStripeErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "Unable to create Stripe Checkout Session.";
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CreateCheckoutRequest;
    const priceId = getString(body.priceId);
    const productName = getString(body.productName);
    const productId = getString(body.productId);
    const productSlug =
      getString(body.productSlug) || slugify(productName) || productId;

    if (!priceId) {
      return NextResponse.json(
        { error: "priceId is required." },
        { status: 400 },
      );
    }

    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

    if (!stripeSecretKey) {
      return NextResponse.json(
        { error: "Stripe is not configured." },
        { status: 500 },
      );
    }

    const siteUrl = getSiteUrl(request);
    const stripe = new Stripe(stripeSecretKey);
    const price = await stripe.prices.retrieve(priceId);
    const session = await stripe.checkout.sessions.create({
      mode: getCheckoutMode(price),
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${siteUrl}/products/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: productSlug
        ? `${siteUrl}/products/${productSlug}`
        : `${siteUrl}/products`,
      metadata: {
        productId,
        fulatelier: "true",
      },
      allow_promotion_codes: true,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    return NextResponse.json(
      { error: getStripeErrorMessage(error) },
      { status: getStripeErrorStatus(error) },
    );
  }
}
