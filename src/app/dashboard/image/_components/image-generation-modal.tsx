"use client";
import React, { useRef, useState } from "react";

import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader, Wand2, Sparkles, Zap, Loader2 } from "lucide-react";
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
};

const ImageGenerationModal = ({ userId }: Props) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [inputStorageId, setInputStorageId] = useState<string | null>(null);
  const [isPrompting, setIsPrompting] = useState(false);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [advStyle, setAdvStyle] = useState<string>("");
  const [advCreativity, setAdvCreativity] = useState<
    "high" | "medium" | "low" | ""
  >("");
  const [advDetailLevel, setAdvDetailLevel] = useState<
    "ultra" | "high" | "medium" | ""
  >("");
  const [advBackground, setAdvBackground] = useState<string>("");
  const [advUpscale, setAdvUpscale] = useState<boolean>(false);
  const [showInsufficientCredits, setShowInsufficientCredits] = useState(false);

  const { canAfford, getCreditCostForAction } = useCredits();
  const requiredCredits = getCreditCostForAction("IMAGE_GENERATION");

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

  async function generateImage(imageUrl: string, prompt: string) {
    // Check credits before processing
    if (!canAfford("IMAGE_GENERATION")) {
      setShowInsufficientCredits(true);
      return;
    }

    setIsProcessing(true);
    try {
      const response = await fetch("/api/generate-image", {
        method: "POST",
        body: JSON.stringify({ imageUrl, prompt, userId, inputStorageId }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();

      if (!response.ok) {
        if (response.status === 402) {
          setShowInsufficientCredits(true);
          return;
        }
        throw new Error(data.error || "Failed to generate image");
      }

      if (data.status === "processing") {
        toast.success(
          `Image generation started! ${data.creditsDeducted} credit deducted. ${data.remainingCredits} credits remaining.`
        );
      } else {
        toast.error("Error occurred during generation.");
        console.error("Error occurred during generation.");
      }
    } catch (error: any) {
      console.error("Image generation error:", error);
      if (error.message?.includes("Insufficient credits")) {
        setShowInsufficientCredits(true);
      } else {
        toast.error(error.message || "Failed to generate image");
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
          style: advStyle || undefined,
          creativity: (advCreativity as any) || undefined,
          detailLevel: (advDetailLevel as any) || undefined,
          background: advBackground || undefined,
          upscale: advUpscale || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      form.setValue("prompt", data.prompt || "", { shouldDirty: true });
      toast.success(userPrompt ? "Prompt improved" : "Prompt generated");
    } catch (e) {
      toast.error("Failed to generate prompt");
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
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild className="self-end">
        <Button>Generate Image</Button>
      </DialogTrigger>
      <Form {...form}>
        <DialogContent className="sm:max-w-[600px]">
          <form
            onSubmit={form.handleSubmit(async (values) => {
              await generateImage(values.imageUrl, values.prompt);
              setIsDialogOpen(false);
              form.reset();
              setPreviewUrl(null);
            })}
          >
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                Generate Image
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Zap className="h-4 w-4 text-yellow-500" />
                  {requiredCredits} credit
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
                    <FormLabel>Prompt</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Textarea
                          rows={6}
                          className="max-h-32"
                          placeholder="Describe what to generate..."
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
                            title="Auto-generate prompt"
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
                            title="Improve current prompt"
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
                  Advanced options
                  <span className="text-xs text-muted-foreground">
                    {advancedOpen ? "Hide" : "Show"}
                  </span>
                </button>
                {advancedOpen && (
                  <div className="p-3 grid gap-3">
                    <div>
                      <label className="text-sm">Style</label>
                      <Input
                        placeholder="e.g. cinematic, studio, minimal"
                        value={advStyle}
                        onChange={(e) => setAdvStyle(e.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      <div>
                        <label className="text-sm">Creativity</label>
                        <select
                          className="mt-1 block w-full rounded-md border bg-transparent px-3 py-2 text-sm"
                          value={advCreativity}
                          onChange={(e) =>
                            setAdvCreativity(e.target.value as any)
                          }
                        >
                          <option value="">Auto</option>
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm">Detail level</label>
                        <select
                          className="mt-1 block w-full rounded-md border bg-transparent px-3 py-2 text-sm"
                          value={advDetailLevel}
                          onChange={(e) =>
                            setAdvDetailLevel(e.target.value as any)
                          }
                        >
                          <option value="">Auto</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                          <option value="ultra">Ultra</option>
                        </select>
                      </div>
                      <div className="flex items-end gap-2">
                        <input
                          id="adv-upscale"
                          type="checkbox"
                          className="size-4"
                          checked={advUpscale}
                          onChange={(e) => setAdvUpscale(e.target.checked)}
                        />
                        <label htmlFor="adv-upscale" className="text-sm">
                          Upscale
                        </label>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm">Background</label>
                      <Input
                        placeholder="e.g. studio background, beach, marble table"
                        value={advBackground}
                        onChange={(e) => setAdvBackground(e.target.value)}
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
                  !canAfford("IMAGE_GENERATION")
                }
              >
                {isProcessing || form.formState.isSubmitting ? (
                  <>
                    <Loader2
                      size={14}
                      className="animate-spin text-primary mr-2"
                    />
                    Generating
                  </>
                ) : !canAfford("IMAGE_GENERATION") ? (
                  "Insufficient Credits"
                ) : (
                  "Generate"
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
        action="image generation"
      />
    </Dialog>
  );
};

export default ImageGenerationModal;
