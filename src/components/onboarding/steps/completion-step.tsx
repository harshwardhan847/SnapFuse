"use client";

import React from "react";
import { UseFormReturn } from "react-hook-form";
import { OnboardingFormData } from "../multi-step-onboarding";
import { Form, FormControl, FormField, FormItem, FormLabel, FormDescription } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { SUBSCRIPTION_PLANS } from "@/config/pricing";
import { CheckCircle, Mail, Zap, Sparkles } from "lucide-react";

interface CompletionStepProps {
    form: UseFormReturn<OnboardingFormData>;
}

export function CompletionStep({ form }: CompletionStepProps) {
    const formData = form.getValues();
    const selectedPlan = SUBSCRIPTION_PLANS[formData.selectedPlan?.toUpperCase() as keyof typeof SUBSCRIPTION_PLANS];

    return (
        <div className="space-y-6">
            <div className="text-center space-y-4">
                <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold">You're all set!</h2>
                    <p className="text-muted-foreground mt-2">
                        Welcome to SnapFuse, {formData.firstName}! Let's review your setup.
                    </p>
                </div>
            </div>

            <Card>
                <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <h4 className="font-medium text-sm text-muted-foreground">SELECTED PLAN</h4>
                            <div className="flex items-center gap-2 mt-1">
                                <Zap className="h-4 w-4 text-yellow-500" />
                                <span className="font-semibold">{selectedPlan?.name}</span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                {selectedPlan?.credits} credits per month
                            </p>
                        </div>

                        <div>
                            <h4 className="font-medium text-sm text-muted-foreground">PRIMARY USE CASE</h4>
                            <div className="flex items-center gap-2 mt-1">
                                <Sparkles className="h-4 w-4 text-blue-500" />
                                <span className="font-semibold capitalize">
                                    {formData.primaryUseCase?.replace(/_/g, ' ')}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-medium text-sm text-muted-foreground">CONTENT TYPES</h4>
                        <div className="flex flex-wrap gap-2 mt-1">
                            {formData.contentTypes?.map((type) => (
                                <span
                                    key={type}
                                    className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full capitalize"
                                >
                                    {type.replace(/_/g, ' ')}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="font-medium text-sm text-muted-foreground">YOUR GOALS</h4>
                        <div className="flex flex-wrap gap-2 mt-1">
                            {formData.goals?.slice(0, 3).map((goal) => (
                                <span
                                    key={goal}
                                    className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-full"
                                >
                                    {goal.replace(/_/g, ' ')}
                                </span>
                            ))}
                            {formData.goals && formData.goals.length > 3 && (
                                <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full">
                                    +{formData.goals.length - 3} more
                                </span>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="space-y-4">
                <h3 className="font-medium flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Communication Preferences
                </h3>

                <div className="space-y-4">
                    <FormField
                        control={form.control}
                        name="emailUpdates"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                    <FormLabel className="text-base">Product Updates</FormLabel>
                                    <FormDescription>
                                        Get notified about new features and improvements.
                                    </FormDescription>
                                </div>
                                <FormControl>
                                    <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="weeklyDigest"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                    <FormLabel className="text-base">Weekly Digest</FormLabel>
                                    <FormDescription>
                                        Weekly summary of your usage and tips.
                                    </FormDescription>
                                </div>
                                <FormControl>
                                    <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="marketingEmails"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                    <FormLabel className="text-base">Marketing Emails</FormLabel>
                                    <FormDescription>
                                        Tips, tutorials, and promotional content.
                                    </FormDescription>
                                </div>
                                <FormControl>
                                    <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-4">
                <h4 className="font-medium mb-2">What happens next?</h4>
                <ul className="text-sm space-y-1">
                    <li>✨ Your account will be set up with your preferences</li>
                    <li>🎯 You'll be redirected to the dashboard to start creating</li>
                    <li>📧 Check your email for a welcome guide and tips</li>
                    <li>🚀 Start generating amazing content right away!</li>
                </ul>
            </div>
        </div>
    );
}