"use client";
import React, { useState } from "react";
import { SeoForm } from "./_components/seo-form";
import SeoContent from "./_components/seo-content";
import z from "zod";
import { seoContentSchema } from "@/ai/schema";

const SeoPage = () => {
  const [results, setResults] = useState<z.infer<
    typeof seoContentSchema
  > | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  return (
    <div className="flex items-start justify-center flex-1 p-4 flex-col gap-12">
      <div className="px-2 sm:px-0">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Generate Content
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Generate SEO ready title, description and tags to rank higher in
          search.
        </p>
      </div>
      <div className="grid md:grid-cols-2 gap-4 w-full md:max-w-6xl">
        <SeoForm setResults={setResults} setIsLoading={setIsLoading} />

        <SeoContent data={results} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default SeoPage;
