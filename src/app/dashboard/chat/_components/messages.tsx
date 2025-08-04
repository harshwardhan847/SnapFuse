"use client";
import { Markdown } from "@/components/markdown";
import { UIDataTypes, UIMessage, UITools } from "ai";
import React, { useEffect, useRef } from "react";

type Props = {
  messages: UIMessage<unknown, UIDataTypes, UITools>[];
};

const MessagesList = ({ messages }: Props) => {
  const messageEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (messageEndRef) {
      messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  return (
    <>
      <div className="w-full h-full flex-1 flex flex-col pt-4 pb-64 px-8 min-h-screen max-h-screen overflow-auto">
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
                  : "bg-gray-200 text-gray-800 dark:invert"
              }`}
            >
              {message.parts.map((part, index) =>
                part.type === "text" ? (
                  <span key={index}>
                    <Markdown>{part.text}</Markdown>
                  </span>
                ) : null
              )}
            </div>
          </div>
        ))}
      </div>
      <div ref={messageEndRef} />
    </>
  );
};

export default MessagesList;
