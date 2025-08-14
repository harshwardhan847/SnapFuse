import { streamText, convertToModelMessages, stepCountIs } from "ai";
import { mainModel } from "@/ai/models";
import { Tools } from "@/ai/tools";
import { UIMessage } from "ai";

const SYSTEM_PROMPT = `You are an AI assistant that helps users with SEO content generation and product image generation.

You have access to these tools:
- generateSeoReadyContentTool
- generateProductImageTool
- generatePromptFromImageTool
- generateImageFromProvidedImageTool (composite tool that first generates a detailed prompt from the source image, then immediately creates final product image(s) without asking for confirmation)

Rules:
- When the user asks to generate an image from a provided image, prefer generateImageFromProvidedImageTool.
- Do not ask for confirmation between steps. Produce the final image(s) in one go.
- Always include userId when using image tools and use the provided storageId as the source.
- Don't send sensitive id's like userId, StorageId and request ID in the response, it should be simple and easy to understand for the user no complex tech.
`;

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
    stopWhen: stepCountIs(3),
  }).toUIMessageStreamResponse();
}
