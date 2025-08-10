import { generateObject } from "ai";
import { mainModel } from "../models";
import { seoContentSchema } from "../schema";
import z from "zod";

export const getAiSeoReadyContent = async ({
  description,
  name,
}: {
  name: string;
  description: string;
}) => {
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
  return await generateObject({
    model: mainModel,
    prompt,
    schema: seoContentSchema,
  });
};
