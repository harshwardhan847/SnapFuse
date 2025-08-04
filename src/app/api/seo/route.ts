import { mainModel } from "@/ai/models";
import { seoContentSchema } from "@/ai/schema";
import { generateObject } from "ai";
import z from "zod";

export const maxDuration = 30;

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

export async function POST(req: Request) {
  try {
    const reqJson = await req.json();
    console.log("Incoming Request JSON:", reqJson);
    const parseResult = seoFormSchema.safeParse(reqJson);

    if (!parseResult.success) {
      console.error("Validation Error:", parseResult.error);
      return new Response(JSON.stringify({ error: parseResult.error }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { name, description } = parseResult.data;

    const prompt = `
    You are an elite e-commerce SEO strategist and persuasive product copywriter.
    
    Given these product details:
    - Product Name: "${name}"
    - Product Description: "${description}"
    
    Your tasks:
    1. Craft an SEO-optimized, highly clickable product title (max 70 characters).
    2. Write a detailed, engaging, and easy-to-understand product description (200–300 words) in Markdown format:
        - Ensure the description is keyword-rich for SEO.
        - The writing must be easy to understand for all customers.
        - Make the copy persuasive, motivating users to buy.
        - Incorporate 4–8 simple, benefit-focused bullet points using Markdown syntax.
    3. Suggest 7–12 high-impact SEO tags and keywords relevant to the product.
    4. Score the provided title and description for SEO best practices (0–100) and explain your reasoning.
    5. Score your improved title and description for SEO quality (must be >80) and explain your reasoning.
    
    Format your output as a clear JSON object matching this schema:
    {
      "seoTitle": "",
      "seoDescription": "",
      "seoTags": [],
      "originalScores": {
        "titleScore": 0,
        "descriptionScore": 0,
        "justification": ""
      },
      "improvedScores": {
        "titleScore": 0,
        "descriptionScore": 0,
        "justification": ""
      }
    }
    `;

    const result = await generateObject({
      model: mainModel,
      prompt,
      schema: seoContentSchema,
    });

    console.log("LLM Output:", result);

    return Response.json(result.object);
  } catch (err) {
    console.error("Server Error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
