import { Tool } from "ai";
import z from "zod";

/**
 * Tool for generating videos from images using the fal.ai Kling video API.
 * Accepts a source image, an AI-generated prompt, and video generation parameters.
 * Results are produced via the /api/generate-video backend workflow.
 */
export const generateVideoFromImageTool: Tool = {
  description:
    "Generate a video clip from an image using AI. The video will animate the image based on the provided prompt, creating dynamic motion and effects while preserving the original image's key elements.",

  inputSchema: z.object({
    inputStorageId: z
      .string()
      .describe(
        "Required. The storage ID of the source image to animate into a video."
      ),
    prompt: z
      .string()
      .describe(
        "Required. The detailed prompt describing the desired video animation and motion. This should be created by the generatePromptFromImageForVideo tool for best results."
      ),
    userId: z
      .string()
      .describe(
        "Required. The unique identifier of the user creating this video. Used for tracking and auditing."
      ),
    duration: z
      .enum(["5", "10"])
      .optional()
      .describe(
        "Optional. The duration of the generated video in seconds. Default: '5'"
      ),
    negative_prompt: z
      .string()
      .optional()
      .describe(
        "Optional. Negative prompt to avoid unwanted elements. Default: 'blur, distort, and low quality'"
      ),
    cfg_scale: z
      .number()
      .min(0)
      .max(1)
      .optional()
      .describe(
        "Optional. CFG scale (0-1) controlling how closely the model follows the prompt. Default: 0.5"
      ),
  }),

  /**
   * Execute the video generation workflow using the provided image and AI-crafted prompt.
   * If the backend/API fails, returns a consistent error object.
   */
  execute: async ({
    inputStorageId,
    prompt,
    userId,
    duration = "5",
    negative_prompt = "blur, distort, and low quality",
    cfg_scale = 0.5,
  }) => {
    try {
      const baseUrl =
        process.env.APP_BASE_URL ||
        process.env.APP_BASE_URL ||
        "http://localhost:3000";
      const response = await fetch(`${baseUrl}/api/generate-video`, {
        method: "POST",
        body: JSON.stringify({
          inputStorageId,
          prompt,
          userId,
          duration,
          negative_prompt,
          cfg_scale,
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
