// convex/messages.ts
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Mutation to add a new message
export const addMessage = mutation({
  args: {
    chatSessionId: v.string(),
    message: v.object({
      id: v.string(),
      role: v.string(),
      content: v.string(),
      type: v.union(v.literal("text"), v.literal("image")),
      status: v.optional(
        v.union(v.literal("pending"), v.literal("done"), v.literal("error"))
      ), // "pending" | "done" | "error" (new)
      imageUrl: v.optional(v.string()), // When status is "done"
      createdAt: v.optional(v.number()),
    }),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("messages", {
      ...args,
    });
  },
});

// Query to retrieve messages by session
export const getMessages = query({
  args: { sessionId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("messages")
      .withIndex("byChatSessionId", (q) =>
        q.eq("chatSessionId", args.sessionId)
      )
      .collect();
  },
});
