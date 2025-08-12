import { generateText, ModelMessage } from "ai";
import { imageAnalysisModel } from "../models";

interface GetPromptFromImageOptions {
  image: string;
  userPrompt?: string;
  style?: string;
  creativity?: "high" | "medium" | "low";
  detailLevel?: "ultra" | "high" | "medium";
  background?: string;
  upscale?: boolean;
}

export const getPromptFromImage = async ({
  image,
  userPrompt = "",
  style,
  creativity,
  detailLevel,
  background,
  upscale,
}: GetPromptFromImageOptions) => {
  // Negative prompt: discourage artifacts, overlaps, broken, deformed or cut-off elements
  const negativePrompt =
    "Do NOT include broken, deformed, floating, overlapping or partially cut-off objects or hands, no distracting backgrounds, no watermark, no text, no artifacts or out-of-place elements. Focus only on a realistic, cohesive, professional product scene.";

  // Main instruction set with sensible defaults for realism, product shine, and adaptive context
  const systemInstructions = [
    "Analyze the input image and identify the product and context.",
    "Based on the image, generate a highly detailed, ultra-realistic, high-resolution prompt suitable for AI image generation that will make the product stand out professionally.",
    userPrompt,
    style
      ? `Apply visual style: ${style}.`
      : "If style is not specified, auto-select the most visually appealing and modern commercial/ad style for this product image.",
    background
      ? `Use background: ${background}.`
      : "If no background specified, pick the best possible photographic/commercial environment for this product.",
    detailLevel === "ultra"
      ? "Emphasize ultra-fine detail, material texture, photorealistic lighting, and natural composition."
      : detailLevel === "high"
        ? "Emphasize realistic details, crisp product textures, and balanced lighting."
        : "",
    creativity === "high"
      ? "Add creative but plausible visual flair—unique compositions, advanced lighting, but keep product dominant."
      : creativity === "medium"
        ? "Balance believable context with eye-catching details."
        : creativity === "low"
          ? "Make it closely match the original image, minimal deviation."
          : "Make the result look as if shot for a premium e-commerce product listing, with optimal camera settings, angle, and scene.",
    upscale ? "Request maximum sharpness and resolution." : "",
    "Always make the product and its key features stand out in a natural, appealing way.",
    `Negative prompt: ${negativePrompt}`,
    "Output ONLY the image generator prompt. Don't describe the product separately, don't include 'prompt:' or commentary.",
  ]
    .filter(Boolean)
    .join(" ");

  const messages: ModelMessage[] = [
    {
      role: "user",
      content: [
        { type: "text", text: systemInstructions.trim() },
        { type: "image", image },
      ],
    },
  ];

  const { text } = await generateText({
    model: imageAnalysisModel,
    messages,
  });

  return text;
};
