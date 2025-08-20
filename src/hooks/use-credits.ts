"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";

import { CREDIT_COSTS, getCreditCost } from "@/config/pricing";
import { toast } from "sonner";
import { api } from "../../convex/_generated/api";
import {
  isSubscriptionActive,
  shouldAllowFeatureAccess,
} from "@/lib/subscription-utils";

export function useCredits() {
  const { user } = useUser();

  const userCredits = useQuery(
    api.payments.getUserCredits,
    user ? { userId: user.id } : "skip"
  );

  const checkCredits = useQuery(
    api.payments.checkCredits,
    user ? { userId: user.id, requiredCredits: 1 } : "skip"
  );

  const canAfford = (action: keyof typeof CREDIT_COSTS) => {
    if (!userCredits) return false;
    const cost = getCreditCost(action);
    return userCredits.credits >= cost;
  };

  const getCreditCostForAction = (action: keyof typeof CREDIT_COSTS) => {
    return getCreditCost(action);
  };

  const hasActiveSubscription = isSubscriptionActive(
    userCredits?.subscriptionStatus,
    userCredits?.subscriptionPeriodEnd ?? undefined
  );

  const canAccessFeatures = shouldAllowFeatureAccess(
    userCredits?.subscriptionPlan || "free",
    userCredits?.subscriptionStatus,
    userCredits?.subscriptionPeriodEnd ?? undefined
  );

  return {
    credits: userCredits?.credits || 0,
    subscriptionPlan: userCredits?.subscriptionPlan || "free",
    subscriptionStatus: userCredits?.subscriptionStatus,
    subscriptionPeriodEnd: userCredits?.subscriptionPeriodEnd,
    hasActiveSubscription,
    canAccessFeatures,
    canAfford,
    getCreditCostForAction,
    isLoading: userCredits === undefined,
  };
}
