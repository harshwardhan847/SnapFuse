"use client";

import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { seoContentSchema } from "@/ai/schema";
import { SetStateAction } from "react";
import { toast } from "sonner";
import { seoFormSchema } from "@/app/api/seo/route";

export function SeoForm({
  setResults,
  setIsLoading,
}: {
  setResults: React.Dispatch<
    SetStateAction<z.infer<typeof seoContentSchema> | null>
  >;
  setIsLoading: React.Dispatch<SetStateAction<boolean>>;
}) {
  const form = useForm<z.infer<typeof seoFormSchema>>({
    resolver: zodResolver(seoFormSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  async function onSubmit(values: z.infer<typeof seoFormSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
    setResults(null);
    setIsLoading(true);
    try {
      const res = await fetch("/api/seo", {
        method: "POST",
        body: JSON.stringify(values),
      });
      const data = await res.json();
      setResults(data);
      form.reset();
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Textarea
                  disabled={form.formState.isSubmitting}
                  placeholder="Name of product"
                  className="min-h-[50px]"
                  cols={2}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  disabled={form.formState.isSubmitting}
                  rows={24}
                  className="max-h-[200px] min-h-[100px]"
                  placeholder="description of product"
                  {...field}
                />
              </FormControl>
              <FormDescription>Describe your product in detail</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={form.formState.isSubmitting}>
          Submit
        </Button>
      </form>
    </Form>
  );
}
