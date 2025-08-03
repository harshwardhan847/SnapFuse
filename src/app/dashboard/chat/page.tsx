"use client";

import AnimatedAIChatInput from "@/components/mvpblocks/animated-ai-chat";
import { cn } from "@/lib/utils";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Loader } from "lucide-react";
import { useState } from "react";
import MessagesList from "./_components/messages";

export default function Page() {
  const { messages, sendMessage, status, stop } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
  });
  const hasMessages = false || messages.length > 0;
  const [input, setInput] = useState("");

  return (
    <div
      className={cn(
        "flex-1 max-h-[calc(100vh-4rem)] overflow-auto h-full flex items-center flex-col",
        hasMessages ? "justify-between" : "justify-center"
      )}
    >
      {hasMessages && <MessagesList messages={messages} />}

      {(status === "submitted" || status === "streaming") && (
        <div>
          {status === "submitted" && <Loader className="animate-spin" />}
          <button type="button" onClick={() => stop()}>
            Stop
          </button>
        </div>
      )}

      <AnimatedAIChatInput
        hasMessages={hasMessages}
        setValue={setInput}
        onSubmit={() => {
          if (input.trim()) {
            sendMessage({ text: input });
            setInput("");
          }
        }}
        value={input}
        disabled={status !== "ready"}
      />
    </div>
  );
}
