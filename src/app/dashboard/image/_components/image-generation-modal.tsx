"use client";
import React, { useState } from "react";

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
type Props = {
  userId: string;
};

const ImageGenerationModal = ({ userId }: Props) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

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
      body: JSON.stringify({ imageUrl, prompt, userId }),
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
                    <FormLabel>Image URL</FormLabel>
                    <FormControl>
                      <Input
                        type="url"
                        placeholder="https://example.com/image.jpg"
                        disabled={isProcessing || form.formState.isSubmitting}
                        {...field}
                      />
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
                        disabled={isProcessing || form.formState.isSubmitting}
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
                  disabled={isProcessing || form.formState.isSubmitting}
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                disabled={isProcessing || form.formState.isSubmitting}
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
