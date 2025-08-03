import { seoContentSchema } from "@/ai/schema";
import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import z from "zod";

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const reqJson = await req.json();
    console.log(reqJson);
    const parseResult = seoFormSchema.safeParse(reqJson);

    if (!parseResult.success) {
      console.error(parseResult.error);
      return new Response("Invalid request body", { status: 400 });
    }

    const { name, description } = parseResult.data;

    const result = await generateObject({
      model: google("gemini-2.5-flash"),
      prompt: `
You are an expert e-commerce SEO copywriter.

Given the following product details:
- Product Name: "${name}"
- Product Description: "${description}"

Your task is to:
1. Generate an SEO-optimized product title.
2. Write an engaging, keyword-rich product description for SEO and conversions.
3. Provide 5–10 high-impact SEO tags relevant to the product.
4. Score the original title and description for SEO (0 to 100).
5. Score your improved SEO content (must be > 80).

Output should be concise, effective, and conversion-optimized.
`,
      schema: seoContentSchema,
    });

    console.log(result);

    return Response.json(result.object);
  } catch (err) {
    console.error(err);
    return Response.error();
  }
}

export const seoFormSchema = z.object({
  name: z.string().min(2, {
    error: "Name of product must be at least 2 characters.",
  }),
  description: z
    .string()
    .min(100, {
      error: "Description must be at least 100 characters",
    })
    .max(3000, { error: "You can't add more than 3000 characters" }),
});
