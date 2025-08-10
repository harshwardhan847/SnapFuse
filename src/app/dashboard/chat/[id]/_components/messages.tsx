import React, { useEffect, useRef, useState } from "react";
import { Markdown } from "@/components/markdown";
import { UIMessage } from "ai";
import SeoContent from "@/app/dashboard/seo/_components/seo-content";
import { seoContentSchema } from "@/ai/schema";
import z from "zod";

const MessagesList = ({ messages }: { messages: UIMessage[] }) => {
  const messageEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Find the latest assistant message
  const lastAssistantMsgId = [...messages]
    .reverse()
    .find((m) => m.role === "assistant")?.id;

  return (
    <div className="w-full h-full flex-1 flex flex-col pt-4 pb-64 px-8 min-h-auto max-h-screen overflow-auto">
      {messages?.map((message) => (
        <div
          key={message.id}
          className={`flex items-start mb-4 ${
            message.role === "user" ? "justify-end" : "justify-start"
          }`}
        >
          <div
            className={`max-w-3xl px-4 py-2 rounded-lg shadow-md ${
              message.role === "user"
                ? "bg-blue-500 text-white"
                : "bg-card text-card-foreground"
            }`}
          >
            {message.parts.map((part, index) => {
              switch (part.type) {
                case "text":
                  return (
                    <span key={index}>
                      <Markdown>{part.text}</Markdown>
                    </span>
                  );
                case "tool-generateSeoReadyContent":
                  return (
                    <SeoContent
                      data={
                        part.output as z.infer<typeof seoContentSchema> | null
                      }
                      isLoading={part.state !== "output-available"}
                    />
                  );
                default:
                  null;
              }
            })}
          </div>
        </div>
      ))}
      <div ref={messageEndRef} />
    </div>
  );
};

export default MessagesList;
