import { NextRequest, NextResponse } from "next/server";
import { fal } from "@fal-ai/client";
import falConfig from "@/fal";

import { api } from "../../../../convex/_generated/api";
import convex from "@/convex";

falConfig();

export async function POST(request: NextRequest) {
  try {
    const {
      inputStorageId,
      prompt,
      userId,
      duration = "5",
      negative_prompt = "blur, distort, and low quality",
      cfg_scale = 0.5,
    } = await request.json();

    const imageUrl = await convex.query(api.videos.getStorageUrl, {
      storageId: inputStorageId as any,
    });

    if (!imageUrl) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

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

    await convex.mutation(api.videos.createVideoJobRecord, {
      prompt,
      request_id,
      input_storage_id: inputStorageId || null,
      userId,
      duration,
      negative_prompt,
      cfg_scale,
    });

    return NextResponse.json({ status: "processing", requestId: request_id });
  } catch (error) {
    console.error("Fal.ai video submission error:", error);
    return NextResponse.json(
      { error: "Failed to submit video job" },
      { status: 500 }
    );
  }
}
