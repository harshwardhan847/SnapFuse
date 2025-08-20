"use client";

import { usePaginatedQuery, useQuery } from "convex/react";
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
import { Download, Loader, Play, Pause, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { Doc } from "../../../../../convex/_generated/dataModel";

type Props = {
  userId: string;
};

const statusClasses: { [key: string]: string } = {
  processing: "bg-yellow-500 text-black",
  done: "bg-green-600 text-white",
  error: "bg-red-600 text-white",
};

const VideoList = ({ userId }: Props) => {
  // Use proper Convex pagination
  const { results, status, loadMore } = usePaginatedQuery(
    api.videos.getVideosByUserIdPaginated,
    { userId },
    { initialNumItems: 12 }
  );

  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const selectedVideo = useMemo(() => {
    if (!results || selectedIndex === null) return null;
    return results[selectedIndex];
  }, [results, selectedIndex]);

  // Resolve the input image URL (stored in Convex storage) for the selected item
  const inputImageUrl = useQuery(
    api.videos.getStorageUrl,
    selectedVideo?.input_storage_id
      ? { storageId: selectedVideo.input_storage_id }
      : "skip"
  );

  async function downloadVideo(url: string, filename: string) {
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = objectUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(objectUrl);
    } catch {
      // ignore
    }
  }

  if (status === "LoadingFirstPage") {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-primary" />
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="flex justify-center py-20">
        <Label className="text-gray-500">No videos found.</Label>
      </div>
    );
  }

  return (
    <>
      {/* Pagination Info */}
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm text-muted-foreground">
          Showing {results.length} videos
        </div>
      </div>

      <div className="grid gap-6 mt-4 sm:grid-cols-2 lg:grid-cols-3 w-full">
        {results.map((video: Doc<"videos">, index: number) => {
          const status = (video.status || "").toLowerCase();
          const badgeClass =
            statusClasses[status] || "bg-muted text-foreground";
          const createdAtFormatted = video._creationTime
            ? format(new Date(video._creationTime), "PPP p")
            : "Unknown date";

          return (
            <Card
              key={video._id}
              className="group overflow-hidden border hover:shadow-lg transition flex flex-col pt-0"
            >
              <div
                className="relative aspect-[4/3] w-full bg-muted/40 cursor-pointer"
                onClick={() => {
                  setSelectedIndex(index);
                  setIsViewerOpen(true);
                }}
              >
                {video.video_url && (
                  <Button
                    size="icon"
                    variant="secondary"
                    className="absolute top-2 right-2 z-10"
                    onClick={() =>
                      downloadVideo(
                        video.video_url as string,
                        `video-${video.request_id || video._id}.mp4`
                      )
                    }
                  >
                    <Download />
                  </Button>
                )}

                {video.video_url ? (
                  <video
                    src={video.video_url}
                    className="absolute inset-0 size-full object-cover"
                    muted
                    loop
                    onMouseEnter={(e) => {
                      const video = e.target as HTMLVideoElement;
                      video.play();
                    }}
                    onMouseLeave={(e) => {
                      const video = e.target as HTMLVideoElement;
                      video.pause();
                      video.currentTime = 0;
                    }}
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <Play className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                      <span className="text-sm text-muted-foreground">
                        {status === "processing" ? "Processing..." : "No video"}
                      </span>
                    </div>
                  </div>
                )}

                <div className="absolute top-3 left-3">
                  <Badge className={`capitalize ${badgeClass}`}>
                    {video.status}
                  </Badge>
                </div>
              </div>

              <CardContent className="p-4 flex-1 flex flex-col gap-3">
                <CardHeader className="p-0">
                  <CardTitle
                    className="text-base font-semibold text-card-foreground line-clamp-2"
                    title={video.prompt}
                  >
                    {video.prompt}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    <span className="text-sm text-muted-foreground">
                      {createdAtFormatted}
                    </span>
                    {video.duration && (
                      <span className="text-sm text-muted-foreground ml-2">
                        • {video.duration}s
                      </span>
                    )}
                  </CardDescription>
                </CardHeader>

                {video.error_message && (
                  <p className="text-sm text-red-600 whitespace-pre-wrap">
                    {video.error_message}
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
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Load More Button */}
      {(status === "CanLoadMore" || status === "LoadingMore") && (
        <div className="mt-8 flex justify-center">
          <Button
            onClick={() => loadMore(12)}
            disabled={status === "LoadingMore"}
            variant="outline"
          >
            {status === "LoadingMore" ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin text-primary" />
                Loading...
              </>
            ) : (
              "Load More"
            )}
          </Button>
        </div>
      )}

      <Dialog open={isViewerOpen} onOpenChange={setIsViewerOpen}>
        <DialogContent className="sm:max-w-[95vw] md:max-w-[90vw] lg:max-w-[80vw]">
          {selectedVideo && (
            <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label>Input Image</Label>
                  <div className="flex items-center justify-center bg-muted/40 rounded-md max-h-[70vh] overflow-auto p-2">
                    {(selectedVideo?.imageUrl && inputImageUrl) ||
                    selectedVideo.imageUrl ? (
                      <Image
                        width={500}
                        height={500}
                        src={inputImageUrl ?? selectedVideo.imageUrl}
                        alt="Input image"
                        className="max-h-[68vh] w-auto object-contain rounded"
                      />
                    ) : (
                      <div className="text-sm text-muted-foreground p-4">
                        No input image stored.
                      </div>
                    )}
                  </div>
                  {inputImageUrl && (
                    <div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          downloadVideo(
                            inputImageUrl,
                            `input-${selectedVideo.request_id || selectedVideo._id}.png`
                          )
                        }
                      >
                        Download Input
                      </Button>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <Label>Generated Video</Label>
                  <div className="flex items-center justify-center bg-muted/40 rounded-md max-h-[70vh] overflow-auto p-2">
                    {selectedVideo.video_url ? (
                      <video
                        src={selectedVideo.video_url}
                        className="max-h-[68vh] w-auto object-contain rounded"
                        controls
                        autoPlay
                        loop
                        muted
                      />
                    ) : (
                      <div className="text-sm text-muted-foreground p-4">
                        {selectedVideo.status === "processing"
                          ? "Processing..."
                          : "No video available"}
                      </div>
                    )}
                  </div>
                  {selectedVideo.video_url && (
                    <div>
                      <Button
                        size="sm"
                        onClick={() =>
                          downloadVideo(
                            selectedVideo.video_url as string,
                            `output-${selectedVideo.request_id || selectedVideo._id}.mp4`
                          )
                        }
                      >
                        Download Video
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <DialogHeader className="p-0">
                  <DialogTitle>Video Details</DialogTitle>
                  <DialogDescription>
                    Generated video and its metadata
                  </DialogDescription>
                </DialogHeader>

                <div className="flex items-center gap-2">
                  <Badge
                    className={`capitalize ${statusClasses[(selectedVideo.status || "").toLowerCase()] || "bg-muted text-foreground"}`}
                  >
                    {selectedVideo.status}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {selectedVideo._creationTime
                      ? format(new Date(selectedVideo._creationTime), "PPP p")
                      : "Unknown date"}
                  </span>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>Video Prompt</Label>
                  <div className="rounded-md border bg-muted/20 p-3 text-sm max-h-48 overflow-auto whitespace-pre-wrap">
                    {selectedVideo.prompt}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={async () => {
                        try {
                          await navigator.clipboard.writeText(
                            selectedVideo.prompt || ""
                          );
                        } catch {}
                      }}
                    >
                      Copy Prompt
                    </Button>
                    {selectedVideo.video_url && (
                      <Button
                        size="sm"
                        onClick={() =>
                          window.open(
                            selectedVideo.video_url as string,
                            "_blank"
                          )
                        }
                      >
                        Open Original
                      </Button>
                    )}
                  </div>
                </div>

                {/* Video Parameters */}
                <div className="space-y-2">
                  <Label>Video Parameters</Label>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {selectedVideo.duration && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Duration:</span>
                        <span>{selectedVideo.duration}s</span>
                      </div>
                    )}
                    {selectedVideo.cfg_scale && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          CFG Scale:
                        </span>
                        <span>{selectedVideo.cfg_scale}</span>
                      </div>
                    )}
                    {selectedVideo.negative_prompt && (
                      <div className="col-span-2">
                        <span className="text-muted-foreground">
                          Negative Prompt:
                        </span>
                        <div className="text-xs mt-1 p-2 bg-muted/20 rounded">
                          {selectedVideo.negative_prompt}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {selectedVideo.error_message && (
                  <div className="space-y-2">
                    <Label>Error</Label>
                    <div className="rounded-md border bg-red-50 p-3 text-sm text-red-700 whitespace-pre-wrap">
                      {selectedVideo.error_message}
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

export default VideoList;
