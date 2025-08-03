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
      className="cursor-pointer w-min aspect-square"
      onClick={() =>
        window.navigator?.clipboard
          ?.writeText(text)
          .then(() => toast.success("Copied to clipboard!"))
      }
    >
      <div>
        <Copy />
      </div>
    </Button>
  );
};

export default CopyText;
