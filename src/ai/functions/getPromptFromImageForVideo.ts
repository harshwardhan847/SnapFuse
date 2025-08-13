import { generateText, ModelMessage } from "ai";
import { imageAnalysisModel } from "../models";

interface GetPromptFromImageForVideoOptions {
  image: string;
  userPrompt?: string;
  motionStyle?: "subtle" | "dynamic" | "cinematic" | "smooth";
  cameraMovement?: "none" | "pan" | "zoom" | "tilt" | "dolly";
  animationType?: "natural" | "artistic" | "commercial" | "lifestyle";
  duration?: "5" | "10";
}

export const getPromptFromImageForVideo = async ({
  image,
  userPrompt = "",
  motionStyle,
  cameraMovement,
  animationType,
  duration,
}: GetPromptFromImageForVideoOptions) => {
  // Negative prompt for video generation
  const negativePrompt = [
    "Do NOT include jarring movements, sudden cuts, or disorienting camera work.",
    "No glitch effects, no broken or distorted elements, no unrealistic physics.",
    "Avoid rapid motion that could cause motion sickness or visual discomfort.",
    "No text overlays, watermarks, or UI elements unless part of the original image.",
    "Maintain consistent lighting and color grading throughout the video.",
    "No artificial or robotic movements - keep motion natural and fluid.",
  ].join(" ");

  // Motion style instructions
  const motionInstructions = motionStyle
    ? motionStyle === "subtle"
      ? "Apply very gentle, barely noticeable motion that enhances the scene without being distracting."
      : motionStyle === "dynamic"
        ? "Create energetic, engaging motion that brings life to the scene."
        : motionStyle === "cinematic"
          ? "Apply professional cinematic camera movements and motion techniques."
          : "Use smooth, flowing motion that feels natural and pleasant to watch."
    : "Apply natural, smooth motion that enhances the scene without being distracting.";

  // Camera movement instructions
  const cameraInstructions = cameraMovement
    ? cameraMovement === "none"
      ? "Keep the camera static with no movement."
      : cameraMovement === "pan"
        ? "Apply a gentle horizontal panning motion across the scene."
        : cameraMovement === "zoom"
          ? "Apply a subtle zoom in or out effect to create depth."
          : cameraMovement === "tilt"
            ? "Apply a gentle vertical tilting motion."
            : "Apply a smooth dolly movement (forward/backward camera motion)."
    : "Apply subtle camera movement that enhances the scene naturally.";

  // Animation type instructions
  const animationInstructions = animationType
    ? animationType === "natural"
      ? "Create natural, realistic motion that could occur in real life."
      : animationType === "artistic"
        ? "Apply artistic, creative motion that enhances the visual appeal."
        : animationType === "commercial"
          ? "Use commercial-grade motion suitable for advertising and marketing."
          : "Apply lifestyle-oriented motion that feels warm and relatable."
    : "Create natural, appealing motion that enhances the scene.";

  // Duration considerations
  const durationInstructions = duration
    ? duration === "5"
      ? "Optimize for a 5-second video with concise, impactful motion."
      : "Optimize for a 10-second video with more elaborate motion sequences."
    : "Optimize for standard video duration with balanced motion.";

  // Assemble main instructions
  const systemInstructions = [
    "Analyze the input image and generate a detailed video prompt for AI video generation.",
    "Focus on describing dynamic motion, camera movements, and animation effects that will bring the image to life.",
    "Preserve the original image's composition, colors, lighting, and key elements while adding motion.",
    motionInstructions,
    cameraInstructions,
    animationInstructions,
    durationInstructions,
    "Consider the visual flow and how motion will enhance the viewer's experience.",
    "Describe specific elements that should move or remain static.",
    "Include atmospheric effects like gentle wind, water movement, or ambient motion where appropriate.",
    `Negative prompt: ${negativePrompt}`,
    "Output ONLY the video generation prompt — no explanations, no commentary.",
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
