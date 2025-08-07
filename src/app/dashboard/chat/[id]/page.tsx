"use client";

import { useParams } from "next/navigation";
import Chat from "./_components/chat";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { UIDataTypes, UIMessage, UITools } from "ai";
import { Loader } from "lucide-react";

export default function Page() {
  const params: { id: string } = useParams();
  const initialMessages = useQuery(api.messages.getMessages, {
    sessionId: params?.id,
  });

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
        initialMessages?.map((message) => message.message) as UIMessage<
          unknown,
          UIDataTypes,
          UITools
        >[]
      }
    />
  );
}
