import React, { useEffect, useRef, useState } from "react";
import { Markdown } from "@/components/markdown";
import { UIMessage } from "ai";
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
  const isComplete =
    part.state === "done" && part.output?.status === "processing";
  const isFinished = part.state === "done" && part.output?.status === "done";

  // Extract storage IDs from the tool input/output
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
  const outputImageUrl = useQuery(
    api.images.getStorageUrl,
    outputStorageId ? { storageId: outputStorageId as any } : "skip"
  );

  const downloadImage = async (storageId: string, filename: string) => {
    const url = await fetch(`/api/get-image-url?storageId=${storageId}`)
      .then((res) => res.json())
      .then((data) => data.imageUrl);
    if (!url) return;

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

          {/* Output Image */}
          <div className="relative">
            <div className="relative w-32 h-32 rounded-lg overflow-hidden bg-muted/30 flex items-center justify-center">
              {isFinished && outputStorageId && outputImageUrl ? (
                <>
                  <Image
                    src={outputImageUrl}
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
                      downloadImage(
                        outputStorageId,
                        `product-image-${Date.now()}.png`
                      )
                    }
                    className="absolute top-1 right-1 h-6 w-6 p-0"
                  >
                    <Download className="h-3 w-3" />
                  </Button>
                </>
              ) : isProcessing ? (
                <div className="flex flex-col items-center gap-2">
                  <Loader className="h-6 w-6 animate-spin" />
                  <span className="text-xs text-muted-foreground">
                    Generating...
                  </span>
                </div>
              ) : hasError ? (
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
        {isProcessing && (
          <div className="text-sm text-muted-foreground mt-3">
            Generating your product image... This may take a few moments.
          </div>
        )}

        {hasError && (
          <div className="text-sm text-red-600 mt-3">
            Error: {part.output?.error || "Failed to generate image"}
          </div>
        )}

        {isComplete && (
          <div className="text-sm text-green-600 mt-3">
            Image generation started! Check your image gallery for the result.
          </div>
        )}

        {isFinished && (
          <div className="text-sm text-green-600 mt-3">
            Image generation completed!
          </div>
        )}

        {part.output?.requestId && (
          <div className="text-xs text-muted-foreground mt-2">
            Request ID: {part.output.requestId}
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
              {isFinished && outputStorageId ? (
                <div className="relative">
                  {outputImageUrl ? (
                    <Image
                      src={outputImageUrl}
                      alt="Generated image"
                      width={400}
                      height={400}
                      className="rounded-lg object-cover w-full"
                    />
                  ) : (
                    <div className="bg-muted/30 rounded-lg h-64 flex items-center justify-center">
                      <Loader className="h-6 w-6 animate-spin" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <Button
                      size="sm"
                      onClick={() =>
                        downloadImage(
                          outputStorageId,
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
                    {isProcessing ? "Generating..." : "No image available"}
                  </span>
                </div>
              )}

              <div className="space-y-2">
                <h4 className="font-medium">Output Information</h4>
                <div className="bg-muted/50 p-3 rounded-lg text-sm">
                  <pre className="whitespace-pre-wrap">
                    {JSON.stringify(part.output, null, 2)}
                  </pre>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Status</h4>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      hasError
                        ? "destructive"
                        : isFinished
                          ? "default"
                          : "secondary"
                    }
                  >
                    {part.state}
                  </Badge>
                  {part.output?.status && (
                    <Badge
                      variant={
                        hasError
                          ? "destructive"
                          : isFinished
                            ? "default"
                            : "secondary"
                      }
                    >
                      {part.output.status}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

const ImageGenerationToolPart = ({ part }: { part: any }) => {
  const isProcessing = part.state === "processing" || part.state === "pending";
  const hasError = part.state === "error" || part.output?.status === "failed";
  const isComplete =
    part.state === "done" && part.output?.status === "processing";

  return (
    <div className="p-4 bg-muted/50 rounded-lg">
      <div className="flex items-center gap-2 mb-3">
        <Badge variant="outline">Image Generation</Badge>
        {isProcessing && <Loader className="h-4 w-4 animate-spin" />}
      </div>

      {isProcessing && (
        <div className="text-sm text-muted-foreground">
          Generating your image... This may take a few moments.
        </div>
      )}

      {hasError && (
        <div className="text-sm text-red-600">
          Error: {part.output?.error || "Failed to generate image"}
        </div>
      )}

      {isComplete && (
        <div className="text-sm text-green-600">
          Image generation started! Check your image gallery for the result.
        </div>
      )}

      {part.output?.requestId && (
        <div className="text-xs text-muted-foreground mt-2">
          Request ID: {part.output.requestId}
        </div>
      )}
    </div>
  );
};

const ToolPart = ({ part }: { part: any }) => {
  // Handle specific tool types
  if (part.type === "tool-generateSeoReadyContent") {
    return (
      <div className="w-full mt-4">
        <SeoContent
          data={part.output as z.infer<typeof seoContentSchema> | null}
          isLoading={part.state !== "output-available"}
        />
      </div>
    );
  }

  // Handle product image generation tool
  if (part.type === "tool-generateProductImageTool") {
    return <ProductImageGenerationPart part={part} />;
  }

  // Handle other image generation tools
  if (part.type === "tool-generatePromptFromImageTool") {
    return <ImageGenerationToolPart part={part} />;
  }

  // Default tool fallback
  return (
    <div className="p-3 bg-muted/50 rounded-lg">
      <Badge variant="outline" className="mb-2">
        {part.type}
      </Badge>
      <pre className="text-xs overflow-auto">
        {JSON.stringify(part, null, 2)}
      </pre>
    </div>
  );
};

const MessagePart = ({ part }: { part: any }) => {
  switch (part.type) {
    case "text":
      return <TextPart text={part.text} />;
    case "image":
      return <ImagePart storageId={part.storage_id} />;
    default:
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

const MessagesList = ({ messages }: { messages: UIMessage[] }) => {
  const messageEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Find the latest assistant message
  const lastAssistantMsgId = [...messages]
    .reverse()
    .find((m) => m.role === "assistant")?.id;

  return (
    <div className="w-full h-full flex-1 flex flex-col pt-4 pb-64 px-8 min-h-auto max-h-screen overflow-auto">
      {messages?.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}
      <div ref={messageEndRef} />
    </div>
  );
};

export default MessagesList;
