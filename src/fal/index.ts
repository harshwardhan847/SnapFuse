import { fal } from "@fal-ai/client";

export const falConfig = fal.config({
  credentials: process.env.FAL_KEY,
});
