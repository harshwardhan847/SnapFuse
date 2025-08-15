"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";

import { CREDIT_COSTS, getCreditCost } from "@/config/pricing";
import { toast } from "sonner";
import { api } from "../../convex/_generated/api";
import { isSubscriptionActive, shouldAllowFeatureAccess } from "@/lib/subscription-utils";

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

  const deductCredits = useMutation(api.payments.deductCredits);

  const canAfford = (action: keyof typeof CREDIT_COSTS) => {
    if (!userCredits) return false;
    const cost = getCreditCost(action);
    return userCredits.credits >= cost;
  };

  const deductCreditsForAction = async (
    action: keyof typeof CREDIT_COSTS,
    relatedId?: string
  ) => {
    if (!user) {
      throw new Error("User not authenticated");
    }

    const cost = getCreditCost(action);

    if (!canAfford(action)) {
      throw new Error("Insufficient credits");
    }

    try {
      const result = await deductCredits({
        userId: user.id,
        amount: cost,
        reason: action.toLowerCase(),
        relatedId,
      });

      toast.success(`${cost} credit${cost > 1 ? "s" : ""} deducted`);
      return result;
    } catch (error) {
      console.error("Error deducting credits:", error);
      toast.error("Failed to deduct credits");
      throw error;
    }
  };

  const getCreditCostForAction = (action: keyof typeof CREDIT_COSTS) => {
    return getCreditCost(action);
  };

  const hasActiveSubscription = isSubscriptionActive(
    userCredits?.subscriptionStatus,
    userCredits?.subscriptionPeriodEnd
  );

  const canAccessFeatures = shouldAllowFeatureAccess(
    userCredits?.subscriptionPlan || 'free',
    userCredits?.subscriptionStatus,
    userCredits?.subscriptionPeriodEnd
  );

  return {
    credits: userCredits?.credits || 0,
    subscriptionPlan: userCredits?.subscriptionPlan || "free",
    subscriptionStatus: userCredits?.subscriptionStatus,
    subscriptionPeriodEnd: userCredits?.subscriptionPeriodEnd,
    hasActiveSubscription,
    canAccessFeatures,
    canAfford,
    deductCreditsForAction,
    getCreditCostForAction,
    isLoading: userCredits === undefined,
  };
}
