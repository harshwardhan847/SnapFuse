import CopyText from "@/components/copy";
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
import { Textarea } from "@/components/ui/textarea";
import { TrendingUp } from "lucide-react";
import React from "react";

type Props = {
  title: string;
  description: string;
  tags: string[];
  seoScoreBefore: number;
  seoScoreNow: number;
};

const SeoContent = ({
  seoScoreBefore,
  seoScoreNow,
  description,
  tags,
  title,
}: Props) => {
  const seoImprovementPercentage =
    ((seoScoreNow - seoScoreBefore) / seoScoreBefore) * 100;
  return (
    <Card>
      <CardHeader>
        <CardTitle>Rank Higher</CardTitle>
        <CardDescription>
          SEO optimized content for your catalogue.
        </CardDescription>
        <CardAction>
          <div className="font-semibold">SEO Score: {seoScoreNow}</div>
          <div className="text-green-500 inline-flex text-sm items-center justify-end w-full">
            <TrendingUp className="inline mr-2" size={15} />
            {seoImprovementPercentage}%
          </div>
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-8">
        <FormItem>
          <Label>
            Title <CopyText text={title} />
          </Label>
          <Input defaultValue={title} />
        </FormItem>
        <FormItem>
          <Label>
            Description <CopyText text={description} />
          </Label>
          <Textarea cols={2} className="" defaultValue={description} />
        </FormItem>
      </CardContent>
      <CardFooter>
        <FormItem>
          <Label>
            Tags <CopyText text={tags?.join(", ")} />
          </Label>
          <div className="gap-2 flex w-full">
            {tags?.map((val) => (
              <Badge key={val}>{val}</Badge>
            ))}
          </div>
        </FormItem>
      </CardFooter>
    </Card>
  );
};

export default SeoContent;
