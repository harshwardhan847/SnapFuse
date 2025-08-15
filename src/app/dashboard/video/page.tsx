"use client";

import React from "react";
import { useUser } from "@clerk/nextjs";
import { usePlan } from "@/hooks/use-plan";
import VideoGenerationModal from "./_components/video-generation-modal";
import VideoList from "./_components/video-list";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lock, Crown, Zap, VideoIcon } from "lucide-react";
import Link from "next/link";

const VideoPage = () => {
  const { user } = useUser();
  const { isPremium, planName, isLoading } = usePlan();

  if (!user) {
    return (
      <div className="flex justify-center py-20">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Please sign in</h2>
          <p className="text-muted-foreground">
            You need to be signed in to access video generation.
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Loading...</h2>
        </div>
      </div>
    );
  }

  if (!isPremium) {
    return (
      <div className="container mx-auto p-6">
        <div className="max-w-2xl mx-auto">
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <Lock className="h-8 w-8 text-muted-foreground" />
              </div>
              <CardTitle className="flex items-center justify-center gap-2 text-2xl">
                <VideoIcon className="h-6 w-6" />
                Video Generation
                <Badge variant="secondary" className="gap-1">
                  <Crown className="h-3 w-3" />
                  Pro Feature
                </Badge>
              </CardTitle>
              <CardDescription className="text-base">
                Video generation is available for Pro and Enterprise plans only.
                Transform your images into dynamic videos using AI.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">
                  You're currently on the <Badge variant="outline">{planName}</Badge> plan
                </p>
                <p className="text-sm">
                  Upgrade to Pro or Enterprise to unlock video generation and other premium features.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">What you'll get with Pro:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• AI-powered video generation from images</li>
                  <li>• Up to 30-second videos</li>
                  <li>• Advanced video options and controls</li>
                  <li>• 250 credits per month</li>
                  <li>• Priority support</li>
                </ul>
              </div>

              <Link href="/pricing">
                <Button size="lg" className="w-full">
                  <Zap className="mr-2 h-4 w-4" />
                  Upgrade to Pro
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h1 className="text-3xl font-bold">Video Generation</h1>
            <Badge variant="secondary" className="gap-1">
              <Crown className="h-3 w-3" />
              Pro
            </Badge>
          </div>
          <p className="text-muted-foreground">
            Transform your images into dynamic videos using AI
          </p>
        </div>
        <VideoGenerationModal userId={user.id} />
      </div>

      <VideoList userId={user.id} />
    </div>
  );
};

export default VideoPage;
