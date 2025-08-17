"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Bell, Mail, Smartphone, Monitor } from "lucide-react";

const notificationSchema = z.object({
    emailNotifications: z.boolean(),
    pushNotifications: z.boolean(),
    smsNotifications: z.boolean(),
    generationComplete: z.boolean(),
    creditLowWarning: z.boolean(),
    subscriptionUpdates: z.boolean(),
    marketingEmails: z.boolean(),
    securityAlerts: z.boolean(),
    weeklyDigest: z.boolean(),
    creditThreshold: z.string(),
    notificationFrequency: z.string(),
});

type NotificationFormData = z.infer<typeof notificationSchema>;

export function NotificationSettings() {
    const form = useForm<NotificationFormData>({
        resolver: zodResolver(notificationSchema),
        defaultValues: {
            emailNotifications: true,
            pushNotifications: true,
            smsNotifications: false,
            generationComplete: true,
            creditLowWarning: true,
            subscriptionUpdates: true,
            marketingEmails: false,
            securityAlerts: true,
            weeklyDigest: true,
            creditThreshold: "10",
            notificationFrequency: "immediate",
        },
    });

    const onSubmit = async (data: NotificationFormData) => {
        try {
            console.log("Saving notification preferences:", data);
            toast.success("Notification preferences updated successfully!");
        } catch (error) {
            toast.error("Failed to update notification preferences. Please try again.");
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-4">
                    <h3 className="text-lg font-medium flex items-center gap-2">
                        <Bell className="h-5 w-5" />
                        Notification Channels
                    </h3>

                    <div className="space-y-4">
                        <FormField
                            control={form.control}
                            name="emailNotifications"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <FormLabel className="text-base flex items-center gap-2">
                                            <Mail className="h-4 w-4" />
                                            Email Notifications
                                        </FormLabel>
                                        <FormDescription>
                                            Receive notifications via email.
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
                            name="pushNotifications"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <FormLabel className="text-base flex items-center gap-2">
                                            <Monitor className="h-4 w-4" />
                                            Browser Notifications
                                        </FormLabel>
                                        <FormDescription>
                                            Receive push notifications in your browser.
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
                            name="smsNotifications"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <FormLabel className="text-base flex items-center gap-2">
                                            <Smartphone className="h-4 w-4" />
                                            SMS Notifications
                                        </FormLabel>
                                        <FormDescription>
                                            Receive important notifications via SMS.
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

                <div className="space-y-4">
                    <h3 className="text-lg font-medium">Notification Types</h3>

                    <div className="space-y-4">
                        <FormField
                            control={form.control}
                            name="generationComplete"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <FormLabel className="text-base">Generation Complete</FormLabel>
                                        <FormDescription>
                                            Get notified when your image or video generation is complete.
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
                            name="creditLowWarning"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <FormLabel className="text-base">Low Credits Warning</FormLabel>
                                        <FormDescription>
                                            Get warned when your credits are running low.
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
                            name="subscriptionUpdates"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <FormLabel className="text-base">Subscription Updates</FormLabel>
                                        <FormDescription>
                                            Notifications about billing, renewals, and plan changes.
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
                            name="securityAlerts"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <FormLabel className="text-base">Security Alerts</FormLabel>
                                        <FormDescription>
                                            Important security notifications about your account.
                                        </FormDescription>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                            disabled
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
                                            Weekly summary of your activity and usage.
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
                                            Product updates, tips, and promotional content.
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

                <div className="space-y-4">
                    <h3 className="text-lg font-medium">Notification Settings</h3>

                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="creditThreshold"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Low Credit Threshold</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select threshold" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="5">5 credits</SelectItem>
                                            <SelectItem value="10">10 credits</SelectItem>
                                            <SelectItem value="20">20 credits</SelectItem>
                                            <SelectItem value="50">50 credits</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormDescription>
                                        Get notified when credits drop below this amount.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="notificationFrequency"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Notification Frequency</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select frequency" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="immediate">Immediate</SelectItem>
                                            <SelectItem value="hourly">Hourly Digest</SelectItem>
                                            <SelectItem value="daily">Daily Digest</SelectItem>
                                            <SelectItem value="weekly">Weekly Digest</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormDescription>
                                        How often to receive non-urgent notifications.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <Button type="submit" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? "Saving..." : "Save Notification Preferences"}
                </Button>
            </form>
        </Form>
    );
}