"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@clerk/nextjs";
import ImageList from "./_components/image-list";
import { toast } from "sonner";

export default function ImageGenerator() {
  const { userId } = useAuth();

  async function generateImage(imageUrl: string, prompt: string) {
    const response = await fetch("/api/generate-image", {
      method: "POST",
      body: JSON.stringify({ imageUrl, prompt, userId }),
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
    if (data.status === "processing") {
      toast.success("Added to queue");
    } else {
      toast.error("Error occurred during generation.");
      console.error("Error occurred during generation.");
    }
  }

  if (!userId) return null;

  return (
    <div className="flex items-center justify-center flex-col gap-4 p-8">
      {/* // TODO : UI to upload image + enter prompt */}
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

      <h2 className="text-2xl font-semibold text-start w-full">
        Generated Images
      </h2>
      <ImageList userId={userId} />
    </div>
  );
}
