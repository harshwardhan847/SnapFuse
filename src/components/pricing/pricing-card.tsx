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
import { BadgeCheck, Check, Loader2 } from "lucide-react";
import { useClerk, useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";
import NumberFlow from "@number-flow/react";

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
    highlighted: boolean;
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
  const { openSignUp } = useClerk();

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
  const isPopular = plan.popular;
  const isHighlighted = plan.highlighted;

  return (
    <div
      className={cn(
        "relative flex flex-col dark gap-8 overflow-hidden rounded-2xl border p-6 shadow",
        isHighlighted
          ? "bg-foreground text-background"
          : "bg-background text-foreground",
        isPopular && "outline outline-[#eb638a]"
      )}
    >
      {isHighlighted && <HighlightedBackground />}
      {isPopular && <PopularBackground />}

      <h2 className="flex items-center gap-3 text-xl font-medium capitalize">
        {plan.name}
        {isPopular && (
          <Badge className="mt-1 bg-orange-900 px-1 py-0 text-white hover:bg-orange-900">
            🔥 Most Popular
          </Badge>
        )}
      </h2>

      <div className="relative h-12">
        {typeof plan.price === "number" ? (
          <>
            <NumberFlow
              format={{
                style: "currency",
                currency: "USD",
                trailingZeroDisplay: "stripIfInteger",
              }}
              value={plan.price}
              className="text-4xl font-medium"
            />
            <p className="-mt-2 text-xs font-medium">Per month</p>
          </>
        ) : (
          <h1 className="text-4xl font-medium">{plan.price}</h1>
        )}
      </div>

      <div className="flex-1 space-y-2">
        <h3 className="text-sm font-medium">{plan.description}</h3>
        <div className="mt-4">
          <span className="text-4xl font-bold">${plan.price}</span>
          {!isFree && <span className="text-muted-foreground">/month</span>}
        </div>
        <div className="text-sm text-muted-foreground">
          {plan.credits} credits included
        </div>
        <ul className="space-y-2">
          {plan.features.map((feature, index) => (
            <li
              key={index}
              className={cn(
                "flex items-center gap-2 text-sm font-medium",
                isHighlighted ? "text-background" : "text-foreground/60"
              )}
            >
              <BadgeCheck strokeWidth={1} size={16} />
              {feature}
            </li>
          ))}
        </ul>
      </div>

      {user?.id ? (
        <Button
          variant={plan.popular ? "default" : "outline"}
          onClick={handleSubscribe}
          disabled={
            loading || isCurrentPlan || (isFree && currentPlan === "free")
          }
          className={cn(
            "h-fit w-full rounded-lg",
            isHighlighted && "bg-accent text-foreground hover:bg-accent/95"
          )}
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
      ) : (
        <Button
          className={cn(
            "h-fit w-full rounded-lg",
            isHighlighted && "bg-accent text-foreground hover:bg-accent/95"
          )}
          onClick={() => openSignUp()}
        >
          Get Started
        </Button>
      )}
    </div>
  );

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

const HighlightedBackground = () => (
  <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] bg-[size:45px_45px] opacity-100 dark:opacity-30" />
);

const PopularBackground = () => (
  <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(240,119,119,0.1),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(220,119,118,0.3),rgba(255,255,255,0))]" />
);
