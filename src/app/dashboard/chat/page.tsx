"use client";
import { useQuery } from "convex/react";
import React from "react";
import { api } from "../../../../convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { usePlan } from "@/hooks/use-plan";
import Link from "next/link";
import { CreateChatModal } from "./_components/create-chat-modal";
import ChatList from "./_components/chat-list";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lock, Crown, Zap, MessagesSquare } from "lucide-react";

type Props = {};

const Chats = (props: Props) => {
  const { user, isLoaded } = useUser();
  const { isPremium, planName, isLoading } = usePlan();

  if (!isLoaded || isLoading) return null;

  if (!user)
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        Log in to view chats
      </div>
    );

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
                <MessagesSquare className="h-6 w-6" />
                AI Chat
                <Badge variant="secondary" className="gap-1">
                  <Crown className="h-3 w-3" />
                  Pro Feature
                </Badge>
              </CardTitle>
              <CardDescription className="text-base">
                AI Chat is available for Pro and Enterprise plans only.
                Have intelligent conversations and generate content with AI.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">
                  You're currently on the <Badge variant="outline">{planName}</Badge> plan
                </p>
                <p className="text-sm">
                  Upgrade to Pro or Enterprise to unlock AI chat and other premium features.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">What you'll get with Pro:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Unlimited AI conversations</li>
                  <li>• Advanced AI models and tools</li>
                  <li>• Image and video generation through chat</li>
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
    <div className="w-full grid md:grid-cols-5 gap-4 flex-wrap mt-8 md:max-w-6xl px-6">
      <div className="md:col-span-5 mb-4">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold">AI Chat</h1>
          <Badge variant="secondary" className="gap-1">
            <Crown className="h-3 w-3" />
            Pro
          </Badge>
        </div>
        <p className="text-muted-foreground">
          Have intelligent conversations and generate content with AI
        </p>
      </div>
      <CreateChatModal />
      <ChatList userId={user?.id} />
    </div>
  );
};

export default Chats;
