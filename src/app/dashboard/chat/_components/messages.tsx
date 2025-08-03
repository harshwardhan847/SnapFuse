import { Markdown } from "@/components/markdown";
import { UIDataTypes, UIMessage, UITools } from "ai";
import React from "react";

type Props = {
  messages: UIMessage<unknown, UIDataTypes, UITools>[];
};

const MessagesList = ({ messages }: Props) => {
  return (
    <div className="w-full h-full flex-1 flex flex-col pb-36 min-h-screen overflow-auto">
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
                : "bg-gray-200 text-gray-800"
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
  );
};

export default MessagesList;
