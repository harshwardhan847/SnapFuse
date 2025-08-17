"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Shield, Key, Smartphone, Eye, EyeOff, Trash2, Download } from "lucide-react";

const passwordSchema = z.object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

const privacySchema = z.object({
    profileVisibility: z.enum(["public", "private"]),
    showActivity: z.boolean(),
    allowDataCollection: z.boolean(),
    allowAnalytics: z.boolean(),
});

type PasswordFormData = z.infer<typeof passwordSchema>;
type PrivacyFormData = z.infer<typeof privacySchema>;

export function SecuritySettings() {
    const [showPasswords, setShowPasswords] = React.useState({
        current: false,
        new: false,
        confirm: false,
    });

    const passwordForm = useForm<PasswordFormData>({
        resolver: zodResolver(passwordSchema),
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
    });

    const privacyForm = useForm<PrivacyFormData>({
        resolver: zodResolver(privacySchema),
        defaultValues: {
            profileVisibility: "private",
            showActivity: false,
            allowDataCollection: true,
            allowAnalytics: true,
        },
    });

    const onPasswordSubmit = async (data: PasswordFormData) => {
        try {
            console.log("Updating password:", data);
            toast.success("Password updated successfully!");
            passwordForm.reset();
        } catch (error) {
            toast.error("Failed to update password. Please try again.");
        }
    };

    const onPrivacySubmit = async (data: PrivacyFormData) => {
        try {
            console.log("Updating privacy settings:", data);
            toast.success("Privacy settings updated successfully!");
        } catch (error) {
            toast.error("Failed to update privacy settings. Please try again.");
        }
    };

    const handleExportData = () => {
        toast.success("Data export initiated. You'll receive an email when ready.");
    };

    const handleDeleteAccount = () => {
        toast.error("Account deletion requires additional verification. Please contact support.");
    };

    return (
        <div className="space-y-6">
            {/* Password Change */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Key className="h-5 w-5" />
                        Change Password
                    </CardTitle>
                    <CardDescription>
                        Update your password to keep your account secure.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...passwordForm}>
                        <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                            <FormField
                                control={passwordForm.control}
                                name="currentPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Current Password</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input
                                                    {...field}
                                                    type={showPasswords.current ? "text" : "password"}
                                                    placeholder="Enter current password"
                                                />
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                                    onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                                                >
                                                    {showPasswords.current ? (
                                                        <EyeOff className="h-4 w-4" />
                                                    ) : (
                                                        <Eye className="h-4 w-4" />
                                                    )}
                                                </Button>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={passwordForm.control}
                                name="newPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>New Password</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input
                                                    {...field}
                                                    type={showPasswords.new ? "text" : "password"}
                                                    placeholder="Enter new password"
                                                />
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                                    onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                                                >
                                                    {showPasswords.new ? (
                                                        <EyeOff className="h-4 w-4" />
                                                    ) : (
                                                        <Eye className="h-4 w-4" />
                                                    )}
                                                </Button>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={passwordForm.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Confirm New Password</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input
                                                    {...field}
                                                    type={showPasswords.confirm ? "text" : "password"}
                                                    placeholder="Confirm new password"
                                                />
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                                    onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                                                >
                                                    {showPasswords.confirm ? (
                                                        <EyeOff className="h-4 w-4" />
                                                    ) : (
                                                        <Eye className="h-4 w-4" />
                                                    )}
                                                </Button>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button type="submit" disabled={passwordForm.formState.isSubmitting}>
                                {passwordForm.formState.isSubmitting ? "Updating..." : "Update Password"}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>

            {/* Two-Factor Authentication */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Smartphone className="h-5 w-5" />
                        Two-Factor Authentication
                    </CardTitle>
                    <CardDescription>
                        Add an extra layer of security to your account.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                            <h4 className="font-medium">Authenticator App</h4>
                            <p className="text-sm text-muted-foreground">
                                Use an authenticator app to generate verification codes.
                            </p>
                        </div>
                        <Badge variant="secondary">Not Enabled</Badge>
                    </div>

                    <Button variant="outline">
                        Enable Two-Factor Authentication
                    </Button>
                </CardContent>
            </Card>

            {/* Active Sessions */}
            <Card>
                <CardHeader>
                    <CardTitle>Active Sessions</CardTitle>
                    <CardDescription>
                        Manage your active sessions across different devices.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {[
                            { device: "Chrome on MacBook Pro", location: "San Francisco, CA", current: true, lastActive: "Now" },
                            { device: "Safari on iPhone", location: "San Francisco, CA", current: false, lastActive: "2 hours ago" },
                            { device: "Chrome on Windows", location: "New York, NY", current: false, lastActive: "1 day ago" },
                        ].map((session, index) => (
                            <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h4 className="font-medium">{session.device}</h4>
                                        {session.current && <Badge variant="default" >Current</Badge>}
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        {session.location} • {session.lastActive}
                                    </p>
                                </div>
                                {!session.current && (
                                    <Button variant="outline" size="sm">
                                        Revoke
                                    </Button>
                                )}
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Privacy Settings */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        Privacy Settings
                    </CardTitle>
                    <CardDescription>
                        Control how your data is used and shared.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...privacyForm}>
                        <form onSubmit={privacyForm.handleSubmit(onPrivacySubmit)} className="space-y-4">
                            <FormField
                                control={privacyForm.control}
                                name="showActivity"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                        <div className="space-y-0.5">
                                            <FormLabel className="text-base">Show Activity Status</FormLabel>
                                            <FormDescription>
                                                Allow others to see when you're active on the platform.
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
                                control={privacyForm.control}
                                name="allowDataCollection"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                        <div className="space-y-0.5">
                                            <FormLabel className="text-base">Data Collection</FormLabel>
                                            <FormDescription>
                                                Allow collection of usage data to improve our services.
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
                                control={privacyForm.control}
                                name="allowAnalytics"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                        <div className="space-y-0.5">
                                            <FormLabel className="text-base">Analytics</FormLabel>
                                            <FormDescription>
                                                Allow analytics tracking for product improvements.
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

                            <Button type="submit" disabled={privacyForm.formState.isSubmitting}>
                                {privacyForm.formState.isSubmitting ? "Saving..." : "Save Privacy Settings"}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>

            {/* Data Management */}
            <Card>
                <CardHeader>
                    <CardTitle>Data Management</CardTitle>
                    <CardDescription>
                        Export or delete your account data.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                            <h4 className="font-medium">Export Data</h4>
                            <p className="text-sm text-muted-foreground">
                                Download a copy of all your data including generations and settings.
                            </p>
                        </div>
                        <Button variant="outline" onClick={handleExportData}>
                            <Download className="h-4 w-4 mr-2" />
                            Export
                        </Button>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg border-destructive/20">
                        <div>
                            <h4 className="font-medium text-destructive">Delete Account</h4>
                            <p className="text-sm text-muted-foreground">
                                Permanently delete your account and all associated data.
                            </p>
                        </div>
                        <Button variant="destructive" onClick={handleDeleteAccount}>
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}