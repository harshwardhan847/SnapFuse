import { google } from "@ai-sdk/google";

export const mainModel = google("gemini-2.5-flash");
export const imageAnalysisModel = google("gemini-2.5-flash");

export const videoGenModel = "fal-ai/kling-video/v2.1/standard/image-to-video"; // previously :- "fal-ai/kling-video/v1.6/standard/image-to-video"
export const imageGenModel = "fal-ai/flux-kontext/dev";
