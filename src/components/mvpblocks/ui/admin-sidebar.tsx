"use client";

import { memo, useEffect, useState } from "react";
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
  Zap,
  CreditCard,
  Lock,
  Crown,
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
import { useCredits } from "@/hooks/use-credits";
import { usePlan } from "@/hooks/use-plan";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

const menuItems = [
  {
    title: "Home",
    icon: LayoutDashboard,
    href: "/dashboard/home",
    planRequired: null,
  },
  { title: "SEO", icon: Activity, href: "/dashboard/seo", planRequired: null },
  {
    title: "Images",
    icon: Images,
    href: "/dashboard/image",
    planRequired: null,
  },
  {
    title: "Settings",
    icon: Settings,
    href: "/dashboard/settings",
    planRequired: null,
  },
];

const premiumMenuItems = [
  {
    title: "Chats",
    icon: MessagesSquare,
    href: "/dashboard/chat",
    planRequired: "pro",
  },
  {
    title: "Videos",
    icon: VideoIcon,
    href: "/dashboard/video",
    planRequired: "pro",
  },
];

export const AdminSidebar = memo(() => {
  const [isMounted, setIsMounted] = useState(false);
  const { setTheme, resolvedTheme } = useTheme();
  const pathname = usePathname();
  const isActive = (href: string): boolean => {
    return pathname.includes(href);
  };
  const { isSignedIn, isLoaded } = useAuth();
  const { openUserProfile } = useClerk();
  const { user } = useUser();
  const { credits, subscriptionPlan, isLoading } = useCredits();
  const { isPremium, planName } = usePlan();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link
                href="/dashboard/home"
                className="flex items-center justify-start"
              >
                <div className="bg-primary overflow-hidden text-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Image
                    src={"/logos/short_logo_bg.jpeg"}
                    alt="Logo"
                    width={50}
                    height={50}
                    className="object-contain "
                  />
                </div>
                <Image
                  src={"/logos/logo.svg"}
                  alt="Logo"
                  width={80}
                  height={80}
                  className="object-contain opacity-95 mt-2 "
                />
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
              {/* Basic menu items - available to all plans */}
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

              {/* Premium menu items - Pro/Enterprise only */}
              {premiumMenuItems.map((item) => {
                const Icon = item.icon;

                if (isPremium) {
                  // User has access - show normal menu item
                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton isActive={isActive(item.href)} asChild>
                        <Link href={item.href}>
                          <Icon />
                          <span>{item.title}</span>
                          <Badge
                            variant="secondary"
                            className="ml-auto text-xs"
                          >
                            <Crown className="h-3 w-3 mr-1" />
                            Pro
                          </Badge>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                } else {
                  // User doesn't have access - show locked item
                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton asChild>
                        <Link href="/pricing" className="opacity-60">
                          <Icon />
                          <span>{item.title}</span>
                          <Lock className="h-3 w-3 ml-auto text-muted-foreground" />
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                }
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Credits Display */}
        {isSignedIn && (
          <SidebarGroup>
            <SidebarGroupLabel>Credits</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link href="/dashboard/home">
                      <div className="flex items-center gap-2 w-full">
                        <Zap className="h-4 w-4 text-yellow-500" />
                        <div className="flex flex-col flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">
                              {isLoading ? (
                                <Skeleton className="h-4 w-12" />
                              ) : (
                                `${credits} Credits`
                              )}
                            </span>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {isLoading ? (
                              <Skeleton className="h-3 w-16" />
                            ) : (
                              <Badge
                                variant="outline"
                                className="text-xs px-1 py-0"
                              >
                                {subscriptionPlan === "free"
                                  ? "Free"
                                  : subscriptionPlan === "starter"
                                    ? "Starter"
                                    : subscriptionPlan === "pro"
                                      ? "Pro"
                                      : subscriptionPlan === "enterprise"
                                        ? "Enterprise"
                                        : "Free"}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link href="/pricing">
                      <CreditCard className="h-4 w-4" />
                      <span>Buy Credits</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            {resolvedTheme ? (
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
            ) : null}
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
