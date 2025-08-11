import { fal } from "@fal-ai/client";

const falConfig = () =>
  fal.config({
    credentials: process.env.FAL_KEY,
    proxyUrl: "/api/falai/proxy",
  });

export default falConfig;
