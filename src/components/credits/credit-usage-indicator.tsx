'use client';

import { useCredits } from '@/hooks/use-credits';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap, AlertTriangle } from 'lucide-react';
import { SUBSCRIPTION_PLANS } from '@/config/pricing';

interface CreditUsageIndicatorProps {
    className?: string;
}

export function CreditUsageIndicator({ className }: CreditUsageIndicatorProps) {
    const { credits, subscriptionPlan, isLoading } = useCredits();

    if (isLoading) {
        return (
            <Card className={className}>
                <CardContent className="p-4">
                    <div className="animate-pulse space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-2 bg-gray-200 rounded"></div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    const currentPlan = SUBSCRIPTION_PLANS[subscriptionPlan?.toUpperCase() as keyof typeof SUBSCRIPTION_PLANS] || SUBSCRIPTION_PLANS.FREE;
    const maxCredits = currentPlan.credits;
    const usagePercentage = Math.min((credits / maxCredits) * 100, 100);
    const isLowCredits = credits < maxCredits * 0.2; // Less than 20% remaining

    return (
        <Card className={className}>
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Zap className="h-4 w-4 text-yellow-500" />
                    Credit Usage
                    {isLowCredits && <AlertTriangle className="h-4 w-4 text-orange-500" />}
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span>{credits} remaining</span>
                        <span className="text-muted-foreground">{maxCredits} total</span>
                    </div>
                    <Progress value={usagePercentage} className="h-2" />
                    {isLowCredits && (
                        <p className="text-xs text-orange-600">
                            Running low on credits. Consider upgrading your plan.
                        </p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}