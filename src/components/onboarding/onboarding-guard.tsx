"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

interface OnboardingGuardProps {
    children: React.ReactNode;
}

export function OnboardingGuard({ children }: OnboardingGuardProps) {
    const { user, isLoaded } = useUser();
    const router = useRouter();

    const onboardingStatus = useQuery(
        api.userPreferences.checkOnboardingStatus,
        user?.id ? { userId: user.id } : "skip"
    );

    useEffect(() => {
        if (isLoaded && user && onboardingStatus !== undefined) {
            // If user exists but hasn't completed onboarding, redirect to onboarding
            if (!onboardingStatus.completed) {
                router.push("/onboarding");
            }
        }
    }, [isLoaded, user, onboardingStatus, router]);

    // Show loading state while checking onboarding status
    if (!isLoaded || (user && onboardingStatus === undefined)) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    // If user hasn't completed onboarding, don't render children
    // (they'll be redirected to onboarding)
    if (user && onboardingStatus && !onboardingStatus.completed) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return <>{children}</>;
}