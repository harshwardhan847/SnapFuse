import { NextRequest, NextResponse } from "next/server";
import { api } from "../../../../convex/_generated/api";
import convex from "@/convex";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const storageId = searchParams.get("storageId");

    if (!storageId) {
      return NextResponse.json(
        { error: "Storage ID is required" },
        { status: 400 }
      );
    }

    // Get the image URL from Convex
    const imageUrl = await convex.query(api.images.getStorageUrl, {
      storageId: storageId as any,
    });

    if (!imageUrl) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    console.log(imageUrl);
    // Fetch the image data

    // For debugging, let's also return the original URL
    return NextResponse.json({
      imageUrl,
    });
  } catch (error) {
    console.error("Error getting image data URL:", error);
    return NextResponse.json(
      { error: "Failed to get image data URL" },
      { status: 500 }
    );
  }
}
