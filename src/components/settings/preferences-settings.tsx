"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";

const preferencesSchema = z.object({
    defaultImageStyle: z.string(),
    defaultImageSize: z.string(),
    defaultVideoLength: z.string(),
    defaultVideoStyle: z.string(),
    qualityPreference: z.enum(["standard", "high", "premium"]),
    autoSaveGenerations: z.boolean(),
    showWatermark: z.boolean(),
    defaultPromptLanguage: z.string(),
    creativityLevel: z.array(z.number()).length(1),
    nsfw_filter: z.boolean(),
    content_moderation: z.boolean(),
});

type PreferencesFormData = z.infer<typeof preferencesSchema>;

export function PreferencesSettings() {
    const form = useForm<PreferencesFormData>({
        resolver: zodResolver(preferencesSchema),
        defaultValues: {
            defaultImageStyle: "realistic",
            defaultImageSize: "1024x1024",
            defaultVideoLength: "5s",
            defaultVideoStyle: "cinematic",
            qualityPreference: "high",
            autoSaveGenerations: true,
            showWatermark: false,
            defaultPromptLanguage: "en",
            creativityLevel: [7],
            nsfw_filter: true,
            content_moderation: true,
        },
    });

    const onSubmit = async (data: PreferencesFormData) => {
        try {
            // TODO: Implement Convex mutation to save preferences
            // await updateUserPreferences({ userId: user.id, preferences: data });
            console.log("Saving preferences:", data);
            toast.success("Preferences updated successfully!");
        } catch (error) {
            toast.error("Failed to update preferences. Please try again.");
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-4">
                    <h3 className="text-lg font-medium">Image Generation Defaults</h3>

                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="defaultImageStyle"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Default Style</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select style" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="realistic">Realistic</SelectItem>
                                            <SelectItem value="artistic">Artistic</SelectItem>
                                            <SelectItem value="cartoon">Cartoon</SelectItem>
                                            <SelectItem value="abstract">Abstract</SelectItem>
                                            <SelectItem value="vintage">Vintage</SelectItem>
                                            <SelectItem value="modern">Modern</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="defaultImageSize"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Default Size</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select size" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="512x512">512x512 (Square)</SelectItem>
                                            <SelectItem value="1024x1024">1024x1024 (Square HD)</SelectItem>
                                            <SelectItem value="1024x768">1024x768 (Landscape)</SelectItem>
                                            <SelectItem value="768x1024">768x1024 (Portrait)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="text-lg font-medium">Video Generation Defaults</h3>

                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="defaultVideoLength"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Default Length</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select length" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="3s">3 seconds</SelectItem>
                                            <SelectItem value="5s">5 seconds</SelectItem>
                                            <SelectItem value="10s">10 seconds</SelectItem>
                                            <SelectItem value="15s">15 seconds</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="defaultVideoStyle"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Default Style</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select style" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="cinematic">Cinematic</SelectItem>
                                            <SelectItem value="documentary">Documentary</SelectItem>
                                            <SelectItem value="animation">Animation</SelectItem>
                                            <SelectItem value="timelapse">Time-lapse</SelectItem>
                                            <SelectItem value="slowmotion">Slow Motion</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="text-lg font-medium">Quality & Performance</h3>

                    <FormField
                        control={form.control}
                        name="qualityPreference"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Quality Preference</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select quality" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="standard">Standard (Faster, Lower Cost)</SelectItem>
                                        <SelectItem value="high">High (Balanced)</SelectItem>
                                        <SelectItem value="premium">Premium (Slower, Higher Cost)</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormDescription>
                                    Higher quality uses more credits but produces better results.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="creativityLevel"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Creativity Level: {field.value[0]}/10</FormLabel>
                                <FormControl>
                                    <Slider
                                        min={1}
                                        max={10}
                                        step={1}
                                        value={field.value}
                                        onValueChange={field.onChange}
                                        className="w-full"
                                    />
                                </FormControl>
                                <FormDescription>
                                    Higher values produce more creative but less predictable results.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="space-y-4">
                    <h3 className="text-lg font-medium">Content & Safety</h3>

                    <div className="space-y-4">
                        <FormField
                            control={form.control}
                            name="nsfw_filter"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <FormLabel className="text-base">NSFW Filter</FormLabel>
                                        <FormDescription>
                                            Block generation of adult or inappropriate content.
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
                            name="content_moderation"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <FormLabel className="text-base">Content Moderation</FormLabel>
                                        <FormDescription>
                                            Enable AI-powered content moderation for safety.
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
                            name="autoSaveGenerations"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <FormLabel className="text-base">Auto-save Generations</FormLabel>
                                        <FormDescription>
                                            Automatically save all generated content to your library.
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
                            name="showWatermark"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <FormLabel className="text-base">Show Watermark</FormLabel>
                                        <FormDescription>
                                            Add SnapFuse watermark to generated content.
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

                <Button type="submit" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? "Saving..." : "Save Preferences"}
                </Button>
            </form>
        </Form>
    );
}