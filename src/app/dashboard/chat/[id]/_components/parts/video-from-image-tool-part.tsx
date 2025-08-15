import { useQuery } from "convex/react";
import { useEffect, useState } from "react";
import { api } from "../../../../../../../convex/_generated/api";
import { Download, Info, Loader } from "lucide-react";
import { Badge } from "@/components/ui/badge";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Image from "next/image";
const VideoFromImageToolPart = ({ part }: { part: any }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputStorageId, setInputStorageId] = useState<string | null>(null);
  const [outputStorageId, setOutputStorageId] = useState<string | null>(null);

  const isProcessing = part.state === "processing" || part.state === "pending";
  const hasError = part.state === "error" || part.output?.status === "failed";

  // Extract storage IDs and requestId from the tool input/output
  const requestId: string | undefined =
    part.output?.requestId || part.input?.requestId;

  useEffect(() => {
    if (part.input?.inputStorageId) {
      setInputStorageId(part.input.inputStorageId);
    }
    if (part.output?.storageId) {
      setOutputStorageId(part.output.storageId);
    }
  }, [part.input, part.output]);

  // Get video URLs using storage IDs
  const inputImageUrl = useQuery(
    api.images.getStorageUrl,
    inputStorageId ? { storageId: inputStorageId as any } : "skip"
  );

  // Fetch job by requestId to show generated output video and status
  const job = useQuery(
    api.videos.getVideoJobByRequestId,
    requestId ? { request_id: requestId } : "skip"
  );

  const jobStatus: string | undefined = job?.status as any;
  const jobVideoUrl: string | null = (job?.video_url as string) || null;
  const jobErrorMessage: string | null = (job?.error_message as string) || null;

  const derivedFinished =
    jobStatus === "done" || part.output?.status === "done";
  const derivedProcessing =
    isProcessing || jobStatus === "pending" || jobStatus === "processing";
  const derivedError = hasError || jobStatus === "error";

  const downloadByUrl = async (url: string, filename: string) => {
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
  };

  return (
    <>
      <div className="p-4 bg-muted/50 rounded-lg">
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="outline">Product Video Generation</Badge>
          {derivedProcessing && <Loader className="h-4 w-4 animate-spin" />}
        </div>

        <div className="flex gap-4">
          {/* Input Video */}
          {inputStorageId && (
            <div className="relative">
              <div className="relative w-32 h-32 rounded-lg overflow-hidden">
                {inputImageUrl ? (
                  <Image
                    src={inputImageUrl}
                    alt={"generated Image"}
                    width={128}
                    height={128}
                    className={`object-cover w-full h-full ${derivedProcessing ? "blur-sm" : ""
                      }`}
                  />
                ) : (
                  <div className="w-full h-full bg-muted/30 flex items-center justify-center">
                    <Loader className="h-4 w-4 animate-spin" />
                  </div>
                )}
                {derivedProcessing && (
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <Loader className="h-6 w-6 animate-spin text-white" />
                  </div>
                )}
              </div>
              <div className="text-xs text-muted-foreground mt-1 text-center">
                Input
              </div>
            </div>
          )}

          {/* Output Video */}
          <div className="relative">
            <div className="relative w-32 h-32 rounded-lg overflow-hidden bg-muted/30 flex items-center justify-center">
              {derivedFinished && jobVideoUrl ? (
                <>
                  <video
                    src={jobVideoUrl}
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
                    width={128}
                    height={128}
                    className="object-cover w-full h-full cursor-pointer"
                    onClick={() => setIsModalOpen(true)}
                  />
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() =>
                      downloadByUrl(
                        jobVideoUrl,
                        `product-video-${Date.now()}.png`
                      )
                    }
                    className="absolute top-1 right-1 h-6 w-6 p-0"
                  >
                    <Download className="h-3 w-3" />
                  </Button>
                </>
              ) : derivedProcessing ? (
                <div className="flex flex-col items-center gap-2">
                  <Loader className="h-6 w-6 animate-spin" />
                  <span className="text-xs text-muted-foreground">
                    Generating...
                  </span>
                </div>
              ) : derivedError ? (
                <div className="flex flex-col items-center gap-2">
                  <span className="text-xs text-red-600">Failed</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    Processing...
                  </span>
                </div>
              )}
            </div>
            <div className="text-xs text-muted-foreground mt-1 text-center">
              Output
            </div>
          </div>
        </div>

        {/* Status Messages */}
        {derivedProcessing && (
          <div className="text-sm text-muted-foreground mt-3">
            Generating your product video... This may take a few moments.
          </div>
        )}

        {derivedError && (
          <div className="text-sm text-red-600 mt-3">
            Error:{" "}
            {jobErrorMessage ||
              part.output?.error ||
              "Failed to generate video"}
          </div>
        )}

        {derivedFinished && (
          <div className="text-sm text-green-600 mt-3">
            Video generation completed!
          </div>
        )}

        {requestId && (
          <div className="text-xs text-muted-foreground mt-2">
            Request ID: {requestId}
          </div>
        )}

        {/* Info Button */}
        <Button
          size="sm"
          variant="outline"
          onClick={() => setIsModalOpen(true)}
          className="mt-3"
        >
          <Info className="h-4 w-4 mr-2" />
          View Details
        </Button>
      </div>

      {/* Modal with all video information */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[90vw] max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Product Video Generation Details</DialogTitle>
            <DialogDescription>
              Complete information about the video generation process
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Input Section */}
            <div className="space-y-4">
              <h3 className="font-semibold">Input Video</h3>
              {inputStorageId && (
                <div className="relative">
                  {inputImageUrl ? (
                    <Image
                      src={inputImageUrl}
                      alt="Input video"
                      width={400}
                      height={400}
                      className="rounded-lg object-cover w-full"
                    />
                  ) : (
                    <div className="bg-muted/30 rounded-lg h-64 flex items-center justify-center">
                      <Loader className="h-6 w-6 animate-spin" />
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-2">
                <h4 className="font-medium">Input Parameters</h4>
                <div className="bg-muted/50 p-3 rounded-lg text-sm">
                  <pre className="whitespace-pre-wrap">
                    {JSON.stringify(part.input, null, 2)}
                  </pre>
                </div>
              </div>
            </div>

            {/* Output Section */}
            <div className="space-y-4">
              <h3 className="font-semibold">Generated Video</h3>
              {derivedFinished && jobVideoUrl ? (
                <div className="relative">
                  <video
                    muted
                    loop
                    autoPlay
                    controls
                    src={jobVideoUrl}
                    width={400}
                    height={400}
                    className="rounded-lg object-cover w-full"
                  />
                  <div className="absolute top-2 right-2">
                    <Button
                      size="sm"
                      onClick={() =>
                        downloadByUrl(
                          jobVideoUrl,
                          `product-video-${Date.now()}.png`
                        )
                      }
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="bg-muted/30 rounded-lg h-64 flex items-center justify-center">
                  <span className="text-muted-foreground">
                    {derivedProcessing
                      ? "Generating..."
                      : derivedError
                        ? "Failed"
                        : "No video available"}
                  </span>
                </div>
              )}

              <div className="space-y-2">
                <h4 className="font-medium">Output Information</h4>
                <div className="bg-muted/50 p-3 rounded-lg text-sm">
                  <pre className="whitespace-pre-wrap">
                    {JSON.stringify(
                      {
                        requestId,
                        jobStatus,
                        video_url: jobVideoUrl,
                        error_message: jobErrorMessage,
                      },
                      null,
                      2
                    )}
                  </pre>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Status</h4>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      derivedError
                        ? "destructive"
                        : derivedFinished
                          ? "default"
                          : "secondary"
                    }
                  >
                    {jobStatus || part.state}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default VideoFromImageToolPart;
