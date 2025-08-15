import { Tool } from "ai";
import z from "zod";
import { getPromptFromImageForVideo } from "../functions/getPromptFromImageForVideo";
import convex from "@/convex";
import { api } from "../../../convex/_generated/api";

/**
 * Generate a high-quality video prompt from an image for AI video generation.
 * This tool will analyze the image and create a detailed prompt optimized for video animation.
 */
export const generatePromptFromImageForVideoTool: Tool = {
  description:
    "Generate a high-quality video prompt from an image for AI video generation. The output describes dynamic motion, camera movements, and animation effects that will bring the image to life while preserving its key elements and composition.",

  inputSchema: z.object({
    inputStorageId: z
      .string()
      .describe(
        "Required. The storage ID of the image that will be animated into a video."
      ),
    userPrompt: z
      .string()
      .optional()
      .describe(
        "Optional. User instructions for the video animation, e.g. 'slow pan', 'zoom in', 'gentle movement', etc."
      ),
    motionStyle: z
      .enum(["subtle", "dynamic", "cinematic", "smooth"])
      .optional()
      .describe("Optional. The style of motion and animation for the video."),
    cameraMovement: z
      .enum(["none", "pan", "zoom", "tilt", "dolly"])
      .optional()
      .describe("Optional. Type of camera movement to apply to the scene."),
    animationType: z
      .enum(["natural", "artistic", "commercial", "lifestyle"])
      .optional()
      .describe("Optional. The type of animation style to apply."),
    duration: z
      .enum(["5", "10"])
      .optional()
      .describe(
        "Optional. Target video duration to consider in prompt generation."
      ),
  }),

  // Main tool execution
  execute: async ({
    inputStorageId,
    userPrompt,
    motionStyle,
    cameraMovement,
    animationType,
    duration,
  }) => {
    try {
      const baseUrl =
        process.env.APP_BASE_URL ||
        process.env.APP_BASE_URL ||
        "http://localhost:3000";

      // Get the image data URL from storage ID
      const url = await convex.query(api.videos.getStorageUrl, {
        storageId: inputStorageId as any,
      });

      if (!url) {
        throw new Error(`Failed to get image URL`);
      }

      // Generate the detailed video prompt from the input image & user intent
      const prompt = await getPromptFromImageForVideo({
        image: url,
        userPrompt,
        motionStyle,
        cameraMovement,
        animationType,
        duration,
      });

      return prompt;
    } catch (error) {
      console.error("Error in generatePromptFromImageForVideoTool:", error);
      throw new Error(
        `Failed to process image for video: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  },
};
