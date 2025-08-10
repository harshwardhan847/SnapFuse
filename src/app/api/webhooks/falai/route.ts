import { NextRequest, NextResponse } from "next/server";

import { api } from "../../../../../convex/_generated/api";
import convex from "@/convex";

export async function POST(request: NextRequest) {
  const data = await request.json();

  // Handle success or failure
  if (data.status === "succeeded") {
    const outputUrl = data.payload?.images?.[0]?.url;
    const requestId = data.request_id;

    console.log(
      `Image generation succeeded for request ${requestId}: ${outputUrl}`
    );

    await convex.mutation(api.images.updateImageJobStatus, {
      request_id: requestId,
      status: data.status,
      error_message: data.error,
      image_url: outputUrl,
    });

    // Respond quickly to fal.ai
    return NextResponse.json({ status: "processed" });
  } else if (["failed", "canceled"].includes(data.status)) {
    console.error(
      `Generation failed for request ${data.request_id}: ${data.error || "Unknown error"}`
    );
    return NextResponse.json({ status: "error_handled" });
  }

  return NextResponse.json({ status: "ignored" });
}
