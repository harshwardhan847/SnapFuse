import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { internal } from "./_generated/api";

export const createVideoJobRecord = mutation({
  args: {
    request_id: v.string(),
    prompt: v.string(),
    input_storage_id: v.union(v.id("_storage"), v.null()),
    userId: v.string(),
    duration: v.optional(v.string()),
    negative_prompt: v.optional(v.string()),
    cfg_scale: v.optional(v.number()),
  },
  handler: async (
    ctx,
    {
      request_id,
      prompt,
      input_storage_id = null,
      userId,
      duration,
      negative_prompt,
      cfg_scale,
    }
  ) => {
    // Check if user has sufficient credits (5 credits for video generation)
    const user = await ctx.db
      .query("users")
      .withIndex("byExternalId", (q) => q.eq("externalId", userId))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    const currentCredits = user.credits || 0;
    if (currentCredits < 5) {
      throw new Error("Insufficient credits for video generation");
    }

    // Deduct credits first
    await ctx.scheduler.runAfter(0, internal.payments.deductCreditsInternal, {
      userId,
      amount: 5,
      reason: "video_generation",
      relatedId: request_id,
    });

    const now = new Date();
    await ctx.db.insert("videos", {
      request_id,
      userId,
      prompt,
      video_url: null,
      input_storage_id,
      duration,
      negative_prompt,
      cfg_scale,
      status: "processing",
      error_message: null,
      updated_at: now.toDateString(),
    });
  },
});

export const updateVideoJobStatus = mutation({
  args: {
    request_id: v.string(),
    status: v.union(
      v.literal("pending"),
      v.literal("processing"),
      v.literal("done"),
      v.literal("error")
    ),
    video_url: v.union(v.string(), v.null()),
    error_message: v.union(v.string(), v.null()),
  },
  handler: async (
    ctx,
    { request_id, status, video_url = null, error_message = null }
  ) => {
    const now = new Date();
    const job = await ctx.db
      .query("videos")
      .filter((q) => q.eq(q.field("request_id"), request_id))
      .first();

    if (job) {
      await ctx.db.patch(job._id, {
        status,
        video_url,
        error_message,
        updated_at: now.toDateString(),
      });
    }
  },
});

export const getVideoJobByRequestId = query({
  args: { request_id: v.string() },
  handler: (ctx, { request_id }) => {
    return ctx.db
      .query("videos")
      .filter((q) => q.eq(q.field("request_id"), request_id))
      .first();
  },
});

export const getAllVideosByUserId = query({
  args: {
    userId: v.string(),
  },
  handler: (ctx, { userId }) => {
    return ctx.db
      .query("videos")
      .withIndex("byUserId", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
  },
});

// Paginated query for videos
export const getVideosByUserIdPaginated = query({
  args: {
    userId: v.string(),
    paginationOpts: v.object({
      numItems: v.number(),
      cursor: v.union(v.string(), v.null()),
    }),
  },
  handler: async (ctx, { userId, paginationOpts }) => {
    const results = await ctx.db
      .query("videos")
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

// Get total count of videos for a user
export const getVideosCountByUserId = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, { userId }) => {
    const videos = await ctx.db
      .query("videos")
      .withIndex("byUserId", (q) => q.eq("userId", userId))
      .collect();

    return videos.length;
  },
});

// Simple offset-based pagination as backup
export const getVideosByUserIdOffset = query({
  args: {
    userId: v.string(),
    offset: v.number(),
    limit: v.number(),
  },
  handler: async (ctx, { userId, offset, limit }) => {
    const allVideos = await ctx.db
      .query("videos")
      .withIndex("byUserId", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();

    const paginatedVideos = allVideos.slice(offset, offset + limit);
    const hasMore = offset + limit < allVideos.length;

    console.log("Video offset results:", {
      totalVideos: allVideos.length,
      paginatedLength: paginatedVideos.length,
      hasMore,
    });

    return {
      videos: paginatedVideos,
      hasMore,
      total: allVideos.length,
    };
  },
});

// Generate a signed upload URL for Convex Storage (kept for symmetry with images)
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
