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
  useMannequin?: boolean; // optional explicit flag
}

export const getPromptFromImage = async ({
  image,
  userPrompt = "",
  style,
  creativity,
  detailLevel,
  background,
  upscale,
  useMannequin,
}: GetPromptFromImageOptions) => {
  // Negative prompt: discourage artifacts, overlap, broken, etc.
  const negativePrompt = [
    "Do NOT include broken, deformed, floating, overlapping, cut-off objects, hands, or faces.",
    "No watermark, no text, no artifacts, no irrelevant or distracting elements.",
    // Avoid mannequins unless specifically requested
    useMannequin
      ? ""
      : "Do NOT use mannequins, artificial hands or fake body parts. Prefer real human models or natural human interaction.",
    "No cartoonish styles unless requested. Product colors, materials, branding, and textures must exactly match the input image.",
    "No color or finish changes to the product. Do not remove or alter product logos.",
  ]
    .filter(Boolean)
    .join(" ");

  // Instruct model on human model/close-up preferences
  const modelHumanInstruction = useMannequin
    ? "If a mannequin is appropriate, use one for product display."
    : "Show a realistic, natural human hand or model holding, using, or showcasing the product where possible. Avoid mannequins, unless explicitly specified. Only use close-ups when it best presents the product.";

  // Assemble main instructions
  const systemInstructions = [
    "Analyze the input image, especially the product's color, branding, material, and context.",
    "Generate a detailed, ultra-realistic, high-quality prompt for AI image generation.",
    "Always keep product color, materials, texture, and branding perfectly true to the image.",
    modelHumanInstruction,
    "Compose the scene as a creative, modern advertisement, suitable for a leading e-commerce or lifestyle visual.",
    style
      ? `Apply visual style: ${style}.`
      : "If no style, use a trendy, appealing commercial style, with balanced lighting and composition.",
    background
      ? `Use background: ${background}.`
      : "If background not specified, use a tasteful, creative, visually engaging and brand-appropriate commercial or lifestyle setting for the product.",
    detailLevel === "ultra"
      ? "Emphasize ultra-fine detail, realistic lighting, and natural composition."
      : detailLevel === "high"
        ? "Include rich product detail, commercial lighting, and crisp rendering."
        : "",
    creativity === "high"
      ? "Add creative advertising details (dynamic backgrounds or hands, appealing settings), but ensure product realism."
      : creativity === "medium"
        ? "Balance realism and visual interest, as in modern brand content."
        : creativity === "low"
          ? "Keep scene and context as close to the input image as possible."
          : "",
    upscale ? "Request the highest possible image resolution and clarity." : "",
    "Make the product and its features stand out naturally and appealingly.",
    `Negative prompt: ${negativePrompt}`,
    "Output ONLY the image generator prompt — no explanations, no commentary.",
    userPrompt,
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
