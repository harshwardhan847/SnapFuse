"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Zap, CreditCard } from "lucide-react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const { user } = useUser();
  const [paymentType, setPaymentType] = useState<string | null>(null);

  const userCredits = useQuery(
    api.payments.getUserCredits,
    user ? { userId: user.id } : "skip"
  );

  useEffect(() => {
    const subscription = searchParams.get("subscription");
    const topup = searchParams.get("topup");

    if (subscription === "success") {
      setPaymentType("subscription");
    } else if (topup === "success") {
      setPaymentType("topup");
    }
  }, [searchParams]);

  if (!user) {
    return (
      <Suspense>
        <div className="container mx-auto px-4 py-16">
          <Card className="max-w-md mx-auto">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Please Sign In</h2>
              <p className="text-muted-foreground">
                You need to be signed in to view this page.
              </p>
            </CardContent>
          </Card>
        </div>
      </Suspense>
    );
  }

  return (
    <Suspense>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-4">Payment Successful!</h1>
            <p className="text-xl text-muted-foreground">
              {paymentType === "subscription"
                ? "Welcome to your new subscription plan!"
                : paymentType === "topup"
                  ? "Your credits have been added to your account!"
                  : "Your payment has been processed successfully!"}
            </p>
          </div>

          {userCredits && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center justify-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-500" />
                  Your Current Balance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-primary mb-2">
                  {userCredits.credits} Credits
                </div>
                <div className="text-sm text-muted-foreground">
                  Plan:{" "}
                  {userCredits.subscriptionPlan?.charAt(0).toUpperCase() +
                    userCredits.subscriptionPlan?.slice(1) || "Free"}
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Zap className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Start Creating</h3>
                    <p className="text-sm text-muted-foreground">
                      Use your credits to generate amazing content
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-100 rounded-full">
                    <CreditCard className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Manage Account</h3>
                    <p className="text-sm text-muted-foreground">
                      View usage and manage your subscription
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard/home">
              <Button size="lg" className="w-full sm:w-auto">
                Go to Dashboard
              </Button>
            </Link>
            <Link href="/pricing">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                View Pricing
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Suspense>
  );
}
