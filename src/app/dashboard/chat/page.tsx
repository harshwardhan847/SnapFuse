"use client";
import { useQuery } from "convex/react";
import React from "react";
import { api } from "../../../../convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { CreateChatModal } from "./_components/create-chat-modal";
import ChatList from "./_components/chat-list";

type Props = {};

const Chats = (props: Props) => {
  const { user, isLoaded } = useUser();

  if (!isLoaded) return null;
  if (!user)
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        Log in to view chats
      </div>
    );

  return (
    <div className=" w-full grid md:grid-cols-5 gap-4 flex-wrap mt-8 md:max-w-6xl px-6">
      <CreateChatModal />
      <ChatList userId={user?.id} />
    </div>
  );
};

export default Chats;
