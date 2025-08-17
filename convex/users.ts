import { internalMutation, mutation } from "./_generated/server";
import { v } from "convex/values";
import { SUBSCRIPTION_PLANS } from "../src/config/pricing";

export const upsertFromClerk = mutation({
  args: { data: v.any() }, // Trust Clerk, skip runtime validation for shape
  handler: async (ctx, { data }) => {
    const user = await ctx.db
      .query("users")
      .withIndex("byExternalId", (q) => q.eq("externalId", data.id))
      .unique();

    const userAttributes = {
      name: `${data.first_name ?? ""} ${data.last_name ?? ""}`.trim(),
      email: data.email_addresses?.[0]?.email_address ?? "",
      externalId: data.id,
      first_name: data.first_name ?? null,
      last_name: data.last_name ?? null,
      image_url: data.image_url ?? null,
      updated_at: new Date().toISOString(),
    };

    if (user === null) {
      // New user - initialize with free plan credits and mark as needing onboarding
      await ctx.db.insert("users", {
        ...userAttributes,
        credits: SUBSCRIPTION_PLANS.FREE.credits,
        subscriptionPlan: 'free',
        subscriptionStatus: 'active',
        onboardingCompleted: false, // New users need onboarding
      });

      // Record initial credit transaction
      await ctx.db.insert("creditTransactions", {
        userId: data.id,
        type: "credit",
        amount: SUBSCRIPTION_PLANS.FREE.credits,
        reason: "welcome_bonus",
        balanceAfter: SUBSCRIPTION_PLANS.FREE.credits,
        createdAt: Date.now(),
      });
    } else {
      // Existing user - just update profile info, don't touch credits
      await ctx.db.patch(user._id, userAttributes);
    }
  },
});

export const deleteFromClerk = mutation({
  args: { clerkUserId: v.string() },
  handler: async (ctx, { clerkUserId }) => {
    const user = await ctx.db
      .query("users")
      .withIndex("byExternalId", (q) => q.eq("externalId", clerkUserId))
      .unique();
    if (user !== null) {
      await ctx.db.delete(user._id);
    }
  },
});
