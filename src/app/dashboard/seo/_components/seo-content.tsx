import { seoContentSchema } from "@/ai/schema";
import CopyText from "@/components/copy";
import { Markdown } from "@/components/markdown";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { TrendingUp } from "lucide-react";
import React from "react";
import { MarkdownAsync } from "react-markdown";
import z from "zod";

type Props = {
  data: z.infer<typeof seoContentSchema> | null;
  isLoading: boolean;
};

const SeoContent = ({ data, isLoading }: Props) => {
  if (!data) {
    return (
      <Card className="h-min w-full">
        <CardHeader>
          <CardTitle>{isLoading ? "Rank Higher" : "Checklist"}</CardTitle>
          <CardDescription>
            {isLoading
              ? "SEO optimized content for your catalogue."
              : "Things to keep in mind for better generation"}
          </CardDescription>
        </CardHeader>
        {isLoading ? (
          <CardContent className="space-y-8">
            <Skeleton className="w-full h-14" />
            <Skeleton className="w-full h-52" />
            <Skeleton className="w-full h-36" />
          </CardContent>
        ) : (
          <CardContent className="space-y-8">
            <ul className="list-disc">
              <li>Lorem ipsum, dolor sit amet consectetur adipisicing elit.</li>
              <li>
                Odio officiis similique reprehenderit natus at necessitatibus
                nulla!
              </li>
              <li>
                Saepe, beatae repudiandae suscipit provident pariatur animi
                alias!
              </li>
              <li>
                Aliquam reiciendis corporis nesciunt nisi obcaecati sunt eos?
              </li>
              <li>
                Dignissimos dolore perspiciatis ex sequi dolores possimus quasi.
              </li>
              <li>Error, magnam eum unde eligendi et quis inventore!</li>
              <li>
                Voluptatibus alias consequuntur repellat eaque! Deserunt,
                aperiam consequatur.
              </li>
              <li>Quas, nam illo? Quia odio incidunt pariatur officiis.</li>
            </ul>
          </CardContent>
        )}
        <CardFooter></CardFooter>
      </Card>
    );
  }
  const { description, seoScoreBefore, seoScoreNow, tags, title } = data;
  const seoImprovementPercentage =
    ((seoScoreNow - seoScoreBefore) / seoScoreBefore) * 100;
  return (
    <Card className="h-min">
      <CardHeader>
        <CardTitle>Rank Higher</CardTitle>
        <CardDescription>
          SEO optimized content for your catalogue.
        </CardDescription>
        <CardAction>
          <div className="font-semibold">SEO Score: {seoScoreNow}</div>
          <div className="text-green-500 inline-flex text-sm items-center justify-end w-full">
            <TrendingUp className="inline mr-2" size={15} />
            {seoImprovementPercentage?.toFixed(1)}%
          </div>
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-8">
        <FormItem>
          <Label>
            Title <CopyText text={title} />
          </Label>
          <Textarea defaultValue={title} className="min-h-[50px]" cols={2} />
        </FormItem>
        <FormItem>
          <Label>
            Description <CopyText text={description} />
          </Label>

          <div className="max-h-[200px] overflow-y-auto border-input dark:bg-input/30 field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm">
            <Markdown>{description}</Markdown>
          </div>
        </FormItem>
      </CardContent>
      <CardFooter>
        <FormItem>
          <Label>
            Tags <CopyText text={tags?.join(", ")} />
          </Label>
          <div className="gap-2 flex w-full flex-wrap">
            {tags?.map((val) => <Badge key={val}>{val}</Badge>)}
          </div>
        </FormItem>
      </CardFooter>
    </Card>
  );
};

export default SeoContent;
