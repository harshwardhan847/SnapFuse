"use client";

import { useQuery } from "convex/react";
import React, { useMemo, useState } from "react";
import { api } from "../../../../../convex/_generated/api";
import { format } from "date-fns";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

type Props = {
  userId: string;
};

const statusClasses: { [key: string]: string } = {
  processing: "bg-yellow-500 text-black",
  done: "bg-green-600 text-white",
  error: "bg-red-600 text-white",
};

const ImageList = ({ userId }: Props) => {
  const images = useQuery(api.images.getAllImagesByUserId, {
    userId,
  });

  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const selectedImage = useMemo(() => {
    if (!images || selectedIndex === null) return null;
    return images[selectedIndex];
  }, [images, selectedIndex]);

  if (!images) {
    return (
      <div className="flex justify-center py-20">
        <Loader className="animate-spin" />
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="flex justify-center py-20">
        <Label className="text-gray-500">No images found.</Label>
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-6 mt-4 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((image, index) => {
          const status = (image.status || "").toLowerCase();
          const badgeClass = statusClasses[status] || "bg-muted text-foreground";
          const createdAtFormatted = image._creationTime
            ? format(new Date(image._creationTime), "PPP p")
            : "Unknown date";

          return (
            <Card
              key={image._id}
              className="group overflow-hidden border hover:shadow-lg transition flex flex-col"
            >
              <div
                className="relative aspect-[4/3] w-full bg-muted/40 cursor-pointer"
                onClick={() => {
                  setSelectedIndex(index);
                  setIsViewerOpen(true);
                }}
              >
                <img
                  src={image.image_url || "/placeholder.png"}
                  alt={`Generated image for prompt: ${image.prompt}`}
                  className="absolute inset-0 size-full object-contain"
                />

                <div className="absolute top-3 left-3">
                  <Badge className={`capitalize ${badgeClass}`}>{image.status}</Badge>
                </div>
              </div>

              <CardContent className="p-4 flex-1 flex flex-col gap-3">
                <CardHeader className="p-0">
                  <CardTitle
                    className="text-base font-semibold text-card-foreground line-clamp-2"
                    title={image.prompt}
                  >
                    {image.prompt}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    <span className="text-sm text-muted-foreground">
                      {createdAtFormatted}
                    </span>
                  </CardDescription>
                </CardHeader>

                {image.error_message && (
                  <p className="text-sm text-red-600 whitespace-pre-wrap">
                    {image.error_message}
                  </p>
                )}

                <div className="mt-auto flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => {
                      setSelectedIndex(index);
                      setIsViewerOpen(true);
                    }}
                  >
                    View
                  </Button>
                  {image.image_url && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(image.image_url as string, "_blank")}
                    >
                      Open Original
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Dialog open={isViewerOpen} onOpenChange={setIsViewerOpen}>
        <DialogContent className="sm:max-w-[95vw] md:max-w-[90vw] lg:max-w-[80vw]">
          {selectedImage && (
            <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
              <div className="flex items-center justify-center bg-muted/40 rounded-md max-h-[80vh] overflow-auto p-2">
                <img
                  src={selectedImage.image_url || "/placeholder.png"}
                  alt={`Generated image for prompt: ${selectedImage.prompt}`}
                  className="max-h-[78vh] w-auto object-contain rounded"
                />
              </div>

              <div className="flex flex-col gap-4">
                <DialogHeader className="p-0">
                  <DialogTitle>Image Details</DialogTitle>
                  <DialogDescription>
                    Generated image and its metadata
                  </DialogDescription>
                </DialogHeader>

                <div className="flex items-center gap-2">
                  <Badge className={`capitalize ${statusClasses[(selectedImage.status || "").toLowerCase()] || "bg-muted text-foreground"}`}>
                    {selectedImage.status}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {selectedImage._creationTime
                      ? format(new Date(selectedImage._creationTime), "PPP p")
                      : "Unknown date"}
                  </span>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>Prompt</Label>
                  <div className="rounded-md border bg-muted/20 p-3 text-sm max-h-48 overflow-auto whitespace-pre-wrap">
                    {selectedImage.prompt}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={async () => {
                        try {
                          await navigator.clipboard.writeText(selectedImage.prompt || "");
                        } catch {}
                      }}
                    >
                      Copy Prompt
                    </Button>
                    {selectedImage.image_url && (
                      <Button
                        size="sm"
                        onClick={() => window.open(selectedImage.image_url as string, "_blank")}
                      >
                        Open Original
                      </Button>
                    )}
                  </div>
                </div>

                {selectedImage.error_message && (
                  <div className="space-y-2">
                    <Label>Error</Label>
                    <div className="rounded-md border bg-red-50 p-3 text-sm text-red-700 whitespace-pre-wrap">
                      {selectedImage.error_message}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ImageList;
