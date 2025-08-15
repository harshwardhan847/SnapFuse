import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import Stripe from "stripe";
import { ConvexHttpClient } from "convex/browser";

import {
  SUBSCRIPTION_PLANS,
  TOPUP_OPTIONS,
  getPlanById,
  getTopupById,
} from "@/config/pricing";
import { api } from "../../../../../convex/_generated/api";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(req: NextRequest) {
  const signature = (await headers()).get("stripe-signature");
  console.log(signature);

  if (!signature) {
    console.error("No Stripe signature found in request headers");
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.error("STRIPE_WEBHOOK_SECRET environment variable not set");
    return NextResponse.json(
      { error: "Webhook not configured" },
      { status: 500 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      await req.text(),
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error: any) {
    console.error("Webhook signature verification failed:", error.message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  console.log(`Processing webhook event: ${event.type} (${event.id})`);

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutSessionCompleted(session);
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdated(subscription);
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(subscription);
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaymentSucceeded(invoice);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    console.log(
      `Successfully processed webhook event: ${event.type} (${event.id})`
    );
    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error(
      `Error processing webhook event ${event.type} (${event.id}):`,
      error.message
    );
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}

async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session
) {
  console.log(session);
  const { userId, type, planId, topupId } = session.metadata || {};

  if (!userId) {
    console.error("No userId in session metadata");
    return;
  }

  // Record the payment
  await convex.mutation(api.payments.recordPayment, {
    userId,
    stripePaymentIntentId: session.payment_intent,
    stripeSessionId: session.id,
    amount: session.amount_total || 0,
    currency: session.currency || "usd",
    status: session.payment_status || "paid",
    type: type as "subscription" | "topup",
    planId: planId || undefined,
    creditsAdded:
      type === "topup" ? getTopupById(topupId!)?.credits : undefined,
  });

  if (type === "subscription" && planId) {
    const plan = getPlanById(planId);
    if (plan) {
      // Update subscription info
      await convex.mutation(api.payments.updateSubscription, {
        userId,
        subscriptionPlan: plan.id,
        stripeCustomerId: session.customer as string,
        stripeSubscriptionId: session.subscription as string,
        subscriptionStatus: "active",
        subscriptionPeriodEnd: undefined, // Will be set when we get subscription details
      });

      // Add credits for the subscription
      await convex.mutation(api.payments.addCredits, {
        userId,
        amount: plan.credits,
        reason: `subscription_${plan.id}`,
        relatedId: session.id,
      });
    }
  } else if (type === "topup" && topupId) {
    const topup = getTopupById(topupId);
    if (topup) {
      // Add credits for the topup
      await convex.mutation(api.payments.addCredits, {
        userId,
        amount: topup.credits,
        reason: `topup_${topup.id}`,
        relatedId: session.id,
      });
    }
  }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;

  try {
    // Find user by Stripe customer ID
    const user = await convex.query(api.payments.getUserByStripeCustomerId, {
      stripeCustomerId: customerId,
    });

    if (!user) {
      console.error("User not found for customer ID:", customerId);
      return;
    }

    // Update subscription status
    await convex.mutation(api.payments.updateSubscription, {
      userId: user.externalId,
      subscriptionPlan: user.subscriptionPlan || "free",
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscription.id,
      subscriptionStatus: subscription.status,
      subscriptionPeriodEnd: subscription.ended_at,
    });

    console.log("Subscription updated for user:", user.externalId);
  } catch (error) {
    console.error("Error handling subscription update:", error);
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;

  try {
    // Find user by Stripe customer ID
    const user = await convex.query(api.payments.getUserByStripeCustomerId, {
      stripeCustomerId: customerId,
    });

    if (!user) {
      console.error("User not found for customer ID:", customerId);
      return;
    }

    // Update user to free plan when subscription is deleted
    await convex.mutation(api.payments.updateSubscription, {
      userId: user.externalId,
      subscriptionPlan: "free",
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscription.id,
      subscriptionStatus: "canceled",
      subscriptionPeriodEnd: subscription.ended_at,
    });

    console.log("Subscription canceled for user:", user.externalId);
  } catch (error) {
    console.error("Error handling subscription deletion:", error);
  }
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  // Handle recurring subscription payments
  const customerId = invoice.customer as string;
  const subscriptionId = invoice.parent?.subscription_details
    ?.subscription as string;

  if (!subscriptionId) {
    // This is not a subscription invoice, skip
    return;
  }

  try {
    // Find user by Stripe customer ID
    const user = await convex.query(api.payments.getUserByStripeCustomerId, {
      stripeCustomerId: customerId,
    });

    if (!user) {
      console.error("User not found for customer ID:", customerId);
      return;
    }

    // Get subscription details from Stripe to determine the plan
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const priceId = subscription.items.data[0]?.price.id;

    if (!priceId) {
      console.error("No price ID found in subscription");
      return;
    }

    // Find the plan that matches this price ID
    let planCredits = 0;
    let planId = "free";

    // Check which plan this price ID belongs to
    if (priceId === process.env.NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID) {
      planCredits = SUBSCRIPTION_PLANS.STARTER.credits;
      planId = "starter";
    } else if (priceId === process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID) {
      planCredits = SUBSCRIPTION_PLANS.PRO.credits;
      planId = "pro";
    } else if (priceId === process.env.NEXT_PUBLIC_STRIPE_ENTERPRISE_PRICE_ID) {
      planCredits = SUBSCRIPTION_PLANS.ENTERPRISE.credits;
      planId = "enterprise";
    }

    if (planCredits > 0) {
      // Add monthly credits for subscription renewal
      await convex.mutation(api.payments.addCredits, {
        userId: user.externalId,
        amount: planCredits,
        reason: `subscription_renewal_${planId}`,
        relatedId: invoice.id,
      });

      // Record the payment
      await convex.mutation(api.payments.recordPayment, {
        userId: user.externalId,
        stripePaymentIntentId: invoice.payments?.data[0].payment
          .payment_intent as string,
        amount: invoice.amount_paid,
        currency: invoice.currency,
        status: invoice.status || "paid",
        type: "subscription",
        planId: planId,
      });

      console.log(
        `Added ${planCredits} credits for subscription renewal:`,
        user.externalId
      );
    }
  } catch (error) {
    console.error("Error handling invoice payment:", error);
  }
}
