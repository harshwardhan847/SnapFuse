"use client";
import { Copy } from "lucide-react";
import React from "react";
import { Button } from "./ui/button";
import { toast } from "sonner";

type Props = {
  text: string;
};

const CopyText = ({ text }: Props) => {
  return (
    <Button
      size={"icon"}
      variant={"outline"}
      onClick={() =>
        window.navigator?.clipboard
          ?.writeText(text)
          .then(() => toast.success("Copied to clipboard!"))
      }
    >
      <Copy />
    </Button>
  );
};

export default CopyText;
