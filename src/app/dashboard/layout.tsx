import { AdminSidebar } from "@/components/mvpblocks/ui/admin-sidebar";
import { DashboardHeader } from "@/components/mvpblocks/ui/dashboard-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import React, { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

const layout = ({ children }: Props) => {
  return (
    <SidebarProvider>
      <AdminSidebar />

      <SidebarInset>
        <DashboardHeader />
        <div className="flex flex-1 flex-col gap-2 pt-0 sm:gap-4">
          <div className="min-h-[calc(100vh-4rem)] flex-1 rounded-lg sm:rounded-xl ">
            <div className="mx-auto max-w-6xl space-y-4 sm:space-y-6">
              {children}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default layout;
