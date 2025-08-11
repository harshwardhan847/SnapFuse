// app/api/generate-image/route.ts
import { NextRequest, NextResponse } from "next/server";
import { fal } from "@fal-ai/client";
import falConfig from "@/fal";

import { api } from "../../../../convex/_generated/api";
import convex from "@/convex";

falConfig();

export async function POST(request: NextRequest) {
  try {
    const { imageUrl, prompt, userId } = await request.json();

    const { request_id } = await fal.queue.submit("fal-ai/flux-kontext/dev", {
      input: { prompt, image_url: imageUrl },
      webhookUrl: `${process.env.APP_BASE_URL}/api/webhooks/falai`,
    });

    await convex.mutation(api.images.createImageJobRecord, {
      image_url: null,
      prompt,
      request_id,
      userId,
    });

    return NextResponse.json({ status: "processing", requestId: request_id });
  } catch (error) {
    console.error("Fal.ai submission error:", error);
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
