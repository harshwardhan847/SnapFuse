"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check, Loader2 } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";

interface PricingCardProps {
  plan: {
    id: string;
    name: string;
    description: string;
    price: number;
    priceId: string | null;
    credits: number;
    features: readonly string[];
    popular: boolean;
  };
  currentPlan?: string;
  onSubscribe?: (planId: string) => Promise<void>;
}

export function PricingCard({
  plan,
  currentPlan,
  onSubscribe,
}: PricingCardProps) {
  const [loading, setLoading] = useState(false);
  const { user } = useUser();

  const isCurrentPlan = currentPlan === plan.id;
  const isFree = plan.id === "free";

  const handleSubscribe = async () => {
    if (!user) {
      toast.error("Please sign in to subscribe");
      return;
    }

    if (isFree || isCurrentPlan) return;

    setLoading(true);
    try {
      if (onSubscribe) {
        await onSubscribe(plan.id);
      }
    } catch (error) {
      console.error("Subscription error:", error);
      toast.error("Failed to start subscription");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      className={`relative ${plan.popular ? "border-primary shadow-lg scale-105" : ""}`}
    >
      {plan.popular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
            Most Popular
          </span>
        </div>
      )}

      <CardHeader className="text-center">
        <CardTitle className="text-2xl">{plan.name}</CardTitle>
        <CardDescription>{plan.description}</CardDescription>
        <div className="mt-4">
          <span className="text-4xl font-bold">${plan.price}</span>
          {!isFree && <span className="text-muted-foreground">/month</span>}
        </div>
        <div className="text-sm text-muted-foreground">
          {plan.credits} credits included
        </div>
      </CardHeader>

      <CardContent>
        <ul className="space-y-3">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter>
        <Button
          className="w-full"
          variant={plan.popular ? "default" : "outline"}
          onClick={handleSubscribe}
          disabled={
            loading || isCurrentPlan || (isFree && currentPlan === "free")
          }
        >
          {loading && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin text-primary" />
          )}
          {isCurrentPlan
            ? "Current Plan"
            : isFree
              ? "Get Started"
              : "Subscribe"}
        </Button>
      </CardFooter>
    </Card>
  );
}
