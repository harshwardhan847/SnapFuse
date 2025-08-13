import { NextRequest, NextResponse } from "next/server";
import { getPromptFromImage } from "@/ai/functions/getPromptFromImage";
import { getPromptFromImageForVideo } from "@/ai/functions/getPromptFromImageForVideo";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      image,
      userPrompt,
      style,
      creativity,
      detailLevel,
      background,
      upscale,
      useMannequin,
      // Video-specific parameters
      motionStyle,
      cameraMovement,
      animationType,
      duration,
    } = body;

    if (!image) {
      return NextResponse.json(
        { error: "Image URL is required" },
        { status: 400 }
      );
    }

    // Check if this is a video prompt request by looking for video-specific parameters
    const isVideoPrompt =
      motionStyle || cameraMovement || animationType || duration;

    let prompt: string;

    if (isVideoPrompt) {
      // Generate video prompt
      prompt = await getPromptFromImageForVideo({
        image,
        userPrompt,
        motionStyle,
        cameraMovement,
        animationType,
        duration,
      });
    } else {
      // Generate image prompt
      prompt = await getPromptFromImage({
        image,
        userPrompt,
        style,
        creativity,
        detailLevel,
        background,
        upscale,
        useMannequin,
      });
    }

    return NextResponse.json({ prompt });
  } catch (error) {
    console.error("Error generating prompt:", error);
    return NextResponse.json(
      { error: "Failed to generate prompt" },
      { status: 500 }
    );
  }
}
