import { NextRequest, NextResponse } from "next/server";
import { api } from "../../../../../convex/_generated/api";
import convex from "@/convex";
import { CREDIT_COSTS } from "@/config/pricing";

export async function POST(request: NextRequest) {
  const data = await request.json();

  const requestId = data.request_id || data.gateway_request_id;

  // Handle success case (status "OK")
  if (data.status === "OK") {
    const imageUrl =
      data.payload?.images?.[0]?.url || data.images?.[0]?.url || null;
    const videoUrl = data.payload?.video?.url || data.video?.url || null;

    // Decide whether this request was for image or video
    const imageJob = await convex.query(api.images.getImageJobByRequestId, {
      request_id: requestId,
    });

    if (imageJob) {
      console.log(
        `Image generation succeeded for request ${requestId}: ${imageUrl}`
      );
      await convex.mutation(api.images.updateImageJobStatus, {
        request_id: requestId,
        status: "done",
        error_message: null,
        image_url: imageUrl,
      });
      return NextResponse.json({ status: "processed" });
    }

    const videoJob = await convex.query(api.videos.getVideoJobByRequestId, {
      request_id: requestId,
    });

    if (videoJob) {
      console.log(
        `Video generation succeeded for request ${requestId}: ${videoUrl}`
      );
      await convex.mutation(api.videos.updateVideoJobStatus, {
        request_id: requestId,
        status: "done",
        error_message: null,
        video_url: videoUrl,
      });
      return NextResponse.json({ status: "processed" });
    }

    // If neither job is found, ignore
    return NextResponse.json({ status: "ignored" });
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

    const imageJob = await convex.query(api.images.getImageJobByRequestId, {
      request_id: requestId,
    });

    if (imageJob) {
      await convex.mutation(api.images.updateImageJobStatus, {
        request_id: requestId,
        status: "error",
        error_message: errorDetails,
        image_url: null,
      });
      await convex.mutation(api.payments.addCredits, {
        amount: CREDIT_COSTS.IMAGE_GENERATION,
        reason: "Error Refund",
        userId: imageJob.userId,
        relatedId: imageJob.request_id,
      });
    } else {
      const videoJob = await convex.query(api.videos.getVideoJobByRequestId, {
        request_id: requestId,
      });
      if (videoJob) {
        await convex.mutation(api.videos.updateVideoJobStatus, {
          request_id: requestId,
          status: "error",
          error_message: errorDetails,
          video_url: null,
        });
        await convex.mutation(api.payments.addCredits, {
          amount: CREDIT_COSTS.VIDEO_GENERATION,
          reason: "Error Refund",
          userId: videoJob.userId,
          relatedId: videoJob.request_id,
        });

        return NextResponse.json({ status: "error_handled" });
      }
      await convex.mutation(api.images.updateImageJobStatus, {
        request_id: requestId,
        status: "error",
        error_message: errorDetails,
        image_url: null,
      });
    }

    return NextResponse.json({ status: "error_handled" });
  }

  // For other statuses, update the corresponding job if present
  const imageJob = await convex.query(api.images.getImageJobByRequestId, {
    request_id: requestId,
  });
  if (imageJob) {
    await convex.mutation(api.images.updateImageJobStatus, {
      request_id: requestId,
      status: data.status,
      error_message: null,
      image_url: null,
    });
  } else {
    const videoJob = await convex.query(api.videos.getVideoJobByRequestId, {
      request_id: requestId,
    });
    if (videoJob) {
      await convex.mutation(api.videos.updateVideoJobStatus, {
        request_id: requestId,
        status: data.status,
        error_message: null,
        video_url: null,
      });
    }
  }

  // For any other statuses (e.g., queued, processing notifications)
  // optionally log or ignore them
  console.log(
    `Webhook received with status ${data.status} for request ${requestId}`
  );

  return NextResponse.json({ status: "ignored" });
}
