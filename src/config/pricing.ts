// Pricing and Credits Configuration
// This file contains all pricing plans, credit costs, and related constants
// Modify this file to update pricing without touching business logic

export const CREDIT_COSTS = {
  IMAGE_GENERATION: 1,
  VIDEO_GENERATION: 10,
} as const;

export const SUBSCRIPTION_PLANS = {
  FREE: {
    id: "free",
    name: "Free",
    description: "Perfect for getting started",
    price: 0,
    priceId: null, // No Stripe price ID for free plan
    credits: 10,
    features: [
      "10 credits",
      "SEO content generation",
      "Basic image generation",
      "Community support",
    ],
    popular: false,
    highlighted: false,
  },
  STARTER: {
    id: "starter",
    name: "Starter",
    description: "Great for individuals",
    price: 9.99,
    priceId: process.env.NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID!,
    credits: 100,
    features: [
      "100 credits per month",
      "SEO content generation",
      "High-quality image generation",
      "High-quality video generation",
      "Priority support",
      "Credit top-ups available",
    ],
    popular: false,
    highlighted: false,
  },
  PRO: {
    id: "pro",
    name: "Pro",
    description: "Perfect for professionals",
    price: 19.99,
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID!,
    credits: 250,
    features: [
      "250 credits per month",
      "SEO content generation",
      "AI Agent Support",
      "High-quality image generation",
      "High-quality video generation",
      "Priority support",
      "Credit top-ups available",
    ],
    popular: true,
    highlighted: false,
  },
  ENTERPRISE: {
    id: "enterprise",
    name: "Enterprise",
    description: "For teams and businesses",
    price: 49.99,
    priceId: process.env.NEXT_PUBLIC_STRIPE_ENTERPRISE_PRICE_ID!,
    credits: 750,
    features: [
      "750 credits per month",
      "Unlimited image generation quality",
      "Unlimited video generation quality",
      "All advanced features",
      "Dedicated support",
      "Custom integrations",
      "Credit top-ups available",
    ],
    popular: false,
    highlighted: true,
  },
} as const;

export const TOPUP_OPTIONS = [
  {
    id: "topup_50",
    name: "50 Credits",
    credits: 50,
    price: 4.99,
    priceId: process.env.NEXT_PUBLIC_STRIPE_TOPUP_50_PRICE_ID!,
  },
  {
    id: "topup_100",
    name: "100 Credits",
    credits: 100,
    price: 8.99,
    priceId: process.env.NEXT_PUBLIC_STRIPE_TOPUP_100_PRICE_ID!,
    popular: true,
  },
  {
    id: "topup_250",
    name: "250 Credits",
    credits: 250,
    price: 19.99,
    priceId: process.env.NEXT_PUBLIC_STRIPE_TOPUP_250_PRICE_ID!,
  },
  {
    id: "topup_500",
    name: "500 Credits",
    credits: 500,
    price: 34.99,
    priceId: process.env.NEXT_PUBLIC_STRIPE_TOPUP_500_PRICE_ID!,
  },
] as const;

export type SubscriptionPlan = keyof typeof SUBSCRIPTION_PLANS;
export type CreditCost = keyof typeof CREDIT_COSTS;

// Helper functions
export const getPlanById = (planId: string) => {
  return Object.values(SUBSCRIPTION_PLANS).find((plan) => plan.id === planId);
};

export const getTopupById = (topupId: string) => {
  return TOPUP_OPTIONS.find((topup) => topup.id === topupId);
};

export const canUserTopup = (planId: string) => {
  return planId !== "free";
};

export const getCreditCost = (action: CreditCost): number => {
  return CREDIT_COSTS[action];
};
