import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createImageJobRecord = mutation({
  args: {
    request_id: v.string(),
    prompt: v.string(),
    image_url: v.union(v.string(), v.null()),
    userId: v.string(),
  },
  handler: async (ctx, { request_id, prompt, image_url = null, userId }) => {
    const now = new Date();
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

// Generate a signed upload URL for Convex Storage
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    const uploadUrl = await ctx.storage.generateUploadUrl();
    return uploadUrl;
  },
});

// Return a signed, time-limited public URL for a stored file
export const getStorageUrl = query({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, { storageId }) => {
    const url = await ctx.storage.getUrl(storageId);
    return url;
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
      .order("desc")
      .collect();
  },
});
