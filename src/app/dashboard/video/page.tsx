"use client";

import React from "react";
import { useUser } from "@clerk/nextjs";
import VideoGenerationModal from "./_components/video-generation-modal";
import VideoList from "./_components/video-list";

const VideoPage = () => {
  const { user } = useUser();

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

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Video Generation</h1>
          <p className="text-muted-foreground mt-2">
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
