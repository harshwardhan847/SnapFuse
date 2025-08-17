"use client";

import React from "react";
import { UseFormReturn } from "react-hook-form";
import { OnboardingFormData } from "../multi-step-onboarding";
import { Sparkles, Image, Video, Zap } from "lucide-react";

interface WelcomeStepProps {
    form: UseFormReturn<OnboardingFormData>;
}

export function WelcomeStep({ form }: WelcomeStepProps) {
    return (
        <div className="space-y-6 text-center">
            <div className="space-y-4">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <Sparkles className="h-8 w-8 text-primary" />
                </div>

                <div>
                    <h2 className="text-2xl font-bold">Welcome to SnapFuse!</h2>
                    <p className="text-muted-foreground mt-2">
                        Let's get you set up with the perfect AI-powered content generation experience.
                        This will only take a few minutes.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-4 py-6">
                <div className="text-center space-y-2">
                    <div className="mx-auto w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                        <Image className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="font-medium">AI Images</h3>
                    <p className="text-sm text-muted-foreground">
                        Generate stunning images from text descriptions
                    </p>
                </div>

                <div className="text-center space-y-2">
                    <div className="mx-auto w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                        <Video className="h-6 w-6 text-purple-600" />
                    </div>
                    <h3 className="font-medium">AI Videos</h3>
                    <p className="text-sm text-muted-foreground">
                        Create engaging videos with AI technology
                    </p>
                </div>

                <div className="text-center space-y-2">
                    <div className="mx-auto w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                        <Zap className="h-6 w-6 text-green-600" />
                    </div>
                    <h3 className="font-medium">Fast & Easy</h3>
                    <p className="text-sm text-muted-foreground">
                        Quick generation with professional results
                    </p>
                </div>
            </div>

            <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-sm">
                    <strong>What to expect:</strong> We'll ask about your background, content preferences,
                    and help you choose the perfect plan. You can always change these settings later.
                </p>
            </div>
        </div>
    );
}