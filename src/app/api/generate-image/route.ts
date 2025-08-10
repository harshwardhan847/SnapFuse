// app/api/generate-image/route.ts
import { NextRequest, NextResponse } from "next/server";
import { fal } from "@fal-ai/client";
import falConfig from "@/fal";

falConfig();

export async function POST(request: NextRequest) {
  try {
    const { imageUrl, prompt } = await request.json();

    const { request_id } = await fal.queue.submit("fal-ai/flux-kontext/dev", {
      input: { prompt, image_url: imageUrl },
      webhookUrl: `${process.env.APP_BASE_URL}/api/webhooks/falai`,
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
