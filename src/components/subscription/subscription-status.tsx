'use client';

import { useCredits } from '@/hooks/use-credits';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, Clock, CreditCard, XCircle } from 'lucide-react';
import Link from 'next/link';
import { getSubscriptionStatusMessage } from '@/lib/subscription-utils';

interface SubscriptionStatusProps {
    className?: string;
}

export function SubscriptionStatus({ className }: SubscriptionStatusProps) {
    const {
        subscriptionPlan,
        subscriptionStatus,
        subscriptionPeriodEnd,
        hasActiveSubscription,
        canAccessFeatures,
        isLoading
    } = useCredits();

    if (isLoading) {
        return (
            <Card className={className}>
                <CardContent className="p-4">
                    <div className="animate-pulse space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    const statusMessage = getSubscriptionStatusMessage(subscriptionStatus, subscriptionPeriodEnd);

    const getStatusIcon = () => {
        if (!subscriptionStatus || subscriptionPlan === 'free') {
            return <CreditCard className="h-4 w-4 text-gray-500" />;
        }

        switch (subscriptionStatus) {
            case 'active':
            case 'trialing':
                return <CheckCircle className="h-4 w-4 text-green-500" />;
            case 'past_due':
            case 'unpaid':
                return <AlertTriangle className="h-4 w-4 text-orange-500" />;
            case 'canceled':
                return <Clock className="h-4 w-4 text-blue-500" />;
            case 'incomplete':
            case 'incomplete_expired':
                return <XCircle className="h-4 w-4 text-red-500" />;
            default:
                return <CreditCard className="h-4 w-4 text-gray-500" />;
        }
    };

    const getStatusVariant = (): "default" | "secondary" | "destructive" | "outline" => {
        if (!subscriptionStatus || subscriptionPlan === 'free') return 'secondary';

        switch (subscriptionStatus) {
            case 'active':
            case 'trialing':
                return 'default';
            case 'past_due':
            case 'unpaid':
                return 'destructive';
            case 'canceled':
                return 'outline';
            default:
                return 'secondary';
        }
    };

    return (
        <Card className={className}>
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                    {getStatusIcon()}
                    Subscription Status
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
                <div className="space-y-3">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold capitalize">
                                {subscriptionPlan} Plan
                            </span>
                            <Badge variant={getStatusVariant()}>
                                {subscriptionStatus || 'Free'}
                            </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            {statusMessage}
                        </p>
                    </div>

                    {!canAccessFeatures && subscriptionPlan !== 'free' && (
                        <div className="p-3 bg-orange-50 border border-orange-200 rounded-md">
                            <div className="flex items-center gap-2 text-orange-800 text-sm">
                                <AlertTriangle className="h-4 w-4" />
                                <span className="font-medium">Action Required</span>
                            </div>
                            <p className="text-orange-700 text-sm mt-1">
                                Please update your payment method to continue using premium features.
                            </p>
                        </div>
                    )}

                    <div className="flex gap-2">
                        {subscriptionPlan === 'free' ? (
                            <Link href="/pricing" className="flex-1">
                                <Button size="sm" className="w-full">
                                    Upgrade Plan
                                </Button>
                            </Link>
                        ) : (
                            <>
                                <Link href="/pricing" className="flex-1">
                                    <Button size="sm" variant="outline" className="w-full">
                                        Change Plan
                                    </Button>
                                </Link>
                                {!hasActiveSubscription && (
                                    <Button size="sm" className="flex-1">
                                        Update Payment
                                    </Button>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}