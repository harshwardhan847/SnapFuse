"use client";

import { memo } from "react";
import { useTheme } from "next-themes";
import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Activity,
  Settings,
  Moon,
  Sun,
  User,
  VideoIcon,
  Images,
  MessagesSquare,
} from "lucide-react";
import { usePathname } from "next/navigation";
import {
  SignInButton,
  useAuth,
  useClerk,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useConvexAuth } from "convex/react";

const menuItems = [
  { title: "Home", icon: LayoutDashboard, href: "/dashboard/home" },
  { title: "Chats", icon: MessagesSquare, href: "/dashboard/chat" },

  { title: "SEO", icon: Activity, href: "/dashboard/seo" },
  { title: "Images", icon: Images, href: "/dashboard/image" },
  { title: "Videos", icon: VideoIcon, href: "/dashboard/video" },
  { title: "Settings", icon: Settings, href: "/dashboard/settings" },
];

export const AdminSidebar = memo(() => {
  const { setTheme, resolvedTheme } = useTheme();
  const pathname = usePathname();
  const isActive = (href: string): boolean => {
    return pathname.includes(href);
  };
  const { isSignedIn, isLoaded } = useAuth();
  const { isAuthenticated } = useConvexAuth();
  const { openUserProfile } = useClerk();
  const { user } = useUser();
  console.log(isAuthenticated);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard/home">
                <div className="bg-primary text-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <LayoutDashboard className="h-5 w-5" />
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton isActive={isActive(item.href)} asChild>
                      <Link href={item.href}>
                        <Icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() =>
                setTheme(resolvedTheme === "dark" ? "light" : "dark")
              }
            >
              {resolvedTheme === "dark" ? <Sun /> : <Moon />}
              <span>
                {resolvedTheme === "dark" ? "Light Mode" : "Dark Mode"}
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          {isLoaded ? (
            <SidebarMenuItem>
              {isSignedIn ? (
                <div className="flex items-center justify-start gap-2">
                  <UserButton />
                  <button
                    onClick={() => openUserProfile()}
                    className="flex gap-0 items-start justify-center flex-col text-sm"
                  >
                    <span className="font-semibold">{user?.fullName}</span>
                    <span className="text-xs">
                      {user?.emailAddresses?.[0]?.emailAddress}
                    </span>
                  </button>
                </div>
              ) : (
                <Button asChild className="w-full">
                  <SignInButton />
                </Button>
              )}
            </SidebarMenuItem>
          ) : (
            <Skeleton className="h-8 w-full" />
          )}
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
});

AdminSidebar.displayName = "AdminSidebar";
