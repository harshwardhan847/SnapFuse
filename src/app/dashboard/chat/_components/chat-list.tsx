import { useQuery } from "convex/react";
import React from "react";
import { api } from "../../../../../convex/_generated/api";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

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
            className="flex items-center justify-center rounded-2xl w-full max-w-36 aspect-square"
          />
        ))}
      </>
    );
  }
  return (
    <>
      {chats?.map((chat) => (
        <Link
          key={chat?._id}
          href={`/dashboard/chat/${chat?._id}`}
          className="flex items-center justify-center cursor-pointer rounded-2xl bg-card border-border border w-full max-w-36 aspect-square hover:ring-primary hover:ring-2 transition"
        >
          {chat.title}
        </Link>
      ))}
    </>
  );
};

export default ChatList;
