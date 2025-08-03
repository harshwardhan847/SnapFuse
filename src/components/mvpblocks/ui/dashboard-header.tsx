"use client";

import { memo } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

export const DashboardHeader = memo(() => {
  return (
    <header className="bg-background/95 sticky top-0 z-50 flex h-16 w-full shrink-0 items-center gap-2 border-b backdrop-blur transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-0 h-4" />
        <div className="grid flex-1 text-left text-lg leading-tight">
          <span className="truncate font-bold">SnapFuse</span>
        </div>
      </div>

      <div className="ml-auto flex items-center gap-2 px-4"></div>
    </header>
  );
});

DashboardHeader.displayName = "DashboardHeader";
