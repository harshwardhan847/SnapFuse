import { useQuery } from "convex/react";
import React from "react";
import { api } from "../../../../../convex/_generated/api";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { ChatMenu } from "./chat-menu";

type Props = {
  userId: string;
};

const ChatList = ({ userId }: Props) => {
  const chats = useQuery(api.chats.getChatsByUser, {
    userId,
  });
  if (chats === undefined) {
    return (
      <>
        {Array.from({ length: 8 }).map((_, index) => (
          <Skeleton
            key={index}
            className="flex items-center justify-center rounded-2xl w-full min-h-32"
          />
        ))}
      </>
    );
  }
  return (
    <>
      {chats?.map((chat) => (
        <div
          key={chat?._id}
          className="flex items-center relative justify-center cursor-pointer overflow-hidden rounded-2xl bg-card border-border border w-full min-h-32 hover:ring-primary hover:ring-2 transition"
        >
          <div className="absolute top-2 right-2">
            <ChatMenu chat={chat} />
          </div>
          <Link
            href={`/dashboard/chat/${chat?._id}`}
            className="w-full h-full flex items-center justify-center"
          >
            {chat.title}
          </Link>
        </div>
      ))}
    </>
  );
};

export default ChatList;
