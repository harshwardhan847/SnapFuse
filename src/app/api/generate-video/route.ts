import { NextRequest, NextResponse } from "next/server";
import { fal } from "@fal-ai/client";
import falConfig from "@/fal";

import { api } from "../../../../convex/_generated/api";
import convex from "@/convex";
import { CREDIT_COSTS } from "@/config/pricing";
import { randomUUID } from "crypto";

falConfig();

export async function POST(request: NextRequest) {
  try {
    const {
      inputStorageId,
      imageUrl,
      prompt,
      userId,
      duration = "5",
      negative_prompt = "blur, distort, and low quality",
      cfg_scale = 0.5,
    } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    // Check if user has sufficient credits before proceeding
    const userCredits = await convex.query(api.payments.checkCredits, {
      userId,
      requiredCredits: CREDIT_COSTS.VIDEO_GENERATION, // 5 credits for video generation
    });

    if (!userCredits.hasCredits) {
      return NextResponse.json(
        {
          error: "Insufficient credits",
          currentCredits: userCredits.currentCredits,
          requiredCredits: CREDIT_COSTS.VIDEO_GENERATION,
        },
        { status: 402 } // Payment Required
      );
    }
    let image_url = null;

    // Get the image URL from the storage ID if provided
    if (imageUrl) {
      image_url = imageUrl;
    } else {
      if (!inputStorageId) {
        return NextResponse.json(
          { error: "Image not provided" },
          { status: 404 }
        );
      }

      image_url = await convex.query(api.videos.getStorageUrl, {
        storageId: inputStorageId as any,
      });

      if (!image_url) {
        return NextResponse.json({ error: "Image not found" }, { status: 404 });
      }
    }

    // Submit to FAL AI for processing
    const { request_id } = await fal.queue.submit(
      "fal-ai/kling-video/v1.6/standard/image-to-video",
      {
        input: {
          prompt,
          image_url: imageUrl,
          duration,
          negative_prompt,
          cfg_scale,
        },
        webhookUrl: `${process.env.APP_BASE_URL}/api/webhooks/falai`,
      }
    );

    // Create video job record (this will deduct credits automatically)
    await convex.mutation(api.videos.createVideoJobRecord, {
      prompt,
      request_id,
      imageUrl,
      input_storage_id: inputStorageId || null,
      userId,
      duration,
      negative_prompt,
      cfg_scale,
    });

    return NextResponse.json({
      status: "processing",
      requestId: request_id,
      creditsDeducted: CREDIT_COSTS.VIDEO_GENERATION,
      remainingCredits:
        userCredits.currentCredits - CREDIT_COSTS.VIDEO_GENERATION,
    });
  } catch (error: any) {
    console.error("Video generation error:", error);

    if (error.message?.includes("Insufficient credits")) {
      return NextResponse.json(
        { error: "Insufficient credits" },
        { status: 402 }
      );
    }

    return NextResponse.json(
      { error: "Failed to submit video job" },
      { status: 500 }
    );
  }
}
