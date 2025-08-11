import { NextRequest, NextResponse } from "next/server";
import { api } from "../../../../convex/_generated/api";
import convex from "@/convex";

// Upload an image file to Convex storage and return a temporary public URL
export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get("content-type") || "";
    if (!contentType.includes("multipart/form-data")) {
      return NextResponse.json(
        { error: "Expected multipart/form-data" },
        { status: 400 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Missing file" }, { status: 400 });
    }

    // Get a signed upload URL from Convex
    // Use any-cast to avoid type errors if Convex codegen hasn't been run yet
    const uploadUrl = await convex.mutation(
      (api as any).images.generateUploadUrl,
      {}
    );

    // Upload to Convex storage
    const uploadResponse = await fetch(uploadUrl, {
      method: "POST",
      headers: {
        "Content-Type": file.type || "application/octet-stream",
      },
      // Blob/File bodies are supported by fetch; avoid Buffer for Edge compatibility
      body: file,
    });

    if (!uploadResponse.ok) {
      const text = await uploadResponse.text();
      return NextResponse.json(
        { error: `Upload failed: ${uploadResponse.status} ${text}` },
        { status: 500 }
      );
    }

    const { storageId } = await uploadResponse.json();

    // Request a public URL for immediate use
    const publicUrl = await convex.query((api as any).images.getStorageUrl, {
      storageId,
    });

    return NextResponse.json({ url: publicUrl, storageId });
  } catch (error) {
    console.error("Upload error", error);
    return NextResponse.json({ error: "Upload error" }, { status: 500 });
  }
}
