import { useQuery } from "convex/react";
import React from "react";
import { api } from "../../../../../convex/_generated/api";
import { format } from "date-fns";

type Props = {
  userId: string;
};

const statusColors: { [key: string]: string } = {
  processing: "bg-yellow-100 text-yellow-800",
  completed: "bg-green-100 text-green-800",
  error: "bg-red-100 text-red-800",
};

const ImageList = ({ userId }: Props) => {
  const images = useQuery(api.images.getAllImagesByUserId, {
    userId,
  });

  if (!images) {
    return <p className="text-center py-10 text-gray-500">Loading images...</p>;
  }

  if (images.length === 0) {
    return <p className="text-center py-10 text-gray-500">No images found.</p>;
  }

  return (
    <div className="space-y-6 mt-4 grid sm:grid-cols-2 md:grid-cols-3">
      {images.map((image) => {
        const status = image.status.toLowerCase();
        const badgeClass = statusColors[status] || "bg-gray-100 text-gray-800";
        const createdAtFormatted = image._creationTime
          ? format(new Date(image._creationTime), "PPP p")
          : "Unknown date";

        return (
          <div
            key={image._id}
            className="flex flex-col md:flex-row bg-white shadow-md rounded-lg p-6 gap-6 items-center"
          >
            <img
              src={image.image_url || "/placeholder.png"}
              alt={`Generated image for prompt: ${image.prompt}`}
              className="w-32 h-32 object-contain rounded-md border border-gray-200"
            />
            <div className="flex-1 flex flex-col space-y-2">
              <h3
                className="text-lg font-semibold text-gray-900 truncate text-wrap line-clamp-2"
                title={image.prompt}
              >
                {image.prompt}
              </h3>
              <div>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${badgeClass}`}
                >
                  {image.status}
                </span>
              </div>
              {image.error_message && (
                <p className="text-sm text-red-600 whitespace-pre-wrap">
                  {image.error_message}
                </p>
              )}
              <p className="text-sm text-gray-500">
                Created: {createdAtFormatted}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ImageList;
