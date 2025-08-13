import { Tool } from "ai";
import z from "zod";
import { getPromptFromImage } from "../functions/getPromptFromImage";
import convex from "@/convex";
import { api } from "../../../convex/_generated/api";

/**
 * Generate a high-quality, realistic, ad-worthy ecommerce catalogue or product listing image from a product photo.
 * This tool will:
 *  1. Generate a robust, detailed prompt for image generation using the provided image and optional settings.
 *  2. Use that prompt to call the /api/generate-image backend for producing the new catalogue-ready image.
 *
 * It always preserves product color, materials, texture, and branding. The product is shown with a real human model/hand unless a mannequin is explicitly requested.
 */
export const generatePromptFromImageTool: Tool = {
  description:
    "Generate a high-quality, realistic, ad-worthy ecommerce catalogue or product listing image from a product image and details. The output uses realistic lighting, creative commercial backgrounds, and always accurately preserves product color, material, branding, and features. Human model/hand is preferred unless mannequin is explicitly requested.",

  inputSchema: z.object({
    inputStorageId: z
      .string()
      .describe(
        "Required. The storage ID of the product image that acts as the visual source reference for generation."
      ),
    userPrompt: z
      .string()
      .optional()
      .describe(
        "Optional. User instructions/desires, e.g. 'for a lifestyle ad', 'urban setting', 'minimal shadows', etc."
      ),
    style: z
      .string()
      .optional()
      .describe(
        "Optional. Target style (e.g. 'photo-realistic', 'lifestyle', '3d render', 'minimalist')."
      ),
    creativity: z
      .enum(["high", "medium", "low"])
      .optional()
      .describe(
        "Optional. How creative/advertising focused should the image be."
      ),
    detailLevel: z
      .enum(["ultra", "high", "medium"])
      .optional()
      .describe(
        "Optional. The required level of fine graphic detail and realism."
      ),
    background: z
      .string()
      .optional()
      .describe(
        "Optional. Desired background/scene for the product (e.g. 'studio', 'kitchen counter', 'nature outdoors')."
      ),
    upscale: z
      .boolean()
      .optional()
      .describe("Optional. Request maximum clarity and output resolution."),
    useMannequin: z
      .boolean()
      .optional()
      .describe(
        "Optional. If true, allows mannequins; otherwise, uses a real human model/hand where possible."
      ),
  }),

  // Main tool execution
  execute: async ({
    inputStorageId,
    userPrompt,
    style,
    creativity,
    detailLevel,
    background,
    upscale,
    useMannequin,
  }) => {
    try {
      const baseUrl =
        process.env.APP_BASE_URL ||
        process.env.NEXT_PUBLIC_APP_URL ||
        "http://localhost:3000";

      // Step 1: Get the image data URL from storage ID (absolute URL required on server)

      const url = await convex.query(api.images.getStorageUrl, {
        storageId: inputStorageId as any,
      });

      if (!url) {
        throw new Error(`Failed to get image URL`);
      }

      // Step 2: Generate the detailed image prompt from the input image & user intent
      const prompt = await getPromptFromImage({
        image: url,
        userPrompt,
        style,
        creativity,
        detailLevel,
        background,
        upscale,
        useMannequin,
      });

      return prompt;
    } catch (error) {
      console.error("Error in generatePromptFromImageTool:", error);
      throw new Error(
        `Failed to process image: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  },
};
