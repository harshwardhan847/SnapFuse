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

    const url = await convex.query(api.images.getStorageUrl, {
      storageId: storageId as any,
    });

    if (!url) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    return NextResponse.json({ url });
  } catch (error) {
    console.error("Error getting image URL:", error);
    return NextResponse.json(
      { error: "Failed to get image URL" },
      { status: 500 }
    );
  }
}
