import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { internal } from "./_generated/api";

// Get user's current credits and subscription info
export const getUserCredits = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("byExternalId", (q) => q.eq("externalId", args.userId))
      .first();

    if (!user) {
      return null;
    }

    return {
      credits: user.credits || 0,
      subscriptionPlan: user.subscriptionPlan || "free",
      subscriptionStatus: user.subscriptionStatus,
      subscriptionPeriodEnd: user.subscriptionPeriodEnd,
    };
  },
});

// Deduct credits for an action (image/video generation)
export const deductCredits = mutation({
  args: {
    userId: v.string(),
    amount: v.number(),
    reason: v.string(),
    relatedId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("byExternalId", (q) => q.eq("externalId", args.userId))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    const currentCredits = user.credits || 0;

    if (currentCredits < args.amount) {
      throw new Error("Insufficient credits");
    }

    const newBalance = currentCredits - args.amount;

    // Update user credits
    await ctx.db.patch(user._id, {
      credits: newBalance,
    });

    // Record transaction
    await ctx.db.insert("creditTransactions", {
      userId: args.userId,
      type: "debit",
      amount: args.amount,
      reason: args.reason,
      relatedId: args.relatedId,
      balanceAfter: newBalance,
      createdAt: Date.now(),
    });

    return { newBalance, deducted: args.amount };
  },
});

// Add credits (for subscriptions, topups)
export const addCredits = mutation({
  args: {
    userId: v.string(),
    amount: v.number(),
    reason: v.string(),
    relatedId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("byExternalId", (q) => q.eq("externalId", args.userId))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    const currentCredits = user.credits || 0;
    const newBalance = currentCredits + args.amount;

    // Update user credits
    await ctx.db.patch(user._id, {
      credits: newBalance,
    });

    // Record transaction
    await ctx.db.insert("creditTransactions", {
      userId: args.userId,
      type: "credit",
      amount: args.amount,
      reason: args.reason,
      relatedId: args.relatedId,
      balanceAfter: newBalance,
      createdAt: Date.now(),
    });

    return { newBalance, added: args.amount };
  },
});

// Update user subscription info
export const updateSubscription = mutation({
  args: {
    userId: v.string(),
    subscriptionPlan: v.string(),
    stripeCustomerId: v.optional(v.string()),
    stripeSubscriptionId: v.optional(v.string()),
    subscriptionStatus: v.optional(v.string()),
    subscriptionPeriodEnd: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("byExternalId", (q) => q.eq("externalId", args.userId))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    await ctx.db.patch(user._id, {
      subscriptionPlan: args.subscriptionPlan,
      stripeCustomerId: args.stripeCustomerId,
      stripeSubscriptionId: args.stripeSubscriptionId,
      subscriptionStatus: args.subscriptionStatus,
      subscriptionPeriodEnd: args.subscriptionPeriodEnd,
    });

    return { success: true };
  },
});

// Cancel subscription (downgrade to free plan)
export const cancelSubscription = mutation({
  args: {
    userId: v.string(),
    reason: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("byExternalId", (q) => q.eq("externalId", args.userId))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    // Update to free plan
    await ctx.db.patch(user._id, {
      subscriptionPlan: "free",
      subscriptionStatus: "canceled",
    });

    // Record the cancellation
    await ctx.db.insert("creditTransactions", {
      userId: args.userId,
      type: "credit",
      amount: 0,
      reason: args.reason || "subscription_canceled",
      balanceAfter: user.credits || 0,
      createdAt: Date.now(),
    });

    return { success: true };
  },
});

// Get user's credit transaction history
export const getCreditHistory = query({
  args: {
    userId: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const transactions = await ctx.db
      .query("creditTransactions")
      .withIndex("byUserIdAndCreatedAt", (q) => q.eq("userId", args.userId))
      .order("desc")
      .take(args.limit || 50);

    return transactions;
  },
});

// Record payment
export const recordPayment = mutation({
  args: {
    userId: v.string(),
    stripePaymentIntentId: v.optional(v.union(v.string(), v.null())),
    stripeSessionId: v.optional(v.string()),
    amount: v.number(),
    currency: v.string(),
    status: v.string(),
    type: v.union(v.literal("subscription"), v.literal("topup")),
    planId: v.optional(v.string()),
    creditsAdded: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    await ctx.db.insert("payments", {
      userId: args.userId,
      stripePaymentIntentId: args.stripePaymentIntentId,
      stripeSessionId: args.stripeSessionId,
      amount: args.amount,
      currency: args.currency,
      status: args.status,
      type: args.type,
      planId: args.planId,
      creditsAdded: args.creditsAdded,
      createdAt: now,
      updatedAt: now,
    });

    return { success: true };
  },
});

// Check if user has sufficient credits
export const checkCredits = query({
  args: {
    userId: v.string(),
    requiredCredits: v.number(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("byExternalId", (q) => q.eq("externalId", args.userId))
      .first();

    if (!user) {
      return { hasCredits: false, currentCredits: 0 };
    }

    const currentCredits = user.credits || 0;
    return {
      hasCredits: currentCredits >= args.requiredCredits,
      currentCredits,
    };
  },
});

// Find user by Stripe customer ID
export const getUserByStripeCustomerId = query({
  args: { stripeCustomerId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("byStripeCustomerId", (q) =>
        q.eq("stripeCustomerId", args.stripeCustomerId)
      )
      .first();
  },
});

// Find user by Stripe subscription ID
export const getUserByStripeSubscriptionId = query({
  args: { stripeSubscriptionId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("byStripeSubscriptionId", (q) =>
        q.eq("stripeSubscriptionId", args.stripeSubscriptionId)
      )
      .first();
  },
});
// Internal function for deducting credits (used by scheduler)
export const deductCreditsInternal = mutation({
  args: {
    userId: v.string(),
    amount: v.number(),
    reason: v.string(),
    relatedId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("byExternalId", (q) => q.eq("externalId", args.userId))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    const currentCredits = user.credits || 0;

    if (currentCredits < args.amount) {
      throw new Error("Insufficient credits");
    }

    const newBalance = currentCredits - args.amount;

    // Update user credits
    await ctx.db.patch(user._id, {
      credits: newBalance,
    });

    // Record transaction
    await ctx.db.insert("creditTransactions", {
      userId: args.userId,
      type: "debit",
      amount: args.amount,
      reason: args.reason,
      relatedId: args.relatedId,
      balanceAfter: newBalance,
      createdAt: Date.now(),
    });

    return { newBalance, deducted: args.amount };
  },
});
