import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const data = await request.json();

  // Handle success or failure
  if (data.status === "succeeded") {
    const outputUrl = data.payload?.images?.[0]?.url;
    const requestId = data.request_id;

    // TODO: Store or update requestId and outputUrl in your database or state management

    console.log(
      `Image generation succeeded for request ${requestId}: ${outputUrl}`
    );

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
