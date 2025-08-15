'use client';

import { useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Navbar } from '@/components/navigation/navbar';
import { Zap, Image, Video, CreditCard, Check, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { SUBSCRIPTION_PLANS, CREDIT_COSTS } from '@/config/pricing';

export default function Home() {
  const { user } = useUser();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <Badge className="mb-4" variant="secondary">
            AI-Powered Content Generation
          </Badge>
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Create Amazing Images & Videos with AI
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Transform your ideas into stunning visuals using our credit-based AI generation platform. 
            Start free, upgrade when you need more.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <Link href="/dashboard">
                <Button size="lg" className="text-lg px-8">
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/sign-up">
                  <Button size="lg" className="text-lg px-8">
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/pricing">
                  <Button size="lg" variant="outline" className="text-lg px-8">
                    View Pricing
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">How It Works</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Simple credit-based system. Use credits to generate content, top up when you need more.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto mb-4 p-3 bg-blue-100 rounded-full w-fit">
                <Image className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle>Generate Images</CardTitle>
              <CardDescription>
                Create stunning AI images from text prompts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Zap className="h-4 w-4 text-yellow-500" />
                {CREDIT_COSTS.IMAGE_GENERATION} credit per image
              </div>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto mb-4 p-3 bg-purple-100 rounded-full w-fit">
                <Video className="h-8 w-8 text-purple-600" />
              </div>
              <CardTitle>Generate Videos</CardTitle>
              <CardDescription>
                Create AI videos from your descriptions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Zap className="h-4 w-4 text-yellow-500" />
                {CREDIT_COSTS.VIDEO_GENERATION} credits per video
              </div>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto mb-4 p-3 bg-green-100 rounded-full w-fit">
                <CreditCard className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle>Flexible Pricing</CardTitle>
              <CardDescription>
                Pay only for what you use with our credit system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                Start free, upgrade anytime
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="container mx-auto px-4 py-16 bg-white/50 rounded-3xl mx-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Simple, Transparent Pricing</h2>
          <p className="text-muted-foreground">
            Choose the plan that fits your needs. Upgrade or downgrade anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {Object.values(SUBSCRIPTION_PLANS).map((plan) => (
            <Card key={plan.id} className={`relative ${plan.popular ? 'border-primary shadow-lg scale-105' : ''}`}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground">
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center">
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <div className="mt-2">
                  <span className="text-3xl font-bold">${plan.price}</span>
                  {plan.price > 0 && <span className="text-muted-foreground">/month</span>}
                </div>
                <CardDescription>{plan.credits} credits included</CardDescription>
              </CardHeader>
              
              <CardContent>
                <ul className="space-y-2">
                  {plan.features.slice(0, 3).map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link href="/pricing">
            <Button size="lg" variant="outline">
              View All Plans & Features
            </Button>
          </Link>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-muted-foreground mb-8">
            Join thousands of creators using AI to bring their ideas to life.
          </p>
          
          {user ? (
            <Link href="/dashboard">
              <Button size="lg" className="text-lg px-8">
                Go to Dashboard
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          ) : (
            <Link href="/sign-up">
              <Button size="lg" className="text-lg px-8">
                Start Creating for Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}
