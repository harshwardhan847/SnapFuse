"use client";

import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Form } from "@/components/ui/form";
import { WelcomeStep } from "./steps/welcome-step";
import { PersonalInfoStep } from "./steps/personal-info-step";
import { PreferencesStep } from "./steps/preferences-step";
import { PlanSelectionStep } from "./steps/plan-selection-step";
import { CompletionStep } from "./steps/completion-step";
import { ChevronLeft, ChevronRight } from "lucide-react";

const onboardingSchema = z.object({
    // Personal Information
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    company: z.string().optional(),
    role: z.string().optional(),
    industry: z.string().optional(),
    teamSize: z.string().optional(),

    // Use Case & Goals
    primaryUseCase: z.string().min(1, "Please select your primary use case"),
    goals: z.array(z.string()).min(1, "Please select at least one goal"),
    experienceLevel: z.string().min(1, "Please select your experience level"),

    // Content Preferences
    contentTypes: z.array(z.string()).min(1, "Please select at least one content type"),
    preferredStyles: z.array(z.string()).optional(),
    qualityPreference: z.string().min(1, "Please select quality preference"),

    // Plan Selection
    selectedPlan: z.string().min(1, "Please select a plan"),

    // Communication Preferences
    emailUpdates: z.boolean(),
    marketingEmails: z.boolean(),
    weeklyDigest: z.boolean(),
});

export type OnboardingFormData = z.infer<typeof onboardingSchema>;

const steps = [
    { id: 1, title: "Welcome", component: WelcomeStep },
    { id: 2, title: "Personal Info", component: PersonalInfoStep },
    { id: 3, title: "Preferences", component: PreferencesStep },
    { id: 4, title: "Choose Plan", component: PlanSelectionStep },
    { id: 5, title: "Complete", component: CompletionStep },
];

interface MultiStepOnboardingProps {
    onComplete: (data: OnboardingFormData) => void;
    onSkip?: () => void;
}

export function MultiStepOnboarding({ onComplete, onSkip }: MultiStepOnboardingProps) {
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<OnboardingFormData>({
        resolver: zodResolver(onboardingSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            company: "",
            role: "",
            industry: "",
            teamSize: "",
            primaryUseCase: "",
            goals: [],
            experienceLevel: "",
            contentTypes: [],
            preferredStyles: [],
            qualityPreference: "",
            selectedPlan: "free",
            emailUpdates: true,
            marketingEmails: false,
            weeklyDigest: true,
        },
        mode: "onChange",
    });

    const nextStep = async () => {
        console.log("nextStep called, current step:", currentStep);

        // For step 1 (Welcome), just move to next step
        if (currentStep === 1) {
            console.log("Moving from welcome step to step 2");
            setCurrentStep(2);
            return;
        }

        // For other steps, do validation
        let isValid = true;

        if (currentStep === 2) {
            // Personal info step - validate required fields
            isValid = await form.trigger(["firstName", "lastName"]);
        } else if (currentStep === 3) {
            // Preferences step - validate required fields
            isValid = await form.trigger(["primaryUseCase", "goals", "experienceLevel", "contentTypes", "qualityPreference"]);
        } else if (currentStep === 4) {
            // Plan selection step - validate plan selection
            isValid = await form.trigger(["selectedPlan"]);
        } else {
            // Final step - validate all remaining fields
            isValid = await form.trigger();
        }

        console.log(`Step ${currentStep} validation result:`, isValid);
        if (!isValid) {
            console.log("Form errors:", form.formState.errors);
        }

        if (isValid && currentStep < steps.length) {
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleSubmit: SubmitHandler<OnboardingFormData> = async (data) => {
        setIsSubmitting(true);
        try {
            await onComplete(data);
        } catch (error) {
            console.error("Onboarding submission error:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const progress = (currentStep / steps.length) * 100;
    const CurrentStepComponent = steps[currentStep - 1].component;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
            <Card className="w-full max-w-2xl">
                <CardHeader className="text-center">
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-2xl font-bold">Welcome to SnapFuse</h1>
                        {onSkip && currentStep < steps.length && (
                            <Button variant="ghost" onClick={onSkip}>
                                Skip Setup
                            </Button>
                        )}
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-center space-x-2">
                            {steps.map((step) => (
                                <div
                                    key={step.id}
                                    className={`w-3 h-3 rounded-full ${step.id <= currentStep
                                        ? "bg-primary"
                                        : "bg-muted"
                                        }`}
                                />
                            ))}
                        </div>
                        <Progress value={progress} className="w-full" />
                        <p className="text-sm text-muted-foreground">
                            Step {currentStep} of {steps.length}: {steps[currentStep - 1].title}
                        </p>
                    </div>
                </CardHeader>

                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleSubmit)}>
                            <CurrentStepComponent form={form} />

                            <div className="flex justify-between mt-8">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={prevStep}
                                    disabled={currentStep === 1}
                                >
                                    <ChevronLeft className="h-4 w-4 mr-2" />
                                    Previous
                                </Button>

                                {currentStep < steps.length ? (
                                    <Button
                                        type="button"
                                        onClick={() => {
                                            console.log("Next button clicked, current step:", currentStep);
                                            nextStep();
                                        }}
                                    >
                                        Next
                                        <ChevronRight className="h-4 w-4 ml-2" />
                                    </Button>
                                ) : (
                                    <Button type="submit" disabled={isSubmitting}>
                                        {isSubmitting ? "Setting up..." : "Complete Setup"}
                                    </Button>
                                )}
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}