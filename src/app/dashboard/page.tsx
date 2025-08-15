'use client';

import { useUser } from '@clerk/nextjs';
import { CreditsDashboard } from '@/components/dashboard/credits-dashboard';
import { ImageGenerator } from '@/components/generation/image-generator';
import { VideoGenerator } from '@/components/generation/video-generator';
import { SubscriptionStatus } from '@/components/subscription/subscription-status';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Image, Video, BarChart3, Settings } from 'lucide-react';
import { Suspense } from 'react';

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
          Welcome back, {user.firstName || user.username || 'User'}! Manage your credits and generate content.
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 max-w-2xl">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="images" className="flex items-center gap-2">
            <Image className="h-4 w-4" />
            Images
          </TabsTrigger>
          <TabsTrigger value="videos" className="flex items-center gap-2">
            <Video className="h-4 w-4" />
            Videos
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Suspense fallback={<DashboardSkeleton />}>
            <CreditsDashboard />
          </Suspense>
        </TabsContent>

        <TabsContent value="images">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Generate Images</CardTitle>
                <CardDescription>
                  Create AI-generated images using your credits. Each image costs 1 credit.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ImageGenerator />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="videos">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Generate Videos</CardTitle>
                <CardDescription>
                  Create AI-generated videos using your credits. Each video costs 5 credits.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <VideoGenerator />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SubscriptionStatus />

              <Card>
                <CardHeader>
                  <CardTitle>Account Preferences</CardTitle>
                  <CardDescription>
                    Manage your account settings and preferences.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Additional settings coming soon!</p>
                    <p className="text-sm">Email preferences, notifications, etc.</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}