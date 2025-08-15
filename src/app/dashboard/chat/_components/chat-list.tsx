import { usePaginatedQuery } from "convex/react";
import React from "react";
import { api } from "../../../../../convex/_generated/api";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { ChatMenu } from "./chat-menu";
import { Doc } from "../../../../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";

type Props = {
  userId: string;
};

const ChatList = ({ userId }: Props) => {
  const { results, status, loadMore } = usePaginatedQuery(
    api.chats.getChatsByUserPaginated,
    { userId },
    { initialNumItems: 12 }
  );

  if (status === "LoadingFirstPage") {
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

  if (results.length === 0) {
    return (
      <div className="col-span-full flex justify-center py-20">
        <div className="text-center">
          <p className="text-muted-foreground">No chats found.</p>
          <p className="text-sm text-muted-foreground mt-1">
            Create your first chat to get started!
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Chat Grid */}
      {results.map((chat: Doc<"chats">) => (
        <div
          key={chat._id}
          className="flex items-center relative justify-center cursor-pointer overflow-hidden rounded-2xl bg-card border-border border w-full min-h-32 hover:ring-primary hover:ring-2 transition"
        >
          <div className="absolute top-2 right-2">
            <ChatMenu chat={chat} />
          </div>
          <Link
            href={`/dashboard/chat/${chat._id}`}
            className="w-full h-full flex items-center justify-center"
          >
            {chat.title}
          </Link>
        </div>
      ))}

      {/* Load More Button */}
      {(status === "CanLoadMore" || status === "LoadingMore") && (
        <div className="col-span-full flex justify-center mt-6">
          <Button
            onClick={() => loadMore(12)}
            disabled={status === "LoadingMore"}
            variant="outline"
            className="w-full max-w-xs"
          >
            {status === "LoadingMore" ? "Loading..." : "Load More Chats"}
          </Button>
        </div>
      )}
    </>
  );
};

export default ChatList;
