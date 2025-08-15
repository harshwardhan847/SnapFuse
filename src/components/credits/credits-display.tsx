'use client';

import { useCredits } from '@/hooks/use-credits';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Zap, Plus } from 'lucide-react';
import Link from 'next/link';
import { CREDIT_COSTS } from '@/config/pricing';

interface CreditsDisplayProps {
  showTopupButton?: boolean;
  className?: string;
}

export function CreditsDisplay({ showTopupButton = true, className }: CreditsDisplayProps) {
  const { credits, subscriptionPlan, isLoading } = useCredits();

  if (isLoading) {
    return (
      <Card className={className}>
        <CardContent className="p-4">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
            <div className="h-6 bg-gray-200 rounded w-16"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const canTopup = subscriptionPlan !== 'free';

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Zap className="h-4 w-4 text-yellow-500" />
          Credits
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-primary">{credits}</div>
            <div className="text-xs text-muted-foreground">
              {Math.floor(credits / CREDIT_COSTS.VIDEO_GENERATION)} videos • {credits} images
            </div>
          </div>
          {showTopupButton && canTopup && (
            <Link href="/pricing">
              <Button size="sm" variant="outline">
                <Plus className="h-3 w-3 mr-1" />
                Top up
              </Button>
            </Link>
          )}
        </div>
        {!canTopup && showTopupButton && (
          <div className="mt-2">
            <Link href="/pricing">
              <Button size="sm" variant="default" className="w-full">
                Upgrade Plan
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}