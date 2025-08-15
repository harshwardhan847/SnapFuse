/**
 * Utility functions for subscription management
 */

export function isSubscriptionActive(
  subscriptionStatus?: string,
  subscriptionPeriodEnd?: number
): boolean {
  if (!subscriptionStatus) return false;
  
  const now = Date.now() / 1000; // Convert to seconds for Stripe timestamp comparison
  
  // Active statuses
  if (['active', 'trialing'].includes(subscriptionStatus)) {
    return true;
  }
  
  // Grace period for past_due subscriptions (7 days)
  if (subscriptionStatus === 'past_due' && subscriptionPeriodEnd) {
    const gracePeriodEnd = subscriptionPeriodEnd + (7 * 24 * 60 * 60); // 7 days in seconds
    return now < gracePeriodEnd;
  }
  
  // Canceled but still in current period
  if (subscriptionStatus === 'canceled' && subscriptionPeriodEnd) {
    return now < subscriptionPeriodEnd;
  }
  
  return false;
}

export function getSubscriptionStatusMessage(
  subscriptionStatus?: string,
  subscriptionPeriodEnd?: number
): string {
  if (!subscriptionStatus) return 'No active subscription';
  
  const now = Date.now() / 1000;
  const endDate = subscriptionPeriodEnd ? new Date(subscriptionPeriodEnd * 1000) : null;
  
  switch (subscriptionStatus) {
    case 'active':
      return endDate ? `Active until ${endDate.toLocaleDateString()}` : 'Active';
    
    case 'trialing':
      return endDate ? `Trial ends ${endDate.toLocaleDateString()}` : 'Trial active';
    
    case 'past_due':
      return 'Payment failed - please update your payment method';
    
    case 'canceled':
      if (endDate && now < subscriptionPeriodEnd!) {
        return `Canceled - access until ${endDate.toLocaleDateString()}`;
      }
      return 'Subscription canceled';
    
    case 'unpaid':
      return 'Payment required to continue service';
    
    case 'incomplete':
      return 'Payment incomplete - please complete payment';
    
    case 'incomplete_expired':
      return 'Payment expired - please subscribe again';
    
    default:
      return `Status: ${subscriptionStatus}`;
  }
}

export function shouldAllowFeatureAccess(
  subscriptionPlan: string,
  subscriptionStatus?: string,
  subscriptionPeriodEnd?: number
): boolean {
  // Free plan always has access to free features
  if (subscriptionPlan === 'free') return true;
  
  // Paid plans need active subscription
  return isSubscriptionActive(subscriptionStatus, subscriptionPeriodEnd);
}