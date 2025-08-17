"use client";

import React from "react";
import { UseFormReturn } from "react-hook-form";
import { OnboardingFormData } from "../multi-step-onboarding";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Settings, Target, Palette, Gauge } from "lucide-react";

interface PreferencesStepProps {
    form: UseFormReturn<OnboardingFormData>;
}

const useCases = [
    { id: "marketing", label: "Marketing & Advertising", description: "Social media, ads, promotional content" },
    { id: "ecommerce", label: "E-commerce", description: "Product images, listings, catalogs" },
    { id: "content_creation", label: "Content Creation", description: "Blog posts, articles, creative content" },
    { id: "education", label: "Education & Training", description: "Educational materials, presentations" },
    { id: "personal", label: "Personal Projects", description: "Hobby projects, personal use" },
    { id: "business", label: "Business Communications", description: "Reports, presentations, documentation" },
];

const goals = [
    { id: "save_time", label: "Save time on content creation" },
    { id: "improve_quality", label: "Improve content quality" },
    { id: "scale_production", label: "Scale content production" },
    { id: "reduce_costs", label: "Reduce content creation costs" },
    { id: "explore_creativity", label: "Explore creative possibilities" },
    { id: "automate_workflow", label: "Automate content workflows" },
];

const experienceLevels = [
    { id: "beginner", label: "Beginner", description: "New to AI content generation" },
    { id: "intermediate", label: "Intermediate", description: "Some experience with AI tools" },
    { id: "advanced", label: "Advanced", description: "Experienced with AI and content creation" },
];

const contentTypes = [
    { id: "images", label: "Images", description: "Photos, illustrations, graphics" },
    { id: "videos", label: "Videos", description: "Short videos, animations" },
    { id: "both", label: "Both Images & Videos", description: "Mixed content creation" },
];

const qualityPreferences = [
    { id: "speed", label: "Speed", description: "Faster generation, standard quality" },
    { id: "balanced", label: "Balanced", description: "Good balance of speed and quality" },
    { id: "quality", label: "Quality", description: "Best quality, slower generation" },
];

export function PreferencesStep({ form }: PreferencesStepProps) {
    return (
        <div className="space-y-6">
            <div className="text-center space-y-2">
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Settings className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-xl font-semibold">Your Content Preferences</h2>
                <p className="text-muted-foreground">
                    Help us understand how you plan to use SnapFuse.
                </p>
            </div>

            <div className="space-y-6">
                <FormField
                    control={form.control}
                    name="primaryUseCase"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="flex items-center gap-2">
                                <Target className="h-4 w-4" />
                                Primary Use Case *
                            </FormLabel>
                            <FormDescription>
                                What's your main reason for using SnapFuse?
                            </FormDescription>
                            <div className="grid gap-3">
                                {useCases.map((useCase) => (
                                    <div key={useCase.id} className="flex items-center space-x-2">
                                        <input
                                            type="radio"
                                            id={useCase.id}
                                            value={useCase.id}
                                            checked={field.value === useCase.id}
                                            onChange={() => field.onChange(useCase.id)}
                                            className="h-4 w-4"
                                        />
                                        <label htmlFor={useCase.id} className="flex-1 cursor-pointer">
                                            <div className="font-medium">{useCase.label}</div>
                                            <div className="text-sm text-muted-foreground">{useCase.description}</div>
                                        </label>
                                    </div>
                                ))}
                            </div>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="goals"
                    render={() => (
                        <FormItem>
                            <FormLabel>Goals & Objectives</FormLabel>
                            <FormDescription>
                                What do you hope to achieve? (Select all that apply)
                            </FormDescription>
                            <div className="grid grid-cols-2 gap-3">
                                {goals.map((goal) => (
                                    <FormField
                                        key={goal.id}
                                        control={form.control}
                                        name="goals"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                                <FormControl>
                                                    <Checkbox
                                                        checked={field.value?.includes(goal.id)}
                                                        onCheckedChange={(checked: boolean) => {
                                                            const updatedValue = checked
                                                                ? [...(field.value || []), goal.id]
                                                                : (field.value || []).filter((value) => value !== goal.id);
                                                            field.onChange(updatedValue);
                                                        }}
                                                    />
                                                </FormControl>
                                                <FormLabel className="font-normal cursor-pointer">
                                                    {goal.label}
                                                </FormLabel>
                                            </FormItem>
                                        )}
                                    />
                                ))}
                            </div>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="experienceLevel"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Experience Level *</FormLabel>
                            <FormDescription>
                                How familiar are you with AI content generation?
                            </FormDescription>
                            <div className="grid gap-3">
                                {experienceLevels.map((level) => (
                                    <div key={level.id} className="flex items-center space-x-2">
                                        <input
                                            type="radio"
                                            id={level.id}
                                            value={level.id}
                                            checked={field.value === level.id}
                                            onChange={() => field.onChange(level.id)}
                                            className="h-4 w-4"
                                        />
                                        <label htmlFor={level.id} className="flex-1 cursor-pointer">
                                            <div className="font-medium">{level.label}</div>
                                            <div className="text-sm text-muted-foreground">{level.description}</div>
                                        </label>
                                    </div>
                                ))}
                            </div>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="contentTypes"
                    render={() => (
                        <FormItem>
                            <FormLabel className="flex items-center gap-2">
                                <Palette className="h-4 w-4" />
                                Content Types *
                            </FormLabel>
                            <FormDescription>
                                What type of content do you want to create?
                            </FormDescription>
                            <div className="grid gap-3">
                                {contentTypes.map((type) => (
                                    <FormField
                                        key={type.id}
                                        control={form.control}
                                        name="contentTypes"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                                <FormControl>
                                                    <Checkbox
                                                        checked={field.value?.includes(type.id)}
                                                        onCheckedChange={(checked: boolean) => {
                                                            const updatedValue = checked
                                                                ? [...(field.value || []), type.id]
                                                                : (field.value || []).filter((value) => value !== type.id);
                                                            field.onChange(updatedValue);
                                                        }}
                                                    />
                                                </FormControl>
                                                <div className="cursor-pointer">
                                                    <FormLabel className="font-medium cursor-pointer">
                                                        {type.label}
                                                    </FormLabel>
                                                    <div className="text-sm text-muted-foreground">{type.description}</div>
                                                </div>
                                            </FormItem>
                                        )}
                                    />
                                ))}
                            </div>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="qualityPreference"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="flex items-center gap-2">
                                <Gauge className="h-4 w-4" />
                                Quality Preference *
                            </FormLabel>
                            <FormDescription>
                                What's more important to you?
                            </FormDescription>
                            <div className="grid gap-3">
                                {qualityPreferences.map((pref) => (
                                    <div key={pref.id} className="flex items-center space-x-2">
                                        <input
                                            type="radio"
                                            id={pref.id}
                                            value={pref.id}
                                            checked={field.value === pref.id}
                                            onChange={() => field.onChange(pref.id)}
                                            className="h-4 w-4"
                                        />
                                        <label htmlFor={pref.id} className="flex-1 cursor-pointer">
                                            <div className="font-medium">{pref.label}</div>
                                            <div className="text-sm text-muted-foreground">{pref.description}</div>
                                        </label>
                                    </div>
                                ))}
                            </div>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
        </div>
    );
}