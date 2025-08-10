import { useQuery } from "convex/react";
import React from "react";
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

type Props = {
  userId: string;
};

const statusColors: { [key: string]: string } = {
  processing: "yellow",
  done: "green",
  error: "red",
};

const ImageList = ({ userId }: Props) => {
  const images = useQuery(api.images.getAllImagesByUserId, {
    userId,
  });

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
    <div className="grid gap-6 mt-4 sm:grid-cols-2 md:grid-cols-3">
      {images.map((image) => {
        const status = image.status.toLowerCase();
        const badgeColor = statusColors[status] || "gray";
        const createdAtFormatted = image._creationTime
          ? format(new Date(image._creationTime), "PPP p")
          : "Unknown date";

        return (
          <Card key={image._id} className="flex flex-col md:flex-row gap-4 p-4">
            <div className="flex-shrink-0 w-32 h-32 bg-gray-50 border border-gray-200 rounded-md overflow-hidden">
              <img
                src={image.image_url || "/placeholder.png"}
                alt={`Generated image for prompt: ${image.prompt}`}
                className="w-full h-full object-contain"
              />
            </div>
            <CardContent className="flex-1 flex flex-col justify-between">
              <CardHeader className="p-0 mb-2">
                <CardTitle
                  className="text-lg font-semibold text-card-foreground line-clamp-2"
                  title={image.prompt}
                >
                  {image.prompt}
                </CardTitle>
              </CardHeader>

              <div className="flex flex-col space-y-1">
                <Badge
                  style={{ background: badgeColor }}
                  className="capitalize w-max"
                >
                  {image.status}
                </Badge>
                {image.error_message && (
                  <p className="text-sm text-red-600 whitespace-pre-wrap">
                    {image.error_message}
                  </p>
                )}
                <p className="text-sm text-gray-500">
                  Created: {createdAtFormatted}
                </p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default ImageList;
