"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditsDisplay } from "@/components/credits/credits-display";
import {
  Zap,
  CreditCard,
  History,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { SUBSCRIPTION_PLANS } from "@/config/pricing";
import { api } from "../../../convex/_generated/api";

export function CreditsDashboard() {
  const { user } = useUser();

  const userCredits = useQuery(
    api.payments.getUserCredits,
    user ? { userId: user.id } : "skip"
  );

  const creditHistory = useQuery(
    api.payments.getCreditHistory,
    user ? { userId: user.id, limit: 10 } : "skip"
  );

  if (!user || !userCredits) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const currentPlan =
    SUBSCRIPTION_PLANS[
      userCredits.subscriptionPlan?.toUpperCase() as keyof typeof SUBSCRIPTION_PLANS
    ] || SUBSCRIPTION_PLANS.FREE;

  return (
    <div className="space-y-6">
      {/* Credits Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <CreditsDisplay showTopupButton={false} />

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-blue-500" />
              Current Plan
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{currentPlan.name}</div>
                <div className="text-xs text-muted-foreground">
                  {currentPlan.credits} credits/month
                </div>
              </div>
              <Badge
                variant={
                  userCredits.subscriptionPlan === "free"
                    ? "secondary"
                    : "default"
                }
              >
                {userCredits.subscriptionStatus || "Active"}
              </Badge>
            </div>
            {userCredits.subscriptionPlan === "free" && (
              <div className="mt-3">
                <Link href="/pricing">
                  <Button size="sm" className="w-full">
                    Upgrade Plan
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <History className="h-4 w-4 text-green-500" />
              This Month
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-bold">
              {creditHistory
                ?.filter(
                  (t: any) =>
                    t.createdAt > Date.now() - 30 * 24 * 60 * 60 * 1000 &&
                    t.type === "debit"
                )
                .reduce((sum: number, t: any) => sum + t.amount, 0) || 0}
            </div>
            <div className="text-xs text-muted-foreground">Credits used</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Recent Activity
          </CardTitle>
          <CardDescription>Your latest credit transactions</CardDescription>
        </CardHeader>
        <CardContent>
          {creditHistory && creditHistory.length > 0 ? (
            <div className="space-y-3">
              {creditHistory.slice(0, 8).map((transaction: any) => (
                <div
                  key={transaction._id}
                  className="flex items-center justify-between py-2 border-b last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-full ${
                        transaction.type === "credit"
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {transaction.type === "credit" ? (
                        <TrendingUp className="h-4 w-4" />
                      ) : (
                        <TrendingDown className="h-4 w-4" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium capitalize">
                        {transaction.reason.replace(/_/g, " ")}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {formatDistanceToNow(new Date(transaction.createdAt), {
                          addSuffix: true,
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className={`font-medium ${
                        transaction.type === "credit"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {transaction.type === "credit" ? "+" : "-"}
                      {transaction.amount}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Balance: {transaction.balanceAfter}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No transactions yet</p>
              <p className="text-sm">
                Start generating images or videos to see your activity here
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">Need More Credits?</h3>
                <p className="text-sm text-muted-foreground">
                  {userCredits.subscriptionPlan === "free"
                    ? "Upgrade to a paid plan for more credits"
                    : "Top up your account with additional credits"}
                </p>
              </div>
              <Link href="/pricing">
                <Button>
                  {userCredits.subscriptionPlan === "free"
                    ? "Upgrade"
                    : "Top Up"}
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <CreditCard className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">Manage Subscription</h3>
                <p className="text-sm text-muted-foreground">
                  View billing history and manage your plan
                </p>
              </div>
              <Button variant="outline">Manage</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
