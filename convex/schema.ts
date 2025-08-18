import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    externalId: v.string(), // Clerk user id
    first_name: v.optional(v.string()),
    last_name: v.optional(v.string()),
    image_url: v.optional(v.string()),
    updated_at: v.optional(v.string()),
    // Payment and credits fields
    credits: v.optional(v.number()), // Current available credits
    subscriptionPlan: v.optional(v.string()), // free, starter, pro, enterprise
    stripeCustomerId: v.optional(v.string()),
    stripeSubscriptionId: v.optional(v.string()),
    subscriptionStatus: v.optional(v.string()), // active, canceled, past_due, etc.
    subscriptionPeriodEnd: v.optional(v.number()), // Unix timestamp
    // Onboarding and preferences
    onboardingCompleted: v.optional(v.boolean()),
    company: v.optional(v.string()),
    role: v.optional(v.string()),
    industry: v.optional(v.string()),
    teamSize: v.optional(v.string()),
    primaryUseCase: v.optional(v.string()),
    goals: v.optional(v.array(v.string())),
    experienceLevel: v.optional(v.string()),
    contentTypes: v.optional(v.array(v.string())),
    qualityPreference: v.optional(v.string()),
    // Generation preferences
    defaultImageStyle: v.optional(v.string()),
    defaultImageSize: v.optional(v.string()),
    defaultVideoLength: v.optional(v.string()),
    defaultVideoStyle: v.optional(v.string()),
    creativityLevel: v.optional(v.number()),
    autoSaveGenerations: v.optional(v.boolean()),
    showWatermark: v.optional(v.boolean()),
    nsfwFilter: v.optional(v.boolean()),
    contentModeration: v.optional(v.boolean()),
    // Notification preferences
    emailNotifications: v.optional(v.boolean()),
    pushNotifications: v.optional(v.boolean()),
    smsNotifications: v.optional(v.boolean()),
    generationComplete: v.optional(v.boolean()),
    creditLowWarning: v.optional(v.boolean()),
    subscriptionUpdates: v.optional(v.boolean()),
    marketingEmails: v.optional(v.boolean()),
    securityAlerts: v.optional(v.boolean()),
    weeklyDigest: v.optional(v.boolean()),
    creditThreshold: v.optional(v.number()),
    notificationFrequency: v.optional(v.string()),
  })
    .index("byExternalId", ["externalId"])
    .index("byStripeCustomerId", ["stripeCustomerId"])
    .index("byStripeSubscriptionId", ["stripeSubscriptionId"]),

  // Credit transactions for tracking usage
  creditTransactions: defineTable({
    userId: v.string(),
    type: v.union(v.literal("debit"), v.literal("credit")), // debit = used, credit = added
    amount: v.number(),
    reason: v.string(), // "image_generation", "video_generation", "subscription_renewal", "topup", etc.
    relatedId: v.optional(v.string()), // ID of related image/video/subscription
    balanceAfter: v.number(), // Credits balance after this transaction
    createdAt: v.number(), // Unix timestamp
  })
    .index("byUserId", ["userId"])
    .index("byUserIdAndCreatedAt", ["userId", "createdAt"]),

  // Stripe payment records
  payments: defineTable({
    userId: v.string(),
    stripePaymentIntentId: v.optional(v.union(v.string(), v.null())),
    stripeSessionId: v.optional(v.string()),
    stripeInvoiceId: v.optional(v.string()),
    amount: v.number(), // Amount in cents
    currency: v.string(),
    status: v.string(), // succeeded, pending, failed, etc.
    type: v.union(v.literal("subscription"), v.literal("topup")),
    planId: v.optional(v.string()), // For subscriptions
    creditsAdded: v.optional(v.number()), // For topups
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("byUserId", ["userId"])
    .index("byStripePaymentIntentId", ["stripePaymentIntentId"])
    .index("byStripeSessionId", ["stripeSessionId"]),

  chats: defineTable({
    title: v.string(),
    userId: v.string(),
  }).index("byUserId", ["userId"]),

  messages: defineTable({
    chatSessionId: v.string(),
    message: v.object({
      id: v.string(),
      role: v.union(v.literal("assistant"), v.literal("user")),
      parts: v.optional(v.any()),
      text: v.optional(v.string()),
      type: v.union(v.literal("text"), v.literal("image")), // "text" | "image" (new)
      status: v.optional(
        v.union(
          v.literal("pending"),
          v.literal("processing"),
          v.literal("done"),
          v.literal("error")
        )
      ), // "pending" | "done" | "error" (new)
      image_url: v.optional(v.union(v.null(), v.string())), // When status is "done"
    }),
  }).index("byChatSessionId", ["chatSessionId"]),
  images: defineTable({
    request_id: v.string(),
    prompt: v.string(),
    image_url: v.union(v.null(), v.string()),
    input_storage_id: v.union(v.id("_storage"), v.null()),
    status: v.union(
      v.literal("pending"),
      v.literal("processing"),
      v.literal("done"),
      v.literal("error")
    ),
    error_message: v.union(v.null(), v.string()),
    updated_at: v.optional(v.string()),
    userId: v.string(),
  }).index("byUserId", ["userId"]),

  videos: defineTable({
    request_id: v.string(),
    prompt: v.string(),
    video_url: v.union(v.null(), v.string()),
    input_storage_id: v.union(v.id("_storage"), v.null()),
    imageUrl: v.optional(v.string()),
    duration: v.optional(v.string()),
    negative_prompt: v.optional(v.string()),
    cfg_scale: v.optional(v.number()),
    status: v.union(
      v.literal("pending"),
      v.literal("processing"),
      v.literal("done"),
      v.literal("error")
    ),
    error_message: v.union(v.null(), v.string()),
    updated_at: v.optional(v.string()),
    userId: v.string(),
  }).index("byUserId", ["userId"]),
});

export const MessageType = ["text", "image"] as const;
export type MessageType = (typeof MessageType)[number];

export const MessageStatus = ["pending", "done", "error"] as const;
export type MessageStatus = (typeof MessageStatus)[number];
