"use client";

import AnimatedAIChatInput from "@/components/mvpblocks/animated-ai-chat";
import { cn } from "@/lib/utils";
import { useChat } from "@ai-sdk/react";
import {
  ChatInit,
  DefaultChatTransport,
  generateId,
  lastAssistantMessageIsCompleteWithToolCalls,
  UIDataTypes,
  UIMessage,
  UITools,
} from "ai";

import { useState } from "react";
import MessagesList from "./../_components/messages";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../../../convex/_generated/api";
import { useAuth } from "@clerk/nextjs";

interface Attachment {
  url: string;
  storageId: string;
}

type Props = {
  chatId: string;
  initialMessages: UIMessage<unknown, UIDataTypes, UITools>[];
};

const Chat = ({ chatId, initialMessages }: Props) => {
  const { userId } = useAuth();
  const addMessage = useMutation(api.messages.addMessage);

  const { messages, sendMessage, status, stop, addToolResult } = useChat({
    sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,
    transport: new DefaultChatTransport({
      api: "/api/chat",
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        userId: userId || "anonymous",
      },
    }),
    messages: initialMessages,
    // async onToolCall({ toolCall }) {
    //   const result = await executeToolCall(toolCall.);

    //   // Important: Don't await addToolResult inside onToolCall to avoid deadlocks
    //   addToolResult({
    //     tool: toolCall.toolName,
    //     toolCallId: toolCall.toolCallId,
    //     output: result,
    //   });
    // },

    onFinish: ({ message }) => {
      addMessage({
        chatSessionId: chatId,
        message: {
          parts: message.parts,
          id: message.id,
          role: "assistant",
          type: "text",
        },
      });
    },
  });
  const hasMessages = false || messages.length > 0;
  const [input, setInput] = useState("");

  console.log(messages);

  return (
    <div
      className={cn(
        "flex-1 min-h-[calc(100vh-4rem)] max-h-[calc(100vh-4rem)] overflow-x-auto h-full flex items-center flex-col",
        hasMessages ? "justify-between" : "justify-center"
      )}
    >
      {hasMessages && <MessagesList messages={messages} />}

      {(status === "submitted" || status === "streaming") && (
        <div>
          <button type="button" onClick={() => stop()}>
            Stop
          </button>
        </div>
      )}

      <AnimatedAIChatInput
        hasMessages={hasMessages}
        setValue={setInput}
        onSubmit={(attachments) => {
          if (!input.trim() && attachments.length === 0) {
            return;
          }
          const parts: any[] = [];
          if (input.trim()) {
            parts.push({ text: input, type: "text", state: "done" });
          }
          for (const attachment of attachments) {
            parts.push({
              type: "image",
              image_url: attachment.url,
              storage_id: attachment.storageId,
              state: "done",
            });
          }

          sendMessage({ parts });
          addMessage({
            chatSessionId: chatId,
            message: {
              parts,
              id: generateId(),
              role: "user",
              type: attachments.length > 0 ? "image" : "text",
            },
          });
          setInput("");
        }}
        value={input}
        disabled={status !== "ready"}
        isTyping={status === "submitted"}
      />
    </div>
  );
};

export default Chat;
