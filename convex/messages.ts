// convex/messages.ts
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Mutation to add a new message
export const addMessage = mutation({
  args: {
    chatSessionId: v.string(),
    message: v.object({
      id: v.string(),
      role: v.union(v.literal("assistant"), v.literal("user")),
      parts: v.optional(v.any()),
      text: v.optional(v.string()),
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

// Paginated query to retrieve messages by session (newest first for pagination, but we'll handle ordering in the UI)
export const getMessagesPaginated = query({
  args: {
    sessionId: v.string(),
    paginationOpts: v.object({
      numItems: v.number(),
      cursor: v.union(v.string(), v.null()),
      id: v.number(),
      endCursor: v.optional(v.string()),
    }),
  },
  handler: async (ctx, { sessionId, paginationOpts }) => {
    // Extract only the valid pagination options to avoid extra fields
    const validPaginationOpts = {
      numItems: paginationOpts.numItems,
      cursor: paginationOpts.cursor,
    };

    console.log(
      "Paginating messages for session:",
      sessionId,
      "with opts:",
      validPaginationOpts
    );

    // Get messages in descending order (newest first) for pagination
    const results = await ctx.db
      .query("messages")
      .withIndex("byChatSessionId", (q) => q.eq("chatSessionId", sessionId))
      .order("desc")
      .paginate(validPaginationOpts);

    console.log("Pagination results:", {
      pageLength: results.page.length,
      isDone: results.isDone,
      continueCursor: results.continueCursor,
    });

    // Return results as-is (newest first), we'll handle ordering in the UI
    return results;
  },
});

// Query to get the latest N messages (for initial load)
export const getLatestMessages = query({
  args: {
    sessionId: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { sessionId, limit = 30 }) => {
    const messages = await ctx.db
      .query("messages")
      .withIndex("byChatSessionId", (q) => q.eq("chatSessionId", sessionId))
      .order("desc")
      .take(limit);

    // Return in chronological order (oldest first)
    return messages;
  },
});
