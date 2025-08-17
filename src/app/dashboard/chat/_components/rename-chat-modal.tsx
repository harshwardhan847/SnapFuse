"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormItem,
  FormControl,
  FormField,
  FormMessage,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { api } from "../../../../../convex/_generated/api";
import { useMutation } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { Doc } from "../../../../../convex/_generated/dataModel";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

const renameFormSchema = z.object({
  renameChat: z
    .string()
    .min(2, { message: "Name should contain min of 2 characters" })
    .max(50, { message: "Name should contain max of 50 characters" }),
});

export function RenameChatModal({ chat }: { chat: Doc<"chats"> }) {
  const [open, setOpen] = useState(false);
  const updateChat = useMutation(api.chats.updateChat);
  const { user } = useUser();
  const form = useForm<z.infer<typeof renameFormSchema>>({
    resolver: zodResolver(renameFormSchema),
    defaultValues: {
      renameChat: chat?.title,
    },
  });

  async function onSubmit(values: z.infer<typeof renameFormSchema>) {
    console.log(values);
    if (!user?.id) {
      toast.error("User Id Missing!");
      return;
    }

    try {
      await updateChat({
        title: values.renameChat,
        chatId: chat?._id,
      });
      toast.success("Chat renamed successfully");
      setOpen(false);
    } catch (err) {
      toast.error("Failed to update chat");
    }
  }

  return (
    <div className="w-full">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild className="">
          <DropdownMenuItem asChild onClick={(e) => e.preventDefault()}>
            <button
              type="button"
              className="w-full text-start"
              onClick={() => setOpen(true)}
            >
              Rename
            </button>
          </DropdownMenuItem>
        </DialogTrigger>
        <Form {...form}>
          <DialogContent className="sm:max-w-[425px]">
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <DialogHeader>
                <DialogTitle>Rename Chat</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 my-4">
                <div className="grid gap-3">
                  <FormField
                    control={form.control}
                    name="renameChat"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your chat name..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button
                    disabled={form.formState.isSubmitting}
                    variant="outline"
                    type="button"
                  >
                    Cancel
                  </Button>
                </DialogClose>
                <Button disabled={form.formState.isSubmitting} type="submit">
                  {form?.formState?.isSubmitting ? (
                    <>
                      <Loader2
                        size={12}
                        className="animate-spin text-primary inline mr-2"
                      />
                      Renaming
                    </>
                  ) : (
                    "Rename"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Form>
      </Dialog>
    </div>
  );
}
