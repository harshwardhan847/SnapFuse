import z from "zod";

// Enhanced schema validation with better error handling
export const seoFormSchema = z.object({
  name: z.string().min(2, {
    error: "Product name must be at least 2 characters.",
  }),
  description: z
    .string()
    .min(100, {
      error: "Description must be at least 100 characters.",
    })
    .max(3000, {
      error: "Description cannot exceed 3,000 characters.",
    }),
});
