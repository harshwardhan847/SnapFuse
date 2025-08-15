'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap, CreditCard, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useCredits } from '@/hooks/use-credits';
import { SUBSCRIPTION_PLANS, TOPUP_OPTIONS, canUserTopup } from '@/config/pricing';

interface InsufficientCreditsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  requiredCredits: number;
  action: string; // "image generation" or "video generation"
}

export function InsufficientCreditsModal({ 
  open, 
  onOpenChange, 
  requiredCredits, 
  action 
}: InsufficientCreditsModalProps) {
  const { credits, subscriptionPlan } = useCredits();
  const canTopup = canUserTopup(subscriptionPlan);

  const handleClose = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-500" />
            Insufficient Credits
          </DialogTitle>
          <DialogDescription>
            You need {requiredCredits} credit{requiredCredits > 1 ? 's' : ''} for {action}, but you only have {credits}.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {subscriptionPlan === 'free' ? (
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Upgrade Your Plan</CardTitle>
                <CardDescription>
                  Get more credits with a paid subscription plan
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Starter Plan</span>
                    <span className="text-sm text-muted-foreground">100 credits/month</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Pro Plan</span>
                    <span className="text-sm text-muted-foreground">250 credits/month</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-green-200 bg-green-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Buy More Credits</CardTitle>
                <CardDescription>
                  Top up your account with additional credits
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  {TOPUP_OPTIONS.slice(0, 2).map((topup) => (
                    <div key={topup.id} className="flex justify-between items-center">
                      <span className="font-medium">{topup.name}</span>
                      <span className="text-sm text-muted-foreground">${topup.price}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Link href="/pricing" className="w-full sm:w-auto">
            <Button className="w-full" onClick={handleClose}>
              {subscriptionPlan === 'free' ? (
                <>
                  <CreditCard className="mr-2 h-4 w-4" />
                  View Plans
                </>
              ) : (
                <>
                  <Zap className="mr-2 h-4 w-4" />
                  Buy Credits
                </>
              )}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}