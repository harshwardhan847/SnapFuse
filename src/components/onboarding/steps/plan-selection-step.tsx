"use client";

import React from "react";
import { UseFormReturn } from "react-hook-form";
import { OnboardingFormData } from "../multi-step-onboarding";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CREDIT_COSTS, SUBSCRIPTION_PLANS } from "@/config/pricing";
import { Check, CreditCard, Zap, Star } from "lucide-react";

interface PlanSelectionStepProps {
  form: UseFormReturn<OnboardingFormData>;
}

export function PlanSelectionStep({ form }: PlanSelectionStepProps) {
  const selectedPlan = form.watch("selectedPlan");

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
          <CreditCard className="h-6 w-6 text-primary" />
        </div>
        <h2 className="text-xl font-semibold">Choose Your Plan</h2>
        <p className="text-muted-foreground">
          Start with a plan that fits your needs. You can always upgrade or
          downgrade later.
        </p>
      </div>

      <FormField
        control={form.control}
        name="selectedPlan"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <div className="grid gap-4">
                {Object.entries(SUBSCRIPTION_PLANS).map(([key, plan]) => (
                  <Card
                    key={key}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedPlan === key.toLowerCase()
                        ? "ring-2 ring-primary border-primary"
                        : ""
                    } ${plan.popular ? "relative" : ""}`}
                    onClick={() => field.onChange(key.toLowerCase())}
                  >
                    {plan.popular && (
                      <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                        <Star className="h-3 w-3 mr-1" />
                        Most Popular
                      </Badge>
                    )}

                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{plan.name}</CardTitle>
                        <div className="text-right">
                          <div className="text-2xl font-bold">
                            {plan.price === 0 ? "Free" : `$${plan.price}`}
                          </div>
                          {plan.price > 0 && (
                            <div className="text-sm text-muted-foreground">
                              /month
                            </div>
                          )}
                        </div>
                      </div>
                      <CardDescription>{plan.description}</CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-yellow-500" />
                        <span className="font-medium">
                          {plan.credits} credits per month
                        </span>
                      </div>

                      <ul className="space-y-2">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>

                      {key.toLowerCase() === "free" && (
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                          <p className="text-sm text-blue-700 dark:text-blue-300">
                            Perfect for getting started! No credit card
                            required.
                          </p>
                        </div>
                      )}

                      {selectedPlan === key.toLowerCase() && (
                        <div className="flex items-center gap-2 text-primary">
                          <Check className="h-4 w-4" />
                          <span className="text-sm font-medium">Selected</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="bg-muted/50 rounded-lg p-4 space-y-2">
        <h4 className="font-medium">What are credits?</h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>
            • {CREDIT_COSTS.IMAGE_GENERATION} credit = 1 AI image generation
          </li>
          <li>
            • {CREDIT_COSTS.VIDEO_GENERATION} credits = 1 AI video generation
          </li>
          <li>• Credits reset monthly with your subscription</li>
          <li>• Unused credits don't roll over (except for top-ups)</li>
        </ul>
      </div>

      <div className="text-center text-sm text-muted-foreground">
        <p>
          All plans include a 7-day free trial. Cancel anytime.
          <br />
          No hidden fees or long-term commitments.
        </p>
      </div>
    </div>
  );
}
