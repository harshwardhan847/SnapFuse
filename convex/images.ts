import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createImageJobRecord = mutation({
  args: {
    request_id: v.string(),
    prompt: v.string(),
    image_url: v.union(v.string(), v.null()),
  },
  handler: async (ctx, { request_id, prompt, image_url = null }) => {
    const now = new Date();
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const userId = identity.subject; // This is the Clerk user ID
    await ctx.db.insert("images", {
      request_id,
      userId,
      prompt,
      image_url,
      status: "processing",
      error_message: null,
      updated_at: now.toDateString(),
    });
  },
});

export const updateImageJobStatus = mutation({
  args: {
    request_id: v.string(),
    status: v.union(
      v.literal("pending"),
      v.literal("processing"),
      v.literal("done"),
      v.literal("error")
    ),
    image_url: v.union(v.string(), v.null()),
    error_message: v.union(v.string(), v.null()),
  },
  handler: async (
    ctx,
    { request_id, status, image_url = null, error_message = null }
  ) => {
    const now = new Date();
    const job = await ctx.db
      .query("images")
      .filter((q) => q.eq(q.field("request_id"), request_id))
      .first();

    if (job) {
      await ctx.db.patch(job._id, {
        status,
        image_url,
        error_message,
        updated_at: now.toDateString(),
      });
    }
  },
});

export const getImageJobByRequestId = query({
  args: { request_id: v.string() },
  handler: (ctx, { request_id }) => {
    return ctx.db
      .query("images")
      .filter((q) => q.eq(q.field("request_id"), request_id))
      .first();
  },
});

export const getAllImagesByUserId = query({
  args: {
    userId: v.string(),
  },
  handler: (ctx, { userId }) => {
    return ctx.db
      .query("images")
      .withIndex("byUserId", (q) => q.eq("userId", userId))
      .collect();
  },
});
