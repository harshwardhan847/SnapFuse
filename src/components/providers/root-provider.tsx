import React, { ReactNode } from "react";
import { ThemeProvider } from "./theme-provider";
import { Toaster } from "../ui/sonner";
import { ClerkProvider } from "@clerk/nextjs";
import ConvexClientProvider from "./convex-client-provider";

type Props = {
  children: ReactNode;
};

const RootProvider = ({ children }: Props) => {
  return (
    <ClerkProvider>
      <ConvexClientProvider>
        <ThemeProvider
          attribute="class" // or "data-theme" if using [data-theme=dark]
          defaultTheme="system"
          enableSystem={true}
          disableTransitionOnChange={true}
        >
          {children}
          <Toaster richColors />
        </ThemeProvider>
      </ConvexClientProvider>
    </ClerkProvider>
  );
};

export default RootProvider;
