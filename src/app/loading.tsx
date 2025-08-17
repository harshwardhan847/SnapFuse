import { Loader2 } from "lucide-react";
import React from "react";

type Props = {};

const Loading = (props: Props) => {
  return (
    <div className="flex items-center justify-center min-h-screen min-w-screen w-full h-full">
      <Loader2 size={50} className="animate-spin text-primary" />
    </div>
  );
};

export default Loading;
