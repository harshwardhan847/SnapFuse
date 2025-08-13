import { Tool } from "ai";
import z from "zod";
import { getPromptFromImage } from "../functions/getPromptFromImage";

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
    image: z
      .string()
      .describe(
        "Product image as URL or base64 that acts as the visual source reference for generation."
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
    userId: z
      .string()
      .describe(
        "Required. Unique identifier for the user performing this operation."
      ),
    inputStorageId: z
      .string()
      .describe(
        "Required. ID of the user's original uploaded product image, for asset management/auditing."
      ),
  }),

  // Main tool execution
  execute: async ({
    image,
    userPrompt,
    style,
    creativity,
    detailLevel,
    background,
    upscale,
    useMannequin,
    userId,
    inputStorageId,
  }) => {
    // Step 1: Generate the detailed image prompt from the input image & user intent
    const prompt = await getPromptFromImage({
      image,
      userPrompt,
      style,
      creativity,
      detailLevel,
      background,
      upscale,
      useMannequin,
    });

    // Step 2: Call the backend API to start image generation with that prompt
    const response = await fetch("/api/generate-image", {
      method: "POST",
      body: JSON.stringify({ imageUrl: image, prompt, userId, inputStorageId }),
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      const errorJson = await response.json().catch(() => ({}));
      throw new Error(
        `Image generation failed (${response.status}): ${errorJson?.error || response.statusText}`
      );
    }

    // The backend returns { status: "processing", requestId: ... } or error
    return await response.json();
  },
};
