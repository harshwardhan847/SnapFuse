import Stripe from "stripe";
import { loadStripe } from "@stripe/stripe-js";

// Server-side Stripe instance
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-07-30.basil",
});

// Client-side Stripe instance
export const getStripe = () => {
  return loadStripe(process.env.STRIPE_PUBLISHABLE_KEY!);
};
