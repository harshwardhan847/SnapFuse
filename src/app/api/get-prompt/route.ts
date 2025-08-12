import { NextRequest, NextResponse } from "next/server";
import { getPromptFromImage } from "@/ai/functions/getPromptFromImage";
import sharp from "sharp";

const SUPPORTED_IMAGE_MIME_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
]);

async function fetchAndMaybeConvertToSupported(imageUrl: string) {
  const res = await fetch(imageUrl);
  if (!res.ok) {
    throw new Error(`Failed to fetch image: ${res.status}`);
  }
  const contentType = res.headers.get("content-type") || "";
  const arrayBuffer = await res.arrayBuffer();
  let bytes = new Uint8Array(arrayBuffer);
  let mimeType = (contentType.split(";")[0] || "").toLowerCase();

  if (!SUPPORTED_IMAGE_MIME_TYPES.has(mimeType)) {
    // Convert to PNG using sharp for unsupported formats (e.g., AVIF, HEIC)
    const converted = await sharp(bytes).png().toBuffer();
    bytes = new Uint8Array(converted);
    mimeType = "image/png";
  }

  const base64 = Buffer.from(bytes).toString("base64");
  const dataUrl = `data:${mimeType};base64,${base64}`;
  return dataUrl;
}

export async function POST(request: NextRequest) {
  try {
    const {
      image,
      userPrompt,
      style,
      creativity,
      detailLevel,
      background,
      upscale,
    } = await request.json();
    if (!image || typeof image !== "string") {
      return NextResponse.json({ error: "Missing image URL" }, { status: 400 });
    }

    // If already a data URL, pass-through; otherwise normalize to supported data URL
    const normalizedImage = image.startsWith("data:")
      ? image
      : await fetchAndMaybeConvertToSupported(image);

    const prompt = await getPromptFromImage({
      image: normalizedImage,
      userPrompt,
      style,
      creativity,
      detailLevel,
      background,
      upscale,
    });
    return NextResponse.json({ prompt });
  } catch (error) {
    console.error("get-prompt error", error);
    return NextResponse.json(
      { error: "Failed to generate prompt" },
      { status: 500 }
    );
  }
}
