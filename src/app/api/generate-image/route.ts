import { NextRequest, NextResponse } from "next/server";
import { fal } from "@fal-ai/client";
import falConfig from "@/fal";

import { api } from "../../../../convex/_generated/api";
import convex from "@/convex";
import { CREDIT_COSTS } from "@/config/pricing";

falConfig();

export async function POST(request: NextRequest) {
  try {
    const { inputStorageId, prompt, userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    // Check if user has sufficient credits before proceeding
    const userCredits = await convex.query(api.payments.checkCredits, {
      userId,
      requiredCredits: CREDIT_COSTS.IMAGE_GENERATION, // 1 credit for image generation
    });

    if (!userCredits.hasCredits) {
      return NextResponse.json(
        {
          error: "Insufficient credits",
          currentCredits: userCredits.currentCredits,
          requiredCredits: CREDIT_COSTS.IMAGE_GENERATION,
        },
        { status: 402 } // Payment Required
      );
    }

    // Get the image URL from the storage ID if provided
    if (!inputStorageId) {
      return NextResponse.json(
        { error: "Image not provided" },
        { status: 404 }
      );
    }
    let imageUrl = null;
    if (inputStorageId) {
      imageUrl = await convex.query(api.images.getStorageUrl, {
        storageId: inputStorageId,
      });

      if (!imageUrl) {
        return NextResponse.json({ error: "Image not found" }, { status: 404 });
      }
    }
    if (!imageUrl) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    // Submit to FAL AI for processing
    const { request_id } = await fal.queue.submit("fal-ai/flux-kontext/dev", {
      input: {
        prompt,
        image_url: imageUrl,
      },
      webhookUrl: `${process.env.APP_BASE_URL}/api/webhooks/falai`,
    });

    // Create image job record (this will deduct credits automatically)
    await convex.mutation(api.images.createImageJobRecord, {
      image_url: null,
      prompt,
      request_id,
      input_storage_id: inputStorageId || null,
      userId,
    });

    return NextResponse.json({
      status: "processing",
      requestId: request_id,
      creditsDeducted: CREDIT_COSTS.IMAGE_GENERATION,
      remainingCredits:
        userCredits.currentCredits - CREDIT_COSTS.IMAGE_GENERATION,
    });
  } catch (error) {
    console.error("Image generation error:", error);

    //@ts-expect-error //a
    if (error.message?.includes("Insufficient credits")) {
      return NextResponse.json(
        { error: "Insufficient credits" },
        { status: 402 }
      );
    }

    return NextResponse.json(
      { error: "Failed to submit job" },
      { status: 500 }
    );
  }
}

// Optional: handle direct file uploads by delegating to Convex storage
export async function PUT(request: NextRequest) {
  try {
    const contentType = request.headers.get("content-type") || "";
    if (!contentType.includes("multipart/form-data")) {
      return NextResponse.json(
        { error: "Expected multipart/form-data" },
        { status: 400 }
      );
    }
    // In this route we only pass through for future extension; currently uploads happen via /api/upload-image
    return NextResponse.json({ status: "noop" });
  } catch (error) {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
