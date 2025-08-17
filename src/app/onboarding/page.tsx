"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { MultiStepOnboarding, OnboardingFormData } from "@/components/onboarding/multi-step-onboarding";
import { api } from "../../../convex/_generated/api";
import { toast } from "sonner";

export default function OnboardingPage() {
    const router = useRouter();
    const { user } = useUser();
    const completeOnboarding = useMutation(api.userPreferences.completeOnboarding);

    const handleOnboardingComplete = async (data: OnboardingFormData) => {
        try {
            if (!user?.id) {
                throw new Error("User not found");
            }

            // Note: User name will be saved to Convex database
            // Clerk user name updates are handled separately if needed

            // Save onboarding data to Convex
            await completeOnboarding({
                userId: user.id,
                onboardingData: {
                    firstName: data.firstName,
                    lastName: data.lastName,
                    company: data.company,
                    role: data.role,
                    industry: data.industry,
                    teamSize: data.teamSize,
                    primaryUseCase: data.primaryUseCase,
                    goals: data.goals,
                    experienceLevel: data.experienceLevel,
                    contentTypes: data.contentTypes,
                    qualityPreference: data.qualityPreference,
                    emailNotifications: data.emailUpdates,
                    marketingEmails: data.marketingEmails,
                    weeklyDigest: data.weeklyDigest,
                },
            });

            // If user selected a paid plan, redirect to payment
            if (data.selectedPlan !== "free") {
                toast.success("Onboarding completed! Redirecting to payment...");
                router.push(`/pricing?plan=${data.selectedPlan}&onboarding=true`);
            } else {
                toast.success("Welcome to SnapFuse! Let's start creating.");
                router.push("/dashboard/home");
            }
        } catch (error) {
            console.error("Onboarding error:", error);
            toast.error("Something went wrong. Please try again.");
        }
    };

    const handleSkip = () => {
        // Even if skipped, mark onboarding as completed
        if (user?.id) {
            completeOnboarding({
                userId: user.id,
                onboardingData: {},
            }).then(() => {
                router.push("/dashboard/home");
            }).catch((error) => {
                console.error("Skip onboarding error:", error);
                router.push("/dashboard/home");
            });
        } else {
            router.push("/dashboard/home");
        }
    };

    return (
        <MultiStepOnboarding
            onComplete={handleOnboardingComplete}
            onSkip={handleSkip}
        />
    );
}