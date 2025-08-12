import { NextRequest, NextResponse } from "next/server";
import { getPromptFromImage } from "@/ai/functions/getPromptFromImage";

export async function POST(request: NextRequest) {
  try {
    const { image, userPrompt } = await request.json();
    if (!image || typeof image !== "string") {
      return NextResponse.json({ error: "Missing image URL" }, { status: 400 });
    }

    const prompt = await getPromptFromImage({ image, userPrompt });
    return NextResponse.json({ prompt });
  } catch (error) {
    console.error("get-prompt error", error);
    return NextResponse.json({ error: "Failed to generate prompt" }, { status: 500 });
  }
}


