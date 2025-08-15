"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { usePlan } from "@/hooks/use-plan";
import Chat from "./_components/chat";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { UIDataTypes, UIMessage, UITools } from "ai";
import { Loader } from "lucide-react";

export default function Page() {
  const params: { id: string } = useParams();
  const router = useRouter();
  const { isPremium, isLoading } = usePlan();

  const initialMessages = useQuery(api.messages.getMessages, {
    sessionId: params?.id,
  });

  // Redirect non-premium users to chat page (which will show upgrade prompt)
  useEffect(() => {
    if (!isLoading && !isPremium) {
      router.push('/dashboard/chat');
    }
  }, [isPremium, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-full flex-1 min-h-screen">
        <Loader className="animate-spin" size={25} />
      </div>
    );
  }

  if (!isPremium) {
    return null; // Will redirect via useEffect
  }

  if (!initialMessages) {
    return (
      <div className="flex items-center justify-center w-full h-full flex-1 min-h-screen">
        <Loader className="animate-spin" size={25} />
      </div>
    );
  }

  return (
    <Chat
      chatId={params.id}
      initialMessages={
        initialMessages?.map((message: any) => message.message) as UIMessage<
          unknown,
          UIDataTypes,
          UITools
        >[]
      }
    />
  );
}
