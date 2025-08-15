"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";

import { PricingCard } from "@/components/pricing/pricing-card";
import { TopupCard } from "@/components/pricing/topup-card";
import {
  SUBSCRIPTION_PLANS,
  TOPUP_OPTIONS,
  canUserTopup,
} from "@/config/pricing";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Zap, CreditCard } from "lucide-react";
import { api } from "../../../convex/_generated/api";

export default function PricingPage() {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);

  const userCredits = useQuery(
    api.payments.getUserCredits,
    user ? { userId: user.id } : "skip"
  );

  const handleSubscribe = async (planId: string) => {
    setLoading(true);
    try {
      const response = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "subscription",
          planId,
        }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Subscription error:", error);
      toast.error("Failed to start subscription process");
    } finally {
      setLoading(false);
    }
  };

  const handleTopupPurchase = async (topupId: string) => {
    setLoading(true);
    try {
      const response = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "topup",
          topupId,
        }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Topup purchase error:", error);
      toast.error("Failed to start purchase process");
    } finally {
      setLoading(false);
    }
  };

  const currentPlan = userCredits?.subscriptionPlan || "free";
  const canTopup = canUserTopup(currentPlan);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Get started with our free plan or upgrade for more credits and
          features
        </p>

        {user && userCredits && (
          <Card className="max-w-md mx-auto mt-6">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <Zap className="h-5 w-5 text-yellow-500" />
                Your Credits
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-3xl font-bold text-primary">
                {userCredits.credits} Credits
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                Current Plan:{" "}
                {SUBSCRIPTION_PLANS[
                  currentPlan.toUpperCase() as keyof typeof SUBSCRIPTION_PLANS
                ]?.name || "Free"}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <Tabs defaultValue="plans" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
          <TabsTrigger value="plans" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Subscription Plans
          </TabsTrigger>
          <TabsTrigger value="topups" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Credit Top-ups
          </TabsTrigger>
        </TabsList>

        <TabsContent value="plans" className="mt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.values(SUBSCRIPTION_PLANS).map((plan) => (
              <PricingCard
                key={plan.id}
                plan={plan}
                currentPlan={currentPlan}
                onSubscribe={handleSubscribe}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="topups" className="mt-8">
          <div className="max-w-4xl mx-auto">
            {!canTopup && (
              <Card className="mb-6 border-yellow-200 bg-yellow-50">
                <CardHeader>
                  <CardTitle className="text-yellow-800">
                    Upgrade Required
                  </CardTitle>
                  <CardDescription className="text-yellow-700">
                    Credit top-ups are only available for paid subscription
                    plans. Upgrade to any paid plan to purchase additional
                    credits.
                  </CardDescription>
                </CardHeader>
              </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {TOPUP_OPTIONS.map((topup) => (
                <TopupCard
                  key={topup.id}
                  topup={topup}
                  onPurchase={handleTopupPurchase}
                  disabled={!canTopup}
                />
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Credit Usage</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Image Generation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">1 Credit</div>
              <p className="text-sm text-muted-foreground">
                Per image generated
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Video Generation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">5 Credits</div>
              <p className="text-sm text-muted-foreground">
                Per video generated
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
