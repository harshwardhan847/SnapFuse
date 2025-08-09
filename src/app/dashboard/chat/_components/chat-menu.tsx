"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMutation } from "convex/react";
import { EllipsisVertical, Trash } from "lucide-react";
import { api } from "../../../../../convex/_generated/api";
import { Doc } from "../../../../../convex/_generated/dataModel";
import { RenameChatModal } from "./rename-chat-modal";

export function ChatMenu({ chat }: { chat: Doc<"chats"> }) {
  const deleteChat = useMutation(api.chats.deleteChat);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size={"icon"} className="w-min px-0">
          <EllipsisVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start">
        <div className="w-full px-0">
          <RenameChatModal chat={chat} />
        </div>
        <DropdownMenuItem
          onClick={(e) => {
            e.preventDefault();
            deleteChat({ chatId: chat._id });
          }}
          className="w-full flex justify-between items-center gap-4 text-red-500 hover:text-red-800"
        >
          Delete
          <Trash className="" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
