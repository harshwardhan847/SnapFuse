import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCredits } from "@/hooks/use-credits";
import { InsufficientCreditsModal } from "@/components/credits/insufficient-credits-modal";
import { CreditsDisplay } from "@/components/credits/credits-display";
import { Loader2, Image, Zap } from "lucide-react";
import { toast } from "sonner";
import { useMutation } from "convex/react";

import { useUser } from "@clerk/nextjs";
import { api } from "../../../convex/_generated/api";

export function ImageGenerator() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [showInsufficientCredits, setShowInsufficientCredits] = useState(false);

  const { user } = useUser();
  const { canAfford, getCreditCostForAction } = useCredits();
  const createImageJob = useMutation(api.images.createImageJobRecord);

  const requiredCredits = getCreditCostForAction("IMAGE_GENERATION");

  const handleGenerate = async () => {
    if (!user) {
      toast.error("Please sign in to generate images");
      return;
    }

    if (!prompt.trim()) {
      toast.error("Please enter a prompt");
      return;
    }

    // Check if user has sufficient credits
    if (!canAfford("IMAGE_GENERATION")) {
      setShowInsufficientCredits(true);
      return;
    }

    setLoading(true);
    try {
      const requestId = `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Create image job record (this will deduct credits automatically)
      await createImageJob({
        request_id: requestId,
        prompt: prompt.trim(),
        image_url: null,
        input_storage_id: null,
        userId: user.id,
      });

      toast.success("Image generation started! Credits deducted.");
      setPrompt("");

      // Here you would typically trigger the actual image generation
      // For example, calling your FAL AI endpoint or other image generation service
    } catch (error: any) {
      console.error("Image generation error:", error);
      if (error.message.includes("Insufficient credits")) {
        setShowInsufficientCredits(true);
      } else {
        toast.error("Failed to start image generation");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start gap-4">
        <Card className="flex-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Image className="h-5 w-5" />
              Image Generator
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Input
                placeholder="Describe the image you want to generate..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && !loading && handleGenerate()
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Zap className="h-4 w-4 text-yellow-500" />
                <span>Costs {requiredCredits} credit</span>
              </div>

              <Button
                onClick={handleGenerate}
                disabled={loading || !prompt.trim()}
                className="min-w-[120px]"
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Generate Image
              </Button>
            </div>
          </CardContent>
        </Card>

        <CreditsDisplay className="w-64" />
      </div>

      <InsufficientCreditsModal
        open={showInsufficientCredits}
        onOpenChange={setShowInsufficientCredits}
        requiredCredits={requiredCredits}
        action="image generation"
      />
    </div>
  );
}
