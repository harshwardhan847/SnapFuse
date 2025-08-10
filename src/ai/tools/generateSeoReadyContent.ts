import { Tool } from "ai";
import { seoContentSchema } from "../schema";
import { getAiSeoReadyContent } from "../functions/getAiSeoReadyContent";
import z from "zod";

export const generateSeoReadyContent: Tool = {
  description:
    "generate content for e-commerce listing with very good SEO to rank higher in search",
  outputSchema: seoContentSchema,
  inputSchema: z.object({
    name: z.string().describe("Product name or title"),
    description: z
      .string()
      .describe(
        "detailed description about product. Product attributes (e.g. size, material, color)"
      ),
  }),
  execute: async ({ name, description }) => {
    const result = await getAiSeoReadyContent({ name, description });
    console.log(result.object);
    return result.object;
  },
};
