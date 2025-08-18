"use client";

import { useUser } from "@clerk/nextjs";
import { CreditsDashboard } from "@/components/dashboard/credits-dashboard";
import { NewUserWelcome } from "@/components/onboarding/new-user-welcome";

import { Card, CardContent } from "@/components/ui/card";

import { Suspense } from "react";

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return <DashboardSkeleton />;
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Please Sign In</h2>
            <p className="text-muted-foreground">
              You need to be signed in to access the dashboard.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {user.firstName || user.username || "User"}! Manage your
          credits and generate content.
        </p>
      </div>

      {/* New User Welcome Banner */}
      <div className="mb-6">
        <NewUserWelcome />
      </div>

      <Suspense fallback={<DashboardSkeleton />}>
        <CreditsDashboard />
      </Suspense>
    </div>
  );
}
