import { getAiSeoReadyContent } from "@/ai/functions/getAiSeoReadyContent";
import { mainModel } from "@/ai/models";
import { seoContentSchema } from "@/ai/schema";
import { seoFormSchema } from "@/schema";
import { generateObject } from "ai";

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const reqJson = await req.json();
    console.log("Incoming Request JSON:", reqJson);
    const parseResult = seoFormSchema.safeParse(reqJson);

    if (!parseResult.success) {
      console.error("Validation Error:", parseResult.error);
      return new Response(JSON.stringify({ error: parseResult.error }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { name, description } = parseResult.data;

    const result = await getAiSeoReadyContent({ name, description });

    console.log("LLM Output:", result);

    return Response.json(result.object);
  } catch (err) {
    console.error("Server Error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
