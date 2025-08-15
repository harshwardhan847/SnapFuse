'use client';

import Link from 'next/link';
import { useUser, UserButton } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { CreditsDisplay } from '@/components/credits/credits-display';
import { Zap } from 'lucide-react';

export function Navbar() {
  const { user, isLoaded } = useUser();

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl">
              <Zap className="h-6 w-6 text-primary" />
              SnapFuse
            </Link>
            
            {user && (
              <div className="hidden md:flex items-center gap-4">
                <Link href="/dashboard">
                  <Button variant="ghost">Dashboard</Button>
                </Link>
                <Link href="/pricing">
                  <Button variant="ghost">Pricing</Button>
                </Link>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            {isLoaded && user && (
              <div className="hidden sm:block">
                <CreditsDisplay showTopupButton={false} className="w-48" />
              </div>
            )}
            
            {isLoaded ? (
              user ? (
                <UserButton afterSignOutUrl="/" />
              ) : (
                <div className="flex items-center gap-2">
                  <Link href="/sign-in">
                    <Button variant="ghost">Sign In</Button>
                  </Link>
                  <Link href="/sign-up">
                    <Button>Sign Up</Button>
                  </Link>
                </div>
              )
            ) : (
              <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}