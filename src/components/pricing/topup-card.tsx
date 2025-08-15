'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Zap } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import { toast } from 'sonner';

interface TopupCardProps {
  topup: {
    id: string;
    name: string;
    credits: number;
    price: number;
    priceId: string;
    popular?: boolean;
  };
  onPurchase?: (topupId: string) => Promise<void>;
  disabled?: boolean;
}

export function TopupCard({ topup, onPurchase, disabled }: TopupCardProps) {
  const [loading, setLoading] = useState(false);
  const { user } = useUser();

  const handlePurchase = async () => {
    if (!user) {
      toast.error('Please sign in to purchase credits');
      return;
    }

    if (disabled) {
      toast.error('Credit top-ups are only available for paid plans');
      return;
    }

    setLoading(true);
    try {
      if (onPurchase) {
        await onPurchase(topup.id);
      }
    } catch (error) {
      console.error('Purchase error:', error);
      toast.error('Failed to purchase credits');
    } finally {
      setLoading(false);
    }
  };

  const pricePerCredit = (topup.price / topup.credits).toFixed(3);

  return (
    <Card className={`relative ${topup.popular ? 'border-primary shadow-md' : ''}`}>
      {topup.popular && (
        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
          <span className="bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs font-medium">
            Best Value
          </span>
        </div>
      )}
      
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <Zap className="h-5 w-5 text-yellow-500" />
          {topup.name}
        </CardTitle>
        <CardDescription>
          ${pricePerCredit} per credit
        </CardDescription>
        <div className="mt-2">
          <span className="text-3xl font-bold">${topup.price}</span>
        </div>
      </CardHeader>
      
      <CardContent className="text-center">
        <div className="text-2xl font-semibold text-primary">
          {topup.credits} Credits
        </div>
        <div className="text-sm text-muted-foreground mt-1">
          Generate {topup.credits} images or {Math.floor(topup.credits / 5)} videos
        </div>
      </CardContent>
      
      <CardFooter>
        <Button
          className="w-full"
          variant={topup.popular ? 'default' : 'outline'}
          onClick={handlePurchase}
          disabled={loading || disabled}
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {disabled ? 'Upgrade Required' : 'Purchase Credits'}
        </Button>
      </CardFooter>
    </Card>
  );
}