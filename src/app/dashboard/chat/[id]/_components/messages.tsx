import React, { useEffect, useRef, useState } from "react";
import { Markdown } from "@/components/markdown";
import { UIMessage } from "ai";

const Typewriter = ({ text, speed = 30 }: { text: string; speed: number }) => {
  const [displayed, setDisplayed] = useState("");
  const indexRef = useRef(0);

  useEffect(() => {
    setDisplayed("");
    indexRef.current = 0;

    if (!text) return;

    const interval = setInterval(() => {
      setDisplayed((prev) =>
        text?.[indexRef?.current] ? prev + text?.[indexRef?.current] : prev
      );
      indexRef.current += 1;
      if (indexRef.current >= text.length) clearInterval(interval);
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);

  return <Markdown>{displayed}</Markdown>;
};

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
                : "bg-gray-200 text-gray-800 dark:invert"
            }`}
          >
            {message.parts.map((part, index) =>
              part.type === "text" ? (
                // Only animate the latest assistant message
                message.id === lastAssistantMsgId && message.role !== "user" ? (
                  <Typewriter key={index} text={part.text} speed={5} />
                ) : (
                  <span key={index}>
                    <Markdown>{part.text}</Markdown>
                  </span>
                )
              ) : null
            )}
          </div>
        </div>
      ))}
      <div ref={messageEndRef} />
    </div>
  );
};

export default MessagesList;
