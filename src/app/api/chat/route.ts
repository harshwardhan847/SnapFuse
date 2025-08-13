import { mainModel } from "@/ai/models";
import { Tools } from "@/ai/tools";
import { convertToModelMessages, streamText, UIMessage } from "ai";

const SYSTEM_PROMPT = `
You are an expert AI agent for e-commerce product content and media generation.
Your tasks include:
- Generating SEO product titles, descriptions, tags, meta info
- Creating photorealistic product images and model try-ons
- Producing promotional social media videos with voice-over and text animation
Use provided tools to perform each step. Always optimize for clarity, conversion, and SEO best practices. Support multilingual output.
Ask for additional details if needed.
`;
// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: mainModel,
    system: SYSTEM_PROMPT,
    messages: convertToModelMessages(messages),
    tools: Tools,
  });

  return result.toUIMessageStreamResponse();
}
