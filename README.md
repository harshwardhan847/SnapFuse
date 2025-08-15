# SnapFuse - AI Image & Video Generation Platform

A Next.js application with Stripe payments, credit-based usage system, and AI-powered image/video generation.

## Features

- **Credit-based System**: Users get credits to generate images (1 credit) and videos (5 credits)
- **Subscription Plans**: Free, Starter, Pro, and Enterprise plans with different credit allocations
- **Credit Top-ups**: Additional credits for paid plan users
- **Stripe Integration**: Secure payment processing for subscriptions and one-time purchases
- **Real-time Updates**: Convex database with real-time credit tracking
- **User Authentication**: Clerk integration for secure user management

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Stripe account
- Convex account
- Clerk account

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Copy environment variables:

```bash
cp .env.example .env.local
```

4. Set up your environment variables (see Configuration section below)

5. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Configuration

### Environment Variables

Fill in your `.env.local` file with the following:

#### Convex
- `CONVEX_DEPLOYMENT`: Your Convex deployment URL
- `NEXT_PUBLIC_CONVEX_URL`: Your public Convex URL

#### Clerk Authentication  
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: Your Clerk publishable key
- `CLERK_SECRET_KEY`: Your Clerk secret key

#### Stripe
- `STRIPE_SECRET_KEY`: Your Stripe secret key
- `STRIPE_PUBLISHABLE_KEY`: Your Stripe publishable key  
- `STRIPE_WEBHOOK_SECRET`: Your Stripe webhook secret

#### Stripe Price IDs
Create products and prices in your Stripe dashboard for:
- `NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID`: Starter plan ($9.99/month)
- `NEXT_PUBLIC_STRIPE_PRO_PRICE_ID`: Pro plan ($19.99/month)  
- `NEXT_PUBLIC_STRIPE_ENTERPRISE_PRICE_ID`: Enterprise plan ($49.99/month)
- `NEXT_PUBLIC_STRIPE_TOPUP_50_PRICE_ID`: 50 credits ($4.99)
- `NEXT_PUBLIC_STRIPE_TOPUP_100_PRICE_ID`: 100 credits ($8.99)
- `NEXT_PUBLIC_STRIPE_TOPUP_250_PRICE_ID`: 250 credits ($19.99)
- `NEXT_PUBLIC_STRIPE_TOPUP_500_PRICE_ID`: 500 credits ($34.99)

### Stripe Setup

#### Option 1: Automated Setup (Recommended)
1. Create a Stripe account and get your API keys
2. Run the setup script:
```bash
STRIPE_SECRET_KEY=sk_test_... node scripts/setup-stripe-products.js
```
3. Copy the generated price IDs to your `.env.local` file
4. Set up webhook endpoint (see Option 2, step 4-5)

#### Option 2: Manual Setup
1. Create a Stripe account and get your API keys
2. Create products and recurring prices for subscription plans
3. Create one-time payment prices for credit top-ups
4. Set up a webhook endpoint pointing to `/api/stripe/webhooks`
5. Configure webhook events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_succeeded`

### Convex Setup

1. Create a Convex project
2. Deploy your schema: `npx convex deploy`
3. The schema includes tables for users, payments, credit transactions, images, and videos

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Credit System Architecture

### Plans & Pricing
- **Free Plan**: 10 credits/month, basic features
- **Starter Plan**: $9.99/month, 100 credits, priority support
- **Pro Plan**: $19.99/month, 250 credits, advanced features (Most Popular)
- **Enterprise Plan**: $49.99/month, 750 credits, all features

### Credit Costs
- **Image Generation**: 1 credit per image
- **Video Generation**: 5 credits per video

### Top-up Options (Paid Plans Only)
- 50 credits: $4.99
- 100 credits: $8.99 (Best Value)
- 250 credits: $19.99
- 500 credits: $34.99

## File Structure

```
src/
├── config/
│   └── pricing.ts              # All pricing constants and logic
├── hooks/
│   └── use-credits.ts          # Credit management hook
├── components/
│   ├── credits/
│   │   ├── credits-display.tsx
│   │   └── insufficient-credits-modal.tsx
│   ├── pricing/
│   │   ├── pricing-card.tsx
│   │   └── topup-card.tsx
│   ├── dashboard/
│   │   └── credits-dashboard.tsx
│   └── generation/
│       └── image-generator.tsx
├── app/
│   ├── pricing/
│   │   └── page.tsx
│   ├── dashboard/
│   │   └── page.tsx
│   └── api/stripe/
│       ├── create-checkout-session/
│       │   └── route.ts
│       └── webhooks/
│           └── route.ts
└── lib/
    └── stripe.ts               # Stripe configuration

convex/
├── schema.ts                   # Database schema with payment tables
├── payments.ts                 # Credit and payment functions
├── images.ts                   # Image generation with credit deduction
├── videos.ts                   # Video generation with credit deduction
└── users.ts                    # User management with credit initialization
```

## Key Features Implemented

### 1. Credit System
- Automatic credit deduction on image/video generation
- Real-time credit balance tracking
- Transaction history with detailed logs
- Insufficient credits handling with upgrade prompts

### 2. Stripe Integration
- Subscription management for recurring plans
- One-time payments for credit top-ups
- Webhook handling for payment events
- Secure checkout sessions

### 3. User Experience
- Credit display in navigation
- Insufficient credits modal with upgrade options
- Comprehensive dashboard with usage analytics
- Pricing page with plan comparison

### 4. Database Schema
- Users table with credit balance and subscription info
- Credit transactions table for audit trail
- Payments table for Stripe integration
- Existing images/videos tables enhanced with credit checks

## Usage Examples

### Check Credits Before Generation
```typescript
const { canAfford, deductCreditsForAction } = useCredits();

if (!canAfford('IMAGE_GENERATION')) {
  // Show insufficient credits modal
  return;
}

// Proceed with generation
await deductCreditsForAction('IMAGE_GENERATION', imageId);
```

### Display User Credits
```typescript
import { CreditsDisplay } from '@/components/credits/credits-display';

<CreditsDisplay showTopupButton={true} />
```

### Handle Payments
```typescript
// Create checkout session
const response = await fetch('/api/stripe/create-checkout-session', {
  method: 'POST',
  body: JSON.stringify({
    type: 'subscription', // or 'topup'
    planId: 'pro',
  }),
});
```

## Deployment Checklist

1. **Environment Variables**: Set all required environment variables
2. **Stripe Setup**: Create products, prices, and webhook endpoint
3. **Convex Deployment**: Deploy schema and functions
4. **Clerk Configuration**: Set up authentication
5. **Domain Configuration**: Update APP_BASE_URL
6. **Webhook Testing**: Test Stripe webhook integration

## Customization

To modify pricing or credit costs, edit `src/config/pricing.ts`:

```typescript
export const CREDIT_COSTS = {
  IMAGE_GENERATION: 2, // Change to 2 credits per image
  VIDEO_GENERATION: 10, // Change to 10 credits per video
} as const;
```

All pricing logic will automatically update throughout the application.

## Security Considerations

- Credit deduction happens server-side in Convex functions
- Stripe webhooks verify payment authenticity
- User authentication required for all credit operations
- Transaction logging for audit trails
- Input validation on all payment endpoints

## Support

For issues or questions:
1. Check the environment variables are correctly set
2. Verify Stripe webhook configuration
3. Test Convex function deployment
4. Review browser console for client-side errors



# Stripe Test card-
4000003560000008