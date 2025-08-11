"use client";

import { useAuth } from "@clerk/nextjs";
import ImageList from "./_components/image-list";
import ImageGenerationModal from "./_components/image-generation-modal";

export default function ImageGenerator() {
  const { userId } = useAuth();

  if (!userId) return null;

  return (
    <div className="flex items-center justify-center flex-col gap-4 p-8">
      <ImageGenerationModal userId={userId} />
      <h2 className="text-2xl font-semibold text-start w-full">
        Generated Images
      </h2>
      <ImageList userId={userId} />
    </div>
  );
}
