"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CreditCard, Download, Calendar, Zap } from "lucide-react";
import { SUBSCRIPTION_PLANS, TOPUP_OPTIONS } from "@/config/pricing";

export function BillingSettings() {
    // Mock data - replace with actual user data
    const currentPlan = "pro";
    const currentCredits = 150;
    const totalCredits = 250;
    const nextBillingDate = "2024-02-15";
    const creditUsage = (currentCredits / totalCredits) * 100;

    return (
        <div className="space-y-6">
            {/* Current Plan */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5" />
                        Current Plan
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold">
                                {SUBSCRIPTION_PLANS[currentPlan.toUpperCase() as keyof typeof SUBSCRIPTION_PLANS].name}
                            </h3>
                            <p className="text-muted-foreground">
                                ${SUBSCRIPTION_PLANS[currentPlan.toUpperCase() as keyof typeof SUBSCRIPTION_PLANS].price}/month
                            </p>
                        </div>
                        <Badge variant="default">Active</Badge>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span>Next billing date</span>
                            <span>{nextBillingDate}</span>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <Button variant="outline">Change Plan</Button>
                        <Button variant="outline">Cancel Subscription</Button>
                    </div>
                </CardContent>
            </Card>

            {/* Credits Overview */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Zap className="h-5 w-5" />
                        Credits Overview
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span>Available Credits</span>
                            <span className="font-semibold">{currentCredits} / {totalCredits}</span>
                        </div>
                        <Progress value={creditUsage} className="h-2" />
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="text-muted-foreground">This month used</p>
                            <p className="font-semibold">{totalCredits - currentCredits} credits</p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Resets on</p>
                            <p className="font-semibold">{nextBillingDate}</p>
                        </div>
                    </div>

                    <Button className="w-full">
                        <Zap className="h-4 w-4 mr-2" />
                        Buy More Credits
                    </Button>
                </CardContent>
            </Card>

            {/* Credit Top-ups */}
            <Card>
                <CardHeader>
                    <CardTitle>Credit Top-ups</CardTitle>
                    <CardDescription>
                        Purchase additional credits that don't expire
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                        {TOPUP_OPTIONS.map((topup) => (
                            <Card key={topup.id} className="relative">
                                {'popular' in topup && topup.popular && (
                                    <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                                        Popular
                                    </Badge>
                                )}
                                <CardContent className="pt-6">
                                    <div className="text-center space-y-2">
                                        <h3 className="font-semibold">{topup.name}</h3>
                                        <p className="text-2xl font-bold">${topup.price}</p>
                                        <Button className="w-full" size="sm">
                                            Purchase
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
                <CardHeader>
                    <CardTitle>Payment Method</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                            <CreditCard className="h-5 w-5" />
                            <div>
                                <p className="font-medium">•••• •••• •••• 4242</p>
                                <p className="text-sm text-muted-foreground">Expires 12/25</p>
                            </div>
                        </div>
                        <Badge variant="secondary">Default</Badge>
                    </div>

                    <div className="flex gap-2">
                        <Button variant="outline">Add Payment Method</Button>
                        <Button variant="outline">Update</Button>
                    </div>
                </CardContent>
            </Card>

            {/* Billing History */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        Billing History
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {[
                            { date: "2024-01-15", amount: "$19.99", status: "Paid", type: "Subscription" },
                            { date: "2024-01-10", amount: "$8.99", status: "Paid", type: "Credit Top-up" },
                            { date: "2023-12-15", amount: "$19.99", status: "Paid", type: "Subscription" },
                        ].map((invoice, index) => (
                            <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                                <div>
                                    <p className="font-medium">{invoice.type}</p>
                                    <p className="text-sm text-muted-foreground">{invoice.date}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-medium">{invoice.amount}</p>
                                    <Badge variant={invoice.status === "Paid" ? "default" : "secondary"}>
                                        {invoice.status}
                                    </Badge>
                                </div>
                                <Button variant="ghost" size="sm">
                                    <Download className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}