import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher(["/"]);
const isApiRoute = createRouteMatcher(["/api(.*)"]);
const isOnboardingRoute = createRouteMatcher(["/onboarding"]);
const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/success",
  "/pricing",
  "/onboarding",
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();
  console.log(userId, req.url);

  if (isPublicRoute(req)) {
    if (userId) {
      // Redirect authenticated users from home page to dashboard
      // Onboarding check will be handled client-side in the dashboard layout
      return NextResponse.redirect(new URL("/dashboard/home", req.url));
    }
    return;
  }

  if (!userId && isApiRoute(req)) {
    return;
  }

  if (userId) {
    await auth.protect();

    // Allow access to onboarding route
    if (isOnboardingRoute(req)) {
      return;
    }

    // For dashboard routes, we'll handle onboarding check client-side
    // since middleware can't easily access Convex data

  } else if (isProtectedRoute(req)) {
    return NextResponse.redirect(new URL("/", req.url));
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
