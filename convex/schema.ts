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
});
