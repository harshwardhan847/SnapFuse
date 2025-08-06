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
  }).index("byExternalId", ["externalId"]),

  chats: defineTable({
    title: v.string(),
    userId: v.string(),
  }).index("byUserId", ["userId"]),

  messages: defineTable({
    chatSessionId: v.string(),
    message: v.object({
      id: v.string(),
      role: v.string(),
      content: v.string(),
      type: v.union(v.literal("text"), v.literal("image")), // "text" | "image" (new)
      status: v.optional(
        v.union(v.literal("pending"), v.literal("done"), v.literal("error"))
      ), // "pending" | "done" | "error" (new)
      imageUrl: v.optional(v.string()), // When status is "done"
      createdAt: v.optional(v.number()),
    }),
  }).index("byChatSessionId", ["chatSessionId"]),
});

export const MessageType = ["text", "image"] as const;
export type MessageType = (typeof MessageType)[number];

export const MessageStatus = ["pending", "done", "error"] as const;
export type MessageStatus = (typeof MessageStatus)[number];
