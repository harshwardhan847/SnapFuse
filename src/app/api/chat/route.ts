import {
  streamText,
  convertToModelMessages,
  stepCountIs,
  ModelMessage,
} from "ai";
import { mainModel } from "@/ai/models";
import { Tools } from "@/ai/tools"; // ensure each tool has a clear input schema { userId?: string; storageId?: string; ... }
import { UIMessage } from "ai";

const SYSTEM_PROMPT = `
You are an autonomous AI assistant for SEO content and product image generation.

Available tools:
- generateSeoReadyContentTool
- generatePromptFromImageTool
- generateProductImageTool
- generateVideoFromImageTool
- generatePromptFromImageForVideoTool

Critical rules:
- Don't say anything similar to this "I'm generating your image now, this may take a moment. I will notify you when it's complete."
- don't commit to notify on completion of image or video generation.
- If the user requests generating an image from a provided image, generate prompt from generatePromptFromImageTool and then pass the prompt to generateProductImageTool for generating image.
- Do not ask for confirmation between steps; produce final images or video in one go.
- Always include userId when calling any image tool or video tool.
- When using provided images, always include the provided storageId for the source.
- Do not reveal internal identifiers (userId, storageId, request IDs) in user-visible responses. These may be used as tool parameters, but must not appear in the message content.
- Keep responses simple, helpful, and non-technical from the user's perspective; avoid exposing tool orchestration details.
- If the user references "the image" without specifying which, use the most recent image attachment in this conversation.
- If the user asks to redo/iterate "with same image," reuse the most recent image unless a new one is provided.

Tool-calling guidance:
- For generateProductImageTool: pass { userId, storageId, ...user-requested options } in a single call. The tool should internally generate a descriptive prompt from the source image and return final images.
- For generateVideoFromImageTool: pass { userId, storageId, ...user-requested options } in a single call. The tool should internally generate a descriptive prompt from the source image and return final Video.
- For SEO content tasks, use generateSeoReadyContentTool with parameters derived from the user’s brief; avoid extraneous follow-ups unless truly necessary.

Privacy:
- Never include secret keys or internal IDs in assistant text.
- Do not echo back raw tool arguments.

Edge cases:
- If no image is available but the user asks to use an image, ask once for an image upload or a storageId. Otherwise proceed with content tasks.

Output style:
- Keep answers concise and user-friendly. Do not include implementation details, IDs, or tool names unless explicitly asked by a developer.
`;

type ImagePart = { type: "image"; storage_id?: string } & Record<
  string,
  unknown
>;

function extractRecentStorageIds(messages: UIMessage[], limit = 5): string[] {
  const ids: string[] = [];
  for (const msg of messages.slice(-limit)) {
    const parts = (msg as any)?.parts ?? [];
    for (const part of parts) {
      if (part?.type === "image" && (part as ImagePart).storage_id) {
        ids.push((part as ImagePart).storage_id as string);
      }
    }
  }
  // Keep unique, latest-first
  return Array.from(new Set(ids.reverse())).reverse();
}

/**
 * Optional: prevent leaking internal IDs by redacting them if ever echoed by the model.
 * This is a second line of defense beyond system prompt rules.
 */
function redactInternalIds(text: string, ids: string[]) {
  if (!ids.length) return text;
  let output = text;
  for (const id of ids) {
    if (!id) continue;
    const safe = "[redacted]";
    try {
      const pattern = new RegExp(
        id.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
        "g"
      );
      output = output.replace(pattern, safe);
    } catch {
      // no-op if invalid regex
    }
  }
  return output;
}

export async function POST(req: Request) {
  const { messages, userId }: { messages: UIMessage[]; userId?: string } =
    await req.json();

  // Normalize messages for convertToModelMessages
  const modelMessages: ModelMessage[] = convertToModelMessages(messages);

  // Gather most recent image storageIds
  const recentStorageIds = extractRecentStorageIds(messages, 8);
  const latestStorageId = recentStorageIds[recentStorageIds.length - 1];

  // Build dynamic system prompt context
  let enhancedSystemPrompt = SYSTEM_PROMPT;

  if (recentStorageIds.length > 0) {
    enhancedSystemPrompt += `
Conversation images available (internal use only):
${recentStorageIds.map((id, i) => `- Image ${i + 1}: storageId=${id}`).join("\n")}
Note: Do not expose these IDs to the user in responses.`;
  } else {
    enhancedSystemPrompt += `

No prior images detected in the last messages. If the user asks to use an image but none is available, request an image upload or a storageId.`;
  }

  if (userId) {
    enhancedSystemPrompt += `

Current user context (internal): userId=${userId}
Do not reveal this ID in responses.`;
  } else {
    enhancedSystemPrompt += `

Warning: userId missing. If calling image tools, request user to authenticate or supply userId context.`;
  }

  // Auto-wire tool preference: if the user asked to use their image and we have one, nudge the model to use composite tool.
  const hintForComposite = `
When generating from a provided image now, call generateImageFromProvidedImageTool exactly once with:
{ userId: "${userId}", storageId: "${latestStorageId}" }
Do not ask for confirmation; produce final images.`;

  enhancedSystemPrompt += hintForComposite;

  // Hard stop control for tool-chaining; increase if you allow deeper plans
  const maxSteps = 4;

  const response = streamText({
    model: mainModel,
    system: enhancedSystemPrompt,
    messages: modelMessages,
    tools: Tools,
    // stop after N tool calls or messages to avoid loops
    stopWhen: stepCountIs(maxSteps),

    onFinish: ({ text, toolCalls }) => {
      // Safety redaction (belt-and-suspenders)
      const idsToRedact = [
        ...(userId ? [userId] : []),
        ...recentStorageIds,
        // collect any IDs that might have been passed as tool args
        ...collectIdsFromToolCalls(toolCalls),
      ].filter(Boolean) as string[];
      if (text) {
        const redacted = redactInternalIds(text, idsToRedact);
        if (redacted !== text) {
          // Replace the text in-place (Vercel runner will send as-is)
          (response as any).replaceText?.(redacted);
        }
      }
    },
  });

  return response.toUIMessageStreamResponse();
}

// Helper to gather any IDs used in tool calls to further prevent leakage
function collectIdsFromToolCalls(toolCalls: any[] = []): string[] {
  const ids: string[] = [];
  for (const call of toolCalls) {
    const args = (call as any)?.args ?? {};
    for (const key of Object.keys(args)) {
      const v = args[key];
      if (typeof v === "string") ids.push(v);
    }
  }
  return ids;
}
