import { streamText, convertToModelMessages } from "ai";
import { mainModel } from "@/ai/models";
import { Tools } from "@/ai/tools";
import { UIMessage } from "ai";

const SYSTEM_PROMPT = `You are an AI assistant that helps users with various tasks including SEO content generation and image generation.

You have access to the following tools:
1. generateSeoReadyContentTool - Generate SEO-optimized content for websites
2. generateProductImageTool - Generate high-quality product images from existing images and prompts
3. generatePromptFromImageTool - Generate detailed prompts from product images for better image generation

When using image generation tools, you must include the userId parameter and use the storageId of available images.

Available tools: generateSeoReadyContentTool, generateProductImageTool, generatePromptFromImageTool`;

export async function POST(req: Request) {
  const { messages, userId }: { messages: UIMessage[]; userId?: string } =
    await req.json();

  const recentImages = messages.slice(-5).flatMap((msg) => {
    if (!msg.parts) return [];
    return msg.parts
      .filter((part: any) => part.type === "image")
      .map((part: any) => ({
        storageId: part.storage_id,
      }))
      .filter((img: any) => img.storageId);
  });

  let enhancedSystemPrompt = SYSTEM_PROMPT;
  if (recentImages.length > 0) {
    enhancedSystemPrompt += `\n\nAvailable images in conversation:`;
    recentImages.forEach((img: any, index: number) => {
      enhancedSystemPrompt += `\n- Image ${index + 1}: Storage ID: ${img.storageId}`;
    });
  }

  if (userId) {
    enhancedSystemPrompt += `\n\nCurrent user ID: ${userId}`;
  }

  return streamText({
    model: mainModel,
    system: enhancedSystemPrompt,
    messages: convertToModelMessages(messages),
    tools: Tools,
  }).toUIMessageStreamResponse();
}
