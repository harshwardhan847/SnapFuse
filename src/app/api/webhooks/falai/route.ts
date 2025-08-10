import { NextRequest, NextResponse } from "next/server";
import { api } from "../../../../../convex/_generated/api";
import convex from "@/convex";

export async function POST(request: NextRequest) {
  const data = await request.json();

  const requestId = data.request_id || data.gateway_request_id;

  // Handle success case (status "OK")
  if (data.status === "OK") {
    const outputUrl = data.payload?.images?.[0]?.url || null;

    console.log(
      `Image generation succeeded for request ${requestId}: ${outputUrl}`
    );

    await convex.mutation(api.images.updateImageJobStatus, {
      request_id: requestId,
      status: "done",
      error_message: null,
      image_url: outputUrl,
    });

    return NextResponse.json({ status: "processed" });
  }

  // Handle error case (status "ERROR")
  if (data.status === "ERROR") {
    // Extract detailed error info if exists
    const errorDetails =
      data.error ||
      (data.payload && data.payload.detail
        ? JSON.stringify(data.payload.detail)
        : "Unknown error");

    console.error(
      `Generation failed for request ${requestId}: ${errorDetails}`
    );

    await convex.mutation(api.images.updateImageJobStatus, {
      request_id: requestId,
      status: "error",
      error_message: errorDetails,
      image_url: null,
    });

    return NextResponse.json({ status: "error_handled" });
  }

  // For any other statuses (e.g., queued, processing notifications)
  // optionally log or ignore them
  console.log(
    `Webhook received with status ${data.status} for request ${requestId}`
  );

  return NextResponse.json({ status: "ignored" });
}
