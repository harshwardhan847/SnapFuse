"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
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
import { Loader, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { api } from "../../../../../convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

const formSchema = z.object({
  chatName: z
    .string()
    .min(2, { error: "Name should contain min of 2 characters" })
    .max(50, { error: "Name should contain max of 50 characters" }),
});

export function CreateChatModal() {
  const createChat = useMutation(api.chats.createChat);
  const { user } = useUser();
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      chatName: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!formSchema.safeParse(values).success) {
      toast.error("Invalid Data");
      return;
    }

    if (!user?.id) {
      toast.error("User Id Missing!");
      return;
    }

    try {
      const chatId = await createChat({
        title: values.chatName,
        userId: user.id,
      });
      router.push(`/dashboard/chat/${chatId}`);
    } catch (err) {
      toast.error("Failed to create chat");
    }
  }

  return (
    <div className="flex items-center justify-center cursor-pointer rounded-2xl bg-card border-border border w-full max-w-36 aspect-square hover:ring-primary hover:ring-2 transition">
      <Dialog>
        <DialogTrigger asChild className="">
          <button
            type="button"
            className="flex items-center justify-center cursor-pointer rounded-2xl bg-card border-border border w-full max-w-36 aspect-square hover:ring-primary hover:ring-2 transition"
          >
            <Plus size={45} strokeWidth={0.7} />
          </button>
        </DialogTrigger>
        <Form {...form}>
          <form>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create New Chat</DialogTitle>
                <DialogDescription>Enter a chat name</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4">
                <div className="grid gap-3">
                  <FormField
                    control={form.control}
                    name="chatName"
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
                <Button
                  disabled={form.formState.isSubmitting}
                  type="submit"
                  onClick={form.handleSubmit(onSubmit)}
                >
                  {form?.formState?.isSubmitting ? (
                    <>
                      <Loader size={12} className="animate-spin inline mr-2" />
                      Creating chat
                    </>
                  ) : (
                    "Save changes"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </form>
        </Form>
      </Dialog>
    </div>
  );
}
