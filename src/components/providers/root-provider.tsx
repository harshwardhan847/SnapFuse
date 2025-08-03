import React, { ReactNode } from "react";
import { ThemeProvider } from "./theme-provider";
import { Toaster } from "../ui/sonner";

type Props = {
  children: ReactNode;
};

const RootProvider = ({ children }: Props) => {
  return (
    <ThemeProvider
      attribute="class" // or "data-theme" if using [data-theme=dark]
      defaultTheme="system"
      enableSystem={true}
      disableTransitionOnChange={true}
    >
      {children}
      <Toaster richColors />
    </ThemeProvider>
  );
};

export default RootProvider;
