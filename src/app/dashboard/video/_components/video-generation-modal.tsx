"use client";
import React, { useRef, useState, useEffect } from "react";

import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader, Wand2, Sparkles, Video, Zap, Loader2 } from "lucide-react";
import { useCredits } from "@/hooks/use-credits";
import { InsufficientCreditsModal } from "@/components/credits/insufficient-credits-modal";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import Image from "next/image";

type Props = {
  userId: string;
  openModal?: boolean;
  onModalClose?: () => void;
};

const VideoGenerationModal = ({
  userId,
  openModal = false,
  onModalClose,
}: Props) => {
  const [isDialogOpen, setIsDialogOpen] = useState(openModal);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [inputStorageId, setInputStorageId] = useState<string | null>(null);
  const [isPrompting, setIsPrompting] = useState(false);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [motionStyle, setMotionStyle] = useState<string>("");
  const [cameraMovement, setCameraMovement] = useState<string>("");
  const [animationType, setAnimationType] = useState<string>("");
  const [duration, setDuration] = useState<"5" | "10">("5");
  const [negativePrompt, setNegativePrompt] = useState<string>(
    "blur, distort, and low quality"
  );
  const [cfgScale, setCfgScale] = useState<number>(0.5);
  const [showInsufficientCredits, setShowInsufficientCredits] = useState(false);

  const { canAfford, getCreditCostForAction } = useCredits();
  const requiredCredits = getCreditCostForAction("VIDEO_GENERATION");

  const formSchema = z.object({
    imageUrl: z.string().url({ message: "Please enter a valid image URL" }),
    prompt: z
      .string()
      .min(5, { message: "Prompt should be at least 5 characters" })
      .max(2000, { message: "Prompt should be under 2000 characters" }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { imageUrl: "", prompt: "" },
  });

  // Handle external modal opening and pre-filled data
  useEffect(() => {
    if (openModal) {
      setIsDialogOpen(true);

      // Check for pre-filled image data from sessionStorage
      const storedImageData = sessionStorage.getItem("videoGenerationImage");
      if (storedImageData) {
        try {
          const imageData = JSON.parse(storedImageData);

          // Set form values
          if (imageData.imageUrl) {
            form.setValue("imageUrl", imageData.imageUrl);
            setPreviewUrl(imageData.imageUrl);
          }

          if (imageData.storageId) {
            setInputStorageId(imageData.storageId);
          }

          if (imageData.prompt) {
            // Generate a video-specific prompt based on the image prompt
            const videoPrompt = `Create a dynamic video animation of: ${imageData.prompt}. Add smooth motion and cinematic effects.`;
            form.setValue("prompt", videoPrompt);
          }

          // Clear the stored data
          sessionStorage.removeItem("videoGenerationImage");
        } catch (error) {
          console.error("Error parsing stored image data:", error);
        }
      }
    }
  }, [openModal, form]);

  // Handle modal close
  const handleModalClose = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open && onModalClose) {
      onModalClose();
    }
  };

  async function generateVideo(imageUrl: string, prompt: string) {
    // Check credits before processing
    if (!canAfford("VIDEO_GENERATION")) {
      setShowInsufficientCredits(true);
      return;
    }

    setIsProcessing(true);
    try {
      const response = await fetch("/api/generate-video", {
        method: "POST",
        body: JSON.stringify({
          prompt,
          userId,
          inputStorageId,
          imageUrl,
          duration,
          negative_prompt: negativePrompt,
          cfg_scale: cfgScale,
        }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();

      if (!response.ok) {
        if (response.status === 402) {
          setShowInsufficientCredits(true);
          return;
        }
        throw new Error(data.error || "Failed to generate video");
      }

      if (data.status === "processing") {
        toast.success(
          `Video generation started! ${data.creditsDeducted} credits deducted. ${data.remainingCredits} credits remaining.`
        );
      } else {
        toast.error("Error occurred during video generation.");
        console.error("Error occurred during video generation.");
      }
    } catch (error: any) {
      console.error("Video generation error:", error);
      if (error.message?.includes("Insufficient credits")) {
        setShowInsufficientCredits(true);
      } else {
        toast.error(error.message || "Failed to generate video");
      }
    } finally {
      setIsProcessing(false);
    }
  }

  async function handleGenerateOrImprovePrompt() {
    try {
      const image = form.getValues("imageUrl");
      const userPrompt = form.getValues("prompt");
      if (!image) {
        toast.error("Upload an input image first");
        return;
      }
      setIsPrompting(true);
      const res = await fetch("/api/get-prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image,
          userPrompt: userPrompt || undefined,
          motionStyle: motionStyle || undefined,
          cameraMovement: cameraMovement || undefined,
          animationType: animationType || undefined,
          duration: duration || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      form.setValue("prompt", data.prompt || "", { shouldDirty: true });
      toast.success(
        userPrompt ? "Video prompt improved" : "Video prompt generated"
      );
    } catch (e) {
      toast.error("Failed to generate video prompt");
    } finally {
      setIsPrompting(false);
    }
  }

  async function uploadToConvex(file: File) {
    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Upload failed");
      }
      const data = await res.json();
      const url = data.url as string;
      const storageId = (data.storageId as string) || null;
      form.setValue("imageUrl", url, {
        shouldValidate: true,
        shouldDirty: true,
      });
      setPreviewUrl(url);
      setInputStorageId(storageId);
      toast.success("Image uploaded");
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please drop an image file");
        return;
      }
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      uploadToConvex(file);
    }
  }

  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
  }

  function handleFilePick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      uploadToConvex(file);
    }
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleModalClose}>
      <DialogTrigger asChild className="self-end">
        <Button>
          <Video className="mr-2 h-4 w-4" />
          Generate Video
        </Button>
      </DialogTrigger>
      <Form {...form}>
        <DialogContent className="sm:max-w-[600px]">
          <form
            onSubmit={form.handleSubmit(async (values) => {
              await generateVideo(values.imageUrl, values.prompt);
              setIsDialogOpen(false);
              form.reset();
              setPreviewUrl(null);
            })}
          >
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                Generate Video from Image
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Zap className="h-4 w-4 text-yellow-500" />
                  {requiredCredits} credits
                </div>
              </DialogTitle>
            </DialogHeader>

            <div className="grid gap-4 my-4">
              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Input Image</FormLabel>
                    <FormControl>
                      <div>
                        <div
                          onDrop={handleDrop}
                          onDragOver={handleDragOver}
                          onClick={() => fileInputRef.current?.click()}
                          className="flex flex-col min-h-40 items-center justify-center gap-2 border border-dashed rounded-md p-6 text-center cursor-pointer hover:bg-muted/40"
                        >
                          {previewUrl ? (
                            <Image
                              width={500}
                              height={500}
                              src={previewUrl}
                              alt="Preview"
                              className="max-h-40 w-auto object-contain rounded"
                            />
                          ) : (
                            <>
                              <span className="text-sm text-muted-foreground">
                                Drag & drop an image here, or click to select
                              </span>
                            </>
                          )}
                          {isUploading && (
                            <div className="mt-2 text-xs text-muted-foreground">
                              Uploading...
                            </div>
                          )}
                        </div>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleFilePick}
                        />
                        <input
                          type="text"
                          readOnly
                          value={field.value}
                          onChange={field.onChange}
                          className="mt-2 w-full hidden rounded-md border bg-muted/40 px-3 py-2 text-sm text-muted-foreground"
                          placeholder="Image URL will appear here after upload"
                          disabled
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="prompt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Video Prompt</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Textarea
                          rows={6}
                          className="max-h-32"
                          placeholder="Describe the video animation and motion you want..."
                          disabled={
                            isProcessing ||
                            form.formState.isSubmitting ||
                            isUploading ||
                            isPrompting
                          }
                          {...field}
                        />
                        <div className="absolute bottom-2 right-2 flex items-center gap-2">
                          <Button
                            type="button"
                            size="sm"
                            variant="secondary"
                            onClick={handleGenerateOrImprovePrompt}
                            disabled={
                              isProcessing ||
                              isUploading ||
                              isPrompting ||
                              !form.getValues("imageUrl")
                            }
                            title="Auto-generate video prompt"
                          >
                            {isPrompting ? (
                              <Loader2
                                size={14}
                                className="animate-spin text-primary"
                              />
                            ) : (
                              <Sparkles size={16} />
                            )}
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="secondary"
                            onClick={handleGenerateOrImprovePrompt}
                            disabled={
                              isProcessing ||
                              isUploading ||
                              isPrompting ||
                              !form.getValues("imageUrl")
                            }
                            title="Improve current video prompt"
                          >
                            {isPrompting ? (
                              <Loader2
                                size={14}
                                className="animate-spin text-primary"
                              />
                            ) : (
                              <Wand2 size={16} />
                            )}
                          </Button>
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="border rounded-md">
                <button
                  type="button"
                  onClick={() => setAdvancedOpen((v) => !v)}
                  className="w-full flex items-center justify-between px-3 py-2 text-sm"
                >
                  Advanced video options
                  <span className="text-xs text-muted-foreground">
                    {advancedOpen ? "Hide" : "Show"}
                  </span>
                </button>
                {advancedOpen && (
                  <div className="p-3 grid gap-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="text-sm">Duration</label>
                        <select
                          className="mt-1 block w-full rounded-md border bg-transparent px-3 py-2 text-sm"
                          value={duration}
                          onChange={(e) =>
                            setDuration(e.target.value as "5" | "10")
                          }
                        >
                          <option value="5">5 seconds</option>
                          <option value="10">10 seconds</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm">
                          CFG Scale (Creativity)
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.1"
                          value={cfgScale}
                          onChange={(e) =>
                            setCfgScale(parseFloat(e.target.value))
                          }
                          className="mt-1 block w-full"
                        />
                        <span className="text-xs text-muted-foreground">
                          {cfgScale}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      <div>
                        <label className="text-sm">Motion Style</label>
                        <select
                          className="mt-1 block w-full rounded-md border bg-transparent px-3 py-2 text-sm"
                          value={motionStyle}
                          onChange={(e) => setMotionStyle(e.target.value)}
                        >
                          <option value="">Auto</option>
                          <option value="subtle">Subtle</option>
                          <option value="dynamic">Dynamic</option>
                          <option value="cinematic">Cinematic</option>
                          <option value="smooth">Smooth</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm">Camera Movement</label>
                        <select
                          className="mt-1 block w-full rounded-md border bg-transparent px-3 py-2 text-sm"
                          value={cameraMovement}
                          onChange={(e) => setCameraMovement(e.target.value)}
                        >
                          <option value="">Auto</option>
                          <option value="none">None</option>
                          <option value="pan">Pan</option>
                          <option value="zoom">Zoom</option>
                          <option value="tilt">Tilt</option>
                          <option value="dolly">Dolly</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm">Animation Type</label>
                        <select
                          className="mt-1 block w-full rounded-md border bg-transparent px-3 py-2 text-sm"
                          value={animationType}
                          onChange={(e) => setAnimationType(e.target.value)}
                        >
                          <option value="">Auto</option>
                          <option value="natural">Natural</option>
                          <option value="artistic">Artistic</option>
                          <option value="commercial">Commercial</option>
                          <option value="lifestyle">Lifestyle</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm">Negative Prompt</label>
                      <Input
                        placeholder="Elements to avoid in the video"
                        value={negativePrompt}
                        onChange={(e) => setNegativePrompt(e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button
                  variant="outline"
                  type="button"
                  disabled={
                    isProcessing || form.formState.isSubmitting || isUploading
                  }
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                disabled={
                  isProcessing ||
                  form.formState.isSubmitting ||
                  isUploading ||
                  !form.getValues("imageUrl") ||
                  !canAfford("VIDEO_GENERATION")
                }
              >
                {isProcessing || form.formState.isSubmitting ? (
                  <>
                    <Loader2
                      size={14}
                      className="animate-spin text-primary mr-2"
                    />
                    Generating Video
                  </>
                ) : !canAfford("VIDEO_GENERATION") ? (
                  "Insufficient Credits"
                ) : (
                  <>
                    <Video size={14} className="mr-2" />
                    Generate Video
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Form>

      <InsufficientCreditsModal
        open={showInsufficientCredits}
        onOpenChange={setShowInsufficientCredits}
        requiredCredits={requiredCredits}
        action="video generation"
      />
    </Dialog>
  );
};

export default VideoGenerationModal;
