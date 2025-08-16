import React, { useEffect, useRef, useState } from "react";
import { Markdown } from "@/components/markdown";
import {
  DataUIPart,
  FileUIPart,
  ReasoningUIPart,
  TextUIPart,
  ToolCallPart,
  ToolUIPart,
  UIDataTypes,
  UIMessage,
  UIMessagePart,
  UITools,
} from "ai";
import SeoContent from "@/app/dashboard/seo/_components/seo-content";
import { seoContentSchema } from "@/ai/schema";
import z from "zod";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, ExternalLink, Loader, Info } from "lucide-react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useQuery } from "convex/react";
import { api } from "../../../../../../convex/_generated/api";
import CopyText from "@/components/copy";
import VideoFromImageToolPart from "./parts/video-from-image-tool-part";

// Message part components
const TextPart = ({ text }: { text: string }) => <Markdown>{text}</Markdown>;

const ImagePart = ({ storageId }: { storageId: string }) => {
  const imageUrl = useQuery(api.images.getStorageUrl, {
    storageId: storageId as any,
  });

  const downloadImage = async () => {
    if (!imageUrl) return;
    try {
      const res = await fetch(imageUrl);
      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = objectUrl;
      a.download = `image-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(objectUrl);
    } catch {
      // ignore
    }
  };

  if (!imageUrl) {
    return (
      <div className="flex flex-col gap-2">
        <div className="relative max-w-md">
          <div className="w-96 h-64 bg-muted/30 rounded-lg flex items-center justify-center">
            <Loader className="h-6 w-6 animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="relative max-w-md">
        <Image
          src={imageUrl}
          alt="Message attachment"
          width={400}
          height={400}
          className="rounded-lg object-cover"
        />
        <div className="absolute top-2 right-2 flex gap-1">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => window.open(imageUrl, "_blank")}
            className="h-8 w-8 p-0"
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={downloadImage}
            className="h-8 w-8 p-0"
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

const ProductImageGenerationPart = ({ part }: { part: any }) => {
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

  // Get image URLs using storage IDs
  const inputImageUrl = useQuery(
    api.images.getStorageUrl,
    inputStorageId ? { storageId: inputStorageId as any } : "skip"
  );

  // Fetch job by requestId to show generated output image and status
  const job = useQuery(
    api.images.getImageJobByRequestId,
    requestId ? { request_id: requestId } : "skip"
  );

  const jobStatus: string | undefined = job?.status as any;
  const jobImageUrl: string | null = (job?.image_url as string) || null;
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
          <Badge variant="outline">Product Image Generation</Badge>
          {derivedProcessing && <Loader className="h-4 w-4 animate-spin" />}
        </div>

        <div className="flex gap-4">
          {/* Input Image */}
          {inputStorageId && (
            <div className="relative">
              <div className="relative w-32 h-32 rounded-lg overflow-hidden">
                {inputImageUrl ? (
                  <Image
                    src={inputImageUrl}
                    alt="Input image"
                    width={128}
                    height={128}
                    className={`object-cover w-full h-full ${
                      derivedProcessing ? "blur-sm" : ""
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

          {/* Output Image */}
          <div className="relative">
            <div className="relative w-32 h-32 rounded-lg overflow-hidden bg-muted/30 flex items-center justify-center">
              {derivedFinished && jobImageUrl ? (
                <>
                  <Image
                    src={jobImageUrl}
                    alt="Generated image"
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
                        jobImageUrl,
                        `product-image-${Date.now()}.png`
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
            Generating your product image... This may take a few moments.
          </div>
        )}

        {derivedError && (
          <div className="text-sm text-red-600 mt-3">
            Error:{" "}
            {jobErrorMessage ||
              part.output?.error ||
              "Failed to generate image"}
          </div>
        )}

        {derivedFinished && (
          <div className="text-sm text-green-600 mt-3">
            Image generation completed!
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

      {/* Modal with all image information */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[90vw] max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Product Image Generation Details</DialogTitle>
            <DialogDescription>
              Complete information about the image generation process
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Input Section */}
            <div className="space-y-4">
              <h3 className="font-semibold">Input Image</h3>
              {inputStorageId && (
                <div className="relative">
                  {inputImageUrl ? (
                    <Image
                      src={inputImageUrl}
                      alt="Input image"
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
              <h3 className="font-semibold">Generated Image</h3>
              {derivedFinished && jobImageUrl ? (
                <div className="relative">
                  <Image
                    src={jobImageUrl}
                    alt="Generated image"
                    width={400}
                    height={400}
                    className="rounded-lg object-cover w-full"
                  />
                  <div className="absolute top-2 right-2">
                    <Button
                      size="sm"
                      onClick={() =>
                        downloadByUrl(
                          jobImageUrl,
                          `product-image-${Date.now()}.png`
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
                        : "No image available"}
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
                        image_url: jobImageUrl,
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

const PromptFromImageToolPart = ({ part }: { part: any }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isProcessing = part.state === "processing" || part.state === "pending";
  const hasError = part.state === "error";
  const isReady = part.state === "output-available" || part.state === "done";

  const inputStorageId: string | undefined = part.input?.inputStorageId;
  const inputImageUrl = useQuery(
    api.images.getStorageUrl,
    inputStorageId ? { storageId: inputStorageId as any } : "skip"
  );

  const promptText: string | null =
    typeof part.output === "string"
      ? part.output
      : typeof part.output?.text === "string"
        ? part.output.text
        : null;

  return (
    <>
      <div className="p-4 bg-muted/50 rounded-lg">
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="outline">Prompt from Image</Badge>
          {isProcessing && <Loader className="h-4 w-4 animate-spin" />}
        </div>

        <div className="flex gap-4">
          {/* Input Image */}
          {inputStorageId && (
            <div className="relative">
              <div className="relative w-32 h-32 rounded-lg overflow-hidden">
                {inputImageUrl ? (
                  <Image
                    src={inputImageUrl}
                    alt="Input image"
                    width={128}
                    height={128}
                    className={`object-cover w-full h-full ${
                      isProcessing ? "blur-sm" : ""
                    }`}
                  />
                ) : (
                  <div className="w-full h-full bg-muted/30 flex items-center justify-center">
                    <Loader className="h-4 w-4 animate-spin" />
                  </div>
                )}
                {isProcessing && (
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

          {/* Prompt Output */}
          <div className="flex-1 min-w-0">
            {hasError ? (
              <div className="text-sm text-red-600">
                Failed to generate prompt.
              </div>
            ) : isProcessing ? (
              <div className="text-sm text-muted-foreground">
                Generating prompt...
              </div>
            ) : isReady && promptText ? (
              <div className="bg-background rounded-lg border p-3 relative">
                <pre className="whitespace-pre-wrap break-words text-sm max-h-60 overflow-auto">
                  {promptText}
                </pre>
                <div className="absolute top-2 right-2">
                  <CopyText text={promptText} />
                </div>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">
                Waiting for output...
              </div>
            )}
          </div>
        </div>

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

      {/* Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[90vw] max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Prompt From Image - Details</DialogTitle>
            <DialogDescription>
              All inputs and the generated prompt
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Input Section */}
            <div className="space-y-4">
              <h3 className="font-semibold">Input Image</h3>
              {inputStorageId ? (
                <div className="relative">
                  {inputImageUrl ? (
                    <Image
                      src={inputImageUrl}
                      alt="Input image"
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
              ) : (
                <div className="text-sm text-muted-foreground">
                  No input image
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
              <h3 className="font-semibold">Generated Prompt</h3>
              {promptText ? (
                <div className="relative bg-background rounded-lg border p-3">
                  <pre className="whitespace-pre-wrap break-words text-sm max-h-[60vh] overflow-auto">
                    {promptText}
                  </pre>
                  <div className="absolute top-2 right-2">
                    <CopyText text={promptText} />
                  </div>
                </div>
              ) : (
                <div className="bg-muted/30 rounded-lg h-64 flex items-center justify-center">
                  <span className="text-muted-foreground">
                    {isProcessing ? "Generating..." : "No prompt available"}
                  </span>
                </div>
              )}

              <div className="space-y-2">
                <h4 className="font-medium">Status</h4>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      hasError
                        ? "destructive"
                        : isReady
                          ? "default"
                          : "secondary"
                    }
                  >
                    {part.state}
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

const PromptFromImageForVideoToolPart = ({ part }: { part: any }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isProcessing = part.state === "processing" || part.state === "pending";
  const hasError = part.state === "error";
  const isReady = part.state === "output-available" || part.state === "done";

  const inputStorageId: string | undefined = part.input?.inputStorageId;
  const inputImageUrl = useQuery(
    api.images.getStorageUrl,
    inputStorageId ? { storageId: inputStorageId as any } : "skip"
  );

  const promptText: string | null =
    typeof part.output === "string"
      ? part.output
      : typeof part.output?.text === "string"
        ? part.output.text
        : null;

  return (
    <>
      <div className="p-4 bg-muted/50 rounded-lg">
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="outline">Prompt from Image</Badge>
          {isProcessing && <Loader className="h-4 w-4 animate-spin" />}
        </div>

        <div className="flex gap-4">
          {/* Input Image */}
          {inputStorageId && (
            <div className="relative">
              <div className="relative w-32 h-32 rounded-lg overflow-hidden">
                {inputImageUrl ? (
                  <Image
                    src={inputImageUrl}
                    alt="Input image"
                    width={128}
                    height={128}
                    className={`object-cover w-full h-full ${
                      isProcessing ? "blur-sm" : ""
                    }`}
                  />
                ) : (
                  <div className="w-full h-full bg-muted/30 flex items-center justify-center">
                    <Loader className="h-4 w-4 animate-spin" />
                  </div>
                )}
                {isProcessing && (
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

          {/* Prompt Output */}
          <div className="flex-1 min-w-0">
            {hasError ? (
              <div className="text-sm text-red-600">
                Failed to generate prompt.
              </div>
            ) : isProcessing ? (
              <div className="text-sm text-muted-foreground">
                Generating prompt...
              </div>
            ) : isReady && promptText ? (
              <div className="bg-background rounded-lg border p-3 relative">
                <pre className="whitespace-pre-wrap break-words text-sm max-h-60 overflow-auto">
                  {promptText}
                </pre>
                <div className="absolute top-2 right-2">
                  <CopyText text={promptText} />
                </div>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">
                Waiting for output...
              </div>
            )}
          </div>
        </div>

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

      {/* Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[90vw] max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Prompt From Image - Details</DialogTitle>
            <DialogDescription>
              All inputs and the generated prompt
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Input Section */}
            <div className="space-y-4">
              <h3 className="font-semibold">Input Image</h3>
              {inputStorageId ? (
                <div className="relative">
                  {inputImageUrl ? (
                    <Image
                      src={inputImageUrl}
                      alt="Input image"
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
              ) : (
                <div className="text-sm text-muted-foreground">
                  No input image
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
              <h3 className="font-semibold">Generated Prompt</h3>
              {promptText ? (
                <div className="relative bg-background rounded-lg border p-3">
                  <pre className="whitespace-pre-wrap break-words text-sm max-h-[60vh] overflow-auto">
                    {promptText}
                  </pre>
                  <div className="absolute top-2 right-2">
                    <CopyText text={promptText} />
                  </div>
                </div>
              ) : (
                <div className="bg-muted/30 rounded-lg h-64 flex items-center justify-center">
                  <span className="text-muted-foreground">
                    {isProcessing ? "Generating..." : "No prompt available"}
                  </span>
                </div>
              )}

              <div className="space-y-2">
                <h4 className="font-medium">Status</h4>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      hasError
                        ? "destructive"
                        : isReady
                          ? "default"
                          : "secondary"
                    }
                  >
                    {part.state}
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

const ToolPart = ({ part }: { part: any }) => {
  if (part.state === "input-streaming" || part.state === "input-available") {
    return (
      <div className="text-foreground font-semibold text-lg">Thinking...</div>
    );
  }
  if (part.state === "output-error") {
    return <div key={part.toolCallId + part.state}>{part.errorText}</div>;
  }
  switch (part.type) {
    case "tool-generateSeoReadyContent":
      return (
        <SeoContent
          data={part.output as z.infer<typeof seoContentSchema> | null}
          isLoading={part.state !== "output-available"}
        />
      );
    case "tool-generateProductImageTool":
      return <ProductImageGenerationPart part={part} />;
    case "tool-generatePromptFromImageTool":
      return <PromptFromImageToolPart part={part} />;
    case "tool-generatePromptFromImageForVideoTool":
      return <PromptFromImageForVideoToolPart part={part} />;
    case "tool-generateVideoFromImageTool":
      return <VideoFromImageToolPart part={part} />;
    default:
      return (
        <div className="p-3 bg-muted/50 rounded-lg">
          <Badge variant="outline">{part.type}</Badge>
          <pre className="text-xs">{JSON.stringify(part, null, 2)}</pre>
        </div>
      );
  }
};

const MessagePart = ({
  part,
}: {
  part:
    | UIMessagePart<UIDataTypes, UITools>
    | { type: "image"; storage_id: string };
}) => {
  switch (part.type) {
    case "text":
      return <TextPart text={part.text} />;
    case "image":
      return <ImagePart storageId={part.storage_id} />;
    case "reasoning":
      return null;
    // case "step-start":
    //   return "Starting...";
    default:
      if (part.type === "source-document") return null;
      if (part.type === "source-url") return null;
      if (part.type === "dynamic-tool") return null;
      if (part.type === "file") return null;
      if (part.type?.startsWith("data-")) return null;
      if (part.type?.startsWith("tool-")) {
        return <ToolPart part={part} />;
      }
      return null;
  }
};

const MessageBubble = ({ message }: { message: UIMessage }) => {
  const isUser = message.role === "user";

  return (
    <div
      className={`flex items-start mb-4 ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      <Card
        className={`max-w-3xl w-full ${
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-card text-card-foreground"
        }`}
      >
        <CardContent className="p-4">
          <div className="flex flex-col gap-3">
            {message.parts.map((part, index) => (
              <MessagePart key={index} part={part} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const MessagesList = ({
  messages,
  onLoadMore,
  canLoadMore,
  isLoadingMore,
}: {
  messages: UIMessage[];
  onLoadMore?: () => void;
  canLoadMore?: boolean;
  isLoadingMore?: boolean;
}) => {
  const messageEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true);
  const [hasTriggeredLoad, setHasTriggeredLoad] = useState(false);
  const [previousMessageCount, setPreviousMessageCount] = useState(0);
  const [scrollPositionBeforeLoad, setScrollPositionBeforeLoad] = useState<
    number | null
  >(null);
  const [previousScrollHeight, setPreviousScrollHeight] = useState(0);
  const [isInitialRender, setIsInitialRender] = useState(true);

  // Handle scroll position preservation when loading older messages
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    // Initial render - always scroll to bottom
    if (isInitialRender && messages.length > 0) {
      setTimeout(() => {
        messageEndRef.current?.scrollIntoView({ behavior: "instant" });
        setIsInitialRender(false);
      }, 100);
      setPreviousMessageCount(messages.length);
      return;
    }

    // If we just loaded more messages (count increased but we're not at bottom)
    if (
      messages.length > previousMessageCount &&
      scrollPositionBeforeLoad !== null
    ) {
      // Calculate how much the content height increased
      const currentScrollHeight = scrollContainer.scrollHeight;
      const heightDifference = currentScrollHeight - previousScrollHeight;

      // Restore scroll position by adding the height difference
      scrollContainer.scrollTop = scrollPositionBeforeLoad + heightDifference;

      // Reset the stored position
      setScrollPositionBeforeLoad(null);
      setPreviousScrollHeight(0);
    }
    // Only auto-scroll to bottom for new messages when user is near bottom
    else if (messages.length > previousMessageCount && shouldScrollToBottom) {
      messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    setPreviousMessageCount(messages.length);
  }, [
    messages.length,
    previousMessageCount,
    scrollPositionBeforeLoad,
    previousScrollHeight,
    shouldScrollToBottom,
    isInitialRender,
  ]);

  // Handle scroll events to detect when user scrolls to top
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainer;

      // Check if user is near the bottom (within 100px)
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      setShouldScrollToBottom(isNearBottom);

      // Check if user scrolled near the top and can load more (increased distance for better UX)
      if (
        scrollTop < 300 &&
        canLoadMore &&
        !isLoadingMore &&
        !hasTriggeredLoad &&
        onLoadMore
      ) {
        console.log("Loading more messages...");

        // Store current scroll position and height before loading
        setScrollPositionBeforeLoad(scrollTop);
        setPreviousScrollHeight(scrollHeight);

        setHasTriggeredLoad(true);
        onLoadMore();
        // Reset the trigger after a delay
        setTimeout(() => setHasTriggeredLoad(false), 1000);
      }
    };

    scrollContainer.addEventListener("scroll", handleScroll, { passive: true });
    return () => scrollContainer.removeEventListener("scroll", handleScroll);
  }, [canLoadMore, isLoadingMore, hasTriggeredLoad, onLoadMore]);

  // Find the latest assistant message
  const lastAssistantMsgId = [...messages]
    .reverse()
    .find((m) => m.role === "assistant")?.id;

  return (
    <div
      ref={scrollContainerRef}
      className="w-full h-full flex-1 flex flex-col pt-4 pb-64 px-8 min-h-auto max-h-screen overflow-auto"
    >
      {/* Load More Indicator */}
      {(canLoadMore || isLoadingMore) && (
        <div className="flex justify-center py-4">
          {isLoadingMore ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader className="h-4 w-4 animate-spin" />
              Loading older messages...
            </div>
          ) : canLoadMore ? (
            <div className="text-sm text-muted-foreground">
              Scroll up to load older messages
            </div>
          ) : null}
        </div>
      )}

      {messages?.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}
      <div ref={messageEndRef} />
    </div>
  );
};

export default MessagesList;
