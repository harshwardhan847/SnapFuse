"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { usePlan } from "@/hooks/use-plan";
import Chat from "./_components/chat";
import { usePaginatedQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { UIDataTypes, UIMessage, UITools } from "ai";
import { Loader } from "lucide-react";

export default function Page() {
  const params: { id: string } = useParams();
  const router = useRouter();
  const { isPremium, isLoading } = usePlan();

  // Use single paginated query for all messages
  const {
    results: messages,
    status,
    loadMore,
  } = usePaginatedQuery(
    api.messages.getMessagesPaginated,
    { sessionId: params?.id },
    { initialNumItems: 30 }
  );

  // Redirect non-premium users to chat page (which will show upgrade prompt)
  useEffect(() => {
    if (!isLoading && !isPremium) {
      router.push("/dashboard/chat");
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

  if (status === "LoadingFirstPage") {
    return (
      <div className="flex items-center justify-center w-full h-full flex-1 min-h-screen">
        <Loader className="animate-spin" size={25} />
      </div>
    );
  }

  // Since messages come in descending order (newest first) from pagination,
  // we need to reverse them to show oldest first in the chat
  const orderedMessages = messages ? [...messages].reverse() : [];

  console.log(
    "Messages status:",
    status,
    "Count:",
    messages?.length,
    "Can load more:",
    status === "CanLoadMore"
  );
  console.log("Ordered messages count:", orderedMessages.length);

  return (
    <Chat
      chatId={params.id}
      initialMessages={
        orderedMessages?.map((message: any) => message.message) as UIMessage<
          unknown,
          UIDataTypes,
          UITools
        >[]
      }
      onLoadMore={() => {
        console.log("Load more triggered");
        loadMore(30);
      }}
      canLoadMore={status === "CanLoadMore"}
      isLoadingMore={status === "LoadingMore"}
    />
  );
}
