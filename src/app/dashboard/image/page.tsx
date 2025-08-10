"use client";

import { Button } from "@/components/ui/button";
import { useQuery } from "convex/react";
import { useState } from "react";
import { api } from "../../../../convex/_generated/api";
import { useAuth } from "@clerk/nextjs";
import ImageList from "./_components/image-list";

export default function ImageGenerator() {
  const [requestId, setRequestId] = useState<string | null>(null);
  const [status, setStatus] = useState("idle");
  const { userId } = useAuth();
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  async function generateImage(imageUrl: string, prompt: string) {
    setStatus("processing");
    const response = await fetch("/api/generate-image", {
      method: "POST",
      body: JSON.stringify({ imageUrl, prompt }),
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
    if (data.status === "processing") {
      setRequestId(data.requestId);
      setStatus("processing");
    } else {
      setStatus("error");
    }
  }

  // You could implement polling or subscription here to update image status...

  if (!userId) return null;

  return (
    <div className="flex items-center justify-center">
      <ImageList userId={userId} />
      {/* UI to upload image + enter prompt */}
      <Button
        onClick={() =>
          generateImage(
            "https://images.meesho.com/images/products/445029933/0e3g7_512.avif?width=512",
            "Create a high-resolution, photorealistic product image of a decorative gold owl figurine with intricate textured dots and a polished metallic finish. Place the owl on a clean, modern surface with soft, natural lighting that accentuates its shiny gold color and sculpted details. Use a minimalistic background in warm, neutral tones to convey elegance and sophistication, suitable for home décor or upscale catalog presentation. Ensure the owl is the central focus, with realistic shadows and gentle reflections to enhance its premium quality."
          )
        }
      >
        Generate Image
      </Button>

      {status === "processing" && <p>Image generation in progress...</p>}
      {status === "error" && <p>Error occurred during generation.</p>}
      {generatedImage && <img src={generatedImage} alt="Generated Product" />}
    </div>
  );
}
