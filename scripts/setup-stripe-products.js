#!/usr/bin/env node

/**
 * Setup script to create Stripe products and prices
 * Run this script after setting up your Stripe account
 *
 * Usage: node scripts/setup-stripe-products.js
 */

require("dotenv").config(); // .env
require("dotenv").config({ path: ".env.local", override: true }); // .env.local takes precedence

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const SUBSCRIPTION_PLANS = [
  {
    id: "starter",
    name: "Starter Plan",
    description: "Perfect for individuals getting started",
    price: 1999, // $19.99 in cents
    credits: 40,
  },
  {
    id: "pro",
    name: "Pro Plan",
    description: "Great for professionals and creators",
    price: 5999, // $59.99 in cents
    credits: 200,
  },
  {
    id: "enterprise",
    name: "Enterprise Plan",
    description: "For teams and businesses",
    price: 14_999, // $149.99 in cents
    credits: 500,
  },
];

const TOPUP_OPTIONS = [
  {
    id: "topup_50",
    name: "50 Credits Top-up",
    description: "Add 50 credits to your account",
    price: 499, // $4.99 in cents
    credits: 50,
  },
  {
    id: "topup_100",
    name: "100 Credits Top-up",
    description: "Add 100 credits to your account",
    price: 899, // $8.99 in cents
    credits: 100,
  },
  {
    id: "topup_250",
    name: "250 Credits Top-up",
    description: "Add 250 credits to your account",
    price: 1999, // $19.99 in cents
    credits: 250,
  },
  {
    id: "topup_500",
    name: "500 Credits Top-up",
    description: "Add 500 credits to your account",
    price: 3499, // $34.99 in cents
    credits: 500,
  },
];

async function createStripeProducts() {
  console.log("🚀 Setting up Stripe products and prices...\n");

  try {
    // Create subscription products and prices
    console.log("📦 Creating subscription plans...");
    for (const plan of SUBSCRIPTION_PLANS) {
      const product = await stripe.products.create({
        id: `snapfuse_${plan.id}`,
        name: plan.name,
        description: `${plan.description} - ${plan.credits} credits per month`,
        metadata: {
          credits: plan.credits.toString(),
          plan_id: plan.id,
        },
      });

      const price = await stripe.prices.create({
        product: product.id,
        unit_amount: plan.price,
        currency: "usd",
        recurring: {
          interval: "month",
        },
        metadata: {
          credits: plan.credits.toString(),
          plan_id: plan.id,
        },
      });

      console.log(`✅ Created ${plan.name}: ${price.id}`);
      console.log(
        `   Add to .env: NEXT_PUBLIC_STRIPE_${plan.id.toUpperCase()}_PRICE_ID=${price.id}`
      );
    }

    console.log("\n💰 Creating credit top-up products...");
    for (const topup of TOPUP_OPTIONS) {
      const product = await stripe.products.create({
        id: `snapfuse_${topup.id}`,
        name: topup.name,
        description: topup.description,
        metadata: {
          credits: topup.credits.toString(),
          topup_id: topup.id,
        },
      });

      const price = await stripe.prices.create({
        product: product.id,
        unit_amount: topup.price,
        currency: "usd",
        metadata: {
          credits: topup.credits.toString(),
          topup_id: topup.id,
        },
      });

      console.log(`✅ Created ${topup.name}: ${price.id}`);
      console.log(
        `   Add to .env: NEXT_PUBLIC_STRIPE_${topup.id.toUpperCase()}_PRICE_ID=${price.id}`
      );
    }

    console.log("\n🎉 All products and prices created successfully!");
    console.log("\n📝 Next steps:");
    console.log("1. Copy the price IDs above to your .env.local file");
    console.log("2. Set up a webhook endpoint in your Stripe dashboard");
    console.log(
      "3. Point the webhook to: https://yourdomain.com/api/stripe/webhooks"
    );
    console.log(
      "4. Enable these events: checkout.session.completed, customer.subscription.updated, customer.subscription.deleted, invoice.payment_succeeded"
    );
    console.log(
      "5. Copy the webhook signing secret to STRIPE_WEBHOOK_SECRET in .env.local"
    );
  } catch (error) {
    console.error("❌ Error creating Stripe products:", error.message);
    process.exit(1);
  }
}

// Check if Stripe secret key is provided
if (!process.env.STRIPE_SECRET_KEY) {
  console.error("❌ Please set STRIPE_SECRET_KEY environment variable");
  console.log(
    "Usage: STRIPE_SECRET_KEY=sk_test_... node scripts/setup-stripe-products.js"
  );
  process.exit(1);
}

createStripeProducts();
