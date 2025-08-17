import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Sparkles, ArrowRight, X } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "../../../convex";

export function NewUserWelcome() {
  const { user } = useUser();
  const router = useRouter();
  const isOnBoardingCompleted = useQuery(
    api.userPreferences.checkOnboardingStatus,
    {
      userId: user?.id,
    }
  );
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!isOnBoardingCompleted) {
      setIsVisible(true);
    }
  }, [user]);

  if (!isVisible) return null;

  const handleStartOnboarding = () => {
    router.push("/onboarding");
  };

  const handleDismiss = () => {
    setIsVisible(false);
  };

  return (
    <Card className="border-primary/20 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-full">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Welcome to SnapFuse!</CardTitle>
              <CardDescription>
                Let's get you set up for success with AI content generation.
              </CardDescription>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={handleDismiss}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Complete our quick setup to personalize your experience and get the
            most out of SnapFuse.
          </p>
          <Button onClick={handleStartOnboarding} className="ml-4">
            Get Started
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
