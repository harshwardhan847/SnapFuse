"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export function useOnboardingStatus() {
    const { user, isLoaded } = useUser();

    const onboardingStatus = useQuery(
        api.userPreferences.checkOnboardingStatus,
        user?.id ? { userId: user.id } : "skip"
    );

    return {
        isLoaded: isLoaded && onboardingStatus !== undefined,
        needsOnboarding: user && onboardingStatus ? !onboardingStatus.completed : false,
        user: onboardingStatus?.user,
    };
}