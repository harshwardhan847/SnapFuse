"use client";
import React, { useRef, useState } from "react";

import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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

  const formSchema = z.object({
    imageUrl: z.string().url({ message: "Please enter a valid image URL" }),
    prompt: z
      .string()
      .min(5, { message: "Prompt should be at least 5 characters" })
      .max(1000, { message: "Prompt should be under 1000 characters" }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { imageUrl: "", prompt: "" },
  });

  async function generateImage(imageUrl: string, prompt: string) {
    setIsProcessing(true);
    const response = await fetch("/api/generate-image", {
      method: "POST",
      body: JSON.stringify({ imageUrl, prompt, userId, inputStorageId }),
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
    if (data.status === "processing") {
      toast.success("Added to queue");
    } else {
      toast.error("Error occurred during generation.");
      console.error("Error occurred during generation.");
    }
    setIsProcessing(false);
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
              <DialogTitle>Generate Image</DialogTitle>
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
                      <Textarea
                        rows={6}
                        placeholder="Describe what to generate..."
                        disabled={
                          isProcessing ||
                          form.formState.isSubmitting ||
                          isUploading
                        }
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                  !form.getValues("imageUrl")
                }
              >
                {isProcessing || form.formState.isSubmitting ? (
                  <>
                    <Loader size={14} className="animate-spin mr-2" />
                    Generating
                  </>
                ) : (
                  "Generate"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Form>
    </Dialog>
  );
};

export default ImageGenerationModal;
