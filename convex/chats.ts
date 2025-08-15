import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { query, mutation } from "./_generated/server";

/**
 * Create a new chat with title and userId
 */
export const createChat = mutation(
  async ({ db }, { title, userId }: { title: string; userId: string }) => {
    return await db.insert("chats", { title, userId });
  }
);

/**
 * Get all chats in the database
 */
export const getAllChats = query(async ({ db }) => {
  return await db.query("chats").collect();
});

/**
 * Get all chats for a specific user by userId
 */
export const getChatsByUser = query(
  async ({ db }, { userId }: { userId: string }) => {
    return await db
      .query("chats")
      .withIndex("byUserId", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
  }
);

/**
 * Get a chat by its unique chatId
 */
export const getChatById = query(
  async ({ db }, { chatId }: { chatId: Id<"chats"> }) => {
    return await db.get(chatId);
  }
);

/**
 * Update the title of a chat by chatId
 */
export const updateChat = mutation(
  async ({ db }, { chatId, title }: { chatId: Id<"chats">; title: string }) => {
    return await db.patch(chatId, { title });
  }
);

/**
 * Delete a chat by chatId
 */
export const deleteChat = mutation(
  async ({ db }, { chatId }: { chatId: Id<"chats"> }) => {
    return await db.delete(chatId);
  }
);

/**
 * Get chats for a user with proper cursor-based pagination
 */
export const getChatsByUserPaginated = query({
  args: {
    userId: v.string(),
    paginationOpts: v.object({
      numItems: v.number(),
      cursor: v.union(v.string(), v.null()),
      id: v.number(),
    }),
  },
  handler: async (ctx, { userId, paginationOpts }) => {
    // Extract only the valid pagination options to avoid extra fields
    const validPaginationOpts = {
      numItems: paginationOpts.numItems,
      cursor: paginationOpts.cursor,
    };

    return await ctx.db
      .query("chats")
      .withIndex("byUserId", (q) => q.eq("userId", userId))
      .order("desc")
      .paginate(validPaginationOpts);
  },
});
