import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { internal } from "./_generated/api";

export const createImageJobRecord = mutation({
  args: {
    request_id: v.string(),
    prompt: v.string(),
    image_url: v.union(v.string(), v.null()),
    input_storage_id: v.union(v.id("_storage"), v.null()),
    userId: v.string(),
  },
  handler: async (
    ctx,
    { request_id, prompt, image_url = null, input_storage_id = null, userId }
  ) => {
    // Check if user has sufficient credits (1 credit for image generation)
    const user = await ctx.db
      .query("users")
      .withIndex("byExternalId", (q) => q.eq("externalId", userId))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    const currentCredits = user.credits || 0;
    if (currentCredits < 1) {
      throw new Error("Insufficient credits for image generation");
    }

    // Deduct credits first
    await ctx.scheduler.runAfter(0, internal.payments.deductCreditsInternal, {
      userId,
      amount: 1,
      reason: "image_generation",
      relatedId: request_id,
    });

    const now = new Date();
    await ctx.db.insert("images", {
      request_id,
      userId,
      prompt,
      image_url,
      input_storage_id,
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

// Paginated query for images
export const getImagesByUserIdPaginated = query({
  args: {
    userId: v.string(),
    paginationOpts: v.object({
      numItems: v.number(),
      cursor: v.union(v.string(), v.null()),
    }),
  },
  handler: async (ctx, { userId, paginationOpts }) => {
    const results = await ctx.db
      .query("images")
      .withIndex("byUserId", (q) => q.eq("userId", userId))
      .order("desc")
      .paginate(paginationOpts);

    return {
      page: results.page,
      isDone: results.isDone,
      continueCursor: results.continueCursor,
    };
  },
});

// Get total count of images for a user
export const getImagesCountByUserId = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, { userId }) => {
    const images = await ctx.db
      .query("images")
      .withIndex("byUserId", (q) => q.eq("userId", userId))
      .collect();

    return images.length;
  },
});

// Simple offset-based pagination as backup
export const getImagesByUserIdOffset = query({
  args: {
    userId: v.string(),
    offset: v.number(),
    limit: v.number(),
  },
  handler: async (ctx, { userId, offset, limit }) => {
    const allImages = await ctx.db
      .query("images")
      .withIndex("byUserId", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();

    const paginatedImages = allImages.slice(offset, offset + limit);
    const hasMore = offset + limit < allImages.length;

    return {
      images: paginatedImages,
      hasMore,
      total: allImages.length,
    };
  },
});
