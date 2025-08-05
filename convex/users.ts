import { internalMutation, mutation } from "./_generated/server";
import { v } from "convex/values";

export const upsertFromClerk = mutation({
  args: { data: v.any() }, // Trust Clerk, skip runtime validation for shape
  handler: async (ctx, { data }) => {
    const userAttributes = {
      name: `${data.first_name ?? ""} ${data.last_name ?? ""}`.trim(),
      email: data.email_addresses?.[0]?.email_address ?? "",
      externalId: data.id,
      first_name: data.first_name ?? null,
      last_name: data.last_name ?? null,
      image_url: data.image_url ?? null,
      updated_at: new Date().toISOString(),
    };
    const user = await ctx.db
      .query("users")
      .withIndex("byExternalId", (q) => q.eq("externalId", data.id))
      .unique();
    if (user === null) {
      await ctx.db.insert("users", userAttributes);
    } else {
      await ctx.db.patch(user._id, userAttributes);
    }
  },
});

export const deleteFromClerk = mutation({
  args: { clerkUserId: v.string() },
  handler: async (ctx, { clerkUserId }) => {
    const user = await ctx.db
      .query("users")
      .withIndex("byExternalId", (q) => q.eq("externalId", clerkUserId))
      .unique();
    if (user !== null) {
      await ctx.db.delete(user._id);
    }
  },
});
