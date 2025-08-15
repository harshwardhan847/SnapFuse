"use client";

import { useCredits } from "./use-credits";
import { SUBSCRIPTION_PLANS } from "@/config/pricing";

export function usePlan() {
    const { subscriptionPlan, subscriptionStatus, subscriptionPeriodEnd, isLoading } = useCredits();

    // Normalize plan ID to match our config
    const currentPlanId = subscriptionPlan || 'free';

    // Get plan details
    const planKey = currentPlanId.toUpperCase() as keyof typeof SUBSCRIPTION_PLANS;
    const planDetails = SUBSCRIPTION_PLANS[planKey] || SUBSCRIPTION_PLANS.FREE;

    // Plan status helpers
    const isFree = currentPlanId === 'free';
    const isStarter = currentPlanId === 'starter';
    const isPro = currentPlanId === 'pro';
    const isEnterprise = currentPlanId === 'enterprise';

    // Plan hierarchy helpers
    const isPaid = !isFree;
    const isBasic = isFree || isStarter;
    const isPremium = isPro || isEnterprise;

    return {
        // Current plan info
        planId: currentPlanId,
        planName: planDetails.name,
        planDetails,

        // Status
        subscriptionStatus,
        subscriptionPeriodEnd,
        isLoading,

        // Plan type checks
        isFree,
        isStarter,
        isPro,
        isEnterprise,

        // Plan tier checks
        isPaid,
        isBasic,
        isPremium,
    };
}

// Simple hook that just returns the current plan ID
export function useCurrentPlan(): string {
    const { subscriptionPlan } = useCredits();
    return subscriptionPlan || 'free';
}