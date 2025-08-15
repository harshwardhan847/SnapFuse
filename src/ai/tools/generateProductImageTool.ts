import { Tool } from "ai";
import z from "zod";

/**
 * Tool for generating a high-quality, realistic, ad-ready ecommerce product image.
 * Accepts a product source image, an AI-generated prompt (from the generatePromptFromImage tool),
 * and user/session metadata. Results are produced via the /api/generate-image backend workflow.
 */
export const generateProductImageTool: Tool = {
  description:
    "Generate a high-quality, realistic, ad-worthy ecommerce catalogue or product listing image from a standard product image and an AI-generated prompt (create this with the generatePromptFromImage tool). The generated image will use realistic lighting, creative commercial backgrounds, and will always accurately preserve product color, material, branding, and features.",

  inputSchema: z.object({
    inputStorageId: z
      .string()
      .describe(
        "Required. The storage ID of the product image to use as the source reference for upscaling/enhancement. This is the product image to transform into a catalogue-ready output."
      ),
    prompt: z
      .string()
      .describe(
        "The detailed, AI-generated image prompt. This should be created by the generatePromptFromImage tool for best results—include all product context and scene guidance here."
      ),
    userId: z
      .string()
      .describe(
        "Required. The unique identifier of the user creating this image. Used for tracking and auditing."
      ),
    // Future expansion hooks:
    // style, background, creativity, outputFormat, etc could be added if you extend the /api/generate-image endpoint
  }),

  /**
   * Execute the product image generation workflow using the provided image and AI-crafted prompt.
   * If the backend/API fails, returns a consistent error object.
   */
  execute: async ({ inputStorageId, prompt, userId }) => {
    try {
      const baseUrl =
        process.env.APP_BASE_URL ||
        process.env.APP_BASE_URL ||
        "http://localhost:3000";
      const response = await fetch(`${baseUrl}/api/generate-image`, {
        method: "POST",
        body: JSON.stringify({
          inputStorageId,
          prompt,
          userId,
        }),
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) {
        const tryJson = await response.json().catch(() => ({}));
        throw new Error(
          `Backend error (${response.status}): ${tryJson?.error || response.statusText}`
        );
      }
      return await response.json();
    } catch (error) {
      // Always return an error object with useful details
      return {
        status: "failed",
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },
};
